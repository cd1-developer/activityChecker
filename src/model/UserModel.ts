import mongoose, { Schema, Document } from "mongoose";
interface User extends Document{
    email:string,
    password:string
}
const userSchema :Schema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model<User>("User",userSchema);
export default userModel