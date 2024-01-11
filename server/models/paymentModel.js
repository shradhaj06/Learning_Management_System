import{model,Schema} from 'mongoose';

const PaymentSchema = new Schema({
razorpay_payment_id:{
type:String,
required:true
},
razorpay_subscription_id:{
    type:String,
    required:true
},
razorpay_signature_id:{
    type:String,
    required:true
}
});
const Payment = model("Payment", PaymentSchema)
export default Payment;