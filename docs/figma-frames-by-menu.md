# Figma Frames - Organização por Menu

**Arquivo Destino:** Processos - DS TR  
**URL:** https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395  
**DS Source:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web

---

## 📋 Resumo Executivo

**Total de Frames Planejados:** ~150+

| Menu | Componentes | Frames Estimados |
|------|-------------|------------------|
| Menu 1: Primitivos | 8 | ~60 |
| Menu 2: Compostos | 11 | ~40 |
| Menu 3: Features | 7+ | ~50+ |

---

## 🎨 Menu 1: Componentes Primitivos

**Página no Figma:** "Primitives"  
**Layout:** Grid 4 colunas, spacing 64px  
**Total:** 8 componentes

### 1.1 Button
**Frames:** 120 total (6 variants × 4 sizes × 5 states)

```
Button/default/sm/default
Button/default/sm/hover
Button/default/sm/active
Button/default/sm/disabled
Button/default/sm/loading

Button/default/default/default
Button/default/default/hover
... (repeat for each size)

Button/default/lg/default
Button/default/lg/hover
...

Button/default/icon/default
Button/default/icon/hover
...

Button/destructive/sm/default
... (repeat for all variants)

Button/outline/...
Button/secondary/...
Button/ghost/...
Button/link/...
```

**Variants:** default, destructive, outline, secondary, ghost, link  
**Sizes:** sm, default, lg, icon  
**States:** default, hover, active, disabled, loading

**Design Requirements:**
- Use `--primary` color from DS for default variant
- Use `--destructive` for destructive variant
- Apply DS typography: `text-base`, `font-semibold`
- Border radius: `--radius-sm`
- Padding: 12px horizontal, 8px vertical (md)

---

### 1.2 Input
**Frames:** 16 total (4 variants × 4 states)

```
Input/text/default
Input/text/focus
Input/text/error
Input/text/disabled

Input/email/default
Input/email/focus
Input/email/error
Input/email/disabled

Input/password/default
Input/password/focus
Input/password/error
Input/password/disabled

Input/number/default
Input/number/focus
Input/number/error
Input/number/disabled
```

**Variants:** text, email, password, number  
**States:** default, focus, error, disabled

**Design Requirements:**
- Background: `--input-background`
- Border: `--border` (1px solid)
- Focus ring: `--ring` (2px)
- Error border: `--destructive`
- Height: 40px
- Padding: 12px horizontal
- Typography: `text-base`

---

### 1.3 Badge
**Frames:** 4 total (4 variants × 1 state)

```
Badge/default
Badge/secondary
Badge/destructive
Badge/outline
```

**Variants:** default, secondary, destructive, outline  
**States:** default

**Design Requirements:**
- Background: `--primary` (default), `--secondary`, `--destructive`
- Typography: `text-badge`, `font-semibold`
- Padding: 4px horizontal, 2px vertical
- Border radius: `--radius-full` (pill shape)

---

### 1.4 Checkbox
**Frames:** 4 total (1 variant × 4 states)

```
Checkbox/unchecked
Checkbox/checked
Checkbox/indeterminate
Checkbox/disabled
```

**States:** unchecked, checked, indeterminate, disabled

**Design Requirements:**
- Size: 16×16px
- Border: `--border` (1px)
- Checked background: `--primary`
- Checkmark: white, 12px
- Border radius: `--radius-sm`

---

### 1.5 Radio
**Frames:** 3 total (1 variant × 3 states)

```
Radio/unchecked
Radio/checked
Radio/disabled
```

**States:** unchecked, checked, disabled

**Design Requirements:**
- Size: 16×16px (outer)
- Border: `--border` (1px)
- Checked: `--primary` dot, 8×8px (inner)
- Border radius: full (circle)

---

### 1.6 Switch
**Frames:** 3 total (1 variant × 3 states)

```
Switch/off
Switch/on
Switch/disabled
```

**States:** off, on, disabled

**Design Requirements:**
- Size: 44×24px (track)
- Thumb: 20×20px circle
- Off background: `--input`
- On background: `--primary`
- Border radius: full

---

### 1.7 Label
**Frames:** 2 total (1 variant × 2 states)

```
Label/default
Label/disabled
```

**States:** default, disabled

**Design Requirements:**
- Typography: `text-label`, `font-regular`
- Color: `--foreground` (default), `--muted-foreground` (disabled)

---

### 1.8 Textarea
**Frames:** 4 total (1 variant × 4 states)

```
Textarea/default
Textarea/focus
Textarea/error
Textarea/disabled
```

**States:** default, focus, error, disabled

**Design Requirements:**
- Same as Input but multi-line
- Min height: 80px
- Resize: vertical

---

## 🧩 Menu 2: Componentes Compostos

**Página no Figma:** "Composites"  
**Layout:** Grid 3 colunas, spacing 96px  
**Total:** 11 componentes

### 2.1 Card
**Frames:** 4 total

```
Card/default
Card/with-header
Card/with-footer
Card/full
```

**Design Requirements:**
- Background: `--card`
- Border: `--border` (1px)
- Border radius: `--radius-card`
- Padding: 24px
- Shadow: `--elevation-sm`

---

### 2.2 Dialog (Modal)
**Frames:** 3 total

```
Dialog/alert
Dialog/form
Dialog/confirmation
```

**Design Requirements:**
- Overlay: black 50% opacity
- Content: `--card` background
- Max width: 512px
- Padding: 24px
- Border radius: `--radius-card`
- Shadow: `--elevation-lg`

---

### 2.3 Dropdown
**Frames:** 2 total

```
Dropdown/closed
Dropdown/open
```

**Design Requirements:**
- Trigger: Button style
- Menu: `--popover` background
- Border: `--border`
- Border radius: `--radius-md`
- Padding: 8px
- Shadow: `--elevation-md`

---

### 2.4 Select
**Frames:** 2 total

```
Select/closed
Select/open
```

**Design Requirements:**
- Same as Dropdown
- Chevron icon indicator

---

### 2.5 Popover
**Frames:** 2 total

```
Popover/closed
Popover/open
```

**Design Requirements:**
- Background: `--popover`
- Border: `--border`
- Padding: 16px
- Border radius: `--radius-md`
- Shadow: `--elevation-md`
- Arrow: 8×8px

---

### 2.6 Tooltip
**Frames:** 2 total

```
Tooltip/hidden
Tooltip/visible
```

**Design Requirements:**
- Background: `--popover`
- Padding: 8px 12px
- Typography: `text-caption`
- Border radius: `--radius-sm`
- Shadow: `--elevation-sm`

---

### 2.7 Tabs
**Frames:** 2 total

```
Tabs/horizontal
Tabs/vertical
```

**Design Requirements:**
- Active tab: `--primary` underline (2px)
- Inactive tab: `--muted-foreground`
- Typography: `text-label`
- Padding: 12px horizontal

---

### 2.8 Accordion
**Frames:** 2 total

```
Accordion/collapsed
Accordion/expanded
```

**Design Requirements:**
- Border bottom: `--border` (1px)
- Chevron icon (rotates on expand)
- Padding: 16px vertical
- Typography: `text-base`

---

### 2.9 Table
**Frames:** 3 total

```
Table/default
Table/with-sorting
Table/with-pagination
```

**Design Requirements:**
- Header: `--muted` background
- Rows: alternate `--background` and `--muted/50`
- Border: `--border`
- Cell padding: 12px
- Typography: `text-label`

---

### 2.10 Calendar
**Frames:** 2 total

```
Calendar/default
Calendar/with-selection
```

**Design Requirements:**
- Cell size: 40×40px
- Selected: `--primary` background
- Today: `--accent` border
- Disabled: `--muted-foreground`
- Typography: `text-label`

---

### 2.11 Command (Combobox)
**Frames:** 3 total

```
Command/closed
Command/open
Command/with-results
```

**Design Requirements:**
- Input at top
- Results list below
- Background: `--popover`
- Max height: 400px
- Border radius: `--radius-md`

---

## 📱 Menu 3: Feature Screens

**Página no Figma:** "Features"  
**Layout:** Vertical stack, spacing 128px  
**Total:** 7+ telas principais

### 3.1 Tarefas (Kanban)
**Frames:** 3 total

```
Tarefas/kanban-view
Tarefas/list-view
Tarefas/detail-panel
```

**Size:** 1440×900px (desktop)

**Components Used:**
- Card (for task cards)
- Badge (for status)
- Button (actions)
- Modal (task details)
- Tabs (detail tabs)

**Layout:**
- 3-column kanban layout
- Left: Task groups (collapsible)
- Center: Kanban columns
- Right: Task detail panel

**Colors:**
- Status badges: Use feedback colors
- Primary actions: `--primary`
- Borders: `--border`

---

### 3.2 Empresas (Companies)
**Frames:** 2 total

```
Empresas/table-view
Empresas/detail-modal
```

**Size:** 1440×900px

**Components Used:**
- Table (main list)
- Button (actions)
- Input (search)
- Modal (company form)
- Badge (status)

**Layout:**
- Header with search and filters
- Data table with sorting
- Action buttons per row

---

### 3.3 Auditoria (Audit Log)
**Frames:** 2 total

```
Auditoria/log-view
Auditoria/filter-panel
```

**Size:** 1440×900px

**Components Used:**
- Table (log entries)
- DatePicker (filter)
- Select (filter dropdowns)
- Badge (event types)

---

### 3.4 Relatorios (Reports)
**Frames:** 2 total

```
Relatorios/dashboard-view
Relatorios/chart-view
```

**Size:** 1440×900px

**Components Used:**
- Card (report widgets)
- Chart components
- DatePicker (date range)
- Button (export)

**Layout:**
- Grid of report cards
- Charts and metrics
- Filter panel on right

---

### 3.5 StatusIntegracao
**Frames:** 1 total

```
StatusIntegracao/cards-view
```

**Size:** 1440×900px

**Components Used:**
- Card (status cards)
- Badge (connection status)
- Table (integration list)

**Layout:**
- Grid of status cards
- Color-coded indicators

---

### 3.6 GeradorTarefas
**Frames:** 1 total

```
GeradorTarefas/form-wizard
```

**Size:** 1440×900px

**Components Used:**
- Input fields
- Select dropdowns
- Checkbox
- DatePicker
- Button (navigation)

**Layout:**
- Multi-step form wizard
- Progress indicator
- Navigation buttons

---

### 3.7 VisaoGeral (Overview)
**Frames:** 1 total

```
VisaoGeral/dashboard-view
```

**Size:** 1440×900px

**Components Used:**
- Card (dashboard widgets)
- Badge (metrics)
- Chart components

**Layout:**
- Dashboard grid
- Key metrics at top
- Charts and tables below

---

## 🎨 Design Token Application Guide

### Colors
```
Primary: rgba(214, 64, 0, 1)
Secondary: transparent
Destructive: rgba(220, 10, 10, 1)
Success: rgba(56, 124, 43, 1)
Warning: rgba(254, 166, 1, 1)
Info: rgba(21, 115, 211, 1)

Background: rgba(255, 255, 255, 1)
Foreground: rgba(31, 31, 31, 1)
Muted: rgba(230, 230, 230, 1)
Border: rgba(242, 242, 242, 1)
```

### Typography
```
Font Family: Source Sans 3
H1: 48px / 600 / 1.2 line-height
H2: 32px / 600 / 1.25
H3: 24px / 600 / 1.3
H4: 16px / 600 / 1.4
Base: 16px / 400 / 1.5
Label: 14px / 400 / 1.4
Caption: 12px / 400 / 1.3
Badge: 9px / 600 / 1.2
```

### Spacing
```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
6: 24px
8: 32px
12: 48px
16: 64px
```

### Border Radius
```
sm: 4px
md: 8px
lg: 12px
full: 9999px
```

### Elevation
```
sm: 2px 4px 4px 0px rgba(0, 0, 0, 0.12)
md: 4px 8px 12px 0px rgba(0, 0, 0, 0.15)
lg: 8px 16px 24px 0px rgba(0, 0, 0, 0.18)
```

---

## 📝 Frame Creation Checklist

For each frame:
- [ ] Apply correct DS color styles (not hardcoded)
- [ ] Apply correct DS typography styles
- [ ] Use proper spacing from DS
- [ ] Add component description
- [ ] Include all required states/variants
- [ ] Link to source code file
- [ ] Organize in correct page/section
- [ ] Name using convention: Component/Variant/Size/State

---

## 🔄 Maintenance

When creating frames:
1. Reference DS file for all styles
2. Create component in Figma (for reusability)
3. Add documentation in description
4. Link to GitHub source code
5. Keep frames organized by menu structure

When updating:
1. Update frame in Figma
2. Update documentation
3. Commit changes to git

---

**Total Frames to Create:** ~150+  
**Estimated Time:** 8-12 hours (for all frames)  
**Status:** 📋 Structure documented, ready for creation

---

## 🚀 Next Steps

1. Setup Figma access (FIGMA_ACCESS_TOKEN)
2. Create page structure in Figma
3. Start with Menu 1 (Primitives) - highest priority
4. Progress to Menu 2 (Composites)
5. Complete with Menu 3 (Features)

**Frames can be created:**
- ✅ Manually in Figma UI (follow this guide)
- ✅ Via Figma MCP automation (when configured)
- ✅ Using Figma Plugin (batch creation)
