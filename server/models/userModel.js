import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        minLength:[3,"Name is too short!!"],
        maxLength:[500,"Name is extremely large!!"],
        required:[true,"name is required"]

    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"account already exists!!"],
        lowercase:true,
        trim:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"please fill a valid email"]
    },
    password: {
        type:String,
        //required:[true,'password is required'],
        minLength:[8,"your password must be atleast of 8 length"],
        select:false,
    },
    role:{
        type:String,
        enum:['USER','admin'],
        default:"USER",


    },
    subscription: {
        id: String,
        status: String,
      },
    avatar:{
        
        public_id:String,
        secure_url:String
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    subscription:{
        id:String,
        status:String
    }

    

},{
    timestamps:true
})
userSchema.pre('save',async function(next){
    const saltRounds = 10;
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,saltRounds);
    next();
} )
userSchema.methods={
    comparePassword: async function (plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
      },
generateJWTToken: async function(){
    return await jwt.sign(
        {
        id:this._id,role:this.role,email:this.email,subscription:this.subscription
    },
    process.env.JWT_SECRET,
    {
        expiresIn:process.env.JWT_expiry

    }
    )
},
generatePasswordToken:async function(){
    const resetToken = await crypto.randomBytes(20).toString('hex');
if (this) {
    this.forgotPasswordToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
} else {
    // Handle the case where 'this' is undefined or not the expected object
    throw new Error('Invalid context for generating the forgotPasswordToken.');
}

this.forgotPasswordExpiry=Date.now()+15*60*1000;
return resetToken;

}
}
const User=mongoose.model('User',userSchema);
export {
    User,userSchema
}