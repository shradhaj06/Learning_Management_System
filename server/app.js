import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import router from './routes/userRoute.js';
import morgan from 'morgan';
import { config } from 'dotenv';
config();
import errorMiddleware from './middleware/errorMiddleware.js';
import courseRoute from './routes/courseRoute.js';
import paymentrouter from './routes/paymentRoute.js';
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/ping',(req,res)=>{
    res.send('Pong!!')
})
app.use('/api/v1/user',router)
app.use('/api/v1/course',courseRoute)
app.use('/api/v1/payment',paymentrouter)
//if no match of module
app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! PAGE NOT FOUND');

})
app.use(errorMiddleware);
export default app;

