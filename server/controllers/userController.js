import { User, userSchema } from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { v2 } from 'cloudinary';
import fs from 'fs/promises';
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";
const cookieOptions={
    secure:true,
    httpOnly:true,
    maxAge: 24*60*60*1000
}
const register= async (req,res,next)=>{
    const {fullName,email,password}= req.body;
    if(!fullName||!email|| !password){
        return next(new AppError('All fields are required',400));
    }
    const userExists = await User.findOne({email});
    if(userExists){
        return next(new AppError('Email already exists',400))
    }
    const user= await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',

        }
    })
    if(!user){
 return next(new AppError('UNABLE TO CREATE ACCOUNT',400))
    }
    console.log("file details>",JSON.stringify(req.file))
    if(req.file){
       try {
         const result = await v2.uploader.upload(req.file.path, {
             folder:'lms',
             crop:'fill',
             gravity:'faces',
             width:250, 
             height:250,
         });
         if(result){
          user.avatar.public_id= result.public_id;
             user.secure_url= result.secure_url;
             //remove file from local server
            //  fs.rm(`uploads/${req.file.fileName}`)
         }
     }catch (error) {
        return next(
            new AppError(error || 'File not uploaded, please try again', 400)
          );
       }
       }
  
    await user.save();
    const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie('token', token, cookieOptions);

    return res.status(201).json({
        success:true,
        message:"user registration successfully",
        user,
    })



    
}
const login= async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new AppError("All fields required",400))
    }
    const user=await User.findOne({email}).select('+password');
    if(!(user && (await user.comparePassword(password)))) {
        return next(new AppError("Credentials do not match!",400))
    }
    const token = await user.generateJWTToken();
    user.password=undefined;
    res.cookie('token',token,cookieOptions);
    res.status(200).json({
        success:true,
        message: "user successfully logged in!!",
        user
    })
    

}
const logout=(req,res,next)=>{
    res.cookie("token",null,{
        httpOnly:true,
        secure:true,
        //secure: process.env.NODE_ENV === 'production' ? true : false
        maxAge:0
    })
    res.status(200).json({
        success:true,
        message:"User successfully logged out!!"

    })
    
}
const getProfile=async(req,res,next)=>{
    try {
       const user =await User.findById(req.user.id); 
       return res.status(200).json({
        success:true,
        message:'User details',
        user
       })
    } catch (error) {
        return next(new AppError(error.message,400))
    }

}
const forgotPassword= async(req,res,next)=>{
const {email}= req.body;
if(!email){
    return next(new AppError("Email is required!!",400));
}
const user = await User.findOne({email});
if(!user){
    return next(new AppError("unauthenticated user",400));
}
const resetToken = await user.generatePasswordToken();
await user.save();
const resetPasswordUrl= `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
const subject = "Reset Password";
 const message=`You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
 try{
    await sendEmail(email,subject,message);
    return res.status(200).json({
        success:true,
        message:`Reset password url has been sent to your ${email}`
    })

 }catch(error){
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();
    return next(
        new AppError(
          error.message || 'Something went wrong, please try again.',
          500
        ));

 }
}
const resetPassword=async(req,res,next)=>{
const {resetToken}=req.params;
const {password} =req.body;
 // Check if password is not there then send response saying password is required
  if (!password) {
    return next(new AppError('Password is required', 400));
  }

const forgotPasswordToken= crypto.createHash('sha256').update(resetToken).digest('hex');
const user = User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry:{$gt:Date.now()}
})
if(!user){
    return next(new AppError("token is invalid or expired ",400))
}
user.password=password;
user.forgotPasswordExpiry=undefined;
user.forgotPasswordToken=undefined;
await user.save();
res.status(200).json({
    success:true,
    message:"password changed successfully!"
})


}
const changePassword= async(req,res,next)=>{
    const {oldPassword,newPassword}= req.body;
    const {id}=req.user;
    if(!oldPassword|| !newPassword){
        return next(new AppError("all fields are mandatory!!",400));
    }
    const user = User.findById(id).select('+password');
    if(!user){
        return next(new AppError("user does not exist",400));
    }
    if(!(await bcrypt.compare(oldPassword, user.password))){
return next(new AppError("passwords do not match",400))
    }
user.password=newPassword;
await user.save();
user.password= undefined;
return res.status(200).json({
    success:true,
    message:"password changed successfull"
})
    
}
const updateProfile=async(req,res,next)=>{
 const {fullName}= req.body;
 const{id} = req.user.id;
 const user= await User.findById(id);
 if(!user){
    return next(new AppError("USER DOES NOT EXIST!!",400));
 }
 if(fullName){
    user.fullName= fullName;
 } 
 if(req.file){
    await v2.uploader.destroy(user.avatar.public_id);
    try {
        const result = await v2.uploader.upload(req.file.path, {
            folder:'lms',
            crop:'fill',
            gravity:'faces',
            width:250, 
            height:250,
        });
        if(result){
         user.avatar.public_id= result.public_id;
            user.secure_url= result.secure_url;
            //remove file from local server
           //  fs.rm(`uploads/${req.file.fileName}`)
        }
    }catch (error) {
       return next(
           new AppError(error || 'File not uploaded, please try again', 400)
         );
      }
      }
   await user.save();
   return res.status(200).json({
       success:true,
       message:"user updation uccessfully",
       data:user
   })
 }
  

export {
    login,logout,register,getProfile,forgotPassword,resetPassword,changePassword,updateProfile
}