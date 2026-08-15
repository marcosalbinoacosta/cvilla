import { z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getCursoBySlug } from "@/sanity/queries";
import { validarCupon } from "@/lib/cupones";

export const runtime = "nodejs";

const CheckoutSchema = z.object({
  productoSlug: z.string().min(1).max(64),
  nombre: z.string().trim().min(2).max(80),
  // Normalizamos a minúsculas: NextAuth loguea con el email en minúsculas, así
  // que si acá guardáramos "MAIL@X.COM" quedarían dos usuarios distintos.
  email: z.string().trim().toLowerCase().email().max(120),
  cupon: z.string().trim().max(40).optional(),
});

type CursoSummary = {
  titulo: string;
  descripcion?: string;
  precio: number;
  currency: string;
};

async function readInput(request: NextRequest) {
  const ct = request.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    return request.json();
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(request: NextRequest) {
  const input = await readInput(request);
  const parsed = CheckoutSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }
  const { productoSlug, nombre, email, cupon } = parsed.data;

  const accessToken = process.env.MP_ACCESS_TOKEN;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!accessToken) {
    console.error("[checkout] MP_ACCESS_TOKEN no configurado");
    return NextResponse.json(
      { ok: false, error: "La pasarela de pagos no está configurada" },
      { status: 500 }
    );
  }

  const curso = (await getCursoBySlug(productoSlug)) as CursoSummary | null;
  if (!curso) {
    return NextResponse.json(
      { ok: false, error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  // Aplicar cupón de descuento (opcional). Se revalida en el server: nunca
  // confiamos en el precio que pueda venir del cliente.
  let precioFinal = curso.precio;
  let cuponCodigo: string | null = null;
  if (cupon) {
    const validacion = await validarCupon({
      codigo: cupon,
      cursoSlug: productoSlug,
      precio: curso.precio,
    });
    if (!validacion.ok) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      );
    }
    precioFinal = validacion.cupon.precioFinal;
    cuponCodigo = validacion.cupon.codigo;
  }

  // Get-or-create user by email (minimal — no passwords, magic link auth).
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  let userId = existing[0]?.id;
  if (!userId) {
    const inserted = await db
      .insert(schema.users)
      .values({ email, name: nombre })
      .returning({ id: schema.users.id });
    userId = inserted[0]?.id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "No pudimos crear tu cuenta" },
        { status: 500 }
      );
    }
  }

  // Create pending purchase row first — referenced by MP external_reference.
  const [compra] = await db
    .insert(schema.compras)
    .values({
      userId,
      productoId: productoSlug,
      status: "pending",
      montoCentavos: Math.round(precioFinal * 100),
      currency: curso.currency ?? "ARS",
      cuponCodigo,
    })
    .returning({ id: schema.compras.id });

  if (!compra) {
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar la compra" },
      { status: 500 }
    );
  }

  const mp = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(mp);

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: productoSlug,
            title: curso.titulo,
            description: curso.descripcion ?? undefined,
            quantity: 1,
            unit_price: precioFinal,
            currency_id: curso.currency ?? "ARS",
          },
        ],
        payer: { email, name: nombre },
        external_reference: compra.id,
        back_urls: {
          success: `${siteUrl}/comprar/gracias?compra=${compra.id}`,
          failure: `${siteUrl}/comprar/error?compra=${compra.id}`,
          pending: `${siteUrl}/comprar/pendiente?compra=${compra.id}`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        metadata: { compraId: compra.id, userId, productoSlug },
      },
    });

    const initPoint = result.init_point;
    if (!initPoint) {
      throw new Error("init_point no devuelto por Mercado Pago");
    }

    await db
      .update(schema.compras)
      .set({ mpPreferenceId: result.id, updatedAt: new Date() })
      .where(eq(schema.compras.id, compra.id));

    return NextResponse.json({ ok: true, checkoutUrl: initPoint });
  } catch (err) {
    console.error("[checkout] MP preference error", err);
    return NextResponse.json(
      { ok: false, error: "No pudimos iniciar el pago. Probá de nuevo." },
      { status: 502 }
    );
  }
}
