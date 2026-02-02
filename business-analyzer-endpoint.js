// Add this endpoint to your existing foray-api-server.js

// Business Analyzer endpoint - proxies Claude API to avoid CORS
app.post('/api/analyze-business', async (req, res) => {
  try {
    const { businessDescription } = req.body;

    if (!businessDescription || businessDescription.trim().length === 0) {
      return res.status(400).json({ error: 'Business description is required' });
    }

    const systemPrompt = `You are an expert business analyst and blockchain consultant specializing in FORAY Protocol implementations. 

FORAY Protocol is a privacy-preserving blockchain audit infrastructure that anchors enterprise transactions to Kaspa blockchain while keeping sensitive data off-chain. It uses a 4-component architecture:

1. **Arrangements** - Contractual relationships, agreements, terms
2. **Accruals** - Formulas applied against asset flows (discounts, fees, interest, depreciation, valuations)
3. **Anticipations** - Expected future flows, scheduled events, milestones
4. **Actions** - Executed settlements, completed transfers, realized events

Your task is to analyze a business description and explain:
1. What types of transactions this business has that FORAY would audit
2. How FORAY's 4 components would map to those transactions
3. Specific compliance benefits (SOX, Basel III, DCAA, FERC, FDA, etc.)
4. Privacy advantages (what stays off-chain vs on-chain)
5. Why Kaspa's sub-second finality matters for their use case

Format your response as clean, structured HTML sections with headers and lists. Use business-appropriate language. Be specific to their industry. Show deep understanding of their pain points.

Structure your response with these sections:
- <h3>🎯 Transaction Types</h3>
- <h3>🔧 FORAY Component Mapping</h3>
- <h3>✅ Compliance Benefits</h3>
- <h3>🔒 Privacy Architecture</h3>
- <h3>⚡ Kaspa Advantage</h3>`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Analyze this business for FORAY Protocol applications:\n\n${businessDescription}\n\nProvide detailed analysis formatted as HTML sections.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API request failed: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    const analysisHTML = data.content.find(block => block.type === 'text')?.text || '';

    res.json({ analysis: analysisHTML });

  } catch (error) {
    console.error('Business analyzer error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
});
