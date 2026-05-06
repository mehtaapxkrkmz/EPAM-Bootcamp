# Module 03 Lab Guide: Hands-On Memory Bank Creation

**Module:** 03 - Context Engineering: Memory Banks
**Duration:** 35 minutes
**Format:** Individual work with peer review
**Difficulty:** Intermediate

---

## Lab Overview

**What You'll Build:**
Complete memory banks for your project including architecture overview, coding conventions, domain glossary, and development workflow. You'll test AI output quality with and without memory banks to measure impact.

**Learning Objectives:**
By the end of this lab, you will be able to:
1. ✅ Create a structured memory bank with appropriate folder organization
2. ✅ Write effective architecture documentation for AI consumption
3. ✅ Define domain-specific terminology and concepts
4. ✅ Document coding conventions and workflows
5. ✅ Measure AI output improvement quantitatively (before/after comparison)
6. ✅ Refine memory banks based on AI output quality

**Prerequisites:**
- Completion of Module 02 (you should have PRD, Epics, Stories, Agents.MD)
- Access to AI coding assistant (Claude Code, GitHub Copilot CLI, or similar)
- Your Module 02 project files available

**Deliverables:**
- [ ] Memory bank structure (folders and README)
- [ ] Architecture overview documentation
- [ ] Domain glossary with project-specific terms
- [ ] Coding conventions document
- [ ] Development workflow documentation
- [ ] Before/after AI output comparison demonstrating improvement

---

## Lab Structure & Timing

| **Phase** | **Activity** | **Duration** | **Checkpoint** |
|-----------|--------------|--------------|----------------|
| **Phase 1** | Create memory bank structure | 8 min | ✅ Folders and README created |
| **Phase 2** | Write architecture overview | 10 min | ✅ Architecture documented |
| **Phase 3** | Write conventions and domain | 12 min | ✅ Standards and glossary complete |
| **Phase 4** | Write workflow documentation | 7 min | ✅ Workflow documented |
| **Phase 5** | Test AI outputs (before/after) | 8 min | ✅ Comparison complete |

**Total:** 45 minutes

---

## Phase 1: Create Memory Bank Structure (8 minutes)

### **Step 1: Set Up Folder Structure (5 minutes)**

**Navigate to your Module 02 project folder:**

```bash
# Navigate to your project from Module 02
cd <your-project-folder>

# Create memory bank structure
mkdir -p memory-banks/{architecture,conventions,domain,workflows,roles}
cd memory-banks
```

**Create initial files:**

```bash
touch README.md
touch architecture/overview.md
touch conventions/coding-standards.md
touch domain/glossary.md
touch workflows/development-process.md
```

**Verify structure:**

```bash
tree .
# Should show:
# memory-banks/
# ├── README.md
# ├── architecture/
# │   └── overview.md
# ├── conventions/
# │   └── coding-standards.md
# ├── domain/
# │   └── glossary.md
# ├── workflows/
# │   └── development-process.md
# └── roles/
```

---

### **Step 2: Write README Navigation (10 minutes)**

**Open `README.md` and create navigation structure:**

Use AI to help draft, then refine:

**Prompt for AI:**
```
Create a README.md for memory banks that provides navigation to:
- architecture/: System design, tech stack, deployment
- conventions/: Coding standards, testing patterns
- domain/: Business terms, rules, personas
- workflows/: Development, review, deployment processes
- roles/: Role-specific context (developer, QA, PM)

Format as a clear navigation guide for AI assistants working on [YOUR PROJECT NAME].
```

**Expected README structure:**

```markdown
# Memory Banks - [Your Project Name]

## Purpose
This memory bank provides persistent context for AI assistants working on
[your project]. It contains architectural decisions, coding conventions,
domain knowledge, and workflows that should guide all AI-generated code.

## Structure

### architecture/
System architecture, technology stack, deployment approach, and key
architectural decisions.

### conventions/
Coding standards, naming conventions, testing patterns, error handling,
and quality criteria.

### domain/
Domain-specific terminology, business rules, user personas, and key
concepts unique to this project.

### workflows/
Development processes, code review procedures, deployment workflows,
and team collaboration patterns.

### roles/
Role-specific context for different team members (developers, QA engineers,
product managers).

## Quick Navigation
- [Architecture Overview](architecture/overview.md)
- [Coding Standards](conventions/coding-standards.md)
- [Domain Glossary](domain/glossary.md)
- [Development Workflow](workflows/development-process.md)

## How to Use
When asking AI to generate code or documentation for this project, reference
the relevant memory bank files to provide context. Most AI assistants can
load these files automatically from the project directory.

## Maintenance
Review and update quarterly or when major architectural/process changes occur.
Version control these files alongside project code.

**Last Updated:** [Today's Date]
**Version:** 1.0
```

**✅ Checkpoint (15 minutes):** You have folder structure and README navigation

**Facilitator Check-In:**
"First checkpoint at 15 minutes. You should have your folder structure created and README written. The README is your table of contents—make sure it clearly explains each folder's purpose."

---

## Phase 2: Write Architecture Overview (10 minutes)

### **Step 3: Document System Architecture (20 minutes)**

**Open `architecture/overview.md`**

**Use your Module 02 PRD, Agents.MD, and Epics as source material.**

**Prompt for AI (customize with your project details):**

```
Based on the following project details from my PRD and Agents.MD, create an
architecture overview for memory banks:

[PASTE KEY DETAILS FROM YOUR PRD]:
- Project description and goals
- User personas and their needs
- Success metrics
- Tech stack from Agents.MD

Create an architecture overview with these sections:
1. System Architecture (pattern: monolith/microservices/serverless, key components)
2. Tech Stack (languages, frameworks, databases, infrastructure)
3. Deployment (CI/CD approach, environments, deployment strategy)

Format for AI assistant consumption. Include rationale for key decisions.
```

**Required sections in architecture overview:**

#### **1. System Architecture**

Document:
- **Architecture pattern** (monolith, microservices, event-driven, etc.)
- **Key components** and their responsibilities
- **Communication patterns** (REST, GraphQL, messaging, etc.)
- **Data flow** (how data moves through the system)

**Example:**
```markdown
## System Architecture

### Pattern: Microservices
We use a microservices architecture to support:
- Independent deployment of services
- Team autonomy across distributed locations
- Scalability of individual components

### Core Services
- **[service-name]**: [responsibility]
- **[service-name]**: [responsibility]

### Communication
- **Synchronous**: REST APIs for request/response
- **Asynchronous**: Message queue for event-driven workflows
```

---

#### **2. Tech Stack**

Document:
- **Backend**: Languages, frameworks, runtime versions
- **Frontend**: Languages, frameworks, UI libraries
- **Database**: Type, version, ORM/query builder
- **Infrastructure**: Cloud provider, containers, orchestration
- **Testing**: Frameworks and tools

**Example:**
```markdown
## Tech Stack

### Backend
- **Language**: [language + version]
- **Framework**: [framework + version]
- **Database**: [database + version]
- **ORM**: [ORM if applicable]

### Frontend
- **Framework**: [framework + version]
- **Language**: [language if different from backend]
- **State Management**: [Redux, Context API, etc.]

### Infrastructure
- **Cloud Provider**: [AWS, Azure, GCP, self-hosted]
- **Containers**: [Docker, Podman]
- **CI/CD**: [GitHub Actions, Jenkins, etc.]
```

---

#### **3. Deployment**

Document:
- **Environments** (dev, staging, production)
- **CI/CD pipeline** (trigger, steps, deployment target)
- **Deployment strategy** (rolling, blue-green, canary)
- **Rollback approach**

**Example:**
```markdown
## Deployment

### Environments
- **dev**: Automatic deployment on merge to develop branch
- **staging**: Manual promotion for QA testing
- **production**: Manual promotion with blue-green deployment

### CI/CD Pipeline
1. Code pushed to GitHub triggers workflow
2. Automated tests and linting run
3. Docker image built and pushed to registry
4. Deployment to target environment
5. Health checks verify deployment success

### Strategy
- **Blue-Green**: Zero-downtime deployments with instant rollback
- **Rollback**: Revert to previous version if health checks fail
```

---

**✅ Checkpoint (35 minutes total):** Architecture overview complete (1-2 pages)

**Facilitator Check-In:**
"Checkpoint at 35 minutes. Your architecture overview should be complete. This is often the highest-impact memory bank file. Make sure you've documented your architecture pattern, tech stack with specific versions, and deployment approach."

---

## Phase 3: Write Conventions and Domain (12 minutes)

### **Step 4: Document Coding Conventions (12 minutes)**

**Open `conventions/coding-standards.md`**

**Source material: Your Agents.MD from Module 02 + any additional conventions**

**You've already done most of this work in Module 02!** Pull content from your Agents.MD and expand if needed.

**Required sections:**

```markdown
# Coding Standards: [Project Name]

## Naming Conventions
- **Files**: [kebab-case, snake_case, PascalCase]
- **Classes**: [PascalCase, etc.]
- **Functions/Variables**: [camelCase, snake_case, etc.]
- **Constants**: [UPPER_SNAKE_CASE, etc.]
- **Database Tables**: [convention]

## File Structure
[Document your project's folder organization]

## Code Organization
- Maximum function length: [X lines]
- One class per file: [yes/no]
- DRY principle: [when to extract shared logic]

## Comments
- Docstrings required for: [all public methods, classes, etc.]
- Inline comments: [when to use]
- TODOs format: [// TODO(username): Description]

## Testing Requirements
- Test types: [unit, integration, E2E]
- Coverage targets: [percentage]
- Test file naming: [convention]
- Test organization: [mirror src/ structure, separate tests/ folder]

## Error Handling
- Error response format: [standardized format]
- Logging requirements: [when and what to log]
- Exception types: [custom exceptions to use]

## Quality Criteria
- Definition of "done": [checklist]
- Code review checklist: [what reviewers check]
- Performance expectations: [response times, etc.]
```

**Pro Tip:** Ask AI to help expand your Agents.MD into this format:

**Prompt:**
```
Using my Agents.MD file [PASTE AGENTS.MD CONTENT], expand it into a comprehensive
coding standards document with sections for naming conventions, file structure,
code organization, comments, testing, error handling, and quality criteria.

Add specific examples where helpful.
```

---

### **Step 5: Create Domain Glossary (13 minutes)**

**Open `domain/glossary.md`**

**Source material: Your PRD (user personas, domain concepts), Epics, Stories**

**Identify terms to define:**

Ask yourself:
- What terms are specific to my project domain?
- What concepts might AI misunderstand or misinterpret?
- What acronyms or jargon do we use?
- What business rules are important?

**Required content:**

```markdown
# Domain Glossary: [Project Name]

## [Term 1]
**Definition:** [Brief definition]

**Context:** [Why this term matters, how it's used]

**Example:** [Usage example if helpful]

---

## [Term 2]
**Definition:** [Brief definition]

**Relationships:** [How it relates to other terms]

---

## Key Business Rules

### [Rule Name]
**Rule:** [Statement of rule]
**Rationale:** [Why this rule exists]
**Example:** [Concrete example]
```

**Example entries:**

```markdown
## Sprint vs Bolt
**Definition:** In this project, we use "bolts" (short cycles of hours to days)
instead of traditional 2-week "sprints."

**Context:** Following AWS AI-DLC methodology. Emphasizes rapid iteration.

**Usage:** Say "Let's tackle this in the next bolt" NOT "next sprint."

---

## Task Status Lifecycle
**Definition:** Tasks move through these states: TODO → IN_PROGRESS → IN_REVIEW → DONE

**Business Rule:** Tasks cannot skip states. A task cannot go directly from
TODO to DONE without passing through IN_PROGRESS and IN_REVIEW.

**Rationale:** Ensures code review happens for all implemented tasks.
```

**Prompt for AI:**
```
Based on my PRD [PASTE KEY SECTIONS] and project domain, identify 5-7 key terms
that are specific to this project and should be defined in a domain glossary.

For each term, provide:
- Definition
- Context (why it matters)
- Example usage (if helpful)

Format as a glossary for AI assistant consumption.
```

---

**✅ Checkpoint (60 minutes total):** Conventions and domain glossary complete

**Facilitator Check-In:**
"Checkpoint at 60 minutes. You should have coding conventions and domain glossary complete. Your conventions should pull heavily from Module 02's Agents.MD. Your glossary should define 5-10 project-specific terms that AI wouldn't otherwise know."

---

## Phase 4: Write Workflow Documentation (7 minutes)

### **Step 6: Document Development Workflow (15 minutes)**

**Open `workflows/development-process.md`**

**Document how your team actually works** (or how you want to work).

**Required sections:**

```markdown
# Development Workflow: [Project Name]

## Development Process

### From Idea to Production
1. [Step 1: e.g., Create Epic and User Stories]
2. [Step 2: e.g., Break down into Tasks]
3. [Step 3: e.g., Implement with tests]
4. [Step 4: e.g., Code review]
5. [Step 5: e.g., Deploy to staging]
6. [Step 6: e.g., Deploy to production]

## Branching Strategy
- **Pattern**: [Git flow, trunk-based development, GitHub flow]
- **Branch naming**: [feature/, bugfix/, hotfix/]
- **Main branches**: [main, develop, etc.]
- **Protection rules**: [e.g., main requires PR + approval]

## Pull Request Process

### Before Creating PR
- [ ] All tests passing locally
- [ ] Code linted and formatted
- [ ] Self-review completed
- [ ] Documentation updated

### PR Requirements
- **Reviewers**: [Number required, who reviews]
- **Checks**: [CI/CD checks that must pass]
- **Description**: [What should be included]

### Code Review Checklist
- [ ] Follows coding conventions
- [ ] Tests cover new functionality
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] Performance acceptable

## Testing Strategy

### Test Types
- **Unit Tests**: [What should be unit tested]
- **Integration Tests**: [What should be integration tested]
- **E2E Tests**: [What should be E2E tested]

### Coverage Requirements
- **Minimum**: [e.g., 80% code coverage]
- **Critical Code**: [e.g., 100% for security/payment logic]

### When to Write Tests
- [TDD approach? Tests after implementation?]

## Deployment Process

### Manual Steps
1. [Step-by-step deployment procedure]

### Automated Steps
- [What happens automatically in CI/CD]

### Verification
- [How to verify deployment succeeded]

### Rollback Procedure
- [How to rollback if issues occur]
```

**Prompt for AI:**
```
Create a development workflow document for [PROJECT NAME] that includes:

1. Development process from idea to production
2. Branching strategy: [YOUR PREFERRED STRATEGY]
3. Pull request process and code review checklist
4. Testing strategy with coverage requirements
5. Deployment process and rollback procedure

Format for AI assistant consumption. Be specific about requirements.
```

**✅ Checkpoint (75 minutes total):** Development workflow documented

**Facilitator Check-In:**
"Checkpoint at 75 minutes. Workflow documentation should be complete. This tells AI how your team works together. If you don't have a formal process yet, document your ideal process—this is a great opportunity to codify best practices."

---

## Phase 5: Test AI Outputs (Before/After) (8 minutes)

### **Step 7: Measure Memory Bank Impact (15 minutes)**

**This is the critical validation step.** You need to prove memory banks actually improve AI output.

**Testing procedure:**

#### **A. Choose a Test Task (2 minutes)**

Select a User Story from your Module 02 work. Choose something implementable:
- API endpoint creation
- Database model definition
- Utility function
- Component/page structure

**Example:** "Generate API endpoint for creating [entity] with validation"

---

#### **B. Generate Code WITHOUT Memory Banks (5 minutes)**

**Start fresh AI session (no context loaded):**

```
Generate [YOUR TASK DESCRIPTION] for [BASIC PROJECT INFO].

[Keep prompt generic - don't provide specific tech stack, conventions, etc.]
```

**Save the output** (copy to a file like `output-without-memory.md`)

**Document observations:**
- Does it use the right tech stack?
- Does it follow your conventions?
- Does it include required features (logging, error handling, tests)?
- What would you need to correct?

---

#### **C. Generate Code WITH Memory Banks (5 minutes)**

**Start fresh AI session, load memory banks:**

Depending on your AI tool:
- **Cline**: Place memory banks in `.cline/memory/` (loads automatically)
- **GitHub Copilot**: Use workspace context in `.github/copilot/`
- **Claude Code**: Use `.claude/` directory
- **Manual**: Copy/paste memory bank contents into context

**Use the SAME prompt as step B:**

```
Generate [YOUR TASK DESCRIPTION] for [BASIC PROJECT INFO].

[Same generic prompt - but memory banks are loaded in context]
```

**Save the output** (copy to a file like `output-with-memory.md`)

---

#### **D. Compare and Document (3 minutes)**

**Create comparison document: `memory-bank-impact.md`**

```markdown
# Memory Bank Impact Analysis

## Test Task
[Describe what you asked AI to generate]

## Prompt Used
```
[Paste your prompt]
```

## Results WITHOUT Memory Banks

### Generated Code
[Paste or describe key parts]

### Issues Found
- ❌ [Issue 1: e.g., Used wrong database library]
- ❌ [Issue 2: e.g., Missing error handling]
- ❌ [Issue 3: e.g., Wrong naming convention]
- ❌ [Issue 4: e.g., No logging]
- ❌ [Issue 5: e.g., No tests generated]

### Estimated Correction Time
[X minutes to fix all issues]

## Results WITH Memory Banks

### Generated Code
[Paste or describe key parts]

### Improvements
- ✅ [Improvement 1: e.g., Used correct Prisma ORM]
- ✅ [Improvement 2: e.g., Standardized error handling]
- ✅ [Improvement 3: e.g., Followed kebab-case convention]
- ✅ [Improvement 4: e.g., Included structured logging]
- ✅ [Improvement 5: e.g., Generated Jest tests]

### Remaining Issues (if any)
- ⚠️ [Minor issue that still needs correction]

### Estimated Correction Time
[X minutes - should be significantly less]

## Impact Summary

**Time Saved:** [Y minutes per generation]
**Quality Improvement:** [Percentage of issues prevented]
**Key Learning:** [What memory bank file had biggest impact]

## Refinements Needed
Based on this test, I should improve my memory banks by:
- [Refinement 1]
- [Refinement 2]
```

---

**✅ Checkpoint (90 minutes total):** Before/after comparison complete

**Facilitator Check-In:**
"Checkpoint at 90 minutes. You should have completed your before/after test. This comparison is gold—it quantifies the value of memory banks. Document the time saved and quality improvements. You'll share this in peer review."

---

## Phase 6: Peer Review and Refinement (20 minutes)

### **Step 8: Peer Review Exchange (15 minutes)**

**Find a partner or form a group of 3.**

**Each person shares (5 minutes per person):**

#### **1. Memory Bank Structure (1 min)**
- Show your folder structure and README
- What files did you create?
- What did you prioritize?

#### **2. Before/After Comparison (3 min)**
- Show your memory-bank-impact.md
- What improved with memory banks?
- What was the time savings?
- What memory bank file had the biggest impact?

#### **3. Challenges & Questions (1 min)**
- What was difficult to document?
- What are you unsure about?
- What would you do differently?

---

**Peer Reviewer Provides Feedback:**

**✅ What's Working Well:**
- "Your architecture overview is very specific with exact versions..."
- "The domain glossary clearly defines [term]..."
- "The before/after shows significant improvement in..."

**🔧 Suggestions for Improvement:**
- "Consider adding [missing concept] to domain glossary..."
- "Your conventions document could specify [detail]..."
- "The workflow might benefit from [addition]..."

**❓ Clarifying Questions:**
- "How will you handle [edge case]?"
- "Why did you choose [approach] over [alternative]?"
- "What happens when [scenario occurs]?"

---

### **Step 9: Refine Based on Feedback (5 minutes)**

**Make quick refinements based on peer feedback:**

- Add missing terms to glossary
- Clarify ambiguous sections
- Add examples where helpful
- Fix any errors spotted

**Document feedback received:**

Create a brief `IMPROVEMENTS.md`:

```markdown
# Memory Bank Improvements (from peer review)

## Feedback Received
- [Feedback 1 from peer reviewer]
- [Feedback 2 from peer reviewer]

## Changes Made
- [Change 1]
- [Change 2]

## Future Improvements (next iteration)
- [Improvement to make when I have more time]
- [Improvement to make when I have more time]
```

---

**✅ Checkpoint (110 minutes total):** Peer review complete, refinements made

**Facilitator Check-In:**
"Final checkpoint at 110 minutes. You've completed peer review and made refinements. Excellent work! Let's debrief as a group about what we learned."

---

## Lab Completion Checklist

Before moving to the next module, ensure you have:

**Core Deliverables:**
- [ ] Memory bank folder structure (architecture, conventions, domain, workflows)
- [ ] README.md with navigation
- [ ] architecture/overview.md with system design, tech stack, deployment
- [ ] conventions/coding-standards.md with naming, structure, testing requirements
- [ ] domain/glossary.md with 5-10 project-specific terms
- [ ] workflows/development-process.md with dev process, branching, PR requirements
- [ ] memory-bank-impact.md with before/after comparison

**Quality Validation:**
- [ ] Architecture overview includes specific versions (not "a database" but "PostgreSQL 15")
- [ ] Conventions document is consistent with Agents.MD from Module 02
- [ ] Domain glossary defines terms AI wouldn't know otherwise
- [ ] Workflow documentation reflects your actual (or ideal) process
- [ ] Before/after comparison shows measurable improvement

**Process Validation:**
- [ ] You used AI to help draft memory bank content
- [ ] You refined AI outputs with project-specific details
- [ ] You tested memory banks with actual code generation
- [ ] You received peer feedback and made refinements

**✅ If you checked all boxes above, you've successfully completed Module 03!**

---

## Troubleshooting Guide

### **Issue: AI generates generic memory bank content**

**Symptoms:** Memory banks read like generic templates, not specific to your project

**Solution:** Add project-specific details

**Example fix:**
- ❌ Generic: "We use a microservices architecture"
- ✅ Specific: "We use microservices with 4 core services (task-service, user-service, notification-service, integration-service) communicating via RabbitMQ for async events"

**Refinement approach:**
```
This is too generic. Here are specific details about our project:
[Add 5-7 specific facts about your architecture, tech stack, or domain]
Please revise to reflect these specific details.
```

---

### **Issue: Memory banks are too large (exceeding token limits)**

**Symptoms:** Memory bank files are 20+ pages each, total exceeds 100 pages

**Solution:** Focus on high-level decisions and patterns, not implementation details

**What to remove:**
- Detailed code examples (link to actual code instead)
- Implementation specifics ("use this exact algorithm")
- Repetitive information across files
- Generated documentation (use source of truth)

**Keep:**
- Architectural patterns and rationale
- Tech stack choices and versions
- Coding conventions and standards
- Domain-specific terminology
- High-level workflows

**Rule of thumb:** 5-20 pages total for most projects

---

### **Issue: Before/after test shows no improvement**

**Symptoms:** AI output is similar with and without memory banks

**Possible causes:**
1. **Memory banks not actually loaded** - Verify memory banks are in correct location for your AI tool
2. **Memory banks too generic** - Add more project-specific details
3. **Test task too simple** - Choose a task that requires project-specific knowledge
4. **Wrong sections emphasized** - Architecture and domain usually have biggest impact

**Debugging steps:**
1. Verify memory banks are loading (ask AI "What do you know about this project's architecture?")
2. Choose a more complex test task (e.g., full API endpoint with validation, logging, error handling)
3. Add more specifics to architecture overview and domain glossary
4. Test again

---

### **Issue: Don't know what tech stack to use**

**Symptoms:** Your Module 02 project didn't specify tech stack, now stuck on architecture overview

**Solution:** Let AI suggest based on project type

**Prompt:**
```
I'm building [PROJECT DESCRIPTION from your PRD]. Suggest a modern, production-ready
tech stack including:
- Backend language and framework
- Frontend language and framework
- Database
- Infrastructure/deployment platform
- Testing tools

Explain why each choice makes sense for this project type.
```

Accept AI's suggestion unless you have specific constraints.

---

### **Issue: Unsure what to put in domain glossary**

**Symptoms:** Can't identify project-specific terms

**Solution:** Look for these clues in your PRD and Epics:

**Clues that indicate a term needs definition:**
- Acronyms (MRP, ADR, PRD itself)
- Industry jargon (bolt, sprint, epic, story)
- Project-specific concepts (async-first workflow, blue-green deployment)
- Terms that could be misunderstood ("task" in task manager vs generic "task")
- Business rules that aren't obvious from code

**Prompt for AI:**
```
Review my PRD [PASTE PRD] and identify 5-7 terms that are:
1. Specific to this project domain
2. Could be misunderstood by AI without definition
3. Are acronyms or jargon
4. Represent important business concepts

For each term, provide a brief definition and explain why it needs to be
explicitly defined in a memory bank.
```

---

## Post-Lab Resources

### **For Continued Learning:**

**Memory Bank Best Practices:**
- Keep memory banks in version control alongside code
- Review and update quarterly or after major changes
- Treat as living documentation, not static artifacts
- Use pull request process for memory bank updates

**Tool-Specific Guides:**
- **Cline Memory Banks:** `.cline/memory/` directory structure
- **GitHub Copilot Workspace Context:** `.github/copilot/` configuration
- **Claude Code Project Instructions:** `.claude/` directory
- **Custom RAG:** Vector database implementations (Pinecone, Weaviate)

**Scaling Memory Banks:**
- Start with 4-5 files, 5-20 pages total
- Add role-specific memory banks as team grows
- Split large files into smaller, focused files
- Use subdirectories for complex domains (e.g., `domain/user-management/`, `domain/billing/`)

---

### **Practice Opportunities:**

**Apply to Your Work:**
- Implement memory banks for a real work project this week
- Track metrics: time saved, rework reduced, consistency improved
- Share with your team and iterate based on feedback

**Challenge Yourself:**
- Create role-specific memory banks (roles/developer.md, roles/qa.md, roles/pm.md)
- Add visual diagrams to architecture overview
- Create procedure memory banks for complex workflows (e.g., incident response, onboarding)

---

## Summary & Next Steps

**What You Accomplished:**

In this 110-minute lab, you:
✅ Created structured memory banks with proper organization
✅ Documented architecture, conventions, domain, and workflows
✅ Tested AI output quality with and without memory banks
✅ Measured quantifiable improvement (before/after comparison)
✅ Received peer feedback and refined your memory banks

**Key Takeaways:**

1. **Memory banks provide persistent context** - AI remembers your project across sessions
2. **Start simple, iterate** - 4-5 files, 5-20 pages is enough to start
3. **Architecture and domain have biggest impact** - Focus here first
4. **Testing proves value** - Before/after comparison shows measurable ROI
5. **Maintenance is manageable** - Quarterly review, version control, living documentation

**What's Next:**

**Module 06: SpecKit Framework**
- GitHub's open-source toolkit for spec-driven development
- Orchestrating Specify → Plan → Tasks → Implement
- Integrating PRD (Module 02) + Memory Banks (Module 03)
- End-to-end workflow automation

**Before Next Module:**

**Required:**
- [ ] Keep your memory banks from today
- [ ] Test memory banks with 2-3 more code generation tasks
- [ ] Refine based on what you learn

**Optional (Recommended):**
- [ ] Implement memory banks for a real work project
- [ ] Track before/after metrics over 1 week
- [ ] Share with team and gather feedback
- [ ] Add role-specific memory banks if your team is distributed

---

**End of Lab Guide**
**Version:** 1.0
**Last Updated:** January 11, 2025
**Module:** 03 - Context Engineering: Memory Banks
