import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";

/** IDs de módulos completados por un alumno en un curso. */
export async function getProgreso(
  alumnoId: string,
  cursoId: string
): Promise<Set<string>> {
  const rows = await db
    .select({ moduloId: schema.progresoModulo.moduloId })
    .from(schema.progresoModulo)
    .where(
      and(
        eq(schema.progresoModulo.alumnoId, alumnoId),
        eq(schema.progresoModulo.cursoId, cursoId)
      )
    );
  return new Set(rows.map((r) => r.moduloId));
}

export async function estaCompletado(
  alumnoId: string,
  moduloId: string
): Promise<boolean> {
  const rows = await db
    .select({ moduloId: schema.progresoModulo.moduloId })
    .from(schema.progresoModulo)
    .where(
      and(
        eq(schema.progresoModulo.alumnoId, alumnoId),
        eq(schema.progresoModulo.moduloId, moduloId)
      )
    )
    .limit(1);
  return rows.length > 0;
}

/**
 * Marca un módulo como completado (idempotente, nunca lo des-marca).
 * Se usa para el auto-completado al terminar el video.
 */
export async function marcarCompletado({
  alumnoId,
  cursoId,
  moduloId,
}: {
  alumnoId: string;
  cursoId: string;
  moduloId: string;
}): Promise<void> {
  await db
    .insert(schema.progresoModulo)
    .values({ alumnoId, cursoId, moduloId })
    .onConflictDoNothing();
}

/**
 * Alterna el estado "completado" de un módulo. Devuelve el nuevo estado.
 */
export async function toggleCompletado({
  alumnoId,
  cursoId,
  moduloId,
}: {
  alumnoId: string;
  cursoId: string;
  moduloId: string;
}): Promise<boolean> {
  const yaEsta = await estaCompletado(alumnoId, moduloId);
  if (yaEsta) {
    await db
      .delete(schema.progresoModulo)
      .where(
        and(
          eq(schema.progresoModulo.alumnoId, alumnoId),
          eq(schema.progresoModulo.moduloId, moduloId)
        )
      );
    return false;
  }
  await db
    .insert(schema.progresoModulo)
    .values({ alumnoId, cursoId, moduloId })
    .onConflictDoNothing();
  return true;
}
