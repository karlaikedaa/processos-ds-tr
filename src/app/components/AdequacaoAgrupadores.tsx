import React, { useState, useMemo } from 'react';
import { ArrowLeft, Info, AlertCircle, Clock, X, ChevronDown, CheckSquare, Square, User, Calendar, ChevronUp } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'pendentes' | 'historico';

interface VinculoPendente {
  id: string;
  razaoSocial: string;
  documento: string;
  regimeFederalAntigo: string;
  novoRegimeFederal: string;
  agrupadorSugerido: string;
  acao: string;
}

interface HistoricoItem {
  id: string;
  usuario: string;
  iniciais: string;
  qtdClientes: number;
  descricao: string;
  data: string;
  hora: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACOES_OPCOES = [
  'Selecione a opção',
  'Manter agrupador atual',
  'Aplicar agrupador sugerido',
  'Não fazer alterações',
];

const MOCK_VINCULOS: VinculoPendente[] = [
  { id: 'V1', razaoSocial: 'Contabilidade Martins', documento: '41.470.244/0001-15', regimeFederalAntigo: 'Simples Nacional', novoRegimeFederal: 'MEI', agrupadorSugerido: 'Folha 5º dia útil +1', acao: '' },
  { id: 'V2', razaoSocial: 'Ocean Contábil', documento: '98.765.432/0001-01', regimeFederalAntigo: 'Simples Nacional', novoRegimeFederal: 'MEI', agrupadorSugerido: 'Folha dia 30 +3', acao: '' },
  { id: 'V3', razaoSocial: 'Contabilidade Silva', documento: '12.345.678/0001-99', regimeFederalAntigo: 'Lucro Presumido', novoRegimeFederal: 'Lucro Real', agrupadorSugerido: 'Lucro Presumido +4', acao: '' },
  { id: 'V4', razaoSocial: 'Serviços Contábeis Lima', documento: '23.456.789/0001-11', regimeFederalAntigo: 'Lucro Real', novoRegimeFederal: 'Lucro Real', agrupadorSugerido: 'Lucro Real', acao: '' },
  { id: 'V5', razaoSocial: 'Contabilidade e Consultoria A...', documento: '34.567.890/0001-22', regimeFederalAntigo: 'Entidade/Associação', novoRegimeFederal: 'Entidade/Associação', agrupadorSugerido: 'Pró-Labore +2', acao: '' },
  { id: 'V6', razaoSocial: 'Naval Contabilidade', documento: '45.678.901/0001-33', regimeFederalAntigo: 'MEI', novoRegimeFederal: 'Simples Nacional', agrupadorSugerido: 'MEI', acao: '' },
  { id: 'V7', razaoSocial: 'Gestão Contábil Santos', documento: '56.789.012/0001-44', regimeFederalAntigo: 'Lucro Arbitrado', novoRegimeFederal: 'Lucro Presumido', agrupadorSugerido: 'Folha 5º dia útil', acao: '' },
];

const MOCK_HISTORICO: HistoricoItem[] = [
  { id: 'H1', usuario: 'Daniel Andrade', iniciais: 'DA', qtdClientes: 1, descricao: 'Os novos agrupadores foram vinculados e somados às tarefas já vinculadas.', data: '20/06/2025', hora: '14:07' },
  { id: 'H2', usuario: 'Daniel Andrade', iniciais: 'DA', qtdClientes: 2, descricao: 'Optou por não fazer alterações no vínculo de tarefas dos clientes.', data: '18/06/2025', hora: '08:22' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function CB({ checked, onChange, indeterminate }: { checked: boolean; onChange: () => void; indeterminate?: boolean }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked || indeterminate
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--border)' }} />}
    </div>
  );
}

function SortTh({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <th style={{ ...thS, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

function InfoBanner({ text, onDismiss }: { text: string; onDismiss?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />
      <span style={{ flex: 1, fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function AvatarCircle({ initials }: { initials: string }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{initials}</span>
    </div>
  );
}

// ─── Vínculos Pendentes Tab ───────────────────────────────────────────────────

function VinculosPendentes() {
  const [vinculos, setVinculos] = useState<VinculoPendente[]>(MOCK_VINCULOS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [acaoLote, setAcaoLote] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [saved, setSaved] = useState(false);

  const allSel = vinculos.length > 0 && vinculos.every(v => selected.has(v.id));
  const someSel = selected.size > 0 && !allSel;

  function toggleSel(id: string) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(vinculos.map(v => v.id))); }

  function setAcaoItem(id: string, acao: string) {
    setVinculos(p => p.map(v => v.id === id ? { ...v, acao } : v));
  }

  function applyAcaoLote() {
    if (!acaoLote || !selected.size) return;
    setVinculos(p => p.map(v => selected.has(v.id) ? { ...v, acao: acaoLote } : v));
  }

  const canSave = vinculos.some(v => v.acao && v.acao !== 'Selecione a opção');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!bannerDismissed && (
        <InfoBanner
          text="Existem vínculos pendentes que precisam de atualização de regimes fiscais. Selecione as empresas desejadas e escolha a ação apropriada para atualizar os regimes federais."
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Batch action row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Definir ação em lote</span>
        <div style={{ position: 'relative', minWidth: 280 }}>
          <select
            value={acaoLote}
            onChange={e => { setAcaoLote(e.target.value); if (e.target.value && selected.size) applyAcaoLote(); }}
            style={{ width: '100%', padding: '7px 32px 7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: acaoLote ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
            <option value="">Escolha a ação que deseja para as empresas selecionadas</option>
            {ACOES_OPCOES.slice(1).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronUp size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 36 }}><CB checked={allSel} indeterminate={someSel} onChange={toggleAll} /></th>
                <SortTh label="Razão social" />
                <SortTh label="CNPJ/CPF/CEI/Outros" />
                <SortTh label="Regime federal antigo" />
                <SortTh label="Novo regime federal" />
                <SortTh label="Agrupadores de tarefas sugeridos" />
                <SortTh label="Ação" />
              </tr>
            </thead>
            <tbody>
              {vinculos.map(v => (
                <tr
                  key={v.id}
                  style={{ borderBottom: '1px solid var(--border)', background: selected.has(v.id) ? 'rgba(214,64,0,0.03)' : undefined, transition: 'background 0.15s' }}>
                  <td style={{ paddingLeft: 12, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                    <CB checked={selected.has(v.id)} onChange={() => toggleSel(v.id)} />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{v.razaoSocial}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{v.documento}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{v.regimeFederalAntigo}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{v.novoRegimeFederal}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{v.agrupadorSugerido}</span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ position: 'relative', minWidth: 170 }}>
                      <select
                        value={v.acao || ''}
                        onChange={e => setAcaoItem(v.id, e.target.value)}
                        style={{ width: '100%', padding: '5px 28px 5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: v.acao ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option value="">Selecione a opção</option>
                        {ACOES_OPCOES.slice(1).map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <ChevronDown size={10} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <button
          disabled={!canSave}
          onClick={() => { if (canSave) setSaved(true); }}
          style={{
            padding: '10px 32px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-button)',
            background: canSave ? 'white' : 'var(--input-background)',
            fontSize: 'var(--text-label)',
            color: canSave ? 'var(--foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            letterSpacing: '0.02em',
          }}>
          SALVAR ALTERAÇÕES
        </button>
      </div>
    </div>
  );
}

// ─── Histórico de Alterações Tab ──────────────────────────────────────────────

function HistoricoAlteracoes() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const hoje = new Date();
  const mesPassado = new Date(hoje);
  mesPassado.setDate(hoje.getDate() - 31);

  const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  function toggle(id: string) {
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: 'white', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)', padding: '24px' }}>
      <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 4 }}>Histórico de alterações</p>
      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginBottom: 20 }}>
        Alterações realizadas no último mês ({fmt(mesPassado)} à {fmt(hoje)})
      </p>

      {MOCK_HISTORICO.map((item, idx) => (
        <div key={item.id} style={{ borderTop: idx === 0 ? '1px solid var(--border)' : '1px solid var(--border)', paddingTop: 16, paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
              <AvatarCircle initials={item.iniciais} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{item.usuario}</span>
                  <span style={{ display: 'inline-block', padding: '1px 10px', background: 'var(--muted)', borderRadius: 999, fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {item.qtdClientes} Cliente{item.qtdClientes !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', marginBottom: 8, lineHeight: 1.5 }}>{item.descricao}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={12} style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.data} - {item.hora}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggle(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              VER DETALHES
              {expanded.has(item.id)
                ? <ChevronUp size={12} style={{ color: 'var(--foreground)' }} />
                : <ChevronDown size={12} style={{ color: 'var(--foreground)' }} />}
            </button>
          </div>

          {expanded.has(item.id) && (
            <div style={{ marginTop: 12, marginLeft: 44, padding: '12px 16px', background: 'var(--input-background)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum detalhe adicional disponível.</p>
            </div>
          )}
        </div>
      ))}

      {MOCK_HISTORICO.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhuma alteração registrada no período.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdequacaoAgrupadores({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<MainTab>('pendentes');

  const pendingCount = MOCK_VINCULOS.length;

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

        {/* Main tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Vínculos pendentes tab */}
          <button
            onClick={() => setActiveTab('pendentes')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              border: 'none',
              background: activeTab === 'pendentes' ? 'var(--foreground)' : 'white',
              color: activeTab === 'pendentes' ? 'white' : 'var(--foreground)',
              fontSize: 'var(--text-label)',
              fontWeight: activeTab === 'pendentes' ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
              boxShadow: activeTab !== 'pendentes' ? '0 0 0 1px var(--border)' : 'none',
              transition: 'background 0.15s',
            }}>
            <AlertCircle size={13} />
            Vínculos pendentes ({pendingCount})
          </button>

          {/* Histórico tab */}
          <button
            onClick={() => setActiveTab('historico')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              border: 'none',
              background: activeTab === 'historico' ? 'var(--foreground)' : 'white',
              color: activeTab === 'historico' ? 'white' : 'var(--foreground)',
              fontSize: 'var(--text-label)',
              fontWeight: activeTab === 'historico' ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
              boxShadow: activeTab !== 'historico' ? '0 0 0 1px var(--border)' : 'none',
              transition: 'background 0.15s',
            }}>
            <Clock size={13} />
            Histórico de alterações
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'pendentes' ? <VinculosPendentes /> : <HistoricoAlteracoes />}

      </div>
    </div>
  );
}
