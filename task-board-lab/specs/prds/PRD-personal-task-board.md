# Product Requirements Document

## 1. Overview

### Purpose
Personal Task Board is a lightweight, fast task management application designed for solo developers who need to organize work across multiple projects without the overhead of enterprise tools like Jira. The app provides a Kanban-style interface for tracking tasks through three stages: To Do, In Progress, and Done.

### Problem Statement
Solo developers managing 2-3 concurrent projects spend unnecessary time navigating complex project management tools when they need quick, frictionless task tracking. The problem affects approximately 500,000+ individual developers globally who work on side projects, freelance work, or indie development. Current solutions (Jira, Asana, Linear) are designed for teams and introduce cognitive overhead through their feature density and configuration requirements. Developers lose 5-15 minutes per session just loading dashboards or searching for tasks instead of focusing on development work.

### Goals
- Enable developers to capture, organize, and track tasks in under 10 seconds per task
- Provide a persistent, offline-first task board that requires no signup or backend infrastructure
- Support keyboard-driven workflows to minimize context switching
- Allow independent management of 2-3 concurrent projects without tool-switching
- Ensure the application is immediately productive with zero onboarding

## 2. User Personas

### Primary Persona: Alex, the Independent Developer
- Name: Alex Chen
- Role: Full-stack developer working on 2-3 side projects simultaneously
- Needs: A fast, distraction-free way to track tasks across projects without mental overhead
- Pain Points: Spends 10-15 minutes setting up Jira for each personal project; forgets tasks in chat messages or browser tabs; loses task history when switching machines; overwhelmed by unnecessary features

### Secondary Persona: Jamie, the Freelance Developer
- Name: Jamie Rodriguez
- Role: Freelancer juggling client work and personal open-source projects
- Needs: Quick context switching between client projects and personal code without losing task state
- Pain Points: Dreads telling clients "use Jira"; cannot give clients access to trivial task list; needs local control of all data; prefers not to pay per-user fees

## 3. Use Cases

### Use Case 1: Capture a New Task During Development
- Scenario: Alex is in the middle of debugging and remembers a related task for later. Opens the app with a keyboard shortcut, adds the task, and returns to IDE.
- User Action: Press `Cmd+Shift+T` → Type "Fix login redirect" → Press Enter → Close app
- Expected Outcome: Task appears in To Do for the current project. Takes <5 seconds end-to-end. Keyboard focus returns to IDE.

### Use Case 2: Daily Standup Review
- Scenario: Jamie starts work and quickly reviews all tasks across projects to plan the day.
- User Action: Open app → Switch projects using arrow keys → See tasks in progress and to-do → Drag incomplete tasks to today's focus
- Expected Outcome: Can see a complete picture of active tasks across 2-3 projects within 30 seconds. Knows what to prioritize.

### Use Case 3: Bulk Move Completed Tasks
- Scenario: Alex finishes a feature and marks 4 related tasks as done in one workflow.
- User Action: Select 4 tasks in To Do/In Progress → Drag to Done column → Verify with Enter key
- Expected Outcome: All tasks move to Done column. Completed count updates. State persists across app reload.

## 4. Functional Requirements

- Kanban board with exactly 3 columns: To Do, In Progress, Done
- Drag-and-drop task movement between columns with visual feedback
- Create new tasks via keyboard shortcut (`Cmd+Shift+T` or `Ctrl+Shift+T`)
- Support for 2-3 concurrent projects with project switcher
- Keyboard navigation: arrow keys to move between columns, Enter to confirm, Delete to remove task
- Task creation modal with title and optional description
- All data persisted to browser localStorage (no backend required)
- Task state includes: title, description (optional), created date, completed date, project assignment
- Support task filtering by project
- Visual indicator for completed task count per project
- Support for exporting task data as JSON

## 5. Non-Functional Requirements

### Performance
- App must load in <2 seconds on modern broadband
- Task creation, drag, and completion must respond in <100ms
- localStorage operations must complete in <50ms

### Security
- All data stored locally in browser; no transmission to servers
- No authentication required; user is responsible for browser profile security
- localStorage data is subject to browser's same-origin policy

### Reliability
- No external API calls or service dependencies
- Graceful handling of localStorage quota exceeded (warn user, no data loss)
- State recovery if browser crashes or tab closes

### Accessibility
- WCAG 2.1 Level AA compliance for keyboard navigation
- Screen reader support for task list and column headers
- High contrast mode support for visual distinction between task states

## 6. Success Metrics

- **Time to First Task:** Users can add their first task and see it persisted within 10 seconds of opening the app
- **Task Retention Rate:** >90% of tasks remain in localStorage after 30 days (measured via telemetry opt-in)
- **Keyboard Usage:** >50% of task interactions use keyboard shortcuts (not mouse/drag)
- **Project Support:** Users manage average of 2.5 concurrent projects with zero workflow friction
- **Session Duration:** Average session <5 minutes per user visit (lightweight engagement, not heavy planning)
- **Load Time:** App loads and renders task board in <2 seconds on 4G network

## 7. Scope

### In Scope
- Kanban board view with 3 columns
- Task CRUD operations (create, read, update, delete)
- Drag-and-drop between columns
- Keyboard shortcuts for power users
- Project selection and filtering
- localStorage persistence
- Export task data as JSON
- Basic dark mode toggle
- Responsive design for desktop (1024px+)

### Out of Scope
- User authentication or multi-user collaboration
- Cloud sync or cross-device synchronization
- Team features, permissions, or shared workspaces
- Email notifications or integrations
- Mobile app (responsive design for desktop only; mobile web not optimized)
- Advanced analytics or time tracking
- Recurring tasks or task templates
- Third-party integrations (Slack, GitHub, Jira, etc.)
- Real-time collaboration or conflict resolution
- Task dependencies or roadmapping features
- Backend API or server infrastructure
