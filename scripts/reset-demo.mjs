#!/usr/bin/env node
/**
 * Resetea la demo a cero: borra todas las cuentas de alumnas (y en cascada sus
 * accesos, compras, progreso, mensajes y sesiones), dejando solo los admins.
 *
 * Uso:  node scripts/reset-demo.mjs
 *
 * Los admins se toman de ADMIN_EMAILS en .env.local (no se borran).
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("✖ DATABASE_URL no está seteado en .env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const admins = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Borrar toda cuenta que no sea admin (cascade limpia lo demás).
const borrados =
  admins.length > 0
    ? await sql`DELETE FROM "user" WHERE lower(email) <> ALL(${admins}) RETURNING email`
    : await sql`DELETE FROM "user" RETURNING email`;

// Por las dudas, limpiar compras que hayan quedado huérfanas.
await sql`DELETE FROM compra`;

const users = await sql`SELECT email FROM "user" ORDER BY email`;
console.log(`✓ Borradas ${borrados.length} cuenta(s) de alumna.`);
console.log("✓ Quedan (admins):", users.map((u) => u.email).join(", ") || "—");
console.log("✓ Compras, accesos, progreso y mensajes: en cero.");
