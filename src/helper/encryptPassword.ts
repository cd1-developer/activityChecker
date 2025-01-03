import CryptoJS from "crypto-js";
export default function encryptPassword(password:string){
    const encryptedPassword = CryptoJS.AES.encrypt(password,process.env.CRYPTO);
    return encryptedPassword
}