# Domain Glossary: Personal Task Board

> **For AI assistants:** Use these definitions when generating specs, code, tests, and UI text for this project. Prefer these terms over generic task-management language when they conflict.

---

## Personal Task Board

**Definition:** A lightweight, single-user task management application for organizing work across multiple personal projects in a Kanban-style interface.

**Context:** This is the core product concept. It is intentionally designed for solo developers, not teams. Decisions that add collaboration, admin workflows, or enterprise-style setup conflict with the product scope.

**Example:** "The Personal Task Board should open immediately and let the user add a task without requiring account setup."

---

## Project

**Definition:** A user-defined grouping of tasks representing one independent stream of work, such as a side project, freelance client engagement, or open-source effort.

**Context:** The app supports 2-3 concurrent projects. Tasks must always be associated with a project so users can switch context without mixing unrelated work.

**Example:** "When Alex switches from the client website project to the open-source library project, the board should show only tasks for the selected project."

---

## Task

**Definition:** The smallest tracked work item in the system, containing a title, optional description, created date, completed date, status, and project assignment.

**Context:** The task is the primary domain entity. Features such as creation, deletion, movement, export, and persistence all operate on tasks.

**Example:** "A task titled 'Fix login redirect' belongs to one project and starts in the To Do column."

---

## Kanban Board

**Definition:** The main visual layout of the app, showing tasks across exactly three workflow columns: To Do, In Progress, and Done.

**Context:** The PRD fixes the board structure to three columns. AI-generated features must not introduce extra workflow states or custom pipeline stages unless the specification changes.

**Example:** "Dragging a task from In Progress to Done updates the Kanban board and persists the new state."

---

## Keyboard-Driven Workflow

**Definition:** A usage pattern where core task actions can be completed primarily through keyboard shortcuts and navigation rather than mouse interaction.

**Context:** This is a key product differentiator. The app is optimized for developers who want to capture and move tasks quickly without breaking coding flow.

**Example:** "Pressing Ctrl+Shift+T opens task creation so the user can capture an idea and return to the IDE in seconds."

---

## Offline-First

**Definition:** A product constraint and behavior model where the application remains fully usable without network connectivity because all task data is stored locally in the browser.

**Context:** The project has no backend, no authentication, and no cloud sync. AI assistants must avoid suggesting server APIs, remote databases, or features that depend on internet connectivity.

**Example:** "The board must still load and allow task edits when the browser is offline because it relies only on localStorage."

---

## localStorage Persistence

**Definition:** The browser-based storage mechanism used as the sole persistence layer for projects and tasks.

**Context:** This is both a technical and domain constraint. All saved state must persist through page reloads and browser restarts within the same profile, and quota/error handling is part of expected behavior.

**Example:** "After reloading the page, tasks should reappear from localStorage with their previous column and project assignment intact."

---

## Key Domain Rules

### Single-User Ownership

**Rule:** All data belongs to one local user in one browser profile.

**Rationale:** The app is explicitly designed for solo developers and excludes collaboration, permissions, and shared workspaces.

**Example:** Do not add assignees, team members, or role-based access controls.

### Fixed Workflow States

**Rule:** Every task must be in exactly one of three statuses: To Do, In Progress, or Done.

**Rationale:** The product is intentionally minimal. Extra states increase complexity and weaken the fast, low-overhead workflow.

**Example:** Do not introduce statuses like Blocked, Review, or Archived unless a future spec explicitly adds them.

### Project-Scoped Task Visibility

**Rule:** The active board view shows tasks for the selected project only.

**Rationale:** Users manage multiple projects, but each board interaction should preserve clear project context.

**Example:** Switching projects should filter the visible board rather than merging all tasks together by default.

---

**Last Updated:** May 6, 2026
**Version:** 1.0
