import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ORDER_SECRET!;

// Encrypt
export function encryptOrderToken(payload: object) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    SECRET_KEY
  ).toString();
}

// Decrypt
export function decryptOrderToken<T = any>(token: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
