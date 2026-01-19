import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_ORDER_SECRET || "order-secret-key";

/** Encrypt + URL Safe */
export const encryptOrderCode = (value: string): string => {
  const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
};

/** Decode URL + Decrypt */
export const decryptOrderCode = (cipherText: string): string => {
  try {
    const decoded = decodeURIComponent(cipherText);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
