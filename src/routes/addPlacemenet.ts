import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";
import encryptPassword from "../helper/encryptPassword";

const router = Router();

router.post("/",async(req:Request,res:Response)=>{
    try{
        const {placement,username,password,twoFactorCode} = req.body;
        
        const device = await passwordModel.findOne({placement});
        if(device){
       
           if(device.isfree){
                device.username = username;
                device.password = encryptPassword(password)
                device.twoFactorCode = twoFactorCode;
                device.isfree = true;
             
                return res.json({sucess:true,message:"Password is updated"})
           }else return 
        }else{
            const newPassword = new passwordModel({
                placement,
                username,
               password: encryptPassword(password),
                twoFactorCode,
                isfree:true
            })
          
           await newPassword.save();
            return res.json({sucess:true,message:"Password is added"})
        }
    }catch(e:any){
        console.log("Could not able to add Placement ",e.message);
        return res.json({sucess:false,message:"Error in adding placement",error:e.message})
    }
})

export default router