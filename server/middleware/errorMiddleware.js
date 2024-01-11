const errorMiddleware=(error,req,res)=>{
    error.statusCode=error.statusCode||500;
    error.message= error.message|| "something went wrong!!";
    res.status(error.statusCode).json({
        success:false,
        message:error.message,
        stack:error.stack
    })
}
export default errorMiddleware