import React from "react";
import { Info } from "lucide-react";

// Ini adalah Server Component
export default function AboutPage() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Tentang Baitullah Mall
        </h1>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p>
          Selamat datang di Baitullah Mall, destinasi utama Anda untuk semua
          kebutuhan perlengkapan ibadah haji dan umroh. Kami memahami betapa
          sucinya perjalanan Anda, dan kami berkomitmen untuk menyediakan
          produk-produk berkualitas tinggi untuk memastikan kenyamanan dan
          kekhusyukan ibadah Anda.
        </p>
        <p>
          Misi kami adalah menjadi mitra terpercaya bagi setiap jamaah dengan
          menawarkan rangkaian produk terlengkap, mulai dari pakaian ihram,
          aksesoris ibadah, perlengkapan travel, hingga buku panduan manasik.
        </p>
        <p>
          Kami hanya memilih produk-produk terbaik yang halal, nyaman, dan
          sesuai dengan syariat. Dengan pelayanan yang ramah dan proses belanja
          yang mudah, kami berharap dapat menjadi bagian dari persiapan
          perjalanan suci Anda ke Baitullah.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Visi Kami</h2>
        <p>
          Menjadi platform e-commerce syariah terdepan dan terpercaya dalam
          penyediaan perlengkapan haji dan umroh di Indonesia.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Misi Kami</h2>
        <ul>
          <li>
            Menyediakan produk yang lengkap, berkualitas, dan sesuai syariat.
          </li>
          <li>
            Memberikan pengalaman belanja online yang aman, mudah, dan cepat.
          </li>
          <li>Menyajikan konten edukatif seputar persiapan haji dan umroh.</li>
          <li>
            Menjalin kemitraan strategis dengan penyedia layanan haji dan umroh.
          </li>
        </ul>
      </div>
    </div>
  );
}
