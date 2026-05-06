# User Story Template

## 1. Story ID and Title

- Story ID: STORY-2.5
- Title: Keyboard task deletion

## 2. User Story

As a developer, I want to press Delete on a focused task and confirm deletion via keyboard, so that I can remove tasks without using the mouse.

## 3. Acceptance Criteria

- When a task is focused, pressing Delete triggers a confirmation prompt
- Confirmation prompt can be answered via keyboard (e.g., Y/N or Tab+Enter)
- Pressing Y (or confirming with Enter) deletes the task immediately
- Pressing N (or Escape) cancels the deletion
- After deletion, focus moves to the next task in the column

## 4. Technical Notes

- Listen for Delete key press on focused task
- Display a confirmation modal (Y/N keyboard-answerable)
- If confirmed, remove task from state and trigger localStorage sync
- Handle focus management after deletion

## 5. Estimation

- Estimate: 1 day
- Assumptions: Task focus state managed; confirmation modal pattern established

## 6. INVEST Validation

- Independent: Builds on arrow key and focus management stories
- Negotiable: Confirmation method (Y/N vs. Tab+Enter) can be refined
- Valuable: Keyboard-driven task deletion enables full keyboard workflow
- Estimable: Delete event handling and confirmation scope is clear
- Small: Fits 1-day window
- Testable: Delete key triggering and confirmation flow are testable

