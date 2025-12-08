import React from "react";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const isProductDetail =
    !!pathname &&
    (pathname.startsWith("/productdetail") || pathname.startsWith("/product/") || pathname === "/product");
  const isCart = pathname === "/cart";
  const isCheckout = pathname === "/checkout";

  const pbClass = isProductDetail
    ? "pb-[7.5rem] lg:pb-0"
    : isCheckout
    ? "pb-20 lg:pb-0"
    : isCart
    ? "pb-20 lg:pb-0"
    : "pb-0";

  const renderSecondaryFoot = () => (
    <div>
      <div className="w-full h-20 md:h-30 bg-neutral-200"></div>
      <div className="container mx-auto px-4 md:px-6 md:px-6 py-4 md:py-6 mb-5 flex flex-col lg:flex-row justify-between items-center">
        <p className="text-xs md:text-sm text-center md:text-start text-gray-500 font-normal">© 2025 PT. Bangkit Membangun Negeri. Hak cipta dilindungi undang-undang</p>
        {/* Sosial Media */}
        <div className="flex justify-center md:justify-start gap-3 pt-3 lg:pt-0">
          <a href="#" aria-label="Facebook" className="hover:scale-110 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:scale-110 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" aria-label="YouTube" className="hover:scale-110 transition">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Email" className="hover:scale-110 transition">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );

  const renderDefaultFoot = () => (
    <div>
      {/* Brand Section */}
      <div className="container mx-auto px-4 md:px-6 mb-5">
        <div className="hidden md:flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            {/* <Image
              src="/logo.png"
              alt="Baitullah Mall"
              width={40}
              height={40}
              className="rounded-md"
            /> */}
            <h3 className="text-lg font-semibold">Baitullah Mall</h3>
          </div>
          <p className="text-sm text-black/90 leading-relaxed my-2">
            <span className="font-bold">Baitullah Mall</span> adalah marketplace terpercaya yang menyediakan berbagai kebutuhan ibadah Haji dan Umroh dalam satu platform. Dari perlengkapan ihram, mukena, sajadah, koper, hingga produk sunnah dan oleh-oleh khas Tanah Suci, semuanya dapat ditemukan dengan mudah di sini.
          </p>
          <p className="text-sm text-black/90 leading-relaxed">
            Kami hadir untuk memudahkan jamaah mempersiapkan perjalanan spiritualnya dengan produk berkualitas, harga terjangkau, serta layanan yang aman dan nyaman. Dengan dukungan penjual terpercaya dan pilihan pembayaran yang fleksibel, <span className="font-bold">Baitullah Mall</span> menjadi solusi praktis bagi setiap calon jamaah Haji dan Umroh dalam memenuhi segala kebutuhannya.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-4 md:pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="flex md:hidden flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            {/* <Image
              src="/logo.png"
              alt="Baitullah Mall"
              width={40}
              height={40}
              className="rounded-md"
            /> */}
            <h3 className="text-lg font-semibold">Baitullah Mall</h3>
          </div>
          <p className="text-xs text-black/90 leading-relaxed my-2">
            <span className="font-bold">Baitullah Mall</span> adalah marketplace terpercaya yang menyediakan berbagai kebutuhan ibadah Haji dan Umroh dalam satu platform. Dari perlengkapan ihram, mukena, sajadah, koper, hingga produk sunnah dan oleh-oleh khas Tanah Suci, semuanya dapat ditemukan dengan mudah di sini.
          </p>
          <p className="text-xs text-black/90 leading-relaxed">
            Kami hadir untuk memudahkan jamaah mempersiapkan perjalanan spiritualnya dengan produk berkualitas, harga terjangkau, serta layanan yang aman dan nyaman. Dengan dukungan penjual terpercaya dan pilihan pembayaran yang fleksibel, <span className="font-bold">Baitullah Mall</span> menjadi solusi praktis bagi setiap calon jamaah Haji dan Umroh dalam memenuhi segala kebutuhannya.
          </p>
        </div>

        <div className="block md:hidden border-b border-neutral-200" />

        {/* Collection */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center md:text-start">Berdasarkan Koleksi</h4>
          <ul className="space-y-2 text-sm text-black/90 text-center md:text-start">
            <li><a href="/productlist?collection=1" className="text-center md:text-start">Pria</a></li>
            <li><a href="/productlist?collection=2" className="text-center md:text-start">Wanita</a></li>
            <li><a href="/productlist?collection=3" className="text-center md:text-start">Unisex</a></li>
            <li><a href="/productlist?collection=4" className="text-center md:text-start">Lainnya</a></li>
          </ul>
        </div>

        {/* Produk */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center md:text-start">Produk</h4>
          <ul className="space-y-2 text-sm text-black/90 text-center md:text-start">
            <li><a href="/productlist?category=Pakaian+%26+Ihram" className="text-center md:text-start">Pakaian & Ihram</a></li>
            <li><a href="/productlist?category=Aksesoris+Ibadah" className="text-center md:text-start">Aksesoris Ibadah</a></li>
            <li><a href="/productlist?category=Perlengkapan+Travel" className="text-center md:text-start">Perlengkapan Travel</a></li>
            <li><a href="/productlist?category=Kesehatan+%26+Kebersihan" className="text-center md:text-start">Kesehatan & Kebersihan</a></li>
            <li><a href="/productlist?category=Buku+%26+Panduan" className="text-center md:text-start">Buku & Panduan</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Oleh-oleh & Souvenir</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Paket Bundling</a></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center md:text-start">Bantuan</h4>
          <ul className="space-y-2 text-sm text-black/90 text-center md:text-start">
            <li><a href="/faq" className="text-center md:text-start">Cara Memesan</a></li>
            <li><a href="/panduan" className="text-center md:text-start">Tabel Ukuran</a></li>
            <li><a href="/kebijakan-privasi" className="text-center md:text-start">FAQ</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Syarat & Ketentuan</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Pengiriman</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Pengembalian</a></li>
            <li><a href="/syarat-ketentuan" className="text-center md:text-start">Penggunaan Voucher</a></li>
          </ul>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-center md:text-start">Layanan</h4>
          <ul className="space-y-2 text-sm text-black/90 text-center md:text-start">
            <li>
              <p className="text-center md:text-start">Hari kerja dan jam kerja</p>
              <p className="text-center md:text-start">09.00 - 17.00 WIB</p>
              <p className="text-center md:text-start">(Senin - Jumat)</p>
            </li>
            <li>
              <a href="/panduan" className="flex justify-center md:justify-start items-center gap-2">
                <PhoneCall className="w-5 h-5" />
                <div>
                  <p className="text-center md:text-start">Whatsapp</p>
                  <p className="text-center md:text-start">+62 812-3456-7890</p>
                </div>
              </a>
            </li>
            <li>
              <a href="/panduan" className="flex justify-center md:justify-start items-center gap-2">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-center md:text-start">Email</p>
                  <p className="text-center md:text-start">info@baitullahmall.com</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-6 pb-4 md:pb-6 gap-8">
        {/* Sosial Media */}
        <div className="flex justify-center md:justify-start gap-3">
          <a href="#" aria-label="Facebook" className="hover:scale-110 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:scale-110 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" aria-label="YouTube" className="hover:scale-110 transition">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Email" className="hover:scale-110 transition">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <div className="border-b border-neutral-200 w-full" />

        {/* Copyright */}
        <div className="container grid grid-flow-col grid-rows-3 md:grid-rows-1 md:grid-flow-row md:grid-cols-3 items-center">
          <div className="text-center flex flex-col items-center md:items-start">
            <p className="text-xs md:text-sm font-normal text-neutral-900">
              &copy; {new Date().getFullYear()} Baitullah Mall. Semua Hak Cipta
              Dilindungi.
            </p>
            <p className="text-xs md:text-sm font-normal text-gray-400 mt-1">
              Menyediakan Perlengkapan Haji & Umroh Terlengkap
            </p>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/img/logo/logo-baitullah-mall.webp"
              alt="Baitullah Mall"
              className="h-7 lg:h-10"
            />
          </div>

          <div className="flex justify-center md:justify-end">
            <ul className="flex flex-col md:flex-row md:items-start items-center md:gap-4 space-y-2 text-sm text-black/90 text-center md:text-start">
              <li><a href="/faq" className="text-center md:text-start">Privacy Policy</a></li>
              <li><a href="/panduan" className="text-center md:text-start">Terms and Condition</a></li>
              <li><a href="/kebijakan-privasi" className="text-center md:text-start">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <footer className={`bg-gradient-to-b from-[#FFFFFF] to-[#FAFAFA] text-black ${pbClass}`}>
      {pathname === "/checkout" ? renderSecondaryFoot() : renderDefaultFoot()}
    </footer>
  );
}
