import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function CtaBanner() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      {/* Background image with fixed-like effect */}
      <div className="absolute inset-0">
        <Image
          src="/images/speaker-stage.webp"
          alt=""
          fill
          className="object-cover object-[center_25%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      <ScrollReveal className="max-w-3xl mx-auto text-center relative z-10 px-6">
        <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold/80 mb-6">
          Da el próximo paso
        </p>
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light italic text-cream leading-snug mb-6">
          Tu negocio merece crecer con{" "}
          <span className="font-script text-gold not-italic">
            dirección
          </span>{" "}
          y{" "}
          <span className="font-script text-gold not-italic">
            propósito.
          </span>
        </p>
        <p className="text-cream/60 text-sm md:text-base font-light mb-10 max-w-lg mx-auto">
          Si sentís que es momento de dar el próximo paso, empecemos a
          trabajar juntas.
        </p>
        <a
          href="#contacto"
          className="inline-block bg-gold text-white text-xs font-medium uppercase tracking-widest px-10 py-4 hover:bg-gold/85 transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
        >
          Quiero empezar
        </a>
      </ScrollReveal>
    </section>
  );
}
