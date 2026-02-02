---
name: foray
description: Generate FORAY Protocol v4.1 transaction JSON from natural language descriptions. Use when user describes a business transaction and needs a structured FORAY JSON output for blockchain audit trails. Triggers on "FORAY transaction", "create FORAY JSON", "audit trail transaction", enterprise transactions (payroll, derivatives, securitizations, manufacturing, supply chain, energy, food provenance, luxury authentication), or requests to convert transaction descriptions to FORAY format.
---

# FORAY Protocol Skill v4.1.1

**Version:** 4.1.1
**Created:** 2026-01-29T16:00:00Z
**Author:** Marvin Percival
**Email:** marvinp@dunin7.com
**GitHub:** DUNIN7/foray-kaspathon

Convert natural language transaction descriptions into valid FORAY Protocol JSON with the 4-component structure, privacy metadata, and Kaspa blockchain anchoring.

## Core Principles

### Source System Trust
**FORAY trusts the source system.** Transactions arriving at FORAY have already been validated by robust, tested enterprise systems (SAP, Oracle, QuickBooks, Salesforce, trading platforms, spectroscopic oracles). FORAY's role is to **anchor and protect** validated data, not to second-guess it.

### FORAY's Role
| Do | Don't |
| Anchor validated data to blockchain | Duplicate ERP validation |
| Enable cryptographic verification | Second-guess source systems |
| Provide tamper-evident audit trail | Add validation latency |
| Support intrinsic authentication | Replace physical security |

## The 4-Component Model

Every FORAY transaction decomposes into:

| Component | Purpose | Contains |
| **Arrangements** | Contractual setup | Parties, terms, effective dates, legal docs |
| **Accruals** | Calculation logic | Formulas, valuations, computed amounts, **spectroscopic fingerprints** |
| **Anticipations** | Expected future flows | Forecasts, conditions, scheduled payments, verification windows |
| **Actions** | Executed settlements | Actual amounts, completion dates, status, **verification results** |

**Key Distinction:** 
- **Accruals** = HOW amounts/fingerprints are computed (formulas, rates, spectroscopic analysis)
- **Anticipations** = WHAT we expect in the future (payments, verification windows, tolerance periods)

**Dependency Chain:** Components can reference upstream components via `_refs[]` arrays (many-to-many relationships supported in v4.1).

## v4.1.1 Key Features

1. **Flexible Entry Points** - Any component type can be the transaction root
2. **Many-to-Many References** - Use `_refs[]` arrays instead of singular `_ref` fields
3. **Allocations Tracking** - Actions can specify how settlements map to multiple references
4. **Spectroscopic Oracles** - Valuation-type Accruals support molecular/material fingerprinting
5. **Intrinsic Authentication** - Product itself as security key via Golden Standard paradigm

---

## NEW: Intrinsic Authentication Pattern

### The Paradigm Shift

Traditional authentication relies on **extrinsic identifiers** (tags, QR codes, certificates) that can be cloned or transferred. FORAY's **Intrinsic Authentication** uses the product's physical-chemical composition as its security key.

| Approach | What's Verified | Vulnerability |
| Extrinsic (NFC, QR) | The tag/label | Can be cloned or transferred |
| **Intrinsic (FORAY)** | **The product itself** | **Cannot copy molecular physics** |

### Key Concept: Golden Standard

1. **At Source:** Producer performs spectroscopic scan -> creates "Golden Standard" fingerprint
2. **Oracle Attestation:** Certified lab validates and signs the fingerprint
3. **FORAY Anchoring:** Golden Standard hash committed to Kaspa blockchain
4. **At Verification:** Any scan compares against anchored Golden Standard
5. **Result:** Match = Authentic | Deviation beyond tolerance = Fraud Alert

### When to Use Intrinsic Authentication

| Use Case | Trigger Phrases | Key Components |
| Food Provenance | "Manuka honey authentication", "honey verification", "wine provenance" | Spectroscopic Accrual + Tolerance Anticipation |
| Luxury Goods | "watch authentication", "handbag verification", "jewelry provenance" | Multi-component Material Fingerprints |
| Pharmaceuticals | "drug authentication", "medicine verification" | Molecular signature + batch tracking |
| High-Value Components | "aerospace part provenance", "counterfeit detection" | Material composition fingerprint |

---

## Spectroscopic Accrual Structure

For intrinsic authentication, use `computation_method: "Valuation"` with spectroscopic oracle:

```json
{
  "id": "ACC_MOLECULAR_FINGERPRINT",
  "foray_core": {
    "arrangement_refs": ["ARR_PRODUCT_CERT"],
    "type": "spectroscopic_valuation",
    "description": "Golden Standard molecular fingerprint",
    "computation_method": "Valuation",
    "oracle_ref": "sha256:spectrolab_pubkey...",
    "oracle_signature": "sig:attestation...",
    "formula_id": "sha256:spectral_analysis_protocol...",
    "inputs": {
      "spectral_method": "NIR-Raman-Hybrid|XRF|NMR",
      "wavelength_range_nm": [400, 2500],
      "scan_count": 64
    },
    "spectral_fingerprint": {
      "golden_standard_hash": "sha256:fingerprint...",
      "parameters": { },
      "tolerance_model": { }
    },
    "output": 1.0,
    "currency": "dimensionless",
    "scan_timestamp": "ISO-8601"
  }
}
```

### Spectroscopic Methods by Domain

| Domain | Spectral Method | Key Parameters |
| Manuka Honey | NMR-Spectroscopy | MGO content, Leptosperin, sugar profile, pollen DNA |
| Wine | NIR + Mass Spec | Tannin profile, residual sugar, alcohol content |
| Steel/Alloys | XRF-Fluorescence | Elemental composition, trace elements |
| Ceramics | XRF-Raman-Combined | Oxide composition, surface hardness |
| Lubricants | Raman-Spectroscopy | Molecular signature, viscosity markers |
| Sapphire/Gems | NIR-Transmission | Purity, AR coating spectrum, inclusion patterns |

---

## Verification Action Structure

For recording verification results:

```json
{
  "id": "ACT_VERIFICATION",
  "foray_core": {
    "anticipation_refs": ["ANT_VERIFICATION_WINDOW"],
    "accrual_refs": ["ACC_MOLECULAR_FINGERPRINT"],
    "type": "spectroscopic_verification",
    "description": "Consumer/inspector verification scan",
    "amount_settled": 0.00,
    "settlement_date": "ISO-8601",
    "settlement_status": "completed",
    "verification_result": {
      "scan_device": "FORAY-Scanner-Model",
      "spectral_scan_hash": "sha256:scan_result...",
      "golden_standard_ref": "sha256:original_fingerprint...",
      "match_result": "AUTHENTIC|SUSPECT|COUNTERFEIT",
      "deviation_percent": 0.8,
      "tolerance_threshold_percent": 3.0,
      "confidence_score": 0.996
    }
  }
}
```

---

## Domain-Specific Patterns

### Food Provenance (Manuka Honey, Wine, Specialty Foods)

**Transaction Flow:**
```
ARR_ORIGIN_CERT -> ACC_MOLECULAR_FINGERPRINT -> ANT_SHELF_VERIFICATION -> ACT_CONSUMER_SCAN
                -> ACC_PRODUCTION_YIELD -> ANT_DISTRIBUTION -> ACT_DELIVERY
```

**Key Elements:**
- Arrangement: Origin certification (UMF, DOP, PDO, organic)
- Accrual: Golden Standard spectroscopic fingerprint with tolerance model
- Anticipation: Verification window considering degradation/aging
- Action: Point-of-verification scan with match result

**Fraud Types Detected:**
- Adulteration (honey with sugar syrups, diluted products)
- Origin fraud (non-NZ honey sold as Manuka)
- Grade misrepresentation (low-UMF sold as high-UMF)
- Mislabeling (conventional sold as organic)

### Luxury Goods (Watches, Handbags, Jewelry)

**Transaction Flow:**
```
ARR_BIRTH_CERT -> ACC_CASE_MATERIAL_FP -> ANT_WARRANTY -> ACT_INITIAL_SALE
              -> ACC_MOVEMENT_FP      -> ANT_SERVICE   -> ACT_RESALE_VERIFICATION
              -> ACC_CRYSTAL_FP       -> ANT_RESALE
              -> ACC_BEZEL_FP
```

**Key Elements:**
- Arrangement: Product birth certificate with COSC/certification
- Accruals: Multi-component material fingerprints (case, movement, crystal, etc.)
- Anticipations: Warranty period, service intervals, resale verification
- Actions: Custody transfers with verification at each point

**Fraud Types Detected:**
- Counterfeit products (wrong alloy composition)
- Franken-watches (genuine parts from different watches)
- Non-genuine replacement parts
- Super-fakes (visually identical but material mismatch)

### Manufacturing/Aerospace Components

**Transaction Flow:**
```
ARR_COMPONENT_CERT -> ACC_MATERIAL_FP -> ANT_INSTALLATION -> ACT_ASSEMBLY
                  -> ACC_HEAT_TREAT_FP -> ANT_MAINTENANCE -> ACT_INSPECTION
```

**Key Elements:**
- Arrangement: Component specification and compliance requirements
- Accruals: Material composition, heat treatment signature, coating analysis
- Anticipations: Installation schedule, maintenance intervals
- Actions: Assembly verification, periodic inspection results

---

## JSON Structure Template (v4.1.1)

```json
{
  "transaction_id": "DOMAIN_YYYY_QN_DESCRIPTOR",
  "schema_version": "4.1",
  "timestamp": "ISO-8601 datetime",

  "foray_core": {
    "entity": "Primary entity name",
    "entity_hash": "sha256:...",
    "transaction_type": "food_provenance_spectroscopic|luxury_provenance_spectroscopic|...",
    "total_value": 0.00,
    "currency": "USD",
    "status": "active|completed|reversed",
    "compliance_flags": ["EU_Food_Safety", "DOP_Certification", "Swiss_Made", "..."]
  },

  "component_hashes": {
    "arrangements": "sha256:...",
    "accruals": "sha256:...",
    "anticipations": "sha256:...",
    "actions": "sha256:..."
  },

  "arrangements": [ ],
  "accruals": [ ],
  "anticipations": [ ],
  "actions": [ ],

  "merkle_root": "sha256:...",

  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 0,
    "confirmation_time_ms": 0,
    "anchored_at": "ISO-8601"
  },

  "audit_data_anchor": {
    "audit_data_hash": "sha256:...",
    "audit_profile": "food_safety_spectroscopic|luxury_authentication_spectroscopic|...",
    "storage_locations": []
  },

  "privacy_metadata": {
    "formulas_obfuscated": 0,
    "instance_pools": 0,
    "spectral_data_protection": {
      "full_spectrum_hash_only": true,
      "tolerance_ranges_encrypted": true
    },
    "attack_complexity": "2^96 operations"
  },

  "intrinsic_authentication": {
    "paradigm": "molecular_fingerprint|multi_component_material_fingerprint",
    "key_insight": "Product itself is the security key",
    "oracle_network": "Certified laboratory name",
    "verification_method": "Compare scan against anchored Golden Standard",
    "fraud_detection": { }
  }
}
```

---

## Accrual Calculation Types

Accruals are **formulas applied against asset flows**. They capture HOW amounts/fingerprints are determined.

| computation_method | Use Case |
| **Calculated** | Formula-based (interest, depreciation, taxes, allocations) |
| **Valuation** | Oracle/external source (market prices, FX rates, **spectroscopic fingerprints**) |
| **FixedAmount** | Static value (flat fees, fixed charges, invoice line items) |
| **Estimated** | Projected values subject to true-up |

---

## Valid Transaction Patterns (v4.1.1)

| Pattern | Components | Use Case |
| `FULL_LIFECYCLE` | ARR -> ACC -> ANT -> ACT | Complete transaction cycle |
| `INTRINSIC_AUTH` | ARR -> ACC(spectro) -> ANT(verify_window) -> ACT(verification) | Food/luxury authentication |
| `MULTI_COMPONENT` | ARR -> [ACC, ACC, ACC] -> ANT -> ACT | Multi-component fingerprinting |
| `COMMITMENT_ONLY` | ARR | Contract signed, no activity yet |
| `SETTLEMENT_ONLY` | ACT | Immediate cash transaction |

---

## Privacy Architecture (3-Layer + ZK-Ready)

| Layer | Mechanism | Purpose |
| **1. Identifier Hashing** | Salted SHA-256 | Cross-entity unlinkability |
| **2. Formula/Fingerprint Commitments** | Hash-based registry | Prove correctness without revealing logic |
| **3. Instance Pooling** | Multiple representations | Statistical confusion |
| **4. Zero-Knowledge (Future)** | ZK-SNARKs/STARKs | When Kaspa supports on-chain ZK |

**Spectroscopic Data Protection:**
- Full spectrum -> hash only on-chain
- Tolerance ranges -> encrypted
- GPS coordinates -> encrypted
- Proprietary formulas -> salted hash

---

## Attestations Extension (Optional)

For transactions requiring third-party validation, add an `attestations` array with the following structure:

```json
{
  "id": "ATT_UMF_CERTIFICATION_001",
  "foray_core": {
    "attestor": "UMF Honey Association",
    "attestor_hash": "sha256:umf_assoc_nz_2026...",
    "attestor_type": "certification_body",
    "attestor_credentials": ["NZ_Govt_Recognized", "Trademark_Owner_UMF"],
    "subject_refs": ["ARR_UMF_LICENSE_2026", "ACC_LABORATORY_ANALYSIS_001"],
    "attestation_type": "certification",
    "attestation_date": "2026-01-14T14:00:00Z",
    "validity_period": { "start": "2026-01-14", "end": "2026-12-31" },
    "outcome": "certified",
    "evidence_hash": "sha256:certificate_document...",
    "evidence_location": "off-chain",
    "dependencies": ["ATT_LAB_ANALYSIS_001"]
  }
}
```

### Attestor Types
| Type | Use Case |
|------|----------|
| `certification_body` | UMF Association, ISO registrar, DOP Consorzio |
| `laboratory` | Analytica Labs, spectroscopic analysis |
| `auditor` | Big Four, internal audit |
| `inspector` | Customs, quality control |
| `oracle` | IoT sensors, GPS tracking |
| `regulator` | MPI, FDA, DCAA |

### When to Include Attestations
- Product provenance (Manuka honey, luxury goods)
- Regulatory certifications
- Third-party inspections/audits
- Export approvals

**Note:** Attestations are optional. Core 4A is sufficient for most transactions.

---

## Workflow: Description -> JSON

1. **Parse the description** - Extract: parties, amounts, dates, products, authentication requirements
2. **Identify domain** - Financial, manufacturing, payroll, supply chain, energy, **food provenance, luxury goods**
3. **Determine if intrinsic auth needed** - Food products, luxury items, high-value components
4. **Determine if attestations needed** - Third-party certifications, inspections, lab analysis
5. **Build component chain** - Use appropriate pattern (INTRINSIC_AUTH for authentication use cases)
6. **Add spectroscopic accruals** - Golden Standard fingerprints with oracle attestation
7. **Add verification anticipations** - Tolerance windows, degradation models
8. **Add attestations if needed** - Lab analysis, certifications, export approvals
9. **Apply privacy** - Salt identities, hash fingerprints, encrypt tolerances
10. **Add metadata** - Kaspa commitment placeholders, compliance flags, intrinsic_authentication block

---

## Example Prompts

### Food Provenance
> "Create a FORAY transaction for a batch of UMF 15+ Manuka honey with spectroscopic authentication"

**Result:** Full INTRINSIC_AUTH pattern with UMF certification arrangement, molecular fingerprint accrual, shelf verification anticipation, consumer scan action, and attestations from laboratory, UMF Association, and MPI export approval.

### Luxury Watch
> "Create a FORAY transaction for a Rolex Daytona with material fingerprinting for anti-counterfeit"

**Result:** Multi-component INTRINSIC_AUTH with birth certificate arrangement, material fingerprints for case/movement/crystal/bezel, warranty anticipation, and resale verification action.

### Batch Payment (Traditional)
> "Create a FORAY transaction for a batch payment of $10,000 clearing three vendor invoices"

**Result:** Standard FULL_LIFECYCLE with vendor arrangement, invoice accruals, payment anticipations, and consolidated payment action. (No attestations needed for routine transactions.)

---

**Protocol Version:** 4.1.1  
**Copyright:** (c) 2026 Marvin Percival. All rights reserved.  
**License:** BSL-1.1
