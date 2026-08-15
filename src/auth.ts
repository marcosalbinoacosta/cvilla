import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@/db";

const RESEND_FROM =
  process.env.CONTACT_FROM_EMAIL ?? "Catalina Villafañe <onboarding@resend.dev>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: { strategy: "database" },
  pages: {
    signIn: "/ingresar",
    verifyRequest: "/ingresar/verificar",
    error: "/ingresar/error",
  },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: RESEND_FROM,
      // Override default copy (in English) with a friendlier Spanish version.
      async sendVerificationRequest({
        identifier: email,
        url,
        provider,
      }: {
        identifier: string;
        url: string;
        provider: { from?: string; apiKey?: string };
      }) {
        const host = new URL(url).host;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: [email],
            subject: `Tu acceso al aula — Catalina Villafañe`,
            html: buildEmailHtml({ url, host }),
            text: `Iniciá sesión en Catalina Villafañe\n${url}\n\nSi no pediste este mail, ignoralo.`,
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Resend sendVerificationRequest error ${res.status}: ${body}`);
        }
      },
    }),
  ],
});

function buildEmailHtml({ url, host }: { url: string; host: string }): string {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  return `
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background:#F7F2EC; font-family:-apple-system, Segoe UI, sans-serif; color:#2C2C2C;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #EDE4D8;">
            <tr>
              <td style="padding:40px 48px 24px;">
                <p style="margin:0 0 16px; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#1B2E6B;">Catalina Villafañe</p>
                <h1 style="margin:0 0 16px; font-size:24px; font-weight:400; color:#1B2E6B;">Tu acceso al aula</h1>
                <p style="margin:0 0 28px; font-size:15px; line-height:1.6; color:#2C2C2C;">Hacé click en el botón para entrar. El link es válido por 24 horas.</p>
                <p style="margin:0 0 28px;">
                  <a href="${url}" style="display:inline-block; padding:14px 28px; background:#1B2E6B; color:#ffffff; text-decoration:none; font-size:13px; letter-spacing:0.16em; text-transform:uppercase;">Ingresar al aula</a>
                </p>
                <p style="margin:0 0 8px; font-size:12px; color:#7a7a7a;">Si el botón no funciona, copiá esta dirección en tu navegador:</p>
                <p style="margin:0 0 24px; font-size:12px; color:#7a7a7a; word-break:break-all;">${url}</p>
                <hr style="border:0; border-top:1px solid #EDE4D8; margin:24px 0;" />
                <p style="margin:0; font-size:12px; color:#9a9a9a;">Si no pediste este mail, ignoralo. Nadie podrá acceder a tu cuenta sin este link.</p>
                <p style="margin:8px 0 0; font-size:12px; color:#9a9a9a;">Enviado por ${escapedHost}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
