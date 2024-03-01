import mongoose from "mongoose";
import "dotenv/config";
const dbConnect = async ()=>{
    try {
        const uri = process.env.MONGO_URI;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    }
    catch (error){
        console.log(`error : ${error.message}`);
        process.exit();
    }
}

export default dbConnect;