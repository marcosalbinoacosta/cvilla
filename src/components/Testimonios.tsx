"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

type Testimonio = {
  _id: string;
  nombre: string;
  rol: string;
  cita: string;
  fotoUrl?: string;
};

const CARD_SLOT = 400 + 32;

function TestimonioCard({ t }: { t: Testimonio }) {
  return (
    <div className="w-[340px] md:w-[400px] shrink-0">
      <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 border border-cream/10 h-full flex flex-col transition-all duration-500 hover:bg-white/15 hover:border-accent-light/30 hover:-translate-y-1">
        <span className="font-serif text-5xl text-accent-light/40 leading-none mb-4">
          &ldquo;
        </span>
        <p className="font-serif text-base md:text-lg italic text-cream/90 leading-relaxed flex-1">
          {t.cita}
        </p>
        <div className="mt-8 pt-6 border-t border-cream/10 flex items-center gap-4">
          {t.fotoUrl && (
            <Image
              src={t.fotoUrl}
              alt={t.nombre}
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11 ring-2 ring-accent-light/20"
            />
          )}
          <div>
            <p className="text-sm font-medium text-cream">{t.nombre}</p>
            <p className="text-xs text-accent-light tracking-wider uppercase mt-0.5">
              {t.rol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const oneSetWidth = testimonios.length * CARD_SLOT;

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * 0.3;
      el.style.transform = `translateY(${offset}px) scale(1.15)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="testimonios"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-[-15%] will-change-transform">
          <Image
            src="/images/charla-grupo.webp"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 bg-navy/85" />
      </div>

      <div className="relative z-10">
        <ScrollReveal className="text-center mb-16 px-6" animation="blur-in">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-accent-light mb-3">
            Testimonios
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream">
            Historias de{" "}
            <span className="font-script text-accent-light">transformación</span>
          </h2>
        </ScrollReveal>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-navy/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-navy/90 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div
              className="flex gap-8 will-change-transform"
              style={{
                animation: "marquee 40s linear infinite",
                animationPlayState: paused ? "paused" : "running",
                ["--marquee-offset" as string]: `-${oneSetWidth}px`,
              }}
            >
              {testimonios.map((t) => (
                <TestimonioCard key={t._id} t={t} />
              ))}
              {testimonios.map((t) => (
                <TestimonioCard key={`dup-${t._id}`} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
