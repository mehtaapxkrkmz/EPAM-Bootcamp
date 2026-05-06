# ADR-3: Implement Keyboard-Driven Navigation Using Arrow Keys

## Status
Accepted

## Context

**Problem**: Solo developers need to minimize mouse usage during development to:
- Stay in flow state without context switching
- Navigate task board without leaving IDE
- Execute common actions (move task, delete, create) without reaching for mouse
- Reduce repetitive strain from excessive clicking

**User Research** (from PRD):
- Primary persona Alex spends 10-15 minutes per session on task navigation
- Use case requires keyboard shortcut (`Cmd+Shift+T`) to create tasks quickly
- Secondary persona Jamie needs fast context switching between projects
- Acceptance criteria in [EPIC-2-keyboard-driven-workflow.md](../epics/EPIC-2-keyboard-driven-workflow.md) requires full keyboard navigation

**Constraints**:
- Must be discoverable (help menu required)
- Must not conflict with browser shortcuts (Cmd+F, Cmd+Q, etc.)
- Must work with screen readers (accessibility)
- Must support Windows, Mac, Linux keyboard layouts

**Alternatives Evaluated**:
- **Mouse-first with optional keyboard**: Less efficient; keyboard shortcuts remain secondary
- **Vim keybindings (hjkl)**: Conflicts with web conventions; steeper learning curve
- **Tab-based navigation only**: Too slow for multi-column Kanban; arrow keys more intuitive

## Decision

We will implement a **keyboard-driven interface with arrow keys** as the primary navigation method:

### Navigation Model

1. **Global Shortcuts** (always available):
   ```
   Cmd/Ctrl + Shift + T  → Open task creation modal (any screen)
   Cmd/Ctrl + ?          → Show keyboard help menu
   Cmd/Ctrl + K          → Search tasks (future enhancement)
   ```

2. **Column Navigation** (horizontal):
   ```
   Right Arrow   → Move focus to next column (To Do → In Progress → Done)
   Left Arrow    → Move focus to previous column
   Enter         → Focus first task in selected column
   ```

3. **Task Navigation** (vertical within column):
   ```
   Down Arrow    → Move focus to next task in column
   Up Arrow      → Move focus to previous task in column
   Enter         → Select task for action menu
   ```

4. **Task Actions** (when task is selected):
   ```
   M             → Move task to next column
   D or Delete   → Delete task (with confirmation)
   E             → Edit task
   Space         → Mark complete (move to Done)
   Escape        → Deselect task, return to column view
   ```

### Implementation Details

1. **Event Handling**: React useKeyboardEvent hook
   ```typescript
   useKeyboardEvent('ArrowRight', () => focusNextColumn());
   useKeyboardEvent('ArrowDown', handleTaskNavigation);
   ```

2. **Focus Management**: React ref-based focus tracking
   - Maintain `focusState` (currentColumn, currentTaskId)
   - Update on arrow key events
   - Scroll task into view automatically

3. **Visual Feedback**: CSS `:focus-visible` pseudo-class
   - Blue outline on focused task
   - Highlight focused column header
   - Show keyboard hint on hover ("Press ? for help")

4. **Help System**: Keyboard help modal
   - Triggered by `Cmd/Ctrl + ?`
   - Categorized shortcuts (Navigation, Tasks, Global)
   - Searchable shortcuts (future)

5. **Accessibility**:
   - ARIA labels on focusable elements
   - `role="button"` for keyboard-actionable divs
   - Screen reader announcements for focus changes
   - Tab key still works for standard browser navigation

## Consequences

### Positive
- ✅ **Fast task management**: Keyboard-only workflow (2-3x faster than mouse)
- ✅ **Stay in flow**: Never leave IDE/text editor to manage tasks
- ✅ **Reduced RSI**: Minimize mouse reaching and clicking
- ✅ **Developer-friendly**: Aligns with developer expectations (vim, IDE shortcuts)
- ✅ **Accessibility**: Keyboard navigation benefits screen reader users
- ✅ **Mobile-safe**: Arrow keys still work on iPad with keyboard (future)

### Negative
- ⚠️ **Learning curve**: Users must memorize shortcuts; onboarding required
- ⚠️ **Shortcut conflicts**: Some shortcuts may conflict with browser extensions
- ⚠️ **Context switching**: Need to remember visual position while focused
- ⚠️ **Mobile unfriendly**: Arrow keys unavailable on touch phones
- ⚠️ **Limited discovery**: Users may not discover keyboard features

### Risks
- 🔴 **Accessibility regression**: If focus management broken, keyboard users lose access
- 🔴 **Shortcut pollution**: Too many keybindings confuse users (mitigated by organized help)
- 🔴 **Browser conflicts**: Ctrl+S (save) or Cmd+S could conflict; need careful selection
- 🔴 **Mac vs Windows parity**: Different modifier keys (Cmd vs Ctrl) need careful handling

## Mitigation Strategies

1. **Help System**: Prominent `?` help menu with visual keyboard reference
2. **Onboarding**: Show keyboard shortcut hints on first visit
3. **Progressive disclosure**: Show shortcuts only for focused elements
4. **Conflict avoidance**: Audit all shortcuts against browser + OS conventions
5. **Testing**: Test on Windows, Mac, Linux with screen readers (NVDA, JAWS)
6. **Analytics**: Track keyboard shortcut usage to identify underused features

## Implementation Checklist

- [ ] Create useKeyboardEvent custom hook with proper cleanup
- [ ] Implement column focus state machine
- [ ] Implement task focus state machine
- [ ] Add visual focus indicators (CSS)
- [ ] Create keyboard help modal component
- [ ] Add ARIA labels and roles
- [ ] Test with screen readers
- [ ] Document all shortcuts in AGENTS.md
- [ ] Create keyboard shortcut cheat sheet PDF
- [ ] Test Mac, Windows, Linux modifier keys

## Related
- [EPIC-2-keyboard-driven-workflow.md](../epics/EPIC-2-keyboard-driven-workflow.md) - Full epic for keyboard workflows
- [STORY-2.1-global-task-shortcut.md](../stories/STORY-2.1-global-task-shortcut.md) - Global create task shortcut
- [STORY-2.2-arrow-key-column-nav.md](../stories/STORY-2.2-arrow-key-column-nav.md) - Column navigation
- [STORY-2.3-arrow-key-task-nav.md](../stories/STORY-2.3-arrow-key-task-nav.md) - Task navigation
- [STORY-2.6-keyboard-help-menu.md](../stories/STORY-2.6-keyboard-help-menu.md) - Help menu
