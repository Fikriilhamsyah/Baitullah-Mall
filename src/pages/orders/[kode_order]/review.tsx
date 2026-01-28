import { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, Star } from "lucide-react";

import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

const MAX_PHOTOS = 3;
const MAX_VIDEO = 1;

const ReviewPage = () => {
  const router = useRouter();
  const { query: routerQuery, isReady } = router;

  const getParam = (key: string): string | null => {
    if (!isReady) return null;
    const value = routerQuery[key];
    if (!value) return null;
    return Array.isArray(value) ? value[0] : String(value);
  };

  const kode_order = getParam("kode_order");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* FOTO */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    setPhotos((prev) =>
      [...prev, ...selected].slice(0, MAX_PHOTOS)
    );
  };

  /* Remove foto */
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  /* VIDEO */
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setVideo(e.target.files[0]);
  };

  /* Remove video */
  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async () => {
    if (!kode_order) {
      alert("Kode order tidak ditemukan");
      return;
    }
    
    if (rating === 0) {
      alert("Silakan beri rating terlebih dahulu");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("kode_order", kode_order);
    formData.append("rating", rating.toString());
    formData.append("review", review);

    photos.forEach((file, i) =>
      formData.append(`photos[${i}]`, file)
    );

    if (video) {
      formData.append("video", video);
    }

    // TODO: submit API
    // await fetch("/api/reviews", { method: "POST", body: formData });

    setLoading(false);
    router.push("/profile?tab=orders&status=done");
  };

  return (
    <div className="pt-[80px] md:pt-[100px] lg:pt-[160px]">
      <div className="container mx-auto px-4 md:px-6 space-y-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali
        </button>

        <h1 className="text-lg font-semibold">Berikan Ulasan</h1>

        {/* ⭐ Rating */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-700">
            Rating
          </p>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition"
              >
                <Star
                  className={`h-7 w-7 ${
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {rating === 0 && (
            <p className="text-xs text-red-500">
              Rating wajib diisi
            </p>
          )}
        </div>

        {/* 📝 Review */}
        <InputField
          label="Ulasan"
          type="textarea"
          placeholder="Ceritakan pengalaman kamu dengan produk ini"
          value={review}
          onChange={(e: any) => setReview(e.target.value)}
          required
        />

        {/* 🖼️ Foto */}
        <InputField
          label={`Foto Produk (maks ${MAX_PHOTOS})`}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={previewUrl}
                    alt={`photo-${index}`}
                    className="w-full h-full object-cover"
                  />

                  {/* ❌ Remove */}
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 🎥 Video */}
        <InputField
          label="Video Produk (maks 1)"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />

        {video && (
          <div className="relative w-full overflow-hidden rounded-lg border aspect-video bg-black">
            <video
              src={URL.createObjectURL(video)}
              controls
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* ❌ Remove */}
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
          label={loading ? "Mengirim..." : "Kirim Ulasan"}
        />
      </div>
    </div>
  );
};

export default ReviewPage;
