# FORAY Protocol v4.1: Blockchain Implementation Analysis

## Kaspa, Cardano & Midnight  Technical Comparison

**Version:** 4.1 (Updated for Encrypted Envelope Architecture) 
**January 2026**

## Executive Summary

FORAY Protocol is a privacy-preserving enterprise audit infrastructure designed to create immutable blockchain-anchored records of business transactions. With the v3.0 **Encrypted Envelope** architecture, FORAY has fundamentally simplified its approach:

> **The blockchain is not a database. It is a cryptographic commitment store that enables off-chain logic to operate with on-chain guarantees.**

This analysis evaluates implementations on Kaspa's blockDAG (current), Cardano's Layer 1, and the Midnight privacy chain, considering how the new architecture affects platform selection.

**Key Finding:** The Encrypted Envelope architecture reduces on-chain complexity significantly, making Kaspa's speed advantages even more compelling while simultaneously making Midnight's native ZK capabilities less critical (since privacy is now handled at the package level).

## 1. FORAY v4.1 Architecture Summary

### What Changed

| Aspect | v2.0 | v3.0 |
| **On-chain data** | Mixed (hashed + encrypted + plaintext per field) | Single encrypted blob |
| **Privacy implementation** | 3-layer external stack | 1 encryption + Merkle tree |
| **On-chain size** | 500-2000 bytes | 200-400 bytes |
| **Selective disclosure** | Multiple decryption keys | Merkle proofs |

### On-Chain Envelope (All Platforms)

```

 FORAY v4.1 On-Chain Envelope (~200-400 bytes) 

 txId: Hash(envelope) // 32 bytes 
 merkleRoot: Root of payload fields // 32 bytes 
 encryptedBlob: AES-256-GCM(full_payload) // ~100-300 B 
 commitment: Hash(plaintext_payload) // 32 bytes 
 timestamp: ISO8601 (with jitter) // 8 bytes 

```

### The Four-Component Model (Unchanged)

```
Arrangement  Accrual  Anticipation  Action

 (Origin) (P&L Value) (Expected) (Settled)
```

## 2. Platform Overview

| Characteristic | Kaspa | Cardano | Midnight |
| **Architecture** | BlockDAG (GHOSTDAG) | Blockchain (Ouroboros PoS) | Partner Chain (ZK-focused) |
| **Consensus** | Proof-of-Work | Proof-of-Stake | PoS (Cardano inherited) |
| **Transaction Model** | UTXO | Extended UTXO (EUTXO) | UTXO + ZK State |
| **Block Time** | ~1 second (10 BPS) | ~20 seconds | TBD (mainnet pending) |
| **Finality** | ~10 seconds | ~20 minutes | Inherits Cardano |
| **Smart Contracts** | Via L2 (Kasplex) | Native (Plutus/Aiken) | Native (Compact/ZK) |
| **Native Privacy** | None (transparent) | None (transparent) | Yes (ZK-proofs) |
| **Enterprise Maturity** | Low (emerging) | High (established) | Medium (launching) |
| **ESG Compliance** |  PoW |  PoS |  PoS |

## 3. Kaspa Implementation (Recommended Primary)

### 3.1 Architecture Alignment with v3.0

The Encrypted Envelope architecture aligns excellently with Kaspa's strengths:

| FORAY v4.1 Need | Kaspa Capability | Fit |
| Small on-chain payload (200-400 bytes) | OP_RETURN supports 150+ bytes |  Excellent |
| Fast finality | ~10 seconds |  Excellent |
| High throughput | 1,000-10,000 tx/s |  Excellent |
| Low cost | ~$0.0001/tx |  Excellent |
| Smart contracts (registries) | Via Kasplex L2 |  Adequate |

### 3.2 v3.0 Simplifications for Kaspa

With Encrypted Envelope, Kaspa implementation becomes simpler:

| v2.0 Requirement | v3.0 Requirement | Change |
| 3-layer privacy stack on-chain | Single encrypted blob |  Simplified |
| Per-field encryption/hashing | Single AES-256-GCM encryption |  Simplified |
| Complex registry interactions | Minimal on-chain data |  Simplified |
| 500-2000 bytes per tx | 200-400 bytes per tx |  Reduced |

### 3.3 Kaspa-Specific On-Chain Format

```javascript
// FORAY v4.1 Kaspa Transaction
{
 // Standard Kaspa UTXO transaction
 inputs: [...],
 outputs: [...],

 // FORAY envelope in OP_RETURN (or payload field)
 payload: {
 version: "3.0",
 txId: "foray_1a2b3c_7f8e9d...", // 32 bytes
 merkleRoot: "7f8e9d...", // 32 bytes
 encryptedBlob: "U2FsdGVkX1+...", // ~100-300 bytes
 commitment: "4a5b6c...", // 32 bytes
 timestamp: "2026-01-21T10:00:00Z" // 8 bytes
 }
 // Total: ~200-400 bytes
}
```

### 3.4 Performance Profile

```
Block Time: 1 second (10 BPS with Crescendo upgrade)
Finality: ~10 seconds (10-block confirmation)
Throughput: 1,000-10,000 tx/s (theoretical)
Transaction Cost: ~$0.0001
Data Payload: 200-400 bytes (v3.0 envelope)
Latency: SDK validation <10ms, submission <1s
```

### 3.5 Strengths

 **Ultra-fast finality (~10 seconds)**  real-time audit anchoring 
 **High throughput**  handles enterprise volume 
 **Lowest fees**  makes high-volume anchoring economical 
 **Simple anchoring**  OP_RETURN + encrypted blob = done 
 **v3.0 reduces complexity**  less on-chain data, simpler implementation

### 3.6 Weaknesses

 **No native smart contracts**  registries require Kasplex L2 
 **Immature enterprise ecosystem**  limited institutional tooling 
 **PoW energy consumption**  ESG concerns for some enterprises 
 **Regulatory uncertainty**  PoW chains face scrutiny

## 4. Cardano Implementation Analysis

### 4.1 Architecture Alignment with v3.0

| FORAY v4.1 Need | Cardano Capability | Fit |
| Small on-chain payload | Datum storage (flexible) |  Excellent |
| Fast finality | ~20 minutes (practical: 2-5 min) |  Adequate |
| High throughput | 250-1,000 tx/s (Hydra for more) |  Adequate |
| Low cost | ~$0.10-0.50/tx |  Higher than Kaspa |
| Smart contracts (registries) | Native (Plutus/Aiken) |  Excellent |

### 4.2 EUTXO Advantages for FORAY v4.1

Cardano's Extended UTXO model offers benefits:

1. **Deterministic Validation:** Transaction success/failure known before submission
2. **Local Validation:** Each UTXO validated independently
3. **Datum Storage:** Native mechanism for FORAY envelope storage
4. **Reference Scripts:** Reusable validators reduce registry costs
5. **Native Assets:** Multi-asset handling without smart contract overhead

### 4.3 Cardano-Specific On-Chain Format

```haskell
-- FORAY v4.1 Cardano Datum
data ForayEnvelope = ForayEnvelope
 { version :: ByteString -- "3.0"
 , txId :: ByteString -- 32 bytes
 , merkleRoot :: ByteString -- 32 bytes
 , encryptedBlob :: ByteString -- ~100-300 bytes
 , commitment :: ByteString -- 32 bytes
 , timestamp :: POSIXTime -- 8 bytes
 }
```

### 4.4 Performance Profile

```
Block Time: 20 seconds
Finality: ~20 minutes (absolute), ~2-5 minutes (practical)
Throughput: 250-1,000 tx/s (L1), higher with Hydra L2
Transaction Cost: ~$0.10-0.50
Data Payload: Variable (datum), v3.0 envelope fits easily
```

### 4.5 Strengths

 **Native smart contracts**  registries without L2 dependency 
 **Mature enterprise ecosystem**  institutional partnerships 
 **Proof-of-Stake**  ESG compliant 
 **Formal verification heritage**  higher assurance 
 **Regulatory clarity**  established compliance patterns

### 4.6 Weaknesses

 **Slower block time**  20 seconds vs Kaspa's 1 second 
 **Longer finality**  20 minutes vs Kaspa's 10 seconds 
 **Higher fees**  ~$0.10-0.50 vs Kaspa's ~$0.0001 
 **EUTXO concurrency patterns**  different design approach

## 5. Midnight Implementation Analysis

### 5.1 Architecture Alignment with v3.0

| FORAY v4.1 Need | Midnight Capability | Fit |
| Privacy | Native ZK-proofs |  Excellent (but v3.0 already handles) |
| Selective disclosure | Protocol primitive |  Excellent (but v3.0 uses Merkle proofs) |
| Smart contracts | Native (Compact/ZK) |  Excellent |
| Enterprise readiness | Mainnet pending |  Not ready |

### 5.2 v3.0 Impact on Midnight Value Proposition

**Critical Insight:** The Encrypted Envelope architecture significantly reduces Midnight's differentiated value for FORAY.

| Privacy Feature | v2.0 Need | v3.0 Status | Midnight Value |
| On-chain privacy | External 3-layer stack required | Single encrypted blob |  Reduced |
| Selective disclosure | Multiple keys, complex | Merkle proofs |  Reduced |
| ZK proofs for validity | Nice to have | Nice to have |  Unchanged |
| Native shielded state | Would simplify implementation | Not needed |  Reduced |

**Before v3.0:** Midnight could eliminate 5-6 of 8 external privacy layers 
**After v3.0:** FORAY already eliminated those layers with package-level encryption

### 5.3 Where Midnight Still Adds Value

Despite reduced differentiation, Midnight offers:

1. **ZK Validity Proofs:** Prove transaction satisfies FORAY schema without decryption
2. **Regulatory-Aware Design:** Built for compliance from the ground up
3. **Future Privacy Features:** May offer capabilities beyond package encryption
4. **DUST Token Model:** Predictable, regenerating transaction fees

### 5.4 Strengths

 **Native ZK-proofs**  could enable on-chain validity verification 
 **Selective disclosure** as protocol primitive 
 **Regulatory-aware design** 
 **DUST token model**  predictable enterprise costs 
 **Cardano ecosystem integration**

### 5.5 Weaknesses

 **Mainnet not yet launched**  production readiness unknown 
 **v3.0 reduces differentiation**  privacy already handled 
 **Limited developer tooling** 
 **Performance characteristics unproven** 
 **New cryptographic primitives**  security audit maturation needed

## 6. Comparative Analysis

### 6.1 Performance Comparison

| Metric | Kaspa | Cardano | Midnight* |
| **Block Time** | 1 second | 20 seconds | TBD |
| **Finality** | ~10 seconds | ~20 minutes | TBD |
| **Throughput (TPS)** | 1,000-10,000 | 250-1,000 | TBD |
| **Transaction Cost** | ~$0.0001 | ~$0.10-0.50 | DUST (regenerating) |
| **v3.0 Envelope Size** | 200-400 bytes | 200-400 bytes | 200-400 bytes |

*Midnight metrics projected; mainnet not yet launched

### 6.2 FORAY v4.1 Requirement Fit

| Requirement | Kaspa | Cardano | Midnight |
| **Immutability** |  Excellent |  Excellent |  Excellent |
| **Encrypted Envelope Support** |  OP_RETURN |  Datum |  Native |
| **Merkle Proof Verification** | Off-chain | On-chain possible | On-chain native |
| **Smart Contracts (Registries)** | L2 only |  Native |  Native (ZK) |
| **Enterprise Tooling** | Limited |  Mature | Emerging |
| **Regulatory Clarity** | Uncertain |  Established | Evolving |
| **ESG Compliance** |  PoW |  PoS |  PoS |
| **Production Ready** |  Yes |  Yes |  No |

### 6.3 Implementation Complexity (v3.0)

| Component | Kaspa | Cardano | Midnight |
| Core Protocol Integration | 2/10 | 3/10 | 5/10 |
| Encrypted Envelope Anchoring | 2/10 | 2/10 | 2/10 |
| Registry Contracts | 5/10 (L2) | 3/10 | 3/10 |
| Merkle Verification | Off-chain | 4/10 | 2/10 |
| Auditor Integration | 3/10 | 3/10 | 2/10 |
| **Overall Complexity** | **15/50** | **15/50** | **14/50** |

*Lower score = less complexity*

**Note:** v3.0 significantly reduced complexity across all platforms by moving privacy to the SDK layer.

### 6.4 Cost Analysis (Per 100,000 Transactions)

| Cost Factor | Kaspa | Cardano | Midnight |
| Transaction fees | $10 | $10,000-50,000 | DUST (variable) |
| Infrastructure | $500/mo | $500/mo | $500/mo |
| Development (v3.0) | $100K | $150K | $200K |
| **Year 1 Total** | ~$110K | ~$270K-400K | ~$210K+ |

### 6.5 Risk Assessment

| Risk Category | Kaspa | Cardano | Midnight |
| **Technology Risk** | Medium (DAG) | Low (proven) | High (new ZK) |
| **Regulatory Risk** | High (PoW) | Low (PoS) | Medium (privacy) |
| **Adoption Risk** | High (emerging) | Low (established) | High (launching) |
| **Performance Risk** | Low (proven speed) | Low (proven) | High (unproven) |
| **Ecosystem Risk** | High (small) | Low (large) | Medium (growing) |

## 7. Strategic Recommendations

### 7.1 Primary Platform: Kaspa

**Recommendation:** Maintain Kaspa as the primary implementation.

**Rationale:**
- v3.0's encrypted envelope is a perfect fit for Kaspa's simple anchoring model
- Speed advantages (1-second blocks, 10-second finality) are unmatched
- Cost efficiency (~$0.0001/tx) enables high-volume enterprise use
- Privacy is now handled at SDK level, eliminating Kaspa's "no native privacy" weakness

### 7.2 Secondary Platform: Cardano

**Recommendation:** Develop Cardano adapter for enterprise/institutional market.

**Rationale:**
- Regulatory credibility matters for banking, defense, healthcare
- Native smart contracts enable more sophisticated registry patterns
- ESG compliance (PoS) required by many enterprises
- Mature ecosystem reduces integration risk

### 7.3 Future Platform: Midnight

**Recommendation:** Monitor but deprioritize until mainnet + v3.0 value assessment.

**Rationale:**
- v3.0 reduces Midnight's differentiated value significantly
- Mainnet readiness unknown
- May add value for ZK validity proofs in future
- Worth revisiting once production-ready

### 7.4 Multi-Chain Strategy

```

 FORAY v4.1 MULTI-CHAIN ARCHITECTURE 

 FORAY SDK v3.0 (Platform-Agnostic) 

   4-component model (Arrangement  Accrual  ...)  
   Encrypted Envelope generation  
   Merkle tree for selective disclosure  
   Platform adapters  

  Kaspa Adapter   Cardano Adapter   Midnight Adapter 
  (Primary)   (Enterprise)   (Future)  

   OP_RETURN    EUTXO Datum    ZK State  
   ~10s finality    Aiken scripts    Compact lang  
   ~$0.0001/tx    ~$0.10-0.50/tx   Native ZK  
   Kasplex L2    Hydra L2    DUST fees  

```

### 7.5 Implementation Priority Matrix

| Use Case | Best Platform | Rationale | Priority |
| High-Frequency Trading Audit | Kaspa | Sub-second finality | Now |
| Supply Chain Tracking | Kaspa | Volume + speed | Now |
| Crypto Hedge Fund Audit | Kaspa | Speed + low cost | Now |
| Manufacturing Cost Tracking | Kaspa/Cardano | Depends on volume | Q2 2026 |
| Banking/Structured Finance | Cardano | Regulatory trust | Q2 2026 |
| Defense Contractor (DCAA) | Cardano | Institutional credibility | Q3 2026 |
| Healthcare Records | Cardano (or Midnight) | Compliance requirements | Q4 2026 |
| Cross-Border Compliance | TBD | Await Midnight evaluation | 2027 |

### 7.6 Resource Allocation

| Phase | Platform | Engineering | Timeline | Budget |
| 1 | Kaspa v3.0 (current) | 2 engineers | Complete |  |
| 2 | Cardano Adapter | 2-3 engineers | 3-4 months | $150K-200K |
| 3 | Midnight Evaluation | 1 engineer | 2-3 months | $50K |
| **Total** |  | **5-6 engineers** | **6-7 months** | **$200K-250K** |

## 8. Technical Implementation Notes

### 8.1 Cross-Chain Anchoring Pattern (Optional)

For maximum resilience, enterprises may anchor to multiple chains:

```
FORAY v4.1 Transaction

  Primary Anchor: Kaspa (speed)
   Full encrypted envelope

  Secondary Anchor: Cardano (credibility)
   Merkle root checkpoint (batched)

  Future: Midnight (ZK validity)
  ZK proof of envelope validity
```

### 8.2 Platform-Specific Adapter Interface

```javascript
// Unified adapter interface (all platforms)
class BlockchainAdapter {
 // Anchor encrypted envelope
 async anchor(envelope: ForayEnvelope): Promise<AnchorResult>;

 // Retrieve anchored envelope
 async retrieve(txId: string): Promise<ForayEnvelope>;

 // Verify Merkle proof against on-chain root
 async verifyProof(disclosure: Disclosure): Promise<boolean>;

 // Platform-specific registry operations
 async registerFormula(formula: FormulaDefinition): Promise<string>;
 async registerEntity(entity: EntityDefinition): Promise<string>;
}
```

### 8.3 Kaspa Adapter Implementation

```javascript
class KaspaAdapter extends BlockchainAdapter {
 async anchor(envelope) {
 // Serialize envelope to bytes
 const payload = serialize(envelope);

 // Create Kaspa transaction with OP_RETURN
 const tx = await this.kaspa.createTransaction({
 outputs: [{ opReturn: payload }]
 });

 // Submit and wait for finality (~10 seconds)
 const result = await this.kaspa.submitAndWait(tx, { confirmations: 10 });

 return {
 txId: envelope.txId,
 kaspaTransactionId: result.txId,
 blockHeight: result.blockHeight,
 timestamp: result.timestamp
 };
 }
}
```

### 8.4 Cardano Adapter Implementation

```javascript
class CardanoAdapter extends BlockchainAdapter {
 async anchor(envelope) {
 // Create datum from envelope
 const datum = this.buildDatum(envelope);

 // Create transaction with datum
 const tx = await this.cardano.buildTransaction({
 outputs: [{
 address: this.forayAddress,
 datum: datum,
 value: minUtxo
 }]
 });

 // Submit and wait for finality
 const result = await this.cardano.submitAndWait(tx);

 return {
 txId: envelope.txId,
 cardanoTransactionId: result.txId,
 blockHeight: result.slot,
 timestamp: result.timestamp
 };
 }
}
```

## 9. Conclusion

### v3.0 Impact on Platform Selection

The Encrypted Envelope architecture fundamentally changed the blockchain selection calculus:

| Factor | v2.0 Implication | v3.0 Implication |
| Privacy complexity | Favored Midnight (native ZK) | Neutral (SDK handles) |
| On-chain size | Favored Kaspa (efficient) | **Strongly favors Kaspa** |
| Speed requirements | Favored Kaspa | **Strongly favors Kaspa** |
| Enterprise credibility | Favored Cardano | Favors Cardano (unchanged) |

### Final Recommendation

**Kaspa remains the optimal primary platform** for FORAY v4.1:

1. **Speed:** 1-second blocks, 10-second finality unmatched
2. **Cost:** ~$0.0001/tx enables enterprise scale
3. **Simplicity:** OP_RETURN + encrypted blob = minimal complexity
4. **Privacy:** Now handled at SDK level, not blockchain level

**Cardano is the optimal secondary platform** for regulated industries:

1. **Credibility:** Institutional trust established
2. **Smart Contracts:** Native registry support
3. **ESG Compliance:** PoS satisfies requirements
4. **Regulatory:** Established compliance patterns

**Midnight should be monitored** but deprioritized:

1. **v3.0 reduces differentiation:** Privacy already solved
2. **Mainnet not ready:** Production readiness unknown
3. **Future value:** May add ZK validity proofs later

## Appendix A: Platform Specifications

### A.1 Kaspa

| Specification | Value |
| Protocol | GHOSTDAG (Greedy Heaviest Observed SubTree DAG) |
| Block Rate | 10 BPS (Crescendo upgrade, May 2025) |
| Hash Algorithm | kHeavyHash (ASIC-friendly) |
| Data Anchoring | OP_RETURN, 150+ bytes |
| L2 Solution | Kasplex (zkEVM rollup) |
| Documentation | [kaspa.org](https://kaspa.org) |

### A.2 Cardano

| Specification | Value |
| Protocol | Ouroboros Praos (Proof-of-Stake) |
| Block Time | ~20 seconds |
| Smart Contracts | Plutus (Haskell), Aiken (Rust-like) |
| Data Storage | Datum (on-chain), Reference Scripts |
| L2 Solution | Hydra (state channels) |
| Documentation | [docs.cardano.org](https://docs.cardano.org) |

### A.3 Midnight

| Specification | Value |
| Protocol | Partner chain with ZK-native privacy |
| Tokens | NIGHT (governance), DUST (fees, regenerating) |
| Smart Contracts | Compact (TypeScript-based) |
| Privacy Model | Selective disclosure via ZK-proofs |
| Status | Testnet active, mainnet pending |
| Documentation | [midnight.network](https://midnight.network) |

## Appendix B: Glossary

| Term | Definition |
| **BlockDAG** | Directed Acyclic Graph allowing parallel block creation |
| **Encrypted Envelope** | FORAY v4.1 architecture: single encrypted package on-chain |
| **EUTXO** | Extended Unspent Transaction Output (Cardano's model) |
| **GHOSTDAG** | Kaspa's consensus protocol for DAG ordering |
| **Merkle Proof** | Cryptographic proof that a field belongs to a committed tree |
| **Selective Disclosure** | Revealing specific fields without exposing entire payload |
| **DUST** | Midnight's regenerating transaction fee resource |

**Document Version:** 4.1 
**Last Updated:** January 2026 
**Classification:** FORAY Protocol Technical Analysis

**DISCLAIMER:** This document describes FORAY protocol design considerations as of January 2026. All performance metrics, security claims, and platform comparisons are based on available documentation and may change. Consult official platform documentation for current specifications.
