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

cleanupQueue.add('remove-expired-tokens', {}, {
    repeat: { cron: '0 0 * * *' },
    jobId: 'remove-expired-tokens-job'
});