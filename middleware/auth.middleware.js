/**
 * Authentication Middleware
 * Middleware de autenticación
 * 
 * Verifica el token JWT enviado en el encabezado 'Authorization'.
 * Si el token es válido, añade `id` y `role` al objeto `req` y permite continuar.
 * Si el token falta o es inválido, responde con estado 401.
 * 
 * Verifies the JWT token from the 'Authorization' header.
 * If the token is valid, adds `id` and `role` to `req` and continues.
 * If missing or invalid, responds with 401 Unauthorized.
 */
import { verifyToken } from '../services/auth.service.js';
import { User } from '../db/models/index.js';
export const authMiddleware = async (req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace("Bearer ","");
        if(!token){
            res.status(401);
            return next(new Error("required token"))
        }
        const decoded = await verifyToken(token);

        if (!decoded) {
            res.status(401);
            return next(new Error("invalid or expired token"));
        }


        const user = await User.findById(decoded.id);

        if(!user){
            res.status(404)
            return next(new Error("user not found"))
        }
        req.user = {id: decoded.id, role: decoded.role };
        next();
    }catch(error){
        res.status(401);
        next("Unauthorized");
    }
}