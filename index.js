import express from 'express';
import cors from 'cors';
import {PORT, BACKEND_URL} from './config/config.js';
import { connectDB } from './db/mongoose.js';
import logger from './config/logger.js';
import { notFoundHandler, errorMiddleware } from './middleware/error.middleware.js';
import authRouter from './routes/auth.routes.js'

const app = express();


// ---------------------------
// MIDDLEWARES / MIDDLEWARES
// ---------------------------
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("TypeRace API")
})

// Mount API routes
app.use('/auth', authRouter);

// ---------------------------
// ERROR HANDLING / MANEJO DE ERRORES
// ---------------------------
app.use(notFoundHandler);
app.use(errorMiddleware);


// ---------------------------
// SERVER START / INICIO DEL SERVIDOR
// ---------------------------
app.listen(PORT, () => {
    logger.info(`Server running at: ${BACKEND_URL}${PORT}`)
})