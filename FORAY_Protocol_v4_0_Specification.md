# FORAY Protocol Specification v4.0

## Document Control

| Property | Value |
|----------|-------|
| **Version** | 4.0 |
| **Status** | DRAFT - Under Review |
| **Previous Version** | 3.0 (FORAY_SKILL_v3.md) |
| **Created** | January 24, 2026 |
| **Author** | FORAY Protocol Team |
| **Classification** | Technical Specification |

---

## Version History

| Version | Date | Summary | Breaking Changes |
|---------|------|---------|------------------|
| **1.0** | Jan 2026 | Initial protocol with 4-component model | N/A |
| **2.0** | Jan 2026 | Added privacy layers, ERP adapters | No |
| **3.0** | Jan 2026 | Compressed keys, tier-based storage, encrypted envelope | Yes - key mapping |
| **4.0** | Jan 2026 | **foray_core/audit_data separation, 3-layer architecture, sealed archive** | **Yes - structural** |

---

## How to Use This Document

### For Implementers
- Section 2 defines the core protocol (required)
- Section 3 defines the audit extension (optional based on profile)
- Section 4 defines the storage architecture (implementation guidance)

### For Reviewers Comparing to v3.0
- All v3.0 content is preserved in `foray_core`
- New content is in `audit_data` sections
- Breaking changes are marked with [!]

### To Revert to v3.0
- Ignore `audit_data` sections entirely
- Use `foray_core` structure as the complete transaction
- Layer 2 and Layer 3 storage optional

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Protocol (foray_core)](#2-core-protocol-foray_core)
3. [Audit Data Extension (audit_data)](#3-audit-data-extension-audit_data)
4. [Three-Layer Storage Architecture](#4-three-layer-storage-architecture)
5. [Sealed Archive Specification](#5-sealed-archive-specification)
6. [Processing Pipeline](#6-processing-pipeline)
7. [Verification Protocols](#7-verification-protocols)
8. [Migration Guide (v3.0 -> v4.0)](#8-migration-guide-v30--v40)
9. [Appendices](#9-appendices)

---

# 1. Executive Summary

## 1.1 What Changed in v4.0

| Aspect | v3.0 | v4.0 |
|--------|------|------|
| **Structure** | Flat components | `foray_core` + `audit_data` separation |
| **Storage** | On-chain only | Three-layer (on-chain, NoSQL, sealed archive) |
| **Audit Completeness** | ~60% | ~85% (with audit_data) |
| **On-Chain Payload** | ~500 bytes - 15KB | ~500 bytes (hashes only) |
| **Enterprise Compliance** | Basic | Full (SOX, DCAA, Big 4) |
| **Archive** | None | Sealed, encrypted, multi-party access |

## 1.2 Design Principles (Unchanged from v3.0)

1. **Source System Trust** -- FORAY trusts validated ERP data
2. **4-Component Model** -- Arrangements -> Accruals -> Anticipations -> Actions
3. **Immutable Anchoring** -- Blockchain provides tamper-proof timestamps
4. **Privacy Preservation** -- Hash-based verification without data exposure

## 1.3 New Design Principles (v4.0)

5. **Separation of Concerns** -- Core protocol separate from audit metadata
6. **Layered Storage** -- Right data in right place at right cost
7. **Sealed Archive** -- Complete record preserved with forensic-grade controls
8. **Async Sealing** -- User-facing latency independent of archive operations

---

# 2. Core Protocol (foray_core)

> [i] **Compatibility Note:** This section contains all v3.0 functionality. Systems implementing only this section are fully v3.0 compatible.

## 2.1 Transaction Structure

### 2.1.1 Top-Level Schema

```json
{
  "transaction_id": "DOMAIN_YYYY_QN_DESCRIPTOR",
  "schema_version": "4.0",
  "timestamp": "ISO-8601",
  
  "foray_core": {
    "entity": "entity_name",
    "entity_hash": "sha256:...",
    "transaction_type": "type_code",
    "total_value": 0.00,
    "currency": "USD",
    "status": "active|completed|reversed",
    "compliance_flags": ["SOX_404", "DCAA", "..."]
  },
  
  "component_hashes": {
    "arrangements": "sha256:...",
    "accruals": "sha256:...",
    "anticipations": "sha256:...",
    "actions": "sha256:..."
  },
  
  "arrangements": [...],
  "accruals": [...],
  "anticipations": [...],
  "actions": [...],
  
  "merkle_root": "sha256:...",
  
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 0,
    "confirmation_time_ms": 0,
    "anchored_at": "ISO-8601"
  },
  
  "audit_data_anchor": {
    "audit_data_hash": "sha256:...",
    "audit_profile": "standard|dcaa_full|big4|minimal",
    "storage_locations": [...]
  },
  
  "privacy_metadata": {...}
}
```

### 2.1.2 Field Definitions (Top-Level)

| Field | Type | Required | Description | v3.0 Equivalent |
|-------|------|:--------:|-------------|-----------------|
| `transaction_id` | string | [OK] | Unique identifier | Same |
| `schema_version` | string | [OK] | Protocol version | `_v` |
| `timestamp` | ISO-8601 | [OK] | Creation timestamp | Same |
| `foray_core` | object | [OK] | Core transaction data | **NEW** (was flat) |
| `component_hashes` | object | [OK] | Hash of each component | **NEW** |
| `arrangements` | array | [OK] | Arrangement components | Same |
| `accruals` | array | [ ] | Accrual components | Same |
| `anticipations` | array | [ ] | Anticipation components | Same |
| `actions` | array | [ ] | Action components | Same |
| `merkle_root` | string | [OK] | Root hash of all components | `_mr` |
| `blockchain_anchor` | object | [OK] | On-chain anchoring details | **NEW** (was `kaspa_commitment`) |
| `audit_data_anchor` | object | [ ] | Reference to audit_data | **NEW** |
| `privacy_metadata` | object | [ ] | Privacy settings | Same |

## 2.2 Component Structures

### 2.2.1 Arrangements

```json
{
  "id": "ARR_DESCRIPTIVE_ID",
  
  "foray_core": {
    "type": "arrangement_type",
    "effective_date": "ISO-8601",
    "parties": [
      {
        "role": "party_role",
        "name": "Party Name",
        "party_id_hash": "sha256:...",
        "jurisdiction": "US"
      }
    ],
    "description": "Arrangement description",
    "total_value": 0.00,
    "currency": "USD",
    "terms": {
      "...arrangement_specific_terms..."
    },
    "legal_documentation": ["Doc1", "Doc2"],
    "dependencies": []
  },
  
  "audit_data": {
    "...see Section 3..."
  }
}
```

### 2.2.2 Accruals

```json
{
  "id": "ACC_DESCRIPTIVE_ID",
  
  "foray_core": {
    "arrangement_ref": "ARR_DESCRIPTIVE_ID",
    "type": "accrual_type",
    "description": "Accrual description",
    "computation_method": "Calculated|Valuation|FixedAmount|Estimated",
    "formula_id": "sha256:formula_hash",
    "inputs": {
      "input_name": "value"
    },
    "output": 0.00,
    "currency": "USD",
    "accounting_entry": {
      "debit": {"account": "account_code", "amount": 0.00},
      "credit": {"account": "account_code", "amount": 0.00}
    },
    "fiscal_period": {
      "year": 2026,
      "quarter": 1,
      "month": 1,
      "start": "ISO-8601",
      "end": "ISO-8601"
    },
    "dependencies": ["ARR_..."]
  },
  
  "audit_data": {
    "...see Section 3..."
  }
}
```

### 2.2.3 Anticipations

```json
{
  "id": "ANT_DESCRIPTIVE_ID",
  
  "foray_core": {
    "accrual_ref": "ACC_DESCRIPTIVE_ID",
    "type": "anticipation_type",
    "description": "Anticipation description",
    "expected_amount": 0.00,
    "currency": "USD",
    "expected_date": "ISO-8601",
    "condition": "condition_hash_or_null",
    "probability_factor": 0.95,
    "assumptions": {
      "...anticipation_specific_assumptions..."
    },
    "dependencies": ["ACC_..."]
  },
  
  "audit_data": {
    "...see Section 3..."
  }
}
```

### 2.2.4 Actions

```json
{
  "id": "ACT_DESCRIPTIVE_ID",
  
  "foray_core": {
    "anticipation_ref": "ANT_DESCRIPTIVE_ID",
    "type": "action_type",
    "description": "Action description",
    "amount_settled": 0.00,
    "currency": "USD",
    "settlement_date": "ISO-8601",
    "settlement_status": "completed|pending|failed|reversed",
    "payment_method": "wire|ach|check|crypto|other",
    "counterparty": "Counterparty Name",
    "variance": {
      "expected": 0.00,
      "actual": 0.00,
      "difference": 0.00,
      "explanation": "variance explanation or null"
    },
    "dependencies": ["ANT_..."]
  },
  
  "audit_data": {
    "...see Section 3..."
  }
}
```

## 2.3 Privacy Metadata (Unchanged from v3.0)

```json
{
  "privacy_metadata": {
    "formulas_obfuscated": 3,
    "instance_pools_used": 2,
    "attack_complexity": "2^96 operations",
    "obfuscated_formulas": [
      {
        "formula_id": "sha256:...",
        "purpose": "description",
        "obfuscation_method": "instance_pool|chaff|polymorphism"
      }
    ]
  }
}
```

## 2.4 Compressed Key Mapping (v3.0 Compatible)

For on-chain payload optimization, the following key mapping is supported:

| Full Key | Short Key | Bytes Saved |
|----------|-----------|-------------|
| `transaction_id` | `t` | 12 |
| `timestamp` | `ts` | 7 |
| `entity` | `e` | 5 |
| `foray_core` | `fc` | 8 |
| `arrangements` | `a` | 10 |
| `accruals` | `ac` | 6 |
| `anticipations` | `an` | 11 |
| `actions` | `ax` | 5 |
| `audit_data` | `ad` | 8 |
| `merkle_root` | `mr` | 10 |

[!] **v4.0 Addition:** When `audit_data` is present, only `audit_data_hash` goes on-chain, not the full `audit_data` object.

---

# 3. Audit Data Extension (audit_data)

> [i] **New in v4.0:** This entire section is new. For v3.0 compatibility, this section can be omitted entirely.

## 3.1 Design Philosophy

The `audit_data` section contains fields required for enterprise audit compliance that are not essential to FORAY's core anchoring mission:

- **Source traceability** -- ERP document numbers, modules, line items
- **Authorization chain** -- Who created, approved, posted
- **GL detail** -- Account codes, names, types, chart of accounts
- **Organizational assignment** -- Cost centers, profit centers, projects
- **Tax detail** -- Tax codes, jurisdictions, withholding
- **Posting control** -- Status, reversal flags, clearing documents
- **Compliance metadata** -- SOX control points, DCAA contract details
- **Forensic chain** -- Extraction certification, custody chain

## 3.2 Audit Profiles

Different use cases require different audit completeness levels:

| Profile | Field Count | Use Case | On-Chain Impact |
|---------|:-----------:|----------|-----------------|
| `minimal` | ~20 | Internal tracking | Hash only |
| `standard` | ~80 | Standard audit | Hash only |
| `big4` | ~150 | Financial statement audit | Hash only |
| `dcaa_full` | ~250 | Defense contract audit | Hash only |
| `forensic` | ~350 | Litigation/investigation | Hash only |

**Key Point:** Regardless of profile, only the `audit_data_hash` is stored on-chain.

## 3.3 Arrangement audit_data

```json
{
  "audit_data": {
    "source": {
      "erp_system": "SAP|Oracle|QuickBooks|Salesforce|Dynamics|NetSuite",
      "erp_version": "version_string",
      "company_code": "company_code",
      "document_number": "source_document_number",
      "document_type": "document_type_code",
      "fiscal_year": 2026,
      "source_module": "FI-AR|FI-AP|SD|MM|..."
    },
    
    "master_data": {
      "customer_id": "customer_master_id",
      "vendor_id": "vendor_master_id",
      "bp_code": "business_partner_code",
      "credit_terms_code": "payment_terms_code"
    },
    
    "org_assignment": {
      "cost_center": "cost_center_code",
      "profit_center": "profit_center_code",
      "business_unit": "business_unit_code",
      "project_wbs": "wbs_element_or_null"
    },
    
    "intercompany": {
      "is_intercompany": false,
      "partner_company_code": "partner_code_or_null"
    },
    
    "authorization": {
      "created_by": "user_id",
      "created_at": "ISO-8601",
      "approved_by": "user_id_or_null",
      "approved_at": "ISO-8601_or_null",
      "workflow_id": "workflow_instance_id"
    },
    
    "dates": {
      "document_date": "YYYY-MM-DD",
      "posting_date": "YYYY-MM-DD",
      "entry_date": "YYYY-MM-DD",
      "value_date": "YYYY-MM-DD"
    },
    
    "compliance": {
      "sox_control_point": "control_id_or_null",
      "dcaa_contract_number": "contract_number_or_null",
      "asc_606_contract_id": "contract_id_or_null",
      "pii_indicator": false,
      "data_classification": "public|internal|confidential|restricted"
    },
    
    "amendment": {
      "is_amendment": false,
      "amends_id": "original_arrangement_id_or_null",
      "version": 1
    }
  }
}
```

## 3.4 Accrual audit_data

```json
{
  "audit_data": {
    "source": {
      "erp_system": "SAP",
      "document_number": "document_number",
      "document_type": "document_type",
      "line_item": 1,
      "fiscal_year": 2026,
      "fiscal_period": "01",
      "source_module": "FI-GL"
    },
    
    "gl_detail": {
      "debit_account_code": "account_number",
      "debit_account_name": "account_name",
      "debit_account_type": "asset|liability|equity|revenue|expense",
      "credit_account_code": "account_number",
      "credit_account_name": "account_name",
      "credit_account_type": "asset|liability|equity|revenue|expense",
      "chart_of_accounts": "chart_id"
    },
    
    "fx_conversion": {
      "local_currency": "USD",
      "local_amount": 0.00,
      "group_currency": "USD",
      "group_amount": 0.00,
      "exchange_rate": 1.0000,
      "rate_date": "YYYY-MM-DD",
      "rate_source": "ECB|FED|Bloomberg|..."
    },
    
    "org_assignment": {
      "cost_center": "cost_center_code",
      "profit_center": "profit_center_code",
      "functional_area": "functional_area_code",
      "internal_order": "order_number_or_null",
      "project_wbs": "wbs_element_or_null"
    },
    
    "tax": {
      "tax_code": "tax_code_or_null",
      "tax_jurisdiction": "jurisdiction_or_null",
      "tax_rate": null,
      "tax_amount": null,
      "withholding_tax_code": "code_or_null",
      "withholding_amount": null
    },
    
    "posting": {
      "status": "posted|parked|held|reversed",
      "posting_date": "YYYY-MM-DD",
      "posting_user": "user_id",
      "reversal_indicator": false,
      "reversed_by": "document_number_or_null",
      "clearing_document": "document_number_or_null"
    },
    
    "line_item": {
      "sequence": 1,
      "total_lines": 2,
      "quantity": null,
      "uom": null,
      "unit_price": null,
      "material_number": "material_or_null",
      "plant": "plant_code_or_null"
    },
    
    "authorization": {
      "entered_by": "user_id",
      "entered_at": "ISO-8601",
      "posted_by": "user_id",
      "posted_at": "ISO-8601",
      "approved_by": "user_id_or_null"
    },
    
    "variance": {
      "budget_amount": null,
      "variance_amount": null,
      "variance_pct": null,
      "variance_explanation": null,
      "prior_period_amount": null
    },
    
    "audit_trail": {
      "change_document": "change_doc_number_or_null",
      "audit_log_seq": null
    }
  }
}
```

## 3.5 Anticipation audit_data

```json
{
  "audit_data": {
    "source": {
      "erp_system": "SAP",
      "payment_schedule_id": "schedule_id",
      "forecast_version": "forecast_version_id",
      "source_module": "FI-AR"
    },
    
    "payment_terms": {
      "terms_code": "NET30",
      "due_date_calc": "formula_description",
      "discount_terms": "discount_terms_or_null",
      "discount_pct": null,
      "discount_days": null,
      "net_due_date": "YYYY-MM-DD"
    },
    
    "bank": {
      "payment_method": "WIRE|ACH|CHECK",
      "house_bank": "bank_id",
      "house_bank_account": "account_id",
      "partner_bank_type": "checking|savings",
      "iban": "iban_or_null",
      "swift_bic": "swift_or_null"
    },
    
    "dunning": {
      "dunning_area": "dunning_area_code",
      "dunning_level": 0,
      "last_dunned": "YYYY-MM-DD_or_null",
      "dunning_block": false,
      "payment_block": false
    },
    
    "cash_flow": {
      "category": "operating|investing|financing",
      "subcategory": "subcategory_code",
      "forecast_item": "forecast_line_item",
      "treasury_deal_ref": "deal_ref_or_null"
    },
    
    "aging": {
      "invoice_date": "YYYY-MM-DD",
      "due_date": "YYYY-MM-DD",
      "days_outstanding": 0,
      "aging_bucket": "current|1-30|31-60|61-90|90+",
      "credit_risk": "low|medium|high"
    },
    
    "collection": {
      "status": "not_due|current|delinquent|default",
      "agent": "collector_id_or_null",
      "promise_to_pay": "YYYY-MM-DD_or_null",
      "dispute_flag": false,
      "dispute_reason": null,
      "dispute_amount": null
    },
    
    "rev_rec": {
      "asc_606_po_id": "performance_obligation_id_or_null",
      "rev_rec_date": "YYYY-MM-DD_or_null",
      "deferred_rev_account": "account_or_null",
      "contract_asset_account": "account_or_null",
      "ssp": null,
      "variable_consideration": null
    },
    
    "forecast_meta": {
      "generated_date": "YYYY-MM-DD",
      "generated_by": "system_or_user_id",
      "confidence_low": null,
      "confidence_high": null,
      "model": "forecast_model_type"
    }
  }
}
```

## 3.6 Action audit_data

```json
{
  "audit_data": {
    "source": {
      "erp_system": "SAP",
      "document_number": "document_number",
      "document_type": "document_type",
      "clearing_document": "clearing_doc_or_null",
      "fiscal_year": 2026,
      "fiscal_period": "04",
      "source_module": "FI-AR"
    },
    
    "settlement": {
      "gross_amount": 0.00,
      "discount_taken": 0.00,
      "withholding_tax": 0.00,
      "bank_charges": 0.00,
      "fx_gain_loss": 0.00,
      "net_received": 0.00,
      "write_off": 0.00
    },
    
    "bank_recon": {
      "bank_account_id": "bank_account_id",
      "statement_date": "YYYY-MM-DD",
      "statement_number": "statement_number",
      "statement_line": 0,
      "bank_reference": "bank_ref_number",
      "value_date": "YYYY-MM-DD",
      "recon_status": "unreconciled|reconciled|exception",
      "recon_date": "YYYY-MM-DD_or_null",
      "recon_user": "user_id_or_null"
    },
    
    "payment_instrument": {
      "method_code": "WIRE|ACH|CHECK",
      "check_number": "check_number_or_null",
      "ach_trace": "ach_trace_or_null",
      "wire_reference": "wire_ref_or_null",
      "cc_last_four": "last_four_or_null",
      "auth_code": "auth_code_or_null",
      "batch_id": "batch_id_or_null"
    },
    
    "remittance": {
      "document_count": 1,
      "references": ["INV-001", "INV-002"],
      "partial_payment": false,
      "overpayment": false,
      "on_account": 0.00
    },
    
    "variance_detail": {
      "expected": 0.00,
      "actual": 0.00,
      "variance_amt": 0.00,
      "variance_pct": 0.00,
      "reason_code": "reason_or_null",
      "explanation": "explanation_or_null",
      "approved_by": "user_id_or_null",
      "within_tolerance": true,
      "tolerance_pct": 1.00
    },
    
    "posting": {
      "status": "posted|parked|reversed",
      "posting_date": "YYYY-MM-DD",
      "document_date": "YYYY-MM-DD",
      "entry_date": "YYYY-MM-DD",
      "posting_user": "user_id",
      "reversal_indicator": false,
      "reversal_document": "doc_or_null"
    },
    
    "authorization": {
      "entered_by": "user_id",
      "entered_at": "ISO-8601",
      "approved_by": "user_id_or_null",
      "approved_at": "ISO-8601_or_null",
      "posted_by": "user_id",
      "posted_at": "ISO-8601",
      "four_eyes_applied": true
    },
    
    "correction": {
      "is_correction": false,
      "corrects_id": "original_action_id_or_null",
      "correction_reason": "reason_or_null",
      "superseded_by": "new_action_id_or_null"
    },
    
    "regulatory": {
      "form_1099_reportable": false,
      "form_1099_amount": null,
      "fatca_reportable": false,
      "sanctions_status": "not_checked|cleared|flagged",
      "sanctions_date": "YYYY-MM-DD_or_null",
      "aml_flag": false,
      "ctr_required": false
    },
    
    "evidence": {
      "supporting_docs": ["doc_id_1", "doc_id_2"],
      "bank_confirm_received": false,
      "customer_confirm_received": false,
      "three_way_match": "matched|exception|not_applicable",
      "three_way_match_date": "YYYY-MM-DD_or_null"
    }
  }
}
```

## 3.7 Transaction-Level audit_data

```json
{
  "transaction_audit_data": {
    "origin": {
      "source_erp": "SAP",
      "source_instance": "PRD-800",
      "source_client": "100",
      "extraction_timestamp": "ISO-8601",
      "extraction_method": "real_time_webhook|batch|manual",
      "adapter_version": "2.0.1"
    },
    
    "quality": {
      "completeness_score": 0.98,
      "fields_populated": 45,
      "fields_available": 46,
      "missing_fields": ["field_name"],
      "validation_warnings": [],
      "validation_errors": []
    },
    
    "materiality": {
      "threshold": 50000.00,
      "is_material": true,
      "sampling_flag": "must_test|may_sample|immaterial"
    },
    
    "retention": {
      "policy": "7_years",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "legal_hold": false,
      "gdpr_basis": "contract_performance|legal_obligation|consent"
    }
  }
}
```

## 3.8 DCAA Extension (dcaa_full profile)

> [i] **When to Use:** Required for defense contracts subject to DCAA audit.

```json
{
  "audit_data": {
    "dcaa": {
      "contract": {
        "contract_number": "FA8101-26-C-0001",
        "delivery_order": "DO-0005",
        "clin": "0001",
        "slin": "AA",
        "acrn": "AA",
        "contract_type": "CPFF|FFP|T&M|CPIF",
        "award_date": "YYYY-MM-DD",
        "pop_start": "YYYY-MM-DD",
        "pop_end": "YYYY-MM-DD",
        "contracting_officer": "name",
        "dcma_office": "office_name",
        "cage_code": "cage_code",
        "duns_number": "duns_number"
      },
      
      "cost_element": {
        "far_cost_element": "31.205-xx",
        "far_cost_element_name": "element_name",
        "cost_category": "direct_labor|direct_material|subcontract|odc|indirect",
        "cost_type": "direct|indirect",
        "indirect_pool": "pool_name_or_null",
        "allocation_base": "base_description_or_null",
        "b_and_p_flag": false,
        "ir_and_d_flag": false,
        "expressly_unallowable": false
      },
      
      "allowability": {
        "allowable_flag": true,
        "allowability_determination_date": "YYYY-MM-DD",
        "allowability_determined_by": "user_id",
        "far_citation": "31.205-xx(x)",
        "cas_citation": "CAS xxx",
        "questioned_cost_flag": false,
        "questioned_cost_amount": null
      },
      
      "labor": {
        "labor_category": "category_name",
        "labor_category_code": "code",
        "employee_id_hash": "sha256:...",
        "timecard_system": "system_name",
        "timecard_id": "timecard_ref",
        "hours_worked": 0.0,
        "hourly_rate": 0.00,
        "loaded_rate": 0.00,
        "fringe_rate": 0.00,
        "overhead_rate": 0.00,
        "g_and_a_rate": 0.00,
        "floor_check_eligible": true,
        "last_floor_check_date": "YYYY-MM-DD"
      },
      
      "evms": {
        "wbs_element": "wbs_code",
        "control_account": "ca_code",
        "bcws": 0.00,
        "bcwp": 0.00,
        "acwp": 0.00,
        "schedule_variance": 0.00,
        "cost_variance": 0.00,
        "spi": 0.00,
        "cpi": 0.00,
        "eac": 0.00
      }
    }
  }
}
```

---

# 4. Three-Layer Storage Architecture

> [i] **New in v4.0:** This entire section is new.

## 4.1 Architecture Overview

```
+-----------------------------------------------------------------+
|                    FORAY STORAGE LAYERS                          |
+-----------------------------------------------------------------+
|                                                                  |
|  LAYER 1: ON-CHAIN (Kaspa/Cardano)                              |
|  Purpose: Verification, tamper-proof timestamps                  |
|  Content: foray_core hashes, audit_data_hash, sealing pointer   |
|  Size: ~500 bytes per transaction                               |
|  Access: Public, continuous                                      |
|                                                                  |
|  LAYER 2: OFF-CHAIN NoSQL (MongoDB + DocumentDB)                |
|  Purpose: Operational queries, day-to-day audit                 |
|  Content: Full foray_core + full audit_data                     |
|  Size: ~15-20 KB per transaction                                |
|  Access: Authorized users, standard authentication              |
|                                                                  |
|  LAYER 3: SEALED ARCHIVE (Arweave + Glacier)                    |
|  Purpose: Litigation, regulatory, dispute resolution            |
|  Content: Complete encrypted record                              |
|  Size: ~5 KB compressed/encrypted per transaction               |
|  Access: Multi-party ceremony, rare                             |
|                                                                  |
------------------------------------------------------------------+
```

## 4.2 Layer 1: On-Chain Structure

```json
{
  "transaction_id": "LOAN_2026_Q1_ACME_TERM",
  "schema_version": "4.0",
  "timestamp": "2026-01-15T09:00:00Z",
  
  "foray_core_hash": "sha256:core_hash...",
  "audit_data_hash": "sha256:audit_hash...",
  "combined_merkle_root": "sha256:merkle...",
  
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 2847500
  },
  
  "sealing_pointer": {
    "status": "pending|sealed",
    "sealing_record_tx": "kaspa:qr_seal_or_null"
  }
}
```

**On-Chain Payload Target: <500 bytes**

## 4.3 Layer 2: NoSQL Structure

Dual-write to primary and secondary stores for redundancy.

**Primary Store:** MongoDB Atlas (or self-hosted)
**Secondary Store:** AWS DocumentDB (or Azure Cosmos DB)

```json
{
  "_id": "LOAN_2026_Q1_ACME_TERM",
  
  "on_chain_reference": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 2847500,
    "anchored_at": "ISO-8601"
  },
  
  "foray_core": { "...complete foray_core..." },
  "arrangements": [ "...with foray_core and audit_data..." ],
  "accruals": [ "...with foray_core and audit_data..." ],
  "anticipations": [ "...with foray_core and audit_data..." ],
  "actions": [ "...with foray_core and audit_data..." ],
  "transaction_audit_data": { "..." },
  "privacy_metadata": { "..." },
  
  "processing_status": {
    "layer1": { "status": "confirmed", "..." },
    "layer2": { "status": "confirmed", "..." },
    "layer3": { "status": "sealed|pending", "..." },
    "overall_status": "fully_sealed|pending_seal"
  },
  
  "hashes": {
    "foray_core_hash": "sha256:...",
    "audit_data_hash": "sha256:...",
    "combined_hash": "sha256:..."
  }
}
```

## 4.4 Layer 3: Sealed Archive Structure

See Section 5 for complete sealed archive specification.

---

# 5. Sealed Archive Specification

> [i] **New in v4.0:** This entire section is new.

## 5.1 Purpose

The sealed archive is a "break glass" repository containing complete, encrypted transaction records. It is:

- **Complete** -- Contains both foray_core AND full audit_data
- **Encrypted** -- AES-256-GCM with Shamir secret sharing
- **Immutable** -- Stored on permanent/locked storage
- **Difficult to Access** -- Multi-party ceremony required
- **Tamper-Evident** -- Access logged on-chain

## 5.2 Sealed Record Structure

```json
{
  "sealed_record": {
    "record_id": "SEAL-LOAN_2026_Q1_ACME_TERM-v1",
    "sealed_at": "ISO-8601",
    "seal_version": "1.0",
    
    "content_manifest": {
      "foray_core_included": true,
      "foray_core_hash": "sha256:...",
      "audit_data_included": true,
      "audit_data_hash": "sha256:...",
      "combined_hash": "sha256:...",
      "total_size_bytes": 0,
      "compression": "gzip",
      "compressed_size_bytes": 0
    },
    
    "encryption": {
      "algorithm": "AES-256-GCM",
      "key_derivation": "HKDF-SHA256",
      "key_custody": "shamir_secret_sharing",
      "threshold": 3,
      "total_shares": 5,
      "share_holders": [
        {"shard_id": 1, "role": "General Counsel", "holder_hash": "sha256:..."},
        {"shard_id": 2, "role": "Chief Audit Executive", "holder_hash": "sha256:..."},
        {"shard_id": 3, "role": "External Audit Partner", "holder_hash": "sha256:..."},
        {"shard_id": 4, "role": "Audit Committee Chair", "holder_hash": "sha256:..."},
        {"shard_id": 5, "role": "Independent Escrow Agent", "holder_hash": "sha256:..."}
      ]
    },
    
    "storage": {
      "primary": {
        "provider": "arweave",
        "tx_id": "ar://...",
        "permanent": true
      },
      "secondary": {
        "provider": "aws_glacier_deep_archive",
        "bucket": "bucket_name",
        "object_key": "object_path",
        "object_lock_until": "YYYY-MM-DD",
        "legal_hold": true
      }
    },
    
    "on_chain_anchor": {
      "kaspa_tx_id": "kaspa:qr...",
      "block_height": 0,
      "sealed_hash_committed": "sha256:..."
    },
    
    "access_log": {
      "access_count": 0,
      "last_access": null,
      "access_events": []
    }
  }
}
```

## 5.3 Sealing Pointer Record (On-Chain)

After sealing completes, a pointer record is anchored:

```json
{
  "record_type": "foray_sealing_pointer",
  "sealing_id": "SEAL-LOAN_2026_Q1_ACME_TERM-v1",
  
  "references": {
    "transaction_id": "LOAN_2026_Q1_ACME_TERM",
    "transaction_kaspa_tx": "kaspa:qr_original...",
    "transaction_block": 2847500,
    "audit_data_hash": "sha256:..."
  },
  
  "sealed_archives": {
    "arweave_tx": "ar://...",
    "glacier_object_hash": "sha256:...",
    "sealed_at": "ISO-8601"
  },
  
  "integrity": {
    "sealed_content_hash": "sha256:...",
    "hash_match_verified": true
  }
}
```

## 5.4 Access Ceremony Protocol

### Prerequisites

1. Written access request with legal justification
2. Board Audit Committee approval (resolution required)
3. 72-hour waiting period
4. Minimum 3 of 5 key holders available

### Ceremony Steps

1. Identity verification for all participants
2. Video recording initiated
3. Each key holder provides shard
4. Shamir reconstruction in secure enclave
5. Hash verification against on-chain anchor
6. Controlled data extraction (minimum necessary)
7. Re-sealing verification
8. Access event anchored on-chain

### Access Event Record

```json
{
  "access_event": {
    "event_id": "ACCESS-YYYY-MM-DD-NNNNN",
    "sealed_record_id": "SEAL-...",
    "access_timestamp": "ISO-8601",
    
    "authorization": {
      "request_id": "REQ-...",
      "legal_basis": "subpoena|regulatory_exam|litigation|investigation",
      "audit_committee_resolution": "RES-...",
      "waiting_period_completed": true
    },
    
    "ceremony": {
      "key_holders_present": [
        {"shard_id": 1, "present": true},
        {"shard_id": 2, "present": true},
        {"shard_id": 3, "present": false},
        {"shard_id": 4, "present": true},
        {"shard_id": 5, "present": false}
      ],
      "threshold_met": true,
      "video_recording_hash": "sha256:..."
    },
    
    "verification": {
      "sealed_hash_before": "sha256:...",
      "sealed_hash_after": "sha256:...",
      "hash_unchanged": true
    },
    
    "on_chain_anchor": {
      "kaspa_tx_id": "kaspa:qr...",
      "block_height": 0
    }
  }
}
```

---

# 6. Processing Pipeline

## 6.1 Transaction Flow

```
ERP Transaction
     |
     v
+-----------------+
|  FORAY Adapter  |
---------+--------+
         |
         +---> Compute hashes
         |
         |    SYNCHRONOUS (User waits ~1.2s)
         +---> Layer 1: Kaspa anchor
         +---> Layer 2a: MongoDB write
         +---> Layer 2b: DocumentDB write
         |
         |    [OK] User receives confirmation
         |
         |    ASYNCHRONOUS (Background)
         ----> Layer 3: Sealing queue
                    |
                    v
              +---------------+
              | Sealing Worker|
              --------+-------+
                      |
                      +---> Encrypt payload
                      +---> Arweave upload
                      +---> Glacier upload
                      +---> Kaspa sealing pointer
                      |
                      v
              [OK] Fully sealed
```

## 6.2 Timing Estimates

| Operation | Sync/Async | Duration |
|-----------|------------|----------|
| Hash computation | Sync | ~30 ms |
| Kaspa broadcast + confirmation | Sync | ~1,100 ms |
| MongoDB write | Sync | ~50 ms |
| DocumentDB write | Sync | ~50 ms |
| **User-perceived latency** | | **~1.2 seconds** |
| Encryption | Async | ~20 ms |
| Arweave upload | Async | ~3 seconds |
| Glacier upload | Async | ~500 ms |
| Sealing pointer anchor | Async | ~1 second |
| **Total sealing time** | | **~5-60 seconds** |

## 6.3 Batch Sealing (High Volume)

For high-volume implementations (>10K transactions/day):

- Batch transactions for sealing (every 5 minutes or 100 transactions)
- Create Merkle tree of batch
- Single Arweave transaction for batch
- Individual transactions provable via Merkle proof

---

# 7. Verification Protocols

## 7.1 Hash Verification

```javascript
async function verifyTransaction(transactionId) {
  // 1. Get on-chain record
  const onChain = await kaspa.getTransaction(transactionId);
  
  // 2. Get Layer 2 record
  const layer2 = await mongodb.findOne({ _id: transactionId });
  
  // 3. Compute hashes from Layer 2 data
  const computedCoreHash = sha256(canonicalize(layer2.foray_core));
  const computedAuditHash = sha256(canonicalize(layer2.audit_data));
  
  // 4. Compare
  return {
    core_hash_valid: computedCoreHash === onChain.foray_core_hash,
    audit_hash_valid: computedAuditHash === onChain.audit_data_hash,
    overall_valid: (computedCoreHash === onChain.foray_core_hash) &&
                   (computedAuditHash === onChain.audit_data_hash)
  };
}
```

## 7.2 Sealed Archive Verification

```javascript
async function verifySealedArchive(transactionId) {
  // 1. Get sealing pointer from on-chain
  const sealingPointer = await kaspa.getSealingPointer(transactionId);
  
  // 2. Retrieve sealed record metadata
  const sealedRecord = await mongodb.findOne({
    "sealed_record.references.transaction_id": transactionId
  });
  
  // 3. Verify hash chain
  return {
    original_anchored: sealingPointer.references.transaction_block > 0,
    sealing_anchored: sealingPointer.on_chain_anchor.block_height > 0,
    hash_match: sealingPointer.integrity.hash_match_verified,
    arweave_permanent: sealingPointer.sealed_archives.arweave_tx.startsWith("ar://"),
    fully_verified: true
  };
}
```

---

# 8. Migration Guide (v3.0 -> v4.0)

## 8.1 Breaking Changes

| Change | v3.0 | v4.0 | Migration Action |
|--------|------|------|------------------|
| Top-level structure | Flat | `foray_core` wrapper | Wrap existing fields |
| Component structure | Flat | `foray_core` + `audit_data` | Wrap existing fields |
| Kaspa commitment | `kaspa_commitment` | `blockchain_anchor` | Rename field |
| Metadata | `foray_metadata` | Split to multiple sections | Restructure |

## 8.2 Backward Compatibility

v4.0 systems SHOULD accept v3.0 transactions by:

1. Detecting missing `foray_core` wrapper
2. Auto-wrapping flat fields into `foray_core`
3. Setting `audit_data` to null/empty
4. Processing as v4.0 with minimal audit profile

## 8.3 Forward Compatibility

v3.0 systems can process v4.0 transactions by:

1. Extracting `foray_core` content
2. Ignoring `audit_data` sections
3. Mapping `blockchain_anchor` to `kaspa_commitment`

## 8.4 Migration Script Pseudocode

```javascript
function migrateV3toV4(v3Transaction) {
  return {
    transaction_id: v3Transaction.transaction_id,
    schema_version: "4.0",
    timestamp: v3Transaction.timestamp,
    
    foray_core: {
      entity: v3Transaction.entity,
      transaction_type: v3Transaction.transaction_type,
      total_value: v3Transaction.total_value,
      currency: v3Transaction.currency,
      status: v3Transaction.status || "active"
    },
    
    arrangements: v3Transaction.arrangements.map(arr => ({
      id: arr.id,
      foray_core: { ...arr },  // All v3 fields become foray_core
      audit_data: null         // No audit_data in migrated records
    })),
    
    // ... similar for accruals, anticipations, actions
    
    blockchain_anchor: v3Transaction.kaspa_commitment ? {
      kaspa_tx_id: v3Transaction.kaspa_commitment.kaspa_tx_id,
      block_height: v3Transaction.kaspa_commitment.block_height,
      // ...
    } : null,
    
    audit_data_anchor: null,  // No Layer 3 for migrated records
    
    privacy_metadata: v3Transaction.privacy_metadata
  };
}
```

---

# 9. Appendices

## 9.1 Complete Field Reference

See separate document: `FORAY_v4.0_Field_Reference.md`

## 9.2 JSON Schema

See separate document: `FORAY_v4.0_JSON_Schema.json`

## 9.3 Validation Script

See separate document: `validate_foray_v4.py`

## 9.4 Example Transactions

See separate document: `FORAY_v4.0_Examples.md`

---

# Document Footer

## Disclaimer

> **DISCLAIMER:** This document describes the FORAY Protocol specification as of January 2026. All performance metrics, security claims, and compliance statements are design goals based on theoretical analysis. They do not constitute guarantees. Organizations should consult qualified professionals for specific compliance requirements.

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-24 | 4.0-DRAFT | FORAY Team | Initial v4.0 specification |

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Protocol Lead | | | |
| Technical Review | | | |
| Legal Review | | | |

---

**END OF FORAY PROTOCOL SPECIFICATION v4.0**
