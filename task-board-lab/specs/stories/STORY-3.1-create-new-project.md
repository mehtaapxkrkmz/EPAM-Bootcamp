# User Story Template

## 1. Story ID and Title

- Story ID: STORY-3.1
- Title: Create new project

## 2. User Story

As a developer managing multiple projects, I want to click a "New Project" button and enter a project name, so that I can create a new project container for organizing related tasks.

## 3. Acceptance Criteria

- "New Project" button is visible in the project switcher UI
- Clicking opens a modal with a text input for project name
- Project name is required and cannot be empty
- Pressing Enter or clicking "Create" saves the project
- New project appears in the project switcher immediately
- New project is empty (no tasks initially)
- Project name is persisted to localStorage

## 4. Technical Notes

- Add input field to project creation modal
- Validate project name is not empty and not a duplicate
- Store project object in projects array in state
- Trigger localStorage sync
- Set new project as active project automatically

## 5. Estimation

- Estimate: 1 day
- Assumptions: Project switcher UI component exists; localStorage integration working

## 6. INVEST Validation

- Independent: Can be tested with mock project state
- Negotiable: Validation rules (name length, duplicates) can be refined
- Valuable: Enables multi-project support core functionality
- Estimable: Form handling and project creation scope is clear
- Small: Fits 1-day window
- Testable: Form submission and project creation are testable

