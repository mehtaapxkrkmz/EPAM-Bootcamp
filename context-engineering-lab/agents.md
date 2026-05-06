## Agent Instructions for Personal Task Board

### Project Overview
**Personal Task Board** is a lightweight, fast task management application designed for solo developers who need to organize work across multiple projects without the overhead of enterprise tools. The app provides a Kanban-style interface with To Do, In Progress, and Done columns, keyboard-driven navigation, and offline-first persistence via localStorage.

### Core Principles for Agents
1. **Speed First**: Every feature must be optimizable for <10 seconds of user interaction.
2. **Keyboard-Driven**: All workflows must be navigable and executable via keyboard shortcuts. Mouse is optional.
3. **Offline-First**: Never assume backend connectivity. All data is stored locally in the browser.
4. **Minimal Scope**: No backend, no authentication, no team features. Solo developer focus only.
5. **Accessibility**: All interactive components must be keyboard-accessible with proper ARIA labels and roles.

---

## Project Context

### Problem Statement
Solo developers managing 2-3 concurrent projects spend unnecessary time navigating complex project management tools when they need quick, frictionless task tracking. Current solutions (Jira, Asana, Linear) are designed for teams and introduce cognitive overhead. Developers lose 5-15 minutes per session just loading dashboards or searching for tasks.

### Primary User Personas
- **Alex, the Independent Developer**: Full-stack developer on 2-3 side projects, needs distraction-free task tracking.
- **Jamie, the Freelance Developer**: Juggling client work and open-source, needs local control and quick context switching.

### Key User Workflows
1. **Capture a Task**: Press `Cmd+Shift+T` → Type title → Press Enter. Takes <5 seconds.
2. **Daily Standup**: Switch projects with arrow keys, see all active tasks, identify priorities within 30 seconds.
3. **Bulk Complete**: Select multiple tasks, drag to Done column, verify with Enter key.

### Feature Epics
- **EPIC-1**: Kanban Board Core (task creation, display, drag-drop)
- **EPIC-2**: Keyboard-Driven Workflow (global shortcuts, arrow navigation, task operations)
- **EPIC-3**: Multi-Project Support (create, switch, manage projects)
- **EPIC-4**: Data Persistence & Export (localStorage, recovery, JSON export)

---

## Coding Standards

### Naming Conventions

**Files and Folders:**
- Kebab-case for all file and folder names.
- One component, hook, or module per file.
- Test files co-located: `[source-file].test.tsx`.

**TypeScript Identifiers:**
- React components: `PascalCase` (e.g., `KanbanBoard`, `TaskModal`)
- Hooks: `camelCase` with `use` prefix (e.g., `useTaskStore`, `useKeyboardNav`)
- Functions/variables: `camelCase` (e.g., `createTask`, `activeProjectId`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_PROJECTS`, `LS_KEYS`)
- Types/interfaces: `PascalCase` (e.g., `Task`, `ProjectStore`)
- Props interfaces: `PascalCase` with `Props` suffix (e.g., `TaskCardProps`)

**localStorage Keys:**
- All keys prefixed with `ptb:` to namespace away from other apps.
- Use kebab-case after prefix: `ptb:projects`, `ptb:tasks`.

### File Structure
```
src/
├── components/          # Reusable UI components (grouped by feature)
├── hooks/               # Custom React hooks
├── store/               # State management and persistence
├── types/               # Shared TypeScript type definitions
├── utils/               # Pure utility functions (no React)
├── constants/           # App-wide constants
└── App.tsx
```

### Code Organization

**Component Structure (top-to-bottom order):**
1. External imports (React, libraries)
2. Internal absolute imports (types, hooks, utils)
3. Relative imports (styles, sibling files)
4. Type/interface definitions
5. Component definition with: hooks → derived values → event handlers → render

**Function Length:**
- Target: ≤30 lines per function.
- Hard limit: 60 lines. Extract helpers if exceeded.

**Single Responsibility:**
- Each component renders one logical UI unit.
- Each hook manages one domain of state or side effect.
- Each utility function does one thing.

### TypeScript Requirements
- Strict mode enabled in `tsconfig.json` (`"strict": true`).
- No `any` types. Use `unknown` with type guards if necessary.
- All exported functions must have explicit return types.
- All component props typed via interface (not inline).
- Use `type` for unions/aliases; use `interface` for object shapes.

### Comments
- No comments that restate the code. Comments explain *why*, not *what*.
- JSDoc required for all exported functions and hooks.
- Use `// TODO(username): Description` format for tracked follow-ups.
- No `console.log` in committed code. Use `console.warn`/`console.error` only for explicit errors.

### Error Handling
- All localStorage reads must handle parse errors using shared utility `readFromStorage<T>()`.
- Wrap all `localStorage.setItem` calls in try/catch.
- On `QuotaExceededError`, surface visible warning to user. Never silently discard data.
- No empty catch blocks. Re-throw or log with `console.error` if unrecoverable.

---

## Testing Requirements

### Test Types and Targets

| Type | What to Test | Tool |
|---|---|---|
| Unit | Pure utility functions, hooks in isolation | Vitest |
| Component | User interactions, rendered output, ARIA | React Testing Library |
| Integration | localStorage read/write round-trips | Vitest |

### Coverage Targets
- **Utility functions**: 100% — no exceptions.
- **Hooks**: 90% minimum.
- **Components**: Cover all interactive paths (click, keyboard, error state).
- **Overall project**: 80% line coverage minimum.

### Test File Conventions
- File name: `[source-file].test.tsx`
- `describe` block name matches component or function name.
- `it` descriptions start with verb: "renders", "calls", "shows", "hides".
- Prefer `userEvent` over `fireEvent` for keyboard/pointer interactions.
- Never import implementation details — test via public interface.

**Example Structure:**
```ts
describe('TaskCard', () => {
  it('renders the task title', () => { /* ... */ });
  it('calls onDelete when Delete key is pressed', () => { /* ... */ });
});
```

---

## Quality Criteria

### Definition of Done (per Story)

Before marking a story complete, verify:
- [ ] All acceptance criteria from the Story file are met.
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`).
- [ ] All existing tests pass.
- [ ] New logic has corresponding unit or component tests.
- [ ] No `any` types introduced.
- [ ] No `console.log` left in code.
- [ ] localStorage keys use the `ptb:` prefix.
- [ ] Component is keyboard-accessible (focusable, correct ARIA roles/labels).
- [ ] Code follows all naming and file structure conventions.
- [ ] All exported functions have JSDoc documentation.
- [ ] No backend calls, external APIs, or server-side code.

### Code Review Checklist

- [ ] Follows naming conventions (Section: Naming Conventions).
- [ ] File placed in correct folder per project structure.
- [ ] No function exceeds 60 lines.
- [ ] Exported functions have JSDoc.
- [ ] localStorage access goes through shared utility, not inline `getItem`/`setItem`.
- [ ] Error handling for quota and parse failures present.
- [ ] Test coverage meets targets in Testing Requirements section.
- [ ] No backend calls, external APIs, or server-side code.
- [ ] Component keyboard-accessible with correct ARIA attributes.
- [ ] All types explicit (no `any`).

### Acceptance Criteria Validation
- Stories must be marked complete only when all acceptance criteria pass both in code and manual verification.
- Code review must validate alignment with Feature Epic goals.
- Keyboard workflows must be tested end-to-end with keyboard-only navigation.
- localStorage persistence must be verified across browser page reload.