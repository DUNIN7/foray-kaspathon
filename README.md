# FORAY Protocol

<!--
Version:       2.2.0
Created:       2026-01-25T00:00:00Z
Modified:      2026-03-23T00:00:00Z
Author:        Marvin Percival

Changelog:
  v2.2.0 (2026-03-23)
    - Added Kaspathon 2026 Top 10 Finalist badge
    - Added AI Governance / MCP use case to Use Cases table
    - Added Enterprise AI Agent Accountability section
    - Added MCP Enterprise Readiness roadmap reference
    - Updated citation to reflect finalist status
    - Added Supply Chain Provenance to Use Cases table
  v2.1.0 (2026-02-01)
    - Fixed terminology: "immutable, tamper-proof" to "tamper-evident"
    - Added Manuka Honey Provenance and Luxury Watch Authentication examples
    - Updated sample count from 10 to 13
  v2.0.0 (2026-01-31)
    - Initial v4.1 documentation
-->

**Privacy-Preserving Blockchain Audit Infrastructure**

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE.md)
[![Kaspa](https://img.shields.io/badge/Blockchain-Kaspa-49EACB.svg)](https://kaspa.org)
[![Protocol Version](https://img.shields.io/badge/Protocol-v4.1-green.svg)](docs/FORAY_Protocol_v4_1_Specification.md)
[![Kaspathon 2026](https://img.shields.io/badge/Kaspathon%202026-Top%2010%20Finalist-gold.svg)](https://kaspathon.com)
[![Patent](https://img.shields.io/badge/Patent-Pending%2063%2F980%2C193-blue.svg)](https://patents.google.com)

> **🏆 Kaspathon 2026 Top 10 Finalist — Real-Time Data Track**

---

## What is FORAY?

FORAY creates **tamper-evident audit trails** of enterprise transactions and AI agent actions that regulators, auditors, and forensic investigators can trust — without exposing your competitive secrets.

**The Problem:** Internal audit trails can be altered. When fraud happens (Enron, Wirecard, FTX), companies rewrite history. External auditors have no way to prove records weren't tampered with. And as AI agents execute consequential decisions autonomously, organizations have no tamper-evident proof of *what those agents decided, why, and what they did*.

**The Solution:** FORAY anchors cryptographic fingerprints of your transactions and agent actions to Kaspa's blockchain in real-time. The data stays in your systems; only the proof goes on-chain. If anyone alters a record, the mismatch is instantly detectable.

> FORAY directly addresses the **MCP 2026 Enterprise Readiness roadmap priority**: *"Audit trails and observability — end-to-end visibility into what a client requested and what a server did, in a form enterprises can feed into their existing logging and compliance pipelines."*

---

## Why Kaspa?

| Feature | Kaspa | Bitcoin | Ethereum |
|---------|-------|---------|----------|
| Block Time | **1 second** | 10 minutes | 12 seconds |
| Finality | ~10 seconds | 60 minutes | 12 minutes |
| TX Cost | ~$0.0001 | $1-50 | $0.50-50 |
| Throughput | 1 BPS → 100 BPS | 7 TPS | 15 TPS |

Kaspa's **1-second blocks** enable real-time anchoring as transactions happen — not batch processing hours later. GHOSTDAG consensus provides high throughput without sacrificing decentralization.

---

## The 4-Component Model

FORAY decomposes every business transaction — and every AI agent decision cycle — into four components:

| Component | What It Captures | Business Example | AI Agent Example |
|-----------|-----------------|-----------------|-----------------|
| **Arrangements** | Contractual setup / mandate | Loan agreement signed | Agent authorized to approve POs under $50K |
| **Accruals** | Calculation logic / reasoning | Interest calculated | Agent analyzes vendor quote, determines best price |
| **Anticipations** | Expected future flows / intent | Payment scheduled | Agent plans to approve invoice, expected outcome |
| **Actions** | Actual asset transfers / execution | Wire sent | Agent approves invoice, actual result recorded |

This maps to how businesses actually operate — and to how AI agents actually reason and act.

### v4.1 Key Features

- **Flexible Entry Points** — Not every transaction starts with a contract. Cash sales can begin directly with an Action.
- **Many-to-Many References** — One payment can clear multiple invoices. One invoice can cover multiple contracts.
- **Attestations Extension** — Third-party certifications, lab analyses, and oracle readings are first-class components with full credential tracking.
- **Intrinsic Authentication** — Spectroscopic molecular fingerprinting enables products themselves to serve as tamper-evident identifiers.

---

## Enterprise AI Agent Accountability

As organizations deploy AI agents through MCP-connected platforms to execute consequential tasks — procurement approvals, financial analysis, code generation, legal research — a critical gap has emerged:

**No existing observability platform provides a tamper-evident external record of what an AI agent decided and did.**

Internal agent logs live inside the platforms that run them. Platform administrators can alter those logs. When a regulator, auditor, or counterparty examines AI agent behavior, an internal log is the weakest possible evidence.

FORAY provides the external, independently verifiable answer. Every agent decision cycle maps directly onto the 4A model:

- The **Arrangement** captures the mandate — what the agent was authorized to do, by whom, under what constraints, referencing the model version and system prompt hash.
- The **Accrual** captures the reasoning — what information was analyzed, what the agent determined, with formula_id referencing the model weights hash.
- The **Anticipation** captures the intent — what action the agent planned, with what expected outcome and confidence.
- The **Action** captures the execution — what the agent actually did, the result, and the variance from intent.

Each component is anchored to the Kaspa BlockDAG. The decision record cannot be altered after the fact — not by the platform operator, not by the organization that deployed the agent.

**This directly addresses EU AI Act Article 12 logging requirements for high-risk AI systems.**

---

## Quick Demo

### Try the Transaction Review Tool

1. Open the [FORAY Transaction Review Tool](demo/foray-tx-review-v41.html) in **Chrome browser**
2. Paste any FORAY JSON (examples in `/examples`)
3. Click "Connect Wallet" (requires [KasWare](https://kasware.xyz) Chrome extension)
4. Review the transaction structure
5. Click "Anchor to Kaspa" to create a tamper-evident proof

### Example: Detect Tampering

```
1. Create invoice for $5,000
2. Anchor to Kaspa (hash: abc123...)
3. Later: Someone edits invoice to $50,000
4. Re-verify → MISMATCH DETECTED
   - Original hash: abc123...
   - Current hash: def456...
   - Blockchain proves tampering occurred
```

---

## Project Structure

```
foray-kaspathon/
├── README.md
├── LICENSE.md
│
├── docs/
│   ├── FORAY_Protocol_v4_1_Specification.md
│   ├── FORAY_Protocol_v4_1_Change_Summary.md
│   ├── FORAY_QuickBooks_Integration.md
│   └── FORAY_Salesforce_Integration.md
│
├── demo/
│   ├── foray-tx-review-v41.html       # Transaction Review Tool
│   └── foray-infographic-v41.html     # Interactive Explainer
│
├── examples/
│   ├── batch-payment-v41.json         # AP batch clearing 3 invoices
│   ├── cash-sale-v41.json             # Retail POS (Action-only)
│   ├── depreciation-v41.json          # Month-end adjusting entry (Accrual-only)
│   ├── manufacturing-work-order-v41.json  # Production with BOM/labor/overhead
│   ├── salesforce-opportunity-v41.json    # CRM opportunity to payment
│   ├── fx-spot-usdjpy-v41.json        # $10M FX spot with T+2 settlement
│   ├── overnight-repo-v41.json        # $100M repo with Treasury collateral
│   ├── rmbs-transaction-v3.json       # $300M RMBS securitization
│   ├── auto-loan-john-doe-v3.json     # $25K consumer auto loan
│   ├── mary-smith-loan-v3.json        # $60K commercial loan
│   ├── energy-solar-ppa-morocco-spain-v3.json  # EUR 197M cross-border PPA
│   ├── manuka-honey-provenance-v41.json   # NZ$185K UMF-certified honey with attestations
│   ├── luxury-watch-authentication-v41.json  # $29.5K Rolex with material fingerprinting
│   └── supply-chain-provenance-template-v41.json  # Generic provenance template
│
└── adapters/
    ├── quickbooks-adapter.js
    └── salesforce-adapter.js
```

### Built-in Sample Transactions (in Transaction Review Tool dropdown)

The demo tool includes 13 embedded sample transactions:

| Sample | Type | Description |
|--------|------|-------------|
| Batch Payment | Full lifecycle | AP batch clearing 3 invoices with allocations |
| Cash Sale | Action-only | Retail POS transaction (v4.1 flexible entry) |
| Depreciation | Accrual-only | Month-end adjusting entry (v4.1 flexible entry) |
| Auto Loan | Full lifecycle | Consumer loan with payments |
| Energy PPA | Full lifecycle | Solar power purchase agreement |
| Manufacturing | Full lifecycle | Work order with BOM and overhead |
| Salesforce Opportunity | Full lifecycle | CRM opportunity to close |
| RMBS Securitization | Full lifecycle | Mortgage-backed security with tranches and waterfall |
| FX Spot Trade | Full lifecycle | Foreign exchange USD/JPY with T+2 settlement |
| Overnight Repo | Full lifecycle | Secured overnight financing with Treasury collateral |
| Manuka Honey Provenance | Full + Attestations | UMF-certified honey with lab/certifier/regulator attestation chain |
| Luxury Watch Authentication | Full lifecycle | Rolex with spectroscopic material fingerprinting |
| Supply Chain Template | Configurable | Generic provenance tracking template |

---

## Privacy Architecture

FORAY protects sensitive business data while enabling verification:

| Mechanism | What It Does |
|-----------|--------------|
| **Hash-Only Anchoring** | Only cryptographic fingerprints go on-chain, never raw data |
| **Salted Formula IDs** | Proprietary calculations are hashed with unique salts |
| **Instance Pools** | Timing correlation resistance across transactions |
| **Obfuscated References** | Party names and relationships protected |

**Result:** Auditors can verify that records are intact and calculations are consistent without seeing the actual formulas, values, or party identities. Your competitive secrets stay private.

---

## Use Cases

| Industry | Application | Compliance |
|----------|-------------|------------|
| **AI Governance** | Agent decision audit trails, MCP observability, EU AI Act logging | EU AI Act Art. 12, NIST AI RMF |
| Financial Services | Derivatives, securitizations, repo, FX trading | SOX, Basel III, Dodd-Frank, EMIR |
| Defense | Cost tracking, supply chain, DCAA audit | DCAA, DFARS, FAR |
| Manufacturing | BOM, WIP, inventory, quality management | SOX, IFRS, ISO 9001 |
| Energy | PPA settlements, grid transactions | FERC, regulatory |
| Supply Chain | Product provenance, authenticity, cold chain | FDA, EU Food Safety, EUDR |

---

## Roadmap

- [x] Protocol v4.1 specification
- [x] Transaction Review Tool with Kaspa Testnet
- [x] QuickBooks adapter (prototype)
- [x] Salesforce adapter (prototype)
- [x] Attestations extension (certifications, inspections, oracle readings)
- [x] Intrinsic authentication (spectroscopic product fingerprinting)
- [ ] MCP server implementation (enterprise AI agent audit)
- [ ] SAP S/4HANA connector
- [ ] Oracle Fusion connector
- [ ] GRC platform integration (ServiceNow, IBM OpenPages)
- [ ] Mainnet deployment
- [ ] ZK-proof integration (when Kaspa supports)
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

**Change Date:** January 25, 2030 → Converts to Apache License 2.0

See [LICENSE.md](LICENSE.md) for full terms.

---

## Citation

If you use FORAY in research, please cite:

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

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)
- **Live Demo:** [foray.dunin7.com](https://foray.dunin7.com)

---

## Acknowledgments

**🏆 Kaspathon 2026 Top 10 Finalist** — Real-Time Data Track

FORAY leverages Kaspa's unique properties:
- BlockDAG architecture for parallel block production
- GHOSTDAG consensus for high throughput
- Sub-second confirmation for real-time anchoring

---

*FORAY Protocol — Transparent audits, protected secrets, powered by Kaspa.*

---

**Copyright (c) 2026 Marvin Percival. All rights reserved.**
