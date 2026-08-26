"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

type Mentoria = {
  paraQuienEyebrow?: string;
  paraQuienTitulo?: string;
  paraQuienItems?: string[];
  incluyeEyebrow?: string;
  incluyeTituloIntro?: string;
  incluyeTituloDestacado?: string;
  incluyeTituloSufijo?: string;
  incluyeItems?: string[];
  incluyeNota?: string;
};

const PARA_QUIEN_EYEBROW_DEFAULT = "¿Es para vos?";
const PARA_QUIEN_TITULO_DEFAULT = "Este espacio es para vos si…";
const PARA_QUIEN_ITEMS_DEFAULT = [
  "Querés trabajar tu emprendimiento de manera 1 a 1, con foco en tu caso particular.",
  "Necesitás claridad, estrategia y acompañamiento adaptado a tu realidad.",
  "Buscás destrabar dudas concretas y tomar decisiones con mayor seguridad.",
  "Necesitás un espacio confidencial, cercano y totalmente orientado a tus objetivos.",
  "Preferís un proceso más profundo, flexible y personalizado.",
  "Querés avanzar con un plan hecho a tu medida.",
];

const INCLUYE_EYEBROW_DEFAULT = "¿Qué incluye?";
const INCLUYE_TITULO_INTRO_DEFAULT = "Todo lo que necesitás para";
const INCLUYE_TITULO_DESTACADO_DEFAULT = "avanzar";
const INCLUYE_ITEMS_DEFAULT = [
  "Sesiones privadas 1 a 1 por videollamada",
  "Plan de acción personalizado para tu negocio",
  "Análisis de tu modelo de negocio actual",
  "Estrategia de ventas y posicionamiento",
  "Acompañamiento entre sesiones vía mensajes",
  "Material de apoyo y ejercicios prácticos",
];
const INCLUYE_NOTA_DEFAULT = "La primera conversación es sin compromiso.";

type Faq = { _id?: string; pregunta: string; respuesta: string };

const FAQS_DEFAULT: Faq[] = [
  {
    pregunta: "¿Cuánto dura el proceso de mentoría?",
    respuesta:
      "Depende de tus objetivos. Podemos trabajar desde sesiones puntuales hasta un acompañamiento de varios meses. Lo definimos juntas en la primera conversación.",
  },
  {
    pregunta: "¿Es solo para emprendedoras?",
    respuesta:
      "Trabajo principalmente con emprendedoras y dueñas de pymes, pero si tenés un proyecto o negocio que querés hacer crecer, podemos conversar.",
  },
  {
    pregunta: "¿Qué pasa si no sé bien qué necesito?",
    respuesta:
      "Justamente para eso es la primera sesión de diagnóstico. Muchas llegan sin claridad y eso es completamente normal. Mi trabajo es ayudarte a encontrarla.",
  },
  {
    pregunta: "¿Las sesiones son presenciales o virtuales?",
    respuesta:
      "Las sesiones son por videollamada, lo que te permite participar desde cualquier lugar. También hay opción presencial en Córdoba.",
  },
  {
    pregunta: "¿Cómo sé si la mentoría es para mí?",
    respuesta:
      "Si sentís que tu negocio necesita orden, dirección o un impulso estratégico, y estás dispuesta a comprometerte con el proceso, es para vos.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-beige">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-serif text-base md:text-lg text-navy pr-4">
          {q}
        </span>
        <span
          className={`text-accent font-serif text-2xl shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          open ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

type FormState = "idle" | "loading" | "success" | "error";

function FormIndividual() {
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (status === "success") {
    return (
      <div className="bg-white p-8 md:p-10 border border-beige text-center">
        <p className="font-serif text-2xl text-navy mb-3">¡Listo!</p>
        <p className="text-sm text-text font-light">
          Recibí tu consulta. Te escribo pronto para coordinar tu primera sesión.
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
      tipo: "mentoria-individual" as const,
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      etapa: String(formData.get("etapa") ?? "").trim(),
      expectativa: String(formData.get("expectativa") ?? "").trim(),
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
        setErrorMsg(json?.error ?? "No pudimos enviar tu consulta. Probá de nuevo.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Error de red. Revisá tu conexión e intentá de nuevo.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 md:p-10 border border-beige"
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="ind-website">No completar</label>
        <input id="ind-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-5 mb-6">
        <div>
          <label htmlFor="ind-nombre" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            Nombre
          </label>
          <input
            id="ind-nombre"
            name="nombre"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            disabled={status === "loading"}
            placeholder="Tu nombre"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="ind-email" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            Email
          </label>
          <input
            id="ind-email"
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            disabled={status === "loading"}
            placeholder="Tu email"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="ind-whatsapp" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            Teléfono / WhatsApp
          </label>
          <input
            id="ind-whatsapp"
            name="whatsapp"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            disabled={status === "loading"}
            placeholder="Ej: 351 555 5555"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="ind-etapa" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            ¿En qué etapa está tu negocio?
          </label>
          <select
            id="ind-etapa"
            name="etapa"
            required
            disabled={status === "loading"}
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text outline-none focus:border-accent transition-colors duration-300 disabled:opacity-60"
          >
            <option value="">Seleccioná una opción</option>
            <option value="Tengo una idea pero no arranqué">Tengo una idea pero no arranqué</option>
            <option value="Recién estoy empezando">Recién estoy empezando</option>
            <option value="Ya vendo pero quiero escalar">Ya vendo pero quiero escalar</option>
            <option value="Mi negocio está estancado">Mi negocio está estancado</option>
            <option value="Necesito reinventarme">Necesito reinventarme</option>
          </select>
        </div>

        <div>
          <label htmlFor="ind-expectativa" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            ¿Qué esperás de la mentoría?
          </label>
          <textarea
            id="ind-expectativa"
            name="expectativa"
            rows={3}
            maxLength={2000}
            disabled={status === "loading"}
            placeholder="Contame brevemente qué te gustaría trabajar"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300 resize-none disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="magnetic-btn btn-gradient w-full text-white text-xs font-medium uppercase tracking-widest px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Enviando..." : "Quiero mi mentoría"}
      </button>
      <div className="mt-4 min-h-[1.25rem] text-sm" aria-live="polite" role="status">
        {status === "error" && <p className="text-red-700/90">{errorMsg}</p>}
      </div>
    </form>
  );
}

export default function MentoriaIndividualContent({
  faqs,
  mentoria,
}: {
  faqs?: Faq[];
  mentoria?: Mentoria;
}) {
  const listaFaqs = faqs?.length ? faqs : FAQS_DEFAULT;
  const paraQuienEyebrow = mentoria?.paraQuienEyebrow || PARA_QUIEN_EYEBROW_DEFAULT;
  const paraQuienTitulo = mentoria?.paraQuienTitulo || PARA_QUIEN_TITULO_DEFAULT;
  const paraQuienItems = mentoria?.paraQuienItems?.length
    ? mentoria.paraQuienItems
    : PARA_QUIEN_ITEMS_DEFAULT;
  const incluyeEyebrow = mentoria?.incluyeEyebrow || INCLUYE_EYEBROW_DEFAULT;
  const incluyeTituloIntro =
    mentoria?.incluyeTituloIntro || INCLUYE_TITULO_INTRO_DEFAULT;
  const incluyeTituloDestacado =
    mentoria?.incluyeTituloDestacado || INCLUYE_TITULO_DESTACADO_DEFAULT;
  const incluyeTituloSufijo = mentoria?.incluyeTituloSufijo || "";
  const incluyeItems = mentoria?.incluyeItems?.length
    ? mentoria.incluyeItems
    : INCLUYE_ITEMS_DEFAULT;
  const incluyeNota = mentoria?.incluyeNota || INCLUYE_NOTA_DEFAULT;
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLoaded(true), []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* === HERO === */}
        <section className="min-h-screen bg-cream relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-screen">
            {/* Image */}
            <div className="relative h-[60vh] md:h-full md:min-h-screen overflow-hidden">
              <div ref={heroRef} className="absolute inset-0 will-change-transform">
                <Image
                  src="/images/individual.jpeg"
                  alt="Mentoría Individual con Catalina Villafañe"
                  fill
                  className={`object-cover object-top transition-all duration-[1.5s] ${
                    loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={95}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream pointer-events-none hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Content */}
            <div className="px-6 py-12 md:px-12 lg:px-16 md:py-20 z-10">
              <div
                className={`w-16 h-[2px] bg-gradient-to-r from-accent to-accent-light mb-8 transition-all duration-1000 delay-200 ${
                  loaded ? "opacity-100 scale-x-100 origin-left" : "opacity-0 scale-x-0 origin-left"
                }`}
              />
              <p
                className={`text-[0.72rem] tracking-[0.2em] uppercase text-navy/70 mb-4 transition-all duration-700 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Mentoría 1 a 1
              </p>
              <h1
                className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light text-navy leading-tight mb-6 transition-all duration-700 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                Mentoría{" "}
                <span className="font-script text-accent-light not-italic">
                  Individual
                </span>
              </h1>
              <p
                className={`font-serif text-lg md:text-xl italic text-navy/75 max-w-lg leading-snug mb-8 transition-all duration-700 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Un espacio privado para mirar tu negocio con honestidad, definir
                estrategia y avanzar con claridad.
              </p>
              <a
                href="#quiero-mi-mentoria"
                className={`magnetic-btn btn-gradient inline-block text-white text-xs font-medium uppercase tracking-widest px-8 py-4 transition-all duration-700 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                Quiero mi mentoría
              </a>
            </div>
          </div>
        </section>

        {/* === PARA QUIÉN ES === */}
        <section className="bg-white py-20 md:py-28 px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal animation="fade-up" className="mb-10">
              <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/70 mb-3">
                {paraQuienEyebrow}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-navy leading-tight">
                {paraQuienTitulo}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <ul className="space-y-4">
                {paraQuienItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-accent to-accent-light shrink-0 mt-2.5" />
                    <span className="text-base md:text-lg text-navy/80 font-light leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* === FORMULARIO + QUÉ INCLUYE === */}
        <section id="quiero-mi-mentoria" className="bg-cream py-20 md:py-28 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left — qué incluye */}
            <ScrollReveal animation="slide-right">
              <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/70 mb-3">
                {incluyeEyebrow}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-navy leading-tight mb-8">
                {incluyeTituloIntro}{" "}
                <span className="font-script text-shimmer text-3xl">
                  {incluyeTituloDestacado}
                </span>
                {incluyeTituloSufijo && <> {incluyeTituloSufijo}</>}
              </h2>
              <div className="space-y-4 mb-8">
                {incluyeItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-accent to-accent-light shrink-0 mt-2" />
                    <span className="text-sm md:text-base text-navy/80 font-light leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-navy/70 font-light italic">
                {incluyeNota}
              </p>
            </ScrollReveal>

            {/* Right — form */}
            <ScrollReveal animation="slide-left" delay={150}>
              <FormIndividual />
            </ScrollReveal>
          </div>
        </section>

        {/* === FAQ === */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal animation="blur-in" className="text-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-navy">
                Preguntas frecuentes
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up">
              <div>
                {listaFaqs.map((faq) => (
                  <FaqItem
                    key={faq._id ?? faq.pregunta}
                    q={faq.pregunta}
                    a={faq.respuesta}
                  />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
