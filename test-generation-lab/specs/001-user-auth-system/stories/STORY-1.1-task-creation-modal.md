# User Story Template

## 1. Story ID and Title

- Story ID: STORY-1.1
- Title: Create task via modal form

## 2. User Story

As a developer, I want to open a task creation modal and enter a title and optional description, so that I can capture new tasks without leaving my current context.

## 3. Acceptance Criteria

- Clicking a "New Task" button opens a modal with title and description fields
- Title field is required; description is optional
- Pressing Enter in the title field submits the form
- Pressing Escape closes the modal without saving
- After submission, the modal closes and a success message appears briefly
- Form fields are cleared after submission

## 4. Technical Notes

- Use React state to manage modal open/close
- Validate that title is not empty before submission
- Store task data temporarily in a local variable before persistence (handled in separate story)
- Consider accessible focus management for modal (trap focus, return to button on close)

## 5. Estimation

- Estimate: 2 days
- Assumptions: Modal library or custom implementation already decided; no backend API calls

## 6. INVEST Validation

- Independent: Can be built and tested without Kanban column display or localStorage
- Negotiable: Form can be refined (additional fields, validation messages) without breaking scope
- Valuable: Users can capture tasks; foundational for all downstream work
- Estimable: Scope is clear and concrete
- Small: Fits into 2-day window with straightforward React patterns
- Testable: Form submission, validation, and modal behavior are verifiable via unit tests

