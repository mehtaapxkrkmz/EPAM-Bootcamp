# Coding Standards: Personal Task Board

> **For AI assistants:** Apply every rule in this document when generating or reviewing code for this project. These standards extend `agents.md` with implementation-level detail. When in doubt, prefer explicitness and readability over brevity.

---

## 1. Naming Conventions

### Files and Folders
- **Kebab-case** for all file and folder names.
- One component, hook, or module per file.
- Test files co-located with source files using `.test.tsx` / `.test.ts` suffix.

| Type | Convention | Example |
|---|---|---|
| React component file | `PascalCase.tsx` | `TaskCard.tsx` |
| Hook file | `use-kebab-case.ts` | `use-local-storage.ts` |
| Utility / helper | `kebab-case.ts` | `date-formatter.ts` |
| Type definition file | `kebab-case.types.ts` | `task.types.ts` |
| Test file | `[source-file].test.tsx` | `TaskCard.test.tsx` |
| Style module | `[source-file].module.css` | `TaskCard.module.css` |

### TypeScript Identifiers

| Identifier | Convention | Example |
|---|---|---|
| React components | `PascalCase` | `KanbanBoard`, `TaskModal` |
| Hooks | `camelCase` prefixed with `use` | `useTaskStore`, `useKeyboardNav` |
| Functions / variables | `camelCase` | `createTask`, `activeProjectId` |
| Constants (module-level) | `UPPER_SNAKE_CASE` | `MAX_PROJECTS`, `LS_KEYS` |
| TypeScript types / interfaces | `PascalCase` | `Task`, `ProjectStore`, `TaskStatus` |
| Enum values | `PascalCase` | `TaskStatus.InProgress` |
| Props interfaces | `PascalCase` suffixed with `Props` | `TaskCardProps`, `ModalProps` |

### localStorage Keys
- Prefix all keys with `ptb:` to namespace away from other apps on the same origin.
- Use kebab-case after the prefix.

```ts
// ✅ Correct
const LS_KEYS = {
  projects: 'ptb:projects',
  tasks: 'ptb:tasks',
} as const;

// ❌ Wrong
localStorage.setItem('projects', ...)
localStorage.setItem('myAppTasks', ...)
```

---

## 2. File Structure

```
src/
├── components/          # Reusable UI components
│   ├── KanbanBoard/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanBoard.module.css
│   │   └── KanbanBoard.test.tsx
│   ├── TaskCard/
│   └── TaskModal/
├── hooks/               # Custom React hooks
│   ├── use-task-store.ts
│   ├── use-keyboard-nav.ts
│   └── use-local-storage.ts
├── store/               # State management and persistence
│   ├── task-store.ts
│   └── project-store.ts
├── types/               # Shared TypeScript type definitions
│   ├── task.types.ts
│   └── project.types.ts
├── utils/               # Pure utility functions (no React)
│   ├── local-storage.ts
│   └── date-formatter.ts
├── constants/           # App-wide constants
│   └── keys.ts
└── App.tsx
```

**Rules:**
- Group by feature first, then type (components go inside their feature folder).
- Do not create a single flat `components/` dump. Each component gets its own folder when it has co-located styles or tests.
- `utils/` contains only pure functions with no side effects and no React imports.

---

## 3. Code Organization

### Component Structure Order
Within a `.tsx` file, maintain this top-to-bottom order:

```tsx
// 1. External imports (React, libraries)
import { useState } from 'react';

// 2. Internal absolute imports (types, hooks, utils)
import type { Task } from '@/types/task.types';
import { useTaskStore } from '@/hooks/use-task-store';

// 3. Relative imports (styles, sibling files)
import styles from './TaskCard.module.css';

// 4. Type / interface definitions for this file
interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

// 5. Component definition
export function TaskCard({ task, onDelete }: TaskCardProps) {
  // 5a. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5b. Derived values / computations
  const isComplete = task.status === 'done';

  // 5c. Event handlers
  const handleDelete = () => onDelete(task.id);

  // 5d. Render
  return (
    <div className={styles.card}>
      {/* ... */}
    </div>
  );
}
```

### Function Length
- **Target:** ≤30 lines per function.
- **Hard limit:** 60 lines. If a function exceeds this, extract a named helper.

### Single Responsibility
- Each component renders one logical UI unit.
- Each hook manages one domain of state or side effect.
- Each utility function does one thing.

---

## 4. TypeScript Requirements

- **Strict mode** must be enabled in `tsconfig.json` (`"strict": true`).
- No `any` type. Use `unknown` with type guards if the shape is truly unknown.
- All exported functions must have explicit return types.
- All component props must be typed via an interface (not inline object type).

```ts
// ✅ Correct
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// ❌ Wrong
export function formatDate(date) {
  return date.toLocaleDateString();
}
```

- Use `type` for unions / aliases; use `interface` for object shapes.

```ts
// Union → type
type TaskStatus = 'todo' | 'in-progress' | 'done';

// Object shape → interface
interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}
```

---

## 5. Comments

- **No comments that restate the code.** Comments explain *why*, not *what*.
- JSDoc required for all exported functions and hooks.

```ts
/**
 * Reads and parses a JSON value from localStorage.
 * Returns `null` if the key is missing or the stored value is malformed.
 */
export function readFromStorage<T>(key: string): T | null {
  // ...
}
```

- Use `// TODO(username): Description` format for tracked follow-ups. Do not leave bare `// TODO` comments.
- No `console.log` in committed code. Use `console.warn` / `console.error` only for explicit error branches.

---

## 6. Testing Requirements

### Test Types and Targets

| Type | What to test | Tool |
|---|---|---|
| Unit | Pure utility functions, hooks in isolation | Vitest |
| Component | User interactions, rendered output, ARIA | React Testing Library |
| Integration | localStorage read/write round-trips | Vitest |

### Coverage Targets
- **Utility functions:** 100% — no exceptions.
- **Hooks:** 90% minimum.
- **Components:** Cover all interactive paths (click, keyboard, error state).
- **Overall project:** 80% line coverage minimum.

### Test File Conventions

```ts
// TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('renders the task title', () => {
    // ...
  });

  it('calls onDelete when Delete key is pressed', () => {
    // ...
  });
});
```

- `describe` block name = component or function name.
- `it` description starts with a verb: "renders", "calls", "shows", "hides".
- Prefer `userEvent` over `fireEvent` for keyboard/pointer interactions.
- Never import implementation details — test via the public interface.

---

## 7. Error Handling

### localStorage Operations
All reads from localStorage must handle parse errors. Use the shared utility — never call `localStorage.getItem` directly in components.

```ts
// ✅ Use the shared utility
import { readFromStorage } from '@/utils/local-storage';

const tasks = readFromStorage<Task[]>('ptb:tasks') ?? [];

// ❌ Never do this in a component
const raw = localStorage.getItem('ptb:tasks');
const tasks = JSON.parse(raw);  // throws if null or malformed
```

### localStorage Quota
- Wrap all `localStorage.setItem` calls in try/catch.
- On `QuotaExceededError`, surface a visible warning to the user. Do not silently discard data.

```ts
try {
  localStorage.setItem(key, JSON.stringify(value));
} catch (err) {
  if (err instanceof DOMException && err.name === 'QuotaExceededError') {
    // Notify user — do not swallow
    onQuotaExceeded();
  }
}
```

### No Silent Failures
- Do not swallow errors with empty `catch` blocks.
- If a caught error cannot be recovered from, re-throw or log with `console.error`.

---

## 8. Quality Criteria

### Definition of Done (per Story)

- [ ] All acceptance criteria from the Story file are met.
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`).
- [ ] All existing tests pass.
- [ ] New logic has corresponding unit or component tests.
- [ ] No `any` types introduced.
- [ ] No `console.log` left in code.
- [ ] localStorage keys use the `ptb:` prefix.
- [ ] Component is keyboard-accessible (focusable, correct ARIA roles/labels).

### Code Review Checklist

- [ ] Follows naming conventions from Section 1.
- [ ] File placed in correct folder per Section 2.
- [ ] No function exceeds 60 lines.
- [ ] Exported functions have JSDoc.
- [ ] localStorage access goes through shared utility, not inline.
- [ ] Error handling for quota and parse failures is present.
- [ ] Test coverage meets targets in Section 6.
- [ ] No backend calls, external APIs, or server-side code.

---

**Last Updated:** May 6, 2026
**Version:** 1.0
**Source:** Expanded from `agents.md`
