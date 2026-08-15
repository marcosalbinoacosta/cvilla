import { z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { getCursoBySlug } from "@/sanity/queries";
import { validarCupon } from "@/lib/cupones";

export const runtime = "nodejs";

const Schema = z.object({
  codigo: z.string().trim().min(1).max(40),
  productoSlug: z.string().trim().min(1).max(64),
});

type CursoPrecio = { precio: number; currency?: string };

/** Previsualiza un cupón: valida el código y devuelve el precio con descuento. */
export async function POST(request: NextRequest) {
  const parsed = Schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }
  const { codigo, productoSlug } = parsed.data;

  const curso = (await getCursoBySlug(productoSlug)) as CursoPrecio | null;
  if (!curso) {
    return NextResponse.json({ ok: false, error: "Producto no encontrado" }, { status: 404 });
  }

  const resultado = await validarCupon({
    codigo,
    cursoSlug: productoSlug,
    precio: curso.precio,
  });

  if (!resultado.ok) {
    return NextResponse.json({ ok: false, error: resultado.error });
  }

  const { cupon } = resultado;
  return NextResponse.json({
    ok: true,
    codigo: cupon.codigo,
    tipo: cupon.tipo,
    valor: cupon.valor,
    descuento: cupon.descuentoPesos,
    precioOriginal: curso.precio,
    precioFinal: cupon.precioFinal,
    currency: curso.currency ?? "ARS",
  });
}
