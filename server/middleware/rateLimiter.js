const rateLimit = require('express-rate-limit');

// Max 100 requests per 15 min for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, try again in 15 minutes' },
});

// Max 10 login attempts per 15 min (blocks brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, try again in 15 minutes' },
});

// Max 15 fact-checks per 15 min (protects free API quotas)
const checkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Check limit reached, wait 15 minutes' },
});

module.exports = { apiLimiter, authLimiter, checkLimiter };