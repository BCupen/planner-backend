import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const url = process.env.MONGO_DB_URL;
console.log(url);


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url);
        console.log(`MongoDB connected at: ${conn.connection.host}`);
    } catch(error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}