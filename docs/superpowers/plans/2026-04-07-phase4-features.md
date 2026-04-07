# Phase 4: Feature Components Migration (Tasks 31-51)

> Part of Design System Integration Implementation Plan

**Prerequisites:** Phase 1-3 complete (Foundation + Primitives + Composites)

---

## Migration Pattern

Each feature component follows this pattern:
1. Read current component to understand logic
2. Identify all MUI/Emotion/inline styles
3. Rewrite using Tailwind + primitives/composites
4. Test all functionality remains intact
5. Commit

---

### Task 31: Migrate Tarefas Component

**Files:**
- Modify: `src/app/components/Tarefas.tsx`

- [ ] **Step 1: Read current Tarefas component**

```bash
cat src/app/components/Tarefas.tsx | head -100
```

Understand: states, props, business logic, current styling approach

- [ ] **Step 2: Create migrated version**

Replace MUI imports with primitives:
```typescript
// Before:
import { Button, TextField, Select } from '@mui/material'

// After:
import { Button, Input } from '@/components/primitives'
import { Select, Card, Modal, Badge, Table } from '@/components/composites'
```

Replace inline styles/sx props with Tailwind:
```typescript
// Before:
<div style={{ display: 'flex', gap: '16px', padding: '24px' }}>

// After:
<div className="flex gap-4 p-6">
```

- [ ] **Step 3: Test kanban functionality**

Run: `npm run dev`
Navigate to Tarefas page
Verify: drag-drop works, filters work, modals open

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: migrate Tarefas to Tailwind + design system"
```

---

### Task 32: Migrate Empresas Component

**Files:**
- Modify: `src/app/components/Empresas.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/Empresas.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Table` composite for data grid
- `Button` primitive for actions
- `Input` primitive for search
- `Modal` composite for forms
- Tailwind classes for layout

- [ ] **Step 3: Test company management features**

Run: `npm run dev`
Verify: CRUD operations work, search works, pagination works

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat: migrate Empresas to Tailwind + design system"
```

---

### Task 33: Migrate Auditoria Component

**Files:**
- Modify: `src/app/components/Auditoria.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/Auditoria.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Table` for audit log
- `DatePicker` for date filters
- `Select` for filter dropdowns
- `Badge` for status indicators
- Tailwind classes for layout

- [ ] **Step 3: Test audit log viewing**

Run: `npm run dev`
Verify: logs display correctly, filters work, sorting works

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Auditoria.tsx
git commit -m "feat: migrate Auditoria to Tailwind + design system"
```

---

### Task 34: Migrate Relatorios Component

**Files:**
- Modify: `src/app/components/Relatorios.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/Relatorios.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Card` for report cards
- `Table` for data display
- `DatePicker` for date range
- `Dropdown` for export options
- `Button` for actions
- Tailwind classes for grid layout

- [ ] **Step 3: Test reports generation**

Run: `npm run dev`
Verify: reports load, charts render, export works

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Relatorios.tsx
git commit -m "feat: migrate Relatorios to Tailwind + design system"
```

---

### Task 35: Migrate GeradorTarefas Component

**Files:**
- Modify: `src/app/components/GeradorTarefas.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/GeradorTarefas.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Input` for form fields
- `Select`/`Combobox` for dropdowns
- `Checkbox` for multi-select
- `DatePicker` for dates
- `Button` for actions
- Tailwind classes for form layout

- [ ] **Step 3: Test task generation**

Run: `npm run dev`
Verify: form validation works, task creation succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/components/GeradorTarefas.tsx
git commit -m "feat: migrate GeradorTarefas to Tailwind + design system"
```

---

### Task 36: Migrate GerenciarTarefas Component

**Files:**
- Modify: `src/app/components/GerenciarTarefas.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/GerenciarTarefas.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with primitives/composites + Tailwind

- [ ] **Step 3: Test task management**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/GerenciarTarefas.tsx
git commit -m "feat: migrate GerenciarTarefas to Tailwind + design system"
```

---

### Task 37: Migrate InboxConfig Component

**Files:**
- Modify: `src/app/components/InboxConfig.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/InboxConfig.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Input` for text fields
- `Switch` for toggles
- `Button` for save/cancel
- Tailwind classes for settings layout

- [ ] **Step 3: Test inbox configuration**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/InboxConfig.tsx
git commit -m "feat: migrate InboxConfig to Tailwind + design system"
```

---

### Task 38: Migrate FeriadosHorarios Component

**Files:**
- Modify: `src/app/components/FeriadosHorarios.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/FeriadosHorarios.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `DatePicker` for calendar
- `Input` for holiday names
- `Table` for holiday list
- Tailwind classes for layout

- [ ] **Step 3: Test calendar functionality**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/FeriadosHorarios.tsx
git commit -m "feat: migrate FeriadosHorarios to Tailwind + design system"
```

---

### Task 39: Migrate FuncionariosEscritorio Component

**Files:**
- Modify: `src/app/components/FuncionariosEscritorio.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/FuncionariosEscritorio.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with primitives/composites + Tailwind

- [ ] **Step 3: Test staff directory**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/FuncionariosEscritorio.tsx
git commit -m "feat: migrate FuncionariosEscritorio to Tailwind + design system"
```

---

### Task 40: Migrate DocumentosExpress Component

**Files:**
- Modify: `src/app/components/DocumentosExpress.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/DocumentosExpress.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Button` for upload
- `Table` for document list
- `Modal` for previews
- Tailwind classes for layout

- [ ] **Step 3: Test document upload**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/DocumentosExpress.tsx
git commit -m "feat: migrate DocumentosExpress to Tailwind + design system"
```

---

### Task 41: Migrate Circular Component

**Files:**
- Modify: `src/app/components/Circular.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/Circular.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Card` for circular items
- `Badge` for status
- Tailwind classes for grid

- [ ] **Step 3: Test circular viewing**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat: migrate Circular to Tailwind + design system"
```

---

### Task 42: Migrate ModelosDocumento Component

**Files:**
- Modify: `src/app/components/ModelosDocumento.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/ModelosDocumento.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with primitives/composites + Tailwind

- [ ] **Step 3: Test template management**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ModelosDocumento.tsx
git commit -m "feat: migrate ModelosDocumento to Tailwind + design system"
```

---

### Task 43: Migrate PersonalizarAssinatura Component

**Files:**
- Modify: `src/app/components/PersonalizarAssinatura.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/PersonalizarAssinatura.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Input` for text fields
- `Button` for save
- Tailwind classes for form layout

- [ ] **Step 3: Test signature customization**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/PersonalizarAssinatura.tsx
git commit -m "feat: migrate PersonalizarAssinatura to Tailwind + design system"
```

---

### Task 44: Migrate StatusIntegracao Component

**Files:**
- Modify: `src/app/components/StatusIntegracao.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/StatusIntegracao.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Card` for status cards
- `Badge` for connection status
- `Table` for integration list
- Tailwind classes for dashboard layout

- [ ] **Step 3: Test integration dashboard**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/StatusIntegracao.tsx
git commit -m "feat: migrate StatusIntegracao to Tailwind + design system"
```

---

### Task 45: Migrate ListasDetalhadas Component

**Files:**
- Modify: `src/app/components/ListasDetalhadas.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/ListasDetalhadas.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Table` for list display
- `Button` for actions
- `Dropdown` for filters
- Tailwind classes for layout

- [ ] **Step 3: Test detailed lists**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ListasDetalhadas.tsx
git commit -m "feat: migrate ListasDetalhadas to Tailwind + design system"
```

---

### Task 46: Migrate Responsabilidades Component

**Files:**
- Modify: `src/app/components/Responsabilidades.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/Responsabilidades.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Table` for responsibilities list
- `Select` for assignment
- `Checkbox` for multi-select
- Tailwind classes for layout

- [ ] **Step 3: Test responsibility assignment**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Responsabilidades.tsx
git commit -m "feat: migrate Responsabilidades to Tailwind + design system"
```

---

### Task 47: Migrate AdequacaoAgrupadores Component

**Files:**
- Modify: `src/app/components/AdequacaoAgrupadores.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/AdequacaoAgrupadores.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with primitives/composites + Tailwind

- [ ] **Step 3: Test grouping configuration**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/AdequacaoAgrupadores.tsx
git commit -m "feat: migrate AdequacaoAgrupadores to Tailwind + design system"
```

---

### Task 48: Migrate AgrupadorTarefasClientes Component

**Files:**
- Modify: `src/app/components/AgrupadorTarefasClientes.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/AgrupadorTarefasClientes.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Card` for task groups
- `Table` for task lists
- Tailwind classes for layout

- [ ] **Step 3: Test task grouping**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/AgrupadorTarefasClientes.tsx
git commit -m "feat: migrate AgrupadorTarefasClientes to Tailwind + design system"
```

---

### Task 49: Migrate VisaoGeral Component

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx`

- [ ] **Step 1: Read and analyze**

```bash
cat src/app/components/VisaoGeral.tsx | head -100
```

- [ ] **Step 2: Migrate to Tailwind**

Replace MUI with:
- `Card` for dashboard widgets
- `Badge` for metrics
- Tailwind classes for grid layout

- [ ] **Step 3: Test overview dashboard**

Run: `npm run dev`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "feat: migrate VisaoGeral to Tailwind + design system"
```

---

### Task 50: Migrate Remaining Components

**Files:**
- Modify: `src/app/components/UsuariosCliente.tsx`
- Modify: `src/app/components/TemplatesEmailWhatsapp.tsx`

- [ ] **Step 1: Migrate UsuariosCliente**

Follow same pattern: read → migrate → test → commit

- [ ] **Step 2: Migrate TemplatesEmailWhatsapp**

Follow same pattern: read → migrate → test → commit

- [ ] **Step 3: Commit both**

```bash
git add src/app/components/UsuariosCliente.tsx src/app/components/TemplatesEmailWhatsapp.tsx
git commit -m "feat: migrate UsuariosCliente and TemplatesEmailWhatsapp to Tailwind"
```

---

### Task 51: Update App.tsx Imports and Remove MUI

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `package.json`

- [ ] **Step 1: Update App.tsx imports**

```typescript
// Verify all components are using new primitives/composites
import { Button, Input } from '@/components/primitives'
import { Card, Modal, Table } from '@/components/composites'
```

- [ ] **Step 2: Remove MUI/Emotion dependencies**

```bash
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
```

- [ ] **Step 3: Verify app still works**

Run: `npm run dev`
Navigate through all pages
Verify: no console errors, all features work

- [ ] **Step 4: Commit**

```bash
git add src/app/App.tsx package.json package-lock.json
git commit -m "chore: remove MUI and Emotion dependencies"
```

---

**Phase 4 Complete! 🎉**

All feature components migrated. Next: Phase 5 (Figma frames + validation).
