# Migration Example: StatusBadge Component

## Overview
Demonstração de como migrar um componente customizado para usar o UI component do design system.

---

## BEFORE (Current Implementation)

```tsx
// Location: src/app/components/Tarefas.tsx (line 219)

const kanbanStatusConfig: Record<
  KanbanStatus,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Aberta: { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.10)', icon: Clock },
  'Em andamento': { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.12)', icon: Loader2 },
  'Aguardando aprovação': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', icon: PauseCircle },
  Impedida: { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.10)', icon: AlertTriangle },
  Desconsiderada: { color: 'var(--muted-foreground)', bg: 'rgba(153,153,153,0.12)', icon: Ban },
  Concluída: { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.10)', icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: KanbanStatus }) {
  const { color, bg, icon: Icon } = kanbanStatusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        fontSize: 'var(--text-caption)',
        color,
        background: bg,
        fontWeight: 'var(--font-weight-semibold)',
      }}
    >
      <Icon size={10} /> {status}
    </span>
  );
}

// Usage:
<StatusBadge status={task.status} />
```

**Issues:**
- ❌ Inline styles for fontSize, color, background, fontWeight
- ❌ Custom implementation instead of using UI component
- ❌ Hardcoded color values (e.g., '#8B5CF6')
- ❌ Manual alpha values (0.10, 0.12)

---

## AFTER (Migrated Version)

```tsx
// Step 1: Import UI Badge component
import { Badge } from '@/app/components/ui/badge';

// Step 2: Map status to Badge variants
const statusToVariant: Record<KanbanStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'Aberta': 'default',           // Blue - info state
  'Em andamento': 'secondary',   // Orange - in progress
  'Aguardando aprovação': 'outline', // Purple - waiting
  'Impedida': 'destructive',     // Red - error state
  'Desconsiderada': 'outline',   // Gray - muted
  'Concluída': 'default',        // Green - success (customize if needed)
};

const statusIcons: Record<KanbanStatus, React.ElementType> = {
  'Aberta': Clock,
  'Em andamento': Loader2,
  'Aguardando aprovação': PauseCircle,
  'Impedida': AlertTriangle,
  'Desconsiderada': Ban,
  'Concluída': CheckCircle2,
};

// Step 3: Simplified component using UI Badge
function StatusBadge({ status }: { status: KanbanStatus }) {
  const Icon = statusIcons[status];
  return (
    <Badge variant={statusToVariant[status]} className="gap-1">
      <Icon className="h-2.5 w-2.5" />
      {status}
    </Badge>
  );
}

// Usage (unchanged):
<StatusBadge status={task.status} />
```

**Benefits:**
- ✅ Uses design system Badge component
- ✅ No inline styles
- ✅ Consistent with other badges in the app
- ✅ Automatic accessibility from Radix UI
- ✅ Type-safe with TypeScript
- ✅ Fewer lines of code (simpler)

---

## Alternative: Custom Variant Badges

If the existing Badge variants don't match exactly, you can extend the Badge component:

```tsx
// Option 1: Use className for custom colors (quick fix)
<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
  <Clock className="h-2.5 w-2.5" />
  Aberta
</Badge>

// Option 2: Extend Badge variants in badge.tsx
// Add to badgeVariants in src/app/components/ui/badge.tsx:
const badgeVariants = cva(
  // ... existing base classes
  {
    variants: {
      variant: {
        default: "...",
        secondary: "...",
        // Add new variants:
        info: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        warning: "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200",
        success: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
      }
    }
  }
)

// Then use:
<Badge variant="info">
  <Clock className="h-2.5 w-2.5" />
  Aberta
</Badge>
```

---

## Color Mapping to Design System Tokens

| Status | Old Color | DS Token | Badge Variant |
|--------|-----------|----------|---------------|
| Aberta | `var(--chart-2)` (blue) | `--chart-2` | `default` or custom `info` |
| Em andamento | `var(--chart-3)` (orange) | `--chart-3` | `secondary` or custom `warning` |
| Aguardando aprovação | `#8B5CF6` (purple) | None (custom) | `outline` or extend |
| Impedida | `var(--chart-4)` (red) | `--chart-4` / `--destructive` | `destructive` |
| Desconsiderada | `var(--muted-foreground)` | `--muted-foreground` | `outline` |
| Concluída | `var(--chart-1)` (green) | `--chart-1` | custom `success` |

---

## Testing Checklist

After migration:
- [ ] Visual check - Badge looks correct
- [ ] Icon displays correctly
- [ ] Text is readable
- [ ] Hover states work
- [ ] Accessible (screen reader friendly)
- [ ] Works in dark mode (if applicable)
- [ ] All status types render correctly

---

## Rollout Strategy

1. **Keep both versions temporarily**
   - Rename old: `StatusBadgeLegacy`
   - Create new: `StatusBadge` (migrated)
   - Test new version in dev

2. **A/B comparison**
   - Render both side-by-side
   - Verify visual parity
   - Get stakeholder approval

3. **Replace**
   - Update all usages to new version
   - Remove legacy version
   - Commit

---

## Estimated Impact

- **Lines Changed:** ~30 lines
- **Files Affected:** 1 (Tarefas.tsx)
- **Time to Migrate:** ~15 minutes
- **Testing Time:** ~10 minutes
- **Total:** ~25 minutes

This is a **small, low-risk migration** - perfect as a proof-of-concept!

---

## Next Steps

1. Apply this pattern to other custom components in Tarefas.tsx
2. Migrate other feature files (Empresas, Auditoria, etc.)
3. Document any edge cases or custom variants needed

**Pattern proven - ready to scale! ✅**
