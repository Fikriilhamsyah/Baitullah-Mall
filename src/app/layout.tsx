import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Pastikan Anda punya file ini (dari Next.js)
import Header from "@components/layout/Header"; // Menggunakan alias path
import Footer from "@components/layout/Footer"; // Menggunakan alias path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baitullah Mall - Perlengkapan Haji & Umroh",
  description: "Toko online perlengkapan haji dan umroh terlengkap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}
      >
        <Header />

        {/* Konten halaman akan dirender di sini */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
