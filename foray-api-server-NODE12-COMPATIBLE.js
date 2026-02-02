/**
 * ============================================================================
 * FORAY Protocol AI-Powered Transaction Generator API
 * ============================================================================
 * Version:       1.1.0
 * Created:       2025-01-28T13:15:00Z
 * Last Modified: 2026-01-28T21:30:00Z
 * 
 * Author:        Marvin Percival
 * Email:         marvinp@dunin7.com
 * GitHub:        github.com/DUNIN7/foray-kaspathon
 * 
 * Changelog:
 *   v1.1.0 (2026-01-28)
 *     - Enhanced validation to accept multiple JSON schema formats
 *     - Supports: transaction_metadata wrapper, *_id field naming,
 *       flat vs foray_core structure, foray_version vs schema_version
 *     - Auto-normalizes alternate formats for Transaction Review tool
 *   
 *   v1.0.0 (2025-01-28)
 *     - Initial release
 * 
 * Setup:
 *   1. npm install express cors @anthropic-ai/sdk dotenv node-fetch form-data
 *   2. Create .env with: ANTHROPIC_API_KEY=your_key_here
 *   3. Run: node foray-api-server.js
 *   4. Access at: http://localhost:3001/api/generate-foray
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.FormData = require('form-data');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'FORAY AI Transaction Generator',
    version: '1.1.0'
  });
});

// Main generation endpoint
app.post('/api/generate-foray', async (req, res) => {
  try {
    const { transactionName, transactionDescription } = req.body;
    
    if (!transactionName || !transactionDescription) {
      return res.status(400).json({ 
        error: 'Missing transactionName or transactionDescription' 
      });
    }

    console.log(`Generating FORAY transaction: ${transactionName}`);

    // Use the FORAY skill to generate the transaction
    const prompt = `You are an expert in the FORAY Protocol v4.1 specification. Generate a complete, valid FORAY Protocol v4.1 JSON transaction based on the following:

Transaction Name: ${transactionName}

Transaction Description: ${transactionDescription}

CRITICAL REQUIREMENTS:
1. Analyze the description carefully to identify:
   - All parties involved and their roles
   - All monetary amounts and their purposes
   - All dates and timing
   - All contractual arrangements
   - All payment schedules (including changes in payment amounts over time)
   - All accruals (interest calculations, depreciation, etc.)
   - All anticipations (future expected flows)

2. Generate proper FORAY v4.1 JSON with:
   - transaction_metadata (with proper transaction_id, transaction_type, timestamp, description)
   - arrangements[] (all contractual relationships)
   - actions[] (all completed or simultaneous transfers)
   - accruals[] (all formulas and calculations with formula_hash)
   - anticipations[] (all future expected flows with schedules)

3. Use opaque party IDs (e.g., "pty_lender_bank", "pty_borrower_123")
4. Use formula_hash for all accrual calculations (8-character hex)
5. Use ISO 8601 timestamps
6. If payment amounts change over time, create MULTIPLE anticipations with different schedules

7. Return ONLY valid JSON - no markdown, no explanations, no preamble.

Generate the complete FORAY Protocol v4.1 JSON now:`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract JSON from response
    const responseText = message.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');
    
    console.log('Received response from Claude API');
    
    console.log('Response text (first 500 chars):', responseText.substring(0, 500));
  
    // Try to extract JSON from code blocks if present
    let jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      jsonMatch = responseText.match(/```\s*([\s\S]*?)\s*```/);
    }
    
    let jsonString = jsonMatch ? jsonMatch[1] : responseText;
    jsonString = jsonString.trim();
    
    // Parse JSON
    const forayJSON = JSON.parse(jsonString);

    console.log('Parsed JSON keys:', Object.keys(forayJSON));
    console.log('schema_version:', forayJSON.schema_version);
    console.log('foray_version:', forayJSON.foray_version);
    console.log('transaction_metadata:', forayJSON.transaction_metadata ? 'exists' : 'missing');
    console.log('transaction_id:', forayJSON.transaction_id || 'missing');

    // ========================================================================
    // ENHANCED VALIDATION - Accept multiple JSON schema formats
    // ========================================================================
    
    // Normalize schema_version from various formats
    if (forayJSON.foray_version && !forayJSON.schema_version) {
      forayJSON.schema_version = forayJSON.foray_version;
    }
    
    // Check for valid FORAY structure (accept multiple formats)
    const hasVersion = forayJSON.schema_version || forayJSON.foray_version;
    const hasMetadata = forayJSON.transaction_metadata || forayJSON.transaction_id;
    const hasComponents = forayJSON.arrangements || forayJSON.accruals || 
                          forayJSON.anticipations || forayJSON.actions;
    
    if (!hasComponents) {
      throw new Error('Generated JSON missing required FORAY components (arrangements, accruals, anticipations, or actions)');
    }
    
    // If no version, default to 4.1
    if (!hasVersion) {
      forayJSON.schema_version = '4.1';
      console.log('Added default schema_version: 4.1');
    }
    
    // If using transaction_metadata wrapper, extract transaction_id to root
    if (forayJSON.transaction_metadata && !forayJSON.transaction_id) {
      forayJSON.transaction_id = forayJSON.transaction_metadata.transaction_id;
      console.log('Extracted transaction_id from transaction_metadata');
    }
    
    // If no transaction_id at all, generate one
    if (!forayJSON.transaction_id) {
      forayJSON.transaction_id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated transaction_id:', forayJSON.transaction_id);
    }
    
    // ========================================================================
    
    console.log('Successfully generated valid FORAY JSON');
    
    res.json({ forayJSON });
    
  } catch (error) {
    console.error('Error generating FORAY JSON:', error);
    res.status(500).json({ 
      error: 'Failed to generate FORAY JSON', 
      details: error.message 
    });
  }
});

// Business Analyzer endpoint
app.post('/api/analyze-business', async (req, res) => {
  try {
    const { businessDescription } = req.body;
    if (!businessDescription || businessDescription.trim().length === 0) {
      return res.status(400).json({ error: 'Business description is required' });
    }
    const systemPrompt = 'You are an expert business analyst specializing in FORAY Protocol. Analyze the business and explain how FORAY would help with: 1) Transaction types 2) Component mapping 3) Compliance benefits 4) Privacy advantages 5) Kaspa advantages. Format as HTML with h3 headers.';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, system: systemPrompt, messages: [{ role: 'user', content: 'Analyze this business: ' + businessDescription }] })
    });
    const data = await response.json();
    const textBlock = data.content.find(block => block.type === 'text');
    const analysisHTML = textBlock ? textBlock.text : '';
    res.json({ analysis: analysisHTML });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

const server = app.listen(PORT, () => {
  console.log('\n🚀 FORAY AI Transaction Generator API v1.1.0');
  console.log('📍 Running on: http://localhost:' + PORT);
  console.log('📍 Health check: http://localhost:' + PORT + '/health');
  console.log('📍 Generate endpoint: http://localhost:' + PORT + '/api/generate-foray');
  console.log('✅ Ready to generate FORAY transactions!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
