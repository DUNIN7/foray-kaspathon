# FORAY Protocol v4.1 Change Summary

## Overview

This document summarizes the two key changes introduced in FORAY Protocol v4.1:

1. **Flexible Entry Points** â€” Arrangements are no longer required
2. **Many-to-Many References** â€” Singular `_ref` fields replaced with `_refs[]` arrays

---

## Change 1: Flexible Entry Points

### Problem (v4.0)
The v4.0 specification required at least one Arrangement component, forcing artificial parent creation for transactions without natural arrangements:
- Walk-in cash sales
- Petty cash transactions
- Adjusting journal entries
- Depreciation entries
- Tips and donations

### Solution (v4.1)
Any component type can now serve as a transaction entry point.

| v4.0 | v4.1 |
|------|------|
| `arrangements.length >= 1` | `total_components >= 1` |
| Arrangements required | Any component type allowed |

### Valid Entry Points

| Entry Point | Use Cases |
|-------------|-----------|
| **Arrangement** | Contracts, agreements, orders |
| **Accrual** | Adjusting entries, depreciation, estimates |
| **Anticipation** | Contingent liabilities (rare) |
| **Action** | Cash receipts, tips, donations |

### Example: Action-Only Transaction

```json
{
  "transaction_id": "RETAIL_2026_Q1_CASH_001",
  "schema_version": "4.1",
  "arrangements": [],
  "accruals": [],
  "anticipations": [],
  "actions": [
    {
      "id": "ACT_CASH_SALE",
      "foray_core": {
        "anticipation_refs": [],
        "type": "cash_receipt",
        "amount_settled": 50.00,
        "settlement_status": "completed"
      }
    }
  ]
}
```

---

## Change 2: Many-to-Many References

### Problem (v4.0)
Singular reference fields couldn't express common business scenarios:
- One payment clearing multiple invoices
- One invoice covering multiple contracts
- RMBS waterfall distributions to multiple tranches

### Solution (v4.1)
Replace singular `_ref` fields with `_refs[]` arrays.

### Field Changes

| Component | v4.0 | v4.1 |
|-----------|------|------|
| Accrual | `arrangement_ref: "ARR_ID"` | `arrangement_refs: ["ARR_ID_1", "ARR_ID_2"]` |
| Anticipation | `accrual_ref: "ACC_ID"` | `accrual_refs: ["ACC_ID_1", "ACC_ID_2"]` |
| Anticipation | N/A | `arrangement_refs: ["ARR_ID"]` (new) |
| Action | `anticipation_ref: "ANT_ID"` | `anticipation_refs: ["ANT_ID_1", "ANT_ID_2"]` |
| Action | N/A | `accrual_refs: ["ACC_ID"]` (new) |
| Action | N/A | `arrangement_refs: ["ARR_ID"]` (new) |
| Action | N/A | `allocations: [...]` (new) |

### Allocation Tracking

When an Action settles multiple Anticipations, use the `allocations` array:

```json
{
  "id": "ACT_BATCH_PAYMENT",
  "foray_core": {
    "anticipation_refs": ["ANT_INV_001", "ANT_INV_002", "ANT_INV_003"],
    "amount_settled": 10000.00,
    "allocations": [
      {"ref": "ANT_INV_001", "ref_type": "anticipation", "amount": 3000.00},
      {"ref": "ANT_INV_002", "ref_type": "anticipation", "amount": 4000.00},
      {"ref": "ANT_INV_003", "ref_type": "anticipation", "amount": 3000.00}
    ]
  }
}
```

---

## Migration Guide

### Automatic Conversion

```javascript
// v4.0 â†’ v4.1 Migration
function migrate(v40) {
  const v41 = { ...v40, schema_version: "4.1" };
  
  // Convert Accruals
  for (const acc of v41.accruals || []) {
    acc.foray_core.arrangement_refs = 
      acc.foray_core.arrangement_ref 
        ? [acc.foray_core.arrangement_ref] 
        : [];
    delete acc.foray_core.arrangement_ref;
  }
  
  // Convert Anticipations
  for (const ant of v41.anticipations || []) {
    ant.foray_core.accrual_refs = 
      ant.foray_core.accrual_ref 
        ? [ant.foray_core.accrual_ref] 
        : [];
    ant.foray_core.arrangement_refs = [];
    delete ant.foray_core.accrual_ref;
  }
  
  // Convert Actions
  for (const act of v41.actions || []) {
    act.foray_core.anticipation_refs = 
      act.foray_core.anticipation_ref 
        ? [act.foray_core.anticipation_ref] 
        : [];
    act.foray_core.accrual_refs = [];
    act.foray_core.arrangement_refs = [];
    delete act.foray_core.anticipation_ref;
  }
  
  return v41;
}
```

### Backward Compatibility

- V4.1 systems **MUST** accept v4.0 transactions (auto-convert refs)
- V4.0 systems **MAY** reject v4.1 transactions with multiple refs

---

## Validation Rules

### Transaction Level
1. At least one component of any type required
2. All referenced IDs must exist in transaction
3. No circular dependencies
4. Allocation sums must match `amount_settled`

### Reference Constraints

| Component | Can Reference |
|-----------|---------------|
| Arrangement | Nothing (entry point) |
| Accrual | Arrangements only |
| Anticipation | Arrangements, Accruals |
| Action | Arrangements, Accruals, Anticipations |

---

## Impact Assessment

### Benefits

| Benefit | Description |
|---------|-------------|
| **Transaction Fidelity** | Model what actually happened |
| **SMB Support** | Cash transactions without artificial arrangements |
| **Audit Completeness** | Payment clearing relationships preserved |
| **ERP Alignment** | Matches SAP, QuickBooks, NetSuite patterns |
| **Structured Finance** | Proper waterfall modeling |

### Breaking Changes

| Change | Impact | Mitigation |
|--------|--------|------------|
| `*_ref` â†’ `*_refs[]` | Existing code breaks | Auto-migration script |
| Arrangements optional | Validation logic changes | Update validators |
| New `allocations` field | Schema changes | Field is optional |

---

## Quick Reference

### v4.0 (Before)
```json
{
  "arrangement_ref": "ARR_ID",
  "accrual_ref": "ACC_ID",
  "anticipation_ref": "ANT_ID"
}
```

### v4.1 (After)
```json
{
  "arrangement_refs": ["ARR_ID_1", "ARR_ID_2"],
  "accrual_refs": ["ACC_ID_1", "ACC_ID_2"],
  "anticipation_refs": ["ANT_ID_1", "ANT_ID_2"],
  "allocations": [
    {"ref": "ANT_ID_1", "ref_type": "anticipation", "amount": 5000.00},
    {"ref": "ANT_ID_2", "ref_type": "anticipation", "amount": 5000.00}
  ]
}
```

---

## Files Delivered

1. `FORAY_Protocol_v4_1_Specification.md` â€” Complete specification
2. `FORAY_Protocol_v4_1_Change_Summary.md` â€” This summary document

---

**Document Version:** 1.0  
**Date:** January 25, 2026  
**Status:** DRAFT
