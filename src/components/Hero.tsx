import Image from "next/image";

const highlights = [
  "Definí tu estrategia",
  "Ordená tu negocio",
  "Crecé con propósito",
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="min-h-screen bg-white relative overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-screen">
        {/* Image — left side, natural flow */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-full md:min-h-screen">
          <Image
            src="/images/hero.webp"
            alt="Catalina Villafañe"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Soft fade into white on the right edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Content — right side */}
        <div className="px-6 py-12 md:px-12 lg:px-16 md:py-20 z-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-[1.15] text-navy mb-6 animate-fade-up">
            <span className="italic">Negocios que</span>
            <br />
            <span className="italic">crecen con</span>{" "}
            <span className="font-script text-gold text-5xl md:text-6xl lg:text-7xl not-italic">
              estrategia
            </span>
            <br />
            <span className="italic">y propósito.</span>
          </h1>

          <p className="font-serif text-lg md:text-xl italic text-navy/60 mb-10 animate-fade-up" style={{ animationDelay: "150ms" }}>
            Es momento de construir con base sólida.
          </p>

          {/* Bullet points with decorative icons */}
          <div className="space-y-4 mb-12 animate-fade-up" style={{ animationDelay: "300ms" }}>
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gold shrink-0">
                  <path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.82 20 12 16.54 7.18 20l1.64-6.91L3.82 9l6.09-.74L12 2z" fill="currentColor" opacity="0.6" />
                </svg>
                <span className="font-serif text-base md:text-lg text-navy/80 italic">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "450ms" }}>
            <a
              href="#servicios"
              className="bg-navy text-white text-center text-xs font-medium uppercase tracking-widest px-8 py-4 hover:bg-navy/90 transition-all duration-300 hover:shadow-lg hover:shadow-navy/20"
            >
              Conocé mis servicios
            </a>
            <a
              href="#contacto"
              className="border border-navy text-navy text-center text-xs font-medium uppercase tracking-widest px-7 py-4 opacity-70 hover:opacity-100 hover:bg-navy hover:text-white transition-all duration-300"
            >
              Hablemos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
