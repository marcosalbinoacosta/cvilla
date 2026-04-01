import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function Servicios() {
  return (
    <section id="servicios" className="bg-cream py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">
            Lo que hago
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-navy">
            Servicios{" "}
            <span className="font-script text-gold">diseñados</span> para vos
          </h2>
        </ScrollReveal>

        {/* Featured — Virtuosa */}
        <ScrollReveal className="mb-6">
          <div className="group relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[420px] flex items-end">
            <Image
              src="/images/charla.webp"
              alt="Programa Virtuosa"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />

            <div className="relative z-10 p-6 md:p-8 lg:p-14 w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 lg:gap-16 items-end">
              <div>
                <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-2">
                  01 &middot; Programa
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">
                  Virtuosa
                </h3>
                <p className="text-sm md:text-base text-cream/90 font-light leading-relaxed mb-3">
                  El poder de crear ya está en vos. Es hora de activarlo.
                </p>
                <p className="text-sm md:text-base text-cream/70 font-light leading-relaxed mb-3">
                  Si ya empezaste pero tu negocio está estancado o desordenado,
                  este programa te ayuda a recuperar claridad y definir estrategia
                  para crear con base sólida.
                </p>
                <p className="text-sm md:text-base text-cream/70 font-light leading-relaxed mb-3">
                  Vas a definir y avanzar con lo que tenés que hacer y dejar de
                  hacer para dar primeros pasos y vender.
                </p>
                <p className="text-xs tracking-wider uppercase text-gold/80 font-medium">
                  4 módulos prácticos &middot; 2 horas de pura estrategia, mentalidad y acción
                </p>
              </div>
              <div className="md:text-right">
                <a
                  href="#"
                  className="inline-block bg-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-4 hover:bg-gold/85 transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                >
                  Comprar el programa
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Secondary — Mentoría & Charlas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal delay={100}>
            <div className="group p-8 md:p-10 bg-navy border border-navy h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-navy/20">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-white/10 group-hover:text-white/15 transition-colors duration-500">
                02
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-2">
                1 a 1
              </p>
              <h3 className="font-serif text-2xl font-normal text-white mb-4 leading-tight">
                Mentoría
              </h3>
              <p className="text-sm text-cream/70 font-light leading-relaxed mb-4 flex-1">
                Espacio privado para emprendedoras que quieran mirar su negocio,
                hacer preguntas, pensar estrategias y trabajar en lo que realmente
                necesitan para ordenar y escalar su negocio.
              </p>
              <p className="text-sm text-cream/55 font-light leading-relaxed mb-8">
                Las mentorías NO son un acompañamiento genérico, es un proceso
                de transformación donde pongo mi experiencia, conocimiento y
                mirada crítica al servicio de tu negocio.
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-gold transition-all duration-300 group-hover:gap-3"
              >
                Sumarme a la lista
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="group p-8 md:p-10 bg-white border border-beige/60 h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-beige/40 hover:border-gold/30">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-beige group-hover:text-gold/30 transition-colors duration-500">
                03
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-2">
                Eventos
              </p>
              <h3 className="font-serif text-2xl font-normal text-navy mb-4 leading-tight">
                Charlas y Talleres
              </h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 flex-1">
                Liderazgo, comunicación, equipos de alto rendimiento, gestión de
                proyectos exitosos. Temáticas adaptables a tu equipo o evento.
                Consultoría corporativa disponible.
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-navy transition-all duration-300 group-hover:gap-3"
              >
                Consultar disponibilidad
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
