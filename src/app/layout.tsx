import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://catalinavillafane.com"),
  title: "Catalina Villafañe — Consultora & Mentora de Negocios",
  description:
    "Negocios que crecen con estrategia y propósito. Consultoría, mentoría y capacitación para pymes y emprendedores.",
  openGraph: {
    title: "Catalina Villafañe — Consultora & Mentora de Negocios",
    description:
      "Negocios que crecen con estrategia y propósito. Consultoría, mentoría y capacitación para pymes y emprendedores.",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Catalina Villafañe — Consultora & Mentora de Negocios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalina Villafañe — Consultora & Mentora de Negocios",
    description:
      "Negocios que crecen con estrategia y propósito. Consultoría, mentoría y capacitación para pymes y emprendedores.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${dancingScript.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
