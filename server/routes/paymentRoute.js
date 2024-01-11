import { Router } from "express";
import { buySubscription, cancelSubscription, getAllPayments, getRazorpayApiKey, verifySubscription } from "../controllers/paymentController.js";
import { authorizedRoles, isLoggedIn } from "../middleware/authMiddleware.js";
const paymentrouter =Router();
paymentrouter.route('/razorpay-key').get(isLoggedIn,getRazorpayApiKey)
paymentrouter.route('/subscribe').post(isLoggedIn,buySubscription)
paymentrouter.route('/verify').post(isLoggedIn,verifySubscription)
paymentrouter.route('/unsubscribe').post(isLoggedIn,cancelSubscription)
paymentrouter.route('/').get(isLoggedIn,authorizedRoles("ADMIN"),getAllPayments)
export default paymentrouter;
