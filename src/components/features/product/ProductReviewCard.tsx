"use client";

import React from "react";
import Image from "next/image";
import { IProductReview } from "@/types/IProductReview";
import { Star, User } from "lucide-react";

interface Props {
  review: IProductReview;
}

const ProductReviewCard: React.FC<Props> = ({ review }) => {
  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full border-b border-b-neutral-200 py-4 bg-white mb-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {review.user_avatar ? (
            <Image
              src={review.user_avatar}
              alt={review.user_name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <User className="text-gray-500" size={24} />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-sm">{review.user_name}</span>
          <span className="text-xs text-gray-500">
            {formattedDate} • {formattedTime}
          </span>
        </div>
      </div>

      {/* Nama Produk */}
      <div className="mt-3 text-sm font-medium text-gray-700">
        {review.product?.nama_produk ?? "Produk tidak ditemukan"}
      </div>

      {/* Rating */}
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < review.rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Varian */}
      {(review.warna || review.ukuran) && (
        <div className="text-xs text-gray-600 mt-2">
          Varian:
          {review.warna && <span> {review.warna}</span>}
          {review.warna && review.ukuran && <span> • </span>}
          {review.ukuran && <span> Ukuran {review.ukuran}</span>}
        </div>
      )}

      {/* Review Text */}
      <p className="mt-3 text-sm text-gray-700 leading-relaxed">
        {review.review_text}
      </p>

      {/* Media */}
      {review.media.images.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {review.media.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt="Review Image"
              width={90}
              height={90}
              className="rounded-lg object-cover border border-neutral-200"
            />
          ))}
        </div>
      )}

      {review.media.videos.length > 0 && (
        <div className="mt-3">
          {review.media.videos.map((vid, idx) => (
            <video
              key={idx}
              src={vid}
              controls
              className="rounded-lg w-full max-w-[300px]"
            />
          ))}
        </div>
      )}

      {/* Admin Reply */}
      {review.admin_reply && (
        <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-green-600">
          <div className="text-green-700 font-semibold">
            Admin {review.admin_reply.admin_name}
          </div>
          <p className="text-gray-700">{review.admin_reply.reply_text}</p>
          <div className="text-xs text-gray-500">
            {review.admin_reply.created_at}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewCard;
