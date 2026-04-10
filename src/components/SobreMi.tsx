"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const valores = [
  "Líder de Transformación Digital en pymes",
  "Liderazgo y comunicación",
  "Equipos de alto rendimiento",
  "Gestión de proyectos exitosos",
  "Crecimiento de negocio con principios",
];

export default function SobreMi() {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [imgVisible, setImgVisible] = useState(false);

  useEffect(() => {
    const el = imgContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sobre-mi"
      className="bg-cream py-20 md:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Image with clip-path reveal */}
        <div ref={imgContainerRef} className="relative">
          <div
            className="overflow-hidden rounded-sm"
            style={{
              clipPath: imgVisible ? "inset(0 0 0 0)" : "inset(50% 0 50% 0)",
              transition: "clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Image
              src="/images/sobre-mi-new.webp"
              alt="Catalina Villafañe"
              width={600}
              height={750}
              className={`w-full h-auto aspect-[3/4] object-cover object-center transition-transform duration-[1.5s] ${
                imgVisible ? "scale-100" : "scale-110"
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Decorative frame */}
          <div
            className={`absolute -bottom-4 -right-4 w-36 h-36 border border-accent/30 pointer-events-none hidden md:block transition-all duration-1000 delay-500 ${
              imgVisible ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 translate-x-4 translate-y-4"
            }`}
          />
          <div
            className={`absolute -top-3 -left-3 w-20 h-20 border-t border-l border-accent/20 pointer-events-none hidden md:block transition-all duration-1000 delay-700 ${
              imgVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Content */}
        <div>
          <ScrollReveal animation="blur-in">
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-navy/60 mb-4">
              Quién soy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-navy leading-tight mb-6">
              Hola,
              <br />
              soy{" "}
              <span className="font-script text-shimmer text-4xl md:text-5xl">
                Cata
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100} animation="fade-up">
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-4">
              Licenciada con años de experiencia acompañando pymes y
              emprendedores a construir negocios que funcionan, no solo que
              existen. Creo que la estrategia sin propósito es ruido, y el
              propósito sin acción es solo una idea bonita.
            </p>
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-8">
              Mi trabajo es unir esas dos cosas y ayudarte a moverte con
              claridad.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200} animation="stagger">
            {valores.map((v) => (
              <div
                key={v}
                className="flex items-center gap-3 text-sm text-navy font-normal group py-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-accent to-accent-light shrink-0 transition-transform duration-300 group-hover:scale-150" />
                <span className="transition-colors duration-300 group-hover:text-accent">
                  {v}
                </span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
