# FORAY JSON Transaction Examples - Ready to Parse

All files are in FORAY v3.0 format and ready to paste into the Transaction Review GUI.

---

## [SEARCH] Available Example Files

### [OK] **1. Mary Smith Loan (v3.0)** 
**File:** `mary-smith-loan-v3.json` 
**Size:** 13 KB (437 lines) 
**Location:** `/mnt/project/mary-smith-loan-v3.json` and `/mnt/user-data/outputs/mary-smith-loan-v3.json`

**Transaction Type:** Consumer Loan 
**Borrower:** Mary Smith 
**Lender:** ABC National Bank 
**Amount:** $60,000 
**Term:** 6 months 
**Interest:** Tiered (8% for months 1-3, 10% for months 4-6)

**Structure:**
- 1 Arrangement (loan agreement)
- 6 Accruals (monthly interest calculations)
- 6 Anticipations (scheduled payments)
- 2 Actions (completed payments 1 and 2)

**Perfect for:**
- Understanding basic loan structure
- Seeing tiered interest rates
- Learning accrual calculations
- Small, manageable size

---

### [OK] **2. Auto Loan - John Doe (v3.0)**
**File:** `auto-loan-john-doe-v3.json` 
**Size:** 12 KB (412 lines) 
**Location:** `/mnt/user-data/outputs/auto-loan-john-doe-v3.json`

**Transaction Type:** Auto Loan 
**Borrower:** John Doe 
**Lender:** Auto Finance Co 
**Amount:** $25,000 
**Term:** 60 months (5 years) 
**Interest:** 4.5% APR 
**Vehicle:** 2024 Honda Accord

**Structure:**
- 1 Arrangement (auto loan agreement with vehicle collateral)
- 6 Accruals (first 6 months of interest)
- 8 Anticipations (6 scheduled payments + early payoff + default scenarios)
- 1 Action (loan disbursement)

**Perfect for:**
- Auto financing examples
- Understanding collateral-backed loans
- Seeing risk scenarios (early payoff, default)
- Monthly payment breakdowns

---

### [OK] **3. RMBS Transaction (v3.0)**
**File:** `rmbs-transaction-v3.json` 
**Size:** 25 KB (896 lines) 
**Location:** `/mnt/project/rmbs-transaction-v3.json` and `/mnt/user-data/outputs/rmbs-transaction-v3.json`

**Transaction Type:** Residential Mortgage-Backed Security 
**Entity:** Global Investment Bank 
**Amount:** $300,000,000 
**Assets:** 1,000 residential mortgages 
**Tranches:** Class A ($240M), Class M-1 ($30M), Class B ($15M), Equity ($15M)

**Structure:**
- 8 Arrangements (loan pool, SPE, 3 tranches, equity, servicing, credit enhancement)
- 6 Accruals (interest for all tranches, servicing fees, CECL reserves)
- 6 Anticipations (prepayment scenarios, defaults, interest rate risk, repurchase)
- 4 Actions (underwriting, issuance, month 1 servicing, month 1 reporting)

**Perfect for:**
- Complex financial instruments
- Understanding securitization
- Multi-party transactions
- Waterfall structures
- Compliance examples (Dodd-Frank, Basel III, Reg AB II)

---

### [OK] **4. Solar PPA - Morocco to Spain (v3.0)** [NEW]
**File:** `energy-solar-ppa-morocco-spain-v3.json` 
**Size:** 18 KB (550+ lines) 
**Location:** `/mnt/user-data/outputs/energy-solar-ppa-morocco-spain-v3.json`

**Transaction Type:** Cross-Border Power Purchase Agreement 
**Entity:** Noor Energy SARL (Morocco) 
**Amount:** EUR 197.1M annually (EUR 16.4M monthly) 
**Capacity:** 500 MW baseload solar power 
**Duration:** 25 years (2026-2051) 
**Transmission:** 600 km HVDC submarine cable

**Structure:**
- 2 Arrangements (PPA + HVDC transmission)
- 5 Accruals (energy revenue, transmission tariff, RECs, FX adjustment, O&M)
- 6 Anticipations (seasonal variance, maintenance, FX volatility, REC prices, curtailment)
- 4 Actions (energy delivery, settlement, REC retirement, grid balancing)

**Perfect for:**
- Renewable energy transactions
- Cross-border electricity trading
- HVDC transmission economics
- Renewable Energy Certificates (RECs)
- Multi-sovereign compliance
- Seasonal production variance
- Grid balancing mechanisms

---

### [OK] **5. Green Hydrogen - Saudi to Europe (v3.0)** [NEW]
**File:** `energy-green-hydrogen-saudi-europe-v3.json` 
**Size:** 22 KB (650+ lines) 
**Location:** `/mnt/user-data/outputs/energy-green-hydrogen-saudi-europe-v3.json`

**Transaction Type:** Green Hydrogen Project Finance 
**Entity:** Saudi Green Hydrogen Corporation 
**Amount:** $8B total ($4.8B debt, $3.2B equity) 
**Production:** 1M tonnes/year H2 (800K tonnes offtake) 
**Power Source:** 5 GW renewables (3 GW solar + 2 GW wind) 
**Duration:** 20 years (2029-2049)

**Structure:**
- 4 Arrangements (project finance, H2 offtake, ammonia conversion, shipping)
- 7 Accruals (H2 revenue, electricity, O&M, ammonia processing, freight, debt service, carbon credits)
- 6 Anticipations (RE variance, efficiency gains, price decline, carbon appreciation, shipping volatility, demand growth)
- 5 Actions (financial close, EPC contract, first production, first shipment, carbon certificates)

**Perfect for:**
- Mega-project financing ($8B scale)
- Green hydrogen economics
- Renewable energy integration
- Ammonia conversion and shipping
- Carbon credit monetization
- Long-term offtake agreements
- Technology learning curves
- Multi-stage project milestones

---

### [!] **4. RMBS Transaction Clean (Legacy)**
**File:** `RMBS_Transaction_Clean.json` 
**Size:** 30 KB 
**Location:** `/mnt/user-data/outputs/RMBS_Transaction_Clean.json`

**Note:** This appears to be an earlier or alternative version of the RMBS transaction. The v3.0 version above is recommended.

---

### [!] **5. Mary Smith Loan (Legacy)**
**File:** `mary-smith-loan.json` 
**Size:** 13 KB 
**Location:** `/mnt/user-data/outputs/mary-smith-loan.json`

**Note:** This may be a v2.0 or earlier version. The v3.0 version above is recommended.

---

## [TARGET] Quick Reference Guide

### By Transaction Complexity:

| Complexity | File | Components | Best For |
|------------|------|------------|----------|
| **Simple** | Mary Smith Loan v3 | 1+6+6+2 = 15 | Learning basics |
| **Medium** | Auto Loan - John Doe v3 | 1+6+8+1 = 16 | Standard loans |
| **Medium** | Solar PPA Morocco-Spain v3 | 2+5+6+4 = 17 | Renewable energy |
| **Complex** | RMBS Transaction v3 | 8+6+6+4 = 24 | Enterprise finance |
| **Complex** | Green Hydrogen Saudi-EU v3 | 4+7+6+5 = 22 | Mega-projects |

### By Transaction Type:

| Type | File | Domain |
|------|------|--------|
| **Consumer Loan** | Mary Smith Loan v3 | Banking, Consumer Credit |
| **Auto Loan** | Auto Loan - John Doe v3 | Auto Finance, Retail Banking |
| **Securitization** | RMBS Transaction v3 | Investment Banking, Capital Markets |
| **Renewable Energy** | Solar PPA Morocco-Spain v3 | Energy, Cross-Border Power |
| **Project Finance** | Green Hydrogen Saudi-EU v3 | Energy, Infrastructure, Green Tech |

### By Use Case:

| Use Case | Recommended File |
|----------|------------------|
| **First-time users** | Mary Smith Loan v3 (small, clear) |
| **Testing GUI** | Auto Loan - John Doe v3 (good variety) |
| **Demo to executives** | RMBS or Green Hydrogen (impressive scale) |
| **Training auditors** | All five (progressive complexity) |
| **Development testing** | RMBS or Green Hydrogen (stress test) |
| **Energy sector** | Solar PPA or Green Hydrogen |
| **Cross-border compliance** | Solar PPA Morocco-Spain |
| **Mega-project financing** | Green Hydrogen Saudi-EU |

---

## [CHART] Detailed Comparison

### Components Count:

| File | Arrangements | Accruals | Anticipations | Actions | Total |
|------|--------------|----------|---------------|---------|-------|
| **Mary Smith v3** | 1 | 6 | 6 | 2 | 15 |
| **Auto Loan v3** | 1 | 6 | 8 | 1 | 16 |
| **Solar PPA v3** | 2 | 5 | 6 | 4 | 17 |
| **RMBS v3** | 8 | 6 | 6 | 4 | 24 |
| **Green H2 v3** | 4 | 7 | 6 | 5 | 22 |

### Transaction Values:

| File | Total Value | Currency |
|------|-------------|----------|
| **Mary Smith v3** | $60,000 | USD |
| **Auto Loan v3** | $25,000 | USD |
| **Solar PPA v3** | EUR 197,100,000 annual | EUR |
| **RMBS v3** | $300,000,000 | USD |
| **Green H2 v3** | $8,000,000,000 | USD |

### Privacy Metadata:

| File | Formulas Obfuscated | Instance Pools | Attack Complexity |
|------|---------------------|----------------|-------------------|
| **Mary Smith v3** | 2 | 5 | 2^96 operations |
| **Auto Loan v3** | 1 | 5 | 2^96 operations |
| **Solar PPA v3** | 5 | 8 | 2^96 operations |
| **RMBS v3** | 7 | 10 | 2^128 operations |
| **Green H2 v3** | 7 | 10 | 2^128 operations |

### Compliance Flags:

| File | Compliance |
|------|------------|
| **Mary Smith v3** | Consumer_Credit, Truth_in_Lending_Act, Reg_Z |
| **Auto Loan v3** | Consumer_Credit, Truth_in_Lending_Act, Reg_Z |
| **Solar PPA v3** | EU_Energy_Directives, Morocco_RE_Regulations, Cross_Border_Grid_Codes, RECs |
| **RMBS v3** | Reg_AB_II, Dodd_Frank, Basel_III, Risk_Retention_5_Percent |
| **Green H2 v3** | Project_Finance_Standards, Saudi_Vision_2030, EU_Hydrogen_Strategy, Carbon_Credits, IMO_Shipping |

---

## [ROCKET] How to Use These Files

### Method 1: Copy File Content

**Via Command Line:**
```bash
# Copy Mary Smith Loan
cat /mnt/project/mary-smith-loan-v3.json

# Copy Auto Loan
cat /mnt/user-data/outputs/auto-loan-john-doe-v3.json

# Copy RMBS
cat /mnt/project/rmbs-transaction-v3.json
```

**Via GUI:**
1. Navigate to the file location
2. Open the file
3. Select all content (Ctrl+A / Cmd+A)
4. Copy (Ctrl+C / Cmd+C)
5. Paste into FORAY GUI textarea

---

### Method 2: Download Files

All files are available in the outputs directory and can be downloaded directly from your file system.

---

### Method 3: Use in Code

**JavaScript/Node.js:**
```javascript
const fs = require('fs');

// Load Mary Smith Loan
const marySmith = JSON.parse(
 fs.readFileSync('/mnt/project/mary-smith-loan-v3.json', -> utf8')
);

// Load Auto Loan
const autoLoan = JSON.parse(
 fs.readFileSync('/mnt/user-data/outputs/auto-loan-john-doe-v3.json', -> utf8')
);

// Load RMBS
const rmbs = JSON.parse(
 fs.readFileSync('/mnt/project/rmbs-transaction-v3.json', -> utf8')
);
```

**Python:**
```python
import json

# Load Mary Smith Loan
with open('/mnt/project/mary-smith-loan-v3.json', -> r') as f:
 mary_smith = json.load(f)

# Load Auto Loan
with open('/mnt/user-data/outputs/auto-loan-john-doe-v3.json', -> r') as f:
 auto_loan = json.load(f)

# Load RMBS
with open('/mnt/project/rmbs-transaction-v3.json', -> r') as f:
 rmbs = json.load(f)
```

---

## [OK] Validation Checklist

All example files include:

[OK] **Top-Level Fields:**
- transaction_id
- timestamp
- block_height
- merkle_root
- kaspa_commitment
- schema_version: "3.0"
- entity
- transaction_type
- total_value
- currency
- status
- compliance_flags

[OK] **4-Component Structure:**
- arrangements (with parties as objects)
- accruals (with formula_id, inputs, output)
- anticipations (with probability_factor, assumptions)
- actions (with amount_settled, dependencies)

[OK] **Privacy Metadata:**
- formulas_obfuscated
- instance_pools
- attack_complexity
- obfuscated_formulas array

[OK] **No Legacy Fields:**
- [X] NO chaff_operations
- [X] NO computational_chaff_operations
- [X] NO nested formula objects

---

## [GRAD] Learning Path

### Beginner -> Advanced:

1. **Start with:** Mary Smith Loan v3
 - Simple structure
 - Easy to understand
 - Clear accrual calculations

2. **Progress to:** Auto Loan - John Doe v3
 - More anticipation scenarios
 - Collateral concepts
 - Risk modeling

3. **Master with:** RMBS Transaction v3
 - Complex multi-party structure
 - Waterfall calculations
 - Regulatory compliance
 - Enterprise-scale transactions

---

## Testing Scenarios

### Scenario 1: Basic Parsing Test
**File:** Mary Smith Loan v3 
**Expected:** All sections display correctly, 15 total components

### Scenario 2: Print Test
**File:** Auto Loan - John Doe v3 
**Expected:** Professional PDF output with vehicle details

### Scenario 3: Stress Test
**File:** RMBS Transaction v3 
**Expected:** GUI handles 24 components smoothly, all tranches visible

### Scenario 4: Search Test
**File:** Any 
**Expected:** Browser search (Ctrl+F) works across all sections

### Scenario 5: Mobile Test
**File:** Mary Smith Loan v3 (smaller for mobile) 
**Expected:** Responsive layout, sections collapsible

---

## Troubleshooting

### File Not Found?
```bash
# List all available files
ls -lh /mnt/project/*.json /mnt/user-data/outputs/*.json
```

### Invalid JSON?
All files have been validated and should parse correctly. If you get an error:
1. Check you copied the entire file
2. Verify no characters were truncated
3. Use the "Clear & Retry" button
4. Try a different file

### Can't See All Components?
1. Click "Expand All" button
2. Check that sections aren't collapsed
3. Scroll down - large files may extend beyond viewport

---

## [!] Pro Tips

1. **Start Small:** Use Mary Smith Loan v3 for first-time testing
2. **Compare Structures:** Load different files to see variations
3. **Print Different Types:** See how each transaction type looks on paper
4. **Use for Training:** Progressive complexity helps onboarding
5. **Test Edge Cases:** RMBS shows how complex transactions scale

---

## File Locations Reference

### Project Files (Canonical v3.0):
```
/mnt/project/mary-smith-loan-v3.json
/mnt/project/rmbs-transaction-v3.json
```

### Output Files (Includes All Generated):
```
/mnt/user-data/outputs/mary-smith-loan-v3.json
/mnt/user-data/outputs/auto-loan-john-doe-v3.json
/mnt/user-data/outputs/rmbs-transaction-v3.json
/mnt/user-data/outputs/RMBS_Transaction_Clean.json (legacy)
/mnt/user-data/outputs/mary-smith-loan.json (legacy)
```

---

## [PARTY] Summary

**5 Production-Ready v3.0 Examples:**
1. [OK] Mary Smith Loan ($60K, 6-month consumer loan)
2. [OK] Auto Loan - John Doe ($25K, 60-month auto financing)
3. [OK] Solar PPA Morocco-Spain (EUR 197M annual, 25-year cross-border power)
4. [OK] RMBS Transaction ($300M, complex securitization)
5. [OK] Green Hydrogen Saudi-Europe ($8B, mega-project finance)

**All files are:**
- [OK] Valid FORAY v3.0 JSON
- [OK] Ready to paste into GUI
- [OK] Properly structured (4 components)
- [OK] Privacy-enabled
- [OK] Compliance-tagged
- [OK] Production-quality examples

**Pick the right file for your use case and paste it into the FORAY Transaction Review GUI!** [ROCKET]
