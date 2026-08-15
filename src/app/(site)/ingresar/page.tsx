import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Accedé al aula de Emprendé con Confianza.",
  robots: { index: false, follow: false },
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  async function submit(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: callbackUrl ?? "/aula",
    });
  }

  return (
    <main className="min-h-[80vh] grid place-items-center px-6 py-20 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
            Aula · Catalina Villafañe
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-navy font-light">
            Ingresar
          </h1>
          <p className="text-sm text-text/75 mt-4">
            Ingresá tu email y te mandamos un link de acceso. Sin contraseñas.
          </p>
        </div>

        <form action={submit} className="bg-white border border-beige p-8">
          <label
            htmlFor="email"
            className="block text-xs tracking-wider uppercase text-navy/75 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@email.com"
            className="w-full px-4 py-3.5 border border-beige bg-white text-sm text-text outline-none focus:border-accent transition-colors mb-5"
          />
          <button
            type="submit"
            className="w-full bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
          >
            Enviarme el link
          </button>
        </form>

        <p className="text-xs text-center text-text/60 mt-6">
          ¿No compraste todavía?{" "}
          <Link
            href="/programa-virtuosa"
            className="text-navy underline hover:text-accent"
          >
            Ver Emprendé con Confianza
          </Link>
        </p>
      </div>
    </main>
  );
}
