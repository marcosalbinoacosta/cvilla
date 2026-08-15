import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revisá tu email",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Casi listo
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          Revisá tu email
        </h1>
        <p className="text-sm text-text/80 leading-relaxed">
          Te enviamos un link de acceso. Abrilo desde el mismo dispositivo
          donde querés entrar al aula. El link es válido por 24 horas.
        </p>
        <p className="text-xs text-text/60 mt-6">
          ¿No lo ves? Revisá la carpeta de spam o promociones.
        </p>
      </div>
    </main>
  );
}
