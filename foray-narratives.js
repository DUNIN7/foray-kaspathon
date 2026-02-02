/**
 * ============================================================================
 * FORAY Protocol - Sample Narratives
 * ============================================================================
 * Version:       4.1.5
 * Created:       2026-02-01T12:30:00Z
 * 
 * Author:        Marvin Percival
 * Email:         marvinp@dunin7.com
 * GitHub:        github.com/DUNIN7/foray-kaspathon
 * 
 * License:       Business Source License 1.1
 * Copyright (c) 2026 Marvin Percival. All rights reserved.
 * 
 * Description:   Full narrative explanations for each sample transaction.
 *                Provides detailed business context and FORAY component mapping.
 * 
 * Usage:         <script src="foray-narratives.js"></script>
 *                Access via window.FORAY_NARRATIVES
 * ============================================================================
 */

window.FORAY_NARRATIVES = {
  batchPayment: {
    title: 'Batch Payment: Multi-Invoice Clearing',
    content: `
# Batch Payment: Multi-Invoice Clearing

## The Business Scenario

Acme Manufacturing Corp needs to pay their vendor, GlobalParts Inc, for three outstanding invoices. Rather than issuing three separate payments, the accounts payable team processes them as a single batch payment—a common practice that reduces transaction fees and simplifies bank reconciliation.

The three invoices are:
- **GP-2026-001**: $15,000 for electronic components (due Jan 27)
- **GP-2026-002**: $22,500 for mechanical assemblies (due Feb 4)
- **GP-2026-003**: $10,000 for fasteners and hardware (due Feb 9)

**Total batch payment: $47,500**

---

## How FORAY Models This Transaction

This transaction demonstrates one of v4.1's key features: **many-to-many relationships**. One payment clears multiple invoices, and the FORAY structure captures this accurately.

### The Arrangement

Everything starts with the Master Service Agreement (MSA) between Acme and GlobalParts. This two-year contract (2025-2027) covers up to $500,000 in purchases and specifies:
- Net 30 payment terms
- 2% early payment discount if paid within 10 days
- 1.5% late payment penalty

The MSA is the contractual foundation that all invoices reference back to.

### The Accruals (3 Invoices)

Each invoice becomes an Accrual in FORAY—an economic obligation that Acme owes to GlobalParts. Each accrual:
- References the MSA arrangement
- Records the invoice details (number, date, due date, line items)
- Captures the accounting entry (Debit: Raw Materials, Credit: Accounts Payable)
- Uses \`FixedAmount\` computation method since invoice totals are predetermined

### The Anticipation

Before payment execution, the AP team schedules the batch payment. This Anticipation:
- References **all three accruals** (the v4.1 many-to-many feature)
- Specifies the expected payment amount ($47,500)
- Records the planned payment date (January 25, 2026)
- Notes the payment method (ACH)

### The Action

When the payment executes, the Action records:
- The actual settlement amount ($47,500)
- ACH payment reference number
- Timestamp of completion

**Most importantly**, the Action includes an **allocations array** showing exactly how the single payment was distributed:

| Invoice | Amount | Status |
|---------|--------|--------|
| GP-2026-001 | $15,000 | Fully paid |
| GP-2026-002 | $22,500 | Fully paid |
| GP-2026-003 | $10,000 | Fully paid |

This allocation tracking is critical for auditors who need to trace how payments were applied.

---

## Why This Matters for Auditors

In a traditional audit, the auditor would need to:
1. Pull the bank statement showing the $47,500 payment
2. Request the invoice copies from AP
3. Manually match the payment to the three invoices
4. Verify the MSA terms were followed

With FORAY, all of this is captured in a single, cryptographically anchored structure. The auditor can:
- Instantly see which invoices were paid
- Verify the allocations add up to the total
- Trace each invoice back to the governing contract
- Confirm the transaction hasn't been tampered with (via blockchain anchor)

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Many-to-many references** | One Action references three Accruals |
| **Allocation tracking** | Payment split shown in allocations array |
| **Dependency chain** | Arrangement → Accruals → Anticipation → Action |
| **Privacy hashing** | Party names hashed, amounts visible |

---

## Try It Yourself

Load \`batch-payment-v41.json\` in the Transaction Review tool to see:
- Click on any dependency badge to navigate to that component
- Expand the Action to see the allocations breakdown
- Use the JSON button to view the raw structure

---

*This narrative accompanies the \`batch-payment-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  cashSale: {
    title: 'Cash Sale: Action-Only Transaction',
    content: `
# Cash Sale: Action-Only Transaction

## The Business Scenario

It's 9:15 AM at Downtown Coffee House, and the morning rush is in full swing. A customer walks up to the counter and places a large order for their office:
- 3 Large Lattes ($16.50)
- 2 Large Mochas ($12.00)
- 5 Butter Croissants ($21.25)
- 4 Blueberry Muffins ($15.00)
- 10 Large Drip Coffees ($32.50)
- 6 Bagels with Cream Cheese ($27.00)

**Subtotal: $124.25**
**Tax (8.25%): $10.25**
**Total: $134.50**

The customer pays with $140 cash and receives $5.50 in change.

This is a completely ordinary retail transaction—no contract, no credit terms, no accounts receivable. Just cash across the counter.

---

## How FORAY Models This Transaction

This transaction demonstrates v4.1's **flexible entry point** feature. In previous versions, every FORAY transaction required an Arrangement as the starting point. But a walk-in cash sale has no contract—and forcing an artificial "arrangement" would misrepresent the reality.

### The Solution: Action-Only

In v4.1, transactions can begin at any component level. For this cash sale:

- **Arrangements**: Empty array \`[]\`
- **Accruals**: Empty array \`[]\`
- **Anticipations**: Empty array \`[]\`
- **Actions**: Contains the complete transaction

The Action captures everything that matters:
- Customer type: Anonymous walk-in
- Payment method: Cash
- Register and cashier IDs
- Complete line-item detail
- Tax calculation breakdown
- Cash tendered and change given

### Why This Structure?

A retail cash sale is fundamentally different from a B2B invoice payment:

| Aspect | B2B Invoice | Retail Cash Sale |
|--------|-------------|------------------|
| Contract | Yes (MSA, PO) | No |
| Credit terms | Yes (Net 30) | No |
| Accounts receivable | Yes | No |
| Customer identity | Known | Anonymous |
| Payment timing | Future | Immediate |

FORAY v4.1 recognizes these differences. The protocol doesn't force SMBs to create fake arrangements just to satisfy a rigid schema.

---

## What's Captured in the Action

The single Action component contains rich detail:

### Point of Sale Details
\`\`\`
Register: REG-001
Cashier: EMP-042
Shift: Morning
Transaction #: 42
\`\`\`

### Line Items
All 6 products with SKU, description, quantity, unit price, and line total.

### Tax Breakdown
\`\`\`
Subtotal:      $124.25
Tax Rate:      8.25%
Tax Amount:    $10.25
Total:         $134.50
Cash Tendered: $140.00
Change Given:  $5.50
\`\`\`

---

## Privacy Considerations

Even for a simple cash sale, FORAY applies privacy principles:

- **Entity hashed**: The coffee shop's identity is hashed
- **Customer anonymous**: Walk-in customers aren't identified
- **Amounts visible**: Transaction totals are not hidden (needed for tax compliance)
- **Minimal obfuscation**: Appropriate for low-sensitivity retail transactions

---

## Why This Matters

### For SMBs
Small businesses shouldn't need complex accounting structures to participate in transparent audit trails. A coffee shop should be able to anchor their daily sales with the same cryptographic proof as a Fortune 500 company.

### For Auditors
Even simple transactions benefit from immutability. Sales tax audits, cash handling reviews, and franchise compliance checks all need reliable records.

### For the Protocol
Supporting action-only transactions means FORAY can scale from enterprise securitizations down to everyday point-of-sale transactions—capturing the full spectrum of economic activity.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Flexible entry point** | Transaction starts at Action (no Arrangement) |
| **Minimum components** | Only 1 component required (down from 4 in v4.0) |
| **Rich action data** | Line items, tax, POS details all captured |
| **Appropriate privacy** | Minimal obfuscation for public retail transaction |

---

## Try It Yourself

Load \`cash-sale-v41.json\` in the Transaction Review tool to see:
- Notice the empty Arrangements, Accruals, and Anticipations sections
- Expand the Action to see the full line-item detail
- Check the privacy metadata showing "minimal" obfuscation level

---

*This narrative accompanies the \`cash-sale-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  autoLoan: {
    title: 'Auto Loan: Full 4-Component Chain',
    content: `
# Auto Loan: Full 4-Component Chain

## The Business Scenario

Sarah Johnson walks into a Tesla dealership in Palo Alto and purchases a 2025 Model 3. She finances the vehicle through Premier Auto Finance LLC with the following terms:

- **Principal**: $35,000
- **APR**: 5.49%
- **Term**: 60 months
- **Monthly Payment**: $665.28
- **Total Interest**: $4,916.80

The vehicle serves as collateral, with a loan-to-value ratio of 87.5%. The first payment is due February 25, 2026.

This is a classic consumer credit transaction—and it demonstrates FORAY's complete 4-component model in action.

---

## How FORAY Models This Transaction

Unlike the cash sale (action-only) or batch payment (payment-focused), an auto loan naturally spans all four FORAY components over its 5-year life.

### Component 1: The Arrangement

The Retail Installment Sale Contract is the legal foundation:

**Parties:**
- Lender: Premier Auto Finance LLC (California)
- Borrower: Sarah Johnson (California)

**Key Terms:**
| Term | Value |
|------|-------|
| Principal | $35,000.00 |
| APR | 5.49% |
| Term | 60 months |
| Monthly Payment | $665.28 |
| Total Interest | $4,916.80 |
| Total of Payments | $39,916.80 |
| First Payment Due | February 25, 2026 |

**Collateral:**
- 2025 Tesla Model 3
- VIN: [hashed for privacy]
- Odometer: 150 miles at origination
- Loan-to-Value: 87.5%

**Legal Documentation:**
- Retail Installment Sale Contract
- Truth in Lending Disclosure Statement
- Security Agreement
- Certificate of Title Assignment

### Component 2: The Accruals (Interest Calculations)

Every month, interest accrues on the outstanding principal. FORAY captures each accrual period:

**February 2026 Interest:**
\`\`\`
Principal Balance: $35,000.00
Annual Rate:       5.49%
Days in Period:    31
Interest Accrued:  $163.25
\`\`\`

**March 2026 Interest:**
\`\`\`
Principal Balance: $34,497.97
Annual Rate:       5.49%
Days in Period:    28
Interest Accrued:  $145.32
\`\`\`

Each accrual includes the accounting entry:
- Debit: Interest Receivable
- Credit: Interest Income

The formula ID is hashed (\`hash_simple_interest_daily_365\`) so auditors can verify the calculation method without exposing proprietary rate structures.

### Component 3: The Anticipations (Payment Schedule)

Before each payment is received, FORAY records what's expected:

**Payment #1 (February 2026):**
| Component | Amount |
|-----------|--------|
| Principal | $502.03 |
| Interest | $163.25 |
| **Total** | **$665.28** |
| Balance After | $34,497.97 |

**Payment #2 (March 2026):**
| Component | Amount |
|-----------|--------|
| Principal | $519.96 |
| Interest | $145.32 |
| **Total** | **$665.28** |
| Balance After | $33,978.01 |

Notice the probability factor of 0.97—this reflects a 3% expected default rate for this credit tier.

### Component 4: The Actions (What Actually Happened)

**Loan Disbursement:**
On January 25, 2026, Premier Auto Finance wires $35,000 to the Tesla dealer. This action:
- References the arrangement (the loan contract)
- Records the wire transfer details
- Confirms vehicle delivery and title receipt

**First Payment Receipt:**
On February 25, 2026, Sarah's ACH payment of $665.28 arrives. The action captures:
- Payment reference number
- Settlement timestamp
- **Allocation breakdown** showing how the payment was applied:
  - $163.25 → Interest (fully satisfies Feb interest accrual)
  - $502.03 → Principal (partial reduction of loan balance)

---

## The Complete Chain

\`\`\`
Arrangement (Loan Contract)
 ↓
Accrual (Feb Interest: $163.25)
 ↓
Anticipation (Feb Payment Expected: $665.28)
 ↓
Action (Feb Payment Received: $665.28)
 → Allocation: $163.25 to interest
 → Allocation: $502.03 to principal
\`\`\`

This chain continues for all 60 months of the loan. Each month adds:
- 1 Accrual (interest calculation)
- 1 Anticipation (expected payment)
- 1 Action (actual payment received)

---

## Privacy Protections

Consumer credit data requires enhanced privacy. This transaction uses:

| Data Element | Protection |
|--------------|------------|
| Borrower name | Hashed (sha256:borrower_johnson_sarah) |
| VIN | Hashed (sha256:vin_5yj3e1ea_hashed) |
| Dealer name | Hashed |
| Interest formula | ID hashed, calculation verifiable |
| Amounts | Visible (required for regulatory compliance) |

The \`enhanced\` obfuscation level with 3 instance pools provides correlation resistance while maintaining audit trail integrity.

---

## Regulatory Compliance

Auto loans are heavily regulated. This FORAY transaction captures compliance with:
- **Truth in Lending Act (TILA)**: APR disclosure, total of payments
- **Regulation Z**: Payment breakdown, right to rescind
- **Consumer Credit Protection Act**: Fair lending documentation
- **FCRA**: Credit reporting data structure

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Full 4-component chain** | Arrangement → Accrual → Anticipation → Action |
| **Allocation tracking** | Payment split between principal and interest |
| **Formula hashing** | Interest calculation method protected |
| **Enhanced privacy** | Consumer PII hashed, amounts visible |
| **Compliance flags** | TILA, Reg Z, FCRA noted in transaction |

---

## Why This Matters

### For Lenders
- Immutable record of loan terms and payment history
- Proof of regulatory disclosures provided
- Defense against borrower disputes

### For Regulators
- Verify TILA/Reg Z compliance
- Audit interest calculations without accessing proprietary models
- Monitor lending practices across portfolios

### For Borrowers
- Transparent record of what was agreed
- Verifiable payment history
- Protection against servicing errors

---

## Try It Yourself

Load \`auto-loan-v41.json\` in the Transaction Review tool to see:
- The complete dependency chain from Arrangement to Actions
- Click the interest accrual to see the calculation inputs
- Expand the payment action to see principal/interest allocation
- Check the privacy metadata showing "enhanced" protection level

---

*This narrative accompanies the \`auto-loan-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  rmbsWaterfall: {
    title: 'RMBS Waterfall: Securitization Distribution',
    content: `
# RMBS Waterfall: Securitization Distribution

## The Business Scenario

Structured Finance Trust 2025-1 is a $100 million residential mortgage-backed security (RMBS). The trust holds 450 mortgage loans and issues three tranches of notes to investors:

| Tranche | Rating | Balance | Coupon | Priority |
|---------|--------|---------|--------|----------|
| Class A (Senior) | AAA | $72,000,000 | 4.25% | 1st |
| Class B (Mezzanine) | A | $14,250,000 | 5.75% | 2nd |
| Class C (Subordinate) | BBB | $4,750,000 | 8.25% | 3rd |

Every month, homeowners make their mortgage payments. The trust collects these payments and distributes them to investors according to a strict "waterfall" priority—senior bondholders get paid first, then mezzanine, then subordinate.

This is January 2026's distribution: **$2,492,500** flowing through the waterfall.

---

## How FORAY Models This Transaction

RMBS waterfalls are among the most complex financial structures. Multiple parties, multiple tranches, strict payment priorities, and regulatory scrutiny from the SEC, Basel III, and Dodd-Frank. FORAY v4.1's many-to-many references are essential here.

### The Arrangements (3 Tranches)

Each tranche is modeled as a separate Arrangement:

**Class A - Senior Notes (AAA)**
- Original balance: $80,000,000
- Current balance: $72,000,000
- Coupon: 4.25%
- Credit enhancement: 20% subordination

**Class B - Mezzanine Notes (A)**
- Original balance: $15,000,000
- Current balance: $14,250,000
- Coupon: 5.75%
- Credit enhancement: 5% subordination

**Class C - Subordinate Notes (BBB)**
- Original balance: $5,000,000
- Current balance: $4,750,000
- Coupon: 8.25%
- Credit enhancement: First loss position

The subordination structure means Class C absorbs the first losses, protecting Class A and B investors.

### The Accruals (4 Calculations)

**Pool Collections Accrual**
The trust collected from the underlying mortgages:
\`\`\`
Scheduled Principal:  $1,800,000
Scheduled Interest:   $  650,000
Prepayments:          $   45,000
Defaults:             $   (5,000)
Recoveries:           $    2,500
─────────────────────────────────
Total Available:      $2,492,500
\`\`\`

This single accrual references **all three tranches**—a many-to-many relationship because the pool supports all investors.

**Tranche Interest Accruals (3)**
Each tranche has its own interest calculation:
- Class A: $72M × 4.25% × 30/360 = $255,000
- Class B: $14.25M × 5.75% × 30/360 = $68,281.25
- Class C: $4.75M × 8.25% × 30/360 = $32,656.25

### The Anticipation (Waterfall Priority)

Before distribution, the trustee calculates the expected waterfall:

| Priority | Payment Type | Amount |
|----------|--------------|--------|
| 1 | Trustee Fees | $7,500 |
| 2 | Servicing Fees | $25,000 |
| 3 | Class A Interest | $255,000 |
| 4 | Class A Principal | $1,800,000 |
| 5 | Class B Interest | $68,281.25 |
| 6 | Class B Principal | $225,000 |
| 7 | Class C Interest | $32,656.25 |
| 8 | Class C Principal | $75,000 |
| 9 | Residual | $4,062.50 |

This anticipation references **all four accruals** and **all three arrangements**—the full complexity of the deal captured in component references.

### The Action (Distribution Executed)

When the waterfall executes, the Action records:
- Total distributed: $2,492,500
- Settlement method: Wire transfers
- Allocations to each tranche with interest/principal breakdown

**Class A Allocation:**
\`\`\`
Interest:  $  255,000.00
Principal: $1,800,000.00
Total:     $2,055,000.00
New Balance: $70,200,000
\`\`\`

**Class B Allocation:**
\`\`\`
Interest:  $   68,281.25
Principal: $  225,000.00
Total:     $  293,281.25
New Balance: $14,025,000
\`\`\`

**Class C Allocation:**
\`\`\`
Interest:  $   32,656.25
Principal: $   75,000.00
Total:     $  107,656.25
New Balance: $4,675,000
\`\`\`

---

## Why Waterfalls Are Hard to Audit

Traditional RMBS audits are notoriously difficult:

1. **Complex calculations**: Interest accrues daily on changing balances
2. **Strict priority**: Payments must flow in exact order
3. **Multiple systems**: Servicer, trustee, and investor records rarely match
4. **Regulatory scrutiny**: SEC Reg AB requires detailed disclosure

### How FORAY Helps

| Audit Challenge | FORAY Solution |
|-----------------|----------------|
| Tracing payment priority | Waterfall captured in anticipation |
| Verifying allocations | Allocations array shows exact splits |
| Matching calculations | Formula IDs allow verification |
| Proving timing | Blockchain anchor timestamps |

---

## Regulatory Compliance

This transaction carries heavy compliance flags:

- **SEC Reg AB**: Asset-backed securities disclosure requirements
- **Dodd-Frank**: Risk retention and reporting rules
- **Basel III**: Capital requirements for securitization exposures
- **IFRS 9**: Expected credit loss accounting

FORAY doesn't replace regulatory filings, but provides an immutable audit trail that supports them.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Many-to-many references** | Pool accrual → 3 tranches; Anticipation → 4 accruals |
| **Complex allocations** | Single distribution split across 3 tranches |
| **Interest/principal breakdown** | Each allocation shows component split |
| **Multiple arrangements** | 3 parallel tranches, one pool |
| **Enhanced privacy** | 4 formulas obfuscated, 5 instance pools |

---

## The 2008 Lesson

The 2008 financial crisis revealed that no one—not investors, not regulators, not even the banks—could trace mortgage payments through securitization structures. FORAY provides the transparency that was missing.

Every payment, every allocation, every calculation—cryptographically anchored and fully traceable.

---

## Try It Yourself

Load \`rmbs-waterfall-v41.json\` in the Transaction Review tool to see:
- Three arrangements representing the tranche structure
- Click on the pool collections accrual to see the many-to-many references
- Expand the anticipation to view the complete waterfall priority
- Check the action allocations for interest/principal breakdown per tranche

---

*This narrative accompanies the \`rmbs-waterfall-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  energyPPA: {
    title: 'Energy PPA: Solar Power Purchase Agreement',
    content: `
# Energy PPA: Solar Power Purchase Agreement

## The Business Scenario

SunPower Utilities International, a Spanish energy company, purchases solar electricity from the Noor Ouarzazate Solar Complex in Morocco. This 200 MW solar farm in the Sahara Desert delivers clean energy to the Spanish grid via an undersea HVDC cable.

The 20-year Power Purchase Agreement (PPA) commits to:
- **420,000 MWh** annually
- **€42.50/MWh** base price (with 1.5% annual escalation)
- **Renewable Energy Certificates (RECs)** included
- **Curtailment compensation** at 85% of contract price

January 2026's delivery: **38,500 MWh** of solar power plus **1,500 MWh** curtailed due to grid congestion.

---

## How FORAY Models This Transaction

Energy transactions are unique—they involve physical delivery of electrons, regulatory certificates, and complex pricing that varies with weather, grid conditions, and time of day. FORAY captures all of this.

### The Arrangement

The PPA is a 20-year contract with detailed terms:

**Facility Details:**
- Name: Noor Ouarzazate Solar Complex - Phase IV
- Type: Solar PV
- Capacity: 200 MW
- Location: Morocco

**Commercial Terms:**
| Term | Value |
|------|-------|
| Contract Duration | 2025-2045 (20 years) |
| Annual Commitment | 420,000 MWh |
| Base Price | €42.50/MWh |
| Price Escalation | 1.5%/year |
| Curtailment Cap | 5% of annual delivery |
| Curtailment Compensation | 85% of contract price |

**Delivery Points:**
- Interconnection: HVDC Morocco-Spain Link
- Delivery: Spanish Grid - Andalusia Node

### The Accruals (3 Types)

**1. Energy Delivery Accrual**
The core transaction—actual electricity delivered:
\`\`\`
Metered Energy:     38,500 MWh
PPA Price (Year 2): €43.18/MWh
─────────────────────────────────
Energy Value:       €1,662,430.00
\`\`\`

The price reflects Year 2 escalation (€42.50 × 1.015 = €43.18).

**2. Curtailment Accrual**
Sometimes the grid can't accept all available power. When this happens, the generator is compensated:
\`\`\`
Curtailed Energy:     1,500 MWh
PPA Price:            €43.18/MWh
Compensation Rate:    85%
─────────────────────────────────
Curtailment Payment:  €55,054.50
\`\`\`

Curtailment occurred for 45 hours in January due to grid congestion on the Spain interconnect.

**3. Renewable Energy Credits (RECs)**
The PPA includes bundled RECs—certificates proving the energy is renewable:
\`\`\`
MWh Generated:      40,000 MWh
RECs per MWh:       1
REC Value:          €3.50 each
─────────────────────────────────
Total REC Value:    €140,000.00
\`\`\`

These certificates are registered in the EU Guarantees of Origin (GO) Registry and certified by AENOR.

### The Anticipation

Before payment, the anticipated settlement is calculated:
\`\`\`
Energy Delivery:        €1,662,430.00
Curtailment Compensation: €   55,054.50
─────────────────────────────────────────
Expected Payment:       €1,717,484.50
\`\`\`

RECs are transferred separately (not a cash payment).

### The Actions (2 Settlements)

**1. Energy Payment**
On February 14, 2026, SunPower wires payment to Morocco Solar Farm:
- Amount: €1,717,484.50
- Method: SWIFT MT103
- Allocations:
  - €1,662,430.00 → Energy delivery (38,500 MWh)
  - €55,054.50 → Curtailment compensation (1,500 MWh)

**2. REC Transfer**
On February 10, 2026, 40,000 RECs transfer in the EU GO Registry:
- Source Account: MA-NOOR-GEN-001 (Generator)
- Destination Account: ES-SUNPOWER-OFF-001 (Offtaker)
- Value: €140,000 (40,000 × €3.50)

---

## Why Energy Transactions Need FORAY

Energy markets are complex and heavily regulated:

### Metering and Verification
Every MWh must be metered, verified, and reconciled:
- Generator meters at the solar farm
- Grid operator meters at the interconnect
- Offtaker meters at delivery point

FORAY captures meter IDs and reading timestamps for audit trails.

### Curtailment Disputes
Curtailment compensation is a common source of disputes:
- Was the curtailment necessary?
- Was compensation calculated correctly?
- Did it exceed the annual cap?

FORAY records curtailment hours, reasons, and calculations.

### REC Tracking
RECs are increasingly valuable and subject to fraud:
- Double-counting (selling the same certificate twice)
- Vintage manipulation (claiming old RECs as new)
- Registry discrepancies

FORAY links RECs to specific generation periods with registry confirmation numbers.

---

## Cross-Border Complexity

This transaction spans multiple jurisdictions:

| Element | Jurisdiction |
|---------|--------------|
| Generator | Morocco |
| Grid Operator | Morocco (ONEE) |
| Interconnect | International waters |
| Offtaker | Spain |
| REC Registry | European Union |
| Currency | EUR |

FORAY captures jurisdictional details in party records and compliance flags.

---

## Regulatory Compliance

This PPA triggers multiple regulatory frameworks:

- **IFRS 16**: Lease accounting for energy contracts
- **EU Taxonomy**: Sustainable finance classification
- **REC Certification**: Guarantees of Origin requirements
- **ISDA**: Derivatives documentation (for price hedging)

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Multiple accrual types** | Energy, curtailment, and RECs |
| **Allocation tracking** | Payment split between delivery and curtailment |
| **Non-cash settlements** | REC transfer via registry (not wire) |
| **Physical delivery** | Meter readings and delivery points captured |
| **Cross-border parties** | Morocco generator, Spanish offtaker, EU registry |

---

## The Energy Transition

As the world shifts to renewable energy, PPAs like this are proliferating. Solar and wind projects need long-term offtake agreements to secure financing. Utilities need renewable generation to meet climate commitments.

FORAY provides the transparent, auditable infrastructure these markets need—tracking every electron from desert sunshine to Spanish homes.

---

## Try It Yourself

Load \`energy-ppa-v41.json\` in the Transaction Review tool to see:
- The comprehensive PPA terms in the arrangement
- Three different accrual types (energy, curtailment, RECs)
- Two separate actions (payment and REC transfer)
- Meter IDs and registry details in the inputs

---

*This narrative accompanies the \`energy-ppa-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  manufacturingWO: {
    title: 'Manufacturing Work Order: BOM and Cost Allocation',
    content: `
# Manufacturing Work Order: BOM and Cost Allocation

## The Business Scenario

Precision Components Manufacturing Inc receives an order from Aerospace Dynamics Corp for 100 hydraulic actuator assemblies. These precision components will be used in aircraft landing gear systems.

**Work Order #500 Details:**
- Product: Hydraulic Actuator Assembly (HA-2000-A)
- Quantity: 100 units
- Unit Price: $478.50
- Quality Standard: AS9100D (aerospace)
- Inspection: 100% testing required

The manufacturing process takes 4 days, moving through machining, assembly, testing, and final inspection before the units transfer to finished goods inventory.

**Total Cost: $47,848.75**

---

## How FORAY Models This Transaction

Manufacturing cost accounting is notoriously complex. Materials, labor, and overhead must be tracked, allocated, and reconciled—with auditors (and often the Department of Defense) scrutinizing every dollar. FORAY captures the complete cost build-up.

### The Arrangement (Work Order)

The work order defines what's being built and how:

**Product Specification:**
| Attribute | Value |
|-----------|-------|
| Product Code | HA-2000-A |
| Product Name | Hydraulic Actuator Assembly |
| Quantity | 100 units |
| BOM Version | HA-2000-A-R3 |
| Quality Requirement | AS9100D |

**Bill of Materials (BOM):**
| Part Number | Description | Qty/Unit | Unit Cost |
|-------------|-------------|----------|-----------|
| CYL-100 | Cylinder Body | 1 | $85.00 |
| PST-200 | Piston Assembly | 1 | $45.00 |
| SL-300 | Seal Kit | 1 | $12.50 |
| VLV-400 | Control Valve | 2 | $28.00 |
| HSG-500 | Housing | 1 | $65.00 |
| | **Total Material/Unit** | | **$263.50** |

The BOM is the DNA of the product—every component traced and costed.

### The Accruals (3 Cost Elements)

Manufacturing costs fall into three categories, each captured as an accrual:

**1. Raw Materials Accrual**
When materials are issued from inventory to the work order:

| Part | Qty Issued | Unit Cost | Total |
|------|------------|-----------|-------|
| CYL-100 | 100 | $85.00 | $8,500.00 |
| PST-200 | 100 | $45.00 | $4,500.00 |
| SL-300 | 100 | $12.50 | $1,250.00 |
| VLV-400 | 200 | $28.00 | $5,600.00 |
| HSG-500 | 100 | $65.00 | $6,500.00 |
| **Total** | | | **$26,350.00** |

Accounting entry:
- Debit: Work in Process (1400)
- Credit: Raw Materials Inventory (1200)

**2. Direct Labor Accrual**
Workers track time by operation:

| Operation | Hours | Rate | Total |
|-----------|-------|------|-------|
| 10 - Machining | 80 | $52.00 | $4,160.00 |
| 20 - Assembly | 120 | $52.00 | $6,240.00 |
| 30 - Testing | 35 | $52.00 | $1,820.00 |
| 40 - Inspection | 10 | $52.00 | $520.00 |
| **Total** | **245** | | **$12,740.00** |

Accounting entry:
- Debit: Work in Process (1400)
- Credit: Direct Labor (5100)

**3. Manufacturing Overhead Accrual**
Overhead is allocated based on direct labor hours:

\`\`\`
Labor Hours:        245
Overhead Rate:      $35.75/hour
─────────────────────────────────
Total Overhead:     $8,758.75
\`\`\`

**Overhead Components:**
| Category | Amount |
|----------|--------|
| Facility Costs | $3,500.00 |
| Equipment Depreciation | $2,450.00 |
| Utilities | $1,225.00 |
| Supervision | $980.00 |
| Supplies | $603.75 |
| **Total** | **$8,758.75** |

Accounting entry:
- Debit: Work in Process (1400)
- Credit: Manufacturing Overhead Applied (5200)

### The Anticipation (Expected Transfer)

Before completion, the system projects the finished goods transfer:

\`\`\`
Materials:    $26,350.00
Labor:        $12,740.00
Overhead:     $ 8,758.75
─────────────────────────
Total Cost:   $47,848.75
Cost/Unit:    $   478.49
\`\`\`

Expected yield: 100 units started, 100 units completed (0 scrap).

### The Action (Finished Goods Receipt)

When the work order completes:

**Production Results:**
| Metric | Value |
|--------|-------|
| Quantity Started | 100 |
| Quantity Completed | 100 |
| Quantity Scrapped | 0 |
| Yield | 100% |
| Lot Number | LOT-2026-HA2000-0042 |
| Quality Status | Passed |
| Quality Certificate | QC-2026-500-PASS |

**Cost Allocations:**
| Cost Element | Amount |
|--------------|--------|
| Raw Materials | $26,350.00 |
| Direct Labor | $12,740.00 |
| Manufacturing Overhead | $8,758.75 |
| **Total** | **$47,848.75** |

Accounting entry:
- Debit: Finished Goods Inventory (1300)
- Credit: Work in Process (1400)

---

## Why Manufacturing Costing Is Audited

Manufacturing cost accounting is subject to intense scrutiny:

### GAAP Cost Accounting
- Materials must be valued consistently (FIFO, weighted average)
- Labor rates must match payroll records
- Overhead allocation must be reasonable and documented

### DCAA Compliance (Defense Contracts)
For government contractors like aerospace suppliers:
- Every cost must be allowable, allocable, and reasonable
- Overhead rates are audited and negotiated
- Cost Accounting Standards (CAS) must be followed

### ISO 9001 / AS9100 Quality
- Traceability from raw material to finished good
- Lot tracking for recall capability
- Inspection records maintained

---

## The Cost Variance Problem

Manufacturing variances are a constant challenge:

| Variance Type | Example |
|---------------|---------|
| Material price | Steel costs more than standard |
| Material usage | More scrap than expected |
| Labor rate | Overtime premiums |
| Labor efficiency | Job took longer than planned |
| Overhead volume | Factory ran below capacity |

FORAY captures expected vs. actual at every step, making variance analysis auditable.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Three cost accruals** | Materials, labor, overhead separately tracked |
| **BOM explosion** | Component-level material detail |
| **Operation tracking** | Labor by manufacturing operation |
| **Overhead allocation** | Rate-based absorption costing |
| **Yield tracking** | Started vs. completed vs. scrapped |
| **Quality linkage** | Lot number and inspection status |

---

## From Shop Floor to Financial Statements

This single work order connects:

1. **Purchasing** → Material costs from PO prices
2. **Inventory** → Raw material issues and FG receipts
3. **Payroll** → Labor hours and rates
4. **Cost Accounting** → Overhead absorption
5. **Quality** → Inspection and certification
6. **Financial Reporting** → Inventory valuation

FORAY provides the audit trail that links them all.

---

## Try It Yourself

Load \`manufacturing-v41.json\` in the Transaction Review tool to see:
- The complete BOM in the arrangement
- Material breakdown by part number in the raw materials accrual
- Labor hours by operation in the direct labor accrual
- Overhead components in the overhead accrual
- All three costs flowing to the finished goods action

---

*This narrative accompanies the \`manufacturing-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  depreciationEntry: {
    title: 'Depreciation Entry: Accrual-Only Transaction',
    content: `
# Depreciation Entry: Accrual-Only Transaction

## The Business Scenario

It's January 31, 2026—month-end closing at Precision Manufacturing Inc. The accounting team runs the depreciation schedule, recording the monthly wear and tear on company assets:

| Asset Class | Original Cost | Monthly Depreciation |
|-------------|---------------|---------------------|
| CNC Machinery | $750,000 | $25,000 |
| Delivery Vehicles (5) | $250,000 | $3,750 |
| Manufacturing Facility | $8,000,000 | $17,083.33 |
| **Total** | **$9,000,000** | **$45,833.33** |

There's no contract here. No payment. No counterparty. Just an adjusting journal entry that recognizes expense and reduces asset values.

**Total Depreciation: $45,833.33**

---

## How FORAY Models This Transaction

This transaction demonstrates v4.1's **flexible entry point** feature—specifically, an Accrual-only transaction. Depreciation is a pure accounting recognition with no arrangement, no anticipation, and no action.

### Why Accrual-Only Makes Sense

| Traditional Transaction | Depreciation |
|------------------------|--------------|
| Contract exists | No contract |
| Counterparty involved | No counterparty |
| Cash will flow | No cash flow |
| Future settlement expected | Nothing to settle |

Depreciation is an **allocation of historical cost** over an asset's useful life. It exists entirely within the accounting system—there's nothing external to link to.

### The Accruals (3 Asset Classes)

**1. CNC Machinery Depreciation**

A high-precision CNC machine, purchased in July 2024:

\`\`\`
Original Cost:     $750,000
Salvage Value:     $ 50,000
Depreciable Base:  $700,000
Method:            MACRS (5-year)
Monthly Expense:   $ 25,000
\`\`\`

After 18 months of depreciation:
- Accumulated: $400,000
- Remaining Book Value: $350,000

**2. Delivery Vehicle Fleet Depreciation**

Five delivery trucks using straight-line depreciation:

\`\`\`
Total Original Cost:  $250,000
Total Salvage Value:  $ 25,000
Depreciable Base:     $225,000
Method:               Straight-line (5-year)
Monthly Expense:      $  3,750
\`\`\`

After 24 months:
- Accumulated: $93,750
- Remaining Book Value: $156,250

**3. Manufacturing Building Depreciation**

The factory building using 39-year straight-line (commercial real estate):

\`\`\`
Original Cost:     $8,000,000
Salvage Value:     $        0
Depreciable Base:  $8,000,000
Method:            Straight-line (39-year)
Monthly Expense:   $   17,083.33
\`\`\`

After 96 months (8 years):
- Accumulated: $1,657,083.33
- Remaining Book Value: $6,342,916.67

### The Empty Components

- **Arrangements**: Empty \`[]\` — no contract governs depreciation
- **Anticipations**: Empty \`[]\` — no future event is expected
- **Actions**: Empty \`[]\` — no settlement will occur

This is the cleanest possible FORAY structure: just the economic recognition, nothing more.

---

## Depreciation Methods Captured

FORAY supports multiple depreciation methods through formula IDs:

| Method | Formula ID | Use Case |
|--------|-----------|----------|
| MACRS | \`hash_depr_macrs_5yr_monthly\` | US tax depreciation |
| Straight-line | \`hash_depr_straightline_monthly\` | Book depreciation |
| Double-declining | \`hash_depr_ddb_monthly\` | Accelerated book |
| Units of production | \`hash_depr_units_monthly\` | Variable usage |

The formula ID is hashed—auditors can verify the method used without exposing proprietary asset valuation models.

---

## Accounting Entries

Each accrual includes the journal entry:

**CNC Machinery:**
\`\`\`
Debit:  6500 - Depreciation Expense - Machinery    $25,000.00
Credit: 1550 - Accumulated Depreciation - Machinery $25,000.00
\`\`\`

**Delivery Vehicles:**
\`\`\`
Debit:  6510 - Depreciation Expense - Vehicles     $ 3,750.00
Credit: 1560 - Accumulated Depreciation - Vehicles  $ 3,750.00
\`\`\`

**Building:**
\`\`\`
Debit:  6520 - Depreciation Expense - Building     $17,083.33
Credit: 1570 - Accumulated Depreciation - Building  $17,083.33
\`\`\`

These entries reduce net income (expense) while building the contra-asset (accumulated depreciation).

---

## Why Depreciation Needs Audit Trails

Depreciation errors are surprisingly common and consequential:

| Issue | Impact |
|-------|--------|
| Wrong useful life | Over/understated book values |
| Incorrect method | Tax compliance issues |
| Missed assets | Understated expenses |
| Salvage value errors | Incorrect terminal values |

### SOX 404 Requirements

For public companies, depreciation controls are SOX-critical:
- Asset additions properly capitalized
- Useful lives consistently applied
- Depreciation calculated accurately
- Book/tax differences tracked

FORAY provides the immutable audit trail that supports these controls.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Flexible entry point** | Accrual-only (no Arrangement needed) |
| **Multiple accruals** | 3 asset classes, same transaction |
| **Formula hashing** | MACRS vs. straight-line methods protected |
| **Empty components** | Valid structure with only Accruals populated |
| **Accumulated tracking** | Prior periods + current = total depreciation |

---

## Adjusting Entry Pattern

Depreciation is one of several **adjusting entry** types that FORAY v4.1 handles elegantly:

| Adjusting Entry Type | FORAY Pattern |
|---------------------|---------------|
| Depreciation | Accrual-only |
| Amortization | Accrual-only |
| Bad debt expense | Accrual-only |
| Accrued expenses | Accrual → Action |
| Prepaid expense recognition | Accrual-only |
| Deferred revenue recognition | Accrual-only |

The flexible entry point feature means FORAY accurately represents these transactions without forcing artificial arrangements.

---

## Try It Yourself

Load \`depreciation-entry-v41.json\` in the Transaction Review tool to see:
- Empty Arrangements, Anticipations, and Actions sections
- Three separate accruals for different asset classes
- Accumulated depreciation tracking in each accrual
- Different depreciation methods (MACRS vs. straight-line)

---

*This narrative accompanies the \`depreciation-entry-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  fxSpot: {
    title: 'FX Spot Trade: Multi-Currency Settlement',
    content: `
# FX Spot Trade: Multi-Currency Settlement

## The Business Scenario

Global Treasury Services Inc needs to pay a European supplier in euros. On January 23, 2026, the treasury desk calls their FX counterparty at Deutsche Bank and executes a spot trade:

**Trade Details:**
- **Buy**: €1,000,000
- **Sell**: $1,085,000
- **Spot Rate**: 1.0850
- **Value Date**: January 27, 2026 (T+2)

Two days later, on the value date, the currencies settle:
- Global Treasury receives €1,000,000 in their Deutsche Bank nostro account
- Global Treasury pays $1,085,000 from their JPMorgan Chase nostro account

By settlement, the market has moved—EUR/USD is now 1.0875. Global Treasury locked in at 1.0850, saving $2,500.

**Realized Gain: $2,500**

---

## How FORAY Models This Transaction

FX transactions are unique—they involve two currencies flowing in opposite directions, with potential P&L from rate movements. FORAY captures both legs and the valuation changes.

### The Arrangement (FX Spot Contract)

The trade is captured with full execution details:

**Trade Terms:**
| Element | Value |
|---------|-------|
| Currency Pair | EUR/USD |
| Deal Type | Spot |
| Buy Currency | EUR |
| Buy Amount | 1,000,000 |
| Sell Currency | USD |
| Sell Amount | 1,085,000 |
| Spot Rate | 1.0850 |
| Settlement | T+2 |
| Value Date | 2026-01-27 |

**Settlement Instructions:**
- EUR Nostro: Deutsche Bank (DEUTDEFF)
- USD Nostro: JPMorgan Chase (CHASUS33)

Account numbers are hashed for privacy while BIC codes remain visible for operational clarity.

### The Accruals (Mark-to-Market Valuations)

Between trade date and settlement, the position is marked to market daily:

**Trade Date (T+0) - January 23:**
\`\`\`
Market Rate:    1.0850
Contract Rate:  1.0850
Unrealized P&L: $0.00
\`\`\`

No gain or loss—the trade was just executed at market.

**T+1 - January 24:**
\`\`\`
Market Rate:    1.0875
Contract Rate:  1.0850
Rate Difference: 0.0025
Unrealized P&L: $2,500.00
\`\`\`

The euro strengthened—good for Global Treasury who locked in at 1.0850.

Accounting entry:
\`\`\`
Debit:  1400 - FX Receivable       $2,500.00
Credit: 4200 - Unrealized FX Gain  $2,500.00
\`\`\`

### The Anticipations (Two Settlement Legs)

FX spot trades have **two legs**—one for each currency:

**EUR Receipt Anticipation:**
- Expected: €1,000,000
- Date: January 27, 2026
- Receiving Bank: Deutsche Bank
- Cut-off: 17:00 CET

**USD Payment Anticipation:**
- Expected: $1,085,000
- Date: January 27, 2026
- Paying Bank: JPMorgan Chase
- Cut-off: 17:00 EST

The probability factor of 0.999 reflects near-certainty (counterparty risk on a major bank is minimal).

### The Actions (Three Settlements)

**1. EUR Receipt (09:30 CET):**
\`\`\`
Amount:    €1,000,000
Method:    SWIFT MT202
Reference: SWIFT-MT202-20260127-001
\`\`\`

**2. USD Payment (14:45 EST):**
\`\`\`
Amount:    $1,085,000
Method:    Fedwire
Reference: FEDWIRE-20260127-002
\`\`\`

**3. P&L Realization (17:00 EST - End of Day):**
\`\`\`
Contracted Rate: 1.0850
Settlement Rate: 1.0875
Rate Difference: 0.0025
Notional:        €1,000,000
Realized Gain:   $2,500.00
\`\`\`

Accounting entry (reclassification):
\`\`\`
Debit:  4200 - Unrealized FX Gain  $2,500.00
Credit: 4210 - Realized FX Gain    $2,500.00
\`\`\`

---

## FX Settlement Risk

FX trades carry **Herstatt risk**—the danger that you pay your currency but don't receive the other side. This famously occurred in 1974 when Herstatt Bank failed mid-settlement.

FORAY timestamps both legs precisely:
- EUR received: 09:30 CET (14:30 UTC)
- USD paid: 14:45 EST (19:45 UTC)

The 5-hour gap between receipts is typical due to time zone differences between European and US payment systems.

Modern FX settlement increasingly uses **CLS (Continuous Linked Settlement)** to eliminate this risk through payment-versus-payment. FORAY can capture CLS settlement just as easily.

---

## Regulatory Compliance

FX trades trigger multiple regulatory frameworks:

| Regulation | Requirement |
|------------|-------------|
| **Dodd-Frank** | Swap reporting (if derivative) |
| **EMIR** | European trade reporting |
| **MiFID II** | Best execution documentation |
| **Basel III** | Counterparty credit risk capital |

FORAY's compliance flags indicate which regulations apply to each transaction.

---

## Nostro Account Reconciliation

Treasury operations depend on accurate nostro reconciliation:

| Account | Opening | Receipt | Payment | Closing |
|---------|---------|---------|---------|---------|
| EUR Nostro | €X | +€1,000,000 | — | €X+1M |
| USD Nostro | $Y | — | -$1,085,000 | $Y-1.085M |

FORAY provides the audit trail that links FX trades to nostro movements—critical for cash management and bank reconciliation.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Dual-currency flows** | EUR receipt + USD payment |
| **Mark-to-market accruals** | Daily valuation tracking |
| **Two anticipations** | Separate legs for each currency |
| **Three actions** | Receipt, payment, P&L realization |
| **Variance tracking** | Shows realized gain from rate movement |

---

## Forward vs. Spot

This sample shows a **spot** trade (T+2 settlement). FORAY handles **forward** trades similarly, with:
- Longer settlement periods (T+30, T+90, etc.)
- Forward points captured in the rate
- More mark-to-market accruals over the life
- Potential for margin/collateral requirements

---

## Try It Yourself

Load \`fx-spot-v41.json\` in the Transaction Review tool to see:
- Trade execution details in the arrangement
- Two mark-to-market accruals showing rate movement
- Separate anticipations for EUR and USD legs
- Three actions: receipt, payment, and P&L realization
- Variance showing the $2,500 realized gain

---

*This narrative accompanies the \`fx-spot-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  overnightRepo: {
    title: 'Overnight Repo: Collateral and SOFR',
    content: `
# Overnight Repo: Collateral and SOFR

## The Business Scenario

Alpha Capital's fixed income trading desk needs $50 million in overnight funding to finance their Treasury position. On Friday afternoon, January 24, 2026, they enter a repurchase agreement (repo) with a money market fund:

**Repo Terms:**
- **Principal**: $50,000,000
- **Rate**: SOFR + 5 bps (5.30% all-in)
- **Term**: 3 days (over weekend)
- **Collateral**: US Treasury Note 4.25% due 2028
- **Haircut**: 2%

On Friday, Alpha delivers $51 million in Treasuries and receives $50 million in cash. On Monday, they return the cash plus interest ($50,022,083.33) and get their Treasuries back.

**Interest Earned by Lender: $22,083.33**

---

## How FORAY Models This Transaction

Repos are secured financing transactions—essentially collateralized loans with two legs (opening and closing). FORAY captures the full lifecycle including collateral, daily accruals, and margin monitoring.

### The Arrangement (Repo Agreement)

The repo contract specifies all terms:

**Financing Terms:**
| Element | Value |
|---------|-------|
| Repo Type | Overnight (extended for weekend) |
| Principal | $50,000,000 |
| Repo Rate | 5.30% (SOFR + 5bps) |
| Day Count | Actual/360 |
| Interest | $22,083.33 |
| Repurchase Price | $50,022,083.33 |
| Haircut | 2% |

**Collateral Details:**
| Element | Value |
|---------|-------|
| Security Type | US Treasury Note |
| Coupon | 4.25% |
| Maturity | November 15, 2028 |
| Face Value | $50,000,000 |
| Market Value | $51,020,000 |
| After Haircut | $50,000,000 |

The 2% haircut means Alpha must pledge $51M in Treasuries to borrow $50M—providing the lender with a cushion against market movements.

**Legal Framework:**
- SIFMA Master Repurchase Agreement
- Annex I - Supplemental Terms
- Tri-Party Custodial Agreement

### The Accruals (3 Components)

**1. Day 1 Interest Accrual (Friday):**
\`\`\`
Principal:     $50,000,000
SOFR Rate:     5.25%
Spread:        0.05%
All-in Rate:   5.30%
Days:          1
Interest:      $7,361.11
\`\`\`

Formula: $50M × 5.30% × 1/360 = $7,361.11

**2. Day 2-3 Interest Accrual (Weekend):**
\`\`\`
Principal:     $50,000,000
SOFR Rate:     5.25% (Friday's fixing)
Spread:        0.05%
All-in Rate:   5.30%
Days:          2
Interest:      $14,722.22
\`\`\`

Weekend accrues at Friday's SOFR rate—the market is closed.

**3. Collateral Valuation:**
\`\`\`
Face Value:        $50,000,000
Market Value:      $51,020,000
Haircut:           2%
Value After Cut:   $50,000,000
Loan Amount:       $50,000,000
Excess Collateral: $1,020,000
Margin Call:       Not Required
\`\`\`

The collateral is worth 2.04% more than the loan—no margin call needed.

### The Anticipation (Maturity)

At maturity, the repo unwinds:

\`\`\`
Principal Return:     $50,000,000
Accrued Interest:     $   22,083.33
Total Repurchase:     $50,022,083.33
\`\`\`

Plus collateral return:
- UST 4.25% 2028
- Face: $50,000,000
- Expected: Monday 9:00 AM

### The Actions (Two Legs)

**Opening Leg (Friday 4:30 PM):**

*Alpha Capital:*
- Receives $50,000,000 cash via Fedwire
- Delivers UST collateral via DTC

*Money Market Fund:*
- Pays $50,000,000 cash
- Receives UST collateral

**Closing Leg (Monday 9:15 AM):**

*Alpha Capital:*
- Pays $50,022,083.33 cash via Fedwire
- Receives UST collateral via DTC

*Money Market Fund:*
- Receives $50,022,083.33 cash
- Delivers UST collateral

The allocations show how the closing payment covers each day's interest:
- Day 1: $7,361.11
- Days 2-3: $14,722.22
- **Total Interest: $22,083.33**

---

## SOFR: The New Benchmark

SOFR (Secured Overnight Financing Rate) replaced LIBOR as the primary USD benchmark in 2023. Key differences:

| Aspect | LIBOR | SOFR |
|--------|-------|------|
| Basis | Unsecured interbank | Secured repo |
| Calculation | Bank survey | Actual transactions |
| Manipulation risk | High (scandal) | Low (transaction-based) |
| Credit component | Yes | No |

FORAY captures the SOFR fixing date and rate for each accrual period—critical for audit trail and rate verification.

---

## Repo Market Mechanics

The repo market is enormous—over $4 trillion daily in the US alone. It's how:
- Dealers finance inventory
- Money market funds earn returns
- The Fed implements monetary policy
- Treasuries circulate efficiently

### Tri-Party vs. Bilateral

This sample shows a **bilateral repo** (direct between parties). **Tri-party repos** use a clearing bank (BNY Mellon or JPMorgan) as custodian:

| Aspect | Bilateral | Tri-Party |
|--------|-----------|-----------|
| Collateral movement | Direct DTC | Via clearing bank |
| Valuation | Each party | Clearing bank |
| Margin calls | Manual | Automated |
| Operational risk | Higher | Lower |

FORAY handles both structures.

---

## Margin and Haircuts

Haircuts protect lenders against collateral price declines:

| Collateral Type | Typical Haircut |
|-----------------|-----------------|
| US Treasuries | 1-2% |
| Agency MBS | 2-4% |
| Corporate bonds | 5-10% |
| Equities | 10-25% |

If collateral value drops below the **margin threshold** (1% in this example), the borrower must post additional collateral or reduce the loan.

FORAY's collateral valuation accrual tracks:
- Current market value
- Haircut applied
- Excess/deficit collateral
- Margin call status

---

## Regulatory Requirements

Repos trigger significant regulatory capital and reporting:

| Regulation | Requirement |
|------------|-------------|
| **Basel III** | Leverage ratio, liquidity coverage |
| **Dodd-Frank** | OFR data collection |
| **SEC 15c3** | Broker-dealer net capital |
| **FINRA 4210** | Margin requirements |

FORAY's compliance flags indicate applicable regulations.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **Two-leg structure** | Opening and closing actions |
| **Daily accruals** | Interest by day with SOFR rates |
| **Collateral tracking** | Market value, haircut, margin status |
| **Reference rate capture** | SOFR fixing date and spread |
| **DTC settlement** | Collateral movement references |

---

## Repo Fails and Settlement Risk

If collateral isn't returned on time, it's a **repo fail**. The Fed monitors fail rates as a market health indicator. FORAY timestamps both legs precisely:

- Opening: January 24, 16:30:00
- Closing: January 27, 09:15:00

This audit trail supports fail tracking and penalty calculations.

---

## Try It Yourself

Load \`overnight-repo-v41.json\` in the Transaction Review tool to see:
- Complete collateral details in the arrangement
- Daily interest accruals with SOFR rate breakdown
- Collateral valuation with margin analysis
- Opening and closing leg actions
- Interest allocation in the closing leg

---

*This narrative accompanies the \`overnight-repo-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  },
  salesforceOpp: {
    title: 'Salesforce Opportunity: CRM Integration',
    content: `
# Salesforce Opportunity: CRM Integration

## The Business Scenario

CloudTech Solutions just closed a major deal. Their sales rep landed MegaCorp Industries as an enterprise customer for the Cloud Platform:

**Opportunity: MegaCorp - Enterprise Cloud Platform**

| Product | Amount | Revenue Type |
|---------|--------|--------------|
| 3-Year Enterprise License | $225,000 | Subscription |
| Implementation Services | $45,000 | Professional Services |
| Training Package | $15,000 | Training |
| **Total Deal** | **$285,000** | |

The opportunity moved through Salesforce stages—Qualification, Proposal, Negotiation—and finally **Closed Won** on January 20, 2026.

Now the real work begins: recognizing revenue properly under ASC 606.

---

## How FORAY Models This Transaction

This transaction demonstrates FORAY's **CRM integration pattern**—linking Salesforce opportunity data to the financial audit trail. Every Salesforce record ID is captured, creating a bridge between CRM and accounting.

### The Arrangement (Salesforce Opportunity)

The opportunity record becomes the arrangement:

**Opportunity Details:**
| Field | Value |
|-------|-------|
| Opportunity Name | MegaCorp - Enterprise Cloud Platform |
| Stage | Closed Won |
| Close Date | January 20, 2026 |
| Amount | $285,000 |
| Probability | 100% |
| Lead Source | Partner Referral |
| Forecast Category | Closed |

**Salesforce Record IDs:**
\`\`\`
Opportunity: 006Dn00000ABC123XYZ
Account:     001Dn00000DEF456UVW
Contact:     003Dn00000GHI789RST
Owner:       005Dn00000JKL012MNO
Quote:       0Q0Dn00000PQR345STU
\`\`\`

These IDs create an unbreakable link between FORAY and Salesforce—auditors can trace from the blockchain anchor back to the original CRM record.

**Product Lines:**

| Product | Code | Quantity | Unit Price | Total | Recognition |
|---------|------|----------|------------|-------|-------------|
| Enterprise License | ECP-ENT-3YR | 1 | $75,000 | $225,000 | 36 months |
| Implementation | SVC-IMPL-ENT | 1 | $45,000 | $45,000 | 3 months |
| Training | TRN-ENT-PKG | 1 | $15,000 | $15,000 | 1 month |

### The Accruals (ASC 606 Revenue Recognition)

ASC 606 requires revenue recognition when performance obligations are satisfied. Each product line has different recognition timing:

**1. Subscription Revenue (Pro-rated January):**
\`\`\`
Total Contract Value:  $225,000
Contract Term:         36 months
Monthly Revenue:       $  6,250
Recognition Start:     January 20, 2026
Days in January:       12 (of 31)
January Revenue:       $  2,419.35
\`\`\`

This uses the formula \`hash_asc606_subscription\`—time-based recognition over the contract period.

**2. Implementation Revenue (Milestone-based):**
\`\`\`
Total Service Value:   $45,000
Milestone Completed:   Requirements & Design
Milestone Percentage:  30%
Revenue Recognized:    $13,500
\`\`\`

Implementation uses **percentage of completion** based on milestones:
- Milestone 1: Requirements & Design (30%) ✓
- Milestone 2: Development & Configuration (50%)
- Milestone 3: Go-Live & Acceptance (20%)

**3. Training Revenue (Point-in-time):**
\`\`\`
Training Value:   $15,000
Training Date:    January 22, 2026
Attendees:        25
Revenue:          $15,000 (100%)
\`\`\`

Training is recognized when delivered—a single point-in-time event.

**4. Accounts Receivable (Invoice):**
\`\`\`
Invoice Number:  INV-2026-001234
Invoice Date:    January 20, 2026
Due Date:        February 19, 2026
Amount:          $135,000
\`\`\`

The invoice covers Year 1 license ($75,000) + implementation ($45,000) + training ($15,000). Years 2-3 of the license will be invoiced annually.

### The Anticipation (Expected Payment)

CloudTech expects payment within 30 days:

\`\`\`
Invoice Amount:      $135,000
Due Date:            February 19, 2026
Early Pay Discount:  2% if within 10 days
Discount Amount:     $2,700
\`\`\`

### The Action (Payment Received)

MegaCorp pays early to capture the discount:

\`\`\`
Payment Date:     January 28, 2026
Gross Amount:     $135,000
Discount Taken:   $  2,700 (2%)
Net Received:     $132,300
Payment Method:   ACH
\`\`\`

**Variance Tracking:**
\`\`\`
Expected:   $135,000
Actual:     $132,300
Difference: -$2,700 (-2.00%)
Reason:     Early payment discount
\`\`\`

**Accounting Entry:**
\`\`\`
Debit:  1000 - Cash                  $132,300
Debit:  6400 - Sales Discounts       $  2,700
Credit: 1200 - Accounts Receivable   $135,000
\`\`\`

---

## The ASC 606 Challenge

Revenue recognition under ASC 606 is complex:

### Five-Step Model
1. **Identify the contract** → Salesforce opportunity
2. **Identify performance obligations** → License, implementation, training
3. **Determine transaction price** → $285,000
4. **Allocate to obligations** → Based on standalone selling prices
5. **Recognize when satisfied** → Over time or point-in-time

FORAY captures each step in the component structure.

### Multiple Performance Obligations

This deal has **three distinct performance obligations**:

| Obligation | Recognition Pattern | Timing |
|------------|---------------------|--------|
| License | Over time | 36 months |
| Implementation | Over time (milestones) | 3 months |
| Training | Point-in-time | Day delivered |

Traditional accounting systems struggle with this complexity. FORAY models each obligation as a separate accrual with its own recognition formula.

---

## CRM-to-Cash Integration

The Salesforce integration enables end-to-end traceability:

\`\`\`
Salesforce Opportunity (006Dn00000ABC123XYZ)
     ↓
FORAY Arrangement (ARR_SF_OPP_ENTERPRISE_2026)
     ↓
Revenue Accruals (subscription, services, training)
     ↓
Invoice Accrual (ACC_AR_INVOICE_JAN2026)
     ↓
Payment Action (ACT_PAYMENT_RECEIVED_001234)
\`\`\`

Every step references the Salesforce Opportunity ID—auditors can trace from payment back to the original sales opportunity in seconds.

---

## Deferred Revenue Management

At contract signing, the full contract value goes to **Deferred Revenue**:

| Event | Debit | Credit |
|-------|-------|--------|
| Invoice issued | AR $135,000 | Deferred Rev $135,000 |
| Sub rev recognized | Deferred Rev $2,419 | Sub Revenue $2,419 |
| Impl rev recognized | Deferred Rev $13,500 | Services Rev $13,500 |
| Training recognized | Deferred Rev $15,000 | Training Rev $15,000 |

FORAY tracks the deferred revenue balance through each recognition event.

---

## Key v4.1 Features Demonstrated

| Feature | How It's Used |
|---------|---------------|
| **CRM integration** | Salesforce record IDs in every component |
| **Multiple recognition patterns** | Over-time vs. point-in-time |
| **Milestone tracking** | Implementation percentage complete |
| **Discount handling** | Early payment discount with variance |
| **ASC 606 compliance** | Formula IDs for recognition methods |

---

## ERP Adapter Pattern

This sample demonstrates the pattern for FORAY's planned ERP adapters:

\`\`\`
Source System (Salesforce)
     ↓
Adapter (extracts + transforms)
     ↓
FORAY JSON
     ↓
Blockchain Anchor
\`\`\`

The same pattern applies to:
- QuickBooks invoices
- SAP sales orders
- NetSuite transactions
- Workday payroll

---

## Try It Yourself

Load \`salesforce-opportunity-v41.json\` in the Transaction Review tool to see:
- Salesforce record IDs in the arrangement
- Three different revenue recognition accruals
- Milestone details in implementation accrual
- Early payment discount in the action
- Variance explanation for the discount

---

*This narrative accompanies the \`salesforce-opportunity-v41.json\` sample file in the FORAY Protocol v4.1 distribution.*
`
  }
};

// Sample Narrative Summaries - Condensed versions
const sampleNarrativeSummaries = {
  batchPayment: {
    title: "Batch Payment: Many-to-Many References",
    content: `## Summary

**Scenario**: Acme Manufacturing pays GlobalParts Inc for three invoices ($15K + $22.5K + $10K = $47,500) in a single ACH batch payment.

**Key v4.1 Feature**: Many-to-many references — one Action settles three Anticipations.

**Structure**:
- **Arrangement**: Master Service Agreement (2-year, $500K)
- **Accruals**: 3 invoice obligations
- **Anticipation**: Scheduled batch payment
- **Action**: Single payment with allocations array

**Why It Matters**: Auditors can instantly trace how one payment was allocated across multiple invoices without manual matching.`
  },
  cashSale: {
    title: "Cash Sale: Action-Only Entry Point",
    content: `## Summary

**Scenario**: Coffee shop morning rush — walk-in customer pays $134.50 cash for office order (lattes, muffins, coffee, bagels).

**Key v4.1 Feature**: Flexible entry point — transaction starts at Action with no Arrangement needed.

**Structure**:
- **Arrangements**: Empty \`[]\`
- **Accruals**: Empty \`[]\`
- **Anticipations**: Empty \`[]\`
- **Actions**: Single cash receipt with line items

**Why It Matters**: SMBs can use FORAY without creating artificial contracts. A cash sale is just that — immediate exchange, no credit terms.`
  },
  autoLoan: {
    title: "Auto Loan: Full 4-Component Chain",
    content: `## Summary

**Scenario**: John Doe finances a $35,000 Tesla Model 3 at 5.49% APR for 60 months ($667.33/month).

**Key v4.1 Feature**: Complete dependency chain through all 4 components.

**Structure**:
- **Arrangement**: Retail Installment Contract with collateral (VIN hashed)
- **Accruals**: Monthly interest calculations
- **Anticipations**: Expected payment schedule
- **Actions**: Loan disbursement + monthly payment receipts

**Why It Matters**: Consumer credit requires full auditability. Every payment traces back through interest calculation to the original loan contract.`
  },
  rmbsWaterfall: {
    title: "RMBS Waterfall: Securitization Distribution",
    content: `## Summary

**Scenario**: $100M mortgage-backed security with 3 tranches (AAA/A/BBB) distributes $2.49M monthly collections through strict payment waterfall.

**Key v4.1 Feature**: Complex many-to-many — pool collections flow to multiple tranches with priority rules.

**Structure**:
- **Arrangements**: 3 tranches (Senior, Mezzanine, Subordinate)
- **Accruals**: Pool collections + 3 interest calculations
- **Anticipation**: Waterfall with 9-step priority
- **Action**: Distribution with interest/principal breakdown per tranche

**Why It Matters**: Post-2008, regulators demand transparency in securitizations. FORAY traces every dollar from borrower payments to investor distributions.`
  },
  energyPPA: {
    title: "Energy PPA: Solar Power Purchase",
    content: `## Summary

**Scenario**: SunPower Utilities buys 38,500 MWh of solar power from Morocco (plus 1,500 MWh curtailed) under a 20-year PPA at €43.18/MWh.

**Key v4.1 Feature**: Multiple accrual types — energy delivery, curtailment compensation, and RECs.

**Structure**:
- **Arrangement**: 20-year Power Purchase Agreement
- **Accruals**: Energy (€1.66M) + Curtailment (€55K) + RECs (€140K)
- **Anticipation**: Expected payment
- **Actions**: Cash payment (SWIFT) + REC transfer (registry)

**Why It Matters**: Energy transactions involve physical delivery, grid constraints, and environmental certificates — all captured in one structure.`
  },
  manufacturingWO: {
    title: "Manufacturing: BOM and Cost Allocation",
    content: `## Summary

**Scenario**: Precision Components produces 100 hydraulic actuators. Total cost: $47,848.75 (Materials $26,350 + Labor $12,740 + Overhead $8,759).

**Key v4.1 Feature**: Three-element cost buildup with operation-level labor tracking.

**Structure**:
- **Arrangement**: Work Order with BOM (5 components)
- **Accruals**: Raw materials + Direct labor (by operation) + Overhead
- **Anticipation**: Expected finished goods transfer
- **Action**: FG receipt with lot number and quality cert

**Why It Matters**: Defense contractors (DCAA) and aerospace (AS9100) require detailed cost traceability. Every dollar allocated to the work order is auditable.`
  },
  depreciationEntry: {
    title: "Depreciation: Accrual-Only Entry Point",
    content: `## Summary

**Scenario**: Month-end depreciation for CNC machinery ($25K), vehicles ($3,750), and building ($17,083) = $45,833 total.

**Key v4.1 Feature**: Accrual-only transaction — no Arrangement, Anticipation, or Action needed.

**Structure**:
- **Arrangements**: Empty \`[]\`
- **Accruals**: 3 depreciation calculations (MACRS + straight-line)
- **Anticipations**: Empty \`[]\`
- **Actions**: Empty \`[]\`

**Why It Matters**: Adjusting entries don't involve contracts or cash. FORAY models what actually happened — an accounting recognition, nothing more.`
  },
  fxSpot: {
    title: "FX Spot: Multi-Currency Settlement",
    content: `## Summary

**Scenario**: Buy €1,000,000 / Sell $1,085,000 at spot rate 1.0850. T+2 settlement. Market moves to 1.0875 = $2,500 realized gain.

**Key v4.1 Feature**: Dual-currency flows with mark-to-market tracking.

**Structure**:
- **Arrangement**: FX spot contract with nostro accounts
- **Accruals**: Daily mark-to-market valuations
- **Anticipations**: EUR receipt + USD payment (two legs)
- **Actions**: EUR received (SWIFT) + USD paid (Fedwire) + P&L realized

**Why It Matters**: FX trades involve settlement risk (Herstatt) and P&L from rate movements. Both legs and the gain/loss are captured.`
  },
  overnightRepo: {
    title: "Overnight Repo: Collateral and SOFR",
    content: `## Summary

**Scenario**: Borrow $50M overnight against Treasury collateral. Rate: SOFR + 5bps (5.30%). 3-day term (weekend). Interest: $22,083.

**Key v4.1 Feature**: Two-leg structure with collateral tracking and daily SOFR accruals.

**Structure**:
- **Arrangement**: Repo agreement with collateral (UST 4.25% 2028, 2% haircut)
- **Accruals**: Daily interest + Collateral valuation
- **Anticipation**: Maturity settlement
- **Actions**: Opening leg (cash in, collateral out) + Closing leg (reverse)

**Why It Matters**: Repos are critical for market liquidity. Collateral, rates, and margin are all auditable.`
  },
  salesforceOpp: {
    title: "Salesforce Opportunity: CRM Integration",
    content: `## Summary

**Scenario**: CloudTech closes $285K enterprise deal (3-year license $225K + implementation $45K + training $15K). Customer pays early, takes 2% discount.

**Key v4.1 Feature**: CRM integration — Salesforce record IDs captured for end-to-end traceability.

**Structure**:
- **Arrangement**: Salesforce Opportunity with product lines
- **Accruals**: ASC 606 revenue recognition (subscription/milestone/point-in-time) + AR invoice
- **Anticipation**: Expected payment with early-pay discount option
- **Action**: Payment received ($132,300 after 2% discount)

**Why It Matters**: Opportunity-to-cash is often disconnected. FORAY links CRM records to financial transactions with variance tracking.`
  }
};
