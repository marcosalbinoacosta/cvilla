"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import NavbarInterna from "@/components/NavbarInterna";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const incluye = [
  "Encuentros grupales en vivo por videollamada",
  "Grupos reducidos (máximo 8 emprendedoras)",
  "Material de trabajo y ejercicios prácticos",
  "Feedback personalizado dentro del grupo",
  "Comunidad privada entre participantes",
  "Acceso a grabaciones de las sesiones",
];

const faqs = [
  {
    q: "¿Cuántas personas participan en cada grupo?",
    a: "Los grupos son reducidos, de máximo 8 emprendedoras. Esto garantiza que cada una reciba atención y feedback personalizado dentro del espacio grupal.",
  },
  {
    q: "¿Cuánto dura la mentoría grupal?",
    a: "Cada ciclo tiene una duración definida que se comunica al abrir inscripciones. Generalmente son entre 4 y 8 semanas con encuentros semanales.",
  },
  {
    q: "¿Puedo participar si recién estoy empezando?",
    a: "Sí, siempre que tengas una idea de negocio en marcha o un emprendimiento que querés hacer crecer. El grupo es un espacio para todas las etapas.",
  },
  {
    q: "¿Qué pasa si no puedo asistir a una sesión?",
    a: "Todas las sesiones se graban y quedan disponibles para que puedas verlas cuando quieras. Además, tenés acceso a la comunidad privada para no perder el hilo.",
  },
  {
    q: "¿Cuándo abre el próximo grupo?",
    a: "Las inscripciones se abren periódicamente. Escribime para sumarte a la lista de espera y ser la primera en enterarte cuando se abra un nuevo grupo.",
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

function FormGrupal() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="bg-white p-8 md:p-10 border border-beige text-center">
        <p className="font-serif text-2xl text-navy mb-3">¡Te anotaste!</p>
        <p className="text-sm text-text font-light">
          Te mandamos toda la info por WhatsApp apenas se abra el próximo grupo.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="bg-white p-8 md:p-10 border border-beige"
    >
      <input type="hidden" name="servicio" value="Mentoría Grupal" />

      <div className="space-y-5 mb-6">
        <div>
          <label htmlFor="gru-nombre" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            Nombre
          </label>
          <input
            id="gru-nombre"
            name="nombre"
            type="text"
            required
            placeholder="Tu nombre"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="gru-email" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            Email
          </label>
          <input
            id="gru-email"
            name="email"
            type="email"
            required
            placeholder="Tu email"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="gru-whatsapp" className="block text-xs tracking-wider uppercase text-navy/75 mb-2">
            WhatsApp
          </label>
          <input
            id="gru-whatsapp"
            name="whatsapp"
            type="tel"
            required
            placeholder="+54 9 11 1234-5678"
            className="w-full px-4 py-3.5 border border-beige bg-cream/50 text-sm text-text placeholder-navy/30 outline-none focus:border-accent transition-colors duration-300"
          />
        </div>
      </div>

      <button
        type="submit"
        className="magnetic-btn btn-gradient w-full text-white text-xs font-medium uppercase tracking-widest px-8 py-4"
      >
        Quiero sumarme
      </button>
    </form>
  );
}

export default function MentoriaGrupalContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

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
      <NavbarInterna />
      <main>
        {/* === HERO === */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
          <div
            ref={heroRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/charla-grupo.webp"
              alt="Mentoría Grupal con Catalina Villafañe"
              fill
              className={`object-cover transition-all duration-[1.5s] ${
                loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={75}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
            <div
              className={`w-16 h-[2px] bg-gradient-to-r from-accent-light to-accent mb-8 transition-all duration-1000 delay-200 ${
                loaded ? "opacity-100 scale-x-100 origin-left" : "opacity-0 scale-x-0 origin-left"
              }`}
            />
            <p
              className={`text-[0.72rem] tracking-[0.2em] uppercase text-accent-light mb-4 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Mentoría Grupal
            </p>
            <h1
              className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              Crecer{" "}
              <span className="font-script text-accent-light not-italic">
                juntas
              </span>
            </h1>
            <p
              className={`font-serif text-lg md:text-xl italic text-cream/90 max-w-2xl leading-snug mb-8 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Un espacio de crecimiento compartido donde emprendedoras se
              encuentran para aprender, desafiarse y avanzar con estrategia.
            </p>
            <a
              href="#pre-inscripcion"
              className={`magnetic-btn btn-gradient inline-block text-white text-xs font-medium uppercase tracking-widest px-8 py-4 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              Quiero sumarme
            </a>
          </div>
        </section>

        {/* === FORMULARIO + QUÉ INCLUYE === */}
        <section id="pre-inscripcion" className="bg-cream py-20 md:py-28 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left — qué incluye */}
            <ScrollReveal animation="slide-right">
              <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/70 mb-3">
                ¿Qué incluye?
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-navy leading-tight mb-8">
                Estrategia colectiva,{" "}
                <span className="font-script text-shimmer text-3xl">
                  resultados
                </span>{" "}
                reales
              </h2>
              <div className="space-y-4 mb-8">
                {incluye.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-accent to-accent-light shrink-0 mt-2" />
                    <span className="text-sm md:text-base text-navy/80 font-light leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-navy/70 font-light italic">
                Dejá tus datos y te aviso apenas se abra el próximo grupo.
              </p>
            </ScrollReveal>

            {/* Right — form */}
            <ScrollReveal animation="slide-left" delay={150}>
              <FormGrupal />
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
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
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
