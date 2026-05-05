import type { Metadata } from "next";
import Link from "next/link";
import NavbarInterna from "@/components/NavbarInterna";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getInfoContacto } from "@/sanity/queries";

const ULTIMA_ACTUALIZACION = "5 de mayo de 2026";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo Catalina Villafañe trata los datos personales que recibe a través de este sitio web.",
  alternates: { canonical: "/politica-privacidad" },
  robots: { index: true, follow: false },
};

export const revalidate = 60;

export default async function Page() {
  const contacto = await getInfoContacto();
  const email = contacto?.email ?? "catalinavillafane@gmail.com";

  return (
    <>
      <NavbarInterna />
      <main className="bg-cream pt-32 pb-20 px-6 md:px-12 lg:px-20">
        <article className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
            Información legal
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-navy font-light mb-4">
            Política de Privacidad
          </h1>
          <p className="text-sm text-text/60 mb-12">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>

          <div className="space-y-10 text-text/85 font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                1. Quién es responsable de tus datos
              </h2>
              <p>
                Catalina Villafañe, con domicilio en Córdoba, Argentina, es la
                responsable del tratamiento de los datos personales que se
                recopilan a través de este sitio web. Para cualquier consulta
                sobre tus datos podés escribir a{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-navy underline hover:text-accent"
                >
                  {email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                2. Qué datos recopilamos
              </h2>
              <p className="mb-3">
                Recopilamos únicamente los datos que vos nos proporcionás de
                forma voluntaria al completar alguno de los formularios del
                sitio:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Nombre.</li>
                <li>Email.</li>
                <li>
                  WhatsApp (solo en el formulario de pre-inscripción a Mentoría
                  Grupal).
                </li>
                <li>
                  Información sobre tu negocio o tus expectativas (cuando
                  decidís compartirla en el cuerpo del mensaje).
                </li>
              </ul>
              <p className="mt-3">
                No recopilamos información de manera automatizada más allá de la
                estrictamente necesaria para que el sitio funcione (cookies de
                sesión y métricas técnicas básicas del proveedor de hosting).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                3. Para qué usamos tus datos
              </h2>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Responder tu consulta o coordinar una sesión inicial.</li>
                <li>
                  Avisarte cuando se abran inscripciones de programas o
                  mentorías a las que te hayas anotado en lista de espera.
                </li>
                <li>
                  Llevar registro interno de las consultas recibidas para hacer
                  un seguimiento adecuado.
                </li>
              </ul>
              <p className="mt-3">
                No usamos tus datos para enviarte publicidad de terceros ni los
                cedemos, vendemos o compartimos con fines comerciales.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                4. Dónde se almacenan
              </h2>
              <p>
                Los mensajes enviados desde los formularios se entregan por
                email a través del proveedor{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy underline hover:text-accent"
                >
                  Resend
                </a>
                . El sitio está alojado en{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy underline hover:text-accent"
                >
                  Vercel
                </a>
                . Estos proveedores pueden almacenar y procesar datos en
                servidores ubicados fuera de Argentina, siempre cumpliendo los
                estándares internacionales de seguridad y protección de datos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                5. Tus derechos
              </h2>
              <p>
                De acuerdo con la Ley Nacional de Protección de Datos Personales
                (Ley 25.326), tenés derecho a acceder, rectificar, actualizar y
                solicitar la supresión de tus datos personales en cualquier
                momento. Para ejercer estos derechos, escribinos a{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-navy underline hover:text-accent"
                >
                  {email}
                </a>{" "}
                indicando tu pedido. Te respondemos en un plazo razonable.
              </p>
              <p className="mt-3 text-sm text-text/60">
                La autoridad de aplicación es la Agencia de Acceso a la
                Información Pública, ante la cual también podés presentar un
                reclamo si lo considerás necesario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                6. Cookies
              </h2>
              <p>
                Este sitio utiliza únicamente cookies técnicas estrictamente
                necesarias para su funcionamiento (por ejemplo, las que usa
                Vercel para servir el contenido). No usamos cookies de
                publicidad, perfilado ni rastreo de terceros.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl text-navy mb-3">
                7. Cambios en esta política
              </h2>
              <p>
                Podemos actualizar esta política cuando sea necesario para
                reflejar mejoras en el sitio o cambios normativos. La fecha de
                última actualización siempre figura al inicio de este documento.
              </p>
            </section>

            <div className="pt-6 border-t border-beige">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-navy hover:text-accent transition-colors"
              >
                <span aria-hidden>&larr;</span> Volver al inicio
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer data={contacto} />
      <WhatsAppButton phone={contacto?.whatsapp} />
    </>
  );
}
