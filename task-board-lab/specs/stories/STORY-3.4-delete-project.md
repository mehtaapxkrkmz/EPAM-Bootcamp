# User Story Template

## 1. Story ID and Title

- Story ID: STORY-3.4
- Title: Delete project

## 2. User Story

As a developer, I want to delete a project I no longer need (with confirmation), so that I can clean up my project list and remove obsolete projects.

## 3. Acceptance Criteria

- Each project in the switcher displays a delete button or context menu option
- Clicking delete shows a confirmation: "Delete project and all its tasks?"
- Confirming deletion removes the project and all its tasks from localStorage
- Canceling keeps the project intact
- If the active project is deleted, the app switches to another available project
- If all projects are deleted, the app shows an empty state with "Create first project" prompt

## 4. Technical Notes

- Add delete button/icon to project in switcher
- Display confirmation modal before deletion
- Remove project object and all associated tasks from state
- Trigger localStorage sync
- Handle switching to another project if active project is deleted

## 5. Estimation

- Estimate: 1 day
- Assumptions: Project switcher UI component established; confirmation modal pattern in place

## 6. INVEST Validation

- Independent: Builds on project management stories
- Negotiable: Confirmation UX and deletion behavior can be refined
- Valuable: Enables project cleanup and management
- Estimable: Delete operation and state management scope is clear
- Small: Fits 1-day window
- Testable: Deletion flow and state updates are testable

