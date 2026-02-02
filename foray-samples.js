/**
 * ============================================================================
 * FORAY Protocol - Sample Transactions
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
 * Description:   Sample V4.1 transactions for the FORAY Transaction Review Tool.
 *                Contains 13 example transaction types.
 * 
 * Usage:         <script src="foray-samples.js"></script>
 *                Access via window.FORAY_SAMPLES
 * ============================================================================
 */

window.FORAY_SAMPLES = {
  batchPayment: {
    name: "Batch Payment (3 Invoices)",
    description: "AP batch clearing multiple invoices with allocations",
    data: {
      "transaction_id": "AP_2026_Q1_BATCH_PAYMENT_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-25T10:00:00Z",
      "foray_core": {
        "entity": "Acme Corporation",
        "entity_hash": "sha256:def456abc789...",
        "transaction_type": "batch_payment",
        "total_value": 10000.00,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": ["SOX_404", "GAAP"]
      },
      "component_hashes": {
        "arrangements": "sha256:a1b2c3...",
        "accruals": "sha256:d4e5f6...",
        "anticipations": "sha256:g7h8i9...",
        "actions": "sha256:j0k1l2..."
      },
      "arrangements": [
        {
          "id": "ARR_VENDOR_MSA_001",
          "foray_core": {
            "type": "master_service_agreement",
            "effective_date": "2025-01-01T00:00:00Z",
            "parties": [
              { "role": "buyer", "name": "Acme Corporation", "jurisdiction": "US" },
              { "role": "vendor", "name": "TechSupply Inc", "jurisdiction": "US" }
            ],
            "description": "Master agreement for IT supplies",
            "total_value": 100000.00,
            "currency": "USD",
            "terms": { "payment_terms": "Net 30", "auto_renewal": true },
            "dependencies": []
          }
        }
      ],
      "accruals": [
        { "id": "ACC_INVOICE_001", "foray_core": { "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "accounts_payable", "description": "Server hardware invoice", "computation_method": "FixedAmount", "output": 3000.00, "currency": "USD", "dependencies": ["ARR_VENDOR_MSA_001"] } },
        { "id": "ACC_INVOICE_002", "foray_core": { "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "accounts_payable", "description": "Software licenses", "computation_method": "FixedAmount", "output": 4000.00, "currency": "USD", "dependencies": ["ARR_VENDOR_MSA_001"] } },
        { "id": "ACC_INVOICE_003", "foray_core": { "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "accounts_payable", "description": "Cloud services", "computation_method": "Calculated", "formula_id": "sha256:usage...", "output": 3500.00, "currency": "USD", "dependencies": ["ARR_VENDOR_MSA_001"] } }
      ],
      "anticipations": [
        { "id": "ANT_PAYMENT_DUE_001", "foray_core": { "accrual_refs": ["ACC_INVOICE_001"], "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "scheduled_payment", "description": "Payment due for hardware", "expected_amount": 3000.00, "currency": "USD", "expected_date": "2026-01-31", "probability_factor": 1.0, "dependencies": ["ACC_INVOICE_001"] } },
        { "id": "ANT_PAYMENT_DUE_002", "foray_core": { "accrual_refs": ["ACC_INVOICE_002"], "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "scheduled_payment", "description": "Payment due for software", "expected_amount": 4000.00, "currency": "USD", "expected_date": "2026-01-31", "probability_factor": 1.0, "dependencies": ["ACC_INVOICE_002"] } },
        { "id": "ANT_PAYMENT_DUE_003", "foray_core": { "accrual_refs": ["ACC_INVOICE_003"], "arrangement_refs": ["ARR_VENDOR_MSA_001"], "type": "scheduled_payment", "description": "Payment due for cloud", "expected_amount": 3500.00, "currency": "USD", "expected_date": "2026-01-31", "probability_factor": 1.0, "dependencies": ["ACC_INVOICE_003"] } }
      ],
      "actions": [
        {
          "id": "ACT_BATCH_PAYMENT_001",
          "foray_core": {
            "anticipation_refs": ["ANT_PAYMENT_DUE_001", "ANT_PAYMENT_DUE_002", "ANT_PAYMENT_DUE_003"],
            "accrual_refs": ["ACC_INVOICE_001", "ACC_INVOICE_002", "ACC_INVOICE_003"],
            "arrangement_refs": ["ARR_VENDOR_MSA_001"],
            "type": "batch_payment",
            "description": "Consolidated payment clearing 3 invoices",
            "amount_settled": 10000.00,
            "currency": "USD",
            "settlement_date": "2026-01-25T10:00:00Z",
            "settlement_status": "completed",
            "payment_method": "wire",
            "counterparty": "TechSupply Inc",
            "allocations": [
              { "ref": "ANT_PAYMENT_DUE_001", "ref_type": "anticipation", "amount": 3000.00, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 },
              { "ref": "ANT_PAYMENT_DUE_002", "ref_type": "anticipation", "amount": 4000.00, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 },
              { "ref": "ANT_PAYMENT_DUE_003", "ref_type": "anticipation", "amount": 3000.00, "currency": "USD", "allocation_type": "partial", "remaining_balance": 500.00 }
            ],
            "variance": { "expected": 10500.00, "actual": 10000.00, "difference": -500.00, "explanation": "Partial payment on cloud services" },
            "dependencies": ["ANT_PAYMENT_DUE_001", "ANT_PAYMENT_DUE_002", "ANT_PAYMENT_DUE_003"]
          }
        }
      ],
      "merkle_root": "sha256:9f8e7d6c5b4a3210...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qr7f3a2b9d8e...", "block_height": 2850123, "confirmation_time_ms": 1150, "anchored_at": "2026-01-25T10:00:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:audit123...", "audit_profile": "standard", "storage_locations": ["s3://foray-audit/2026/Q1/AP_2026_Q1_BATCH_PAYMENT_001"] },
      "privacy_metadata": { "formulas_obfuscated": 1, "instance_pools": 3, "attack_complexity": "2^96 operations" }
    }
  },
  
  cashSale: {
    name: "Cash Sale (Action Only)",
    description: "Simple retail transaction - no arrangements needed",
    data: {
      "transaction_id": "RETAIL_2026_CASH_SALE_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-25T14:30:00Z",
      "foray_core": {
        "entity": "Main Street Coffee Shop",
        "entity_hash": "sha256:coffee123...",
        "transaction_type": "cash_sale",
        "total_value": 47.50,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": ["PCI_DSS", "Sales_Tax"]
      },
      "component_hashes": { "arrangements": "sha256:empty...", "accruals": "sha256:empty...", "anticipations": "sha256:empty...", "actions": "sha256:act123..." },
      "arrangements": [],
      "accruals": [],
      "anticipations": [],
      "actions": [
        {
          "id": "ACT_CASH_SALE_001",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": [],
            "type": "cash_receipt",
            "description": "Walk-in cash sale - coffee, pastry, merchandise",
            "amount_settled": 47.50,
            "currency": "USD",
            "settlement_date": "2026-01-25T14:30:00Z",
            "settlement_status": "completed",
            "payment_method": "cash",
            "counterparty": "Walk-in Customer",
            "allocations": [],
            "details": { "register_id": "REG-001", "items_sold": 3, "payment_tendered": 50.00, "change_given": 2.50 },
            "breakdown": { "subtotal": 43.18, "sales_tax_rate": 0.10, "sales_tax": 4.32, "total": 47.50 },
            "dependencies": []
          }
        }
      ],
      "merkle_root": "sha256:cashsale123...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrcash123...", "block_height": 2850000, "confirmation_time_ms": 1100, "anchored_at": "2026-01-25T14:30:02Z" },
      "privacy_metadata": { "formulas_obfuscated": 0, "instance_pools": 0, "attack_complexity": "N/A" }
    }
  },
  
  depreciation: {
    name: "Depreciation (Accrual Only)",
    description: "Month-end adjusting entry - no cash movement",
    data: {
      "transaction_id": "ACCT_2026_Q1_DEPRECIATION_JAN",
      "schema_version": "4.1",
      "timestamp": "2026-01-31T23:59:00Z",
      "foray_core": {
        "entity": "Acme Corporation",
        "entity_hash": "sha256:acme123...",
        "transaction_type": "adjusting_entry",
        "total_value": 12500.00,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": ["GAAP", "SOX_404", "ASC_360"]
      },
      "component_hashes": { "arrangements": "sha256:empty...", "accruals": "sha256:depr123...", "anticipations": "sha256:empty...", "actions": "sha256:empty..." },
      "arrangements": [],
      "accruals": [
        {
          "id": "ACC_DEPRECIATION_EQUIPMENT",
          "foray_core": {
            "arrangement_refs": [],
            "type": "depreciation_expense",
            "description": "January equipment depreciation - straight line",
            "computation_method": "Calculated",
            "formula_id": "sha256:straightline...",
            "inputs": { "asset_cost": 600000.00, "salvage_value": 0, "useful_life_months": 120 },
            "output": 5000.00,
            "currency": "USD",
            "accounting_entry": { "debit": { "account": "6100-Depreciation Expense", "amount": 5000.00 }, "credit": { "account": "1510-Accumulated Depreciation", "amount": 5000.00 } },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": []
          }
        },
        {
          "id": "ACC_DEPRECIATION_VEHICLES",
          "foray_core": {
            "arrangement_refs": [],
            "type": "depreciation_expense",
            "description": "January vehicle fleet depreciation",
            "computation_method": "Calculated",
            "formula_id": "sha256:straightline...",
            "inputs": { "asset_cost": 300000.00, "salvage_value": 30000, "useful_life_months": 60 },
            "output": 4500.00,
            "currency": "USD",
            "accounting_entry": { "debit": { "account": "6110-Depreciation Expense - Vehicles", "amount": 4500.00 }, "credit": { "account": "1520-Accumulated Depreciation - Vehicles", "amount": 4500.00 } },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": []
          }
        },
        {
          "id": "ACC_DEPRECIATION_BUILDING",
          "foray_core": {
            "arrangement_refs": [],
            "type": "depreciation_expense",
            "description": "January building depreciation",
            "computation_method": "Calculated",
            "formula_id": "sha256:straightline...",
            "inputs": { "asset_cost": 1440000.00, "salvage_value": 0, "useful_life_months": 480 },
            "output": 3000.00,
            "currency": "USD",
            "accounting_entry": { "debit": { "account": "6120-Depreciation Expense - Building", "amount": 3000.00 }, "credit": { "account": "1530-Accumulated Depreciation - Building", "amount": 3000.00 } },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": []
          }
        }
      ],
      "anticipations": [],
      "actions": [],
      "merkle_root": "sha256:depr789...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrdepr123...", "block_height": 2852000, "confirmation_time_ms": 980, "anchored_at": "2026-01-31T23:59:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:depaudit...", "audit_profile": "standard", "storage_locations": ["s3://foray-audit/2026/Q1/DEPRECIATION_JAN"] },
      "privacy_metadata": { "formulas_obfuscated": 1, "instance_pools": 3, "attack_complexity": "2^96 operations" }
    }
  },
  
  autoLoan: {
    name: "Auto Loan (Full Chain)",
    description: "Consumer loan with arrangement → accruals → anticipations → actions",
    data: {
      "transaction_id": "AUTO_LOAN_2026_Q1_JOHN_DOE",
      "schema_version": "4.1",
      "timestamp": "2026-01-23T15:00:00Z",
      "foray_core": {
        "entity": "Auto Finance Co",
        "entity_hash": "sha256:autofinance...",
        "transaction_type": "auto_loan",
        "total_value": 25000.00,
        "currency": "USD",
        "status": "active",
        "compliance_flags": ["Consumer_Credit", "Truth_in_Lending_Act", "Reg_Z"]
      },
      "component_hashes": { "arrangements": "sha256:arr1...", "accruals": "sha256:acc2...", "anticipations": "sha256:ant3...", "actions": "sha256:act4..." },
      "arrangements": [
        {
          "id": "ARR_AUTO_LOAN_AGREEMENT",
          "foray_core": {
            "type": "auto_loan",
            "effective_date": "2026-01-23T00:00:00Z",
            "parties": [
              { "role": "lender", "name": "Auto Finance Co", "jurisdiction": "US" },
              { "role": "borrower", "name": "John Doe", "jurisdiction": "US" }
            ],
            "description": "60-month auto loan at 4.5% APR",
            "total_value": 25000.00,
            "currency": "USD",
            "terms": { "principal_amount": 25000, "interest_rate": 0.045, "term_months": 60, "monthly_payment": 466.08 },
            "legal_documentation": ["Auto Loan Agreement", "Truth in Lending Disclosure"],
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_INTEREST_MONTH_1",
          "foray_core": {
            "arrangement_refs": ["ARR_AUTO_LOAN_AGREEMENT"],
            "type": "interest_expense",
            "description": "Interest accrual month 1 at 4.5% APR",
            "computation_method": "Calculated",
            "formula_id": "sha256:interest_calc...",
            "inputs": { "principal": 25000.00, "annual_rate": 0.045, "days_in_month": 31 },
            "output": 95.89,
            "currency": "USD",
            "accounting_entry": { "debit": { "account": "7100-Interest Expense", "amount": 95.89 }, "credit": { "account": "2200-Interest Payable", "amount": 95.89 } },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_AUTO_LOAN_AGREEMENT"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_PAYMENT_1",
          "foray_core": {
            "accrual_refs": ["ACC_INTEREST_MONTH_1"],
            "arrangement_refs": ["ARR_AUTO_LOAN_AGREEMENT"],
            "type": "scheduled_payment",
            "description": "Expected payment 1: $466.08",
            "expected_amount": 466.08,
            "currency": "USD",
            "expected_date": "2026-02-23",
            "probability_factor": 0.95,
            "assumptions": { "principal_portion": 370.19, "interest_portion": 95.89 },
            "dependencies": ["ACC_INTEREST_MONTH_1"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_LOAN_ORIGINATION",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": ["ARR_AUTO_LOAN_AGREEMENT"],
            "type": "loan_disbursement",
            "description": "Initial loan disbursement",
            "amount_settled": 25000.00,
            "currency": "USD",
            "settlement_date": "2026-01-23T10:00:00Z",
            "settlement_status": "completed",
            "payment_method": "wire",
            "counterparty": "John Doe",
            "allocations": [],
            "details": { "vehicle_vin": "1HGBH41JXMN109186", "vehicle_year": 2024, "vehicle_make": "Honda", "vehicle_model": "Accord" },
            "dependencies": ["ARR_AUTO_LOAN_AGREEMENT"]
          }
        },
        {
          "id": "ACT_PAYMENT_1",
          "foray_core": {
            "anticipation_refs": ["ANT_PAYMENT_1"],
            "accrual_refs": ["ACC_INTEREST_MONTH_1"],
            "arrangement_refs": ["ARR_AUTO_LOAN_AGREEMENT"],
            "type": "loan_payment",
            "description": "First monthly payment received",
            "amount_settled": 466.08,
            "currency": "USD",
            "settlement_date": "2026-02-23T09:15:00Z",
            "settlement_status": "completed",
            "payment_method": "ach",
            "counterparty": "John Doe",
            "allocations": [
              { "ref": "ANT_PAYMENT_1", "ref_type": "anticipation", "amount": 466.08, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 }
            ],
            "variance": { "expected": 466.08, "actual": 466.08, "difference": 0.00 },
            "breakdown": { "principal_applied": 370.19, "interest_applied": 95.89 },
            "dependencies": ["ANT_PAYMENT_1", "ACC_INTEREST_MONTH_1"]
          }
        }
      ],
      "merkle_root": "sha256:autoloan...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrauto123...", "block_height": 2849000, "confirmation_time_ms": 1050, "anchored_at": "2026-01-23T15:00:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:loanaudit...", "audit_profile": "standard", "storage_locations": ["s3://foray-audit/2026/Q1/AUTO_LOAN_JOHN_DOE"] },
      "privacy_metadata": { "formulas_obfuscated": 1, "instance_pools": 5, "attack_complexity": "2^96 operations" }
    }
  },
  
  energyPPA: {
    name: "Energy PPA (Solar)",
    description: "Power Purchase Agreement with generation, delivery, and settlement",
    data: {
      "transaction_id": "ENERGY_PPA_2026_Q1_SOLAR_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-25T06:00:00Z",
      "foray_core": {
        "entity": "SunPower Utilities",
        "entity_hash": "sha256:sunpower...",
        "transaction_type": "power_purchase_agreement",
        "total_value": 156000.00,
        "currency": "USD",
        "status": "active",
        "compliance_flags": ["FERC", "NERC", "REC_Tracking", "ISO_NE"]
      },
      "component_hashes": { "arrangements": "sha256:ppa1...", "accruals": "sha256:gen1...", "anticipations": "sha256:del1...", "actions": "sha256:set1..." },
      "arrangements": [
        {
          "id": "ARR_PPA_SOLAR_FARM",
          "foray_core": {
            "type": "power_purchase_agreement",
            "effective_date": "2025-01-01T00:00:00Z",
            "termination_date": "2045-01-01T00:00:00Z",
            "parties": [
              { "role": "generator", "name": "Desert Sun Solar LLC", "jurisdiction": "US-AZ" },
              { "role": "offtaker", "name": "SunPower Utilities", "jurisdiction": "US-CA" },
              { "role": "grid_operator", "name": "CAISO", "jurisdiction": "US-CA" }
            ],
            "description": "20-year solar PPA - 50MW facility in Arizona",
            "total_value": 180000000.00,
            "currency": "USD",
            "terms": {
              "capacity_mw": 50,
              "price_per_mwh": 35.00,
              "annual_escalation": 0.02,
              "curtailment_provisions": "Buyer pays 80% for curtailed energy",
              "rec_transfer": "included"
            },
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_GENERATION_JAN_2026",
          "foray_core": {
            "arrangement_refs": ["ARR_PPA_SOLAR_FARM"],
            "type": "energy_generation",
            "description": "January 2026 solar generation - metered output",
            "computation_method": "Calculated",
            "formula_id": "sha256:energy_gen...",
            "inputs": { "meter_reading_start_mwh": 1250000, "meter_reading_end_mwh": 1254500, "capacity_factor": 0.28 },
            "output": 4500.00,
            "unit": "MWh",
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1400-Energy Inventory", "amount": 157500.00 },
              "credit": { "account": "2100-Energy Payable", "amount": 157500.00 }
            },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_PPA_SOLAR_FARM"]
          }
        },
        {
          "id": "ACC_REC_JAN_2026",
          "foray_core": {
            "arrangement_refs": ["ARR_PPA_SOLAR_FARM"],
            "type": "renewable_energy_credit",
            "description": "January 2026 RECs generated",
            "computation_method": "Calculated",
            "formula_id": "sha256:rec_calc...",
            "inputs": { "mwh_generated": 4500, "rec_per_mwh": 1, "rec_value": 15.00 },
            "output": 4500,
            "unit": "RECs",
            "currency": "USD",
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ACC_GENERATION_JAN_2026"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_ENERGY_DELIVERY_JAN",
          "foray_core": {
            "accrual_refs": ["ACC_GENERATION_JAN_2026"],
            "arrangement_refs": ["ARR_PPA_SOLAR_FARM"],
            "type": "scheduled_delivery",
            "description": "Expected energy delivery and payment for January",
            "expected_amount": 157500.00,
            "currency": "USD",
            "expected_date": "2026-02-15",
            "probability_factor": 0.98,
            "assumptions": { "mwh_expected": 4500, "price_per_mwh": 35.00, "curtailment_risk": 0.02 },
            "dependencies": ["ACC_GENERATION_JAN_2026"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_ENERGY_SETTLEMENT_JAN",
          "foray_core": {
            "anticipation_refs": ["ANT_ENERGY_DELIVERY_JAN"],
            "accrual_refs": ["ACC_GENERATION_JAN_2026", "ACC_REC_JAN_2026"],
            "arrangement_refs": ["ARR_PPA_SOLAR_FARM"],
            "type": "energy_settlement",
            "description": "January energy delivery settlement with curtailment adjustment",
            "amount_settled": 156000.00,
            "currency": "USD",
            "settlement_date": "2026-02-15T14:00:00Z",
            "settlement_status": "completed",
            "payment_method": "wire",
            "counterparty": "Desert Sun Solar LLC",
            "allocations": [
              { "ref": "ANT_ENERGY_DELIVERY_JAN", "ref_type": "anticipation", "amount": 156000.00, "currency": "USD", "allocation_type": "partial", "remaining_balance": 1500.00 }
            ],
            "variance": { "expected": 157500.00, "actual": 156000.00, "difference": -1500.00, "explanation": "Grid curtailment event Jan 15-16 (42.86 MWh)" },
            "details": {
              "mwh_delivered": 4457.14,
              "mwh_curtailed": 42.86,
              "curtailment_credit": 1200.00,
              "grid_interconnection_point": "Palo Verde Hub",
              "caiso_settlement_id": "CAISO-2026-01-4521"
            },
            "dependencies": ["ANT_ENERGY_DELIVERY_JAN"]
          }
        }
      ],
      "merkle_root": "sha256:energy123...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrenergy...", "block_height": 2851500, "confirmation_time_ms": 1100, "anchored_at": "2026-02-15T14:00:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:energyaudit...", "audit_profile": "energy_compliance", "storage_locations": ["s3://foray-audit/2026/Q1/ENERGY_PPA_SOLAR_001"] },
      "privacy_metadata": { "formulas_obfuscated": 2, "instance_pools": 4, "attack_complexity": "2^96 operations" }
    }
  },
  
  manufacturing: {
    name: "Manufacturing (Work Order)",
    description: "Production work order with BOM, labor, overhead allocation",
    data: {
      "transaction_id": "MFG_WO_2026_Q1_WIDGET_500",
      "schema_version": "4.1",
      "timestamp": "2026-01-20T08:00:00Z",
      "foray_core": {
        "entity": "Precision Parts Manufacturing",
        "entity_hash": "sha256:precision...",
        "transaction_type": "work_order",
        "total_value": 47500.00,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": ["ISO_9001", "GAAP", "Cost_Accounting_Standards"]
      },
      "component_hashes": { "arrangements": "sha256:wo1...", "accruals": "sha256:cost1...", "anticipations": "sha256:prod1...", "actions": "sha256:inv1..." },
      "arrangements": [
        {
          "id": "ARR_WORK_ORDER_500",
          "foray_core": {
            "type": "production_work_order",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "manufacturer", "name": "Precision Parts Manufacturing", "jurisdiction": "US-MI" },
              { "role": "customer", "name": "AutoTech Industries", "jurisdiction": "US-OH" }
            ],
            "description": "Work Order #WO-2026-500: Premium Widget Assembly (500 units)",
            "total_value": 50000.00,
            "currency": "USD",
            "terms": {
              "product_code": "PWA-1000",
              "quantity_ordered": 500,
              "unit_price": 100.00,
              "delivery_date": "2026-01-25",
              "quality_standard": "ISO 9001"
            },
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_DIRECT_MATERIALS",
          "foray_core": {
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "direct_material_cost",
            "description": "BOM materials consumed - aluminum, electronics, fasteners",
            "computation_method": "Calculated",
            "formula_id": "sha256:bom_cost...",
            "inputs": { "aluminum_kg": 250, "aluminum_cost_per_kg": 45.00, "electronics_units": 500, "electronics_cost": 25.00, "fasteners_sets": 500, "fasteners_cost": 2.50 },
            "output": 25000.00,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1310-WIP Inventory", "amount": 25000.00 },
              "credit": { "account": "1200-Raw Materials", "amount": 25000.00 }
            },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_WORK_ORDER_500"]
          }
        },
        {
          "id": "ACC_DIRECT_LABOR",
          "foray_core": {
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "direct_labor_cost",
            "description": "Production labor - assembly line workers",
            "computation_method": "Calculated",
            "formula_id": "sha256:labor_cost...",
            "inputs": { "labor_hours": 400, "avg_hourly_rate": 35.00, "benefits_rate": 0.30 },
            "output": 18200.00,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1310-WIP Inventory", "amount": 18200.00 },
              "credit": { "account": "2300-Wages Payable", "amount": 14000.00 },
              "credit2": { "account": "2310-Benefits Payable", "amount": 4200.00 }
            },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_WORK_ORDER_500"]
          }
        },
        {
          "id": "ACC_MANUFACTURING_OVERHEAD",
          "foray_core": {
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "manufacturing_overhead",
            "description": "Applied overhead - machine hours basis",
            "computation_method": "Calculated",
            "formula_id": "sha256:overhead_alloc...",
            "inputs": { "machine_hours": 200, "overhead_rate_per_hour": 21.50 },
            "output": 4300.00,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1310-WIP Inventory", "amount": 4300.00 },
              "credit": { "account": "5100-Applied Overhead", "amount": 4300.00 }
            },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ACC_DIRECT_LABOR"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_PRODUCTION_COMPLETE",
          "foray_core": {
            "accrual_refs": ["ACC_DIRECT_MATERIALS", "ACC_DIRECT_LABOR", "ACC_MANUFACTURING_OVERHEAD"],
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "production_completion",
            "description": "Expected completion and transfer to finished goods",
            "expected_amount": 47500.00,
            "currency": "USD",
            "expected_date": "2026-01-24",
            "probability_factor": 0.95,
            "assumptions": { "yield_rate": 0.98, "expected_good_units": 490, "cost_per_unit": 95.00 },
            "dependencies": ["ACC_DIRECT_MATERIALS", "ACC_DIRECT_LABOR", "ACC_MANUFACTURING_OVERHEAD"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_PRODUCTION_COMPLETE",
          "foray_core": {
            "anticipation_refs": ["ANT_PRODUCTION_COMPLETE"],
            "accrual_refs": ["ACC_DIRECT_MATERIALS", "ACC_DIRECT_LABOR", "ACC_MANUFACTURING_OVERHEAD"],
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "inventory_transfer",
            "description": "Transfer completed units to finished goods inventory",
            "amount_settled": 47500.00,
            "currency": "USD",
            "settlement_date": "2026-01-24T16:00:00Z",
            "settlement_status": "completed",
            "allocations": [
              { "ref": "ANT_PRODUCTION_COMPLETE", "ref_type": "anticipation", "amount": 47500.00, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 }
            ],
            "variance": { "expected": 47500.00, "actual": 47500.00, "difference": 0.00 },
            "details": {
              "units_completed": 497,
              "units_scrapped": 3,
              "scrap_value": 45.00,
              "unit_cost": 95.52,
              "lot_number": "LOT-2026-01-500",
              "quality_inspection": "passed"
            },
            "dependencies": ["ANT_PRODUCTION_COMPLETE"]
          }
        },
        {
          "id": "ACT_CUSTOMER_SHIPMENT",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": ["ARR_WORK_ORDER_500"],
            "type": "shipment",
            "description": "Ship completed order to customer",
            "amount_settled": 50000.00,
            "currency": "USD",
            "settlement_date": "2026-01-25T09:00:00Z",
            "settlement_status": "completed",
            "allocations": [],
            "details": {
              "units_shipped": 497,
              "carrier": "FedEx Freight",
              "tracking_number": "FX-789456123",
              "revenue_recognized": 49700.00
            },
            "dependencies": ["ACT_PRODUCTION_COMPLETE"]
          }
        }
      ],
      "merkle_root": "sha256:mfg123...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrmfg...", "block_height": 2850800, "confirmation_time_ms": 980, "anchored_at": "2026-01-25T09:00:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:mfgaudit...", "audit_profile": "manufacturing", "storage_locations": ["s3://foray-audit/2026/Q1/MFG_WO_500"] },
      "privacy_metadata": { "formulas_obfuscated": 3, "instance_pools": 4, "attack_complexity": "2^96 operations" }
    }
  },
  
  salesforceOpportunity: {
    name: "Salesforce Opportunity",
    description: "CRM opportunity → quote → order → invoice → payment",
    data: {
      "transaction_id": "SF_OPP_2026_Q1_ACME_ENTERPRISE",
      "schema_version": "4.1",
      "timestamp": "2026-01-22T10:00:00Z",
      "foray_core": {
        "entity": "CloudTech Solutions",
        "entity_hash": "sha256:cloudtech...",
        "transaction_type": "salesforce_opportunity",
        "total_value": 125000.00,
        "currency": "USD",
        "status": "closed_won",
        "compliance_flags": ["ASC_606", "SOX_404", "Revenue_Recognition"]
      },
      "source_system": {
        "type": "Salesforce",
        "instance": "cloudtech.salesforce.com",
        "api_version": "v59.0"
      },
      "component_hashes": { "arrangements": "sha256:opp1...", "accruals": "sha256:rev1...", "anticipations": "sha256:pay1...", "actions": "sha256:close1..." },
      "arrangements": [
        {
          "id": "ARR_SF_OPPORTUNITY",
          "foray_core": {
            "type": "sales_opportunity",
            "effective_date": "2025-11-15T00:00:00Z",
            "parties": [
              { "role": "seller", "name": "CloudTech Solutions", "jurisdiction": "US-CA" },
              { "role": "buyer", "name": "Acme Corporation", "jurisdiction": "US-NY" }
            ],
            "description": "Enterprise Cloud Platform - 3 Year Agreement",
            "total_value": 125000.00,
            "currency": "USD",
            "terms": {
              "contract_term_years": 3,
              "annual_value": 41666.67,
              "payment_terms": "Annual in advance",
              "renewal_type": "auto_renewal"
            },
            "salesforce_refs": {
              "opportunity_id": "006Dn000004XyZ1ABC",
              "account_id": "001Dn000003ABC1DEF",
              "owner_id": "005Dn000001XYZ9ABC",
              "opportunity_name": "Acme Corp - Enterprise Platform",
              "stage": "Closed Won",
              "close_date": "2026-01-20"
            },
            "dependencies": []
          }
        },
        {
          "id": "ARR_SF_QUOTE",
          "foray_core": {
            "type": "sales_quote",
            "effective_date": "2026-01-10T00:00:00Z",
            "arrangement_refs": ["ARR_SF_OPPORTUNITY"],
            "parties": [
              { "role": "seller", "name": "CloudTech Solutions" },
              { "role": "buyer", "name": "Acme Corporation" }
            ],
            "description": "Quote Q-2026-0142: Enterprise Cloud Platform",
            "total_value": 125000.00,
            "currency": "USD",
            "salesforce_refs": {
              "quote_id": "0Q0Dn000000ABC1DEF",
              "quote_number": "Q-2026-0142",
              "status": "Accepted"
            },
            "line_items": [
              { "product": "Enterprise Platform License", "quantity": 500, "unit_price": 200.00, "total": 100000.00 },
              { "product": "Premium Support", "quantity": 1, "unit_price": 15000.00, "total": 15000.00 },
              { "product": "Implementation Services", "quantity": 1, "unit_price": 10000.00, "total": 10000.00 }
            ],
            "dependencies": ["ARR_SF_OPPORTUNITY"]
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_REVENUE_RECOGNITION_Y1",
          "foray_core": {
            "arrangement_refs": ["ARR_SF_OPPORTUNITY", "ARR_SF_QUOTE"],
            "type": "revenue_recognition",
            "description": "Year 1 revenue recognition - ASC 606 compliant",
            "computation_method": "Calculated",
            "formula_id": "sha256:asc606_rev...",
            "inputs": { "total_contract_value": 125000.00, "performance_obligations": 3, "license_ssp": 100000, "support_ssp": 15000, "services_ssp": 10000 },
            "output": 41666.67,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1200-Accounts Receivable", "amount": 125000.00 },
              "credit": { "account": "2400-Deferred Revenue", "amount": 83333.33 },
              "credit2": { "account": "4100-License Revenue", "amount": 33333.33 },
              "credit3": { "account": "4200-Service Revenue", "amount": 8333.34 }
            },
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "salesforce_refs": {
              "revenue_schedule_id": "0RSxxxxxxx"
            },
            "dependencies": ["ARR_SF_QUOTE"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_CUSTOMER_PAYMENT",
          "foray_core": {
            "accrual_refs": ["ACC_REVENUE_RECOGNITION_Y1"],
            "arrangement_refs": ["ARR_SF_OPPORTUNITY"],
            "type": "scheduled_payment",
            "description": "Expected Year 1 payment upon contract signing",
            "expected_amount": 125000.00,
            "currency": "USD",
            "expected_date": "2026-01-25",
            "probability_factor": 0.99,
            "assumptions": { "payment_method": "wire", "payment_terms": "due_on_signing" },
            "dependencies": ["ACC_REVENUE_RECOGNITION_Y1"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_CONTRACT_EXECUTION",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": ["ARR_SF_OPPORTUNITY", "ARR_SF_QUOTE"],
            "type": "contract_execution",
            "description": "Contract signed via DocuSign",
            "amount_settled": 0,
            "currency": "USD",
            "settlement_date": "2026-01-20T14:30:00Z",
            "settlement_status": "completed",
            "allocations": [],
            "details": {
              "contract_id": "800Dn000001ABC1DEF",
              "docusign_envelope_id": "12345-abcde-67890",
              "signed_by": "Jane Smith, VP Operations"
            },
            "dependencies": ["ARR_SF_QUOTE"]
          }
        },
        {
          "id": "ACT_INVOICE_GENERATED",
          "foray_core": {
            "anticipation_refs": ["ANT_CUSTOMER_PAYMENT"],
            "accrual_refs": ["ACC_REVENUE_RECOGNITION_Y1"],
            "arrangement_refs": ["ARR_SF_OPPORTUNITY"],
            "type": "invoice",
            "description": "Invoice generated from Salesforce CPQ",
            "amount_settled": 125000.00,
            "currency": "USD",
            "settlement_date": "2026-01-21T09:00:00Z",
            "settlement_status": "issued",
            "allocations": [],
            "details": {
              "invoice_id": "a0BDn000001ABC1DEF",
              "invoice_number": "INV-2026-00089",
              "due_date": "2026-02-20"
            },
            "salesforce_refs": {
              "invoice_id": "a0BDn000001ABC1DEF"
            },
            "dependencies": ["ACT_CONTRACT_EXECUTION"]
          }
        },
        {
          "id": "ACT_PAYMENT_RECEIVED",
          "foray_core": {
            "anticipation_refs": ["ANT_CUSTOMER_PAYMENT"],
            "accrual_refs": ["ACC_REVENUE_RECOGNITION_Y1"],
            "arrangement_refs": ["ARR_SF_OPPORTUNITY"],
            "type": "payment_receipt",
            "description": "Wire payment received from Acme Corporation",
            "amount_settled": 125000.00,
            "currency": "USD",
            "settlement_date": "2026-01-22T10:00:00Z",
            "settlement_status": "completed",
            "payment_method": "wire",
            "counterparty": "Acme Corporation",
            "allocations": [
              { "ref": "ANT_CUSTOMER_PAYMENT", "ref_type": "anticipation", "amount": 125000.00, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 }
            ],
            "variance": { "expected": 125000.00, "actual": 125000.00, "difference": 0.00 },
            "details": {
              "bank_reference": "WIR-2026012200145",
              "payment_id": "a1CDn000002ABC1DEF"
            },
            "salesforce_refs": {
              "payment_id": "a1CDn000002ABC1DEF"
            },
            "dependencies": ["ACT_INVOICE_GENERATED", "ANT_CUSTOMER_PAYMENT"]
          }
        }
      ],
      "merkle_root": "sha256:sfopp123...",
      "blockchain_anchor": { "kaspa_tx_id": "kaspa:qrsf...", "block_height": 2850600, "confirmation_time_ms": 1020, "anchored_at": "2026-01-22T10:00:02Z" },
      "audit_data_anchor": { "audit_data_hash": "sha256:sfaudit...", "audit_profile": "revenue_recognition", "storage_locations": ["s3://foray-audit/2026/Q1/SF_OPP_ACME_ENTERPRISE"] },
      "privacy_metadata": { "formulas_obfuscated": 1, "instance_pools": 3, "attack_complexity": "2^96 operations" }
    }
  },
  
  rmbs: {
    name: "RMBS Securitization",
    description: "Residential Mortgage-Backed Security with loan pooling, tranches, and waterfall",
    data: {
      "transaction_id": "RMBS_2026_Q1_POOL_ABC123",
      "schema_version": "4.1",
      "timestamp": "2026-01-15T09:00:00Z",
      "foray_core": {
        "entity": "SecureCapital Mortgage Trust",
        "entity_hash": "sha256:securecap...",
        "transaction_type": "rmbs_securitization",
        "total_value": 500000000.00,
        "currency": "USD",
        "status": "active",
        "compliance_flags": ["SEC_Reg_AB", "FASB_ASC_860", "Risk_Retention", "Dodd_Frank"]
      },
      "component_hashes": {
        "arrangements": "sha256:rmbs_arr...",
        "accruals": "sha256:rmbs_acc...",
        "anticipations": "sha256:rmbs_ant...",
        "actions": "sha256:rmbs_act..."
      },
      "arrangements": [
        {
          "id": "ARR_MORTGAGE_POOL_ABC123",
          "foray_core": {
            "type": "mortgage_pool",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "originator", "name": "National Home Lenders", "jurisdiction": "US" },
              { "role": "issuer", "name": "SecureCapital Mortgage Trust", "jurisdiction": "US-DE" },
              { "role": "trustee", "name": "Bank of New York Mellon", "jurisdiction": "US-NY" },
              { "role": "servicer", "name": "LoanServ Inc", "jurisdiction": "US" }
            ],
            "description": "RMBS Pool ABC123 - Prime Conforming Mortgages",
            "total_value": 500000000.00,
            "currency": "USD",
            "terms": {
              "pool_factor": 1.0,
              "weighted_avg_coupon": 0.0625,
              "weighted_avg_maturity_months": 342,
              "weighted_avg_ltv": 0.72,
              "weighted_avg_fico": 745,
              "loan_count": 1847,
              "geographic_concentration": { "CA": 0.28, "TX": 0.15, "FL": 0.12, "NY": 0.10, "other": 0.35 }
            },
            "legal_documentation": ["Pooling_Service_Agreement", "Trust_Indenture", "Prospectus_Supplement"],
            "dependencies": []
          }
        },
        {
          "id": "ARR_TRANCHE_A1",
          "foray_core": {
            "type": "rmbs_tranche",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "issuer", "name": "SecureCapital Mortgage Trust", "jurisdiction": "US-DE" }
            ],
            "description": "Class A-1 Senior Tranche - AAA Rated",
            "total_value": 350000000.00,
            "currency": "USD",
            "terms": {
              "tranche_class": "A-1",
              "seniority": "senior",
              "rating": { "moodys": "Aaa", "sp": "AAA", "fitch": "AAA" },
              "coupon_rate": 0.045,
              "payment_frequency": "monthly",
              "credit_enhancement": 0.30,
              "subordination_level": 0.30
            },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123"]
          }
        },
        {
          "id": "ARR_TRANCHE_M1",
          "foray_core": {
            "type": "rmbs_tranche",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "issuer", "name": "SecureCapital Mortgage Trust", "jurisdiction": "US-DE" }
            ],
            "description": "Class M-1 Mezzanine Tranche - AA Rated",
            "total_value": 75000000.00,
            "currency": "USD",
            "terms": {
              "tranche_class": "M-1",
              "seniority": "mezzanine",
              "rating": { "moodys": "Aa2", "sp": "AA", "fitch": "AA" },
              "coupon_rate": 0.055,
              "payment_frequency": "monthly",
              "credit_enhancement": 0.15,
              "subordination_level": 0.15
            },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123", "ARR_TRANCHE_A1"]
          }
        },
        {
          "id": "ARR_TRANCHE_B1",
          "foray_core": {
            "type": "rmbs_tranche",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "issuer", "name": "SecureCapital Mortgage Trust", "jurisdiction": "US-DE" }
            ],
            "description": "Class B-1 Subordinate Tranche - BBB Rated",
            "total_value": 50000000.00,
            "currency": "USD",
            "terms": {
              "tranche_class": "B-1",
              "seniority": "subordinate",
              "rating": { "moodys": "Baa2", "sp": "BBB", "fitch": "BBB" },
              "coupon_rate": 0.075,
              "payment_frequency": "monthly",
              "credit_enhancement": 0.05,
              "subordination_level": 0.05
            },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123", "ARR_TRANCHE_A1", "ARR_TRANCHE_M1"]
          }
        },
        {
          "id": "ARR_TRANCHE_R",
          "foray_core": {
            "type": "rmbs_tranche",
            "effective_date": "2026-01-15T00:00:00Z",
            "parties": [
              { "role": "issuer", "name": "SecureCapital Mortgage Trust", "jurisdiction": "US-DE" },
              { "role": "risk_retention_holder", "name": "National Home Lenders", "jurisdiction": "US" }
            ],
            "description": "Class R Residual/First-Loss - Unrated (Risk Retention)",
            "total_value": 25000000.00,
            "currency": "USD",
            "terms": {
              "tranche_class": "R",
              "seniority": "residual",
              "rating": { "moodys": "NR", "sp": "NR", "fitch": "NR" },
              "risk_retention_compliant": true,
              "retention_percentage": 0.05,
              "excess_spread_entitled": true
            },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123", "ARR_TRANCHE_A1", "ARR_TRANCHE_M1", "ARR_TRANCHE_B1"]
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_POOL_INTEREST_JAN",
          "foray_core": {
            "arrangement_refs": ["ARR_MORTGAGE_POOL_ABC123"],
            "type": "interest_collection",
            "description": "January pool interest collections",
            "computation_method": "Calculated",
            "formula_id": "sha256:pool_interest_calc...",
            "inputs": {
              "pool_balance": 500000000.00,
              "weighted_avg_coupon": 0.0625,
              "days_in_period": 31,
              "prepayment_rate_cpr": 0.08
            },
            "output": 2604166.67,
            "currency": "USD",
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123"]
          }
        },
        {
          "id": "ACC_POOL_PRINCIPAL_JAN",
          "foray_core": {
            "arrangement_refs": ["ARR_MORTGAGE_POOL_ABC123"],
            "type": "principal_collection",
            "description": "January scheduled principal + prepayments",
            "computation_method": "Calculated",
            "formula_id": "sha256:principal_calc...",
            "inputs": {
              "scheduled_principal": 1250000.00,
              "prepayments": 3333333.33,
              "defaults": 125000.00,
              "recoveries": 75000.00
            },
            "output": 4533333.33,
            "currency": "USD",
            "fiscal_period": { "year": 2026, "quarter": 1, "month": 1 },
            "dependencies": ["ARR_MORTGAGE_POOL_ABC123"]
          }
        },
        {
          "id": "ACC_TRANCHE_A1_INTEREST",
          "foray_core": {
            "arrangement_refs": ["ARR_TRANCHE_A1"],
            "type": "tranche_interest_due",
            "description": "Class A-1 January interest due",
            "computation_method": "Calculated",
            "formula_id": "sha256:tranche_interest...",
            "inputs": { "tranche_balance": 350000000.00, "coupon_rate": 0.045, "days": 31 },
            "output": 1312500.00,
            "currency": "USD",
            "waterfall_priority": 1,
            "dependencies": ["ACC_POOL_INTEREST_JAN"]
          }
        },
        {
          "id": "ACC_TRANCHE_M1_INTEREST",
          "foray_core": {
            "arrangement_refs": ["ARR_TRANCHE_M1"],
            "type": "tranche_interest_due",
            "description": "Class M-1 January interest due",
            "computation_method": "Calculated",
            "formula_id": "sha256:tranche_interest...",
            "inputs": { "tranche_balance": 75000000.00, "coupon_rate": 0.055, "days": 31 },
            "output": 343750.00,
            "currency": "USD",
            "waterfall_priority": 2,
            "dependencies": ["ACC_POOL_INTEREST_JAN", "ACC_TRANCHE_A1_INTEREST"]
          }
        },
        {
          "id": "ACC_TRANCHE_B1_INTEREST",
          "foray_core": {
            "arrangement_refs": ["ARR_TRANCHE_B1"],
            "type": "tranche_interest_due",
            "description": "Class B-1 January interest due",
            "computation_method": "Calculated",
            "formula_id": "sha256:tranche_interest...",
            "inputs": { "tranche_balance": 50000000.00, "coupon_rate": 0.075, "days": 31 },
            "output": 312500.00,
            "currency": "USD",
            "waterfall_priority": 3,
            "dependencies": ["ACC_POOL_INTEREST_JAN", "ACC_TRANCHE_M1_INTEREST"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_WATERFALL_DISTRIBUTION_JAN",
          "foray_core": {
            "accrual_refs": ["ACC_POOL_INTEREST_JAN", "ACC_POOL_PRINCIPAL_JAN", "ACC_TRANCHE_A1_INTEREST", "ACC_TRANCHE_M1_INTEREST", "ACC_TRANCHE_B1_INTEREST"],
            "arrangement_refs": ["ARR_MORTGAGE_POOL_ABC123", "ARR_TRANCHE_A1", "ARR_TRANCHE_M1", "ARR_TRANCHE_B1", "ARR_TRANCHE_R"],
            "type": "waterfall_distribution",
            "description": "January payment date waterfall",
            "expected_amount": 7137500.00,
            "currency": "USD",
            "expected_date": "2026-01-25",
            "probability_factor": 0.99,
            "waterfall_sequence": [
              { "priority": 1, "payee": "Trustee_Fees", "amount": 41666.67 },
              { "priority": 2, "payee": "Servicer_Fees", "amount": 104166.67 },
              { "priority": 3, "payee": "Class_A1_Interest", "amount": 1312500.00 },
              { "priority": 4, "payee": "Class_A1_Principal", "amount": 4533333.33 },
              { "priority": 5, "payee": "Class_M1_Interest", "amount": 343750.00 },
              { "priority": 6, "payee": "Class_B1_Interest", "amount": 312500.00 },
              { "priority": 7, "payee": "Class_R_Residual", "amount": 489583.33 }
            ],
            "dependencies": ["ACC_POOL_INTEREST_JAN", "ACC_POOL_PRINCIPAL_JAN"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_WATERFALL_PAYMENT_JAN",
          "foray_core": {
            "anticipation_refs": ["ANT_WATERFALL_DISTRIBUTION_JAN"],
            "accrual_refs": ["ACC_TRANCHE_A1_INTEREST", "ACC_TRANCHE_M1_INTEREST", "ACC_TRANCHE_B1_INTEREST"],
            "arrangement_refs": ["ARR_TRANCHE_A1", "ARR_TRANCHE_M1", "ARR_TRANCHE_B1", "ARR_TRANCHE_R"],
            "type": "waterfall_settlement",
            "description": "January payment date - all tranches paid per waterfall",
            "amount_settled": 7137500.00,
            "currency": "USD",
            "settlement_date": "2026-01-25T14:00:00Z",
            "settlement_status": "completed",
            "payment_method": "wire_dtc",
            "allocations": [
              { "ref": "ARR_MORTGAGE_POOL_ABC123", "ref_type": "arrangement", "amount": 145833.34, "currency": "USD", "allocation_type": "full", "breakdown": { "trustee_fees": 41666.67, "servicer_fees": 104166.67 } },
              { "ref": "ARR_TRANCHE_A1", "ref_type": "arrangement", "amount": 5845833.33, "currency": "USD", "allocation_type": "full", "breakdown": { "interest": 1312500.00, "principal": 4533333.33 } },
              { "ref": "ARR_TRANCHE_M1", "ref_type": "arrangement", "amount": 343750.00, "currency": "USD", "allocation_type": "full", "breakdown": { "interest": 343750.00, "principal": 0 } },
              { "ref": "ARR_TRANCHE_B1", "ref_type": "arrangement", "amount": 312500.00, "currency": "USD", "allocation_type": "full", "breakdown": { "interest": 312500.00, "principal": 0 } },
              { "ref": "ARR_TRANCHE_R", "ref_type": "arrangement", "amount": 489583.33, "currency": "USD", "allocation_type": "full", "breakdown": { "excess_spread": 489583.33 } }
            ],
            "variance": { "expected": 7137500.00, "actual": 7137500.00, "difference": 0.00 },
            "pool_metrics_post_payment": {
              "new_pool_balance": 495466666.67,
              "new_pool_factor": 0.9909,
              "cumulative_losses": 50000.00,
              "delinquency_30_plus": 0.012,
              "delinquency_60_plus": 0.004
            },
            "dependencies": ["ANT_WATERFALL_DISTRIBUTION_JAN"]
          }
        }
      ],
      "merkle_root": "sha256:rmbs_abc123...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:rmbs_audit...", "audit_profile": "structured_finance", "storage_locations": ["s3://foray-audit/2026/Q1/RMBS_POOL_ABC123"] },
      "privacy_metadata": { "formulas_obfuscated": 5, "instance_pools": 12, "attack_complexity": "2^128 operations" }
    }
  },
  
  fxSpot: {
    name: "FX Spot Trade (USD/JPY)",
    description: "Foreign exchange spot transaction with T+2 settlement",
    data: {
      "transaction_id": "FX_SPOT_2026_USDJPY_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-23T14:30:00Z",
      "foray_core": {
        "entity": "GlobalTrade Capital LLC",
        "entity_hash": "sha256:globaltrade...",
        "transaction_type": "fx_spot",
        "total_value": 10000000.00,
        "currency": "USD",
        "status": "settled",
        "compliance_flags": ["Dodd_Frank", "EMIR", "MiFID_II", "CFTC"]
      },
      "component_hashes": {
        "arrangements": "sha256:fx_arr...",
        "accruals": "sha256:fx_acc...",
        "anticipations": "sha256:fx_ant...",
        "actions": "sha256:fx_act..."
      },
      "arrangements": [
        {
          "id": "ARR_FX_SPOT_USDJPY",
          "foray_core": {
            "type": "fx_spot_contract",
            "effective_date": "2026-01-23T14:30:00Z",
            "parties": [
              { "role": "buyer_usd", "name": "GlobalTrade Capital LLC", "jurisdiction": "US-NY", "lei": "549300ABCDEFGHIJ1234" },
              { "role": "seller_usd", "name": "Tokyo Metropolitan Bank", "jurisdiction": "JP", "lei": "353800XYZABCDEFG5678" }
            ],
            "description": "USD/JPY Spot - Buy 10M USD vs JPY",
            "total_value": 10000000.00,
            "currency": "USD",
            "terms": {
              "currency_pair": "USD/JPY",
              "direction": "buy_usd_sell_jpy",
              "notional_usd": 10000000.00,
              "notional_jpy": 1485000000,
              "spot_rate": 148.50,
              "trade_date": "2026-01-23",
              "value_date": "2026-01-27",
              "settlement_type": "T+2"
            },
            "execution_details": {
              "execution_venue": "Reuters_Matching",
              "execution_timestamp": "2026-01-23T14:30:22.456Z",
              "dealer_spread": 0.02,
              "mid_rate": 148.49,
              "benchmark_fixing": "WMR_4PM_London"
            },
            "legal_documentation": ["ISDA_Master_Agreement", "FX_Definitions_2021"],
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_FX_USD_RECEIVABLE",
          "foray_core": {
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_receivable",
            "description": "USD leg receivable - awaiting T+2 settlement",
            "computation_method": "FixedAmount",
            "output": 10000000.00,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "1150-FX Receivables USD", "amount": 10000000.00 },
              "credit": { "account": "2150-FX Payables JPY", "amount": 10000000.00, "fx_rate": 148.50 }
            },
            "mark_to_market": {
              "mtm_rate": 148.65,
              "unrealized_pnl_usd": 10084.18,
              "mtm_timestamp": "2026-01-23T21:00:00Z"
            },
            "dependencies": ["ARR_FX_SPOT_USDJPY"]
          }
        },
        {
          "id": "ACC_FX_JPY_PAYABLE",
          "foray_core": {
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_payable",
            "description": "JPY leg payable - awaiting T+2 settlement",
            "computation_method": "FixedAmount",
            "output": 1485000000,
            "currency": "JPY",
            "accounting_entry": {
              "debit": { "account": "5500-FX Trading Expense", "amount": 1485000000, "currency": "JPY" },
              "credit": { "account": "2155-FX Payables JPY", "amount": 1485000000, "currency": "JPY" }
            },
            "nostro_account": {
              "bank": "Tokyo Metropolitan Bank",
              "account_number": "JPY-NOSTRO-001",
              "swift": "TMBJPJTT"
            },
            "dependencies": ["ARR_FX_SPOT_USDJPY"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_FX_SETTLEMENT",
          "foray_core": {
            "accrual_refs": ["ACC_FX_USD_RECEIVABLE", "ACC_FX_JPY_PAYABLE"],
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_settlement",
            "description": "T+2 settlement of USD/JPY spot",
            "expected_amount": 10000000.00,
            "currency": "USD",
            "expected_date": "2026-01-27",
            "probability_factor": 0.999,
            "settlement_instructions": {
              "usd_receiving_bank": "JPMorgan Chase",
              "usd_account": "USD-NOSTRO-001",
              "usd_swift": "CHASUS33",
              "jpy_paying_bank": "Tokyo Metropolitan Bank",
              "jpy_account": "JPY-NOSTRO-001",
              "jpy_swift": "TMBJPJTT"
            },
            "dependencies": ["ACC_FX_USD_RECEIVABLE", "ACC_FX_JPY_PAYABLE"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_FX_TRADE_EXECUTION",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_trade_execution",
            "description": "Trade executed on Reuters Matching",
            "amount_settled": 10000000.00,
            "currency": "USD",
            "settlement_date": "2026-01-23T14:30:22Z",
            "settlement_status": "executed",
            "execution_details": {
              "deal_id": "RTR-2026012314302245",
              "counterparty_deal_id": "TMB-FX-20260123-0892",
              "execution_price": 148.50,
              "slippage_bps": 0.5
            },
            "dependencies": ["ARR_FX_SPOT_USDJPY"]
          }
        },
        {
          "id": "ACT_FX_SETTLEMENT_USD",
          "foray_core": {
            "anticipation_refs": ["ANT_FX_SETTLEMENT"],
            "accrual_refs": ["ACC_FX_USD_RECEIVABLE"],
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_settlement_leg",
            "description": "USD leg settled via CHIPS",
            "amount_settled": 10000000.00,
            "currency": "USD",
            "settlement_date": "2026-01-27T16:00:00Z",
            "settlement_status": "completed",
            "payment_method": "chips",
            "counterparty": "Tokyo Metropolitan Bank",
            "allocations": [
              { "ref": "ACC_FX_USD_RECEIVABLE", "ref_type": "accrual", "amount": 10000000.00, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 }
            ],
            "settlement_details": {
              "chips_uid": "20260127CHPS1234567",
              "receiving_bank_confirmation": "JPMC-CONF-789012",
              "settlement_time_utc": "2026-01-27T16:00:00Z"
            },
            "dependencies": ["ANT_FX_SETTLEMENT"]
          }
        },
        {
          "id": "ACT_FX_SETTLEMENT_JPY",
          "foray_core": {
            "anticipation_refs": ["ANT_FX_SETTLEMENT"],
            "accrual_refs": ["ACC_FX_JPY_PAYABLE"],
            "arrangement_refs": ["ARR_FX_SPOT_USDJPY"],
            "type": "fx_settlement_leg",
            "description": "JPY leg settled via BOJ-NET",
            "amount_settled": 1485000000,
            "currency": "JPY",
            "settlement_date": "2026-01-27T09:00:00Z",
            "settlement_status": "completed",
            "payment_method": "boj_net",
            "counterparty": "Tokyo Metropolitan Bank",
            "allocations": [
              { "ref": "ACC_FX_JPY_PAYABLE", "ref_type": "accrual", "amount": 1485000000, "currency": "JPY", "allocation_type": "full", "remaining_balance": 0 }
            ],
            "settlement_details": {
              "boj_reference": "BOJNET-20260127-JP456789",
              "paying_bank_confirmation": "TMB-PAY-CONF-2345",
              "settlement_time_jst": "2026-01-27T18:00:00+09:00"
            },
            "dependencies": ["ANT_FX_SETTLEMENT"]
          }
        }
      ],
      "merkle_root": "sha256:fx_usdjpy_001...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:fx_audit...", "audit_profile": "trading_compliance", "storage_locations": ["s3://foray-audit/2026/Q1/FX_SPOT_USDJPY_001"] },
      "privacy_metadata": { "formulas_obfuscated": 2, "instance_pools": 6, "attack_complexity": "2^96 operations" }
    }
  },
  
  overnightRepo: {
    name: "Overnight Repo (Fixed Rate)",
    description: "Secured overnight financing - Treasury collateral with fixed interest",
    data: {
      "transaction_id": "REPO_2026_ON_TREASURY_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-24T15:00:00Z",
      "foray_core": {
        "entity": "Pinnacle Securities LLC",
        "entity_hash": "sha256:pinnacle...",
        "transaction_type": "overnight_repo",
        "total_value": 100000000.00,
        "currency": "USD",
        "status": "settled",
        "compliance_flags": ["SEC_15c3", "FINRA_4210", "Fed_Reg_T", "SOFR_Compliant"]
      },
      "component_hashes": {
        "arrangements": "sha256:repo_arr...",
        "accruals": "sha256:repo_acc...",
        "anticipations": "sha256:repo_ant...",
        "actions": "sha256:repo_act..."
      },
      "arrangements": [
        {
          "id": "ARR_REPO_OVERNIGHT",
          "foray_core": {
            "type": "repurchase_agreement",
            "effective_date": "2026-01-24T00:00:00Z",
            "parties": [
              { "role": "cash_borrower", "name": "Pinnacle Securities LLC", "jurisdiction": "US-NY", "lei": "549300PINNACLE12345" },
              { "role": "cash_lender", "name": "Federal Reserve Bank of New York", "jurisdiction": "US-NY", "lei": "254900FEDRESNY67890" }
            ],
            "description": "Overnight RP - US Treasury Collateral",
            "total_value": 100000000.00,
            "currency": "USD",
            "terms": {
              "repo_type": "overnight",
              "start_date": "2026-01-24",
              "end_date": "2026-01-27",
              "term_days": 3,
              "repo_rate": 0.0530,
              "repo_rate_basis": "ACT/360",
              "haircut_percentage": 0.02,
              "margin_call_threshold": 0.01
            },
            "collateral": {
              "type": "US_Treasury",
              "cusip": "912810SZ3",
              "isin": "US912810SZ35",
              "description": "US Treasury 4.25% 11/15/2034",
              "face_value": 102000000.00,
              "market_value": 102040000.00,
              "accrued_interest": 850000.00,
              "dirty_price": 100.87,
              "collateral_value_after_haircut": 100000000.00
            },
            "legal_documentation": ["GMRA_2011", "MRA_Annex", "Tri_Party_Agreement"],
            "tri_party_agent": {
              "name": "Bank of New York Mellon",
              "account_id": "TPA-PINN-001"
            },
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_REPO_INTEREST",
          "foray_core": {
            "arrangement_refs": ["ARR_REPO_OVERNIGHT"],
            "type": "repo_interest",
            "description": "Overnight repo interest accrual (3 days over weekend)",
            "computation_method": "Calculated",
            "formula_id": "sha256:repo_interest_calc...",
            "inputs": {
              "principal": 100000000.00,
              "repo_rate": 0.0530,
              "day_count_basis": "ACT/360",
              "days": 3
            },
            "output": 44166.67,
            "currency": "USD",
            "accounting_entry": {
              "debit": { "account": "7200-Interest Expense - Repo", "amount": 44166.67 },
              "credit": { "account": "2300-Repo Interest Payable", "amount": 44166.67 }
            },
            "rate_benchmark": {
              "reference_rate": "SOFR",
              "sofr_rate": 0.0528,
              "spread_to_sofr": 0.0002
            },
            "dependencies": ["ARR_REPO_OVERNIGHT"]
          }
        },
        {
          "id": "ACC_COLLATERAL_VALUATION",
          "foray_core": {
            "arrangement_refs": ["ARR_REPO_OVERNIGHT"],
            "type": "collateral_mark",
            "description": "End of day collateral valuation",
            "computation_method": "Calculated",
            "formula_id": "sha256:collateral_mtm...",
            "inputs": {
              "cusip": "912810SZ3",
              "face_value": 102000000.00,
              "price_source": "Bloomberg_BGN",
              "closing_price": 100.92,
              "accrued_interest_per_100": 0.85
            },
            "output": 103806600.00,
            "currency": "USD",
            "margin_status": {
              "required_collateral": 102000000.00,
              "actual_collateral": 103806600.00,
              "excess_margin": 1806600.00,
              "margin_call_required": false
            },
            "dependencies": ["ARR_REPO_OVERNIGHT"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_REPO_MATURITY",
          "foray_core": {
            "accrual_refs": ["ACC_REPO_INTEREST"],
            "arrangement_refs": ["ARR_REPO_OVERNIGHT"],
            "type": "repo_maturity",
            "description": "Repo maturity - return cash + interest, receive collateral",
            "expected_amount": 100044166.67,
            "currency": "USD",
            "expected_date": "2026-01-27",
            "probability_factor": 0.9999,
            "settlement_obligations": {
              "cash_to_return": 100044166.67,
              "collateral_to_receive": 102000000.00,
              "collateral_cusip": "912810SZ3"
            },
            "rollover_intent": "mature_no_roll",
            "dependencies": ["ACC_REPO_INTEREST"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_REPO_OPENING",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": [],
            "arrangement_refs": ["ARR_REPO_OVERNIGHT"],
            "type": "repo_opening_leg",
            "description": "Opening leg - deliver collateral, receive cash",
            "amount_settled": 100000000.00,
            "currency": "USD",
            "settlement_date": "2026-01-24T15:00:00Z",
            "settlement_status": "completed",
            "payment_method": "fedwire",
            "counterparty": "Federal Reserve Bank of New York",
            "settlement_details": {
              "cash_settlement": {
                "fedwire_reference": "FW20260124PINN0001",
                "receiving_account": "Pinnacle Securities LLC",
                "amount": 100000000.00
              },
              "collateral_settlement": {
                "dtc_reference": "DTC20260124COL0001",
                "delivering_participant": "0901",
                "receiving_participant": "0060",
                "cusip": "912810SZ3",
                "face_value": 102000000.00
              }
            },
            "dependencies": ["ARR_REPO_OVERNIGHT"]
          }
        },
        {
          "id": "ACT_REPO_CLOSING",
          "foray_core": {
            "anticipation_refs": ["ANT_REPO_MATURITY"],
            "accrual_refs": ["ACC_REPO_INTEREST"],
            "arrangement_refs": ["ARR_REPO_OVERNIGHT"],
            "type": "repo_closing_leg",
            "description": "Closing leg - return cash + interest, receive collateral back",
            "amount_settled": 100044166.67,
            "currency": "USD",
            "settlement_date": "2026-01-27T10:00:00Z",
            "settlement_status": "completed",
            "payment_method": "fedwire",
            "counterparty": "Federal Reserve Bank of New York",
            "allocations": [
              { "ref": "ANT_REPO_MATURITY", "ref_type": "anticipation", "amount": 100044166.67, "currency": "USD", "allocation_type": "full", "remaining_balance": 0.00 }
            ],
            "variance": { "expected": 100044166.67, "actual": 100044166.67, "difference": 0.00 },
            "settlement_details": {
              "cash_settlement": {
                "fedwire_reference": "FW20260127PINN0002",
                "paying_account": "Pinnacle Securities LLC",
                "amount": 100044166.67,
                "breakdown": { "principal": 100000000.00, "interest": 44166.67 }
              },
              "collateral_settlement": {
                "dtc_reference": "DTC20260127COL0002",
                "delivering_participant": "0060",
                "receiving_participant": "0901",
                "cusip": "912810SZ3",
                "face_value": 102000000.00
              }
            },
            "dependencies": ["ANT_REPO_MATURITY"]
          }
        }
      ],
      "merkle_root": "sha256:repo_on_001...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:repo_audit...", "audit_profile": "securities_financing", "storage_locations": ["s3://foray-audit/2026/Q1/REPO_ON_TREASURY_001"] },
      "privacy_metadata": { "formulas_obfuscated": 2, "instance_pools": 5, "attack_complexity": "2^96 operations" }
    }
  },

  manukaHoneyProvenance: {
    name: "Manuka Honey Provenance",
    description: "UMF-certified New Zealand Manuka honey with attestation chain",
    data: {
      "transaction_id": "PROV_2026_Q1_MANUKA_HONEY_BATCH_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-15T09:00:00Z",
      "foray_core": {
        "entity": "Waikato Apiaries Ltd",
        "entity_hash": "sha256:wal_2026_abc123...",
        "transaction_type": "product_provenance",
        "total_value": 185000.00,
        "currency": "NZD",
        "status": "completed",
        "compliance_flags": ["MPI_Export_Certified", "UMF_Licensed", "ISO_22000"]
      },
      "component_hashes": {
        "arrangements": "sha256:arr_manuka_a1b2c3...",
        "accruals": "sha256:acc_manuka_d4e5f6...",
        "anticipations": "sha256:ant_manuka_g7h8i9...",
        "actions": "sha256:act_manuka_j0k1l2...",
        "attestations": "sha256:att_manuka_m3n4o5..."
      },
      "arrangements": [
        {
          "id": "ARR_UMF_LICENSE_2026",
          "foray_core": {
            "type": "origin_certification",
            "effective_date": "2026-01-01T00:00:00Z",
            "parties": [
              { "role": "producer", "name": "Waikato Apiaries Ltd", "jurisdiction": "NZ" },
              { "role": "certifier", "name": "UMF Honey Association", "jurisdiction": "NZ" },
              { "role": "laboratory", "name": "Analytica Laboratories", "jurisdiction": "NZ" }
            ],
            "description": "UMF certification license for authentic New Zealand Manuka Honey",
            "total_value": 185000.00,
            "currency": "NZD",
            "terms": { "certification_type": "UMF_Licensed_Producer", "license_number": "UMF-2026-0847", "valid_until": "2026-12-31", "annual_audit_required": true },
            "dependencies": []
          }
        },
        {
          "id": "ARR_BATCH_DEFINITION_2026_001",
          "foray_core": {
            "type": "production_batch",
            "effective_date": "2026-01-10T00:00:00Z",
            "parties": [
              { "role": "producer", "name": "Waikato Apiaries Ltd", "jurisdiction": "NZ" }
            ],
            "description": "Production batch MH-2026-001 - 500kg UMF 15+ Manuka Honey",
            "total_value": 185000.00,
            "currency": "NZD",
            "terms": { "batch_id": "MH-2026-001", "weight_kg": 500, "jar_count": 1000, "jar_size_g": 500, "harvest_date": "2025-12-20", "apiary_region": "Waikato, North Island" },
            "dependencies": ["ARR_UMF_LICENSE_2026"]
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_LABORATORY_ANALYSIS_001",
          "foray_core": {
            "arrangement_refs": ["ARR_BATCH_DEFINITION_2026_001", "ARR_UMF_LICENSE_2026"],
            "type": "product_analysis",
            "description": "Laboratory analysis results for batch MH-2026-001",
            "computation_method": "Valuation",
            "formula_id": "sha256:umf_analysis_protocol_v2...",
            "inputs": { "sample_id": "SAMPLE-MH-2026-001-A", "analysis_date": "2026-01-12", "methodology": "UMF_Grading_Standard_v4" },
            "output": 185000.00,
            "currency": "NZD",
            "analysis_results": { "mgo_mg_kg": 514, "leptosperin_mg_kg": 185, "umf_rating": 15, "umf_grade": "UMF 15+", "dna_verified": true, "classification": "Authentic Monofloral Manuka", "grade_confirmed": true },
            "dependencies": ["ARR_BATCH_DEFINITION_2026_001"]
          }
        },
        {
          "id": "ACC_BATCH_VALUATION_001",
          "foray_core": {
            "arrangement_refs": ["ARR_BATCH_DEFINITION_2026_001"],
            "type": "inventory_valuation",
            "description": "Batch valuation at export wholesale price",
            "computation_method": "Calculated",
            "formula_id": "sha256:valuation_weight_x_grade_price...",
            "inputs": { "weight_kg": 500, "umf_grade": "UMF 15+", "price_per_kg_nzd": 370.00 },
            "output": 185000.00,
            "currency": "NZD",
            "dependencies": ["ARR_BATCH_DEFINITION_2026_001"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_EXPORT_DISTRIBUTION_2026_001",
          "foray_core": {
            "accrual_refs": ["ACC_BATCH_VALUATION_001"],
            "arrangement_refs": ["ARR_BATCH_DEFINITION_2026_001"],
            "type": "scheduled_distribution",
            "description": "Expected export distribution to international partners",
            "expected_amount": 185000.00,
            "currency": "NZD",
            "expected_date": "2026-02-15",
            "probability_factor": 0.95,
            "distribution_plan": { "export_markets": ["China", "UK", "USA", "Japan"] },
            "dependencies": ["ACC_BATCH_VALUATION_001"]
          }
        },
        {
          "id": "ANT_SHELF_LIFE_WINDOW_001",
          "foray_core": {
            "accrual_refs": ["ACC_LABORATORY_ANALYSIS_001"],
            "arrangement_refs": ["ARR_BATCH_DEFINITION_2026_001"],
            "type": "quality_validity_window",
            "description": "Expected shelf life based on analysis results",
            "expected_amount": 0,
            "currency": "NZD",
            "expected_date": "2031-01-15",
            "probability_factor": 0.95,
            "quality_parameters": { "best_before_date": "2031-01-15", "optimal_storage_temp_c": "below 25", "note": "Honey does not spoil; UMF activity may decrease over time" },
            "dependencies": ["ACC_LABORATORY_ANALYSIS_001"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_JARRING_COMPLETE_001",
          "foray_core": {
            "anticipation_refs": ["ANT_EXPORT_DISTRIBUTION_2026_001"],
            "accrual_refs": ["ACC_LABORATORY_ANALYSIS_001", "ACC_BATCH_VALUATION_001"],
            "arrangement_refs": ["ARR_BATCH_DEFINITION_2026_001"],
            "type": "production_completion",
            "description": "Jarring completed for batch MH-2026-001",
            "amount_settled": 185000.00,
            "currency": "NZD",
            "settlement_date": "2026-01-15T09:00:00Z",
            "settlement_status": "completed",
            "payment_method": "other",
            "counterparty": "Internal",
            "production_details": { "jars_produced": 1000, "jars_passed_qc": 998, "jars_rejected": 2, "tamper_seal_applied": true, "umf_label_applied": true },
            "dependencies": ["ANT_EXPORT_DISTRIBUTION_2026_001"]
          }
        },
        {
          "id": "ACT_UMF_CERTIFICATION_ISSUED_001",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": ["ACC_LABORATORY_ANALYSIS_001"],
            "arrangement_refs": ["ARR_UMF_LICENSE_2026", "ARR_BATCH_DEFINITION_2026_001"],
            "type": "certification_issuance",
            "description": "UMF certificate issued for batch MH-2026-001",
            "amount_settled": 0,
            "currency": "NZD",
            "settlement_date": "2026-01-14T14:00:00Z",
            "settlement_status": "completed",
            "payment_method": "other",
            "counterparty": "UMF Honey Association",
            "certificate_details": { "certificate_number": "UMF-BATCH-2026-00847", "issued_by": "UMF Honey Association", "umf_grade_certified": "UMF 15+", "qr_verification_url": "https://umf.org.nz/verify/UMF-BATCH-2026-00847" },
            "dependencies": ["ACC_LABORATORY_ANALYSIS_001"]
          }
        }
      ],
      "attestations": [
        {
          "id": "ATT_LAB_ANALYSIS_001",
          "foray_core": {
            "attestor": "Analytica Laboratories",
            "attestor_hash": "sha256:analytica_nz_2026...",
            "attestor_type": "laboratory",
            "attestor_credentials": ["IANZ_Accredited", "MPI_Recognized", "ISO_17025"],
            "subject_refs": ["ACC_LABORATORY_ANALYSIS_001"],
            "attestation_type": "analysis",
            "attestation_date": "2026-01-12T16:30:00Z",
            "validity_period": { "start": "2026-01-12", "end": "2027-01-12" },
            "outcome": "certified",
            "evidence_hash": "sha256:lab_report_mh2026001...",
            "evidence_location": "off-chain",
            "analysis_summary": { "mgo_result_mg_kg": 514, "leptosperin_result_mg_kg": 185, "dna_verified": true, "methodology": "UMF_Grading_Standard_v4" },
            "dependencies": []
          }
        },
        {
          "id": "ATT_UMF_CERTIFICATION_001",
          "foray_core": {
            "attestor": "UMF Honey Association",
            "attestor_hash": "sha256:umf_assoc_nz_2026...",
            "attestor_type": "certification_body",
            "attestor_credentials": ["NZ_Govt_Recognized", "Trademark_Owner_UMF", "MPI_Partner"],
            "subject_refs": ["ARR_UMF_LICENSE_2026", "ARR_BATCH_DEFINITION_2026_001", "ATT_LAB_ANALYSIS_001"],
            "attestation_type": "certification",
            "attestation_date": "2026-01-14T14:00:00Z",
            "validity_period": { "start": "2026-01-14", "end": "2026-12-31" },
            "outcome": "certified",
            "evidence_hash": "sha256:umf_certificate_mh2026001...",
            "evidence_location": "off-chain",
            "certificate_details": { "certificate_number": "UMF-BATCH-2026-00847", "umf_grade": "UMF 15+", "qr_verification_url": "https://umf.org.nz/verify/UMF-BATCH-2026-00847" },
            "dependencies": ["ATT_LAB_ANALYSIS_001"]
          }
        },
        {
          "id": "ATT_MPI_EXPORT_001",
          "foray_core": {
            "attestor": "Ministry for Primary Industries",
            "attestor_hash": "sha256:mpi_nz_govt_2026...",
            "attestor_type": "regulator",
            "attestor_credentials": ["NZ_Government_Authority", "Food_Safety_Regulator", "Export_Certification_Authority"],
            "subject_refs": ["ARR_BATCH_DEFINITION_2026_001", "ATT_UMF_CERTIFICATION_001"],
            "attestation_type": "approval",
            "attestation_date": "2026-01-15T08:00:00Z",
            "validity_period": { "start": "2026-01-15", "end": "2026-07-15" },
            "outcome": "approved",
            "evidence_hash": "sha256:mpi_export_cert_mh2026001...",
            "evidence_location": "off-chain",
            "export_details": { "export_certificate_number": "MPI-EXP-2026-NZ-00847", "approved_markets": ["China", "UK", "USA", "Japan"], "health_certificate_included": true },
            "dependencies": ["ATT_UMF_CERTIFICATION_001"]
          }
        }
      ],
      "merkle_root": "sha256:manuka_batch_001_merkle_root...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:manuka_audit_data...", "audit_profile": "standard", "storage_locations": ["s3://foray-audit/2026/Q1/PROV_2026_Q1_MANUKA_HONEY_BATCH_001"] },
      "privacy_metadata": { "formulas_obfuscated": 2, "instance_pools": 3, "attack_complexity": "2^96 operations" }
    }
  },

  luxuryWatchAuth: {
    name: "Luxury Watch Authentication",
    description: "Product authentication with inspection results",
    data: {
      "transaction_id": "PROV_2026_Q1_WATCH_AUTH_001",
      "schema_version": "4.1",
      "timestamp": "2026-01-20T11:30:00Z",
      "foray_core": {
        "entity": "Authorized Watch Dealer AG",
        "entity_hash": "sha256:awd_2026_xyz789...",
        "transaction_type": "product_authentication",
        "total_value": 29500.00,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": ["Swiss_Made", "COSC_Certified", "Brand_Authorized"]
      },
      "component_hashes": {
        "arrangements": "sha256:arr_watch_a1b2c3...",
        "accruals": "sha256:acc_watch_d4e5f6...",
        "anticipations": "sha256:ant_watch_g7h8i9...",
        "actions": "sha256:act_watch_j0k1l2..."
      },
      "arrangements": [
        {
          "id": "ARR_MANUFACTURER_CERT_001",
          "foray_core": {
            "type": "product_certification",
            "effective_date": "2025-09-15T00:00:00Z",
            "parties": [
              { "role": "manufacturer", "name": "Rolex SA", "jurisdiction": "CH" },
              { "role": "certifier", "name": "COSC", "jurisdiction": "CH" }
            ],
            "description": "Manufacturer certification for Cosmograph Daytona Ref. 126500LN",
            "total_value": 29500.00,
            "currency": "USD",
            "terms": { "model": "Cosmograph Daytona", "reference": "126500LN", "movement_caliber": "4131", "case_material": "Oystersteel" },
            "dependencies": []
          }
        },
        {
          "id": "ARR_DEALER_AUTHORIZATION_001",
          "foray_core": {
            "type": "distribution_agreement",
            "effective_date": "2024-01-01T00:00:00Z",
            "parties": [
              { "role": "brand", "name": "Rolex SA", "jurisdiction": "CH" },
              { "role": "dealer", "name": "Authorized Watch Dealer AG", "jurisdiction": "CH" }
            ],
            "description": "Authorized dealer agreement for Rolex distribution",
            "total_value": 0,
            "currency": "USD",
            "terms": { "agreement_type": "authorized_retailer", "territory": "Switzerland", "valid_until": "2026-12-31" },
            "dependencies": []
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_AUTHENTICATION_INSPECTION_001",
          "foray_core": {
            "arrangement_refs": ["ARR_MANUFACTURER_CERT_001"],
            "type": "product_inspection",
            "description": "Physical authentication inspection results",
            "computation_method": "Valuation",
            "formula_id": "sha256:auth_inspection_protocol_v2...",
            "inputs": { "inspection_date": "2026-01-20", "inspector_id": "INSP-2026-0042" },
            "output": 29500.00,
            "currency": "USD",
            "inspection_results": { "case_authentic": true, "movement_authentic": true, "dial_authentic": true, "overall_status": "AUTHENTIC", "confidence_score": 0.99 },
            "dependencies": ["ARR_MANUFACTURER_CERT_001"]
          }
        },
        {
          "id": "ACC_RETAIL_VALUATION_001",
          "foray_core": {
            "arrangement_refs": ["ARR_MANUFACTURER_CERT_001", "ARR_DEALER_AUTHORIZATION_001"],
            "type": "retail_valuation",
            "description": "Current retail valuation",
            "computation_method": "Valuation",
            "formula_id": "sha256:msrp_lookup...",
            "inputs": { "reference": "126500LN", "condition": "new_with_tags", "market": "US" },
            "output": 29500.00,
            "currency": "USD",
            "dependencies": ["ARR_MANUFACTURER_CERT_001"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_WARRANTY_PERIOD_001",
          "foray_core": {
            "accrual_refs": ["ACC_AUTHENTICATION_INSPECTION_001"],
            "arrangement_refs": ["ARR_MANUFACTURER_CERT_001"],
            "type": "warranty_coverage",
            "description": "Expected warranty coverage period",
            "expected_amount": 0,
            "currency": "USD",
            "expected_date": "2031-01-20",
            "probability_factor": 0.95,
            "warranty_terms": { "warranty_years": 5, "coverage_type": "international", "transferable": true },
            "dependencies": ["ACC_AUTHENTICATION_INSPECTION_001"]
          }
        },
        {
          "id": "ANT_SALE_COMPLETION_001",
          "foray_core": {
            "accrual_refs": ["ACC_RETAIL_VALUATION_001"],
            "arrangement_refs": ["ARR_DEALER_AUTHORIZATION_001"],
            "type": "scheduled_sale",
            "description": "Expected sale to customer",
            "expected_amount": 29500.00,
            "currency": "USD",
            "expected_date": "2026-01-20",
            "probability_factor": 1.0,
            "dependencies": ["ACC_RETAIL_VALUATION_001"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_AUTHENTICATION_RECORDED_001",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": ["ACC_AUTHENTICATION_INSPECTION_001"],
            "arrangement_refs": ["ARR_MANUFACTURER_CERT_001"],
            "type": "authentication_record",
            "description": "Authentication record anchored to blockchain",
            "amount_settled": 0,
            "currency": "USD",
            "settlement_date": "2026-01-20T11:00:00Z",
            "settlement_status": "completed",
            "payment_method": "other",
            "counterparty": "Internal",
            "dependencies": ["ACC_AUTHENTICATION_INSPECTION_001"]
          }
        },
        {
          "id": "ACT_SALE_COMPLETED_001",
          "foray_core": {
            "anticipation_refs": ["ANT_SALE_COMPLETION_001"],
            "accrual_refs": ["ACC_RETAIL_VALUATION_001"],
            "arrangement_refs": ["ARR_DEALER_AUTHORIZATION_001", "ARR_MANUFACTURER_CERT_001"],
            "type": "retail_sale",
            "description": "Sale completed to customer",
            "amount_settled": 29500.00,
            "currency": "USD",
            "settlement_date": "2026-01-20T11:30:00Z",
            "settlement_status": "completed",
            "payment_method": "wire",
            "counterparty": "Customer (hash protected)",
            "allocations": [
              { "ref": "ANT_SALE_COMPLETION_001", "ref_type": "anticipation", "amount": 29500.00, "currency": "USD", "allocation_type": "full" }
            ],
            "dependencies": ["ANT_SALE_COMPLETION_001"]
          }
        }
      ],
      "merkle_root": "sha256:watch_auth_001_merkle_root...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:watch_audit_data...", "audit_profile": "standard", "storage_locations": ["s3://foray-audit/2026/Q1/PROV_2026_Q1_WATCH_AUTH_001"] },
      "privacy_metadata": { "formulas_obfuscated": 3, "instance_pools": 2, "attack_complexity": "2^96 operations" }
    }
  },

  supplyChainTemplate: {
    name: "Supply Chain Template",
    description: "Minimal template for product provenance transactions",
    data: {
      "transaction_id": "PROV_YYYY_QN_PRODUCT_BATCH_NNN",
      "schema_version": "4.1",
      "timestamp": "2026-01-01T00:00:00Z",
      "foray_core": {
        "entity": "Producer Name",
        "entity_hash": "sha256:entity_hash...",
        "transaction_type": "product_provenance",
        "total_value": 0.00,
        "currency": "USD",
        "status": "completed",
        "compliance_flags": []
      },
      "component_hashes": { "arrangements": "sha256:...", "accruals": "sha256:...", "anticipations": "sha256:...", "actions": "sha256:..." },
      "arrangements": [
        {
          "id": "ARR_ORIGIN_CERTIFICATION",
          "foray_core": {
            "type": "origin_certification",
            "effective_date": "2026-01-01T00:00:00Z",
            "parties": [
              { "role": "producer", "name": "Producer Name", "jurisdiction": "XX" },
              { "role": "certifier", "name": "Certification Body", "jurisdiction": "XX" }
            ],
            "description": "Product origin certification",
            "total_value": 0.00,
            "currency": "USD",
            "terms": {},
            "dependencies": []
          }
        },
        {
          "id": "ARR_BATCH_DEFINITION",
          "foray_core": {
            "type": "production_batch",
            "effective_date": "2026-01-01T00:00:00Z",
            "parties": [
              { "role": "producer", "name": "Producer Name", "jurisdiction": "XX" }
            ],
            "description": "Production batch definition",
            "total_value": 0.00,
            "currency": "USD",
            "terms": { "batch_id": "LOT-YYYY-NNN", "quantity": 0, "unit": "units" },
            "dependencies": ["ARR_ORIGIN_CERTIFICATION"]
          }
        }
      ],
      "accruals": [
        {
          "id": "ACC_PRODUCT_ANALYSIS",
          "foray_core": {
            "arrangement_refs": ["ARR_BATCH_DEFINITION"],
            "type": "product_analysis",
            "description": "Product quality analysis results",
            "computation_method": "Valuation",
            "formula_id": "sha256:analysis_protocol...",
            "inputs": { "sample_id": "SAMPLE-NNN", "analysis_date": "2026-01-01" },
            "output": 0.00,
            "currency": "USD",
            "dependencies": ["ARR_BATCH_DEFINITION"]
          }
        }
      ],
      "anticipations": [
        {
          "id": "ANT_DISTRIBUTION_SCHEDULE",
          "foray_core": {
            "accrual_refs": ["ACC_PRODUCT_ANALYSIS"],
            "arrangement_refs": ["ARR_BATCH_DEFINITION"],
            "type": "scheduled_distribution",
            "description": "Expected distribution schedule",
            "expected_amount": 0.00,
            "currency": "USD",
            "expected_date": "2026-02-01",
            "probability_factor": 0.95,
            "dependencies": ["ACC_PRODUCT_ANALYSIS"]
          }
        }
      ],
      "actions": [
        {
          "id": "ACT_VERIFICATION_RECORDED",
          "foray_core": {
            "anticipation_refs": [],
            "accrual_refs": ["ACC_PRODUCT_ANALYSIS"],
            "arrangement_refs": ["ARR_BATCH_DEFINITION"],
            "type": "verification_record",
            "description": "Verification record anchored to blockchain",
            "amount_settled": 0.00,
            "currency": "USD",
            "settlement_date": "2026-01-01T00:00:00Z",
            "settlement_status": "completed",
            "payment_method": "other",
            "counterparty": "Internal",
            "dependencies": ["ACC_PRODUCT_ANALYSIS"]
          }
        }
      ],
      "merkle_root": "sha256:...",
      "blockchain_anchor": { "kaspa_tx_id": null, "block_height": null, "confirmation_time_ms": null, "anchored_at": null },
      "audit_data_anchor": { "audit_data_hash": "sha256:...", "audit_profile": "standard", "storage_locations": [] },
      "privacy_metadata": { "formulas_obfuscated": 0, "instance_pools": 0, "attack_complexity": "2^96 operations" }
    }
  }
};
