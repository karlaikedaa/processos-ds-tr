# Rename "Tarefas por status" Card to "Tarefas" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the "Tarefas por status" card title to "Tarefas" in the Visão Geral dashboard.

**Architecture:** Simple text change in the VisaoGeral component. No functional changes, no new components, no data structure modifications.

**Tech Stack:** React, TypeScript

---

## File Structure

**Modified:**
- `src/app/components/VisaoGeral.tsx:1167` - Card title text

**No new files created.**
**No test files modified** (this is a cosmetic text change with no logic to test).

---

## Task 1: Update Card Title

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:1167`

- [ ] **Step 1: Locate and update the card title text**

Open `src/app/components/VisaoGeral.tsx` and find line 1167:

```tsx
// Before (line 1167):
<p className="text-label font-semibold text-foreground">Tarefas por status</p>

// After:
<p className="text-label font-semibold text-foreground">Tarefas</p>
```

Use the Edit tool to make the change:
- old_string: `<p className="text-label font-semibold text-foreground">Tarefas por status</p>`
- new_string: `<p className="text-label font-semibold text-foreground">Tarefas</p>`

- [ ] **Step 2: Verify the change in the browser**

1. Ensure the dev server is running at http://localhost:5174/
2. Navigate to the Visão Geral page
3. Locate the card in the bottom section (right side of the two-column layout)
4. Confirm the title now reads "Tarefas" instead of "Tarefas por status"
5. Verify the expansion functionality still works:
   - Click on a task row to expand
   - Verify companies list appears with status badges
   - Click on a company to verify navigation works

Expected: Card title displays "Tarefas", all functionality intact.

- [ ] **Step 3: Commit the change**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
refactor: rename card title from 'Tarefas por status' to 'Tarefas'

Simplify the card title in Visão Geral dashboard. The card displays
tasks grouped by name rather than status, so the simplified title is
more accurate.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully with message.

---

## Verification Checklist

After completing all tasks:

- [ ] Card title displays "Tarefas" (not "Tarefas por status")
- [ ] Expansion functionality works (click task → see companies)
- [ ] Status badges display correctly in expanded view
- [ ] Navigation works (click company → filter task list)
- [ ] No visual regressions (spacing, styling unchanged)
- [ ] Change committed to git

---

## Self-Review Notes

**Spec coverage:**
- ✅ Rename card title from "Tarefas por status" to "Tarefas" (Task 1, Step 1)
- ✅ Keep all functionality unchanged (verified in Task 1, Step 2)
- ✅ Commit the change (Task 1, Step 3)

**Placeholder scan:**
- No TBD, TODO, or placeholders present
- All code blocks show exact changes
- All commands include expected output

**Type consistency:**
- N/A - no type changes in this plan

**Gaps:**
- None identified
