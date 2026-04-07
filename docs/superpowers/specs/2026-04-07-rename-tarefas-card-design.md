# Rename "Tarefas por status" Card to "Tarefas"

**Date:** 2026-04-07  
**Status:** Approved

## Overview

Rename the "Tarefas por status" card in the Visão Geral dashboard to simply "Tarefas". This is a cosmetic change only - no functionality or behavior changes.

## Context

The card currently labeled "Tarefas por status" displays tasks grouped by task name (e.g., "DCTF Ago/25", "REINF Out/25") rather than by status. The existing expansion functionality works correctly:
- Clicking a task name expands to show all companies with that task
- Each expanded item shows a status badge
- Clicking a company navigates to the filtered task list

The user wants to simplify the card name from "Tarefas por status" to "Tarefas" while keeping all visual styling and functionality unchanged.

## Design

### Scope

Update only the card title text in the Visão Geral component.

### Implementation

**File:** `src/app/components/VisaoGeral.tsx`  
**Line:** 1167  
**Change:** 
```tsx
// Before:
<p className="text-label font-semibold text-foreground">Tarefas por status</p>

// After:
<p className="text-label font-semibold text-foreground">Tarefas</p>
```

### What Stays the Same

- All expansion functionality remains unchanged
- Status badges remain unchanged
- Navigation behavior remains unchanged
- Visual styling remains unchanged
- Code comments remain unchanged
- Mock data remains unchanged

### Files Affected

- `src/app/components/VisaoGeral.tsx` - 1 line change

## Testing

Manual verification:
1. Open the Visão Geral dashboard
2. Verify the card title now reads "Tarefas" instead of "Tarefas por status"
3. Verify expansion functionality still works correctly
4. Verify navigation to filtered lists still works

## Notes

- This is a text-only change with no behavioral impact
- Code comments were intentionally left unchanged as part of the chosen approach (Option A)
