import axios from "axios";

const axiosClientBaitullahMall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BAITULLAH_MALL, // otomatis ambil dari .env
  timeout: 10000,
});

// Kalau butuh token, bisa tambahkan interceptor
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosClientBaitullahMall;
