import axios from "axios";

const axiosClientBaitullahMall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BAITULLAH_MALL, // otomatis ambil dari .env
  timeout: 15000,
});

axiosClientBaitullahMall.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Koneksi lambat, request timeout";
    }
    return Promise.reject(error);
  }
);

export default axiosClientBaitullahMall;
