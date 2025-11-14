import React from "react";

interface VariantInfoProps {
  gender?: string;
  sizes?: string[];
}

const VariantInfo: React.FC<VariantInfoProps> = ({ gender, sizes }) => {
  if (!gender && !sizes) return null;

  return (
    <div className="flex justify-between text-xs text-gray-500 mt-1">
      {gender && <span>{gender}</span>}
      {sizes && sizes.length > 0 && <span>{sizes.join(" - ")}</span>}
    </div>
  );
};

export default VariantInfo;
