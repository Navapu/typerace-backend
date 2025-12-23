import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {msg: "Too many requests, please try again in 15 minutes"},
    standardHeaders: true,
    legacyHeaders: false
})

export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {msg: "Too many requests, please try again later"},
    standardHeaders: true,
    legacyHeaders: false
})

export const registerAdminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: {msg: "Too many requests, please try again later"},
    standardHeaders: true,
    legacyHeaders: false
})