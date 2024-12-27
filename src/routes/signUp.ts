import { Router, Request, Response } from "express";
import bcryptjs from "bcryptjs"
import userModel from "../model/UserModel";

const router = Router();

router.post("/", async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.json({sucess:false,message:"Please enter valid credentails"})
        }
        const user = await userModel.findOne({email});
        if(user){
            return res.json({sucess:false,message:"User already exist"})
        }
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt);
        const newUser = new userModel({
            email,
            password:hashPassword
        })
        await newUser.save();
        return res.json({sucess:true,message:"Account Created Sucessfully"})
    }catch(e:any){
        console.log("Could not able to Create User ", e.message);
        return res.json({message:"Could not able to create User"})
    }
})
export default router