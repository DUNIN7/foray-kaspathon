# FORAY Business Analyzer - Complete Installation Guide

**Created:** 2026-01-30 
**Author:** Marvin Percival 
**Email:** marvinp@dunin7.com 
**GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

## What You're Installing

An interactive web tool that lets users describe their business and get AI-powered analysis of how FORAY Protocol would benefit them. Perfect for Kaspathon demos!

**Problem We're Solving:** The original version tried to call Anthropic API directly from the browser, which browsers block for security (CORS). Solution: Route the call through your existing backend server.

---

## Prerequisites

[OK] Mac Mini with foray-api backend running (port 3001) 
[OK] Python web server running (port 9000) 
[OK] Cloudflare Tunnel active (foray.dunin7.com) 
[OK] Anthropic API key

---

## Step 1: Get Your Anthropic API Key

If you don't have one already:

1. Go to https://console.anthropic.com/
2. Sign in
3. Go to "API Keys" section
4. Create a new key (or copy existing one)
5. **SAVE IT** - you'll need it in Step 3

---

## Step 2: Download the Files

You need TWO files from Claude's outputs:

1. **business-analyzer-v2.html** - The web page
2. **business-analyzer-endpoint.js** - The backend code

Download both to your Mac Mini (email them to yourself, or use Screen Sharing to copy them).

---

## Step 3: Update Your Backend Server

### 3A. Find Your Backend Server File

On your Mac Mini, open Terminal and run:

```bash
cd ~/foray-api
ls -la
```

You should see `foray-api-server.js` (or similar).

### 3B. Add the API Key to Environment

Edit your PM2 ecosystem file or add to your shell:

```bash
# Option 1: Add to .bashrc or .zshrc
echo -> export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.bashrc
source ~/.bashrc

# Option 2: Or set it just for this session
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Replace `sk-ant-your-key-here` with your actual key.

### 3C. Edit foray-api-server.js

Open the file in your favorite editor:

```bash
nano ~/foray-api/foray-api-server.js
# or
code ~/foray-api/foray-api-server.js # if you have VS Code
# or
open -a TextEdit ~/foray-api/foray-api-server.js
```

**Find where your other endpoints are** (look for lines like `app.post('/api/generate'` or similar).

**Add this ENTIRE block** right after your other endpoints:

```javascript
// Business Analyzer endpoint - proxies Claude API to avoid CORS
app.post('/api/analyze-business', async (req, res) => {
 try {
 const { businessDescription } = req.body;

 if (!businessDescription || businessDescription.trim().length === 0) {
 return res.status(400).json({ error: -> Business description is required' });
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
- <h3>[TARGET] Transaction Types</h3>
- <h3> FORAY Component Mapping</h3>
- <h3>[OK] Compliance Benefits</h3>
- <h3>[KEY] Privacy Architecture</h3>
- <h3>[ZAP] Kaspa Advantage</h3>`;

 const response = await fetch('https://api.anthropic.com/v1/messages', {
 method: -> POST',
 headers: {
 -> Content-Type': -> application/json',
 -> x-api-key': process.env.ANTHROPIC_API_KEY,
 -> anthropic-version': -> 2023-06-01'
 },
 body: JSON.stringify({
 model: -> claude-sonnet-4-20250514',
 max_tokens: 4000,
 system: systemPrompt,
 messages: [
 {
 role: -> user',
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
 const analysisHTML = data.content.find(block => block.type === -> text')?.text || -> ';

 res.json({ analysis: analysisHTML });

 } catch (error) {
 console.error('Business analyzer error:', error);
 res.status(500).json({ 
 error: -> Analysis failed', 
 message: error.message 
 });
 }
});
```

**Save the file!**

### 3D. Restart Your Backend Server

```bash
pm2 restart foray-api
```

Check that it's running:

```bash
pm2 status
```

You should see `foray-api` with status `online`.

---

## Step 4: Deploy the Web Page

Copy the HTML file to your web directory:

```bash
cp ~/Downloads/business-analyzer-v2.html ~/foray-kaspathon/business-analyzer.html
```

(Adjust the path if you saved it somewhere else)

---

## Step 5: Test It!

Open your browser and go to:

```
https://foray.dunin7.com/business-analyzer.html
```

### Quick Test:

1. Click one of the example buttons (e.g., "Defense Contractor")
2. Click "[*] Analyze My Business with FORAY"
3. Wait 5-10 seconds
4. You should see detailed analysis appear in the right panel!

---

## Troubleshooting

### Error: "Failed to fetch"

**Check 1:** Is your backend running?
```bash
pm2 status
```
Should show `foray-api` as `online`.

**Check 2:** Test the backend directly:
```bash
curl -X POST http://localhost:3001/api/analyze-business \
 -H "Content-Type: application/json" \
 -d -> {"businessDescription":"We are a defense contractor"}'
```

Should return JSON with analysis.

**Check 3:** Is the API key set?
```bash
echo $ANTHROPIC_API_KEY
```
Should show your key.

### Error: "API request failed: 401"

Your API key is wrong or not set. Go back to Step 3B.

### Error: "Analysis failed: fetch is not defined"

Your Node.js version is too old. Update to Node 18+:
```bash
node --version # Check version
brew upgrade node # Update if needed
pm2 restart foray-api
```

### Page loads but nothing happens

**Check browser console:**
1. Open browser
2. Press F12 (or Cmd+Option+I on Mac)
3. Click "Console" tab
4. Try the analysis again
5. Look for error messages

Common issue: The HTML is calling the wrong port. Edit business-analyzer.html and make sure line ~450 says:
```javascript
const response = await fetch('http://localhost:3001/api/analyze-business', {
```

---

## How It Works

```
User Browser
 v
business-analyzer.html (foray.dunin7.com)
 v
Your Backend Server (localhost:3001)
 v
Anthropic API (api.anthropic.com)
 v
AI Analysis
 v
Back to User Browser
```

The backend acts as a "proxy" to avoid browser security restrictions.

---

## Next Steps

Once working, you can:

1. **Add to main navigation** - Link from index.html
2. **Customize examples** - Edit the example buttons for your target industries
3. **Add to GitHub** - Commit both files to your repo
4. **Demo at Kaspathon** - Use this to show judges how FORAY works for different businesses!

---

## Support

If you get stuck:

1. Check PM2 logs: `pm2 logs foray-api`
2. Check browser console (F12)
3. Verify API key is working: https://console.anthropic.com/
4. Make sure all 3 services are running:
 - Backend (port 3001)
 - Web server (port 9000)
 - Cloudflare Tunnel

---

**Installation complete! [PARTY]**

Your business analyzer should now be live at:
**https://foray.dunin7.com/business-analyzer.html**
