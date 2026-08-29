import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const createLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    error: message,
    retryAfter: req.rateLimit.resetTime,
  });
};

export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email?.toLowerCase?.() || 'unknown';
    return `${ipKeyGenerator(req)}:${email}`;
  },
  handler: createLimitHandler('Too many OTP requests. Please try again later.'),
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email?.toLowerCase?.() || 'unknown';
    return `${ipKeyGenerator(req)}:${email}`;
  },
  handler: createLimitHandler('Too many verification attempts. Please try again later.'),
});

export const quoteSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: createLimitHandler('Too many quote submissions. Please try again later.'),
});

export const reviewSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: createLimitHandler('Too many review submissions. Please try again later.'),
});
