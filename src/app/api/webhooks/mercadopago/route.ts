import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db, schema } from "@/db";
import { grantAccess } from "@/lib/access";
import { sendWelcomeEmail } from "@/lib/email";
import { getCursoBySlug } from "@/sanity/queries";

export const runtime = "nodejs";

/**
 * Verifica la firma HMAC-SHA256 que Mercado Pago envía en `x-signature`.
 * Formato del header: "ts=1700000000,v1=abcd1234..."
 * Manifest: `id:{dataId};request-id:{xRequestId};ts:{ts};`
 * Si `MP_WEBHOOK_SECRET` no está seteado devuelve true (dev) con warning.
 */
function verifySignature({
  signatureHeader,
  requestId,
  dataId,
}: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[mp-webhook] MP_WEBHOOK_SECRET no seteado en producción — bloqueando.");
      return false;
    }
    console.warn("[mp-webhook] MP_WEBHOOK_SECRET no seteado — saltando verificación (solo dev).");
    return true;
  }
  if (!signatureHeader || !requestId || !dataId) return false;

  const parts = signatureHeader.split(",").map((p) => p.trim());
  const ts = parts.find((p) => p.startsWith("ts="))?.slice(3);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  // Mercado Pago manda información en query string + body. Normalizamos.
  const topic = url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  let bodyJson: Record<string, unknown> = {};
  try {
    bodyJson = await request.json();
  } catch {
    // algunos webhooks (merchant_order) vienen con body vacío.
  }

  const resolvedId =
    dataId ??
    (typeof bodyJson.data === "object" && bodyJson.data !== null
      ? String((bodyJson.data as { id?: string | number }).id ?? "")
      : "");
  const resolvedType = topic ?? String(bodyJson.type ?? bodyJson.topic ?? "");

  const signatureOk = verifySignature({
    signatureHeader: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId: resolvedId || null,
  });

  if (!signatureOk) {
    console.warn("[mp-webhook] firma inválida");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (resolvedType !== "payment" || !resolvedId) {
    // Ignoramos merchant_order y otros tópicos por ahora.
    return NextResponse.json({ ok: true, ignored: resolvedType });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[mp-webhook] MP_ACCESS_TOKEN no configurado");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const mp = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(mp);

  let paymentData: Awaited<ReturnType<typeof payment.get>>;
  try {
    paymentData = await payment.get({ id: resolvedId });
  } catch (err) {
    console.error("[mp-webhook] error consultando payment", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const externalReference = paymentData.external_reference;
  const status = paymentData.status; // approved | rejected | in_process | refunded | cancelled | ...
  const paymentId = String(paymentData.id ?? resolvedId);

  if (!externalReference) {
    console.warn("[mp-webhook] payment sin external_reference", paymentId);
    return NextResponse.json({ ok: true, ignored: "no-external-ref" });
  }

  const rows = await db
    .select()
    .from(schema.compras)
    .where(eq(schema.compras.id, externalReference))
    .limit(1);
  const compra = rows[0];
  if (!compra) {
    console.warn("[mp-webhook] compra no encontrada", externalReference);
    return NextResponse.json({ ok: true, ignored: "compra-not-found" });
  }

  // MP manda varias notificaciones por pago; solo la primera transición a
  // "approved" debe disparar el email de bienvenida (grantAccess es idempotente).
  const yaEstabaAprobada = compra.status === "approved";

  await db
    .update(schema.compras)
    .set({
      status: status ?? compra.status,
      mpPaymentId: paymentId,
      updatedAt: new Date(),
    })
    .where(eq(schema.compras.id, compra.id));

  if (status === "approved") {
    await grantAccess({
      userId: compra.userId,
      productoId: compra.productoId,
      compraId: compra.id,
    });

    if (yaEstabaAprobada) {
      // Ya se había procesado antes: acceso asegurado, no reenviamos email.
      return NextResponse.json({ ok: true, already: true });
    }

    const userRows = await db
      .select({ email: schema.users.email, name: schema.users.name })
      .from(schema.users)
      .where(eq(schema.users.id, compra.userId))
      .limit(1);
    const user = userRows[0];

    if (user?.email) {
      const curso = (await getCursoBySlug(compra.productoId)) as
        | { titulo: string }
        | null;
      await sendWelcomeEmail({
        to: user.email,
        nombre: user.name,
        cursoTitulo: curso?.titulo ?? "tu programa",
      });
    }
  }

  return NextResponse.json({ ok: true });
}

// MP también hace GET de verificación en algunos setups.
export async function GET() {
  return NextResponse.json({ ok: true });
}
