# User Story Template

## 1. Story ID and Title

- Story ID: STORY-3.3
- Title: Display project task counts

## 2. User Story

As a developer, I want to see the count of tasks in each project within the project switcher, so that I can quickly assess how much work is in each project.

## 3. Acceptance Criteria

- Each project name in the switcher shows the count of total tasks (e.g., "Project A (7)")
- Count includes tasks from all columns (To Do, In Progress, Done)
- Count updates immediately when a task is moved to/from the project
- Count updates immediately when a task is deleted
- Count format is clear and non-intrusive (e.g., in parentheses or small badge)

## 4. Technical Notes

- Calculate count by filtering tasks by projectId
- Display count alongside project name in switcher UI
- Ensure count updates when tasks are created, moved, or deleted
- Consider styling counts to distinguish from project names

## 5. Estimation

- Estimate: 1 day
- Assumptions: Project switcher component and task filtering logic in place

## 6. INVEST Validation

- Independent: Builds on Create New Project and Switch Between Projects
- Negotiable: Count display format and styling can be refined
- Valuable: Provides visibility into project workload
- Estimable: Count calculation and display scope is simple
- Small: Fits 1-day window
- Testable: Count calculation and rendering are testable

