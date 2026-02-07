# FORAY Protocol: Attestation and Trust Model

**Version:** 1.2.0  
**Created:** 2026-01-31T21:00:00Z  
**Modified:** 2026-02-01T00:15:00Z  
**Author:** Marvin Percival  
**Email:** marvinp@dunin7.com  
**GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

## Background: Addressing a Critical Gap

During rigorous peer review of the FORAY Protocol, a fundamental concern was raised:

> *"The most glaring omission: Assertions (or Attestations). Business transactions aren't just data--they're claims about reality that may be disputed, fraudulent, mistaken, or contested by regulators. Without attestation/assertion, your audit trail is just -> he said, she said' with cryptographic wrapping."*

This document directly addresses that concern by:
1. Clearly defining what FORAY proves and does not prove
2. Distinguishing between system-of-record transactions and attestation transactions
3. Introducing the **Attestations** extension component for use cases requiring third-party validation

---

## Understanding What FORAY Proves

FORAY Protocol creates tamper-evident audit trails by anchoring cryptographic hashes to the Kaspa blockchain. It is essential to understand precisely what this proves--and what it does not.

### What FORAY Proves

| Capability | Description |
|------------|-------------|
| **Temporal proof** | A specific claim was recorded at a specific point in time |
| **Integrity proof** | The recorded data has not been altered since anchoring |
| **Consistency proof** | Multiple parties can verify they hold identical records |
| **Sequence proof** | Events occurred in a verifiable order |

### What FORAY Does NOT Prove

The peer review correctly identified these limitations:

| Limitation | Explanation |
|------------|-------------|
| **Truth of claims** | FORAY anchors *assertions*, not *facts*--if a party claims "this honey is authentic Manuka from New Zealand," FORAY proves they made that claim, not that it's true |
| **Physical reality** | Digital records cannot independently verify physical world states |
| **Attestor competence** | A laboratory's certification is only as reliable as the laboratory |
| **Data accuracy at source** | "Garbage in, garbage out"--FORAY trusts validated source system data |

**This is not a weakness to hide--it is a boundary to understand.** Every audit system shares these limitations. FORAY's contribution is making the recorded claims tamper-evident and the claimants accountable.

---

## The Attestations Extension: Answering the Peer Review

The peer review asked four critical questions that the core 4A model could not answer:

| Question | Core 4A Answer | With Attestations Extension |
|----------|----------------|----------------------------|
| "Who asserts this Action occurred?" | Implicit (transaction creator) | **Explicit attestor identity with credentials** |
| "What evidence supports this Anticipation?" | Not captured | **Evidence hash linked to off-chain documentation** |
| "Which auditor verified this Accrual?" | Not captured | **Attestor type, certification, timestamp** |
| "Who signed off on this Arrangement?" | Party names only | **Full attestation chain with accountability** |

### When to Use Core 4A vs. Attestations Extension

**Core 4A Only (majority of transactions):**
- Invoice payments
- Payroll processing
- Journal entries
- Loan payments
- Internal transfers
- Standard manufacturing

**Core 4A + Attestations Extension:**
- Product provenance (Manuka honey, luxury goods)
- Third-party certifications (DOP, ISO, COSC)
- Regulatory compliance attestations
- Audit opinions and sign-offs
- Multi-party verification chains

---

## Transaction Types and Trust Models

FORAY transactions fall into two broad categories with different trust characteristics:

### Type 1: System-of-Record Transactions

These transactions record events within authoritative business systems where the system itself is the source of truth.

**Examples:**
- ERP journal entries (SAP, Oracle, QuickBooks)
- Bank payment confirmations
- Manufacturing work orders
- Payroll processing

**Trust Model:** The ERP/financial system is authoritative. When QuickBooks records a payment, the payment occurred. FORAY anchors this fact with external, tamper-evident proof.

**FORAY Value:** Proves the record existed at a point in time and hasn't been altered--even by system administrators.

### Type 2: Attestation Transactions

These transactions record *claims about external reality* made by identified parties.

**Examples:**
- Product provenance (Manuka honey origin, watch authenticity)
- Laboratory certifications (spectroscopic analysis)
- Third-party inspections
- Compliance attestations

**Trust Model:** FORAY anchors a *chain of attestations*, not independent truth. The value depends entirely on trusting the attestors.

**FORAY Value:** Creates a tamper-evident record of who claimed what, when--enabling accountability and dispute resolution.

---

## The Attestation Chain

For provenance and authentication use cases, FORAY records a chain of attestations:

```
+-----------------------------------------------------------------+
|                    ATTESTATION CHAIN                            |
+-----------------------------------------------------------------+
|                                                                 |
|  [Producer]          [Certifier]           [Laboratory]         |
|      |                   |                      |               |
|      v                   v                      v               |
|  "I harvested       "This meets UMF        "MGO analysis       |
|   this honey in      certification          confirms authentic  |
|   New Zealand"       standards"             Manuka profile"     |
|      |                   |                      |               |
|      --------------------+----------------------+               |
|                          |                                      |
|                          v                                      |
|              +-----------------------+                          |
|              |   FORAY Transaction   |                          |
|              |   (anchored to Kaspa) |                          |
|              ------------------------+                          |
|                          |                                      |
|                          v                                      |
|              "These three parties made                          |
|               these claims on this date,                        |
|               and the record is tamper-evident"                      |
|                                                                 |
------------------------------------------------------------------+
```

### What This Enables

1. **Accountability:** If the oil is later found to be from Tunisia, the attestation record identifies who made false claims
2. **Dispute Resolution:** Tamper-evident timestamp supports claims were made before any dispute arose
3. **Audit Trail:** Regulators can trace the complete chain of custody and certification
4. **Fraud Deterrence:** Knowing claims are permanently recorded discourages false attestations

### What This Does NOT Enable

- Independent verification that the honey is actually authentic Manuka from New Zealand
- Proof that the laboratory's equipment was calibrated correctly
- Guarantee that the certifier inspected the actual product
- Prevention of collusion between attestors

---

## The Attestations Component Structure

For transactions requiring third-party validation, the optional Attestations component follows the same structural pattern as the core 4A components:

```json
{
  "id": "ATT_UMF_CERTIFICATION_001",
  "foray_core": {
    "attestor": "UMF Honey Association",
    "attestor_hash": "sha256:umf_assoc_nz_2026...",
    "attestor_type": "certification_body",
    "attestor_credentials": ["NZ_Govt_Recognized", "Trademark_Owner_UMF", "MPI_Partner"],
    "subject_refs": ["ARR_UMF_LICENSE_2026", "ARR_BATCH_DEFINITION_2026_001", "ATT_LAB_ANALYSIS_001"],
    "attestation_type": "certification",
    "attestation_date": "2026-01-14T14:00:00Z",
    "validity_period": {
      "start": "2026-01-14",
      "end": "2026-12-31"
    },
    "outcome": "certified",
    "evidence_hash": "sha256:umf_certificate_mh2026001...",
    "evidence_location": "off-chain",
    "certificate_details": {
      "certificate_number": "UMF-BATCH-2026-00847",
      "umf_grade": "UMF 15+",
      "qr_verification_url": "https://umf.org.nz/verify/UMF-BATCH-2026-00847"
    },
    "dependencies": ["ATT_LAB_ANALYSIS_001"]
  }
}
```

### Key Fields

| Field | Purpose |
|-------|---------|
| `attestor` | Identity of the attesting party |
| `attestor_type` | Category: certification_body, laboratory, auditor, inspector, oracle, regulator |
| `attestor_credentials` | Qualifications that give the attestation weight |
| `subject_refs` | Which components this attestation validates |
| `attestation_type` | certification, inspection, analysis, audit_opinion, verification, approval |
| `outcome` | certified, approved, rejected, conditional, expired, revoked, pending |
| `evidence_hash` | Hash of supporting documentation (stored off-chain) |
| `dependencies` | Other attestations this one builds upon (for attestation chains) |

### Attestation Types

| Type | Use Case | Example |
|------|----------|---------|
| `certification` | Formal certification by authorized body | UMF certification, ISO compliance |
| `inspection` | Physical examination by qualified inspector | Customs inspection, quality check |
| `analysis` | Laboratory or technical analysis | MGO analysis, spectroscopic fingerprint |
| `audit_opinion` | Professional auditor's assessment | Financial audit, compliance review |
| `verification` | Confirmation of facts or events | Delivery confirmation, payment verification |
| `oracle` | Automated/sensor-based attestation | IoT readings, GPS coordinates, timestamps |

---

## Strengthening Attestation Reliability

While FORAY cannot independently verify physical reality, several mechanisms strengthen attestation reliability:

### 1. Identified Attestors

All attestors in FORAY transactions are identified parties (though their identities may be hashed for privacy). This creates accountability--false attestations have consequences.

```json
"parties": [
  { "role": "producer", "name_hash": "sha256:...", "jurisdiction": "IT" },
  { "role": "certifier", "name_hash": "sha256:...", "jurisdiction": "IT" },
  { "role": "laboratory", "name_hash": "sha256:...", "jurisdiction": "IT" }
]
```

### 2. Multi-Party Attestation

Requiring multiple independent attestors increases reliability. Collusion becomes more difficult and expensive.

### 3. Intrinsic Authentication (Where Available)

For certain products, physical properties can serve as unforgeable identifiers:
- Spectroscopic fingerprints (Manuka honey, wine, pharmaceuticals)
- Metallurgical signatures (luxury watches, jewelry)
- DNA markers (agricultural products)

When available, these create a bridge between digital records and physical reality--though measurement accuracy still depends on trusted equipment and operators.

### 4. Oracle Integration (Future)

FORAY's architecture supports integration with trusted oracles--automated systems that can attest to measurable conditions (temperature, location, timestamps) with reduced human intervention.

---

## Recommended Disclosure

For provenance and authentication use cases, FORAY implementations should clearly communicate:

> **FORAY Attestation Notice**
> 
> This transaction records attestations made by identified parties regarding product origin, authenticity, or certification. FORAY provides tamper-evident proof that these claims were made at the recorded time and have not been altered.
> 
> FORAY does not independently verify the truth of these claims. Reliability depends on the trustworthiness of the attesting parties. For verification of attestor credentials, contact the relevant certification authority.

---

## Summary

| Transaction Type | Source of Truth | FORAY Proves | Trust Assumption |
|------------------|-----------------|--------------|------------------|
| **System-of-Record** | ERP/Financial System | Record integrity + timestamp | System is authoritative |
| **Attestation** | Identified Parties | Claims were made + timestamp | Attestors are trustworthy |

### Addressing the Peer Review Concern

The peer reviewer stated: *"Without attestation/assertion, your audit trail is just -> he said, she said' with cryptographic wrapping."*

**Our response:** The Attestations extension transforms "he said, she said" into:
- **Who** said it (identified, credentialed attestor)
- **What** they said (specific claims with evidence hashes)
- **When** they said it (tamper-evident timestamp)
- **What authority** they have to say it (attestor credentials)
- **Permanent accountability** (attestations cannot be deleted or altered)

This doesn't make claims *true*--but it makes claimants *accountable*. That's the difference between a verbal promise and a signed, notarized document. FORAY provides the blockchain equivalent of notarization for business attestations.

### The Honest Value Proposition

FORAY excels at both transaction types, but users must understand the distinction:
- For **system-of-record transactions**, FORAY provides external proof of internal facts
- For **attestation transactions**, FORAY provides accountability infrastructure--the claims are only as reliable as the parties making them

This transparency strengthens rather than weakens FORAY's value proposition: honest attestors benefit from tamper-evident proof of their claims, while dishonest attestors face tamper-evident, traceable evidence of their fraud.

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)
