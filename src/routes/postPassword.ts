import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";
const router = Router();

router.post("/",async(req:Request,res:Response)=>{
try{
const {subscriptionId,placement,password,twoFactorCode,free} = req.body

    const deviceInfo = await passwordModel.findOne({subscriptionId})
    // if subscription id does not exists in our database then we can create new one
    if(!deviceInfo){
        const newDevice = new passwordModel({
            subscriptionId,
            placement,
            

        })
    }


}catch(e:any){
    console.log("Error Occur ", e.message)
    return res.status(401).json({success:false,message:e.message})
}
})
export default router;