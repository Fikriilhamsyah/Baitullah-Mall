import axiosClientBaitullahMall from "./axiosClientBaitullahMall";
import axiosClientBaitullah from "./axiosClientBaitullah";
import { IProduct } from "../types/IProduct";
import { ICategory } from "../types/ICategory";
import { ProductsData } from "../data/ProductsData";
import { ILogin, ILoginResponse } from "@/types/IUser";
import { ICollection } from "@/types/ICollection";

export const api = {
  getProducts: () => axiosClientBaitullahMall.get<IProduct[]>("api/produk"),
  getProductById: (id: number) => axiosClientBaitullahMall.get<IProduct>(`api/produk/${id}`),
  getCategories: () => axiosClientBaitullahMall.get<ICategory[]>(`api/kategori`),
  getCollection: () => axiosClientBaitullahMall.get<ICollection[]>(`api/koleksi`),
  postLogin: (payload: ILogin) => axiosClientBaitullah.post<ILoginResponse>(`api/login`, payload),
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