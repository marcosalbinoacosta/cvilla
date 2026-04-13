"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

type SobreMiData = {
  nombre: string;
  saludo: string;
  titulo: string;
  cita: string;
  fotoUrl?: string;
  expertise: string[];
  anosExperiencia: number;
};

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [started, target]);

  return <span ref={ref}>+{count}{suffix}</span>;
}

export default function SobreMi({ data }: { data: SobreMiData }) {
  return (
    <section
      id="sobre-mi"
      className="bg-cream py-24 lg:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Photo side */}
        <ScrollReveal animation="slide-right" className="w-full lg:w-5/12">
          <div className="relative">
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-full h-[90%] bg-beige hidden md:block" />
            <div className="absolute bottom-0 right-0 w-40 h-40 border-t border-l border-accent/30 pointer-events-none hidden md:block" />

            {data.fotoUrl && (
              <Image
                src={data.fotoUrl}
                alt={data.nombre}
                width={600}
                height={750}
                className="w-full h-auto aspect-[4/5] object-cover relative z-10 shadow-2xl"
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={90}
              />
            )}

            <div className="absolute bottom-10 -right-4 md:-right-16 lg:-right-24 z-20 bg-white shadow-xl border border-beige px-5 py-4 flex items-center gap-3 animate-float">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent shrink-0">
                <path
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  fill="currentColor"
                />
              </svg>
              <div>
                <p className="font-serif text-xl font-semibold text-navy leading-none">
                  <AnimatedCounter target={data.anosExperiencia} /> Años
                </p>
                <p className="text-[0.65rem] tracking-wider uppercase text-navy/70 mt-0.5">
                  Transformando negocios
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Content side */}
        <div className="w-full lg:w-7/12">
          <ScrollReveal animation="slide-left">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-navy leading-tight mb-2">
              Hola,
              <br />
              soy{" "}
              <span className="font-script text-shimmer text-4xl md:text-5xl">
                Cata
              </span>
            </h2>
            <p className="font-serif text-xl md:text-2xl font-light text-navy/80 italic mb-8">
              {data.titulo}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="slide-left" delay={100}>
            <p className="text-base lg:text-lg text-text/80 font-light leading-relaxed mb-4">
              Licenciada con años de experiencia acompañando pymes y
              emprendedores a construir negocios que funcionan, no solo que
              existen. Mi trabajo es construir{" "}
              <strong className="font-medium text-navy">puentes estratégicos</strong>{" "}
              entre donde estás hoy y donde querés llegar.
            </p>
            <p className="text-base lg:text-lg text-text/80 font-light leading-relaxed mb-8">
              Creo que la estrategia sin propósito es ruido, y el propósito sin
              acción es solo una idea bonita. Mi trabajo es unir esas dos cosas
              y ayudarte a moverte con claridad.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="slide-left" delay={200}>
            <div className="border-y border-beige py-6 mb-8 flex items-start gap-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-navy shrink-0 mt-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="font-serif text-xl md:text-2xl italic text-accent leading-snug">
                &ldquo;{data.cita}&rdquo;
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slide-left" delay={300}>
            <p className="text-xs tracking-widest uppercase font-semibold text-navy/75 mb-4">
              Áreas de expertise
            </p>
          </ScrollReveal>
          <ScrollReveal animation="stagger" delay={300}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.expertise?.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-accent shrink-0">
                    <path
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-navy/80">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
