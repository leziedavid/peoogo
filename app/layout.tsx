import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import {Inter as FontInter , Plus_Jakarta_Sans, Roboto as RobotoFont } from "next/font/google";

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


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"], // <-- pas de "900"
  variable: "--font-plus-jakarta-sans",
  display: "swap",
})

const roboto = RobotoFont({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* <body className={cn(inter.variable)}> */}

      <body className={`${roboto.className}  antialiased `}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
