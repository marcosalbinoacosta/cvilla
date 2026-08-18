"use client";

import { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-06-01T00:00:00-03:00");
// Debe coincidir con el slug del documento "curso" en Sanity.
// (El nombre visible es "Emprendé con Confianza"; el slug interno sigue
// siendo "virtuosa" para no romper accesos ni la ruta del aula.)
const PRODUCTO_SLUG = "virtuosa";
// Precio de lanzamiento — lo que efectivamente cobra Mercado Pago.
// Debe coincidir con `precio` del curso en Sanity.
const PRECIO_BASE = 40000;
// Precio de lista (tachado). Debe coincidir con `precioOriginal` en Sanity.
const PRECIO_LISTA = 60000;

function formatPesos(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

type FormState = "idle" | "loading" | "success" | "error";

type Beneficio = { emoji?: string; texto?: string };

const BENEFICIOS_DEFAULT: Beneficio[] = [
  { emoji: "👩‍💼", texto: "1 encuentro grupal en vivo conmigo." },
  { emoji: "🤝", texto: "Acceso a la Comunidad de Emprendedoras Cata Villafañe." },
  {
    emoji: "🎁",
    texto: "Beneficios exclusivos para futuras mentorías, talleres o eventos.",
  },
];

type CuponAplicado = {
  codigo: string;
  descuento: number;
  precioFinal: number;
};

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const id = setInterval(() => setDelta(getDelta(LAUNCH_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
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

function CheckoutForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cuponInput, setCuponInput] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState<CuponAplicado | null>(null);
  const [cuponError, setCuponError] = useState<string | null>(null);
  const [cuponLoading, setCuponLoading] = useState(false);

  const precioMostrado = cuponAplicado ? cuponAplicado.precioFinal : PRECIO_BASE;

  async function validarCuponInput(): Promise<CuponAplicado | null> {
    const codigo = cuponInput.trim();
    if (!codigo) {
      setCuponError("Ingresá un código.");
      return null;
    }
    setCuponLoading(true);
    setCuponError(null);
    try {
      const res = await fetch("/api/cupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, productoSlug: PRODUCTO_SLUG }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok: boolean;
        codigo?: string;
        descuento?: number;
        precioFinal?: number;
        error?: string;
      } | null;

      if (!json?.ok || typeof json.precioFinal !== "number") {
        setCuponAplicado(null);
        setCuponError(json?.error ?? "No pudimos validar el cupón.");
        return null;
      }
      const aplicado: CuponAplicado = {
        codigo: json.codigo ?? codigo.toUpperCase(),
        descuento: json.descuento ?? 0,
        precioFinal: json.precioFinal,
      };
      setCuponAplicado(aplicado);
      setCuponError(null);
      return aplicado;
    } catch {
      setCuponError("Error de red. Probá de nuevo.");
      return null;
    } finally {
      setCuponLoading(false);
    }
  }

  function quitarCupon() {
    setCuponAplicado(null);
    setCuponInput("");
    setCuponError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading" || cuponLoading) return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // Si escribió un cupón pero no lo aplicó, lo validamos antes de pagar.
    let aplicado = cuponAplicado;
    if (cuponInput.trim() && !aplicado) {
      aplicado = await validarCuponInput();
      if (!aplicado) return; // cupón inválido: no seguimos.
    }

    const payload = {
      productoSlug: PRODUCTO_SLUG,
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      ...(aplicado ? { cupon: aplicado.codigo } : {}),
    };

    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as {
        ok: boolean;
        checkoutUrl?: string;
        error?: string;
      } | null;

      if (!res.ok || !json?.ok) {
        setStatus("error");
        setErrorMsg(json?.error ?? "No pudimos iniciar el pago. Probá de nuevo.");
        return;
      }

      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de red. Revisá tu conexión e intentá de nuevo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto text-left space-y-4" noValidate>
      <div>
        <label
          htmlFor="checkout-nombre"
          className="block text-[0.7rem] tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Nombre
        </label>
        <input
          id="checkout-nombre"
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
          htmlFor="checkout-email"
          className="block text-[0.7rem] tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          Email
        </label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          disabled={status === "loading"}
          className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-accent transition-colors disabled:opacity-60"
        />
      </div>

      {/* Cupón de descuento */}
      <div>
        <label
          htmlFor="checkout-cupon"
          className="block text-[0.7rem] tracking-[0.16em] uppercase text-white/70 mb-2"
        >
          ¿Tenés un cupón?
        </label>
        {cuponAplicado ? (
          <div className="flex items-center justify-between gap-3 bg-accent/15 border border-accent/40 px-4 py-3">
            <span className="text-sm text-white">
              Cupón <strong>{cuponAplicado.codigo}</strong> aplicado
              <span className="text-white/70">
                {" "}
                · −{formatPesos(cuponAplicado.descuento)}
              </span>
            </span>
            <button
              type="button"
              onClick={quitarCupon}
              disabled={status === "loading"}
              className="text-[0.7rem] uppercase tracking-[0.14em] text-white/60 hover:text-white underline disabled:opacity-50"
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              id="checkout-cupon"
              name="cupon"
              type="text"
              value={cuponInput}
              onChange={(e) => {
                setCuponInput(e.target.value);
                setCuponError(null);
              }}
              maxLength={40}
              autoCapitalize="characters"
              placeholder="Código"
              disabled={status === "loading" || cuponLoading}
              className="flex-1 min-w-0 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 uppercase tracking-wider outline-none focus:border-accent transition-colors disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void validarCuponInput()}
              disabled={status === "loading" || cuponLoading || !cuponInput.trim()}
              className="shrink-0 border border-white/30 text-white text-xs uppercase tracking-[0.14em] px-5 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cuponLoading ? "…" : "Aplicar"}
            </button>
          </div>
        )}
        {cuponError && (
          <p className="mt-2 text-sm text-red-300/90" role="status" aria-live="polite">
            {cuponError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="group btn-gradient pulse-glow w-full text-white text-sm uppercase tracking-[0.18em] py-5 font-medium rounded-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none flex items-center justify-center gap-3"
      >
        {status === "loading" ? (
          "Redirigiendo a Mercado Pago…"
        ) : (
          <>
            {cuponAplicado ? (
              <span className="flex items-center gap-2">
                Quiero mi lugar —
                <span className="line-through text-white/50">
                  {formatPesos(PRECIO_BASE)}
                </span>
                <span>{formatPesos(precioMostrado)}</span>
              </span>
            ) : (
              <>Quiero mi lugar — {formatPesos(precioMostrado)}</>
            )}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-2 mt-4 text-[0.7rem] text-white/45">
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
          <path
            d="M12 2 4 5v6c0 5 3.4 8.3 8 11 4.6-2.7 8-6 8-11V5l-8-3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        Pago protegido con Mercado Pago
      </div>

      <div className="min-h-[1.25rem] text-sm text-center" aria-live="polite" role="status">
        {status === "error" && <p className="text-red-300/90">{errorMsg}</p>}
      </div>
    </form>
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
          Te avisamos por mail apenas se abran las inscripciones de Emprendé con Confianza.
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
        className="group btn-gradient w-full text-white text-sm uppercase tracking-[0.18em] py-5 font-medium rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {status === "loading" ? (
          "Sumándote…"
        ) : (
          <>
            Avisame antes que nadie
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </>
        )}
      </button>

      <div className="min-h-[1.25rem] text-sm text-center" aria-live="polite" role="status">
        {status === "error" && <p className="text-red-300/90">{errorMsg}</p>}
      </div>
    </form>
  );
}

export default function VirtuosaPreLanzamiento({
  beneficios,
}: {
  beneficios?: Beneficio[];
}) {
  const isLaunched = new Date() >= LAUNCH_DATE;
  const listaBeneficios =
    beneficios && beneficios.length > 0 ? beneficios : BENEFICIOS_DEFAULT;

  return (
    <section className="bg-navy min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent-light/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-[0.72rem] tracking-[0.2em] uppercase text-accent-light mb-5 mt-6">
          Curso · Cata Villafañe
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-light leading-[1.1] mb-6">
          <span className="italic">Emprendé con</span>{" "}
          <span className="font-script text-accent-light text-5xl md:text-7xl lg:text-8xl not-italic">
            Confianza
          </span>
        </h1>

        <p className="font-serif text-xl md:text-2xl italic text-white/70 max-w-2xl mx-auto leading-snug mb-4">
          El primer paso no es tener todas las respuestas. Es empezar con la
          dirección correcta.
        </p>

        {!isLaunched && (
          <div className="mt-10 mb-14">
            <p className="font-serif text-lg md:text-xl italic text-white/60 mb-8">
              Abre inscripciones en{" "}
              <span className="font-script text-accent-light text-3xl md:text-4xl not-italic">
                julio 2026
              </span>
            </p>
            <Countdown />
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-14">
          <p className="text-base md:text-lg text-white/80 font-light leading-relaxed mt-10 mb-6">
            Empezar un emprendimiento y dar los primeros pasos genera ilusión,
            pero también muchas dudas. ¿Por dónde empiezo? ¿Cómo sé si mi idea
            tiene potencial? ¿Qué hago primero? ¿Cómo comunico mi negocio?
          </p>
          <p className="text-base md:text-lg text-white/80 font-light leading-relaxed mb-10">
            En una hora vas a adquirir una mirada práctica sobre los primeros
            pasos para emprender: aprenderás a ordenar tus ideas, definir
            prioridades y tomar decisiones con mayor seguridad.
          </p>

          <ul className="text-left max-w-md mx-auto space-y-4 mb-12">
            {listaBeneficios.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-white/85 font-light leading-relaxed"
              >
                <span aria-hidden="true">{b.emoji}</span>
                <span>{b.texto}</span>
              </li>
            ))}
          </ul>

          <div className="inline-flex flex-col items-center gap-3 px-10 py-7 rounded-sm border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <span className="text-[0.62rem] tracking-[0.22em] uppercase text-accent-light">
              Precio de lanzamiento
            </span>
            <div className="flex items-end justify-center gap-3">
              <span className="font-serif text-5xl md:text-6xl text-white leading-none">
                {formatPesos(PRECIO_BASE)}
              </span>
              <span className="text-white/40 line-through text-lg md:text-xl mb-1">
                {formatPesos(PRECIO_LISTA)}
              </span>
            </div>
            <span className="text-[0.65rem] tracking-[0.15em] uppercase text-white font-medium bg-accent/80 px-3 py-1 rounded-full">
              Ahorrás {formatPesos(PRECIO_LISTA - PRECIO_BASE)} · 33% off
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12">
          {isLaunched ? (
            <>
              <p className="text-[0.72rem] tracking-[0.18em] uppercase text-accent-light mb-3">
                Inscribite ahora
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-light mb-8">
                Completá tus datos para comprar
              </h2>
              <CheckoutForm />
              <p className="text-xs text-white/40 mt-8">
                Al completar el pago recibís un mail con el acceso al aula.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
