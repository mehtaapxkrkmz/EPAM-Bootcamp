# User Story Template

## 1. Story ID and Title

- Story ID: STORY-1.3
- Title: Implement drag-and-drop between columns

## 2. User Story

As a developer, I want to drag a task from one column to another and see it update in real-time with visual feedback, so that I can move tasks through my workflow using intuitive gestures.

## 3. Acceptance Criteria

- Dragging a task card shows a visual indicator (opacity, shadow, or cursor change)
- Dropping a task in a different column moves it to that column immediately
- Dropped task moves to the top of the destination column
- If dropped in the same column, no change occurs
- Drag operation responds in <100ms with smooth animation
- Keyboard users can move tasks between columns (separate story for keyboard shortcuts)

## 4. Technical Notes

- Select and integrate a drag-and-drop library (e.g., React Beautiful DnD, dnd-kit)
- Ensure keyboard accessibility hooks are in place (but not implemented in this story)
- Update task state in parent component to reflect column change
- Consider visual feedback during drag (e.g., highlight drop zones)

## 5. Estimation

- Estimate: 2 days
- Assumptions: Drag-and-drop library chosen; drag state management patterns established

## 6. INVEST Validation

- Independent: Builds on Board Display story; can be tested with mock data
- Negotiable: Animation style, visual feedback details can be refined
- Valuable: Core workflow enabler; users can move tasks between states
- Estimable: Library integration scope is well-defined
- Small: Focused on drag-drop interaction; fits 2-day window
- Testable: Drag event handling and state updates are unit-testable

