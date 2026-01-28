# CHANGELOG

<!--
============================================================================
FORAY Protocol - Changelog
============================================================================
File Naming Convention: CHANGELOG_YYYY-MM-DD_vX.Y.Z.md

This allows changelogs to sort chronologically in file listings.
Examples:
  - CHANGELOG_2026-01-27_v4.1.1.md
  - CHANGELOG_2026-01-28_v4.1.2.md
  - CHANGELOG_2026-02-01_v4.2.0.md

Author:        Marvin Percival
Email:         marvinp@dunin7.com
GitHub:        github.com/DUNIN7/foray-kaspathon
============================================================================
-->

All notable changes to the FORAY Protocol project will be documented in this file.

## [4.1.2] - 2026-01-28

### Added
- **Demo Mode notice** in Transaction Generator loading modal explaining demo vs production latency
- **Parties normalization** in Transaction Review - converts string arrays to `{role, name}` objects
- **"Create Another" button** in Transaction Review navigates back to Generator
- **ArrowLeft icon** component for navigation
- **Metadata headers** with version tracking in all HTML files
- **Responsive breakpoints** for Problem cards grid

### Changed
- **Landing Page (index.html v2.0.0)**
  - Problem cards now match Solution cards (4-column grid, centered text, 64px icons)
  - Reduced section spacing throughout (6rem → 3rem, preserved hero gap)
  - Added red accent bar on Problem cards matching Solution card style
  
- **Transaction Generator (demo.html v3.2.0)**
  - Navigation bar now matches Transaction Review (fixed position, teal→navy gradient)
  - Loading modal redesigned: compact 2-column layout, fits without scrolling
  - Success bar restyled to match Transaction Review card style
  - Added Demo Mode explanation about ERP adapter production use
  
- **Transaction Review (foray-tx-review-v41.html v4.1.2)**
  - Enhanced `migrateToV41()` handles multiple JSON schema formats:
    - `transaction_metadata` wrapper extraction
    - `*_id` field naming (`arrangement_id` → `id`)
    - `accrued_amount` → `output` mapping
    - `reference_arrangement` → `arrangement_refs[]` conversion
  - "Load New" button renamed to "Create Another" with navigation to Generator
  - SessionStorage integration for seamless Generator → Review workflow

- **API Server (foray-api-server.js v1.1.0)**
  - Flexible validation accepts `schema_version` OR `foray_version`
  - Accepts `transaction_metadata` wrapper OR root-level fields
  - Auto-generates fallback `transaction_id` if missing

### Fixed
- Parties displaying as `:` instead of names in Transaction Review
- Accrual amounts not displaying (missing `output` field mapping)
- Generate Transaction button not working (Cloudflare script corruption)
- Inconsistent navigation between Generator and Review pages

---

## [4.1.1] - 2026-01-27

### Added
- Transaction Generator with AI-powered JSON creation
- Reference examples section with 7 pre-built transactions
- Cloudflare Tunnel deployment for public demo access

### Changed
- Reduced landing page section spacing for better visual flow

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)
