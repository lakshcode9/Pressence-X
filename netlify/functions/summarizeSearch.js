// netlify/functions/summarizeSearch.js
// Summarize the first 5-6 Google CSE results via OpenRouter, returning a premium, concise output

// Default to OpenRouter auto router for maximum compatibility
const MODEL = 'openrouter/auto';
// Additional free/low-cost fallbacks (order matters)
const FALLBACK_MODELS = [
  'meta-llama/llama-3.1-8b-instruct',
  'mistralai/mistral-7b-instruct',
  'qwen/qwen-2-7b-instruct',
  'google/gemma-2-9b',
  'deepseek/deepseek-r1-distill-llama-70b',
  'openai/gpt-3.5-turbo'
];

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

    const prompt = `You are a premium PR strategist for luxury real estate.
Speak directly to the person in a conversational, human tone (second person, friendly, punchy).
No academic tone. Short sentences. Contractions allowed. No emojis.

Goal: After reading your output, they should feel clear, urgent FOMO that they need significantly MORE press.

Output (exactly two lines, nothing else):
Summary: <<140–200 chars. What shows up at first glance. If you see a couple of outlets (e.g., Forbes/Bloomberg/local biz journal), mention up to 2, then say it's a start, not authority. If it’s mostly profiles/directories/social, say that plainly.>>
Conclusion: <<ALWAYS 2 sentences, 230–340 chars total. Friendly but direct. Tell them they’re getting out‑positioned when people Google them, that silence or scattered links cost trust and deals, and that strategic placements in elite publications are the fix—now. Always end with a forward‑leaning nudge (e.g., "Let’s fix this.")>>

Rules:
- Never hedge or add disclaimers. No lists. No extra lines.
- Always, without exception, conclude that they need more press to win authority and trust.

Results JSON (first 5–6):
${JSON.stringify(condensed, null, 2)}
`;

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OpenRouter API key', diagnostics }) };
    }

    async function callOpenRouter(model) {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://pressence-x.netlify.app/',
          'HTTP-Referer': 'https://pressence-x.netlify.app/',
          'X-Title': 'Pressence360 Search Summary'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'Be concise, premium, and authoritative. Never include code fences or JSON in responses. Max 2 lines total.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.65,
          max_tokens: 260
        })
      });
      return r;
    }

    // Try primary, then fallbacks sequentially
    let data;
    const attempts = [];
    const tryModels = [MODEL, ...FALLBACK_MODELS];
    for (const m of tryModels) {
      const resp = await callOpenRouter(m);
      attempts.push({ model: m, status: resp.status });
      diagnostics.openrouterStatus = resp.status;
      if (resp.ok) {
        data = await resp.json();
        diagnostics.openrouterOk = true;
        diagnostics.modelUsed = m;
        break;
      }
    }
    diagnostics.attempts = attempts;
    if (!data) {
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenRouter request failed (all models)', diagnostics }) };
    }
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


