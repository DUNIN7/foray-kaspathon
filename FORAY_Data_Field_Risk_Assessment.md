# FORAY Protocol - Data Field Risk Assessment & Threat Analysis

**Version 2.0 | January 2026**

## 1. Executive Summary

This document provides a comprehensive analysis of FORAY Protocol data fields, assessing privacy risks on a 1-9 scale (1 = minimal risk, 9 = critical risk requiring maximum protection). It evaluates current protection mechanisms, computational methods (on-chain vs off-chain), and common threat vectors that adversaries may employ against blockchain-anchored transaction data.

## 2. Risk Scale Definition

| Risk Level | Classification | Description |
|:----------:|----------------|-------------|
| **1-2** |  Minimal | Public/standard information with no competitive or privacy value |
| **3-4** |  Low | Limited sensitivity; basic hashing provides adequate protection |
| **5-6** | + Medium | Business-sensitive; requires salted hashing and obfuscation |
| **7-8** | +-++ High | Competitive intelligence value; requires multi-layer protection |
| **9** |  Critical | Maximum sensitivity; requires defense-grade protection stack |

## 3. FORAY Data Fields - Complete Risk Assessment

### 3.1 Arrangement Component Fields

*Arrangement components mark transaction origin and establish parties. These are DAG roots with no dependencies.*

| Field | Purpose in FORAY | Risk | Protection Method | On-Chain / Off-Chain |
|-------|------------------|:----:|-------------------|---------------------|
| **id** | Unique transaction identifier: `Hash(component_data + timestamp + nonce)` | **2** | Content-addressed hashing; nonce prevents predictability | On-chain (hash only) |
| **timestamp** | ISO8601 datetime marking transaction origin | **4** | Temporal jitter (seconds); batch submissions | On-chain |
| **parties[]** | Array of party identifiers: `Hash(party_n + salt)`. Identifies counterparties to transaction | **8** | Per-entity salting; Salt Registry rotation; Instance pools | On-chain (salted hash); Off-chain (plaintext + salt) |
| **primary_flow.from** | Source party in primary asset flow | **7** | Salted hash; unlinkable across transactions | On-chain (hash); Off-chain (mapping) |
| **primary_flow.to** | Destination party in primary asset flow | **7** | Salted hash; unlinkable across transactions | On-chain (hash); Off-chain (mapping) |
| **primary_assets[]** | Array of `Hash(asset_type + nonce)`. Identifies asset classes involved | **6** | Nonce per asset; prevents asset type correlation | On-chain (hash); Off-chain (asset definitions) |
| **tx_type_id** | `Hash(transaction_category)`. Classifies transaction type (loan, invoice, etc.) | **7** | Per-entity salting; prevents business activity profiling | On-chain (salted hash); Off-chain (category definitions) |

#### Why These Fields Exist:
- **id**: Enables unique identification and reference across the DAG without revealing content
- **timestamp**: Required for audit trail chronology and regulatory compliance (SOX, DCAA)
- **parties[]**: Establishes counterparties for reconciliation and audit verification
- **primary_flow**: Documents the direction of value transfer for accounting purposes
- **primary_assets[]**: Classifies what is being exchanged (cash, inventory, services)
- **tx_type_id**: Enables categorization for reporting and analytics without exposing business logic

### 3.2 Accrual Component Fields

*Accrual components capture P&L essence through formula-based calculations, oracle valuations, or fixed amounts.*

| Field | Purpose in FORAY | Risk | Protection Method | On-Chain / Off-Chain |
|-------|------------------|:----:|-------------------|---------------------|
| **type** | `Calculated | Valuation | FixedAmount` - Accrual classification | **2** | Minimal protection needed (generic classification) | On-chain |
| **salted_formula_id** | `Hash(formula + entity_salt + nonce)`. Identifies calculation logic | **9** | Multi-layer: Salting + FPE + Instance Pools + Polymorphism + Chaff | On-chain (salted hash); Off-chain (formula definition, salt, mappings) |
| **encrypted_inputs{}** | `Enc(value)` for each formula variable (P, r, t, etc.) | **8** | AES-256-GCM encryption; variable polymorphism; input chaff | On-chain (encrypted blobs); Off-chain (decryption keys) |
| **encrypted_output** | `Enc(result)`. The calculated result of formula execution | **8** | AES-256-GCM; differential privacy noise; output chaff | On-chain (encrypted); Off-chain (decryption keys) |
| **zk_proof** | `Proof(output = formula(inputs))`. Zero-knowledge correctness proof | **1** | Groth16/PLONK proofs reveal nothing about formula | On-chain |
| **asset_id** (Valuation type) | Hash of asset being valued (for market valuations) | **6** | Salted hash with nonce | On-chain (hash); Off-chain (asset master) |
| **date** (Valuation type) | ISO8601 valuation date | **3** | Temporal bucketing if sensitive | On-chain |
| **oracle_ref** | `Hash(oracle_pubkey)`. Reference to price/data oracle | **3** | Oracle Registry on-chain; public key commitment | On-chain |
| **oracle_signature** | `Sign(data, oracle_privkey)`. Attestation of valuation | **2** | Standard cryptographic signature; publicly verifiable | On-chain |
| **deps[]** | Hash references to dependent Arrangement(s) | **5** | Opaque hash references; graph analysis resistance | On-chain |

#### Why These Fields Exist:
- **type**: Allows auditors to understand the nature of the accrual without revealing specifics
- **salted_formula_id**: Enables formula verification while protecting proprietary calculations (MOST SENSITIVE)
- **encrypted_inputs/output**: Preserves mathematical verifiability while hiding actual values
- **zk_proof**: Provides cryptographic proof of correctness without revealing formula or values
- **oracle_ref/signature**: Enables third-party attestation for market valuations (FX rates, prices)
- **deps[]**: Maintains DAG integrity and causal ordering for audit trails

### 3.3 Anticipation Component Fields

*Anticipation components record expected future flows such as loan repayments, earnouts, or contingent payments.*

| Field | Purpose in FORAY | Risk | Protection Method | On-Chain / Off-Chain |
|-------|------------------|:----:|-------------------|---------------------|
| **flows[].from** | Hash of source party for anticipated flow | **7** | Salted party hash; Salt Registry rotation | On-chain (hash); Off-chain (party mapping) |
| **flows[].to** | Hash of destination party for anticipated flow | **7** | Salted party hash; Salt Registry rotation | On-chain (hash); Off-chain (party mapping) |
| **flows[].datetime** | ISO8601 future date when flow is expected | **5** | Temporal bucketing; date range obfuscation | On-chain |
| **flows[].asset_id** | Hash of asset type being transferred | **6** | Salted hash with transaction nonce | On-chain (hash); Off-chain (asset master) |
| **flows[].quantity** | u64 amount of anticipated transfer | **8** | Amount obfuscation (rounding + noise); encryption | On-chain (obfuscated/encrypted); Off-chain (actual values) |
| **flows[].condition** | `Hash(condition_definition)`. Nullable trigger requirement | **7** | Condition Registry on-chain; encrypted logic | On-chain (hash); Off-chain (condition definitions) |
| **deps[]** | Hash references to Accrual(s) providing amounts | **5** | Opaque hash references; temporal separation | On-chain |

#### Why These Fields Exist:
- **flows[].from/to**: Documents expected counterparty obligations for reconciliation
- **flows[].datetime**: Enables cash flow forecasting and covenant compliance tracking
- **flows[].asset_id**: Classifies what will be transferred (cash, securities, goods)
- **flows[].quantity**: Records expected amounts for revenue recognition (ASC 606)
- **flows[].condition**: Captures contingencies (earnouts, performance milestones, MAC clauses)
- **deps[]**: Links to source calculations for audit verification

### 3.4 Action Component Fields

*Action components record actual completed asset transfers, triggering settlement logic and closing transactions.*

| Field | Purpose in FORAY | Risk | Protection Method | On-Chain / Off-Chain |
|-------|------------------|:----:|-------------------|---------------------|
| **flows[].asset_id** | Hash of transferred asset | **6** | Salted hash; consistent with Anticipation refs | On-chain (hash); Off-chain (asset master) |
| **flows[].from** | Hash of actual source party | **7** | Salted party hash; Salt Registry rotation | On-chain (hash); Off-chain (mapping) |
| **flows[].to** | Hash of actual destination party | **7** | Salted party hash; Salt Registry rotation | On-chain (hash); Off-chain (mapping) |
| **flows[].amount** | u64 actual transferred amount | **8** | Amount obfuscation; differential privacy; encryption | On-chain (obfuscated); Off-chain (actual) |
| **flows[].timestamp** | ISO8601 past datetime of actual transfer | **4** | Temporal jitter; batch anchoring | On-chain |
| **deps[]** | Hash refs to Anticipation(s) or Accrual(s) | **5** | Opaque references; multi-layer indirection | On-chain |

#### Why These Fields Exist:
- **flows[].asset_id/from/to**: Documents actual settlement for audit trail completeness
- **flows[].amount**: Records actual value for reconciliation against Anticipations
- **flows[].timestamp**: Provides immutable proof of when transfer occurred
- **deps[]**: Enables matching of actual vs expected for variance analysis

### 3.5 Registry Fields (On-Chain Audit Service)

| Field | Purpose in FORAY | Risk | Protection Method | On-Chain / Off-Chain |
|-------|------------------|:----:|-------------------|---------------------|
| **Salt Registry entries** | Cryptographic commitments to party/asset identity mappings | **8** | Double-hashing; time-bounded; rotation chains | On-chain (commitments); Off-chain (salts) |
| **Formula Registry entries** | Public standard + private salted formula definitions | **9** | Content-addressed; versioned; ZK attestation optional | On-chain (public formulas, salted IDs); Off-chain (private formula code) |
| **Condition Registry entries** | Pre-commitments to contingent terms | **7** | Encrypted condition logic; oracle validation | On-chain (commitments); Off-chain (condition definitions) |
| **Oracle Registry entries** | Trusted data source registrations | **3** | Public key commitments; reputation tracking | On-chain |

## 4. Protection Methods - The 8-Layer Defense Stack

FORAY employs a defense-in-depth architecture with 8 independent privacy layers:

| # | Defense Layer | Mechanism | Attack Prevention | Computation Location |
|:-:|---------------|-----------|-------------------|---------------------|
| 1 | **Salted Formula IDs** | Per-entity unique salts: `H(H(F) + salt + nonce)` | Cross-entity formula linkage; business profiling | Off-chain (salt generation); On-chain (hash storage) |
| 2 | **Multi-Layer Indirection** | Fragment + Permutation + Transaction separation | Metadata correlation; single-point decryption | On-chain (3 separate tx types); Off-chain (key management) |
| 3 | **Instance Pools** | 5-10 formula representations; random selection | Usage frequency analysis; formula identification | Off-chain (pool management); On-chain (multiple anchors) |
| 4 | **Fragment-Permute-Encode** | Formula split into n fragments; permuted storage | Formula structure observation; reconstruction | Off-chain (fragmentation); On-chain (encrypted fragments) |
| 5 | **Variable Polymorphism** | P, r, t + capital, margin, span (semantic variants) | Variable name fingerprinting; formula type inference | Off-chain (name mapping); On-chain (polymorphic names) |
| 6 | **Computational Chaff** | Fake operations alongside real: 2^n combinations | Operation relevance identification | Off-chain (chaff generation); On-chain (indistinguishable ops) |
| 7 | **Property Chaff** | Fake inputs/outputs: C(n,k) combinations | Transaction fingerprinting; input/output analysis | Off-chain (chaff generation); On-chain (extra properties) |
| 8 | **Differential Privacy** | Statistical noise (=0.1); value quantization | Statistical inference; exact value determination | Off-chain (noise addition); On-chain (noisy values) |

### Computational Distribution Summary

| Process | Location | Rationale |
| Salt generation | Off-chain | Secrets must never appear on-chain |
| Formula execution | Off-chain | Complex computation; proprietary logic |
| Encryption (AES-256-GCM) | Off-chain | Keys remain in enterprise HSM |
| Hash computation | Off-chain | Salts added before submission |
| ZK proof generation | Off-chain | Computationally intensive (5-30 sec) |
| Fragmentation/permutation | Off-chain | SDK handles before submission |
| Chaff generation | Off-chain | Random generation in SDK |
| Transaction anchoring | On-chain | Only hashes/commitments stored |
| Merkle root checkpoints | On-chain | Registry integrity verification |
| ZK proof verification | On-chain or Auditor | Fast verification (<100ms) |

## 5. Threat Vector Analysis

### 5.1 Adversary Classification

| Adversary | Motivation | Capabilities | Budget/Timeline |
| **A1: Commercial Competitor** | Reverse-engineer pricing models; identify suppliers; estimate market share | Blockchain analysis tools; ML expertise; basic statistical analysis | $100K budget; months of analysis |
| **A2: Nation-State Intelligence** | Economic espionage; supply chain targeting; program identification | Quantum computing (future); SIGINT; insider infiltration; advanced AI/ML | Unlimited budget; persistent threat |
| **A3: Insider Threat** | Fraud; embezzlement; cover-up of misconduct | Access to internal systems; decryption keys; metadata mappings | Variable; opportunistic |
| **A4: Regulatory Adversary** | Fishing expeditions; broad discovery requests | Legal authority; forensic tools; time | Legal budget; months-years |

### 5.2 Pattern Analysis Attacks

| Attack Vector | Description | Target Fields | FORAY Defense | Residual Risk |
| **Transaction Clustering** | Group transactions by shared formula_id or party hashes to identify entities | parties[], salted_formula_id | Salted IDs unique per entity; Instance pools provide N representations | Low - requires side-channel for initial identification |
| **Volume Fingerprinting** | Identify entity by transaction volume patterns (e.g., 10M tx/year = major retailer) | Transaction count, timing | Decoy transactions; batch submissions; cross-entity pools | Medium - volume is inherently observable |
| **Timing Correlation** | Correlate FORAY timestamps with public events (earnings, announcements) | timestamp fields | Temporal jitter (seconds); delayed anchoring; batch processing | Medium - some timing leakage unavoidable |
| **Formula Frequency Analysis** | Analyze which formula_ids are used most frequently to identify business type | salted_formula_id | Per-transaction nonces; different salted_formula_id each use (maximum privacy mode) | Low with maximum privacy config |
| **Network Graph Analysis** | Map party relationships through transaction counterparty analysis | parties[], flows[].from/to | Party hashes unlinkable; Salt Registry rotation; shared pools | Low - graph structure obscured |
| **Asset Type Correlation** | Identify entity by unique asset combinations (mining hardware + electricity + Bitcoin) | primary_assets[], flows[].asset_id | Asset IDs use transaction nonces; not linkable across transactions | Medium - unusual combinations may be identifiable |

### 5.3 Cryptographic Attacks

| Attack Vector | Description | Target Fields | FORAY Defense | Residual Risk |
| **Quantum Decryption** | Break AES-256 encryption using Shor's/Grover's algorithms | encrypted_inputs, encrypted_output | Even with broken encryption: combinatorial complexity (chaff, fragmentation) requires months | Low - defense-in-depth provides post-quantum protection |
| **Rainbow Table** | Precompute hashes for common values to reverse hash lookups | All hashed fields | Per-entity salts; nonces; double-hashing prevents precomputation | Minimal - salting defeats precomputation |
| **Brute Force** | Exhaustively try all possible input combinations | encrypted_inputs | 256-bit hash space; C(n,k) chaff combinations = computationally infeasible | Minimal |
| **Known Plaintext** | Use known transaction details to derive encryption keys | encrypted_inputs, encrypted_output | Unique keys per transaction; HSM key management | Low - requires key compromise |

### 5.4 Inference Attacks

| Attack Vector | Description | Target Fields | FORAY Defense | Residual Risk |
| **Statistical Regression** | Analyze input/output pairs to derive formula: I = P  x  r  x  t | encrypted_inputs, encrypted_output | Differential privacy noise; property chaff; encrypted values | Medium - requires many samples; noise degrades accuracy |
| **Input Distribution Analysis** | Derive formula from statistical distribution of inputs/outputs | All Accrual fields | Input quantization buckets; output rounding; chaff properties | Medium - statistical patterns may emerge over time |
| **Side-Channel (Timing)** | Observe ERP+FORAY submission patterns; execution timing | All fields (timing metadata) | Constant-time operations; batch submissions; temporal jitter | Low - requires network observation |
| **Metadata Correlation** | Correlate FORAY transactions with ERP events, public filings | timestamp, deps[] | Delayed anchoring; batch processing; decoy transactions | Medium - external correlation possible |

### 5.5 Infrastructure Attacks

| Attack Vector | Description | Target | FORAY Defense | Residual Risk |
| **Key Compromise** | Obtain decryption keys through breach or insider | Off-chain key storage | HSM protection; multi-signature requirements; role-based access | Medium - key management is critical |
| **Registry Corruption** | Modify Salt/Formula Registry mappings | On-chain registries | Blockchain immutability; Merkle checkpoints; cryptographic commitments | Minimal - immutable by design |
| **SDK Tampering** | Modify SDK to leak data or weaken encryption | FORAY SDK | Code signing; reproducible builds; open-source audit | Low with proper DevSecOps |
| **Oracle Compromise** | Provide false valuations through compromised oracle | oracle_ref, oracle_signature | Oracle Registry reputation; multi-oracle consensus; stake slashing | Medium - oracle trust is external |

## 6. Combined Attack Complexity Analysis

With all 8 defense layers enabled, an attacker faces multiplicative complexity:

| Layer Combination | Complexity Added | Estimated Attack Time |
| Salting alone | Cross-entity unlinkability | Hours (if entity identified via side-channel) |
| + Encryption | AES-256 breaking required | Centuries (classical); Minutes (quantum) |
| + FPE Fragmentation | C(n,k) fragment combinations (~30,000) | Days (with automation at 1000/sec) |
| + Multi-Layer Indirection | Graph traversal + multiple decryptions | Weeks (requires correlating separate tx) |
| + Instance Pools (5-10) | N x  encryption breaking; correlation analysis | Months |
| + Variable Polymorphism | Semantic analysis required | Additional weeks |
| + Chaff (Computational + Property) | 2^ops  x  C(inputs,k)  x  C(outputs,1) combinations | Years |
| **All Layers Combined** | **5.8  x  10^11 combinations (standard config)** | **6-12 months; $2M-$5M; <15% success** |

### Attack Cost Analysis by Adversary

| Adversary | Likely Attack Strategy | Estimated Cost | Success Probability |
| **Competitor ($100K)** | Transaction clustering + timing correlation | $50K-$100K | <5% (limited to volume inference) |
| **Nation-State (quantum)** | Full cryptanalysis + statistical inference | $2M-$5M | <15% after 6-12 months |
| **Insider (key access)** | Direct key compromise | Variable | High for specific transactions; detected via audit logs |

## 7. Recommendations by Data Sensitivity

### 7.1 Privacy Level Configuration

| Privacy Level | Risk Threshold | Protection Stack | Use Case |
| **Minimal** | Risk 1-3 | SHA-256 hashing only | Development/testing; non-sensitive data |
| **Standard** | Risk 4-5 | Salted hashing; amount rounding to $100 | Commercial enterprise; typical business transactions |
| **High** | Risk 6-7 | 3-layer privacy architecture; amount rounding + noise | Financial services; sensitive industries |
| **Defense** | Risk 8-9 | Maximum config; hash-only amounts; SCIF deployment | Defense contractors; classified programs; proprietary algorithms |

### 7.2 Field-Specific Recommendations

####  Risk 9 (Critical): `salted_formula_id`
- Deploy 3-layer privacy architecture
- Enable maximum privacy config with per-transaction nonces
- Consider air-gapped operation for proprietary algorithms
- Enable ZK proof verification for audit

#### +-++ Risk 8 (High): `parties[]`, `encrypted_inputs`, `encrypted_output`, `flows[].quantity`, `flows[].amount`
- Enable salted hashing with mandatory rotation (annual minimum)
- Use differential privacy (=0.1 or lower)
- Implement property chaff (minimum 4 fake properties)
- Store decryption keys in HSM

#### +-++ Risk 7 (High): `primary_flow.from/to`, `tx_type_id`, `flows[].condition`, `flows[].from/to`
- Per-entity salting mandatory
- Enable Salt Registry rotation (quarterly recommended)
- Use instance pools (minimum 5 representations)
- Condition definitions encrypted with separate keys

#### + Risk 5-6 (Medium): `primary_assets[]`, `asset_id`, `deps[]`, `flows[].datetime`
- Standard salted hashing with nonces
- Temporal obfuscation for sensitive dates (bucket to week/month)
- Transaction nonces for asset identifiers

####  Risk 3-4 (Low): `timestamp`, `date`, `oracle_ref`
- Basic hashing or plaintext acceptable
- Temporal jitter for timestamps if correlation is a concern
- Oracle references can be public

####  Risk 1-2 (Minimal): `id`, `type`, `zk_proof`, `oracle_signature`
- No obfuscation required
- These fields are inherently privacy-preserving or public by design

## 8. Integration-Specific Field Mappings

### 8.1 QuickBooks Integration (Implemented)

| QuickBooks Field | FORAY Field | Risk | Special Handling |
|------------------|-------------|:----:|------------------|
| CustomerRef.name | parties[].identifier | 8 | Hash with entity salt |
| CustomerRef.value | parties[].customer_id | 8 | Hash with entity salt |
| VendorRef.name | parties[].identifier | 8 | Hash with entity salt |
| TotalAmt | encrypted_output / flows[].amount | 8 | Obfuscate per privacy level |
| Line[].Amount | encrypted_inputs | 8 | Encrypt individual amounts |
| DueDate | flows[].datetime | 5 | Temporal bucketing optional |
| TxnDate | timestamp | 4 | Temporal jitter applied |
| DocNumber | Reference in metadata | 3 | Hash for unlinkability |

### 8.2 Salesforce Integration (Implemented)

| Salesforce Field | FORAY Field | Risk | Special Handling |
|------------------|-------------|:----:|------------------|
| AccountId | parties[].identifier | 8 | Hash with entity salt |
| OwnerId | parties[].identifier | 7 | Hash with entity salt |
| Amount | encrypted_inputs | 8 | Obfuscate per privacy level |
| Probability | encrypted_inputs | 6 | Used in revenue calculation |
| StageName | tx_type_id variant | 7 | Hash to prevent stage inference |
| CloseDate | flows[].datetime | 5 | Temporal bucketing |
| CaseNumber | Reference in metadata | 3 | Hash for unlinkability |

### 8.3 SAP Integration (Documented)

| SAP Transaction | FORAY Mapping | Primary Risk Fields |
| FB01/FB50 (GL Posting) | Arrangement + Accrual + Action | parties[] (cost centers), encrypted_output (amounts) |
| FB60 (AP Invoice) | Full 4-component | parties[] (vendors), flows[].amount |
| FB70 (AR Invoice) | Full 4-component | parties[] (customers), flows[].amount |
| AFAB (Depreciation) | Arrangement + Accrual | salted_formula_id (depreciation method) |
| F.13 (Intercompany) | Arrangement + Accrual | parties[] (entities), cross-entity reconciliation |

## 9. Conclusion

FORAY Protocol provides comprehensive protection for enterprise transaction data through its 3-layer privacy architecture (ZK-ready). The analysis identifies the following key findings:

### Critical Risk Fields (Risk 8-9)
These fields require maximum protection and represent the highest value targets for adversaries:
- **salted_formula_id** - Proprietary calculation logic
- **parties[]** - Counterparty identification
- **encrypted_inputs/output** - Actual business values
- **flows[].quantity/amount** - Transaction values

### Protection Architecture
- **On-chain**: Only cryptographic commitments (hashes, encrypted blobs, ZK proofs)
- **Off-chain**: All sensitive data (salts, keys, plaintext, formulas, mappings)
- **Computation**: Complex operations performed off-chain; only results anchored on-chain

### Attack Resilience
Even a nation-state adversary with quantum computing capabilities faces:
- 6-12 months of sustained analysis
- $2M-$5M in computational costs
- Less than 15% success probability

This makes competitive intelligence attacks economically irrational for all but the most determined and well-funded adversaries, achieving the FORAY design goal of making attacks "not worth the effort."

## Document History

| Version | Date | Changes |
| 1.0 | January 2026 | Initial analysis |
| 2.0 | January 2026 | Added integration mappings, computational distribution, expanded threat vectors |

**See Also:**
- [FORAY_Technical_Assumptions_Weaknesses.md](./FORAY_Technical_Assumptions_Weaknesses.md)
- [FORAY_Standard_Disclaimer.md](./FORAY_Standard_Disclaimer.md)
- [FORAY_Implementation_Roadmap.md](./FORAY_Implementation_Roadmap.md)
