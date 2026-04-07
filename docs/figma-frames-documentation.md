# Figma Frames Documentation

## File Structure

**Target File:** Processos - DS TR  
**URL:** https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395

**Source DS:** Dom DS Core Web  
**URL:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web

## Page Organization

### Page 1: Primitives
Components from `src/app/components/ui/`:
- Button (all variants: default, destructive, outline, secondary, ghost, link)
- Input (text, email, password, number, textarea)
- Badge (default, secondary, success, error, warning, info, outline)
- Label
- Checkbox (unchecked, checked, indeterminate, disabled)
- Radio (unchecked, checked, disabled)
- Switch (off, on, disabled)

### Page 2: Composites
- Card (with header, content, footer)
- Dialog/Modal (alert, form, confirmation)
- Dropdown Menu
- Select
- Popover
- Tooltip
- Tabs
- Accordion
- Table
- Calendar/Date Picker
- Command/Combobox

### Page 3: Features
Full-screen mockups of main features:
- Tarefas (kanban board view)
- Empresas (table view)
- Auditoria (log view)
- Relatorios (dashboard view)
- StatusIntegracao (status cards)
- GeradorTarefas (form wizard)

## Naming Convention

### Primitives
Format: `ComponentName/Variant/Size/State`

Examples:
- `Button/Default/Medium/Default`
- `Button/Primary/Large/Hover`
- `Input/Text/Default/Focus`

### Composites
Format: `ComponentName/Variant`

Examples:
- `Card/Default`
- `Modal/Form`
- `Tabs/Horizontal`

### Features
Format: `FeatureName/ViewName`

Examples:
- `Tarefas/KanbanView`
- `Empresas/TableView`

## Design System Integration

All frames reference styles from **Dom DS Core Web**:
- Colors: Primary (#D64000), Neutral palette, Feedback colors
- Typography: Source Sans 3 (font family), size scale, weights
- Spacing: 4px base unit
- Radius: 4px default, 8px cards
- Shadows: Elevation system

## Frame Creation Checklist

For each component:
- [ ] Create frame with correct dimensions
- [ ] Apply DS color styles (not hardcoded colors)
- [ ] Apply DS typography styles
- [ ] Apply DS spacing/padding
- [ ] Create all states/variants
- [ ] Add component description
- [ ] Link to source code (GitHub)

## Status

| Component Type | Total | Created | Status |
|----------------|-------|---------|--------|
| Primitives | 48 | 0 | 🟡 Pending |
| Composites | 11 | 0 | 🟡 Pending |
| Features | 21 | 0 | 🟡 Pending |

**Total: 80 components** to document

## Next Steps

1. Setup Figma MCP integration
2. Create page structure
3. Generate frames using `create_frame` API
4. Apply DS styles using `apply_styles` API
5. Organize and document each frame

---

**Note:** Frame creation requires Figma MCP access token. Set as `FIGMA_ACCESS_TOKEN` environment variable.
