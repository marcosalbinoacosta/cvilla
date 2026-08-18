import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getInfoContacto, getCursoBySlug } from "@/sanity/queries";
import VirtuosaPreLanzamiento from "./VirtuosaPreLanzamiento";

const DESCRIPTION =
  "Emprendé con Confianza: en una hora ordenás tus ideas, definís prioridades y das los primeros pasos de tu emprendimiento con más seguridad. Incluye un encuentro grupal en vivo, acceso a la comunidad y beneficios exclusivos.";

export const metadata: Metadata = {
  title: "Emprendé con Confianza — Curso online",
  description: DESCRIPTION,
  alternates: { canonical: "/programa-virtuosa" },
  openGraph: {
    title: "Emprendé con Confianza — Curso online",
    description: DESCRIPTION,
    url: "/programa-virtuosa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emprendé con Confianza — Curso online",
    description: DESCRIPTION,
  },
};

export const revalidate = 60;

export default async function Page() {
  const [contacto, curso] = await Promise.all([
    getInfoContacto(),
    getCursoBySlug("virtuosa"),
  ]);

  return (
    <>
      <Navbar dark />
      <main>
        <VirtuosaPreLanzamiento beneficios={curso?.beneficios} />
      </main>
      <Footer data={contacto} />
      <WhatsAppButton phone={contacto?.whatsapp} />
    </>
  );
}
