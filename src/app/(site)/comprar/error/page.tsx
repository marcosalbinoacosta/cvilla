import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No se pudo completar el pago",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="max-w-lg text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Pago rechazado
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          Tu pago no pudo completarse
        </h1>
        <p className="text-sm md:text-base text-text/80 leading-relaxed mb-8">
          Podés intentar nuevamente o probar con otro medio de pago. Si el
          problema persiste, contactanos y te ayudamos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/programa-virtuosa"
            className="bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
          >
            Probar de nuevo
          </Link>
          <Link
            href="/#contacto"
            className="border border-navy text-navy text-xs uppercase tracking-widest px-8 py-4 hover:bg-navy hover:text-white transition-colors"
          >
            Contactar
          </Link>
        </div>
      </div>
    </main>
  );
}
