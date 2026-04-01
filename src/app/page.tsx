import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Proposito from "@/components/Proposito";
import Servicios from "@/components/Servicios";
import Testimonios from "@/components/Testimonios";
import SobreMi from "@/components/SobreMi";
import CtaBanner from "@/components/CtaBanner";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Proposito />
        <Servicios />
        <Testimonios />
        <SobreMi />
        <CtaBanner />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
