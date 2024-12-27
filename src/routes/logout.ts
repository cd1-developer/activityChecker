import {Router,Request,Response} from "express";
const router = Router();

router.get("/",(req:Request,res:Response)=>{
    try{
        res.cookie("token","",{
            httpOnly:true,
            expires: new Date(0)
        })
        return res.json({sucess:true,messsage:"You LogOut SucessFully"})
    }catch(e:any){
        console.log("could not able to Log Out ", e.message);
        return res.json({sucess:false,message:"Could not able to logOut"})
    }
})
export default router