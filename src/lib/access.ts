import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export async function userHasAccess(userId: string, productoId: string): Promise<boolean> {
  const rows = await db
    .select({ activo: schema.accesosCurso.activo, expiresAt: schema.accesosCurso.expiresAt })
    .from(schema.accesosCurso)
    .where(
      and(
        eq(schema.accesosCurso.userId, userId),
        eq(schema.accesosCurso.productoId, productoId)
      )
    )
    .limit(1);

  const row = rows[0];
  if (!row || !row.activo) return false;
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return false;
  return true;
}

export async function grantAccess({
  userId,
  productoId,
  compraId,
  expiresAt,
}: {
  userId: string;
  productoId: string;
  compraId?: string;
  expiresAt?: Date;
}) {
  await db
    .insert(schema.accesosCurso)
    .values({ userId, productoId, compraId, expiresAt, activo: true })
    .onConflictDoUpdate({
      target: [schema.accesosCurso.userId, schema.accesosCurso.productoId],
      set: { activo: true, compraId, expiresAt },
    });
}
