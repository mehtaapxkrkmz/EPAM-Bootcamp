# User Story Template

## 1. Story ID and Title

- Story ID: STORY-4.2
- Title: Export tasks as JSON

## 2. User Story

As a developer, I want to export all my tasks as a JSON file, so that I can back up my data, migrate to another tool, or share my task list with others.

## 3. Acceptance Criteria

- An "Export" button is available in the app (e.g., in a menu or settings)
- Clicking Export generates a JSON file with all tasks and project metadata
- JSON file includes: task ID, title, description, column, created date, completed date, project ID
- JSON file is named with a timestamp (e.g., `tasks-2024-05-05.json`)
- File download is triggered automatically
- JSON format is valid and can be imported back into the app (future story)

## 4. Technical Notes

- Create an export function that serializes all tasks and projects to JSON
- Include metadata (app version, export date) in JSON for context
- Use Blob and URL.createObjectURL for file download
- Provide visual feedback (success toast or confirmation)
- Consider pretty-printing JSON for readability

## 5. Estimation

- Estimate: 1 day
- Assumptions: localStorage data structure established; download trigger mechanism in place

## 6. INVEST Validation

- Independent: Can be tested with mock task data
- Negotiable: JSON structure and metadata fields can be refined
- Valuable: Enables data backup and portability
- Estimable: Export logic and file download scope is straightforward
- Small: Fits 1-day window
- Testable: Export function output and file generation are testable

