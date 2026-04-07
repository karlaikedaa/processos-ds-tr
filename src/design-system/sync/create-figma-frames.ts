/**
 * Create Figma frames for design system documentation
 * Target: https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR
 */

interface FrameSpec {
  name: string
  category: 'primitive' | 'composite' | 'feature'
  description: string
  variants?: string[]
  states?: string[]
  sizes?: string[]
}

/**
 * Menu 1: Primitive Components
 */
const primitiveFrames: FrameSpec[] = [
  {
    name: 'Button',
    category: 'primitive',
    description: 'Primary action buttons with multiple variants',
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    sizes: ['sm', 'default', 'lg', 'icon'],
    states: ['default', 'hover', 'active', 'disabled', 'loading']
  },
  {
    name: 'Input',
    category: 'primitive',
    description: 'Text input fields',
    variants: ['text', 'email', 'password', 'number'],
    states: ['default', 'focus', 'error', 'disabled']
  },
  {
    name: 'Badge',
    category: 'primitive',
    description: 'Status indicators and labels',
    variants: ['default', 'secondary', 'destructive', 'outline'],
    states: ['default']
  },
  {
    name: 'Checkbox',
    category: 'primitive',
    description: 'Checkbox input',
    states: ['unchecked', 'checked', 'indeterminate', 'disabled']
  },
  {
    name: 'Radio',
    category: 'primitive',
    description: 'Radio button input',
    states: ['unchecked', 'checked', 'disabled']
  },
  {
    name: 'Switch',
    category: 'primitive',
    description: 'Toggle switch',
    states: ['off', 'on', 'disabled']
  },
  {
    name: 'Label',
    category: 'primitive',
    description: 'Form labels',
    states: ['default', 'disabled']
  },
  {
    name: 'Textarea',
    category: 'primitive',
    description: 'Multi-line text input',
    states: ['default', 'focus', 'error', 'disabled']
  }
]

/**
 * Menu 2: Composite Components
 */
const compositeFrames: FrameSpec[] = [
  {
    name: 'Card',
    category: 'composite',
    description: 'Container with header, content, footer',
    variants: ['default', 'with-header', 'with-footer', 'full']
  },
  {
    name: 'Dialog',
    category: 'composite',
    description: 'Modal dialogs',
    variants: ['alert', 'form', 'confirmation']
  },
  {
    name: 'Dropdown',
    category: 'composite',
    description: 'Dropdown menu',
    states: ['closed', 'open']
  },
  {
    name: 'Select',
    category: 'composite',
    description: 'Select input',
    states: ['closed', 'open']
  },
  {
    name: 'Popover',
    category: 'composite',
    description: 'Floating content container',
    states: ['closed', 'open']
  },
  {
    name: 'Tooltip',
    category: 'composite',
    description: 'Contextual hints',
    states: ['hidden', 'visible']
  },
  {
    name: 'Tabs',
    category: 'composite',
    description: 'Tab navigation',
    variants: ['horizontal', 'vertical']
  },
  {
    name: 'Accordion',
    category: 'composite',
    description: 'Expandable sections',
    states: ['collapsed', 'expanded']
  },
  {
    name: 'Table',
    category: 'composite',
    description: 'Data table',
    variants: ['default', 'with-sorting', 'with-pagination']
  },
  {
    name: 'Calendar',
    category: 'composite',
    description: 'Date picker calendar',
    states: ['default', 'with-selection']
  },
  {
    name: 'Command',
    category: 'composite',
    description: 'Command palette / Combobox',
    states: ['closed', 'open', 'with-results']
  }
]

/**
 * Menu 3: Feature Screens
 */
const featureFrames: FrameSpec[] = [
  {
    name: 'Tarefas',
    category: 'feature',
    description: 'Kanban board view for task management',
    variants: ['kanban-view', 'list-view', 'detail-panel']
  },
  {
    name: 'Empresas',
    category: 'feature',
    description: 'Company management table',
    variants: ['table-view', 'detail-modal']
  },
  {
    name: 'Auditoria',
    category: 'feature',
    description: 'Audit log viewer',
    variants: ['log-view', 'filter-panel']
  },
  {
    name: 'Relatorios',
    category: 'feature',
    description: 'Reports dashboard',
    variants: ['dashboard-view', 'chart-view']
  },
  {
    name: 'StatusIntegracao',
    category: 'feature',
    description: 'Integration status cards',
    variants: ['cards-view']
  },
  {
    name: 'GeradorTarefas',
    category: 'feature',
    description: 'Task generator wizard',
    variants: ['form-wizard']
  },
  {
    name: 'VisaoGeral',
    category: 'feature',
    description: 'Overview dashboard',
    variants: ['dashboard-view']
  }
]

/**
 * Frame creation instructions for manual/MCP execution
 */
export const frameStructure = {
  file: 'Processos - DS TR',
  url: 'https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395',
  sourceDS: 'https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web',

  menus: [
    {
      name: 'Menu 1: Primitivos',
      page: 'Primitives',
      frames: primitiveFrames,
      layout: 'grid',
      spacing: 64
    },
    {
      name: 'Menu 2: Compostos',
      page: 'Composites',
      frames: compositeFrames,
      layout: 'grid',
      spacing: 96
    },
    {
      name: 'Menu 3: Features',
      page: 'Features',
      frames: featureFrames,
      layout: 'vertical',
      spacing: 128
    }
  ]
}

/**
 * Generate frame names using naming convention
 */
export function generateFrameName(spec: FrameSpec, variant?: string, state?: string, size?: string): string {
  const parts = [spec.name]
  if (variant) parts.push(variant)
  if (size) parts.push(size)
  if (state) parts.push(state)
  return parts.join('/')
}

/**
 * Count total frames to create
 */
export function getTotalFrameCount(): number {
  let count = 0

  primitiveFrames.forEach(spec => {
    const variants = spec.variants?.length || 1
    const states = spec.states?.length || 1
    const sizes = spec.sizes?.length || 1
    count += variants * states * sizes
  })

  compositeFrames.forEach(spec => {
    const variants = spec.variants?.length || 1
    const states = spec.states?.length || 1
    count += variants * states
  })

  featureFrames.forEach(spec => {
    const variants = spec.variants?.length || 1
    count += variants
  })

  return count
}

// Export for use in automation
export { primitiveFrames, compositeFrames, featureFrames }

console.log(`Total frames to create: ${getTotalFrameCount()}`)
console.log('Frame structure:', JSON.stringify(frameStructure, null, 2))
