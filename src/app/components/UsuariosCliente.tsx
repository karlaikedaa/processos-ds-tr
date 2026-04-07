import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Plus, ChevronDown, Check, CheckSquare, Square, Info, X, User } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserStatus = 'ativo' | 'inativo';
type NotificacaoTipo = 'tarefa' | 'lote';

interface UsuarioCliente {
  id: string;
  nome: string;
  email: string;
  empresas: string[];
  notificarWhatsapp: boolean;
  integracaoDominio: boolean;
  observacao: string;
  ativo: boolean;
  status: UserStatus;
  telefone: string;
  ramal: string;
  contatoVinculado: string;
  justificativa: string;
  notificacaoEmail: boolean;
  notificacaoPortal: boolean;
  notificacaoWhatsapp: boolean;
  notificacaoTipo: NotificacaoTipo;
  recorrencia: string;
  horario: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EMPRESAS_OPCOES = ['Aquarela do Brasil', 'Thomson Reuters', 'Domínio Sistemas'];

const MOCK_USUARIOS: UsuarioCliente[] = [
  { id: 'U1', nome: 'Adão Dutra Admin', email: 'adao10.dutra+admin@email.com', empresas: ['Aquarela do Brasil'], notificarWhatsapp: true, integracaoDominio: true, observacao: 'Bloqueado', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: true, notificacaoWhatsapp: true, notificacaoTipo: 'lote', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U2', nome: 'Daniel Ferreira', email: 'danielferreira@email.com', empresas: ['Thomson Reuters'], notificarWhatsapp: true, integracaoDominio: true, observacao: 'Bounce', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: true, notificacaoWhatsapp: true, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U3', nome: 'Eliane Silva', email: 'eliane.slv@email.com', empresas: ['Domínio Sistemas'], notificarWhatsapp: true, integracaoDominio: true, observacao: 'Bounce', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: true, notificacaoWhatsapp: true, notificacaoTipo: 'lote', recorrencia: 'Semanalmente', horario: '08:00' },
  { id: 'U4', nome: 'Fernando Rocha', email: 'fernando18@email.com', empresas: ['Domínio Sistemas'], notificarWhatsapp: true, integracaoDominio: true, observacao: '', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: false, notificacaoWhatsapp: true, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '09:00' },
  { id: 'U5', nome: 'Galindo Nunes', email: 'galindo@email.com', empresas: ['Aquarela do Brasil'], notificarWhatsapp: true, integracaoDominio: true, observacao: '', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: false, notificacaoPortal: true, notificacaoWhatsapp: true, notificacaoTipo: 'lote', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U6', nome: 'Henrique Caetano', email: 'henrique_ctn@email.com', empresas: ['Thomson Reuters'], notificarWhatsapp: true, integracaoDominio: true, observacao: '', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: true, notificacaoWhatsapp: false, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '07:00' },
  { id: 'U7', nome: 'Luciana Alves', email: 'lucialves@email.com', empresas: ['Domínio Sistemas', 'Thomson Reuters'], notificarWhatsapp: true, integracaoDominio: true, observacao: '', ativo: true, status: 'ativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: true, notificacaoWhatsapp: true, notificacaoTipo: 'lote', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U8', nome: 'Marcos Oliveira', email: 'marcos.oli@email.com', empresas: ['Aquarela do Brasil'], notificarWhatsapp: false, integracaoDominio: false, observacao: '', ativo: false, status: 'inativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: 'Saiu da empresa', notificacaoEmail: false, notificacaoPortal: false, notificacaoWhatsapp: false, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U9', nome: 'Patricia Lima', email: 'patricia.lima@email.com', empresas: ['Domínio Sistemas'], notificarWhatsapp: false, integracaoDominio: false, observacao: '', ativo: false, status: 'inativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: 'Inativo por solicitação', notificacaoEmail: false, notificacaoPortal: false, notificacaoWhatsapp: false, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '00:00' },
  { id: 'U10', nome: 'Ricardo Santos', email: 'ricardo.santos@email.com', empresas: ['Thomson Reuters'], notificarWhatsapp: false, integracaoDominio: true, observacao: '', ativo: false, status: 'inativo', telefone: '', ramal: '', contatoVinculado: '', justificativa: '', notificacaoEmail: true, notificacaoPortal: false, notificacaoWhatsapp: false, notificacaoTipo: 'tarefa', recorrencia: 'Diariamente', horario: '00:00' },
];

const RECORRENCIAS = ['Diariamente', 'Semanalmente', 'Quinzenalmente', 'Mensalmente'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const thS: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  background: 'white',
  fontSize: 'var(--text-caption)',
  color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)',
  userSelect: 'none',
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

function Toggle({ checked, onChange, size = 'md' }: { checked: boolean; onChange: () => void; size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 32 : 36;
  const h = size === 'sm' ? 18 : 20;
  const dot = size === 'sm' ? 12 : 14;
  const gap = size === 'sm' ? 3 : 3;
  const onLeft = size === 'sm' ? 17 : 19;
  return (
    <button
      onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: w, height: h, background: checked ? 'var(--chart-1)' : 'var(--muted)', borderRadius: 999, transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', width: dot, height: dot, background: 'white', borderRadius: '50%', top: gap, left: checked ? onLeft : gap, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>
    </button>
  );
}

function SortTh({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <th style={{ ...thS, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        <ChevronDown size={11} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 8px', borderRadius: 999,
      background: 'var(--muted)', fontSize: 'var(--text-caption)',
      color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)',
    }}>
      {label}
    </span>
  );
}

function TabToggle({ active, options, onChange }: { active: string; options: { key: string; label: string }[]; onChange: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            border: 'none',
            background: active === opt.key ? 'var(--foreground)' : 'white',
            color: active === opt.key ? 'white' : 'var(--foreground)',
            fontSize: 'var(--text-label)',
            fontWeight: active === opt.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-button)',
            cursor: 'pointer',
            boxShadow: active !== opt.key ? '0 0 0 1px var(--border)' : 'none',
            transition: 'background 0.15s',
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────

function EditUsuario({ usuario: initial, onClose }: { usuario: UsuarioCliente; onClose: () => void }) {
  const [u, setU] = useState<UsuarioCliente>(initial);

  const field = (label: string, key: keyof UsuarioCliente, required?: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
        {label}{required && <span style={{ color: 'var(--chart-4)' }}>*</span>}
      </label>
      <input
        value={String(u[key] ?? '')}
        onChange={e => setU(p => ({ ...p, [key]: e.target.value }))}
        style={{
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '7px 12px', fontSize: 'var(--text-label)', color: 'var(--foreground)',
          background: 'white', outline: 'none',
        }}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* Top header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.3 }}>Edição de usuário</h2>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', marginTop: 2 }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{u.nome}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginTop: 4 }}>
          <X size={13} /> Fechar
        </button>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '10px 24px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)', flexShrink: 0 }}>
        <button onClick={onClose} style={{ padding: '6px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          CANCELAR
        </button>
        <button onClick={onClose} style={{ padding: '6px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          SALVAR
        </button>
      </div>

      {/* Form content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafc' }}>
        <div style={{ maxWidth: 860, padding: '24px' }}>

          {/* Basic fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
            {field('Nome', 'nome')}
            {field('E-mail', 'email')}
            {field('Telefone', 'telefone')}
            {field('Ramal', 'ramal')}
          </div>

          {/* Dados de ativação */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 12 }}>Dados de ativação</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 32px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Toggle checked={u.integracaoDominio} onChange={() => setU(p => ({ ...p, integracaoDominio: !p.integracaoDominio }))} />
                <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Integrado com Domínio</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Toggle checked={u.ativo} onChange={() => setU(p => ({ ...p, ativo: !p.ativo }))} />
                <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Ativo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Justificativa</label>
                <input value={u.justificativa} onChange={e => setU(p => ({ ...p, justificativa: e.target.value }))}
                  style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 300 }}>
              <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Contato vinculado</label>
              <input value={u.contatoVinculado} onChange={e => setU(p => ({ ...p, contatoVinculado: e.target.value }))}
                style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white', outline: 'none' }} />
            </div>
          </div>

          {/* Preferências de notificação */}
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 12 }}>Preferências de notificação</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', marginBottom: 12 }}>
              {[
                { label: 'E-mail', key: 'notificacaoEmail' as const },
                { label: 'Portal do cliente', key: 'notificacaoPortal' as const },
                { label: 'WhatsApp', key: 'notificacaoWhatsapp' as const },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Toggle checked={u[item.key]} onChange={() => setU(p => ({ ...p, [item.key]: !p[item.key] }))} />
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Radio */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              {[
                { label: 'Notificar por tarefa', value: 'tarefa' as const },
                { label: 'Notificar em lote', value: 'lote' as const },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div
                    onClick={() => setU(p => ({ ...p, notificacaoTipo: opt.value }))}
                    style={{
                      width: 16, height: 16, borderRadius: '50%', cursor: 'pointer',
                      border: `2px solid ${u.notificacaoTipo === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: u.notificacaoTipo === opt.value ? 'var(--primary)' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    {u.notificacaoTipo === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Recorrência + Horário */}
            {u.notificacaoTipo === 'lote' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Recorrência</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={u.recorrencia}
                      onChange={e => setU(p => ({ ...p, recorrencia: e.target.value }))}
                      style={{ width: '100%', padding: '7px 32px 7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      {RECORRENCIAS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Horário</label>
                  <input
                    type="time"
                    value={u.horario}
                    onChange={e => setU(p => ({ ...p, horario: e.target.value }))}
                    style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white', outline: 'none' }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UsuariosCliente({ onBack }: { onBack: () => void }) {
  const [statusFilter, setStatusFilter] = useState<UserStatus>('ativo');
  const [search, setSearch] = useState('');
  const [empresaFilter, setEmpresaFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<UsuarioCliente | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioCliente[]>(MOCK_USUARIOS);

  const ativos = MOCK_USUARIOS.filter(u => u.status === 'ativo').length;
  const inativos = MOCK_USUARIOS.filter(u => u.status === 'inativo').length;
  const total = MOCK_USUARIOS.length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return usuarios.filter(u => {
      if (u.status !== statusFilter) return false;
      if (empresaFilter && !u.empresas.includes(empresaFilter)) return false;
      if (q && !u.nome.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [usuarios, search, statusFilter, empresaFilter]);

  const allSel = filtered.length > 0 && filtered.every(u => selected.has(u.id));
  function toggleSel(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(u => u.id))); }

  function toggleAtivo(id: string) {
    setUsuarios(p => p.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u));
  }

  function updateEmpresasUsuario(id: string, novasEmpresas: string[]) {
    setUsuarios(p => p.map(u => u.id === id ? { ...u, empresas: novasEmpresas } : u));
  }

  if (editing) {
    return <EditUsuario usuario={editing} onClose={() => setEditing(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Page header */}
      <div style={{ background: 'white', padding: '16px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Info banner */}
        <InfoBanner text="Realize o gerenciamento dos funcionários do escritório. Não é possível excluir usuários devido a históricos de tarefas que podem estar atrelados a eles. Caso o usuário não faça mais parte do seu quadro de funcionários, você poderá inativar e verificar os dados deste usuário em uma lista a parte." />

        {/* Count + status tabs */}
        <div>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10 }}>
            {total} Usuários de cliente
          </p>
          <TabToggle
            active={statusFilter}
            options={[
              { key: 'ativo', label: `Ativos (${ativos})` },
              { key: 'inativo', label: `Inativos (${inativos})` },
            ]}
            onChange={k => setStatusFilter(k as UserStatus)}
          />
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 'min(280px, 100%)' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar pelo nome ou departamento"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }}
            />
          </div>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <select
              value={empresaFilter}
              onChange={e => setEmpresaFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: empresaFilter ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Selecione uma empresa</option>
              {EMPRESAS_OPCOES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
          <div style={{ flex: 1 }} />
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={13} /> IMPORTAR USUÁRIO EM LOTE
          </button>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 840 }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                  <SortTh label="Nome" />
                  <SortTh label="E-mail" />
                  <SortTh label="Empresa" />
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Notificar<br />WhatsApp <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </th>
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Integração<br />Domínio <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </th>
                  <SortTh label="Observação" />
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Ativo <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: '1px solid var(--border)', background: selected.has(u.id) ? 'rgba(214,64,0,0.02)' : undefined, transition: 'background 0.15s' }}
                    className="hover:bg-muted/10">
                    <td style={{ paddingLeft: 12, paddingRight: 8, paddingTop: 10, paddingBottom: 10 }}>
                      <CB checked={selected.has(u.id)} onChange={() => toggleSel(u.id)} />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        onClick={() => setEditing(u)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline' }}>
                        {u.nome}
                      </button>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {/* Empresa dropdown in cell */}
                      <div style={{ position: 'relative', maxWidth: 200 }}>
                        <select
                          value={u.empresas[0] ?? ''}
                          onChange={e => updateEmpresasUsuario(u.id, [e.target.value])}
                          onClick={e => e.stopPropagation()}
                          style={{ width: '100%', padding: '4px 28px 4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer', maxWidth: 190 }}>
                          {EMPRESAS_OPCOES.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <ChevronDown size={10} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{u.notificarWhatsapp ? 'Sim' : 'Não'}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{u.integracaoDominio ? 'Sim' : 'Não'}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {u.observacao ? <StatusPill label={u.observacao} /> : null}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Toggle checked={u.ativo} onChange={() => toggleAtivo(u.id)} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              {filtered.length} usuário{filtered.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
