# User Story Template

## 1. Story ID and Title

- Story ID: STORY-1.5
- Title: Delete task from board

## 2. User Story

As a developer, I want to delete a task from the board with a confirmation prompt, so that I can remove tasks I no longer need without accidentally losing data.

## 3. Acceptance Criteria

- Each task card displays a delete button or delete icon
- Clicking delete triggers a confirmation modal: "Are you sure?"
- Confirming deletion removes the task from the board immediately
- Canceling keeps the task on the board
- After deletion, the task is removed from localStorage
- Deleted task count does not appear in UI (out of scope for this story)

## 4. Technical Notes

- Add delete button to task card component
- Implement confirmation modal (could be a simple dialog or browser confirm())
- Update parent state to remove task from tasks array
- Ensure localStorage is updated after deletion
- Consider adding an "undo" feature in future iteration (out of scope)

## 5. Estimation

- Estimate: 1 day
- Assumptions: Confirmation modal pattern established; task state management in place

## 6. INVEST Validation

- Independent: Can be tested with mock task data
- Negotiable: Confirmation UX (modal vs. dialog vs. toast) can be refined
- Valuable: Users can clean up their task list; risk mitigation with confirmation
- Estimable: Delete operation scope is straightforward
- Small: Simple state removal and confirmation flow; fits 1-day window
- Testable: Delete action, confirmation flow, and localStorage removal are testable

