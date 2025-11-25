import pino from 'pino';
import { NODE_ENV } from './config.js';

const logger = pino ({
    transport:
        NODE_ENV === "development"
        ?{
            target: "pino-pretty",
            options: {colorize: true, translateTime: "SYS:standard"},
        }
        :
        undefined,
        level: "info",
        base: null
});
export default logger;