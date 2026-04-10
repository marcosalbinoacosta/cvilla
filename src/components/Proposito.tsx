"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Proposito() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
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

  // Parallax on image
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * 0.08;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          {/* Animated line top */}
          <div
            className={`h-[2px] bg-gradient-to-r from-accent-light via-accent to-transparent mb-10 transition-all duration-[1.2s] ease-out ${
              visible ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          />

          <p
            className={`text-[0.7rem] tracking-[0.2em] uppercase text-accent-light mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Mi propósito
          </p>

          <p
            className={`font-serif text-2xl md:text-3xl lg:text-4xl font-light italic text-cream leading-snug mb-10 max-w-lg transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[6px]"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Ayudar a pymes y emprendedores
            <br className="hidden md:block" /> a crecer con{" "}
            <span className="font-script text-accent-light not-italic">
              principios.
            </span>
          </p>

          <div
            className={`max-w-md space-y-5 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "600ms" }}
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

          {/* Animated line bottom */}
          <div
            className={`h-[2px] bg-gradient-to-r from-accent-light via-accent to-transparent mt-10 transition-all duration-[1.2s] ease-out ${
              visible ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          />
        </div>

        {/* Image with parallax + clip reveal */}
        <div
          className={`relative hidden md:block w-[340px] lg:w-[420px] self-stretch overflow-hidden transition-all duration-[1.2s] ${
            visible ? "clip-path-[inset(0)] opacity-100" : "clip-path-[inset(0_100%_0_0)] opacity-0"
          }`}
          style={{
            clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transitionDelay: "300ms",
          }}
        >
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/cata-proposito.webp"
              alt="Catalina Villafañe"
              fill
              className="object-cover object-top"
            />
          </div>
          {/* Fade left edge into navy */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-transparent w-1/3" />
          {/* Fade bottom edge */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
