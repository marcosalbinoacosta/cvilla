import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago en proceso",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="max-w-lg text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          En revisión
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          Tu pago está en proceso
        </h1>
        <p className="text-sm md:text-base text-text/80 leading-relaxed mb-8">
          Mercado Pago está revisando tu pago. En cuanto se acredite te
          enviamos un mail con el acceso al aula. Suele tardar unos minutos.
        </p>
        <Link
          href="/"
          className="inline-block bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
