const axios = require('axios');

const factCheckService = async (claimText) => {
  try {
    const response = await axios.get(
      'https://factchecktools.googleapis.com/v1alpha1/claims:search',
      {
        params: {
          query: claimText,
          key: process.env.GOOGLE_FACT_CHECK_KEY,
          pageSize: 5,
          languageCode: 'en',
        },
        timeout: 5000, // 5 second timeout
      }
    );

    const claims = response.data.claims || [];

    if (claims.length === 0) {
      console.log('No fact-check results found for this claim');
      return [];
    }

    // Extract only what we need
    const results = claims.map((claim) => {
      const review = claim.claimReview?.[0] || {};
      return {
        text: claim.text || '',
        publisher: review.publisher?.name || 'Unknown Publisher',
        url: review.url || '',
        rating: review.textualRating || 'No rating',
        reviewDate: review.reviewDate || '',
      };
    });

    console.log(`Fact Check API: found ${results.length} results`);
    return results;

  } catch (error) {
    // Don't crash the whole pipeline if this API fails
    console.error('Fact Check API error:', error.message);
    return [];
  }
};

module.exports = factCheckService;