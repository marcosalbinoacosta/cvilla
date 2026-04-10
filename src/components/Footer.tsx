"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
    <footer ref={ref} className="bg-navy px-6 md:px-12 lg:px-20 pt-14 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Top — multi-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pb-10 border-b border-cream/10">
          {/* Brand */}
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="font-serif text-xl text-cream font-light mb-3">
              Catalina{" "}
              <span className="font-script text-accent-light text-2xl">
                Villafañe
              </span>
            </p>
            <p className="text-xs text-cream/60 leading-relaxed max-w-xs">
              Consultora &amp; Mentora de Negocios. Ayudo a pymes y
              emprendedores a crecer con estrategia y propósito.
            </p>
          </div>

          {/* Navigation */}
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <p className="text-[0.68rem] tracking-[0.14em] uppercase text-accent-light mb-4 font-medium">
              Navegación
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#proposito", label: "Mi propósito" },
                { href: "#servicios", label: "Servicios" },
                { href: "#sobre-mi", label: "Sobre mí" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-cream/70 hover:text-cream/90 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & contact */}
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[0.68rem] tracking-[0.14em] uppercase text-accent-light mb-4 font-medium">
              Conectemos
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cream/70 hover:text-cream/90 transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cream/70 hover:text-cream/90 transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@catalinavillafane.com"
                  className="text-xs text-cream/70 hover:text-cream/90 transition-colors duration-300"
                >
                  hola@catalinavillafane.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-3 pt-6 transition-all duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <p className="text-[0.65rem] text-cream/50 tracking-wide">
            &copy; 2026 Catalina Villafañe. Todos los derechos reservados.
          </p>
          <a
            href="#"
            className="text-[0.65rem] text-cream/50 hover:text-cream/70 transition-colors tracking-wide"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
