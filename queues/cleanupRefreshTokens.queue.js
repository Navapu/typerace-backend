import { Queue } from 'bullmq';
import { connection } from '../config/redis.js';

export const cleanupQueue  = new Queue('cleanup-tokens', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: true
    }
})

export const addcleanupQueue = async () => {
    await cleanupQueue.add('remove-expired-tokens', {}, {});
}


