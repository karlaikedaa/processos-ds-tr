import React, { useState, useMemo } from 'react';
import {
  Plus, Search, Download, Star, Share2, Eye, X, ChevronDown,
  ChevronRight, Users, FileText, BarChart3, DollarSign, Clock,
  Calendar, Filter, AlertTriangle, CheckCircle2, Bookmark,
  TrendingUp, Building2, User, Award, Receipt, Shield, Sparkles,
  MoreHorizontal, Trash2, Edit3, ExternalLink, BookOpen, Tag,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportCategory = 'clientes-usuarios' | 'status-geral' | 'tarefas' | 'financeiro';
type TabId = 'sistema' | 'salvos' | 'compartilhados';

interface SystemReport {
  id: string;
  nome: string;
  descricao: string;
  categoria: ReportCategory;
  isNew?: boolean;
  tags?: string[];
}

interface SavedReport {
  id: number;
  nome: string;
  baseReport: string;
  categoria: ReportCategory;
  ultimaExecucao: string;
  criadoEm: string;
  compartilhado: boolean;
  parametros?: string;
}

interface SharedReport {
  id: number;
  nome: string;
  baseReport: string;
  categoria: ReportCategory;
  compartilhadoPor: string;
  dataCompartilhamento: string;
  permissao: 'visualizar' | 'editar';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categorias: Record<ReportCategory, { label: string; color: string; bg: string; icon: React.ElementType; borderColor: string }> = {
  'clientes-usuarios': { label: 'Clientes e Usuários',           color: 'var(--chart-2)',  bg: 'rgba(21,115,211,0.07)',   icon: Users,       borderColor: 'rgba(21,115,211,0.25)' },
  'status-geral':      { label: 'Status Gerais de Baixa',        color: '#8B5CF6',         bg: 'rgba(139,92,246,0.07)',   icon: BarChart3,   borderColor: 'rgba(139,92,246,0.25)' },
  'tarefas':           { label: 'Tarefas',                       color: 'var(--primary)',  bg: 'rgba(214,64,0,0.06)',     icon: CheckCircle2, borderColor: 'rgba(214,64,0,0.22)' },
  'financeiro':        { label: 'Financeiros e Gestão',          color: 'var(--chart-1)',  bg: 'rgba(56,124,43,0.07)',    icon: DollarSign,  borderColor: 'rgba(56,124,43,0.25)' },
};

const systemReports: SystemReport[] = [
  // Clientes e Usuários
  { id: 'apm-cliente',   nome: 'Apontamento mensal por cliente',   descricao: 'Visualize as horas e apontamentos de cada cliente no período selecionado.', categoria: 'clientes-usuarios', tags: ['apontamento', 'mensal'] },
  { id: 'apm-usuario',   nome: 'Apontamento mensal por usuário',   descricao: 'Consolida os apontamentos de todos os usuários por período, facilitando análise de produtividade.',   categoria: 'clientes-usuarios', tags: ['apontamento', 'usuário'] },
  { id: 'pont-cliente',  nome: 'Pontuação mensal por cliente',     descricao: 'Exibe a pontuação acumulada de cada cliente com base nas tarefas concluídas no mês.', categoria: 'clientes-usuarios', isNew: true, tags: ['pontuação', 'cliente'] },
  { id: 'pont-usuario',  nome: 'Pontuação mensal por usuário',     descricao: 'Acompanhe a pontuação mensal de cada colaborador com base nas atividades realizadas.', categoria: 'clientes-usuarios', tags: ['pontuação', 'usuário'] },
  // Status Geral
  { id: 'sg-template',   nome: 'Status geral de baixa com template vinculado',              descricao: 'Lista todas as tarefas com status de baixa que possuem template de documento vinculado.', categoria: 'status-geral', tags: ['status', 'template'] },
  { id: 'sg-dept',       nome: 'Status geral de baixa por departamento e usuário',          descricao: 'Exibe o status de baixa segmentado por departamento e responsável.', categoria: 'status-geral', tags: ['status', 'departamento'] },
  { id: 'sg-docs',       nome: 'Status geral de baixa dos documentos',                      descricao: 'Relatório completo do status de entrega e validação dos documentos solicitados.', categoria: 'status-geral', isNew: true, tags: ['documentos', 'status'] },
  // Tarefas
  { id: 'tf-multa',      nome: 'Tarefas fechadas com multa',        descricao: 'Identifica tarefas encerradas com incidência de multa por atraso na entrega.', categoria: 'tarefas', tags: ['multa', 'atraso'] },
  { id: 'tf-atraso',     nome: 'Tarefas fechadas em atraso',        descricao: 'Lista todas as tarefas concluídas após a data meta ou data legal estabelecida.', categoria: 'tarefas', tags: ['atraso', 'prazo'] },
  { id: 'tf-naobaixadas',nome: 'Tarefas não baixadas',              descricao: 'Exibe as tarefas que ainda não foram baixadas e estão com prazo em aberto ou vencido.', categoria: 'tarefas', isNew: true, tags: ['pendente', 'baixa'] },
  { id: 'tf-cliente',    nome: 'Tarefas por cliente',               descricao: 'Consolida todas as tarefas agrupadas por cliente, com status e datas relevantes.', categoria: 'tarefas', tags: ['cliente'] },
  { id: 'tf-colab',      nome: 'Tarefas por colaborador',           descricao: 'Exibe a distribuição de tarefas por colaborador, permitindo análise de carga de trabalho.', categoria: 'tarefas', tags: ['colaborador', 'responsável'] },
  { id: 'tf-empresa',    nome: 'Tarefas por empresa',               descricao: 'Agrupa e resume as tarefas de acordo com a empresa vinculada.', categoria: 'tarefas', tags: ['empresa'] },
  { id: 'tf-regime',     nome: 'Tarefas por regime',                descricao: 'Segmenta as tarefas conforme o regime tributário do cliente (Lucro Real, Presumido, Simples etc.).', categoria: 'tarefas', tags: ['regime', 'tributário'] },
  // Financeiro
  { id: 'fin-semtempl',  nome: 'Documentos sem template vinculado', descricao: 'Identifica documentos que ainda não possuem template configurado para envio automático.', categoria: 'financeiro', tags: ['documentos', 'template'] },
  { id: 'fin-certvencer',nome: 'Lista de certificados a vencer',    descricao: 'Exibe os certificados digitais com vencimento próximo para planejamento de renovação.', categoria: 'financeiro', isNew: true, tags: ['certificado', 'vencimento'] },
  { id: 'fin-certmensal',nome: 'Relação mensal de certificados a vencer', descricao: 'Relatório mensal com todos os certificados digitais com prazo de vencimento no período.', categoria: 'financeiro', tags: ['certificado', 'mensal'] },
  { id: 'fin-mensalidade',nome: 'Análise de cliente por mensalidade', descricao: 'Analisa o valor de mensalidade cobrado por cliente com histórico de variações.', categoria: 'financeiro', tags: ['mensalidade', 'financeiro'] },
  { id: 'fin-ss',        nome: 'Valor de SS por cliente',           descricao: 'Exibe o valor de Serviços de Suporte (SS) consolidado por cliente no período.', categoria: 'financeiro', tags: ['SS', 'valor', 'cliente'] },
];

const mockSavedReports: SavedReport[] = [
  { id: 1, nome: 'Tarefas por cliente - Março/2026', baseReport: 'Tarefas por cliente', categoria: 'tarefas', ultimaExecucao: '10/03/2026 09:15', criadoEm: '01/03/2026', compartilhado: true, parametros: 'Mar/2026 · Todos os clientes' },
  { id: 2, nome: 'Apontamento mensal - Equipe Fiscal', baseReport: 'Apontamento mensal por usuário', categoria: 'clientes-usuarios', ultimaExecucao: '08/03/2026 14:30', criadoEm: '10/02/2026', compartilhado: false, parametros: 'Fev/2026 · Departamento Fiscal' },
  { id: 3, nome: 'Certificados a vencer - Q1 2026', baseReport: 'Lista de certificados a vencer', categoria: 'financeiro', ultimaExecucao: '07/03/2026 11:00', criadoEm: '15/01/2026', compartilhado: true, parametros: 'Jan–Mar/2026' },
  { id: 4, nome: 'Status documentos - Lucro Real', baseReport: 'Status geral de baixa dos documentos', categoria: 'status-geral', ultimaExecucao: '05/03/2026 16:45', criadoEm: '20/02/2026', compartilhado: false, parametros: 'Lucro Real · Set–Mar/2026' },
  { id: 5, nome: 'Pontuação mensal - Fev/2026', baseReport: 'Pontuação mensal por usuário', categoria: 'clientes-usuarios', ultimaExecucao: '01/03/2026 08:00', criadoEm: '28/02/2026', compartilhado: false, parametros: 'Fev/2026 · Todos os usuários' },
];

const mockSharedReports: SharedReport[] = [
  { id: 1, nome: 'Análise consolidada Q4 2025', baseReport: 'Tarefas por regime', categoria: 'tarefas', compartilhadoPor: 'João Pedro', dataCompartilhamento: '05/03/2026', permissao: 'visualizar' },
  { id: 2, nome: 'Tarefas em atraso - Geral', baseReport: 'Tarefas fechadas em atraso', categoria: 'tarefas', compartilhadoPor: 'Fernanda Lima', dataCompartilhamento: '03/03/2026', permissao: 'editar' },
  { id: 3, nome: 'Mensalidades ativas - Mar/2026', baseReport: 'Análise de cliente por mensalidade', categoria: 'financeiro', compartilhadoPor: 'Carlos Rocha', dataCompartilhamento: '01/03/2026', permissao: 'visualizar' },
];

// ─── Report Preview Modal ─────────────────────────────────────────────────────

function ReportPreviewModal({ report, onClose, onSave }: {
  report: SystemReport; onClose: () => void; onSave: () => void;
}) {
  const cat = categorias[report.categoria];
  const CatIcon = cat.icon;
  const [period, setPeriod] = useState('');
  const [filterVal, setFilterVal] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg flex flex-col w-full"
        style={{ maxWidth: '560px', maxHeight: '85vh', boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg, border: `1px solid ${cat.borderColor}` }}>
              <CatIcon size={16} style={{ color: cat.color }} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-caption)', color: cat.color, fontWeight: 'var(--font-weight-semibold)', marginBottom: '2px' }}>{cat.label}</p>
              <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.3 }}>{report.nome}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer shrink-0 mt-0.5">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', marginBottom: '20px', lineHeight: 1.55 }}>
            {report.descricao}
          </p>

          {/* Params */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Período</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="month" className="rounded-md px-3 py-2 outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}
                  placeholder="Data início" />
                <input type="month" className="rounded-md px-3 py-2 outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}
                  placeholder="Data fim" />
              </div>
            </div>

            {(report.categoria === 'clientes-usuarios' || report.categoria === 'tarefas') && (
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                  {report.categoria === 'clientes-usuarios' ? 'Usuário / Cliente' : 'Cliente'}
                </label>
                <select className="rounded-md px-3 py-2 appearance-none outline-none"
                  style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                  <option value="">Todos</option>
                  {['Empresa ABC Ltda', 'Empresa XYZ S/A', 'DEF Comércio', 'GHI Serviços'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}

            {report.categoria === 'tarefas' && (
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Departamento</label>
                <select className="rounded-md px-3 py-2 appearance-none outline-none"
                  style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                  <option value="">Todos</option>
                  {['Fiscal', 'Contábil', 'DP', 'Societário', 'Paralegal'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            )}

            {/* Preview table placeholder */}
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Pré-visualização</span>
                <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-3)', background: 'rgba(254,166,1,0.10)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Dados de exemplo
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'white' }}>
                      {['Cliente', 'Período', 'Qtd.', 'Status'].map(h => (
                        <th key={h} className="px-3 py-2 text-left whitespace-nowrap" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Empresa ABC Ltda', 'Mar/2026', '14', 'Concluído'],
                      ['Empresa XYZ S/A',  'Mar/2026', '9',  'Em andamento'],
                      ['DEF Comércio',     'Mar/2026', '7',  'Pendente'],
                    ].map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: ri < 2 ? '1px solid var(--border)' : 'none' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 whitespace-nowrap" style={{ fontSize: 'var(--text-caption)', color: ci === 3 ? 'var(--chart-3)' : 'var(--foreground)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 shrink-0 flex-wrap" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer hover:bg-muted/40"
            style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
            <Bookmark size={13} /> Salvar relatório
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-3 py-2 rounded-md cursor-pointer hover:bg-muted/40"
              style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
              Cancelar
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
              style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
              <Download size={13} /> Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Novo Relatório Drawer ────────────────────────────────────────────────────

function NovoRelatorioDrawer({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (r: SavedReport) => void;
}) {
  const [nome, setNome] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<ReportCategory | ''>('');
  const [baseReport, setBaseReport] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [step, setStep] = useState(1);

  const reportesFiltered = categoriaFiltro
    ? systemReports.filter(r => r.categoria === categoriaFiltro)
    : systemReports;

  const handleSave = () => {
    if (!nome.trim() || !baseReport) return;
    const base = systemReports.find(r => r.id === baseReport);
    if (!base) return;
    onSave({
      id: Date.now(),
      nome,
      baseReport: base.nome,
      categoria: base.categoria,
      ultimaExecucao: '—',
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      compartilhado: false,
      parametros: periodo || undefined,
    });
    setNome(''); setCategoriaFiltro(''); setBaseReport(''); setPeriodo(''); setStep(1);
    onClose();
  };

  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(560px,100vw)', boxShadow: '-4px 0 32px rgba(0,0,0,0.14)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Novo Relatório</h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
              {step === 1 ? 'Selecione o relatório base' : 'Configure os parâmetros'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <X size={16} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-0 px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
          {[{ n: 1, label: 'Selecionar relatório' }, { n: 2, label: 'Configurar e salvar' }].map((s, i) => (
            <div key={s.n} style={{ display: 'contents' }}>
              {i > 0 && <ChevronRight size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />}
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: step >= s.n ? 'var(--primary)' : 'var(--muted)', }}>
                  <span style={{ fontSize: '10px', color: step >= s.n ? 'white' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{s.n}</span>
                </div>
                <span style={{ fontSize: 'var(--text-caption)', color: step >= s.n ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: step === s.n ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              {/* Filter by category */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>Filtrar por categoria</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoriaFiltro('')}
                    className="px-3 py-1.5 rounded-full cursor-pointer transition-all"
                    style={{ fontSize: 'var(--text-caption)', background: !categoriaFiltro ? 'var(--foreground)' : 'var(--muted)', color: !categoriaFiltro ? 'white' : 'var(--muted-foreground)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                    Todas
                  </button>
                  {(Object.keys(categorias) as ReportCategory[]).map(c => {
                    const cat = categorias[c];
                    const active = categoriaFiltro === c;
                    return (
                      <button key={c} onClick={() => setCategoriaFiltro(active ? '' : c)}
                        className="px-3 py-1.5 rounded-full cursor-pointer transition-all"
                        style={{ fontSize: 'var(--text-caption)', background: active ? cat.color : cat.bg, color: active ? 'white' : cat.color, border: `1px solid ${cat.borderColor}`, fontWeight: 'var(--font-weight-semibold)' }}>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report list */}
              <div className="flex flex-col gap-2">
                {reportesFiltered.map(r => {
                  const cat = categorias[r.categoria];
                  const CatIcon = cat.icon;
                  const isSelected = baseReport === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setBaseReport(r.id)}
                      className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all text-left w-full"
                      style={{ border: `1.5px solid ${isSelected ? cat.color : 'var(--border)'}`, background: isSelected ? cat.bg : 'white' }}>
                      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: cat.bg }}>
                        <CatIcon size={14} style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{r.nome}</span>
                          {r.isNew && (
                            <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--text-badge)', background: 'var(--primary)', color: 'white', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.04em' }}>NOVO</span>
                          )}
                        </div>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px', lineHeight: 1.45 }}>{r.descricao}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: isSelected ? cat.color : 'var(--border)', background: isSelected ? cat.color : 'white' }}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="p-3 rounded-lg flex items-center gap-3" style={{ background: categorias[systemReports.find(r => r.id === baseReport)!.categoria].bg, border: `1px solid ${categorias[systemReports.find(r => r.id === baseReport)!.categoria].borderColor}` }}>
                {(() => {
                  const r = systemReports.find(r => r.id === baseReport)!;
                  const cat = categorias[r.categoria];
                  const Icon = cat.icon;
                  return (
                    <div style={{ display: 'contents' }}>
                      <Icon size={16} style={{ color: cat.color, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 'var(--text-caption)', color: cat.color, fontWeight: 'var(--font-weight-semibold)' }}>{cat.label}</p>
                        <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{r.nome}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Nome do relatório <span style={{ color: 'var(--chart-4)' }}>*</span></label>
                <input value={nome} onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Tarefas por cliente - Março/2026"
                  className="w-full px-3 py-2 rounded-md outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Data início</label>
                  <input type="month" className="rounded-md px-3 py-2 outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Data fim</label>
                  <input type="month" className="rounded-md px-3 py-2 outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Departamento</label>
                <select className="rounded-md px-3 py-2 appearance-none outline-none"
                  style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                  <option value="">Todos os departamentos</option>
                  {['Fiscal', 'Contábil', 'DP', 'Societário', 'Paralegal'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Cliente</label>
                <select className="rounded-md px-3 py-2 appearance-none outline-none"
                  style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                  <option value="">Todos os clientes</option>
                  {['Empresa ABC Ltda', 'Empresa XYZ S/A', 'DEF Comércio', 'GHI Serviços', 'JKL Indústria'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Formato de exportação</label>
                <div className="flex gap-2">
                  {['Excel (.xlsx)', 'PDF', 'CSV'].map(fmt => (
                    <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="formato" defaultChecked={fmt === 'Excel (.xlsx)'}
                        style={{ accentColor: 'var(--primary)' }} />
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          {step === 1 ? (
            <div style={{ display: 'contents' }}>
              <button onClick={onClose}
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-muted/40"
                style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
                Cancelar
              </button>
              <button
                onClick={() => baseReport && setStep(2)}
                disabled={!baseReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                Continuar <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'contents' }}>
              <button onClick={() => setStep(1)}
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-muted/40"
                style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
                Voltar
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleSave}
                  disabled={!nome.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer hover:bg-muted/40 disabled:opacity-40"
                  style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>
                  <Bookmark size={13} /> Salvar
                </button>
                <button
                  disabled={!nome.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 disabled:opacity-40"
                  style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                  <Download size={13} /> Exportar agora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Relatórios do Sistema ───────────────────────────────────────────────

function RelatoriosSistema({ onSave }: { onSave: (r: SavedReport) => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<ReportCategory>>(new Set(['clientes-usuarios', 'status-geral', 'tarefas', 'financeiro']));
  const [previewReport, setPreviewReport] = useState<SystemReport | null>(null);

  const toggleCategory = (cat: ReportCategory) => {
    setExpandedCategories(prev => {
      const n = new Set(prev);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  };

  const filtered = useMemo(() => {
    return systemReports.filter(r => {
      if (activeCategory !== 'all' && r.categoria !== activeCategory) return false;
      if (search && !r.nome.toLowerCase().includes(search.toLowerCase()) && !r.descricao.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeCategory]);

  const byCategory = useMemo(() => {
    const map: Partial<Record<ReportCategory, SystemReport[]>> = {};
    filtered.forEach(r => {
      if (!map[r.categoria]) map[r.categoria] = [];
      map[r.categoria]!.push(r);
    });
    return map;
  }, [filtered]);

  const categoryOrder: ReportCategory[] = ['clientes-usuarios', 'status-geral', 'tarefas', 'financeiro'];

  return (
    <div className="flex flex-col gap-4">
      {/* Search + category pills */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar relatório..."
            className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
            style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory('all')}
            className="px-3 py-1.5 rounded-full cursor-pointer transition-all"
            style={{ fontSize: 'var(--text-caption)', background: activeCategory === 'all' ? 'var(--foreground)' : 'var(--muted)', color: activeCategory === 'all' ? 'white' : 'var(--muted-foreground)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
            Todos ({systemReports.length})
          </button>
          {categoryOrder.map(c => {
            const cat = categorias[c];
            const count = systemReports.filter(r => r.categoria === c).length;
            const active = activeCategory === c;
            return (
              <button key={c} onClick={() => setActiveCategory(active ? 'all' : c)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all"
                style={{ fontSize: 'var(--text-caption)', background: active ? cat.color : cat.bg, color: active ? 'white' : cat.color, border: `1px solid ${cat.borderColor}`, fontWeight: 'var(--font-weight-semibold)' }}>
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category groups */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg py-12 text-center" style={{ border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum relatório encontrado.</p>
        </div>
      ) : (
        categoryOrder.map(catKey => {
          const reports = byCategory[catKey];
          if (!reports?.length) return null;
          const cat = categorias[catKey];
          const CatIcon = cat.icon;
          const isExpanded = expandedCategories.has(catKey);
          return (
            <div key={catKey} className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors text-left"
                style={{ borderBottom: isExpanded ? '1px solid var(--border)' : 'none', background: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg, border: `1px solid ${cat.borderColor}` }}>
                    <CatIcon size={15} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{cat.label}</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: cat.color, background: cat.bg, fontWeight: 'var(--font-weight-semibold)' }}>
                      {reports.length} {reports.length === 1 ? 'relatório' : 'relatórios'}
                    </span>
                  </div>
                </div>
                <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              {/* Reports grid */}
              {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
                  {reports.map(r => (
                    <div key={r.id} className="bg-white p-4 flex flex-col gap-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.35 }}>{r.nome}</span>
                            {r.isNew && (
                              <span className="shrink-0 px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--text-badge)', background: 'var(--primary)', color: 'white', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.05em' }}>NOVO</span>
                            )}
                          </div>
                          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{r.descricao}</p>
                        </div>
                      </div>
                      {/* Tags */}
                      {r.tags && (
                        <div className="flex flex-wrap gap-1">
                          {r.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <button
                          onClick={() => setPreviewReport(r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80 transition-opacity flex-1 justify-center"
                          style={{ background: cat.bg, border: `1px solid ${cat.borderColor}`, fontSize: 'var(--text-caption)', color: cat.color, fontWeight: 'var(--font-weight-semibold)' }}>
                          <Eye size={11} /> Visualizar
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80 transition-opacity flex-1 justify-center"
                          style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                          <Download size={11} /> Exportar
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer hover:bg-muted transition-colors shrink-0"
                          style={{ border: '1px solid var(--border)', background: 'none' }}
                          title="Salvar relatório">
                          <Bookmark size={12} style={{ color: 'var(--muted-foreground)' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {previewReport && (
        <ReportPreviewModal
          report={previewReport}
          onClose={() => setPreviewReport(null)}
          onSave={() => {
            setPreviewReport(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Tab: Relatórios Salvos ───────────────────────────────────────────────────

function RelatoriosSalvos({ reports, onDelete }: { reports: SavedReport[]; onDelete: (id: number) => void }) {
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = reports.filter(r =>
    !search || r.nome.toLowerCase().includes(search.toLowerCase()) || r.baseReport.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar nos relatórios salvos..."
          className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
          style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg py-16 text-center" style={{ border: '1px solid var(--border)' }}>
          <Bookmark size={32} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum relatório salvo encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          {filtered.map((r, idx) => {
            const cat = categorias[r.categoria];
            const CatIcon = cat.icon;
            return (
              <div key={r.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg, border: `1px solid ${cat.borderColor}` }}>
                  <CatIcon size={15} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{r.nome}</span>
                    {r.compartilhado && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', background: 'rgba(21,115,211,0.08)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <Share2 size={9} /> Compartilhado
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                    {r.baseReport}
                    {r.parametros && <span> · {r.parametros}</span>}
                  </p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                    Criado em {r.criadoEm} · Última execução: {r.ultimaExecucao}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80"
                    style={{ background: cat.bg, border: `1px solid ${cat.borderColor}`, fontSize: 'var(--text-caption)', color: cat.color, fontWeight: 'var(--font-weight-semibold)' }}>
                    <Eye size={11} /> Executar
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer hover:opacity-80"
                    style={{ border: '1px solid var(--border)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', background: 'none' }}>
                    <Download size={11} />
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-red-50"
                    onClick={() => setConfirmDelete(r.id)}
                    style={{ border: '1px solid var(--border)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', background: 'none' }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4" style={{ maxWidth: '380px', width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Excluir relatório salvo?</h3>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Esta ação não pode ser desfeita.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-md cursor-pointer hover:bg-muted"
                style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'none' }}>Cancelar</button>
              <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
                className="px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
                style={{ background: 'var(--chart-4)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Relatórios Compartilhados ──────────────────────────────────────────

function RelatoriosCompartilhados({ reports }: { reports: SharedReport[] }) {
  const [search, setSearch] = useState('');

  const filtered = reports.filter(r =>
    !search || r.nome.toLowerCase().includes(search.toLowerCase()) || r.compartilhadoPor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar nos relatórios compartilhados..."
          className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
          style={{ border: '1px solid var(--border)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg py-16 text-center" style={{ border: '1px solid var(--border)' }}>
          <Share2 size={32} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum relatório compartilhado com você.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          {filtered.map((r, idx) => {
            const cat = categorias[r.categoria];
            const CatIcon = cat.icon;
            const canEdit = r.permissao === 'editar';
            return (
              <div key={r.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg, border: `1px solid ${cat.borderColor}` }}>
                  <CatIcon size={15} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{r.nome}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--text-caption)', color: canEdit ? 'var(--chart-1)' : 'var(--chart-2)', background: canEdit ? 'rgba(56,124,43,0.10)' : 'rgba(21,115,211,0.08)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {canEdit ? 'Pode editar' : 'Somente visualizar'}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{r.baseReport}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--primary)', fontSize: '8px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                      {r.compartilhadoPor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                      Compartilhado por <strong style={{ color: 'var(--foreground)' }}>{r.compartilhadoPor}</strong> em {r.dataCompartilhamento}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:opacity-80"
                    style={{ background: cat.bg, border: `1px solid ${cat.borderColor}`, fontSize: 'var(--text-caption)', color: cat.color, fontWeight: 'var(--font-weight-semibold)' }}>
                    <Eye size={11} /> {canEdit ? 'Abrir' : 'Visualizar'}
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer hover:opacity-80"
                    style={{ border: '1px solid var(--border)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', background: 'none' }}>
                    <Download size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Relatorios ──────────────────────────────────────────────────────────

export function Relatorios() {
  const [activeTab, setActiveTab] = useState<TabId>('sistema');
  const [showDrawer, setShowDrawer] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(mockSavedReports);
  const [sharedReports] = useState<SharedReport[]>(mockSharedReports);

  const newSystemCount = systemReports.filter(r => r.isNew).length;

  const tabs: { id: TabId; label: string; count: number; hasNew?: boolean }[] = [
    { id: 'sistema',        label: 'Relatórios do Sistema',          count: systemReports.length, hasNew: newSystemCount > 0 },
    { id: 'salvos',         label: 'Relatórios Salvos',              count: savedReports.length },
    { id: 'compartilhados', label: 'Relatórios Compartilhados Comigo', count: sharedReports.length },
  ];

  const handleSaveReport = (r: SavedReport) => {
    setSavedReports(prev => [r, ...prev]);
  };

  const handleDeleteSaved = (id: number) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Relatórios
          </h2>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {systemReports.length} relatórios disponíveis no sistema
          </p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity self-start sm:self-auto"
          style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}
        >
          <Plus size={14} /> Criar Novo Relatório
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 overflow-x-auto" style={{ borderBottom: '1px solid var(--border)', scrollbarWidth: 'none' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer whitespace-nowrap transition-colors shrink-0"
              style={{
                fontSize: 'var(--text-label)',
                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
              {/* Count badge */}
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-semibold)',
                  background: isActive ? 'rgba(214,64,0,0.10)' : 'var(--muted)',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {tab.id === 'salvos' ? savedReports.length : tab.count}
              </span>
              {/* New badge */}
              {tab.hasNew && (
                <span
                  className="px-1.5 py-0.5 rounded"
                  style={{
                    fontSize: 'var(--text-badge)',
                    fontWeight: 'var(--font-weight-semibold)',
                    background: 'var(--primary)',
                    color: 'white',
                    letterSpacing: '0.05em',
                  }}
                >
                  {newSystemCount} NOVO{newSystemCount > 1 ? 'S' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'sistema' && <RelatoriosSistema onSave={handleSaveReport} />}
      {activeTab === 'salvos' && <RelatoriosSalvos reports={savedReports} onDelete={handleDeleteSaved} />}
      {activeTab === 'compartilhados' && <RelatoriosCompartilhados reports={sharedReports} />}

      {/* Novo Relatório Drawer */}
      <NovoRelatorioDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSave={(r) => { handleSaveReport(r); setActiveTab('salvos'); }}
      />
    </div>
  );
}
