/**
 * ============================================================================
 * FORAY Protocol API Server
 * ============================================================================
 * Version:       2.1.0
 * Created:       2026-01-28T16:30:00Z
 * Modified:      2026-02-04T14:30:00Z
 *
 * Author:        Marvin Percival
 * Email:         marvinp@dunin7.com
 * GitHub:        github.com/DUNIN7/foray-kaspathon
 *
 * License:       Business Source License 1.1
 * Copyright (c) 2026 Marvin Percival. All rights reserved.
 *
 * Description:
 *   Backend API server for FORAY Protocol transaction generation and
 *   business analysis. Proxies Anthropic Claude API calls from the
 *   browser-based frontend tools (demo.html, business-analyzer.html)
 *   to avoid CORS restrictions and keep API keys server-side.
 *
 * Endpoints:
 *   GET  /health                    - Health check
 *   POST /api/generate-foray        - Generate FORAY v4.1 JSON + narrative
 *   POST /api/analyze-business      - Business analyzer for FORAY fit
 *   POST /api/describe-transaction  - Get description + example for tx type
 *
 * Dependencies:
 *   express, cors, dotenv, node-fetch (or built-in fetch in Node 18+)
 *
 * Changelog:
 *   v2.1.0 (2026-02-04)
 *     - Added /api/describe-transaction endpoint for "Be Creative" feature
 *     - New DESCRIBE_TRANSACTION_PROMPT for generating tx descriptions
 *     - Updated health check to include new endpoint
 *   v2.0.0 (2026-02-02)
 *     - Complete rewrite with comprehensive FORAY v4.1 system prompt
 *     - Added Attestations extension support
 *     - Added transaction narrative generation
 *     - Dual output: JSON + plain-language narrative
 *     - Domain recognition for 8 industry verticals
 *     - Structured validation of generated output
 *     - Detailed error handling with troubleshooting hints
 *   v1.3.0 (2026-01-30)
 *     - Added /api/analyze-business endpoint
 *   v1.2.0 (2026-01-29)
 *     - Added supply chain/provenance support
 *   v1.0.0 (2026-01-28)
 *     - Initial release with basic generation endpoint
 * ============================================================================
 */

'use strict';

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ---------------------------------------------------------------------------
// System Prompts
// ---------------------------------------------------------------------------

/**
 * FORAY_SYSTEM_PROMPT
 *
 * Comprehensive system prompt for FORAY Protocol v4.1 transaction generation.
 * Based on FORAY_Generator_Prompt_Specification.md Section 4 + Section 8.5.
 *
 * Includes:
 *   - 4-Component Model (4A) with definitions and distinctions
 *   - Attestations Extension for third-party validation
 *   - v4.1 features (flexible entry points, many-to-many refs, allocations)
 *   - Component structure templates with all required fields
 *   - Domain recognition patterns for 8 industry verticals
 *   - Privacy metadata guidelines by sensitivity level
 *   - Narrative generation instructions
 *   - Output format with delimiter separation
 */
const FORAY_SYSTEM_PROMPT = `You are a FORAY Protocol transaction generator. Your role is to convert natural language transaction descriptions into valid FORAY Protocol v4.1 JSON structures for blockchain audit trail anchoring, accompanied by a plain-language narrative summary.

## CRITICAL: Source System Trust

FORAY trusts the source system. Transactions arriving at FORAY have already been validated by enterprise systems (SAP, Oracle, QuickBooks, Salesforce). Your role is to STRUCTURE the data for audit anchoring, not to validate business logic.

## The 4-Component Model (4A) + Attestations Extension

Every FORAY transaction decomposes into four core component types, with an optional fifth for third-party validation:

| Component | Code | Purpose | Contains |
|-----------|------|---------|----------|
| Arrangements | ARR | Contractual setup | Parties, terms, effective dates, legal references |
| Accruals | ACC | Calculation logic | Formulas, valuations, computed amounts |
| Anticipations | ANT | Expected future flows | Forecasts, conditions, scheduled amounts |
| Actions | ACT | Executed settlements | Actual amounts, completion dates, status |
| Attestations | ATT | Third-party validation (optional) | Certifier identity, credentials, claims, evidence |

### Critical Distinction
- Accruals = HOW amounts are computed (formulas, rates, methodologies)
- Anticipations = WHAT we expect in the future (payments, deliveries, obligations)
- Attestations = WHO vouches for claims (certifications, inspections, audit opinions)

### Component Dependencies (v4.1)
- Arrangements: No upstream references (can be entry points)
- Accruals: Reference zero or more Arrangements via arrangement_refs[]
- Anticipations: Reference Accruals via accrual_refs[] AND/OR Arrangements via arrangement_refs[]
- Actions: Reference Anticipations, Accruals, AND/OR Arrangements via respective _refs[] arrays
- Attestations: Reference ANY component type via subject_refs[] (can also reference other Attestations for chains)

## v4.1 Key Features

1. Flexible Entry Points - Any component type can be the transaction root
2. Many-to-Many References - Use _refs[] arrays, NOT singular _ref fields
3. Allocations Tracking - Actions specify how settlements map to multiple references
4. Optional Arrangements - Settlement-only transactions (cash sales) need no arrangement
5. Attestations Extension - Optional fifth component for third-party certifications, inspections, audit opinions

## Valid Transaction Patterns

| Pattern | Components | Use Case |
|---------|------------|----------|
| FULL_LIFECYCLE | ARR -> ACC -> ANT -> ACT | Complete transaction cycle |
| COMMITMENT_ONLY | ARR only | Contract signed, no activity |
| RECOGNITION_ONLY | ACC only | Adjusting entry, depreciation |
| SETTLEMENT_ONLY | ACT only | Immediate cash transaction |
| DEFERRED_SETTLEMENT | ARR -> ACC -> ANT | Accrued but not settled |
| CONSOLIDATED_PAYMENT | ACT -> [ANT, ANT, ANT] | Batch payment clearing multiple |
| CERTIFIED_PROVENANCE | ARR -> ACC -> ATT -> ACT | Product with third-party certification |
| ATTESTATION_CHAIN | ATT -> ATT -> ATT | Lab analysis -> Certifier -> Final approval |

## Accrual Computation Methods

| Method | Use When |
|--------|----------|
| Calculated | Formula-based (interest, depreciation, taxes, allocations) |
| Valuation | External oracle (market prices, FX rates, spectroscopic analysis) |
| FixedAmount | Static value (flat fees, invoice line items) |
| Estimated | Projected values subject to true-up |

## JSON Schema Template (v4.1)

{
  "transaction_id": "DOMAIN_YYYY_QN_DESCRIPTOR",
  "schema_version": "4.1",
  "timestamp": "ISO-8601",
  "foray_core": {
    "entity": "Primary Entity Name",
    "entity_hash": "sha256:...",
    "transaction_type": "snake_case_type",
    "total_value": 0.00,
    "currency": "USD",
    "status": "active|completed|reversed",
    "compliance_flags": ["SOX_404", "GAAP"]
  },
  "component_hashes": {
    "arrangements": "sha256:...",
    "accruals": "sha256:...",
    "anticipations": "sha256:...",
    "actions": "sha256:...",
    "attestations": "sha256:..."
  },
  "arrangements": [],
  "accruals": [],
  "anticipations": [],
  "actions": [],
  "attestations": [],
  "merkle_root": "sha256:...",
  "blockchain_anchor": {
    "kaspa_tx_id": "kaspa:qr...",
    "block_height": 0,
    "confirmation_time_ms": 0,
    "anchored_at": "ISO-8601"
  },
  "audit_data_anchor": {
    "audit_data_hash": "sha256:...",
    "audit_profile": "standard",
    "storage_locations": []
  },
  "privacy_metadata": {
    "formulas_obfuscated": 0,
    "instance_pools": 0,
    "attack_complexity": "N/A"
  }
}

## Component Structure Templates

### Arrangement
{
  "id": "ARR_DESCRIPTIVE_ID",
  "foray_core": {
    "type": "arrangement_type",
    "effective_date": "ISO-8601",
    "parties": [
      { "role": "buyer|seller|lender|borrower", "name": "Party Name", "jurisdiction": "US" }
    ],
    "description": "Clear description of arrangement",
    "total_value": 0.00,
    "currency": "USD",
    "terms": { },
    "dependencies": []
  }
}

### Accrual
{
  "id": "ACC_DESCRIPTIVE_ID",
  "foray_core": {
    "arrangement_refs": ["ARR_ID"],
    "type": "accrual_type",
    "description": "What is being calculated",
    "computation_method": "Calculated|Valuation|FixedAmount|Estimated",
    "formula_id": "sha256:formula_hash...",
    "inputs": { },
    "output": 0.00,
    "currency": "USD",
    "dependencies": ["ARR_ID"]
  }
}

### Anticipation
{
  "id": "ANT_DESCRIPTIVE_ID",
  "foray_core": {
    "accrual_refs": ["ACC_ID"],
    "arrangement_refs": ["ARR_ID"],
    "type": "anticipation_type",
    "description": "What is expected",
    "expected_amount": 0.00,
    "currency": "USD",
    "expected_date": "ISO-8601",
    "probability_factor": 1.0,
    "dependencies": ["ACC_ID"]
  }
}

### Action
{
  "id": "ACT_DESCRIPTIVE_ID",
  "foray_core": {
    "anticipation_refs": ["ANT_ID"],
    "accrual_refs": ["ACC_ID"],
    "arrangement_refs": ["ARR_ID"],
    "type": "action_type",
    "description": "What was executed",
    "amount_settled": 0.00,
    "currency": "USD",
    "settlement_date": "ISO-8601",
    "settlement_status": "completed|pending|failed|reversed",
    "payment_method": "wire|ach|check|crypto|cash|other",
    "counterparty": "Receiving Party",
    "allocations": [],
    "dependencies": ["ANT_ID"]
  }
}

### Attestation (Optional)
{
  "id": "ATT_DESCRIPTIVE_ID",
  "foray_core": {
    "attestor": "Attesting Party Name",
    "attestor_hash": "sha256:attestor_identity...",
    "attestor_type": "certification_body|laboratory|auditor|inspector|oracle|regulator",
    "attestor_credentials": ["Credential_1", "Credential_2"],
    "subject_refs": ["ARR_ID", "ACC_ID"],
    "attestation_type": "certification|inspection|analysis|audit_opinion|verification|approval",
    "attestation_date": "ISO-8601",
    "validity_period": { "start": "ISO-8601", "end": "ISO-8601" },
    "outcome": "certified|approved|rejected|conditional|expired|revoked|pending",
    "evidence_hash": "sha256:supporting_documentation...",
    "evidence_location": "off-chain",
    "dependencies": []
  }
}

Attestor Types:
- certification_body: UMF Association, ISO registrar, DOP Consorzio
- laboratory: Analytica Labs, spectroscopic analysis facilities
- auditor: Big Four firms, internal audit departments
- inspector: Customs officials, quality control personnel
- oracle: IoT sensors, GPS tracking, automated systems
- regulator: FDA, DCAA, SEC, MPI

When to Include Attestations:
- Product provenance (Manuka honey, luxury goods, pharmaceuticals)
- Third-party certifications (ISO, DOP, COSC, organic)
- Regulatory approvals (export permits, customs clearance)
- Audit opinions and sign-offs
- Multi-party verification chains

Important: Attestations record CLAIMS, not TRUTH. Include attestations when accountability for assertions matters.

## CRITICAL VALIDATION RULES

The generated JSON will be validated. To avoid validation errors, you MUST follow these rules:

1. **REFERENTIAL INTEGRITY**: Every reference ID in _refs arrays MUST exist as an actual component ID in the transaction.
   - arrangement_refs: Each ID must match an existing arrangement's "id" field
   - accrual_refs: Each ID must match an existing accrual's "id" field  
   - anticipation_refs: Each ID must match an existing anticipation's "id" field
   - subject_refs (attestations): Each ID must match an existing component's "id" field
   - dependencies: Each ID must match an existing component's "id" field
   
   BAD: "arrangement_refs": ["ARR_CONTRACT"] when no arrangement has id "ARR_CONTRACT"
   GOOD: Create the arrangement first with id "ARR_CONTRACT", then reference it

2. **ALLOCATION SUM RULE**: If an Action has a non-empty "allocations" array, the sum of all allocation "amount" values MUST EXACTLY EQUAL "amount_settled".
   - If you cannot properly calculate allocations, use an empty array: "allocations": []
   - Example: amount_settled: 10000, allocations: [{amount: 6000}, {amount: 4000}] = 10000 (VALID)

3. **MINIMUM COMPONENTS**: Transaction must have at least one component (arrangement, accrual, anticipation, or action).

4. **ID PREFIX CONVENTION**: Use correct prefixes for component IDs:
   - Arrangements: ARR_*
   - Accruals: ACC_*
   - Anticipations: ANT_*
   - Actions: ACT_*
   - Attestations: ATT_*

## Domain Recognition

Detect transaction domain from description and apply appropriate patterns:

| Domain | Trigger Phrases | Key Components |
|--------|-----------------|----------------|
| Financial Services | loan, mortgage, derivative, swap, repo, securitization | Interest accruals, amortization, tranches |
| Manufacturing | work order, BOM, cost allocation, WIP, overhead | Material/labor accruals, cost roll-up |
| Payroll | salary, wages, withholding, benefits, payroll | Tax calculations, benefit deductions |
| Energy | PPA, MWh, grid, renewable, curtailment | Usage accruals, delivery actions |
| Supply Chain/Provenance | provenance, authentication, spectroscopic, UMF, DOP, origin | Fingerprint accruals, attestations, verification actions |
| Luxury/Authentication | watch authentication, handbag, jewelry, counterfeit | Material fingerprints, attestation chains |
| Regulatory/Compliance | FDA approval, export permit, customs, audit opinion | Attestations from regulators, auditors |
| Retail | cash sale, POS, receipt | Action-only transactions |

## Privacy Metadata Guidelines

| Sensitivity | formulas_obfuscated | instance_pools | attack_complexity |
|-------------|---------------------|----------------|-------------------|
| Low (routine) | 0-1 | 0-1 | N/A |
| Medium (commercial) | 1-3 | 2-3 | 2^64 operations |
| High (proprietary) | 3-7 | 3-5 | 2^96 operations |
| Critical (trade secret) | 7+ | 5-10 | 2^128 operations |

## ID Naming Convention

- Arrangements: ARR_DESCRIPTIVE_NAME
- Accruals: ACC_DESCRIPTIVE_NAME
- Anticipations: ANT_DESCRIPTIVE_NAME
- Actions: ACT_DESCRIPTIVE_NAME
- Attestations: ATT_DESCRIPTIVE_NAME

Use SCREAMING_SNAKE_CASE with meaningful descriptors.

## Narrative Generation

After generating the JSON, also produce a plain-language narrative summary of the transaction. The narrative should:

1. Open with a TRANSACTION SUMMARY paragraph covering who, what, when, how much, and applicable compliance requirements.

2. Walk through each populated component type in order:
   - Arrangements: Describe parties, terms, and effective dates
   - Accruals: Explain each calculation in plain language
   - Anticipations: State expected amounts, dates, and conditions
   - Actions: Detail what was settled, any variances, and method
   - Attestations: Identify each attestor, their credentials, what they attested to, and the outcome. Include the trust boundary disclaimer.

3. Omit sections for empty component arrays.

4. Close with a BLOCKCHAIN ANCHOR paragraph confirming the tamper-evident anchoring.

Write in third person, past tense for completed transactions. Use specific numbers, dates, and party names from the JSON. The tone should be professional but accessible - suitable for reading aloud in an audit committee meeting.

For attestations, always include:
"Note: This attestation records [attestor]'s [type of claim] - FORAY does not independently verify [relevant limitation]."

## Output Format

You MUST separate the JSON and narrative with delimiters exactly as shown:

===FORAY_JSON===
{ valid JSON here }
===FORAY_NARRATIVE===
Transaction narrative here

The JSON section must contain ONLY valid JSON (no markdown, no backticks, no explanatory text).
The narrative section must contain ONLY the plain-language narrative.`;


/**
 * BUSINESS_ANALYZER_PROMPT
 *
 * System prompt for the Business Analyzer endpoint.
 * Analyzes a business description and explains how FORAY Protocol
 * would apply to their specific use case.
 */
const BUSINESS_ANALYZER_PROMPT = `You are an expert business analyst and blockchain consultant specializing in FORAY Protocol implementations.

FORAY Protocol is a privacy-preserving blockchain audit infrastructure that creates immutable audit trails by anchoring cryptographic hashes to the Kaspa blockchain while keeping sensitive business data off-chain.

The protocol uses a 4-component model (4A):
- Arrangements: Contractual agreements and terms
- Accruals: Calculation logic and formulas
- Anticipations: Expected future flows
- Actions: Actual settlements and executions

Plus an optional Attestations extension for third-party certifications and validations.

When analyzing a business, provide:
1. What types of transactions this business has that FORAY would audit
2. How FORAY's 4 components would map to those transactions
3. Specific compliance benefits (SOX, Basel III, DCAA, FERC, FDA, etc.)
4. Privacy advantages (what stays off-chain vs on-chain)
5. Why Kaspa's sub-second finality matters for their use case

Format your response as clean, structured HTML sections with headers and lists. Use business-appropriate language. Be specific to their industry. Show deep understanding of their pain points.

Structure your response with these sections:
- <h3>Transaction Types</h3>
- <h3>FORAY Component Mapping</h3>
- <h3>Compliance Benefits</h3>
- <h3>Privacy Architecture</h3>
- <h3>Kaspa Advantage</h3>`;


/**
 * DESCRIBE_TRANSACTION_PROMPT
 *
 * System prompt for the "Be Creative" feature.
 * Generates a description and example scenario for any transaction type.
 */
const DESCRIBE_TRANSACTION_PROMPT = `You are a financial and business transaction expert with deep knowledge of enterprise accounting, financial instruments, supply chain operations, and regulatory compliance.

When given a transaction type, you will provide:

1. **Description**: A clear, professional explanation of what this transaction type is, how it works, who the typical parties are, and what business purpose it serves. Write 2-3 paragraphs suitable for a senior accountant or auditor to understand.

2. **Example**: A specific, realistic example scenario with concrete details including:
   - Party names (use realistic but fictional company names)
   - Specific amounts and currencies
   - Dates (use dates in early 2025)
   - Relevant terms, rates, or conditions
   - Any collateral, guarantees, or special provisions

The example should be detailed enough to generate a complete FORAY Protocol transaction with all 4 components (Arrangements, Accruals, Anticipations, Actions).

## Output Format

You MUST use these exact delimiters:

===DESCRIPTION===
Your description paragraphs here
===EXAMPLE===
Your detailed example scenario here

Do not include any other text, headers, or markdown formatting outside these sections.`;


// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * callAnthropicAPI
 *
 * Makes a request to the Anthropic Messages API.
 *
 * @param {string} systemPrompt - The system prompt
 * @param {string} userMessage  - The user message
 * @param {number} maxTokens    - Max tokens for response (default 8000)
 * @returns {Object}            - The raw API response data
 * @throws {Error}              - On API failure or network error
 */
async function callAnthropicAPI(systemPrompt, userMessage, maxTokens = 8000) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured. Set it in your .env file.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Anthropic API error: ${response.status}`, errorText);
    throw new Error(`Anthropic API request failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * extractTextFromResponse
 *
 * Extracts the text content from an Anthropic API response.
 *
 * @param {Object} data - The API response data
 * @returns {string}    - The concatenated text content
 */
function extractTextFromResponse(data) {
  return data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');
}

/**
 * parseGeneratorOutput
 *
 * Parses the dual-output (JSON + narrative) from the transaction generator.
 * Handles both delimiter-separated format and JSON-only fallback.
 *
 * @param {string} rawText - The raw text from the API response
 * @returns {Object}       - { forayJSON: Object, narrative: string }
 * @throws {Error}         - On JSON parse failure
 */
function parseGeneratorOutput(rawText) {
  let jsonText = '';
  let narrative = '';

  // --- Strategy 1: Delimiter-separated output ---
  if (rawText.includes('===FORAY_JSON===')) {
    const jsonMatch = rawText.match(/===FORAY_JSON===\s*([\s\S]*?)===FORAY_NARRATIVE===/);
    const narrativeMatch = rawText.match(/===FORAY_NARRATIVE===\s*([\s\S]*?)$/);

    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1].trim();
    }
    if (narrativeMatch && narrativeMatch[1]) {
      narrative = narrativeMatch[1].trim();
    }
  }

  // --- Strategy 2: JSON-only fallback (no delimiters) ---
  if (!jsonText) {
    jsonText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  // Clean any stray markdown backticks from the JSON block
  jsonText = jsonText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // Parse and validate the JSON
  let forayJSON;
  try {
    forayJSON = JSON.parse(jsonText);
  } catch (parseError) {
    console.error('JSON parse error. Raw text (first 500 chars):', jsonText.substring(0, 500));
    throw new Error(`Generated output is not valid JSON: ${parseError.message}`);
  }

  return { forayJSON, narrative };
}

/**
 * parseDescribeOutput
 *
 * Parses the description + example output from the describe-transaction endpoint.
 *
 * @param {string} rawText - The raw text from the API response
 * @returns {Object}       - { description: string, example: string }
 */
function parseDescribeOutput(rawText) {
  let description = '';
  let example = '';

  if (rawText.includes('===DESCRIPTION===')) {
    const descMatch = rawText.match(/===DESCRIPTION===\s*([\s\S]*?)===EXAMPLE===/);
    const exampleMatch = rawText.match(/===EXAMPLE===\s*([\s\S]*?)$/);

    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim();
    }
    if (exampleMatch && exampleMatch[1]) {
      example = exampleMatch[1].trim();
    }
  } else {
    // Fallback: try to split on "Example:" or similar
    const parts = rawText.split(/\n\s*(?:Example|EXAMPLE)[:\s]/i);
    if (parts.length >= 2) {
      description = parts[0].trim();
      example = parts.slice(1).join('\n').trim();
    } else {
      // Last resort: return entire text as description
      description = rawText.trim();
      example = 'Please provide a detailed example scenario for this transaction type.';
    }
  }

  return { description, example };
}

/**
 * validateFORAYJSON
 *
 * Performs structural validation on the generated FORAY JSON.
 * Checks schema version, component presence, and referential integrity.
 *
 * @param {Object} json - The parsed FORAY JSON object
 * @returns {Object}    - { valid: boolean, errors: string[], warnings: string[] }
 */
function validateFORAYJSON(json) {
  const errors = [];
  const warnings = [];

  // Schema version
  if (json.schema_version !== '4.1') {
    errors.push(`Invalid schema_version: "${json.schema_version}" (expected "4.1")`);
  }

  // Transaction ID
  if (!json.transaction_id) {
    errors.push('Missing transaction_id');
  }

  // Timestamp
  if (!json.timestamp) {
    errors.push('Missing timestamp');
  }

  // foray_core
  if (!json.foray_core) {
    errors.push('Missing foray_core block');
  } else {
    if (!json.foray_core.entity) warnings.push('foray_core.entity is empty');
    if (!json.foray_core.transaction_type) warnings.push('foray_core.transaction_type is empty');
  }

  // At least one component must exist
  const componentCount =
    (json.arrangements?.length || 0) +
    (json.accruals?.length || 0) +
    (json.anticipations?.length || 0) +
    (json.actions?.length || 0);

  if (componentCount === 0) {
    errors.push('Transaction must have at least one component (arrangements, accruals, anticipations, or actions)');
  }

  // Validate component ID prefixes
  const checkPrefix = (arr, prefix, name) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((item, i) => {
      if (!item.id) {
        errors.push(`${name}[${i}] missing id`);
      } else if (!item.id.startsWith(prefix)) {
        warnings.push(`${name}[${i}].id "${item.id}" should start with "${prefix}"`);
      }
    });
  };

  checkPrefix(json.arrangements, 'ARR_', 'arrangements');
  checkPrefix(json.accruals, 'ACC_', 'accruals');
  checkPrefix(json.anticipations, 'ANT_', 'anticipations');
  checkPrefix(json.actions, 'ACT_', 'actions');
  checkPrefix(json.attestations, 'ATT_', 'attestations');

  // Check for singular _ref fields (should be _refs[] arrays)
  const checkRefs = (arr, name) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((item, i) => {
      const core = item.foray_core || {};
      if (core.arrangement_ref && !core.arrangement_refs) {
        warnings.push(`${name}[${i}] uses singular arrangement_ref; should be arrangement_refs[]`);
      }
      if (core.accrual_ref && !core.accrual_refs) {
        warnings.push(`${name}[${i}] uses singular accrual_ref; should be accrual_refs[]`);
      }
      if (core.anticipation_ref && !core.anticipation_refs) {
        warnings.push(`${name}[${i}] uses singular anticipation_ref; should be anticipation_refs[]`);
      }
    });
  };

  checkRefs(json.accruals, 'accruals');
  checkRefs(json.anticipations, 'anticipations');
  checkRefs(json.actions, 'actions');

  // Privacy metadata
  if (!json.privacy_metadata) {
    warnings.push('Missing privacy_metadata block');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}


// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /health
 *
 * Health check endpoint. Returns server status, API key presence,
 * and version information.
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FORAY Transaction Generator API',
    version: '2.1.0',
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    features: {
      transactionGeneration: true,
      narrativeGeneration: true,
      attestationsSupport: true,
      businessAnalyzer: true,
      describeTransaction: true
    }
  });
});


/**
 * POST /api/generate-foray
 *
 * Generates a FORAY Protocol v4.1 transaction JSON and an
 * accompanying plain-language narrative from a natural language
 * description.
 *
 * Request body:
 *   {
 *     "transactionName": "string (required)",
 *     "transactionDescription": "string (required)",
 *     "domain": "string (optional hint)",
 *     "complianceFlags": "string (optional)",
 *     "privacyLevel": "low|medium|high|critical (optional)"
 *   }
 *
 * Response:
 *   {
 *     "forayJSON": { ... },
 *     "narrative": "string",
 *     "validation": { valid, errors, warnings },
 *     "metadata": { model, generatedAt, schemaVersion }
 *   }
 */
app.post('/api/generate-foray', async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      transactionName,
      transactionDescription,
      domain,
      complianceFlags,
      privacyLevel
    } = req.body;

    // -- Input validation --
    if (!transactionName || !transactionName.trim()) {
      return res.status(400).json({
        error: 'Transaction name is required',
        hint: 'Provide a short descriptive name (e.g., "Vendor Batch Payment")'
      });
    }

    if (!transactionDescription || !transactionDescription.trim()) {
      return res.status(400).json({
        error: 'Transaction description is required',
        hint: 'Describe the transaction in plain language with parties, amounts, dates, and terms'
      });
    }

    // -- Build user message --
    let userMessage = `Transaction Name: ${transactionName.trim()}\n\nTransaction Description:\n${transactionDescription.trim()}`;

    // Append optional hints if provided
    if (domain) {
      userMessage += `\n\nDomain: ${domain}`;
    }
    if (complianceFlags) {
      userMessage += `\nCompliance Requirements: ${complianceFlags}`;
    }
    if (privacyLevel) {
      userMessage += `\nPrivacy Level: ${privacyLevel}`;
    }

    userMessage += '\n\nGenerate a complete FORAY Protocol v4.1 transaction JSON with a narrative summary. Use the delimiter format specified in your instructions.';

    console.log(`[generate-foray] Generating: "${transactionName.trim()}"`);

    // -- Call Anthropic API --
    const data = await callAnthropicAPI(FORAY_SYSTEM_PROMPT, userMessage);
    const rawText = extractTextFromResponse(data);

    // -- Parse dual output --
    const { forayJSON, narrative } = parseGeneratorOutput(rawText);

    // -- Validate generated JSON --
    const validation = validateFORAYJSON(forayJSON);

    if (validation.warnings.length > 0) {
      console.log(`[generate-foray] Warnings: ${validation.warnings.join('; ')}`);
    }

    if (!validation.valid) {
      console.error(`[generate-foray] Validation errors: ${validation.errors.join('; ')}`);
      // Still return the output, but flag it
    }

    const elapsedMs = Date.now() - startTime;
    console.log(`[generate-foray] Completed in ${elapsedMs}ms (valid: ${validation.valid})`);

    // -- Respond --
    res.json({
      forayJSON,
      narrative: narrative || null,
      validation,
      metadata: {
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        generatedAt: new Date().toISOString(),
        schemaVersion: '4.1',
        elapsedMs,
        inputTokens: data.usage?.input_tokens || null,
        outputTokens: data.usage?.output_tokens || null
      }
    });

  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[generate-foray] Error after ${elapsedMs}ms:`, error.message);

    res.status(500).json({
      error: 'Transaction generation failed',
      message: error.message,
      troubleshooting: [
        'Check that ANTHROPIC_API_KEY is set in .env',
        'Verify the API key is valid at console.anthropic.com',
        'Check server logs for detailed error output',
        'Ensure the description is clear and specific'
      ]
    });
  }
});


/**
 * POST /api/analyze-business
 *
 * Analyzes a business description and explains how FORAY Protocol
 * would apply to their specific use case. Used by the Business
 * Analyzer frontend tool.
 *
 * Request body:
 *   { "businessDescription": "string (required)" }
 *
 * Response:
 *   { "analysis": "HTML string" }
 */
app.post('/api/analyze-business', async (req, res) => {
  const startTime = Date.now();

  try {
    const { businessDescription } = req.body;

    if (!businessDescription || !businessDescription.trim()) {
      return res.status(400).json({
        error: 'Business description is required'
      });
    }

    console.log('[analyze-business] Analyzing business...');

    const userMessage = `Analyze this business for FORAY Protocol applications:\n\n${businessDescription.trim()}\n\nProvide detailed analysis formatted as HTML sections.`;

    const data = await callAnthropicAPI(BUSINESS_ANALYZER_PROMPT, userMessage, 4000);
    const analysisHTML = extractTextFromResponse(data);

    const elapsedMs = Date.now() - startTime;
    console.log(`[analyze-business] Completed in ${elapsedMs}ms`);

    res.json({ analysis: analysisHTML });

  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[analyze-business] Error after ${elapsedMs}ms:`, error.message);

    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});


/**
 * POST /api/describe-transaction
 *
 * Generates a description and example scenario for a given transaction type.
 * Used by the "Be Creative" feature in demo.html.
 *
 * Request body:
 *   { "transactionType": "string (required)" }
 *
 * Response:
 *   {
 *     "transactionType": "string",
 *     "description": "string",
 *     "example": "string",
 *     "metadata": { model, generatedAt, elapsedMs }
 *   }
 */
app.post('/api/describe-transaction', async (req, res) => {
  const startTime = Date.now();

  try {
    const { transactionType } = req.body;

    if (!transactionType || !transactionType.trim()) {
      return res.status(400).json({
        error: 'Transaction type is required',
        hint: 'Provide a transaction type like "Foreign Exchange Swap with Bond Collateral"'
      });
    }

    const txType = transactionType.trim();
    console.log(`[describe-transaction] Describing: "${txType}"`);

    const userMessage = `Give me a Description of a "${txType}" and also an Example.

The description should explain what this transaction type is, how it typically works in business practice, and who the parties involved are.

The example should be a specific, realistic scenario with concrete party names, amounts, dates, and terms that could be used to generate a FORAY Protocol transaction.`;

    // Use lower max_tokens since we just need description + example
    const data = await callAnthropicAPI(DESCRIBE_TRANSACTION_PROMPT, userMessage, 2000);
    const rawText = extractTextFromResponse(data);

    // Parse the output
    const { description, example } = parseDescribeOutput(rawText);

    const elapsedMs = Date.now() - startTime;
    console.log(`[describe-transaction] Completed in ${elapsedMs}ms`);

    res.json({
      transactionType: txType,
      description,
      example,
      metadata: {
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        generatedAt: new Date().toISOString(),
        elapsedMs,
        inputTokens: data.usage?.input_tokens || null,
        outputTokens: data.usage?.output_tokens || null
      }
    });

  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[describe-transaction] Error after ${elapsedMs}ms:`, error.message);

    res.status(500).json({
      error: 'Failed to describe transaction type',
      message: error.message,
      troubleshooting: [
        'Check that ANTHROPIC_API_KEY is set in .env',
        'Verify the API key is valid at console.anthropic.com',
        'Try a different transaction type description'
      ]
    });
  }
});


// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `No route matches ${req.method} ${req.path}`,
    availableEndpoints: {
      'GET /health': 'Health check and feature status',
      'POST /api/generate-foray': 'Generate FORAY v4.1 JSON + narrative',
      'POST /api/analyze-business': 'Analyze business for FORAY fit',
      'POST /api/describe-transaction': 'Get description + example for transaction type'
    }
  });
});


// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  const border = '='.repeat(60);
  console.log('');
  console.log(border);
  console.log('  FORAY Transaction Generator API  v2.1.0');
  console.log(border);
  console.log(`  Status:       Running`);
  console.log(`  Port:         ${PORT}`);
  console.log(`  API Key:      ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'MISSING - set ANTHROPIC_API_KEY in .env'}`);
  console.log(`  Model:        ${process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'}`);
  console.log(`  Features:`);
  console.log(`    - Transaction Generation (JSON + Narrative)`);
  console.log(`    - Attestations Extension`);
  console.log(`    - Business Analyzer`);
  console.log(`    - Describe Transaction (Be Creative)`);
  console.log(border);
  console.log(`  Endpoints:`);
  console.log(`    GET  /health`);
  console.log(`    POST /api/generate-foray`);
  console.log(`    POST /api/analyze-business`);
  console.log(`    POST /api/describe-transaction`);
  console.log(border);
  console.log('');
});
