# Reorganize Visão Geral Layout Design

**Date:** 2026-04-07  
**Status:** Approved

## Overview

Reorganize the Visão Geral dashboard layout to match the Figma reference design. This includes reordering blocks, updating the 3 main cards with progress bars and section titles, and standardizing table columns across all performance and task tables.

## Context

The current Visão Geral dashboard has blocks in a different order than the design reference, and the tables use inconsistent column structures. The user provided Figma reference images showing:
- Specific block ordering
- Enhanced cards with section titles and progress bars
- Standardized table columns with detailed status breakdowns

All existing functionality (expansions, drawers, navigation) must be preserved.

## Design

### 1. Block Reorganization

**New sequence in VisaoGeral component:**

1. Header (unchanged)
2. Card Tarefas Vencendo Hoje (current "Tarefas bar" - keep as-is)
3. Alerta 1: Falha de envio (AlertBanner)
4. Alerta 2: Configurações pendentes (existing alert)
5. 3 Cards Principais (3-column grid - updated with new structure)
6. Resumo de Tarefas + Ações Rápidas (current grid - unchanged)
7. Desempenho por Responsável + Desempenho por Departamento (2-column grid - update columns)
8. Tarefas por Empresa (table - update columns)
9. Tarefas (table - update columns)
10. Drawers (keep at end)

**What gets removed:**
- KPI Row 1 and KPI Row 2 sections (not in reference design)

**Why this order:**
- Alerts elevated for visibility
- Main action cards follow alerts
- Summary and quick actions provide context
- Performance tables before detail tables
- Maintains logical information flow

### 2. Three Main Cards Update

**Card 1: Tarefas abertas**
- Small title (top): "Tarefas abertas" (text-caption, muted-foreground)
- Main title: "4 pontos de atenção"
- **New**: Progress bar with label "Concluídas 50 de 58"
- Bullet list with colored dots:
  - Purple (#6C3FB5): "1 tarefas gerando multa"
  - Red (var(--destructive)): "2 tarefas atrasadas"
  - Blue (var(--chart-2)): "2 tarefas aguardando aprovação"

**Card 2: Cobrança de documentos**
- Small title (top): "Cobrança de documentos"
- Main title: "120 tarefas abertas com documentos pendentes"
- Bullet list:
  - Green (var(--chart-1)): "210 tarefas abertas com documentos enviados"
  - Red (var(--destructive)): "148 Tarefas sem usuários de clientes vinculados"

**Card 3: Tarefas sujeitas à multa**
- Small title (top): "Tarefas sujeitas à multa"
- Main title: "150 a concluir hoje"
- **New**: Progress bar with label "Próximos 5 dias 200 de 400"
- Bullet list:
  - Orange (var(--chart-3)): "A concluir (em 5 dias)"
  - Red (var(--destructive)): "Concluídas - arquivos não baixados (hoje)"
  - Blue (var(--chart-2)): "Concluídas - arquivos não baixados (em 5 dias)"

**Implementation approach:**
- Add small title as `<p>` with caption styles above existing main title
- Add `ProgressBar` component similar to vencendo hoje card for cards 1 and 3
- Update bullet text and colors to match reference
- Maintain card structure and spacing

### 3. Table Column Updates

**Desempenho por Responsável**

Columns:
1. Funcionário (avatar + name)
2. Abertas total
3. Abertas em atraso (red badge)
4. Abertas com multa (purple badge)
5. Concluídas total
6. Concluídas em atraso (red badge)
7. Concluídas com multa (purple badge)
8. % (colored: green >80%, orange 50-79%, red <50%)

**Desempenho por Departamento**

Columns:
1. Departamentos (text only, no avatar)
2. Abertas total
3. Abertas em atraso (red badge)
4. Abertas com multa (purple badge)
5. Concluídas total
6. Concluídas em atraso (red badge)
7. Concluídas com multa (purple badge)
8. % (same coloring as responsável)

**Tarefas por Empresa**

Columns:
1. Empresas (Building2 icon + name)
2. Total
3. Abertas
4. Aberta em atraso (red badge)
5. Aberta com multa (purple badge)
6. Concluídas
7. Concluídas em atraso (red badge)
8. Concluídas com multa (purple badge)
9. Progresso (progress bar + percentage)

Expansion behavior (maintained):
- Click row → expand → show tasks with status badges
- Click task → navigate to filtered task list

**Tarefas**

Columns:
1. Tarefa (FileText icon + name)
2. Tipo (icon + label with background):
   - 🔄 Recorrente (blue): var(--chart-2)
   - ⚡ Esporádica (orange): var(--chart-3)
   - 🔀 Fluxo (red): var(--destructive)
3. Total
4. Abertas
5. Aberta em atraso (red badge)
6. Aberta com multa (purple badge)
7. Concluídas
8. Concluídas em atraso (red badge)
9. Concluídas com multa (purple badge)
10. Progresso (progress bar + percentage)

Expansion behavior (maintained):
- Click row → expand → show empresas with status badges
- Click empresa → navigate to filtered task list

**Badge component:**
- Use existing `BadgeCount` component for numeric badges
- Red background: rgba(220,10,10,0.1), red text
- Purple background: rgba(108,63,181,0.1), purple text

**ProgressBar component:**
- Use existing `ProgressBar` component
- Color based on percentage (green >80%, orange <80%)
- Show percentage text next to bar

### 4. Preserved Functionalities

**Must maintain:**

1. **Click handlers:**
   - Card Vencendo Hoje → opens TaskListDrawer
   - Alert "Abrir tarefas" → opens FalhaEnvioDrawer
   - Alert "Abrir detalhes" → opens ConfigPendentesDrawer
   - Table rows → expansion toggle

2. **Expansion states:**
   - `expandedEmpresa` for Tarefas por Empresa table
   - `expandedTarefa` for Tarefas table
   - ChevronRight rotation animation on expand

3. **Navigation:**
   - `onNavigateTarefas(viewTab, filter)` function
   - Filters passed: `{ status, cliente }` or `{ status }`

4. **Drawers:**
   - TaskListDrawer (vencendo hoje, concluídas, abertas)
   - FalhaEnvioDrawer (portal, email, whatsapp tabs)
   - ConfigPendentesDrawer (inativos, sem email, etc.)
   - ListasDetalhadas panel (side panel)

5. **Mock data:**
   - Keep all existing mock data structures
   - Update mock data objects to include new columns
   - Add values for "em atraso" and "com multa" breakdowns

6. **Components:**
   - StatusBadge component for expanded rows
   - BadgeCount component for table badges
   - ProgressBar component for progress bars
   - All drawer components

**What changes:**
- JSX block order in render
- Table column headers and data cells
- Card structures (add titles, progress bars)
- Remove KPI Row sections

**What stays exactly the same:**
- All event handlers and their logic
- State management (useState hooks)
- Mock data variable names and structure
- Component imports
- Drawer implementations
- Navigation logic

## Technical Implementation Notes

**File:** `src/app/components/VisaoGeral.tsx`

**Mock data adjustments:**
- Add `abertasAtraso`, `abertasMulta`, `concluidasAtraso`, `concluidasMulta` to:
  - `responsaveis` array
  - `departamentos` array
  - `empresas` array
  - `tarefasAgrupadas` array

**Table rendering:**
- Update `thead` with new column headers
- Update `tbody` cells to render new columns
- Maintain existing expansion logic in separate `<tr>` elements
- Keep ChevronRight icon rotation logic

**Progress bars:**
- Reuse existing ProgressBar component
- Add similar structure to cards 1 and 3
- Label format: "Label X de Y"

**Styling:**
- Maintain all existing inline styles and Tailwind classes
- Use CSS variables for colors (var(--chart-1), var(--destructive), etc.)
- Keep card shadows, spacing, and responsive grid layouts

## Testing Verification

After implementation:

1. **Visual verification:**
   - Block order matches reference
   - Cards have small titles and progress bars
   - Table columns match reference exactly
   - All badges display correctly

2. **Functional verification:**
   - Click vencendo hoje card → drawer opens
   - Click alerts → correct drawers open
   - Expand empresa row → tasks appear with badges
   - Click task in expansion → navigates with filters
   - Expand tarefa row → empresas appear with badges
   - Click empresa in expansion → navigates with filters
   - All percentages calculate correctly
   - Progress bars show correct values

3. **Responsive verification:**
   - 3-card grid stacks on mobile
   - 2-column grids stack on mobile
   - Tables scroll horizontally on narrow screens
   - Drawers work on all screen sizes

## Files Affected

- `src/app/components/VisaoGeral.tsx` - main changes (block order, cards, tables)

## Notes

- This is purely a layout and data structure reorganization
- No functional behavior changes beyond what's visible
- All existing patterns and conventions maintained
- No new dependencies required
- KPI Rows removed as they don't appear in reference design
