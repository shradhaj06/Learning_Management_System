import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandlerMiddleware.js";

const isLoggedIn=async(req,res,next)=>{
const {token} = req.cookies;
    if(!token){
        return next(new AppError("Unauthenticated, please login", 401));

    }
const tokenDetails = await jwt.verify(token,process.env.JWT_SECRET);
    if(!tokenDetails){
        return next(new AppError("Unauthenticated, please login",401))
    }
  req.user=   await tokenDetails;
    next();
}

const authorizedRoles = (...roles) => asyncHandler(async (req, _res, next) => {
    const currentRole = req.user.role; 
    if (!roles.includes(currentRole)) {
      return next(new AppError("Unauthorized to perform the action", 403));
    }
    next();
  });
const authorizedSubscriber=async(req,res,next)=>{
 if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route.", 403));
  }

  next();
}

export {isLoggedIn,authorizedRoles,authorizedSubscriber};