// netlify/functions/summarizeSearch.js
// Summarize the first 5-6 Google CSE results via OpenRouter, returning a premium, concise output

// Safety: Only allow specific models and enforce short output
const MODEL = 'deepseek/deepseek-r1-distill-qwen-7b';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, cx, cseKey, debug } = JSON.parse(event.body || '{}');
    if (!name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing name' }) };
    }

    // Fetch Google CSE results server-side to avoid flashing raw UI on client
    // Prefer env var CSE key if provided; otherwise rely on provided key (optional)
    const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CSE_KEY || cseKey;
    const googleCx = process.env.GOOGLE_CSE_CX || cx || '901473b4d9b1445ec';

    const cseUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(name)}&key=${encodeURIComponent(googleApiKey || '')}&cx=${encodeURIComponent(googleCx)}`;

    // Try Google CSE JSON first (if API key is present). Otherwise fall back to DuckDuckGo HTML scraping.
    let items = [];
    const diagnostics = { cseAttempted: false, cseOk: false, ddgUsed: false, model: MODEL, openrouterOk: false, openrouterStatus: null };
    if (googleApiKey) {
      try {
        diagnostics.cseAttempted = true;
        const cseRes = await fetch(cseUrl);
        if (cseRes.ok) {
          const cseJson = await cseRes.json();
          items = Array.isArray(cseJson.items) ? cseJson.items.slice(0, 6) : [];
          diagnostics.cseOk = true;
        }
      } catch (e) {
        console.warn('CSE fetch failed, will try DuckDuckGo fallback');
      }
    }

    if (!items || items.length === 0) {
      try {
        diagnostics.ddgUsed = true;
        const ddgHtml = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(name)}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PressenceBot/1.0)' }
        }).then(r => r.text());

        const results = [];
        const anchorRegex = /<a[^>]*class=["']result__a["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
        let match;
        while ((match = anchorRegex.exec(ddgHtml)) && results.length < 6) {
          const link = match[1];
          const title = match[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
          results.push({ title, link, snippet: '', displayLink: '' });
        }
        items = results;
      } catch (e) {
        console.warn('DuckDuckGo fallback failed');
      }
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
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OpenRouter API key', diagnostics }) };
    }

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'Referer': 'https://pressence-x.netlify.app/',
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

    diagnostics.openrouterStatus = resp.status;
    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenRouter error', resp.status, text);
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenRouter request failed', status: resp.status, diagnostics }) };
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    diagnostics.openrouterOk = true;

    return {
      statusCode: 200,
      body: JSON.stringify({ summary: content, rawCount: condensed.length, diagnostics: debug ? diagnostics : undefined })
    };
  } catch (err) {
    console.error('summarizeSearch error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};


