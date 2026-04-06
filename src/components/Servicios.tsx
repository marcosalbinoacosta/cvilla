import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const charlasImages = [
  { src: "/images/charla2.webp", w: 800, h: 533 },
  { src: "/images/charla3.webp", w: 800, h: 532 },
  { src: "/images/charla4.webp", w: 800, h: 1199 },
  { src: "/images/charla5.webp", w: 800, h: 1422 },
  { src: "/images/charla6.webp", w: 800, h: 532 },
  { src: "/images/charla7.webp", w: 800, h: 532 },
  { src: "/images/charla8.webp", w: 800, h: 1200 },
  { src: "/images/charla9.webp", w: 800, h: 1422 },
];

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

        {/* 01 — Virtuosa (full-width) */}
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
                <p className="text-sm tracking-[0.14em] uppercase text-cream/90 mb-2 font-medium">
                  01 &middot; Programa
                </p>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight">
                  Virtuosa
                </h3>
                <p className="font-serif text-xl md:text-2xl lg:text-3xl italic text-cream mb-5 leading-snug">
                  Es hora de <span className="font-script text-gold-light not-italic">dar el próximo paso.</span>
                </p>
                <p className="text-sm md:text-base tracking-wider uppercase text-gold-light font-medium mb-5">
                  4 módulos prácticos &middot; 2 horas de pura estrategia, mentalidad y acción
                </p>
                <p className="text-sm md:text-base text-cream/80 font-light leading-relaxed mb-3">
                  Si ya empezaste pero tu negocio está estancado o desordenado,
                  este programa te ayuda a recuperar claridad y definir estrategia
                  para crear con base sólida.
                </p>
                <p className="text-sm md:text-base text-cream/80 font-light leading-relaxed mb-5">
                  Vas a definir y avanzar con lo que tenés que hacer y dejar de
                  hacer para dar el próximo paso y vender.
                </p>
              </div>
              <div className="md:text-right">
                <a
                  href="#"
                  className="inline-block bg-gold text-white text-xs md:text-sm font-medium uppercase tracking-widest px-8 py-4 hover:bg-gold/85 transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
                >
                  Da el próximo paso
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 02 & 03 — Mentorías (2 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ScrollReveal delay={100}>
            <div className="group p-8 md:p-10 bg-navy border border-navy h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-navy/20">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-white/10 group-hover:text-white/15 transition-colors duration-500">
                02
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold-light mb-2">
                1 a 1
              </p>
              <h3 className="font-serif text-2xl font-normal text-white mb-4 leading-tight">
                Mentoría Individual
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
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-gold-light transition-all duration-300 group-hover:gap-3"
              >
                Sumarme a la lista
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="group p-8 md:p-10 bg-navy border border-navy h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-navy/20">
              <p className="font-serif text-5xl font-light leading-none mb-5 text-white/10 group-hover:text-white/15 transition-colors duration-500">
                03
              </p>
              <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold-light mb-2">
                Grupal
              </p>
              <h3 className="font-serif text-2xl font-normal text-white mb-4 leading-tight">
                Mentoría Grupal
              </h3>
              <p className="text-sm text-cream/70 font-light leading-relaxed mb-4 flex-1">
                Un espacio de crecimiento compartido donde emprendedoras se
                encuentran para aprender, desafiarse y avanzar juntas. Estrategia
                colectiva con la guía y el acompañamiento personalizado de Cata.
              </p>
              <p className="text-sm text-cream/55 font-light leading-relaxed mb-8">
                Grupos reducidos para garantizar atención y resultados reales.
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-gold-light transition-all duration-300 group-hover:gap-3"
              >
                Consultar próximo grupo
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* 04 — Charlas y Talleres (full-width con carrusel de fotos) */}
        <ScrollReveal>
          <div className="bg-white border border-beige/60 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-beige/40">
            {/* Content top */}
            <div className="p-8 md:p-10 lg:p-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                <div>
                  <p className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-2">
                    04 &middot; Eventos
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
                    Charlas y Talleres
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-6">
                    Temáticas adaptables a tu equipo o evento.
                    Consultoría corporativa disponible.
                  </p>
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-navy transition-all duration-300 hover:gap-3"
                  >
                    Consultar disponibilidad
                    <span aria-hidden className="transition-transform duration-300">&rarr;</span>
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Liderazgo", "Comunicación", "Equipos de alto rendimiento", "Gestión de proyectos", "Transformación digital", "Estrategia comercial", "Mentalidad emprendedora"].map((tema) => (
                    <span
                      key={tema}
                      className="text-[0.65rem] tracking-wider uppercase px-3 py-1.5 border border-beige text-navy/70 hover:border-gold/40 hover:text-navy transition-colors duration-300"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo marquee */}
            <div className="group/marquee relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="overflow-hidden">
                <div className="flex items-center gap-4 animate-marquee-slow group-hover/marquee:[animation-play-state:paused]">
                  {charlasImages.map((img, i) => {
                    const height = 260;
                    const width = Math.round((img.w / img.h) * height);
                    return (
                      <div key={i} className="shrink-0 overflow-hidden" style={{ width, height }}>
                        <Image
                          src={img.src}
                          alt={`Charla ${i + 1}`}
                          width={width}
                          height={height}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          sizes={`${width}px`}
                        />
                      </div>
                    );
                  })}
                  {/* Duplicate for seamless loop */}
                  {charlasImages.map((img, i) => {
                    const height = 260;
                    const width = Math.round((img.w / img.h) * height);
                    return (
                      <div key={`dup-${i}`} className="shrink-0 overflow-hidden" style={{ width, height }}>
                        <Image
                          src={img.src}
                          alt={`Charla ${i + 1}`}
                          width={width}
                          height={height}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          sizes={`${width}px`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
