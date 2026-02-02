# FORAY Protocol v4.1 - Kaspathon Demo Video Script

## Video Overview

| Property | Value |
| **Target Length** | 3-5 minutes |
| **Format** | Screen recording with voiceover |
| **Primary Track** | Real-Time Data |
| **Secondary Track** | Payments & Commerce |
| **Tools Shown** | Transaction Review Tool (foray-tx-review-v41.html) |

## Pre-Recording Checklist

- [ ] Open Transaction Review Tool in Chrome/Edge (full screen)
- [ ] Have KasWare wallet installed with Testnet-10 selected
- [ ] Ensure wallet has test KAS (get from faucet if needed)
- [ ] Close unnecessary browser tabs
- [ ] Disable notifications
- [ ] Test microphone levels
- [ ] Have sample transactions ready in dropdown

## Script & Storyboard

### SCENE 1: Introduction (0:00 - 0:30)

**[SCREEN: Title card with FORAY logo]**

**VOICEOVER:**
> "Every year, enterprises spend billions on audits, struggling to prove their financial transactions are legitimate. What if there was a way to create tamper-proof audit trails that regulators could trust+-+without exposing your competitive secrets?"

**[SCREEN: Transition to Transaction Review Tool - empty state]**

**VOICEOVER:**
> "Introducing FORAY Protocol+-+a new standard for enterprise transaction audit trails, anchored to the Kaspa blockchain for real-time, immutable proof of existence."

### SCENE 2: The Problem (0:30 - 1:00)

**[SCREEN: Simple graphic or text overlay showing the problem]**

**VOICEOVER:**
> "Today's audit process is broken. Companies maintain separate records that auditors must manually reconcile. This creates opportunities for fraud, errors, and disputes. And when problems are found, it's often months or years later."

**[SCREEN: Highlight key pain points]**
- Manual reconciliation
- Delayed detection
- Lack of real-time verification
- Privacy vs. transparency tradeoff

**VOICEOVER:**
> "FORAY solves this by decomposing every business transaction into four auditable components, then anchoring a cryptographic proof to Kaspa's ultra-fast blockchain."

### SCENE 3: The 4-Component Model (1:00 - 1:45)

**[SCREEN: Transaction Review Tool - Select "Batch Payment" from dropdown]**

**VOICEOVER:**
> "Let me show you how it works. Here's a real-world example: a company paying three vendor invoices in a single batch payment."

**[ACTION: Click to load Batch Payment sample]**

**VOICEOVER:**
> "FORAY breaks this into four components:"

**[ACTION: Expand Arrangements section]**

**VOICEOVER:**
> "First, **Arrangements**+-+the contractual foundation. This is the master service agreement with our vendor."

**[ACTION: Expand Accruals section]**

**VOICEOVER:**
> "Second, **Accruals**+-+the calculation logic. Here we see three invoices totaling $10,500, each linked back to the arrangement."

**[ACTION: Click on a dependency link to demonstrate navigation]**

**VOICEOVER:**
> "Notice how I can click any reference to jump directly to that component. This makes auditing complex transactions intuitive."

**[ACTION: Expand Anticipations section]**

**VOICEOVER:**
> "Third, **Anticipations**+-+what we expect to happen. The system predicted a batch payment on January 25th."

**[ACTION: Expand Actions section]**

**VOICEOVER:**
> "And fourth, **Actions**+-+what actually happened. The payment was executed, and look here+-+the allocations show exactly how the $10,500 was distributed across the three invoices."

### SCENE 4: Many-to-Many Relationships (1:45 - 2:15)

**[SCREEN: Scroll to show allocations in the Action]**

**VOICEOVER:**
> "This is a key feature of FORAY v4.1: many-to-many relationships. One payment can clear multiple invoices. One invoice can span multiple contracts. Traditional systems can't model this accurately+-+FORAY can."

**[ACTION: Select "RMBS Waterfall" from dropdown]**

**VOICEOVER:**
> "Here's an even more complex example: a mortgage-backed security waterfall distribution. This single transaction involves three tranches+-+AAA, A, and BBB-rated+-+each receiving different allocations based on seniority."

**[ACTION: Show the allocations in the Action component]**

**VOICEOVER:**
> "The waterfall logic is captured in the accruals, the expected distributions in anticipations, and the actual payments in actions. Every dollar is traceable."

### SCENE 5: Kaspa Blockchain Anchoring (2:15 - 3:00)

**[SCREEN: Return to Batch Payment sample]**

**VOICEOVER:**
> "Now let's anchor this transaction to the Kaspa blockchain for immutable proof."

**[ACTION: Click "Connect Wallet" button]**

**VOICEOVER:**
> "First, I'll connect my KasWare wallet. We're using Kaspa Testnet-10 for this demo."

**[ACTION: Approve wallet connection in KasWare popup]**

**VOICEOVER:**
> "Kaspa was chosen specifically for FORAY because of its speed. With 1-second block times, we get near-instant confirmation+-+essential for real-time audit trails."

**[ACTION: Click "Anchor to Blockchain" button]**

**VOICEOVER:**
> "When I click anchor, the tool computes a SHA-256 hash of the entire transaction, then submits a small Kaspa transaction as a timestamp proof."

**[ACTION: Click "Confirm Anchor" in the modal]**

**[SCREEN: Show the anchoring progress]**

**VOICEOVER:**
> "Notice the transaction is sent to my own address+-+this is a self-send pattern, so I'm not losing any funds. The 0.2 KAS amount satisfies Kaspa's KIP-9 storage requirements."

**[SCREEN: Show successful anchor result with Kaspa TX ID]**

**VOICEOVER:**
> "And there it is+-+confirmed in under 2 seconds. The Kaspa transaction ID is now permanently linked to our FORAY transaction hash."

**[ACTION: Click "View on Explorer" link]**

**VOICEOVER:**
> "Anyone can verify this on the Kaspa block explorer. The blockchain proves this transaction existed at this exact moment in time."

### SCENE 6: Privacy Features (3:00 - 3:30)

**[SCREEN: Return to Transaction Review Tool, scroll to Privacy Metadata section]**

**VOICEOVER:**
> "But what about privacy? Enterprises can't put sensitive data on a public blockchain."

**[ACTION: Expand Privacy Metadata section]**

**VOICEOVER:**
> "FORAY addresses this with multiple privacy layers. Notice that formulas are obfuscated+-+auditors can verify calculations without seeing proprietary pricing logic. Party names are hashed. And instance pooling provides correlation resistance."

**[SCREEN: Click Notes button to show the Notes modal]**

**VOICEOVER:**
> "The blockchain only stores a hash+-+a fingerprint. Your actual transaction data stays in your systems. But now you have cryptographic proof it hasn't been tampered with."

### SCENE 7: Flexible Entry Points (3:30 - 3:50)

**[ACTION: Select "Cash Sale" from dropdown]**

**VOICEOVER:**
> "FORAY v4.1 also supports flexible entry points. Not every transaction starts with a contract. Here's a simple retail cash sale+-+it goes straight to an Action, no Arrangement required."

**[SCREEN: Show the Cash Sale with only Actions populated]**

**VOICEOVER:**
> "This makes FORAY practical for everything from complex securitizations to everyday point-of-sale transactions."

### SCENE 8: Call to Action (3:50 - 4:15)

**[SCREEN: Split view - Transaction Review Tool and Kaspa Explorer]**

**VOICEOVER:**
> "FORAY Protocol brings real-time auditability to enterprise transactions. Kaspa's speed and low fees make it the ideal blockchain for this use case."

**[SCREEN: Transition to closing card with links]**

**VOICEOVER:**
> "We're building adapters for SAP, QuickBooks, and Salesforce. The protocol is open source under BSL 1.1, transitioning to Apache 2.0 in 2030."

**[SCREEN: Show GitHub link, demo link]**

**VOICEOVER:**
> "Try the Transaction Review Tool yourself. Paste any FORAY JSON, connect your KasWare wallet, and anchor to Kaspa Testnet. The future of enterprise audit trails starts now."

**[SCREEN: FORAY logo + Kaspathon badge + "Built for Kaspa"]**

**VOICEOVER:**
> "FORAY Protocol+-+transparent audits, protected secrets, powered by Kaspa."

## Closing Card Content

```
FORAY Protocol v4.1

+-++-+ GitHub: github.com/[your-repo]
++ Demo: [hosted demo URL]
+-++- Docs: [documentation URL]

Built for Kaspathon 2026
Real-Time Data Track

Powered by Kaspa
```

## B-Roll Suggestions (Optional)

If time permits, consider adding brief B-roll clips:
- Kaspa logo animation
- Abstract blockchain/network visualization
- Enterprise office setting (stock footage)
- Financial charts/dashboards (stock footage)

## Recording Tips

1. **Pace:** Speak slightly slower than natural+-+viewers need time to absorb
2. **Cursor:** Move deliberately, pause before clicking
3. **Errors:** If something fails, keep recording+-+real demos build trust
4. **Energy:** Sound enthusiastic but professional
5. **Length:** Aim for 3:30-4:00; judges appreciate concise demos

## Post-Production Checklist

- [ ] Add intro/outro title cards
- [ ] Add subtle background music (optional, low volume)
- [ ] Add captions/subtitles (accessibility + silent viewing)
- [ ] Compress to reasonable file size (<500MB)
- [ ] Export in 1080p or 4K
- [ ] Test playback before submission

## Key Messages to Emphasize

1. **Real-time** - Kaspa's 1-second blocks enable instant anchoring
2. **Privacy-preserving** - Only hashes go on-chain, not sensitive data
3. **Many-to-many** - Accurately models complex real-world transactions
4. **Flexible** - Works for everything from RMBS to cash sales
5. **Practical** - ERP adapters make enterprise integration feasible

## Backup Talking Points

If you need to fill time or handle Q&A:

- **Why Kaspa over other chains?** 
  - 1-second block times (vs 10+ minutes for Bitcoin)
  - Low fees (~$0.0001 per TX)
  - GHOSTDAG consensus = high throughput
  - No smart contract risk (just timestamp proofs)

- **Who is this for?**
  - CFOs tired of expensive audits
  - Compliance officers needing real-time monitoring
  - Auditors wanting verifiable evidence
  - Regulators seeking transparency

- **What's next?**
  - SAP adapter (in development)
  - QuickBooks adapter (prototype complete)
  - Mainnet deployment (post-hackathon)
  - Payload embedding for richer proofs

*Script prepared for Kaspathon 2026 submission*
*Marvin Percival*
