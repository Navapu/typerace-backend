import mongoose from "mongoose";
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from "../config/config.js";
import logger from "../config/logger.js";

export const connectDB = async () => {
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(url);
        logger.info("Connected to MongoDB");
        logger.info(`DB: ${mongoose.connection.db.databaseName}`);
    }catch(error){
        logger.error(error,"Error connecting to MongoDB:");
    }
}