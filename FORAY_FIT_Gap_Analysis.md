# Gap Analysis: Treasury FIT Blockchain Prototype vs. FORAY Protocol

*Identifying Enhancement Opportunities for Federal Grant Fraud Prevention*

---

| Property | Value |
|---|---|
| **Document Version** | 1.0 |
| **Created** | 2026-01-30T17:00:00Z |
| **Converted to Markdown** | 2026-02-02T12:00:00Z |
| **Author** | Marvin Percival |
| **Classification** | Strategic Analysis — For Government Engagement |

---

## 1. Executive Summary

This gap analysis compares Treasury's Office of Financial Innovation and Transformation (FIT) blockchain grant management prototype with FORAY Protocol to identify enhancement opportunities that could strengthen federal grant fraud prevention — particularly relevant given the ongoing Minnesota fraud investigation involving an estimated $9 billion in misappropriated federal funds.

**Key Finding:** The FIT prototype provides excellent fund tracking and drawdown visibility. FORAY Protocol could serve as a complementary semantic layer that adds transaction structure verification, privacy-preserving audit capabilities, and service delivery validation — addressing fraud patterns where payments are made for services never rendered.

---

## 2. Treasury FIT Blockchain Prototype Overview

### 2.1 Initiative Background

In summer 2019, Treasury's Bureau of the Fiscal Service launched a proof-of-concept with the National Science Foundation (NSF) to explore blockchain technology for federal grant management. The initiative has since expanded to include demonstrations for HUD, Commerce, and HHS.

### 2.2 Prototype Capabilities

- **Tokenized Grant Awards:** Digital representation of grant awards containing descriptive information, terms, and funding amounts
- **Real-Time Fund Tracking:** Visibility into fund transfers from federal agency → prime recipient → subrecipient
- **Internal Controls:** Prime grantees can create funding thresholds within blockchain tokens
- **Automated Reporting:** Users can generate federal financial reports and review payment status at any point
- **Transaction History:** Every transaction recorded and viewable by authorized participants

### 2.3 JFMIP Multi-Agency Expansion

In August 2021, the Joint Financial Management Improvement Program (JFMIP) expanded the FIT prototype across agency boundaries to GAO. The December 2023 report "Harnessing Blockchain in the Federal Government" documented key considerations for multi-agency blockchain deployment, including IT infrastructure, cybersecurity, and Authority to Operate (ATO) processes.

---

## 3. Gap Analysis: FIT Prototype vs. FORAY Protocol

| Capability | FIT Prototype | FORAY Protocol | Gap / Opportunity |
|---|---|---|---|
| **Fund Tracking** | ✓ Strong — Real-time visibility of fund flows | ✓ Equivalent via Actions component | No gap — Both provide fund tracking |
| **Transaction Semantics** | △ Basic — Token contains grant metadata | ✓ Full 4A Model — Arrangements, Accruals, Anticipations, Actions | **FORAY ADDS:** Structured transaction lifecycle tracking |
| **Service Delivery Verification** | ✗ Not addressed — Tracks payments, not services | ✓ Accruals component links payments to service delivery formulas | **CRITICAL GAP:** Minnesota fraud involved fake service claims |
| **Privacy Architecture** | △ Permissioned access — Full data visible to participants | ✓ 3-Layer privacy with selective disclosure; ZK-ready | **FORAY ADDS:** Beneficiary protection for vulnerable populations |
| **Cross-System Integration** | △ Agency-specific — Requires custom integration per agency | ✓ ERP-agnostic adapters (SAP, Oracle, QuickBooks, Salesforce) | **FORAY ADDS:** Unified audit across federal + state + nonprofit systems |
| **Blockchain Platform** | △ Cloud-hosted (vendor-specific) | ✓ Blockchain-agnostic — Works with any ledger or none | **FORAY ADDS:** No vendor lock-in; can layer on existing infrastructure |

---

## 4. Critical Gap: Service Delivery Verification

The Minnesota fraud investigation reveals a fundamental weakness in current grant oversight: payments were made for services never rendered. Feeding Our Future submitted fake meal counts; child care centers claimed attendance for children not present; behavioral health providers billed for services without documentation.

### 4.1 How FIT Prototype Addresses This

The FIT prototype tracks fund flows but does not inherently verify that claimed services were delivered. A fraudulent provider could still submit false claims; the blockchain would accurately record the resulting payment, but would not flag the underlying fraud.

### 4.2 How FORAY Protocol Addresses This

FORAY's 4-component model creates explicit linkage between service delivery (Accruals) and payments (Actions):

- **Arrangement:** Grant agreement with terms (e.g., "$5.00 per meal served to eligible children")
- **Accrual:** Service delivery record with formula (e.g., "150 children × 2 meals × $5.00 = $1,500")
- **Anticipation:** Expected reimbursement based on accrued services
- **Action:** Actual payment — must reference verified Accruals

**Any payment (Action) without corresponding service delivery (Accrual) is immediately flagged as anomalous.** Fraudulent invoices cannot be anchored without creating the verifiable service delivery records that would expose the fraud.

---

## 5. Recommendations

### 5.1 FORAY as Semantic Layer

FORAY Protocol should be positioned as a complementary semantic layer that enhances (rather than replaces) Treasury's blockchain infrastructure. The FIT prototype provides the anchoring mechanism; FORAY provides the transaction structure and verification logic.

### 5.2 Pilot Program Proposal

A 6-month pilot integrating FORAY transaction semantics with the FIT prototype could demonstrate fraud prevention value for programs similar to those affected by Minnesota fraud (Child Nutrition, Child Care Assistance, Behavioral Health).

### 5.3 Next Steps

- Request technical briefing with FIT team to discuss integration approach
- Develop mapping between FIT token structure and FORAY components
- Identify pilot program with willing state agency partner

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

*FORAY Protocol — Transparent audits, protected secrets*

Copyright © 2026 Marvin Percival. All rights reserved.
