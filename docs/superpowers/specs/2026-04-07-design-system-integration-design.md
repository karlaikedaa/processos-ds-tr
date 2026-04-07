# Design System Integration - Design Spec

**Date:** 2026-04-07  
**Project:** Processos - DS TR  
**Approach:** Foundation-First

---

## Overview

Integration of the company's Figma Design System into the project codebase with automated synchronization, component migration to Tailwind CSS, and bidirectional Figma documentation.

**Key Requirements:**
- Figma DS is the single source of truth for design tokens
- All components must use tokens (no hardcoded values)
- Automated sync when DS changes
- Migrate all 15+ existing components from MUI/Emotion to Tailwind
- Create high-fidelity Figma frames for all components (existing + new)

---

## Architecture & File Structure

```
src/
├── design-system/
│   ├── tokens.ts                      # Auto-generated from Figma DS
│   ├── tokens-custom.ts               # Project-specific tokens (not in DS)
│   ├── tailwind-preset.ts             # Tailwind config consuming tokens
│   └── sync/
│       ├── extract-figma-tokens.ts    # MCP script to extract tokens
│       ├── compare-tokens.ts          # Diff detection logic
│       └── sync-workflow.yml          # GitHub Action config
│
├── components/
│   ├── primitives/                    # Wave 1: Button, Input, Badge...
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── composites/                    # Wave 2: Card, Modal, Dropdown...
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   └── features/                      # Wave 3: Tarefas, Empresas...
│       ├── Tarefas.tsx
│       ├── Empresas.tsx
│       └── ...
│
└── styles/
    ├── tailwind.css                   # Tailwind entry (kept)
    └── theme.css                      # Deprecated (remove after migration)
```

**Key Principles:**
- `tokens.ts` is auto-generated and should never be manually edited
- `tokens-custom.ts` contains project-specific tokens not in the DS
- Component organization by complexity enables wave-based migration
- `theme.css` will be gradually deprecated as components migrate

---

## Token System

### Structure

The `tokens.ts` file will be structured as follows:

```typescript
/**
 * Design Tokens - Auto-generated from Figma DS
 * Source: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
 * Last sync: 2026-04-07 10:30:00
 * 
 * ⚠️ DO NOT EDIT MANUALLY - Changes will be overwritten
 * To add custom tokens, use tokens-custom.ts
 */

export const tokens = {
  colors: {
    primary: { 
      DEFAULT: 'rgba(214, 64, 0, 1)',
      foreground: 'rgba(255, 255, 255, 1)',
      hover: 'rgba(191, 57, 0, 1)',      // Derived or explicit from DS
      active: 'rgba(171, 51, 0, 1)',
    },
    secondary: {
      DEFAULT: 'rgba(0, 0, 0, 0)',
      foreground: 'rgba(214, 64, 0, 1)',
    },
    neutral: {
      50: 'rgba(255, 255, 255, 1)',
      100: 'rgba(250, 250, 250, 1)',
      200: 'rgba(242, 242, 242, 1)',
      300: 'rgba(230, 230, 230, 1)',
      400: 'rgba(153, 153, 153, 1)',
      500: 'rgba(77, 77, 77, 1)',
      600: 'rgba(45, 45, 45, 1)',
      700: 'rgba(31, 31, 31, 1)',
    },
    feedback: {
      success: 'rgba(56, 124, 43, 1)',
      error: 'rgba(220, 10, 10, 1)',
      warning: 'rgba(254, 166, 1, 1)',
      info: 'rgba(21, 115, 211, 1)',
    },
    // Semantic tokens (mapped from DS variables)
    background: 'rgba(255, 255, 255, 1)',
    foreground: 'rgba(31, 31, 31, 1)',
    card: 'rgba(255, 255, 255, 1)',
    border: 'rgba(242, 242, 242, 1)',
    input: 'rgba(250, 250, 250, 1)',
    ring: 'rgba(214, 64, 0, 1)',
  },
  
  typography: {
    fontFamily: {
      sans: ['Source Sans 3', 'sans-serif'],
    },
    fontSize: {
      h1: ['48px', { lineHeight: '1.2', fontWeight: '600' }],
      h2: ['32px', { lineHeight: '1.25', fontWeight: '600' }],
      h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      h4: ['16px', { lineHeight: '1.4', fontWeight: '600' }],
      base: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      label: ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      caption: ['12px', { lineHeight: '1.3', fontWeight: '400' }],
      badge: ['9px', { lineHeight: '1.2', fontWeight: '600' }],
    },
    fontWeight: {
      regular: 400,
      semibold: 600,
    },
  },
  
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
  },
  
  radius: {
    none: '0px',
    sm: '4px',
    DEFAULT: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  
  elevation: {
    sm: '2px 4px 4px 0px rgba(0, 0, 0, 0.12)',
    md: '4px 8px 12px 0px rgba(0, 0, 0, 0.15)',
    lg: '8px 16px 24px 0px rgba(0, 0, 0, 0.18)',
  },
} as const

export type Tokens = typeof tokens
```

### Extraction Process

1. **Script** (`extract-figma-tokens.ts`) uses MCP Figma integration
2. Calls `get_variable_defs` on the DS file (Q2p5d5mIahsEPxXYMOA16V)
3. Extracts all collections: colors, typography, spacing, radius
4. Maps Figma variable structure to TypeScript structure
5. Generates `tokens.ts` with header comment (timestamp, source URL)
6. Custom tokens in `tokens-custom.ts` are not touched

### Tailwind Integration

```typescript
// tailwind-preset.ts
import { tokens } from './tokens'
import { customTokens } from './tokens-custom'

export default {
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        ...customTokens.colors,
      },
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      fontFamily: tokens.typography.fontFamily,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      boxShadow: {
        sm: tokens.elevation.sm,
        DEFAULT: tokens.elevation.md,
        md: tokens.elevation.md,
        lg: tokens.elevation.lg,
      },
    },
  },
} satisfies Config
```

### Usage in Components

```tsx
// Before (MUI/Emotion)
<Button
  sx={{
    backgroundColor: '#D64000',
    color: '#FFFFFF',
    fontSize: '16px',
    padding: '12px 24px',
  }}
>
  Save
</Button>

// After (Tailwind + Tokens)
<Button
  variant="primary"
  className="bg-primary text-primary-foreground text-base px-6 py-3"
>
  Save
</Button>
```

---

## Sync Automation

### GitHub Action Workflow

```yaml
# .github/workflows/sync-design-tokens.yml
name: Sync Design Tokens from Figma DS

on:
  schedule:
    - cron: '0 3 * * *'  # Daily at 3 AM
  workflow_dispatch:      # Manual trigger via GitHub UI

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Extract tokens from Figma
        run: npm run sync-design-tokens
        env:
          FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
      
      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet src/design-system/tokens.ts; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Create Pull Request
        if: steps.changes.outputs.changed == 'true'
        run: |
          BRANCH="chore/sync-ds-$(date +%Y%m%d-%H%M)"
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout -b "$BRANCH"
          git add src/design-system/tokens.ts
          git commit -m "chore: sync design tokens from Figma DS
          
          Auto-generated by sync workflow
          Source: Dom DS Core Web"
          git push origin "$BRANCH"
          gh pr create \
            --title "🎨 Sync Design Tokens ($(date +%Y-%m-%d))" \
            --body "## Design System Sync
            
            Automated sync from Figma Design System.
            
            **Source:** [Dom DS Core Web](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web)
            **Timestamp:** $(date -Iseconds)
            
            ### Review Checklist
            - [ ] Review token changes in diff
            - [ ] Run \`npm run dev\` to verify visual consistency
            - [ ] Check that no components are broken
            - [ ] Merge when ready
            
            This PR was auto-generated by the sync workflow." \
            --label "design-tokens,automated"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Manual Sync Command

```json
// package.json
{
  "scripts": {
    "sync-design-tokens": "tsx src/design-system/sync/extract-figma-tokens.ts",
    "sync-design-tokens:watch": "tsx watch src/design-system/sync/extract-figma-tokens.ts"
  }
}
```

**Usage:**
```bash
npm run sync-design-tokens  # Run once
npm run sync-design-tokens:watch  # Watch mode (dev)
```

### Benefits

- ✅ **Safe:** Creates PR instead of direct commit (review before merge)
- ✅ **Traceable:** Clear commit history of DS changes
- ✅ **Flexible:** Can run manually or on schedule
- ✅ **Non-breaking:** If workflow fails, doesn't affect production

---

## Component Migration Strategy

### Wave-Based Approach

Migration happens in 3 waves, from simple to complex:

#### **Wave 1: Primitives** (Est. 1-2 days)

Base components with no dependencies:

| Component | Variants | States | Priority |
|-----------|----------|--------|----------|
| Button | primary, secondary, ghost, destructive, outline | default, hover, active, disabled, loading | Critical |
| Input | text, email, number, password, textarea | default, focus, error, disabled | Critical |
| Badge | default, success, error, warning, info | - | High |
| Label | - | default, disabled | High |
| Checkbox | - | unchecked, checked, indeterminate, disabled | High |
| Radio | - | unchecked, checked, disabled | High |
| Switch | - | off, on, disabled | Medium |
| Spinner | - | default (sizes: sm, md, lg) | Medium |

**Migration Process per Component:**

1. **Analyze current implementation**
   - Read existing component file
   - Document props interface
   - List all variants/states
   - Note business logic (validation, handlers)

2. **Create new primitive**
   - New file in `src/components/primitives/`
   - Use `class-variance-authority` for variants
   - Tailwind classes only (no MUI/Emotion)
   - TypeScript strict typing

3. **Example structure:**
   ```tsx
   // src/components/primitives/Button.tsx
   import { cva, type VariantProps } from 'class-variance-authority'
   import { cn } from '@/lib/utils'
   
   const buttonVariants = cva(
     "inline-flex items-center justify-center rounded-radius transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
     {
       variants: {
         variant: {
           primary: "bg-primary text-primary-foreground hover:bg-primary/90",
           secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
           ghost: "hover:bg-accent hover:text-accent-foreground",
         },
         size: {
           sm: "h-9 px-3 text-label",
           md: "h-10 px-4 text-base",
           lg: "h-11 px-8 text-base",
         },
       },
       defaultVariants: {
         variant: "primary",
         size: "md",
       },
     }
   )
   
   export interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
     isLoading?: boolean
   }
   
   export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, isLoading, children, ...props }, ref) => {
       return (
         <button
           className={cn(buttonVariants({ variant, size, className }))}
           ref={ref}
           disabled={isLoading || props.disabled}
           {...props}
         >
           {isLoading && <Spinner className="mr-2 h-4 w-4" />}
           {children}
         </button>
       )
     }
   )
   Button.displayName = "Button"
   ```

4. **Test in isolation**
   - Create test page or storybook entry
   - Verify all variants render correctly
   - Test interactions (click, focus, keyboard)

5. **Replace old component**
   - Find all usages with Grep
   - Update imports gradually
   - Test affected pages

#### **Wave 2: Composites** (Est. 2-3 days)

Components built from primitives:

| Component | Dependencies | Complexity |
|-----------|--------------|------------|
| Card | - | Low |
| Modal/Dialog | Button | Medium |
| Dropdown | Button, Radix UI Dropdown | Medium |
| Select | Input, Radix UI Select | Medium |
| Popover | Radix UI Popover | Medium |
| Tooltip | Radix UI Tooltip | Low |
| Tabs | Button | Low |
| Accordion | Radix UI Accordion | Low |
| Table | - | Medium |
| DatePicker | Input, react-day-picker | High |
| Combobox | Input, Popover | High |

**Strategy:**
- Build on top of primitives from Wave 1
- Use Radix UI primitives for complex interactions (already installed)
- Maintain same API surface where possible
- Add proper accessibility (ARIA labels, keyboard nav)

#### **Wave 3: Features** (Est. 3-4 days)

Complex page-level components:

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| Tarefas | Kanban board, filters, task modals | Card, Button, Input, Modal, Badge, Dropdown, DatePicker |
| Empresas | Company management interface | Table, Button, Input, Modal |
| Auditoria | Audit log viewer | Table, DatePicker, Select |
| Relatorios | Reports dashboard | Card, Table, DatePicker, Dropdown |
| GeradorTarefas | Task generator wizard | Input, Dropdown, Button, Checkbox |
| GerenciarTarefas | Task management interface | Table, Modal, Button, Badge |
| InboxConfig | Inbox configuration panel | Input, Switch, Button |
| FeriadosHorarios | Calendar/schedule manager | DatePicker, Input, Table |
| FuncionariosEscritorio | Staff directory | Table, Card, Input |
| DocumentosExpress | Document upload/management | Input, Button, Table, Modal |
| Circular | Circular/announcements viewer | Card, Badge |
| ModelosDocumento | Document templates | Card, Modal, Input |
| PersonalizarAssinatura | Signature customization | Input, Button |
| StatusIntegracao | Integration status dashboard | Card, Badge, Table |
| ListasDetalhadas | Detailed list views | Table, Button, Dropdown |
| Responsabilidades | Responsibilities assignment | Table, Dropdown, Checkbox |
| AdequacaoAgrupadores | Grouping configuration | Dropdown, Button, Input |
| AgrupadorTarefasClientes | Client task grouping | Card, Table |

**Strategy:**
- Migrate one feature at a time
- Keep business logic intact (only change styling/components)
- Test thoroughly in dev environment
- Feature flags if needed (gradual rollout)

### Migration Guidelines

**Do:**
- ✅ Use Tailwind utility classes
- ✅ Reference tokens via semantic names (`bg-primary` not `bg-[#D64000]`)
- ✅ Keep same component API (props, events)
- ✅ Maintain accessibility (ARIA, keyboard nav)
- ✅ Use `cn()` utility for conditional classes
- ✅ Type everything with TypeScript
- ✅ Keep business logic separate from presentation

**Don't:**
- ❌ Use inline styles
- ❌ Hardcode colors, sizes, spacing
- ❌ Mix MUI/Emotion with new components
- ❌ Break existing functionality
- ❌ Change component APIs without discussion
- ❌ Skip accessibility features
- ❌ Create unnecessary abstractions

---

## Figma Integration

### Organization Structure

**Target File:** [Processos - DS TR](https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395)

**Page Structure:**
```
📄 Processos - DS TR
  ├── 📄 Design System (page)
  │   ├── 📁 Primitives (section)
  │   │   ├── 🔲 Button
  │   │   │   ├── Variant=Primary, Size=Small, State=Default
  │   │   │   ├── Variant=Primary, Size=Small, State=Hover
  │   │   │   ├── Variant=Primary, Size=Medium, State=Default
  │   │   │   └── ... (all combinations)
  │   │   ├── 🔲 Input
  │   │   └── ...
  │   ├── 📁 Composites (section)
  │   │   ├── 🔲 Card
  │   │   └── ...
  │   └── 📁 Features (section)
  │       ├── 🔲 Tarefas (full screen mockup)
  │       └── ...
```

### Frame Creation Process

After migrating each component in code:

1. **Create base frame**
   ```typescript
   // Using MCP Figma
   await figma.createFrame({
     name: 'Button/Primary/Medium/Default',
     parent: 'primitives-section-id',
     width: 120,
     height: 40,
   })
   ```

2. **Apply DS styles**
   ```typescript
   await figma.applyStyles({
     frame: 'button-frame-id',
     fills: 'primary-color-style',      // Reference DS color
     typography: 'button-text-style',   // Reference DS typography
   })
   ```

3. **Create variants**
   - All states: default, hover, active, disabled, loading
   - All sizes: small, medium, large
   - Use Figma variants feature to group

4. **Add documentation**
   - Props/API description in frame description
   - Usage examples in separate frames
   - Link to code file (GitHub URL)

### Naming Conventions

**Frames:**
- `ComponentName/Variant/Size/State`
- Examples: `Button/Primary/Medium/Hover`, `Input/Text/Large/Error`

**Components (Figma):**
- `ComponentName` (creates Figma component)
- Enables reuse across the file

### Fidelity Standards

**High-Fidelity means:**
- ✅ Real colors from DS tokens (not placeholders)
- ✅ Real typography (Source Sans 3, correct sizes/weights)
- ✅ Real content when meaningful (not "Lorem ipsum" for product names)
- ✅ All interactive states (hover, active, focus, disabled)
- ✅ Correct spacing, padding, borders from tokens
- ✅ Icons from same library (Lucide React → Lucide icons in Figma)
- ✅ Responsive behavior documented (different widths if applicable)

**What's NOT needed:**
- ❌ Pixel-perfect positioning (Figma is documentation, not design source)
- ❌ Complex interactions/animations (code handles this)
- ❌ Every possible edge case

### Maintenance

When code changes:
- Update corresponding Figma frame manually or via script
- Keep version history in Figma
- Add changelog note in frame description

When DS changes:
- Figma frames update automatically if using DS styles
- Code syncs via automated workflow

---

## Success Criteria

### Phase 1: Foundation (Tokens + Sync)
- ✅ `tokens.ts` generated from Figma DS with all collections
- ✅ Tailwind preset configured and working
- ✅ GitHub Action runs successfully and creates PR
- ✅ Manual sync command works locally
- ✅ No hardcoded values remain in `theme.css` for tokens that exist in DS

### Phase 2: Primitives Migration
- ✅ All 8 primitive components migrated to Tailwind
- ✅ All variants and states implemented
- ✅ Components are accessible (keyboard nav, ARIA, focus states)
- ✅ Visual parity with current design (no regressions)
- ✅ High-fidelity frames created in Figma for all primitives

### Phase 3: Composites Migration
- ✅ All 11 composite components migrated
- ✅ Using primitives from Wave 1 where applicable
- ✅ Radix UI integrated for complex interactions
- ✅ Frames created in Figma with all states

### Phase 4: Features Migration
- ✅ All 18+ feature components migrated
- ✅ No MUI or Emotion imports remain
- ✅ All pages functional in dev environment
- ✅ High-fidelity screens created in Figma (full page mockups)

### Final Validation
- ✅ `npm run build` succeeds with no errors
- ✅ `npm run dev` shows all pages correctly
- ✅ Visual regression testing passes (or manual verification)
- ✅ Bundle size reduced (Emotion + MUI removed)
- ✅ Figma file has complete documentation of all components
- ✅ Sync workflow has run at least once successfully

---

## Timeline Estimate

**Optimistic:** 7-8 days  
**Realistic:** 10-12 days  
**Conservative:** 14-16 days

Breakdown:
- Foundation (tokens + sync): 1-2 days
- Wave 1 (primitives): 1-2 days
- Wave 2 (composites): 2-3 days
- Wave 3 (features): 3-4 days
- Figma frame creation: 2-3 days (parallel with migration)
- Testing and refinement: 1-2 days

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| DS tokens incomplete/missing | High | Maintain `tokens-custom.ts` for gaps |
| Component functionality breaks during migration | High | Migrate one component at a time, test thoroughly |
| MUI removal causes unexpected side effects | Medium | Keep MUI installed until all migrations complete |
| Figma API rate limits | Low | Batch frame creation, use local caching |
| Sync workflow fails silently | Medium | Add monitoring, alerts on failure |
| Team continues using old patterns | Medium | Document migration guide, code review |

---

## Open Questions

None - all clarified during brainstorming.

---

## References

- **Figma Design System:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
- **Figma Target File:** https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Radix UI Docs:** https://www.radix-ui.com/primitives/docs/overview/introduction
- **CVA (Class Variance Authority):** https://cva.style/docs
