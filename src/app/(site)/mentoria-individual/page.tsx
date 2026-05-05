import type { Metadata } from "next";
import MentoriaIndividualContent from "./MentoriaIndividualContent";

const DESCRIPTION =
  "Espacio privado 1 a 1 para emprendedoras que quieren ordenar, escalar y transformar su negocio con estrategia y acompañamiento personalizado.";

export const metadata: Metadata = {
  title: "Mentoría Individual",
  description: DESCRIPTION,
  alternates: { canonical: "/mentoria-individual" },
  openGraph: {
    title: "Mentoría Individual — Catalina Villafañe",
    description: DESCRIPTION,
    url: "/mentoria-individual",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentoría Individual — Catalina Villafañe",
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <MentoriaIndividualContent />;
}
