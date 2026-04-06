"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const testimonios = [
  {
    quote:
      "Fue un proceso de transformación para mi negocio. En cada encuentro pude conocer nuevas herramientas, diseñar mis objetivos y me regalaste una mirada nueva sobre mi negocio.",
    name: "Lic. Sabrina Peña",
    role: "Asesora en capacitación",
    image: "/images/testimonio-1.webp",
  },
  {
    quote:
      "Nos ayudó a ordenar nuestro negocio y darnos cuenta de todo lo que no sabíamos. Es una persona muy clara, firme y siempre enfocada hacia adelante.",
    name: "Brenda Ayen",
    role: "Carlos Ayen Joyas",
    image: "/images/testimonio-2.webp",
  },
  {
    quote:
      "Me ayudó a entender la importancia del valor de mi producto. Hoy tengo una mirada completamente distinta de mi negocio. Se los recomiendo porque realmente vale la pena.",
    name: "Florencia",
    role: "Diseño de moda",
    image: "/images/testimonio-3.webp",
  },
  {
    quote:
      "Es súper atenta, me escuchó y me dio herramientas para ordenar mi negocio. Ahora trabajo más enfocada y mis ideas se van convirtiendo en resultados.",
    name: "Gina Bazan",
    role: "Emprendedora gastronómica",
    image: "/images/testimonio-4.webp",
  },
  {
    quote:
      "Me ayudó a darle forma a mi negocio y a trabajar de manera estratégica. Es una persona comprometida, clara y con una energía que te impulsa a avanzar.",
    name: "Gisela Caffaro",
    role: "Consultora en CI",
    image: "/images/testimonio-5.webp",
  },
  {
    quote:
      "Transformó mi manera de ver y llevar adelante mi negocio. Me dio herramientas concretas para planificar y organizarme. Un proceso de transformación que recomiendo muchísimo.",
    name: "Alejandra Sil",
    role: "Psicóloga",
    image: "/images/testimonio-6.webp",
  },
];

function TestimonioCard({ t }: { t: (typeof testimonios)[number] }) {
  return (
    <div className="w-[340px] md:w-[400px] shrink-0">
      <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 border border-cream/10 h-full flex flex-col transition-all duration-500 hover:bg-white/15 hover:border-gold/20">
        <span className="font-serif text-5xl text-gold/40 leading-none mb-4">
          &ldquo;
        </span>
        <p className="font-serif text-base md:text-lg italic text-cream/90 leading-relaxed flex-1">
          {t.quote}
        </p>
        <div className="mt-8 pt-6 border-t border-cream/10 flex items-center gap-4">
          {t.image && (
            <Image
              src={t.image}
              alt={t.name}
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11"
            />
          )}
          <div>
            <p className="text-sm font-medium text-cream">{t.name}</p>
            <p className="text-xs text-gold tracking-wider uppercase mt-0.5">
              {t.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonios() {
  return (
    <section id="testimonios" className="relative py-20 md:py-32 overflow-hidden">
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

      <div className="relative z-10">
        <ScrollReveal className="text-center mb-16 px-6">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">
            Testimonios
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream">
            Historias de{" "}
            <span className="font-script text-gold">transformación</span>
          </h2>
        </ScrollReveal>

        {/* Marquee — pauses on hover */}
        <div className="group relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-navy/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-navy/90 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="flex gap-8 animate-marquee group-hover:[animation-play-state:paused]">
              {/* Original set */}
              {testimonios.map((t) => (
                <TestimonioCard key={t.name} t={t} />
              ))}
              {/* Duplicate for seamless loop */}
              {testimonios.map((t) => (
                <TestimonioCard key={`dup-${t.name}`} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
