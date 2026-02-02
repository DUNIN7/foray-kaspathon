# FORAY Protocol — Technical Brief for Treasury FIT

*Enhancing Federal Grant Fraud Prevention Through Transaction Semantic Standards*

---

| Property | Value |
|---|---|
| **Document Version** | 1.0 |
| **Created** | 2026-01-30T17:00:00Z |
| **Converted to Markdown** | 2026-02-02T12:00:00Z |
| **Classification** | Technical Brief — For Government Engagement |

---

## Executive Summary

### The Opportunity

Treasury's Office of Financial Innovation and Transformation (FIT) has developed a blockchain-based grant payment prototype that provides real-time fund tracking and automated reporting. FORAY Protocol offers a complementary semantic layer that could enhance this infrastructure with structured transaction verification, privacy-preserving audit capabilities, and service delivery validation.

### The Urgency: Minnesota Fraud Crisis

Federal prosecutors estimate $9 billion in fraud across 14 Minnesota-administered programs. The common pattern: payments made for services never rendered. Current systems track fund flows but cannot verify that claimed services actually occurred. FORAY's transaction semantic model addresses this gap by requiring explicit linkage between service delivery records and payment authorizations.

### Key Differentiators

| Capability | FORAY Enhancement |
|---|---|
| **4A Transaction Model** | Structured lifecycle: Arrangements → Accruals → Anticipations → Actions |
| **Selective Disclosure** | Show auditors what they need; protect beneficiary privacy |
| **Cross-System Audit** | Unified trail across federal agencies, state systems, and grantee ERPs |

### Proposed Collaboration

We propose a 6-month pilot integrating FORAY transaction semantics with Treasury's blockchain infrastructure, targeting a single grant program with fraud prevention as the primary success metric.

---

## Technical Alignment

### Integration Architecture

FORAY Protocol is designed as a semantic layer that operates above blockchain infrastructure. It does not replace Treasury's blockchain investment — it enhances it with structured transaction verification.

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: FORAY Transaction Semantics                          │
│  (4A Model: Arrangements, Accruals, Anticipations, Actions)    │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: FORAY Privacy Architecture                           │
│  (Identifier Hashing, Formula Commitments, Instance Pooling)   │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Treasury FIT Grant Token Infrastructure              │
│  (Tokenized grants, fund tracking, reporting)                  │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Blockchain Anchoring                                 │
│  (Cloud-hosted ledger, immutable timestamps)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Transaction Semantic Mapping

The following table maps FIT token operations to FORAY transaction components:

| FIT Token Event | FORAY Component | Additional Data Captured |
|---|---|---|
| Grant award creation | **Arrangement** | Parties, terms, conditions, compliance requirements |
| Service delivery claim | **Accrual** | Formula (units × rate), supporting documentation hash |
| Drawdown request | **Anticipation** | Expected amount, linked Accrual refs, settlement date |
| Payment execution | **Action** | Actual amount, Accrual refs verified, settlement proof |

### Privacy Architecture for Beneficiary Protection

Grant programs serving vulnerable populations (children, disabled individuals, healthcare recipients) require privacy protections. FORAY's 3-layer privacy architecture ensures beneficiary data never appears on-chain while maintaining audit verifiability:

1. **Identifier Hashing:** Beneficiary identifiers are salted and hashed before anchoring. The salt is stored off-chain with access controls.

2. **Formula Commitments:** Service delivery formulas (e.g., "children × meals × rate") are committed as hashes. Auditors can verify formula correctness without seeing individual records.

3. **Instance Pooling:** Multiple transactions are batched before anchoring, preventing timing analysis that could identify specific beneficiaries.

**GDPR/Privacy Compliance:** Because personally identifiable information (PII) is stored only off-chain with encryption, FORAY supports "practical erasure" for compliance with data protection requirements. Deleting off-chain records and encryption keys renders on-chain hashes meaningless.

---

## Pilot Program Proposal

### Proposed Scope

| Parameter | Detail |
|---|---|
| **Target Program** | Federal Child Nutrition Program or Child Care Development Fund (programs affected by Minnesota fraud) |
| **Duration** | 6 months proof of concept |
| **Participants** | 50–100 volunteer provider sites in 1–2 states (ideally including Minnesota or similar fraud-affected state) |
| **Integration** | FORAY semantic layer integrated with existing FIT blockchain prototype |

### Implementation Phases

**Phase 1 (Months 1–2): Integration Development**

- Develop FORAY adapter for FIT token infrastructure
- Map existing grant data structures to FORAY components
- Deploy privacy layer for beneficiary protection

**Phase 2 (Months 3–4): Pilot Operation**

- Onboard volunteer provider sites
- Begin transaction anchoring with FORAY semantics
- Monitor for anomalies (payments without service delivery records)

**Phase 3 (Months 5–6): Evaluation & Reporting**

- Measure fraud detection and prevention metrics
- Assess audit efficiency improvements
- Document lessons learned and scaling recommendations

### Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Anomaly detection rate | Real-time (vs. 12–18 mo. current) | Time from claim to flag |
| False positive rate | < 5% | Manual review of flagged items |
| Audit preparation time reduction | > 50% | Hours to audit-ready vs. baseline |
| Provider administrative burden | Neutral or reduced | Provider survey |

### Resource Requirements

- **FORAY Protocol:** Open source (no license fee)
- **Integration development:** Estimated 2–3 FTE months
- **Blockchain anchoring cost:** ~$0.0001 per transaction (negligible)
- **Training:** Provided by FORAY Protocol team

---

## About FORAY Protocol

### Protocol Overview

FORAY Protocol (derived from "4A" — Arrangements, Accruals, Anticipations, Actions) is an open-source transaction semantic standard for enterprise audit trails. It provides a blockchain-agnostic framework for creating immutable, privacy-preserving records of business transactions.

### The 4A Transaction Model

- **Arrangements:** Contractual relationships defining parties, terms, and conditions
- **Accruals:** Formulas applied against asset flows (e.g., service delivery calculations)
- **Anticipations:** Expected future flows based on accrued values
- **Actions:** Executed settlements with references to verified components

### Key Features

- **Blockchain-Agnostic:** Works with Kaspa, Ethereum, Hyperledger, AWS QLDB, or traditional databases with hash verification
- **Privacy-Preserving:** 3-layer architecture with selective disclosure for auditors
- **ERP Integration:** Production-ready adapters for SAP, Oracle, QuickBooks, Salesforce
- **Compliance-Ready:** Designed for SOX 404, DCAA, Basel III, and GDPR requirements

### Open Source Availability

FORAY Protocol is released under the Business Source License with full transparency. The complete specification, reference implementation, and integration adapters are available on GitHub. Government agencies may use FORAY without licensing fees.

### Current Status

- **Protocol Version:** 4.1 (January 2026)
- **Demonstration:** Live demo available at [foray.dunin7.com](https://foray.dunin7.com)
- **Documentation:** Complete technical specification, sector guides (Financial Services, Defense, Manufacturing, Energy)
- **Hackathon Submission:** Kaspathon 2026 Real-Time Data Track

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

*— End of Technical Brief —*

*FORAY Protocol — Transparent audits, protected secrets*

Copyright © 2026 Marvin Percival. All rights reserved.
