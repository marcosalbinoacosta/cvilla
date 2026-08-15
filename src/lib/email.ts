type WelcomeEmailInput = {
  to: string;
  nombre?: string | null;
  cursoTitulo: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const FROM =
  process.env.CONTACT_FROM_EMAIL ??
  "Catalina Villafañe <onboarding@resend.dev>";

export async function sendWelcomeEmail({
  to,
  nombre,
  cursoTitulo,
}: WelcomeEmailInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY no configurado");
    return { ok: false, error: "RESEND_API_KEY no configurado" };
  }

  const saludo = nombre ? `Hola ${nombre},` : "¡Bienvenida!";
  const loginUrl = `${SITE_URL}/ingresar`;
  const html = buildHtml({ saludo, cursoTitulo, loginUrl, email: to });
  const text = buildText({ saludo, cursoTitulo, loginUrl, email: to });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject: `¡Bienvenida a ${cursoTitulo}!`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error", res.status, body);
      return { ok: false, error: `Resend ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] network error", err);
    return { ok: false, error: "network" };
  }
}

function buildText({
  saludo,
  cursoTitulo,
  loginUrl,
  email,
}: {
  saludo: string;
  cursoTitulo: string;
  loginUrl: string;
  email: string;
}): string {
  return [
    saludo,
    "",
    `Tu acceso a ${cursoTitulo} ya está activo.`,
    "",
    `Para entrar al aula, andá a ${loginUrl} e ingresá tu email (${email}). Te enviaremos un link de acceso — sin contraseñas.`,
    "",
    "Cualquier duda, respondé a este mail.",
    "",
    "Catalina Villafañe",
  ].join("\n");
}

function buildHtml({
  saludo,
  cursoTitulo,
  loginUrl,
  email,
}: {
  saludo: string;
  cursoTitulo: string;
  loginUrl: string;
  email: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background:#F7F2EC; font-family:-apple-system,Segoe UI,sans-serif; color:#2C2C2C;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #EDE4D8;">
            <tr>
              <td style="padding:40px 48px 16px;">
                <p style="margin:0 0 24px; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#1B2E6B;">Catalina Villafañe</p>
                <h1 style="margin:0 0 20px; font-size:26px; font-weight:400; color:#1B2E6B;">${saludo}</h1>
                <p style="margin:0 0 20px; font-size:15px; line-height:1.6;">Tu acceso al <strong>${cursoTitulo}</strong> ya está activo. Qué alegría tenerte adentro.</p>
                <p style="margin:0 0 28px; font-size:15px; line-height:1.6;">Para entrar al aula la primera vez, seguí estos dos pasos:</p>
                <ol style="margin:0 0 28px; padding-left:18px; font-size:15px; line-height:1.7; color:#2C2C2C;">
                  <li>Clickeá el botón de abajo.</li>
                  <li>Ingresá tu email <strong>${email}</strong> y revisá tu bandeja — te mandamos un link para entrar sin contraseña.</li>
                </ol>
                <p style="margin:0 0 36px;">
                  <a href="${loginUrl}" style="display:inline-block; padding:14px 28px; background:#1B2E6B; color:#ffffff; text-decoration:none; font-size:13px; letter-spacing:0.16em; text-transform:uppercase;">Ir al aula</a>
                </p>
                <p style="margin:0 0 8px; font-size:13px; line-height:1.6; color:#2C2C2C;">Cualquier duda, respondé directamente a este mail — te lee una persona.</p>
                <p style="margin:24px 0 0; font-size:14px; font-style:italic; color:#1B2E6B;">Con vos,<br/>Catalina</p>
                <hr style="border:0; border-top:1px solid #EDE4D8; margin:32px 0 16px;" />
                <p style="margin:0; font-size:11px; color:#9a9a9a;">Si este mail no era para vos, ignoralo. Nadie podrá acceder a tu cuenta sin el link que llega después.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
