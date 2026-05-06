# ADR-1: Use React 18 with Vite as Frontend Framework

## Status
Accepted

## Context

**Problem**: We need to build a fast, lightweight personal task board application for solo developers who require minimal setup overhead and fast development cycles. The frontend must:
- Load in under 2 seconds
- Support zero-backend architecture (all state in browser)
- Enable rapid iteration during development
- Work offline without network dependencies
- Support keyboard-driven workflows efficiently

**Constraints**:
- No backend API or server infrastructure
- Single-page application (SPA) model
- Must run entirely in the browser
- Need TypeScript support for type safety
- Deployment must be simple (static hosting friendly)

**Alternatives Evaluated**:
- **Vue 3**: Lighter than React but smaller ecosystem and fewer keyboard navigation libraries
- **Svelte**: Smallest bundle size but less mature tooling for keyboard-driven UIs
- **Plain HTML + Vanilla JS**: Too verbose for Kanban drag-drop complexity; no type safety
- **Next.js**: Introduces unnecessary server complexity; overkill for frontend-only app

## Decision

We will use **React 18 with Vite** as our frontend framework:

1. **Framework**: React 18
   - Robust component lifecycle and state management
   - Extensive third-party library ecosystem (react-beautiful-dnd for drag-drop, keyboard event libraries)
   - Well-known debugging tools (React DevTools)
   - Strong TypeScript integration

2. **Build Tool**: Vite
   - Extremely fast development server (<50ms hot reload)
   - Optimized production builds with tree-shaking
   - Native ES modules support
   - Zero-config TypeScript support
   - Smaller bundle size than Create React App

3. **Language**: TypeScript
   - Type safety for complex state management
   - Better IDE autocomplete for keyboard event handling
   - Easier refactoring during iteration

4. **State Management**: React Context + Hooks
   - No external state library needed (Redux overkill for single-user app)
   - Sufficient for multi-project task tracking
   - localStorage sync via useEffect hooks

## Consequences

### Positive
- ✅ **Fast development**: Vite's HMR reduces feedback loop from 5+ seconds (CRA) to <50ms
- ✅ **Proven ecosystem**: Extensive libraries for drag-drop, keyboard navigation, modals
- ✅ **Developer experience**: React DevTools integration; large community for troubleshooting
- ✅ **Type safety**: TypeScript prevents className typos and state mutation bugs in keyboard handlers
- ✅ **Bundle size**: Vite with tree-shaking produces ~50KB gzipped (vs 100KB+ with CRA)
- ✅ **Easy deployment**: Static site hosting (Netlify, Vercel, GitHub Pages)

### Negative
- ⚠️ **Larger than minimal**: React + Vite (~50KB) vs Svelte (~20KB) or Vanilla JS
- ⚠️ **JavaScript dependency**: App non-functional in browsers with JS disabled (acceptable for developer tool)
- ⚠️ **Learning curve**: Developers unfamiliar with React hooks will need onboarding
- ⚠️ **Version churn**: React ecosystem updates frequently; requires maintenance

### Risks
- 🔴 **Future library maintenance**: If keyboard navigation libraries become unmaintained, may need custom solutions
- 🔴 **Bundle bloat**: Adding UI component libraries (Material-UI, Chakra) could exceed 100KB; mitigated by using headless libraries

## Implementation Notes

- **Build command**: `vite build` for production (~30 seconds)
- **Dev server**: `vite` starts dev server with HMR
- **TypeScript config**: `target: ES2020` for modern browser support
- **Testing**: Vitest for unit tests, React Testing Library for component tests

## Related
- [EPIC-1-kanban-board-core.md](../epics/EPIC-1-kanban-board-core.md) - Core Kanban features depend on React component architecture
- [STORY-1.3-drag-drop-tasks.md](../stories/STORY-1.3-drag-drop-tasks.md) - Drag-drop requires React + library integration
