# FORAY Protocol
### Privacy-Preserving Blockchain Audit Infrastructure for Enterprise Transactions and Agentic AI

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL_1.1-blue.svg)](LICENSE.md)
[![Kaspa Protocol](https://img.shields.io/badge/Kaspa-Protocol-brightgreen.svg)](https://kaspa.org)
[![Version](https://img.shields.io/badge/Version-4.1-orange.svg)](FORAY_Protocol_v4_1_Specification.md)
[![Patent](https://img.shields.io/badge/Patent-Pending_US_63%2F980%2C193-red.svg)](https://uspto.gov)

> 🏆 **Kaspathon 2026 Top 10 Finalist — Real-Time Data Track**

---

## What is FORAY?

FORAY is the foundational protocol of the **DUNIN7 Protocol Stack** — a complete governance architecture for agentic business. It creates tamper-evident audit trails of enterprise transactions and AI agent actions that regulators, auditors, and forensic investigators can trust — without exposing your competitive secrets.

FORAY enters as an audit tool. It stays as the universal transaction layer that makes everything else possible.

---

## The Problem

Internal audit trails can be altered. When fraud happens — Enron, Wirecard, FTX — companies rewrite history. External auditors have no way to prove records weren't tampered with.

As AI agents execute consequential decisions autonomously through platforms like MCP, organisations have no tamper-evident proof of what those agents decided, why, and what they did. Internal agent logs live inside the platforms that run them. Platform administrators can alter those logs.

When a regulator, auditor, or counterparty examines AI agent behaviour, an internal log is the weakest possible evidence.

---

## The Solution

FORAY anchors cryptographic fingerprints of your transactions and agent actions to Kaspa's blockchain in real-time. The data stays in your systems. Only the proof goes on-chain. If anyone alters a record, the mismatch is instantly detectable.

Every business transaction — and every AI agent decision cycle — decomposes into four native components:

| Component | What It Captures | Business Example | AI Agent Example |
|-----------|-----------------|------------------|------------------|
| **Arrangements** | Contractual setup / mandate | Loan agreement signed | Agent authorised to approve POs under $50K |
| **Accruals** | Obligation logic / reasoning | Interest calculated | Agent analyses vendor quote, determines best price |
| **Anticipations** | Expected future flows / intent | Payment scheduled | Agent plans to approve invoice, expected outcome |
| **Actions** | Actual asset transfers / execution | Wire sent | Agent approves invoice, actual result recorded |

This is not a new model imposed on business. It is how business already works, normalised into machine-readable, tamper-evident, universally structured form.

---

## The DUNIN7 Protocol Stack

FORAY is one layer of a complete six-protocol governance architecture. Each protocol is independently valuable. Together they form a comprehensive infrastructure for agentic business.

```
┌─────────────────────────────────────────────────────────────┐
│  BOUNDARIES — Pre-transaction governance                     │
│  Limits, risk assessment, real-time Anticipation monitoring  │
├─────────────────────────────────────────────────────────────┤
│  FORAY — Transaction decomposition and audit        ◄ HERE  │
│  The foundational layer. Every other protocol feeds         │
│  into FORAY or consumes from it.                            │
├─────────────────────────────────────────────────────────────┤
│  ARD — Asset Receipt and Delivery                           │
│  Settlement and reconciliation. Confirms what actually moved│
├─────────────────────────────────────────────────────────────┤
│  MERIDIAN — Live multi-asset general ledger                 │
│  Continuous, oracle-bound, native multi-asset               │
├─────────────────────────────────────────────────────────────┤
│  OVA — Agent identity and authorisation          Patent ⚡  │
│  ZK-proof at the moment of action. Authorisation objects    │
│  cryptographically indistinguishable from decoys on-chain   │
├─────────────────────────────────────────────────────────────┤
│  TESSERA — Data asset deconstruction             Patent ⚡  │
│  High-value data deconstructed at storage. Complete object  │
│  ceases to exist. Reconstructed transiently, in memory,     │
│  under controlled conditions. Then it is gone.              │
└─────────────────────────────────────────────────────────────┘
                    ▲ Continuous feedback loop ▲
```

**OVA** and **TESSERA** are Patent Pending. **BOUNDARIES**, **ARD**, and **MERIDIAN** conception documented 2026-03-26. Provisional filings in progress.

---

## Universal Transaction Grammar

FORAY's mandatory core has been validated against **60 diverse transaction types** across 12 industries. The core required zero modifications across all 60 cases.

**Industries validated:**
Merchant banking · Autonomous manufacturing · Insurance · Real estate · Healthcare · Technology · Government · Supply chain · Legal services · Carbon markets · Digital assets · Settlement and redistribution

**Transaction types mapped include:**
Leveraged buyouts · Interest rate swaps · Chemical batch synthesis · Organ procurement chains · Catastrophe bonds · Carbon credits · Water rights · Barter and counter-trade · Digital asset staking · Divorce asset settlements · API call billing · Open source bounties

**What the validation proved:**

Every business transaction is the transformation of assets with the burden of accruals. The window dressing — industry vocabulary, instrument names, regulatory context — changes. The underlying grammar does not.

> *"The grammar is universal. The window dressing changes. FORAY does not notice."*

**Nine asset behaviour types** were identified across all 60 transactions. The taxonomy is believed to be finite — 60 transactions produced nine types, not more. This makes asset classification a tractable, bounded problem for agentic interfaces.

| # | Behaviour | Examples |
|---|-----------|---------|
| 1 | Complete Transfer | Currency, physical goods, securities |
| 2 | Conditional Transfer | Consignment, contingent sale |
| 3 | Transformation | Raw material → finished goods, loan pool → securities |
| 4 | Consumption | Energy, labor, machine time |
| 5 | Governing Reference | Notional principal, reference entity |
| 6 | Creation | Loyalty points, carbon credits, serialised identities |
| 7 | External Destruction | Catastrophe bond principal, expired rights |
| 8 | Right | Options, water access, emissions allowances |
| 9 | Perceived Value | Goodwill, distressed debt, carried interest |

Full schema, pattern map, and transaction validation set: [`DUNIN7_FORAY_Schema_Reference_2026-03-26.docx`](docs/)

---

## The Agentic Direction

FORAY currently records what source systems did. That is the entry point.

The schema derived from source system data becomes the blueprint from which agents construct transactions directly. The data flow reverses — FORAY stops being a recorder and becomes the operating system. At that point, the source system is no longer mandatory. It is legacy.

A comprehensive schema built against SAP, Oracle, and NetSuite transaction models means an agent trained on that schema can submit valid FORAY transactions from any source, in any industry, without human intervention. Domain experts remain essential. Their knowledge is no longer trapped inside their own format.

The trojan horse that enters as audit leaves as the universal business transaction layer.

---

## Why Kaspa?

| Feature | Kaspa | Bitcoin | Ethereum |
|---------|-------|---------|----------|
| Block Time | 1 second | 10 minutes | 12 seconds |
| Finality | ~10 seconds | 60 minutes | 12 minutes |
| TX Cost | ~$0.0001 | $1–50 | $0.50–50 |
| Throughput | 1 BPS → 100 BPS | 7 TPS | 15 TPS |

Kaspa's 1-second blocks enable real-time anchoring as transactions happen — not batch processing hours later. GHOSTDAG consensus provides high throughput without sacrificing decentralisation.

---

## Enterprise AI Agent Accountability

As organisations deploy AI agents through MCP-connected platforms to execute consequential tasks — procurement approvals, financial analysis, code generation, legal research — a critical gap has emerged:

**No existing observability platform provides a tamper-evident external record of what an AI agent decided and did.**

FORAY provides the external, independently verifiable answer. Every agent decision cycle maps directly onto the 4A model:

- The **Arrangement** captures the mandate — what the agent was authorised to do, by whom, under what constraints, referencing the model version and system prompt hash
- The **Accrual** captures the reasoning — what information was analysed, what the agent determined
- The **Anticipation** captures the intent — what action the agent planned, with what expected outcome
- The **Action** captures the execution — what the agent actually did, the result, and the variance from intent

Each component is anchored to the Kaspa BlockDAG. The decision record cannot be altered after the fact — not by the platform operator, not by the organisation that deployed the agent.

This directly addresses **EU AI Act Article 12** logging requirements for high-risk AI systems.

**On the MCP authorisation gap:** The gateway model correctly identifies the need for a Policy Decision Point, but centralising the PDP reintroduces a trust problem — a compromised or misconfigured PDP can enumerate all valid authorisations and impersonate any user downstream. OVA's response is to move the PDP off the gateway entirely: authorisation objects that are cryptographically indistinguishable from decoys on-chain, verified via ZK proof at the edge. The gateway's policy engine becomes a verifier rather than a holder of secrets.

---

## Privacy Architecture

| Mechanism | What It Does |
|-----------|-------------|
| Hash-Only Anchoring | Only cryptographic fingerprints go on-chain, never raw data |
| Salted Formula IDs | Proprietary calculations hashed with unique salts |
| Instance Pools | Timing correlation resistance across transactions |
| Obfuscated References | Party names and relationships protected |
| Decoy Transactions | Structurally indistinguishable fake records protect population privacy |

Auditors can verify that records are intact and calculations are consistent without seeing the actual formulas, values, or party identities. Competitive secrets stay private. The population itself is protected.

---

## Quick Demo

**[Try the Transaction Review Tool](https://foray.dunin7.com)**

1. Open the FORAY Transaction Review Tool in Chrome
2. Paste any FORAY JSON (examples in `/examples`)
3. Click "Connect Wallet" (requires KasWare Chrome extension)
4. Review the transaction structure
5. Click "Anchor to Kaspa" to create a tamper-evident proof

**[Try the Business Analyser](https://foray.dunin7.com/business-analyzer.html)**

Describe any business. The analyser uses Claude to identify the transaction types, map them to FORAY components, and demonstrate how FORAY would record them. Works across any industry.

---

## Repository Structure

```
foray-kaspathon/
├── README.md
├── LICENSE.md
├── AI_DISCLOSURE.md
├── FORAY_Protocol_v4_1_Specification.md
├── FORAY_Standard_Disclaimer.md
│
├── index.html                      # foray.dunin7.com landing page
├── demo.html                       # Interactive demo
├── business-analyzer.html          # AI-powered transaction mapper
├── about.html                      # Protocol overview
├── docs.html                       # Documentation portal
├── guides.html                     # Integration guides
├── specification.html              # Full specification
├── integration-guide.html          # ERP integration guide
│
├── foray-tx-review-v41.html        # Transaction Review Tool
├── foray-infographic-v41.html      # Interactive explainer
│
├── foray-api-server.js             # API server (PM2, port 3001)
├── proxy-server.js                 # Cloudflare tunnel proxy
├── quickbooks-adapter.js           # QuickBooks connector
├── salesforce-adapter.js           # Salesforce connector
│
├── examples/                       # Sample FORAY transactions
│   ├── batch-payment-v41.json
│   ├── cash-sale-v41.json
│   ├── depreciation-v41.json
│   ├── manufacturing-work-order-v41.json
│   ├── salesforce-opportunity-v41.json
│   ├── fx-spot-usdjpy-v41.json
│   ├── overnight-repo-v41.json
│   ├── rmbs-transaction-v3.json
│   ├── auto-loan-john-doe-v3.json
│   ├── mary-smith-loan-v3.json
│   ├── energy-solar-ppa-morocco-spain-v3.json
│   ├── manuka-honey-provenance-v41.json
│   ├── luxury-watch-authentication-v41.json
│   └── supply-chain-provenance-template-v41.json
│
└── guides/                         # Integration documentation
```

---

## Built-in Sample Transactions

| Sample | Type | Description |
|--------|------|-------------|
| Batch Payment | Full lifecycle | AP batch clearing 3 invoices with allocations |
| Cash Sale | Action-only | Retail POS (flexible entry) |
| Depreciation | Accrual-only | Month-end adjusting entry (flexible entry) |
| Auto Loan | Full lifecycle | Consumer loan with payments |
| Energy PPA | Full lifecycle | Solar power purchase agreement |
| Manufacturing | Full lifecycle | Work order with BOM and overhead |
| Salesforce Opportunity | Full lifecycle | CRM opportunity to close |
| RMBS Securitisation | Full lifecycle | Mortgage-backed security with tranches |
| FX Spot Trade | Full lifecycle | Foreign exchange USD/JPY with T+2 settlement |
| Overnight Repo | Full lifecycle | Secured overnight financing with Treasury collateral |
| Manuka Honey Provenance | Full + Attestations | UMF-certified honey with attestation chain |
| Luxury Watch Authentication | Full lifecycle | Rolex with spectroscopic material fingerprinting |
| Supply Chain Template | Configurable | Generic provenance tracking template |

---

## Use Cases

| Industry | Application | Compliance |
|----------|-------------|------------|
| AI Governance | Agent decision audit trails, MCP observability, EU AI Act logging | EU AI Act Art. 12, NIST AI RMF |
| Financial Services | Derivatives, securitisations, repo, FX trading | SOX, Basel III, Dodd-Frank, EMIR |
| Enterprise ERP | Universal transaction layer across SAP, Oracle, NetSuite | SOX, IFRS, GAAP |
| Defence | Cost tracking, supply chain, DCAA audit | DCAA, DFARS, FAR |
| Manufacturing | BOM, WIP, inventory, quality management | SOX, IFRS, ISO 9001 |
| Energy | PPA settlements, grid transactions, carbon markets | FERC, EU ETS |
| Supply Chain | Product provenance, authenticity, cold chain | FDA, EU Food Safety, EUDR |
| Healthcare | Clinical trial milestones, device billing, procurement | HIPAA, FDA, GCP |

---

## Roadmap

- [x] Protocol v4.1 specification
- [x] Transaction Review Tool with Kaspa Testnet
- [x] QuickBooks adapter (prototype)
- [x] Salesforce adapter (prototype)
- [x] Attestations extension
- [x] Intrinsic authentication (spectroscopic fingerprinting)
- [x] 60-transaction universal schema validation
- [ ] MCP server implementation
- [ ] SAP S/4HANA connector — *strategic priority*
- [ ] Oracle Fusion connector
- [ ] BOUNDARIES protocol implementation
- [ ] ARD protocol implementation
- [ ] MERIDIAN live ledger implementation
- [ ] GRC platform integration (ServiceNow, IBM OpenPages)
- [ ] Mainnet deployment
- [ ] ZK-proof integration (OVA, when Kaspa supports)
- [ ] Multi-language SDKs (Rust, Python, JavaScript)

---

## License

**Business Source License 1.1** — Source-available with commercial restrictions.

| Permission | Allowed |
|------------|---------|
| View, copy, modify | Yes |
| Non-production use | Yes |
| Academic research | Yes |
| Production use | Requires license |

**Change Date: January 25, 2030** → Converts to Apache License 2.0

See [LICENSE.md](LICENSE.md) for full terms.

---

## Citation

```bibtex
@article{foray2026,
  title={FORAY: A Privacy-Preserving Blockchain Audit Protocol for Enterprise Transactions and AI Agent Accountability},
  author={Percival, Marvin},
  year={2026},
  note={Kaspathon 2026 Top 10 Finalist, Patent Pending US 63/980,193}
}
```

---

## Contact

**Author:** Marvin Percival
**Email:** marvinp@dunin7.com
**Live Demo:** foray.dunin7.com

---

## Acknowledgments

🏆 **Kaspathon 2026 Top 10 Finalist — Real-Time Data Track**

FORAY leverages Kaspa's unique properties:
- BlockDAG architecture for parallel block production
- GHOSTDAG consensus for high throughput
- Sub-second confirmation for real-time anchoring

---

*FORAY Protocol — Transparent audits, protected secrets, powered by Kaspa.*

*Copyright (c) 2026 Marvin Percival. All rights reserved.*
