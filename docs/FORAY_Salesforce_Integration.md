# FORAY Protocol - Salesforce CRM Integration

## Version 4.1

**Last Updated:** January 2026  
**Protocol Version:** FORAY v4.1  
**Author:** Marvin Percival

> **DISCLAIMER:** This code is provided for demonstration purposes only. Production implementations require additional security hardening, error handling, testing, and validation. All performance metrics and compliance statements are design goals, not guarantees. Consult qualified professionals for specific requirements.

---

## Overview

Convert Salesforce CRM transactions (Opportunities, Quotes, Orders, Cases, Accounts, Leads) into immutable, privacy-preserving blockchain anchors using the FORAY 4-component model with v4.1 enhancements.

---

## What's New in v4.1

- ✅ **Flexible Entry Points** — Lead conversions and quick closes no longer require artificial Arrangements
- ✅ **Many-to-Many References** — `_refs[]` arrays replace singular `_ref` fields
- ✅ **Multi-Quote Deals** — Single Opportunity can reference multiple Quotes with proper tracking
- ✅ **Consolidated Payments** — Single payment can clear multiple invoices from different Opportunities
- ✅ **Enhanced ASC 606 Support** — Revenue recognition with multiple performance obligations
- ✅ **Salesforce CPQ Integration** — Quote-to-cash with v4.1 allocation tracking

---

## Quick Start

```bash
npm install
node examples/salesforce-demo.js
```

---

## Supported Salesforce Objects

| Object | Status | Entry Point | FORAY Components |
|--------|--------|-------------|------------------|
| Opportunity | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Quote | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Order | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Case | ✅ Supported | Arrangement | ARR → ACC → ANT → ACT |
| Account | ✅ Supported | Arrangement | ARR → ACC (master data) |
| Lead | ✅ Supported | Action | ACT only (v4.1 flexible entry) |
| CPQ Quote | ✅ NEW v4.1 | Arrangement | Multi-line with allocations[] |
| Contact | 🔄 Planned | Future release | |
| Custom Objects | 🔄 Planned | Future release | |

---

## v4.1 Reference Structure

### Before (v4.0) — Singular References
```javascript
{
  "arrangement_ref": "ARR_OPP_001",
  "accrual_ref": "ACC_REV_001",
  "anticipation_ref": "ANT_PAY_001"
}
```

### After (v4.1) — Array References
```javascript
{
  "arrangement_refs": ["ARR_OPP_001", "ARR_QUOTE_001"],
  "accrual_refs": ["ACC_REV_001", "ACC_REV_002"],
  "anticipation_refs": ["ANT_PAY_001", "ANT_PAY_002"]
}
```

---

## Privacy Levels

| Level | Amount Obfuscation | Identifier Hashing | Use Case |
|-------|-------------------|-------------------|----------|
| `minimal` | None | SHA-256 | Development/testing |
| `standard` | Round to $1,000 | SHA-256 + entity salt | Commercial enterprises |
| `high` | Round to $10,000 + noise | Multi-layer hash | Financial services |
| `defense` | Hash only (irreversible) | Salted formula IDs + instance pools | Defense contractors |

```javascript
const adapter = new SalesforceAdapter({ 
  privacyLevel: 'standard',
  schemaVersion: '4.1'
});
```

---

## Basic Usage

### Convert Opportunity to FORAY (Full Lifecycle)

```javascript
const SalesforceAdapter = require('./adapters/salesforce-adapter');

const adapter = new SalesforceAdapter({
  privacyLevel: 'standard',
  schemaVersion: '4.1',
  retryAttempts: 3,
  enableLogging: true
});

const opportunity = {
  Id: '006Dn000004XyZ1ABC',
  AccountId: '001Dn000003ABC1DEF',
  OwnerId: '005Dn000001XYZ9ABC',
  Amount: 125000,
  Probability: 90,
  StageName: 'Negotiation/Review',
  CloseDate: '2026-03-15',
  CreatedDate: '2026-01-10T09:00:00Z',
  IsClosed: false,
  IsWon: false
};

const result = await adapter.opportunityToForay(opportunity);
// Returns v4.1 structure with arrangement_refs[], accrual_refs[], etc.
```

### Multi-Quote Opportunity (Many-to-Many — v4.1)

```javascript
const opportunity = {
  Id: '006Dn000004XyZ1ABC',
  Amount: 125000,
  LinkedQuotes: [
    { Id: '0Q0Dn000000ABC1', Amount: 100000 },  // Platform license
    { Id: '0Q0Dn000000ABC2', Amount: 15000 },   // Support
    { Id: '0Q0Dn000000ABC3', Amount: 10000 }    // Services
  ]
};

const result = await adapter.opportunityWithQuotesToForay(opportunity);
// Creates multiple Arrangements linked to single Opportunity
// result.arrangements = [
//   { id: 'ARR_OPP_001', ... },
//   { id: 'ARR_QUOTE_001', foray_core: { arrangement_refs: ['ARR_OPP_001'] } },
//   { id: 'ARR_QUOTE_002', foray_core: { arrangement_refs: ['ARR_OPP_001'] } },
//   { id: 'ARR_QUOTE_003', foray_core: { arrangement_refs: ['ARR_OPP_001'] } }
// ]
```

### Lead Conversion (Action-Only — v4.1 Flexible Entry)

```javascript
const lead = {
  Id: '00Q1234567890ABC',
  ConvertedDate: '2026-01-20',
  ConvertedAccountId: '001Dn000003ABC1DEF',
  ConvertedContactId: '003Dn000004XYZ1ABC',
  ConvertedOpportunityId: '006Dn000005DEF1GHI',
  Status: 'Converted'
};

const result = await adapter.leadConversionToForay(lead);
// Creates Action-only transaction (v4.1 flexible entry)
// result.arrangements = []
// result.accruals = []
// result.anticipations = []
// result.actions = [{
//   id: 'ACT_LEAD_CONVERT_001',
//   foray_core: {
//     type: 'lead_conversion',
//     arrangement_refs: [],  // No prior arrangement
//     details: { converted_to_opportunity: '006Dn000005DEF1GHI' }
//   }
// }]
```

### Closed Won with Payment (Full Chain — v4.1)

```javascript
const closedWon = {
  opportunity: {
    Id: '006Dn000004XyZ1ABC',
    Amount: 125000,
    StageName: 'Closed Won',
    IsClosed: true,
    IsWon: true
  },
  payment: {
    amount: 125000,
    method: 'wire',
    reference: 'WIR-2026012200145'
  }
};

const result = await adapter.closedWonWithPaymentToForay(closedWon);
// Creates full v4.1 chain with allocations
// result.actions[0].foray_core.allocations = [{
//   ref: 'ANT_PAYMENT_001',
//   ref_type: 'anticipation',
//   amount: 125000.00,
//   allocation_type: 'full',
//   remaining_balance: 0.00
// }]
```

---

## FORAY v4.1 Component Mapping

### Opportunity → FORAY

| Salesforce Field | FORAY Component | v4.1 Field |
|------------------|-----------------|------------|
| AccountId, OwnerId | Arrangement | parties[] (hashed) |
| StageName, Type | Arrangement | terms (hashed) |
| Amount × Probability | Accrual | output (risk-adjusted) |
| CloseDate | Anticipation | expected_date |
| StageName = 'Closed Won' | Action | settlement_status: 'completed' |

### v4.1 Output Structure

```javascript
{
  "transaction_id": "SF_OPP_2026_Q1_ACME_ENTERPRISE",
  "schema_version": "4.1",
  "timestamp": "2026-01-22T10:00:00Z",
  
  "foray_core": {
    "entity": "CloudTech Solutions",
    "entity_hash": "sha256:...",
    "transaction_type": "salesforce_opportunity",
    "total_value": 125000.00,
    "currency": "USD",
    "status": "closed_won",
    "compliance_flags": ["ASC_606", "SOX_404"]
  },
  
  "source_system": {
    "type": "Salesforce",
    "instance": "cloudtech.salesforce.com",
    "api_version": "v59.0"
  },
  
  "arrangements": [
    {
      "id": "ARR_SF_OPPORTUNITY",
      "foray_core": {
        "type": "sales_opportunity",
        "parties": [
          { "role": "seller", "name_hash": "sha256:..." },
          { "role": "buyer", "name_hash": "sha256:..." }
        ],
        "salesforce_refs": {
          "opportunity_id": "006Dn000004XyZ1ABC",
          "account_id": "001Dn000003ABC1DEF"
        },
        "dependencies": []
      }
    },
    {
      "id": "ARR_SF_QUOTE",
      "foray_core": {
        "type": "sales_quote",
        "arrangement_refs": ["ARR_SF_OPPORTUNITY"],  // v4.1: links to parent
        "salesforce_refs": {
          "quote_id": "0Q0Dn000000ABC1DEF"
        },
        "dependencies": ["ARR_SF_OPPORTUNITY"]
      }
    }
  ],
  
  "accruals": [{
    "id": "ACC_REVENUE_RECOGNITION_Y1",
    "foray_core": {
      "arrangement_refs": ["ARR_SF_OPPORTUNITY", "ARR_SF_QUOTE"],  // v4.1: multiple
      "type": "revenue_recognition",
      "computation_method": "Calculated",
      "formula_id": "sha256:asc606_rev...",
      "inputs": {
        "total_contract_value": 125000.00,
        "performance_obligations": 3
      },
      "output": 41666.67,
      "dependencies": ["ARR_SF_QUOTE"]
    }
  }],
  
  "anticipations": [{
    "id": "ANT_CUSTOMER_PAYMENT",
    "foray_core": {
      "accrual_refs": ["ACC_REVENUE_RECOGNITION_Y1"],      // v4.1: array
      "arrangement_refs": ["ARR_SF_OPPORTUNITY"],          // v4.1: new field
      "expected_amount": 125000.00,
      "expected_date": "2026-01-25",
      "probability_factor": 0.99,
      "dependencies": ["ACC_REVENUE_RECOGNITION_Y1"]
    }
  }],
  
  "actions": [
    {
      "id": "ACT_CONTRACT_EXECUTION",
      "foray_core": {
        "anticipation_refs": [],
        "accrual_refs": [],
        "arrangement_refs": ["ARR_SF_OPPORTUNITY", "ARR_SF_QUOTE"],  // v4.1: multiple
        "type": "contract_execution",
        "settlement_status": "completed",
        "dependencies": ["ARR_SF_QUOTE"]
      }
    },
    {
      "id": "ACT_PAYMENT_RECEIVED",
      "foray_core": {
        "anticipation_refs": ["ANT_CUSTOMER_PAYMENT"],      // v4.1: array
        "accrual_refs": ["ACC_REVENUE_RECOGNITION_Y1"],     // v4.1: new field
        "arrangement_refs": ["ARR_SF_OPPORTUNITY"],         // v4.1: new field
        "type": "payment_receipt",
        "amount_settled": 125000.00,
        "settlement_status": "completed",
        "allocations": [{                                    // v4.1: new field
          "ref": "ANT_CUSTOMER_PAYMENT",
          "ref_type": "anticipation",
          "amount": 125000.00,
          "allocation_type": "full",
          "remaining_balance": 0.00
        }],
        "dependencies": ["ANT_CUSTOMER_PAYMENT"]
      }
    }
  ],
  
  "merkle_root": "sha256:...",
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 2850600,
    "confirmation_time_ms": 1020,
    "anchored_at": "2026-01-22T10:00:02Z"
  }
}
```

---

## Cross-System Reconciliation

### Salesforce ↔ QuickBooks (v4.1)

Link Salesforce Quote to QuickBooks Invoice via shared transaction references:

```javascript
// 1. Convert Salesforce Opportunity with Quote
const sfResult = await salesforceAdapter.opportunityWithQuotesToForay(sfOpp);
// sfResult.transaction_id = "SF_OPP_2026_Q1_001"
// sfResult.arrangements includes ARR_SF_QUOTE_001

// 2. Create QuickBooks Invoice referencing the Salesforce transaction
const qbInvoice = {
  ...invoiceData,
  LinkedTransactions: [{
    foray_transaction_id: sfResult.transaction_id,
    foray_arrangement_id: 'ARR_SF_QUOTE_001'
  }]
};

const qbResult = await quickbooksAdapter.anchorInvoice(qbInvoice);
// qbResult includes cross-reference in arrangement_refs[]

// 3. Query linked transactions
const linked = await foray.findLinkedTransactions(sfResult.transaction_id);
// Returns: [sfResult, qbResult] with full audit chain
```

---

## Integration Patterns

### Pattern 1: Real-Time Platform Event

```javascript
// Salesforce Platform Event subscriber
const adapter = new SalesforceAdapter({ 
  privacyLevel: 'high',
  schemaVersion: '4.1'
});

client.subscribe('/event/Opportunity_Closed__e', async (event) => {
  const result = await adapter.opportunityToForay(event.payload);
  
  // Anchor to Kaspa
  const anchor = await foray.anchor(result);
  
  // Update Salesforce with blockchain reference
  await conn.sobject('Opportunity').update({
    Id: event.payload.OpportunityId__c,
    FORAY_Transaction_ID__c: result.transaction_id,
    FORAY_Kaspa_Hash__c: anchor.kaspa_tx_id
  });
});
```

### Pattern 2: Batch Processing (Nightly)

```javascript
const jsforce = require('jsforce');

const conn = new jsforce.Connection({ /* auth */ });
const opportunities = await conn.query(`
  SELECT Id, Amount, Probability, CloseDate, StageName,
         (SELECT Id, QuoteNumber, GrandTotal FROM Quotes)
  FROM Opportunity
  WHERE LastModifiedDate > YESTERDAY
    AND StageName = 'Closed Won'
`);

// Batch process with v4.1 multi-quote support
const results = await adapter.batchProcess(
  opportunities.records, 
  'OpportunityWithQuotes'
);
```

---

## Compliance Support

> **Note:** FORAY provides evidence and audit trail capabilities that may support compliance. It does not constitute compliance by itself.

| Regulation | FORAY Support | Limitation |
|------------|---------------|------------|
| ASC 606 / IFRS 15 | Revenue recognition with multiple performance obligations | Interpretation varies |
| SOX 404 | Immutable evidence for controls | Does not replace controls |
| GDPR | Hash-only on-chain option | Requires data minimization |
| Customer SLA | Case resolution timestamps | SLA terms vary by contract |

---

## Configuration Options

```javascript
const adapter = new SalesforceAdapter({
  // Protocol version
  schemaVersion: '4.1',
  
  // Privacy
  privacyLevel: 'standard',
  entitySalt: 'custom-salt',
  
  // Salesforce
  salesforceInstanceUrl: 'https://your-instance.salesforce.com',
  
  // Error handling
  retryAttempts: 3,
  retryDelayMs: 1000,
  
  // Logging
  enableLogging: true,
  
  // FORAY SDK config
  forayConfig: {
    kaspaNetwork: 'testnet-10',
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
  anticipations: [{
    foray_core: { accrual_ref: "ACC_001" }
  }]
};

// Adapter auto-converts to v4.1 (array refs)
const result = adapter.migrateToV41(v40Transaction);
// result.anticipations[0].foray_core.accrual_refs = ["ACC_001"]
// result.anticipations[0].foray_core.arrangement_refs = []  // new field
```

### Breaking Changes

| Change | v4.0 | v4.1 | Action Required |
|--------|------|------|-----------------|
| Reference fields | `*_ref` | `*_refs[]` | Update field names |
| Arrangements | Required | Optional | Remove artificial arrangements |
| Allocations | N/A | `allocations[]` | Add for payments |
| source_system | N/A | Optional | Add for traceability |

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
- [FORAY_QuickBooks_Integration.md](./FORAY_QuickBooks_Integration.md)

---

**Copyright © 2026 Marvin Percival. All rights reserved.**
