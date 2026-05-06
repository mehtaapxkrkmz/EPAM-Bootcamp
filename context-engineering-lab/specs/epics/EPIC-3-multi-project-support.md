# Epic Template

## 1. Epic Title

Multi-Project Support: Project Switcher and Filtering

## 2. Description

Developers can create and switch between 2-3 concurrent projects, filtering the Kanban board to show tasks for the active project only. Each project maintains its own task list in localStorage, and switching between projects is instant and persistent. This Epic allows solo developers to manage multiple concurrent efforts (side projects, freelance work, open-source) without tool-switching.

## 3. Primary Persona

- Name: Alex Chen
- Role: Full-stack developer managing 2-3 side projects simultaneously
- Benefit: Can focus on one project at a time without losing sight of other work; context switching happens within the same app

## 4. Success Criteria

- Developer can create a new project from a dropdown menu and name it
- Project switcher displays active project and allows selection from list
- Switching projects instantly filters the Kanban board to show only tasks for that project
- All projects persist in localStorage independently
- Task count per project is visible in the project switcher
- Users manage an average of 2.5 concurrent projects with zero workflow friction

## 5. Scope/Complexity

- Estimate: M
- Notes: Requires localStorage structure to support multiple project objects, UI component for project switcher, and filtering logic. Builds on Kanban Board Core but is independent of Keyboard Workflow.

## 6. Dependencies

- Kanban Board Core (Epic 1) must be deployed first to establish task persistence pattern
- localStorage data schema documented to support project-scoped task storage

## 7. User Stories

- [USER STORY PLACEHOLDER: Create and name new project]
- [USER STORY PLACEHOLDER: Switch between projects with visual indicator]
- [USER STORY PLACEHOLDER: Filter tasks by active project]
- [USER STORY PLACEHOLDER: Display project task counts]
- [USER STORY PLACEHOLDER: Persist multiple projects in localStorage]

<!-- Example format: As a [USER], I want [CAPABILITY], so that [BENEFIT]. -->
