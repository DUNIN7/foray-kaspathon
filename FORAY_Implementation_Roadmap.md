# FORAY Protocol: Implementation Roadmap for Unresolved Issues

## Issues Requiring Future Implementation Work

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Purpose:** Detailed implementation guidance for issues not resolvable through documentation alone

> **DISCLAIMER:** See [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md) for important legal and technical disclaimers.

## Executive Summary

This document outlines 7 issues from the Technical Assumptions & Weaknesses analysis that **cannot be resolved through documentation corrections alone** and require actual implementation work.

| # | Issue | Type | Priority | Effort |
| 6 | GDPR data processing guidance | Legal + Technical | HIGH | 2 days + legal |
| 7 | Verify Kaspa API/parameters | Verification | HIGH | 4 hours |
| 8 | Test adapters against sandbox APIs | Testing | HIGH | 3 days |
| 9 | Create formal threat model | Security | MEDIUM | 1 week |
| 10 | Add unit tests (>80% coverage) | Development | MEDIUM | 1 week |
| 11 | Create compliance mapping docs | Compliance | MEDIUM | 1 week |
| 14 | Create troubleshooting guides | Support | MEDIUM | 2 days |

## Issue 6: GDPR Data Processing Guidance

### Problem Statement

FORAY's immutability feature potentially conflicts with GDPR Article 17 "Right to Erasure" (Right to be Forgotten). Current documentation does not address how organizations should handle this conflict.

### Proposed Solutions

#### Approach 1: Data Minimization Architecture (Recommended)

Store ONLY cryptographic hashes on-chain; all identifiable data remains off-chain.

```
ON-CHAIN (immutable):
++++-++|++-++|+ Transaction hash (SHA-256)
++++-++|++-++|+ Timestamp
++++-++|++-++|+ Merkle root
++++-++|++-++|+ NO personal identifiers

OFF-CHAIN (deletable):
++++-++|++-++|+ Full transaction details
++++-++|++-++|+ Personal identifiers
++++-++|++-++|+ Customer names, addresses
++++-++|++-++|+ Can be deleted per GDPR request
```

**Verification After Deletion:**
- Hash on-chain proves transaction existed
- Off-chain data deletion satisfies GDPR
- Audit integrity maintained (hash unchanged)

#### Approach 2: Encryption-Based Deletion

Encrypt personal data with unique keys; delete key = effective deletion.

```javascript
// Storage
customer_name: ENCRYPT(key_123, "John Smith")

// Deletion
DELETE key_123 FROM key_store
// + customer_name becomes unrecoverable
// + Hash on-chain still exists but is meaningless
```

#### Approach 3: Consent-Based Retention

Obtain explicit consent for blockchain retention; document consent in FORAY.

```javascript
// Consent record as FORAY Arrangement
{
  type: "consent_record",
  subject: hash(customer_id),
  purpose: "Immutable audit trail retention",
  duration: "Until account closure + 7 years",
  legal_basis: "Explicit consent per GDPR Art 6(1)(a)",
  withdrawal_procedure: "Contact DPO"
}
```

### Deliverables Required

- [ ] Data Processing Agreement (DPA) template
- [ ] Privacy Impact Assessment (PIA) template
- [ ] Consent collection workflow
- [ ] Data deletion procedure
- [ ] Legal review by GDPR specialist

### Estimated Effort

| Task | Effort | Dependencies |
| Documentation drafts | 2 days | None |
| Legal review | 1-2 weeks | External counsel |
| Implementation (if code changes) | 3-5 days | Legal approval |

## Issue 7: Verify Kaspa API/Parameters

### Problem Statement

Documentation claims specific Kaspa performance characteristics that need verification:
- Sub-second finality
- OP_RETURN support for 150-byte data
- Transaction fee levels
- Network throughput capacity

### Verification Checklist

#### 7.1 Finality Time

**Claim:** Sub-second finality  
**Verification:**
```bash
# Run benchmark on Kaspa testnet
kaspa-cli --testnet benchmark-finality --transactions 100

# Expected: Average finality time < 1 second
# Document: Actual measured finality time
```

**Source:** https://kaspa.org/docs/consensus/finality

#### 7.2 OP_RETURN Support

**Claim:** 150-byte data anchoring supported  
**Verification:**
```javascript
// Test transaction with maximum data
const testData = crypto.randomBytes(150).toString('hex');
const tx = kaspa.createTransaction({
  opReturn: testData
});
// Verify: Transaction accepted and confirmed
```

#### 7.3 Transaction Fees

**Claim:** ~$0.0001 per transaction  
**Verification:**
1. Query current fee market from Kaspa explorer
2. Calculate average fee over last 1000 blocks
3. Compare to documentation claim
4. Add disclaimer: "fees vary based on network conditions"

#### 7.4 Throughput Capacity

**Claim:** 1,000-10,000 tx/s theoretical capacity  
**Verification:**
1. Review Kaspa technical documentation
2. Find cited benchmarks
3. Document: "Theoretical capacity per Kaspa docs"
4. Note: "Production throughput depends on network conditions"

### Deliverables Required

- [ ] Kaspa parameter verification script
- [ ] Current network state snapshot
- [ ] Updated documentation with verified numbers
- [ ] Disclaimer for dynamic parameters

### Estimated Effort: 4 hours

## Issue 8: Test Adapters Against Sandbox APIs

### Problem Statement

QuickBooks and Salesforce adapters were developed based on API documentation but not tested against actual API endpoints.

### Test Plan

#### 8.1 QuickBooks Sandbox Testing

**Prerequisites:**
1. QuickBooks Developer account
2. Sandbox company created
3. OAuth credentials generated

**Test Cases:**

| ID | Test | Expected Result |
| QB-001 | Create Invoice via API | Invoice created with ID |
| QB-002 | Retrieve Invoice | Data matches creation |
| QB-003 | anchorInvoice() | FORAY transaction created |
| QB-004 | Batch 10 invoices | 10 transactions, no errors |
| QB-005 | API rate limit | Retry with backoff |
| QB-006 | Invalid invoice | ValidationError thrown |
| QB-007 | Voided invoice | Handled gracefully |
| QB-008 | Multi-currency | Currency preserved |
| QB-009 | Credit Memo | Negative accrual created |
| QB-010 | Journal Entry | Balanced entries |

#### 8.2 Salesforce Sandbox Testing

**Prerequisites:**
1. Salesforce Developer account
2. Sandbox org created
3. Connected App credentials

**Test Cases:**

| ID | Test | Expected Result |
| SF-001 | Query Opportunity | Data retrieved |
| SF-002 | opportunityToForay() | FORAY transaction created |
| SF-003 | Closed Won opportunity | Action component created |
| SF-004 | Quote with line items | Accrual captures totals |
| SF-005 | Order activation | Action with timestamp |
| SF-006 | Case (no amount) | Estimated accrual created |
| SF-007 | Batch 50 records | All processed, errors logged |
| SF-008 | API limit (10K/day) | Graceful degradation |
| SF-009 | Account object | Arrangement + Accrual |
| SF-010 | Lead conversion | Action with references |

### Deliverables Required

- [ ] QuickBooks sandbox account + credentials
- [ ] Salesforce sandbox org + Connected App
- [ ] Test scripts for both platforms
- [ ] Test results documentation
- [ ] CI/CD integration

### Estimated Effort: 3 days

## Issue 9: Create Formal Threat Model

### Problem Statement

Security claims lack formal threat modeling. A structured threat model is required for credibility.

### Proposed Structure

#### 9.1 STRIDE Analysis

| Threat | Component | Attack Vector | Mitigation |
| **Spoofing** | Transaction creation | Forge transaction | Digital signatures |
| **Tampering** | Blockchain anchor | Modify anchored data | SHA-256 + blockchain |
| **Repudiation** | Transaction denial | Claim never occurred | Merkle proofs |
| **Information Disclosure** | Privacy layers | Infer from hashes | 3-layer stack |
| **Denial of Service** | Kaspa network | Prevent anchoring | Multi-chain (future) |
| **Elevation of Privilege** | Admin access | Modify off-chain | Separation of duties |

#### 9.2 Attack Tree

```
ROOT: Compromise FORAY Transaction Integrity
++++-++|++-++|+ Attack Blockchain Layer
+-++-+   ++++-++|++-++|+ 51% attack on Kaspa
+-++-+   ++++-++|++-++|+ Exploit consensus bug
+-++-+   ++++-++|++-++|+ Compromise majority nodes
++++-++|++-++|+ Attack Privacy Layer
+-++-+   ++++-++|++-++|+ Reverse hash
+-++-+   ++++-++|++-++|+ Pattern analysis
+-++-+   ++++-++|++-++|+ Side-channel attack
++++-++|++-++|+ Attack Off-Chain Storage
+-++-+   ++++-++|++-++|+ Modify encrypted data
+-++-+   ++++-++|++-++|+ Delete off-chain data
+-++-+   ++++-++|++-++|+ Exfiltrate keys
++++-++|++-++|+ Attack Integration Layer
    ++++-++|++-++|+ Compromise adapter
    ++++-++|++-++|+ Inject false transactions
    ++++-++|++-++|+ Intercept credentials
```

#### 9.3 Quantitative Risk Assessment

| Attack | Probability | Impact | Risk Score |
| Kaspa 51% attack | Very Low | Critical | Medium |
| Pattern analysis | Medium | High | High |
| Insider threat | Medium | High | High |
| Key compromise | Low | Critical | Medium |

### Deliverables Required

- [ ] STRIDE analysis document
- [ ] Attack tree diagrams
- [ ] Quantitative risk assessment
- [ ] Security controls mapping
- [ ] Third-party review (recommended)

### Estimated Effort: 1 week

## Issue 10: Add Unit Tests (>80% Coverage)

### Problem Statement

Current adapter code has no unit tests. Production deployment requires comprehensive test coverage.

### Test Coverage Plan

#### 10.1 QuickBooks Adapter Tests

```javascript
// tests/quickbooks-adapter.test.js

describe('QuickBooksForayAdapter', () => {
  describe('constructor', () => {
    it('should validate configuration');
    it('should reject invalid privacy levels');
    it('should generate entity salt if not provided');
  });

  describe('anchorInvoice', () => {
    it('should create all 4 FORAY components');
    it('should create Action for paid invoice');
    it('should obfuscate amounts per privacy level');
    it('should hash customer identifiers');
    it('should handle missing optional fields');
    it('should throw ValidationError for invalid input');
  });

  describe('obfuscateAmount', () => {
    it('should return null for null input');
    it('should round to $100 for standard privacy');
    it('should add noise for high privacy');
    it('should return hash for defense privacy');
  });

  describe('batchProcess', () => {
    it('should process all valid transactions');
    it('should continue on individual errors');
    it('should return summary with counts');
  });
});
```

#### 10.2 Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', -> lcov', -> html']
};
```

### Deliverables Required

- [ ] Unit test files for all adapters
- [ ] Test fixtures (sample data)
- [ ] Jest configuration
- [ ] Coverage reports
- [ ] CI/CD integration

### Estimated Effort: 1 week

## Issue 11: Create Compliance Mapping Documents

### Problem Statement

Documentation claims compliance support but lacks detailed mapping showing how FORAY features address specific requirements.

### Proposed Mappings

#### 11.1 SOX 404 Mapping

| SOX 404 Requirement | FORAY Feature | Evidence Type |
| Document internal controls | Arrangement terms | Control documentation |
| Test control effectiveness | Merkle verification | 100% validation |
| Identify deficiencies | Tamper detection | Hash mismatch alerts |
| Maintain audit trail | Blockchain anchoring | Immutable timestamps |

**Note:** FORAY provides *evidence* supporting controls, not controls themselves.

#### 11.2 DCAA Mapping

| DCAA Requirement | FORAY Feature | Evidence Type |
| Cost segregation | Formula registry | Allocation documentation |
| Timekeeping accuracy | Timestamp anchoring | Blockchain-verified times |
| Billing integrity | Transaction linking | Invoice-cost mapping |
| Audit accessibility | Selective disclosure | Auditor access controls |

#### 11.3 GDPR Mapping

| GDPR Article | FORAY Feature | Limitation |
| Art 5 - Data minimization | Hash-only on-chain | Full compliance possible |
| Art 17 - Right to erasure | Off-chain deletion | Architecture dependent |
| Art 25 - Privacy by design | 3-layer privacy (ZK-ready) | Built-in |
| Art 32 - Security | Encryption, hashing | Industry standard |

### Deliverables Required

- [ ] SOX 404 compliance mapping
- [ ] DCAA compliance mapping
- [ ] GDPR compliance mapping
- [ ] HIPAA compliance mapping (if targeting healthcare)
- [ ] Compliance checklist templates

### Estimated Effort: 1 week

## Issue 14: Create Troubleshooting Guides

### Problem Statement

Current documentation lacks troubleshooting guidance for common integration issues.

### Proposed Structure

#### 14.1 Common Issues

| Issue | Symptoms | Cause | Solution |
| API authentication failure | 401 Unauthorized | Expired token | Refresh OAuth token |
| Rate limit exceeded | 429 Too Many Requests | Too many calls | Implement backoff |
| Blockchain anchor timeout | Not confirmed | Network congestion | Retry with higher fee |
| Hash mismatch | Verification fails | Data modified | Compare original vs current |
| Missing components | Incomplete transaction | Partial failure | Check logs, reprocess |

#### 14.2 Diagnostic Commands

```bash
# Check adapter health
foray-cli adapter health --adapter quickbooks

# Verify transaction integrity
foray-cli verify --transaction-id TX_123

# Test blockchain connectivity
foray-cli kaspa ping --testnet

# Export diagnostic logs
foray-cli logs export --last 24h --output diagnostics.zip
```

#### 14.3 Error Code Reference

| Code | Description | Resolution |
| FORAY-001 | Invalid configuration | Check config, validate schema |
| FORAY-002 | Authentication failed | Refresh credentials |
| FORAY-003 | Validation error | Check input data |
| FORAY-004 | Blockchain unreachable | Check network, node status |
| FORAY-005 | Anchor failed | Retry, check format |

### Deliverables Required

- [ ] Troubleshooting guide
- [ ] Error code reference
- [ ] Diagnostic CLI tools
- [ ] FAQ document
- [ ] Support escalation procedures

### Estimated Effort: 2 days

## Implementation Timeline

### Recommended Order

```
WEEK 1-2: Critical Issues (6, 7, 8)
++++-++|++-++|+ GDPR guidance draft
++++-++|++-++|+ Kaspa parameter verification
++++-++|++-++|+ Sandbox API testing

WEEK 3-4: Security & Testing (9, 10)
++++-++|++-++|+ Threat model document
++++-++|++-++|+ Unit test development

WEEK 5-6: Compliance & Support (11, 14)
++++-++|++-++|+ Compliance mapping documents
++++-++|++-++|+ Troubleshooting guides
```

### Resource Requirements

| Resource | Effort | Cost |
| Developer time | 15-20 days | Internal |
| Legal review (GDPR) | 1-2 weeks | $5,000-$15,000 |
| Security review (optional) | 2-4 weeks | $15,000-$50,000 |
| Sandbox accounts | N/A | Free (developer tiers) |

## Success Criteria

- [ ] GDPR guidance reviewed by legal counsel
- [ ] Adapters pass sandbox API tests
- [ ] Unit test coverage >80%
- [ ] Threat model reviewed by security team
- [ ] Compliance mappings reviewed by compliance officer
- [ ] Troubleshooting guide validated by support team

## Document History

| Version | Date | Changes |
| 1.0 | January 2026 | Initial roadmap |

**See Also:**
- [FORAY_Technical_Assumptions_Weaknesses.md](./FORAY_Technical_Assumptions_Weaknesses.md)
- [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md)
