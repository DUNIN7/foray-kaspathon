name: foray
description: Generate FORAY Protocol v4.1 transaction JSON from natural language descriptions. Use when user describes a business transaction and needs a structured FORAY JSON output for blockchain audit trails. Triggers on "FORAY transaction", "create FORAY JSON", "audit trail transaction", enterprise transactions (payroll, derivatives, securitizations, manufacturing, supply chain, energy), or requests to convert transaction descriptions to FORAY format.

# FORAY Protocol Skill v4.1

Convert natural language transaction descriptions into valid FORAY Protocol JSON with the 4-component structure, privacy metadata, and Kaspa blockchain anchoring.

## Core Principles

### Source System Trust
**FORAY trusts the source system.** Transactions arriving at FORAY have already been validated by robust, tested enterprise systems (SAP, Oracle, QuickBooks, Salesforce, trading platforms). FORAY's role is to **anchor and protect** validated data, not to second-guess it.

### FORAY's Role
| Do | Don't |
| Anchor validated data to blockchain | Duplicate ERP validation |
| Enable cryptographic verification | Second-guess source systems |
| Provide immutable audit trail | Add validation latency |

## The 4-Component Model

Every FORAY transaction decomposes into:

| Component | Purpose | Contains |
| **Arrangements** | Contractual setup | Parties, terms, effective dates, legal docs |
| **Accruals** | Calculation logic | Formulas, valuations, computed amounts |
| **Anticipations** | Expected future flows | Forecasts, conditions, scheduled payments |
| **Actions** | Executed settlements | Actual amounts, completion dates, status |

**Key Distinction:** 
- **Accruals** = HOW amounts are computed (formulas, rates, inputs -> outputs)
- **Anticipations** = WHAT we expect to receive/pay in the future

**Dependency Chain:** Components can reference upstream components via `_refs[]` arrays (many-to-many relationships supported in v4.1).

## v4.1 Key Features

1. **Flexible Entry Points** - Any component type can be the transaction root (Arrangements no longer required)
2. **Many-to-Many References** - Use `_refs[]` arrays instead of singular `_ref` fields
3. **Allocations Tracking** - Actions can specify how settlements map to multiple references

## JSON Structure Template (v4.1)

```json
{
  "transaction_id": "DOMAIN_YYYY_QN_DESCRIPTOR",
  "schema_version": "4.1",
  "timestamp": "ISO-8601 datetime",

  "foray_core": {
    "entity": "Primary entity name",
    "entity_hash": "sha256:...",
    "transaction_type": "snake_case_type",
    "total_value": 0.00,
    "currency": "USD",
    "status": "active|completed|reversed",
    "compliance_flags": ["SOX_404", "DCAA", "..."]
  },

  "component_hashes": {
    "arrangements": "sha256:...",
    "accruals": "sha256:...",
    "anticipations": "sha256:...",
    "actions": "sha256:..."
  },

  "arrangements": [
    {
      "id": "ARR_DESCRIPTIVE_ID",
      "foray_core": {
        "type": "arrangement_type",
        "effective_date": "ISO-8601",
        "parties": [
          {"role": "party_role", "name": "Party Name", "jurisdiction": "US"}
        ],
        "description": "Clear description",
        "total_value": 0.00,
        "currency": "USD",
        "terms": { },
        "legal_documentation": [],
        "dependencies": []
      }
    }
  ],

  "accruals": [
    {
      "id": "ACC_DESCRIPTIVE_ID",
      "foray_core": {
        "arrangement_refs": ["ARR_DESCRIPTIVE_ID"],
        "type": "accrual_type",
        "description": "Accrual description",
        "computation_method": "Calculated|Valuation|FixedAmount|Estimated",
        "formula_id": "sha256:formula_hash",
        "inputs": { },
        "output": 0.00,
        "currency": "USD",
        "dependencies": ["ARR_..."]
      }
    }
  ],

  "anticipations": [
    {
      "id": "ANT_DESCRIPTIVE_ID",
      "foray_core": {
        "accrual_refs": ["ACC_DESCRIPTIVE_ID"],
        "arrangement_refs": ["ARR_DESCRIPTIVE_ID"],
        "type": "anticipation_type",
        "description": "Anticipation description",
        "expected_amount": 0.00,
        "currency": "USD",
        "expected_date": "ISO-8601",
        "probability_factor": 0.95,
        "dependencies": ["ACC_..."]
      }
    }
  ],

  "actions": [
    {
      "id": "ACT_DESCRIPTIVE_ID",
      "foray_core": {
        "anticipation_refs": ["ANT_DESCRIPTIVE_ID"],
        "accrual_refs": ["ACC_DESCRIPTIVE_ID"],
        "arrangement_refs": ["ARR_DESCRIPTIVE_ID"],
        "type": "action_type",
        "description": "Action description",
        "amount_settled": 0.00,
        "currency": "USD",
        "settlement_date": "ISO-8601",
        "settlement_status": "completed|pending|failed|reversed",
        "payment_method": "wire|ach|check|crypto|other",
        "counterparty": "Counterparty Name",
        "allocations": [
          {
            "ref": "ANT_DESCRIPTIVE_ID",
            "ref_type": "anticipation",
            "amount": 0.00,
            "currency": "USD",
            "allocation_type": "full|partial|overpayment"
          }
        ],
        "dependencies": ["ANT_..."]
      }
    }
  ],

  "merkle_root": "sha256:...",

  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 0,
    "confirmation_time_ms": 0,
    "anchored_at": "ISO-8601"
  },

  "audit_data_anchor": {
    "audit_data_hash": "sha256:...",
    "audit_profile": "standard|dcaa_full|big4|minimal",
    "storage_locations": []
  },

  "privacy_metadata": {
    "formulas_obfuscated": 0,
    "instance_pools": 0,
    "attack_complexity": "2^96 operations"
  }
}
```

## Accrual Calculation Types

Accruals are **formulas applied against asset flows**. They capture HOW amounts are computed, not what is owed/receivable.

Use the appropriate `computation_method`:

- **Calculated** - Formula-based (interest, depreciation, taxes, allocations, overhead rates)
- **Valuation** - Oracle/external source (market prices, FX rates, collateral marks)
- **FixedAmount** - Static value (flat fees, fixed charges, invoice line items)
- **Estimated** - Projected values subject to true-up

**Examples of Accrual types:**
- `interest_calculation` - P x r x t formula
- `depreciation_expense` - cost x rate formula
- `overhead_allocation` - hours x rate formula
- `revenue_recognition` - ASC 606 allocation formula
- `fx_leg_recognition` - trade leg at contracted rate
- `invoice_amount` - fixed charge from vendor
- `usage_charge` - consumption x rate formula

## Valid Transaction Patterns (v4.1)

| Pattern | Components | Use Case |
| `FULL_LIFECYCLE` | ARR -> ACC -> ANT -> ACT | Complete transaction cycle |
| `COMMITMENT_ONLY` | ARR | Contract signed, no activity yet |
| `RECOGNITION_ONLY` | ACC | Adjusting entry, depreciation |
| `SETTLEMENT_ONLY` | ACT | Immediate cash transaction |
| `CONSOLIDATED_PAYMENT` | ACT -> [ANT, ANT, ANT] | Single payment, multiple invoices |

## Domain-Specific Patterns

### Financial Instruments
- Derivatives: legs, notionals, mark-to-market valuations
- Securitizations: tranches, waterfalls, credit enhancement
- Loans: principal, interest accruals, amortization schedules

### Manufacturing
- BOM components -> procurement arrangements
- Labor pools -> calculated accruals with rates
- Overhead allocation -> machine-hour based formulas
- WIP transfers -> action chains

### Payroll
- Employee arrangements (salted identifiers)
- Gross/net calculations with tax formulas
- Benefits deductions as fixed amounts
- Payment actions with bank references

### Energy/Commodities
- PPA arrangements with delivery terms
- Production accruals with unit pricing
- Forecast anticipations with variance ranges
- Settlement actions with grid references

## Privacy Architecture (3-Layer + ZK-Ready)

| Layer | Mechanism | Purpose |
| **1. Identifier Hashing** | Salted SHA-256 | Cross-entity unlinkability |
| **2. Formula Commitments** | Hash-based registry | Prove correctness without revealing logic |
| **3. Instance Pooling** | Multiple representations | Statistical confusion |
| **4. Zero-Knowledge (Future)** | ZK-SNARKs/STARKs | When Kaspa supports on-chain ZK |

Apply privacy metadata proportional to sensitivity:

| Sensitivity | Formulas Obfuscated | Instance Pools |
| Low | 1-3 | 1-2 |
| Medium | 3-7 | 3-5 |
| High | 7-15 | 5-10 |

## Regulatory Compliance Flags

Include applicable compliance in `compliance_flags`:

```json
"compliance_flags": ["SOX_404", "DCAA", "Basel_III", "IFRS_9", "Dodd_Frank", "Reg_AB_II"]
```

## Workflow: Description -> JSON

1. **Parse the description** - Extract: parties, amounts, dates, formulas, conditions
2. **Identify domain** - Financial, manufacturing, payroll, supply chain, energy
3. **Determine entry point** - Does it need Arrangements or can it start elsewhere?
4. **Build component chain** - Use appropriate pattern from v4.1 options
5. **Apply many-to-many refs** - Use `_refs[]` arrays where multiple upstream components exist
6. **Add allocations** - For Actions that settle multiple Anticipations
7. **Apply privacy** - Salt identities, obfuscate formulas
8. **Add metadata** - Kaspa commitment placeholders, compliance flags

## Example: Batch Payment (v4.1)

**User prompt:** "Create a FORAY transaction for a batch payment of $10,000 clearing three vendor invoices"

**Generated structure:**
- Arrangement: Master vendor agreement
- Accruals: Three invoice amounts (each with `arrangement_refs`)
- Anticipations: Three scheduled payments (each with `accrual_refs` + `arrangement_refs`)
- Action: Single batch payment with `anticipation_refs` array pointing to all three, plus `allocations` array showing how the $10,000 was distributed

This demonstrates v4.1's many-to-many capability - one Action settling multiple Anticipations.

**Protocol Version:** 4.1  
**Copyright:** (c) 2026 Marvin Percival. All rights reserved.  
**License:** BSL-1.1
