# User Story Template

## 1. Story ID and Title

- Story ID: STORY-2.4
- Title: Keyboard confirmation and task movement

## 2. User Story

As a developer, I want to press Enter on a focused task to move it to the next column (or confirm an action), so that I can advance tasks through my workflow using only the keyboard.

## 3. Acceptance Criteria

- When a task is focused (highlighted), pressing Enter moves it to the next column
- If a task is in the Done column, Enter does nothing or shows a message
- Task moves immediately with visual feedback
- Task state is updated in localStorage
- Visual focus remains on the moved task or moves to the next task in the column

## 4. Technical Notes

- Listen for Enter key press on focused task
- Determine current column and target column (next column)
- Update task state in parent component
- Trigger localStorage sync (handled by EPIC-1 story)
- Provide visual feedback (animation or immediate state change)

## 5. Estimation

- Estimate: 1 day
- Assumptions: Task focus state already managed; drag-and-drop column movement logic established

## 6. INVEST Validation

- Independent: Builds on arrow key navigation stories
- Negotiable: Behavior when task is already in Done column can be refined
- Valuable: Completes keyboard-driven workflow for moving tasks
- Estimable: Keyboard event handling and state update scope is clear
- Small: Fits 1-day window
- Testable: Enter key triggering and task movement are testable

