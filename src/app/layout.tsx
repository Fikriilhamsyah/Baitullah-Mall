import type { Metadata } from "next";

// Global CSS
import "../styles/globals.css";

// Fonts
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Layout Components
import ClientProvider from "@/components/features/provider/ClientProvider";

// UI Components
import { Toast } from "@/components/ui/Toast";

// Font setup
// Inter
const inter = Inter({ subsets: ["latin"] });

// OpenSauceSans
const openSauceSans = localFont({
  src: [
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-Black.ttf", weight: "900", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceSans-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-open-sauce-sans",
  display: "swap",
});

// OpenSauceTwo
const openSauceTwo = localFont({
  src: [
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Light.ttf", weight: "300", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Italic.ttf", weight: "400", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-Black.ttf", weight: "900", style: "normal" },
    { path: "../assets/fonts/OpenSauce/OpenSauceTwo-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-open-sauce-two",
  display: "swap",
});

// Metadata untuk SEO dan ikon situs
export const metadata: Metadata = {
  title: "Baitullah Mall - Perlengkapan Haji & Umroh",
  description: "Toko online perlengkapan haji dan umroh terlengkap.",
  icons: {
    icon: '/img/logo/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="id">
      <body
        className={`${openSauceSans.className} flex flex-col min-h-screen bg-white`}
      >
        <Toast>
          <ClientProvider>
            {children}
          </ClientProvider>
        </Toast>
      </body>
    </html>
  );
}
