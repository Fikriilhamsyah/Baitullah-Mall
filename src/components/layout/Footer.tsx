import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} Baitullah Mall. Semua Hak Cipta
            Dilindungi.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Menyediakan Perlengkapan Haji & Umroh Terlengkap
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
