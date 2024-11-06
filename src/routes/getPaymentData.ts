import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";
const router = Router();
router.get("/",async(req:Request,res:Response)=>{
    try{
        const paymentInfo = await paymentModel.find({});
        return res.status(201).json({success:true,data:paymentInfo})
    }catch(e:any){
        console.log("Could not be get Data");
        return res.status(401).json({success:false,message:e.message})
    }
})
export default router;