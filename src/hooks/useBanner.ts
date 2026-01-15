import { useState, useEffect } from "react";
import { ISlide } from "../types/ISlide";  // Assuming ISlide represents your banner data type
import { api } from "../services/api";  // Assuming api.getBanner() exists for fetching banners
import { ApiResponse } from "../types/ApiResponse";

const CACHE_KEY = "banner:all:v1";  // Updated the cache key to be for banners

export const useBanner = () => {
  const [banners, setBanners] = useState<ISlide[]>([]);  // Renamed cart to banners
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._useBannerCache) {  // Changed cache from cart to banner
    (globalThis as any)._useBannerCache = new Map();
  }
  const memoryCache: Map<string, ISlide[]> =
    (globalThis as any)._useBannerCache;

  useEffect(() => {
    let mounted = true;

    const getBanner = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          setBanners(memoryCache.get(CACHE_KEY)!);  // Renamed cart to banners
        }

        const response = await api.getBanner();  // Assuming getBanner() is correct
        const result = response.data as ApiResponse<ISlide[]>;
        const data = Array.isArray(result.data) ? result.data : [];

        memoryCache.set(CACHE_KEY, data);
        if (mounted) setBanners(data);  // Renamed cart to banners
      } catch (err: any) {
        if (!mounted) return;

        if (memoryCache.has(CACHE_KEY)) {
          setBanners(memoryCache.get(CACHE_KEY)!);  // Renamed cart to banners
          setError("Koneksi lambat, menampilkan banner tersimpan");
          return;
        }

        setError(err?.message ?? "Gagal memuat banner");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getBanner();
    return () => {
      mounted = false;
    };
  }, []);

  return { banners, loading, error };  // Renamed cart to banners
};
