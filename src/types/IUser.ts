// types/IUser.ts
export interface IUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
  points: number; // 1 poin = Rp1
}

/**
 * Utility untuk konversi poin ke rupiah
 * Contoh: formatPointsToRupiah(15000) -> "Rp15.000"
 */
export const formatPointsToRupiah = (points: number): string => {
  return `${points.toLocaleString("id-ID")}`;
};
