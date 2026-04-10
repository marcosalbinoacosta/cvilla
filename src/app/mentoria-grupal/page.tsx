import type { Metadata } from "next";
import MentoriaGrupalContent from "./MentoriaGrupalContent";

export const metadata: Metadata = {
  title: "Mentoría Grupal — Catalina Villafañe",
  description:
    "Espacio de crecimiento compartido para emprendedoras que quieren aprender, desafiarse y avanzar juntas con estrategia y acompañamiento.",
};

export default function Page() {
  return <MentoriaGrupalContent />;
}
