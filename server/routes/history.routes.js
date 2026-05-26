const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Check = require('../models/Check');

router.get('/', protect, async (req, res) => {
  try {
    const checks = await Check.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('claimText credibilityScore verdict explanation processingMs createdAt');

    res.json({ checks });
  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;