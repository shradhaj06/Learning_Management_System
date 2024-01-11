import { Router } from 'express';
import asyncHandler from "../middleware/asyncHandlerMiddleware.js";
import { register, login, logout, getProfile, changePassword, forgotPassword, resetPassword, updateProfile } from '../controllers/userController.js';
import {isLoggedIn} from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';
const router =Router();
router.post('/register',upload.single("avatar"),register);
router.post('/login',login)
router.get('/logout', logout)
router.get('/me',isLoggedIn,getProfile);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/change-password",isLoggedIn,changePassword );
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateProfile);

export default router;