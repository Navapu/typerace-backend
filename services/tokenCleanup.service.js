import { User } from '../db/models/index.js';
import logger from '../config/logger.js';

export const cleanExpiredRefreshTokens = async () => {
    const cursor = User.find().cursor();
    let batch = [];
    let totalUsers = 0;
    let totalTokensRemoved = 0;
    for (let user = await cursor.next(); user != null; user = await cursor.next()) {
        batch.push(user);
        if (batch.length >= 100) {
            const removed = await processBatch(batch);
            totalTokensRemoved += removed;
            totalUsers += batch.length;
            batch = [];
        }
    }
    if (batch.length > 0) {
        const removed = await processBatch(batch);
        totalTokensRemoved += removed;
        totalUsers += batch.length;
    }
    logger.info(`Limpieza de tokens: usuarios procesados: ${totalUsers}, tokens eliminados: ${totalTokensRemoved}`);
};

const processBatch = async (batch) => {
    let removedCount = 0;
    for (const user of batch) {
        if (!Array.isArray(user.refreshTokens)) continue;
        const before = user.refreshTokens.length;
        user.refreshTokens = user.refreshTokens.filter(rt => {
            if (!rt.expiresAt) return true;
            return rt.expiresAt > new Date();
        });
        const after = user.refreshTokens.length;
        removedCount += before - after;
        if (before !== after) {
            await user.save();
        }
    }
    return removedCount;
};