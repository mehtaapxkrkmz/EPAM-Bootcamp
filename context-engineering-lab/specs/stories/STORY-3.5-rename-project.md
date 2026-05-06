# User Story Template

## 1. Story ID and Title

- Story ID: STORY-3.5
- Title: Rename project

## 2. User Story

As a developer, I want to rename a project without losing its tasks, so that I can correct project names or update them as my work evolves.

## 3. Acceptance Criteria

- Each project in the switcher displays a rename option (e.g., right-click or inline edit)
- Clicking rename allows inline editing of the project name
- Enter key confirms the rename; Escape cancels
- New name is persisted to localStorage
- Tasks in the renamed project remain intact
- Project remains active after renaming

## 4. Technical Notes

- Implement inline edit mode for project name (e.g., input field replacing text)
- Update project object with new name in state
- Trigger localStorage sync
- Validate name is not empty and not a duplicate
- Provide visual feedback for edit mode (e.g., focus on input)

## 5. Estimation

- Estimate: 1 day
- Assumptions: Project management state established; inline editing pattern in place

## 6. INVEST Validation

- Independent: Builds on project management stories
- Negotiable: Edit mode UI and validation rules can be refined
- Valuable: Enables project metadata management
- Estimable: Inline edit and project update scope is clear
- Small: Fits 1-day window
- Testable: Rename flow and state updates are testable

