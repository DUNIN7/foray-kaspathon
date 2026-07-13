# DUNIN7 FORAY Protocol Stack
## Schema, Pattern Map & Transaction Classification Reference

**Author:** Marvin Percival | DUNIN7 | marvinp@dunin7.com  
**Created:** 2026-03-26  
**Demo:** foray.dunin7.com  
**Status:** Prior Conception Record | Patent Pending US 63/980,193

---

## Design Philosophy

> **FORAY is a protocol, not a service. Our job is to make it lean and mean — built to survive turmoil and technology.**

FORAY does not live anywhere. It is implemented everywhere. Like TCP/IP, it defines the standard. Implementations evolve. Persistence layers change. Connectors multiply. Agents improve. The protocol survives all of it.

DUNIN7 publishes the protocol, maintains the specification, and certifies connectors. DUNIN7 does not operate FORAY. No central operator means no central point of failure, no central point of trust, and no central point of compromise. The persistence layer is the shared truth. The protocol is the standard. The record outlasts any single organisation — including DUNIN7.

Every architectural decision is tested against one question: **does this survive turmoil and technology?** If yes, proceed. If no, reject.

**Deployment model and licensing:**

The FORAY protocol is deployment-model neutral. Compliant implementations may be self-hosted, embedded in connectors, or offered as commercial services. The protocol does not mandate or prohibit any deployment model. What anyone builds on top of the specification — including commercial services — is outside the protocol's scope.

The license is not neutral. Commercial implementations of the FORAY protocol — including hosted services offered to third parties — require a commercial license from DUNIN7. Non-commercial and internal non-production use is permitted under the terms of the Business Source License 1.1. The protocol is deployment-model neutral. The license is not.

---

## Purpose

This document captures the schema architecture, asset behaviour taxonomy, transaction pattern map, and configuration selection criteria derived from extensive mapping of maximally diverse transaction types against the FORAY core schema. It serves as the foundation for agentic interface design and ongoing transaction type validation. The transaction set documented here represents an initial investigative reference — a deliberately stress-tested sample spanning industries, instruments, asset types, and edge cases specifically chosen to break the schema if it could be broken. It is not an exhaustive catalogue. Every business transaction in history is a candidate for addition.

---

## 1. Foundational Principles

The FORAY core schema was stress-tested against a maximally diverse investigative set of transactions spanning merchant banking, autonomous manufacturing, insurance, real estate, healthcare, technology, government, supply chain, and highly unusual transaction categories including barter, catastrophe bonds, carbon credits, and water rights. Transactions were selected specifically to challenge the schema — instruments that break conventional ledgers, edge cases that resist clean decomposition, and structurally obscure arrangements that have historically required special accounting treatment. The core schema required zero modifications across the entire investigative set.

Five principles emerged as inviolable:

| Principle | Statement |
|-----------|-----------|
| The protocol is the invariant | FORAY is a protocol, not a service. Implementations, persistence layers, and connectors evolve. The protocol survives. |
| The core never grows | The mandatory dataset is the minimum required to describe any business transaction. Adding fields to accommodate edge cases breaks the universality that makes FORAY valuable. |
| Complexity lives in the schema | Optional schema fields carry domain vocabulary, formula detail, and asset properties. They enrich without modifying the core. |
| Intelligence lives in the interface | Asset classification, party role resolution, and configuration selection are performed by the submission agent before data reaches FORAY. FORAY receives only what it needs. |
| FORAY rewards completeness | Parties that supply complete data earn execution fidelity weighting. Parties that do not supply complete data receive no weighting benefit. The incentive is in the participant, not the protocol. |

> **FORAY does not mandate completeness. It rewards it.**

---

## 2. Core Schema

The core schema consists of four components — Arrangements, Accruals, Anticipations, and Actions (4A). Attestations are available as a FORAY capability but are not part of the core schema. A transaction is complete without them.

No component is mandatory. The Transaction ID is the invariant — the anchor that all component submissions reference. The 4A components populate the record as the transaction unfolds. A submission may contain any combination of the four components, or none beyond the Transaction ID itself. See Section 6 for configuration patterns.

### 2.1 Arrangements

| Field | Description |
|-------|-------------|
| Transaction ID | Unique identifier. Tamper-evident anchor for the transaction. |
| Parent Reference Type | Null if originating. Otherwise: Transaction (standard child), Accrual (this Arrangement was spawned by an Accrual obligation from a prior transaction), or Action (this Arrangement was spawned by an Action in a prior transaction). |
| Parent Reference ID | Null if originating. The Transaction ID or Accrual ID that originated this Arrangement. Combined with Parent Reference Type, makes the transaction graph fully traversable. |
| Transaction Type | Controlled vocabulary. Defines the nature of the transaction. AI-assisted classification at submission. |
| Party Identifiers | Cryptographically obfuscated. Minimum two parties. Collective entities (syndicates, SPVs) are valid party types. |

> The Arrangement is the handshake — transaction type and parties only. It does not describe the deal. It declares that these parties are entering this type of transaction. All detail unfolds downstream. The lineage reference makes every node in the transaction graph traceable to its origin — whether that origin is another transaction or an Accrual obligation that became a transaction in its own right.

**Party rules across all components:**

| Component | Party Role | Rule |
|-----------|-----------|------|
| Arrangement | Transaction parties | The parties who agreed to transact. The core roster for this transaction only. |
| Accruals | Obligor / Beneficiary | Any party to whom an obligation flows as a consequence of the transaction. No constraint on relationship to Arrangement parties — the full economic footprint of the transaction, including parties who benefit or bear obligations without being part of the agreement. |
| Anticipations | From Party / To Party | The specific party pair for the expected transfer. Must include at least one Arrangement party. |
| Actions | From Party / To Party | The specific party pair for the actual transfer. Must include at least one Arrangement party. |

> The true economic impact of a transaction is often far wider than the parties who signed it. Accruals capture that footprint completely. An Accrual may introduce parties entirely unrelated to the core transaction — and may itself spawn a new Arrangement, extending the transaction graph to arbitrary depth. An Action may equally spawn a new Arrangement — a delivery Action initiating a warranty Arrangement, a payment Action opening a renewal, a state-change Action triggering the next production cycle. Both Accruals and Actions can extend the graph from any point in a transaction's lifecycle.

### 2.2 Accruals

| Field | Description |
|-------|-------------|
| Accrual ID | Unique identifier. References parent Transaction ID. |
| Accrual Type | One of three types: Fixed, Valuation-based, or Formula-based. |
| Accrual Properties | The variables the formula or valuation will consume. Does not contain the formula itself — that lives in the source system. |
| Accrual Sequence | Null if independent. References prior Accrual ID if this Accrual depends on another completing first. Enables chained calculation (e.g. tax on discount on base price). |
| Obligor Party | Cryptographically obfuscated. The party who bears the obligation. May be any party — no constraint on relationship to Arrangement parties. |
| Beneficiary Party | Cryptographically obfuscated. The party to whom the obligation accrues. May be any party — no constraint on relationship to Arrangement parties. Entirely unrelated third parties may benefit from a transaction's obligations without participating in the Arrangement. |
| Spawned Arrangement ID | Null if this Accrual does not originate a new transaction. Populated when the Accrual obligation becomes the originating event for a new Arrangement. Enables the transaction graph to extend beyond the boundaries of the originating transaction.

**Accrual Types:**

| Type | Definition |
|------|-----------|
| Fixed | A predetermined, unchanging obligation set at Arrangement creation. |
| Valuation-based | An obligation whose amount is determined by the perceived or market value of an asset at a defined point. Value is oracle-dependent. |
| Formula-based | An obligation calculated by applying a formula to defined properties. The formula lives in the source system. FORAY records the properties and the result. |

> Accruals do not know about Arrangements. The Accrual references the Transaction ID. The Arrangement has no knowledge of what accrues from it. The Obligor and Beneficiary parties are unconstrained — they may be entirely unrelated to the Arrangement parties. An Accrual may itself spawn a new Arrangement, extending the transaction graph to arbitrary depth. The full economic footprint of a transaction lives in its Accruals.

### 2.3 Anticipations

| Field | Description |
|-------|-------------|
| Anticipation ID | Unique identifier. References parent Transaction ID. |
| Expected Asset | Cryptographically obfuscated. The asset expected to move or resolve. |
| From Party | Cryptographically obfuscated. The party from whom the asset is expected to transfer. |
| To Party | Cryptographically obfuscated. The party to whom the asset is expected to transfer. |
| Expected Date/Time | Projected timing. May be a range or probability distribution for uncertain transactions. |
| Anticipation Type | Projection (expected future event), Awareness (condition being monitored, not yet projected), or Contingent (may never become an Action — non-occurrence is a valid outcome). |

> An Anticipation is always an expected asset transfer between two identified parties. From Party and To Party are the parties to the anticipated transfer. An Anticipation is not always a projection — sometimes it is simply an awareness that a condition exists and is being monitored.

### 2.4 Actions

| Field | Description |
|-------|-------------|
| Action ID | Unique identifier. References parent Transaction ID. |
| Actual Asset | Cryptographically obfuscated. The asset that actually moved or resolved. |
| From Party | Cryptographically obfuscated. The party from whom the asset transferred. |
| To Party | Cryptographically obfuscated. The party to whom the asset transferred. |
| Actual Date/Time | Confirmed timestamp of execution. The timestamp is what makes an Action real — without it, the event has not occurred. |
| Originating Anticipation ID | The Anticipation this Action resolves. Null if no Anticipation preceded it. An Action without a corresponding Anticipation in a transaction type that always has one is a structural anomaly. |
| Action Type | Transfer (asset moves between two identified parties) or State Change (condition confirmed without asset movement — From Party and To Party are the same party). |

> An Action is always an asset transfer between two parties. From Party and To Party are mandatory when Action Type is Transfer. The timestamp is the Action's identity — it is what distinguishes execution from intention.

---

## 3. Optional Schema Layer

The optional layer carries domain vocabulary, formula detail, asset properties, and party classification. It enriches the core schema without modifying it. Everything sensitive receives the same cryptographic treatment as the core schema fields.

The exceptional variety of optional data across transaction types is itself the proof that none of it belongs in the core schema.

### 3.1 Attestations (Optional)

Attestations are the event layer of the FORAY protocol. They are not business transactions. They are claims — made by an identified, credentialed party, at a defined point in time, anchored tamper-evidently alongside the transaction they reference.

**FORAY records what was claimed. It does not verify whether the claim was true.**

An Attestation establishes: who claimed what, under what credentials, at what time. The tamper-evident anchor makes the claim permanently attributable. Whether the claim was honest, accurate, or complete is outside the boundary of the protocol. A false Attestation is permanently attributable to its author. FORAY does not prevent false claims. It makes them impossible to deny.

This is the layer where AI agent observability connects to business transaction accountability. An AI agent's decision cycle — authorisation check, reasoning, projection, execution — is a sequence of events, not a business transaction. Each event is a claim made by the agent about what it did and why. Each claim is an Attestation referencing the Transaction ID it ultimately produced or failed to produce. The full chain — from agent authorisation to transaction execution — is auditable as a sequence of attributed claims anchored to a common transaction record.

Current AI agent audit trail tools (Galileo, Elydora, Kiteworks and others) record agent events with cryptographic signing. They solve the logging problem. Without a transaction anchor, those logs have no context — they record what the agent did but cannot answer whether what it did was consistent with what it was authorised to do, what it projected, or what the business transaction required. FORAY provides that anchor. The Attestation gives the agent's event trail its meaning.

| Field | Description |
|-------|-------------|
| Attestation ID | Unique identifier. References parent Transaction ID. |
| Attesting Party | Cryptographically obfuscated. The identified, credentialed party making the claim. The credentialed identity is what makes the claim attributable. |
| Claim Type | Controlled vocabulary. Provenance, valuation, delivery confirmation, identity assertion, agent authorisation, agent reasoning record, agent execution record, compliance confirmation, review outcome. |
| Claim | What is being claimed — stated precisely as the claimant's assertion, not as verified fact. |
| Credential Reference | The credential under which the claim is made. What authorises this party to make this claim. |
| Date/Time | When the claim was made. The timestamp is the anchor point. |
| Referenced Component | Optional. References a specific Accrual ID, Anticipation ID, or Action ID within the transaction if the Attestation applies to a specific component rather than the transaction as a whole. |

> An Attestation is a tamper-evidently anchored claim. FORAY records who claimed what and when. It does not establish truth. A false Attestation is permanently attributable to its author — that is the protocol's entire contribution to the problem of honesty.

### 3.2 Asset Detail (Optional)

| Field | Description |
|-------|-------------|
| Asset ID | References Action ID or Anticipation ID. |
| Asset Type | Controlled vocabulary. AI-resolved at submission using the nine behavioural types defined in Section 4. |
| Asset Properties | Domain-specific. Source system supplied. |

### 3.3 Accrual Formula (Optional)

| Field | Description |
|-------|-------------|
| Formula ID | References Accrual ID. |
| Formula Expression | Source system supplied. The actual calculation logic. |
| Formula Variables | Mapped to Accrual Properties in the core schema. |

### 3.4 Party Detail (Optional)

| Field | Description |
|-------|-------------|
| Party ID | References Arrangement. |
| Party Type | Individual, Collective (syndicate, fund), Structural (SPV, trust), External (reference entity), Open Recipient (resolved at Action point), or Directing Authority (shapes Arrangement without participating in asset flows). |
| Party Properties | Domain-specific. Source system supplied. |

### 3.5 Anticipation Resolution (Optional)

| Field | Description |
|-------|-------------|
| Resolution ID | References Anticipation ID. |
| Resolution Paths | Where multiple outcomes are possible — defines each path and its conditions. |
| Resolution Type | Single (one outcome), Alternative (multiple possible, one will occur), or Null (non-occurrence is the valid outcome). |

---

## 4. Submission Schema

The submission schema is the external interface contract. It is what every connector must produce and what FORAY validates on receipt. It is sovereign — it does not know about SAP, Oracle, or any other source system. Everything upstream conforms to it. FORAY never conforms to anything upstream.

### 4.1 Submission Envelope

```json
{
  "foray_submission": {
    "schema_version": "1.0",
    "transaction_id": "<SHA-256 hash>",
    "parent_reference": {
      "type": null,
      "id": null
    },
    "submission_type": "",
    "submission_timestamp": "",
    "persistence": [],
    "boundaries": {
      "evaluation_reference": null,
      "decision_timestamp": null,
      "override_flag": null
    },
    "arrangement": {},
    "accruals": [],
    "anticipations": [],
    "actions": []
  }
}
```

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| schema_version | string | "1.0" | Determines hash algorithm and validation rules. Version 1.0 implies SHA-256. |
| transaction_id | string | SHA-256 hash | Hash of agent-generated composite pre-image. Opaque to all external observers including FORAY. Globally unique by construction. Never transmitted in plaintext. |
| parent_reference.type | enum / null | null, "transaction", "accrual", "action" | Null if originating. Identifies what parent_reference.id points to. |
| parent_reference.id | string / null | SHA-256 hash | Hashed ID of parent Transaction or Accrual. Null if originating. |
| submission_type | enum | "new", "amendment", "component" | New — first submission for this transaction_id. Amendment — append-only correction, original record always preserved. Component — adds to an existing transaction. |
| submission_timestamp | string | ISO 8601 UTC | When the submission agent created this submission. |
| persistence | array | — | See Section 4.2. Zero or more persistence layer declarations. The initiator declares, pays, and bears responsibility. FORAY executes and records. |
| boundaries | object | — | Reserved. All fields null until BOUNDARIES protocol is implemented. |

### 4.2 Persistence Layer Declaration

FORAY is persistence-layer agnostic. The submitting party declares which persistence layer or layers to use. FORAY executes the anchoring according to the declaration. The cost is borne by the initiator. The choice and its consequences belong entirely to the author of the declaration.

An empty persistence array is a valid submission — FORAY records the transaction without anchoring it. The absence of anchoring is itself recorded and visible to the weighting model and to auditors.

```json
"persistence": [
  {
    "layer": "",
    "layer_version": null,
    "layer_parameters": {}
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| layer | string | Identifier of the persistence layer. e.g. "kaspa-mainnet", "kaspa-testnet", "ethereum-mainnet", "hyperledger-fabric", "iso-timestamp-log" |
| layer_version | string / null | Version or network identifier at time of submission. |
| layer_parameters | object | Open key-value structure. Carries whatever the chosen persistence layer requires. |

**Required persistence layer properties for FORAY compatibility:**

| Property | Requirement |
|----------|-------------|
| Tamper-evident | Any alteration to an anchored record must be detectable |
| Independently verifiable | Verification must not depend on FORAY or the submitting party |
| Append-only | Records can be added but not deleted or modified |
| Timestamped | Each anchor carries an independently verifiable timestamp |
| Durable | The persistence layer must outlive any single operator |
| Accessible | Verification must be possible without privileged access |

> The persistence layer is an offered capability, not a decided architecture. Multiple layers may be declared simultaneously. A party that anchors to a credible, independently verifiable layer carries more weight in the execution fidelity model than one that anchors to an unverified private log.

### 4.3 Transaction ID Generation

The transaction_id is generated by the submission agent before submission. It is a SHA-256 hash of a composite pre-image:

```
transaction_id = SHA-256( namespace + timestamp + entropy )
```

| Component | Description |
|-----------|-------------|
| namespace | A registered identifier for the submitting organisation. Never transmitted. Known only to the submitting agent. |
| timestamp | ISO 8601 to microsecond precision. Eliminates collisions across time within the same namespace. |
| entropy | Cryptographically random component. Eliminates collisions within the same namespace at the same microsecond. |

The pre-image is retained by the submitting agent's key management implementation. The submission agent never stores it in plaintext. The hash is the only form transmitted to FORAY or anchored to the persistence layer.

The submitting party can prove ownership of any transaction by demonstrating they can reproduce the hash from the pre-image. That proof is available on demand — for audit, dispute resolution, or regulatory disclosure — but is never visible by default.

### 4.4 Amendment Protocol

Amendments are append-only. The original record is immutable. Every amendment is a new anchored record that references the original transaction_id. The full history — original plus all amendments — is always visible. Deletion is structurally impossible.

```json
{
  "submission_type": "amendment",
  "transaction_id": "<hash of this amendment>",
  "parent_reference": {
    "type": "transaction",
    "id": "<hash of original transaction>"
  }
}
```

An amendment may add or clarify. It may never delete. Any attempt to submit an amendment that removes a previously anchored field is rejected.

---

## 5. Asset Behaviour Taxonomy

Across the investigative transaction set, nine distinct asset behaviours emerged. Extensive investigation across maximally diverse transaction types produced nine behavioural types without producing a tenth. Additional types, if they exist, remain to be identified by the community.

The submission agent does not ask what an asset is — it asks how the asset behaves.

| # | Behaviour Type | Definition |
|---|---------------|-----------|
| 1 | Complete Transfer | The asset leaves one party and arrives at another in unchanged form. Ownership is unambiguous before and after. |
| 2 | Conditional Transfer | The asset moves physically but ownership remains unresolved until a condition is met. Two possible outcomes exist simultaneously — completion or reversal. |
| 3 | Transformation | The asset enters as one thing and exits as another. The input is consumed. The output is created. They are related by the transformation process but are not the same asset. |
| 4 | Consumption | The asset is used and ceases to exist in any recoverable form. It generates cost but no output asset. Its only record is the Accrual it produced and the Action that confirmed its consumption. |
| 5 | Governing Reference | The asset exists as a calculation reference. It has no owner in the transactional sense. It cannot be delivered. Its value drives obligations but it never moves. |
| 6 | Creation | The asset did not exist before the transaction. It is brought into existence by the Arrangement itself. Its value is entirely a function of the obligation it represents. |
| 7 | External Destruction | The asset exists and transfers normally until an external event eliminates it. The destruction is an Action with no recipient. The cause is outside the stack. |
| 8 | Right | A claim on future access, delivery, or participation. Has value before exercise. Exercise may be discretionary, conditional, or time-bound. The right and its exercise are separate transactions linked by lineage. |
| 9 | Perceived Value | No intrinsic measurable value independent of what parties believe it to be worth. Its valuation is the oracle. The transaction is real. The value is agreed, not derived. |

### 5.1 Asset Behaviour to Pattern Mapping

**Type 1 — Complete Transfer**
- Accrual: Payment obligation, fixed or valuation-based, against the transferred asset's agreed value.
- Anticipation: Projected delivery at defined date and value.
- Action: Asset moves from one party to the other. Payment moves in the opposite direction. Both confirmed.

**Type 2 — Conditional Transfer**
- Accrual: Obligation builds but is discounted by condition probability. May reverse if condition fails.
- Anticipation: Two competing projections exist simultaneously — completion path and reversal path.
- Action: Resolves to one path only. The other Anticipation is retired without generating an Action.

**Type 3 — Transformation**
- Accrual: Cost obligation builds against inputs consumed. Formula-based. May carry probability range if yield is uncertain.
- Anticipation: Projected output quantity, quality, and timing.
- Action: Input withdrawal confirmed. Output deposit confirmed. Two Actions, one Arrangement. Input ceases. Output is created.

**Type 4 — Consumption**
- Accrual: Cost obligation builds continuously against consumption rate. Formula or valuation-based.
- Anticipation: Projected consumption quantity and cost over defined period.
- Action: Consumption confirmed. No output asset. The Action records disappearance, not transfer.

**Type 5 — Governing Reference**
- Accrual: Obligation calculated against the reference asset's value. The asset itself never moves.
- Anticipation: Projected obligations derived from reference asset value at future points.
- Action: Net settlement between parties. The reference asset never appears in an Action — only its derivative obligation does.

**Type 6 — Creation**
- Accrual: Obligation created at issuance. Basis fixed at creation. May be statistically discounted for expected non-redemption.
- Anticipation: Projected redemption or expiry. Non-occurrence is a valid and valued resolution.
- Action: Redemption if exercised. Expiry write-off if not. Both are valid Actions. The asset ceases to exist in either case.

**Type 7 — External Destruction**
- Accrual: Builds normally until destruction event. Ceases at destruction.
- Anticipation: Normal projection until external event overrides. Post-event Anticipations are retired.
- Action: Destruction recorded as an Action with no recipient. The asset exits the system. The cause is outside the stack.

**Type 8 — Right**
- Accrual: Obligation builds against the right's existence, not its exercise. Vesting, premium, or holding cost.
- Anticipation: Two layers — awareness that the right exists, projection of exercise when exercise becomes probable.
- Action: Right transfer is one transaction. Each exercise of the right is a child transaction linked by lineage.

**Type 9 — Perceived Value**
- Accrual: Valuation-based against an oracle or agreed price. The oracle is the only source of value.
- Anticipation: Projected value at future points based on current oracle. May carry wide probability range.
- Action: Transfer at agreed perceived value. The gap between oracle value and actual transaction value is itself data.

---

## 6. Transaction Record Configurations

No component is mandatory. The Transaction ID is the invariant. The 4A components populate the record as the transaction unfolds. A submission may contain any combination of the four components, or none beyond the Transaction ID itself.

The absence of a component is itself information. A record with no Actions is a transaction in progress. A record with no Anticipations is a transaction with no forward projection. A record with no Arrangement is a component submission against a transaction whose parties were established in a prior submission.

Common patterns observed across the investigative set:

| Pattern | When it occurs |
|---------|---------------|
| Transaction ID only | A transaction is declared but no components have yet been submitted |
| Arrangement only | Parties agree to transact — obligations, projections, and executions follow in subsequent submissions |
| Action only | A simple completed transfer with no preceding obligation or projection — point of sale, cash withdrawal, barter |
| Action + Accrual | A transfer that carried a building obligation — payroll, tax settlement, retail sale with discount chain |
| Action + Anticipation | A transfer that was projected but carried no building obligation — scheduled delivery, milestone payment |
| Full 4A | All components present across one or more submissions — loan, derivative, acquisition, long-term supply agreement |

### 6.1 Configuration Selection Criteria

The submission agent evaluates four questions in order:

| Question | Decision |
|----------|----------|
| Are there standing parties with a continuing relationship? | Yes → Arrangement warranted. No → No Arrangement. |
| Did an obligation build before the asset moved? | Yes → Accrual warranted. Evaluate sequence dependencies. No → No Accrual. |
| Was the asset movement projected before it occurred? | Yes → Anticipation warranted. No → No Anticipation. |
| Did an asset move, a state change, or an obligation resolve? | Yes → Action warranted. No → Submission records the current state of the transaction without an execution event. |

> The configuration is determined entirely by the transaction's actual structure and the submitter's discipline — not by the protocol. An Action with no traceable Anticipation in a transaction type that structurally always has one is a structural anomaly visible in the population record.

---

## 7. Multi-Behaviour Combination Rules

Three rules govern all combinations:
- The primary behaviour always determines the base pattern.
- Secondary behaviours add components — they never replace or modify primary components.
- Every combination produces a valid minimal transaction — no combination requires components beyond the four core elements.

| Combination | Rule |
|-------------|------|
| Primary + Conditional Transfer | Primary behaviour patterns apply throughout. A secondary Anticipation is added for the reversal path. The reversal Anticipation is retired without an Action if the primary condition is met. |
| Primary + Governing Reference | Primary behaviour patterns apply to the transferring asset. The reference asset appears only in Accrual Properties as the valuation input. It never appears in an Action. |
| Primary + Right | Primary behaviour patterns apply to the initial transfer. A child transaction lineage is established at exercise. The right and its exercise are always separated into parent and child transactions. |
| Primary + Creation | The created asset is a separate Action within the same Arrangement. It references the primary Action as its originating event. It carries its own Accrual chain from the point of creation. |
| Primary + Perceived Value | Primary behaviour patterns apply. The Accrual type is valuation-based with the oracle in Accrual Properties. The gap between oracle value and actual transaction value is recorded as a separate Accrual property. |
| Primary + External Destruction | Primary behaviour patterns apply until the destruction event. At destruction, all open Anticipations are retired. A final Action is recorded with no recipient. The originating event is recorded in Action Properties as an observed fact. |

---

## 8. Execution Fidelity Weighting Model

| Element | Description |
|---------|-------------|
| Purpose | To create an auditable, statistically grounded signal of whether a party's Actions match their Anticipations — at the transaction level and cumulatively over time. |
| Mechanism | At transaction inception, a completeness weight is calculated based on the data supplied relative to what the transaction type requires. This weight can be recalculated at any subsequent point as Actions resolve against Anticipations. |
| Party Signal | A party that consistently delivers Actions matching Anticipations builds a positive execution fidelity weight. A persistent Anticipation/Action gap signals a behavioural pattern regardless of documentation quality. |
| Data Requirement | The model requires complete submission through the interface. FORAY cannot manage source system discipline — that is the source's responsibility. Parties that want the reputational benefit must supply the data that earns it. |
| Population Signal | Transactions absent from the well-formed population are themselves a signal. Completeness weight at inception allows the model to tune for the fraction of transactions that support it. |
| Privacy | Party identifiers are cryptographically protected. The interface matches its own Anticipations to Actions cleanly. An external observer sees undifferentiated encrypted records. The model works inside the trust boundary. Privacy holds outside it. |
| Scope | Applies only to transaction types where Anticipations are present and have a determinate matching relationship to Actions. Action-only transactions are excluded by definition. |

> **FORAY does not mandate completeness. It rewards it.**

---

## 9. Strategic Architecture Notes

| Note | Description |
|------|-------------|
| FORAY as universal language | If every transaction type can be mapped to FORAY protocol, then every ERP system can be a source for FORAY transactions. The stack becomes the common language that survives every acquisition, divestiture, and system migration. |
| The schema as interface contract | The schema is the API contract between the world's complexity and FORAY's simplicity. Agents use it to know exactly what to collect, what to pass through, and what to discard. FORAY never sees the noise. |
| Agentic construction | A comprehensive schema derived from source systems becomes the foundation for real-time agentic transaction construction in the opposite direction — FORAY stops being a recorder and becomes the blueprint from which agents construct transactions directly. |
| Domain expertise preserved | The schema gives domain expertise a universal outlet. Source system creators remain domain experts. FORAY means their knowledge is no longer trapped inside their own format. |
| Audit as entry point | Audit is the mechanism that earns initial adoption. Continuity through structural chaos — surviving acquisitions, divestitures, and system migrations with a single coherent transaction record — is the sustained value proposition. |
| The core must never grow | The minimum dataset sufficient to record any transaction is the invariant. Complexity lives in the schema. Intelligence lives in the interface. The moment the model's appetite defines what FORAY stores, both the model and FORAY are broken. |

---

## 10. Initial Transaction Validation Reference — Set One

### 10.1 Merchant Banking

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Leveraged Buyout | Complete Transfer | Asset arrives with inherited obligations from prior transactions |
| Interest Rate Swap | Governing Reference | Notional principal never transfers — governs all obligations |
| Letter of Credit | Conditional Transfer + Right | Attestation gates drawdown but is not mandatory for recording |
| Syndicated Loan | Complete Transfer | Syndicate as collective party type — membership invisible to FORAY |
| IPO Underwriting | Complete Transfer | Public distribution is a child transaction linked by lineage |
| FX Spot Trade | Complete Transfer | Exchange rate lives in Accrual as valuation basis, not Arrangement |
| Credit Default Swap | Governing Reference + Contingent | Reference entity is Accrual input, not a party. Anticipation designed not to become an Action |
| Asset Securitization | Transformation + Creation | Asset type changes mid-transaction. SPV as structural party type |
| Commodity Futures | Right + Governing Reference | Margin Actions continuously reset Accrual basis. Dual resolution paths |
| Distressed Debt Acquisition | Perceived Value + Right | Two simultaneous valuations of same asset. Open-ended recovery Actions |

### 10.2 Autonomous Manufacturing

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Raw Material Transformation | Transformation | Inventory as party on both sides. Machine time and labor as consumed assets |
| Chemical Batch Synthesis | Transformation | Probabilistic yield — Anticipation carries range not fixed value |
| Multi-Stage Assembly | Transformation | Intermediate states exist only in transit. Each stage a child transaction |
| Quality Rejection & Disposition | Conditional Transfer | Three alternative resolution paths. Inherited sunk cost Accruals |
| Subcontracted Process Step | Complete Transfer | Asset enters external system — transformation invisible to FORAY |
| Inventory Replenishment | Complete Transfer | Structurally identical to FX spot trade. Trigger logic lives in interface |
| Tooling Setup & Changeover | Consumption | First transaction producing no transferable output. Action is a state change |
| Rework & Scrap | Transformation + Consumption | Layered inherited Accruals. Scrap disposal itself generates a final Accrual |
| Energy as Production Input | Consumption | Accrues against individual production runs, not as standalone transaction |
| Packaging & Serialization | Transformation + Creation | Serialization assigns individual identity — informational transformation |

### 10.3 Edge Cases & Unusual Transactions

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Contingency Fee Legal | Right + Contingent | Accrual builds but may never trigger. Structurally identical to CDS |
| Perpetual Revenue Share | Right | Open-ended Arrangement with no termination. Actions accumulate indefinitely |
| Carried Interest | Perceived Value + Contingent | Accrual is non-monotonic — reverses and rebuilds. Anticipation is awareness until liquidity event |
| Employee Stock Option | Right + Conditional Transfer | Grant and exercise are same Arrangement separated by discretionary decision |
| Loyalty Points / Breakage | Creation + Contingent | Non-occurrence is valued outcome. Breakage rate is the oracle |
| Sale or Return Consignment | Conditional Transfer | Asset pool simultaneously resolving forward and backward against same Arrangement |
| Carbon Credit Transaction | Complete Transfer | Asset is the right to emit. Complexity lives in description, not structure |
| Water Rights Transfer | Right | Access Actions are indefinite child transactions. Value governed by environmental oracle |
| Catastrophe Bond | Right + External Destruction | External physical event destroys primary asset. Destruction Action has no recipient |
| Barter & Counter-Trade | Complete Transfer | No currency. Accruals denominated in kind. Core accommodates without modification |

---

## 11. Schema Additions from Second Validation Pass

Three issues surfaced during the second validation pass. All three were resolved within the optional schema layer. The core schema required no modification.

### 11.1 Non-Financial Service Obligations

**Issue:** The infrastructure concession agreement introduced a service obligation — a non-financial Accrual building against operational performance rather than monetary value.

**Resolution:** Accruals are confined to measurable financial consequences only. If a service obligation cannot be expressed as a formula against measurable performance metrics, it belongs in the contract documentation in the source system, not in FORAY.

> Rule: If it cannot be measured as a financial obligation, it is not an Accrual.

### 11.2 Indeterminate Open Recipient

**Issue:** The open source bounty introduced a transaction where the receiving party is genuinely unknown at Arrangement creation.

**Resolution:** A placeholder party type — Open Recipient — added to the optional schema layer. The Arrangement carries the placeholder. The resolving Action carries the actual party identifier.

### 11.3 Directing Authority Party Role

**Issue:** The divorce asset settlement introduced a court authority — a governing party that determines transaction terms without participating in any asset flow.

**Resolution:** Directing Authority party role added to the optional schema layer. Appears in the Arrangement only. Does not appear in Actions.

---

## 12. Initial Transaction Validation Reference — Set Two

### 12.1 Insurance and Risk

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Life Insurance Premium & Claim | Governing Reference + Contingent | Structurally identical to CDS. Trigger event is the oracle. |
| Reinsurance Treaty | Governing Reference | Underlying portfolio governs all Accruals without appearing in the Arrangement. |
| Parametric Insurance Trigger | Creation + Contingent | Index is oracle. Benefit automatic on threshold crossing — no loss assessment required. |
| Captive Insurance Arrangement | Complete Transfer | Captive is a structural party. Excess reserve dividend returns capital to parent. |

### 12.2 Real Estate and Infrastructure

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Commercial Mortgage | Complete Transfer + Governing Reference | Property is collateral — Type 5 governing reference until default. |
| Ground Lease | Right | 99-year duration. Improvements are child transactions invisible to parent. Reversion transfers asset whose value was created outside the Arrangement. |
| REIT Distribution | Governing Reference | Property portfolio governs all Accruals. Unit holders are collective party. |
| Infrastructure Concession | Right + State Change | Non-financial service obligation resolved — Accruals confined to measurable financial consequences. |

### 12.3 Healthcare and Life Sciences

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Drug Royalty Monetisation | Right + Governing Reference | Drug sales are governing reference. Royalty right generates indefinite child transactions. |
| Clinical Trial Milestone | Contingent | Fixed Accruals crystallise at discrete achievement events rather than building continuously. |
| Medical Device Lease / Usage Billing | Right + Consumption | Dual concurrent Accruals with sequence dependency — usage charges layer on base lease. |
| Organ Procurement Chain | Transformation + External Destruction | Time-critical viability window in Anticipation. Failure is Type 7 destruction — time-triggered. |

### 12.4 Technology and Intangibles

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Software Licence / Usage Tiers | Right + Creation | Tier upgrade is loyalty points model inverted — obligation escalates with use. |
| API Call Billing | Consumption | Highest-volume type mapped — potentially billions of child Actions against single Arrangement. |
| Domain Name Acquisition | Right | Lapse is Type 7 destruction triggered by non-payment. Cause observable in record. |
| Open Source Bounty | Contingent + Right | Open Recipient placeholder party type introduced. |

### 12.5 Government and Public Sector

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Tax Payment & Refund Cycle | Formula-based Accrual | Accrual obligation can reverse direction between parties. |
| Government Grant with Clawback | Conditional Transfer | Clawback is conditional transfer in reverse — asset already transferred may return. |
| Emissions Trading Scheme | Right + Governing Reference | Trading child transactions are carbon credit transactions already mapped. |
| Sovereign Debt Issuance | Complete Transfer | Structurally identical to syndicated loan. Sovereign taxing power is implicit governing reference. |

### 12.6 Supply Chain and Trade

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Documentary Collection | Right + Complete Transfer | Documents are Type 8 right — control of documents is control of goods. |
| Tolling Arrangement | Transformation | Structurally identical to subcontracted manufacturing. Material owner retains ownership throughout. |
| Vendor Managed Inventory | Conditional Transfer | Ownership transfers at consumption, not delivery. |
| Trade Finance Receivables Purchase | Right + Perceived Value | Discount is Type 9 perceived value gap — difference between face and market price is itself data. |

### 12.7 Alternative and Emerging

| Transaction | Primary Behaviour | Notable Feature |
|-------------|------------------|----------------|
| Prediction Market Position | Governing Reference + External Destruction | Market probability is continuously updating oracle. |
| Fractional Asset Ownership | Complete Transfer + Governing Reference | Fractional owners are collective party with defined individual stakes. |
| Revenue-Based Financing | Formula-based + Contingent | Self-terminating Accrual — ceases when cumulative Actions reach the cap. |
| Digital Asset Staking Reward | Conditional Transfer + Creation + External Destruction | Most behaviours combined in one transaction. |
| IP Assignment | Right + State Change | Transfer is state change Action — ownership shifts without physical movement. |
| Divorce Asset Settlement | Perceived Value + Complete Transfer | Directing Authority party role introduced. |

---

## 13. Cumulative Schema Additions

All additions are to the optional schema layer. None affect the core schema.

| Addition | Source Transaction |
|----------|-------------------|
| Open Recipient party type | Open source bounty — resolves indeterminate recipient at Action point. |
| Directing Authority party type | Divorce settlement — governing party that shapes the Arrangement without participating in asset flows. |
| Self-terminating Accrual property | Revenue-based financing — Accrual carries a cumulative cap value. Ceases when cap is reached. |
| Time-critical Anticipation constraint | Organ procurement — hard viability window. Breach is structurally visible as timestamp anomaly. |
| Placeholder resolution reference | Open source bounty — Action ID at which Open Recipient placeholder was resolved to specific party. |

---

> An extensive investigative set of maximally diverse transactions mapped across merchant banking, manufacturing, insurance, real estate, healthcare, technology, government, supply chain, and emerging digital categories. The core schema required no modification in any case. All issues were resolved within the optional schema layer. The grammar is universal. Every business transaction since the beginning of business history maps to it.

---

*DUNIN7 | foray.dunin7.com | marvinp@dunin7.com*  
*Created: 2026-03-26 | Patent Pending US 63/980,193*  
*Copyright (c) 2026 Marvin Percival. All rights reserved.*
