import React from "react";
import { Plus } from "lucide-react";
import { colorMaster } from "@/data/ColorProductData";

interface ColorCirclesProps {
  colors: string[];
  maxVisible?: number; // bisa diubah kalau mau
}

const ColorCircles: React.FC<ColorCirclesProps> = ({ colors, maxVisible = 5 }) => {
  if (!colors || colors.length === 0) return null;

  const visibleColors = colors.slice(0, maxVisible);
  const remainingCount = colors.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 mt-1 mb-1">
      {visibleColors.map((color) => {
        const lower = color.toLowerCase();
        const hex = colorMaster[lower] || color;
        return (
          <div
            key={color}
            className="w-4 h-4 rounded-full border border-neutral-300 shadow-sm"
            style={{ backgroundColor: hex }}
            title={color}
          />
        );
      })}

      {remainingCount > 0 && (
        <div
          className="w-4 h-4 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-[10px] text-gray-600 font-semibold"
          title={`+${remainingCount} warna lain`}
        >
          <Plus size={10} strokeWidth={2} />
        </div>
      )}
    </div>
  );
};

export default ColorCircles;
