# Memory Banks — Personal Task Board

## Purpose

This memory bank provides persistent context for AI assistants working on the **Personal Task Board** project. It contains architectural decisions, coding conventions, domain knowledge, and workflows that should guide all code generation, reviews, and documentation.

Think of this as a searchable knowledge base that ensures consistency, quality, and alignment across all AI-assisted work.

---

## Navigation Guide

### 🏗️ [architecture/](architecture/) — System Design & Tech Stack
Contains technical architecture, technology decisions, system design patterns, and deployment strategies.

**Current files:**
- [overview.md](architecture/overview.md) — High-level system design, tech stack (React 18, Vite, TypeScript), deployment approach, and ADR references

**Use when:**
- Designing new features or system components
- Making technology or framework decisions
- Understanding how systems integrate
- Reviewing architecture alignment

**Examples:**
- "How should I structure the state management for multi-project support?"
- "What's our approach to localStorage vs. IndexedDB?"
- "How do we handle offline-first architecture?"

---

### 📋 [conventions/](conventions/) — Coding Standards & Quality Criteria
Defines coding style, naming conventions, testing requirements, error handling patterns, and quality gates.

**Current files:**
- [coding-standards.md](conventions/coding-standards.md) — Naming conventions, file structure, code organization, TypeScript rules, comment style, testing requirements, error handling, and Definition of Done

**Use when:**
- Writing or reviewing React components
- Creating hooks or utilities
- Setting up test files
- Ensuring code quality compliance
- Reviewing pull requests

**Examples:**
- "Should I use a custom hook or local component state?"
- "What's the naming convention for localStorage keys?"
- "How much test coverage is required for this feature?"
- "How do I structure my component file?"

---

### 🎯 [domain/](domain/) — Business Terms & User Personas
Defines domain terminology, business rules, user personas, and key concepts specific to task management.

**Current files:**
- [glossary.md](domain/glossary.md) — Domain terminology (Task, Project, Status, Kanban, etc.), user personas (Alex & Jamie), business rules, and feature concepts

**Use when:**
- Understanding user workflows and requirements
- Writing user stories or acceptance criteria
- Generating domain-specific code comments
- Reviewing feature alignment with business goals

**Examples:**
- "What's the expected behavior for task drag-and-drop?"
- "What are the user personas and their pain points?"
- "How should completed tasks be displayed?"
- "What keyboard shortcuts matter most?"

---

### 🔄 [workflows/](workflows/) — Development & Deployment Processes
Defines development processes, code review procedures, deployment workflows, and team collaboration patterns.

**Current files:**
- [development-process.md](development-process.md) — Sprint workflow, branching strategy, code review checklist, testing gates, and deployment steps

**Use when:**
- Planning development sprints
- Reviewing code for process compliance
- Setting up CI/CD or deployment
- Documenting feature development flow
- Troubleshooting process gaps

**Examples:**
- "What's the code review checklist?"
- "How do we handle feature branches?"
- "What testing gates must pass before merge?"
- "What's the deployment process?"

---

### 👤 [roles/](roles/) — Role-Specific Context
Provides role-specific guidance for different team members (developers, QA, product managers, tech leads).

**Current files:**
- *(None yet — to be added based on team structure)*

**Suggested files:**
- `developer.md` — Development guidelines, tool setup, common tasks
- `qa.md` — Testing procedures, bug verification, quality gates
- `product-manager.md` — Feature prioritization, user research, roadmap alignment
- `tech-lead.md` — Architecture review, mentoring notes, decision framework

**Use when:**
- Onboarding new team members
- Clarifying role-specific responsibilities
- Providing context for role-specific tools or processes

---

## Quick Reference Links

| I Need To... | Go To... |
|---|---|
| Understand the system design | [architecture/overview.md](architecture/overview.md) |
| Write code that follows standards | [conventions/coding-standards.md](conventions/coding-standards.md) |
| Understand user personas & workflows | [domain/glossary.md](domain/glossary.md) |
| Follow the development process | [workflows/development-process.md](workflows/development-process.md) |
| Get role-specific guidance | [roles/](roles/) *(see suggested files above)* |

---

## How AI Assistants Should Use This

1. **Context Loading**: When starting work on a feature, reference the relevant memory bank files to set context.
   - "Refer to [conventions/coding-standards.md](conventions/coding-standards.md) when writing React components."
   - "Check [domain/glossary.md](domain/glossary.md) for user personas before designing the keyboard shortcut feature."

2. **Quality Gates**: Use checklists from [conventions/](conventions/) as a Definition of Done.
   - TypeScript strict mode? ✓
   - localStorage keys use `ptb:` prefix? ✓
   - Tests written? ✓
   - ARIA attributes present? ✓

3. **Consistency**: Before generating code, consult naming conventions, file structure, and component patterns.

4. **Documentation**: Use [domain/glossary.md](domain/glossary.md) terms when writing comments and docs.

---

## Maintenance Schedule

| Activity | Frequency | Owner |
|---|---|---|
| Review for accuracy | Quarterly | Tech Lead |
| Update after major decisions | Per ADR | Architecture Team |
| Add new conventions | Per pull request (if needed) | Tech Lead + Team |
| Refresh domain glossary | Per epic release | Product Team |

---

## Related Documents

- **Project Specs**: See `specs/` folder for PRDs, Epics, ADRs, and User Stories
- **Agents Manifest**: See `agents.md` at project root for AI agent instructions and project conventions
- **Project README**: See main `README.md` for project overview and setup

---

**Last Updated:** May 7, 2026  
**Version:** 2.0  
**Status:** Active
