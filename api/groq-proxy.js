export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: { message: 'Groq API Key is not configured on the server.' } });
  }

  // Use a verified Groq model identifier
  const GROQ_MODEL = 'llama-3.3-70b-versatile';

  try {
    if (!req.body || !Array.isArray(req.body.messages) || req.body.messages.length === 0) {
      return res.status(400).json({ error: { message: 'Invalid request: "messages" must be a non-empty array.' } });
    }
    for (const msg of req.body.messages) {
      if (!msg || typeof msg.role !== 'string' || !msg.role.trim() || typeof msg.content !== 'string' || !msg.content.trim()) {
        return res.status(400).json({ error: { message: 'Invalid request: each message must have a non-empty "role" and "content".' } });
      }
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: req.body.messages,
        temperature: req.body.temperature || 0.6,
        max_tokens: req.body.max_tokens || 4096
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: { message: errorData.error?.message || `Groq API error: ${response.status}` } });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: 'Internal Server Error', details: err.message } });
  }
}
