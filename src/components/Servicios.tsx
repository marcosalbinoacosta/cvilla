"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const charlasImages = [
  { src: "/images/charla2.webp", w: 800, h: 533 },
  { src: "/images/charla3.webp", w: 800, h: 532 },
  { src: "/images/charla4.webp", w: 800, h: 1199 },
  { src: "/images/charla5.webp", w: 800, h: 1422 },
  { src: "/images/charla6.webp", w: 800, h: 532 },
  { src: "/images/charla7.jpeg", w: 1280, h: 720 },
  { src: "/images/charla8.webp", w: 800, h: 1200 },
  { src: "/images/charla9.webp", w: 800, h: 1422 },
  { src: "/images/charla10.jpeg", w: 720, h: 1280 },
];

const MARQUEE_H = 220;
const MARQUEE_GAP = 12; // gap-3 = 0.75rem ≈ 12px

// Pre-calculate one set's total width for the marquee offset
const oneSetWidth = charlasImages.reduce(
  (sum, img) => sum + Math.round((img.w / img.h) * MARQUEE_H) + MARQUEE_GAP,
  0
);

function CharlasMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-3 will-change-transform"
          style={{
            animation: `marquee 25s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            ["--marquee-offset" as string]: `-${oneSetWidth}px`,
          }}
        >
          {[...charlasImages, ...charlasImages].map((img, i) => {
            const displayW = Math.round((img.w / img.h) * MARQUEE_H);
            return (
              <div
                key={i}
                className="shrink-0 overflow-hidden rounded-sm"
                style={{ width: displayW, height: MARQUEE_H }}
              >
                <Image
                  src={img.src}
                  alt={`Charla ${(i % charlasImages.length) + 1}`}
                  width={displayW}
                  height={MARQUEE_H}
                  quality={85}
                  className="w-full h-full object-cover"
                  sizes={`${displayW}px`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VirtuosaCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* Image side — with navy overlay */}
        <div className="relative h-[280px] md:h-auto overflow-hidden">
          <div className="absolute inset-0 will-change-transform">
            <Image
              src="/images/charla.jpeg"
              quality={85}
              alt="Programa Virtuosa"
              fill
              className={`object-cover transition-transform duration-[2s] ease-out ${
                visible ? "scale-105" : "scale-100"
              }`}
            />
          </div>
          <div className="absolute inset-0 bg-navy/40" />
          {/* Fade into content panel on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none hidden md:block" />
          {/* Fade bottom on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Content panel — light background */}
        <div className="bg-white p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          <p
            className={`text-sm tracking-[0.14em] uppercase text-navy/50 mb-2 font-medium transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            01 &middot; Programa
          </p>
          <h3
            className={`font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-navy mb-4 leading-tight transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Virtuosa
          </h3>
          <p
            className={`font-serif text-xl md:text-2xl lg:text-3xl italic text-navy/80 mb-5 leading-snug transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            Es hora de{" "}
            <span className="font-script text-accent-light not-italic">
              dar el próximo paso.
            </span>
          </p>
          <p
            className={`text-sm md:text-base tracking-wider uppercase text-accent font-medium mb-5 transition-all duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            4 módulos prácticos &middot; 2 horas de pura estrategia, mentalidad
            y acción
          </p>
          <p
            className={`text-sm md:text-base text-text font-light leading-relaxed mb-3 transition-all duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            Si ya empezaste pero tu negocio está estancado o desordenado, este
            programa te ayuda a recuperar claridad y definir estrategia para
            crear con base sólida.
          </p>
          <p
            className={`text-sm md:text-base text-text font-light leading-relaxed mb-8 transition-all duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            Vas a definir y avanzar con lo que tenés que hacer y dejar de hacer
            para dar el próximo paso y vender.
          </p>
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <a
              href="#"
              className="magnetic-btn pulse-glow btn-gradient inline-block text-white text-xs md:text-sm font-medium uppercase tracking-widest px-8 py-4"
            >
              Da el próximo paso
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="bg-cream py-20 md:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16" animation="blur-in">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/60 mb-3">
            Lo que hago
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-navy">
            Servicios{" "}
            <span className="font-script text-shimmer">diseñados</span> para vos
          </h2>
        </ScrollReveal>

        {/* 01 — Virtuosa (full-width) */}
        <div className="mb-6">
          <VirtuosaCard />
        </div>

        {/* 02 & 03 — Mentorías (2 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ScrollReveal delay={100} animation="slide-right">
            <div className="card-3d group p-8 md:p-10 bg-navy border border-navy h-full flex flex-col">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-white/10 group-hover:text-white/15 transition-colors duration-500">
                02
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-accent-light mb-2">
                1 a 1
              </p>
              <h3 className="font-serif text-2xl font-normal text-white mb-4 leading-tight">
                Mentoría Individual
              </h3>
              <p className="text-sm text-cream/70 font-light leading-relaxed mb-4 flex-1">
                Espacio privado para emprendedoras que quieran mirar su negocio,
                hacer preguntas, pensar estrategias y trabajar en lo que
                realmente necesitan para ordenar y escalar su negocio.
              </p>
              <p className="text-sm text-cream/55 font-light leading-relaxed mb-8">
                Las mentorías NO son un acompañamiento genérico, es un proceso
                de transformación donde pongo mi experiencia, conocimiento y
                mirada crítica al servicio de tu negocio.
              </p>
              <Link
                href="/mentoria-individual"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-accent-light transition-all duration-300 group-hover:gap-3"
              >
                Conocé más
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250} animation="slide-left">
            <div className="card-3d group p-8 md:p-10 bg-navy border border-navy h-full flex flex-col">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-white/10 group-hover:text-white/15 transition-colors duration-500">
                03
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-accent-light mb-2">
                Grupal
              </p>
              <h3 className="font-serif text-2xl font-normal text-white mb-4 leading-tight">
                Mentoría Grupal
              </h3>
              <p className="text-sm text-cream/70 font-light leading-relaxed mb-4 flex-1">
                Un espacio de crecimiento compartido donde emprendedoras se
                encuentran para aprender, desafiarse y avanzar juntas.
                Estrategia colectiva con la guía y el acompañamiento
                personalizado de Cata.
              </p>
              <p className="text-sm text-cream/55 font-light leading-relaxed mb-8">
                Grupos reducidos para garantizar atención y resultados reales.
              </p>
              <Link
                href="/mentoria-grupal"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-accent-light transition-all duration-300 group-hover:gap-3"
              >
                Conocé más
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* 04 — Charlas y Talleres */}
        <ScrollReveal animation="scale-in">
          <div className="bg-white border border-beige overflow-hidden card-3d">
            {/* Content top */}
            <div className="p-8 md:p-10 lg:p-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                <div>
                  <p className="text-[0.68rem] tracking-[0.14em] uppercase text-navy/60 mb-2">
                    04 &middot; Eventos
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
                    Charlas y Talleres
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-6">
                    Temáticas adaptables a tu equipo o evento. Consultoría
                    corporativa disponible.
                  </p>
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-navy transition-all duration-300 hover:gap-3"
                  >
                    Consultar disponibilidad
                    <span
                      aria-hidden
                      className="transition-transform duration-300"
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
                <ScrollReveal animation="stagger" className="flex flex-wrap gap-2">
                  {[
                    "Liderazgo",
                    "Comunicación",
                    "Equipos de alto rendimiento",
                    "Gestión de proyectos",
                    "Transformación digital",
                    "Estrategia comercial",
                    "Mentalidad emprendedora",
                  ].map((tema) => (
                    <span
                      key={tema}
                      className="text-[0.65rem] tracking-wider uppercase px-3 py-1.5 border border-beige text-navy/70 hover:border-accent/40 hover:text-navy transition-colors duration-300"
                    >
                      {tema}
                    </span>
                  ))}
                </ScrollReveal>
              </div>
            </div>

            {/* Photo marquee */}
            <CharlasMarquee />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
