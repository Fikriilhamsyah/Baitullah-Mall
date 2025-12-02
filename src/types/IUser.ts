export interface IUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  address: string | null;
  created_at: number;
  updated_at: number;
  last_login: string;
  status: string;
  otp: string | null;
  token: string; // ini token dari DB user, kadang kosong
  profile_photo_path: string | null;
  is_ustadz: number;
  tipe_akun: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  user: IUser;
  token: string;
}

export interface IResetPassword {
  phone: number | string;
}

export const formatPointsToRupiah = (points: number): string => {
  return `${points.toLocaleString("id-ID")}`;
};
