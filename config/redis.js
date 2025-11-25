import IORedis from 'ioredis';
import logger from './logger.js';
export const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
    enableOfflineQueue: true
})
connection.on('connect', () => logger.info('Conectado a Redis'));
connection.on('error', err => logger.error('Error Redis:', err));