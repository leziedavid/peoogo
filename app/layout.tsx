import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontInter } from "next/font/google"; // renommé pour éviter confusion
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";

const inter = FontInter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Peoogo",
  description:"Basés au Burkina Faso, nous sommes une jeune startup ambitieuse, passionnée par l’innovation agricole et aquacole, et déterminée à transformer le secteur en offrant des solutions pratiques, accessibles et performantes.!",
  openGraph: {
    title: "Peoogo",
    description:
      "Peoogo est une plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine, pour les entreprises et les particuliers. Notre mission est de valoriser les savoir-faire et le patrimoine textile local. Bienvenue !",
      url: "https://peoogo.com",
  },
  icons:{
    icon: "/logos/Peoogo_Plan_de_travail_11.svg",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.variable)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
