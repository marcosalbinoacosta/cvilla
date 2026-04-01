import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const testimonios = [
  {
    quote:
      "Cata me ayudó a ver mi negocio desde otro lugar. En pocas sesiones pasé de sentirme abrumada a tener un plan claro y ejecutable.",
    name: "María L.",
    role: "Emprendedora",
  },
  {
    quote:
      "El programa Virtuosa fue un antes y un después. Estrategia real, sin vueltas, con alguien que genuinamente quiere que te vaya bien.",
    name: "Luciana R.",
    role: "Fundadora de marca",
  },
  {
    quote:
      "La charla que dio en nuestra empresa fue transformadora. El equipo salió motivado y con herramientas concretas para aplicar al día siguiente.",
    name: "Martín D.",
    role: "Director de operaciones",
  },
];

export default function Testimonios() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/charla-grupo.webp"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/85" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">
            Testimonios
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream">
            Historias de{" "}
            <span className="font-script text-gold">transformación</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 120}>
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 border border-cream/10 h-full flex flex-col transition-all duration-500 hover:bg-white/15 hover:border-gold/20">
                {/* Quote mark */}
                <span className="font-serif text-5xl text-gold/40 leading-none mb-4">&ldquo;</span>
                <p className="font-serif text-base md:text-lg italic text-cream/90 leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="mt-8 pt-6 border-t border-cream/10">
                  <p className="text-sm font-medium text-cream">{t.name}</p>
                  <p className="text-xs text-gold tracking-wider uppercase mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
