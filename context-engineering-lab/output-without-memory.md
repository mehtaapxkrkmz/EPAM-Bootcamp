# Output Without Memory — STORY-1.6: Display Completed Task Count

## Task Description

Build a feature that shows the number of completed tasks directly in the "Done" column header of a kanban-style task board.

## What to Build

Add a visible count to the "Done" column header that reflects how many tasks are currently in that column. For example, the header should read **"Done (5)"** when five tasks are present.

## Requirements

- The count must appear in the Done column header alongside the column title.
- The count must update in real time (no page refresh needed) when:
  - A task is moved into the Done column
  - A task is moved out of the Done column
  - A task is deleted from the Done column
- The count display should be non-intrusive (e.g., shown in parentheses or as a badge).
- The count must be accurate after a browser restart (i.e., it should reflect persisted data).

## Out of Scope

- Showing counts for other columns (To Do, In Progress) — that is a future concern.
- Any backend or API integration.
- Complex animations or transitions for the counter.

## Acceptance Criteria

1. Done column header shows `"Done (N)"` where N is the current task count.
2. Count increments immediately when a task is moved to Done.
3. Count decrements immediately when a task is moved out of Done or deleted from Done.
4. After a browser restart, the count still reflects the correct number of persisted Done tasks.

## Notes

- This is a derived/computed value — calculate it by counting tasks whose status equals "Done".
- No new data structures or API calls are needed.
- Estimated effort: ~1 day, assuming task state and persistence are already working.
