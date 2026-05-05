import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getInfoContacto } from "@/sanity/queries";
import VirtuosaPreLanzamiento from "./VirtuosaPreLanzamiento";

const DESCRIPTION =
  "El Programa Virtuosa abre inscripciones en junio 2026. Dejá tu email y te avisamos antes que nadie cuando esté disponible.";

export const metadata: Metadata = {
  title: "Programa Virtuosa — Próximamente",
  description: DESCRIPTION,
  alternates: { canonical: "/programa-virtuosa" },
  openGraph: {
    title: "Programa Virtuosa — Próximamente",
    description: DESCRIPTION,
    url: "/programa-virtuosa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programa Virtuosa — Próximamente",
    description: DESCRIPTION,
  },
};

export const revalidate = 60;

export default async function Page() {
  const contacto = await getInfoContacto();

  return (
    <>
      <Navbar dark />
      <main>
        <VirtuosaPreLanzamiento />
      </main>
      <Footer data={contacto} />
      <WhatsAppButton phone={contacto?.whatsapp} />
    </>
  );
}
