"use client";

import { useActionState, useEffect, useOptimistic, useRef } from "react";
import { useFormStatus } from "react-dom";
import { enviarMensaje, marcarLeido, type EnviarState } from "../actions";
import { tiempoRelativo } from "@/lib/fecha";

type MensajeUI = {
  id: string;
  autorId: string;
  cuerpo: string;
  deAdmin: boolean;
  createdAt: Date;
  pendiente?: boolean;
};

const INITIAL: EnviarState = { ok: false };

export default function Comentarios({
  cursoId,
  moduloId,
  moduloSlug,
  moduloTitulo,
  mensajes,
  currentUserId,
}: {
  cursoId: string;
  moduloId: string;
  moduloSlug: string;
  moduloTitulo: string;
  mensajes: MensajeUI[];
  currentUserId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(enviarMensaje, INITIAL);
  const [optimistas, addOptimista] = useOptimistic(
    mensajes,
    (cur: MensajeUI[], nuevo: MensajeUI) => [...cur, nuevo]
  );

  // Al abrir el módulo, marcar como leídas las respuestas de Catalina.
  useEffect(() => {
    const fd = new FormData();
    fd.set("moduloId", moduloId);
    marcarLeido(fd);
  }, [moduloId]);

  // Limpiar el textarea después de enviar con éxito.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  async function action(formData: FormData) {
    const cuerpo = String(formData.get("cuerpo") ?? "").trim();
    if (!cuerpo) return;
    addOptimista({
      id: `tmp-${Date.now()}`,
      autorId: currentUserId,
      cuerpo,
      deAdmin: false,
      createdAt: new Date(),
      pendiente: true,
    });
    await formAction(formData);
  }

  return (
    <section aria-label="Comentarios" className="mt-14">
      <h2 className="font-serif text-2xl text-navy mb-1">Comentarios</h2>
      <p className="text-sm text-text/60 mb-6 max-w-xl">
        Dejá tus dudas, avances, reflexiones o experiencias sobre este módulo.
        Solo vos y Catalina los ven.
      </p>

      {/* Caja para comentar */}
      <form ref={formRef} action={action} className="relative mb-8">
        <input type="hidden" name="cursoId" value={cursoId} />
        <input type="hidden" name="moduloId" value={moduloId} />
        <input type="hidden" name="moduloSlug" value={moduloSlug} />
        <input type="hidden" name="moduloTitulo" value={moduloTitulo} />
        <textarea
          name="cuerpo"
          required
          rows={3}
          maxLength={4000}
          placeholder="Escribí un comentario sobre este módulo…"
          className="w-full resize-y rounded-lg border border-beige bg-white px-4 py-3 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/10"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {!state.ok && state.error && (
          <p className="mt-2 text-xs text-accent">{state.error}</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-[11px] text-text/40">
            Tip: ⌘/Ctrl + Enter para comentar
          </span>
          <EnviarBtn />
        </div>
      </form>

      {/* Lista de comentarios */}
      <ul className="space-y-3">
        {optimistas.length === 0 && (
          <li className="text-sm text-text/50 italic border border-dashed border-beige rounded-lg px-5 py-6 text-center">
            Todavía no hay comentarios en este módulo. Dejá el primero.
          </li>
        )}
        {optimistas.map((m) => (
          <li
            key={m.id}
            className={`rounded-lg px-4 py-3.5 border ${
              m.deAdmin
                ? "border-accent/30 bg-accent/[0.04]"
                : "border-beige bg-white"
            } ${m.pendiente ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                aria-hidden
                className={`shrink-0 grid place-items-center w-7 h-7 rounded-full text-[11px] font-medium ${
                  m.deAdmin ? "bg-navy text-white" : "bg-accent/15 text-accent"
                }`}
              >
                {m.deAdmin ? "C" : "Vos"}
              </span>
              <span className="text-xs font-medium text-navy">
                {m.deAdmin ? "Catalina" : "Vos"}
              </span>
              {m.deAdmin && (
                <span className="text-[10px] tracking-[0.12em] uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Respuesta
                </span>
              )}
              <span className="text-[11px] text-text/45 ml-auto">
                {m.pendiente ? "publicando…" : tiempoRelativo(m.createdAt)}
              </span>
            </div>
            <p className="text-sm text-text/85 leading-relaxed whitespace-pre-wrap break-words">
              {m.cuerpo}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EnviarBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-navy text-white text-xs uppercase tracking-widest px-7 py-3 hover:bg-accent transition-colors disabled:opacity-60"
    >
      {pending ? "Publicando…" : "Comentar"}
    </button>
  );
}
