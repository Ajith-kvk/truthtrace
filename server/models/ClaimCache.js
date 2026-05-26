const mongoose = require('mongoose');

const claimCacheSchema = new mongoose.Schema({
  // SHA-256 hash of the claim text — used to find duplicates instantly
  claimHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  claimText: {
    type: String,
    required: true,
  },
  credibilityScore: {
    type: Number,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  sources: {
    type: Array,
    default: [],
  },
  // How many times this cached result was reused
  hitCount: {
    type: Number,
    default: 0,
  },
  // Auto-delete after 7 days — MongoDB TTL index does this automatically
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    index: { expires: 0 },
  },
});

module.exports = mongoose.model('ClaimCache', claimCacheSchema);