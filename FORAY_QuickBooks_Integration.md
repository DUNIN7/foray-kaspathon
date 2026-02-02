# FORAY Protocol - QuickBooks Integration

## Version 2.0 (Corrected)

**Last Updated:** January 2026

> **DISCLAIMER:** This code is provided for demonstration purposes only. Production implementations require additional security hardening, error handling, testing, and validation. All performance metrics and compliance statements are design goals, not guarantees. Consult qualified professionals for specific requirements. See [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md) for complete disclaimer.

## Overview

Convert QuickBooks Online transactions into immutable, privacy-preserving blockchain anchors using the FORAY 4-component model.

## What's New in v2.0

- +-+ **Input validation** on all adapter methods
- +-+ **Error handling** with configurable retry logic
- +-+ **Credit Memos** support (Issue #12)
- +-+ **Journal Entries** support (Issue #12)
- +-+ **Standardized privacy levels** (minimal/standard/high/defense)
- +-+ **Rate limiting** to prevent API abuse
- +-+ **Comprehensive logging** for troubleshooting
- +-+ **Disclaimers** added per Issue #1

## Quick Start

```bash
npm install
node examples/invoice-demo.js
```

## Supported Transaction Types

| Type | Status | FORAY Components |
| Invoice | +-+ Supported | Arrangement + Accrual + Anticipation + Action |
| Bill | +-+ Supported | Arrangement + Accrual + Anticipation + Action |
| Payment | +-+ Supported | Action (linked to Invoice/Bill) |
| Credit Memo | +-+ NEW v2.0 | Arrangement + Accrual + Action |
| Journal Entry | +-+ NEW v2.0 | Arrangement + Accrual + Action |
| Sales Receipt | +-+ Supported | Arrangement + Accrual + Action |
| Payroll | +-++- Planned | Future release |
| Inventory | +-++- Planned | Future release |

## Privacy Levels (Standardized)

| Level | Amount Obfuscation | Identifier Hashing | Use Case |
| `minimal` | None | SHA-256 | Development/testing |
| `standard` | Round to $100 | SHA-256 + entity salt | Commercial enterprises |
| `high` | Round to $1,000 + noise | Multi-layer hash | Financial services |
| `defense` | Hash only (irreversible) | 3-layer privacy architecture (ZK-ready) | Defense contractors |

```javascript
const adapter = new QuickBooksForayAdapter({ 
  privacyLevel: -> standard' // Options: minimal, standard, high, defense
});
```

## Basic Usage

### Anchor a Single Invoice

```javascript
const QuickBooksForayAdapter = require('./src/quickbooks-adapter');

const adapter = new QuickBooksForayAdapter({
  privacyLevel: -> standard',
  retryAttempts: 3,
  enableLogging: true
});

const invoice = {
  Id: -> INV-001',
  DocNumber: -> 1001',
  TotalAmt: 1500.00,
  CustomerRef: { name: -> Acme Corp', value: -> CUST-001' },
  DueDate: -> 2026-02-15',
  TxnDate: -> 2026-01-15',
  Balance: 1500.00 // Unpaid
};

const result = await adapter.anchorInvoice(invoice);
console.log(`Transaction ID: ${result.transaction.id}`);
console.log(`Kaspa Hash: ${result.anchor.kaspaHash}`);
```

### Batch Processing

```javascript
const invoices = [invoice1, invoice2, invoice3];
const results = await adapter.batchProcess(invoices, -> Invoice');

console.log(`Total: ${results.total}`);
console.log(`Succeeded: ${results.succeeded}`);
console.log(`Failed: ${results.failed}`);

// Handle failures
results.errors.forEach(error => {
  console.error(`${error.transaction_id}: ${error.error}`);
});
```

## Error Handling (v2.0)

### ValidationError

```javascript
const { ValidationError } = require('./src/quickbooks-adapter');

try {
  await adapter.anchorInvoice(invalidInvoice);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed: ${error.field} - ${error.message}`);
  }
}
```

### Retry Logic

```javascript
const adapter = new QuickBooksForayAdapter({
  retryAttempts: 3,     // Number of retry attempts
  retryDelayMs: 1000,   // Initial delay (increases with each retry)
  enableLogging: true   // Log retry attempts
});
```

## FORAY Component Mapping

### Invoice + FORAY

| QuickBooks Field | FORAY Component | Field |
| CustomerRef | Arrangement | parties[].identifier (hashed) |
| SalesTermRef | Arrangement | terms.payment_terms |
| DueDate | Arrangement | terms.due_date |
| TotalAmt | Accrual | amount (obfuscated) |
| Line items | Accrual | formula_inputs |
| DueDate | Anticipation | expected_date |
| Balance = 0 | Action | settlement_type: -> full_payment' |

### Credit Memo + FORAY (NEW v2.0)

```javascript
const creditMemo = {
  Id: -> CM-001',
  DocNumber: -> CM-1001',
  TotalAmt: 200.00,
  CustomerRef: { name: -> Acme Corp', value: -> CUST-001' },
  LinkedTxn: [{ TxnId: -> INV-001', TxnType: -> Invoice' }],
  TxnDate: -> 2026-01-20'
};

const result = await adapter.anchorCreditMemo(creditMemo);
// Creates negative Accrual (revenue reversal)
```

### Journal Entry + FORAY (NEW v2.0)

```javascript
const journalEntry = {
  Id: -> JE-001',
  DocNumber: -> JE-1001',
  Line: [
    { Amount: 1000, JournalEntryLineDetail: { PostingType: -> Debit' } },
    { Amount: 1000, JournalEntryLineDetail: { PostingType: -> Credit' } }
  ],
  TxnDate: -> 2026-01-31'
};

const result = await adapter.anchorJournalEntry(journalEntry);
// Accrual captures total debits (balanced with credits)
```

## Compliance Support

> **Note:** FORAY provides evidence and audit trail capabilities that may support compliance. It does not constitute compliance by itself. Organizations must implement appropriate controls and consult qualified professionals.

| Regulation | FORAY Support | Limitation |
| SOX 404 | Immutable evidence for controls | Does not replace control framework |
| GAAP/IFRS | Revenue recognition timestamps | Interpretation varies by auditor |
| GDPR | Hash-only on-chain option | Requires data minimization architecture |
| DCAA | Cost allocation documentation | Requires formula registry |

## Performance Characteristics

> **Note:** These are design goals based on theoretical analysis. Actual performance depends on implementation, infrastructure, and network conditions.

| Metric | Design Goal | Dependency |
| Conversion time | <100ms | Local processing |
| Blockchain finality | Per Kaspa documentation | Network conditions |
| Batch throughput | ~1,000/min | API rate limits |

## File Structure

```
foray-quickbooks-demo/
++++-++|++-++|+ README.md                    # This file
++++-++|++-++|+ DISCLAIMER.md               # Full legal disclaimer
++++-++|++-++|+ LICENSE                     # BSL-1.1
++++-++|++-++|+ package.json
++++-++|++-++|+ src/
+-++-+   ++++-++|++-++|+ foray-sdk.js           # Core FORAY SDK
+-++-+   ++++-++|++-++|+ quickbooks-adapter.js  # QuickBooks adapter (v2.0)
++++-++|++-++|+ examples/
    ++++-++|++-++|+ invoice-demo.js        # Working demonstration
```

## Configuration Options

```javascript
const adapter = new QuickBooksForayAdapter({
  // Privacy
  privacyLevel: -> standard',      // minimal, standard, high, defense
  entitySalt: -> custom-salt',     // Optional: provide your own salt

  // Error handling
  retryAttempts: 3,              // Number of retries on failure
  retryDelayMs: 1000,            // Base delay between retries

  // Rate limiting
  minRequestInterval: 100,       // Minimum ms between requests

  // Logging
  enableLogging: true,           // Enable detailed logging

  // FORAY SDK config
  foray: {
    kaspaAddress: -> kaspa:...',
    enableMerkleProofs: true
  }
});
```

## Changelog

### v2.0.0 (January 2026) - Corrected Release

**Added:**
- Input validation with ValidationError class
- Error handling with configurable retry logic
- Credit Memo transaction support
- Journal Entry transaction support
- Rate limiting
- Comprehensive timestamped logging

**Changed:**
- Standardized privacy levels (minimal/standard/high/defense)
- Improved null/undefined handling

**Fixed:**
- Missing validation on constructor parameters
- Inconsistent amount obfuscation

### v1.0.0 (January 2026) - Initial Release

- Invoice, Bill, Payment, Sales Receipt support
- Basic privacy obfuscation
- Blockchain anchoring via Kaspa

## License

Business Source License 1.1 (BSL-1.1)

**Permitted Use:**
- +-+ Internal use at single legal entity (free)
- +-+ Evaluation and testing (free)
- +-+ Academic research (free)

**Prohibited Without License:**
- + Commercial SaaS/multi-tenant hosting
- + Managed service provider offerings

**Change Date:** January 19, 2030  
**Change License:** Apache License 2.0

## See Also

- [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md)
- [FORAY_Technical_Assumptions_Weaknesses.md](./FORAY_Technical_Assumptions_Weaknesses.md)
- [FORAY_Salesforce_Integration.md](./FORAY_Salesforce_Integration.md)
