import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Plus, Search, Trash2, X, ChevronDown, Eye, Edit3, Send,
  Check, Users, Building2, FileText, Clock, Calendar, Bold,
  Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, Link, Image, Type, Quote, Minus,
  ChevronRight, AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CircularStatus = 'Enviado' | 'Rascunho' | 'Agendado';
type GrupoDestinatario = 'Todos os clientes' | 'Agrupador de clientes' | 'Interno';

interface Circular {
  id: number;
  assunto: string;
  ultimaAtualizacao: string;
  status: CircularStatus;
  grupo: GrupoDestinatario;
  qtdDestinatarios: number;
  qtdVisualizacoes: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockCirculares: Circular[] = [
  { id: 1, assunto: 'Atualização do prazo de entrega - DCTF Março/2026', ultimaAtualizacao: '10/03/2026 09:15', status: 'Enviado', grupo: 'Todos os clientes', qtdDestinatarios: 147, qtdVisualizacoes: 112 },
  { id: 2, assunto: 'Comunicado: Mudança no horário de atendimento', ultimaAtualizacao: '09/03/2026 14:30', status: 'Enviado', grupo: 'Todos os clientes', qtdDestinatarios: 147, qtdVisualizacoes: 98 },
  { id: 3, assunto: 'Solicitação de documentos - Lucro Real Março/2026', ultimaAtualizacao: '08/03/2026 11:00', status: 'Enviado', grupo: 'Agrupador de clientes', qtdDestinatarios: 42, qtdVisualizacoes: 38 },
  { id: 4, assunto: '[RASCUNHO] Aviso sobre alterações na legislação trabalhista', ultimaAtualizacao: '07/03/2026 16:45', status: 'Rascunho', grupo: 'Todos os clientes', qtdDestinatarios: 0, qtdVisualizacoes: 0 },
  { id: 5, assunto: 'Lembrete: Entrega de documentos para folha de pagamento', ultimaAtualizacao: '06/03/2026 10:00', status: 'Agendado', grupo: 'Agrupador de clientes', qtdDestinatarios: 63, qtdVisualizacoes: 0 },
  { id: 6, assunto: 'Reunião de alinhamento Q1 2026 - Equipe interna', ultimaAtualizacao: '05/03/2026 09:00', status: 'Enviado', grupo: 'Interno', qtdDestinatarios: 12, qtdVisualizacoes: 12 },
  { id: 7, assunto: 'Comunicado: Novo portal do cliente disponível', ultimaAtualizacao: '01/03/2026 08:00', status: 'Enviado', grupo: 'Todos os clientes', qtdDestinatarios: 147, qtdVisualizacoes: 130 },
  { id: 8, assunto: '[RASCUNHO] Informativo sobre SPED Fiscal - Prazo abril', ultimaAtualizacao: '28/02/2026 17:00', status: 'Rascunho', grupo: 'Agrupador de clientes', qtdDestinatarios: 0, qtdVisualizacoes: 0 },
];

const allAnos = ['2026', '2025', '2024'];
const allMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const allStatuses: CircularStatus[] = ['Enviado', 'Rascunho', 'Agendado'];
const allGrupos: GrupoDestinatario[] = ['Todos os clientes', 'Agrupador de clientes', 'Interno'];

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<CircularStatus, { color: string; bg: string }> = {
  'Enviado':   { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.10)' },
  'Rascunho':  { color: 'var(--muted-foreground)', bg: 'rgba(153,153,153,0.12)' },
  'Agendado':  { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.10)' },
};

const grupoConfig: Record<GrupoDestinatario, { color: string; bg: string; icon: React.ElementType }> = {
  'Todos os clientes':    { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.08)', icon: Users },
  'Agrupador de clientes': { color: 'var(--primary)', bg: 'rgba(214,64,0,0.08)', icon: Building2 },
  'Interno':              { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', icon: Users },
};

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function RichTextEditor({ onChange, placeholder = 'Defina o seu e-mail' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    const html = editorRef.current?.innerHTML ?? '';
    onChange(html);
    setIsEmpty(!html || html === '<br>');
  }, [onChange]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? '';
    onChange(html);
    setIsEmpty(!html || html === '<br>' || html.replace(/<[^>]*>/g, '').trim() === '');
  };

  const toolbarGroups = [
    [
      { title: 'Negrito', cmd: 'bold', icon: Bold },
      { title: 'Itálico', cmd: 'italic', icon: Italic },
      { title: 'Sublinhado', cmd: 'underline', icon: Underline },
      { title: 'Tachado', cmd: 'strikeThrough', icon: Strikethrough },
    ],
    [
      { title: 'Subscrito', cmd: 'subscript', label: 'X₂' },
      { title: 'Sobrescrito', cmd: 'superscript', label: 'X²' },
    ],
    [
      { title: 'Título 1', cmd: 'formatBlock', value: 'H1', label: 'H1' },
      { title: 'Título 2', cmd: 'formatBlock', value: 'H2', label: 'H2' },
      { title: 'Citação', cmd: 'formatBlock', value: 'BLOCKQUOTE', icon: Quote },
    ],
    [
      { title: 'Lista ordenada', cmd: 'insertOrderedList', icon: ListOrdered },
      { title: 'Lista não-ordenada', cmd: 'insertUnorderedList', icon: List },
      { title: 'Diminuir recuo', cmd: 'outdent', icon: AlignLeft },
      { title: 'Aumentar recuo', cmd: 'indent', icon: AlignRight },
    ],
    [
      { title: 'Inserir link', cmd: 'createLink', special: 'link', icon: Link },
      { title: 'Inserir imagem', cmd: 'insertImage', special: 'image', icon: Image },
      { title: 'Inserir linha', cmd: 'insertHorizontalRule', label: '()' },
      { title: 'Limpar formatação', cmd: 'removeFormat', icon: Type },
    ],
  ];

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 flex-wrap" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
        {toolbarGroups.map((group, gi) => (
          <div key={gi} style={{ display: 'contents' }}>
            {gi > 0 && <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />}
            {group.map((btn, bi) => {
              const Icon = 'icon' in btn ? btn.icon : null;
              return (
                <button
                  key={bi}
                  title={btn.title}
                  onMouseDown={e => {
                    e.preventDefault();
                    if (btn.special === 'link') {
                      const url = prompt('URL do link:');
                      if (url) exec(btn.cmd, url);
                    } else if (btn.special === 'image') {
                      const url = prompt('URL da imagem:');
                      if (url) exec(btn.cmd, url);
                    } else if ('value' in btn && btn.value) {
                      exec(btn.cmd, btn.value);
                    } else {
                      exec(btn.cmd);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
                  style={{ background: 'none', border: 'none', color: 'var(--foreground)' }}
                >
                  {Icon ? <Icon size={13} /> : <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)' }}>{'label' in btn ? btn.label : ''}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {/* Editable area */}
      <div className="relative" style={{ minHeight: '140px' }}>
        {isEmpty && (
          <p className="absolute left-4 top-4 pointer-events-none select-none" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="outline-none px-4 py-4"
          style={{ minHeight: '140px', fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.6 }}
        />
      </div>
      {/* Bottom bar */}
      <div className="px-4 py-2 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        style={{ background: '#3d3d3d', borderTop: '1px solid #555' }}>
        <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          Editar Conteúdo
        </span>
      </div>
    </div>
  );
}

// ─── Nova Circular Drawer ─────────────────────────────────────────────────────

interface NovaCircularDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (circular: Omit<Circular, 'id' | 'qtdVisualizacoes'>) => void;
}

function NovaCircularDrawer({ open, onClose, onSave }: NovaCircularDrawerProps) {
  const [assunto, setAssunto] = useState('');
  const [grupo, setGrupo] = useState<GrupoDestinatario>('Todos os clientes');
  const [envioImediato, setEnvioImediato] = useState(true);
  const [dataAgendada, setDataAgendada] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [destinatariosCustom, setDestinatariosCustom] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSend = (draft: boolean) => {
    const errs: string[] = [];
    if (!assunto.trim()) errs.push('Preencha o assunto da mensagem');
    if (!conteudo.trim()) errs.push('Preencha o conteúdo');
    if (!envioImediato && !dataAgendada) errs.push('Selecione a data de agendamento');
    if (errs.length) { setErrors(errs); return; }

    const qtd = grupo === 'Todos os clientes' ? 147 : grupo === 'Agrupador de clientes' ? 42 : 12;
    onSave({
      assunto: draft ? `[RASCUNHO] ${assunto}` : assunto,
      ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: draft ? 'Rascunho' : envioImediato ? 'Enviado' : 'Agendado',
      grupo,
      qtdDestinatarios: draft ? 0 : qtd,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAssunto(''); setGrupo('Todos os clientes'); setEnvioImediato(true);
    setDataAgendada(''); setConteudo(''); setDestinatariosCustom(''); setErrors([]);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <div style={{ display: 'contents' }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{
          width: 'min(640px, 100vw)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.14)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Nova Circular
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <X size={16} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          <div className="flex flex-col gap-5">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-3 rounded-lg flex items-start gap-2" style={{ background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.25)' }}>
                <AlertTriangle size={14} style={{ color: 'var(--chart-4)', flexShrink: 0, marginTop: 2 }} />
                <ul className="flex flex-col gap-1">
                  {errors.map((e, i) => <li key={i} style={{ fontSize: 'var(--text-label)', color: 'var(--chart-4)' }}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* Destinatários */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Destinatários <span style={{ color: 'var(--chart-4)' }}>*</span>
              </label>
              <div className="flex flex-col gap-2">
                {allGrupos.map(g => {
                  const gc = grupoConfig[g];
                  const Icon = gc.icon;
                  return (
                    <button
                      key={g}
                      onClick={() => setGrupo(g)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all text-left"
                      style={{
                        border: `1.5px solid ${grupo === g ? 'var(--primary)' : 'var(--border)'}`,
                        background: grupo === g ? 'rgba(214,64,0,0.04)' : 'white',
                      }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: gc.bg }}>
                        <Icon size={14} style={{ color: gc.color }} />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{g}</p>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                          {g === 'Todos os clientes' ? '147 destinatários' : g === 'Agrupador de clientes' ? 'Selecione o agrupador' : '12 funcionários'}
                        </p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: grupo === g ? 'var(--primary)' : 'var(--border)', background: grupo === g ? 'var(--primary)' : 'white' }}>
                        {grupo === g && <Check size={11} style={{ color: 'white' }} />}
                      </div>
                    </button>
                  );
                })}
                {grupo === 'Agrupador de clientes' && (
                  <div className="flex flex-col gap-1 mt-1">
                    <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Selecionar agrupador</label>
                    <select className="rounded-md px-3 py-2 appearance-none outline-none"
                      style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                      <option value="">Todos os agrupadores</option>
                      {['Lucro Real', 'Lucro Presumido', 'Simples Nacional', 'MEI'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Assunto */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Assunto da mensagem <span style={{ color: 'var(--chart-4)' }}>*</span>
              </label>
              <input
                value={assunto}
                onChange={e => setAssunto(e.target.value)}
                placeholder="Ex: Comunicado sobre entrega de documentos - Março/2026"
                className="w-full px-3 py-2 rounded-md outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}
              />
            </div>

            {/* Envio */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Envio
              </label>
              <div className="flex gap-3">
                {[{ label: 'Enviar imediatamente', value: true }, { label: 'Agendar envio', value: false }].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setEnvioImediato(opt.value)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${envioImediato === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: envioImediato === opt.value ? 'rgba(214,64,0,0.04)' : 'white',
                      flex: 1,
                    }}
                  >
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: envioImediato === opt.value ? 'var(--primary)' : 'var(--border)', background: envioImediato === opt.value ? 'var(--primary)' : 'white' }}>
                      {envioImediato === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{opt.label}</span>
                  </button>
                ))}
              </div>
              {!envioImediato && (
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Data e hora do envio</label>
                  <input type="datetime-local" value={dataAgendada} onChange={e => setDataAgendada(e.target.value)}
                    className="rounded-md px-3 py-2 outline-none"
                    style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Conteúdo <span style={{ color: 'var(--chart-4)' }}>*</span>
              </label>
              <RichTextEditor value={conteudo} onChange={setConteudo} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-end gap-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => handleSend(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'white', fontWeight: 'var(--font-weight-semibold)' }}
          >
            <FileText size={14} /> Salvar Rascunho
          </button>
          <button
            onClick={() => handleSend(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}
          >
            <Send size={14} /> Enviar E-mail
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Circular ────────────────────────────────────────────────────────────

export function Circular() {
  const [circulares, setCirculares] = useState<Circular[]>(mockCirculares);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showDrawer, setShowDrawer] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  // Filters
  const [anoFiltro, setAnoFiltro] = useState('');
  const [mesFiltro, setMesFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [grupoFiltro, setGrupoFiltro] = useState('');

  const filtered = useMemo(() => circulares.filter(c => {
    if (statusFiltro && c.status !== statusFiltro) return false;
    if (grupoFiltro && c.grupo !== grupoFiltro) return false;
    if (anoFiltro && !c.ultimaAtualizacao.includes(`/${anoFiltro}`)) return false;
    if (mesFiltro) {
      const mesNum = (allMeses.indexOf(mesFiltro) + 1).toString().padStart(2, '0');
      if (!c.ultimaAtualizacao.startsWith(`${mesNum}/`)) return false;
    }
    return true;
  }), [circulares, anoFiltro, mesFiltro, statusFiltro, grupoFiltro]);

  const clearFilters = () => { setAnoFiltro(''); setMesFiltro(''); setStatusFiltro(''); setGrupoFiltro(''); };
  const hasFilters = anoFiltro || mesFiltro || statusFiltro || grupoFiltro;

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(c => c.id)));
  };

  const deleteOne = (id: number) => {
    setCirculares(prev => prev.filter(c => c.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setConfirmDelete(null);
  };

  const deleteBulk = () => {
    setCirculares(prev => prev.filter(c => !selected.has(c.id)));
    setSelected(new Set());
    setConfirmBulk(false);
  };

  const handleSave = (data: Omit<Circular, 'id' | 'qtdVisualizacoes'>) => {
    setCirculares(prev => [{ ...data, id: Date.now(), qtdVisualizacoes: 0 }, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Circular
          </h2>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} circular{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity self-start sm:self-auto"
          style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}
        >
          <Plus size={14} /> Nova Circular
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg px-4 py-3" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1" style={{ minWidth: '120px', flex: '0 1 140px' }}>
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Ano</label>
            <select value={anoFiltro} onChange={e => setAnoFiltro(e.target.value)}
              className="rounded-md px-3 py-2 appearance-none outline-none"
              style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: anoFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              <option value="">Todos</option>
              {allAnos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1" style={{ minWidth: '140px', flex: '0 1 160px' }}>
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Mês</label>
            <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}
              className="rounded-md px-3 py-2 appearance-none outline-none"
              style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: mesFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              <option value="">Todos</option>
              {allMeses.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1" style={{ minWidth: '130px', flex: '0 1 150px' }}>
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Status</label>
            <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}
              className="rounded-md px-3 py-2 appearance-none outline-none"
              style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: statusFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              <option value="">Todos</option>
              {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1" style={{ minWidth: '160px', flex: '0 1 200px' }}>
            <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Grupo</label>
            <select value={grupoFiltro} onChange={e => setGrupoFiltro(e.target.value)}
              className="rounded-md px-3 py-2 appearance-none outline-none"
              style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: grupoFiltro ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              <option value="">Todos</option>
              {allGrupos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 whitespace-nowrap"
              style={{ border: '1px solid var(--chart-4)', fontSize: 'var(--text-label)', color: 'var(--chart-4)', background: 'none' }}>
              <X size={13} /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg flex-wrap" style={{ background: 'rgba(214,64,0,0.06)', border: '1px solid rgba(214,64,0,0.2)' }}>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
            {selected.size} {selected.size === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
          <button
            onClick={() => setConfirmBulk(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80"
            style={{ background: 'var(--chart-4)', color: 'white', border: 'none', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Trash2 size={13} /> Excluir selecionados
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="flex items-center gap-1 cursor-pointer hover:opacity-70"
            style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', background: 'none', border: 'none' }}>
            <X size={12} /> Cancelar seleção
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
                <th className="px-4 py-3 text-left" style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="cursor-pointer"
                    style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }}
                  />
                </th>
                {[
                  { label: 'Assunto da mensagem', flex: true },
                  { label: 'Última atualização' },
                  { label: 'Status' },
                  { label: 'Grupo' },
                  { label: 'Destinatários', align: 'center' },
                  { label: 'Visualizações', align: 'center' },
                  { label: 'Ações', align: 'center' },
                ].map(h => (
                  <th key={h.label} className="px-4 py-3 text-left whitespace-nowrap"
                    style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', textAlign: (h.align as any) ?? 'left' }}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                    Nenhuma circular encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : filtered.map((c, idx) => {
                const sc = statusConfig[c.status];
                const gc = grupoConfig[c.grupo];
                const GIcon = gc.icon;
                const isSelected = selected.has(c.id);
                return (
                  <tr
                    key={c.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: isSelected ? 'rgba(214,64,0,0.03)' : 'white' }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)}
                        className="cursor-pointer" style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }} />
                    </td>
                    <td className="px-4 py-3" style={{ maxWidth: '320px' }}>
                      <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.35 }}>
                        {c.assunto}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                      {c.ultimaAtualizacao}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full"
                        style={{ fontSize: 'var(--text-caption)', color: sc.color, background: sc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                        style={{ fontSize: 'var(--text-caption)', color: gc.color, background: gc.bg, fontWeight: 'var(--font-weight-semibold)' }}>
                        <GIcon size={10} /> {c.grupo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center" style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {c.qtdDestinatarios}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ fontSize: 'var(--text-label)', color: c.qtdVisualizacoes > 0 ? 'var(--chart-1)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {c.qtdVisualizacoes}
                      </span>
                      {c.qtdDestinatarios > 0 && (
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginLeft: '4px' }}>
                          ({Math.round((c.qtdVisualizacoes / c.qtdDestinatarios) * 100)}%)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button title="Visualizar"
                          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
                          style={{ border: '1px solid var(--border)', background: 'none' }}>
                          <Eye size={13} style={{ color: 'var(--muted-foreground)' }} />
                        </button>
                        <button title="Editar"
                          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
                          style={{ border: '1px solid var(--border)', background: 'none' }}>
                          <Edit3 size={13} style={{ color: 'var(--chart-2)' }} />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => setConfirmDelete(c.id)}
                          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-red-50 transition-colors"
                          style={{ border: '1px solid var(--border)', background: 'none' }}>
                          <Trash2 size={13} style={{ color: 'var(--chart-4)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete single confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4" style={{ maxWidth: '400px', width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Confirmar exclusão
            </h3>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
              Tem certeza que deseja excluir esta circular? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-muted"
                style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
                Cancelar
              </button>
              <button onClick={() => deleteOne(confirmDelete)}
                className="px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
                style={{ background: 'var(--chart-4)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete bulk confirm */}
      {confirmBulk && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4" style={{ maxWidth: '400px', width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Confirmar exclusão em lote
            </h3>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
              Tem certeza que deseja excluir <strong>{selected.size} {selected.size === 1 ? 'circular' : 'circulares'}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmBulk(false)}
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-muted"
                style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
                Cancelar
              </button>
              <button onClick={deleteBulk}
                className="px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
                style={{ background: 'var(--chart-4)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                Excluir {selected.size} {selected.size === 1 ? 'item' : 'itens'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nova Circular Drawer */}
      <NovaCircularDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSave={handleSave}
      />
    </div>
  );
}