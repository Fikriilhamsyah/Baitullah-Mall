import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating = 0 }) => {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-yellow-500 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rounded ? "fill-yellow-400" : "fill-gray-200"}
        />
      ))}
      <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400 ml-1">/ 5</span>
    </div>
  );
};

export default RatingStars;
