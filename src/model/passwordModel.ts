import mongoose ,{Schema,Document} from "mongoose"
 
interface Password extends Document{
    subscriptionId : string,
    placement :string,
    password:string,
    twoFactorCode:string,
    free:Boolean,
    deviceId:String
}
const passwordSchema :Schema = new Schema({
    subscriptionId :{
        type:String,
        required:true,
        unique: true,
    },
    placement:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    twoFactorCode:{
        type:String
    },
    free:{
        type:Boolean,
        required:true,
        default:true
    },
    deviceId:{
        type:String,
        default:null
    }
})
const passwordModel = mongoose.models.Password as mongoose.Model<Password> || mongoose.model<Password>("Password",passwordSchema);
export default passwordModel