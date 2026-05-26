const express = require('express');
const router = express.Router();
const { submitCheck, getCheck } = require('../controllers/check.controller');
const { optionalAuth } = require('../middleware/auth');
const { checkLimiter } = require('../middleware/rateLimiter');

// POST /api/check — submit a claim (guests allowed, logged-in users get history)
router.post('/', checkLimiter, optionalAuth, submitCheck);

// GET /api/check/:id — get a single check result by ID
router.get('/:id', getCheck);

module.exports = router;