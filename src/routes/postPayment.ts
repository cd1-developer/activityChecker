import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";
const router = Router();

router.post("/",async(req:Request,res:Response)=>{
    try{
        const {subscriptionId,memberShip,access,rebill,rate,group,start,expiry,logs,messageType} = req.body
        const paymentInfo = await paymentModel.findOne({subscriptionId})
        // subscription id exists in database
        if(paymentInfo){
            paymentInfo.memberShip = memberShip;
            paymentInfo.access = access;
            paymentInfo.rebill = rebill;
            paymentInfo.group = group;
            paymentInfo.expiry = expiry;
            paymentInfo.logs = logs;
            await paymentInfo.save()
            return res.status(201).json({success:true,message:messageType})
        }
        // subscription id does not exists in database
        else{
            const newPayment = new paymentModel({
                subscriptionId,
                memberShip,
                access,
                rebill,
                rate,
                group,
                start,
                expiry,
                logs
            })
      
            await newPayment.save()
            return res.status(201).json({success:true,message:messageType})
        }
      
    }catch(e:any){
        console.log("Error in updating payments ", e.message);
        return res.status(401).json({success:false,messae:e.message})
    }
})
export default router;