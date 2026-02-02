# FORAY Protocol: Warranty Transaction Guide

## Document Control

| Property | Value |
|----------|-------|
| **Version** | 1.0 |
| **Status** | FINAL |
| **Created** | 2026-01-30T16:45:00Z |
| **Schema Version** | 4.1 |
| **Author** | Marvin Percival |
| **Email** | marvinp@dunin7.com |
| **Classification** | Implementation Guide |

---

## Executive Summary

Warranties represent one of the most complex accounting and audit challenges facing modern enterprises. They span multiple accounting standards (ASC 450, ASC 460, ASC 606, IFRS 15, IAS 37), require probabilistic estimation, create contingent liabilities, and demand precise tracking across product lifecycles that may extend years beyond the original sale.

FORAY Protocol provides a unified framework for capturing warranty transactions with full audit traceability, enabling organizations to demonstrate compliance with accounting standards while maintaining the privacy of proprietary cost models and actuarial data.

This guide covers warranty implementations across all major business types, from consumer electronics retailers to aerospace manufacturers, from software vendors to automotive OEMs.

---

## Table of Contents

1. [Why Warranties Are Audit-Critical](#1-why-warranties-are-audit-critical)
2. [Warranty Types and Accounting Treatment](#2-warranty-types-and-accounting-treatment)
3. [FORAY Component Mapping for Warranties](#3-foray-component-mapping-for-warranties)
4. [Industry-Specific Implementations](#4-industry-specific-implementations)
5. [Privacy Considerations](#5-privacy-considerations)
6. [Sample Transactions](#6-sample-transactions)
7. [Integration Patterns](#7-integration-patterns)
8. [Regulatory Compliance](#8-regulatory-compliance)

---

## 1. Why Warranties Are Audit-Critical

### 1.1 The Audit Challenge

Warranty obligations represent significant contingent liabilities for most product-selling enterprises. Auditors must verify:

- **Completeness**: All warranty obligations are recorded
- **Valuation**: Reserve estimates are reasonable and supportable
- **Presentation**: Proper classification between current and long-term liabilities
- **Disclosure**: Adequate footnote disclosures about methodology and assumptions

Traditional ERP systems capture warranty reserves as journal entries but often lack the granular trail connecting reserves to specific products, claims, and actuarial assumptions.

### 1.2 FORAY's Value Proposition

FORAY creates an immutable audit trail that links:

- Original sale arrangements (product, customer, warranty terms)
- Warranty reserve calculations (actuarial formulas, historical data inputs)
- Expected future claims (anticipated cash outflows)
- Actual claim settlements (repair costs, replacements, refunds)

This complete chain enables auditors to verify that reserves are mathematically derived from documented assumptions rather than "plugged" numbers.

### 1.3 Key Benefits by Stakeholder

| Stakeholder | Benefit |
|-------------|---------|
| External Auditors | Trace reserves to source calculations; verify consistency |
| Internal Audit | Monitor reserve adequacy in real-time |
| Controllers | Defend assumptions during audit inquiries |
| Actuaries | Document model inputs with immutable timestamps |
| Tax Teams | Support deferred tax asset calculations |
| Legal/Compliance | Demonstrate good-faith estimation for litigation |

---

## 2. Warranty Types and Accounting Treatment

### 2.1 Assurance-Type Warranties (ASC 606 / IFRS 15)

Assurance warranties promise that a product meets agreed-upon specifications. They do not represent a separate performance obligation.

**Accounting Treatment:**
- Accrue warranty expense at time of sale
- Create warranty liability (reserve)
- No separate revenue allocation required

**FORAY Pattern:** `DEFERRED_SETTLEMENT`
- Arrangement: Sale with warranty terms
- Accrual: Reserve calculation
- Anticipation: Expected claim outflows

### 2.2 Service-Type Warranties (ASC 606 / IFRS 15)

Service warranties provide a service beyond defect repair (e.g., extended warranties, service contracts sold separately or bundled).

**Accounting Treatment:**
- Allocate transaction price between product and warranty
- Defer warranty revenue; recognize over service period
- Accrue costs as incurred

**FORAY Pattern:** `FULL_LIFECYCLE`
- Arrangement: Multi-element contract
- Accruals: Revenue allocation, cost accrual
- Anticipations: Monthly revenue recognition, expected claims
- Actions: Revenue releases, claim payments

### 2.3 Product Warranties vs. Extended Warranties

| Characteristic | Product Warranty | Extended Warranty |
|---------------|------------------|-------------------|
| Included in price | Yes | No (separate purchase) |
| Performance obligation | No | Yes |
| Revenue treatment | None | Deferred, recognized over term |
| Reserve basis | Estimated costs | Deferred revenue less costs |
| FORAY pattern | DEFERRED_SETTLEMENT | FULL_LIFECYCLE |

### 2.4 Recall Reserves

Product recalls create additional warranty-like liabilities requiring:

- Campaign cost estimation
- Remediation tracking
- Regulatory notification records

**FORAY Pattern:** `RECOGNITION_ONLY` (when recall announced) â†’ `FULL_LIFECYCLE` (as remediation proceeds)

---

## 3. FORAY Component Mapping for Warranties

### 3.1 Component Roles

| Component | Warranty Role | Examples |
|-----------|--------------|----------|
| **Arrangement** | Contractual warranty terms | Product sale, extended warranty contract, service agreement |
| **Accrual** | Formula-based calculations | Reserve estimation, revenue allocation, cost recognition |
| **Anticipation** | Expected future flows | Projected claims, scheduled revenue recognition |
| **Action** | Actual settlements | Claim payments, part replacements, refunds |

### 3.2 Accrual Computation Methods

Warranty-related accruals typically use three computation methods:

**Calculated** - Mathematical formula with fixed inputs
```
Reserve = Units_Sold Ã— Claim_Rate Ã— Avg_Claim_Cost
```

**Valuation** - Oracle-based estimate requiring judgment
```
Reserve = Actuarial_Model_Output(historical_claims, product_age, usage_patterns)
```

**Amortization** - Time-based recognition
```
Monthly_Revenue = Total_Premium Ã— (Days_Elapsed / Total_Days)
```

### 3.3 Dependency Flow

```
PRODUCT SALE
     â”‚
     â–¼
ARR_PRODUCT_SALE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
     â”‚                                                  â”‚
     â–¼                                                  â”‚
ARR_WARRANTY_TERMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
     â”‚                                               â”‚  â”‚
     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”           â”‚  â”‚
     â–¼                                  â–¼           â”‚  â”‚
ACC_WARRANTY_RESERVE        ACC_REVENUE_ALLOCATION  â”‚  â”‚
     â”‚                              â”‚               â”‚  â”‚
     â–¼                              â–¼               â”‚  â”‚
ANT_EXPECTED_CLAIMS         ANT_REVENUE_RECOGNITION â”‚  â”‚
     â”‚                              â”‚               â”‚  â”‚
     â–¼                              â–¼               â”‚  â”‚
ACT_CLAIM_PAYMENT           ACT_REVENUE_RELEASE â”€â”€â”€â”€â”˜  â”‚
                                                        â”‚
ACT_WARRANTY_EXPIRATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 3.4 Many-to-Many Relationships (v4.1)

Warranty scenarios often involve many-to-many relationships:

- One warranty arrangement covering multiple products
- One claim payment resolving multiple anticipations
- One reserve accrual feeding multiple monthly anticipations

FORAY v4.1's `_refs[]` arrays support these naturally:

```json
{
  "id": "ACT_BATCH_CLAIM_SETTLEMENT",
  "foray_core": {
    "anticipation_refs": ["ANT_CLAIM_001", "ANT_CLAIM_002", "ANT_CLAIM_003"],
    "arrangement_refs": ["ARR_WARRANTY_POLICY_2026"],
    "type": "warranty_claim_batch",
    "amount_settled": 4750.00,
    "allocations": [
      { "ref": "ANT_CLAIM_001", "ref_type": "anticipation", "amount": 1500.00 },
      { "ref": "ANT_CLAIM_002", "ref_type": "anticipation", "amount": 2100.00 },
      { "ref": "ANT_CLAIM_003", "ref_type": "anticipation", "amount": 1150.00 }
    ]
  }
}
```

---

## 4. Industry-Specific Implementations

### 4.1 Consumer Electronics

**Scenario:** Smartphone manufacturer with 12-month standard warranty, optional 24-month extended warranty

**Key Characteristics:**
- High volume, low individual claim value
- Statistical estimation based on failure curves
- Bathtub failure distribution (early failures, steady state, wear-out)
- Global service network with regional cost variations

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangement: (Manufacturer â†’ Consumer, Product Sale + Warranty)
2. Accruals:
   - Standard warranty reserve (Calculated: units Ã— failure_rate Ã— avg_cost)
   - Extended warranty revenue allocation (Calculated: SSP methodology)
   - Extended warranty cost accrual (Calculated: expected_claims Ã— cost_factor)
3. Anticipations:
   - Year 1 claims (monthly estimates)
   - Year 2 claims (extended warranty)
   - Revenue recognition schedule (monthly)
4. Actions:
   - Individual claim settlements (repair, replace, refund)
   - Monthly reserve true-ups
   - Revenue releases
```

**Privacy Requirements:**
- Failure rate curves: Salted formula hashes
- Regional cost data: Encrypted
- Claim patterns: Aggregated only

### 4.2 Automotive

**Scenario:** Vehicle manufacturer with 3-year/36,000-mile basic warranty, 5-year/60,000-mile powertrain warranty

**Key Characteristics:**
- Complex multi-tier warranty structure
- Warranty tied to specific VIN
- Dealer network as service providers
- Recall integration
- Regulatory requirements (NHTSA reporting)

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_VEHICLE_SALE (VIN-specific)
   - ARR_BASIC_WARRANTY (3yr/36K)
   - ARR_POWERTRAIN_WARRANTY (5yr/60K)
   - ARR_DEALER_SERVICE_AGREEMENT
2. Accruals:
   - Per-vehicle reserve (Calculated: vehicle_class Ã— base_rate)
   - Campaign reserve (Valuation: engineering_estimate)
   - Dealer labor rates (FixedAmount: negotiated rates)
   - Parts cost allocation (Calculated: BOM Ã— markup)
3. Anticipations:
   - Monthly claim run rate by vehicle age
   - Campaign cost projections
   - Dealer reimbursement schedules
4. Actions:
   - Dealer claim submissions
   - Claims adjudication decisions
   - Dealer payments
   - Campaign remediation completions
```

**Compliance Integration:**
- VIN-level tracking for NHTSA Early Warning Reporting
- Campaign completeness tracking
- Customer notification records

### 4.3 Aerospace/Defense

**Scenario:** Aircraft component manufacturer with 10-year warranty and maintenance support

**Key Characteristics:**
- Long warranty periods (10-20 years)
- High individual part value
- Stringent traceability requirements (FAA, EASA)
- Spares provisioning obligations
- Performance guarantees

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_COMPONENT_SALE (part number, serial number)
   - ARR_WARRANTY_AGREEMENT (10-year terms)
   - ARR_SPARES_SUPPORT (provisioning commitment)
2. Accruals:
   - Component warranty reserve (Valuation: MTBF analysis)
   - Spares pool valuation (Valuation: demand forecast)
   - Performance guarantee reserve (Calculated: penalty_exposure Ã— prob)
3. Anticipations:
   - Scheduled maintenance intervals
   - Expected component replacements
   - Performance milestone reviews
4. Actions:
   - AOG (Aircraft on Ground) emergency repairs
   - Scheduled replacements
   - Performance penalty payments
   - Warranty extensions (goodwill)
```

**Privacy Requirements:**
- MTBF data: Highly confidential (competitive intelligence)
- Failure modes: Encrypted with need-to-know access
- Customer fleet data: Salted to prevent aggregation

### 4.4 Software/SaaS

**Scenario:** Enterprise software vendor with limited warranty and service level agreements (SLAs)

**Key Characteristics:**
- Warranty often limited to "material defects"
- SLA credits as warranty-like obligations
- No physical repair costs; primarily labor
- Patch/update obligations

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_LICENSE_AGREEMENT (perpetual or subscription)
   - ARR_SLA_TERMS (uptime guarantees)
   - ARR_SUPPORT_AGREEMENT (maintenance terms)
2. Accruals:
   - SLA credit reserve (Calculated: revenue Ã— credit_rate Ã— prob_breach)
   - Bug fix cost accrual (Calculated: estimated_hours Ã— loaded_rate)
   - Support cost allocation (Amortization: over support period)
3. Anticipations:
   - Monthly SLA measurement periods
   - Patch release schedules
   - Support renewal dates
4. Actions:
   - SLA credit issuances
   - Patch deployments (cost recognition)
   - Support incident resolutions
```

### 4.5 Medical Devices

**Scenario:** Surgical equipment manufacturer with 2-year warranty and regulatory compliance requirements

**Key Characteristics:**
- FDA/CE marking compliance
- Adverse event reporting requirements
- Product traceability (UDI)
- Sterility and calibration requirements

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_DEVICE_SALE (UDI-linked)
   - ARR_WARRANTY_TERMS (2-year standard)
   - ARR_SERVICE_CONTRACT (optional extended)
2. Accruals:
   - Warranty reserve (Calculated: device_class Ã— historical_rate)
   - Calibration service cost (FixedAmount: per_service_cost)
   - Adverse event reserve (Valuation: risk_assessment)
3. Anticipations:
   - Scheduled calibration services
   - Expected repair/replacement
   - Regulatory inspection responses
4. Actions:
   - Field service visits
   - Device replacements
   - MDR (Medical Device Report) filings
```

**Compliance Integration:**
- UDI tracking for FDA GUDID
- Complaint-to-warranty linkage
- CAPA (Corrective and Preventive Action) correlation

### 4.6 Industrial Equipment

**Scenario:** Manufacturing equipment vendor with tiered warranty and performance guarantees

**Key Characteristics:**
- Commissioning-based warranty start
- Performance-based warranty terms
- Extended service contracts common
- Parts and labor split

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_EQUIPMENT_SALE (machine configuration)
   - ARR_INSTALLATION_SERVICES
   - ARR_WARRANTY_TERMS (starts at commissioning)
   - ARR_PERFORMANCE_GUARANTEE (output specifications)
2. Accruals:
   - Equipment warranty reserve (Calculated: price Ã— reserve_rate)
   - Performance shortfall reserve (Valuation: engineering_assessment)
   - Installation cost allocation
3. Anticipations:
   - Commissioning completion (warranty trigger)
   - Scheduled PM visits
   - Performance milestone tests
4. Actions:
   - Installation completion
   - Warranty start confirmation
   - Service visits
   - Performance remedy payments
```

### 4.7 Retail/E-commerce

**Scenario:** Multi-brand retailer with manufacturer warranties and optional retailer protection plans

**Key Characteristics:**
- Pass-through manufacturer warranties
- Retailer-branded extended protection
- High return/exchange volume
- Third-party warranty administrators

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_PRODUCT_SALE (SKU, brand)
   - ARR_MFG_WARRANTY_PASSTHROUGH
   - ARR_PROTECTION_PLAN (retailer-sold)
   - ARR_TPA_AGREEMENT (third-party administrator)
2. Accruals:
   - Protection plan revenue allocation
   - Claims reserve (Calculated: premium Ã— loss_ratio)
   - TPA fee accrual
3. Anticipations:
   - Monthly revenue recognition
   - Expected claims by product category
   - TPA settlement periods
4. Actions:
   - Customer claims
   - TPA reimbursements
   - Protection plan cancellations/refunds
```

### 4.8 Construction/Heavy Equipment

**Scenario:** Heavy machinery dealer with manufacturer warranty, dealer prep warranty, and extended service agreements

**Key Characteristics:**
- Multi-party warranty structure (OEM, dealer, rental fleet)
- Hours-based and time-based coverage
- Component-specific coverage tiers
- Telematics integration for usage tracking

**FORAY Implementation:**

```
Transaction Flow:
1. Arrangements:
   - ARR_EQUIPMENT_SALE (serial number, configuration)
   - ARR_OEM_WARRANTY (component-specific terms)
   - ARR_DEALER_WARRANTY (PDI coverage)
   - ARR_ESA (Extended Service Agreement)
2. Accruals:
   - OEM warranty reserve (passthrough)
   - Dealer warranty reserve (Calculated: unit Ã— dealer_rate)
   - ESA revenue allocation (Amortization: hours or time)
3. Anticipations:
   - Scheduled service intervals (250hr, 500hr, etc.)
   - Expected component failures by hours
   - ESA revenue recognition schedule
4. Actions:
   - Warranty claims (OEM reimbursement)
   - Dealer service completions
   - ESA renewals
```

---

## 5. Privacy Considerations

### 5.1 Warranty Data Sensitivity

Warranty data contains competitively sensitive information:

| Data Element | Sensitivity | Privacy Mechanism |
|-------------|-------------|-------------------|
| Failure rates | HIGH | Formula hashing + salting |
| Cost per claim | HIGH | Encrypted in audit_data |
| Actuarial models | CRITICAL | Private salted formulas |
| Customer claim history | MEDIUM | Identifier hashing |
| Supplier defect data | HIGH | Compartmentalized access |

### 5.2 FORAY Privacy Architecture for Warranties

**Layer 1: Identifier Hashing**
- Customer IDs â†’ SHA-256 hashes
- Serial numbers â†’ Salted hashes (prevent rainbow tables)
- VINs â†’ Industry-standard masking + hash

**Layer 2: Formula Commitments**
- Reserve formulas â†’ `sha256:warranty_reserve_model_v2.3...`
- Rate tables â†’ Encrypted lookup references
- Actuarial assumptions â†’ Hashed parameter sets

**Layer 3: Instance Pooling**
- Batch claims aggregated before anchoring
- Individual claim details in private audit_data
- Pool statistics only on-chain

### 5.3 Auditor Access Model

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    AUDITORS                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Can See:                                           â”‚
â”‚  - Transaction hashes (verify immutability)         â”‚
â”‚  - Reserve totals (verify completeness)             â”‚
â”‚  - Claim counts (verify reasonableness)             â”‚
â”‚  - Formula structure (verify methodology)           â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Cannot See (without explicit disclosure):          â”‚
â”‚  - Failure rate percentages                         â”‚
â”‚  - Cost-per-claim by product                        â”‚
â”‚  - Competitor benchmarking data                     â”‚
â”‚  - Supplier-specific defect rates                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 6. Sample Transactions

### 6.1 Consumer Electronics - Product Sale with Standard Warranty

```json
{
  "transaction_id": "CE_2026_Q1_SMARTPHONE_SALE_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-15T10:30:00Z",

  "foray_core": {
    "entity": "TechDevice Inc.",
    "entity_hash": "sha256:abc123...",
    "transaction_type": "product_sale_warranty",
    "total_value": 999.00,
    "currency": "USD",
    "status": "active",
    "compliance_flags": ["ASC_606", "ASC_450"]
  },

  "arrangements": [
    {
      "id": "ARR_PRODUCT_SALE_001",
      "foray_core": {
        "type": "product_sale",
        "effective_date": "2026-01-15T10:30:00Z",
        "parties": [
          { "role": "seller", "name": "TechDevice Inc.", "party_id_hash": "sha256:..." },
          { "role": "buyer", "name": "Customer", "party_id_hash": "sha256:..." }
        ],
        "description": "Galaxy Pro Max smartphone sale",
        "total_value": 999.00,
        "currency": "USD",
        "terms": {
          "product_sku": "GPM-256-BLK",
          "serial_number_hash": "sha256:sn123...",
          "warranty_included": true
        },
        "dependencies": []
      }
    },
    {
      "id": "ARR_WARRANTY_TERMS_001",
      "foray_core": {
        "type": "standard_product_warranty",
        "effective_date": "2026-01-15T10:30:00Z",
        "parties": [
          { "role": "warrantor", "name": "TechDevice Inc.", "party_id_hash": "sha256:..." },
          { "role": "beneficiary", "name": "Customer", "party_id_hash": "sha256:..." }
        ],
        "description": "12-month limited warranty - manufacturing defects",
        "total_value": 0,
        "currency": "USD",
        "terms": {
          "warranty_type": "assurance",
          "duration_months": 12,
          "coverage": "manufacturing_defects",
          "exclusions": ["physical_damage", "water_damage", "unauthorized_modification"],
          "remedy": "repair_or_replace"
        },
        "dependencies": ["ARR_PRODUCT_SALE_001"]
      }
    }
  ],

  "accruals": [
    {
      "id": "ACC_WARRANTY_RESERVE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_WARRANTY_TERMS_001"],
        "type": "warranty_reserve",
        "description": "Warranty reserve accrual at point of sale",
        "computation_method": "Calculated",
        "formula_id": "sha256:warranty_reserve_v3.2...",
        "inputs": {
          "product_class": "smartphone_flagship",
          "historical_claim_rate": "ENCRYPTED:...",
          "avg_claim_cost": "ENCRYPTED:...",
          "reserve_factor": 1.0
        },
        "output": 35.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "5400-Warranty Expense", "amount": 35.00 },
          "credit": { "account": "2350-Warranty Reserve", "amount": 35.00 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
        "dependencies": ["ARR_WARRANTY_TERMS_001"]
      }
    }
  ],

  "anticipations": [
    {
      "id": "ANT_EXPECTED_CLAIMS_Y1_001",
      "foray_core": {
        "accrual_refs": ["ACC_WARRANTY_RESERVE_001"],
        "arrangement_refs": ["ARR_WARRANTY_TERMS_001"],
        "type": "expected_warranty_claims",
        "description": "Expected claims during 12-month warranty period",
        "expected_amount": 35.00,
        "currency": "USD",
        "expected_date": "2027-01-15",
        "probability_factor": 0.85,
        "assumptions": {
          "claim_distribution": "bathtub_curve",
          "peak_period_months": "2-4"
        },
        "dependencies": ["ACC_WARRANTY_RESERVE_001"]
      }
    },
    {
      "id": "ANT_WARRANTY_EXPIRATION_001",
      "foray_core": {
        "accrual_refs": [],
        "arrangement_refs": ["ARR_WARRANTY_TERMS_001"],
        "type": "warranty_expiration",
        "description": "Warranty period end - reserve release if unused",
        "expected_amount": 0,
        "currency": "USD",
        "expected_date": "2027-01-15T10:30:00Z",
        "probability_factor": 1.0,
        "dependencies": ["ARR_WARRANTY_TERMS_001"]
      }
    }
  ],

  "actions": [],

  "merkle_root": "sha256:merkle_root_001...",

  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 12345678,
    "confirmation_time_ms": 850,
    "anchored_at": "2026-01-15T10:30:05Z"
  },

  "privacy_metadata": {
    "formulas_obfuscated": 1,
    "instance_pools": 0,
    "attack_complexity": "2^96 operations"
  }
}
```

### 6.2 Automotive - Vehicle Sale with Multi-Tier Warranty and Claim

```json
{
  "transaction_id": "AUTO_2026_Q1_VIN_SALE_CLAIM_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-20T14:00:00Z",

  "foray_core": {
    "entity": "Premier Motors Corp",
    "entity_hash": "sha256:def456...",
    "transaction_type": "vehicle_warranty_lifecycle",
    "total_value": 45000.00,
    "currency": "USD",
    "status": "active",
    "compliance_flags": ["ASC_606", "ASC_450", "NHTSA_EWR"]
  },

  "arrangements": [
    {
      "id": "ARR_VEHICLE_SALE_001",
      "foray_core": {
        "type": "vehicle_sale",
        "effective_date": "2026-01-20T14:00:00Z",
        "parties": [
          { "role": "manufacturer", "name": "Premier Motors Corp", "party_id_hash": "sha256:..." },
          { "role": "dealer", "name": "Metro Auto Group", "party_id_hash": "sha256:..." },
          { "role": "buyer", "name": "Customer", "party_id_hash": "sha256:..." }
        ],
        "description": "2026 Premier Sedan XLE sale",
        "total_value": 45000.00,
        "currency": "USD",
        "terms": {
          "vin_hash": "sha256:vin_masked...",
          "model_year": 2026,
          "model_code": "SEDAN-XLE",
          "odometer_at_sale": 12
        },
        "dependencies": []
      }
    },
    {
      "id": "ARR_BASIC_WARRANTY_001",
      "foray_core": {
        "type": "vehicle_basic_warranty",
        "effective_date": "2026-01-20T14:00:00Z",
        "parties": [
          { "role": "warrantor", "name": "Premier Motors Corp", "party_id_hash": "sha256:..." },
          { "role": "beneficiary", "name": "Customer", "party_id_hash": "sha256:..." }
        ],
        "description": "3-year/36,000-mile bumper-to-bumper warranty",
        "total_value": 0,
        "currency": "USD",
        "terms": {
          "warranty_type": "assurance",
          "duration_months": 36,
          "mileage_limit": 36000,
          "coverage": "comprehensive_less_wear",
          "deductible": 0
        },
        "dependencies": ["ARR_VEHICLE_SALE_001"]
      }
    },
    {
      "id": "ARR_POWERTRAIN_WARRANTY_001",
      "foray_core": {
        "type": "vehicle_powertrain_warranty",
        "effective_date": "2026-01-20T14:00:00Z",
        "parties": [
          { "role": "warrantor", "name": "Premier Motors Corp", "party_id_hash": "sha256:..." },
          { "role": "beneficiary", "name": "Customer", "party_id_hash": "sha256:..." }
        ],
        "description": "5-year/60,000-mile powertrain warranty",
        "total_value": 0,
        "currency": "USD",
        "terms": {
          "warranty_type": "assurance",
          "duration_months": 60,
          "mileage_limit": 60000,
          "coverage": "engine_transmission_drivetrain",
          "deductible": 0
        },
        "dependencies": ["ARR_VEHICLE_SALE_001"]
      }
    },
    {
      "id": "ARR_DEALER_SERVICE_001",
      "foray_core": {
        "type": "dealer_service_agreement",
        "effective_date": "2024-01-01T00:00:00Z",
        "parties": [
          { "role": "manufacturer", "name": "Premier Motors Corp", "party_id_hash": "sha256:..." },
          { "role": "dealer", "name": "Metro Auto Group", "party_id_hash": "sha256:..." }
        ],
        "description": "Authorized dealer warranty service agreement",
        "total_value": 0,
        "currency": "USD",
        "terms": {
          "labor_rate": "ENCRYPTED:...",
          "parts_markup": "ENCRYPTED:...",
          "claim_submission_days": 30
        },
        "dependencies": []
      }
    }
  ],

  "accruals": [
    {
      "id": "ACC_BASIC_WARRANTY_RESERVE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_BASIC_WARRANTY_001"],
        "type": "warranty_reserve",
        "description": "Basic warranty reserve - 3yr/36K coverage",
        "computation_method": "Calculated",
        "formula_id": "sha256:auto_warranty_reserve_v4.1...",
        "inputs": {
          "vehicle_class": "midsize_sedan",
          "model_year": 2026,
          "coverage_type": "basic",
          "historical_cpv": "ENCRYPTED:..."
        },
        "output": 850.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "5400-Warranty Expense", "amount": 850.00 },
          "credit": { "account": "2350-Warranty Reserve", "amount": 850.00 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
        "dependencies": ["ARR_BASIC_WARRANTY_001"]
      }
    },
    {
      "id": "ACC_POWERTRAIN_WARRANTY_RESERVE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_POWERTRAIN_WARRANTY_001"],
        "type": "warranty_reserve",
        "description": "Powertrain warranty reserve - 5yr/60K coverage",
        "computation_method": "Calculated",
        "formula_id": "sha256:auto_warranty_reserve_v4.1...",
        "inputs": {
          "vehicle_class": "midsize_sedan",
          "model_year": 2026,
          "coverage_type": "powertrain",
          "historical_cpv": "ENCRYPTED:..."
        },
        "output": 320.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "5400-Warranty Expense", "amount": 320.00 },
          "credit": { "account": "2350-Warranty Reserve", "amount": 320.00 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
        "dependencies": ["ARR_POWERTRAIN_WARRANTY_001"]
      }
    },
    {
      "id": "ACC_CLAIM_COST_001",
      "foray_core": {
        "arrangement_refs": ["ARR_BASIC_WARRANTY_001", "ARR_DEALER_SERVICE_001"],
        "type": "warranty_claim_cost",
        "description": "Infotainment system replacement under warranty",
        "computation_method": "Calculated",
        "formula_id": "sha256:dealer_claim_calc_v2.0...",
        "inputs": {
          "part_number": "INF-MOD-2026",
          "part_cost": 425.00,
          "labor_hours": 1.5,
          "labor_rate": "ENCRYPTED:..."
        },
        "output": 575.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "2350-Warranty Reserve", "amount": 575.00 },
          "credit": { "account": "2100-Accounts Payable", "amount": 575.00 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 3 },
        "dependencies": ["ARR_BASIC_WARRANTY_001"]
      }
    }
  ],

  "anticipations": [
    {
      "id": "ANT_BASIC_CLAIMS_Y1",
      "foray_core": {
        "accrual_refs": ["ACC_BASIC_WARRANTY_RESERVE_001"],
        "arrangement_refs": ["ARR_BASIC_WARRANTY_001"],
        "type": "expected_warranty_claims",
        "description": "Expected basic warranty claims - Year 1",
        "expected_amount": 400.00,
        "currency": "USD",
        "expected_date": "2027-01-20",
        "probability_factor": 0.90,
        "dependencies": ["ACC_BASIC_WARRANTY_RESERVE_001"]
      }
    },
    {
      "id": "ANT_CLAIM_001",
      "foray_core": {
        "accrual_refs": ["ACC_CLAIM_COST_001"],
        "arrangement_refs": ["ARR_BASIC_WARRANTY_001"],
        "type": "warranty_claim_pending",
        "description": "Infotainment replacement claim - pending dealer payment",
        "expected_amount": 575.00,
        "currency": "USD",
        "expected_date": "2026-04-15",
        "probability_factor": 1.0,
        "claim_details": {
          "repair_order": "RO-2026-0892",
          "failure_code": "INF-BLANK-001",
          "odometer": 2450
        },
        "dependencies": ["ACC_CLAIM_COST_001"]
      }
    }
  ],

  "actions": [
    {
      "id": "ACT_CLAIM_PAYMENT_001",
      "foray_core": {
        "anticipation_refs": ["ANT_CLAIM_001"],
        "accrual_refs": ["ACC_CLAIM_COST_001"],
        "arrangement_refs": ["ARR_DEALER_SERVICE_001"],
        "type": "warranty_claim_payment",
        "description": "Dealer reimbursement for warranty claim RO-2026-0892",
        "amount_settled": 575.00,
        "currency": "USD",
        "settlement_date": "2026-04-10T09:00:00Z",
        "settlement_status": "completed",
        "payment_method": "ach",
        "counterparty": "Metro Auto Group",
        "allocations": [
          { "ref": "ANT_CLAIM_001", "ref_type": "anticipation", "amount": 575.00, "allocation_type": "full" }
        ],
        "details": {
          "claim_number": "WC-2026-0089234",
          "payment_reference": "ACH-20260410-8923"
        },
        "dependencies": ["ANT_CLAIM_001"]
      }
    }
  ],

  "merkle_root": "sha256:merkle_auto_001..."
}
```

### 6.3 Extended Warranty - Service Contract with Deferred Revenue

```json
{
  "transaction_id": "EW_2026_Q1_APPLIANCE_ESP_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-25T11:00:00Z",

  "foray_core": {
    "entity": "HomeGuard Protection Services",
    "entity_hash": "sha256:ghi789...",
    "transaction_type": "extended_service_plan",
    "total_value": 199.00,
    "currency": "USD",
    "status": "active",
    "compliance_flags": ["ASC_606", "State_Warranty_Regs"]
  },

  "arrangements": [
    {
      "id": "ARR_ESP_CONTRACT_001",
      "foray_core": {
        "type": "extended_service_plan",
        "effective_date": "2027-01-25T00:00:00Z",
        "parties": [
          { "role": "administrator", "name": "HomeGuard Protection Services", "party_id_hash": "sha256:..." },
          { "role": "obligor", "name": "Warranty Underwriters Inc", "party_id_hash": "sha256:..." },
          { "role": "customer", "name": "Consumer", "party_id_hash": "sha256:..." }
        ],
        "description": "3-year extended protection plan - refrigerator",
        "total_value": 199.00,
        "currency": "USD",
        "terms": {
          "product_category": "major_appliance",
          "product_sku": "REF-SS-36CF",
          "coverage_start": "2027-01-25",
          "coverage_end": "2030-01-25",
          "coverage_type": "mechanical_electrical_failure",
          "deductible": 50.00,
          "claim_limit": 2500.00,
          "no_lemon_threshold": 3
        },
        "dependencies": []
      }
    }
  ],

  "accruals": [
    {
      "id": "ACC_DEFERRED_REVENUE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_ESP_CONTRACT_001"],
        "type": "deferred_revenue_initial",
        "description": "ESP premium received - deferred until coverage start",
        "computation_method": "FixedAmount",
        "formula_id": "sha256:esp_revenue_defer...",
        "inputs": {
          "premium_received": 199.00,
          "coverage_start": "2027-01-25"
        },
        "output": 199.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "1100-Cash", "amount": 199.00 },
          "credit": { "account": "2400-Deferred Revenue", "amount": 199.00 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
        "dependencies": ["ARR_ESP_CONTRACT_001"]
      }
    },
    {
      "id": "ACC_CLAIMS_RESERVE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_ESP_CONTRACT_001"],
        "type": "claims_reserve_initial",
        "description": "Expected claims reserve - 36-month coverage",
        "computation_method": "Calculated",
        "formula_id": "sha256:esp_claims_reserve_v2.1...",
        "inputs": {
          "product_category": "major_appliance",
          "coverage_months": 36,
          "premium": 199.00,
          "loss_ratio_target": "ENCRYPTED:..."
        },
        "output": 119.40,
        "currency": "USD",
        "accounting_entry": {
          "debit": { "account": "5500-Claims Expense", "amount": 119.40 },
          "credit": { "account": "2360-Claims Reserve", "amount": 119.40 }
        },
        "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
        "dependencies": ["ARR_ESP_CONTRACT_001"]
      }
    }
  ],

  "anticipations": [
    {
      "id": "ANT_REVENUE_RECOGNITION_M1",
      "foray_core": {
        "accrual_refs": ["ACC_DEFERRED_REVENUE_001"],
        "arrangement_refs": ["ARR_ESP_CONTRACT_001"],
        "type": "scheduled_revenue_recognition",
        "description": "Month 1 revenue recognition - straight-line",
        "expected_amount": 5.53,
        "currency": "USD",
        "expected_date": "2027-02-25",
        "probability_factor": 1.0,
        "recognition_method": "straight_line",
        "period": { "month": 1, "of": 36 },
        "dependencies": ["ACC_DEFERRED_REVENUE_001"]
      }
    },
    {
      "id": "ANT_EXPECTED_CLAIMS_Y1",
      "foray_core": {
        "accrual_refs": ["ACC_CLAIMS_RESERVE_001"],
        "arrangement_refs": ["ARR_ESP_CONTRACT_001"],
        "type": "expected_claims",
        "description": "Expected claims - Year 1 of coverage",
        "expected_amount": 35.00,
        "currency": "USD",
        "expected_date": "2028-01-25",
        "probability_factor": 0.75,
        "dependencies": ["ACC_CLAIMS_RESERVE_001"]
      }
    }
  ],

  "actions": [],

  "merkle_root": "sha256:merkle_esp_001..."
}
```

---

## 7. Integration Patterns

### 7.1 ERP Integration Points

| ERP System | Warranty Module | FORAY Integration Point |
|------------|-----------------|------------------------|
| SAP | SD (Sales), CS (Service), QM (Quality) | IDoc extraction â†’ FORAY adapter |
| Oracle EBS | Install Base, Service Contracts | API extraction â†’ FORAY adapter |
| Microsoft D365 | Service Management | Dataverse events â†’ FORAY adapter |
| NetSuite | Case Management, Item Records | SuiteScript â†’ FORAY API |
| QuickBooks | Estimates, Sales Orders | Custom fields â†’ FORAY adapter |
| Salesforce | Service Cloud, Entitlements | Apex triggers â†’ FORAY API |

### 7.2 Warranty Event Triggers

| Event | FORAY Transaction Generated |
|-------|----------------------------|
| Product sale completed | Arrangement + Reserve Accrual + Anticipations |
| ESP purchase | Arrangement + Deferred Revenue Accrual |
| Warranty claim opened | Anticipation (pending) |
| Claim approved | Accrual (cost) |
| Claim payment | Action (settlement) |
| Warranty expired | Action (reserve release or true-up) |
| Recall announced | Arrangement + Reserve Accrual |

### 7.3 Batch Processing Patterns

For high-volume warranty operations:

```
Daily Batch Jobs:
â”œâ”€â”€ Reserve True-Up Job
â”‚   â”œâ”€â”€ Pull month-to-date claims
â”‚   â”œâ”€â”€ Recalculate reserve adequacy
â”‚   â””â”€â”€ Generate adjustment accruals
â”‚
â”œâ”€â”€ Revenue Recognition Job (ESP)
â”‚   â”œâ”€â”€ Identify contracts in coverage period
â”‚   â”œâ”€â”€ Calculate daily/monthly recognition
â”‚   â””â”€â”€ Generate revenue release actions
â”‚
â””â”€â”€ Claims Settlement Job
    â”œâ”€â”€ Pull approved claims
    â”œâ”€â”€ Generate payment actions
    â””â”€â”€ Anchor batch to blockchain
```

### 7.4 Real-Time vs. Batch Anchoring

| Scenario | Anchoring Strategy |
|----------|-------------------|
| Individual high-value claims | Real-time (immediate anchoring) |
| Routine daily claims | Batch (end-of-day) |
| Reserve adjustments | Batch (month-end) |
| ESP revenue recognition | Batch (daily or monthly) |
| Recall announcements | Real-time (regulatory timing) |

---

## 8. Regulatory Compliance

### 8.1 US GAAP (ASC 450, ASC 460, ASC 606)

| Standard | Requirement | FORAY Support |
|----------|-------------|---------------|
| ASC 450-20 | Accrue when probable and estimable | Formula-based reserve accruals |
| ASC 460-10 | Disclose guarantor obligations | Arrangement terms capture |
| ASC 606-10-25 | Identify performance obligations | Separate arrangements for ESP |
| ASC 606-10-32 | Allocate transaction price | SSP allocation accruals |

### 8.2 IFRS (IAS 37, IFRS 15)

| Standard | Requirement | FORAY Support |
|----------|-------------|---------------|
| IAS 37.14 | Recognize provisions when obligated | Arrangement establishes obligation |
| IAS 37.36 | Best estimate of expenditure | Valuation-type accruals |
| IFRS 15.22 | Identify distinct goods/services | Separate ESP arrangements |
| IFRS 15.79 | Disclose contract balances | Anticipation tracking |

### 8.3 Industry-Specific Regulations

| Industry | Regulation | FORAY Support |
|----------|------------|---------------|
| Automotive | NHTSA Early Warning Reporting | Claim linkage to VIN arrangements |
| Medical Devices | FDA MDR (21 CFR 803) | UDI-linked claim tracking |
| Aerospace | FAA AD Compliance | Serial-number provenance |
| Consumer Products | Magnuson-Moss Warranty Act | Warranty terms in arrangements |
| Insurance (ESP) | State warranty regulations | Obligor/administrator separation |

---

## Appendix A: Accrual Computation Method Reference

| Method | Use Case | Formula Structure |
|--------|----------|-------------------|
| **Calculated** | Deterministic formulas | `output = f(inputs)` |
| **Valuation** | Expert judgment, oracles | `output = Oracle(model, inputs)` |
| **Amortization** | Time-based recognition | `output = total Ã— (elapsed / total_period)` |
| **FixedAmount** | Contractual fixed costs | `output = contracted_amount` |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Assurance Warranty** | Promise that product meets specifications (not separate performance obligation) |
| **Service Warranty** | Additional service beyond defect repair (separate performance obligation) |
| **ESP** | Extended Service Plan - separately purchased coverage |
| **CPV** | Cost Per Vehicle - automotive warranty metric |
| **Loss Ratio** | Claims paid / Premium earned (ESP profitability metric) |
| **Bathtub Curve** | Failure rate pattern: early failures â†’ steady state â†’ wear-out |
| **MTBF** | Mean Time Between Failures |
| **TPA** | Third-Party Administrator (warranty claims processing) |

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

## Disclaimer

> **DISCLAIMER:** This document describes FORAY Protocol implementation patterns for warranty transactions as of January 2026. All accounting treatment examples are illustrative and do not constitute professional accounting advice. Organizations should consult qualified accountants and auditors for specific compliance requirements. The sample transactions are hypothetical and do not represent actual business operations.

---

**END OF FORAY WARRANTY GUIDE v1.0**
