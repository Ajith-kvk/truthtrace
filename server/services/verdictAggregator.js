// Converts 0-100 score to a verdict label
const scoreToVerdict = (score) => {
  if (score <= 25) return 'FALSE';
  if (score <= 40) return 'MISLEADING';
  if (score <= 60) return 'UNVERIFIED';
  if (score <= 80) return 'LIKELY TRUE';
  return 'TRUE';
};

// Checks if any fact-check result explicitly rates the claim as false
const hasExplicitFalseRating = (factChecks) => {
  const falseKeywords = [
    'false', 'incorrect', 'wrong', 'fake',
    'misleading', 'misinformation', 'debunked',
    'pants on fire', 'not true', 'inaccurate',
  ];

  return factChecks.some((fc) => {
    const rating = fc.rating?.toLowerCase() || '';
    return falseKeywords.some((keyword) => rating.includes(keyword));
  });
};

const verdictAggregator = (groqResult, factChecks) => {
  let score = groqResult.credibilityScore;

  // If fact-checkers explicitly rated it false, cap score at 25
  if (factChecks.length > 0 && hasExplicitFalseRating(factChecks)) {
    console.log('Fact-check override: capping score at 25');
    score = Math.min(score, 25);
  }

  // If no fact-checks found, slightly reduce confidence
  if (factChecks.length === 0 && score > 60) {
    score = Math.min(score, 60);
  }

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    credibilityScore: score,
    verdict: scoreToVerdict(score),
  };
};

module.exports = verdictAggregator;