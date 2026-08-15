import { getCuponByCodigo } from "@/sanity/queries";

export type CuponAplicado = {
  codigo: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
  descuentoPesos: number;
  precioFinal: number; // en pesos, sin centavos
};

export type ValidacionCupon =
  | { ok: true; cupon: CuponAplicado }
  | { ok: false; error: string };

type CuponDoc = {
  codigo?: string;
  tipo?: "porcentaje" | "fijo";
  valor?: number;
  activo?: boolean;
  vencimiento?: string | null;
  cursos?: Array<string | null> | null;
};

/**
 * Valida un código de cupón contra un curso/precio y calcula el descuento.
 * Los precios se manejan en pesos enteros (igual que `curso.precio` en Sanity).
 * Se usa tanto en el endpoint de previsualización como en el checkout, para
 * que la validación sea idéntica en los dos lados.
 */
export async function validarCupon({
  codigo,
  cursoSlug,
  precio,
}: {
  codigo: string;
  cursoSlug: string;
  precio: number;
}): Promise<ValidacionCupon> {
  const limpio = codigo.trim();
  if (!limpio) return { ok: false, error: "Ingresá un código." };

  const cupon = (await getCuponByCodigo(limpio)) as CuponDoc | null;
  if (!cupon || !cupon.tipo || typeof cupon.valor !== "number") {
    return { ok: false, error: "El cupón no existe." };
  }
  if (cupon.activo === false) {
    return { ok: false, error: "Este cupón no está activo." };
  }
  if (cupon.vencimiento) {
    // `vencimiento` es una fecha (YYYY-MM-DD); vale hasta el final de ese día (hora AR).
    const vence = new Date(`${cupon.vencimiento}T23:59:59-03:00`);
    if (!Number.isNaN(vence.getTime()) && Date.now() > vence.getTime()) {
      return { ok: false, error: "Este cupón está vencido." };
    }
  }

  const cursos = (cupon.cursos ?? []).filter(Boolean) as string[];
  if (cursos.length > 0 && !cursos.includes(cursoSlug)) {
    return { ok: false, error: "El cupón no aplica a este curso." };
  }

  let descuento =
    cupon.tipo === "porcentaje"
      ? Math.round((precio * cupon.valor) / 100)
      : Math.round(cupon.valor);
  if (descuento < 0) descuento = 0;
  if (descuento > precio) descuento = precio;

  const precioFinal = precio - descuento;
  // Mercado Pago exige un monto mayor a cero.
  if (precioFinal < 1) {
    return {
      ok: false,
      error: "El descuento no puede dejar el precio en cero.",
    };
  }

  return {
    ok: true,
    cupon: {
      codigo: cupon.codigo ?? limpio.toUpperCase(),
      tipo: cupon.tipo,
      valor: cupon.valor,
      descuentoPesos: descuento,
      precioFinal,
    },
  };
}
