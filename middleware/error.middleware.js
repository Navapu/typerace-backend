/**
 * Not Found Route Handler Middleware
 * Middleware para rutas no encontradas
 * 
 * Catches all requests to undefined routes and forwards a 404 error.
 * Captura todas las solicitudes a rutas inexistentes y lanza un error 404.
 */

export const notFoundHandler = (req,res, next) => {
    const error = new Error("404 route not found")
    res.status(404);
    next(error);
}

/**
 * Global Error Handler Middleware
 * Middleware global de manejo de errores
 * 
 * Handles all errors passed via next(). Sends JSON with:
 * Maneja todos los errores pasados con next(). Devuelve un JSON con:
 * - status: "error"
 * - msg: error message / mensaje de error
 * - stack: error stack trace (only in development) / traza del error (solo en desarrollo)
 */

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        status: "error",
        msg: err.message,
        stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
    })
    next();
}