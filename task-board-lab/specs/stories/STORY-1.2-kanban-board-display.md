# User Story Template

## 1. Story ID and Title

- Story ID: STORY-1.2
- Title: Display Kanban board with 3 columns

## 2. User Story

As a developer, I want to see a Kanban board with three columns (To Do, In Progress, Done) displaying my tasks in the correct column, so that I can visualize my workflow at a glance.

## 3. Acceptance Criteria

- Board displays exactly 3 columns: To Do, In Progress, Done
- Each column is labeled clearly
- Tasks are rendered as cards within their assigned column
- Column headers remain visible when scrolling
- Board layout is responsive and centered on the page
- Empty columns display a placeholder message

## 4. Technical Notes

- Use CSS Grid or Flexbox for column layout
- Task data passed as props from parent component (populated by other stories)
- Consider drag-and-drop library integration points (will be handled separately)
- Task card should show title and optional description preview

## 5. Estimation

- Estimate: 2 days
- Assumptions: Mock task data available for testing; no localStorage integration yet

## 6. INVEST Validation

- Independent: Can be built and tested with static task data
- Negotiable: Column styling, card layout, empty state messaging can be refined
- Valuable: Provides the visual foundation for task management
- Estimable: UI component scope is concrete
- Small: Straightforward React component structure fits 2-day window
- Testable: Component rendering, layout, and responsive behavior are unit-testable

