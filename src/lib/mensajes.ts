import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";

export type Mensaje = {
  id: string;
  autorId: string;
  cuerpo: string;
  deAdmin: boolean;
  createdAt: Date;
};

/**
 * Todos los mensajes de un hilo (alumno + módulo), en orden cronológico.
 */
export async function getThread({
  alumnoId,
  moduloId,
}: {
  alumnoId: string;
  moduloId: string;
}): Promise<Mensaje[]> {
  return db
    .select({
      id: schema.mensajes.id,
      autorId: schema.mensajes.autorId,
      cuerpo: schema.mensajes.cuerpo,
      deAdmin: schema.mensajes.deAdmin,
      createdAt: schema.mensajes.createdAt,
    })
    .from(schema.mensajes)
    .where(
      and(
        eq(schema.mensajes.alumnoId, alumnoId),
        eq(schema.mensajes.moduloId, moduloId)
      )
    )
    .orderBy(asc(schema.mensajes.createdAt));
}

export async function postMensaje(input: {
  alumnoId: string;
  autorId: string;
  cursoId: string;
  moduloId: string;
  moduloSlug?: string | null;
  moduloTitulo?: string | null;
  cuerpo: string;
  deAdmin: boolean;
}) {
  await db.insert(schema.mensajes).values({
    alumnoId: input.alumnoId,
    autorId: input.autorId,
    cursoId: input.cursoId,
    moduloId: input.moduloId,
    moduloSlug: input.moduloSlug ?? null,
    moduloTitulo: input.moduloTitulo ?? null,
    cuerpo: input.cuerpo,
    deAdmin: input.deAdmin,
    // El autor ya "leyó" lo que escribió.
    leidoPorAlumno: !input.deAdmin,
    leidoPorAdmin: input.deAdmin,
  });
}

/**
 * Marca como leídos los mensajes del OTRO interlocutor en un hilo.
 * `porAdmin=true` → el admin abrió el hilo, marca los mensajes del alumno.
 * `porAdmin=false` → el alumno abrió el hilo, marca los mensajes del admin.
 */
export async function marcarHiloLeido({
  alumnoId,
  moduloId,
  porAdmin,
}: {
  alumnoId: string;
  moduloId: string;
  porAdmin: boolean;
}) {
  if (porAdmin) {
    await db
      .update(schema.mensajes)
      .set({ leidoPorAdmin: true })
      .where(
        and(
          eq(schema.mensajes.alumnoId, alumnoId),
          eq(schema.mensajes.moduloId, moduloId),
          eq(schema.mensajes.deAdmin, false),
          eq(schema.mensajes.leidoPorAdmin, false)
        )
      );
  } else {
    await db
      .update(schema.mensajes)
      .set({ leidoPorAlumno: true })
      .where(
        and(
          eq(schema.mensajes.alumnoId, alumnoId),
          eq(schema.mensajes.moduloId, moduloId),
          eq(schema.mensajes.deAdmin, true),
          eq(schema.mensajes.leidoPorAlumno, false)
        )
      );
  }
}

/** Cantidad de respuestas de Catalina sin leer para un alumno (todo el curso). */
export async function contarNoLeidosAlumno(alumnoId: string): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.mensajes)
    .where(
      and(
        eq(schema.mensajes.alumnoId, alumnoId),
        eq(schema.mensajes.deAdmin, true),
        eq(schema.mensajes.leidoPorAlumno, false)
      )
    );
  return rows[0]?.n ?? 0;
}

/** Total de mensajes de alumnos sin leer por el admin (para el badge del header). */
export async function contarNoLeidosAdmin(): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.mensajes)
    .where(
      and(
        eq(schema.mensajes.deAdmin, false),
        eq(schema.mensajes.leidoPorAdmin, false)
      )
    );
  return rows[0]?.n ?? 0;
}

export type HiloAlumno = {
  cursoId: string;
  moduloId: string;
  moduloSlug: string | null;
  moduloTitulo: string | null;
  ultimoCuerpo: string;
  ultimoAt: Date;
  ultimoDeAdmin: boolean;
  noLeidos: number;
};

/**
 * Hilos del alumno: un item por módulo en el que conversó, con el último
 * mensaje y cuántas respuestas de Catalina tiene sin leer. Ordenado por
 * actividad reciente.
 */
export async function getHilosAlumno(alumnoId: string): Promise<HiloAlumno[]> {
  const rows = await db
    .select({
      cursoId: schema.mensajes.cursoId,
      moduloId: schema.mensajes.moduloId,
      moduloSlug: schema.mensajes.moduloSlug,
      moduloTitulo: schema.mensajes.moduloTitulo,
      cuerpo: schema.mensajes.cuerpo,
      deAdmin: schema.mensajes.deAdmin,
      leidoPorAlumno: schema.mensajes.leidoPorAlumno,
      createdAt: schema.mensajes.createdAt,
    })
    .from(schema.mensajes)
    .where(eq(schema.mensajes.alumnoId, alumnoId))
    .orderBy(desc(schema.mensajes.createdAt));

  const hilos = new Map<string, HiloAlumno>();
  for (const r of rows) {
    let hilo = hilos.get(r.moduloId);
    if (!hilo) {
      hilo = {
        cursoId: r.cursoId,
        moduloId: r.moduloId,
        moduloSlug: r.moduloSlug,
        moduloTitulo: r.moduloTitulo,
        ultimoCuerpo: r.cuerpo,
        ultimoAt: r.createdAt,
        ultimoDeAdmin: r.deAdmin,
        noLeidos: 0,
      };
      hilos.set(r.moduloId, hilo);
    }
    if (r.deAdmin && !r.leidoPorAlumno) hilo.noLeidos += 1;
  }
  return [...hilos.values()];
}

export type HiloBandeja = {
  alumnoId: string;
  alumnoNombre: string | null;
  alumnoEmail: string;
  cursoId: string;
  moduloId: string;
  moduloSlug: string | null;
  moduloTitulo: string | null;
  ultimoCuerpo: string;
  ultimoAt: Date;
  ultimoDeAdmin: boolean;
  noLeidos: number;
};

/**
 * Bandeja del admin: un item por hilo (alumno + módulo), con el último mensaje y
 * la cantidad de mensajes del alumno sin responder/leer. Ordenado por actividad.
 */
export async function getBandeja(): Promise<HiloBandeja[]> {
  const rows = await db
    .select({
      alumnoId: schema.mensajes.alumnoId,
      alumnoNombre: schema.users.name,
      alumnoEmail: schema.users.email,
      cursoId: schema.mensajes.cursoId,
      moduloId: schema.mensajes.moduloId,
      moduloSlug: schema.mensajes.moduloSlug,
      moduloTitulo: schema.mensajes.moduloTitulo,
      cuerpo: schema.mensajes.cuerpo,
      deAdmin: schema.mensajes.deAdmin,
      leidoPorAdmin: schema.mensajes.leidoPorAdmin,
      createdAt: schema.mensajes.createdAt,
    })
    .from(schema.mensajes)
    .innerJoin(schema.users, eq(schema.users.id, schema.mensajes.alumnoId))
    .orderBy(desc(schema.mensajes.createdAt));

  const hilos = new Map<string, HiloBandeja>();
  for (const r of rows) {
    const key = `${r.alumnoId}::${r.moduloId}`;
    let hilo = hilos.get(key);
    if (!hilo) {
      // rows vienen desc → el primero es el más reciente.
      hilo = {
        alumnoId: r.alumnoId,
        alumnoNombre: r.alumnoNombre,
        alumnoEmail: r.alumnoEmail,
        cursoId: r.cursoId,
        moduloId: r.moduloId,
        moduloSlug: r.moduloSlug,
        moduloTitulo: r.moduloTitulo,
        ultimoCuerpo: r.cuerpo,
        ultimoAt: r.createdAt,
        ultimoDeAdmin: r.deAdmin,
        noLeidos: 0,
      };
      hilos.set(key, hilo);
    }
    if (!r.deAdmin && !r.leidoPorAdmin) hilo.noLeidos += 1;
  }
  return [...hilos.values()];
}
