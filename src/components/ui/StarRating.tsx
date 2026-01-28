"use client";

import { Star } from "lucide-react";
import { cn } from "@/utils/helpers";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              "w-6 h-6 transition",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
