import React, { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Plus, Search, Edit2, Trash2, Check, X,
  CheckSquare, Square, Layers, AlertTriangle, Info,
  Users, ClipboardList, ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgrupadorTarefa {
  id: string;
  nome: string;
  ultimaAtualizacao: string;
  ativo: boolean;
  padrao: boolean;
}

interface IdentificadorCliente {
  id: string;
  nome: string;
  ultimaAtualizacao: string;
  ativo: boolean;
  padrao: boolean;
}

interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  segmento: string;
}

interface Tarefa {
  id: string;
  nome: string;
  departamento: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_AGRUPADORES_BASE: AgrupadorTarefa[] = [
  { id: 'AG1', nome: 'Obrigações Mensais',    ultimaAtualizacao: '10/03/2026', ativo: true,  padrao: false },
  { id: 'AG2', nome: 'Obrigações Anuais',     ultimaAtualizacao: '05/03/2026', ativo: true,  padrao: false },
  { id: 'AG3', nome: 'Encargos Trabalhistas', ultimaAtualizacao: '01/03/2026', ativo: true,  padrao: false },
  { id: 'AG4', nome: 'Declarações Especiais', ultimaAtualizacao: '22/02/2026', ativo: false, padrao: false },
  { id: 'AG5', nome: 'CNAE',                  ultimaAtualizacao: '01/01/2024', ativo: false, padrao: true  },
  { id: 'AG6', nome: 'Regime Federal',        ultimaAtualizacao: '01/01/2024', ativo: false, padrao: true  },
];

const MOCK_IDENTIFICADORES_BASE: IdentificadorCliente[] = [
  { id: 'ID1', nome: 'Porte da Empresa',    ultimaAtualizacao: '08/03/2026', ativo: true,  padrao: false },
  { id: 'ID2', nome: 'Segmento de Atuação', ultimaAtualizacao: '04/03/2026', ativo: true,  padrao: false },
  { id: 'ID3', nome: 'Nível de Serviço',    ultimaAtualizacao: '28/02/2026', ativo: true,  padrao: false },
  { id: 'ID4', nome: 'Região',              ultimaAtualizacao: '15/02/2026', ativo: false, padrao: false },
  { id: 'ID5', nome: 'CNAE',                ultimaAtualizacao: '01/01/2024', ativo: false, padrao: true  },
  { id: 'ID6', nome: 'Regime Federal',      ultimaAtualizacao: '01/01/2024', ativo: false, padrao: true  },
];

const MOCK_CLIENTES: Cliente[] = [
  { id: 'C1',  nome: 'Empresa Alpha Ltda',        cnpj: '12.345.678/0001-90', segmento: 'Comércio'       },
  { id: 'C2',  nome: 'Comércio Beta S/A',          cnpj: '23.456.789/0001-01', segmento: 'Comércio'       },
  { id: 'C3',  nome: 'Serviços Gamma Ltda',        cnpj: '34.567.890/0001-12', segmento: 'Serviços'       },
  { id: 'C4',  nome: 'Indústria Delta S/A',        cnpj: '45.678.901/0001-23', segmento: 'Indústria'      },
  { id: 'C5',  nome: 'Construtora Epsilon Ltda',   cnpj: '56.789.012/0001-34', segmento: 'Construção'     },
  { id: 'C6',  nome: 'Transportes Zeta Ltda',      cnpj: '67.890.123/0001-45', segmento: 'Transporte'     },
  { id: 'C7',  nome: 'TI Eta Soluções S/A',        cnpj: '78.901.234/0001-56', segmento: 'Tecnologia'     },
  { id: 'C8',  nome: 'Agro Theta Ltda',            cnpj: '79.012.345/0001-67', segmento: 'Agronegócio'    },
  { id: 'C9',  nome: 'Saúde Iota Clínicas',        cnpj: '80.123.456/0001-78', segmento: 'Saúde'          },
  { id: 'C10', nome: 'Educação Kappa Inst.',        cnpj: '81.234.567/0001-89', segmento: 'Educação'       },
  { id: 'C11', nome: 'Finanças Lambda Ltda',        cnpj: '82.345.678/0001-90', segmento: 'Financeiro'     },
  { id: 'C12', nome: 'Alimentos Mu Indústria',      cnpj: '83.456.789/0001-01', segmento: 'Alimentos'      },
  { id: 'C13', nome: 'Exportações Nu S/A',          cnpj: '84.567.890/0001-12', segmento: 'Comércio Ext.'  },
  { id: 'C14', nome: 'Imobiliária Xi Ltda',         cnpj: '85.678.901/0001-23', segmento: 'Imóveis'        },
  { id: 'C15', nome: 'Consultoria Omicron S/A',     cnpj: '86.789.012/0001-34', segmento: 'Consultoria'    },
];

const MOCK_TAREFAS: Tarefa[] = [
  { id: 'T1',  nome: 'DCTF Mensal',            departamento: 'Fiscal'       },
  { id: 'T2',  nome: 'SPED Fiscal',             departamento: 'Fiscal'       },
  { id: 'T3',  nome: 'GFIP / SEFIP',            departamento: 'Trabalhista'  },
  { id: 'T4',  nome: 'RAIS',                    departamento: 'Trabalhista'  },
  { id: 'T5',  nome: 'DIRF',                    departamento: 'Contábil'     },
  { id: 'T6',  nome: 'DMED',                    departamento: 'Saúde'        },
  { id: 'T7',  nome: 'ECD',                     departamento: 'Contábil'     },
  { id: 'T8',  nome: 'ECF',                     departamento: 'Contábil'     },
  { id: 'T9',  nome: 'eSocial',                 departamento: 'Trabalhista'  },
  { id: 'T10', nome: 'Folha de Pagamento',       departamento: 'RH'           },
];

// Initial membership maps
const INIT_AG_CLIENTES: Record<string, string[]> = {
  AG1: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12'],
  AG2: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10'],
  AG3: ['C1','C2','C3','C4','C5','C6','C7','C8'],
  AG4: ['C1','C2','C3','C4'],
  AG5: [], AG6: [],
};
const INIT_AG_TAREFAS: Record<string, string[]> = {
  AG1: ['T1','T2','T3','T5','T9','T10'],
  AG2: ['T4','T5','T7','T8'],
  AG3: ['T3','T4','T9','T10','T6'],
  AG4: ['T5','T6','T7'],
  AG5: [], AG6: [],
};
const INIT_ID_CLIENTES: Record<string, string[]> = {
  ID1: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14','C15'],
  ID2: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14'],
  ID3: ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10'],
  ID4: ['C1','C2','C3','C4','C5','C6','C7'],
  ID5: [], ID6: [],
};

function initMap(raw: Record<string, string[]>): Record<string, Set<string>> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, new Set(v)]));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const thS: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', background: 'var(--input-background)',
  fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)',
};

function CB({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--border)' }} />}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <div className="relative rounded-full transition-colors"
        style={{ width: 32, height: 18, background: checked ? 'var(--chart-1)' : 'var(--border)' }}>
        <span className="absolute rounded-full bg-white transition-all"
          style={{ width: 12, height: 12, top: 3, left: checked ? 17 : 3, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>
    </button>
  );
}

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ─── Item Form ────────────────────────────────────────────────────────────────

function ItemForm({ type, initial, onSave, onCancel }: {
  type: 'agrupador' | 'identificador';
  initial?: { nome: string };
  onSave: (nome: string) => void;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [err, setErr] = useState('');

  function save() {
    if (!nome.trim()) { setErr('Informe o nome'); return; }
    onSave(nome.trim());
  }

  const label = type === 'agrupador' ? 'Agrupador de Tarefas' : 'Identificador de Clientes';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl flex flex-col" style={{ width: 'min(400px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            {initial ? `Editar ${label}` : `Novo ${label}`}
          </p>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer"
            style={{ border: 'none', background: 'none' }}>
            <X size={14} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {err && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.2)' }}>
              <AlertTriangle size={12} style={{ color: 'var(--chart-4)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>{err}</span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>NOME *</label>
            <input value={nome} onChange={e => setNome(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); }}
              placeholder={`Ex: ${type === 'agrupador' ? 'Obrigações Mensais' : 'Porte da Empresa'}`}
              className="px-3 py-2 rounded-lg outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
          </div>
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Cancelar
          </button>
          <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <Check size={13} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────

function ConfirmDelete({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ width: 'min(380px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
            <Trash2 size={18} style={{ color: 'var(--chart-4)' }} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Excluir {count} item{count > 1 ? 's' : ''}?
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--chart-4)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer de Gerenciamento de Membros ───────────────────────────────────────

type DrawerTab = 'clientes' | 'tarefas';

interface DrawerGerenciarProps {
  title: string;
  subtitle: string;
  showTarefasTab: boolean;
  initialClientes: Set<string>;
  initialTarefas?: Set<string>;
  onSave: (clientes: Set<string>, tarefas?: Set<string>) => void;
  onClose: () => void;
}

function DrawerGerenciar({
  title, subtitle, showTarefasTab,
  initialClientes, initialTarefas,
  onSave, onClose,
}: DrawerGerenciarProps) {
  const [tab, setTab] = useState<DrawerTab>('clientes');
  const [clienteSel, setClienteSel] = useState<Set<string>>(new Set(initialClientes));
  const [tarefaSel, setTarefaSel] = useState<Set<string>>(new Set(initialTarefas ?? []));
  const [searchCliente, setSearchCliente] = useState('');
  const [searchTarefa, setSearchTarefa] = useState('');

  const filteredClientes = useMemo(() => {
    const q = searchCliente.toLowerCase();
    return MOCK_CLIENTES.filter(c => !q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q) || c.segmento.toLowerCase().includes(q));
  }, [searchCliente]);

  const filteredTarefas = useMemo(() => {
    const q = searchTarefa.toLowerCase();
    return MOCK_TAREFAS.filter(t => !q || t.nome.toLowerCase().includes(q) || t.departamento.toLowerCase().includes(q));
  }, [searchTarefa]);

  const allClientesSel = filteredClientes.length > 0 && filteredClientes.every(c => clienteSel.has(c.id));
  const allTarefasSel = filteredTarefas.length > 0 && filteredTarefas.every(t => tarefaSel.has(t.id));

  function toggleCliente(id: string) {
    setClienteSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAllClientes() {
    if (allClientesSel) {
      setClienteSel(p => { const n = new Set(p); filteredClientes.forEach(c => n.delete(c.id)); return n; });
    } else {
      setClienteSel(p => { const n = new Set(p); filteredClientes.forEach(c => n.add(c.id)); return n; });
    }
  }
  function toggleTarefa(id: string) {
    setTarefaSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAllTarefas() {
    if (allTarefasSel) {
      setTarefaSel(p => { const n = new Set(p); filteredTarefas.forEach(t => n.delete(t.id)); return n; });
    } else {
      setTarefaSel(p => { const n = new Set(p); filteredTarefas.forEach(t => n.add(t.id)); return n; });
    }
  }

  function handleSave() {
    onSave(clienteSel, showTarefasTab ? tarefaSel : undefined);
  }

  const tabs: { key: DrawerTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'clientes', label: 'Clientes', icon: <Users size={13} />, count: clienteSel.size },
    ...(showTarefasTab ? [{ key: 'tarefas' as DrawerTab, label: 'Tarefas', icon: <ClipboardList size={13} />, count: tarefaSel.size }] : []),
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white"
        style={{
          width: 'min(520px, 100vw)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.18)',
          animation: 'slideInRight 0.22s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(214,64,0,0.08)' }}>
              <Layers size={14} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="min-w-0">
              <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title}
              </p>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-muted shrink-0 ml-3"
            style={{ border: 'none', background: 'none' }}>
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 px-5" style={{ borderBottom: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 h-10 px-4 cursor-pointer shrink-0"
              style={{
                background: 'none', border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -1,
                fontSize: 'var(--text-caption)',
                color: tab === t.key ? 'var(--primary)' : 'var(--muted-foreground)',
                fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              }}>
              {t.icon}
              {t.label}
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full"
                style={{
                  fontSize: '10px',
                  background: tab === t.key ? 'rgba(214,64,0,0.10)' : 'var(--muted)',
                  color: tab === t.key ? 'var(--primary)' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'clientes' && (
            <ClientesList
              clientes={filteredClientes}
              allClientes={MOCK_CLIENTES}
              selected={clienteSel}
              search={searchCliente}
              onSearch={setSearchCliente}
              allSel={allClientesSel}
              onToggleAll={toggleAllClientes}
              onToggle={toggleCliente}
              totalCount={clienteSel.size}
            />
          )}
          {tab === 'tarefas' && (
            <TarefasList
              tarefas={filteredTarefas}
              selected={tarefaSel}
              search={searchTarefa}
              onSearch={setSearchTarefa}
              allSel={allTarefasSel}
              onToggleAll={toggleAllTarefas}
              onToggle={toggleTarefa}
              totalCount={tarefaSel.size}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {clienteSel.size} cliente{clienteSel.size !== 1 ? 's' : ''}
            {showTarefasTab && ` · ${tarefaSel.size} tarefa${tarefaSel.size !== 1 ? 's' : ''}`}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg cursor-pointer"
              style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
              Cancelar
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
              style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
              <Check size={13} /> Salvar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ─── Clientes List (inside drawer) ───────────────────────────────────────────

interface ClientesListProps {
  clientes: Cliente[];
  allClientes: Cliente[];
  selected: Set<string>;
  search: string;
  onSearch: (v: string) => void;
  allSel: boolean;
  onToggleAll: () => void;
  onToggle: (id: string) => void;
  totalCount: number;
}

function ClientesList({ clientes, selected, search, onSearch, allSel, onToggleAll, onToggle, totalCount }: ClientesListProps) {
  // Separate selected from unselected for better UX
  const selectedItems = clientes.filter(c => selected.has(c.id));
  const unselectedItems = clientes.filter(c => !selected.has(c.id));

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search + select-all */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2 shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar cliente por nome, CNPJ ou segmento..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onToggleAll}>
            <CB checked={allSel} onChange={onToggleAll} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              Selecionar todos ({clientes.length} visíveis)
            </span>
          </div>
          {totalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full"
              style={{ fontSize: '10px', background: 'rgba(214,64,0,0.08)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
              {totalCount} incluído{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ minHeight: 0 }}>
        {clientes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Selected first */}
            {selectedItems.length > 0 && (
              <>
                <div className="px-1 py-1.5">
                  <span style={{ fontSize: '10px', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>INCLUÍDOS ({selectedItems.length})</span>
                </div>
                {selectedItems.map(c => (
                  <ClienteRow key={c.id} cliente={c} checked={true} onToggle={() => onToggle(c.id)} />
                ))}
                {unselectedItems.length > 0 && (
                  <div className="px-1 py-1.5 mt-1">
                    <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>DISPONÍVEIS ({unselectedItems.length})</span>
                  </div>
                )}
              </>
            )}
            {selectedItems.length === 0 && (
              <div className="px-1 py-1.5">
                <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>DISPONÍVEIS ({unselectedItems.length})</span>
              </div>
            )}
            {unselectedItems.map(c => (
              <ClienteRow key={c.id} cliente={c} checked={false} onToggle={() => onToggle(c.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClienteRow({ cliente, checked, onToggle }: { cliente: Cliente; checked: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
      style={{
        background: checked ? 'rgba(214,64,0,0.04)' : 'white',
        border: `1px solid ${checked ? 'rgba(214,64,0,0.15)' : 'var(--border)'}`,
      }}
    >
      <CB checked={checked} onChange={onToggle} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cliente.nome}
        </p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          {cliente.cnpj} · {cliente.segmento}
        </p>
      </div>
      {checked && (
        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(56,124,43,0.10)' }}>
          <Check size={10} style={{ color: 'var(--chart-1)' }} />
        </div>
      )}
    </div>
  );
}

// ─── Tarefas List (inside drawer) ────────────────────────────────────────────

interface TarefasListProps {
  tarefas: Tarefa[];
  selected: Set<string>;
  search: string;
  onSearch: (v: string) => void;
  allSel: boolean;
  onToggleAll: () => void;
  onToggle: (id: string) => void;
  totalCount: number;
}

function TarefasList({ tarefas, selected, search, onSearch, allSel, onToggleAll, onToggle, totalCount }: TarefasListProps) {
  const selectedItems = tarefas.filter(t => selected.has(t.id));
  const unselectedItems = tarefas.filter(t => !selected.has(t.id));

  // Group unselected by departamento
  const deptMap = useMemo(() => {
    const map: Record<string, Tarefa[]> = {};
    unselectedItems.forEach(t => {
      if (!map[t.departamento]) map[t.departamento] = [];
      map[t.departamento].push(t);
    });
    return map;
  }, [unselectedItems]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2 shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar tarefa por nome ou departamento..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onToggleAll}>
            <CB checked={allSel} onChange={onToggleAll} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              Selecionar todos ({tarefas.length} visíveis)
            </span>
          </div>
          {totalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full"
              style={{ fontSize: '10px', background: 'rgba(214,64,0,0.08)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
              {totalCount} incluída{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ minHeight: 0 }}>
        {tarefas.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {selectedItems.length > 0 && (
              <>
                <div className="px-1 py-1.5">
                  <span style={{ fontSize: '10px', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>INCLUÍDAS ({selectedItems.length})</span>
                </div>
                {selectedItems.map(t => (
                  <TarefaRow key={t.id} tarefa={t} checked={true} onToggle={() => onToggle(t.id)} />
                ))}
                {Object.keys(deptMap).length > 0 && (
                  <div className="px-1 py-1.5 mt-1">
                    <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>DISPONÍVEIS ({unselectedItems.length})</span>
                  </div>
                )}
              </>
            )}
            {selectedItems.length === 0 && Object.keys(deptMap).length > 0 && (
              <div className="px-1 py-1.5">
                <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>DISPONÍVEIS ({unselectedItems.length})</span>
              </div>
            )}
            {Object.entries(deptMap).map(([dept, tasks]) => (
              <div key={dept} className="flex flex-col gap-1">
                <div className="px-1 pt-1.5">
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}>{dept.toUpperCase()}</span>
                </div>
                {tasks.map(t => (
                  <TarefaRow key={t.id} tarefa={t} checked={false} onToggle={() => onToggle(t.id)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TarefaRow({ tarefa, checked, onToggle }: { tarefa: Tarefa; checked: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
      style={{
        background: checked ? 'rgba(214,64,0,0.04)' : 'white',
        border: `1px solid ${checked ? 'rgba(214,64,0,0.15)' : 'var(--border)'}`,
      }}
    >
      <CB checked={checked} onChange={onToggle} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
          {tarefa.nome}
        </p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          {tarefa.departamento}
        </p>
      </div>
      {checked && (
        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(56,124,43,0.10)' }}>
          <Check size={10} style={{ color: 'var(--chart-1)' }} />
        </div>
      )}
    </div>
  );
}

// ─── Aba Agrupadores de Tarefas ───────────────────────────────────────────────

function AbaAgrupadores() {
  const [list, setList] = useState<AgrupadorTarefa[]>(MOCK_AGRUPADORES_BASE);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AgrupadorTarefa | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);
  const [managing, setManaging] = useState<AgrupadorTarefa | null>(null);

  // Membership state
  const [agClientes, setAgClientes] = useState<Record<string, Set<string>>>(initMap(INIT_AG_CLIENTES));
  const [agTarefas, setAgTarefas] = useState<Record<string, Set<string>>>(initMap(INIT_AG_TAREFAS));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(a => !q || a.nome.toLowerCase().includes(q));
  }, [list, search]);

  const allSel = filtered.length > 0 && filtered.every(a => selected.has(a.id));
  function toggleA(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(a => a.id))); }

  function toggleAtivo(id: string) {
    setList(p => p.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
  }

  function saveForm(nome: string) {
    if (editing) {
      setList(p => p.map(a => a.id === editing.id ? { ...a, nome } : a));
      setEditing(null);
    } else {
      const newId = `AG${Date.now()}`;
      setList(p => [...p, { id: newId, nome, ultimaAtualizacao: todayStr(), ativo: true, padrao: false }]);
      setAgClientes(p => ({ ...p, [newId]: new Set() }));
      setAgTarefas(p => ({ ...p, [newId]: new Set() }));
      setShowForm(false);
    }
  }

  function doDelete(ids: string[]) {
    setList(p => p.filter(a => !ids.includes(a.id)));
    setSelected(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteConfirm(null);
  }

  function handleSaveMembros(clientes: Set<string>, tarefas?: Set<string>) {
    if (!managing) return;
    const id = managing.id;
    setAgClientes(p => ({ ...p, [id]: clientes }));
    if (tarefas !== undefined) setAgTarefas(p => ({ ...p, [id]: tarefas }));
    setList(p => p.map(a => a.id === id ? { ...a, ultimaAtualizacao: todayStr() } : a));
    setManaging(null);
  }

  const padroes = list.filter(a => a.padrao);

  return (
    <div className="flex flex-col gap-4">

      {/* Padrões info */}
      {padroes.length > 0 && (
        <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(254,166,1,0.3)', boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(254,166,1,0.06)', borderBottom: '1px solid rgba(254,166,1,0.2)' }}>
            <Info size={12} style={{ color: 'var(--chart-3)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)' }}>
              AGRUPADORES PADRÃO DO SISTEMA
            </span>
          </div>
          <div className="flex flex-wrap gap-3 px-4 py-3">
            {padroes.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ border: `1.5px solid ${p.ativo ? 'var(--chart-1)' : 'var(--border)'}`, background: p.ativo ? 'rgba(56,124,43,0.04)' : 'white' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{p.nome}</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                    {agClientes[p.id]?.size ?? 0} clientes · {agTarefas[p.id]?.size ?? 0} tarefas
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Toggle checked={p.ativo} onChange={() => toggleAtivo(p.id)} />
                  <span style={{ fontSize: 'var(--text-caption)', color: p.ativo ? 'var(--chart-1)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <button onClick={() => setManaging(p)}
                  className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  <Users size={11} /> Gerenciar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar agrupador..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        {selected.size > 0 && (
          <button onClick={() => setDeleteConfirm(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(220,10,10,0.07)', border: '1px solid rgba(220,10,10,0.2)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Trash2 size={11} /> Excluir {selected.size}
          </button>
        )}
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 ml-auto"
          style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <Plus size={12} /> Novo Agrupador
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, textAlign: 'center' }}>Clientes</th>
                <th style={{ ...thS, textAlign: 'center' }}>Tarefas</th>
                <th style={thS}>Última atualização</th>
                <th style={{ ...thS, textAlign: 'center' }}>Status</th>
                <th style={{ ...thS, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum agrupador encontrado</td></tr>
              ) : filtered.map(a => {
                const qtdCli = agClientes[a.id]?.size ?? 0;
                const qtdTar = agTarefas[a.id]?.size ?? 0;
                return (
                  <tr key={a.id} className="hover:bg-muted/20 transition-colors"
                    style={{ borderBottom: '1px solid var(--border)', background: selected.has(a.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                    <td className="pl-3 pr-2 py-3"><CB checked={selected.has(a.id)} onChange={() => toggleA(a.id)} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{a.nome}</span>
                        {a.padrao && (
                          <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '10px', background: 'rgba(254,166,1,0.10)', color: 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Padrão
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setManaging(a)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80"
                        style={{
                          background: qtdCli > 0 ? 'rgba(21,115,211,0.08)' : 'var(--muted)',
                          border: 'none',
                          fontSize: 'var(--text-caption)',
                          color: qtdCli > 0 ? 'var(--chart-2)' : 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}>
                        <Users size={10} />
                        {qtdCli}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setManaging(a)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80"
                        style={{
                          background: qtdTar > 0 ? 'rgba(56,124,43,0.08)' : 'var(--muted)',
                          border: 'none',
                          fontSize: 'var(--text-caption)',
                          color: qtdTar > 0 ? 'var(--chart-1)' : 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}>
                        <ClipboardList size={10} />
                        {qtdTar}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{a.ultimaAtualizacao}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Toggle checked={a.ativo} onChange={() => toggleAtivo(a.id)} />
                        <span style={{ fontSize: 'var(--text-caption)', color: a.ativo ? 'var(--chart-1)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {a.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setManaging(a)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-muted"
                          style={{ border: '1px solid var(--border)', background: 'none', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                          <Users size={11} /> Membros
                        </button>
                        {!a.padrao && (
                          <>
                            <button onClick={() => setEditing(a)}
                              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                              style={{ border: 'none', background: 'none' }}>
                              <Edit2 size={12} style={{ color: 'var(--chart-2)' }} />
                            </button>
                            <button onClick={() => setDeleteConfirm([a.id])}
                              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                              style={{ border: 'none', background: 'none' }}>
                              <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} agrupador{filtered.length !== 1 ? 'es' : ''}{selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {(showForm || editing) && (
        <ItemForm type="agrupador" initial={editing ? { nome: editing.nome } : undefined}
          onSave={saveForm} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
      {deleteConfirm && (
        <ConfirmDelete count={deleteConfirm.length} onConfirm={() => doDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
      )}
      {managing && (
        <DrawerGerenciar
          title={`Membros: ${managing.nome}`}
          subtitle="Gerencie clientes e tarefas deste agrupador"
          showTarefasTab={true}
          initialClientes={agClientes[managing.id] ?? new Set()}
          initialTarefas={agTarefas[managing.id] ?? new Set()}
          onSave={handleSaveMembros}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  );
}

// ─── Aba Identificadores de Clientes ─────────────────────────────────────────

function AbaIdentificadores() {
  const [list, setList] = useState<IdentificadorCliente[]>(MOCK_IDENTIFICADORES_BASE);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IdentificadorCliente | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);
  const [managing, setManaging] = useState<IdentificadorCliente | null>(null);

  // Membership state
  const [idClientes, setIdClientes] = useState<Record<string, Set<string>>>(initMap(INIT_ID_CLIENTES));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(i => !q || i.nome.toLowerCase().includes(q));
  }, [list, search]);

  const allSel = filtered.length > 0 && filtered.every(i => selected.has(i.id));
  function toggleI(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(i => i.id))); }

  function toggleAtivo(id: string) {
    setList(p => p.map(i => i.id === id ? { ...i, ativo: !i.ativo } : i));
  }

  function saveForm(nome: string) {
    if (editing) {
      setList(p => p.map(i => i.id === editing.id ? { ...i, nome } : i));
      setEditing(null);
    } else {
      const newId = `ID${Date.now()}`;
      setList(p => [...p, { id: newId, nome, ultimaAtualizacao: todayStr(), ativo: true, padrao: false }]);
      setIdClientes(p => ({ ...p, [newId]: new Set() }));
      setShowForm(false);
    }
  }

  function doDelete(ids: string[]) {
    setList(p => p.filter(i => !ids.includes(i.id)));
    setSelected(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteConfirm(null);
  }

  function handleSaveMembros(clientes: Set<string>) {
    if (!managing) return;
    const id = managing.id;
    setIdClientes(p => ({ ...p, [id]: clientes }));
    setList(p => p.map(i => i.id === id ? { ...i, ultimaAtualizacao: todayStr() } : i));
    setManaging(null);
  }

  const padroes = list.filter(i => i.padrao);

  return (
    <div className="flex flex-col gap-4">

      {/* Padrões */}
      {padroes.length > 0 && (
        <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid rgba(254,166,1,0.3)', boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(254,166,1,0.06)', borderBottom: '1px solid rgba(254,166,1,0.2)' }}>
            <Info size={12} style={{ color: 'var(--chart-3)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)' }}>
              IDENTIFICADORES PADRÃO DO SISTEMA
            </span>
          </div>
          <div className="flex flex-wrap gap-3 px-4 py-3">
            {padroes.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ border: `1.5px solid ${p.ativo ? 'var(--chart-1)' : 'var(--border)'}`, background: p.ativo ? 'rgba(56,124,43,0.04)' : 'white' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{p.nome}</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                    {idClientes[p.id]?.size ?? 0} clientes
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Toggle checked={p.ativo} onChange={() => toggleAtivo(p.id)} />
                  <span style={{ fontSize: 'var(--text-caption)', color: p.ativo ? 'var(--chart-1)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <button onClick={() => setManaging(p)}
                  className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  <Users size={11} /> Gerenciar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar identificador..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        {selected.size > 0 && (
          <button onClick={() => setDeleteConfirm(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(220,10,10,0.07)', border: '1px solid rgba(220,10,10,0.2)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Trash2 size={11} /> Excluir {selected.size}
          </button>
        )}
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 ml-auto"
          style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <Plus size={12} /> Novo Identificador
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, textAlign: 'center' }}>Clientes</th>
                <th style={thS}>Última atualização</th>
                <th style={{ ...thS, textAlign: 'center' }}>Status</th>
                <th style={{ ...thS, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum identificador encontrado</td></tr>
              ) : filtered.map(i => {
                const qtdCli = idClientes[i.id]?.size ?? 0;
                return (
                  <tr key={i.id} className="hover:bg-muted/20 transition-colors"
                    style={{ borderBottom: '1px solid var(--border)', background: selected.has(i.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                    <td className="pl-3 pr-2 py-3"><CB checked={selected.has(i.id)} onChange={() => toggleI(i.id)} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{i.nome}</span>
                        {i.padrao && (
                          <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '10px', background: 'rgba(254,166,1,0.10)', color: 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Padrão
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setManaging(i)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80"
                        style={{
                          background: qtdCli > 0 ? 'rgba(21,115,211,0.08)' : 'var(--muted)',
                          border: 'none',
                          fontSize: 'var(--text-caption)',
                          color: qtdCli > 0 ? 'var(--chart-2)' : 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}>
                        <Users size={10} />
                        {qtdCli}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{i.ultimaAtualizacao}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Toggle checked={i.ativo} onChange={() => toggleAtivo(i.id)} />
                        <span style={{ fontSize: 'var(--text-caption)', color: i.ativo ? 'var(--chart-1)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {i.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setManaging(i)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-muted"
                          style={{ border: '1px solid var(--border)', background: 'none', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                          <Users size={11} /> Membros
                        </button>
                        {!i.padrao && (
                          <>
                            <button onClick={() => setEditing(i)}
                              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                              style={{ border: 'none', background: 'none' }}>
                              <Edit2 size={12} style={{ color: 'var(--chart-2)' }} />
                            </button>
                            <button onClick={() => setDeleteConfirm([i.id])}
                              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                              style={{ border: 'none', background: 'none' }}>
                              <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} identificador{filtered.length !== 1 ? 'es' : ''}{selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {(showForm || editing) && (
        <ItemForm type="identificador" initial={editing ? { nome: editing.nome } : undefined}
          onSave={saveForm} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
      {deleteConfirm && (
        <ConfirmDelete count={deleteConfirm.length} onConfirm={() => doDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
      )}
      {managing && (
        <DrawerGerenciar
          title={`Clientes: ${managing.nome}`}
          subtitle="Gerencie os clientes deste identificador"
          showTarefasTab={false}
          initialClientes={idClientes[managing.id] ?? new Set()}
          onSave={handleSaveMembros}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AgrupadorTarefasClientes({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'agrupadores' | 'identificadores'>('agrupadores');

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 md:px-6 pt-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack}
          className="flex items-center gap-1.5 mb-3 cursor-pointer hover:opacity-75"
          style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(214,64,0,0.08)' }}>
            <Layers size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Agrupadores de Tarefas e Clientes
            </h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              Gerencie agrupadores de tarefas e identificadores de clientes
            </p>
          </div>
        </div>
        <div className="flex gap-0">
          {([['agrupadores','Agrupadores de Tarefas'],['identificadores','Identificadores de Clientes']] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className="h-9 px-5 cursor-pointer shrink-0"
              style={{ background: 'none', border: 'none', borderBottom: tab === k ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, fontSize: 'var(--text-label)', color: tab === k ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: tab === k ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-6" style={{ background: '#f9fafc' }}>
        {tab === 'agrupadores' ? <AbaAgrupadores /> : <AbaIdentificadores />}
      </div>
    </div>
  );
}
