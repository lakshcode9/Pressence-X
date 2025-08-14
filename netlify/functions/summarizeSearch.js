// netlify/functions/summarizeSearch.js
// Summarize the first 5-6 Google CSE results via OpenRouter, returning a premium, concise output

// Default to OpenRouter auto router for maximum compatibility
const MODEL = 'openrouter/auto';

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

    const prompt = `You are a premium PR strategist for luxury real estate markets.
Analyze the following top search results for the person: "${name}".

GOAL: Create crisp, persuasive copy that creates urgency and FOMO around missing press.

Rules for output:
1) Output EXACTLY two sections with these labels:
   Summary: <one sharp sentence (<=220 characters) describing what appears at first glance>
   Conclusion: <1–2 sentences persuading that their current presence is NOT enough and that they need strategic PR in elite publications>
2) If you find any notable outlets in the results (e.g., Forbes, Bloomberg, local business journals), briefly acknowledge them in the Summary or start of Conclusion (max 2–3 names), then state they do NOT establish authority yet.
3) If results are mostly profiles/directories/social links, say so plainly and emphasize lack of authority signals.
4) Use confident, high-status tone; no hedging, no apologies, no disclaimers.
5) Focus on FOMO and opportunity cost (lost trust, deals, and positioning) without sounding scammy.

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
          temperature: 0.6,
          max_tokens: 320
        })
      });
      return r;
    }

    // First try requested/auto model
    let resp = await callOpenRouter(MODEL);
    diagnostics.openrouterStatus = resp.status;
    let data;
    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenRouter error', resp.status, text);
      // Fallback: try a known compact model as a secondary
      if ([400,403,404,405].includes(resp.status)) {
        diagnostics.fallbackModel = 'openai/gpt-3.5-turbo';
        const fallback = await callOpenRouter('openai/gpt-3.5-turbo');
        diagnostics.openrouterFallbackStatus = fallback.status;
        if (!fallback.ok) {
          const ftxt = await fallback.text();
          console.error('OpenRouter fallback error', fallback.status, ftxt);
          return { statusCode: 502, body: JSON.stringify({ error: 'OpenRouter request failed', status: resp.status, diagnostics }) };
        }
        data = await fallback.json();
      } else {
        return { statusCode: 502, body: JSON.stringify({ error: 'OpenRouter request failed', status: resp.status, diagnostics }) };
      }
    } else {
      data = await resp.json();
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


