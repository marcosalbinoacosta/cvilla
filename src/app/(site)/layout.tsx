import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Dancing_Script } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://catalinavillafane.com";
const SITE_TITLE = "Catalina Villafañe — Consultora & Mentora de Negocios";
const SITE_DESCRIPTION =
  "Negocios que crecen con estrategia y propósito. Consultoría, mentoría y capacitación para pymes y emprendedoras en Córdoba, Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Catalina Villafañe",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Catalina Villafañe",
  authors: [{ name: "Catalina Villafañe" }],
  creator: "Catalina Villafañe",
  publisher: "Catalina Villafañe",
  keywords: [
    "consultora de negocios",
    "mentora de negocios",
    "mentoría para emprendedoras",
    "coach de negocios Córdoba",
    "programa Virtuosa",
    "charlas motivacionales",
    "Catalina Villafañe",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Catalina Villafañe",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Catalina Villafañe — Consultora & Mentora de Negocios",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "Country",
    name: "Argentina",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Córdoba",
    addressCountry: "AR",
  },
  sameAs: [] as string[],
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${cormorant.variable} ${dancingScript.variable} antialiased min-h-screen`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
