# User Story Template

## 1. Story ID and Title

- Story ID: STORY-3.2
- Title: Switch between projects

## 2. User Story

As a developer, I want to click on a project name in the project switcher and instantly see tasks filtered to only that project, so that I can focus on one project at a time.

## 3. Acceptance Criteria

- Project switcher displays all available projects
- Active project is visually highlighted (e.g., bold, color-coded)
- Clicking a different project switches the Kanban board to show only that project's tasks
- Switch happens instantly (<100ms)
- Active project is persisted (so switching back to the app shows the last active project)
- All columns (To Do, In Progress, Done) are filtered by active project

## 4. Technical Notes

- Implement project state in parent component (activeProjectId)
- Filter tasks by activeProjectId in column components
- Update localStorage to track active project on switch
- Ensure visual feedback clearly shows which project is active

## 5. Estimation

- Estimate: 1 day
- Assumptions: Project structure and filtering logic established; project switcher UI component exists

## 6. INVEST Validation

- Independent: Builds on Create New Project story
- Negotiable: Project switcher styling and highlight approach can be refined
- Valuable: Enables context switching between projects
- Estimable: Project state and filtering scope is clear
- Small: Fits 1-day window
- Testable: Project switching and task filtering are testable

