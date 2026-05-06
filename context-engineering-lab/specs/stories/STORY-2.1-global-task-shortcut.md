# User Story Template

## 1. Story ID and Title

- Story ID: STORY-2.1
- Title: Global keyboard shortcut for task creation

## 2. User Story

As a developer, I want to press `Cmd+Shift+T` (or `Ctrl+Shift+T` on Windows) from anywhere in my browser to open the task creation modal, so that I can capture tasks without switching tabs or clicking buttons.

## 3. Acceptance Criteria

- Keyboard shortcut `Cmd+Shift+T` / `Ctrl+Shift+T` opens the task creation modal from any page view
- Modal opens within 200ms of shortcut press
- Shortcut works when the app window is in focus
- Shortcut does not interfere with browser defaults or other app interactions
- Visual feedback shows the shortcut was recognized (e.g., modal appears)

## 4. Technical Notes

- Use keyboard event listener at app root level (useEffect with keydown listener)
- Prevent default browser behavior for the shortcut combination
- Consider documenting the shortcut in a help tooltip or keyboard legend

## 5. Estimation

- Estimate: 1 day
- Assumptions: Modal component already exists (EPIC-1); event listener patterns established

## 6. INVEST Validation

- Independent: Can be tested with mock modal component
- Negotiable: Shortcut key combination could be customized later
- Valuable: Eliminates context-switching for power users
- Estimable: Keyboard event handling is straightforward
- Small: Single event listener setup; fits 1-day window
- Testable: Keyboard event triggering and modal opening are testable

