# FORAY Protocol: Government Engagement Action Plan

## Document Control

| Property | Value |
|----------|-------|
| **Version** | 1.0 |
| **Created** | 2026-01-30T16:45:00Z |
| **Author** | Marvin Percival |
| **Classification** | Strategic Planning |
| **Status** | Actionable |

---

## Executive Summary

This document provides step-by-step guidance for executing four strategic recommendations to position FORAY Protocol as a government fraud prevention solution, leveraging the Minnesota fraud crisis as a catalyst event.

---

## Recommendation 1: Engage Treasury's Office of Financial Innovation and Transformation (FIT)

### Why This Matters

Treasury's FIT office is actively piloting blockchain for federal grant management. They have:
- Existing blockchain grant payment prototype
- Cross-agency testing with NSF, HUD, Commerce, and HHS
- Published research on blockchain audit trails
- Direct relevance to Minnesota-style grant fraud

### Action Steps

#### Step 1.1: Research Current FIT Initiatives (Week 1)

**Tasks:**
1. Review FIT's published blockchain research:
   - URL: https://fmvision.fiscal.treasury.gov/blockchain-and-the-possible-future-of-federal-grant-management.html
   - URL: https://www.fiscal.treasury.gov/fit/
   
2. Download JFMIP blockchain report:
   - "Harnessing Blockchain in the Federal Government: Key Considerations for Financial Management"
   - URL: https://www.cfo.gov/jfmip/blockchain-initiative/

3. Identify gaps between their prototype and FORAY capabilities:
   - Their prototype: Fund tracking and drawdown visibility
   - FORAY adds: Transaction semantics (4A model), privacy architecture, service delivery verification

**Deliverable:** Gap analysis document (2-3 pages)

#### Step 1.2: Prepare FORAY-FIT Alignment Brief (Week 2)

**Create a 5-page technical brief addressing:**

1. **Executive Summary** (1 page)
   - FORAY as semantic layer for Treasury's blockchain infrastructure
   - Minnesota fraud prevention use case
   - Key differentiators: 4A model, selective disclosure, cross-system audit

2. **Technical Alignment** (2 pages)
   - How FORAY integrates with Treasury's tokenized grant model
   - Transaction semantic mapping (their tokens â†’ FORAY components)
   - Privacy architecture for beneficiary protection

3. **Pilot Proposal** (1 page)
   - Scope: Single grant program (suggest Child Nutrition or similar)
   - Duration: 6-month proof of concept
   - Metrics: Fraud detection rate, audit time reduction, false positive rate

4. **About FORAY** (1 page)
   - Protocol overview
   - Open source availability
   - Contact information

**Deliverable:** PDF brief suitable for government audience

#### Step 1.3: Initial Contact (Week 3)

**Primary Contact:**
- Office of Financial Innovation and Transformation (FIT)
- Email: FIT@fiscal.treasury.gov
- Phone: (202) 874-7016

**Email Template:**

```
Subject: Blockchain Transaction Semantics for Grant Fraud Prevention - FORAY Protocol

Dear FIT Team,

I am reaching out regarding your blockchain grant management initiative, particularly
in light of the Minnesota fraud investigation highlighting vulnerabilities in federal
grant oversight.

FORAY Protocol is an open-source blockchain-agnostic transaction semantic standard
designed specifically for enterprise audit trails. We believe it could complement
Treasury's existing blockchain prototype by adding:

1. Structured transaction semantics (Arrangements, Accruals, Anticipations, Actions)
2. Privacy-preserving verification (selective disclosure for auditors)
3. Service delivery verification (preventing "invoice without service" fraud)

I have prepared a technical brief showing how FORAY aligns with your published
research and could address fraud patterns identified in the Minnesota case.

Would you be available for a 30-minute call to discuss potential collaboration?
I am also happy to provide a demonstration of our transaction review tools.

Respectfully,
Marvin Percival
FORAY Protocol
marvinp@dunin7.com
https://github.com/DUNIN7/foray-kaspathon
```

#### Step 1.4: Follow-Up Strategy (Weeks 4-8)

**If no response after 1 week:**
- Follow up via email with brief summary
- Request referral to appropriate technical contact

**If meeting scheduled:**
- Prepare 15-minute demo of Transaction Review Tool
- Bring printed copies of technical brief
- Prepare for questions about:
  - Blockchain selection (explain agnostic design)
  - Privacy compliance (GDPR, beneficiary protection)
  - Integration effort (adapter architecture)

**If referred to another office:**
- Common referrals: GAO, OMB, specific agency CFO offices
- Adapt messaging to their specific mandate

---

## Recommendation 2: Develop Minnesota-Specific Pilot Proposal

### Why This Matters

Minnesota is under federal pressure to demonstrate fraud prevention. The state has:
- $185M annual federal child care funding currently frozen
- Active Legislative Auditor investigations
- Bipartisan legislative support for anti-fraud measures
- Political motivation to show systemic reform

### Action Steps

#### Step 2.1: Identify Minnesota Stakeholders (Week 1)

**State Government:**

| Office | Role | Contact Approach |
|--------|------|------------------|
| Minnesota Department of Human Services | Administers grant programs | Public records request for RFI process |
| Office of the Legislative Auditor | Conducts fraud investigations | Public testimony opportunities |
| Minnesota IT Services (MNIT) | State technology procurement | Vendor registration |
| Governor's Office | Policy direction | Legislative liaison |

**Legislative:**

| Committee | Chair | Relevance |
|-----------|-------|-----------|
| House Children and Families Committee | Rep. Carlie Kotyza-Witthuhn | Direct oversight of affected programs |
| House State Government Finance Committee | TBD | Technology procurement |
| Senate Human Services Committee | TBD | Grant program oversight |

**Federal:**

| Office | Role | Contact Approach |
|--------|------|------------------|
| House Oversight Committee | Investigating Minnesota fraud | Public comment / technical briefing request |
| HHS Administration for Children and Families | Froze Minnesota funding | Technical solutions inquiry |
| US Attorney, District of Minnesota | Prosecuting fraud cases | Expert witness / technical consultation |

#### Step 2.2: Create Minnesota-Specific Materials (Week 2)

**Document 1: Problem Statement (2 pages)**
- Specific Minnesota fraud patterns
- How current systems failed
- Cost of fraud ($9B estimated)

**Document 2: FORAY Solution Brief (3 pages)**
- How FORAY prevents each fraud pattern
- Implementation approach for Minnesota
- Privacy protections for beneficiaries

**Document 3: Pilot Program Proposal (5 pages)**

```
PROPOSED PILOT: FORAY Grant Integrity System

SCOPE:
- Single program: Child Care Assistance Program (CCAP)
- Duration: 6 months
- Participating providers: 50-100 volunteer sites

IMPLEMENTATION:
- Phase 1 (Month 1-2): Integration with existing payment systems
- Phase 2 (Month 3-4): Transaction anchoring for participating sites
- Phase 3 (Month 5-6): Audit verification and reporting

METRICS:
- Time to detect anomalies (target: real-time vs. 18-month current)
- False positive rate (target: <5%)
- Provider administrative burden (target: neutral or reduced)
- Audit preparation time (target: 50% reduction)

COST:
- Software: Open source (no license fee)
- Integration: [estimate based on existing systems]
- Training: [estimate for staff training]
- Blockchain anchoring: ~$0.0001 per transaction

PRIVACY PROTECTIONS:
- Beneficiary identities never on blockchain (hashed only)
- Provider details protected from public view
- Auditor-only selective disclosure
```

#### Step 2.3: Minnesota Vendor Registration (Week 3)

**Register with Minnesota procurement systems:**

1. **Minnesota Vendor Registration**
   - URL: https://mn.gov/admin/business/vendor-info/
   - Required for state contracts

2. **SWIFT Vendor Registration**
   - Minnesota's financial management system
   - Required for payment processing

3. **Identify relevant contract vehicles:**
   - IT Master Contract
   - Professional/Technical Services Contract
   - Emergency procurement (fraud crisis may qualify)

#### Step 2.4: Legislative Engagement (Weeks 4-6)

**Approach 1: Public Testimony**

Monitor for hearings on:
- Fraud prevention measures
- Technology modernization
- Grant program oversight

Request to testify as technical expert:
- Contact committee administrator
- Offer neutral technical perspective (not sales pitch)
- Provide written testimony with FORAY overview

**Approach 2: Direct Legislative Contact**

Identify legislators with:
- Technology background
- Audit/oversight committee membership
- District affected by fraud allegations

**Sample Outreach:**

```
Subject: Blockchain Audit Technology for Grant Fraud Prevention

Dear [Legislator],

As Minnesota addresses the grant fraud crisis, I wanted to bring to your attention
an open-source technology solution that could help prevent future fraud while
protecting beneficiary privacy.

FORAY Protocol is a blockchain-agnostic audit trail standard that:
- Creates immutable records of grant transactions as they occur
- Prevents retroactive document alteration (addresses "deleted data" concerns)
- Protects beneficiary privacy through selective disclosure
- Integrates with existing state financial systems

I am a Minnesota-based technologist who developed FORAY specifically for
enterprise audit challenges. I would welcome the opportunity to provide a
technical briefing to your staff on how this approach could strengthen
Minnesota's grant oversight systems.

Respectfully,
Marvin Percival
```

---

## Recommendation 3: Align with Congressional Inquiry

### Why This Matters

The House Oversight Committee is actively investigating Minnesota fraud with scheduled hearings and document requests. This creates a window for technical solutions to enter the policy discussion.

### Action Steps

#### Step 3.1: Monitor Hearing Schedule (Ongoing)

**Track:**
- House Oversight Committee calendar: https://oversight.house.gov/
- Scheduled hearings on Minnesota fraud
- Witness lists and testimony

**Key Dates Known:**
- January 7, 2026: "Oversight of Fraud and Misuse of Federal Funds in Minnesota: Part I" (completed)
- February 10, 2026: Scheduled testimony invitation to Gov. Walz and AG Ellison
- Additional hearings likely

#### Step 3.2: Prepare Congressional Brief (Week 2)

**Create 2-page brief for Congressional staff:**

```
TECHNOLOGY SOLUTIONS FOR FEDERAL GRANT FRAUD PREVENTION

THE PROBLEM:
- Minnesota fraud estimated at $9 billion across 14 programs
- Current systems allow retroactive document alteration
- Audit trails can be deleted by insiders
- Detection occurs 12-18 months after fraud

THE SOLUTION: Blockchain-Based Immutable Audit Trails
- Transactions anchored to external blockchain as they occur
- Cannot be altered or deleted, even by system administrators
- Real-time anomaly detection vs. periodic audits
- Privacy-preserving (beneficiary data protected)

EXISTING FEDERAL INITIATIVES:
- Treasury FIT blockchain grant prototype (2019-present)
- JFMIP cross-agency blockchain initiative
- GSA blockchain working group

RECOMMENDED ACTION:
- Mandate blockchain audit trail pilots for high-risk grant programs
- Fund Treasury FIT expansion to fraud-affected programs
- Require GAO evaluation of blockchain audit effectiveness

TECHNICAL RESOURCE:
FORAY Protocol - Open source blockchain audit standard
https://github.com/DUNIN7/foray-kaspathon
Contact: Marvin Percival, marvinp@dunin7.com
```

#### Step 3.3: Submit for the Record (When Hearings Occur)

**Process:**
1. Identify relevant hearing
2. Contact committee clerk for submission guidelines
3. Submit written statement for the record
4. Follow up with staff offer for technical briefing

**Submission should include:**
- Brief technical overview (not marketing)
- Specific relevance to hearing topic
- Offer of further technical assistance
- No partisan framing

#### Step 3.4: Staff-Level Technical Briefing (If Opportunity Arises)

**Prepare for:**
- 30-minute briefing
- Non-technical audience
- Focus on "how it prevents fraud" not "how blockchain works"
- Live demo if technology available

**Key messages:**
1. Fraud prevention, not just detection
2. Open source (no vendor lock-in)
3. Privacy-preserving (protects beneficiaries)
4. Complements existing systems (not replacement)

---

## Recommendation 4: Partner with Existing Federal Blockchain Initiatives

### Why This Matters

Multiple federal agencies have active blockchain programs. FORAY can position as a semantic layer that enhances their infrastructure rather than competing with it.

### Action Steps

#### Step 4.1: Map Federal Blockchain Landscape (Week 1)

**Active Programs:**

| Agency | Initiative | Contact Point |
|--------|------------|---------------|
| Treasury (Fiscal Service) | FIT blockchain grants | FIT@fiscal.treasury.gov |
| GAO | JFMIP blockchain initiative | jfmip@gao.gov |
| GSA | Blockchain working group | emerging.tech@gsa.gov |
| DHS/CBP | Supply chain blockchain | innovation@cbp.dhs.gov |
| DoD | Defense Innovation Unit | contact@diu.mil |

**Published Research to Review:**
- JFMIP: "Harnessing Blockchain in the Federal Government"
- GAO: Reports on blockchain in government
- NIST: Blockchain technology overview

#### Step 4.2: Position FORAY as Complementary Layer (Week 2)

**Messaging Framework:**

```
FORAY is not a blockchain platformâ€”it's a transaction semantic standard
that runs ON TOP OF existing blockchain infrastructure.

Your blockchain investment + FORAY = 
  Enhanced transaction semantics
  + Privacy-preserving audit
  + Cross-system interoperability

FORAY works with:
- Hyperledger Fabric (permissioned enterprise)
- Public blockchains (Kaspa, Ethereum, etc.)
- AWS QLDB (managed immutable ledger)
- Traditional databases + hash verification
```

#### Step 4.3: GSA Blockchain Working Group Engagement (Week 3)

**Join the community:**
- GSA's Emerging Citizen Technology Office coordinates blockchain efforts
- Request to join working group or mailing list
- Offer to present FORAY at working group meeting

**Contact:**
- Email: emerging.tech@gsa.gov
- Reference: Blockchain working group participation

#### Step 4.4: SBIR/STTR Opportunity Assessment (Weeks 4-8)

**Evaluate Small Business Innovation Research path:**

1. **Search for relevant topics:**
   - SBIR.gov topic search
   - Keywords: "audit," "blockchain," "financial management," "fraud prevention"

2. **Identify matching agencies:**
   - Treasury
   - HHS (grant program fraud)
   - DoD (defense contractor audit)

3. **Assess fit:**
   - SBIR requires commercializable technology
   - FORAY as open-source protocol may need business model wrapper
   - Consider: "FORAY implementation services" or "FORAY-based audit platform"

4. **If viable, prepare Phase I proposal:**
   - Typical award: $150K-$250K
   - Duration: 6-12 months
   - Deliverable: Feasibility study / prototype

---

## Timeline Summary

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Research FIT initiatives; Identify MN stakeholders | Gap analysis; Stakeholder map |
| 2 | Prepare FIT brief; Create MN materials; Congressional brief | Technical briefs (3) |
| 3 | Initial FIT contact; MN vendor registration; GSA outreach | Emails sent; Registrations filed |
| 4-6 | Follow-up; Legislative engagement; Monitor hearings | Meetings scheduled |
| 7-8 | SBIR assessment; Partnership discussions | Opportunity assessment |
| 9-12 | Pilot negotiations; Congressional testimony (if opportunity) | Pilot agreement(s) |

---

## Resource Requirements

### Time Investment
- Primary: 15-20 hours/week for Weeks 1-4
- Ongoing: 5-10 hours/week for monitoring and follow-up

### Materials Needed
- Technical briefs (created above)
- Demo environment (foray.dunin7.com already operational)
- Business cards / professional contact information
- Optional: Travel budget for DC meetings

### Professional Support (Optional but Recommended)
- Government affairs consultant (DC relationships)
- Federal procurement specialist (contract vehicles)
- Legal review of pilot agreement terms

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Federal agency meetings | 3+ | 90 days |
| Minnesota stakeholder meetings | 5+ | 60 days |
| Congressional staff briefings | 1+ | 120 days |
| Pilot program agreements | 1+ | 180 days |
| Media/publication mentions | 2+ | 180 days |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| No response from agencies | Multiple parallel outreach paths |
| Political sensitivity of Minnesota | Focus on technology, not politics |
| Procurement timeline too long | Pursue emergency/pilot authority |
| Competition from established vendors | Emphasize open source, no lock-in |
| Technical credibility questions | Offer live demos, GitHub transparency |

---

## Contact

- **Author:** Marvin Percival
- **Email:** marvinp@dunin7.com
- **GitHub:** [github.com/DUNIN7/foray-kaspathon](https://github.com/DUNIN7/foray-kaspathon)

---

*Document Version 1.0 â€” January 30, 2026*
