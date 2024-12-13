import {Router,Response,Request} from "express";
import trueGrowthModel from "../model/trueGrowthModel";

const router = Router();
router.put("/",async(req:Request,res:Response)=>{
    try {
        const {username,updatedUsername} = req.body;
        if(!username || !updatedUsername){

            res.json({success:false,message:"Please add Username"})
        }
        const trueGrowthData = await trueGrowthModel.findOne({username});
   
        if(trueGrowthData){
            trueGrowthData.username = updatedUsername;
            await trueGrowthData.save();
            res.json({success:true,message:"Username in TrueGrowth Model Updated Successfully"})
        }
      

    } catch (error:any) {
        console.log(`Error in updating Username, ${error.message}`);
        res.json({success:false,message:"Error in updating Username"})
    }
})
export default router