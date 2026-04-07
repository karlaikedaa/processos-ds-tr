# Visão Geral Layout Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize Visão Geral dashboard layout to match Figma reference design with updated cards, standardized table columns, and reordered blocks.

**Architecture:** Direct reorganization approach - update JSX block order, enhance 3 main cards with section titles and progress bars, standardize table columns across all tables while preserving all existing functionality (expansions, drawers, navigation).

**Tech Stack:** React, TypeScript, Tailwind CSS

---

## File Structure

**Modified:**
- `src/app/components/VisaoGeral.tsx` - All changes (mock data, cards, tables, block order)

**No new files created.**
**No test files** (project has no test script configured).

---

## Task 1: Update Mock Data with New Columns

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:47-80`

- [ ] **Step 1: Add breakdown columns to responsaveis mock data**

Locate the `responsaveis` array (around line 55) and update each object to include breakdown columns:

```tsx
const responsaveis = [
  { 
    name: 'Maria Silva', 
    initials: 'MS', 
    abertas: 48, 
    abertasAtraso: 2,
    abertasMulta: 2,
    concluidas: 48,
    concluidasAtraso: 2,
    concluidasMulta: 2,
    total: 1723 
  },
  { 
    name: 'João Pereira', 
    initials: 'JP', 
    abertas: 35, 
    abertasAtraso: 4,
    abertasMulta: 4,
    concluidas: 35,
    concluidasAtraso: 4,
    concluidasMulta: 4,
    total: 121 
  },
  { 
    name: 'Ana Torres', 
    initials: 'AT', 
    abertas: 29, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 29,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    total: 122 
  },
  { 
    name: 'Carlos Rocha', 
    initials: 'CR', 
    abertas: 22, 
    abertasAtraso: 1,
    abertasMulta: 1,
    concluidas: 22,
    concluidasAtraso: 1,
    concluidasMulta: 1,
    total: 346 
  },
];
```

- [ ] **Step 2: Add breakdown columns to departamentos mock data**

Update the `departamentos` array with the same structure:

```tsx
const departamentos = [
  { 
    name: 'Contábil', 
    abertas: 48, 
    abertasAtraso: 2,
    abertasMulta: 2,
    concluidas: 48,
    concluidasAtraso: 2,
    concluidasMulta: 2,
    total: 1723 
  },
  { 
    name: 'Fiscal', 
    abertas: 35, 
    abertasAtraso: 4,
    abertasMulta: 4,
    concluidas: 35,
    concluidasAtraso: 4,
    concluidasMulta: 4,
    total: 121 
  },
  { 
    name: 'Administrativo', 
    abertas: 29, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 29,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    total: 122 
  },
  { 
    name: 'Pessoal', 
    abertas: 22, 
    abertasAtraso: 1,
    abertasMulta: 1,
    concluidas: 22,
    concluidasAtraso: 1,
    concluidasMulta: 1,
    total: 346 
  },
];
```

- [ ] **Step 3: Add breakdown columns to empresas mock data**

Update the `empresas` array:

```tsx
const empresas = [
  { 
    name: 'Empresa ABC Ltda', 
    total: 48, 
    abertas: 48, 
    abertasAtraso: 2,
    abertasMulta: 2,
    concluidas: 48,
    concluidasAtraso: 2,
    concluidasMulta: 2,
    progresso: 83 
  },
  { 
    name: 'Empresa XYZ S/A', 
    total: 35, 
    abertas: 35, 
    abertasAtraso: 4,
    abertasMulta: 2,
    concluidas: 35,
    concluidasAtraso: 4,
    concluidasMulta: 2,
    progresso: 80 
  },
  { 
    name: 'DEF Comércio', 
    total: 29, 
    abertas: 29, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 29,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 86 
  },
  { 
    name: 'GHI Serviços', 
    total: 22, 
    abertas: 22, 
    abertasAtraso: 1,
    abertasMulta: 2,
    concluidas: 22,
    concluidasAtraso: 1,
    concluidasMulta: 2,
    progresso: 62 
  },
  { 
    name: 'JKL Indústria', 
    total: 18, 
    abertas: 18, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 18,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 100 
  },
];
```

- [ ] **Step 4: Add breakdown columns to tarefasAgrupadas mock data**

Update the `tarefasAgrupadas` array:

```tsx
const tarefasAgrupadas = [
  { 
    name: 'DCTF Ago/25', 
    tipo: 'Mensal', 
    total: 48, 
    abertas: 46, 
    abertasAtraso: 4,
    abertasMulta: 2,
    concluidas: 2,
    concluidasAtraso: 2,
    concluidasMulta: 2,
    progresso: 83
  },
  { 
    name: 'REINF Out/25', 
    tipo: 'Mensal', 
    total: 35, 
    abertas: 30, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 5,
    concluidasAtraso: 4,
    concluidasMulta: 2,
    progresso: 80
  },
  { 
    name: 'Alteração Contratual', 
    tipo: 'Esporádica', 
    total: 22, 
    abertas: 22, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 0,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 86
  },
  { 
    name: 'ECF 2025', 
    tipo: 'Anual', 
    total: 20, 
    abertas: 15, 
    abertasAtraso: 6,
    abertasMulta: 4,
    concluidas: 5,
    concluidasAtraso: 1,
    concluidasMulta: 2,
    progresso: 62
  },
  { 
    name: 'Balancete Jan/2026', 
    tipo: 'Mensal', 
    total: 18, 
    abertas: 10, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 8,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 100
  },
];
```

- [ ] **Step 5: Verify mock data updates**

Check that all arrays have the new columns:
- `abertasAtraso`, `abertasMulta`
- `concluidasAtraso`, `concluidasMulta`
- `progresso` (for tarefasAgrupadas)

- [ ] **Step 6: Commit mock data changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
refactor: add breakdown columns to mock data

Add abertasAtraso, abertasMulta, concluidasAtraso, concluidasMulta
columns to responsaveis, departamentos, empresas, and tarefasAgrupadas
mock data arrays for new table structure.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 2: Update Card 1 (Tarefas Abertas)

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:762-779`

- [ ] **Step 1: Add small title and progress bar to Card 1**

Locate the first card in the 3-card grid (around line 762, "4 pontos de atenção") and update it:

```tsx
{/* Card 1: Tarefas abertas */}
<div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
  {/* Small title */}
  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>Tarefas abertas</p>
  
  {/* Main title */}
  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>4 pontos de atenção</p>
  
  {/* Progress bar */}
  <div className="mb-3">
    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Concluídas 50 de 58</p>
    <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--muted)' }}>
      <div style={{ width: '86.2%', height: '100%', background: 'var(--chart-1)', borderRadius: '999px' }} />
    </div>
  </div>
  
  {/* Bullet list */}
  <div className="space-y-2.5">
    <div className="flex items-start gap-2">
      <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: '#6C3FB5' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>1 tarefas gerando multa</span>
    </div>
    <div className="flex items-start gap-2">
      <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: 'var(--destructive)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>2 tarefas atrasadas</span>
    </div>
    <div className="flex items-start gap-2">
      <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: 'var(--chart-2)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>2 tarefas aguardando aprovação</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify Card 1 in browser**

1. Open http://localhost:5174/
2. Navigate to Visão Geral
3. Locate the first card in the 3-card grid
4. Verify it shows:
   - Small title "Tarefas abertas" at top
   - Main title "4 pontos de atenção"
   - Progress bar with "Concluídas 50 de 58"
   - 3 bullet items with correct colors

Expected: Card displays with new structure.

- [ ] **Step 3: Commit Card 1 changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: add section title and progress bar to Card 1

Add 'Tarefas abertas' small title and 'Concluídas 50 de 58' progress
bar to first card. Update bullet colors and text to match design.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 3: Update Card 2 (Cobrança de Documentos)

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:781-795`

- [ ] **Step 1: Add small title to Card 2**

Locate the second card (around line 781, "120 tarefas abertas") and update it:

```tsx
{/* Card 2: Cobrança de documentos */}
<div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
  {/* Small title */}
  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>Cobrança de documentos</p>
  
  {/* Main title */}
  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>120 tarefas abertas com documentos pendentes</p>
  
  {/* Bullet list */}
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>210 tarefas abertas com documentos enviados</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--destructive)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>148 Tarefas sem usuários de clientes vinculados</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify Card 2 in browser**

1. Open http://localhost:5174/
2. Navigate to Visão Geral
3. Locate the second card in the 3-card grid
4. Verify it shows:
   - Small title "Cobrança de documentos" at top
   - Main title "120 tarefas abertas com documentos pendentes"
   - Green bullet: "210 tarefas abertas com documentos enviados"
   - Red bullet: "148 Tarefas sem usuários de clientes vinculados"

Expected: Card displays with new structure.

- [ ] **Step 3: Commit Card 2 changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: add section title to Card 2 and update text

Add 'Cobrança de documentos' small title to second card. Update
bullet text to match design reference.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 4: Update Card 3 (Tarefas Sujeitas à Multa)

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:797-815`

- [ ] **Step 1: Add small title and progress bar to Card 3**

Locate the third card (around line 797, "150 a concluir hoje") and update it:

```tsx
{/* Card 3: Tarefas sujeitas à multa */}
<div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
  {/* Small title */}
  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>Tarefas sujeitas à multa</p>
  
  {/* Main title */}
  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>150 a concluir hoje</p>
  
  {/* Progress bar */}
  <div className="mb-3">
    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>Próximos 5 dias 200 de 400</p>
    <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--muted)' }}>
      <div style={{ width: '50%', height: '100%', background: 'var(--chart-4)', borderRadius: '999px' }} />
    </div>
  </div>
  
  {/* Bullet list */}
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>A concluir (em 5 dias)</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--destructive)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Concluídas - arquivos não baixados (hoje)</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-2)' }} />
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Concluídas - arquivos não baixados (em 5 dias)</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify Card 3 in browser**

1. Open http://localhost:5174/
2. Navigate to Visão Geral
3. Locate the third card in the 3-card grid
4. Verify it shows:
   - Small title "Tarefas sujeitas à multa" at top
   - Main title "150 a concluir hoje"
   - Progress bar with "Próximos 5 dias 200 de 400"
   - 3 bullet items with correct colors and text

Expected: Card displays with new structure.

- [ ] **Step 3: Commit Card 3 changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: add section title and progress bar to Card 3

Add 'Tarefas sujeitas à multa' small title and 'Próximos 5 dias'
progress bar to third card. Update bullet text to match design.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 5: Update Desempenho por Responsável Table

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:946-983`

- [ ] **Step 1: Update table headers for Desempenho por Responsável**

Locate the "Desempenho por responsável" table (around line 946) and update the headers:

```tsx
<thead>
  <tr style={{ borderBottom: '1px solid var(--border)' }}>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Funcionário</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>com multa</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>com multa</th>
    <th className="text-left pb-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>%</th>
  </tr>
</thead>
```

- [ ] **Step 2: Update table body cells for Desempenho por Responsável**

Update the tbody to render new columns:

```tsx
<tbody>
  {responsaveis.map((r) => {
    const pct = Math.round((r.concluidas / r.total) * 100);
    const pctColor = pct >= 90 ? 'var(--chart-1)' : pct >= 50 ? 'var(--chart-3)' : 'var(--chart-4)';
    
    return (
      <tr key={r.name} style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Funcionário */}
        <td className="py-2 pr-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: avatarColors[responsaveis.indexOf(r) % avatarColors.length], color: 'white', fontSize: '10px', fontWeight: 600 }}>
              {r.initials}
            </div>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{r.name}</span>
          </div>
        </td>
        
        {/* Abertas total */}
        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{r.abertas}</td>
        
        {/* Abertas em atraso */}
        <td className="py-2 pr-2">
          {r.abertasAtraso > 0 ? (
            <BadgeCount value={r.abertasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Abertas com multa */}
        <td className="py-2 pr-2">
          {r.abertasMulta > 0 ? (
            <BadgeCount value={r.abertasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Concluídas total */}
        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{r.concluidas}</td>
        
        {/* Concluídas em atraso */}
        <td className="py-2 pr-2">
          {r.concluidasAtraso > 0 ? (
            <BadgeCount value={r.concluidasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Concluídas com multa */}
        <td className="py-2 pr-2">
          {r.concluidasMulta > 0 ? (
            <BadgeCount value={r.concluidasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Percentage */}
        <td className="py-2" style={{ fontSize: 'var(--text-caption)', color: pctColor, fontWeight: 'var(--font-weight-semibold)' }}>{pct}%</td>
      </tr>
    );
  })}
</tbody>
```

- [ ] **Step 3: Verify table in browser**

1. Open http://localhost:5174/
2. Navigate to Visão Geral
3. Locate "Desempenho por responsável" table
4. Verify columns: Funcionário | Abertas total | Abertas em atraso | Abertas com multa | Concluídas total | Concluídas em atraso | Concluídas com multa | %
5. Verify badges display for atraso (red) and multa (purple)
6. Verify percentage colors (green/orange/red)

Expected: Table displays with new column structure.

- [ ] **Step 4: Commit table changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: update Desempenho por Responsável table columns

Add breakdown columns for abertas/concluídas (em atraso, com multa).
Display colored badges for atraso and multa values. Update percentage
coloring based on completion rate.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 6: Update Desempenho por Departamento Table

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:984-1014`

- [ ] **Step 1: Update table headers and body for Desempenho por Departamento**

Locate the "Desempenho por departamento" table (around line 984) and apply the same column structure as Task 5, but without avatars:

```tsx
<thead>
  <tr style={{ borderBottom: '1px solid var(--border)' }}>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Departamentos</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas<br/>com multa</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>com multa</th>
    <th className="text-left pb-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>%</th>
  </tr>
</thead>
<tbody>
  {departamentos.map((d) => {
    const pct = Math.round((d.concluidas / d.total) * 100);
    const pctColor = pct >= 90 ? 'var(--chart-1)' : pct >= 50 ? 'var(--chart-3)' : 'var(--chart-4)';
    
    return (
      <tr key={d.name} style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Departamento (no avatar) */}
        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.name}</td>
        
        {/* Abertas total */}
        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.abertas}</td>
        
        {/* Abertas em atraso */}
        <td className="py-2 pr-2">
          {d.abertasAtraso > 0 ? (
            <BadgeCount value={d.abertasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Abertas com multa */}
        <td className="py-2 pr-2">
          {d.abertasMulta > 0 ? (
            <BadgeCount value={d.abertasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Concluídas total */}
        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.concluidas}</td>
        
        {/* Concluídas em atraso */}
        <td className="py-2 pr-2">
          {d.concluidasAtraso > 0 ? (
            <BadgeCount value={d.concluidasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Concluídas com multa */}
        <td className="py-2 pr-2">
          {d.concluidasMulta > 0 ? (
            <BadgeCount value={d.concluidasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
          ) : (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
          )}
        </td>
        
        {/* Percentage */}
        <td className="py-2" style={{ fontSize: 'var(--text-caption)', color: pctColor, fontWeight: 'var(--font-weight-semibold)' }}>{pct}%</td>
      </tr>
    );
  })}
</tbody>
```

- [ ] **Step 2: Verify table in browser**

1. Open http://localhost:5174/
2. Locate "Desempenho por departamento" table
3. Verify same columns as responsável but without avatars
4. Verify badges and percentage coloring work correctly

Expected: Table displays with new column structure.

- [ ] **Step 3: Commit table changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: update Desempenho por Departamento table columns

Add same breakdown columns as Responsável table (abertas/concluídas
em atraso and com multa). Display without avatars.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 7: Update Tarefas por Empresa Table

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:1057-1162`

- [ ] **Step 1: Update table headers for Tarefas por Empresa**

Locate the "Tarefas por empresa" table (around line 1057) and update headers:

```tsx
<thead>
  <tr style={{ borderBottom: '1px solid var(--border)' }}>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Empresas</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Aberta em<br/>atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Aberta com<br/>multa</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>com multa</th>
    <th className="text-left pb-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Progresso</th>
  </tr>
</thead>
```

- [ ] **Step 2: Update table body cells**

Update the tbody to render new columns (keep expansion logic):

```tsx
<tbody>
  {empresas.map((e) => {
    const isExpanded = expandedEmpresa === e.name;
    const tarefas = mockEmpresaTasks[e.name] || [];
    return (
      <React.Fragment key={e.name}>
        <tr 
          style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)' }} 
          className="hover:bg-muted/20 transition-colors cursor-pointer"
          onClick={(ev) => {
            ev.stopPropagation();
            setExpandedEmpresa(isExpanded ? null : e.name);
          }}
        >
          {/* Empresa */}
          <td className="py-2 pr-2">
            <div className="flex items-center gap-2">
              <ChevronRight 
                size={12} 
                style={{ 
                  color: 'var(--muted-foreground)', 
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s'
                }} 
              />
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                <Building2 size={11} style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} className="truncate max-w-[100px]">{e.name}</span>
            </div>
          </td>
          
          {/* Total */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{e.total}</td>
          
          {/* Abertas */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{e.abertas}</td>
          
          {/* Aberta em atraso */}
          <td className="py-2 pr-2">
            {e.abertasAtraso > 0 ? (
              <BadgeCount value={e.abertasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Aberta com multa */}
          <td className="py-2 pr-2">
            {e.abertasMulta > 0 ? (
              <BadgeCount value={e.abertasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Concluídas */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{e.concluidas}</td>
          
          {/* Concluídas em atraso */}
          <td className="py-2 pr-2">
            {e.concluidasAtraso > 0 ? (
              <BadgeCount value={e.concluidasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Concluídas com multa */}
          <td className="py-2 pr-2">
            {e.concluidasMulta > 0 ? (
              <BadgeCount value={e.concluidasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Progresso */}
          <td className="py-2" style={{ minWidth: '120px' }}>
            <div className="flex items-center gap-2">
              <ProgressBar pct={e.progresso} color={e.progresso === 100 ? 'var(--chart-1)' : e.progresso >= 80 ? 'var(--chart-1)' : 'var(--chart-4)'} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{e.progresso}%</span>
            </div>
          </td>
        </tr>
        {isExpanded && tarefas.length > 0 && (
          <tr>
            <td colSpan={9} style={{ padding: 0 }}>
              <div style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
                {tarefas.map((t, tidx) => (
                  <div 
                    key={t.id}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigateTarefas('lista', { status: t.status, cliente: e.name });
                    }}
                    className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 cursor-pointer transition-colors"
                    style={{ borderBottom: tidx < tarefas.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.id}</span>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', flex: 1, marginLeft: '8px' }}>{t.nome}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  })}
</tbody>
```

- [ ] **Step 3: Verify table in browser**

1. Open http://localhost:5174/
2. Locate "Tarefas por empresa" table
3. Verify columns match reference
4. Click empresa row → verify expansion works
5. Click task in expansion → verify navigation works
6. Verify progress bar shows with percentage

Expected: Table displays with new columns, expansion works.

- [ ] **Step 4: Commit table changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: update Tarefas por Empresa table columns

Add breakdown columns (aberta/concluída em atraso and com multa).
Add progress bar with percentage. Maintain expansion functionality.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 8: Update Tarefas Table

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:1164-1260`

- [ ] **Step 1: Update table headers for Tarefas**

Locate the "Tarefas" table (around line 1164) and update headers:

```tsx
<thead>
  <tr style={{ borderBottom: '1px solid var(--border)' }}>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tarefa</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tipo</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Total</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Abertas</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Aberta em<br/>atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Aberta com<br/>multa</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>em atraso</th>
    <th className="text-left pb-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Concluídas<br/>com multa</th>
    <th className="text-left pb-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Progresso</th>
  </tr>
</thead>
```

- [ ] **Step 2: Update table body cells**

Update tbody (keep expansion logic):

```tsx
<tbody>
  {tarefasAgrupadas.map((tarefa) => {
    const isExpanded = expandedTarefa === tarefa.name;
    const empresas = mockTarefaEmpresas[tarefa.name] || [];
    
    // Tipo color/icon logic
    const tipoColor = tarefa.tipo === 'Mensal' ? 'var(--chart-2)' : tarefa.tipo === 'Anual' ? 'var(--chart-3)' : '#8B5CF6';
    const tipoBg = tarefa.tipo === 'Mensal' ? 'rgba(21,115,211,0.08)' : tarefa.tipo === 'Anual' ? 'rgba(254,166,1,0.08)' : 'rgba(139,92,246,0.08)';
    
    return (
      <React.Fragment key={tarefa.name}>
        <tr 
          style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)' }} 
          className="hover:bg-muted/20 transition-colors cursor-pointer"
          onClick={(ev) => {
            ev.stopPropagation();
            setExpandedTarefa(isExpanded ? null : tarefa.name);
          }}
        >
          {/* Tarefa */}
          <td className="py-2 pr-2">
            <div className="flex items-center gap-2">
              <ChevronRight 
                size={12} 
                style={{ 
                  color: 'var(--muted-foreground)', 
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s'
                }} 
              />
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                <FileText size={11} style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} className="truncate max-w-[120px]">{tarefa.name}</span>
            </div>
          </td>
          
          {/* Tipo */}
          <td className="py-2 pr-2">
            <span className="px-2 py-0.5 rounded-full" style={{ 
              fontSize: 'var(--text-caption)', 
              color: tipoColor,
              background: tipoBg,
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {tarefa.tipo}
            </span>
          </td>
          
          {/* Total */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{tarefa.total}</td>
          
          {/* Abertas */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{tarefa.abertas}</td>
          
          {/* Aberta em atraso */}
          <td className="py-2 pr-2">
            {tarefa.abertasAtraso > 0 ? (
              <BadgeCount value={tarefa.abertasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Aberta com multa */}
          <td className="py-2 pr-2">
            {tarefa.abertasMulta > 0 ? (
              <BadgeCount value={tarefa.abertasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Concluídas */}
          <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>{tarefa.concluidas}</td>
          
          {/* Concluídas em atraso */}
          <td className="py-2 pr-2">
            {tarefa.concluidasAtraso > 0 ? (
              <BadgeCount value={tarefa.concluidasAtraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Concluídas com multa */}
          <td className="py-2 pr-2">
            {tarefa.concluidasMulta > 0 ? (
              <BadgeCount value={tarefa.concluidasMulta} color="#6C3FB5" bg="rgba(108,63,181,0.1)" />
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
            )}
          </td>
          
          {/* Progresso */}
          <td className="py-2" style={{ minWidth: '120px' }}>
            <div className="flex items-center gap-2">
              <ProgressBar pct={tarefa.progresso} color={tarefa.progresso === 100 ? 'var(--chart-1)' : tarefa.progresso >= 80 ? 'var(--chart-1)' : 'var(--chart-4)'} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{tarefa.progresso}%</span>
            </div>
          </td>
        </tr>
        {isExpanded && empresas.length > 0 && (
          <tr>
            <td colSpan={10} style={{ padding: 0 }}>
              <div style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
                {empresas.map((emp, empIdx) => (
                  <div 
                    key={empIdx}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigateTarefas('lista', { status: emp.status, cliente: emp.empresa });
                    }}
                    className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 cursor-pointer transition-colors"
                    style={{ borderBottom: empIdx < empresas.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={11} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{emp.empresa}</span>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  })}
</tbody>
```

- [ ] **Step 3: Verify table in browser**

1. Open http://localhost:5174/
2. Locate "Tarefas" table
3. Verify all columns display correctly
4. Click tarefa row → verify expansion works
5. Click empresa in expansion → verify navigation works
6. Verify tipo badges have correct colors
7. Verify progress bars display

Expected: Table displays with all new columns, expansion works.

- [ ] **Step 4: Commit table changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
feat: update Tarefas table columns

Add breakdown columns (aberta/concluída em atraso and com multa).
Add progress bar with percentage. Update tipo badges. Maintain
expansion functionality.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 9: Reorganize Block Order and Remove KPI Rows

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx` (entire render section)

- [ ] **Step 1: Reorganize JSX blocks in render**

Rearrange the blocks in the return statement to match the new order. The current order is:
- Header
- Tarefas bar (vencendo hoje)
- Alert Banners
- 3 Cards Principais
- Resumo + Ações Rápidas
- Performance tables
- KPI Rows (2 sections)
- Tarefas por empresa e status

New order should be:
- Header
- Tarefas bar (vencendo hoje)
- Alert Banners
- 3 Cards Principais
- Resumo + Ações Rápidas
- Performance tables
- Tarefas por empresa
- Tarefas
- Drawers

Move the KPI Rows sections completely out (delete them). Move the blocks to the new order by cutting and pasting JSX sections.

- [ ] **Step 2: Verify no KPI Rows remain**

Search for comments `{/* ── KPI Row` in the file and ensure both KPI Row 1 and KPI Row 2 sections are deleted.

- [ ] **Step 3: Verify visual order in browser**

1. Open http://localhost:5174/
2. Navigate to Visão Geral
3. Scroll down and verify the order:
   - Tarefas vencendo hoje bar
   - 2 Alerts
   - 3 Cards (tarefas abertas, cobrança, multa)
   - Resumo donut + Ações rápidas
   - Performance tables (responsável + departamento)
   - Tarefas por empresa table
   - Tarefas table

Expected: All blocks appear in the correct order, no KPI sections visible.

- [ ] **Step 4: Commit reorganization**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
refactor: reorganize Visão Geral block order

Reorder blocks to match Figma reference: alerts moved up, KPI Rows
removed, tables at bottom. All functionality preserved.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Expected: Commit created successfully.

---

## Task 10: Final Verification

**Files:**
- Verify: `src/app/components/VisaoGeral.tsx`

- [ ] **Step 1: Complete visual verification**

1. Open http://localhost:5174/
2. Navigate to Visão Geral page
3. Verify each section matches the reference:

**Card Vencendo Hoje:**
- Shows "2.800 vencendo hoje", concluídas, progress bar
- Click opens drawer ✓

**Alerts:**
- 2 alerts display at top
- Click "Abrir tarefas" / "Abrir detalhes" opens correct drawers ✓

**3 Cards:**
- Card 1: Small title "Tarefas abertas", progress bar "Concluídas 50 de 58", 3 bullets ✓
- Card 2: Small title "Cobrança de documentos", 2 bullets ✓
- Card 3: Small title "Tarefas sujeitas à multa", progress bar "Próximos 5 dias", 3 bullets ✓

**Resumo + Ações:**
- Donut chart displays ✓
- Ações rápidas grid displays ✓

**Performance Tables:**
- Responsável: 8 columns (Funcionário, Abertas total, em atraso, com multa, Concluídas total, em atraso, com multa, %) ✓
- Departamento: 8 columns (same structure) ✓
- Badges display for atraso (red) and multa (purple) ✓
- Percentages colored correctly ✓

**Tarefas por Empresa:**
- 9 columns (Empresas, Total, Abertas, atraso, multa, Concluídas, atraso, multa, Progresso) ✓
- Click row → expands → shows tasks with status badges ✓
- Click task → navigates to filtered list ✓
- Progress bars display ✓

**Tarefas:**
- 10 columns (Tarefa, Tipo, Total, Abertas, atraso, multa, Concluídas, atraso, multa, Progresso) ✓
- Tipo badges colored correctly ✓
- Click row → expands → shows empresas with status badges ✓
- Click empresa → navigates to filtered list ✓
- Progress bars display ✓

**Missing (should NOT be present):**
- No KPI Row sections ✓

- [ ] **Step 2: Test responsive behavior**

1. Resize browser to mobile width (< 640px)
2. Verify:
   - 3-card grid stacks vertically
   - Tables scroll horizontally
   - Alerts stack properly
   - Drawers work on mobile

Expected: All responsive behaviors work correctly.

- [ ] **Step 3: Test all interactive features**

Click through each interactive element:
- Vencendo hoje card → drawer opens ✓
- Alert buttons → drawers open ✓
- Empresa expansion → shows tasks ✓
- Task click in expansion → navigation works ✓
- Tarefa expansion → shows empresas ✓
- Empresa click in expansion → navigation works ✓
- Resumo donut → displays correctly ✓
- Ações rápidas buttons → all present ✓

Expected: All interactions work as before.

- [ ] **Step 4: Final commit (if any fixes needed)**

If any issues found and fixed during verification:

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "$(cat <<'EOF'
fix: final adjustments to Visão Geral layout

[Describe any fixes made during final verification]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Otherwise, verification complete.

---

## Verification Checklist

After completing all tasks:

- [ ] Mock data has all new columns (abertasAtraso, abertasMulta, concluidasAtraso, concluidasMulta)
- [ ] Card 1 has small title and progress bar
- [ ] Card 2 has small title
- [ ] Card 3 has small title and progress bar
- [ ] All card bullets have correct colors and text
- [ ] Desempenho por Responsável table has 8 columns with badges
- [ ] Desempenho por Departamento table has 8 columns with badges
- [ ] Tarefas por Empresa table has 9 columns with progress bars
- [ ] Tarefas table has 10 columns with progress bars
- [ ] All tables have correct expansion behavior
- [ ] All navigation from expanded rows works
- [ ] Block order matches reference (alerts at top, tables at bottom)
- [ ] KPI Rows removed
- [ ] All drawers work correctly
- [ ] Responsive layout works on mobile
- [ ] No visual regressions
- [ ] Dev server running without errors

---

## Self-Review Notes

**Spec coverage:**
- ✅ Block reorganization (Task 9)
- ✅ 3 Cards update with titles and progress bars (Tasks 2, 3, 4)
- ✅ All table columns updated (Tasks 5, 6, 7, 8)
- ✅ Mock data updated (Task 1)
- ✅ Functionality preserved (verified in Task 10)
- ✅ KPI Rows removed (Task 9)

**Placeholder scan:**
- No TBD, TODO, or placeholders present
- All code blocks show exact implementations
- All commands include expected output

**Type consistency:**
- Mock data structure consistent across all tasks
- Column names match between tasks (abertasAtraso, abertasMulta, etc.)
- Badge components used consistently
- ProgressBar component used consistently

**Gaps:**
- None identified
