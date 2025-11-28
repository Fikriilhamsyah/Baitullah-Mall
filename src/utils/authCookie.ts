import Cookies from "js-cookie";

const TOKEN_KEY = "bt_token";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    secure: false,          // https only di production
    sameSite: "Strict",
    expires: 7,            // 7 hari, silahkan ganti
    path: "/",
  });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};
