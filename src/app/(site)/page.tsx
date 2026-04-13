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
import {
  getTestimonios,
  getCharlasImages,
  getSobreMi,
  getInfoContacto,
} from "@/sanity/queries";

export const revalidate = 60; // revalidar cada 60 segundos

export default async function Home() {
  const [testimonios, charlasImages, sobreMi, contacto] = await Promise.all([
    getTestimonios(),
    getCharlasImages(),
    getSobreMi(),
    getInfoContacto(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Proposito />
        <Servicios charlasImages={charlasImages} />
        <Testimonios testimonios={testimonios} />
        <SobreMi data={sobreMi} />
        <CtaBanner />
        <Contacto data={contacto} />
      </main>
      <Footer data={contacto} />
      <WhatsAppButton phone={contacto?.whatsapp} />
    </>
  );
}
