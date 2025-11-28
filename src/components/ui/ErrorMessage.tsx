import React from "react";
import { AlertCircle } from "lucide-react";

// Komponen untuk menampilkan pesan error
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center h-64 bg-red-50 border border-red-200 rounded-lg p-4 md:mx-auto md:px-6 pb-8 md:pt-[14pt] lg:pt-[161px]">
    <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
    <span className="text-red-700 font-medium">{message}</span>
  </div>
);

export default ErrorMessage;
