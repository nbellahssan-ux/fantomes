import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });

const titre = "Fantômes : débusque les abonnements que tu paies sans t'en servir";
const description =
  "Dépose ton relevé bancaire, on repère les prélèvements oubliés et on écrit les lettres de résiliation. Audit complet : 19 €.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fantomes-ten.vercel.app"),
  title: titre,
  description,
  openGraph: { title: titre, description, locale: "fr_FR", type: "website" },
};

export const viewport: Viewport = { themeColor: "#1b1a17" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${dm.variable}`}>
      <body>{children}</body>
    </html>
  );
}