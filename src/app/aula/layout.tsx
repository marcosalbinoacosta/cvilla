import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Inter, Dancing_Script } from "next/font/google";
import "../globals.css";
import { auth, signOut } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { contarNoLeidosAdmin, contarNoLeidosAlumno } from "@/lib/mensajes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});
const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: { default: "Aula", template: "%s · Aula — Catalina Villafañe" },
  robots: { index: false, follow: false },
};

function inicial(nombre?: string | null, email?: string | null): string {
  const base = (nombre?.trim() || email?.trim() || "?")[0];
  return base.toUpperCase();
}

export default async function AulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const admin = isAdmin(session?.user?.email);
  const noLeidos = session?.user?.id
    ? admin
      ? await contarNoLeidosAdmin()
      : await contarNoLeidosAlumno(session.user.id)
    : 0;

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div
      className={`${inter.variable} ${cormorant.variable} ${dancingScript.variable} antialiased min-h-screen bg-cream flex flex-col`}
    >
      <header className="sticky top-0 z-30 glass border-b border-beige">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <Link
            href="/aula"
            className="font-serif text-navy text-lg md:text-xl tracking-wide shrink-0"
          >
            Catalina Villafañe{" "}
            <span className="text-accent font-script">· Aula</span>
          </Link>

          {session?.user && (
            <nav className="flex items-center gap-1 sm:gap-2 text-sm">
              <Link
                href="/aula"
                className="px-3 py-2 text-xs tracking-wider uppercase text-navy/75 hover:text-accent transition-colors"
              >
                {admin ? "Cursos" : "Mis cursos"}
              </Link>
              <Link
                href="/aula/mensajes"
                className="relative px-3 py-2 text-xs tracking-wider uppercase text-navy/75 hover:text-accent transition-colors"
              >
                Mensajes
                {noLeidos > 0 && (
                  <span className="ml-1.5 inline-grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-medium align-middle">
                    {noLeidos}
                  </span>
                )}
              </Link>

              <span className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-beige">
                <span
                  aria-hidden
                  className="grid place-items-center w-8 h-8 rounded-full bg-navy text-white text-xs font-medium"
                >
                  {inicial(session.user.name, session.user.email)}
                </span>
                <span className="text-text/60 text-xs max-w-[140px] truncate">
                  {session.user.name ?? session.user.email}
                </span>
              </span>

              <form action={logout} className="ml-1 sm:ml-2">
                <button
                  type="submit"
                  className="text-xs tracking-wider uppercase text-navy/60 hover:text-accent transition-colors px-2 py-2"
                >
                  Salir
                </button>
              </form>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {children}
      </main>

      <footer className="border-t border-beige">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 text-center text-[11px] tracking-wider uppercase text-text/40">
          Catalina Villafañe · Aula Virtual
        </div>
      </footer>
    </div>
  );
}
