import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Plus, Search, Edit2, Trash2, Check, X, ChevronDown,
  Mail, Phone, Building2, DollarSign, Eye, CheckCircle2, AlertCircle,
  AlertTriangle, ArrowLeftRight, Clock, Copy, Shield,
  Square, CheckSquare, User, Layers,
  Settings, ListChecks, FileText, BarChart2, Activity,
  RefreshCw, ChevronRight, ChevronUp,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Permissao = 'administrador' | 'gerente' | 'operador';
type ErroEmail = 'bounce' | 'bloqueado';
type TipoTransferencia = 'temporaria' | 'permanente';
type TipoItem = 'tarefa' | 'departamento';

interface Departamento { id: string; nome: string; }

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  departamentos: string[];
  permissao: Permissao;
  custoPorHora: number;
  ativo: boolean;
  integradoDominio: boolean;
  apenasVisualizacao: boolean;
  tarefasVinculadas: boolean;
  errosEmail: ErroEmail[];
}

interface Responsabilidade {
  id: string;
  empresa: string;
  nomeItem: string;
  tipoItem: TipoItem;
}

interface Transferencia {
  id: string;
  deId: string;
  paraId: string;
  tipo: TipoTransferencia;
  inicio?: string;
  fim?: string;
  respIds: string[];
  tipoItem: TipoItem;
  incluirAbertas?: boolean;
}

interface MenuPermissao {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  funcs: { id: string; label: string; enabled: boolean }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initDepts: Departamento[] = [
  { id: 'D1', nome: 'Contabilidade' },
  { id: 'D2', nome: 'Fiscal' },
  { id: 'D3', nome: 'Trabalhista' },
  { id: 'D4', nome: 'Financeiro' },
  { id: 'D5', nome: 'Administrativo' },
];

const initFuncionarios: Funcionario[] = [
  { id: 'F1', nome: 'Ana Torres', email: 'ana.torres@escritorio.com.br', telefone: '(11) 99111-2233', departamentos: ['D1', 'D2'], permissao: 'administrador', custoPorHora: 120, ativo: true, integradoDominio: true, apenasVisualizacao: false, tarefasVinculadas: true, errosEmail: [] },
  { id: 'F2', nome: 'Jorge Lopes', email: 'jorge.lopes@escritorio.com.br', telefone: '(11) 99222-3344', departamentos: ['D2'], permissao: 'operador', custoPorHora: 75, ativo: true, integradoDominio: true, apenasVisualizacao: false, tarefasVinculadas: true, errosEmail: [] },
  { id: 'F3', nome: 'Carla Mendes', email: 'carla.mendes@escritorio.com.br', telefone: '(11) 99333-4455', departamentos: ['D3'], permissao: 'gerente', custoPorHora: 95, ativo: true, integradoDominio: false, apenasVisualizacao: false, tarefasVinculadas: true, errosEmail: ['bounce'] },
  { id: 'F4', nome: 'Paulo Souza', email: 'paulo.souza@escritorio.com.br', telefone: '(11) 99444-5566', departamentos: ['D1', 'D4'], permissao: 'operador', custoPorHora: 65, ativo: true, integradoDominio: true, apenasVisualizacao: false, tarefasVinculadas: false, errosEmail: [] },
  { id: 'F5', nome: 'Fernanda Lima', email: 'fernanda.lima@escritorio.com.br', telefone: '(11) 99555-6677', departamentos: ['D5'], permissao: 'operador', custoPorHora: 60, ativo: true, integradoDominio: false, apenasVisualizacao: true, tarefasVinculadas: false, errosEmail: ['bloqueado'] },
  { id: 'F6', nome: 'Ricardo Castro', email: 'ricardo.castro@escritorio.com.br', telefone: '(11) 99666-7788', departamentos: ['D2', 'D3'], permissao: 'gerente', custoPorHora: 110, ativo: true, integradoDominio: true, apenasVisualizacao: false, tarefasVinculadas: true, errosEmail: [] },
  { id: 'F7', nome: 'Beatriz Faria', email: 'beatriz.faria@escritorio.com.br', telefone: '(11) 99777-8899', departamentos: ['D1'], permissao: 'operador', custoPorHora: 55, ativo: false, integradoDominio: false, apenasVisualizacao: false, tarefasVinculadas: false, errosEmail: [] },
  { id: 'F8', nome: 'Marcos Vieira', email: 'marcos.vieira@escritorio.com.br', telefone: '(11) 99888-9900', departamentos: ['D4'], permissao: 'operador', custoPorHora: 70, ativo: false, integradoDominio: false, apenasVisualizacao: false, tarefasVinculadas: false, errosEmail: ['bounce'] },
];

const mockResponsabilidades: Record<string, Responsabilidade[]> = {
  'F1': [
    { id: 'R1', empresa: 'Empresa ABC Ltda', nomeItem: 'Escrituração Fiscal Mensal', tipoItem: 'tarefa' },
    { id: 'R2', empresa: 'Natura Cosméticos S/A', nomeItem: 'Balancete Mensal', tipoItem: 'tarefa' },
    { id: 'R3', empresa: 'Ambev S/A', nomeItem: 'ECF Anual', tipoItem: 'tarefa' },
    { id: 'R4', empresa: 'DEF Comércio Ltda', nomeItem: 'Contabilidade', tipoItem: 'departamento' },
    { id: 'R5', empresa: 'GHI Serviços Ltda', nomeItem: 'Fiscal', tipoItem: 'departamento' },
  ],
  'F2': [
    { id: 'R6', empresa: 'Empresa ABC Ltda', nomeItem: 'DCTF Mensal', tipoItem: 'tarefa' },
    { id: 'R7', empresa: 'Ambev S/A', nomeItem: 'SPED Fiscal Mensal', tipoItem: 'tarefa' },
    { id: 'R8', empresa: 'Magazine Luiza S/A', nomeItem: 'Fiscal', tipoItem: 'departamento' },
    { id: 'R9', empresa: 'JKL Indústria Ltda', nomeItem: 'REINF Mensal', tipoItem: 'tarefa' },
  ],
  'F3': [
    { id: 'R10', empresa: 'Empresa ABC Ltda', nomeItem: 'Folha de Pagamento', tipoItem: 'tarefa' },
    { id: 'R11', empresa: 'Natura Cosméticos S/A', nomeItem: 'eSocial Mensal', tipoItem: 'tarefa' },
    { id: 'R12', empresa: 'GHI Serviços Ltda', nomeItem: 'Trabalhista', tipoItem: 'departamento' },
  ],
  'F4': [
    { id: 'R13', empresa: 'DEF Comércio Ltda', nomeItem: 'Balancete Mensal', tipoItem: 'tarefa' },
    { id: 'R14', empresa: 'Embraer S/A', nomeItem: 'Contabilidade', tipoItem: 'departamento' },
  ],
  'F6': [
    { id: 'R15', empresa: 'Natura Cosméticos S/A', nomeItem: 'Apuração IRPJ', tipoItem: 'tarefa' },
    { id: 'R16', empresa: 'Magazine Luiza S/A', nomeItem: 'SPED Contábil Anual', tipoItem: 'tarefa' },
    { id: 'R17', empresa: 'Ambev S/A', nomeItem: 'Fiscal', tipoItem: 'departamento' },
    { id: 'R18', empresa: 'JKL Indústria Ltda', nomeItem: 'Trabalhista', tipoItem: 'departamento' },
  ],
};

// F1 transferred R1 temporarily to F2
const initTransferencias: Transferencia[] = [
  { id: 'TR1', deId: 'F1', paraId: 'F2', tipo: 'temporaria', inicio: '01/03/2026', fim: '31/03/2026', respIds: ['R1'], tipoItem: 'tarefa', incluirAbertas: true },
];

const defaultMenuPermissoes = (): MenuPermissao[] => [
  { id: 'visao-geral', label: 'Visão Geral', icon: <BarChart2 size={13} />, enabled: true, funcs: [
    { id: 'ver-dashboard', label: 'Ver Dashboard', enabled: true },
    { id: 'ver-metricas', label: 'Ver Métricas', enabled: true },
    { id: 'exportar', label: 'Exportar dados', enabled: false },
  ]},
  { id: 'tarefas', label: 'Tarefas', icon: <ListChecks size={13} />, enabled: true, funcs: [
    { id: 'criar', label: 'Criar Tarefa', enabled: true },
    { id: 'editar', label: 'Editar Tarefa', enabled: true },
    { id: 'excluir', label: 'Excluir Tarefa', enabled: false },
    { id: 'ver-todas', label: 'Ver todas as tarefas', enabled: false },
    { id: 'alterar-responsavel', label: 'Alterar responsável', enabled: true },
  ]},
  { id: 'documentos-express', label: 'Documentos Express', icon: <FileText size={13} />, enabled: true, funcs: [
    { id: 'upload', label: 'Upload de documentos', enabled: true },
    { id: 'excluir-doc', label: 'Excluir documentos', enabled: false },
    { id: 'download-pasta', label: 'Download da pasta Express', enabled: true },
  ]},
  { id: 'relatorios', label: 'Relatórios', icon: <Activity size={13} />, enabled: true, funcs: [
    { id: 'ver-relatorios', label: 'Ver relatórios', enabled: true },
    { id: 'exportar-pdf', label: 'Exportar PDF', enabled: false },
  ]},
  { id: 'auditoria', label: 'Auditoria', icon: <Shield size={13} />, enabled: false, funcs: [
    { id: 'ver-auditoria', label: 'Ver log de auditoria', enabled: false },
    { id: 'exportar-auditoria', label: 'Exportar auditoria', enabled: false },
  ]},
  { id: 'circular', label: 'Circular', icon: <Mail size={13} />, enabled: true, funcs: [
    { id: 'criar-circular', label: 'Criar Circular', enabled: false },
    { id: 'enviar-circular', label: 'Enviar Circular', enabled: false },
    { id: 'excluir-circular', label: 'Excluir Circular', enabled: false },
  ]},
  { id: 'status-integracao', label: 'Status de Integração', icon: <RefreshCw size={13} />, enabled: false, funcs: [
    { id: 'ver-status', label: 'Ver Status', enabled: false },
  ]},
  { id: 'configuracoes', label: 'Configurações', icon: <Settings size={13} />, enabled: false, funcs: [
    { id: 'funcionarios', label: 'Funcionários do Escritório', enabled: false },
    { id: 'empresas', label: 'Empresas', enabled: false },
    { id: 'tarefas-conf', label: 'Gerenciar Tarefas', enabled: false },
  ]},
];

const mockMenuPermissoes: Record<string, MenuPermissao[]> = {
  'F1': defaultMenuPermissoes().map(m => ({ ...m, enabled: true, funcs: m.funcs.map(f => ({ ...f, enabled: true })) })),
  'F2': defaultMenuPermissoes(),
  'F3': defaultMenuPermissoes(),
  'F4': defaultMenuPermissoes(),
  'F5': defaultMenuPermissoes().map(m => ({ ...m, funcs: m.funcs.map(f => ({ ...f, enabled: m.id === 'tarefas' ? f.enabled : false })) })),
  'F6': defaultMenuPermissoes().map(m => ({ ...m, enabled: ['visao-geral','tarefas','documentos-express','relatorios'].includes(m.id), funcs: m.funcs.map(f => ({ ...f, enabled: true })) })),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPermissaoColor(p: Permissao) {
  if (p === 'administrador') return { bg: 'rgba(214,64,0,0.10)', color: 'var(--primary)' };
  if (p === 'gerente') return { bg: 'rgba(21,115,211,0.10)', color: 'var(--chart-2)' };
  return { bg: 'rgba(153,153,153,0.10)', color: 'var(--muted-foreground)' };
}

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onChange}
      className="relative inline-flex items-center rounded-full transition-colors shrink-0"
      style={{ width: 36, height: 20, background: checked ? 'var(--chart-1)' : 'var(--border)', border: 'none', padding: 0, opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <span className="absolute rounded-full bg-white transition-all"
        style={{ width: 14, height: 14, top: 3, left: checked ? 19 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function CB({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--border)' }} />}
    </button>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ nome, size = 32 }: { nome: string; size?: number }) {
  const colors = ['var(--primary)', 'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];
  const idx = nome.charCodeAt(0) % colors.length;
  return (
    <div className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: colors[idx], color: 'white', fontSize: size * 0.35, fontWeight: 'var(--font-weight-semibold)' }}>
      {initials(nome)}
    </div>
  );
}

// ─── Inline Dept Manager ─────────────────────────────────────────────────────

function InlineDeptManager({ depts, onChange }: {
  depts: Departamento[];
  onChange: (depts: Departamento[]) => void;
}) {
  const [list, setList] = useState(depts);
  const [newNome, setNewNome] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');

  // Keep in sync if parent changes
  React.useEffect(() => { setList(depts); }, [depts]);

  function commit(next: Departamento[]) { setList(next); onChange(next); }
  function add() {
    if (!newNome.trim()) return;
    commit([...list, { id: `D${Date.now()}`, nome: newNome.trim() }]);
    setNewNome('');
  }
  function startEdit(d: Departamento) { setEditingId(d.id); setEditNome(d.nome); }
  function saveEdit() {
    if (!editNome.trim()) return;
    commit(list.map(d => d.id === editingId ? { ...d, nome: editNome.trim() } : d));
    setEditingId(null);
  }
  function remove(id: string) { commit(list.filter(d => d.id !== id)); }

  return (
    <div className="flex flex-col gap-3">
      {/* Existing deps */}
      <div className="flex flex-wrap gap-2">
        {list.map(d => (
          <div key={d.id} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full"
            style={{ border: '1.5px solid var(--border)', background: 'var(--input-background)' }}>
            {editingId === d.id ? (
              <>
                <input autoFocus value={editNome}
                  onChange={e => setEditNome(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }}
                  className="outline-none"
                  style={{ border: 'none', background: 'none', fontSize: 'var(--text-caption)', color: 'var(--foreground)', width: Math.max(editNome.length * 8, 80) + 'px' }} />
                <button onClick={saveEdit}
                  className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer"
                  style={{ background: 'var(--chart-1)', border: 'none' }}>
                  <Check size={9} style={{ color: 'white' }} />
                </button>
                <button onClick={() => setEditingId(null)}
                  className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted">
                  <X size={9} style={{ color: 'var(--muted-foreground)' }} />
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{d.nome}</span>
                <button onClick={() => startEdit(d)}
                  className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted">
                  <Edit2 size={9} style={{ color: 'var(--chart-2)' }} />
                </button>
                <button onClick={() => remove(d.id)}
                  className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted">
                  <Trash2 size={9} style={{ color: 'var(--chart-4)' }} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Add new */}
      <div className="flex items-center gap-2">
        <input value={newNome} onChange={e => setNewNome(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add(); }}
          placeholder="Nome do novo departamento..."
          className="flex-1 px-3 py-1.5 rounded-lg outline-none"
          style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', maxWidth: '260px' }} />
        <button onClick={add}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90"
          style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
          <Plus size={11} /> Adicionar
        </button>
      </div>
    </div>
  );
}

// ─── Transfer Drawer ──────────────────────────────────────────────────────────

function TransferDrawer({ funcionario, funcionarios, selectedRespIds, tipoItem, responsabilidades, onClose, onConfirm }: {
  funcionario: Funcionario;
  funcionarios: Funcionario[];
  selectedRespIds: string[];
  tipoItem: TipoItem;
  responsabilidades: Responsabilidade[];
  onClose: () => void;
  onConfirm: (t: Omit<Transferencia, 'id'>) => void;
}) {
  const [paraId, setParaId] = useState('');
  const [tipo, setTipo] = useState<TipoTransferencia>('temporaria');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [incluirAbertas, setIncluirAbertas] = useState(true);
  const [error, setError] = useState('');

  const destinos = funcionarios.filter(f => f.id !== funcionario.id && f.ativo);
  const items = responsabilidades.filter(r => selectedRespIds.includes(r.id));

  function confirm() {
    if (!paraId) { setError('Selecione o funcionário de destino'); return; }
    if (tipo === 'temporaria' && (!inicio || !fim)) { setError('Informe início e fim para transferência temporária'); return; }
    onConfirm({ deId: funcionario.id, paraId, tipo, inicio: tipo === 'temporaria' ? inicio : undefined, fim: tipo === 'temporaria' ? fim : undefined, respIds: selectedRespIds, tipoItem, incluirAbertas: tipoItem === 'tarefa' ? incluirAbertas : undefined });
    onClose();
  }

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(480px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Transferir Responsabilidades
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              {selectedRespIds.length} {tipoItem === 'tarefa' ? 'tarefa' : 'departamento'}{selectedRespIds.length !== 1 ? 's' : ''} selecionado{selectedRespIds.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={14} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.2)' }}>
              <AlertCircle size={13} style={{ color: 'var(--chart-4)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>{error}</span>
            </div>
          )}

          {/* Selected items */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-3 py-2" style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                {tipoItem === 'tarefa' ? 'TAREFAS' : 'DEPARTAMENTOS'} SELECIONADOS
              </span>
            </div>
            {items.map(item => (
              <div key={item.id} className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <Building2 size={10} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.empresa}</span>
                <ChevronRight size={9} style={{ color: 'var(--muted-foreground)' }} />
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeItem}</span>
              </div>
            ))}
          </div>

          {/* Destino */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>NOVO RESPONSÁVEL *</label>
            <select value={paraId} onChange={e => { setParaId(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-lg appearance-none outline-none cursor-pointer"
              style={{ border: `1.5px solid ${paraId ? 'var(--primary)' : 'var(--border)'}`, background: 'var(--input-background)', fontSize: 'var(--text-label)', color: paraId ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              <option value="">Selecionar funcionário...</option>
              {destinos.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>TIPO DE TRANSFERÊNCIA</label>
            <div className="flex gap-2">
              {(['temporaria', 'permanente'] as const).map(t => (
                <button key={t} onClick={() => setTipo(t)}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  style={{ border: `1.5px solid ${tipo === t ? 'var(--primary)' : 'var(--border)'}`, background: tipo === t ? 'rgba(214,64,0,0.04)' : 'white' }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: tipo === t ? 'var(--primary)' : 'var(--border)', background: tipo === t ? 'var(--primary)' : 'white' }}>
                    {tipo === t && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', textTransform: 'capitalize' }}>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          {tipo === 'temporaria' && (
            <div className="flex gap-3">
              {[{ label: 'INÍCIO *', val: inicio, set: setInicio }, { label: 'FIM *', val: fim, set: setFim }].map(f => (
                <div key={f.label} className="flex-1 flex flex-col gap-1">
                  <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>{f.label}</label>
                  <input type="date" value={f.val} onChange={e => f.set(e.target.value)}
                    className="rounded-lg px-3 py-2 outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Tasks scope */}
          {tipoItem === 'tarefa' && (
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>TAREFAS A INCLUIR</label>
              {[{ value: true, label: 'Incluir tarefas abertas e em andamento' }, { value: false, label: 'Apenas novas tarefas' }].map(opt => (
                <button key={String(opt.value)} onClick={() => setIncluirAbertas(opt.value)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                  style={{ border: `1.5px solid ${incluirAbertas === opt.value ? 'var(--primary)' : 'var(--border)'}`, background: incluirAbertas === opt.value ? 'rgba(214,64,0,0.04)' : 'white' }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: incluirAbertas === opt.value ? 'var(--primary)' : 'var(--border)', background: incluirAbertas === opt.value ? 'var(--primary)' : 'white' }}>
                    {incluirAbertas === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', textAlign: 'left' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex gap-2 justify-end shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Cancelar
          </button>
          <button onClick={confirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <ArrowLeftRight size={13} /> Confirmar Transferência
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Dados Gerais ────────────────────────────────────────────────────────

function FieldBox({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 min-w-0">
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
        {icon}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: 2 }}>{label}</span>
        {children}
      </div>
    </div>
  );
}

function TabDadosGerais({ func, depts, onChange }: {
  func: Funcionario;
  depts: Departamento[];
  onChange: (updated: Funcionario) => void;
}) {
  const [local, setLocal] = useState(func);
  function upd(partial: Partial<Funcionario>) {
    const updated = { ...local, ...partial };
    setLocal(updated);
    onChange(updated);
  }
  const pc = getPermissaoColor(local.permissao);

  const inputStyle: React.CSSProperties = {
    border: 'none', background: 'none', outline: 'none',
    fontSize: 'var(--text-label)', color: 'var(--foreground)', padding: 0, width: '100%',
  };

  const configItems = [
    { label: 'Apenas visualização',   desc: 'Não pode criar ou editar registros',     key: 'apenasVisualizacao' as const, icon: <Eye size={12} /> },
    { label: 'Integrado com Domínio', desc: 'Sincroniza dados com o sistema Domínio', key: 'integradoDominio' as const,   icon: <RefreshCw size={12} /> },
    { label: 'Ativo',                 desc: 'Permite acesso ao sistema',               key: 'ativo' as const,              icon: <CheckCircle2 size={12} /> },
  ];

  return (
    <div className="flex flex-col gap-5 pb-4">

      {/* ── Informações Pessoais ── */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)' }}>
        <div className="px-4 py-2.5" style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
            INFORMAÇÕES PESSOAIS
          </span>
        </div>
        {/* Nome — full width row */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <FieldBox icon={<User size={12} />} label="Nome">
            <input value={local.nome} type="text" onChange={e => upd({ nome: e.target.value })} style={inputStyle} />
          </FieldBox>
        </div>
        {/* E-mail + Telefone — side by side */}
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 min-w-0" style={{ borderRight: '1px solid var(--border)' }}>
            <FieldBox icon={<Mail size={12} />} label="E-mail">
              <input value={local.email} type="email" onChange={e => upd({ email: e.target.value })} style={inputStyle} />
            </FieldBox>
          </div>
          <div className="flex-1 min-w-0">
            <FieldBox icon={<Phone size={12} />} label="Telefone">
              <input value={local.telefone} type="text" onChange={e => upd({ telefone: e.target.value })} style={inputStyle} />
            </FieldBox>
          </div>
        </div>
      </div>

      {/* ── Departamentos ── */}
      <div className="flex flex-col gap-2">
        <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
          DEPARTAMENTOS
        </span>
        <div className="flex flex-wrap gap-2">
          {depts.map(d => {
            const sel = local.departamentos.includes(d.id);
            return (
              <button key={d.id}
                onClick={() => {
                  const next = sel ? local.departamentos.filter(x => x !== d.id) : [...local.departamentos, d.id];
                  upd({ departamentos: next });
                }}
                className="flex items-center gap-1.5 cursor-pointer transition-all"
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                  background: sel ? 'rgba(214,64,0,0.07)' : 'white',
                  fontSize: 'var(--text-label)',
                  color: sel ? 'var(--primary)' : 'var(--muted-foreground)',
                  fontWeight: sel ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                }}>
                {sel && <Check size={10} style={{ flexShrink: 0 }} />}
                {d.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tipo de Permissão + Custo ── */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex flex-col gap-1.5" style={{ flex: '2 1 200px', minWidth: 160 }}>
          <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
            TIPO DE PERMISSÃO
          </span>
          <select value={local.permissao} onChange={e => upd({ permissao: e.target.value as Permissao })}
            className="w-full appearance-none outline-none cursor-pointer"
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${pc.color}33`, background: pc.bg,
              fontSize: 'var(--text-label)', color: pc.color, fontWeight: 'var(--font-weight-semibold)',
            }}>
            <option value="administrador">Administrador</option>
            <option value="gerente">Gerente</option>
            <option value="operador">Operador</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5" style={{ flex: '1 1 120px', minWidth: 110 }}>
          <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
            CUSTO POR HORA (R$)
          </span>
          <div className="flex items-center gap-1.5 px-3"
            style={{ height: 38, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', flexShrink: 0 }}>$</span>
            <input type="number" value={local.custoPorHora}
              onChange={e => upd({ custoPorHora: parseFloat(e.target.value) || 0 })}
              className="outline-none flex-1"
              style={{ border: 'none', background: 'none', fontSize: 'var(--text-label)', color: 'var(--foreground)', minWidth: 0 }} />
          </div>
        </div>
      </div>

      {/* ── Configurações — 3-column horizontal grid ── */}
      <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)' }}>
        <div className="px-4 py-2.5" style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
            CONFIGURAÇÕES
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {configItems.map((row, i) => (
            <div key={row.key}
              className="flex items-center justify-between gap-3 px-4 py-4"
              style={{ borderRight: i < configItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {row.icon}
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {row.label}
                  </p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 1, lineHeight: 1.4 }}>
                    {row.desc}
                  </p>
                </div>
              </div>
              <Toggle checked={local[row.key] as boolean} onChange={() => upd({ [row.key]: !local[row.key] })} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Responsabilidade Row ─────────────────────────────────────────────────────

interface RespRowProps {
  r: Responsabilidade;
  subTab: TipoItem;
  selected: boolean;
  outTransfer?: Transferencia;
  inTransfer?: { sourceNome: string; tr: Transferencia };
  nomeParaId: (id: string) => string;
  onSelect: () => void;
  onTransfer: () => void;
}

function RespRow({ r, subTab, selected, outTransfer, inTransfer, nomeParaId, onSelect, onTransfer }: RespRowProps) {
  const hasOut = !!outTransfer;
  const hasIn = !!inTransfer;
  const isTemp = hasOut && outTransfer!.tipo === 'temporaria';
  const isPerm = hasOut && outTransfer!.tipo === 'permanente';

  const colLabel = subTab === 'tarefa' ? 'Tarefa' : 'Departamento';

  return (
    <tr className="transition-colors"
      style={{ borderBottom: '1px solid var(--border)', background: selected ? 'rgba(214,64,0,0.025)' : hasOut ? 'rgba(254,166,1,0.03)' : hasIn ? 'rgba(21,115,211,0.025)' : undefined }}>
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3" style={{ width: 32 }}>
        <CB checked={selected} onChange={onSelect} />
      </td>
      {/* Cliente */}
      <td className="px-3 py-3">
        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{r.empresa}</span>
      </td>
      {/* Item */}
      <td className="px-3 py-3">
        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{r.nomeItem}</span>
      </td>
      {/* Transferência temporária */}
      <td className="px-3 py-3">
        {hasOut ? (
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit"
              style={{
                fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)',
                background: isTemp ? 'rgba(254,166,1,0.12)' : 'rgba(153,153,153,0.10)',
                color: isTemp ? 'var(--chart-3)' : 'var(--muted-foreground)',
                border: isTemp ? '1px solid rgba(254,166,1,0.3)' : '1px solid var(--border)',
              }}>
              <ArrowLeftRight size={8} />
              {isTemp ? 'Sim — temp.' : 'Sim — perm.'}
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              → {nomeParaId(outTransfer!.paraId)}
              {isTemp && outTransfer!.inicio && ` · ${outTransfer!.inicio}–${outTransfer!.fim}`}
            </span>
          </div>
        ) : hasIn ? (
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit"
              style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', background: 'rgba(21,115,211,0.08)', color: 'var(--chart-2)', border: '1px solid rgba(21,115,211,0.2)' }}>
              <Clock size={8} /> Recebida temp.
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              de {inTransfer!.sourceNome}
              {inTransfer!.tr.inicio && ` · ${inTransfer!.tr.inicio}–${inTransfer!.tr.fim}`}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Não</span>
        )}
      </td>
      {/* Ação */}
      <td className="px-3 py-3 text-right pr-4">
        {!hasOut && !hasIn && (
          <button onClick={e => { e.stopPropagation(); onTransfer(); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer hover:opacity-80 ml-auto"
            style={{ background: 'rgba(21,115,211,0.07)', border: '1px solid rgba(21,115,211,0.18)', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
            <ArrowLeftRight size={9} /> Transferir
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── Tab: Responsabilidades ───────────────────────────────────────────────────

function TabResponsabilidades({ func, funcionarios, allResponsabilidades, transferencias, onAddTransfer }: {
  func: Funcionario;
  funcionarios: Funcionario[];
  allResponsabilidades: Record<string, Responsabilidade[]>;
  transferencias: Transferencia[];
  onAddTransfer: (t: Omit<Transferencia, 'id'>) => void;
}) {
  const [subTab, setSubTab] = useState<TipoItem>('tarefa');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showTransfer, setShowTransfer] = useState(false);

  const ownResps = (allResponsabilidades[func.id] ?? []).filter(r => r.tipoItem === subTab);
  const outTransfers = transferencias.filter(t => t.deId === func.id && t.tipoItem === subTab);
  const inTransfers  = transferencias.filter(t => t.paraId === func.id && t.tipoItem === subTab && t.tipo === 'temporaria');

  // Received responsibilities (temp, from others)
  const receivedItems: Array<{ r: Responsabilidade; sourceNome: string; tr: Transferencia }> = inTransfers.flatMap(tr => {
    const source = funcionarios.find(f => f.id === tr.deId);
    const sourceResps = allResponsabilidades[tr.deId] ?? [];
    return tr.respIds.map(rid => {
      const r = sourceResps.find(x => x.id === rid) ?? { id: rid, empresa: '—', nomeItem: '—', tipoItem: subTab };
      return { r, sourceNome: source?.nome ?? '—', tr };
    });
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ownResps.filter(r => !q || r.empresa.toLowerCase().includes(q) || r.nomeItem.toLowerCase().includes(q));
  }, [ownResps, search]);

  const allSel = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  function toggleR(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(r => r.id))); }
  const nomeParaId = (id: string) => funcionarios.find(f => f.id === id)?.nome ?? '—';

  function getOutTr(id: string) { return outTransfers.find(t => t.respIds.includes(id)); }
  function getInTr(id: string) {
    for (const tr of inTransfers) {
      if (tr.respIds.includes(id)) {
        const sourceNome = funcionarios.find(f => f.id === tr.deId)?.nome ?? '—';
        return { sourceNome, tr };
      }
    }
    return undefined;
  }

  const thS: React.CSSProperties = {
    padding: '8px 12px', textAlign: 'left', background: 'var(--input-background)',
    fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)',
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Sub-tabs */}
      <div className="flex gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
        {(['tarefa', 'departamento'] as const).map(t => (
          <button key={t} onClick={() => { setSubTab(t); setSelected(new Set()); setSearch(''); }}
            className="px-4 py-2 cursor-pointer transition-colors"
            style={{ background: subTab === t ? 'var(--primary)' : 'white', color: subTab === t ? 'white' : 'var(--muted-foreground)', border: 'none', fontSize: 'var(--text-label)', fontWeight: subTab === t ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
            {t === 'tarefa' ? 'Por Tarefas' : 'Por Departamentos'}
          </button>
        ))}
      </div>

      {/* Received temporarily — info banner */}
      {receivedItems.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.04)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(21,115,211,0.15)' }}>
            <Clock size={12} style={{ color: 'var(--chart-2)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-2)' }}>
              RESPONSABILIDADES TEMPORÁRIAS RECEBIDAS ({receivedItems.length})
            </span>
          </div>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thS, background: 'transparent', borderBottom: 'none', paddingTop: 6, paddingBottom: 6 }}>Cliente</th>
                <th style={{ ...thS, background: 'transparent', borderBottom: 'none', paddingTop: 6, paddingBottom: 6 }}>{subTab === 'tarefa' ? 'Tarefa' : 'Departamento'}</th>
                <th style={{ ...thS, background: 'transparent', borderBottom: 'none', paddingTop: 6, paddingBottom: 6 }}>De / Período</th>
              </tr>
            </thead>
            <tbody>
              {receivedItems.map(({ r, sourceNome, tr }, i) => (
                <tr key={r.id + i} style={{ borderTop: '1px solid rgba(21,115,211,0.12)' }}>
                  <td className="px-3 py-2.5">
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{r.empresa}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{r.nomeItem}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)' }}>
                      {sourceNome}{tr.inicio && tr.fim ? ` · ${tr.inicio} até ${tr.fim}` : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-wrap"
          style={{ background: 'var(--foreground)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            {selected.size} {selected.size === 1 ? 'item' : 'itens'} selecionado{selected.size !== 1 ? 's' : ''}
          </span>
          <button onClick={() => setShowTransfer(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(21,115,211,0.85)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <ArrowLeftRight size={10} /> Transferir em lote
          </button>
          <button onClick={() => setSelected(new Set())}
            className="ml-auto flex items-center gap-1 cursor-pointer"
            style={{ background: 'none', border: 'none', fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.55)' }}>
            <X size={10} /> Cancelar seleção
          </button>
        </div>
      )}

      {/* Search + select all */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Buscar por cliente ou ${subTab === 'tarefa' ? 'tarefa' : 'departamento'}...`}
            className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        {filtered.length > 0 && (
          <div
            onClick={toggleAll}
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            <CB checked={allSel} onChange={toggleAll} />
            <span>Todos</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {filtered.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <Layers size={22} style={{ color: 'var(--muted-foreground)' }} />
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              {search ? 'Nenhum resultado para a busca' : 'Nenhuma responsabilidade encontrada'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '520px' }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: 32 }}>
                    <CB checked={allSel} onChange={toggleAll} />
                  </th>
                  <th style={thS}>Cliente</th>
                  <th style={thS}>{subTab === 'tarefa' ? 'Tarefa' : 'Departamento'}</th>
                  <th style={thS}>Transf. Temporária</th>
                  <th style={{ ...thS, textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <RespRow key={r.id}
                    r={r}
                    subTab={subTab}
                    selected={selected.has(r.id)}
                    outTransfer={getOutTr(r.id)}
                    inTransfer={getInTr(r.id)}
                    nomeParaId={nomeParaId}
                    onSelect={() => toggleR(r.id)}
                    onTransfer={() => { setSelected(new Set([r.id])); setShowTransfer(true); }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              {filtered.length} {subTab === 'tarefa' ? 'tarefa' : 'departamento'}{filtered.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}
            </span>
          </div>
        )}
      </div>

      {showTransfer && (
        <TransferDrawer
          funcionario={func}
          funcionarios={funcionarios}
          selectedRespIds={Array.from(selected)}
          tipoItem={subTab}
          responsabilidades={ownResps}
          onClose={() => setShowTransfer(false)}
          onConfirm={t => { onAddTransfer(t); setSelected(new Set()); }}
        />
      )}
    </div>
  );
}

// ─── Tab: Permissões ──────────────────────────────────────────────────────────

function TabPermissoes({ func, funcionarios, menus, onChange }: {
  func: Funcionario;
  funcionarios: Funcionario[];
  menus: MenuPermissao[];
  onChange: (menus: MenuPermissao[]) => void;
}) {
  const [local, setLocal] = useState(menus);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['tarefas']));
  const [copyFrom, setCopyFrom] = useState('');
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  const others = funcionarios.filter(f => f.id !== func.id);

  function toggleMenu(id: string) {
    const u = local.map(m => m.id === id ? { ...m, enabled: !m.enabled, funcs: m.funcs.map(f => ({ ...f, enabled: !m.enabled })) } : m);
    setLocal(u); onChange(u);
  }
  function toggleFunc(menuId: string, funcId: string) {
    const u = local.map(m => m.id !== menuId ? m : { ...m, funcs: m.funcs.map(f => f.id === funcId ? { ...f, enabled: !f.enabled } : f) });
    setLocal(u); onChange(u);
  }
  function toggleExpand(id: string) { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function doCopy() {
    const copied = defaultMenuPermissoes().map(m => ({ ...m, enabled: true, funcs: m.funcs.map(f => ({ ...f, enabled: true })) }));
    setLocal(copied); onChange(copied);
    setShowCopyConfirm(false); setCopyFrom('');
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Copy from */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl flex-wrap"
        style={{ background: 'rgba(21,115,211,0.05)', border: '1px solid rgba(21,115,211,0.18)' }}>
        <Copy size={13} style={{ color: 'var(--chart-2)', flexShrink: 0 }} />
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>Copiar permissões de:</span>
        <select value={copyFrom} onChange={e => setCopyFrom(e.target.value)}
          className="flex-1 min-w-[160px] px-2 py-1.5 rounded-lg appearance-none outline-none cursor-pointer"
          style={{ border: '1px solid rgba(21,115,211,0.25)', background: 'white', fontSize: 'var(--text-label)', color: copyFrom ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
          <option value="">Selecionar funcionário...</option>
          {others.map(f => <option key={f.id} value={f.id}>{f.nome}{!f.ativo ? ' (inativo)' : ''}</option>)}
        </select>
        {copyFrom && (
          <button onClick={() => setShowCopyConfirm(true)}
            className="px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--chart-2)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
            Aplicar
          </button>
        )}
      </div>
      {showCopyConfirm && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-wrap"
          style={{ background: 'rgba(220,10,10,0.05)', border: '1px solid rgba(220,10,10,0.2)' }}>
          <AlertTriangle size={13} style={{ color: 'var(--chart-4)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', flex: 1 }}>As permissões atuais serão substituídas. Confirmar?</span>
          <button onClick={doCopy} className="px-3 py-1 rounded cursor-pointer hover:opacity-90"
            style={{ background: 'var(--chart-4)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            Confirmar
          </button>
          <button onClick={() => setShowCopyConfirm(false)} className="px-3 py-1 rounded cursor-pointer hover:bg-muted"
            style={{ background: 'none', border: '1px solid var(--border)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>
            Cancelar
          </button>
        </div>
      )}
      {local.map(menu => (
        <div key={menu.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: menu.enabled ? 'rgba(56,124,43,0.04)' : 'var(--input-background)' }}>
            <Toggle checked={menu.enabled} onChange={() => toggleMenu(menu.id)} />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ background: menu.enabled ? 'rgba(56,124,43,0.12)' : 'var(--muted)', color: menu.enabled ? 'var(--chart-1)' : 'var(--muted-foreground)' }}>
                {menu.icon}
              </div>
              <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{menu.label}</span>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginLeft: 4 }}>
                ({menu.funcs.filter(f => f.enabled).length}/{menu.funcs.length})
              </span>
            </div>
            <button onClick={() => toggleExpand(menu.id)} className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
              <ChevronDown size={13} style={{ color: 'var(--muted-foreground)', transform: expanded.has(menu.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>
          {expanded.has(menu.id) && menu.funcs.map(f => (
            <div key={f.id} className="flex items-center justify-between px-4 py-2.5 gap-3"
              style={{ borderTop: '1px solid var(--border)', opacity: menu.enabled ? 1 : 0.45 }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: f.enabled && menu.enabled ? 'var(--chart-1)' : 'var(--border)' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{f.label}</span>
              </div>
              <Toggle checked={f.enabled} onChange={() => toggleFunc(menu.id, f.id)} disabled={!menu.enabled} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Employee Detail ──────────────────────────────────────────────────────────

function EmployeeDetail({ func, funcionarios, depts, allResponsabilidades, transferencias, menuPermissoes, onBack, onUpdate, onAddTransfer }: {
  func: Funcionario;
  funcionarios: Funcionario[];
  depts: Departamento[];
  allResponsabilidades: Record<string, Responsabilidade[]>;
  transferencias: Transferencia[];
  menuPermissoes: MenuPermissao[];
  onBack: () => void;
  onUpdate: (f: Funcionario) => void;
  onAddTransfer: (t: Omit<Transferencia, 'id'>) => void;
}) {
  const [tab, setTab] = useState<'dados' | 'responsabilidades' | 'permissoes'>('dados');
  const [menus, setMenus] = useState<MenuPermissao[]>(menuPermissoes);
  const pc = getPermissaoColor(func.permissao);

  // Badge states
  const hasIncoming = transferencias.some(t => t.paraId === func.id && t.tipo === 'temporaria');
  const hasOutgoing = transferencias.some(t => t.deId === func.id);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 md:px-6 pt-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 mb-3 cursor-pointer hover:opacity-75"
          style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={13} /> Voltar para lista
        </button>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Avatar nome={func.nome} size={42} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{func.nome}</h2>
              <span className="px-2 py-0.5 rounded-full"
                style={{ fontSize: 'var(--text-caption)', background: pc.bg, color: pc.color, fontWeight: 'var(--font-weight-semibold)', textTransform: 'capitalize' }}>
                {func.permissao}
              </span>
              {!func.ativo && (
                <span className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: 'var(--text-caption)', background: 'rgba(153,153,153,0.10)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Inativo
                </span>
              )}
              {/* ── Profile transfer markers ── */}
              {hasOutgoing && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ fontSize: 'var(--text-caption)', background: 'rgba(254,166,1,0.10)', color: 'var(--chart-3)', border: '1px solid rgba(254,166,1,0.28)', fontWeight: 'var(--font-weight-semibold)' }}>
                  <ArrowLeftRight size={9} /> Transferiu responsabilidades
                </span>
              )}
              {hasIncoming && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ fontSize: 'var(--text-caption)', background: 'rgba(21,115,211,0.08)', color: 'var(--chart-2)', border: '1px solid rgba(21,115,211,0.22)', fontWeight: 'var(--font-weight-semibold)' }}>
                  <Clock size={9} /> Recebe temp.
                </span>
              )}
            </div>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>{func.email}</p>
          </div>
        </div>
        <div className="flex gap-0">
          {(['dados', 'responsabilidades', 'permissoes'] as const).map(t => {
            const labels = { dados: 'Dados Gerais', responsabilidades: 'Responsabilidades', permissoes: 'Permissões' };
            return (
              <button key={t} onClick={() => setTab(t)}
                className="h-9 px-4 cursor-pointer shrink-0"
                style={{ background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, fontSize: 'var(--text-label)', color: tab === t ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: tab === t ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6" style={{ background: '#f9fafc' }}>
        {tab === 'dados' && <TabDadosGerais func={func} depts={depts} onChange={onUpdate} />}
        {tab === 'responsabilidades' && (
          <TabResponsabilidades
            func={func}
            funcionarios={funcionarios}
            allResponsabilidades={allResponsabilidades}
            transferencias={transferencias}
            onAddTransfer={onAddTransfer}
          />
        )}
        {tab === 'permissoes' && (
          <TabPermissoes func={func} funcionarios={funcionarios} menus={menus} onChange={setMenus} />
        )}
      </div>
    </div>
  );
}

// ─── Employee List ────────────────────────────────────────────────────────────

function EmployeeList({ funcionarios, depts, transferencias, onSelect, onToggleAtivo }: {
  funcionarios: Funcionario[];
  depts: Departamento[];
  transferencias: Transferencia[];
  onSelect: (f: Funcionario) => void;
  onToggleAtivo: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusTab, setStatusTab] = useState<'ativos' | 'inativos'>('ativos');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return funcionarios.filter(f => {
      const matchAtivo = statusTab === 'ativos' ? f.ativo : !f.ativo;
      const matchDept = !deptFilter || f.departamentos.includes(deptFilter);
      const matchSearch = !q || f.nome.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
      return matchAtivo && matchDept && matchSearch;
    });
  }, [funcionarios, search, deptFilter, statusTab]);

  function getDeptNomes(ids: string[]) {
    return ids.map(id => depts.find(d => d.id === id)?.nome ?? id).join(', ');
  }
  function hasTransferAtiva(id: string) {
    return transferencias.some(t => (t.deId === id || t.paraId === id) && t.tipo === 'temporaria');
  }

  const thS: React.CSSProperties = {
    fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)',
    padding: '8px 12px', textAlign: 'left', background: 'var(--input-background)', whiteSpace: 'nowrap',
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs + filters */}
      <div className="bg-white rounded-xl" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {(['ativos', 'inativos'] as const).map(t => (
            <button key={t} onClick={() => setStatusTab(t)}
              className="px-5 py-3 cursor-pointer capitalize"
              style={{ background: 'none', border: 'none', borderBottom: statusTab === t ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, fontSize: 'var(--text-label)', color: statusTab === t ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: statusTab === t ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
              {t}{' '}
              <span className="ml-1 px-1.5 py-0.5 rounded-full"
                style={{ fontSize: 'var(--text-caption)', background: statusTab === t ? 'rgba(214,64,0,0.10)' : 'var(--muted)', color: statusTab === t ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                {funcionarios.filter(f => t === 'ativos' ? f.ativo : !f.ativo).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="rounded-lg px-3 py-1.5 appearance-none outline-none cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: deptFilter ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            <option value="">Todos os departamentos</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          {(search || deptFilter) && (
            <button onClick={() => { setSearch(''); setDeptFilter(''); }}
              className="flex items-center gap-1 cursor-pointer"
              style={{ background: 'none', border: 'none', fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>
              <X size={11} /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '820px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Funcionário', 'E-mail', 'Departamentos', 'Tarefas', 'Transf. ativa', 'Integração', 'E-mail / Erros', 'Ativo'].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum funcionário encontrado</td></tr>
              ) : filtered.map(f => {
                const transAtiva = hasTransferAtiva(f.id);
                const isSource = transferencias.some(t => t.deId === f.id);
                const pc = getPermissaoColor(f.permissao);
                return (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onClick={() => onSelect(f)}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar nome={f.nome} size={28} />
                          {isSource && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                              style={{ background: 'var(--chart-3)', border: '1.5px solid white' }}>
                              <ArrowLeftRight size={6} style={{ color: 'white' }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{f.nome}</p>
                          <span className="px-1.5 py-0.5 rounded-full"
                            style={{ fontSize: '10px', background: pc.bg, color: pc.color, fontWeight: 'var(--font-weight-semibold)', textTransform: 'capitalize' }}>
                            {f.permissao}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{f.email}</span>
                    </td>
                    <td className="px-3 py-3" style={{ maxWidth: 160 }}>
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{getDeptNomes(f.departamentos) || '—'}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {f.tarefasVinculadas
                        ? <CheckCircle2 size={14} style={{ color: 'var(--chart-1)' }} />
                        : <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {transAtiva ? (
                        <span className="flex items-center gap-1 justify-center px-1.5 py-0.5 rounded-full"
                          style={{ fontSize: 'var(--text-caption)', background: 'rgba(254,166,1,0.12)', color: 'var(--chart-3)', border: '1px solid rgba(254,166,1,0.3)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
                          <Clock size={9} /> Ativa
                        </span>
                      ) : <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {f.integradoDominio
                        ? <CheckCircle2 size={14} style={{ color: 'var(--chart-1)' }} />
                        : <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>}
                    </td>
                    <td className="px-3 py-3">
                      {f.errosEmail.length === 0 ? (
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {f.errosEmail.map(e => (
                            <span key={e} className="px-1.5 py-0.5 rounded-full capitalize"
                              style={{ fontSize: 'var(--text-caption)', background: 'rgba(220,10,10,0.10)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)', border: '1px solid rgba(220,10,10,0.15)' }}>
                              {e}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <Toggle checked={f.ativo} onChange={() => onToggleAtivo(f.id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} funcionário{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FuncionariosEscritorio({ onBack }: { onBack: () => void }) {
  const [depts, setDepts] = useState<Departamento[]>(initDepts);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initFuncionarios);
  const [transferencias, setTransferencias] = useState<Transferencia[]>(initTransferencias);
  const [selectedFunc, setSelectedFunc] = useState<Funcionario | null>(null);
  const [deptExpanded, setDeptExpanded] = useState(false);

  function toggleAtivo(id: string) {
    setFuncionarios(p => p.map(f => f.id === id ? { ...f, ativo: !f.ativo } : f));
  }
  function updateFunc(updated: Funcionario) {
    setFuncionarios(p => p.map(f => f.id === updated.id ? updated : f));
    setSelectedFunc(updated);
  }
  function addTransfer(t: Omit<Transferencia, 'id'>) {
    setTransferencias(p => [...p, { ...t, id: `TR${Date.now()}` }]);
  }
  const menuPermissoes = (id: string): MenuPermissao[] =>
    mockMenuPermissoes[id] ?? defaultMenuPermissoes();

  if (selectedFunc) {
    return (
      <EmployeeDetail
        func={selectedFunc}
        funcionarios={funcionarios}
        depts={depts}
        allResponsabilidades={mockResponsabilidades}
        transferencias={transferencias}
        menuPermissoes={menuPermissoes(selectedFunc.id)}
        onBack={() => setSelectedFunc(null)}
        onUpdate={updateFunc}
        onAddTransfer={addTransfer}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="bg-white px-4 md:px-6 py-4 shrink-0 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted"
            style={{ border: '1px solid var(--border)', background: 'white' }}>
            <ArrowLeft size={14} style={{ color: 'var(--foreground)' }} />
          </button>
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Funcionários do Escritório
            </h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              Gerencie funcionários, departamentos e permissões
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer hover:opacity-90"
            style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <Plus size={13} /> Novo Funcionário
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col gap-4" style={{ background: '#f9fafc' }}>

        {/* ── Inline Department Manager ── */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <button
            onClick={() => setDeptExpanded(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
            style={{ background: 'none', border: 'none' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ background: 'rgba(214,64,0,0.08)' }}>
                <Building2 size={13} style={{ color: 'var(--primary)' }} />
              </div>
              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Departamentos
              </span>
              <span className="px-2 py-0.5 rounded-full"
                style={{ fontSize: 'var(--text-caption)', background: 'rgba(214,64,0,0.08)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                {depts.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 flex-wrap justify-end" style={{ maxWidth: 320 }}>
                {depts.slice(0, deptExpanded ? 0 : 4).map(d => (
                  <span key={d.id} className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: 'var(--text-caption)', background: 'var(--muted)', color: 'var(--foreground)' }}>
                    {d.nome}
                  </span>
                ))}
                {!deptExpanded && depts.length > 4 && (
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>+{depts.length - 4}</span>
                )}
              </div>
              {deptExpanded
                ? <ChevronUp size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                : <ChevronDown size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />}
            </div>
          </button>
          {deptExpanded && (
            <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <InlineDeptManager depts={depts} onChange={setDepts} />
            </div>
          )}
        </div>

        {/* ── Employee List ── */}
        <EmployeeList
          funcionarios={funcionarios}
          depts={depts}
          transferencias={transferencias}
          onSelect={setSelectedFunc}
          onToggleAtivo={toggleAtivo}
        />
      </div>
    </div>
  );
}
