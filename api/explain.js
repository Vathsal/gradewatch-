export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { violationCode, violationDescription } = req.body

  if (!violationCode || !violationDescription) {
    return res.status(400).json({ error: 'Missing violation data' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system:
          'You explain NYC restaurant health inspection violations in plain, direct English for a diner deciding whether to eat somewhere. 2 sentences max. No jargon. First sentence: what the actual problem is. Second sentence: the health risk to a diner. Be honest but not alarmist. Never start with "I".',
        messages: [
          {
            role: 'user',
            content: `Violation code: ${violationCode}\nOfficial description: ${violationDescription}\n\nExplain this to a diner in 2 plain-English sentences.`,
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' })
    }

    const text = data.content?.map((c) => c.text).join('') || ''
    return res.status(200).json({ explanation: text })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Claude API' })
  }
}
