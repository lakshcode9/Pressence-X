// netlify/functions/summarizeSearch.js
// Summarize the first 5-6 Google CSE results via OpenRouter, returning a premium, concise output

// Safety: Only allow specific models and enforce short output
const MODEL = 'deepseek/deepseek-r1-distill-qwen-7b';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, cx, cseKey } = JSON.parse(event.body || '{}');
    if (!name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing name' }) };
    }

    // Fetch Google CSE results server-side to avoid flashing raw UI on client
    // Prefer env var CSE key if provided; otherwise rely on provided key (optional)
    const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CSE_KEY || cseKey;
    const googleCx = process.env.GOOGLE_CSE_CX || cx || '901473b4d9b1445ec';

    const cseUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(name)}&key=${encodeURIComponent(googleApiKey || '')}&cx=${encodeURIComponent(googleCx)}`;

    // If no API key is configured, fall back to client-side CSE if needed
    let items = [];
    if (googleApiKey) {
      const cseRes = await fetch(cseUrl);
      if (!cseRes.ok) {
        throw new Error(`CSE error: ${cseRes.status}`);
      }
      const cseJson = await cseRes.json();
      items = Array.isArray(cseJson.items) ? cseJson.items.slice(0, 6) : [];
    }

    // Shape minimal input for LLM
    const condensed = items.map((it, idx) => ({
      rank: idx + 1,
      title: it.title,
      link: it.link,
      snippet: it.snippet,
      displayLink: it.displayLink
    }));

    const prompt = `You are a premium PR analyst for luxury real estate professionals.
Given the following top search results for the name: "${name}", produce:
- A single concise sentence summarizing what shows up at first glance (avoid filler, 250 characters max).
- Then a definitive conclusion that their current press presence is not sufficient and they need stronger PR and placements. Keep tone authoritative, not negative.

Only output two lines:
1) Summary: <your one-line summary>
2) Conclusion: <your definitive statement>

Results JSON:
${JSON.stringify(condensed, null, 2)}
`;

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OpenRouter API key' }) };
    }

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://pressence-x.netlify.app/',
        'X-Title': 'Pressence360 Search Summary'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Be concise, premium, and authoritative. Never include code fences or JSON in responses. Max 2 lines total.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 220
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenRouter error: ${resp.status} ${text}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ summary: content, rawCount: condensed.length })
    };
  } catch (err) {
    console.error('summarizeSearch error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};


