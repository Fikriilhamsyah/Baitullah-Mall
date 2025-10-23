import React from "react";
import { Loader2 } from "lucide-react";

// Komponen untuk menampilkan loading spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default LoadingSpinner;
