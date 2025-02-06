import CryptoJS from "crypto-js";

export default function decryptPassword(password: string) {
  const decryptPassword = CryptoJS.AES.decrypt(password, process.env.CRYPTO);
  return decryptPassword;
}
