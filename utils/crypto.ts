import CryptoJS from "crypto-js";

const SECRET_KEY = "0123456789ABCDEF0123456789ABCDEF";

export const encryptPassword = (password: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};
