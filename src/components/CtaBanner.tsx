"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";

export default function CtaBanner() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax background
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * 0.25;
      el.style.transform = `translateY(${offset}px) scale(1.2)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      {/* Background image with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-[-20%] will-change-transform">
          <Image
            src="/images/speaker-stage.webp"
            alt=""
            fill
            className="object-cover object-[center_25%]"
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      <ScrollReveal
        className="max-w-3xl mx-auto text-center relative z-10 px-6"
        animation="blur-in"
      >
        <p className="text-[0.72rem] tracking-[0.18em] uppercase text-accent-light mb-6">
          Da el próximo paso
        </p>
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light italic text-cream leading-snug mb-6">
          Tu negocio merece crecer con{" "}
          <span className="font-script text-accent-light not-italic">
            dirección
          </span>{" "}
          y{" "}
          <span className="font-script text-accent-light not-italic">
            propósito.
          </span>
        </p>
        <p className="text-cream/60 text-sm md:text-base font-light mb-10 max-w-lg mx-auto">
          Si sentís que es momento de dar el próximo paso, empecemos a trabajar
          juntas.
        </p>
        <a
          href="#contacto"
          className="magnetic-btn pulse-glow btn-gradient inline-block text-white text-xs font-medium uppercase tracking-widest px-10 py-4"
        >
          Quiero empezar
        </a>
      </ScrollReveal>
    </section>
  );
}
