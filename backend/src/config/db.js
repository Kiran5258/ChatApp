import mongoose from 'mongoose';

export const connectDb=async()=>{
    try{
        const con=mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb is connected...");
    }catch(err){
        console.error("Mongodb connecting error",env);
    }
}