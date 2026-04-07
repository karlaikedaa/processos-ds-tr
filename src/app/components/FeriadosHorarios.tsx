import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Plus, Search, Edit2, Trash2, Check, X, ChevronDown,
  Square, CheckSquare, Calendar, Clock, Users, Building2,
  RefreshCw, AlertTriangle, Info, ToggleLeft,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feriado {
  id: string;
  nome: string;
  data: string;        // DD/MM/YYYY or DD/MM for recurrent
  recorrente: boolean;
  origem: 'sistema' | 'usuario';
  criadoEm: string;
}

interface HorarioDia {
  ativo: boolean;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
}

interface HorarioFeriado {
  ativo: boolean;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
}

interface HorarioAcesso {
  id: string;
  nome: string;
  dias: Record<string, HorarioDia>;
  horarioFeriado: HorarioFeriado;
  funcionarios: string[];   // ids
  departamentos: string[];  // ids
  todos: boolean;
  criadoEm: string;
}

type AssignMode = 'todos' | 'departamento' | 'funcionario';

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DIAS_KEYS   = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

function defaultDia(active = true): HorarioDia {
  return { ativo: active, entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '18:00' };
}
function defaultHorarioFeriado(): HorarioFeriado {
  return { ativo: false, entrada1: '', saida1: '', entrada2: '', saida2: '' };
}
function defaultDias(): Record<string, HorarioDia> {
  const d: Record<string, HorarioDia> = {};
  DIAS_KEYS.forEach((k, i) => { d[k] = defaultDia(i < 5); });
  return d;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_FERIADOS: Feriado[] = [
  { id: 'H1', nome: 'Confraternização Universal', data: '01/01', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H2', nome: 'Carnaval',                   data: '12/02', recorrente: false, origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H3', nome: 'Sexta-feira Santa',           data: '18/04', recorrente: false, origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H4', nome: 'Tiradentes',                  data: '21/04', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H5', nome: 'Dia do Trabalho',             data: '01/05', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H6', nome: 'Corpus Christi',              data: '19/06', recorrente: false, origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H7', nome: 'Independência do Brasil',     data: '07/09', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H8', nome: 'N. Sra. Aparecida',           data: '12/10', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H9', nome: 'Finados',                     data: '02/11', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H10',nome: 'Proclamação da República',    data: '15/11', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H11',nome: 'Natal',                       data: '25/12', recorrente: true,  origem: 'sistema', criadoEm: '01/01/2024' },
  { id: 'H12',nome: 'Recesso de Final de Ano',     data: '26/12/2025', recorrente: false, origem: 'usuario', criadoEm: '10/11/2025' },
];

const MOCK_HORARIOS: HorarioAcesso[] = [
  {
    id: 'HA1', nome: 'Comercial Padrão',
    dias: defaultDias(),
    horarioFeriado: defaultHorarioFeriado(),
    funcionarios: ['F1','F2','F3','F4','F6'], departamentos: [], todos: false,
    criadoEm: '15/01/2025',
  },
  {
    id: 'HA2', nome: 'Horário Administrativo',
    dias: (() => { const d = defaultDias(); d['sab'].ativo = false; d['dom'].ativo = false; return d; })(),
    horarioFeriado: defaultHorarioFeriado(),
    funcionarios: ['F5'], departamentos: ['D5'], todos: false,
    criadoEm: '20/01/2025',
  },
];

const MOCK_FUNCS = [
  { id: 'F1', nome: 'Ana Torres' }, { id: 'F2', nome: 'Jorge Lopes' },
  { id: 'F3', nome: 'Carla Mendes' }, { id: 'F4', nome: 'Paulo Souza' },
  { id: 'F5', nome: 'Fernanda Lima' }, { id: 'F6', nome: 'Ricardo Castro' },
];
const MOCK_DEPTS = [
  { id: 'D1', nome: 'Contabilidade' }, { id: 'D2', nome: 'Fiscal' },
  { id: 'D3', nome: 'Trabalhista' },   { id: 'D4', nome: 'Financeiro' },
  { id: 'D5', nome: 'Administrativo' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <div className="relative rounded-full transition-colors shrink-0"
        style={{ width: 36, height: 20, background: checked ? 'var(--chart-1)' : 'var(--border)' }}>
        <span className="absolute rounded-full bg-white transition-all"
          style={{ width: 14, height: 14, top: 3, left: checked ? 19 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </button>
  );
}

function CB({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--border)' }} />}
    </div>
  );
}

const sectionHdr: React.CSSProperties = {
  fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--muted-foreground)', padding: '8px 14px',
  background: 'var(--input-background)', borderBottom: '1px solid var(--border)',
};

const thS: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', background: 'var(--input-background)',
  fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)',
};

// ─── Feriado Form ─────────────────────────────────────────────────────────────

function FeriadoForm({ initial, onSave, onCancel }: {
  initial?: Partial<Feriado>;
  onSave: (f: Omit<Feriado, 'id' | 'criadoEm' | 'origem'>) => void;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [data, setData] = useState(initial?.data ?? '');
  const [recorrente, setRecorrente] = useState(initial?.recorrente ?? false);
  const [err, setErr] = useState('');

  function save() {
    if (!nome.trim()) { setErr('Informe o nome do feriado'); return; }
    if (!data.trim()) { setErr('Informe a data'); return; }
    onSave({ nome: nome.trim(), data, recorrente });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl flex flex-col" style={{ width: 'min(420px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            {initial?.id ? 'Editar Feriado' : 'Novo Feriado'}
          </p>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer" style={{ border: 'none', background: 'none' }}>
            <X size={14} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {err && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.2)' }}>
              <AlertTriangle size={13} style={{ color: 'var(--chart-4)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>{err}</span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>NOME DO FERIADO *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Aniversário da Cidade"
              className="px-3 py-2 rounded-lg outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>DATA *</label>
              <input value={data} onChange={e => setData(e.target.value)} placeholder={recorrente ? 'DD/MM' : 'DD/MM/AAAA'}
                className="px-3 py-2 rounded-lg outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                {recorrente ? 'Formato DD/MM (sem ano)' : 'Formato DD/MM/AAAA'}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>RECORRENTE</label>
              <div className="flex items-center gap-2 pt-2">
                <Toggle checked={recorrente} onChange={() => setRecorrente(p => !p)} />
                <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{recorrente ? 'Sim' : 'Não'}</span>
              </div>
            </div>
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

// ─── Horário Form ─────────────────────────────────────────────────────────────

function HorarioForm({ initial, onSave, onCancel }: {
  initial?: HorarioAcesso;
  onSave: (h: Omit<HorarioAcesso, 'id' | 'criadoEm'>) => void;
  onCancel: () => void;
}) {
  const [nome, setNome]           = useState(initial?.nome ?? '');
  const [dias, setDias]           = useState<Record<string, HorarioDia>>(initial?.dias ?? defaultDias());
  const [feriado, setFeriado]     = useState<HorarioFeriado>(initial?.horarioFeriado ?? defaultHorarioFeriado());
  const [assignMode, setAssignMode] = useState<AssignMode>(initial?.todos ? 'todos' : initial?.departamentos.length ? 'departamento' : 'funcionario');
  const [selFuncs, setSelFuncs]   = useState<Set<string>>(new Set(initial?.funcionarios ?? []));
  const [selDepts, setSelDepts]   = useState<Set<string>>(new Set(initial?.departamentos ?? []));
  const [todos, setTodos]         = useState(initial?.todos ?? false);
  const [err, setErr]             = useState('');

  function updDia(key: string, field: keyof HorarioDia, val: string | boolean) {
    setDias(p => ({ ...p, [key]: { ...p[key], [field]: val } }));
  }
  function updFeriado(field: keyof HorarioFeriado, val: string | boolean) {
    setFeriado(p => ({ ...p, [field]: val }));
  }
  function toggleFunc(id: string) {
    setSelFuncs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleDept(id: string) {
    setSelDepts(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function save() {
    if (!nome.trim()) { setErr('Informe o nome do horário'); return; }
    onSave({
      nome: nome.trim(), dias, horarioFeriado: feriado,
      funcionarios: assignMode === 'funcionario' ? Array.from(selFuncs) : [],
      departamentos: assignMode === 'departamento' ? Array.from(selDepts) : [],
      todos: assignMode === 'todos',
    });
  }

  const inputT: React.CSSProperties = {
    border: '1px solid var(--border)', background: 'var(--input-background)',
    borderRadius: 'var(--radius-sm)', padding: '3px 6px',
    fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 72,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-auto" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl flex flex-col my-4" style={{ width: 'min(760px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            {initial ? 'Editar Horário' : 'Novo Horário de Acesso'}
          </p>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer" style={{ border: 'none', background: 'none' }}>
            <X size={14} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5 overflow-auto" style={{ maxHeight: '80vh', scrollbarWidth: 'thin' }}>
          {err && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.2)' }}>
              <AlertTriangle size={13} style={{ color: 'var(--chart-4)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>{err}</span>
            </div>
          )}

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>NOME DO HORÁRIO *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Comercial Padrão"
              className="px-3 py-2 rounded-lg outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
          </div>

          {/* Dias da semana */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div style={sectionHdr}>HORÁRIOS POR DIA DA SEMANA</div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ ...thS, width: 40 }}>Ativo</th>
                    <th style={{ ...thS, minWidth: 90 }}>Dia</th>
                    <th style={thS}>Entrada 1</th>
                    <th style={thS}>Saída 1</th>
                    <th style={thS}>Entrada 2</th>
                    <th style={thS}>Saída 2</th>
                  </tr>
                </thead>
                <tbody>
                  {DIAS_KEYS.map((key, idx) => {
                    const d = dias[key];
                    return (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border)', opacity: d.ativo ? 1 : 0.45 }}>
                        <td className="px-3 py-2.5 text-center">
                          <Toggle checked={d.ativo} onChange={() => updDia(key, 'ativo', !d.ativo)} />
                        </td>
                        <td className="px-3 py-2.5">
                          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                            {DIAS_SEMANA[idx]}
                          </span>
                        </td>
                        {(['entrada1','saida1','entrada2','saida2'] as const).map(f => (
                          <td key={f} className="px-2 py-2">
                            <input type="time" value={d[f] as string} disabled={!d.ativo}
                              onChange={e => updDia(key, f, e.target.value)} style={inputT} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Horário para feriados */}
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${feriado.ativo ? 'rgba(254,166,1,0.4)' : 'var(--border)'}` }}>
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ background: feriado.ativo ? 'rgba(254,166,1,0.06)' : 'var(--input-background)', borderBottom: feriado.ativo ? '1px solid rgba(254,166,1,0.3)' : '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <Calendar size={12} style={{ color: feriado.ativo ? 'var(--chart-3)' : 'var(--muted-foreground)' }} />
                <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: feriado.ativo ? 'var(--chart-3)' : 'var(--muted-foreground)' }}>
                  HORÁRIO ESPECIAL PARA FERIADOS
                </span>
              </div>
              <Toggle checked={feriado.ativo} onChange={() => updFeriado('ativo', !feriado.ativo)} />
            </div>
            {feriado.ativo && (
              <div className="px-4 py-3 flex flex-wrap gap-4 items-end">
                {([['entrada1','Entrada 1'],['saida1','Saída 1'],['entrada2','Entrada 2'],['saida2','Saída 2']] as [keyof HorarioFeriado, string][]).map(([f, lbl]) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{lbl}</label>
                    <input type="time" value={feriado[f] as string} onChange={e => updFeriado(f, e.target.value)} style={inputT} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atribuição */}
          <div className="flex flex-col gap-3">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>APLICAR PARA</label>
            <div className="flex gap-2 flex-wrap">
              {([['todos','Todos os funcionários ativos'],['departamento','Por departamento'],['funcionario','Por funcionário']] as [AssignMode, string][]).map(([mode, label]) => (
                <button key={mode} onClick={() => setAssignMode(mode)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                  style={{ border: `1.5px solid ${assignMode === mode ? 'var(--primary)' : 'var(--border)'}`, background: assignMode === mode ? 'rgba(214,64,0,0.05)' : 'white', fontSize: 'var(--text-label)', color: assignMode === mode ? 'var(--primary)' : 'var(--foreground)' }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: assignMode === mode ? 'var(--primary)' : 'var(--border)', background: assignMode === mode ? 'var(--primary)' : 'white' }}>
                    {assignMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {label}
                </button>
              ))}
            </div>

            {assignMode === 'departamento' && (
              <div className="flex flex-wrap gap-2">
                {MOCK_DEPTS.map(d => {
                  const sel = selDepts.has(d.id);
                  return (
                    <button key={d.id} onClick={() => toggleDept(d.id)}
                      className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg"
                      style={{ border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`, background: sel ? 'rgba(214,64,0,0.07)' : 'white', fontSize: 'var(--text-label)', color: sel ? 'var(--primary)' : 'var(--foreground)', fontWeight: sel ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
                      {sel && <Check size={10} />}{d.nome}
                    </button>
                  );
                })}
              </div>
            )}

            {assignMode === 'funcionario' && (
              <div className="flex flex-wrap gap-2">
                {MOCK_FUNCS.map(f => {
                  const sel = selFuncs.has(f.id);
                  return (
                    <button key={f.id} onClick={() => toggleFunc(f.id)}
                      className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg"
                      style={{ border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`, background: sel ? 'rgba(214,64,0,0.07)' : 'white', fontSize: 'var(--text-label)', color: sel ? 'var(--primary)' : 'var(--foreground)', fontWeight: sel ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
                      {sel && <Check size={10} />}{f.nome}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 flex justify-end gap-2 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onCancel} className="px-4 py-2 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Cancelar
          </button>
          <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <Check size={13} /> Salvar Horário
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Aba Feriados ─────────────────────────────────────────────────────────────

function AbaFeriados() {
  const [list, setList] = useState<Feriado[]>(MOCK_FERIADOS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Feriado | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(h => !q || h.nome.toLowerCase().includes(q) || h.data.includes(q));
  }, [list, search]);

  const allSel = filtered.length > 0 && filtered.every(h => selected.has(h.id));
  function toggleH(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(h => h.id))); }

  function saveForm(data: Omit<Feriado, 'id' | 'criadoEm' | 'origem'>) {
    if (editing) {
      setList(p => p.map(h => h.id === editing.id ? { ...h, ...data } : h));
      setEditing(null);
    } else {
      const today = new Date();
      setList(p => [...p, { ...data, id: `H${Date.now()}`, criadoEm: `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`, origem: 'usuario' }]);
      setShowForm(false);
    }
  }

  function doDelete(ids: string[]) {
    setList(p => p.filter(h => !ids.includes(h.id)));
    setSelected(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteConfirm(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar feriado..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        {selected.size > 0 && (
          <button onClick={() => setDeleteConfirm(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(220,10,10,0.07)', border: '1px solid rgba(220,10,10,0.2)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Trash2 size={11} /> Excluir {selected.size} selecionado{selected.size !== 1 ? 's' : ''}
          </button>
        )}
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 ml-auto"
          style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <Plus size={12} /> Novo Feriado
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 580 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                <th style={thS}>Nome</th>
                <th style={thS}>Data</th>
                <th style={thS}>Recorrente</th>
                <th style={thS}>Origem</th>
                <th style={thS}>Criado em</th>
                <th style={{ ...thS, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum feriado encontrado</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id} className="hover:bg-muted/20 transition-colors"
                  style={{ borderBottom: '1px solid var(--border)', background: selected.has(h.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                  <td className="pl-3 pr-2 py-3"><CB checked={selected.has(h.id)} onChange={() => toggleH(h.id)} /></td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{h.nome}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{h.data}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', background: h.recorrente ? 'rgba(21,115,211,0.08)' : 'var(--muted)', color: h.recorrente ? 'var(--chart-2)' : 'var(--muted-foreground)' }}>
                      {h.recorrente ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', background: h.origem === 'sistema' ? 'rgba(254,166,1,0.10)' : 'rgba(56,124,43,0.08)', color: h.origem === 'sistema' ? 'var(--chart-3)' : 'var(--chart-1)' }}>
                      {h.origem === 'sistema' ? 'Padrão' : 'Personalizado'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{h.criadoEm}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditing(h); setShowForm(false); }}
                        className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                        style={{ border: 'none', background: 'none' }}>
                        <Edit2 size={12} style={{ color: 'var(--chart-2)' }} />
                      </button>
                      <button onClick={() => setDeleteConfirm([h.id])}
                        className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                        style={{ border: 'none', background: 'none' }}>
                        <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{filtered.length} feriado{filtered.length !== 1 ? 's' : ''}{selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}</span>
        </div>
      </div>

      {/* Forms / Confirms */}
      {(showForm || editing) && (
        <FeriadoForm
          initial={editing ?? undefined}
          onSave={saveForm}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ width: 'min(380px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
                <Trash2 size={18} style={{ color: 'var(--chart-4)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Excluir feriado{deleteConfirm.length > 1 ? 's' : ''}?</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{deleteConfirm.length} item{deleteConfirm.length > 1 ? 's' : ''} será excluído permanentemente.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg cursor-pointer" style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Cancelar</button>
              <button onClick={() => doDelete(deleteConfirm)} className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90" style={{ background: 'var(--chart-4)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Aba Horários ─────────────────────────────────────────────────────────────

function AbaHorarios() {
  const [list, setList] = useState<HorarioAcesso[]>(MOCK_HORARIOS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HorarioAcesso | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(h => !q || h.nome.toLowerCase().includes(q));
  }, [list, search]);

  const allSel = filtered.length > 0 && filtered.every(h => selected.has(h.id));
  function toggleH(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(h => h.id))); }

  function saveForm(data: Omit<HorarioAcesso, 'id' | 'criadoEm'>) {
    if (editing) {
      setList(p => p.map(h => h.id === editing.id ? { ...h, ...data } : h));
      setEditing(null);
    } else {
      const today = new Date();
      setList(p => [...p, { ...data, id: `HA${Date.now()}`, criadoEm: `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}` }]);
      setShowForm(false);
    }
  }

  function doDelete(ids: string[]) {
    setList(p => p.filter(h => !ids.includes(h.id)));
    setSelected(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteConfirm(null);
  }

  function diasResumo(dias: Record<string, HorarioDia>) {
    const ativos = DIAS_KEYS.filter(k => dias[k].ativo);
    if (ativos.length === 7) return 'Todos os dias';
    if (ativos.length === 0) return 'Nenhum';
    const abrevs = { seg:'Seg',ter:'Ter',qua:'Qua',qui:'Qui',sex:'Sex',sab:'Sáb',dom:'Dom' };
    return ativos.map(k => abrevs[k as keyof typeof abrevs]).join(', ');
  }

  function horariosResumo(dias: Record<string, HorarioDia>) {
    const first = DIAS_KEYS.find(k => dias[k].ativo);
    if (!first) return '—';
    const d = dias[first];
    return `${d.entrada1}–${d.saida1} / ${d.entrada2}–${d.saida2}`;
  }

  function funcNomes(ids: string[]) {
    return ids.map(id => MOCK_FUNCS.find(f => f.id === id)?.nome).filter(Boolean).join(', ') || '—';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar horário..."
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
          <Plus size={12} /> Novo Horário
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 680 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                <th style={thS}>Nome</th>
                <th style={thS}>Dias da semana</th>
                <th style={thS}>Horários (1º dia ativo)</th>
                <th style={thS}>Funcionários / Dept.</th>
                <th style={thS}>Feriado espec.</th>
                <th style={thS}>Criado em</th>
                <th style={{ ...thS, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum horário cadastrado</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id} className="hover:bg-muted/20 transition-colors"
                  style={{ borderBottom: '1px solid var(--border)', background: selected.has(h.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                  <td className="pl-3 pr-2 py-3"><CB checked={selected.has(h.id)} onChange={() => toggleH(h.id)} /></td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{h.nome}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{diasResumo(h.dias)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{horariosResumo(h.dias)}</span>
                  </td>
                  <td className="px-3 py-3" style={{ maxWidth: 160 }}>
                    {h.todos ? (
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', background: 'rgba(56,124,43,0.08)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>Todos</span>
                    ) : (
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{funcNomes(h.funcionarios)}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {h.horarioFeriado.ativo
                      ? <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', background: 'rgba(254,166,1,0.10)', color: 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)' }}>Sim</span>
                      : <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{h.criadoEm}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditing(h); setShowForm(false); }}
                        className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                        style={{ border: 'none', background: 'none' }}>
                        <Edit2 size={12} style={{ color: 'var(--chart-2)' }} />
                      </button>
                      <button onClick={() => setDeleteConfirm([h.id])}
                        className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
                        style={{ border: 'none', background: 'none' }}>
                        <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{filtered.length} horário{filtered.length !== 1 ? 's' : ''}{selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}</span>
        </div>
      </div>

      {(showForm || editing) && (
        <HorarioForm initial={editing ?? undefined} onSave={saveForm} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ width: 'min(380px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
                <Trash2 size={18} style={{ color: 'var(--chart-4)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Excluir horário{deleteConfirm.length > 1 ? 's' : ''}?</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{deleteConfirm.length} item{deleteConfirm.length > 1 ? 's' : ''} será excluído permanentemente.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg cursor-pointer" style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Cancelar</button>
              <button onClick={() => doDelete(deleteConfirm)} className="px-4 py-2 rounded-lg cursor-pointer hover:opacity-90" style={{ background: 'var(--chart-4)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function FeriadosHorarios({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'feriados' | 'horarios'>('feriados');

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="bg-white px-4 md:px-6 pt-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack}
          className="flex items-center gap-1.5 mb-3 cursor-pointer hover:opacity-75"
          style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(214,64,0,0.08)' }}>
            <Calendar size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Feriados e Horários de Funcionamento
            </h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              Gerencie feriados e horários de acesso ao sistema
            </p>
          </div>
        </div>
        <div className="flex gap-0">
          {([['feriados','Feriados'],['horarios','Horário de Acesso']] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className="h-9 px-5 cursor-pointer shrink-0"
              style={{ background: 'none', border: 'none', borderBottom: tab === k ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, fontSize: 'var(--text-label)', color: tab === k ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: tab === k ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6" style={{ background: '#f9fafc' }}>
        {tab === 'feriados' ? <AbaFeriados /> : <AbaHorarios />}
      </div>
    </div>
  );
}
