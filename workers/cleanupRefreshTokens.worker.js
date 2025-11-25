import { Worker } from 'bullmq';
import { connection } from '../config/redis.js';
import { cleanExpiredRefreshTokens } from '../services/tokenCleanup.service.js';
import logger from '../config/logger.js';

const cleanup = new Worker('cleanup-tokens', async (job) => {
  try {
    logger.info(`Ejecutando job: ${job.name}`);
    await cleanExpiredRefreshTokens();
  } catch (err) {
    logger.error(`Error ejecutando job: ${job.name}`, err);
    throw err;
  }
}, { connection });

cleanup.on('completed', job => logger.info(`Job completado: ${job.name}`));
cleanup.on('failed', (job, err) => logger.error(`Job fallido: ${job?.name}`, err));