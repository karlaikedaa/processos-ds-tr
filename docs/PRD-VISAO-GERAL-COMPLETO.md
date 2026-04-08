# PRD - Visão Geral Dashboard

**Produto:** Sistema de Gestão de Tarefas Fiscais e Contábeis  
**Módulo:** Visão Geral (Dashboard Principal)  
**Versão:** 2.0  
**Data:** 08 de Abril de 2026  
**Status:** Implementado

---

## 1. Visão Geral do Produto

O Dashboard Visão Geral é o módulo central do sistema de gestão de tarefas fiscais e contábeis. Ele fornece uma visão consolidada e em tempo real do status de todas as tarefas, permitindo que gestores e responsáveis monitorem o desempenho, identifiquem gargalos e tomem decisões baseadas em dados.

### 1.1 Objetivos

- **Visibilidade Total:** Apresentar o status completo de todas as tarefas em uma única tela
- **Identificação de Riscos:** Destacar tarefas em atraso, gerando multa ou aguardando aprovação
- **Monitoramento de Desempenho:** Acompanhar produtividade por responsável e departamento
- **Ação Rápida:** Facilitar navegação direta para listas filtradas de tarefas específicas
- **Gestão de Documentos:** Monitorar cobrança e envio de documentos de clientes

### 1.2 Usuários-Alvo

- Gestores e Supervisores Fiscais
- Coordenadores de Departamento
- Analistas Contábeis
- Responsáveis por Tarefas

---

## 2. Estrutura da Interface

### 2.1 Layout Geral

O dashboard é organizado em 9 blocos principais, apresentados em ordem vertical:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER                                                    │
├─────────────────────────────────────────────────────────────┤
│ 2. CARD TAREFAS VENCENDO HOJE                               │
├─────────────────────────────────────────────────────────────┤
│ 3. ALERTAS (2 cards lado a lado)                           │
│    - Alerta 1: Falha de envio                              │
│    - Alerta 2: Configurações pendentes                      │
├─────────────────────────────────────────────────────────────┤
│ 4. CARDS PRINCIPAIS (3 cards em grid)                      │
│    - Card 1: Tarefas abertas                                │
│    - Card 2: Cobrança de documentos                         │
│    - Card 3: Tarefas sujeitas à multa                       │
├─────────────────────────────────────────────────────────────┤
│ 5. RESUMO + AÇÕES RÁPIDAS (2 cards lado a lado)           │
│    - Resumo de Tarefas (donut chart)                        │
│    - Ações Rápidas (grid de botões)                         │
├─────────────────────────────────────────────────────────────┤
│ 6. TABELAS DE DESEMPENHO (2 tabelas lado a lado)          │
│    - Desempenho por Responsável (8 colunas)                │
│    - Desempenho por Departamento (8 colunas)               │
├─────────────────────────────────────────────────────────────┤
│ 7. TAREFAS POR EMPRESA (tabela expansível - 9 colunas)    │
├─────────────────────────────────────────────────────────────┤
│ 8. TAREFAS (tabela expansível - 10 colunas)               │
├─────────────────────────────────────────────────────────────┤
│ 9. DRAWERS E PAINÉIS LATERAIS                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Responsividade

- **Desktop (>1200px):** Layout completo com grids de 2 e 3 colunas
- **Tablet (768px-1200px):** Grids colapsam para 1 coluna, tabelas com scroll horizontal
- **Mobile (<768px):** Todos os elementos em coluna única, scroll horizontal em tabelas

---

## 3. Componentes Detalhados

### 3.1 BLOCO 1: Header

**Elementos:**
- Título: "Visão Geral"
- Breadcrumb de navegação
- Informações do usuário logado

**Estilo:**
- Background: `var(--background)`
- Altura: 64px
- Border bottom: `1px solid var(--border)`

---

### 3.2 BLOCO 2: Card Tarefas Vencendo Hoje

**Objetivo:** Destacar tarefas com prazo para hoje que requerem atenção imediata.

**Estrutura:**
```
┌────────────────────────────────────────────────┐
│ 📋 2.800 vencendo hoje                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 52% concluídas │
│                                                 │
│ • 1.452 concluídas                             │
│ • 1.348 em andamento                           │
└────────────────────────────────────────────────┘
```

**Especificações:**
- **Título principal:** "2.800 vencendo hoje" (font-size: text-title, color: foreground)
- **Progress bar:** 52% preenchido (cor: chart-1 se ≥80%, chart-4 se <80%)
- **Label da barra:** "52% concluídas"
- **Bullets:**
  - Verde (chart-1): "1.452 concluídas"
  - Azul (chart-2): "1.348 em andamento"

**Interação:**
- Click no card → Abre `TaskListDrawer` com tarefas vencendo hoje

**Estilos:**
- Background: `var(--card)`
- Border radius: 8px
- Shadow: `var(--elevation-sm)`
- Padding: 24px

---

### 3.3 BLOCO 3: Alertas

Dois cards de alerta posicionados lado a lado em grid de 2 colunas.

#### 3.3.1 Alerta 1: Falha de Envio

**Objetivo:** Notificar sobre falhas no envio de documentos via portal, email ou WhatsApp.

**Estrutura:**
```
┌────────────────────────────────────────┐
│ ⚠️  Falha de envio                     │
│                                         │
│ Não foi possível enviar arquivos       │
│ para 24 clientes                        │
│                                         │
│ [Abrir tarefas]                        │
└────────────────────────────────────────┘
```

**Especificações:**
- **Ícone:** AlertTriangle (size: 16, color: destructive)
- **Título:** "Falha de envio"
- **Descrição:** "Não foi possível enviar arquivos para X clientes"
- **Botão:** "Abrir tarefas" (variant: default)

**Interação:**
- Click em "Abrir tarefas" → Abre `FalhaEnvioDrawer` com tabs:
  - Portal: Lista de falhas no portal do cliente
  - Email: Lista de falhas no envio por email
  - WhatsApp: Lista de falhas no envio por WhatsApp

**Estilos:**
- Background: `rgba(220,10,10,0.05)` (vermelho claro)
- Border: `1px solid var(--destructive)`
- Border radius: 8px
- Padding: 20px

#### 3.3.2 Alerta 2: Configurações Pendentes

**Objetivo:** Notificar sobre clientes com configurações pendentes que impedem o trabalho.

**Estrutura:**
```
┌────────────────────────────────────────┐
│ ⚙️  Configurações pendentes            │
│                                         │
│ 45 clientes com configurações          │
│ incompletas                             │
│                                         │
│ [Abrir detalhes]                       │
└────────────────────────────────────────┘
```

**Especificações:**
- **Ícone:** Settings (size: 16, color: chart-3)
- **Título:** "Configurações pendentes"
- **Descrição:** "X clientes com configurações incompletas"
- **Botão:** "Abrir detalhes" (variant: default)

**Interação:**
- Click em "Abrir detalhes" → Abre `ConfigPendentesDrawer` com categorias:
  - Inativos: Clientes marcados como inativos
  - Sem email: Clientes sem email cadastrado
  - Sem certificado: Clientes sem certificado digital
  - Sem acesso ao portal: Clientes sem credenciais de acesso

**Estilos:**
- Background: `rgba(254,166,1,0.05)` (laranja claro)
- Border: `1px solid var(--chart-3)`
- Border radius: 8px
- Padding: 20px

---

### 3.4 BLOCO 4: Cards Principais

Grid de 3 colunas com cards informativos detalhados.

#### 3.4.1 Card 1: Tarefas Abertas

**Objetivo:** Apresentar pontos de atenção em tarefas abertas.

**Estrutura:**
```
┌─────────────────────────────────────────┐
│ Tarefas abertas                         │
│ 4 pontos de atenção                     │
│                                          │
│ Concluídas 50 de 58                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 86.2%   │
│                                          │
│ ● 1 tarefas gerando multa               │
│ ● 2 tarefas atrasadas                   │
│ ● 2 tarefas aguardando aprovação        │
└─────────────────────────────────────────┘
```

**Especificações:**

**Small title (topo):**
- Text: "Tarefas abertas"
- Font-size: `var(--text-caption)`
- Color: `var(--muted-foreground)`
- Margin-bottom: 8px

**Main title:**
- Text: "4 pontos de atenção"
- Font-size: `var(--text-label)`
- Font-weight: `var(--font-weight-semibold)`
- Color: `var(--foreground)`
- Margin-bottom: 12px

**Progress bar:**
- Label: "Concluídas 50 de 58"
- Porcentagem: 86.2%
- Cor da barra: `var(--chart-1)` (verde)
- Altura: 8px
- Background: `var(--muted)`

**Bullets:**
- Purple (#6C3FB5): "1 tarefas gerando multa"
- Red (var(--destructive)): "2 tarefas atrasadas"
- Blue (var(--chart-2)): "2 tarefas aguardando aprovação"

**Estilos:**
- Background: `var(--card)`
- Border radius: 8px
- Shadow: `var(--elevation-sm)`
- Padding: 16px

#### 3.4.2 Card 2: Cobrança de Documentos

**Objetivo:** Monitorar status de documentos pendentes e enviados.

**Estrutura:**
```
┌─────────────────────────────────────────┐
│ Cobrança de documentos                  │
│ 120 tarefas abertas com documentos      │
│ pendentes                                │
│                                          │
│ ● 210 tarefas abertas com documentos    │
│   enviados                               │
│ ● 148 Tarefas sem usuários de clientes  │
│   vinculados                             │
└─────────────────────────────────────────┘
```

**Especificações:**

**Small title:**
- Text: "Cobrança de documentos"
- Font-size: `var(--text-caption)`
- Color: `var(--muted-foreground)`

**Main title:**
- Text: "120 tarefas abertas com documentos pendentes"
- Font-size: `var(--text-label)`
- Font-weight: `var(--font-weight-semibold)`

**Bullets:**
- Green (var(--chart-1)): "210 tarefas abertas com documentos enviados"
- Red (var(--destructive)): "148 Tarefas sem usuários de clientes vinculados"

**Estilos:** Mesmos do Card 1

#### 3.4.3 Card 3: Tarefas Sujeitas à Multa

**Objetivo:** Destacar tarefas que podem gerar multas se não concluídas.

**Estrutura:**
```
┌─────────────────────────────────────────┐
│ Tarefas sujeitas à multa                │
│ 150 a concluir hoje                     │
│                                          │
│ Próximos 5 dias 200 de 400              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 50%  │
│                                          │
│ ● A concluir (em 5 dias)                │
│ ● Concluídas - arquivos não baixados    │
│   (hoje)                                 │
│ ● Concluídas - arquivos não baixados    │
│   (em 5 dias)                            │
└─────────────────────────────────────────┘
```

**Especificações:**

**Small title:**
- Text: "Tarefas sujeitas à multa"

**Main title:**
- Text: "150 a concluir hoje"

**Progress bar:**
- Label: "Próximos 5 dias 200 de 400"
- Porcentagem: 50%
- Cor: `var(--chart-4)` (vermelho/laranja)

**Bullets:**
- Orange (var(--chart-3)): "A concluir (em 5 dias)"
- Red (var(--destructive)): "Concluídas - arquivos não baixados (hoje)"
- Blue (var(--chart-2)): "Concluídas - arquivos não baixados (em 5 dias)"

---

### 3.5 BLOCO 5: Resumo + Ações Rápidas

Grid de 2 colunas com resumo visual e botões de ação.

#### 3.5.1 Resumo de Tarefas (Esquerda)

**Objetivo:** Visualizar distribuição de tarefas por status em gráfico donut.

**Estrutura:**
```
┌──────────────────────────────────┐
│ Resumo de Tarefas                │
│                                   │
│       ╭─────────╮                │
│      ╱           ╲               │
│     │   Donut     │              │
│      ╲  Chart   ╱               │
│       ╰─────────╯                │
│                                   │
│ ● Abertas: 1.348                 │
│ ● Concluídas: 1.452              │
│ ● Atrasadas: 89                  │
│ ● Aguardando aprovação: 111      │
└──────────────────────────────────┘
```

**Especificações:**

**Donut Chart:**
- Abertas: `var(--chart-2)` (azul)
- Concluídas: `var(--chart-1)` (verde)
- Atrasadas: `var(--chart-4)` (vermelho)
- Aguardando aprovação: `var(--chart-3)` (laranja)

**Legenda:**
- Posicionada abaixo do chart
- Cada item com dot colorido + label + valor

#### 3.5.2 Ações Rápidas (Direita)

**Objetivo:** Acesso rápido a funcionalidades comuns.

**Estrutura:**
```
┌──────────────────────────────────┐
│ Ações Rápidas                    │
│                                   │
│ [Nova Tarefa]    [Relatórios]    │
│ [Clientes]       [Configurações] │
└──────────────────────────────────┘
```

**Especificações:**

**Grid de botões:**
- Layout: 2x2
- Gap: 12px
- Cada botão:
  - Ícone (size: 20)
  - Label (text-caption)
  - Background: `var(--muted)`
  - Hover: `var(--accent)`
  - Padding: 16px
  - Border radius: 8px

**Botões:**
1. **Nova Tarefa:** PlusCircle icon → Abre modal de criação
2. **Relatórios:** FileText icon → Navega para página de relatórios
3. **Clientes:** Users icon → Navega para lista de clientes
4. **Configurações:** Settings icon → Navega para configurações

---

### 3.6 BLOCO 6: Tabelas de Desempenho

Grid de 2 colunas com tabelas de métricas de performance.

#### 3.6.1 Desempenho por Responsável

**Objetivo:** Monitorar produtividade individual de cada funcionário.

**Estrutura da Tabela (8 colunas):**

| Funcionário | Abertas total | Abertas em atraso | Abertas com multa | Concluídas total | Concluídas em atraso | Concluídas com multa | % |
|-------------|---------------|-------------------|-------------------|------------------|----------------------|----------------------|---|
| 👤 Ana Silva | 24 | 2 | 1 | 76 | 0 | 0 | 76% |

**Especificações:**

**Coluna 1: Funcionário**
- Avatar circular (24x24px) com iniciais
- Background do avatar: cores do array `avatarColors`
- Nome completo do funcionário
- Font-size: `var(--text-caption)`

**Colunas 2-4: Abertas**
- **Abertas total:** Número total de tarefas abertas
- **Abertas em atraso:** Badge vermelho com contagem (ou "—" se zero)
  - Background: `rgba(220,10,10,0.1)`
  - Color: `var(--chart-4)`
- **Abertas com multa:** Badge roxo com contagem (ou "—" se zero)
  - Background: `rgba(108,63,181,0.1)`
  - Color: `#6C3FB5`

**Colunas 5-7: Concluídas**
- **Concluídas total:** Número total de tarefas concluídas
- **Concluídas em atraso:** Badge vermelho com contagem
- **Concluídas com multa:** Badge roxo com contagem

**Coluna 8: % (Percentual de Conclusão)**
- Cálculo: `(concluídas / total) * 100`
- Cor baseada em threshold:
  - ≥90%: `var(--chart-1)` (verde)
  - 50-89%: `var(--chart-3)` (laranja)
  - <50%: `var(--chart-4)` (vermelho)
- Font-weight: semibold

**Interação:**
- Hover na linha: Background `var(--muted)/20`
- Click na linha: Navega para `navigateTarefas('lista')` sem filtros

**Estilos:**
- Background: `var(--card)`
- Border radius: 8px
- Shadow: `var(--elevation-sm)`
- Padding: 20px
- Border entre linhas: `1px solid var(--border)`

**Mock Data:**
```javascript
const responsaveis = [
  { 
    name: 'Ana Silva', 
    initials: 'AS',
    total: 100, 
    abertas: 24, 
    abertasAtraso: 2,
    abertasMulta: 1,
    concluidas: 76,
    concluidasAtraso: 0,
    concluidasMulta: 0
  },
  { 
    name: 'Carlos Souza', 
    initials: 'CS',
    total: 85, 
    abertas: 30, 
    abertasAtraso: 5,
    abertasMulta: 2,
    concluidas: 55,
    concluidasAtraso: 3,
    concluidasMulta: 1
  },
  { 
    name: 'Marina Costa', 
    initials: 'MC',
    total: 92, 
    abertas: 12, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 80,
    concluidasAtraso: 1,
    concluidasMulta: 0
  }
]
```

#### 3.6.2 Desempenho por Departamento

**Objetivo:** Monitorar produtividade por departamento.

**Estrutura:** Mesma das 8 colunas de Responsável, mas:
- Coluna 1: Nome do departamento (SEM avatar, apenas texto)
- Resto idêntico

**Departamentos:**
- Fiscal
- Contábil
- Pessoal
- Societário

**Mock Data:**
```javascript
const departamentos = [
  { 
    name: 'Fiscal', 
    total: 450, 
    abertas: 180, 
    abertasAtraso: 12,
    abertasMulta: 8,
    concluidas: 270,
    concluidasAtraso: 5,
    concluidasMulta: 3
  },
  { 
    name: 'Contábil', 
    total: 380, 
    abertas: 150, 
    abertasAtraso: 8,
    abertasMulta: 4,
    concluidas: 230,
    concluidasAtraso: 4,
    concluidasMulta: 2
  },
  { 
    name: 'Pessoal', 
    total: 290, 
    abertas: 95, 
    abertasAtraso: 3,
    abertasMulta: 1,
    concluidas: 195,
    concluidasAtraso: 2,
    concluidasMulta: 1
  }
]
```

---

### 3.7 BLOCO 7: Tarefas por Empresa

**Objetivo:** Visualizar status de tarefas agrupadas por cliente/empresa.

**Estrutura da Tabela (9 colunas + expansível):**

| Empresas | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso |
|----------|-------|---------|------------------|------------------|------------|----------------------|----------------------|-----------|
| 🏢 Empresa ABC | 48 | 24 | 2 | 2 | 24 | 2 | 2 | ████████░░ 50% |

**Especificações:**

**Coluna 1: Empresas**
- ChevronRight (12px) → Rotaciona 90° quando expandido
- Building2 icon (11px) em círculo com fundo `var(--muted)`
- Nome da empresa (truncado em 100px)

**Colunas 2-3:**
- Total: Número total de tarefas
- Abertas: Tarefas em status aberto

**Colunas 4-5:**
- Aberta em atraso: Badge vermelho
- Aberta com multa: Badge roxo

**Coluna 6:**
- Concluídas: Total de tarefas concluídas

**Colunas 7-8:**
- Concluídas em atraso: Badge vermelho
- Concluídas com multa: Badge roxo

**Coluna 9: Progresso**
- ProgressBar visual
- Porcentagem ao lado
- Cor baseada em threshold:
  - ≥90%: verde
  - 50-89%: laranja
  - <50%: vermelho

**Funcionalidade de Expansão:**

Ao clicar em uma linha, ela se expande mostrando todas as tarefas daquela empresa:

```
▼ 🏢 Empresa ABC Ltda    [dados da linha...]

  ┌────────────────────────────────────────┐
  │ ID-001  DCTF Ago/25     [Em Andamento] │
  │ ID-002  REINF Out/25    [Concluída]    │
  │ ID-003  ECF 2025        [Atrasada]     │
  └────────────────────────────────────────┘
```

**Especificações da expansão:**
- Background: `var(--input-background)`
- Cada tarefa:
  - ID da tarefa
  - Nome da tarefa
  - StatusBadge (componente)
- Click em tarefa → Navega com filtro: `navigateTarefas('lista', { status: tarefa.status, cliente: empresa.name })`

**Mock Data:**
```javascript
const empresas = [
  { 
    name: 'Empresa ABC Ltda', 
    total: 48, 
    abertas: 24, 
    abertasAtraso: 2,
    abertasMulta: 2,
    concluidas: 24,
    concluidasAtraso: 2,
    concluidasMulta: 2,
    progresso: 50
  },
  { 
    name: 'Comércio XYZ SA', 
    total: 36, 
    abertas: 6, 
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 30,
    concluidasAtraso: 1,
    concluidasMulta: 0,
    progresso: 83
  }
]

const mockEmpresaTasks = {
  'Empresa ABC Ltda': [
    { id: 'ID-001', nome: 'DCTF Ago/25', status: 'em_andamento' },
    { id: 'ID-002', nome: 'REINF Out/25', status: 'concluida' },
    { id: 'ID-003', nome: 'ECF 2025', status: 'atrasada' }
  ]
}
```

---

### 3.8 BLOCO 8: Tarefas

**Objetivo:** Visualizar todas as tarefas agrupadas por nome da tarefa.

**Estrutura da Tabela (10 colunas + expansível):**

| Tarefa | Tipo | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso |
|--------|------|-------|---------|------------------|------------------|------------|----------------------|----------------------|-----------|
| 📄 DCTF Ago/25 | Mensal | 48 | 46 | 4 | 2 | 2 | 2 | 2 | ████████░░ 83% |

**Especificações:**

**Coluna 1: Tarefa**
- ChevronRight (12px)
- FileText icon (11px) em círculo
- Nome da tarefa (truncado em 120px)

**Coluna 2: Tipo**
- Badge com fundo colorido e texto:
  - **Mensal:** 
    - Color: `var(--chart-2)` (azul)
    - Background: `rgba(21,115,211,0.08)`
  - **Anual:**
    - Color: `var(--chart-3)` (laranja)
    - Background: `rgba(254,166,1,0.08)`
  - **Esporádica:**
    - Color: `#8B5CF6` (roxo)
    - Background: `rgba(139,92,246,0.08)`

**Colunas 3-9:** Mesmas especificações da tabela de Empresas

**Coluna 10: Progresso**
- ProgressBar + porcentagem com cor dinâmica

**Funcionalidade de Expansão:**

Ao clicar, mostra todas as empresas que possuem essa tarefa:

```
▼ 📄 DCTF Ago/25    [Mensal]    [dados...]

  ┌────────────────────────────────────────┐
  │ 🏢 Empresa ABC      [Em Andamento]     │
  │ 🏢 Comércio XYZ     [Concluída]        │
  │ 🏢 Indústria 123    [Atrasada]         │
  └────────────────────────────────────────┘
```

**Especificações da expansão:**
- Building2 icon
- Nome da empresa
- StatusBadge
- Click → Navega com filtro: `navigateTarefas('lista', { status: emp.status, cliente: emp.empresa })`

**Mock Data:**
```javascript
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
  }
]

const mockTarefaEmpresas = {
  'DCTF Ago/25': [
    { empresa: 'Empresa ABC Ltda', status: 'em_andamento' },
    { empresa: 'Comércio XYZ SA', status: 'concluida' }
  ]
}
```

---

### 3.9 BLOCO 9: Drawers e Painéis

#### 3.9.1 TaskListDrawer

**Objetivo:** Exibir lista detalhada de tarefas filtradas.

**Contextos de abertura:**
- Click no card "Tarefas vencendo hoje"
- Ações rápidas

**Estrutura:**
- Drawer lateral direito (400px de largura)
- Título: "Tarefas Vencendo Hoje" (ou contexto)
- Tabs:
  - Todas (X)
  - Concluídas (X)
  - Em Andamento (X)
  - Atrasadas (X)
- Lista de tarefas:
  - Checkbox de seleção
  - Nome da tarefa
  - Cliente
  - Responsável
  - Data de vencimento
  - Status badge
  - Ações (...)

**Ações em lote:**
- Selecionar todas
- Marcar como concluída
- Atribuir responsável
- Exportar seleção

#### 3.9.2 FalhaEnvioDrawer

**Objetivo:** Exibir detalhes de falhas no envio de documentos.

**Tabs:**
1. **Portal (X falhas)**
   - Lista de clientes
   - Tipo de documento
   - Data da tentativa
   - Erro retornado
   - Botão "Reenviar"

2. **Email (X falhas)**
   - Cliente
   - Email de destino
   - Assunto
   - Data da tentativa
   - Erro SMTP
   - Botão "Reenviar"

3. **WhatsApp (X falhas)**
   - Cliente
   - Número de telefone
   - Data da tentativa
   - Erro da API
   - Botão "Reenviar"

#### 3.9.3 ConfigPendentesDrawer

**Objetivo:** Listar clientes com configurações incompletas.

**Categorias (tabs):**
1. **Inativos (X clientes)**
   - Lista de clientes marcados como inativos
   - Data de inativação
   - Botão "Reativar"

2. **Sem email (X clientes)**
   - Lista de clientes sem email cadastrado
   - Campo inline para adicionar email
   - Botão "Salvar"

3. **Sem certificado (X clientes)**
   - Clientes sem certificado digital válido
   - Data de vencimento (se houver)
   - Botão "Upload de certificado"

4. **Sem acesso ao portal (X clientes)**
   - Clientes sem credenciais de portal
   - Botão "Enviar convite"

#### 3.9.4 ListasDetalhadas Panel

**Objetivo:** Painel lateral com listas detalhadas e filtros avançados.

**Estrutura:**
- Painel lateral direito (500px)
- Título do contexto
- Filtros avançados:
  - Status
  - Responsável
  - Departamento
  - Cliente
  - Período
  - Tipo de tarefa
- Lista paginada
- Exportação para Excel/PDF

---

## 4. Design System

### 4.1 Cores (CSS Variables)

#### Cores Principais
```css
--background: #FFFFFF
--foreground: #0A0A0A
--card: #FFFFFF
--card-foreground: #0A0A0A
--primary: #18181B
--primary-foreground: #FAFAFA
--secondary: #F4F4F5
--secondary-foreground: #18181B
--muted: #F4F4F5
--muted-foreground: #71717A
--accent: #F4F4F5
--accent-foreground: #18181B
--destructive: #DC0A0A
--destructive-foreground: #FAFAFA
--border: #E4E4E7
--input: #E4E4E7
--input-background: #F9F9F9
--ring: #18181B
```

#### Cores de Status e Charts
```css
--chart-1: #10B981  /* Verde - Concluídas, OK */
--chart-2: #1573D3  /* Azul - Em andamento */
--chart-3: #FEA601  /* Laranja - Atenção */
--chart-4: #DC0A0A  /* Vermelho - Erro, Atraso */
--chart-5: #8B5CF6  /* Roxo - Multa */
```

#### Cores Específicas
```css
--multa-color: #6C3FB5        /* Roxo para badges de multa */
--multa-bg: rgba(108,63,181,0.1)
--atraso-bg: rgba(220,10,10,0.1)
```

### 4.2 Tipografia

#### Font Sizes
```css
--text-caption: 12px      /* Textos pequenos, legendas */
--text-body: 14px         /* Texto padrão */
--text-label: 16px        /* Labels, títulos de cards */
--text-title: 20px        /* Títulos de seções */
--text-heading: 24px      /* Headings principais */
```

#### Font Weights
```css
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

#### Font Family
```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### 4.3 Espaçamento

#### Spacing Scale
```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
```

### 4.4 Elevação (Shadows)

```css
--elevation-sm: 0 1px 2px 0 rgba(0,0,0,0.05)
--elevation-md: 0 4px 6px -1px rgba(0,0,0,0.1)
--elevation-lg: 0 10px 15px -3px rgba(0,0,0,0.1)
--elevation-xl: 0 20px 25px -5px rgba(0,0,0,0.1)
```

### 4.5 Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 9999px
```

---

## 5. Componentes Reutilizáveis

### 5.1 BadgeCount

**Objetivo:** Exibir contadores numéricos com fundo colorido.

**Props:**
```typescript
interface BadgeCountProps {
  value: number
  color: string      // Cor do texto
  bg: string         // Cor do background
}
```

**Uso:**
```tsx
<BadgeCount 
  value={12} 
  color="var(--chart-4)" 
  bg="rgba(220,10,10,0.1)" 
/>
```

**Estilo:**
- Padding: 4px 8px
- Border radius: 12px
- Font-size: `var(--text-caption)`
- Font-weight: semibold

### 5.2 StatusBadge

**Objetivo:** Exibir status de tarefas.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'em_andamento' | 'concluida' | 'atrasada' | 'aguardando_aprovacao'
}
```

**Mapeamento de cores:**
```typescript
const statusColors = {
  em_andamento: { bg: 'rgba(21,115,211,0.1)', text: '#1573D3' },
  concluida: { bg: 'rgba(16,185,129,0.1)', text: '#10B981' },
  atrasada: { bg: 'rgba(220,10,10,0.1)', text: '#DC0A0A' },
  aguardando_aprovacao: { bg: 'rgba(254,166,1,0.1)', text: '#FEA601' }
}
```

**Uso:**
```tsx
<StatusBadge status="concluida" />
// Renderiza: [Concluída] em verde
```

### 5.3 ProgressBar

**Objetivo:** Exibir barra de progresso visual.

**Props:**
```typescript
interface ProgressBarProps {
  pct: number        // 0-100
  color: string      // Cor da barra
}
```

**Uso:**
```tsx
<ProgressBar pct={75} color="var(--chart-1)" />
```

**Estrutura:**
```tsx
<div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--muted)' }}>
  <div style={{ 
    width: `${pct}%`, 
    height: '100%', 
    background: color, 
    borderRadius: '999px' 
  }} />
</div>
```

### 5.4 KpiCard

**Objetivo:** Card simples para KPIs numéricos (não usado na versão final, mas disponível).

**Props:**
```typescript
interface KpiCardProps {
  title: string
  value: number
  icon?: ReactNode
  color?: string
}
```

---

## 6. Comportamentos e Interações

### 6.1 Estados de Hover

- **Cards:** Sutil elevação (elevation-md)
- **Tabelas - Linhas:** Background `var(--muted)/20` + cursor pointer
- **Botões:** Background `var(--accent)` + leve escala (1.02)

### 6.2 Estados de Loading

- **Skeleton screens:** Animação de shimmer em cards e tabelas durante carregamento
- **Spinners:** Circular spinner nas ações que requerem API

### 6.3 Transições

```css
/* Padrão para hover e estados */
transition: all 0.2s ease-in-out

/* ChevronRight rotation */
transition: transform 0.2s ease-in-out

/* Drawer slide-in */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### 6.4 Animações

**Expansion de tabelas:**
- ChevronRight rotaciona 90° suavemente
- Conteúdo expandido faz slide-down com fade-in
- Height: auto (com max-height para animação)

**Abertura de drawers:**
- Slide-in da direita com overlay escuro no fundo
- Overlay: `rgba(0,0,0,0.5)` com fade-in

---

## 7. Funcionalidades e Regras de Negócio

### 7.1 Cálculos de Progresso

**Percentual de conclusão:**
```javascript
const pct = Math.round((concluidas / total) * 100)
```

**Cor do percentual:**
```javascript
const pctColor = pct >= 90 
  ? 'var(--chart-1)'   // Verde
  : pct >= 50 
    ? 'var(--chart-3)' // Laranja
    : 'var(--chart-4)' // Vermelho
```

### 7.2 Regras de Badge

**Mostrar badge ou dash:**
```javascript
const renderBadgeOrDash = (value: number, color: string, bg: string) => {
  return value > 0 ? (
    <BadgeCount value={value} color={color} bg={bg} />
  ) : (
    <span style={{ color: 'var(--muted-foreground)' }}>—</span>
  )
}
```

### 7.3 Navegação com Filtros

**Função de navegação:**
```typescript
const navigateTarefas = (tab: string, filters?: {
  status?: string
  cliente?: string
  responsavel?: string
  departamento?: string
}) => {
  // Navega para página de tarefas com filtros aplicados
  router.push(`/tarefas?tab=${tab}&${new URLSearchParams(filters)}`)
}
```

**Exemplos de uso:**
```typescript
// Click em empresa expandida
navigateTarefas('lista', { status: 'em_andamento', cliente: 'Empresa ABC' })

// Click em responsável
navigateTarefas('lista', { responsavel: 'Ana Silva' })

// Click em departamento
navigateTarefas('lista', { departamento: 'Fiscal' })
```

### 7.4 Estados de Tarefas

**Status possíveis:**
- `em_andamento`: Tarefa em execução
- `concluida`: Tarefa finalizada
- `atrasada`: Tarefa passou da data de vencimento
- `aguardando_aprovacao`: Tarefa aguardando revisão
- `gerando_multa`: Tarefa em atraso que gera multa

**Priorização de status:**
1. `gerando_multa` (mais crítico)
2. `atrasada`
3. `aguardando_aprovacao`
4. `em_andamento`
5. `concluida` (menos crítico)

### 7.5 Validações

**Ao atribuir responsável:**
- Usuário deve estar ativo
- Usuário deve ter permissão no departamento
- Não pode exceder limite de tarefas simultâneas (configurável)

**Ao marcar como concluída:**
- Todos os documentos obrigatórios devem estar anexados
- Aprovação prévia requerida para algumas categorias
- Campos obrigatórios preenchidos

---

## 8. Acessibilidade (A11Y)

### 8.1 ARIA Labels

```tsx
// Tabelas expansíveis
<tr aria-expanded={isExpanded} role="button" tabIndex={0}>
  
// Botões de ação
<button aria-label="Reenviar documento">

// Progress bars
<div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
```

### 8.2 Navegação por Teclado

- **Tab:** Navega entre elementos interativos
- **Enter/Space:** Ativa botões e expande linhas
- **Esc:** Fecha drawers e modais
- **Arrow keys:** Navega entre tabs

### 8.3 Contraste de Cores

Todas as combinações de texto/fundo atendem WCAG AA (4.5:1):
- Foreground sobre Background: 16.8:1 ✓
- Muted-foreground sobre Background: 4.6:1 ✓
- Chart colors sobre fundos claros: >4.5:1 ✓

### 8.4 Focus States

```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

---

## 9. Performance

### 9.1 Otimizações Implementadas

**Renderização:**
- React.memo em componentes de lista
- useMemo para cálculos de porcentagem
- useCallback para handlers de eventos
- Virtual scrolling em listas grandes (>100 itens)

**Dados:**
- Lazy loading de tabelas (renderizar apenas visível)
- Pagination server-side para listas grandes
- Cache de dados com React Query (5 minutos)
- Debounce em filtros de busca (300ms)

**Imagens e Assets:**
- SVG icons (lucide-react) em vez de font icons
- Sem imagens raster (apenas vetores)
- CSS-in-JS com emotion (zero-runtime)

### 9.2 Métricas Alvo

- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Total Bundle Size:** <500KB (gzipped)
- **API Response Time:** <200ms (P95)

---

## 10. Integrações de API

### 10.1 Endpoints

#### GET /api/dashboard/visao-geral
**Retorna:** Dados completos do dashboard

**Response:**
```json
{
  "vencendoHoje": {
    "total": 2800,
    "concluidas": 1452,
    "emAndamento": 1348,
    "percentualConcluido": 52
  },
  "alertas": {
    "falhaEnvio": {
      "total": 24,
      "portal": 10,
      "email": 8,
      "whatsapp": 6
    },
    "configPendentes": {
      "total": 45,
      "inativos": 12,
      "semEmail": 15,
      "semCertificado": 10,
      "semAcesso": 8
    }
  },
  "cardsMainsPrincipais": { ... },
  "desempenho": {
    "responsaveis": [ ... ],
    "departamentos": [ ... ]
  },
  "tarefasPorEmpresa": [ ... ],
  "tarefasAgrupadas": [ ... ]
}
```

#### GET /api/tarefas
**Params:** `?status=&cliente=&responsavel=&departamento=`

**Retorna:** Lista filtrada de tarefas

#### POST /api/tarefas/:id/concluir
**Body:** `{ documentos: [...], observacao: string }`

**Ação:** Marca tarefa como concluída

#### POST /api/documentos/reenviar
**Body:** `{ clienteId: string, tipo: 'portal' | 'email' | 'whatsapp' }`

**Ação:** Retenta envio de documento

### 10.2 WebSocket Events

**Real-time updates:**
```javascript
socket.on('tarefa:atualizada', (data) => {
  // Atualiza card ou linha da tabela específica
})

socket.on('tarefa:concluida', (data) => {
  // Move tarefa para "concluídas" com animação
})

socket.on('alerta:novo', (data) => {
  // Mostra notificação toast + atualiza contador de alertas
})
```

---

## 11. Estados de Erro

### 11.1 Erro de Carregamento

**Quando:** API retorna erro ou timeout

**UI:**
```
┌─────────────────────────────────┐
│    ⚠️                            │
│                                  │
│  Erro ao carregar dados          │
│  Tente novamente                 │
│                                  │
│  [Recarregar]                   │
└─────────────────────────────────┘
```

### 11.2 Sem Dados

**Quando:** Lista vazia

**UI:**
```
┌─────────────────────────────────┐
│    📋                            │
│                                  │
│  Nenhuma tarefa encontrada       │
│                                  │
│  [Criar Nova Tarefa]            │
└─────────────────────────────────┘
```

### 11.3 Permissão Negada

**Quando:** Usuário não tem acesso

**UI:**
```
┌─────────────────────────────────┐
│    🔒                            │
│                                  │
│  Acesso negado                   │
│  Você não tem permissão para     │
│  visualizar estes dados          │
│                                  │
│  [Voltar]                       │
└─────────────────────────────────┘
```

---

## 12. Testes

### 12.1 Testes Unitários

**Componentes:**
- BadgeCount rendering
- StatusBadge color mapping
- ProgressBar calculation
- Funções de cálculo de porcentagem

**Exemplo:**
```javascript
describe('BadgeCount', () => {
  it('should render with correct value', () => {
    render(<BadgeCount value={12} color="red" bg="rgba(220,10,10,0.1)" />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
```

### 12.2 Testes de Integração

**Fluxos completos:**
- Carregar dashboard → Verificar todos os blocos
- Expandir tabela → Verificar sub-itens
- Click em tarefa → Navegar com filtros
- Abrir drawer → Verificar conteúdo

### 12.3 Testes E2E

**Cenários críticos:**
```gherkin
Feature: Dashboard Visão Geral

Scenario: Expandir empresa e navegar para tarefa
  Given o usuário está na Visão Geral
  When clicar na empresa "Empresa ABC"
  Then deve exibir lista de tarefas da empresa
  When clicar na tarefa "DCTF Ago/25"
  Then deve navegar para lista de tarefas filtrada

Scenario: Marcar tarefas como concluídas
  Given o usuário abre o drawer "Vencendo Hoje"
  When selecionar 3 tarefas
  And clicar em "Marcar como concluída"
  Then as 3 tarefas devem ser marcadas
  And o contador deve atualizar
```

---

## 13. Segurança

### 13.1 Autenticação

- JWT token no header `Authorization: Bearer <token>`
- Refresh token armazenado em httpOnly cookie
- Expiração: 15 minutos (access) / 7 dias (refresh)

### 13.2 Autorização

**Níveis de permissão:**
- `admin`: Visualiza todos os dados, todas as ações
- `gestor`: Visualiza departamento, atribui tarefas
- `analista`: Visualiza apenas tarefas próprias
- `visualizador`: Apenas leitura

**Regras:**
- Filtros aplicados automaticamente no backend baseado em permissão
- Frontend esconde ações não permitidas
- API valida permissões em cada request

### 13.3 Sanitização

- Escape HTML em todos os textos de usuário
- Validação de inputs no frontend e backend
- Rate limiting: 100 requests/minuto por IP

---

## 14. Monitoramento

### 14.1 Métricas de Uso

**Tracked events:**
- `dashboard_viewed`: Usuário acessou dashboard
- `table_expanded`: Tabela expandida (qual tabela)
- `task_clicked`: Click em tarefa (origem)
- `drawer_opened`: Drawer aberto (tipo)
- `filter_applied`: Filtro aplicado (tipo, valor)

### 14.2 Error Tracking

**Sentry integration:**
- Capture de erros JavaScript
- Source maps para stack traces
- User context (id, email, role)
- Custom breadcrumbs para fluxo do usuário

### 14.3 Performance Monitoring

**Core Web Vitals:**
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Custom metrics:**
- Time to load dashboard data
- Time to render tables
- Time to open drawer

---

## 15. Documentação Técnica

### 15.1 Estrutura de Arquivos

```
src/
├── app/
│   └── components/
│       └── VisaoGeral.tsx         # Componente principal (1500+ linhas)
├── components/
│   ├── BadgeCount.tsx             # Badge numérico
│   ├── StatusBadge.tsx            # Badge de status
│   ├── ProgressBar.tsx            # Barra de progresso
│   └── drawers/
│       ├── TaskListDrawer.tsx
│       ├── FalhaEnvioDrawer.tsx
│       └── ConfigPendentesDrawer.tsx
├── imports/
│   ├── AlertBanner.tsx            # Componente de alerta
│   └── Web.tsx                    # Ícones e imports
└── styles/
    ├── tokens.ts                  # Design tokens
    └── theme.css                  # CSS variables
```

### 15.2 Tecnologias Utilizadas

- **React** 18.3.1
- **TypeScript** 5.x
- **Vite** 6.3.5 (build tool)
- **Lucide React** (ícones)
- **TailwindCSS** (utility-first CSS)
- **React Query** (data fetching)
- **Zustand** (state management)

### 15.3 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENABLE_MOCK=false
```

---

## 16. Roadmap e Melhorias Futuras

### 16.1 Curto Prazo (1-3 meses)

- [ ] Adicionar filtros avançados em todas as tabelas
- [ ] Exportação de dados para Excel/PDF
- [ ] Tema escuro (dark mode)
- [ ] Atalhos de teclado customizáveis
- [ ] Widget de busca global

### 16.2 Médio Prazo (3-6 meses)

- [ ] Dashboard personalizável (drag-and-drop de blocos)
- [ ] Gráficos interativos adicionais (ChartJS)
- [ ] Notificações push via PWA
- [ ] Modo offline com sincronização
- [ ] Comparação de períodos (mês a mês)

### 16.3 Longo Prazo (6-12 meses)

- [ ] IA para predição de atrasos
- [ ] Recomendações automáticas de priorização
- [ ] Integração com calendário externo
- [ ] Mobile app nativo (React Native)
- [ ] Voice commands (acessibilidade)

---

## 17. Glossário

- **Task (Tarefa):** Obrigação fiscal ou contábil a ser cumprida
- **Status:** Estado atual de uma tarefa (em andamento, concluída, atrasada, etc.)
- **Badge:** Componente visual de destaque (geralmente número em fundo colorido)
- **Drawer:** Painel lateral deslizante
- **Progress bar:** Barra visual de progresso/conclusão
- **Expansion:** Funcionalidade de expandir linha da tabela
- **Mock data:** Dados fictícios para desenvolvimento/demonstração
- **ChevronRight:** Ícone de seta para direita (indica expansão)
- **Threshold:** Limiar/limite para mudança de comportamento (ex: cor)

---

## 18. Contato e Suporte

**Equipe de Desenvolvimento:**
- Product Owner: [Nome]
- Tech Lead: [Nome]
- Developers: [Time]

**Documentação:**
- Wiki interna: [URL]
- Figma: [URL do design]
- Repositório: [GitHub URL]

**Suporte:**
- Email: suporte@empresa.com
- Slack: #canal-suporte
- Issues: GitHub Issues

---

**Última Atualização:** 08 de Abril de 2026  
**Versão do Documento:** 2.0  
**Status:** ✅ Implementado e em Produção
