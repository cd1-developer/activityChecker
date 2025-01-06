import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";

const router = Router();

router.post('/',async(req:Request,res:Response)=>{
    try {
        const {placement,deviceId} = req.body;
        const device = await passwordModel.findOne({placement});
        if(device){
            device.deviceId = deviceId;
            return res.json({success:true,message:"Placement Booked"})
        }
    } catch (error:any) {
            console.log(`Error in Booking Placement ${error.message}`);
            return res.json({success:false,message:"Error in Bookin Placement"})
    }
})

export default router