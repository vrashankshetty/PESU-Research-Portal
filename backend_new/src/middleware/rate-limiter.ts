import rateLimit from 'express-rate-limit';

const message = "Sorry, you've sent too many requests. Please try again later.";

/* 100 requests per 5 seconds */
export const rateLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 100,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
});

/* 20 requests per 5 minutes */
export const rateLimiterMedium = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
});

/* 3 requests per 10 seconds */
export const rateLimiterStrictShort = rateLimit({
    windowMs: 10 * 1000,
    max: 3,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
});

/* 10 requests per 3 hours */
export const rateLimiterStrictLong = rateLimit({
    windowMs: 180 * 60 * 1000,
    max: 10,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
});
