export interface ILocation {
  id: number;
  name: string;
}

export interface ISubdistrict {
  id: number;
  name: string;
  zip_code: string;
}

export interface IAddress {
  id: number;
  nama_lengkap: string;
  nomor_telepon: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  detail_alamat: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface IPostAddress {
  nama_lengkap: string;
  nomor_telepon: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  detail_alamat: string;
  user_id: number;
}

export interface IPostCalculateOngkir {
  origin: number;
  destination: number;
  weight: number;
  courier: string;
  price: string;
}