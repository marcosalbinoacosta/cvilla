"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const highlights = [
  "Definí tu estrategia",
  "Ordená tu negocio",
  "Crecé con propósito",
];

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.15}px) scale(${1 + y * 0.0002})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen bg-cream relative overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-screen">
        {/* Image — left side with parallax */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-full md:min-h-screen overflow-hidden">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/hero.webp"
              quality={95}
              alt="Catalina Villafañe, consultora de negocios"
              fill
              className={`object-cover object-top relative z-10 rounded-t-full shadow-2xl shadow-navy/10 transition-all duration-[1.5s] ${
                loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
              priority
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          {/* Soft fade into white on the right edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream pointer-events-none hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Content — right side */}
        <div className="px-6 py-12 md:px-12 lg:px-16 md:py-20 z-10">
          {/* Decorative accent line */}
          <div
            className={`w-16 h-[2px] bg-gradient-to-r from-accent to-accent-light mb-8 transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 scale-x-100 origin-left" : "opacity-0 scale-x-0 origin-left"
            }`}
          />

          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-[1.15] text-navy mb-6">
            <span
              className={`inline-block italic transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Negocios que
            </span>
            <br />
            <span
              className={`inline-block italic transition-all duration-700 delay-150 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              crecen con
            </span>{" "}
            <span
              className={`inline-block font-script text-shimmer text-5xl md:text-6xl lg:text-7xl not-italic transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              estrategia
            </span>
            <br />
            <span
              className={`inline-block italic transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              y propósito.
            </span>
          </h1>

          <p
            className={`font-serif text-lg md:text-xl italic text-navy/60 mb-10 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "550ms" }}
          >
            Creo en crecer con propósito, principios firmes y decisiones que
            construyen negocios sólidos. Si buscás eso, este espacio es para vos.
          </p>

          {/* Bullet points */}
          <div className="space-y-4 mb-12">
            {highlights.map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3 transition-all duration-600 ${
                  loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${650 + i * 100}ms` }}
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-accent to-accent-light shrink-0" />
                <span className="font-serif text-base md:text-lg text-navy/80 italic">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "950ms" }}
          >
            <a
              href="#servicios"
              className="magnetic-btn btn-gradient text-white text-center text-xs font-medium uppercase tracking-widest px-8 py-4"
            >
              Conocé mis servicios
            </a>
            <a
              href="#contacto"
              className="magnetic-btn border border-navy text-navy text-center text-xs font-medium uppercase tracking-widest px-7 py-4 opacity-70 hover:opacity-100 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
            >
              Hablemos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
