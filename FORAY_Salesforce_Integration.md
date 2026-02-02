# FORAY Protocol - Salesforce CRM Integration

## Version 2.0 (Corrected)

**Last Updated:** January 2026

> **DISCLAIMER:** This code is provided for demonstration purposes only. Production implementations require additional security hardening, error handling, testing, and validation. All performance metrics and compliance statements are design goals, not guarantees. Consult qualified professionals for specific requirements. See [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md) for complete disclaimer.

## Overview

Convert Salesforce CRM transactions (Opportunities, Quotes, Orders, Cases, Accounts, Leads) into immutable, privacy-preserving blockchain anchors using the FORAY 4-component model.

## What's New in v2.0

- +-+ **Input validation** on all adapter methods
- +-+ **Error handling** with configurable retry logic
- +-+ **Account** object support (Issue #13)
- +-+ **Lead** object support (Issue #13)
- +-+ **Standardized privacy levels** (minimal/standard/high/defense)
- +-+ **Clarified Case handling** - uses estimated values, not Salesforce data
- +-+ **Rate limiting** to prevent API abuse
- +-+ **Comprehensive logging** for troubleshooting
- +-+ **Disclaimers** added per Issue #1

## Quick Start

```bash
npm install
node examples/salesforce-demo.js
```

## Supported Salesforce Objects

| Object | Status | FORAY Components | Notes |
| Opportunity | +-+ Supported | Arrangement + Accrual + Anticipation + Action | Revenue lifecycle |
| Quote | +-+ Supported | Arrangement + Accrual + Anticipation + Action | Quote-to-cash |
| Order | +-+ Supported | Arrangement + Accrual + Anticipation + Action | Revenue recognition |
| Case | +-+ Supported | Arrangement + Accrual + Anticipation + Action | **See note below** |
| Account | +-+ NEW v2.0 | Arrangement + Accrual | Master data |
| Lead | +-+ NEW v2.0 | Arrangement + Action | Conversion tracking |
| Contact | +-++- Planned | Future release | |
| Custom Objects | +-++- Planned | Future release | |

### + Important: Case Object Handling

Cases in Salesforce **do not have monetary amounts**. The Accrual component for Cases uses **estimated values** based on priority heuristics:

```javascript
// These are ESTIMATES, not Salesforce fields:
{
  estimated_effort_hours: 8,    // High=8, Medium=4, Low=2
  estimated_cost: 800           // hours  x  $100/hour (configurable)
}
```

This is documented in the output metadata:
```javascript
metadata: {
  note: -> Estimated values based on priority heuristics, not Salesforce data'
}
```

## Privacy Levels (Standardized)

| Level | Amount Obfuscation | Identifier Hashing | Use Case |
| `minimal` | None | SHA-256 | Development/testing |
| `standard` | Round to $1,000 | SHA-256 + entity salt | Commercial enterprises |
| `high` | Round to $10,000 + noise | Multi-layer hash | Financial services |
| `defense` | Hash only (irreversible) | 3-layer privacy architecture (ZK-ready) | Defense contractors |

```javascript
const adapter = new SalesforceAdapter({ 
  privacyLevel: -> standard' // Options: minimal, standard, high, defense
});
```

## Basic Usage

### Convert Opportunity to FORAY

```javascript
const SalesforceAdapter = require('./src/salesforce-adapter');

const adapter = new SalesforceAdapter({
  privacyLevel: -> standard',
  retryAttempts: 3,
  enableLogging: true
});

const opportunity = {
  Id: -> 0061234567890ABC',
  AccountId: -> 0011234567890DEF',
  OwnerId: -> 0051234567890GHI',
  Amount: 250000,
  Probability: 75,
  StageName: -> Proposal/Price Quote',
  CloseDate: -> 2026-03-15',
  CreatedDate: -> 2026-01-10T09:00:00Z',
  IsClosed: false,
  IsWon: false
};

const result = await adapter.opportunityToForay(opportunity);
console.log(`Transaction ID: ${result.transaction_id}`);
```

### Batch Processing

```javascript
const opportunities = [opp1, opp2, opp3];
const results = await adapter.batchProcess(opportunities, -> Opportunity');

console.log(`Total: ${results.total}`);
console.log(`Succeeded: ${results.succeeded}`);
console.log(`Failed: ${results.failed}`);
```

## FORAY Component Mapping

### Opportunity + FORAY

| Salesforce Field | FORAY Component | Mapping |
| AccountId, OwnerId | Arrangement | parties[] (hashed) |
| StageName, Type | Arrangement | terms (hashed) |
| Amount  x  Probability | Accrual | Expected revenue (obfuscated) |
| CloseDate | Anticipation | expected_date |
| StageName = -> Closed Won' | Action | settlement_type: -> opportunity_won' |

**Revenue Calculation:**
```
Expected Revenue = Amount  x  (Probability / 100)
Risk-Adjusted = Expected Revenue  x  0.85 (15% haircut)
```

### Quote + FORAY

| Salesforce Field | FORAY Component | Mapping |
| AccountId | Arrangement | parties[] (hashed) |
| QuoteNumber, Status | Arrangement | terms (hashed) |
| Subtotal - Discount + Tax + Shipping | Accrual | GrandTotal (obfuscated) |
| ExpirationDate | Anticipation | expected_date |
| Status = -> Accepted' | Action | settlement_type: -> quote_accepted' |

### Case + FORAY (No Monetary Amount)

| Salesforce Field | FORAY Component | Mapping |
| AccountId, ContactId | Arrangement | parties[] (hashed) |
| CaseNumber, Type, Priority | Arrangement | terms (hashed) |
| Priority-based estimate | Accrual | **Estimated** effort/cost |
| SLA deadline | Anticipation | expected_date |
| IsClosed = true | Action | settlement_type: -> case_closed' |

## Error Handling (v2.0)

### ValidationError

```javascript
const { ValidationError } = require('./src/salesforce-adapter');

try {
  await adapter.opportunityToForay(invalidOpp);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed: ${error.field} - ${error.message}`);
  }
}
```

### Retry Logic

```javascript
const adapter = new SalesforceAdapter({
  retryAttempts: 3,     // Number of retry attempts
  retryDelayMs: 1000,   // Initial delay (increases with each retry)
  enableLogging: true   // Log retry attempts
});
```

## Cross-System Reconciliation

### Salesforce +-++-+ QuickBooks

Link Salesforce Quote to QuickBooks Invoice via shared transaction hash:

```javascript
// 1. Convert Salesforce Quote
const quote = await salesforceAdapter.quoteToForay(sfQuote);
// quote.transaction_id = "a7f3e9..."

// 2. Create QuickBooks Invoice with reference
const invoice = await quickbooksAdapter.anchorInvoice(qbInvoice, {
  linked_transactions: {
    salesforce_quote: quote.transaction_id
  }
});

// 3. Automatic reconciliation
const linked = await foray.findLinkedTransactions(quote.transaction_id);
// Returns: [quote, invoice]
```

**Benefits:**
- No manual matching required
- Cryptographic proof of Quote + Invoice linkage
- Cross-system audit trail

## Integration Patterns

### Pattern 1: Real-Time Webhook

```javascript
// AWS Lambda handler
exports.handler = async (event) => {
  const adapter = new SalesforceAdapter({ privacyLevel: -> high' });

  const payload = JSON.parse(event.body);
  const result = await adapter.handleWebhook({
    objectType: -> Opportunity',
    operation: -> update',
    record: payload.sObject
  });

  return { 
    statusCode: 200,
    body: JSON.stringify({ transaction_id: result.transaction_id })
  };
};
```

**Setup:**
1. Salesforce: Workflow Rule + Outbound Message + Lambda endpoint
2. Lambda converts and anchors to Kaspa
3. Sub-second finality (per Kaspa documentation)

### Pattern 2: Batch Processing (Nightly)

```javascript
const jsforce = require('jsforce');

// Query updated records
const conn = new jsforce.Connection({ /* auth */ });
const opportunities = await conn.query(`
  SELECT Id, Amount, Probability, CloseDate, StageName
  FROM Opportunity
  WHERE LastModifiedDate > YESTERDAY
`);

// Batch process
const results = await adapter.batchProcess(
  opportunities.records, 
  -> Opportunity'
);
```

### Pattern 3: Change Data Capture

```javascript
// Subscribe to Salesforce CDC events
client.subscribe('/data/OpportunityChangeEvent', async (message) => {
  const record = message.payload;
  const transaction = await adapter.opportunityToForay(record);
  await adapter.foray.anchorTransaction(transaction);
});
```

## Compliance Support

> **Note:** FORAY provides evidence and audit trail capabilities that may support compliance. It does not constitute compliance by itself. Organizations must implement appropriate controls and consult qualified professionals.

| Regulation | FORAY Support | Limitation |
| ASC 606 / IFRS 15 | Revenue recognition timestamps | Interpretation varies |
| SOX 404 | Immutable evidence for controls | Does not replace controls |
| GDPR | Hash-only on-chain option | Requires data minimization |
| Customer SLA | Case resolution timestamps | SLA terms vary by contract |

## Performance Characteristics

> **Note:** These are design goals based on theoretical analysis. Actual performance depends on implementation, infrastructure, and network conditions.

| Metric | Design Goal | Dependency |
| Conversion time | <100ms | Local processing |
| Blockchain finality | Per Kaspa documentation | Network conditions |
| Batch throughput | ~1,000/min | Salesforce API limits |

## Configuration Options

```javascript
const adapter = new SalesforceAdapter({
  // Privacy
  privacyLevel: -> standard',      // minimal, standard, high, defense
  entitySalt: -> custom-salt',     // Optional: provide your own salt

  // Salesforce
  salesforceInstanceUrl: -> https://your-instance.salesforce.com',

  // Error handling
  retryAttempts: 3,              // Number of retries on failure
  retryDelayMs: 1000,            // Base delay between retries

  // Rate limiting
  minRequestInterval: 100,       // Minimum ms between requests

  // Logging
  enableLogging: true,           // Enable detailed logging

  // FORAY SDK config
  forayConfig: {
    kaspaAddress: -> kaspa:...',
    enableMerkleProofs: true
  }
});
```

## File Structure

```
foray-salesforce-demo/
++++-++|++-++|+ README.md                      # This file
++++-++|++-++|+ DISCLAIMER.md                  # Full legal disclaimer
++++-++|++-++|+ SALESFORCE_INTEGRATION.md      # Detailed integration guide
++++-++|++-++|+ LICENSE                        # BSL-1.1
++++-++|++-++|+ package.json
++++-++|++-++|+ src/
+-++-+   ++++-++|++-++|+ foray-sdk.js              # Core FORAY SDK
+-++-+   ++++-++|++-++|+ salesforce-adapter.js     # Salesforce adapter (v2.0)
++++-++|++-++|+ examples/
    ++++-++|++-++|+ salesforce-demo.js        # Working demonstration
```

## Changelog

### v2.0.0 (January 2026) - Corrected Release

**Added:**
- Input validation with ValidationError class
- Error handling with configurable retry logic
- Account object support
- Lead object support
- Rate limiting
- Comprehensive timestamped logging

**Changed:**
- Standardized privacy levels (minimal/standard/high/defense)
- Clarified Case Accrual uses estimates, not Salesforce data
- Improved documentation with explicit limitations

**Fixed:**
- Missing validation on constructor parameters
- Inconsistent amount obfuscation across objects

### v1.0.0 (January 2026) - Initial Release

- Opportunity, Quote, Order, Case support
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
- [FORAY_QuickBooks_Integration.md](./FORAY_QuickBooks_Integration.md)
