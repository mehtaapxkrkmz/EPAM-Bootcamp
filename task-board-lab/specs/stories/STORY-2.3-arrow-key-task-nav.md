# User Story Template

## 1. Story ID and Title

- Story ID: STORY-2.3
- Title: Arrow key navigation within column tasks

## 2. User Story

As a developer, I want to use up/down arrow keys to move focus between tasks within a column, so that I can select and interact with individual tasks using only the keyboard.

## 3. Acceptance Criteria

- Down arrow key moves focus to the next task in the column
- Up arrow key moves focus to the previous task in the column
- Focused task is visually highlighted (e.g., border, shadow)
- Pressing down at the last task or up at the first task does not wrap or crash
- Enter key can activate the focused task (e.g., select it for moving or deleting)

## 4. Technical Notes

- Implement task focus state within each column component
- Add keyboard event listener for up/down arrow detection
- Update visual styles to highlight focused task
- Ensure focus management prevents multiple focused tasks simultaneously

## 5. Estimation

- Estimate: 2 days
- Assumptions: Column and task component structure established; focus management in place

## 6. INVEST Validation

- Independent: Can be tested with mock task data
- Negotiable: Focus highlight styling and navigation wrap behavior can be refined
- Valuable: Enables full keyboard task navigation
- Estimable: Task focus state management scope is clear
- Small: Fits 2-day window with straightforward state management
- Testable: Arrow key input and task focus changes are testable

