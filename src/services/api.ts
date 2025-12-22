// Axios Client
import axiosClientBaitullahMall from "./axiosClientBaitullahMall";
import axiosClientBaitullah from "./axiosClientBaitullah";
import axiosClientBaiq from "./axiosClientBaiq";

// Types
import { ApiResponse } from "@/types/ApiResponse";
import { IProduct, IJenis } from "../types/IProduct";
import { ICategory } from "../types/ICategory";
import { ILogin, IResetPassword, ILoginResponse, IPhoto, IRegister } from "@/types/IUser";
import { ICollection } from "@/types/ICollection";
import { ICartByIdUser, IPostCart } from "@/types/ICart";
import { IAddress, ILocation, IPostAddress, IPostCalculateOngkir } from "@/types/IAddress";
import { ICheckoutInvoice, IPostCheckout } from "@/types/ICheckout";

export const api = {
  // Auth
  postLogin: (payload: ILogin) =>
    axiosClientBaitullah.post<ILoginResponse>(`api/login`, payload),

  postResetPassword: (payload: IResetPassword) =>
    axiosClientBaitullah.post(`api/reset-password`, payload),

  // User
  postRegister: (payload: IRegister) =>
    axiosClientBaitullah.post(`api/register`, payload),

  postPhotoProfile: (payload: IPhoto) =>
    axiosClientBaitullah.post<IPhoto>(`api/user/photo-profile`, payload),

  // Product
  getProducts: () =>
    axiosClientBaitullahMall.get<ApiResponse<IProduct[]>>("api/produk"),

  getProductById: (id: number) =>
    axiosClientBaitullahMall.get<ApiResponse<IProduct>>(`api/produk/${id}`),

  getCategories: () =>
    axiosClientBaitullahMall.get<ApiResponse<ICategory[]>>("api/kategori"),

  getCollection: () =>
    axiosClientBaitullahMall.get<ApiResponse<ICollection[]>>("api/koleksi"),

  getPaymentType: () =>
    axiosClientBaitullahMall.get<ApiResponse<IJenis[]>>("api/jenis"),

  // Transaction
  getCartAll: () =>
    axiosClientBaitullahMall.get<ApiResponse<IPostCart[]>>("api/keranjang"),

  postCart: (payload: IPostCart) =>
    axiosClientBaitullahMall.post<ApiResponse<IPostCart[]>>("api/keranjang", payload),

  getCartByIdUser: (userId: number) =>
    axiosClientBaitullahMall.get<ApiResponse<ICartByIdUser[]>>(`api/keranjang/user/${userId}`),

  deleteCartByIdCart: (id: number) =>
    axiosClientBaitullahMall.delete<ICartByIdUser[]>(`api/keranjang/${id}`),

  // BaiQ
  getPoin: () =>
    axiosClientBaiq.get(`api/baiq-users-scores/summary`),

  // Raja Ongkir
  getProvince: () =>
    axiosClientBaitullahMall.get(`api/rajaongkir/province`),

  getCities: (provinceId: number) =>
    axiosClientBaitullahMall.get(`api/rajaongkir/city/${provinceId}`),

  getDistricts: (cityId: number) =>
    axiosClientBaitullahMall.get(`api/rajaongkir/district/${cityId}`),

  getSubDistricts: (districtId: number) =>
    axiosClientBaitullahMall.get(`api/rajaongkir/subdistrict/${districtId}`),

  // Address
  getAddress: () =>
    axiosClientBaitullahMall.get<ApiResponse<IAddress[]>>(`api/alamat`),

  postAddress: (payload: IPostAddress) =>
    axiosClientBaitullahMall.post<ApiResponse<IPostAddress[]>>("api/alamat", payload),

  postCalculateOngkir: (payload: IPostCalculateOngkir) =>
    axiosClientBaitullahMall.post<ApiResponse<IPostCalculateOngkir[]>>("api/rajaongkir/calculate", payload),

  // Xendit
  postCheckout: <T>(payload: IPostCheckout<T>) =>
    axiosClientBaitullahMall.post<ApiResponse<ICheckoutInvoice>>("api/checkout", payload),
};

// export const mockApi = {
//   fetchProducts: (): Promise<{ data: IProduct[] }> => {
//     console.log("MOCK API: Fetching all products...");
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         // Di sini 'axios.get('/api/products')' akan terjadi
//         resolve({ data: ProductsData });
//       }, 500); // Simulasi delay jaringan 0.5 detik
//     });
//   },

//   fetchProductById: (id: number): Promise<{ data: IProduct | undefined }> => {
//     console.log(`MOCK API: Fetching product by id: ${id}`);
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         // Di sini 'axios.get(`/api/products/${id}`)' akan terjadi
//         const product = ProductsData.find((p) => p.id === id);
//         if (product) {
//           resolve({ data: product });
//         } else {
//           reject(new Error("Produk tidak ditemukan"));
//         }
//       }, 300); // Simulasi delay jaringan 0.3 detik
//     });
//   },
// };