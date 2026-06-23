"use client";

import { useEffect, useState } from "react";

// Día tentativo de apertura (Junio 2026 — sin día confirmado, apuntamos al 1ro).
// Cuando Catalina confirme fecha exacta, cambiar acá.
const LAUNCH_DATE = new Date("2026-06-01T00:00:00-03:00");

type FormState = "idle" | "loading" | "success" | "error";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function getDelta(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function Countdown() {
  const [delta, setDelta] = useState(() => getDelta(LAUNCH_DATE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setDelta(getDelta(LAUNCH_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    // Server render placeholder — evita hydration mismatch.
    return (
      <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto">
        {["Días", "Horas", "Min", "Seg"].map((label) => (
          <div key={label} className="bg-white/5 border border-white/10 px-2 py-5 md:py-6">
            <p className="font-serif text-3xl md:text-5xl text-white tabular-nums">--</p>
            <p className="text-[0.6rem] md:text-xs tracking-[0.18em] uppercase text-white/50 mt-2">
              {label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (delta.done) {
    return (
      <div className="max-w-xl mx-auto">
        <p className="font-serif text-3xl md:text-4xl text-accent-light italic">
          ¡Las inscripciones ya están abiertas!
        </p>
      </div>
    );
  }

  const cells: Array<[string, number]> = [
    ["Días", delta.days],
    ["Horas", delta.hours],
    ["Min", delta.minutes],
    ["Seg", delta.seconds],
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto">
      {cells.map(([label, value]) => (
        <div
          key={label}
          className="bg-white/5 border border-white/10 px-2 py-5 md:py-6 backdrop-blur-sm"
        >
          <p className="font-serif text-3xl md:text-5xl text-white tabular-nums">
            {pad(value)}
          </p>
          <p className="text-[0.6rem] md:text-xs tracking-[0.18em] uppercase text-white/50 mt-2">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function WaitlistForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (status === "success") {
    return (
      <div className="bg-white/5 border border-white/10 p-8 text-center backdrop-blur-sm">
        <p className="font-serif text-2xl text-white mb-2">¡Listo!</p>
        <p className="text-sm text-white/70 font-light">
          Te avisamos por mail apenas se abran las inscripciones del Programa Virtuosa.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      tipo: "waitlist-virtuosa" as const,
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      website: String(formData.get("website") ?? ""),
    };

    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setStatus("error");
        setErrorMsg(json?.error ?? "No pudimos sumarte a la lista. Probá de nuevo.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Error de red. Revisá tu conexión e intentá de nuevo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto text-left space-y-4" noValidate>
      {/* Honeypot */}
      <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="wait-website">No completar</label>
        <input id="wait-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label
          htmlFor="wait-nombre"
          className="block text-[0.7rem] tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Nombre
        </label>
        <input
          id="wait-nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          disabled={status === "loading"}
          className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-accent transition-colors disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="wait-email"
          className="block text-[0.7rem] tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Email
        </label>
        <input
          id="wait-email"
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          disabled={status === "loading"}
          className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-accent transition-colors disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-accent text-navy text-xs uppercase tracking-widest py-4 hover:bg-white transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sumándote..." : "Avisame antes que nadie"}
      </button>

      <div className="min-h-[1.25rem] text-sm text-center" aria-live="polite" role="status">
        {status === "error" && <p className="text-red-300/90">{errorMsg}</p>}
      </div>
    </form>
  );
}

export default function VirtuosaPreLanzamiento() {
  return (
    <section className="bg-navy min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent-light/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-light leading-[1.1] mb-6 mt-6">
          <span className="italic">El Programa</span>{" "}
          <span className="font-script text-accent-light text-5xl md:text-7xl lg:text-8xl not-italic">
            Virtuosa
          </span>
          <br />
          <span className="italic">abre inscripciones</span>
        </h1>

        <p className="font-serif text-xl md:text-2xl italic text-white/70 mb-12">
          en{" "}
          <span className="font-script text-accent-light text-3xl md:text-4xl not-italic">
            julio 2026
          </span>
        </p>

        <div className="mb-14">
          <Countdown />
        </div>

        <div className="max-w-2xl mx-auto mb-14">
          <p className="text-base md:text-lg text-white/80 font-light leading-relaxed mb-6">
            Vas a trabajar en los 4 pilares básicos para construir un negocio
            rentable y con propósito. Hacelo a tu ritmo (asincrónico), cada
            módulo queda disponible para que consultes las veces que quieras.
          </p>
          <p className="text-sm md:text-base text-white/85 font-light leading-relaxed">
            Sumate a la lista de espera y compralo a precio{" "}
            <span className="font-medium text-accent-light tracking-wide">
              LANZAMIENTO $35.000
            </span>
            .
          </p>
          <p className="text-xs md:text-sm text-white/50 font-light italic mt-2">
            Precio de lista <span className="line-through">$55.000</span>
          </p>
        </div>

        <div className="border-t border-white/10 pt-12">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-accent-light mb-3">
            Sumate a la lista de espera
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-light mb-8">
            Sé la primera en enterarte
          </h2>

          <WaitlistForm />

          <p className="text-xs text-white/40 mt-8">
            Sin spam. Solo te escribimos cuando se abran las inscripciones.
          </p>
        </div>
      </div>
    </section>
  );
}
