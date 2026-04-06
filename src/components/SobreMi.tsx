import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const valores = [
  "Líder de Transformación Digital en pymes",
  "Liderazgo y comunicación",
  "Equipos de alto rendimiento",
  "Gestión de proyectos exitosos",
  "Crecimiento de negocio con principios",
];

export default function SobreMi() {
  return (
    <section id="sobre-mi" className="bg-white py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <ScrollReveal className="relative">
          <Image
            src="/images/sobre-mi-new.webp"
            alt="Catalina Villafañe"
            width={600}
            height={750}
            className="w-full h-auto aspect-[3/4] object-cover object-center rounded-sm"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute -bottom-4 -right-4 w-36 h-36 border border-gold/40 pointer-events-none hidden md:block" />
        </ScrollReveal>

        {/* Content */}
        <div>
          <ScrollReveal>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-4">
              Quién soy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-navy leading-tight mb-6">
              Hola,
              <br />
              soy <span className="font-script text-gold text-4xl md:text-5xl">Cata</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-4">
              Licenciada con años de experiencia acompañando pymes y emprendedores
              a construir negocios que funcionan, no solo que existen. Creo que la
              estrategia sin propósito es ruido, y el propósito sin acción es solo
              una idea bonita.
            </p>
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-8">
              Mi trabajo es unir esas dos cosas y ayudarte a moverte con claridad.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-col gap-3">
              {valores.map((v) => (
                <div key={v} className="flex items-center gap-3 text-sm text-navy font-normal group">
                  <span className="text-gold font-serif text-xl transition-transform duration-300 group-hover:scale-125">+</span>
                  <span className="transition-colors duration-300 group-hover:text-gold">{v}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
