/**
 * Identificación de administradores (Catalina y quien ella designe).
 *
 * Se configura con la env `ADMIN_EMAILS`: lista de emails separados por coma.
 * Ej: ADMIN_EMAILS="hola@catalinavilla.ar, catalina@gmail.com"
 *
 * Un admin ve la bandeja de mensajes de TODOS los alumnos y responde como
 * "Catalina". Un alumno normal solo ve su propio hilo.
 */
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}
