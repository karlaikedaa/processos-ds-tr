# Component Migration Guide

## Overview

This guide documents the pattern for migrating feature components to use design system tokens consistently.

## Current State

**Feature components** (21 files in `src/app/components/`):
- ✅ Already use CSS variables from `theme.css` (e.g., `var(--primary)`, `var(--foreground)`)
- ✅ Already use Tailwind for layout (e.g., `flex`, `gap-2`, `grid`)
- ⚠️ Use inline `style={{}}` props for colors/typography
- ⚠️ Don't import UI components from `src/app/components/ui/`

**UI components** (48 files in `src/app/components/ui/`):
- ✅ Built with Radix UI + Tailwind
- ✅ Use class-variance-authority for variants
- ✅ Ready to use in feature components

## Migration Pattern

### Before (Current Pattern):

```tsx
// Inline styles with CSS variables
<button
  style={{
    fontSize: 'var(--text-label)',
    color: 'var(--primary)',
    padding: '8px 16px',
    borderRadius: 'var(--radius)',
  }}
  onClick={handleClick}
>
  Click me
</button>
```

### After (Target Pattern):

```tsx
// Import UI component
import { Button } from '@/app/components/ui/button'

// Use component with Tailwind classes
<Button
  variant="default"
  size="sm"
  onClick={handleClick}
>
  Click me
</Button>
```

## Component Mapping

| Current Pattern | Replace With | Import From |
|----------------|--------------|-------------|
| `<button style={{...}}>` | `<Button variant="...">` | `@/app/components/ui/button` |
| `<input style={{...}}>` | `<Input />` | `@/app/components/ui/input` |
| Custom badge div | `<Badge variant="...">` | `@/app/components/ui/badge` |
| Custom card div | `<Card>` | `@/app/components/ui/card` |
| Custom modal | `<Dialog>` | `@/app/components/ui/dialog` |
| Custom dropdown | `<DropdownMenu>` | `@/app/components/ui/dropdown-menu` |
| Custom select | `<Select>` | `@/app/components/ui/select` |
| Custom tabs | `<Tabs>` | `@/app/components/ui/tabs` |
| Custom table | `<Table>` | `@/app/components/ui/table` |

## Style Attribute Conversion

### Colors:
```tsx
// Before:
style={{ color: 'var(--primary)' }}

// After:
className="text-primary"
```

### Typography:
```tsx
// Before:
style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }}

// After:
className="text-label font-semibold"
```

### Spacing:
```tsx
// Before:
style={{ padding: '16px', marginBottom: '8px' }}

// After:
className="p-4 mb-2"
```

### Borders:
```tsx
// Before:
style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}

// After:
className="rounded-sm border border-border"
```

## Example Migration

### Before:
```tsx
const StatusBadge = ({ status }: { status: string }) => {
  const bgColor = status === 'Concluída' ? 'var(--success)' : 'var(--muted)'
  const textColor = status === 'Concluída' ? 'white' : 'var(--foreground)'

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize: 'var(--text-badge)',
        padding: '4px 8px',
        borderRadius: 'var(--radius)',
        fontWeight: 'var(--font-weight-semibold)',
      }}
    >
      {status}
    </span>
  )
}
```

### After:
```tsx
import { Badge } from '@/app/components/ui/badge'

const StatusBadge = ({ status }: { status: string }) => {
  const variant = status === 'Concluída' ? 'default' : 'secondary'

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  )
}
```

## Incremental Migration Strategy

Given the volume (21 components × ~1400 lines = ~30k lines), migrate incrementally:

1. **Phase 1:** Start with most-used components (e.g., `Tarefas`, `Empresas`)
2. **Phase 2:** Migrate one section at a time within each component
3. **Phase 3:** Test functionality after each section migration
4. **Phase 4:** Commit when a logical unit is complete

## Benefits of Migration

- ✅ Consistent design system usage
- ✅ Reduced inline styles (easier to maintain)
- ✅ Automatic accessibility from Radix UI
- ✅ Better TypeScript support
- ✅ Smaller bundle size (no MUI/Emotion)

## Next Steps

1. Review this guide
2. Choose a component to start with
3. Migrate one section as a proof-of-concept
4. Repeat for remaining components

---

**Note:** This is living documentation. Update as patterns evolve.
