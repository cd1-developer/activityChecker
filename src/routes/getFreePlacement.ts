import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";

const router = Router();

router.get("/",async(req:Request,res:Response)=>{
    try{
        const devices = await passwordModel.find({});
        const freePlacements = [];
        if(devices){
            devices.forEach(device =>{
                if(device.isfree === true){
                    freePlacements.push(device);
                }
            })
            return res.json({sucess:true,message:"Free Placements" ,freePlacements})
        }
    }catch(e:any){
        console.log(`Error in gettng Free Placement ${e.message}`);
        return res.json({sucess:false,message:"Error in getting Free Placement"})
    }
})

export default router