import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Plus, ChevronDown, Info, X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoTemplate = 'Conclusão de tarefa' | 'Conclusão de tarefa WhatsApp' | 'Cobrança de documentos' | 'Todos';

interface Template {
  id: string;
  nome: string;
  tipo: TipoTemplate;
  aplicarTodasTarefas: boolean;
  tarefasComTemplate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TIPOS_TEMPLATE: TipoTemplate[] = ['Conclusão de tarefa', 'Conclusão de tarefa WhatsApp', 'Cobrança de documentos'];
const TAREFAS_OPCOES = ['', 'Fiscal', 'Trabalhista', 'Contábil', 'RH', 'DIRT, DMED, EFD - REINF+ 10', 'Todos os departamentos'];

const MOCK_TEMPLATES: Template[] = [
  { id: 'T1', nome: 'Finalizar tarefa', tipo: 'Conclusão de tarefa', aplicarTodasTarefas: true, tarefasComTemplate: '' },
  { id: 'T2', nome: 'Fechamento de Folha', tipo: 'Conclusão de tarefa', aplicarTodasTarefas: false, tarefasComTemplate: '' },
  { id: 'T3', nome: 'Admissão', tipo: 'Cobrança de documentos', aplicarTodasTarefas: false, tarefasComTemplate: 'DIRT, DMED, EFD - REINF+ 10' },
  { id: 'T4', nome: 'Rescisão', tipo: 'Conclusão de tarefa WhatsApp', aplicarTodasTarefas: true, tarefasComTemplate: '' },
  { id: 'T5', nome: 'Abertura de empresa', tipo: 'Conclusão de tarefa WhatsApp', aplicarTodasTarefas: false, tarefasComTemplate: 'Fiscal' },
  { id: 'T6', nome: 'Envios de documento FGTS', tipo: 'Conclusão de tarefa', aplicarTodasTarefas: true, tarefasComTemplate: '' },
  { id: 'T7', nome: 'Férias', tipo: 'Conclusão de tarefa', aplicarTodasTarefas: false, tarefasComTemplate: '' },
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

function InfoBanner({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 36, height: 20, background: checked ? 'var(--chart-1)' : 'var(--muted)', borderRadius: 999, transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', width: 14, height: 14, background: 'white', borderRadius: '50%', top: 3, left: checked ? 19 : 3, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>
    </button>
  );
}

function SortTh({ label }: { label: string }) {
  return (
    <th style={thS}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

// ─── Rich text toolbar ────────────────────────────────────────────────────────

function RichToolbar() {
  const tools = [
    { icon: <Bold size={12} />, title: 'Negrito' },
    { icon: <Italic size={12} />, title: 'Itálico' },
    { icon: <Underline size={12} />, title: 'Sublinhado' },
    { icon: <span style={{ fontSize: 10, fontWeight: 700 }}>S</span>, title: 'Tachado' },
    { icon: <span style={{ fontSize: 10 }}>x₁</span>, title: 'Subscrito' },
    { icon: <span style={{ fontSize: 10 }}>x²</span>, title: 'Sobrescrito' },
    { icon: <span style={{ fontSize: 10, fontWeight: 700 }}>H₅</span>, title: 'H5' },
    { icon: <span style={{ fontSize: 10, fontWeight: 700 }}>H₆</span>, title: 'H6' },
    { icon: <span style={{ fontSize: 11, fontWeight: 700 }}>¶</span>, title: 'Parágrafo' },
    { icon: <List size={12} />, title: 'Lista' },
    { icon: <AlignLeft size={12} />, title: 'Alinhar esquerda' },
    { icon: <AlignCenter size={12} />, title: 'Centralizar' },
    { icon: <AlignRight size={12} />, title: 'Alinhar direita' },
    { icon: <Link size={12} />, title: 'Link' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '6px 8px', borderBottom: '1px solid var(--border)', background: 'white' }}>
      {tools.map((t, i) => (
        <button key={i} title={t.title}
          style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', color: 'var(--foreground)' }}>
          {t.icon}
        </button>
      ))}
    </div>
  );
}

// ─── Chip (inline variable highlight) ────────────────────────────────────────

function VarChip({ label }: { label: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 3, background: 'rgba(214,64,0,0.12)', color: 'var(--primary)', fontSize: 'var(--text-caption)', fontFamily: 'monospace' }}>
      {label}
    </span>
  );
}

// ─── Edit/New Template View ───────────────────────────────────────────────────

function EditTemplate({ template, onClose }: { template?: Template; onClose: () => void }) {
  const isNew = !template;
  const [radioAll, setRadioAll] = useState(true);
  const [nome, setNome] = useState(template?.nome ?? '');
  const [tipo, setTipo] = useState(template?.tipo ?? '');
  const [assunto, setAssunto] = useState(isNew ? '' : 'alias teste');
  const [conteudo, setConteudo] = useState(isNew ? '' : '');

  const DATE_LABEL = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f9fafc' }}>
      {/* Top header */}
      <div style={{ background: '#f9fafc', padding: '20px 28px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.3, marginBottom: 4 }}>
            {isNew ? 'Novo template de documento' : `Editar: ${template.nome}`}
          </h1>
          {!isNew && (
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>
              {template.nome} · {DATE_LABEL}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginTop: 4 }}>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
            <X size={13} /> Fechar
          </button>
          <button onClick={onClose}
            style={{ padding: '7px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
            CANCELAR
          </button>
          <button style={{ padding: '7px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
            SALVAR
          </button>
        </div>
      </div>

      {/* Sub info + radio */}
      <div style={{ padding: '12px 28px', background: '#f9fafc', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Todos as tarefas', value: true },
          { label: 'Escolher por tarefa', value: false },
        ].map(opt => (
          <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div onClick={() => setRadioAll(opt.value)}
              style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${radioAll === opt.value ? 'var(--primary)' : 'var(--border)'}`, background: radioAll === opt.value ? 'var(--primary)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              {radioAll === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
            </div>
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left panel - form */}
        <div style={{ flex: '1 1 340px', minWidth: 280 }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', marginTop: 12 }}>
            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Nome*', value: nome, setValue: setNome, placeholder: isNew ? '' : 'teste vencimento', type: 'text' },
                { label: 'Tipo*', value: tipo, setValue: setTipo, placeholder: 'Conclusão de tarefa', type: 'select' },
                { label: 'Assunto*', value: assunto, setValue: setAssunto, placeholder: '', type: 'text' },
              ].map((f, i) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', padding: '8px 14px', gap: 12 }}>
                  <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', minWidth: 80, flexShrink: 0 }}>{f.label}</label>
                  {f.type === 'select' ? (
                    <div style={{ flex: 1, position: 'relative' }}>
                      <select value={f.value} onChange={e => (f.setValue as (v: string) => void)(e.target.value)}
                        style={{ width: '100%', padding: '5px 28px 5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option value="">Conclusão de tarefa</option>
                        {TIPOS_TEMPLATE.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                    </div>
                  ) : (
                    <input value={f.value} onChange={e => (f.setValue as (v: string) => void)(e.target.value)} placeholder={f.placeholder}
                      style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
                  )}
                </div>
              ))}

              {/* Conteúdo */}
              <div style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 14px 0', gap: 12 }}>
                  <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', minWidth: 80, flexShrink: 0, paddingTop: 6 }}>Conteúdo*</label>
                  <div style={{ flex: 1 }}>
                    <RichToolbar />
                    <div style={{ minHeight: 120, padding: '10px 12px', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.6 }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-caption)', fontWeight: 700, color: 'var(--foreground)' }}>Aaaa </span>
                        <VarChip label="${Cliente}" />
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>•••••••••• </span>
                        <VarChip label="${DataDeVencimentoDoDocumento}" />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: 0 }}>Abaixo o link do(s) documento(s) referentes(s) a esta tarefa documento.pdf.</p>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: '4px 0 0' }}>Obrigado.</p>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: '4px 0 0' }}>{'[INTERNO] ROBERTO TESTE MESSENGER OFICIAL'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key hints */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <Info size={12} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.5 }}>
                    Saiba quais palavras chave você pode utilizar para criar o conteúdo dos e-mails para seus clientes. Digite '$' para inserí-las.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button style={{ padding: '5px 14px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>Salvar</button>
                  <button onClick={onClose} style={{ padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', cursor: 'pointer' }}>Cancelar</button>
                  <button style={{ padding: '5px 14px', border: '1px solid rgba(220,10,10,0.3)', borderRadius: 'var(--radius-button)', background: 'rgba(220,10,10,0.04)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', cursor: 'pointer' }}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - preview */}
        <div style={{ flex: '1 1 300px', minWidth: 260, marginTop: 12 }}>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Preview</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginBottom: 12 }}>
                <b>Assunto :</b> {assunto || 'alias teste'}
              </p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ background: 'var(--input-background)', padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 100 100" width="60" height="60" fill="none" opacity={0.3}>
                      <path d="M50 10 L90 90 L50 70 L10 90 Z" fill="var(--foreground)" />
                    </svg>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 'var(--text-caption)', fontWeight: 700, color: 'var(--foreground)' }}>Aaaa </span>
                    <VarChip label="${Cliente}" />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>•••••••••• </span>
                    <VarChip label="${DataDeVencimentoDoDocumento}" />
                  </div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: '0 0 4px' }}>Abaixo o link do(s) documento(s) referentes(s) a esta tarefa documento.pdf.</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: '0 0 4px' }}>Obrigado.</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', margin: 0 }}>{'[INTERNO] ROBERTO TESTE MESSENGER OFICIAL'}</p>
                </div>
                <div style={{ padding: '8px 16px', background: 'var(--input-background)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Precisa de ajuda?</p>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>Entre em contato com nosso suporte!</p>
                  </div>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>THOMSON REUTERS™</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TemplatesEmailWhatsapp({ onBack }: { onBack: () => void }) {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('Todos');
  const [editing, setEditing] = useState<Template | 'new' | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return templates.filter(t => {
      if (tipoFilter && tipoFilter !== 'Todos' && t.tipo !== tipoFilter) return false;
      if (q && !t.nome.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [templates, search, tipoFilter]);

  function toggleAplicar(id: string) {
    setTemplates(p => p.map(t => t.id === id ? { ...t, aplicarTodasTarefas: !t.aplicarTodasTarefas } : t));
  }

  function setTarefaTemplate(id: string, val: string) {
    setTemplates(p => p.map(t => t.id === id ? { ...t, tarefasComTemplate: val } : t));
  }

  if (editing !== null) {
    return (
      <EditTemplate
        template={editing === 'new' ? undefined : editing}
        onClose={() => setEditing(null)}
      />
    );
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
        <InfoBanner text="Personalize as mensagens de e-mail ou WhatsApp que são enviadas para os seus clientes ao finalizar uma tarefa." />

        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Templates de e-mail e WhatsApp</p>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 'min(280px, 100%)' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome do template"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Tipo:</span>
            <div style={{ position: 'relative', minWidth: 220 }}>
              <select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}
                style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                <option value="Todos">Todos</option>
                {TIPOS_TEMPLATE.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setEditing('new')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={13} /> NOVO TEMPLATE
          </button>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <SortTh label="Nome da tarefa" />
                  <SortTh label="Tipo de template" />
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Aplicar a todas as tarefas <ChevronDown size={10} /></div>
                  </th>
                  <SortTh label="Tarefas com o template" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum template encontrado</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <button onClick={() => setEditing(t)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline' }}>
                        {t.nome}
                      </button>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{t.tipo}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <Toggle checked={t.aplicarTodasTarefas} onChange={() => toggleAplicar(t.id)} />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {t.aplicarTodasTarefas ? (
                        <div style={{ position: 'relative', opacity: 0.4, pointerEvents: 'none' }}>
                          <select disabled
                            style={{ width: '100%', padding: '5px 28px 5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'not-allowed', minWidth: 140 }}>
                            <option>Selecione</option>
                          </select>
                          <ChevronDown size={10} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <select value={t.tarefasComTemplate} onChange={e => setTarefaTemplate(t.id, e.target.value)}
                            style={{ width: '100%', padding: '5px 28px 5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: t.tarefasComTemplate ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: 140 }}>
                            <option value="">Selecione</option>
                            {TAREFAS_OPCOES.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <ChevronDown size={10} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
