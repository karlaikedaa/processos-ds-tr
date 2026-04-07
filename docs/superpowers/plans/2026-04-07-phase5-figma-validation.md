# Phase 5: Figma Frames + Final Validation (Tasks 52-61)

> Part of Design System Integration Implementation Plan

**Prerequisites:** Phase 1-4 complete (all code migration done)

---

## Figma Frame Creation

### Task 52: Setup Figma Page Structure

**Files:**
- Create: `docs/figma-frames-documentation.md` (tracking doc)

- [ ] **Step 1: Access Figma file via MCP**

Verify MCP Figma connection is working:
```typescript
// Test MCP connection
// File: https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR
```

- [ ] **Step 2: Document Figma structure**

Create `docs/figma-frames-documentation.md`:

```markdown
# Figma Frames Documentation

## File Structure

**Target File:** Processos - DS TR
**URL:** https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395

### Page Organization

- **Primitives Page** - Basic components (Button, Input, etc)
- **Composites Page** - Complex components (Card, Modal, etc)
- **Features Page** - Full screen mockups (Tarefas, Empresas, etc)

### Naming Convention

- Primitives: `ComponentName/Variant/Size/State`
  - Example: `Button/Primary/Medium/Default`
- Composites: `ComponentName/Variant`
  - Example: `Card/Default`
- Features: `FeatureName/ScreenName`
  - Example: `Tarefas/KanbanView`

### Reference DS

All components reference styles from:
**Dom DS Core Web:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
```

- [ ] **Step 3: Commit documentation**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: add Figma frames structure documentation"
```

---

### Task 53: Create Primitive Frames - Buttons

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Button frames in Figma**

Using MCP, create frames for Button component with all variants:
- Primary (Small, Medium, Large) x (Default, Hover, Active, Disabled, Loading)
- Secondary (all sizes x states)
- Destructive (all sizes x states)
- Outline (all sizes x states)
- Ghost (all sizes x states)

Apply DS color/typography styles to each

- [ ] **Step 2: Document frames created**

Add to `docs/figma-frames-documentation.md`:
```markdown
## Primitives Created

### Button
- Location: Primitives Page
- Variants: 25 total (5 variants × 5 states)
- DS Styles Applied: primary color, text styles
- Status: ✅ Complete
```

- [ ] **Step 3: Commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document Button frames in Figma"
```

---

### Task 54: Create Primitive Frames - Form Elements

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Input frames**

Create frames for:
- Input (Text, Email, Password, Number, Textarea) x (Default, Focus, Error, Disabled)

- [ ] **Step 2: Create Checkbox frames**

Create frames for:
- Checkbox (Unchecked, Checked, Indeterminate, Disabled)

- [ ] **Step 3: Create Radio frames**

Create frames for:
- Radio (Unchecked, Checked, Disabled)

- [ ] **Step 4: Create Switch frames**

Create frames for:
- Switch (Off, On, Disabled)

- [ ] **Step 5: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document form primitive frames in Figma"
```

---

### Task 55: Create Primitive Frames - Others

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Badge frames**

Variants: Default, Success, Error, Warning, Info, Outline

- [ ] **Step 2: Create Label frames**

States: Default, Disabled

- [ ] **Step 3: Create Spinner frames**

Sizes: Small, Medium, Large

- [ ] **Step 4: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document Badge, Label, Spinner frames"
```

---

### Task 56: Create Composite Frames - Containers

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Card frames**

Show Card with:
- Header
- Content
- Footer
- Various content types (text, images, actions)

- [ ] **Step 2: Create Modal frames**

Show Modal in:
- Open state
- With different content (form, confirmation, alert)

- [ ] **Step 3: Create Popover/Tooltip frames**

Show positioned examples

- [ ] **Step 4: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document container composite frames"
```

---

### Task 57: Create Composite Frames - Navigation & Data

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Dropdown frames**

Show open state with items

- [ ] **Step 2: Create Select frames**

Show open/closed states

- [ ] **Step 3: Create Tabs frames**

Show active tab variations

- [ ] **Step 4: Create Accordion frames**

Show expanded/collapsed states

- [ ] **Step 5: Create Table frames**

Show table with headers, rows, sorting indicators

- [ ] **Step 6: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document navigation and data composite frames"
```

---

### Task 58: Create Composite Frames - Advanced

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create DatePicker frames**

Show calendar open with:
- Current month view
- Date selection states
- Range selection

- [ ] **Step 2: Create Combobox frames**

Show search + dropdown combo

- [ ] **Step 3: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document advanced composite frames"
```

---

### Task 59: Create Feature Frames - Key Screens

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Tarefas full-screen mockup**

High-fidelity mockup showing:
- Kanban board layout
- Task cards with all states
- Filters panel
- Action buttons
- Modal overlays

Apply DS styles for:
- Colors (primary, neutral, feedback)
- Typography (headings, body text)
- Spacing (padding, gaps)
- Borders and shadows

- [ ] **Step 2: Create Empresas full-screen mockup**

Show:
- Company list table
- Search/filter controls
- Action buttons
- Modal for company form

- [ ] **Step 3: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document Tarefas and Empresas feature frames"
```

---

### Task 60: Create Feature Frames - Additional Screens

**Files:**
- Update: `docs/figma-frames-documentation.md`

- [ ] **Step 1: Create Auditoria mockup**

Show audit log table with filters

- [ ] **Step 2: Create Relatorios mockup**

Show dashboard with cards and charts

- [ ] **Step 3: Create StatusIntegracao mockup**

Show integration status cards

- [ ] **Step 4: Document and commit**

```bash
git add docs/figma-frames-documentation.md
git commit -m "docs: document additional feature frames"
```

---

## Final Validation

### Task 61: Build and Test

**Files:**
- None (validation only)

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors

Check output:
- No MUI/Emotion in bundle
- Bundle size reduced compared to before
- All assets generated correctly

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: All tests pass

If any failures:
- Read test output
- Fix issues
- Re-run tests until all pass

- [ ] **Step 3: Visual regression check**

```bash
npm run dev
```

Manually verify ALL pages:
- [ ] VisaoGeral - loads, widgets display
- [ ] Tarefas - kanban works, drag-drop works, modals open
- [ ] Empresas - table displays, CRUD works
- [ ] Auditoria - logs display, filters work
- [ ] Relatorios - reports load, charts render
- [ ] GeradorTarefas - form works, validation works
- [ ] GerenciarTarefas - task management works
- [ ] InboxConfig - settings save
- [ ] FeriadosHorarios - calendar works
- [ ] FuncionariosEscritorio - directory displays
- [ ] DocumentosExpress - upload works
- [ ] Circular - items display
- [ ] ModelosDocumento - templates load
- [ ] PersonalizarAssinatura - customization works
- [ ] StatusIntegracao - status displays
- [ ] ListasDetalhadas - lists display
- [ ] Responsabilidades - assignment works
- [ ] AdequacaoAgrupadores - config works
- [ ] AgrupadorTarefasClientes - grouping works
- [ ] UsuariosCliente - users display
- [ ] TemplatesEmailWhatsapp - templates load

- [ ] **Step 4: Check bundle size**

```bash
npm run build
ls -lh dist/assets/*.js | head -10
```

Compare with previous build before migration
Expected: Smaller bundle (MUI + Emotion removed)

Example before:
```
-rw-r--r-- 1 user user 850K main.js
```

Example after (expected):
```
-rw-r--r-- 1 user user 650K main.js  # ~200KB reduction
```

- [ ] **Step 5: Verify design tokens in use**

Inspect elements in browser dev tools:
- Check computed styles use CSS variables from tokens
- Verify no hardcoded colors like `rgb(214, 64, 0)` directly
- Colors should reference `var(--primary)` or Tailwind classes

- [ ] **Step 6: Test sync workflow**

```bash
npm run sync-design-tokens
```

Expected: Runs successfully, updates tokens.ts if DS changed

- [ ] **Step 7: Verify Figma frames**

Open Figma file:
https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395

Verify:
- All pages exist (Primitives, Composites, Features)
- Frames organized clearly
- DS styles applied correctly
- Naming convention followed

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "chore: complete design system integration migration

- All components migrated from MUI/Emotion to Tailwind
- Design tokens extracted from Figma DS
- Automated sync workflow configured
- High-fidelity Figma frames created
- Bundle size reduced by ~200KB
- All functionality tested and working"
```

- [ ] **Step 9: Create summary report**

Create `docs/migration-summary.md`:

```markdown
# Design System Integration Migration - Summary

**Completion Date:** $(date +%Y-%m-%d)

## What Was Done

### Phase 1: Foundation
- ✅ Extracted design tokens from Figma DS
- ✅ Created Tailwind preset with tokens
- ✅ Setup automated sync workflow (GitHub Actions)
- ✅ Configured development environment

### Phase 2: Primitives
- ✅ Migrated 8 primitive components (Button, Input, Badge, Label, Checkbox, Radio, Switch, Spinner)
- ✅ All components using design tokens
- ✅ Radix UI integrated for accessibility

### Phase 3: Composites
- ✅ Migrated 11 composite components (Card, Modal, Dropdown, Select, Popover, Tooltip, Tabs, Accordion, Table, DatePicker, Combobox)
- ✅ Built on top of primitives
- ✅ Consistent API patterns

### Phase 4: Features
- ✅ Migrated 21 feature components
- ✅ Removed all MUI/Emotion dependencies
- ✅ All business logic intact
- ✅ All functionality tested

### Phase 5: Figma Documentation
- ✅ Created high-fidelity frames for all components
- ✅ Organized in Figma file with clear structure
- ✅ Applied DS styles consistently
- ✅ Documentation maintained

## Metrics

- **Components Migrated:** 40 total (8 primitives + 11 composites + 21 features)
- **Bundle Size Reduction:** ~200KB (MUI + Emotion removed)
- **Build Time:** No significant change
- **Test Coverage:** Maintained at same level
- **Figma Frames Created:** 100+ frames across all components

## Maintenance

### Syncing Design Tokens

The sync workflow runs daily at 3 AM automatically. To manually sync:

\`\`\`bash
npm run sync-design-tokens
\`\`\`

This creates a PR if changes detected.

### Adding New Components

1. Create component in appropriate directory (primitives/composites/features)
2. Use design tokens via Tailwind classes
3. Create corresponding Figma frame
4. Document in Figma frames doc

### Updating Existing Components

- Business logic changes: Edit component files directly
- Design changes: Update in Figma DS first, then sync will propagate

## Links

- **Figma DS (source of truth):** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
- **Figma Documentation:** https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395
- **Design Spec:** docs/superpowers/specs/2026-04-07-design-system-integration-design.md
- **Implementation Plans:** docs/superpowers/plans/

## Success Criteria ✅

- [x] All components use design tokens (no hardcoded values)
- [x] Tailwind CSS is the only styling solution
- [x] MUI and Emotion removed
- [x] Automated sync workflow functional
- [x] All functionality maintained
- [x] Bundle size reduced
- [x] Figma documentation complete
- [x] High-fidelity frames for all components

## Next Steps

- Monitor automated sync PRs
- Update components as DS evolves
- Maintain Figma documentation
- Consider adding visual regression testing
```

- [ ] **Step 10: Commit summary**

```bash
git add docs/migration-summary.md
git commit -m "docs: add migration summary report"
```

---

**Phase 5 Complete! 🎉🎉🎉**

**Entire Design System Integration COMPLETE!**

All 61 tasks finished. Project ready for production.
