# FORAY Protocol - QuickBooks Integration

## Version 4.1

**Last Updated:** January 2026  
**Protocol Version:** FORAY v4.1  
**Author:** Marvin Percival

> **DISCLAIMER:** This code is provided for demonstration purposes only. Production implementations require additional security hardening, error handling, testing, and validation. All performance metrics and compliance statements are design goals, not guarantees. Consult qualified professionals for specific requirements.

---

## Overview

Convert QuickBooks Online transactions into immutable, privacy-preserving blockchain anchors using the FORAY 4-component model with v4.1 enhancements.

---

## What's New in v4.1

- ✅ **Flexible Entry Points** — Cash sales and adjusting entries no longer require artificial Arrangements
- ✅ **Many-to-Many References** — `_refs[]` arrays replace singular `_ref` fields
- ✅ **Batch Payment Allocations** — Single payment can clear multiple invoices with proper allocation tracking
- ✅ **Accrual-Only Transactions** — Depreciation and adjusting entries supported without Actions
- ✅ **Action-Only Transactions** — Cash receipts supported without Arrangements
- ✅ **Enhanced Privacy** — Salted formula IDs, instance pools, obfuscated references

---

## About This Document

This document describes integration patterns and API design for connecting QuickBooks Online to FORAY Protocol. It serves as a specification for adapter development.

> **Note:** This is a design document. Production adapters are planned for future releases.

---

## Supported Transaction Types

| Type | Status | Entry Point | FORAY Components |
|------|--------|-------------|------------------|
| Invoice | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Bill | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Payment | ✅ Supported | Action | ACT (refs to ANT/ACC/ARR) |
| Batch Payment | ✅ NEW v4.1 | Action | ACT with allocations[] |
| Credit Memo | ✅ Supported | Arrangement | ARR → ACC → ACT |
| Journal Entry | ✅ Supported | Accrual | ACC only (v4.1 flexible entry) |
| Sales Receipt | ✅ Supported | Action | ACT only (v4.1 flexible entry) |
| Depreciation | ✅ NEW v4.1 | Accrual | ACC only (no cash movement) |
| Payroll | 🔄 Planned | Arrangement | Future release |
| Inventory | 🔄 Planned | Arrangement | Future release |

---

## v4.1 Reference Structure

### Before (v4.0) — Singular References
```javascript
{
  "arrangement_ref": "ARR_001",
  "accrual_ref": "ACC_001",
  "anticipation_ref": "ANT_001"
}
```

### After (v4.1) — Array References
```javascript
{
  "arrangement_refs": ["ARR_001", "ARR_002"],
  "accrual_refs": ["ACC_001"],
  "anticipation_refs": ["ANT_001", "ANT_002", "ANT_003"]
}
```

---

## Privacy Levels

| Level | Amount Obfuscation | Identifier Hashing | Use Case |
|-------|-------------------|-------------------|----------|
| `minimal` | None | SHA-256 | Development/testing |
| `standard` | Round to $100 | SHA-256 + entity salt | Commercial enterprises |
| `high` | Round to $1,000 + noise | Multi-layer hash | Financial services |
| `defense` | Hash only (irreversible) | Salted formula IDs + instance pools | Defense contractors |

```javascript
const adapter = new QuickBooksForayAdapter({ 
  privacyLevel: 'standard',
  schemaVersion: '4.1'
});
```

---

## Basic Usage

### Anchor a Single Invoice (Full Lifecycle)

```javascript
const QuickBooksForayAdapter = require('./adapters/quickbooks-adapter');

const adapter = new QuickBooksForayAdapter({
  privacyLevel: 'standard',
  schemaVersion: '4.1',
  retryAttempts: 3,
  enableLogging: true
});

const invoice = {
  Id: 'INV-001',
  DocNumber: '1001',
  TotalAmt: 1500.00,
  CustomerRef: { name: 'Acme Corp', value: 'CUST-001' },
  DueDate: '2026-02-15',
  TxnDate: '2026-01-15',
  Balance: 1500.00
};

const result = await adapter.anchorInvoice(invoice);
// Returns v4.1 structure with arrangement_refs[], accrual_refs[], etc.
```

### Cash Sale (Action-Only — v4.1 Flexible Entry)

```javascript
const cashSale = {
  Id: 'CASH-001',
  TotalAmt: 47.50,
  TxnDate: '2026-01-25',
  PaymentMethod: 'cash'
};

const result = await adapter.anchorCashSale(cashSale);
// Creates Action-only transaction (no Arrangement required in v4.1)
// result.arrangements = []
// result.accruals = []
// result.anticipations = []
// result.actions = [{ id: 'ACT_CASH_SALE_001', ... }]
```

### Depreciation Entry (Accrual-Only — v4.1 Flexible Entry)

```javascript
const depreciation = {
  Id: 'DEP-001',
  TotalAmt: 5000.00,
  TxnDate: '2026-01-31',
  AccountRef: { name: 'Equipment', value: 'ACC-1510' },
  DepreciationMethod: 'straight_line'
};

const result = await adapter.anchorDepreciation(depreciation);
// Creates Accrual-only transaction (no Arrangement or Action in v4.1)
// result.arrangements = []
// result.accruals = [{ id: 'ACC_DEPRECIATION_001', arrangement_refs: [], ... }]
// result.anticipations = []
// result.actions = []
```

### Batch Payment (Many-to-Many — v4.1)

```javascript
const batchPayment = {
  Id: 'PAY-001',
  TotalAmt: 10000.00,
  TxnDate: '2026-01-25',
  PaymentMethod: 'wire',
  LinkedInvoices: [
    { TxnId: 'INV-001', Amount: 3000.00 },
    { TxnId: 'INV-002', Amount: 4000.00 },
    { TxnId: 'INV-003', Amount: 3000.00 }
  ]
};

const result = await adapter.anchorBatchPayment(batchPayment);
// Creates Action with multiple anticipation_refs and allocations[]
// result.actions[0].foray_core.anticipation_refs = ['ANT_INV_001', 'ANT_INV_002', 'ANT_INV_003']
// result.actions[0].foray_core.allocations = [
//   { ref: 'ANT_INV_001', ref_type: 'anticipation', amount: 3000.00, allocation_type: 'full' },
//   { ref: 'ANT_INV_002', ref_type: 'anticipation', amount: 4000.00, allocation_type: 'full' },
//   { ref: 'ANT_INV_003', ref_type: 'anticipation', amount: 3000.00, allocation_type: 'full' }
// ]
```

---

## FORAY v4.1 Component Mapping

### Invoice → FORAY

| QuickBooks Field | FORAY Component | v4.1 Field |
|------------------|-----------------|------------|
| CustomerRef | Arrangement | parties[] |
| SalesTermRef | Arrangement | terms.payment_terms |
| DueDate | Arrangement | terms.due_date |
| TotalAmt | Accrual | output (in foray_core) |
| Line items | Accrual | inputs |
| DueDate | Anticipation | expected_date |
| Balance = 0 | Action | settlement_status: 'completed' |

### v4.1 Output Structure

```javascript
{
  "transaction_id": "QB_INV_2026_Q1_001",
  "schema_version": "4.1",
  "timestamp": "2026-01-15T10:00:00Z",
  
  "foray_core": {
    "entity": "Your Company",
    "entity_hash": "sha256:...",
    "transaction_type": "invoice",
    "total_value": 1500.00,
    "currency": "USD",
    "status": "active",
    "compliance_flags": ["GAAP"]
  },
  
  "arrangements": [{
    "id": "ARR_QB_INV_001",
    "foray_core": {
      "type": "sales_agreement",
      "parties": [
        { "role": "seller", "name_hash": "sha256:..." },
        { "role": "buyer", "name_hash": "sha256:..." }
      ],
      "dependencies": []
    }
  }],
  
  "accruals": [{
    "id": "ACC_QB_INV_001",
    "foray_core": {
      "arrangement_refs": ["ARR_QB_INV_001"],  // v4.1: array
      "type": "revenue_recognition",
      "output": 1500.00,
      "dependencies": ["ARR_QB_INV_001"]
    }
  }],
  
  "anticipations": [{
    "id": "ANT_QB_INV_001",
    "foray_core": {
      "accrual_refs": ["ACC_QB_INV_001"],       // v4.1: array
      "arrangement_refs": ["ARR_QB_INV_001"],   // v4.1: new field
      "expected_amount": 1500.00,
      "expected_date": "2026-02-15",
      "probability_factor": 0.95,
      "dependencies": ["ACC_QB_INV_001"]
    }
  }],
  
  "actions": [{
    "id": "ACT_QB_INV_001",
    "foray_core": {
      "anticipation_refs": ["ANT_QB_INV_001"],  // v4.1: array
      "accrual_refs": ["ACC_QB_INV_001"],       // v4.1: new field
      "arrangement_refs": ["ARR_QB_INV_001"],   // v4.1: new field
      "amount_settled": 1500.00,
      "settlement_status": "completed",
      "allocations": [{                          // v4.1: new field
        "ref": "ANT_QB_INV_001",
        "ref_type": "anticipation",
        "amount": 1500.00,
        "allocation_type": "full"
      }],
      "dependencies": ["ANT_QB_INV_001"]
    }
  }],
  
  "merkle_root": "sha256:...",
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 2850000,
    "confirmation_time_ms": 1100,
    "anchored_at": "2026-01-15T10:00:02Z"
  }
}
```

---

## Compliance Support

> **Note:** FORAY provides evidence and audit trail capabilities that may support compliance. It does not constitute compliance by itself.

| Regulation | FORAY Support | Limitation |
|------------|---------------|------------|
| SOX 404 | Immutable evidence for controls | Does not replace control framework |
| GAAP/IFRS | Revenue recognition timestamps | Interpretation varies by auditor |
| GDPR | Hash-only on-chain option | Requires data minimization architecture |
| DCAA | Cost allocation documentation | Requires formula registry |

---

## Configuration Options

```javascript
const adapter = new QuickBooksForayAdapter({
  // Protocol version
  schemaVersion: '4.1',           // Use v4.1 structure
  
  // Privacy
  privacyLevel: 'standard',       // minimal, standard, high, defense
  entitySalt: 'custom-salt',      // Optional: provide your own salt
  
  // Error handling
  retryAttempts: 3,
  retryDelayMs: 1000,
  
  // Logging
  enableLogging: true,
  
  // FORAY SDK config
  foray: {
    kaspaNetwork: 'testnet-10',   // or 'mainnet'
    enableMerkleProofs: true
  }
});
```

---

## Migration from v2.0/v4.0

### Automatic Migration

The adapter auto-converts v4.0 transactions to v4.1:

```javascript
// v4.0 input (singular refs)
const v40Transaction = {
  accruals: [{
    foray_core: { arrangement_ref: "ARR_001" }
  }]
};

// Adapter auto-converts to v4.1 (array refs)
const result = adapter.migrateToV41(v40Transaction);
// result.accruals[0].foray_core.arrangement_refs = ["ARR_001"]
```

### Breaking Changes

| Change | v4.0 | v4.1 | Action Required |
|--------|------|------|-----------------|
| Reference fields | `*_ref` | `*_refs[]` | Update field names |
| Arrangements | Required | Optional | Remove artificial arrangements |
| Allocations | N/A | `allocations[]` | Add for batch payments |

---

## License

Business Source License 1.1 (BSL-1.1)

**Licensor:** Marvin Percival

**Permitted Use:**
- ✅ Internal use at single legal entity
- ✅ Evaluation and testing
- ✅ Academic research

**Prohibited Without License:**
- ❌ Commercial SaaS/multi-tenant hosting
- ❌ Managed service provider offerings

**Change Date:** January 25, 2030  
**Change License:** Apache License 2.0

---

## See Also

- [FORAY_Protocol_v4_1_Specification.md](./FORAY_Protocol_v4_1_Specification.md)
- [FORAY_Protocol_v4_1_Change_Summary.md](./FORAY_Protocol_v4_1_Change_Summary.md)
- [FORAY_Salesforce_Integration.md](./FORAY_Salesforce_Integration.md)

---

**Copyright © 2026 Marvin Percival. All rights reserved.**
