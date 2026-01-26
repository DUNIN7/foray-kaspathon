# FORAY Protocol Specification v4.1

## Document Control

| Property | Value |
|----------|-------|
| **Version** | 4.1 |
| **Status** | DRAFT - Under Review |
| **Previous Version** | 4.0 (FORAY_Protocol_v4_0_Specification.md) |
| **Created** | January 25, 2026 |
| **Author** | FORAY Protocol Team |
| **Classification** | Technical Specification |

---

## Version History

| Version | Date | Summary | Breaking Changes |
|---------|------|---------|------------------|
| **1.0** | Jan 2026 | Initial protocol with 4-component model | N/A |
| **2.0** | Jan 2026 | Added privacy layers, ERP adapters | No |
| **3.0** | Jan 2026 | Compressed keys, tier-based storage, encrypted envelope | Yes - key mapping |
| **4.0** | Jan 2026 | foray_core/audit_data separation, 3-layer architecture, sealed archive | Yes - structural |
| **4.1** | Jan 2026 | **Flexible entry points, many-to-many component references** | **Yes - reference fields** |

---

## What's New in v4.1

### Summary of Changes

| Change | v4.0 | v4.1 | Impact |
|--------|------|------|--------|
| **Arrangements requirement** | Required (âœ…) | Optional (âšª) | Allows Action-only or Accrual-only transactions |
| **Component references** | Singular (`_ref`) | Array (`_refs[]`) | Supports many-to-many relationships |
| **Minimum components** | At least 1 Arrangement | At least 1 component of any type | Greater flexibility |
| **Entry points** | Arrangements only | Any component type | Supports cash receipts, adjusting entries |

### Design Rationale

#### Change 1: Flexible Entry Points

**Problem:** V4.0 required Arrangements as DAG roots, forcing artificial parent creation for transactions without natural arrangements (e.g., walk-in cash receipts, petty cash, adjusting journal entries).

**Solution:** Allow any component type as transaction entry point. Define valid component combinations based on real-world transaction patterns.

#### Change 2: Many-to-Many References

**Problem:** V4.0 used singular reference fields (`arrangement_ref`, `accrual_ref`, `anticipation_ref`), but real transactions often have many-to-many relationships:
- One payment clearing multiple invoices
- One invoice covering multiple contracts
- RMBS waterfall distributions across multiple tranches

**Solution:** Replace singular `_ref` fields with `_refs[]` arrays, supporting proper relationship modeling.

---

## How to Use This Document

### For Implementers
- Section 2 defines the core protocol with v4.1 changes
- Section 3 defines valid component combinations
- Section 4 defines migration from v4.0

### For Reviewers Comparing to v4.0
- Component reference fields changed from singular to array
- Arrangements no longer required
- New validation rules for component combinations
- Breaking changes marked with âš ï¸

### Backward Compatibility
- V4.1 systems MUST accept v4.0 transactions (singular refs auto-converted to arrays)
- V4.0 systems MAY reject v4.1 transactions with multiple refs

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Protocol Changes](#2-core-protocol-changes)
3. [Valid Component Combinations](#3-valid-component-combinations)
4. [Component Structures (Updated)](#4-component-structures-updated)
5. [Reference Allocation](#5-reference-allocation)
6. [Validation Rules](#6-validation-rules)
7. [Migration Guide (v4.0 â†’ v4.1)](#7-migration-guide-v40--v41)
8. [Examples](#8-examples)
9. [Appendices](#9-appendices)

---

# 1. Executive Summary

## 1.1 What Changed in v4.1

| Aspect | v4.0 | v4.1 |
|--------|------|------|
| **Arrangements** | Required | Optional |
| **Entry Points** | Arrangements only | Any component |
| **Reference Type** | Singular (`_ref`) | Array (`_refs[]`) |
| **Relationship Model** | Many-to-one | Many-to-many |
| **Min Components** | 1 Arrangement | 1 of any type |

## 1.2 Design Principles (Extended from v4.0)

1. **Source System Trust** â€” FORAY trusts validated ERP data
2. **4-Component Model** â€” Arrangements â†” Accruals â†” Anticipations â†” Actions
3. **Immutable Anchoring** â€” Blockchain provides tamper-proof timestamps
4. **Privacy Preservation** â€” Hash-based verification without data exposure
5. **Separation of Concerns** â€” Core protocol separate from audit metadata
6. **Layered Storage** â€” Right data in right place at right cost
7. **Sealed Archive** â€” Complete record preserved with forensic-grade controls
8. **Async Sealing** â€” User-facing latency independent of archive operations

### New in v4.1:

9. **Transaction Fidelity** â€” Model what actually happened, not artificial structures
10. **Relationship Accuracy** â€” Support real-world many-to-many flows

---

# 2. Core Protocol Changes

## 2.1 Top-Level Schema (Updated)

```json
{
  "transaction_id": "DOMAIN_YYYY_QN_DESCRIPTOR",
  "schema_version": "4.1",
  "timestamp": "ISO-8601",
  
  "foray_core": {
    "entity": "entity_name",
    "entity_hash": "sha256:...",
    "transaction_type": "type_code",
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
  
  "arrangements": [],
  "accruals": [],
  "anticipations": [],
  "actions": [],
  
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
    "storage_locations": [...]
  },
  
  "privacy_metadata": {...}
}
```

## 2.2 Field Definitions (Updated)

| Field | Type | Required | Description | v4.0 Change |
|-------|------|:--------:|-------------|-------------|
| `transaction_id` | string | âœ… | Unique identifier | Unchanged |
| `schema_version` | string | âœ… | Protocol version ("4.1") | Updated value |
| `timestamp` | ISO-8601 | âœ… | Creation timestamp | Unchanged |
| `foray_core` | object | âœ… | Core transaction data | Unchanged |
| `component_hashes` | object | âœ… | Hash of each component | Unchanged |
| `arrangements` | array | âšª | Arrangement components | **âš ï¸ Now optional** |
| `accruals` | array | âšª | Accrual components | Unchanged |
| `anticipations` | array | âšª | Anticipation components | Unchanged |
| `actions` | array | âšª | Action components | Unchanged |
| `merkle_root` | string | âœ… | Root hash of all components | Unchanged |
| `blockchain_anchor` | object | âœ… | On-chain anchoring details | Unchanged |
| `audit_data_anchor` | object | âšª | Reference to audit_data | Unchanged |
| `privacy_metadata` | object | âšª | Privacy settings | Unchanged |

### âš ï¸ Breaking Change: Component Requirement

**v4.0:** `arrangements.length >= 1`

**v4.1:** `arrangements.length + accruals.length + anticipations.length + actions.length >= 1`

At least one component of any type must be present.

---

# 3. Valid Component Combinations

## 3.1 Supported Transaction Patterns

| Pattern ID | Components | Use Case | Example |
|------------|------------|----------|---------|
| `FULL_LIFECYCLE` | ARR â†’ ACC â†’ ANT â†’ ACT | Complete transaction cycle | Invoice â†’ Payment |
| `COMMITMENT_ONLY` | ARR | Contract signed, no activity yet | Master Service Agreement |
| `RECOGNITION_ONLY` | ACC | Adjusting entry, depreciation | Month-end depreciation |
| `SETTLEMENT_ONLY` | ACT | Immediate cash transaction | Cash sale, petty cash |
| `EXPECTATION_CHAIN` | ARR â†’ ANT | Future obligation recorded | Earnout milestone |
| `IMMEDIATE_RECOGNITION` | ACC â†’ ACT | Sales receipt (instant) | POS transaction |
| `DEFERRED_SETTLEMENT` | ARR â†’ ACC â†’ ANT | Accrued but not yet settled | Accrued expenses |
| `MULTI_ARRANGEMENT` | [ARR, ARR] â†’ ACC | Bundled services | Combined project billing |
| `CONSOLIDATED_PAYMENT` | ACT â†’ [ANT, ANT, ANT] | Single payment, multiple invoices | Batch payment run |
| `WATERFALL_DISTRIBUTION` | ACT â†’ [ANTâ‚, ANTâ‚‚, ANTâ‚ƒ, ANTâ‚„] | Structured finance | RMBS monthly distribution |

## 3.2 Component Entry Points

Any component type can serve as a transaction entry point:

| Entry Point | Valid When | Typical Use Cases |
|-------------|------------|-------------------|
| **Arrangement** | Transaction has contractual basis | Contracts, agreements, orders |
| **Accrual** | Recognition without prior arrangement | Adjusting entries, estimates |
| **Anticipation** | Future expectation without arrangement/accrual | Contingent liabilities (rare) |
| **Action** | Immediate settlement, no prior components | Cash receipts, tips, donations |

## 3.3 Dependency Rules

Components may reference zero, one, or multiple upstream components:

```
Arrangements:   No upstream references (entry points)
                dependencies: []

Accruals:       Zero or more Arrangements
                arrangement_refs: [] | ["ARR_1"] | ["ARR_1", "ARR_2", ...]

Anticipations:  Zero or more Accruals, and/or Arrangements
                accrual_refs: [] | ["ACC_1"] | ["ACC_1", "ACC_2", ...]
                arrangement_refs: [] | ["ARR_1"] | ["ARR_1", "ARR_2", ...]

Actions:        Zero or more Anticipations, Accruals, and/or Arrangements
                anticipation_refs: [] | ["ANT_1"] | ["ANT_1", "ANT_2", ...]
                accrual_refs: [] | ["ACC_1"] | ["ACC_1", "ACC_2", ...]
                arrangement_refs: [] | ["ARR_1"] | ["ARR_1", "ARR_2", ...]
```

---

# 4. Component Structures (Updated)

## 4.1 Arrangements (Unchanged)

```json
{
  "id": "ARR_DESCRIPTIVE_ID",
  
  "foray_core": {
    "type": "arrangement_type",
    "effective_date": "ISO-8601",
    "parties": [
      {
        "role": "party_role",
        "name": "Party Name",
        "party_id_hash": "sha256:...",
        "jurisdiction": "US"
      }
    ],
    "description": "Arrangement description",
    "total_value": 0.00,
    "currency": "USD",
    "terms": {
      "...arrangement_specific_terms..."
    },
    "legal_documentation": ["Doc1", "Doc2"],
    "dependencies": []
  },
  
  "audit_data": {
    "...see audit_data specification..."
  }
}
```

## 4.2 Accruals (Updated References)

```json
{
  "id": "ACC_DESCRIPTIVE_ID",
  
  "foray_core": {
    "arrangement_refs": ["ARR_ID_1", "ARR_ID_2"],
    "type": "accrual_type",
    "description": "Accrual description",
    "computation_method": "Calculated|Valuation|FixedAmount|Estimated",
    "formula_id": "sha256:formula_hash",
    "inputs": {
      "input_name": "value"
    },
    "output": 0.00,
    "currency": "USD",
    "accounting_entry": {
      "debit": {"account": "account_code", "amount": 0.00},
      "credit": {"account": "account_code", "amount": 0.00}
    },
    "fiscal_period": {
      "year": 2026,
      "quarter": 1,
      "month": 1,
      "start": "ISO-8601",
      "end": "ISO-8601"
    },
    "dependencies": ["ARR_..."]
  },
  
  "audit_data": {
    "...see audit_data specification..."
  }
}
```

### âš ï¸ Breaking Change: `arrangement_ref` â†’ `arrangement_refs`

| Field | v4.0 | v4.1 |
|-------|------|------|
| `arrangement_ref` | `"ARR_ID"` (string) | **Deprecated** |
| `arrangement_refs` | N/A | `["ARR_ID_1", "ARR_ID_2"]` (array) |

**Migration:** `arrangement_ref: "ARR_ID"` â†’ `arrangement_refs: ["ARR_ID"]`

**Empty allowed:** `arrangement_refs: []` (for entry-point accruals)

## 4.3 Anticipations (Updated References)

```json
{
  "id": "ANT_DESCRIPTIVE_ID",
  
  "foray_core": {
    "accrual_refs": ["ACC_ID_1", "ACC_ID_2"],
    "arrangement_refs": ["ARR_ID_1"],
    "type": "anticipation_type",
    "description": "Anticipation description",
    "expected_amount": 0.00,
    "currency": "USD",
    "expected_date": "ISO-8601",
    "condition": "condition_hash_or_null",
    "probability_factor": 0.95,
    "assumptions": {
      "...anticipation_specific_assumptions..."
    },
    "dependencies": ["ACC_...", "ARR_..."]
  },
  
  "audit_data": {
    "...see audit_data specification..."
  }
}
```

### âš ï¸ Breaking Change: `accrual_ref` â†’ `accrual_refs`

| Field | v4.0 | v4.1 |
|-------|------|------|
| `accrual_ref` | `"ACC_ID"` (string) | **Deprecated** |
| `accrual_refs` | N/A | `["ACC_ID_1", "ACC_ID_2"]` (array) |
| `arrangement_refs` | N/A | `["ARR_ID"]` (array) â€” **New** |

**New capability:** Anticipations can now directly reference Arrangements (bypassing Accruals for simple future obligations).

## 4.4 Actions (Updated References)

```json
{
  "id": "ACT_DESCRIPTIVE_ID",
  
  "foray_core": {
    "anticipation_refs": ["ANT_ID_1", "ANT_ID_2", "ANT_ID_3"],
    "accrual_refs": ["ACC_ID_1"],
    "arrangement_refs": ["ARR_ID_1"],
    "type": "action_type",
    "description": "Action description",
    "amount_settled": 0.00,
    "currency": "USD",
    "settlement_date": "ISO-8601",
    "settlement_status": "completed|pending|failed|reversed",
    "payment_method": "wire|ach|check|crypto|cash|other",
    "counterparty": "Counterparty Name",
    "allocations": [
      {
        "ref": "ANT_ID_1",
        "ref_type": "anticipation",
        "amount": 0.00,
        "currency": "USD"
      },
      {
        "ref": "ANT_ID_2",
        "ref_type": "anticipation",
        "amount": 0.00,
        "currency": "USD"
      }
    ],
    "variance": {
      "expected": 0.00,
      "actual": 0.00,
      "difference": 0.00,
      "explanation": "variance explanation or null"
    },
    "dependencies": ["ANT_...", "ACC_...", "ARR_..."]
  },
  
  "audit_data": {
    "...see audit_data specification..."
  }
}
```

### âš ï¸ Breaking Change: `anticipation_ref` â†’ `anticipation_refs`

| Field | v4.0 | v4.1 |
|-------|------|------|
| `anticipation_ref` | `"ANT_ID"` (string) | **Deprecated** |
| `anticipation_refs` | N/A | `["ANT_ID_1", "ANT_ID_2"]` (array) |
| `accrual_refs` | N/A | `["ACC_ID"]` (array) â€” **New** |
| `arrangement_refs` | N/A | `["ARR_ID"]` (array) â€” **New** |
| `allocations` | N/A | Array of allocation objects â€” **New** |

**New capability:** Actions can reference multiple upstream components of any type, with optional allocation breakdown.

---

# 5. Reference Allocation

## 5.1 Allocation Object Structure

When an Action settles multiple Anticipations (or references multiple upstream components), use the `allocations` array to track how the settlement amount maps to each reference:

```json
{
  "allocations": [
    {
      "ref": "ANT_INVOICE_001",
      "ref_type": "anticipation",
      "amount": 3000.00,
      "currency": "USD",
      "allocation_type": "full|partial|overpayment",
      "remaining_balance": 0.00
    },
    {
      "ref": "ANT_INVOICE_002",
      "ref_type": "anticipation",
      "amount": 4000.00,
      "currency": "USD",
      "allocation_type": "full",
      "remaining_balance": 0.00
    },
    {
      "ref": "ANT_INVOICE_003",
      "ref_type": "anticipation",
      "amount": 3000.00,
      "currency": "USD",
      "allocation_type": "partial",
      "remaining_balance": 500.00
    }
  ]
}
```

## 5.2 Allocation Field Definitions

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `ref` | string | âœ… | ID of referenced component |
| `ref_type` | enum | âœ… | `anticipation` \| `accrual` \| `arrangement` |
| `amount` | number | âœ… | Amount allocated to this reference |
| `currency` | string | âœ… | Currency code (ISO 4217) |
| `allocation_type` | enum | âšª | `full` \| `partial` \| `overpayment` |
| `remaining_balance` | number | âšª | Remaining balance after allocation |

## 5.3 Validation Rules for Allocations

1. **Sum must match:** `SUM(allocations[].amount)` MUST equal `amount_settled`
2. **References must exist:** All `ref` values must exist in the transaction
3. **Type must match:** `ref_type` must match the actual component type
4. **Currency consistency:** All allocations should use consistent currency (or specify conversion)

---

# 6. Validation Rules

## 6.1 Transaction-Level Validation

```javascript
function validateTransaction(tx) {
  const errors = [];
  
  // Rule 1: At least one component required
  const totalComponents = 
    tx.arrangements.length + 
    tx.accruals.length + 
    tx.anticipations.length + 
    tx.actions.length;
  
  if (totalComponents === 0) {
    errors.push("At least one component required");
  }
  
  // Rule 2: Schema version must be 4.1
  if (tx.schema_version !== "4.1") {
    errors.push("Schema version must be '4.1'");
  }
  
  // Rule 3: All referenced IDs must exist
  const allIds = getAllComponentIds(tx);
  const allRefs = getAllReferences(tx);
  
  for (const ref of allRefs) {
    if (!allIds.includes(ref)) {
      errors.push(`Referenced ID '${ref}' does not exist`);
    }
  }
  
  // Rule 4: No circular dependencies
  if (hasCircularDependencies(tx)) {
    errors.push("Circular dependencies detected");
  }
  
  // Rule 5: Allocation sums must match (if present)
  for (const action of tx.actions) {
    if (action.foray_core.allocations?.length > 0) {
      const sum = action.foray_core.allocations
        .reduce((acc, a) => acc + a.amount, 0);
      if (Math.abs(sum - action.foray_core.amount_settled) > 0.01) {
        errors.push(`Action ${action.id}: allocation sum (${sum}) != amount_settled (${action.foray_core.amount_settled})`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

## 6.2 Component-Level Validation

### Arrangements
- `dependencies` must be empty (arrangements are entry points)
- `parties` must have at least one entry

### Accruals
- `arrangement_refs` may be empty or contain valid ARR_* IDs
- `output` must be a number
- `accounting_entry` debits must equal credits

### Anticipations
- `accrual_refs` and/or `arrangement_refs` may be empty or contain valid IDs
- `probability_factor` must be between 0.0 and 1.0
- `expected_date` should be in the future (warning, not error)

### Actions
- Reference arrays may be empty (for entry-point actions)
- `amount_settled` must be a number
- `settlement_status` must be valid enum value
- `allocations` (if present) must sum to `amount_settled`

## 6.3 Reference Type Validation

```javascript
function validateReferences(component, componentType) {
  const errors = [];
  const core = component.foray_core;
  
  switch (componentType) {
    case 'arrangement':
      // Arrangements have no upstream refs
      if (core.arrangement_refs?.length > 0) {
        errors.push("Arrangements cannot have arrangement_refs");
      }
      break;
      
    case 'accrual':
      // Accruals can only ref Arrangements
      if (core.accrual_refs?.length > 0) {
        errors.push("Accruals cannot have accrual_refs");
      }
      if (core.anticipation_refs?.length > 0) {
        errors.push("Accruals cannot have anticipation_refs");
      }
      break;
      
    case 'anticipation':
      // Anticipations can ref Arrangements and Accruals
      if (core.anticipation_refs?.length > 0) {
        errors.push("Anticipations cannot have anticipation_refs");
      }
      break;
      
    case 'action':
      // Actions can ref any upstream type
      // No restrictions
      break;
  }
  
  return errors;
}
```

---

# 7. Migration Guide (v4.0 â†’ v4.1)

## 7.1 Breaking Changes Summary

| Change | v4.0 | v4.1 | Migration Action |
|--------|------|------|------------------|
| `arrangement_ref` | String | Array | Wrap in array |
| `accrual_ref` | String | Array | Wrap in array |
| `anticipation_ref` | String | Array | Wrap in array |
| Arrangements | Required | Optional | No action needed |
| `schema_version` | "4.0" | "4.1" | Update value |

## 7.2 Automated Migration Script

```javascript
function migrateV40toV41(v40Transaction) {
  const v41 = JSON.parse(JSON.stringify(v40Transaction));
  
  // Update schema version
  v41.schema_version = "4.1";
  
  // Migrate Accruals
  for (const accrual of v41.accruals || []) {
    const core = accrual.foray_core;
    
    // Convert singular ref to array
    if (core.arrangement_ref !== undefined) {
      core.arrangement_refs = core.arrangement_ref 
        ? [core.arrangement_ref] 
        : [];
      delete core.arrangement_ref;
    }
    
    // Ensure array exists
    if (!core.arrangement_refs) {
      core.arrangement_refs = [];
    }
  }
  
  // Migrate Anticipations
  for (const anticipation of v41.anticipations || []) {
    const core = anticipation.foray_core;
    
    // Convert singular ref to array
    if (core.accrual_ref !== undefined) {
      core.accrual_refs = core.accrual_ref 
        ? [core.accrual_ref] 
        : [];
      delete core.accrual_ref;
    }
    
    // Ensure arrays exist
    if (!core.accrual_refs) core.accrual_refs = [];
    if (!core.arrangement_refs) core.arrangement_refs = [];
  }
  
  // Migrate Actions
  for (const action of v41.actions || []) {
    const core = action.foray_core;
    
    // Convert singular ref to array
    if (core.anticipation_ref !== undefined) {
      core.anticipation_refs = core.anticipation_ref 
        ? [core.anticipation_ref] 
        : [];
      delete core.anticipation_ref;
    }
    
    // Ensure arrays exist
    if (!core.anticipation_refs) core.anticipation_refs = [];
    if (!core.accrual_refs) core.accrual_refs = [];
    if (!core.arrangement_refs) core.arrangement_refs = [];
  }
  
  return v41;
}
```

## 7.3 Backward Compatibility

V4.1 implementations SHOULD accept v4.0 transactions by:

1. Detecting `schema_version: "4.0"`
2. Auto-converting singular `_ref` fields to `_refs` arrays
3. Processing as v4.1

```javascript
function ensureV41Compatibility(transaction) {
  if (transaction.schema_version === "4.0") {
    return migrateV40toV41(transaction);
  }
  return transaction;
}
```

## 7.4 Forward Compatibility

V4.0 implementations can process v4.1 transactions with single references by:

1. Checking that all `_refs` arrays have length <= 1
2. Extracting single value: `arrangement_ref = arrangement_refs[0] || null`
3. Rejecting transactions with multiple references

```javascript
function downgradeToV40(v41Transaction) {
  // Check for multi-reference usage
  for (const accrual of v41Transaction.accruals || []) {
    if (accrual.foray_core.arrangement_refs?.length > 1) {
      throw new Error("Cannot downgrade: multiple arrangement_refs");
    }
  }
  // ... similar checks for other components
  
  // Perform downgrade
  const v40 = JSON.parse(JSON.stringify(v41Transaction));
  v40.schema_version = "4.0";
  
  for (const accrual of v40.accruals || []) {
    const core = accrual.foray_core;
    core.arrangement_ref = core.arrangement_refs?.[0] || null;
    delete core.arrangement_refs;
  }
  // ... similar for other components
  
  return v40;
}
```

---

# 8. Examples

## 8.1 Example: Cash Sale (Action-Only Transaction)

**Scenario:** Walk-in customer pays $50 cash for a product. No prior arrangement, no invoice.

```json
{
  "transaction_id": "RETAIL_2026_Q1_CASH_SALE_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-25T14:30:00Z",
  
  "foray_core": {
    "entity": "Main Street Coffee Shop",
    "entity_hash": "sha256:abc123...",
    "transaction_type": "cash_sale",
    "total_value": 50.00,
    "currency": "USD",
    "status": "completed",
    "compliance_flags": []
  },
  
  "component_hashes": {
    "arrangements": "sha256:e3b0c44...",
    "accruals": "sha256:e3b0c44...",
    "anticipations": "sha256:e3b0c44...",
    "actions": "sha256:7d8f2a1..."
  },
  
  "arrangements": [],
  "accruals": [],
  "anticipations": [],
  
  "actions": [
    {
      "id": "ACT_CASH_SALE_001",
      "foray_core": {
        "anticipation_refs": [],
        "accrual_refs": [],
        "arrangement_refs": [],
        "type": "cash_receipt",
        "description": "Walk-in cash sale - coffee and pastry",
        "amount_settled": 50.00,
        "currency": "USD",
        "settlement_date": "2026-01-25T14:30:00Z",
        "settlement_status": "completed",
        "payment_method": "cash",
        "counterparty": "Walk-in Customer",
        "dependencies": []
      }
    }
  ],
  
  "merkle_root": "sha256:9f8e7d6...",
  
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 2850000,
    "confirmation_time_ms": 1100,
    "anchored_at": "2026-01-25T14:30:02Z"
  }
}
```

## 8.2 Example: Depreciation Entry (Accrual-Only Transaction)

**Scenario:** Month-end depreciation adjustment for equipment.

```json
{
  "transaction_id": "ACCT_2026_Q1_DEPRECIATION_JAN",
  "schema_version": "4.1",
  "timestamp": "2026-01-31T23:59:00Z",
  
  "foray_core": {
    "entity": "Acme Corporation",
    "entity_hash": "sha256:def456...",
    "transaction_type": "adjusting_entry",
    "total_value": 2500.00,
    "currency": "USD",
    "status": "completed",
    "compliance_flags": ["GAAP", "SOX_404"]
  },
  
  "arrangements": [],
  
  "accruals": [
    {
      "id": "ACC_DEPRECIATION_JAN_2026",
      "foray_core": {
        "arrangement_refs": [],
        "type": "depreciation_expense",
        "description": "January 2026 equipment depreciation - straight line",
        "computation_method": "Calculated",
        "formula_id": "sha256:straightline...",
        "inputs": {
          "asset_cost": 300000.00,
          "salvage_value": 0.00,
          "useful_life_months": 120,
          "months_elapsed": 1
        },
        "output": 2500.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": {"account": "6100-Depreciation Expense", "amount": 2500.00},
          "credit": {"account": "1510-Accumulated Depreciation", "amount": 2500.00}
        },
        "fiscal_period": {
          "year": 2026,
          "quarter": 1,
          "month": 1,
          "start": "2026-01-01",
          "end": "2026-01-31"
        },
        "dependencies": []
      }
    }
  ],
  
  "anticipations": [],
  "actions": [],
  
  "merkle_root": "sha256:abc789..."
}
```

## 8.3 Example: Consolidated Payment (Many-to-Many)

**Scenario:** Single $10,000 payment clears three invoices.

```json
{
  "transaction_id": "AP_2026_Q1_BATCH_PAYMENT_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-25T10:00:00Z",
  
  "foray_core": {
    "entity": "Acme Corporation",
    "entity_hash": "sha256:def456...",
    "transaction_type": "batch_payment",
    "total_value": 10000.00,
    "currency": "USD",
    "status": "completed",
    "compliance_flags": ["SOX_404"]
  },
  
  "arrangements": [
    {
      "id": "ARR_VENDOR_MSA_TECHSUPPLY",
      "foray_core": {
        "type": "master_service_agreement",
        "effective_date": "2025-01-01T00:00:00Z",
        "parties": [
          {"role": "buyer", "name": "Acme Corporation", "jurisdiction": "US"},
          {"role": "vendor", "name": "TechSupply Inc", "jurisdiction": "US"}
        ],
        "description": "Master agreement for IT supplies",
        "total_value": 100000.00,
        "currency": "USD",
        "dependencies": []
      }
    }
  ],
  
  "accruals": [
    {
      "id": "ACC_INVOICE_001",
      "foray_core": {
        "arrangement_refs": ["ARR_VENDOR_MSA_TECHSUPPLY"],
        "type": "vendor_invoice",
        "description": "Invoice #INV-001 - Laptop computers",
        "computation_method": "FixedAmount",
        "output": 3000.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": {"account": "1400-IT Equipment", "amount": 3000.00},
          "credit": {"account": "2100-Accounts Payable", "amount": 3000.00}
        },
        "dependencies": ["ARR_VENDOR_MSA_TECHSUPPLY"]
      }
    },
    {
      "id": "ACC_INVOICE_002",
      "foray_core": {
        "arrangement_refs": ["ARR_VENDOR_MSA_TECHSUPPLY"],
        "type": "vendor_invoice",
        "description": "Invoice #INV-002 - Monitors",
        "computation_method": "FixedAmount",
        "output": 4000.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": {"account": "1400-IT Equipment", "amount": 4000.00},
          "credit": {"account": "2100-Accounts Payable", "amount": 4000.00}
        },
        "dependencies": ["ARR_VENDOR_MSA_TECHSUPPLY"]
      }
    },
    {
      "id": "ACC_INVOICE_003",
      "foray_core": {
        "arrangement_refs": ["ARR_VENDOR_MSA_TECHSUPPLY"],
        "type": "vendor_invoice",
        "description": "Invoice #INV-003 - Keyboards and mice",
        "computation_method": "FixedAmount",
        "output": 3000.00,
        "currency": "USD",
        "accounting_entry": {
          "debit": {"account": "6200-Office Supplies", "amount": 3000.00},
          "credit": {"account": "2100-Accounts Payable", "amount": 3000.00}
        },
        "dependencies": ["ARR_VENDOR_MSA_TECHSUPPLY"]
      }
    }
  ],
  
  "anticipations": [
    {
      "id": "ANT_INVOICE_001_DUE",
      "foray_core": {
        "accrual_refs": ["ACC_INVOICE_001"],
        "arrangement_refs": [],
        "type": "payment_due",
        "description": "Payment due for INV-001",
        "expected_amount": 3000.00,
        "currency": "USD",
        "expected_date": "2026-02-01T00:00:00Z",
        "probability_factor": 1.0,
        "dependencies": ["ACC_INVOICE_001"]
      }
    },
    {
      "id": "ANT_INVOICE_002_DUE",
      "foray_core": {
        "accrual_refs": ["ACC_INVOICE_002"],
        "arrangement_refs": [],
        "type": "payment_due",
        "description": "Payment due for INV-002",
        "expected_amount": 4000.00,
        "currency": "USD",
        "expected_date": "2026-02-01T00:00:00Z",
        "probability_factor": 1.0,
        "dependencies": ["ACC_INVOICE_002"]
      }
    },
    {
      "id": "ANT_INVOICE_003_DUE",
      "foray_core": {
        "accrual_refs": ["ACC_INVOICE_003"],
        "arrangement_refs": [],
        "type": "payment_due",
        "description": "Payment due for INV-003",
        "expected_amount": 3000.00,
        "currency": "USD",
        "expected_date": "2026-02-01T00:00:00Z",
        "probability_factor": 1.0,
        "dependencies": ["ACC_INVOICE_003"]
      }
    }
  ],
  
  "actions": [
    {
      "id": "ACT_BATCH_PAYMENT_001",
      "foray_core": {
        "anticipation_refs": [
          "ANT_INVOICE_001_DUE",
          "ANT_INVOICE_002_DUE",
          "ANT_INVOICE_003_DUE"
        ],
        "accrual_refs": [],
        "arrangement_refs": [],
        "type": "vendor_payment",
        "description": "Consolidated payment for invoices 001, 002, 003",
        "amount_settled": 10000.00,
        "currency": "USD",
        "settlement_date": "2026-01-25T10:00:00Z",
        "settlement_status": "completed",
        "payment_method": "ach",
        "counterparty": "TechSupply Inc",
        "allocations": [
          {
            "ref": "ANT_INVOICE_001_DUE",
            "ref_type": "anticipation",
            "amount": 3000.00,
            "currency": "USD",
            "allocation_type": "full",
            "remaining_balance": 0.00
          },
          {
            "ref": "ANT_INVOICE_002_DUE",
            "ref_type": "anticipation",
            "amount": 4000.00,
            "currency": "USD",
            "allocation_type": "full",
            "remaining_balance": 0.00
          },
          {
            "ref": "ANT_INVOICE_003_DUE",
            "ref_type": "anticipation",
            "amount": 3000.00,
            "currency": "USD",
            "allocation_type": "full",
            "remaining_balance": 0.00
          }
        ],
        "dependencies": [
          "ANT_INVOICE_001_DUE",
          "ANT_INVOICE_002_DUE",
          "ANT_INVOICE_003_DUE"
        ]
      }
    }
  ],
  
  "merkle_root": "sha256:consolidated123..."
}
```

## 8.4 Example: RMBS Waterfall Distribution (Complex Many-to-Many)

**Scenario:** Monthly distribution from RMBS trust to multiple tranches.

```json
{
  "transaction_id": "RMBS_2026_Q1_DISTRIBUTION_FEB",
  "schema_version": "4.1",
  "timestamp": "2026-02-20T15:00:00Z",
  
  "foray_core": {
    "entity": "RMBS Trust 2026-A",
    "entity_hash": "sha256:rmbs789...",
    "transaction_type": "waterfall_distribution",
    "total_value": 6200000.00,
    "currency": "USD",
    "status": "completed",
    "compliance_flags": ["SEC_REG_AB", "DODD_FRANK"]
  },
  
  "arrangements": [
    {
      "id": "ARR_TRANCHE_A_AAA",
      "foray_core": {
        "type": "tranche_certificate",
        "parties": [
          {"role": "issuer", "name": "RMBS Trust 2026-A"},
          {"role": "holders", "name": "Class A Certificateholders"}
        ],
        "total_value": 240000000.00,
        "terms": {"coupon_rate": 0.045, "priority": 1}
      }
    },
    {
      "id": "ARR_TRANCHE_M1_AA",
      "foray_core": {
        "type": "tranche_certificate",
        "parties": [
          {"role": "issuer", "name": "RMBS Trust 2026-A"},
          {"role": "holders", "name": "Class M-1 Certificateholders"}
        ],
        "total_value": 30000000.00,
        "terms": {"coupon_rate": 0.055, "priority": 2}
      }
    },
    {
      "id": "ARR_TRANCHE_B_BB",
      "foray_core": {
        "type": "tranche_certificate",
        "parties": [
          {"role": "issuer", "name": "RMBS Trust 2026-A"},
          {"role": "holders", "name": "Class B Certificateholders"}
        ],
        "total_value": 15000000.00,
        "terms": {"coupon_rate": 0.075, "priority": 3}
      }
    }
  ],
  
  "accruals": [
    {
      "id": "ACC_CLASS_A_INTEREST_FEB",
      "foray_core": {
        "arrangement_refs": ["ARR_TRANCHE_A_AAA"],
        "type": "tranche_interest",
        "computation_method": "Calculated",
        "formula_id": "sha256:interest_calc...",
        "inputs": {"principal": 240000000, "rate": 0.045, "days": 28},
        "output": 829315.07,
        "currency": "USD"
      }
    },
    {
      "id": "ACC_CLASS_M1_INTEREST_FEB",
      "foray_core": {
        "arrangement_refs": ["ARR_TRANCHE_M1_AA"],
        "type": "tranche_interest",
        "computation_method": "Calculated",
        "output": 126712.33,
        "currency": "USD"
      }
    },
    {
      "id": "ACC_CLASS_B_INTEREST_FEB",
      "foray_core": {
        "arrangement_refs": ["ARR_TRANCHE_B_BB"],
        "type": "tranche_interest",
        "computation_method": "Calculated",
        "output": 86301.37,
        "currency": "USD"
      }
    }
  ],
  
  "anticipations": [
    {
      "id": "ANT_CLASS_A_DISTRIBUTION_FEB",
      "foray_core": {
        "accrual_refs": ["ACC_CLASS_A_INTEREST_FEB"],
        "arrangement_refs": ["ARR_TRANCHE_A_AAA"],
        "type": "tranche_distribution",
        "expected_amount": 2329315.07,
        "description": "Class A interest + principal",
        "expected_date": "2026-02-20T00:00:00Z",
        "probability_factor": 1.0
      }
    },
    {
      "id": "ANT_CLASS_M1_DISTRIBUTION_FEB",
      "foray_core": {
        "accrual_refs": ["ACC_CLASS_M1_INTEREST_FEB"],
        "arrangement_refs": ["ARR_TRANCHE_M1_AA"],
        "type": "tranche_distribution",
        "expected_amount": 326712.33,
        "expected_date": "2026-02-20T00:00:00Z",
        "probability_factor": 1.0
      }
    },
    {
      "id": "ANT_CLASS_B_DISTRIBUTION_FEB",
      "foray_core": {
        "accrual_refs": ["ACC_CLASS_B_INTEREST_FEB"],
        "arrangement_refs": ["ARR_TRANCHE_B_BB"],
        "type": "tranche_distribution",
        "expected_amount": 86301.37,
        "expected_date": "2026-02-20T00:00:00Z",
        "probability_factor": 1.0
      }
    }
  ],
  
  "actions": [
    {
      "id": "ACT_WATERFALL_DISTRIBUTION_FEB",
      "foray_core": {
        "anticipation_refs": [
          "ANT_CLASS_A_DISTRIBUTION_FEB",
          "ANT_CLASS_M1_DISTRIBUTION_FEB",
          "ANT_CLASS_B_DISTRIBUTION_FEB"
        ],
        "accrual_refs": [],
        "arrangement_refs": [],
        "type": "waterfall_settlement",
        "description": "February 2026 waterfall distribution to all tranches",
        "amount_settled": 2742328.77,
        "currency": "USD",
        "settlement_date": "2026-02-20T15:00:00Z",
        "settlement_status": "completed",
        "payment_method": "wire",
        "counterparty": "BNY Mellon (Trustee)",
        "allocations": [
          {
            "ref": "ANT_CLASS_A_DISTRIBUTION_FEB",
            "ref_type": "anticipation",
            "amount": 2329315.07,
            "currency": "USD",
            "allocation_type": "full"
          },
          {
            "ref": "ANT_CLASS_M1_DISTRIBUTION_FEB",
            "ref_type": "anticipation",
            "amount": 326712.33,
            "currency": "USD",
            "allocation_type": "full"
          },
          {
            "ref": "ANT_CLASS_B_DISTRIBUTION_FEB",
            "ref_type": "anticipation",
            "amount": 86301.37,
            "currency": "USD",
            "allocation_type": "full"
          }
        ],
        "dependencies": [
          "ANT_CLASS_A_DISTRIBUTION_FEB",
          "ANT_CLASS_M1_DISTRIBUTION_FEB",
          "ANT_CLASS_B_DISTRIBUTION_FEB"
        ]
      }
    }
  ],
  
  "merkle_root": "sha256:waterfall456..."
}
```

---

# 9. Appendices

## 9.1 Reference Field Migration Cheatsheet

| Component | v4.0 Field | v4.1 Field | Type Change |
|-----------|-----------|-----------|-------------|
| Accrual | `arrangement_ref` | `arrangement_refs` | string â†’ array |
| Anticipation | `accrual_ref` | `accrual_refs` | string â†’ array |
| Anticipation | N/A | `arrangement_refs` | **New field** |
| Action | `anticipation_ref` | `anticipation_refs` | string â†’ array |
| Action | N/A | `accrual_refs` | **New field** |
| Action | N/A | `arrangement_refs` | **New field** |
| Action | N/A | `allocations` | **New field** |

## 9.2 Valid Reference Combinations

| Component | Can Reference |
|-----------|---------------|
| Arrangement | Nothing (entry point) |
| Accrual | Arrangements only |
| Anticipation | Arrangements, Accruals |
| Action | Arrangements, Accruals, Anticipations |

## 9.3 JSON Schema (Summary)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FORAY Protocol v4.1",
  "type": "object",
  "required": ["transaction_id", "schema_version", "timestamp", "foray_core", "merkle_root"],
  "properties": {
    "schema_version": {"const": "4.1"},
    "arrangements": {
      "type": "array",
      "items": {"$ref": "#/definitions/Arrangement"}
    },
    "accruals": {
      "type": "array",
      "items": {"$ref": "#/definitions/Accrual"}
    },
    "anticipations": {
      "type": "array",
      "items": {"$ref": "#/definitions/Anticipation"}
    },
    "actions": {
      "type": "array",
      "items": {"$ref": "#/definitions/Action"}
    }
  },
  "definitions": {
    "Accrual": {
      "properties": {
        "foray_core": {
          "properties": {
            "arrangement_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ARR_"}
            }
          }
        }
      }
    },
    "Anticipation": {
      "properties": {
        "foray_core": {
          "properties": {
            "accrual_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ACC_"}
            },
            "arrangement_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ARR_"}
            }
          }
        }
      }
    },
    "Action": {
      "properties": {
        "foray_core": {
          "properties": {
            "anticipation_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ANT_"}
            },
            "accrual_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ACC_"}
            },
            "arrangement_refs": {
              "type": "array",
              "items": {"type": "string", "pattern": "^ARR_"}
            },
            "allocations": {
              "type": "array",
              "items": {"$ref": "#/definitions/Allocation"}
            }
          }
        }
      }
    },
    "Allocation": {
      "type": "object",
      "required": ["ref", "ref_type", "amount", "currency"],
      "properties": {
        "ref": {"type": "string"},
        "ref_type": {"enum": ["anticipation", "accrual", "arrangement"]},
        "amount": {"type": "number"},
        "currency": {"type": "string"},
        "allocation_type": {"enum": ["full", "partial", "overpayment"]},
        "remaining_balance": {"type": "number"}
      }
    }
  }
}
```

---

# Document Footer

## Disclaimer

> **DISCLAIMER:** This document describes the FORAY Protocol specification as of January 2026. All performance metrics, security claims, and compliance statements are design goals based on theoretical analysis. They do not constitute guarantees. Organizations should consult qualified professionals for specific compliance requirements.

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-24 | 4.0-DRAFT | FORAY Team | Initial v4.0 specification |
| 2026-01-25 | 4.1-DRAFT | FORAY Team | Flexible entry points, many-to-many references |

## Summary of v4.1 Changes

1. **Arrangements now optional** â€” Any component type can serve as transaction entry point
2. **Many-to-many references** â€” `_ref` fields replaced with `_refs[]` arrays
3. **New allocation tracking** â€” Actions can specify how settlements map to multiple references
4. **Enhanced validation** â€” New rules for component combinations and reference integrity
5. **Backward compatible** â€” V4.0 transactions auto-migrate to V4.1 format

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Protocol Lead | | | |
| Technical Review | | | |
| Legal Review | | | |

---

**END OF FORAY PROTOCOL SPECIFICATION v4.1**
