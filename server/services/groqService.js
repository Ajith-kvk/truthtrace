const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Build the prompt sent to LLaMA 3
const buildPrompt = (claimText, factChecks, newsHeadlines) => {
  const factCheckSection =
    factChecks.length > 0
      ? factChecks
          .map((fc) => `- "${fc.text}" rated "${fc.rating}" by ${fc.publisher}`)
          .join('\n')
      : '- No direct matches found in fact-check databases.';

  const newsSection =
    newsHeadlines.length > 0
      ? newsHeadlines.map((n) => `- ${n.title} (${n.source})`).join('\n')
      : '- No related news found.';

  return `You are a professional fact-checker. Analyse the following claim carefully.

CLAIM: "${claimText}"

FACT-CHECK DATABASE RESULTS:
${factCheckSection}

RECENT NEWS CONTEXT:
${newsSection}

Think step by step. Consider the fact-check results and news context.
Then respond ONLY with a valid JSON object — no extra text, no markdown, no explanation outside the JSON.

{
  "credibilityScore": <integer between 0 and 100>,
  "explanation": "<2-3 sentences explaining what is false or misleading, citing specific evidence from the fact-checks or news above>"
}

Rules:
- credibilityScore 0-25 = clearly false or debunked
- credibilityScore 26-40 = misleading or missing context
- credibilityScore 41-60 = unverified, insufficient evidence
- credibilityScore 61-80 = likely true with minor caveats
- credibilityScore 81-100 = well-supported and verified
- Keep explanation under 100 words
- Write explanation for a general audience, not experts`;
};

const groqService = async (claimText, factChecks, newsHeadlines) => {
  try {
    const prompt = buildPrompt(claimText, factChecks, newsHeadlines);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // Low temperature = more consistent, less creative
      max_tokens: 300,
    });

    const rawText = completion.choices[0]?.message?.content || '';
    console.log('Groq raw response:', rawText);

    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Groq response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate the fields we need
    if (
      typeof parsed.credibilityScore !== 'number' ||
      typeof parsed.explanation !== 'string'
    ) {
      throw new Error('Groq response missing required fields');
    }

    return {
      credibilityScore: Math.round(parsed.credibilityScore),
      explanation: parsed.explanation,
    };

  } catch (error) {
    console.error('Groq service error:', error.message);
    // Safe fallback if Groq fails
    return {
      credibilityScore: 50,
      explanation:
        'Unable to fully analyse this claim at the moment. Please try again or verify through trusted news sources.',
    };
  }
};

module.exports = groqService;