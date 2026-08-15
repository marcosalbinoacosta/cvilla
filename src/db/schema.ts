import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

/**
 * Registro de compras. Una fila por intento de pago; el webhook de Mercado Pago
 * actualiza `status` y setea `mpPaymentId` cuando se aprueba.
 */
export const compras = pgTable("compra", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Identificador del producto (slug del curso en Sanity, o "mentoria-individual", etc.)
  productoId: text("productoId").notNull(),
  mpPreferenceId: text("mpPreferenceId"),
  mpPaymentId: text("mpPaymentId"),
  // pending | approved | rejected | refunded | cancelled
  status: text("status").notNull().default("pending"),
  montoCentavos: integer("montoCentavos").notNull(),
  currency: text("currency").notNull().default("ARS"),
  // Cupón de descuento usado (código en mayúsculas), null si no hubo.
  cuponCodigo: text("cuponCodigo"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Acceso granteado a un curso. Lo crea el webhook cuando una compra queda
 * aprobada. `expiresAt` null = acceso perpetuo.
 */
export const accesosCurso = pgTable(
  "acceso_curso",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productoId: text("productoId").notNull(),
    compraId: text("compraId").references(() => compras.id, {
      onDelete: "set null",
    }),
    activo: boolean("activo").notNull().default(true),
    grantedAt: timestamp("grantedAt", { mode: "date" }).defaultNow().notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productoId] })]
);

/**
 * Comentarios / mensajería privada entre un alumno y Catalina, anclados a un
 * módulo (video). Un "hilo" es el conjunto de mensajes con el mismo
 * (alumnoId, moduloId). El alumno solo ve su propio hilo; Catalina (admin) ve
 * los de todos desde la bandeja `/aula/mensajes`.
 *
 * `moduloTitulo` se desnormaliza al insertar para que la bandeja del admin no
 * tenga que consultar Sanity por cada mensaje.
 */
export const mensajes = pgTable("mensaje", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  // Dueño del hilo: siempre el alumno, aunque el mensaje lo escriba Catalina.
  alumnoId: text("alumnoId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Quién escribió este mensaje (el alumno o Catalina).
  autorId: text("autorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cursoId: text("cursoId").notNull(),
  // _id del módulo en Sanity (identificador estable del video).
  moduloId: text("moduloId").notNull(),
  moduloSlug: text("moduloSlug"),
  moduloTitulo: text("moduloTitulo"),
  cuerpo: text("cuerpo").notNull(),
  deAdmin: boolean("deAdmin").notNull().default(false),
  leidoPorAlumno: boolean("leidoPorAlumno").notNull().default(false),
  leidoPorAdmin: boolean("leidoPorAdmin").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Progreso del alumno: una fila por módulo completado. La ausencia de fila = no
 * completado. PK compuesta evita duplicados y permite upsert/borrado por toggle.
 */
export const progresoModulo = pgTable(
  "progreso_modulo",
  {
    alumnoId: text("alumnoId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cursoId: text("cursoId").notNull(),
    moduloId: text("moduloId").notNull(),
    completadoAt: timestamp("completadoAt", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.alumnoId, t.moduloId] })]
);
