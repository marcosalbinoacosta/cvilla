import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { grantAccess } from "@/lib/access";

export type ReconcileResult =
  | { status: "approved" }
  | { status: "pending" }
  | { status: "rejected" | "cancelled" | "refunded" }
  | { status: "not_found" };

/**
 * Red de seguridad del webhook: dado el id de una compra, consulta a Mercado
 * Pago los pagos asociados (por external_reference) y, si hay uno aprobado,
 * actualiza la compra y grantea el acceso. Idempotente.
 *
 * Se usa desde /comprar/gracias para no depender de que el webhook llegue a
 * tiempo (en sandbox puede demorar).
 */
export async function reconcileCompra(compraId: string): Promise<ReconcileResult> {
  const rows = await db
    .select()
    .from(schema.compras)
    .where(eq(schema.compras.id, compraId))
    .limit(1);
  const compra = rows[0];
  if (!compra) return { status: "not_found" };

  // Ya estaba aprobada: aseguramos el acceso (idempotente) y salimos.
  if (compra.status === "approved") {
    await grantAccess({
      userId: compra.userId,
      productoId: compra.productoId,
      compraId: compra.id,
    });
    return { status: "approved" };
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return { status: "pending" };

  let approvedPaymentId: string | null = null;
  try {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(
        compraId
      )}&sort=date_created&criteria=desc`,
      { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }
    );
    if (!res.ok) return { status: "pending" };
    const data = (await res.json()) as {
      results?: Array<{ id: number | string; status: string }>;
    };
    const results = data.results ?? [];
    const approved = results.find((p) => p.status === "approved");
    if (approved) approvedPaymentId = String(approved.id);
    else if (results.length === 0) return { status: "pending" };
  } catch {
    return { status: "pending" };
  }

  if (!approvedPaymentId) {
    // Hay pagos pero ninguno aprobado todavía.
    return { status: "pending" };
  }

  await db
    .update(schema.compras)
    .set({ status: "approved", mpPaymentId: approvedPaymentId, updatedAt: new Date() })
    .where(eq(schema.compras.id, compra.id));

  await grantAccess({
    userId: compra.userId,
    productoId: compra.productoId,
    compraId: compra.id,
  });

  return { status: "approved" };
}
