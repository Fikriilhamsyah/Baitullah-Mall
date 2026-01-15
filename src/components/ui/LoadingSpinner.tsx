import React from "react";
import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="animate-spin-y">
        <Image
          src="/img/logo/android-chrome-512x512.png"
          alt="Loading..."
          width={60}
          height={60}
          priority
          className="select-none"
        />
      </div>
      <p className="mt-4 text-gray-600 text-sm">Memuat halaman...</p>
    </div>
  );
};

export default LoadingSpinner;
