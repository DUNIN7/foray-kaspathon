/**
 * ============================================================================
 * FORAY Protocol - Component Tips
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
 * Description:   Component-specific tips explaining the 4A structure
 *                for each sample transaction type.
 * 
 * Usage:         <script src="foray-tips.js"></script>
 *                Access via window.FORAY_TIPS
 * ============================================================================
 */

window.FORAY_TIPS = {
  batchPayment: {
    arrangements: "Master Service Agreement (MSA) between Acme & GlobalParts. 2-year contract covering up to $500K in purchases. Terms: Net 30, 2% early payment discount within 10 days, 1.5% late penalty. This is the contractual foundation all invoices reference.",
    accruals: "Three invoice obligations, each referencing the MSA. Each accrual captures: invoice number, date, due date, line items, and accounting entry (Debit: Raw Materials, Credit: Accounts Payable). Uses FixedAmount computation since totals are predetermined.",
    anticipations: "Scheduled batch payment referencing ALL THREE accruals — this demonstrates v4.1's many-to-many feature. Specifies expected amount ($47,500), planned date, and payment method (ACH).",
    actions: "Single ACH payment with ALLOCATIONS ARRAY showing exact distribution: $15K to invoice 001, $22.5K to invoice 002, $10K to invoice 003. This allocation tracking is critical for auditors matching payments to invoices."
  },
  cashSale: {
    arrangements: null,
    accruals: null,
    anticipations: null,
    actions: "Complete POS transaction capturing everything: register ID, cashier, 6 line items with SKU/price, subtotal ($124.25), tax calculation (8.25% = $10.25), total ($134.50), cash tendered ($140), change given ($5.50). No contract needed — demonstrates v4.1 flexible entry point."
  },
  autoLoan: {
    arrangements: "Retail Installment Contract with PRIVACY-PROTECTED details: borrower name hashed, VIN hashed. Captures: principal ($35,000), APR (5.49%), term (60 months), monthly payment ($667.33), collateral description.",
    accruals: "Monthly interest calculations using formula: Principal × (APR/12). February: $163.25 on $35K balance. March: $145.32 on reduced balance. Formula ID is hashed for privacy while auditors can verify the math.",
    anticipations: "60-month payment schedule. Each anticipation shows: expected date (1st of month), amount ($667.33), breakdown (principal vs interest portions). Creates the amortization schedule auditors need.",
    actions: "Two action types: (1) Disbursement of $35K to dealer, (2) Monthly payment receipts. Each payment shows actual vs expected, enabling variance tracking if borrower pays early/late or different amounts."
  },
  rmbsWaterfall: {
    arrangements: "THREE TRANCHES as separate arrangements: Class A (AAA, $72M, 4.25%), Class B (A, $14.25M, 5.75%), Class C (BBB, $4.75M, 8.25%). Each captures credit rating, subordination level, and coupon rate.",
    accruals: "FOUR calculations: (1) Pool collections from 450 mortgages ($2.49M), (2-4) Interest due to each tranche. Demonstrates how borrower payments flow into the structure before waterfall distribution.",
    anticipations: "9-STEP WATERFALL PRIORITY: 1) Trustee fees, 2) Servicing fees, 3) Class A interest, 4) Class A principal, 5) Class B interest, 6) Class B principal, 7) Class C interest, 8) Class C principal, 9) Residual to equity.",
    actions: "Single distribution action with ALLOCATIONS showing interest/principal breakdown per tranche. This is the transparency 2008 lacked — every dollar traceable from borrower payment to investor distribution."
  },
  energyPPA: {
    arrangements: "20-year Power Purchase Agreement: 420,000 MWh/year at €42.50/MWh with 1.5% annual escalation. Includes curtailment compensation (85% of foregone revenue) and Renewable Energy Certificates (RECs) at €3.50 each.",
    accruals: "THREE ACCRUAL TYPES: (1) Energy delivery: 38,500 MWh × €43.18 = €1.66M, (2) Curtailment: 1,500 MWh × €43.18 × 85% = €55K, (3) RECs: 40,000 certificates × €3.50 = €140K. Shows how physical delivery creates financial obligations.",
    anticipations: "Expected payment combining all three accrual types. Notes payment terms and that REC transfer happens separately from cash settlement.",
    actions: "TWO SETTLEMENT TYPES: (1) Cash payment via SWIFT for energy + curtailment (€1.72M), (2) Registry transfer of 40,000 RECs via EU Guarantees of Origin system. Demonstrates non-cash settlement tracking."
  },
  manufacturingWO: {
    arrangements: "Work Order #500 with BILL OF MATERIALS: 5 components (cylinder body $85, piston assembly $45, seal kit $12.50, control valve $28×2, housing $65). BOM version tracked for engineering change control.",
    accruals: "THREE COST ELEMENTS: (1) Raw materials: BOM explosion × 100 units = $26,350, (2) Direct labor: 245 hours across 4 operations (machining, assembly, testing, inspection) × $52/hr = $12,740, (3) Overhead: 245 hours × $35.75/hr = $8,759.",
    anticipations: "Expected transfer of 100 finished goods to inventory. Includes target completion date, expected unit cost ($478.49), and quality requirements (AS9100D aerospace standard).",
    actions: "Finished goods receipt: 100 units transferred with LOT NUMBER for traceability, quality certification reference, 100% yield (0 scrap). Total cost captured: $47,848.75."
  },
  depreciationEntry: {
    arrangements: null,
    accruals: "THREE ASSET CLASSES with different methods: (1) CNC Machinery: MACRS 5-year, $750K cost, $25K/month, (2) Vehicles: Straight-line 5-year, $250K cost, $3,750/month, (3) Building: Straight-line 39-year, $8M cost, $17,083/month. Formula IDs hashed but methods verifiable.",
    anticipations: null,
    actions: null
  },
  fxSpot: {
    arrangements: "FX spot contract: Buy €1M / Sell $1.085M at rate 1.0850. T+2 settlement. Nostro accounts specified: EUR at Deutsche Bank Frankfurt, USD at JPMorgan Chase New York.",
    accruals: "MARK-TO-MARKET valuations: Trade date (T+0): P&L = $0 (at trade rate). T+1: Market moves to 1.0875, creating $2,500 unrealized gain. Daily valuation required for trading book accounting.",
    anticipations: "TWO SETTLEMENT LEGS as separate anticipations: (1) EUR receipt of €1,000,000, (2) USD payment of $1,085,000. Both expected T+2. This split captures Herstatt risk — the 5-hour gap between EUR and USD settlement.",
    actions: "THREE SETTLEMENTS: (1) EUR received via SWIFT from Deutsche Bank, (2) USD paid via Fedwire to JPMorgan, (3) P&L realization booking $2,500 gain. Variance tracking shows rate movement impact."
  },
  overnightRepo: {
    arrangements: "Repo agreement: $50M principal, SOFR + 5bps rate (5.30%), 3-day term (Friday-Monday). Collateral: $51.02M face value UST 4.25% 2028 with 2% haircut. Governed by SIFMA Master Repo Agreement.",
    accruals: "THREE COMPONENTS: (1) Day 1 interest: $7,361 at Friday's SOFR, (2) Days 2-3 interest: $14,722 (weekend uses Friday rate), (3) Collateral valuation: $51.02M market value, 2.04% margin excess, no margin call needed.",
    anticipations: "Maturity settlement expecting return of principal ($50M) plus total interest ($22,083). Includes collateral return expectation.",
    actions: "TWO LEGS: (1) Opening: Cash received $50M via Fedwire, collateral delivered via DTC participant transfer, (2) Closing: Cash returned $50,022,083, collateral received back. Both legs must match for clean settlement."
  },
  salesforceOpp: {
    arrangements: "Salesforce Opportunity with RECORD IDs: Opportunity 006Dn..., Account 001Dn..., Contact 003Dn..., Quote 0Q0Dn.... Three products: 3-year license ($225K), implementation ($45K), training ($15K). Links CRM to financial record.",
    accruals: "ASC 606 REVENUE RECOGNITION: (1) Subscription: $225K recognized over 36 months ($2,419/month pro-rata), (2) Implementation: $45K recognized at milestones (30% = $13.5K at kickoff), (3) Training: $15K recognized immediately upon delivery. Plus AR invoice accrual of $135K.",
    anticipations: "Expected payment within 30 days with 2% EARLY PAYMENT DISCOUNT option. This creates variance potential — customer may pay $135K (full) or $132.3K (with discount).",
    actions: "Payment received: Customer took early discount, paid $132,300. VARIANCE captured: Expected $135K, Actual $132.3K, Difference -$2,700 with explanation 'Early payment discount taken.'"
  },
  manukaHoneyProvenance: {
    arrangements: "TWO ARRANGEMENTS establishing authenticity chain: (1) UMF License Agreement with UMFHA (NZ official certifier), (2) Batch Production Record defining 500kg of UMF 15+ Manuka Honey with hive locations, harvest dates, and raw honey analysis. Forms the foundation for all certifications.",
    accruals: "Laboratory analysis from IANZ-accredited Analytica Laboratories. MGO: 514mg/kg, Leptosperin: 185mg/kg, DNA-verified monofloral Manuka. Formula-based UMF grade calculation confirmed at 15+. This scientific testing creates the basis for certification claims.",
    anticipations: "TWO EXPECTED OUTCOMES: (1) UMF certification issuance upon passing lab analysis, (2) MPI export approval enabling international sales. Both anticipations reference the lab analysis accrual as their trigger condition.",
    actions: "UMF certificate issuance action recording certificate number UMF-BATCH-2026-00847 with QR verification URL. This completes the internal certification before export approval.",
    attestations: "THREE-TIER ATTESTATION CHAIN demonstrating trust hierarchy: (1) ATT_LAB_ANALYSIS: Analytica Labs (IANZ/ISO 17025 accredited) attests to chemical analysis results, (2) ATT_UMF_CERTIFICATION: UMF Honey Association (NZ trademark owner) certifies UMF 15+ grade based on lab attestation, (3) ATT_MPI_EXPORT: Ministry for Primary Industries (NZ government) approves export to China, UK, USA, Japan based on UMF certification. Each attestation references its predecessor — creating an immutable chain of trust from lab bench to export dock."
  }
};
