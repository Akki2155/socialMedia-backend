import mongoose  from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    id:{type:String},
    password:{type:String}
},{ timeStamps:true });


const UserSchema=mongoose.model("User", userSchema );


export default UserSchema;