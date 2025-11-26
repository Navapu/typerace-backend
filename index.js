import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import {PORT, BACKEND_URL} from './config/config.js';
import { connectDB } from './db/mongoose.js';
import logger from './config/logger.js';
import { notFoundHandler, errorMiddleware } from './middleware/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import textRouter from './routes/text.routes.js';
import gameRouter from './routes/game.routes.js'
import './workers/cleanupRefreshTokens.worker.js';
import {addcleanupQueue} from './queues/cleanupRefreshTokens.queue.js';
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
app.use('/texts', textRouter);
app.use('/games', gameRouter);

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


// ---------------------------
// CRON JOBS / TAREAS PROGRAMADAS
// ---------------------------
cron.schedule("0 0 * * *", async () => {
  logger.info("⏰ Ejecutando chequeo de suscripciones expiradas...");
  await addcleanupQueue();
});