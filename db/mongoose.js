import mongoose from "mongoose";
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from "../config/config.js";

export const connectDB = async () => {
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
        console.log(`DB: ${mongoose.connection.db.databaseName}`);
    }catch(error){
        console.error(`Error connecting to MongoDB: ${error}`);
    }
}