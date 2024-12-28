import { Router, Request, Response } from "express";
import bcryptjs from "bcryptjs"
import userModel from "../model/UserModel";
import jwt from "jsonwebtoken"
const router = Router();

router.post("/",async(req:Request,res:Response)=>{
try{
const {email,password} = req.body;
if(!email || !password){
    return res.json({sucess:false,message:"Please enter valid credentails"})
}
const user = await userModel.findOne({email});
if(!user){
    return res.json({sucess:false,message:"User not found"})
}
const isPasswordValid = await bcryptjs.compare(password,user.password);

if(!isPasswordValid){
    return res.json({sucess:false,message:"Invalid Credentials"})
}
const tokenData = {
    id:user._id,
    email:user.email
}
const token = await jwt.sign(tokenData,process.env.JWT_CODE,{expiresIn:"1d"})

res.cookie("token",token,{
    httpOnly:true
})

return res.json({sucess:true,message:"SignIn Sucessfull"})
}catch(e:any){
console.log("Could not able to Login ", e.message);
return res.json({sucess:false,message:"Could not able to Login",error:e.message})
}
})

export default router