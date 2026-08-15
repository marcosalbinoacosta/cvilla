"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { userHasAccess } from "@/lib/access";
import { postMensaje, marcarHiloLeido } from "@/lib/mensajes";
import { toggleCompletado, marcarCompletado } from "@/lib/progreso";

export type EnviarState = { ok: boolean; error?: string };

/**
 * Publica un comentario/mensaje en un hilo (alumno + módulo).
 * - Alumno: escribe en su propio hilo (requiere acceso al curso).
 * - Admin (Catalina): responde en el hilo de un alumno (recibe `alumnoId`).
 */
export async function enviarMensaje(
  _prev: EnviarState,
  formData: FormData
): Promise<EnviarState> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: "Tenés que iniciar sesión." };
  }

  const cuerpo = String(formData.get("cuerpo") ?? "").trim();
  const cursoId = String(formData.get("cursoId") ?? "").trim();
  const moduloId = String(formData.get("moduloId") ?? "").trim();
  const moduloSlug = String(formData.get("moduloSlug") ?? "").trim() || null;
  const moduloTitulo =
    String(formData.get("moduloTitulo") ?? "").trim() || null;
  const alumnoIdInput = String(formData.get("alumnoId") ?? "").trim();

  if (!cuerpo) return { ok: false, error: "Escribí un mensaje." };
  if (cuerpo.length > 4000)
    return { ok: false, error: "El mensaje es demasiado largo." };
  if (!cursoId || !moduloId)
    return { ok: false, error: "Falta el módulo de referencia." };

  const admin = isAdmin(session.user.email);
  const alumnoId = admin ? alumnoIdInput : session.user.id;

  if (!alumnoId) return { ok: false, error: "No se pudo identificar el hilo." };

  // El alumno solo puede escribir en su propio hilo y con acceso al curso.
  if (!admin) {
    const tieneAcceso = await userHasAccess(session.user.id, cursoId);
    if (!tieneAcceso) return { ok: false, error: "No tenés acceso a este curso." };
  }

  await postMensaje({
    alumnoId,
    autorId: session.user.id,
    cursoId,
    moduloId,
    moduloSlug,
    moduloTitulo,
    cuerpo,
    deAdmin: admin,
  });

  if (moduloSlug) revalidatePath(`/aula/${cursoId}/${moduloSlug}`);
  revalidatePath("/aula/mensajes");
  return { ok: true };
}

/**
 * Marca los mensajes del otro interlocutor como leídos al abrir el hilo.
 * Lo invoca el componente de comentarios del alumno al montarse.
 */
export async function marcarLeido(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return;
  const moduloId = String(formData.get("moduloId") ?? "").trim();
  if (!moduloId) return;
  await marcarHiloLeido({
    alumnoId: session.user.id,
    moduloId,
    porAdmin: isAdmin(session.user.email),
  });
}

/**
 * Marca un módulo como completado automáticamente (al terminar el video).
 * Idempotente: nunca des-marca. Devuelve true si quedó completado.
 */
export async function marcarModuloCompletadoAuto(
  formData: FormData
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const cursoId = String(formData.get("cursoId") ?? "").trim();
  const moduloId = String(formData.get("moduloId") ?? "").trim();
  const moduloSlug = String(formData.get("moduloSlug") ?? "").trim();
  if (!cursoId || !moduloId) return { ok: false };

  const tieneAcceso = await userHasAccess(session.user.id, cursoId);
  if (!tieneAcceso) return { ok: false };

  await marcarCompletado({ alumnoId: session.user.id, cursoId, moduloId });

  revalidatePath("/aula");
  revalidatePath(`/aula/${cursoId}`);
  if (moduloSlug) revalidatePath(`/aula/${cursoId}/${moduloSlug}`);
  return { ok: true };
}

/** Alterna el estado "completado" de un módulo para el alumno logueado. */
export async function toggleModuloCompletado(
  formData: FormData
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const cursoId = String(formData.get("cursoId") ?? "").trim();
  const moduloId = String(formData.get("moduloId") ?? "").trim();
  const moduloSlug = String(formData.get("moduloSlug") ?? "").trim();
  if (!cursoId || !moduloId) return;

  const tieneAcceso = await userHasAccess(session.user.id, cursoId);
  if (!tieneAcceso) return;

  await toggleCompletado({ alumnoId: session.user.id, cursoId, moduloId });

  revalidatePath("/aula");
  revalidatePath(`/aula/${cursoId}`);
  if (moduloSlug) revalidatePath(`/aula/${cursoId}/${moduloSlug}`);
}
