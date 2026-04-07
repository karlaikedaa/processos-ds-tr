import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Plus, ChevronDown, Info, Copy, Trash2, X, Check, CheckSquare, Square } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InboxItem {
  id: string;
  nome: string;
  empresaModelo: string;
  tarefa: string;
  email: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TAREFAS_OPCOES = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3', 'Tarefa 4', 'Solicitação de serviço'];
const EMPRESAS_OPCOES = ['Empresa', 'Aquarela do Brasil', 'Thomson Reuters', 'Domínio Sistemas'];

const MOCK_INBOX: InboxItem[] = [
  { id: 'I1', nome: 'Receita federal', empresaModelo: 'Empresa', tarefa: 'Tarefa 1', email: 'inboxb07a00b407a5530fc922f994b3e4fa56d...' },
  { id: 'I2', nome: 'Banco Itau', empresaModelo: 'Empresa', tarefa: 'Tarefa 2', email: 'inboxb07a00b407a5530fc922f994b3e4fa56d...' },
  { id: 'I3', nome: 'Portale-social', empresaModelo: 'Empresa', tarefa: 'Tarefa 3', email: 'inboxb07a00b407a5530fc922f994b3e4fa56d...' },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

const thS: React.CSSProperties = {
  padding: '9px 12px',
  textAlign: 'left',
  background: 'white',
  fontSize: 'var(--text-caption)',
  color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)',
  userSelect: 'none',
};

function SortTh({ label }: { label: string }) {
  return (
    <th style={thS}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
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

// ─── Add Inbox Drawer ─────────────────────────────────────────────────────────

function AddInboxDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (item: Omit<InboxItem, 'id' | 'email'>) => void }) {
  const [nome, setNome] = useState('');
  const [solicitacao, setSolicitacao] = useState('');
  const [empresa, setEmpresa] = useState('');

  const canAdd = nome.trim() !== '' && solicitacao.trim() !== '' && empresa.trim() !== '';

  function handleAdd() {
    if (!canAdd) return;
    onAdd({ nome, empresaModelo: empresa, tarefa: solicitacao });
    setNome(''); setSolicitacao(''); setEmpresa('');
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s' }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', zIndex: 50,
        width: 'min(420px, 100vw)', background: 'white',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <ArrowLeft size={18} style={{ color: 'var(--foreground)' }} />
          </button>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.3 }}>Inbox</h2>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <InfoBanner text="O campo cliente é usado para direcionar a uma empresa as solicitações de serviço de atendimento se o e-mail de destino não estiver registrado ou se estiver registrado em mais de uma tarefa. Insira sua própria empresa ou adicione no sistema uma empresa fictícia apenas para esse fim. Não utilize uma cliente verdadeiro para esse fim." />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                Nome <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>(campo obrigatório)</span>
              </label>
              <input value={nome} onChange={e => setNome(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                Solicitação de serviço <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>(campo obrigatório)</span>
              </label>
              <input value={solicitacao} onChange={e => setSolicitacao(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                Empresa modelo <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>(campo obrigatório)</span>
              </label>
              <input value={empresa} onChange={e => setEmpresa(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 0, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
            Fechar
          </button>
          <button onClick={handleAdd} disabled={!canAdd}
            style={{ flex: 1, padding: '16px', border: 'none', background: canAdd ? 'var(--muted)' : 'var(--muted)', color: canAdd ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.6 }}>
            Adicionar inbox
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InboxConfig({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<InboxItem[]>(MOCK_INBOX);
  const [search, setSearch] = useState('');
  const [tarefaFilter, setTarefaFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(i => {
      if (tarefaFilter && i.tarefa !== tarefaFilter) return false;
      if (q && !i.nome.toLowerCase().includes(q) && !i.empresaModelo.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, tarefaFilter]);

  function handleCopy(email: string, id: string) {
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleDelete(id: string) {
    setItems(p => p.filter(i => i.id !== id));
  }

  function handleAdd(item: Omit<InboxItem, 'id' | 'email'>) {
    setItems(p => [...p, { ...item, id: `I${Date.now()}`, email: `inbox${Math.random().toString(16).slice(2, 10)}...` }]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div style={{ background: 'white', padding: '16px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InfoBanner text="Crie uma regra no seu Outlook para que os e-mails recebidos se tornem, automaticamente, uma tarefa do Processos. Se o e-mail do remetente estiver vinculado a um cliente, automaticamente a tarefa será aberta em nome dele. Senão, a tarefa é gerada para um cliente genérico/fictício" />

        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Inbox</p>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar pelo nome ou departamento"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <select value={tarefaFilter} onChange={e => setTarefaFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: tarefaFilter ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Selecione uma tarefa</option>
              {TAREFAS_OPCOES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setDrawerOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={13} /> NOVO INBOX
          </button>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <SortTh label="Nome" />
                  <SortTh label="Empresa modelo" />
                  <SortTh label="Tarefa" />
                  <SortTh label="E-mail" />
                  <th style={{ ...thS, width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum inbox encontrado</td></tr>
                ) : filtered.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>{item.nome}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{item.empresaModelo}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{item.tarefa}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{item.email}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => handleCopy(item.email, item.id)}
                          title="Copiar e-mail"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                          {copied === item.id
                            ? <Check size={13} style={{ color: 'var(--chart-1)' }} />
                            : <Copy size={13} style={{ color: 'var(--muted-foreground)' }} />}
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                          <Trash2 size={13} style={{ color: 'var(--chart-4)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{filtered.length} inbox{filtered.length !== 1 ? 'es' : ''}</span>
          </div>
        </div>
      </div>

      <AddInboxDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
