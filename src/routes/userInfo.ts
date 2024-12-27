import { Router, Request, Response } from "express";
import userModel from "../model/UserModel";
import jwt from "jsonwebtoken"

const router = Router();

router.get("/",async(req:Request,res:Response)=>{
try{
const token = req.cookies.token;
if(token === ""){
    return res.json({sucess:false,message:"Please Login First"})
}
const decodeToken = jwt.verify(token,process.env.JWT_CODE);
if(decodeToken.id){
const user = await userModel.findOne({_id:decodeToken.id}).select("-password")
if(!user){
    return res.json({sucess:false,message:"User not found"})
}
return res.json({sucess:true,message:"User founded",user})
}

}catch(e:any){
console.log("Could not able to get User Data", e.message);
return res.json({sucess:false,message:"Could not able to get User Data"})
}
});
export default router