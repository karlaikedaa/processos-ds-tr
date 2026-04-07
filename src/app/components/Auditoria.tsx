import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Activity, User, FileText, Settings,
  CheckCircle2, AlertTriangle, Clock, Bell, Edit3, Trash2,
  LogIn, LogOut, ChevronDown, X, Calendar,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type EventoTipo =
  | 'login' | 'logout' | 'criacao' | 'edicao' | 'exclusao'
  | 'status' | 'documento' | 'notificacao' | 'configuracao' | 'acesso';

type EventoStatus = 'sucesso' | 'falha' | 'aviso';

interface EventoGeral {
  id: number;
  tipo: EventoTipo;
  descricao: string;
  usuario: string;
  data: string;
  ip?: string;
  modulo?: string;
  status: EventoStatus;
}

interface EventoDominio {
  id: number;
  tipo: EventoTipo;
  descricao: string;
  funcionario: string;
  data: string;
  status: EventoStatus;
  empresa?: string;
  referencia?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEventosGerais: EventoGeral[] = [
  { id: 1, tipo: 'login', descricao: 'Login realizado com sucesso', usuario: 'Maria Silva', data: '10/03/2026 09:15', ip: '192.168.1.10', modulo: 'Autenticação', status: 'sucesso' },
  { id: 2, tipo: 'criacao', descricao: 'Nova tarefa criada: DCTF Mar/26', usuario: 'Maria Silva', data: '10/03/2026 09:20', modulo: 'Tarefas', status: 'sucesso' },
  { id: 3, tipo: 'edicao', descricao: 'Responsável da tarefa #T-00005 alterado para João Pedro', usuario: 'Admin', data: '10/03/2026 09:45', modulo: 'Tarefas', status: 'sucesso' },
  { id: 4, tipo: 'documento', descricao: 'Documento "Contrato Social" aprovado para Empresa ABC Ltda', usuario: 'Carlos Diretor', data: '10/03/2026 10:02', modulo: 'Documentos', status: 'sucesso' },
  { id: 5, tipo: 'status', descricao: 'Status da tarefa SPED Fiscal alterado para "Concluída"', usuario: 'João Pedro', data: '10/03/2026 10:30', modulo: 'Tarefas', status: 'sucesso' },
  { id: 6, tipo: 'acesso', descricao: 'Tentativa de acesso negada ao módulo Financeiro', usuario: 'Ana Torres', data: '10/03/2026 11:05', ip: '192.168.1.22', modulo: 'Segurança', status: 'falha' },
  { id: 7, tipo: 'notificacao', descricao: 'Notificação de vencimento enviada a 12 clientes', usuario: 'Sistema', data: '10/03/2026 08:00', modulo: 'Comunicações', status: 'sucesso' },
  { id: 8, tipo: 'configuracao', descricao: 'Configuração de prazo padrão atualizada: 5 dias úteis', usuario: 'Admin', data: '09/03/2026 17:10', modulo: 'Configurações', status: 'sucesso' },
  { id: 9, tipo: 'exclusao', descricao: 'Tarefa #T-00012 ECF 2025 marcada como Desconsiderada', usuario: 'João Pedro', data: '09/03/2026 16:45', modulo: 'Tarefas', status: 'aviso' },
  { id: 10, tipo: 'logout', descricao: 'Sessão encerrada', usuario: 'Fernanda Lima', data: '09/03/2026 18:00', ip: '192.168.1.15', modulo: 'Autenticação', status: 'sucesso' },
  { id: 11, tipo: 'login', descricao: 'Login realizado com sucesso', usuario: 'Carlos Rocha', data: '09/03/2026 08:30', ip: '192.168.1.31', modulo: 'Autenticação', status: 'sucesso' },
  { id: 12, tipo: 'edicao', descricao: 'E-mail adicional adicionado à tarefa Folha de Pagamento', usuario: 'Ana Torres', data: '09/03/2026 14:20', modulo: 'Tarefas', status: 'sucesso' },
  { id: 13, tipo: 'documento', descricao: 'Envio de documentos cobrado ao cliente DEF Comércio', usuario: 'Sistema', data: '08/03/2026 08:00', modulo: 'Documentos', status: 'aviso' },
  { id: 14, tipo: 'criacao', descricao: 'Novo usuário do cliente cadastrado: João Financeiro', usuario: 'Admin', data: '08/03/2026 11:00', modulo: 'Clientes', status: 'sucesso' },
];

const mockEventosDominio: EventoDominio[] = [
  { id: 1, tipo: 'criacao', descricao: 'Folha de pagamento Out/25 processada e enviada', funcionario: 'Maria Silva', data: '10/03/2026 09:40', status: 'sucesso', empresa: 'DEF Comércio', referencia: 'FP-2025-10' },
  { id: 2, tipo: 'documento', descricao: 'SPED Fiscal Set/25 transmitido com sucesso', funcionario: 'João Pedro', data: '10/03/2026 10:15', status: 'sucesso', empresa: 'Empresa XYZ S/A', referencia: 'SPED-2025-09' },
  { id: 3, tipo: 'status', descricao: 'Tarefa DCTF Ago/25 marcada como concluída', funcionario: 'Maria Silva', data: '10/03/2026 09:00', status: 'sucesso', empresa: 'Empresa ABC Ltda', referencia: 'T-00001' },
  { id: 4, tipo: 'edicao', descricao: 'Competência da tarefa IRPJ 2025 corrigida para Anual/2025', funcionario: 'Admin', data: '09/03/2026 15:30', status: 'aviso', empresa: 'JKL Indústria', referencia: 'T-00005' },
  { id: 5, tipo: 'exclusao', descricao: 'ECF 2025 desconsiderada por solicitação do cliente', funcionario: 'João Pedro', data: '09/03/2026 16:45', status: 'aviso', empresa: 'Empresa XYZ S/A', referencia: 'T-00012' },
  { id: 6, tipo: 'documento', descricao: 'Contrato Social enviado e aprovado pelo cliente', funcionario: 'Carlos Rocha', data: '09/03/2026 11:20', status: 'sucesso', empresa: 'GHI Serviços', referencia: 'DOC-CS-001' },
  { id: 7, tipo: 'criacao', descricao: 'Tarefa REINF Out/25 gerada automaticamente', funcionario: 'Sistema', data: '08/03/2026 00:00', status: 'sucesso', empresa: 'Empresa ABC Ltda', referencia: 'T-00010' },
  { id: 8, tipo: 'acesso', descricao: 'Relatório de apuração acessado por funcionário', funcionario: 'Fernanda Lima', data: '08/03/2026 14:00', status: 'sucesso', empresa: 'MNO Holding', referencia: 'REL-APU-2025' },
  { id: 9, tipo: 'edicao', descricao: 'Data meta da tarefa Balancete Set/25 alterada', funcionario: 'Carlos Rocha', data: '07/03/2026 16:00', status: 'aviso', empresa: 'GHI Serviços', referencia: 'T-00004' },
  { id: 10, tipo: 'notificacao', descricao: 'Lembrete de vencimento enviado ao cliente STU Logística', funcionario: 'Sistema', data: '07/03/2026 08:00', status: 'sucesso', empresa: 'STU Logística', referencia: 'NOTIF-007' },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const tipoConfig: Record<EventoTipo, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  login:         { label: 'Login',         color: 'var(--chart-1)',       bg: 'rgba(56,124,43,0.10)',    icon: LogIn },
  logout:        { label: 'Logout',        color: 'var(--muted-foreground)', bg: 'rgba(153,153,153,0.10)', icon: LogOut },
  criacao:       { label: 'Criação',       color: 'var(--chart-2)',       bg: 'rgba(21,115,211,0.10)',   icon: CheckCircle2 },
  edicao:        { label: 'Edição',        color: 'var(--chart-3)',       bg: 'rgba(254,166,1,0.10)',    icon: Edit3 },
  exclusao:      { label: 'Exclusão',      color: 'var(--chart-4)',       bg: 'rgba(220,10,10,0.10)',    icon: Trash2 },
  status:        { label: 'Status',        color: '#8B5CF6',              bg: 'rgba(139,92,246,0.10)',   icon: Activity },
  documento:     { label: 'Documento',     color: 'var(--primary)',       bg: 'rgba(214,64,0,0.08)',     icon: FileText },
  notificacao:   { label: 'Notificação',   color: 'var(--chart-3)',       bg: 'rgba(254,166,1,0.12)',    icon: Bell },
  configuracao:  { label: 'Configuração',  color: 'var(--chart-2)',       bg: 'rgba(21,115,211,0.08)',   icon: Settings },
  acesso:        { label: 'Acesso',        color: 'var(--chart-4)',       bg: 'rgba(220,10,10,0.08)',    icon: AlertTriangle },
};

const statusConfig: Record<EventoStatus, { label: string; color: string; bg: string }> = {
  sucesso: { label: 'Sucesso', color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.10)' },
  falha:   { label: 'Falha',   color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.10)' },
  aviso:   { label: 'Aviso',   color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.12)' },
};

const allTipos = Object.keys(tipoConfig) as EventoTipo[];
const allStatuses = Object.keys(statusConfig) as EventoStatus[];
const allUsuariosGeral = [...new Set(mockEventosGerais.map(e => e.usuario))];
const allFuncionarios = [...new Set(mockEventosDominio.map(e => e.funcionario))];

// ─── Shared FilterBar ─────────────────────────────────────────────────────────

function FilterBar({ filters, onChange, onClear }: {
  filters: { label: string; value: string; options: { value: string; label: string }[] }[];
  onChange: (index: number, v: string) => void;
  onClear: () => void;
}) {
  const hasAny = filters.some(f => f.value !== '');
  return (
    <div className="flex items-end gap-3 flex-wrap">
      {filters.map((f, i) => (
        <div key={f.label} className="flex flex-col gap-1" style={{ minWidth: '140px', flex: '0 1 170px' }}>
          <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>{f.label}</label>
          <select
            value={f.value}
            onChange={e => onChange(i, e.target.value)}
            className="rounded-md px-3 py-2 appearance-none outline-none"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: f.value ? 'var(--foreground)' : 'var(--muted-foreground)' }}
          >
            <option value="">Todos</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      {hasAny && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 whitespace-nowrap"
          style={{ border: '1px solid var(--chart-4)', fontSize: 'var(--text-label)', color: 'var(--chart-4)', background: 'none' }}
        >
          <X size={13} /> Limpar
        </button>
      )}
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ tipo, descricao, usuario, data, ip, modulo, status, referencia, empresa }: {
  tipo: EventoTipo; descricao: string; usuario: string; data: string;
  ip?: string; modulo?: string; status: EventoStatus; referencia?: string; empresa?: string;
}) {
  const tc = tipoConfig[tipo];
  const sc = statusConfig[status];
  const Icon = tc.icon;
  return (
    <div className="flex gap-3 relative pb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
        style={{ background: tc.bg, border: `1.5px solid ${tc.color}` }}>
        <Icon size={13} style={{ color: tc.color }} />
      </div>
      <div className="flex-1 min-w-0 p-3 rounded-lg" style={{ background: 'white', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: tc.color, background: tc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
              {tc.label}
            </span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: sc.color, background: sc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
              {sc.label}
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', flexShrink: 0 }}>{data}</span>
        </div>
        <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.45 }}>{descricao}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary)', fontSize: '8px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
              {usuario === 'Sistema' ? '⚙' : usuario.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{usuario}</span>
          </div>
          {modulo && (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>· {modulo}</span>
          )}
          {ip && (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>· IP: {ip}</span>
          )}
          {empresa && (
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>· {empresa}</span>
          )}
          {referencia && (
            <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', background: 'rgba(21,115,211,0.08)' }}>
              #{referencia}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Auditoria Geral ──────────────────────────────────────────────────────────

function AuditoriaGeral() {
  const [dataFiltro, setDataFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => mockEventosGerais.filter(e => {
    if (tipoFiltro && e.tipo !== tipoFiltro) return false;
    if (usuarioFiltro && e.usuario !== usuarioFiltro) return false;
    if (dataFiltro && !e.data.startsWith(dataFiltro)) return false;
    if (search && !e.descricao.toLowerCase().includes(search.toLowerCase()) && !e.usuario.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tipoFiltro, usuarioFiltro, dataFiltro, search]);

  const clearAll = () => { setDataFiltro(''); setTipoFiltro(''); setUsuarioFiltro(''); setSearch(''); };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter panel */}
      <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar no histórico..."
              className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1" style={{ minWidth: '160px', flex: '0 1 200px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Data</label>
              <input type="date" value={dataFiltro} onChange={e => setDataFiltro(e.target.value)}
                className="rounded-md px-3 py-2 outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: '150px', flex: '0 1 180px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Tipo de evento</label>
              <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}
                className="rounded-md px-3 py-2 appearance-none outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: tipoFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Todos</option>
                {allTipos.map(t => <option key={t} value={t}>{tipoConfig[t].label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: '150px', flex: '0 1 180px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Usuário</label>
              <select value={usuarioFiltro} onChange={e => setUsuarioFiltro(e.target.value)}
                className="rounded-md px-3 py-2 appearance-none outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: usuarioFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Todos</option>
                {allUsuariosGeral.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {(tipoFiltro || usuarioFiltro || dataFiltro || search) && (
              <button onClick={clearAll}
                className="flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 whitespace-nowrap"
                style={{ border: '1px solid var(--chart-4)', fontSize: 'var(--text-label)', color: 'var(--chart-4)', background: 'none' }}>
                <X size={13} /> Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total de eventos', value: filtered.length, color: 'var(--foreground)' },
          { label: 'Sucessos', value: filtered.filter(e => e.status === 'sucesso').length, color: 'var(--chart-1)' },
          { label: 'Avisos', value: filtered.filter(e => e.status === 'aviso').length, color: 'var(--chart-3)' },
          { label: 'Falhas', value: filtered.filter(e => e.status === 'falha').length, color: 'var(--chart-4)' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg px-4 py-3" style={{ border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{stat.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 'var(--font-weight-semibold)', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
          {filtered.length} evento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
        {filtered.length === 0 ? (
          <p className="text-center py-10" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
            Nenhum evento encontrado com os filtros selecionados.
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4" style={{ width: '1px', background: 'var(--border)' }} />
            <div>
              {filtered.map(ev => (
                <TimelineItem key={ev.id} tipo={ev.tipo} descricao={ev.descricao} usuario={ev.usuario}
                  data={ev.data} ip={ev.ip} modulo={ev.modulo} status={ev.status} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Auditoria Dominio ────────────────────────────────────────────────────────

function AuditoriaDominio() {
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [funcionarioFiltro, setFuncionarioFiltro] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => mockEventosDominio.filter(e => {
    if (tipoFiltro && e.tipo !== tipoFiltro) return false;
    if (statusFiltro && e.status !== statusFiltro) return false;
    if (funcionarioFiltro && e.funcionario !== funcionarioFiltro) return false;
    if (dataFiltro && !e.data.startsWith(dataFiltro)) return false;
    if (search && !e.descricao.toLowerCase().includes(search.toLowerCase()) && !e.funcionario.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tipoFiltro, statusFiltro, funcionarioFiltro, dataFiltro, search]);

  const clearAll = () => { setTipoFiltro(''); setDataFiltro(''); setStatusFiltro(''); setFuncionarioFiltro(''); setSearch(''); };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter panel */}
      <div className="bg-white rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar no log..."
              className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1" style={{ minWidth: '150px', flex: '0 1 170px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Tipo de evento</label>
              <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}
                className="rounded-md px-3 py-2 appearance-none outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: tipoFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Todos</option>
                {allTipos.map(t => <option key={t} value={t}>{tipoConfig[t].label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: '160px', flex: '0 1 190px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Data</label>
              <input type="date" value={dataFiltro} onChange={e => setDataFiltro(e.target.value)}
                className="rounded-md px-3 py-2 outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: '140px', flex: '0 1 160px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Status</label>
              <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}
                className="rounded-md px-3 py-2 appearance-none outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: statusFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Todos</option>
                {allStatuses.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1" style={{ minWidth: '150px', flex: '0 1 180px' }}>
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Funcionário</label>
              <select value={funcionarioFiltro} onChange={e => setFuncionarioFiltro(e.target.value)}
                className="rounded-md px-3 py-2 appearance-none outline-none"
                style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: funcionarioFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Todos</option>
                {allFuncionarios.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {(tipoFiltro || dataFiltro || statusFiltro || funcionarioFiltro || search) && (
              <button onClick={clearAll}
                className="flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 whitespace-nowrap"
                style={{ border: '1px solid var(--chart-4)', fontSize: 'var(--text-label)', color: 'var(--chart-4)', background: 'none' }}>
                <X size={13} /> Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>
            {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
          </p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80"
            style={{ border: '1px solid var(--border)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', background: 'none' }}>
            <Download size={12} /> Exportar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
                {['Tipo', 'Descrição', 'Funcionário', 'Empresa', 'Referência', 'Status', 'Data'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : filtered.map((ev, idx) => {
                const tc = tipoConfig[ev.tipo];
                const sc = statusConfig[ev.status];
                const Icon = tc.icon;
                return (
                  <tr key={ev.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: 'white' }}
                    className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                        style={{ fontSize: 'var(--text-caption)', color: tc.color, background: tc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
                        <Icon size={10} /> {tc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', maxWidth: '280px' }}>
                      {ev.descricao}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'var(--primary)', fontSize: '9px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                          {ev.funcionario === 'Sistema' ? '⚙' : ev.funcionario.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{ev.funcionario}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                      {ev.empresa ?? '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {ev.referencia ? (
                        <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', background: 'rgba(21,115,211,0.08)' }}>
                          #{ev.referencia}
                        </span>
                      ) : <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full"
                        style={{ fontSize: 'var(--text-caption)', color: sc.color, background: sc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                      {ev.data}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Auditoria ───────────────────────────────────────────────────────────

export function Auditoria() {
  const [activeTab, setActiveTab] = useState<'geral' | 'dominio'>('geral');

  const tabs = [
    { id: 'geral' as const, label: 'Auditoria Geral' },
    { id: 'dominio' as const, label: 'Auditoria Domínio' },
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Auditoria
          </h2>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            Registro completo de movimentações do sistema
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer hover:opacity-80"
          style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white' }}>
          <Download size={14} /> Exportar tudo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-3 cursor-pointer whitespace-nowrap transition-colors"
            style={{
              fontSize: 'var(--text-label)',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'geral' ? <AuditoriaGeral /> : <AuditoriaDominio />}
    </div>
  );
}
