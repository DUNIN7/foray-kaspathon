# FORAY Protocol

**Privacy-Preserving Blockchain Audit Infrastructure**

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE.md)
[![Kaspa](https://img.shields.io/badge/Blockchain-Kaspa-49EACB.svg)](https://kaspa.org)
[![Protocol Version](https://img.shields.io/badge/Protocol-v4.1-green.svg)](docs/FORAY_Protocol_v4_1_Specification.md)

> **Built for Kaspathon 2026 — Real-Time Data Track**

---

## What is FORAY?

FORAY creates **immutable, tamper-proof audit trails** of enterprise transactions that regulators, auditors, and forensic investigators can trust—without exposing your competitive secrets.

**The Problem:** Internal audit trails can be altered. When fraud happens (Enron, Wirecard, FTX), companies rewrite history. External auditors have no way to prove records weren't tampered with.

**The Solution:** FORAY anchors cryptographic fingerprints of your transactions to Kaspa's blockchain in real-time. The data stays in your systems; only the hash goes on-chain. If anyone alters a record, the mismatch is instantly detectable.

---

## Why Kaspa?

| Feature | Kaspa | Bitcoin | Ethereum |
|---------|-------|---------|----------|
| Block Time | **1 second** | 10 minutes | 12 seconds |
| Finality | ~10 seconds | 60 minutes | 12 minutes |
| TX Cost | ~$0.0001 | $1-50 | $0.50-50 |
| Throughput | 1 BPS → 100 BPS | 7 TPS | 15 TPS |

Kaspa's **1-second blocks** enable real-time anchoring as transactions happen—not batch processing hours later. GHOSTDAG consensus provides high throughput without sacrificing decentralization.

---

## The 4-Component Model

FORAY decomposes every business transaction into four components:

| Component | What It Captures | Example |
|-----------|------------------|---------|
| **Arrangements** | Contractual setup | Loan agreement signed |
| **Accruals** | Economic recognition | Interest calculated |
| **Anticipations** | Expected future flows | Payment scheduled |
| **Actions** | Actual asset transfers | Wire sent |

This maps to how businesses actually operate—from contract to cash.

### v4.1 Key Features

- **Flexible Entry Points** — Not every transaction starts with a contract. Cash sales can begin directly with an Action.
- **Many-to-Many References** — One payment can clear multiple invoices. One invoice can cover multiple contracts.

---

## Quick Demo

### Try the Transaction Review Tool

1. Open the [FORAY Transaction Review Tool](demo/foray-tx-review-v41.html)
2. Paste any FORAY JSON (examples in `/examples`)
3. Click "Connect Wallet" (requires [KasWare](https://kasware.xyz))
4. Review the transaction structure
5. Click "Anchor to Kaspa" to create an immutable proof

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
├── AI_DISCLOSURE.md
│
├── docs/
│   ├── FORAY_Protocol_v4_1_Specification.md   # Full protocol specification
│   ├── FORAY_Protocol_v4_1_Change_Summary.md  # What's new in v4.1
│   ├── FORAY_QuickBooks_Integration.md        # Integration patterns & API design
│   └── FORAY_Salesforce_Integration.md        # Integration patterns & API design
│
├── demo/
│   ├── foray-tx-review-v41.html       # Transaction Review Tool (working demo)
│   └── foray-infographic-v41.html     # Interactive Explainer
│
└── examples/
    ├── batch-payment-v41.json         # AP batch clearing 3 invoices
    ├── cash-sale-v41.json             # Retail POS (Action-only)
    ├── depreciation-v41.json          # Month-end adjusting entry (Accrual-only)
    ├── manufacturing-work-order-v41.json  # Production with BOM/labor/overhead
    ├── salesforce-opportunity-v41.json    # CRM opportunity to payment
    ├── fx-spot-usdjpy-v41.json        # $10M FX spot with T+2 settlement
    ├── overnight-repo-v41.json        # $100M repo with Treasury collateral
    ├── rmbs-transaction-v3.json       # $300M RMBS securitization
    ├── auto-loan-john-doe-v3.json     # $25K consumer auto loan
    ├── mary-smith-loan-v3.json        # $60K commercial loan
    └── energy-solar-ppa-morocco-spain-v3.json  # €197M cross-border PPA
```

> **Note:** This is a seed project demonstrating protocol design and feasibility. Production adapters for QuickBooks, Salesforce, SAP, and other enterprise systems are in development. See integration docs for API patterns and implementation guidance.

### Built-in Sample Transactions (in Transaction Review Tool dropdown)

The demo tool includes 10 embedded sample transactions:

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

---

## Privacy Architecture

FORAY protects sensitive business data while enabling verification:

| Mechanism | What It Does |
|-----------|--------------|
| **Hash-Only Anchoring** | Only cryptographic fingerprints go on-chain, never raw data |
| **Salted Formula IDs** | Proprietary calculations are hashed with unique salts |
| **Instance Pools** | Timing correlation resistance across transactions |
| **Obfuscated References** | Party names and relationships protected |

**Result:** Auditors can verify that calculations are correct without seeing the actual formulas or values. Your competitive secrets stay private.

---

## Use Cases

| Industry | Application | Compliance |
|----------|-------------|------------|
| Financial Services | Derivatives, securitizations, trading | SOX, Basel III, Dodd-Frank |
| Defense | Cost tracking, supply chain | DCAA, DFARS |
| Manufacturing | BOM, WIP, inventory | SOX, IFRS |
| Energy | PPA settlements, grid transactions | FERC, regulatory |

---

## Roadmap

**Seed Project (Kaspathon 2026)**
- [x] Protocol v4.1 specification
- [x] Transaction Review Tool with Kaspa Testnet integration
- [x] 11 realistic transaction examples across industries
- [x] Integration design patterns (QuickBooks, Salesforce)

**Future Development**
- [ ] Production adapters (QuickBooks, Salesforce, SAP)
- [ ] Multi-language SDKs (Rust, Python, JavaScript)
- [ ] Mainnet deployment
- [ ] ZK-proof integration (when Kaspa supports)
- [ ] Big 4 audit firm partnerships

---

## License

**Business Source License 1.1** — Source-available with commercial restrictions.

| Permission | Allowed |
|------------|---------|
| View, copy, modify | ✓ |
| Non-production use | ✓ |
| Academic research | ✓ |
| Production use | Requires license |

**Change Date:** January 25, 2030 → Converts to Apache License 2.0

See [LICENSE.md](LICENSE.md) for full terms.

---

## Citation

If you use FORAY in research, please cite:

```bibtex
@article{foray2026,
  title={FORAY: A Privacy-Preserving Blockchain Audit Protocol},
  author={Percival, Marvin},
  year={2026},
  note={Kaspathon 2026 Submission}
}
```

---

## Contact

- **Author:** Marvin Percival
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

## AI Assistance Disclosure

This project was developed with AI assistance (Claude, Anthropic). Per Kaspathon requirements, see [AI_DISCLOSURE.md](AI_DISCLOSURE.md) for complete details on where and how AI was used, including protocol design, documentation, code generation, and example creation.

---

## Acknowledgments

Built for **Kaspathon 2026** — Real-Time Data Track

*Current implementation demonstrates batch anchoring. Real-time integration via webhooks is architecturally supported and planned for production.*

FORAY leverages Kaspa's unique properties:
- BlockDAG architecture for parallel block production
- GHOSTDAG consensus for high throughput
- Sub-second confirmation for real-time anchoring

---

*FORAY Protocol — Transparent audits, protected secrets, powered by Kaspa.*

---

**Copyright © 2026 Marvin Percival. All rights reserved.**
