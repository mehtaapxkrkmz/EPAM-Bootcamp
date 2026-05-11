# ADR-4: Add IndexedDB as Secondary Storage for High-Volume Projects

## Status
Proposed (Supersedes: ADR-2 for specific use cases)

## Context

**New Requirement** (May 2026):
User research reveals that power users managing 50+ concurrent tasks per project experience:
- localStorage write latency increases from 10ms to 500ms+ (JavaScript blocking)
- Storage quota exhausted faster than expected (one user hit 9.8MB limit with 3 projects)
- Data exports as JSON are >50MB (too large to email or backup)
- Some users want to store project metadata (attachments, notes with images)

**Constraint Analysis**:
- localStorage synchronous writes block UI thread on large datasets
- 5-10MB limit is insufficient for multimedia-heavy projects
- Users want structured queries ("show all tasks created this week")

**Why Not Continue with ADR-2 Alone?**
- ADR-2 works well for 1-2 projects with <1000 tasks each
- Power users need async storage to prevent UI blocking
- Image/file storage requires more than localStorage's string limit
- Queries are expensive in localStorage (must deserialize entire dataset)

**Note**: This is NOT a rejection of ADR-2, but rather a **complementary extension** for high-volume use cases.

## Decision

We will **add IndexedDB as a secondary storage layer** while keeping localStorage as the primary cache:

### Architecture: Tiered Storage

```
Tier 1 (Hot Cache): localStorage
├─ Current project data only
├─ Last 100 tasks of active project
├─ Sync to Tier 2 on mutations

Tier 2 (Primary): IndexedDB
├─ All projects and all tasks
├─ Async API (no UI blocking)
├─ Rich queries via indexes
├─ Can store files/attachments

Tier 3 (Backup): JSON export
├─ Manual user export
├─ Stored in cloud (user's choice)
```

### Implementation Details

1. **IndexedDB Stores**:
   ```javascript
   stores = [
     'projects' (keyPath: 'id'),
     'tasks' (keyPath: 'id', indexes: ['projectId', 'createdDate', 'status']),
     'attachments' (keyPath: 'id', indexes: ['taskId'])
   ]
   ```

2. **Sync Strategy** (localStorage ↔ IndexedDB):
   ```
   On Task Create:
     1. Write to IndexedDB (async)
     2. Update localStorage (hot cache)
     3. Wait for IndexedDB promise
     4. Update UI optimistically
   
   On App Load:
     1. Check localStorage (instant display)
     2. Verify against IndexedDB in background
     3. If mismatch detected, offer recovery options
   ```

3. **Quota Management**:
   - IndexedDB: 50MB+ available (vendor-specific)
   - Monitor via `navigator.storage.estimate()`
   - Store large attachments in IndexedDB, not localStorage

4. **Backwards Compatibility**:
   - Existing localStorage data migrated to IndexedDB on first load
   - Migration happens in background, doesn't block UI
   - Users can downgrade to localStorage-only by deleting IndexedDB (optional)

5. **Feature Gating**:
   - Enable IndexedDB for projects with >500 tasks
   - Default localStorage for smaller projects (simpler, faster)
   - User can force IndexedDB mode in settings

## Consequences

### Positive
- ✅ **No UI blocking**: Async IndexedDB writes don't freeze keyboard input
- ✅ **Larger storage**: 50MB+ vs 10MB localStorage
- ✅ **Rich queries**: Can index by status, date, tags
- ✅ **File attachments**: Store images/documents with tasks
- ✅ **Backwards compatible**: Existing apps continue working
- ✅ **Graceful degradation**: Falls back to localStorage on quota exceeded

### Negative
- ⚠️ **Increased complexity**: Dual-sync logic, migration code
- ⚠️ **Larger bundle**: IndexedDB polyfill adds ~5KB gzipped
- ⚠️ **Browser support**: Not available in IE11 (acceptable; target modern browsers)
- ⚠️ **Testing complexity**: Must test sync scenarios (what if IndexedDB write fails?)
- ⚠️ **User confusion**: Users may not understand when localStorage vs IndexedDB is used

### Risks
- 🔴 **Out-of-sync data**: localStorage and IndexedDB could diverge on network reconnect (future cloud feature)
- 🔴 **Browser quota exhaustion**: User could fill IndexedDB + localStorage and hit quota limit
- 🔴 **Debugging difficulty**: Harder to inspect state across two storage layers

## Supersession Rationale

**Why ADR-4 supersedes ADR-2 (for specific use cases)**:
- ADR-2 is still correct for default case (small projects, simple workflows)
- ADR-4 extends ADR-2 for edge case (high-volume users, rich media)
- Neither decision is wrong; ADR-4 is a complementary evolution, not replacement

**Exception Cases**:
- Users with <500 tasks → Use localStorage only (ADR-2)
- Users with 500-5000 tasks → Use IndexedDB + localStorage cache (ADR-4)
- Users with 5000+ tasks → IndexedDB with daily exports (future cloud sync)

## Implementation Timeline

| Phase | Work | Effort | Timeline |
|-------|------|--------|----------|
| Phase 1 | Design IndexedDB schema | 4 hours | Week 1 |
| Phase 2 | Implement data migration | 8 hours | Week 2 |
| Phase 3 | Add async sync layer | 12 hours | Week 3 |
| Phase 4 | Implement sync conflict resolution | 8 hours | Week 4 |
| Phase 5 | Testing & migration validation | 8 hours | Week 5 |

**Total**: ~4 weeks of development

## Related
- [ADR-2: Use localStorage for State Persistence](ADR-2-localstorage-persistence.md) - **Original decision** (still valid for default case)
- [EPIC-4-data-persistence-export.md](../epics/EPIC-4-data-persistence-export.md) - Larger data persistence context
- Future: "ADR-5: Add Cloud Sync for Multi-Device Support" (proposed but not yet created)

## Decision Record

- **Proposed by**: Architecture review (May 2026)
- **Approved by**: [Pending team review]
- **Implementation start**: [Pending approval]
- **Review date**: August 1, 2026 (after 2 months in production)
