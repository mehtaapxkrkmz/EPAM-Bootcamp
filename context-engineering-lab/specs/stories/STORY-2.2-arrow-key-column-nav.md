# User Story Template

## 1. Story ID and Title

- Story ID: STORY-2.2
- Title: Arrow key navigation between columns

## 2. User Story

As a developer, I want to use arrow keys (left/right) to move focus between Kanban columns, so that I can navigate the board without using the mouse.

## 3. Acceptance Criteria

- Right arrow key moves focus from current column to next column (To Do → In Progress → Done)
- Left arrow key moves focus from current column to previous column (Done → In Progress → To Do)
- Focus indicator shows which column is currently selected (visual highlight)
- Pressing arrow at the boundary (rightmost/leftmost) does not wrap or crash
- Tab key can also be used to switch between columns if arrow keys are not preferred

## 4. Technical Notes

- Implement focus state in parent component to track active column
- Add keyboard event listener for arrow key detection
- Update visual styles to show focus state (e.g., border highlight)
- Consider accessibility: ensure screen readers announce column focus

## 5. Estimation

- Estimate: 1 day
- Assumptions: Kanban board component structure established; focus state management in place

## 6. INVEST Validation

- Independent: Can be tested with mock column layout
- Negotiable: Focus indicator styling and navigation direction can be refined
- Valuable: Enables keyboard-only navigation between columns
- Estimable: Arrow key event handling is well-known
- Small: Column focus management fits 1-day window
- Testable: Keyboard input and focus state changes are testable

