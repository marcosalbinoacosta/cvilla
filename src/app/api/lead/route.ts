import { z } from "zod";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const TIPOS = [
  "contacto",
  "mentoria-individual",
  "mentoria-grupal",
  "waitlist-virtuosa",
] as const;

const LeadSchema = z.object({
  tipo: z.enum(TIPOS),
  nombre: z.string().trim().min(2, "Nombre muy corto").max(80),
  email: z.string().trim().email("Email inválido").max(120),
  mensaje: z.string().trim().max(2000).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  etapa: z.string().trim().max(80).optional(),
  expectativa: z.string().trim().max(2000).optional(),
  website: z.string().optional(),
});

type LeadInput = z.infer<typeof LeadSchema>;

const SUBJECT: Record<(typeof TIPOS)[number], (nombre: string) => string> = {
  "contacto": (n) => `Nuevo contacto: ${n}`,
  "mentoria-individual": (n) => `Mentoría Individual — consulta de ${n}`,
  "mentoria-grupal": (n) => `Mentoría Grupal — pre-inscripción de ${n}`,
  "waitlist-virtuosa": (n) => `Programa Virtuosa (waitlist): ${n}`,
};

const TITULO: Record<(typeof TIPOS)[number], string> = {
  "contacto": "Nuevo contacto desde la web",
  "mentoria-individual": "Nueva consulta de Mentoría Individual",
  "mentoria-grupal": "Nueva pre-inscripción de Mentoría Grupal",
  "waitlist-virtuosa": "Nuevo lead en la lista de espera de Virtuosa",
};

function safe(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: LeadInput) {
  const titulo = TITULO[data.tipo];
  const rows: Array<[string, string]> = [
    ["Nombre", data.nombre],
    ["Email", `<a href="mailto:${safe(data.email)}">${safe(data.email)}</a>`],
  ];
  if (data.whatsapp) rows.push(["WhatsApp", safe(data.whatsapp)]);
  if (data.etapa) rows.push(["Etapa del negocio", safe(data.etapa)]);

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<p style="margin:4px 0;"><strong>${label}:</strong> ${
          label === "Email" ? value : safe(String(value))
        }</p>`
    )
    .join("");

  const mensajeBlock =
    data.mensaje || data.expectativa
      ? `
        <p style="margin:16px 0 8px;"><strong>${
          data.tipo === "mentoria-individual" ? "Expectativa" : "Mensaje"
        }:</strong></p>
        <p style="white-space:pre-wrap; background:#F7F2EC; padding:16px; border-left:3px solid #B89A72;">${safe(
          data.mensaje ?? data.expectativa ?? ""
        )}</p>`
      : "";

  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color: #2C2C2C; max-width: 560px;">
      <h2 style="color:#1B2E6B; font-weight:500; margin-bottom:16px;">${titulo}</h2>
      ${rowsHtml}
      ${mensajeBlock}
    </div>
  `;
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return Response.json(
      { ok: false, error: firstIssue?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return Response.json({ ok: true });
  }

  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Catalina Villafañe <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("[lead] Faltan RESEND_API_KEY o CONTACT_TO_EMAIL");
    return Response.json(
      { ok: false, error: "El servicio de email no está configurado" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: SUBJECT[data.tipo](data.nombre),
        html: buildHtml(data),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[lead] Resend error", res.status, body);
      return Response.json(
        { ok: false, error: "No pudimos enviar el mensaje" },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[lead] Network error", err);
    return Response.json(
      { ok: false, error: "Error de red al enviar el mensaje" },
      { status: 502 }
    );
  }
}
