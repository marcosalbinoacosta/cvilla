"use client";

import { useFormStatus } from "react-dom";
import { toggleModuloCompletado } from "../actions";

function Boton({ completado }: { completado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={completado}
      className={`inline-flex items-center gap-2.5 text-xs uppercase tracking-widest px-6 py-3.5 border transition-colors disabled:opacity-60 ${
        completado
          ? "bg-navy text-white border-navy hover:bg-navy/90"
          : "bg-white text-navy border-navy/25 hover:border-navy"
      }`}
    >
      <span
        className={`grid place-items-center w-4 h-4 rounded-full border transition-colors ${
          completado ? "bg-white border-white" : "border-navy/40"
        }`}
        aria-hidden
      >
        {completado && (
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-navy" fill="none">
            <path
              d="M2 6.2 4.6 9 10 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {pending
        ? "Guardando…"
        : completado
          ? "Módulo completado"
          : "Marcar como completado"}
    </button>
  );
}

export default function CompletarModuloBtn({
  cursoId,
  moduloId,
  moduloSlug,
  completado,
}: {
  cursoId: string;
  moduloId: string;
  moduloSlug: string;
  completado: boolean;
}) {
  return (
    <form action={toggleModuloCompletado}>
      <input type="hidden" name="cursoId" value={cursoId} />
      <input type="hidden" name="moduloId" value={moduloId} />
      <input type="hidden" name="moduloSlug" value={moduloSlug} />
      <Boton completado={completado} />
    </form>
  );
}
