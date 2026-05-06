I am conducting a master class about spec driven development (SDD). 

# SYSTEM ROLE

You are an expert Spec-Driven Development (SDD) generator and reviewer.

Your task is to:
- Generate PRDs
- Convert PRDs into Epics, Stories, and ADRs
- Enforce strict spec completeness
- Ensure all stories are implementable and testable
- Reject ambiguous or non-deterministic requirements

# OUTPUT FORMAT RULES

All outputs MUST strictly follow this structure:

1. PRD
2. Epics
3. Stories (nested under Epics)
4. ADRs
5. AGENTS.md (if applicable)

Rules:
- No free-form explanations unless explicitly requested
- No missing sections
- No vague language (e.g. "works correctly", "good UX")
- All requirements must be testable or must be marked as "non-testable assumption"

<info_from_slides>

# Recap: The Spec Hierarchy (Module 01)
You learned the hierarchy — now you'll **build** one.

| Level | Purpose | What You'll Create Today |
|-------|---------|--------------------------|
| **PRD** | What & Why | Full PRD.MD for Task Management |
| **Epic** | Feature groups | 2-3 Epics decomposed |
| **Story** | Implementable units | Stories with acceptance criteria |
| **ADR** | Technical decisions | Architecture decisions documented |

**New concept today**: **Agents.MD** — your AI's onboarding document

# Complete Specification Hierarchy Example

## PRD: Customer Feedback Management System
*Problem*: Customers email support with feedback, causing inbox overload and lost insights
*Goal*: Centralized system for collecting, triaging, and responding to customer feedback
*Success Metric*: 80% of feedback categorized within 24 hours

## Epic 1: Feedback Submission
*Workflow*: Customer visits feedback page → Fills form → Submits → Receives confirmation

### Story 1.1: Submit feedback via web form
*As a customer, I want to submit feedback via web form, so that I can share my experience*
- ✅ Form has Name, Email, Category, Message fields
- ✅ Email validation
- ✅ Success message displayed

### Story 1.2: Email confirmation to customer
*As a customer, I want to receive email confirmation, so that I know my feedback was received*
- ✅ Email sent within 1 minute
- ✅ Email includes ticket number
- ✅ Email includes estimated response time

# Anatomy of a Great PRD

**Required Sections (Must Have)**

1. **Overview** (2-3 sentences: What & Why)
2. **Problem Statement** (What pain are we solving?)
3. **Goals** (What are we trying to achieve?)
4. **User Personas** (Who is this for?)
5. **User Stories** (High-level workflows)
6. **Success Metrics** (How do we measure success?)
7. **Scope** (What's IN and what's OUT)

**Optional Sections (Nice to Have)**

8. **Assumptions** (What are we assuming is true?)
9. **Constraints** (Technical, timeline, budget limitations)
10. **Dependencies** (What else must be true?)
11. **Risks** (What could go wrong?)

## Problem Statement: The Foundation

### What Makes a Good Problem Statement?
**Bad Example** (Vague):
> "We need better customer feedback"

**Good Example** (Specific):
> "Customer support receives 200+ feedback emails daily, causing:
> - 40% of feedback lost in inbox overload
> - No systematic categorization or prioritization
> - Average 5-day response time (target: 24 hours)
> - No visibility into feedback trends or common issues
>
> This results in frustrated customers and missed product insights."

### Problem Statement Formula:

1. **Current state** (what's happening now)
2. **Specific pain points** (quantified if possible)
3. **Impact** (why this matters)

## Goals: What Does Success Look Like?

### Goals vs Metrics

**Goals** (Qualitative):
- Centralize customer feedback collection
- Improve feedback response time
- Enable data-driven product decisions

**Success Metrics** (Quantitative):
- 90% of feedback submitted via system (not email) within 3 months
- 80% of feedback categorized within 24 hours
- Average response time < 48 hours
- 100% of feedback tracked with unique ticket numbers
- Monthly feedback trends dashboard available to product team

### SMART Criteria
✅ **S**pecific
✅ **M**easurable
✅ **A**chievable
✅ **R**elevant
✅ **T**ime-bound

## Scope: What We're Building (and NOT Building)

### In Scope (MVP)

✅ Web-based feedback submission form
✅ Email confirmation to customers
✅ Admin dashboard for triage
✅ Basic categorization (Bug, Feature, General)
✅ Ticket number generation
✅ Response via email

### Out of Scope (Future)

❌ Mobile app for submission
❌ Real-time chat support
❌ AI-powered auto-categorization
❌ Public feedback forum
❌ Integration with existing CRM
❌ Multi-language support

### Why "Out of Scope" Matters
Prevents scope creep, sets expectations, focuses MVP

## Understanding Your Users

### User Personas (Who)

**Persona 1: Sarah (Customer)**
- Uses product 3x/week
- Wants quick way to report bugs
- Tech-savvy, expects modern UX
- Pain: Email to support is slow, no visibility

**Persona 2: Mike (Support Manager)**
- Manages team of 5 support agents
- Needs to prioritize and assign feedback
- Pain: Email inbox chaos, no metrics

### User Stories (High-Level)
- **Sarah**: Submits feedback via simple form, gets instant confirmation
- **Mike**: Reviews feedback dashboard, categorizes/assigns tickets, tracks response times

---

# Decomposing PRD into Epics

## Decomposition Pattern

```
PRD: Customer Feedback Management
  ↓ "What are the major workflows?"
Epic 1: Feedback Submission
Epic 2: Feedback Triage
Epic 3: Feedback Resolution
Epic 4: Feedback Analytics
```

## How to Identify Epics

- **Look for user workflows** (beginning → end)
-  **Group related features** (submission form + confirmation = 1 Epic)
-  **Avoid technical groupings** (not "Database" or "API")
-  **Each Epic should deliver user value** independently

## Epic Size

- Typically 5-15 Stories per Epic
- Represents 2-4 weeks of work
- Includes multiple user touchpoints

# Anatomy of an Epic

## Epic Components

1. **Epic Name** (Concise, user-focused)
2. **Epic Description** (1-2 paragraphs)
3. **User Value** (Why this Epic matters)
4. **Workflow** (High-level flow)
5. **Acceptance Criteria** (Epic-level)
6. **Stories** (List of Stories, detailed separately)

## Example: Epic - Feedback Submission

**Description**: Enable customers to submit feedback via web form, receive confirmation, and track submission status

**User Value**: Customers have clear channel for feedback, reducing support email volume by 50%

**Workflow**: Customer visits feedback page → Fills form → Submits → Receives confirmation email → Can track status via ticket number

**Acceptance Criteria**:
- ✅ Feedback form accessible from main navigation
- ✅ Form collects required information (Name, Email, Category, Message)
- ✅ Confirmation email sent within 1 minute
- ✅ 95% form submission success rate

# Breaking Epics into Stories

## Story Decomposition Pattern

```
Epic: Feedback Submission
  ↓ "What are the specific features?"
Story 1: Display feedback form
Story 2: Validate form inputs
Story 3: Submit feedback to backend
Story 4: Send confirmation email
Story 5: Display success message
```

## Story Identification Technique

- **Look at workflow**: Each major step = potential Story
- **Apply INVEST criteria** (next slide)
- **Ask**: "Can ONE developer build this in ONE sprint?"
  - If YES → Good Story size
  - If NO → Break down further

## INVEST: Quality Checklist for Stories

### INVEST Criteria

✅ **I**ndependent (Can be built separately)
✅ **N**egotiable (Details can be discussed)
✅ **V**aluable (Delivers user value)
✅ **E**stimable (Can estimate effort)
✅ **S**mall (Fits in one sprint)
✅ **T**estable (Can verify it's done)

### Example Analysis

**Story**: "As a customer, I want to submit feedback via web form"
- ✅ **Independent**: Can build without other Stories complete
- ✅ **Negotiable**: Fields, validation rules can be refined
- ✅ **Valuable**: Customer can submit feedback (core value)
- ✅ **Estimable**: ~2-3 days (clear scope)
- ✅ **Small**: Fits in one sprint
- ✅ **Testable**: Can verify form submits successfully

## Acceptance Criteria: How We Know It's Done

### Acceptance Criteria Rules

1. **Specific and measurable** (not vague)
2. **Testable** (can verify true/false)
3. **User-focused** (what user experiences)
4. **Necessary** (must have, not nice-to-have)

### Bad Example (Vague)
- ❌ "Form works correctly"
- ❌ "Validation is good"
- ❌ "User is happy"

### Good Example (Specific)
- ✅ "Form has fields: Name (text), Email (email), Category (dropdown), Message (textarea)"
- ✅ "Email field shows error message if format is invalid (e.g., missing @)"
- ✅ "Submit button is disabled until all required fields have valid input"
- ✅ "Success message 'Thank you! Your feedback has been submitted.' displays after submission"
- ✅ "Form clears after successful submission"

## Agents.MD: Your AI Coding Assistant Configuration

### What is Agents.MD?

A **configuration file** that tells AI assistants HOW to implement your specifications

### Agents.MD Contents

1. **Project context** (what system is this)
2. **Tech stack** (languages, frameworks, tools)
3. **Coding standards** (naming, structure, patterns)
4. **Testing requirements** (what tests to write)
5. **Documentation requirements** (comments, README)
6. **File structure** (where to put code)
7. **Quality criteria** (what "good" looks like)

### Why Agents.MD Matters

- **Consistency**: All AI-generated code follows same standards
- **Context**: AI understands project conventions
- **Quality**: AI knows your quality bar
- **Efficiency**: Don't re-explain standards each prompt

## Agents.MD Structure

```markdown
# Agent Instructions for [Project Name]
## Project Context
[Brief description of what you're building]

## Tech Stack
- Language: [e.g., TypeScript]
- Framework: [e.g., React]
- Testing: [e.g., Jest, React Testing Library]
- Linting: [e.g., ESLint with Airbnb config]

## Coding Standards
- Naming: camelCase for variables, PascalCase for components
- File structure: One component per file
- Imports: Group by external, internal, relative
- Comments: JSDoc for public functions

## Testing Requirements
- Unit test for all utility functions (80% coverage)
- Component tests for user interactions
- Test file naming: [component].test.tsx

## Quality Criteria
- No console.log in production code
- All props validated with TypeScript types
- Error handling for all API calls
- Accessible UI (ARIA labels, keyboard navigation)

## When Implementing Stories
1. Read Story acceptance criteria carefully
2. Follow project conventions from this file
3. Write tests FIRST (TDD approach)
4. Implement to make tests pass
5. Refactor for clarity
6. Add JSDoc comments for exported functions
```

# Architecture Decision Records in AI-Native Development
- **Module Focus:** Capturing technical decisions that guide AI implementation
- **Key Question:** How do we document WHY we made technical choices?
- **Practical Outcome:** ADRs that prevent re-litigating decisions and guide AI consistently

## How ADRs Evolve
**ADR Status Flow:**
```
Proposed → Accepted → (Superseded | Deprecated)
```

**Status Definitions:**

**Proposed** 📝
- Decision under discussion
- Not yet binding
- Gathering feedback and alternatives

**Accepted** ✅
- Decision made and active
- Guides current implementation
- Team is committed to this approach

**Superseded** 🔄
- Replaced by a newer decision
- Historical record remains
- Points to superseding ADR

**Deprecated** ⚠️
- No longer recommended but not replaced
- Existing code may still use it
- New code should avoid

**Rejected** ❌ (less common)
- Explicitly decided NOT to adopt
- Documents what we considered but rejected

## How ADRs Fit in the Specification Hierarchy
**Comparison:**

| **Document** | **Purpose** | **Audience** | **Scope** | **Stability** |
|--------------|-------------|--------------|-----------|---------------|
| **PRD** | WHAT & WHY (product) | Stakeholders, PMs | Product goals, user needs | Stable (quarters) |
| **Epic** | WHAT (features) | Dev team, PMs | Feature groupings | Stable (weeks) |
| **Story** | HOW (implementation) | Developers, QA | Specific functionality | Stable (days) |
| **ADR** | WHY (technical decisions) | Architects, Developers | Technical choices | Permanent (immutable) |
| **Agents.MD** | HOW (standards) | AI, Developers | Coding conventions | Living (continuous) |

**Relationship:**
- **PRD** sets product direction
- **ADRs** capture technical decisions to achieve PRD goals
- **Stories** implement features guided by ADRs
- **Agents.MD** enforces standards across implementation

**Use Together:** PRD (what to build) + ADR (how to build technically) + Stories (specific features) + Agents.MD (coding rules) = Complete specification

## ADR Structure (Standard Format)
**Standard ADR Template:**

```markdown
# ADR-[NUMBER]: [TITLE]

## Status
[Proposed | Accepted | Superseded | Deprecated]

## Context
[What is the issue we're trying to solve?
What are the forces at play?
What are the constraints?]

## Decision
[What is the change we're proposing/making?
What is the specific technology/pattern we're adopting?]

## Consequences
[What becomes easier or more difficult?
Positive consequences?
Negative consequences?
Risks introduced?]

## Alternatives Considered
[What other options did we evaluate?
Why did we reject them?]
```

**Key Sections:**
1. **Status:** Current state of decision
2. **Context:** Problem and constraints
3. **Decision:** What we chose
4. **Consequences:** Trade-offs
5. **Alternatives:** What we rejected and why

## Decision: Be Specific and Actionable
**Bad Decision (Vague):**
```markdown
## Decision
We will use a relational database.
```
❌ **Problem:** Which one? What version? How deployed?

**Better Decision (Specific):**
```markdown
## Decision
We will use PostgreSQL 15 as our primary relational database.
```
✅ **Improvement:** Specific technology and version

**Best Decision (Specific + Actionable):**
```markdown
## Decision
We will migrate from MongoDB to PostgreSQL 15 for primary
data storage, following this approach:

1. **Database:** PostgreSQL 15 (latest stable)
2. **Hosting:** AWS RDS for PostgreSQL (t3.medium instance)
3. **Migration Strategy:** Dual-write pattern (4-week transition)
   - Week 1-2: Write to both MongoDB and PostgreSQL
   - Week 3: Switch reads to PostgreSQL, validate data parity
   - Week 4: Deprecate MongoDB, PostgreSQL becomes primary
4. **Schema Design:** Normalized schema with foreign keys
5. **ORM:** Use Prisma for type-safe database access
6. **Backups:** Automated daily backups with 30-day retention

**Implementation starts:** Q3 2025
**Migration complete by:** End of Q3 2025
```
✅✅ **Best:** Specific technology, approach, timeline, success criteria

**Decision Checklist:**
- [ ] Specific technology/pattern named
- [ ] Version specified
- [ ] Implementation approach outlined
- [ ] Timeline provided
- [ ] Success criteria defined

</info_from_slides>