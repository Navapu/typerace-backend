import dotenv from 'dotenv';
dotenv.config();


// ---------------------------
// SERVER / SERVIDOR
// ---------------------------
export const PORT = process.env.PORT;
export const BACKEND_URL = process.env.BACKEND_URL;
export const NODE_ENV = process.env.NODE_ENV;


// ---------------------------
// BBDD
// ---------------------------
export const DB_USER = process.env.DB_USER || "user";
export const DB_PASS = process.env.DB_PASS || "1234";
export const CLUSTER = process.env.CLUSTER || "cluster.mongodb.net";
export const DATABASE = process.env.DATABASE || "database";

// ---------------------------
// AUTHENTICATION / AUTENTICACIÓN
// ---------------------------
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-later";
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
// ---------------------------
// GOOGLE OAUTH
// ---------------------------
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;