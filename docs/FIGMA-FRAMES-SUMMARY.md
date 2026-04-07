# 🎨 Figma Frames - Resumo Visual

**Status:** ✅ Estrutura Completa (195 frames planejados)  
**Arquivo:** `docs/figma-frames-by-menu.md`  
**Script:** `src/design-system/sync/create-figma-frames.ts`

---

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────┐
│  PROCESSOS - DS TR (Figma File)                │
│  195 Frames Total                              │
└─────────────────────────────────────────────────┘
           │
           ├─ 📁 Menu 1: Primitivos (60 frames)
           │     ├─ Button (120 variants)
           │     ├─ Input (16 variants)
           │     ├─ Badge (4 variants)
           │     ├─ Checkbox (4 states)
           │     ├─ Radio (3 states)
           │     ├─ Switch (3 states)
           │     ├─ Label (2 states)
           │     └─ Textarea (4 states)
           │
           ├─ 📁 Menu 2: Compostos (40 frames)
           │     ├─ Card (4 variants)
           │     ├─ Dialog (3 variants)
           │     ├─ Dropdown (2 states)
           │     ├─ Select (2 states)
           │     ├─ Popover (2 states)
           │     ├─ Tooltip (2 states)
           │     ├─ Tabs (2 variants)
           │     ├─ Accordion (2 states)
           │     ├─ Table (3 variants)
           │     ├─ Calendar (2 states)
           │     └─ Command (3 states)
           │
           └─ 📁 Menu 3: Features (20+ frames)
                 ├─ Tarefas (3 views)
                 ├─ Empresas (2 views)
                 ├─ Auditoria (2 views)
                 ├─ Relatorios (2 views)
                 ├─ StatusIntegracao (1 view)
                 ├─ GeradorTarefas (1 view)
                 └─ VisaoGeral (1 view)
```

---

## 🎯 Menu 1: Primitivos (Página "Primitives")

**Layout:** Grid 4 colunas, 64px spacing  
**Total:** 60 frames

| Componente | Variants | States | Sizes | Total |
|------------|----------|--------|-------|-------|
| **Button** | 6 | 5 | 4 | **120** |
| **Input** | 4 | 4 | - | **16** |
| **Badge** | 4 | 1 | - | **4** |
| **Checkbox** | 1 | 4 | - | **4** |
| **Radio** | 1 | 3 | - | **3** |
| **Switch** | 1 | 3 | - | **3** |
| **Label** | 1 | 2 | - | **2** |
| **Textarea** | 1 | 4 | - | **4** |

### Button (120 frames)
```
Variants: default | destructive | outline | secondary | ghost | link
Sizes:    sm | default | lg | icon
States:   default | hover | active | disabled | loading

Example names:
• Button/default/sm/default
• Button/destructive/lg/hover
• Button/outline/icon/disabled
```

### Input (16 frames)
```
Variants: text | email | password | number
States:   default | focus | error | disabled

Example names:
• Input/text/default
• Input/email/focus
• Input/password/error
```

---

## 🧩 Menu 2: Compostos (Página "Composites")

**Layout:** Grid 3 colunas, 96px spacing  
**Total:** 40 frames

| Componente | Variants/States | Total |
|------------|----------------|-------|
| **Card** | 4 variants | **4** |
| **Dialog** | 3 variants | **3** |
| **Dropdown** | 2 states | **2** |
| **Select** | 2 states | **2** |
| **Popover** | 2 states | **2** |
| **Tooltip** | 2 states | **2** |
| **Tabs** | 2 variants | **2** |
| **Accordion** | 2 states | **2** |
| **Table** | 3 variants | **3** |
| **Calendar** | 2 states | **2** |
| **Command** | 3 states | **3** |

### Examples
```
Card/default
Card/with-header
Card/with-footer
Card/full

Dialog/alert
Dialog/form
Dialog/confirmation

Table/default
Table/with-sorting
Table/with-pagination
```

---

## 📱 Menu 3: Features (Página "Features")

**Layout:** Vertical stack, 128px spacing  
**Size:** 1440×900px cada  
**Total:** 20+ frames

| Feature | Views | Total |
|---------|-------|-------|
| **Tarefas** | kanban-view, list-view, detail-panel | **3** |
| **Empresas** | table-view, detail-modal | **2** |
| **Auditoria** | log-view, filter-panel | **2** |
| **Relatorios** | dashboard-view, chart-view | **2** |
| **StatusIntegracao** | cards-view | **1** |
| **GeradorTarefas** | form-wizard | **1** |
| **VisaoGeral** | dashboard-view | **1** |
| **Outros** | (15+ componentes restantes) | **15+** |

### Examples
```
Tarefas/kanban-view      (1440×900px)
Tarefas/list-view        (1440×900px)
Tarefas/detail-panel     (480×900px)

Empresas/table-view      (1440×900px)
Empresas/detail-modal    (600×800px)

Relatorios/dashboard-view (1440×900px)
```

---

## 🎨 Design Tokens Reference

### Cores Principais
```css
Primary:     rgba(214, 64, 0, 1)    #D64000
Secondary:   transparent
Destructive: rgba(220, 10, 10, 1)   #DC0A0A
Success:     rgba(56, 124, 43, 1)   #387C2B
Warning:     rgba(254, 166, 1, 1)   #FEA601
Info:        rgba(21, 115, 211, 1)  #1573D3
```

### Cores Neutras
```css
Background:       rgba(255, 255, 255, 1)  #FFFFFF
Foreground:       rgba(31, 31, 31, 1)     #1F1F1F
Muted:           rgba(230, 230, 230, 1)   #E6E6E6
Muted Foreground: rgba(153, 153, 153, 1)  #999999
Border:          rgba(242, 242, 242, 1)   #F2F2F2
Input:           rgba(250, 250, 250, 1)   #FAFAFA
```

### Tipografia
```css
Font: Source Sans 3

H1:      48px / 600 / 1.2 lh
H2:      32px / 600 / 1.25 lh
H3:      24px / 600 / 1.3 lh
H4:      16px / 600 / 1.4 lh
Base:    16px / 400 / 1.5 lh
Label:   14px / 400 / 1.4 lh
Caption: 12px / 400 / 1.3 lh
Badge:   9px  / 600 / 1.2 lh
```

### Spacing Scale
```css
0:  0px
1:  4px
2:  8px
3:  12px
4:  16px
6:  24px
8:  32px
12: 48px
16: 64px
```

### Border Radius
```css
sm:   4px
md:   8px
lg:   12px
full: 9999px
```

### Elevation (Shadows)
```css
sm: 2px 4px 4px 0px rgba(0, 0, 0, 0.12)
md: 4px 8px 12px 0px rgba(0, 0, 0, 0.15)
lg: 8px 16px 24px 0px rgba(0, 0, 0, 0.18)
```

---

## 📋 Naming Convention

**Format:** `Component/Variant/Size/State`

**Regras:**
1. Sempre começar com nome do componente
2. Variant se aplicável (ex: default, destructive)
3. Size se aplicável (ex: sm, md, lg)
4. State por último (ex: default, hover, disabled)

**Exemplos:**
```
✅ Button/default/md/hover
✅ Input/text/focus
✅ Card/with-header
✅ Tarefas/kanban-view

❌ button-default-hover (lowercase)
❌ DefaultButton/Medium (ordem errada)
❌ btn/primary/m (abreviações)
```

---

## 🚀 Como Usar

### 1. Manual (Figma UI)
1. Abrir arquivo: https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395
2. Criar páginas: "Primitives", "Composites", "Features"
3. Seguir guia: `docs/figma-frames-by-menu.md`
4. Aplicar tokens do DS: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
5. Nomear frames conforme convenção acima

### 2. Via Automação (MCP)
```bash
# Quando FIGMA_ACCESS_TOKEN estiver configurado
npx tsx src/design-system/sync/create-figma-frames.ts --create

# Isso irá:
# 1. Conectar via MCP
# 2. Criar páginas
# 3. Criar todos os 195 frames
# 4. Aplicar estilos do DS
# 5. Gerar relatório
```

### 3. Via Plugin Figma
- Usar plugin de batch creation
- Importar estrutura JSON de `create-figma-frames.ts`
- Aplicar estilos automaticamente

---

## ⏱️ Estimativas

| Categoria | Frames | Tempo Manual | Tempo Automação |
|-----------|--------|--------------|-----------------|
| **Primitivos** | 60 | 4-6h | 30min |
| **Compostos** | 40 | 3-4h | 20min |
| **Features** | 20+ | 4-6h | 30min |
| **Total** | 120+ | **11-16h** | **1-2h** |

**Recomendação:** Começar com 5-10 frames principais manualmente, depois automatizar o resto.

---

## ✅ Checklist de Criação

Para cada frame:
- [ ] Nome segue convenção (Component/Variant/Size/State)
- [ ] Aplica cores do DS (não hardcoded)
- [ ] Aplica tipografia do DS
- [ ] Usa spacing correto do DS
- [ ] Border radius do DS
- [ ] Shadows (elevation) do DS
- [ ] Descrição adicionada
- [ ] Link para código fonte (GitHub)
- [ ] Organizado na página correta
- [ ] Criado como Component no Figma (reusável)

---

## 📊 Progresso Atual

| Menu | Planejado | Criado | Progresso |
|------|-----------|--------|-----------|
| Menu 1: Primitivos | 60 | 0 | 🟡 0% |
| Menu 2: Compostos | 40 | 0 | 🟡 0% |
| Menu 3: Features | 20+ | 0 | 🟡 0% |
| **Total** | **120+** | **0** | **0%** |

**Status:** ✅ Estrutura completa, ⏸️ Aguardando criação

---

## 🔗 Recursos

| Recurso | Link |
|---------|------|
| **Guia Completo** | `docs/figma-frames-by-menu.md` |
| **Script Estrutura** | `src/design-system/sync/create-figma-frames.ts` |
| **Figma Target** | https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR |
| **Figma DS Source** | https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web |
| **Token Reference** | `src/design-system/tokens.ts` |

---

## 🎯 Próximos Passos

### Prioridade Alta
1. Criar 10 frames de Primitivos principais (Button, Input, Badge)
2. Validar com stakeholders
3. Ajustar template se necessário

### Prioridade Média
4. Completar todos os Primitivos (60 frames)
5. Criar Compostos principais (Card, Modal, Table)
6. Criar 3-5 telas de Features

### Prioridade Baixa
7. Completar todos os Compostos
8. Completar todas as Features
9. Adicionar animações/transições
10. Criar variações dark mode

---

**Estrutura Completa:** ✅  
**Documentação:** ✅  
**Script Automação:** ✅  
**Pronto para Criação:** ✅

🎨 **195 frames planejados e documentados!**
