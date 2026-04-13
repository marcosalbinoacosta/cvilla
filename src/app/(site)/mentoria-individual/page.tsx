import type { Metadata } from "next";
import MentoriaIndividualContent from "./MentoriaIndividualContent";

export const metadata: Metadata = {
  title: "Mentoría Individual — Catalina Villafañe",
  description:
    "Espacio privado 1 a 1 para emprendedoras que quieren ordenar, escalar y transformar su negocio con estrategia y acompañamiento personalizado.",
};

export default function Page() {
  return <MentoriaIndividualContent />;
}
