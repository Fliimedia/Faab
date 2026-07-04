// Vercel serverless proxy for the Anthropic Messages API.
// Set ANTHROPIC_API_KEY in the Vercel project environment.
// Optionally set ANTHROPIC_MODEL to override the model (defaults to claude-sonnet-5).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY environment variable' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    body.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    res.status(upstream.status).setHeader('content-type', 'application/json').send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
