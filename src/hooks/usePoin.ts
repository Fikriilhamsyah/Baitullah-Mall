"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { IPoinSummary } from "@/types/IPoin";
import { useAuth } from "@/context/AuthContext";

const normalize = (arr: any[]): IPoinSummary[] =>
  arr.map((it: any) => ({
    id_users: Number(it.id_users ?? it.id_user ?? it.user_id),
    total_score_sum: String(it.total_score_sum ?? it.total_score ?? 0),
    total_time_sum: String(it.total_time_sum ?? it.total_time ?? 0),
  }));

const fetchPoin = async (): Promise<IPoinSummary[]> => {
  const res = await api.getPoin();
  const raw = res?.data;

  const arr =
    Array.isArray(raw) ? raw :
    Array.isArray(raw?.data) ? raw.data :
    Array.isArray(raw?.result) ? raw.result :
    [];

  return normalize(arr);
};

export const usePoin = () => {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);

  const query = useQuery({
    queryKey: ["poin"],              // ⬅️ fetch SEKALI
    queryFn: fetchPoin,
    enabled: hydrated && !!user?.id, // ⬅️ tunggu auth stabil
  });

  return {
    poin: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Gagal memuat poin" : null,
    refetch: query.refetch,
  };
};

export default usePoin;
