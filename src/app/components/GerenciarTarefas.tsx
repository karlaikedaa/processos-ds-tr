import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Plus, ChevronDown, Info } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskTab = 'recorrentes' | 'esporadicas' | 'fluxo';

interface TarefaBase {
  id: string;
  nome: string;
  departamento: string;
  templates: string;
  notificarEmail: boolean;
  notificarWhatsapp: boolean;
}
interface TarefaRecorrente extends TarefaBase {
  frequencia: string;
  dataLegal: number;
  dataMeta: number;
  competencia: boolean;
  gerarMulta: boolean;
  ativo: boolean;
}
interface TarefaEsporadica extends TarefaBase {
  totalDias: number;
  diaUtil: boolean;
  permitirAdiar: boolean;
  ativo: boolean;
}
interface TarefaFluxo extends TarefaBase {
  qtdFluxos: number;
  fluxos: string;
  ativo: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DEPARTAMENTOS = ['Folha', 'Fiscal', 'Contabilidade', 'Administrativo', 'RH', 'Trabalhista'];
const FREQUENCIAS = ['Lucro presumido', 'Simples nacional', 'Entidade', 'MEI', 'Lucro real'];

function mkBase(i: number): TarefaBase {
  return {
    id: `T${i}`,
    nome: `Empresa ${i}`,
    departamento: DEPARTAMENTOS[(i - 1) % DEPARTAMENTOS.length],
    templates: ['134253636', '75723257', '8462425', '8442325364747', '5242537473', '7523253636', '9343942'][i - 1] ?? '123456',
    notificarEmail: true,
    notificarWhatsapp: true,
  };
}

const MOCK_RECORRENTES: TarefaRecorrente[] = Array.from({ length: 7 }, (_, i) => ({
  ...mkBase(i + 1),
  frequencia: FREQUENCIAS[i % FREQUENCIAS.length],
  dataLegal: [37, 10, 5, 63, 37, 37, 31][i],
  dataMeta: [2, 7, 1, 14, 9, 12, 1][i],
  competencia: true,
  gerarMulta: true,
  ativo: true,
}));

const MOCK_ESPORADICAS: TarefaEsporadica[] = Array.from({ length: 7 }, (_, i) => ({
  ...mkBase(i + 1),
  totalDias: [2, 7, 1, 14, 9, 12, 1][i],
  diaUtil: true,
  permitirAdiar: true,
  ativo: true,
}));

const MOCK_FLUXO: TarefaFluxo[] = Array.from({ length: 7 }, (_, i) => ({
  ...mkBase(i + 1),
  qtdFluxos: [2, 7, 1, 14, 9, 12, 1][i],
  fluxos: ['fluxo 1', 'fluxo 2', 'fluxo 3, fluxo 4', 'fluxo 3, fluxo 4', 'fluxo 3', 'fluxo 2', 'fluxo 2'][i],
  ativo: true,
}));

// ─── Shared ───────────────────────────────────────────────────────────────────

const thS: React.CSSProperties = {
  padding: '9px 12px', textAlign: 'left', background: 'white',
  fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)', userSelect: 'none',
};

function SortTh({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <th style={{ ...thS, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 32, height: 18, background: checked ? 'var(--chart-1)' : 'var(--muted)', borderRadius: 999, transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', width: 12, height: 12, background: 'white', borderRadius: '50%', top: 3, left: checked ? 17 : 3, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>
    </button>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ search, setSearch, integrado, setIntegrado }: { search: string; setSearch: (v: string) => void; integrado: boolean; setIntegrado: (v: boolean) => void }) {
  const [pasta, setPasta] = useState('');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 'min(280px, 100%)' }}>
        <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar pelo nome do modelo"
          style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }} />
      </div>
      <div style={{ position: 'relative', minWidth: 180 }}>
        <select value={pasta} onChange={e => setPasta(e.target.value)}
          style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: pasta ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
          <option value="">Pasta de destino em lote</option>
          <option value="Folha">Folha</option>
          <option value="Fiscal">Fiscal</option>
        </select>
        <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Toggle checked={integrado} onChange={() => setIntegrado(!integrado)} />
        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Integrado com Portal do Cliente</span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
        <Plus size={13} /> NOVA TAREFA
      </button>
    </div>
  );
}

// ─── Table: Tarefas Recorrentes ───────────────────────────────────────────────

function TableRecorrentes({ items, setItems }: { items: TarefaRecorrente[]; setItems: React.Dispatch<React.SetStateAction<TarefaRecorrente[]>> }) {
  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr>
              <SortTh label="Nome da tarefa" />
              <SortTh label="Departamento" />
              <SortTh label="Templates de documentos" />
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <SortTh label="Frequência" />
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Data<br />Legal <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Data<br />Meta <ChevronDown size={9} /></div>
              </th>
              <SortTh label="Competência" />
              <SortTh label="Gerar multa" />
              <SortTh label="Ativo" />
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>{t.nome}</span>
                </td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.departamento}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.templates}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarEmail ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarWhatsapp ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.frequencia}</span></td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.dataLegal}</span></td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.dataMeta}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.competencia ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px' }}>
                  <Toggle checked={t.gerarMulta} onChange={() => setItems(p => p.map(x => x.id === t.id ? { ...x, gerarMulta: !x.gerarMulta } : x))} />
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Toggle checked={t.ativo} onChange={() => setItems(p => p.map(x => x.id === t.id ? { ...x, ativo: !x.ativo } : x))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{items.length} tarefa{items.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

// ─── Table: Tarefas Esporádicas ───────────────────────────────────────────────

function TableEsporadicas({ items, setItems }: { items: TarefaEsporadica[]; setItems: React.Dispatch<React.SetStateAction<TarefaEsporadica[]>> }) {
  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              <SortTh label="Nome da tarefa" />
              <SortTh label="Departamento" />
              <SortTh label="Templates de documentos" />
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Total<br />em dias <ChevronDown size={9} /></div>
              </th>
              <SortTh label="Dia útil" />
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Permitir adiar<br />data meta <ChevronDown size={9} /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>{t.nome}</span>
                </td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.departamento}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.templates}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarEmail ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarWhatsapp ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.totalDias}</span></td>
                <td style={{ padding: '10px 12px' }}>
                  <Toggle checked={t.diaUtil} onChange={() => setItems(p => p.map(x => x.id === t.id ? { ...x, diaUtil: !x.diaUtil } : x))} />
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Toggle checked={t.permitirAdiar} onChange={() => setItems(p => p.map(x => x.id === t.id ? { ...x, permitirAdiar: !x.permitirAdiar } : x))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{items.length} tarefa{items.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

// ─── Table: Tarefas de Fluxo ──────────────────────────────────────────────────

function TableFluxo({ items }: { items: TarefaFluxo[] }) {
  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              <SortTh label="Nome da tarefa" />
              <SortTh label="Departamento" />
              <SortTh label="Templates de documentos" />
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Notificar<br />E-mail <ChevronDown size={9} /></div>
              </th>
              <th style={{ ...thS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Quantidade<br />de fluxos <ChevronDown size={9} /></div>
              </th>
              <SortTh label="Fluxos com a tarefa" />
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>{t.nome}</span>
                </td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.departamento}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.templates}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarEmail ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.notificarWhatsapp ? 'Sim' : 'Não'}</span></td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.qtdFluxos}</span></td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.fluxos}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{items.length} tarefa{items.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TASK_TABS: { key: TaskTab; label: string }[] = [
  { key: 'recorrentes', label: 'Tarefas recorrentes' },
  { key: 'esporadicas', label: 'Tarefas esporádicas' },
  { key: 'fluxo', label: 'Tarefas de fluxo' },
];

export function GerenciarTarefas({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TaskTab>('recorrentes');
  const [search, setSearch] = useState('');
  const [integrado, setIntegrado] = useState(true);
  const [recorrentes, setRecorrentes] = useState<TarefaRecorrente[]>(MOCK_RECORRENTES);
  const [esporadicas, setEsporadicas] = useState<TarefaEsporadica[]>(MOCK_ESPORADICAS);

  const filteredRec = useMemo(() => {
    const q = search.toLowerCase();
    return recorrentes.filter(t => !q || t.nome.toLowerCase().includes(q) || t.departamento.toLowerCase().includes(q));
  }, [recorrentes, search]);

  const filteredEsp = useMemo(() => {
    const q = search.toLowerCase();
    return esporadicas.filter(t => !q || t.nome.toLowerCase().includes(q) || t.departamento.toLowerCase().includes(q));
  }, [esporadicas, search]);

  const filteredFluxo = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_FLUXO.filter(t => !q || t.nome.toLowerCase().includes(q) || t.departamento.toLowerCase().includes(q));
  }, [search]);

  const countLabel = { recorrentes: `${recorrentes.length} Tarefas recorrentes`, esporadicas: `${esporadicas.length} Tarefas esporádicas`, fluxo: `${MOCK_FLUXO.length} Tarefas de fluxo` }[tab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: 'white', padding: '16px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InfoBanner text="xxxxxxxxxxx" />

        {/* Tab buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {TASK_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ border: 'none', background: tab === t.key ? 'var(--foreground)' : 'white', color: tab === t.key ? 'white' : 'var(--foreground)', fontSize: 'var(--text-label)', fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', padding: '7px 18px', borderRadius: 'var(--radius-button)', cursor: 'pointer', boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none', transition: 'background 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>100 Tarefas recorrentes</p>

        <Toolbar search={search} setSearch={setSearch} integrado={integrado} setIntegrado={setIntegrado} />

        {tab === 'recorrentes' && <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />}
        {tab === 'esporadicas' && <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />}
        {tab === 'fluxo' && <TableFluxo items={filteredFluxo} />}
      </div>
    </div>
  );
}
