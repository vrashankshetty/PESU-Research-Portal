import rateLimit from 'express-rate-limit';

const message = "Sorry, you've sent too many requests. Please try again later.";

/* 100 requests per 60 seconds */
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
});

