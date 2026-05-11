# ADR-2: Use localStorage for State Persistence (No Backend)

## Status
Accepted

## Context

**Problem**: Solo developers building personal projects need a task board that:
- Works offline without backend server
- Persists data across browser sessions
- Requires zero authentication or signup
- Has no infrastructure costs
- Keeps data locally under user control

**Constraints**:
- No backend infrastructure available or desired
- No cloud database (Firebase, MongoDB Atlas)
- Must work in browser environment
- Privacy-first: all data stays on user's machine

**Business Impact**:
- Eliminates server costs (enables free tier indefinitely)
- Removes authentication complexity (faster MVP)
- Gives users complete data ownership (privacy advantage)
- Allows offline functionality (core requirement from PRD)

**Storage Alternatives Evaluated**:
- **IndexedDB**: Async API; more complex; overkill for task data (<100KB typical)
- **sessionStorage**: Lost on browser close; not suitable for persistent state
- **SQLite (WASM)**: Adds 500KB+ to bundle; unnecessary complexity for simple tasks
- **Cloud storage (Firebase/MongoDB)**: Introduces backend dependency; adds auth complexity

## Decision

We will use **browser localStorage** as the primary persistence layer:

1. **Storage Mechanism**: localStorage API
   - Synchronous, simple key-value store
   - 5-10MB quota (sufficient for ~1M tasks at 5KB per task)
   - Automatic persistence across browser sessions
   - No setup or configuration required

2. **Data Format**: JSON serialization
   ```typescript
   const projectsData = {
     projects: [{ id, name, tasks: [...] }],
     lastModified: timestamp
   };
   localStorage.setItem('taskboard-projects', JSON.stringify(projectsData));
   ```

3. **Sync Strategy**: Auto-save on every mutation
   - Task created → Auto-save within 100ms (debounced)
   - Task moved → Auto-save within 100ms (debounced)
   - Project deleted → Auto-save immediately
   - Prevents data loss from browser crashes

4. **Quota Management**: 
   - Monitor quota usage before writes
   - Warn user at 80% quota consumed
   - Provide export/cleanup options before hitting limit
   - [STORY-4.1-localstorage-quota-warning.md](../stories/STORY-4.1-localstorage-quota-warning.md) implements quota warning

5. **Recovery**: 
   - Store backup snapshot (daily or on app load)
   - Detect corrupted data on load; offer recovery options
   - [STORY-4.3-recover-corrupted-data.md](../stories/STORY-4.3-recover-corrupted-data.md) implements recovery

## Consequences

### Positive
- ✅ **Zero backend**: No server maintenance; developer focus on frontend
- ✅ **Simple API**: Synchronous calls; no async complexity
- ✅ **Instant availability**: No network latency; snappy UX
- ✅ **Privacy**: User data never leaves their machine
- ✅ **Cost**: No infrastructure expenses
- ✅ **Offline-first**: Works without internet connection (core feature)
- ✅ **Easy testing**: Mock localStorage in unit tests

### Negative
- ⚠️ **5-10MB limit**: Cannot store massive projects (10,000+ tasks per project)
- ⚠️ **Single browser**: Data not synced across devices/browsers (no cloud backup)
- ⚠️ **No access control**: Anyone with browser access can view/delete data
- ⚠️ **Synchronous blocking**: Large writes (~1MB) could block UI for 10-50ms
- ⚠️ **No undo/version history**: Accidental deletion is permanent without backups

### Risks
- 🔴 **Browser storage cleared**: Users clearing cache lose all data (mitigated by export/backup UX)
- 🔴 **Data corruption**: Malicious browser extensions could corrupt localStorage (mitigated by validation on load)
- 🔴 **No backup**: If user loses device, data is gone (mitigated by export functionality)
- 🔴 **Scale limitations**: May not support 100+ concurrent projects efficiently

## Mitigation Strategies

1. **Quota Warning**: Alert user at 80% quota; provide export option
2. **Auto-backup**: Store JSON export in separate key as fallback
3. **Data Validation**: Validate schema on load; recover from corrupted state
4. **Export Functionality**: Allow download as JSON for manual backup
5. **Clear warnings**: UX warnings about browser cache clearing data

## Implementation Checklist

- [ ] Implement `useLocalStorage()` custom hook with auto-save
- [ ] Add error boundary for storage quota exceptions
- [ ] Implement JSON schema validation for data integrity
- [ ] Add localStorage monitoring utility for quota checks
- [ ] Create export/import functionality
- [ ] Test localStorage limits and performance

## Related
- [STORY-1.4-persist-to-localstorage.md](../stories/STORY-1.4-persist-to-localstorage.md) - Initial persistence implementation
- [STORY-4.1-localstorage-quota-warning.md](../stories/STORY-4.1-localstorage-quota-warning.md) - Quota warning
- [STORY-4.2-export-tasks-json.md](../stories/STORY-4.2-export-tasks-json.md) - Export functionality
- [STORY-4.3-recover-corrupted-data.md](../stories/STORY-4.3-recover-corrupted-data.md) - Recovery mechanism
