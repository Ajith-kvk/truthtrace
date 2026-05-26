const axios = require('axios');

const newsService = async (claimText) => {
  try {
    // Extract first 5 words for a cleaner search query
    const query = claimText
      .trim()
      .split(' ')
      .slice(0, 5)
      .join(' ');

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        pageSize: 5,
        sortBy: 'relevancy',
        language: 'en',
        apiKey: process.env.NEWS_API_KEY,
      },
      timeout: 5000,
    });

    const articles = response.data.articles || [];

    if (articles.length === 0) {
      console.log('No news results found');
      return [];
    }

    // Filter out removed articles and extract what we need
    const results = articles
      .filter((a) => a.title && a.title !== '[Removed]')
      .map((article) => ({
        title: article.title,
        url: article.url,
        source: article.source?.name || 'Unknown Source',
        publishedAt: article.publishedAt || '',
      }));

    console.log(`News API: found ${results.length} articles`);
    return results;

  } catch (error) {
    console.error('News API error:', error.message);
    return [];
  }
};

module.exports = newsService;