"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

type ContactoData = {
  email?: string;
  whatsapp?: string;
  ubicacion?: string;
};

type FormState = "idle" | "loading" | "success" | "error";

export default function Contacto({ data }: { data?: ContactoData }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFormVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      tipo: "contacto" as const,
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      mensaje: String(formData.get("mensaje") ?? "").trim(),
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
        setErrorMsg(json?.error ?? "No pudimos enviar el mensaje. Probá de nuevo.");
        return;
      }

      setStatus("success");
      formEl.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Error de red. Revisá tu conexión e intentá de nuevo.");
    }
  }

  return (
    <section
      id="contacto"
      className="bg-cream py-20 md:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
        {/* Left — text content */}
        <ScrollReveal animation="slide-right">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/75 mb-3">
            Contacto
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-navy mb-4">
            ¿Hablamos?
          </h2>
          <p className="font-serif italic text-base md:text-lg text-gray-400 mb-8">
            Contame en qué estás trabajando y te asesoro.
          </p>
          <div className="space-y-4 text-sm text-navy/80 font-light">
            <div className="flex items-center gap-3 group">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-accent shrink-0 transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{data?.email || "hola@catalinavillafane.com"}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5 text-accent shrink-0 transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{data?.ubicacion || "Córdoba, Argentina"}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Right — form with sequential field reveal */}
        <div>
          <form ref={formRef} className="text-left" onSubmit={onSubmit} noValidate>
            {/* Honeypot — bots only */}
            <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">No completar</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div
                className={`transition-all duration-600 ${
                  formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "0ms" }}
              >
                <label
                  htmlFor="nombre"
                  className="block text-xs tracking-wider uppercase text-navy/75 mb-2"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  disabled={status === "loading"}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
                />
              </div>
              <div
                className={`transition-all duration-600 ${
                  formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <label
                  htmlFor="email"
                  className="block text-xs tracking-wider uppercase text-navy/75 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  disabled={status === "loading"}
                  placeholder="Tu email"
                  className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
                />
              </div>
            </div>
            <div
              className={`mb-6 transition-all duration-600 ${
                formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <label
                htmlFor="mensaje"
                className="block text-xs tracking-wider uppercase text-navy/75 mb-2"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                disabled={status === "loading"}
                placeholder="¿En qué puedo ayudarte?"
                className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-accent transition-colors duration-300 resize-none disabled:opacity-60"
              />
            </div>
            <div
              className={`transition-all duration-600 ${
                formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <button
                type="submit"
                disabled={status === "loading"}
                className="magnetic-btn w-full sm:w-auto bg-navy text-white text-xs font-medium uppercase tracking-widest px-10 py-4 hover:bg-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-navy disabled:hover:shadow-none"
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </button>
              <div
                className="mt-4 min-h-[1.25rem] text-sm"
                aria-live="polite"
                role="status"
              >
                {status === "success" && (
                  <p className="text-navy/80">
                    ¡Gracias! Tu mensaje fue enviado. Te respondo a la brevedad.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-700/90">{errorMsg}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Versículo bíblico */}
      <ScrollReveal
        className="max-w-3xl mx-auto mt-20 pt-14 border-t border-beige"
        animation="blur-in"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-sm mb-8">
            <div className="relative overflow-hidden rounded-sm shadow-lg shadow-beige/60">
              <Image
                src="/images/biblia.webp"
                alt="Manos sobre la Biblia abierta"
                width={400}
                height={267}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 384px"
              />
              <div className="absolute inset-0 border border-accent/20 rounded-sm pointer-events-none" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/25 rounded-sm pointer-events-none -z-10" />
          </div>
          <blockquote className="max-w-lg">
            <p className="font-serif text-lg md:text-xl italic text-navy/80 leading-relaxed mb-4">
              &ldquo;No nos cansemos, pues, de hacer bien; porque a su tiempo
              segaremos, si no desmayamos.&rdquo;
            </p>
            <cite className="text-xs tracking-[0.18em] uppercase text-navy/70 not-italic">
              Gálatas 6:9
            </cite>
          </blockquote>
        </div>
      </ScrollReveal>
    </section>
  );
}
