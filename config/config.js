import dotenv from 'dotenv';
dotenv.config();


// ---------------------------
// SERVER / SERVIDOR
// ---------------------------
export const PORT = process.env.PORT;
export const BACKEND_URL = process.env.BACKEND_URL;



// ---------------------------
// BBDD
// ---------------------------
export const DB_USER = process.env.DB_USER || "user";
export const DB_PASS = process.env.DB_PASS || "1234";
export const CLUSTER = process.env.CLUSTER || "cluster.mongodb.net";
export const DATABASE = process.env.DATABASE || "database";