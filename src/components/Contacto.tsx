import ScrollReveal from "./ScrollReveal";

export default function Contacto() {
  return (
    <section id="contacto" className="bg-cream py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
        {/* Left — text content */}
        <ScrollReveal>
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">
            Contacto
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-navy mb-4">
            ¿Hablamos?
          </h2>
          <p className="font-serif italic text-base md:text-lg text-gray-400 mb-8">
            Contame en qué estás trabajando y cómo puedo ayudarte.
          </p>
          <div className="space-y-4 text-sm text-navy/70 font-light">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gold shrink-0">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>hola@catalinavillafane.com</span>
            </div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gold shrink-0">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Right — form */}
        <ScrollReveal delay={150}>
          <form className="text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-navy transition-colors duration-300"
              />
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-navy transition-colors duration-300"
              />
            </div>
            <textarea
              placeholder="¿En qué puedo ayudarte?"
              rows={5}
              className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-navy transition-colors duration-300 resize-none mb-6"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-navy text-white text-xs font-medium uppercase tracking-widest px-10 py-4 hover:bg-navy/90 transition-all duration-300 hover:shadow-lg hover:shadow-navy/20"
            >
              Enviar mensaje
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
