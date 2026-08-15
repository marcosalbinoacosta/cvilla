import type { Metadata } from "next";
import Link from "next/link";
import { reconcileCompra } from "@/lib/mp";

export const metadata: Metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ compra?: string }>;
}) {
  const { compra } = await searchParams;
  const result = compra ? await reconcileCompra(compra) : null;
  const acreditado = result?.status === "approved";
  const pendiente = result?.status === "pending";

  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="max-w-lg text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          {pendiente ? "Pago en proceso" : "Compra confirmada"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          {pendiente ? "Estamos confirmando tu pago" : "¡Gracias!"}
        </h1>
        {pendiente ? (
          <p className="text-sm md:text-base text-text/80 leading-relaxed mb-8">
            Tu pago se está acreditando. En cuanto se confirme, te habilitamos el
            acceso y te llega un email con el link para entrar. Suele tardar unos
            minutos.
          </p>
        ) : (
          <p className="text-sm md:text-base text-text/80 leading-relaxed mb-8">
            {acreditado
              ? "Tu acceso al aula ya está activo. Ingresá con tu email y te enviamos un link para entrar."
              : "Te enviamos un email con el link para entrar al aula. Si no lo ves, revisá la carpeta de spam o promociones."}
          </p>
        )}
        <Link
          href="/ingresar"
          className="inline-block bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
        >
          Ir al aula
        </Link>
      </div>
    </main>
  );
}
