import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.get("/",async(req:Request,res:Response)=>{
    try{
        const paymentData = await paymentModel.find();
        return res.json({success:true,paymentData})
    }catch(e:any){
        return res.json({success:false,message:`Error in getting payment Data ${e.message}`})
    }
})
export default router