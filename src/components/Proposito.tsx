"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Proposito() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="proposito"
      ref={sectionRef}
      className="relative bg-navy overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] items-center">
        {/* Text content */}
        <div className="py-20 md:py-32 px-6 md:px-12 lg:px-20 relative z-10">
          {/* Animated gold line top */}
          <div
            className={`h-px bg-gradient-to-r from-gold-light to-transparent mb-10 transition-all duration-1000 ease-out ${
              visible ? "w-24 opacity-100" : "w-0 opacity-0"
            }`}
          />

          <p
            className={`text-[0.7rem] tracking-[0.2em] uppercase text-gold-light mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Mi propósito
          </p>

          <p
            className={`font-serif text-2xl md:text-3xl lg:text-4xl font-light italic text-cream leading-snug mb-10 max-w-lg transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Ayudar a pymes y emprendedores
            <br className="hidden md:block" /> a crecer con{" "}
            <span className="font-script text-gold-light not-italic">
              principios.
            </span>
          </p>

          <div
            className={`max-w-md space-y-5 transition-all duration-700 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-cream/85 text-sm md:text-base font-light leading-relaxed">
              Creo en negocios construidos con base sólida, donde la estrategia
              no está separada de los valores, y donde crecer no significa perder
              el rumbo.
            </p>
            <p className="text-cream/85 text-sm md:text-base font-light leading-relaxed">
              Mi trabajo es acompañarte a tomar decisiones más claras, ordenar lo
              que ya tenés y avanzar con dirección. Porque el poder de crear ya
              está en vos.
            </p>
          </div>

          {/* Animated gold line bottom */}
          <div
            className={`h-px bg-gradient-to-r from-gold-light to-transparent mt-10 transition-all duration-1000 delay-700 ease-out ${
              visible ? "w-24 opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>

        {/* Image — blends naturally thanks to dark background */}
        <div
          className={`relative hidden md:block w-[340px] lg:w-[420px] self-stretch transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <Image
            src="/images/cata-proposito.webp"
            alt="Catalina Villafañe"
            fill
            className="object-cover object-top"
          />
          {/* Fade left edge into navy */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-transparent w-1/3" />
          {/* Fade bottom edge */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
