import type { Metadata } from "next";
import { getFaqs, getMentoria } from "@/sanity/queries";
import MentoriaGrupalContent from "./MentoriaGrupalContent";

export const revalidate = 60;

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

export default async function Page() {
  const [faqs, mentoria] = await Promise.all([
    getFaqs("grupal"),
    getMentoria("grupal"),
  ]);
  return <MentoriaGrupalContent faqs={faqs} mentoria={mentoria} />;
}
