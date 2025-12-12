import Cookies from "js-cookie";

const TOKEN_KEY = "bt_token";

const isSecureContext = () => {
  if (typeof window === "undefined") return false;
  // jika ingin lebih konservatif: gunakan process.env.NODE_ENV === "production"
  return window.location.protocol === "https:" || window.location.hostname === "localhost";
};

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    secure: isSecureContext(),          // https only di production
    sameSite: "Strict",
    expires: 7,            // 7 hari, silahkan ganti
    path: "/",
  });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};
