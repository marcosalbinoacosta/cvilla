#!/usr/bin/env node
/**
 * Grant course access manually (admin / recovery / testing).
 *
 * Usage:
 *   node scripts/grant.mjs <email> <cursoSlug> [--name "Nombre"] [--title "Título del curso"] [--no-email]
 *
 * Examples:
 *   node scripts/grant.mjs catalinatesting@gmail.com virtuosa
 *   node scripts/grant.mjs maria@example.com virtuosa --name "María López" --title "Programa Virtuosa"
 *   node scripts/grant.mjs test@x.com virtuosa --no-email     # grant without welcome email
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

config({ path: ".env.local" });

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (key === "no-email") flags.noEmail = true;
      else flags[key] = argv[++i];
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function die(msg, code = 1) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(code);
}

async function sendWelcome({ email, name, cursoTitulo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠ RESEND_API_KEY no seteado — salteando email.");
    return;
  }
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Catalina Villafañe <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const loginUrl = `${siteUrl}/ingresar`;
  const saludo = name ? `Hola ${name},` : "¡Bienvenida!";

  const html = `<!DOCTYPE html>
<html lang="es"><body style="margin:0; padding:0; background:#F7F2EC; font-family:-apple-system,Segoe UI,sans-serif; color:#2C2C2C;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC; padding:40px 0;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #EDE4D8;"><tr><td style="padding:40px 48px 16px;">
<p style="margin:0 0 24px; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#1B2E6B;">Catalina Villafañe</p>
<h1 style="margin:0 0 20px; font-size:26px; font-weight:400; color:#1B2E6B;">${saludo}</h1>
<p style="margin:0 0 20px; font-size:15px; line-height:1.6;">Tu acceso al <strong>${cursoTitulo}</strong> ya está activo.</p>
<p style="margin:0 0 28px; font-size:15px; line-height:1.6;">Para entrar la primera vez, click en el botón e ingresá tu email <strong>${email}</strong>. Te mandamos un link de acceso sin contraseña.</p>
<p style="margin:0 0 36px;"><a href="${loginUrl}" style="display:inline-block; padding:14px 28px; background:#1B2E6B; color:#ffffff; text-decoration:none; font-size:13px; letter-spacing:0.16em; text-transform:uppercase;">Ir al aula</a></p>
<p style="margin:24px 0 0; font-size:14px; font-style:italic; color:#1B2E6B;">Con vos,<br/>Catalina</p>
</td></tr></table></td></tr></table></body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `¡Bienvenida a ${cursoTitulo}!`,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.warn(`⚠ Resend ${res.status}: ${body}`);
    return;
  }
  console.log(`✓ Email de bienvenida enviado a ${email}`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [email, cursoSlug] = positional;
  if (!email || !cursoSlug) {
    die(
      `Faltan argumentos.\n\nUso: node scripts/grant.mjs <email> <cursoSlug> [--name "Nombre"] [--title "Título"] [--no-email]`
    );
  }
  if (!process.env.DATABASE_URL) die("DATABASE_URL no está seteado en .env.local");

  const sql = neon(process.env.DATABASE_URL);

  // Find or create user.
  const existing = await sql`SELECT id, name FROM "user" WHERE email = ${email} LIMIT 1`;
  let userId = existing[0]?.id;
  const existingName = existing[0]?.name;

  if (!userId) {
    userId = randomUUID();
    await sql`INSERT INTO "user" (id, email, name) VALUES (${userId}, ${email}, ${flags.name ?? null})`;
    console.log(`✓ Usuario creado: ${email}`);
  } else {
    console.log(`✓ Usuario existente: ${email}`);
    if (flags.name && !existingName) {
      await sql`UPDATE "user" SET name = ${flags.name} WHERE id = ${userId}`;
    }
  }

  // Upsert access grant.
  await sql`
    INSERT INTO acceso_curso ("userId", "productoId", "activo", "grantedAt")
    VALUES (${userId}, ${cursoSlug}, true, NOW())
    ON CONFLICT ("userId", "productoId")
    DO UPDATE SET "activo" = true, "expiresAt" = NULL
  `;
  console.log(`✓ Acceso granteado: ${email} → ${cursoSlug}`);

  if (!flags.noEmail) {
    const cursoTitulo = flags.title ?? "tu programa";
    await sendWelcome({ email, name: flags.name ?? existingName, cursoTitulo });
  } else {
    console.log("· Email salteado (--no-email)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
