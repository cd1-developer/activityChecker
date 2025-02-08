import { Router, Request, Response } from "express";
import avModel from "../model/avEmailModel";

const router = Router();

router.get("/",async(req:Request,res:Response)=>{
    try{
        const coreAvData = await avModel.find();
        return res.json({success:true,coreAvData})
    }catch(e:any){
        return res.json({success:false,message:`Error in getting payment Data ${e.message}`})
    }
})
export default router