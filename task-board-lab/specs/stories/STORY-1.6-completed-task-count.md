# User Story Template

## 1. Story ID and Title

- Story ID: STORY-1.6
- Title: Display completed task count

## 2. User Story

As a developer, I want to see a count of completed tasks in the Done column header, so that I can visualize progress and feel motivated by tasks I've finished.

## 3. Acceptance Criteria

- The Done column header displays the count of tasks in that column (e.g., "Done (5)")
- Count updates immediately when a task is moved to Done
- Count updates immediately when a task is deleted from Done
- Count updates immediately when a task is moved out of Done
- Count is displayed in a non-intrusive way (e.g., parentheses, badge)
- Count persists across browser restart (relies on localStorage from Story 1.4)

## 4. Technical Notes

- Add a simple counter component to the Done column header
- Calculate count by filtering tasks array for column === 'Done'
- Consider displaying counts for other columns in future iteration (out of scope)
- No API calls or complex logic; pure derived state

## 5. Estimation

- Estimate: 1 day
- Assumptions: Task data structure and state management already in place; localStorage working

## 6. INVEST Validation

- Independent: Builds on Board Display and Persistence; minimal dependencies
- Negotiable: Count display format, location, styling can be refined
- Valuable: Provides progress feedback to user; psychological motivator
- Estimable: Simple derived state calculation
- Small: Single component addition; fits 1-day window
- Testable: Count calculation and rendering are unit-testable

