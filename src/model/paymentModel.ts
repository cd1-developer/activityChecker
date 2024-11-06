import mongoose, { Schema, Document } from "mongoose";
interface Payments extends Document{
subscriptionId:string,
memberShip:string,
access:string,
rebill:string,
rate:string,
group:string,
start:string,
expiry:string,
logs:string
}
const paymentSchema :Schema = new Schema({
    subscriptionId:{
        type:String,
        required:true,
        unique:true
    },
    memberShip:{
        type:String,
        required:true
    },
        access:{
        type:String,
        required:true
    },
    rebill:{
        type:String,
        required:true
    },
    rate:{
        type:String,
        required:true
    },
    group:{
        type:String,
        required:true
    },
    start:{
        type:String,
        required:true
    },
    expiry:{
        type:String,
        required:true
    },
    logs:{
        type:String,
        required:true,
        default:null
    }
})
const paymentModel= mongoose.models.Password as mongoose.Model<Payments> || mongoose.model<Payments>("Payment",paymentSchema);
export default paymentModel