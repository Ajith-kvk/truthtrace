const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema(
  {
    // null if guest user (not logged in)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimText: {
      type: String,
      required: [true, 'Claim text is required'],
      trim: true,
      maxlength: [1000, 'Claim cannot exceed 1000 characters'],
    },
    credibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // One of these 4 labels
    verdict: {
      type: String,
      enum: ['TRUE', 'LIKELY TRUE', 'UNVERIFIED', 'MISLEADING', 'FALSE'],
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    // Array of fact-check sources like [{url, publisher, rating}]
    sources: {
      type: Array,
      default: [],
    },
    // Array of related news headlines
    newsContext: {
      type: Array,
      default: [],
    },
    // How long the AI pipeline took in milliseconds
    processingMs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Check', checkSchema);