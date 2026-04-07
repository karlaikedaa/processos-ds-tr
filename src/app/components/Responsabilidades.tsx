import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Check, X, ChevronDown, ChevronUp,
  Building2, Layers, Users, UserCheck, AlertCircle, Info,
  Plus, Trash2, CheckSquare, Square, Shield,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
}
interface Funcionario { id: string; nome: string; }
interface Departamento { id: string; nome: string; }
interface Tarefa { id: string; nome: string; }

interface DelegacaoDept {
  empresaId: string;
  departamentoId: string;
  responsavelId: string;
}

interface DelegacaoTarefa {
  empresaId: string;
  tarefaId: string;
  responsavelId: string;
  precisaAprovacao: boolean;
  aprovadoresIds: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EMPRESAS: Empresa[] = [
  { id: 'E1', nome: 'Empresa ABC Ltda',       cnpj: '12.345.678/0001-99' },
  { id: 'E2', nome: 'Natura Cosméticos S/A',  cnpj: '71.673.990/0001-77' },
  { id: 'E3', nome: 'Ambev S/A',              cnpj: '07.526.557/0001-00' },
  { id: 'E4', nome: 'DEF Comércio Ltda',      cnpj: '98.765.432/0001-11' },
  { id: 'E5', nome: 'GHI Serviços Ltda',      cnpj: '45.678.901/0001-22' },
  { id: 'E6', nome: 'Magazine Luiza S/A',     cnpj: '47.960.950/0001-21' },
  { id: 'E7', nome: 'JKL Indústria Ltda',     cnpj: '11.223.344/0001-55' },
  { id: 'E8', nome: 'Embraer S/A',            cnpj: '07.689.002/0001-89' },
];

const FUNCS: Funcionario[] = [
  { id: 'F1', nome: 'Ana Torres' }, { id: 'F2', nome: 'Jorge Lopes' },
  { id: 'F3', nome: 'Carla Mendes' }, { id: 'F4', nome: 'Paulo Souza' },
  { id: 'F5', nome: 'Fernanda Lima' }, { id: 'F6', nome: 'Ricardo Castro' },
];

const DEPTS: Departamento[] = [
  { id: 'D1', nome: 'Contabilidade' }, { id: 'D2', nome: 'Fiscal' },
  { id: 'D3', nome: 'Trabalhista' }, { id: 'D4', nome: 'Financeiro' },
  { id: 'D5', nome: 'Administrativo' },
];

const TAREFAS: Tarefa[] = [
  { id: 'T1', nome: 'Escrituração Fiscal Mensal' },
  { id: 'T2', nome: 'Balancete Mensal' },
  { id: 'T3', nome: 'ECF Anual' },
  { id: 'T4', nome: 'DCTF Mensal' },
  { id: 'T5', nome: 'SPED Fiscal Mensal' },
  { id: 'T6', nome: 'REINF Mensal' },
  { id: 'T7', nome: 'Folha de Pagamento' },
  { id: 'T8', nome: 'eSocial Mensal' },
  { id: 'T9', nome: 'Apuração IRPJ' },
  { id: 'T10',nome: 'SPED Contábil Anual' },
];

// Seed data
const seedDeptDeleg: DelegacaoDept[] = [
  { empresaId: 'E1', departamentoId: 'D1', responsavelId: 'F1' },
  { empresaId: 'E1', departamentoId: 'D2', responsavelId: 'F2' },
  { empresaId: 'E2', departamentoId: 'D1', responsavelId: 'F4' },
  { empresaId: 'E3', departamentoId: 'D2', responsavelId: 'F6' },
];

const seedTarefaDeleg: DelegacaoTarefa[] = [
  { empresaId: 'E1', tarefaId: 'T1', responsavelId: 'F1', precisaAprovacao: true, aprovadoresIds: ['F6'] },
  { empresaId: 'E1', tarefaId: 'T4', responsavelId: 'F2', precisaAprovacao: false, aprovadoresIds: [] },
  { empresaId: 'E2', tarefaId: 'T2', responsavelId: 'F4', precisaAprovacao: true, aprovadoresIds: ['F1', 'F6'] },
  { empresaId: 'E3', tarefaId: 'T5', responsavelId: 'F6', precisaAprovacao: false, aprovadoresIds: [] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nomeFunc(id: string) { return FUNCS.find(f => f.id === id)?.nome ?? '—'; }
function nomeDept(id: string) { return DEPTS.find(d => d.id === id)?.nome ?? '—'; }
function nomeTarefa(id: string) { return TAREFAS.find(t => t.id === id)?.nome ?? '—'; }

const thS: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', background: 'var(--input-background)',
  fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)',
};

// ─── Aba Delegar por Departamento ─────────────────────────────────────────────

function AbaDepartamento() {
  const [delegacoes, setDelegacoes] = useState<DelegacaoDept[]>(seedDeptDeleg);
  const [selectedDept, setSelectedDept] = useState<string>(DEPTS[0].id);
  const [searchEmpresa, setSearchEmpresa] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredEmpresas = useMemo(() => {
    const q = searchEmpresa.toLowerCase();
    return EMPRESAS.filter(e => !q || e.nome.toLowerCase().includes(q) || e.cnpj.includes(q));
  }, [searchEmpresa]);

  function getResp(empresaId: string): string {
    return delegacoes.find(d => d.empresaId === empresaId && d.departamentoId === selectedDept)?.responsavelId ?? '';
  }

  function setResp(empresaId: string, responsavelId: string) {
    setDelegacoes(prev => {
      const exists = prev.findIndex(d => d.empresaId === empresaId && d.departamentoId === selectedDept);
      if (exists >= 0) {
        if (!responsavelId) return prev.filter((_, i) => i !== exists);
        return prev.map((d, i) => i === exists ? { ...d, responsavelId } : d);
      }
      if (!responsavelId) return prev;
      return [...prev, { empresaId, departamentoId: selectedDept, responsavelId }];
    });
  }

  const allSel = filteredEmpresas.length > 0 && filteredEmpresas.every(e => selectedRows.has(e.id));
  function toggleRow(id: string) { setSelectedRows(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelectedRows(new Set()) : setSelectedRows(new Set(filteredEmpresas.map(e => e.id))); }

  function applyBatch(responsavelId: string) {
    if (!responsavelId) return;
    setDelegacoes(prev => {
      const next = [...prev];
      selectedRows.forEach(empresaId => {
        const idx = next.findIndex(d => d.empresaId === empresaId && d.departamentoId === selectedDept);
        if (idx >= 0) next[idx] = { ...next[idx], responsavelId };
        else next.push({ empresaId, departamentoId: selectedDept, responsavelId });
      });
      return next;
    });
    setSelectedRows(new Set());
  }

  const [batchResp, setBatchResp] = useState('');

  const delegadoCount = EMPRESAS.filter(e => getResp(e.id)).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Dept selector */}
      <div className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: 10 }}>SELECIONE O DEPARTAMENTO</p>
        <div className="flex flex-wrap gap-2">
          {DEPTS.map(d => (
            <button key={d.id} onClick={() => { setSelectedDept(d.id); setSelectedRows(new Set()); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
              style={{ border: `1.5px solid ${selectedDept === d.id ? 'var(--primary)' : 'var(--border)'}`, background: selectedDept === d.id ? 'rgba(214,64,0,0.07)' : 'white', fontSize: 'var(--text-label)', color: selectedDept === d.id ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: selectedDept === d.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {selectedDept === d.id && <Check size={10} />}
              {d.nome}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full" style={{ background: 'rgba(214,64,0,0.07)', border: '1px solid rgba(214,64,0,0.18)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
              {delegadoCount}/{EMPRESAS.length} empresas delegadas
            </span>
          </div>
        </div>
      </div>

      {/* Batch bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-wrap" style={{ background: 'var(--foreground)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            {selectedRows.size} empresa{selectedRows.size !== 1 ? 's' : ''} selecionada{selectedRows.size !== 1 ? 's' : ''}
          </span>
          <select value={batchResp} onChange={e => setBatchResp(e.target.value)}
            className="px-2 py-1.5 rounded-lg outline-none appearance-none cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', fontSize: 'var(--text-caption)', color: 'white' }}>
            <option value="">Atribuir responsável...</option>
            {FUNCS.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          <button onClick={() => applyBatch(batchResp)}
            disabled={!batchResp}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded cursor-pointer hover:opacity-80"
            style={{ background: batchResp ? 'rgba(21,115,211,0.85)' : 'rgba(255,255,255,0.15)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <Check size={10} /> Aplicar em lote
          </button>
          <button onClick={() => setSelectedRows(new Set())} className="ml-auto cursor-pointer" style={{ background: 'none', border: 'none', fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.55)' }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={searchEmpresa} onChange={e => setSearchEmpresa(e.target.value)} placeholder="Buscar empresa..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}>
                  <div onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {allSel ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} /> : <Square size={14} style={{ color: 'var(--border)' }} />}
                  </div>
                </th>
                <th style={thS}>Empresa</th>
                <th style={thS}>CNPJ</th>
                <th style={{ ...thS, minWidth: 200 }}>Responsável — {nomeDept(selectedDept)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map(e => {
                const resp = getResp(e.id);
                return (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors"
                    style={{ borderBottom: '1px solid var(--border)', background: selectedRows.has(e.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                    <td className="pl-3 pr-2 py-3">
                      <div onClick={() => toggleRow(e.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {selectedRows.has(e.id) ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} /> : <Square size={14} style={{ color: 'var(--border)' }} />}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{e.nome}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{e.cnpj}</span>
                    </td>
                    <td className="px-3 py-2">
                      <select value={resp} onChange={ev => setResp(e.id, ev.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg appearance-none outline-none cursor-pointer"
                        style={{ border: `1px solid ${resp ? 'var(--chart-1)' : 'var(--border)'}`, background: resp ? 'rgba(56,124,43,0.05)' : 'var(--input-background)', fontSize: 'var(--text-caption)', color: resp ? 'var(--foreground)' : 'var(--muted-foreground)', maxWidth: 240 }}>
                        <option value="">— Não atribuído —</option>
                        {FUNCS.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filteredEmpresas.length} empresa{filteredEmpresas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Aba Delegar por Tarefa ───────────────────────────────────────────────────

function AbaTarefa() {
  const [delegacoes, setDelegacoes] = useState<DelegacaoTarefa[]>(seedTarefaDeleg);
  const [selectedTarefa, setSelectedTarefa] = useState<string>(TAREFAS[0].id);
  const [searchEmpresa, setSearchEmpresa] = useState('');
  const [searchTarefa, setSearchTarefa] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [batchResp, setBatchResp] = useState('');
  const [expandAprov, setExpandAprov] = useState<Set<string>>(new Set());

  const filteredEmpresas = useMemo(() => {
    const q = searchEmpresa.toLowerCase();
    return EMPRESAS.filter(e => !q || e.nome.toLowerCase().includes(q));
  }, [searchEmpresa]);

  const filteredTarefas = useMemo(() => {
    const q = searchTarefa.toLowerCase();
    return TAREFAS.filter(t => !q || t.nome.toLowerCase().includes(q));
  }, [searchTarefa]);

  function getDeleg(empresaId: string): DelegacaoTarefa | undefined {
    return delegacoes.find(d => d.empresaId === empresaId && d.tarefaId === selectedTarefa);
  }

  function setResp(empresaId: string, responsavelId: string) {
    setDelegacoes(prev => {
      const idx = prev.findIndex(d => d.empresaId === empresaId && d.tarefaId === selectedTarefa);
      if (idx >= 0) {
        if (!responsavelId) return prev.filter((_, i) => i !== idx);
        return prev.map((d, i) => i === idx ? { ...d, responsavelId } : d);
      }
      if (!responsavelId) return prev;
      return [...prev, { empresaId, tarefaId: selectedTarefa, responsavelId, precisaAprovacao: false, aprovadoresIds: [] }];
    });
  }

  function toggleAprovacao(empresaId: string) {
    setDelegacoes(prev => prev.map(d =>
      d.empresaId === empresaId && d.tarefaId === selectedTarefa
        ? { ...d, precisaAprovacao: !d.precisaAprovacao, aprovadoresIds: d.precisaAprovacao ? [] : d.aprovadoresIds }
        : d
    ));
  }

  function toggleAprovador(empresaId: string, aprovId: string) {
    setDelegacoes(prev => prev.map(d => {
      if (d.empresaId !== empresaId || d.tarefaId !== selectedTarefa) return d;
      const ids = d.aprovadoresIds.includes(aprovId)
        ? d.aprovadoresIds.filter(x => x !== aprovId)
        : [...d.aprovadoresIds, aprovId];
      return { ...d, aprovadoresIds: ids };
    }));
  }

  function toggleExpandAprov(id: string) { setExpandAprov(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  const allSel = filteredEmpresas.length > 0 && filteredEmpresas.every(e => selectedRows.has(e.id));
  function toggleRow(id: string) { setSelectedRows(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelectedRows(new Set()) : setSelectedRows(new Set(filteredEmpresas.map(e => e.id))); }

  function applyBatch(responsavelId: string) {
    if (!responsavelId) return;
    setDelegacoes(prev => {
      const next = [...prev];
      selectedRows.forEach(empresaId => {
        const idx = next.findIndex(d => d.empresaId === empresaId && d.tarefaId === selectedTarefa);
        if (idx >= 0) next[idx] = { ...next[idx], responsavelId };
        else next.push({ empresaId, tarefaId: selectedTarefa, responsavelId, precisaAprovacao: false, aprovadoresIds: [] });
      });
      return next;
    });
    setSelectedRows(new Set());
  }

  const delegadoCount = EMPRESAS.filter(e => getDeleg(e.id)?.responsavelId).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Tarefa selector */}
      <div className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: 8 }}>SELECIONE A TAREFA</p>
        <div className="relative mb-3">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={searchTarefa} onChange={e => setSearchTarefa(e.target.value)} placeholder="Buscar tarefa..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', maxWidth: 300 }} />
        </div>
        <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {filteredTarefas.map(t => (
            <button key={t.id} onClick={() => { setSelectedTarefa(t.id); setSelectedRows(new Set()); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
              style={{ border: `1.5px solid ${selectedTarefa === t.id ? 'var(--primary)' : 'var(--border)'}`, background: selectedTarefa === t.id ? 'rgba(214,64,0,0.07)' : 'white', fontSize: 'var(--text-caption)', color: selectedTarefa === t.id ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: selectedTarefa === t.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {selectedTarefa === t.id && <Check size={10} />}
              {t.nome}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <span className="px-2.5 py-1 rounded-full" style={{ fontSize: 'var(--text-caption)', background: 'rgba(214,64,0,0.07)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)', border: '1px solid rgba(214,64,0,0.18)' }}>
            {delegadoCount}/{EMPRESAS.length} empresas delegadas
          </span>
        </div>
      </div>

      {/* Batch bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-wrap" style={{ background: 'var(--foreground)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            {selectedRows.size} empresa{selectedRows.size !== 1 ? 's' : ''} selecionada{selectedRows.size !== 1 ? 's' : ''}
          </span>
          <select value={batchResp} onChange={e => setBatchResp(e.target.value)}
            className="px-2 py-1.5 rounded-lg outline-none appearance-none cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', fontSize: 'var(--text-caption)', color: 'white' }}>
            <option value="">Atribuir responsável...</option>
            {FUNCS.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          <button onClick={() => applyBatch(batchResp)} disabled={!batchResp}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded cursor-pointer hover:opacity-80"
            style={{ background: batchResp ? 'rgba(21,115,211,0.85)' : 'rgba(255,255,255,0.15)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <Check size={10} /> Aplicar em lote
          </button>
          <button onClick={() => setSelectedRows(new Set())} className="ml-auto cursor-pointer" style={{ background: 'none', border: 'none', fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.55)' }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={searchEmpresa} onChange={e => setSearchEmpresa(e.target.value)} placeholder="Buscar empresa..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}>
                  <div onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {allSel ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} /> : <Square size={14} style={{ color: 'var(--border)' }} />}
                  </div>
                </th>
                <th style={thS}>Empresa</th>
                <th style={{ ...thS, minWidth: 180 }}>Responsável</th>
                <th style={{ ...thS, minWidth: 120 }}>Aprovação</th>
                <th style={{ ...thS, minWidth: 180 }}>Aprovadores</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map(e => {
                const deleg = getDeleg(e.id);
                const resp = deleg?.responsavelId ?? '';
                const aprova = deleg?.precisaAprovacao ?? false;
                const aprovList = deleg?.aprovadoresIds ?? [];
                const expAprov = expandAprov.has(e.id);
                return (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors"
                    style={{ borderBottom: '1px solid var(--border)', background: selectedRows.has(e.id) ? 'rgba(214,64,0,0.02)' : undefined }}>
                    <td className="pl-3 pr-2 py-3">
                      <div onClick={() => toggleRow(e.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {selectedRows.has(e.id) ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} /> : <Square size={14} style={{ color: 'var(--border)' }} />}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{e.nome}</span>
                    </td>
                    <td className="px-3 py-2">
                      <select value={resp} onChange={ev => setResp(e.id, ev.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg appearance-none outline-none cursor-pointer"
                        style={{ border: `1px solid ${resp ? 'var(--chart-1)' : 'var(--border)'}`, background: resp ? 'rgba(56,124,43,0.05)' : 'var(--input-background)', fontSize: 'var(--text-caption)', color: resp ? 'var(--foreground)' : 'var(--muted-foreground)', maxWidth: 200 }}>
                        <option value="">— Não atribuído —</option>
                        {FUNCS.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {resp ? (
                        <div className="flex items-center gap-2">
                          <div className="relative rounded-full transition-colors shrink-0 cursor-pointer"
                            onClick={() => toggleAprovacao(e.id)}
                            style={{ width: 32, height: 18, background: aprova ? 'var(--chart-1)' : 'var(--border)' }}>
                            <span className="absolute rounded-full bg-white transition-all"
                              style={{ width: 12, height: 12, top: 3, left: aprova ? 17 : 3, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{aprova ? 'Sim' : 'Não'}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {resp && aprova ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-1">
                            {aprovList.length === 0
                              ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Nenhum</span>
                              : aprovList.map(id => (
                                <span key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                  style={{ fontSize: 'var(--text-caption)', background: 'rgba(21,115,211,0.08)', color: 'var(--chart-2)', border: '1px solid rgba(21,115,211,0.2)' }}>
                                  {nomeFunc(id)}
                                  <button onClick={() => toggleAprovador(e.id, id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
                                    <X size={9} style={{ color: 'var(--chart-2)' }} />
                                  </button>
                                </span>
                              ))}
                            <button onClick={() => toggleExpandAprov(e.id)}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full cursor-pointer hover:opacity-80"
                              style={{ background: 'var(--muted)', border: 'none', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                              <Plus size={9} />
                            </button>
                          </div>
                          {expAprov && (
                            <div className="flex flex-wrap gap-1 mt-1 p-2 rounded-lg" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
                              {FUNCS.filter(f => f.id !== resp).map(f => {
                                const sel = aprovList.includes(f.id);
                                return (
                                  <button key={f.id} onClick={() => toggleAprovador(e.id, f.id)}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer"
                                    style={{ border: `1px solid ${sel ? 'var(--chart-2)' : 'var(--border)'}`, background: sel ? 'rgba(21,115,211,0.08)' : 'white', fontSize: 'var(--text-caption)', color: sel ? 'var(--chart-2)' : 'var(--foreground)' }}>
                                    {sel && <Check size={8} />}{f.nome}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filteredEmpresas.length} empresa{filteredEmpresas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function Responsabilidades({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'departamento' | 'tarefa'>('departamento');

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
            <UserCheck size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Responsabilidades
            </h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              Delegue responsáveis por departamento ou tarefa para cada empresa
            </p>
          </div>
        </div>
        <div className="flex gap-0">
          {([['departamento','Delegar por Departamento'],['tarefa','Delegar por Tarefa']] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className="h-9 px-5 cursor-pointer shrink-0"
              style={{ background: 'none', border: 'none', borderBottom: tab === k ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, fontSize: 'var(--text-label)', color: tab === k ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: tab === k ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-6" style={{ background: '#f9fafc' }}>
        {tab === 'departamento' ? <AbaDepartamento /> : <AbaTarefa />}
      </div>
    </div>
  );
}
