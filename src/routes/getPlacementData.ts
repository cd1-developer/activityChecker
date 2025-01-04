import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";

const router = Router();

router.get("/",async(req:Request,res:Response)=>{
    try{
        const {deviceId} = req.headers
        
        // If deviceId is found then return the Device Data
        if(deviceId){
            let device = await passwordModel.findOne({deviceId});
            if(device){
                return res.json({sucess:true,device})
            }
            // if Devices are not found then give me all free Placements
            let devices = await passwordModel.find({});
            
           if(devices){
            let freeDevice = [];
            devices.forEach(data =>{
                if(data.isfree === true){
                    freeDevice.push(data)
                }
            });

            return res.json({sucess:true,freeDevice})
           }

            
        }else{
            return res.json({sucess:false,message:"Device Id not found"})
        }
    }catch(e:any){
        console.log(`Error in gettng Free Placement ${e.message}`);
        return res.json({sucess:false,message:"Error in getting Free Placement"})
    }
})

export default router