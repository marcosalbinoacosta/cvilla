import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No pudimos ingresarte",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const mensajes: Record<string, string> = {
    Verification: "El link expiró o ya fue usado. Pedí uno nuevo.",
    AccessDenied: "No tenés acceso a este recurso.",
    Configuration: "Hay un problema de configuración. Avisanos.",
  };
  const mensaje = (error && mensajes[error]) ?? "No pudimos completar el ingreso.";

  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Algo salió mal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          No pudimos ingresarte
        </h1>
        <p className="text-sm text-text/80 leading-relaxed mb-8">{mensaje}</p>
        <Link
          href="/ingresar"
          className="inline-block bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
        >
          Volver a intentar
        </Link>
      </div>
    </main>
  );
}
