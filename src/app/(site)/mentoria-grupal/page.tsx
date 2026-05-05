import type { Metadata } from "next";
import MentoriaGrupalContent from "./MentoriaGrupalContent";

const DESCRIPTION =
  "Espacio de crecimiento compartido para emprendedoras que quieren aprender, desafiarse y avanzar juntas con estrategia y acompañamiento.";

export const metadata: Metadata = {
  title: "Mentoría Grupal",
  description: DESCRIPTION,
  alternates: { canonical: "/mentoria-grupal" },
  openGraph: {
    title: "Mentoría Grupal — Catalina Villafañe",
    description: DESCRIPTION,
    url: "/mentoria-grupal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentoría Grupal — Catalina Villafañe",
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <MentoriaGrupalContent />;
}
