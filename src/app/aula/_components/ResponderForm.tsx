"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { enviarMensaje, type EnviarState } from "../actions";

const INITIAL: EnviarState = { ok: false };

function EnviarBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-navy text-white text-xs uppercase tracking-widest px-7 py-3 hover:bg-accent transition-colors disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Responder"}
    </button>
  );
}

export default function ResponderForm({
  alumnoId,
  cursoId,
  moduloId,
  moduloSlug,
  moduloTitulo,
  nombreAlumno,
}: {
  alumnoId: string;
  cursoId: string;
  moduloId: string;
  moduloSlug: string | null;
  moduloTitulo: string | null;
  nombreAlumno: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(enviarMensaje, INITIAL);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-4">
      <input type="hidden" name="alumnoId" value={alumnoId} />
      <input type="hidden" name="cursoId" value={cursoId} />
      <input type="hidden" name="moduloId" value={moduloId} />
      <input type="hidden" name="moduloSlug" value={moduloSlug ?? ""} />
      <input type="hidden" name="moduloTitulo" value={moduloTitulo ?? ""} />
      <textarea
        name="cuerpo"
        required
        rows={3}
        maxLength={4000}
        placeholder={`Responder a ${nombreAlumno} (opcional)…`}
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
      <div className="mt-3 flex justify-end">
        <EnviarBtn />
      </div>
    </form>
  );
}
