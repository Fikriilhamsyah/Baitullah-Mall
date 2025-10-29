import { IProduct } from "../types/IProduct";
import { dummyProducts } from "../data/ProductsData";

// --- SIMULASI API SERVICE ---
// Ini adalah lapisan yang meniru pemanggilan 'axios.get'
// Di aplikasi nyata, Anda akan mengganti isi fungsi ini dengan pemanggilan axios sungguhan

export const mockApi = {
  fetchProducts: (): Promise<{ data: IProduct[] }> => {
    console.log("MOCK API: Fetching all products...");
    return new Promise((resolve) => {
      setTimeout(() => {
        // Di sini 'axios.get('/api/products')' akan terjadi
        resolve({ data: dummyProducts });
      }, 500); // Simulasi delay jaringan 0.5 detik
    });
  },

  fetchProductById: (id: string): Promise<{ data: IProduct | undefined }> => {
    console.log(`MOCK API: Fetching product by id: ${id}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Di sini 'axios.get(`/api/products/${id}`)' akan terjadi
        const product = dummyProducts.find((p) => p.id === id);
        if (product) {
          resolve({ data: product });
        } else {
          reject(new Error("Produk tidak ditemukan"));
        }
      }, 300); // Simulasi delay jaringan 0.3 detik
    });
  },
};

// --- KONFIGURASI AXIOS ASLI (Contoh untuk masa depan) ---
/*
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.domain-anda.com/api',
  timeout: 10000,
});

export const api = {
  getProducts: () => apiClient.get<Product[]>('/products'),
  getProductById: (id: string) => apiClient.get<Product>(`/products/${id}`),
};
*/
