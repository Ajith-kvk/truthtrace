const crypto = require('crypto');
const Check = require('../models/Check');
const ClaimCache = require('../models/ClaimCache');
const User = require('../models/User');
const factCheckService = require('../services/factCheckService');
const newsService = require('../services/newsService');
const groqService = require('../services/groqService');
const verdictAggregator = require('../services/verdictAggregator');

const hashClaim = (text) => {
  return crypto
    .createHash('sha256')
    .update(text.toLowerCase().trim())
    .digest('hex');
};

// @route   POST /api/check
// @access  Public (optional auth)
const submitCheck = async (req, res) => {
  try {
    const { claimText } = req.body;

    // Validate
    if (!claimText || claimText.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide a claim to check' });
    }
    if (claimText.trim().length < 10) {
      return res.status(400).json({ message: 'Claim is too short — at least 10 characters' });
    }
    if (claimText.trim().length > 1000) {
      return res.status(400).json({ message: 'Claim too long — maximum 1000 characters' });
    }

    const startTime = Date.now();
    const claimHash = hashClaim(claimText);

    // Step 1 — Check cache
    const cached = await ClaimCache.findOne({ claimHash });
    if (cached) {
      console.log('Cache hit!');
      await ClaimCache.findByIdAndUpdate(cached._id, { $inc: { hitCount: 1 } });

      const check = await Check.create({
        userId: req.user ? req.user._id : null,
        claimText: claimText.trim(),
        credibilityScore: cached.credibilityScore,
        verdict: cached.verdict,
        explanation: cached.explanation,
        sources: cached.sources,
        newsContext: [],
        processingMs: Date.now() - startTime,
      });

      if (req.user) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { checksCount: 1 } });
      }

      return res.json({
        checkId: check._id,
        claimText: check.claimText,
        credibilityScore: cached.credibilityScore,
        verdict: cached.verdict,
        explanation: cached.explanation,
        sources: cached.sources,
        newsContext: [],
        processingMs: check.processingMs,
        fromCache: true,
      });
    }

    // Step 2 — Run all external APIs in parallel
    console.log('Running AI pipeline...');
    const [factChecks, newsHeadlines] = await Promise.all([
      factCheckService(claimText),
      newsService(claimText),
    ]);

    console.log(`Got ${factChecks.length} fact-checks, ${newsHeadlines.length} news articles`);

    // Step 3 — Send to Groq for AI reasoning
    const groqResult = await groqService(claimText, factChecks, newsHeadlines);

    // Step 4 — Aggregate into final verdict
    const { credibilityScore, verdict } = verdictAggregator(groqResult, factChecks);

    const processingMs = Date.now() - startTime;

    // Step 5 — Save to database
    const check = await Check.create({
      userId: req.user ? req.user._id : null,
      claimText: claimText.trim(),
      credibilityScore,
      verdict,
      explanation: groqResult.explanation,
      sources: factChecks,
      newsContext: newsHeadlines,
      processingMs,
    });

    // Step 6 — Save to cache
    await ClaimCache.create({
      claimHash,
      claimText: claimText.trim(),
      credibilityScore,
      verdict,
      explanation: groqResult.explanation,
      sources: factChecks,
    });

    // Step 7 — Update user check count
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { checksCount: 1 } });
    }

    console.log(`Pipeline done in ${processingMs}ms — verdict: ${verdict} (${credibilityScore})`);

    res.json({
      checkId: check._id,
      claimText: check.claimText,
      credibilityScore,
      verdict,
      explanation: groqResult.explanation,
      sources: factChecks,
      newsContext: newsHeadlines,
      processingMs,
      fromCache: false,
    });

  } catch (error) {
    console.error('Check error:', error.message);
    res.status(500).json({ message: 'Server error while processing claim' });
  }
};

// @route   GET /api/check/:id
const getCheck = async (req, res) => {
  try {
    const check = await Check.findById(req.params.id);
    if (!check) {
      return res.status(404).json({ message: 'Check not found' });
    }
    res.json(check);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitCheck, getCheck };