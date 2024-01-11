import mongoose from 'mongoose';
mongoose.set('strictQuery',false)
const connectToDB= async ()=>{
try{ 
const {connection}= await mongoose.connect(process.env.MONGODB_URL);
if(connection){
    console.log(`connection established at ${connection.host}`)
}



}catch(e){
    console.log("error in connecting!!!")
    process.exit(1)
    
}
}
export default connectToDB

