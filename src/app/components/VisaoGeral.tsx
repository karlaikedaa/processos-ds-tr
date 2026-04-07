import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  AlertTriangle, ChevronRight, Star, LayoutGrid,
  Calendar, List, FileText, Building2, Zap, Clock, ListTodo, SlidersHorizontal,
  Share2, ListChecks, X, ExternalLink, Mail, MessageCircle, Globe,
  UserX, UserCheck, FolderX, ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { ListasDetalhadas, ListaTab } from './ListasDetalhadas';
import AlertBanner from '../../imports/AlertBanner';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TarefasViewTab = 'kanban' | 'lista' | 'calendario' | 'fluxo';

export interface TarefasFilter {
  status?: string;
  cliente?: string;
}

interface VisaoGeralProps {
  onNavigateTarefas?: (viewTab?: TarefasViewTab, filter?: TarefasFilter) => void;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const donutData = [
  { name: 'Concluídas',                              value: 899, pct: 55, color: 'var(--chart-1)', filterStatus: 'Concluída' },
  { name: 'Com impedimento',                         value: 38,  pct: 2,  color: 'var(--chart-4)', filterStatus: 'Impedida' },
  { name: 'Abertas c/ doc. cobrados pendentes',      value: 210, pct: 13, color: 'var(--chart-3)', filterStatus: 'Aberta' },
  { name: 'Abertas c/ doc. cobrados enviados',       value: 347, pct: 21, color: 'var(--chart-2)', filterStatus: 'Em andamento' },
  { name: 'Sem usuário de cliente vinculado',        value: 148, pct: 9,  color: 'var(--chart-5)', filterStatus: 'Desconsiderada' },
];

const metaDentroTotal = 1246;

const empresas = [
  { name: 'Empresa ABC Ltda', total: 48, abertas: 8, abertasAtraso: 2, abertasMulta: 2, concluidas: 40, concluidasAtraso: 2, concluidasMulta: 2, progresso: 83, atraso: 4, multa: 4 },
  { name: 'Empresa XYZ S/A', total: 35, abertas: 7, abertasAtraso: 4, abertasMulta: 2, concluidas: 28, concluidasAtraso: 4, concluidasMulta: 2, progresso: 80, atraso: 8, multa: 4 },
  { name: 'DEF Comércio', total: 29, abertas: 4, abertasAtraso: 0, abertasMulta: 0, concluidas: 25, concluidasAtraso: 0, concluidasMulta: 0, progresso: 86, atraso: 0, multa: 0 },
  { name: 'GHI Serviços', total: 22, abertas: 8, abertasAtraso: 1, abertasMulta: 1, concluidas: 14, concluidasAtraso: 1, concluidasMulta: 1, progresso: 64, atraso: 2, multa: 2 },
  { name: 'JKL Indústria', total: 18, abertas: 0, abertasAtraso: 0, abertasMulta: 0, concluidas: 18, concluidasAtraso: 0, concluidasMulta: 0, progresso: 100, atraso: 0, multa: 0 },
];

const responsaveis = [
  { name: 'Maria Silva', initials: 'MS', abertas: 48, abertasAtraso: 2, abertasMulta: 2, concluidas: 1675, concluidasAtraso: 2, concluidasMulta: 2, total: 1723, atraso: 4, multa: 4 },
  { name: 'João Pereira', initials: 'JP', abertas: 35, abertasAtraso: 4, abertasMulta: 4, concluidas: 86, concluidasAtraso: 4, concluidasMulta: 4, total: 121, atraso: 8, multa: 8 },
  { name: 'Ana Torres', initials: 'AT', abertas: 29, abertasAtraso: 0, abertasMulta: 0, concluidas: 93, concluidasAtraso: 0, concluidasMulta: 0, total: 122, atraso: 0, multa: 0 },
  { name: 'Carlos Rocha', initials: 'CR', abertas: 22, abertasAtraso: 1, abertasMulta: 1, concluidas: 324, concluidasAtraso: 1, concluidasMulta: 1, total: 346, atraso: 2, multa: 2 },
  { name: 'Fernanda Lima', initials: 'FL', abertas: 18, abertasAtraso: 0, abertasMulta: 0, concluidas: 104, concluidasAtraso: 0, concluidasMulta: 0, total: 122, atraso: 0, multa: 0 },
];

const departamentos = [
  { name: 'Contábil', abertas: 48, abertasAtraso: 2, abertasMulta: 2, concluidas: 1675, concluidasAtraso: 2, concluidasMulta: 2, total: 1723, atraso: 4, multa: 4 },
  { name: 'Fiscal', abertas: 35, abertasAtraso: 4, abertasMulta: 4, concluidas: 86, concluidasAtraso: 4, concluidasMulta: 4, total: 121, atraso: 8, multa: 8 },
  { name: 'Administrativo', abertas: 29, abertasAtraso: 0, abertasMulta: 0, concluidas: 93, concluidasAtraso: 0, concluidasMulta: 0, total: 122, atraso: 0, multa: 0 },
  { name: 'Pessoal', abertas: 22, abertasAtraso: 1, abertasMulta: 1, concluidas: 324, concluidasAtraso: 1, concluidasMulta: 1, total: 346, atraso: 2, multa: 2 },
  { name: 'Patrimônio', abertas: 18, abertasAtraso: 0, abertasMulta: 0, concluidas: 104, concluidasAtraso: 0, concluidasMulta: 0, total: 122, atraso: 0, multa: 0 },
];

const avatarColors = ['#B83C00', '#1573D3', '#387C2B', '#D49000', '#6C3FB5', '#C0392B'];

// Tarefas agrupadas por nome
const tarefasAgrupadas = [
  { name: 'DCTF Ago/25', tipo: 'Mensal', total: 48, abertas: 8, abertasAtraso: 4, abertasMulta: 2, concluidas: 40, concluidasAtraso: 2, concluidasMulta: 2, progresso: 83, atraso: 6, multa: 4 },
  { name: 'REINF Out/25', tipo: 'Mensal', total: 35, abertas: 7, abertasAtraso: 0, abertasMulta: 0, concluidas: 28, concluidasAtraso: 4, concluidasMulta: 2, progresso: 80, atraso: 4, multa: 2 },
  { name: 'Alteração Contratual', tipo: 'Esporádica', total: 22, abertas: 3, abertasAtraso: 0, abertasMulta: 0, concluidas: 19, concluidasAtraso: 0, concluidasMulta: 0, progresso: 86, atraso: 0, multa: 0 },
  { name: 'ECF 2025', tipo: 'Anual', total: 20, abertas: 8, abertasAtraso: 6, abertasMulta: 4, concluidas: 12, concluidasAtraso: 1, concluidasMulta: 2, progresso: 62, atraso: 7, multa: 6 },
  { name: 'Balancete Jan/2026', tipo: 'Mensal', total: 18, abertas: 0, abertasAtraso: 0, abertasMulta: 0, concluidas: 18, concluidasAtraso: 0, concluidasMulta: 0, progresso: 100, atraso: 0, multa: 0 },
];

// Mock data for empresa tasks (expandable - tarefas grouped by empresa)
const mockEmpresaTasks: Record<string, { id: string; nome: string; status: string }[]> = {
  'Empresa ABC Ltda': [
    { id: 'T-001', nome: 'DCTF Ago/25', status: 'Concluída' },
    { id: 'T-002', nome: 'REINF Out/25', status: 'Aberta' },
    { id: 'T-003', nome: 'Fechamento Contábil Out/25', status: 'Aguardando aprovação' },
    { id: 'T-004', nome: 'IRPJ Trimestral', status: 'Aberta' },
    { id: 'T-005', nome: 'Balancete Fev/2026', status: 'Em andamento' },
  ],
  'Empresa XYZ S/A': [
    { id: 'T-010', nome: 'SPED Fiscal Set/25', status: 'Impedida' },
    { id: 'T-011', nome: 'ECF 2025', status: 'Desconsiderada' },
    { id: 'T-012', nome: 'SPED Contábil 2025', status: 'Concluída' },
  ],
  'DEF Comércio': [
    { id: 'T-020', nome: 'Folha de Pagamento Set/25', status: 'Concluída' },
    { id: 'T-021', nome: 'GPS Out/25', status: 'Aberta' },
    { id: 'T-022', nome: 'Folha Jan/2026', status: 'Concluída' },
  ],
  'GHI Serviços': [
    { id: 'T-030', nome: 'Balancete Mensal Set/25', status: 'Em andamento' },
    { id: 'T-031', nome: 'Declaração IR PF Sócio', status: 'Concluída' },
  ],
  'JKL Indústria': [
    { id: 'T-040', nome: 'IRPJ 2025', status: 'Aberta' },
    { id: 'T-041', nome: 'DIRF 2026', status: 'Aberta' },
    { id: 'T-042', nome: 'Balancete Jan/2026', status: 'Concluída' },
  ],
};

// Mock data for tarefa empresas (expandable - empresas per tarefa)
const mockTarefaEmpresas: Record<string, { empresa: string; status: string }[]> = {
  'DCTF Ago/25': [
    { empresa: 'Empresa ABC Ltda', status: 'Concluída' },
    { empresa: 'VKW Holdings', status: 'Aberta' },
    { empresa: 'Empresa XYZ', status: 'Aberta' },
    { empresa: 'STU Logística', status: 'Em andamento' },
  ],
  'REINF Out/25': [
    { empresa: 'Empresa ABC Ltda', status: 'Aberta' },
    { empresa: 'DEF Comércio', status: 'Em andamento' },
    { empresa: 'GHI Serviços', status: 'Em andamento' },
  ],
  'Alteração Contratual': [
    { empresa: 'JKL Indústria', status: 'Aberta' },
    { empresa: 'MNO Holding', status: 'Aberta' },
  ],
  'Revisão de Contratos': [
    { empresa: 'PQR Startup', status: 'Concluída' },
  ],
  'ECF 2025': [
    { empresa: 'STU Logística', status: 'Impedida' },
    { empresa: 'Empresa XYZ S/A', status: 'Desconsiderada' },
  ],
};

// Mock data for status tasks (expandable - tarefas per status)
const mockStatusTarefas: Record<string, { id: string; nome: string; empresa: string; status: string }[]> = {
  'Concluída': [
    { id: 'T-001', nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', status: 'Concluída' },
    { id: 'T-012', nome: 'SPED Contábil 2025', empresa: 'Empresa XYZ S/A', status: 'Concluída' },
    { id: 'T-020', nome: 'Folha de Pagamento Set/25', empresa: 'DEF Comércio', status: 'Concluída' },
    { id: 'T-031', nome: 'Declaração IR PF Sócio', empresa: 'GHI Serviços', status: 'Concluída' },
    { id: 'T-042', nome: 'Balancete Jan/2026', empresa: 'JKL Indústria', status: 'Concluída' },
  ],
  'Com impedimento': [
    { id: 'T-010', nome: 'SPED Fiscal Set/25', empresa: 'Empresa XYZ S/A', status: 'Impedida' },
  ],
  'Abertas c/ doc. cobrados pendentes': [
    { id: 'T-004', nome: 'IRPJ Trimestral', empresa: 'Empresa ABC Ltda', status: 'Aberta' },
    { id: 'T-021', nome: 'GPS Out/25', empresa: 'DEF Comércio', status: 'Aberta' },
    { id: 'T-040', nome: 'IRPJ 2025', empresa: 'JKL Indústria', status: 'Aberta' },
    { id: 'T-041', nome: 'DIRF 2026', empresa: 'JKL Indústria', status: 'Aberta' },
  ],
  'Abertas c/ doc. cobrados enviados': [
    { id: 'T-005', nome: 'Balancete Fev/2026', empresa: 'Empresa ABC Ltda', status: 'Em andamento' },
    { id: 'T-030', nome: 'Balancete Mensal Set/25', empresa: 'GHI Serviços', status: 'Em andamento' },
  ],
  'Sem usuário de cliente vinculado': [
    { id: 'T-011', nome: 'ECF 2025', empresa: 'Empresa XYZ S/A', status: 'Desconsiderada' },
  ],
};

// Mock tasks for drawers
const mockTasksVencendoHoje = [
  { id: 'T-001', nome: 'DCTF Mar/2026', cliente: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Em atraso', dataLegal: '10/03/2026' },
  { id: 'T-002', nome: 'SPED Fiscal Mar/2026', cliente: 'Empresa XYZ S/A', responsavel: 'João Pereira', status: 'No prazo', dataLegal: '10/03/2026' },
  { id: 'T-003', nome: 'Folha de Pagamento', cliente: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Em atraso', dataLegal: '10/03/2026' },
  { id: 'T-004', nome: 'REINF Fev/2026', cliente: 'GHI Serviços', responsavel: 'Carlos Rocha', status: 'No prazo', dataLegal: '10/03/2026' },
  { id: 'T-005', nome: 'ECF 2025', cliente: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Com multa', dataLegal: '10/03/2026' },
  { id: 'T-006', nome: 'Balancete Fev/2026', cliente: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'No prazo', dataLegal: '10/03/2026' },
];

const mockTasksConcluidas = [
  { id: 'T-010', nome: 'DCTF Fev/2026', cliente: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Concluída', dataLegal: '08/03/2026' },
  { id: 'T-011', nome: 'SPED Contábil 2025', cliente: 'Empresa XYZ S/A', responsavel: 'João Pereira', status: 'Concluída', dataLegal: '05/03/2026' },
  { id: 'T-012', nome: 'Folha Jan/2026', cliente: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Concluída', dataLegal: '07/03/2026' },
  { id: 'T-013', nome: 'REINF Jan/2026', cliente: 'GHI Serviços', responsavel: 'Carlos Rocha', status: 'Concluída', dataLegal: '02/03/2026' },
  { id: 'T-014', nome: 'Balancete Jan/2026', cliente: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Concluída', dataLegal: '01/03/2026' },
];

const mockTasksAbertas = [
  { id: 'T-020', nome: 'IRPJ Trimestral', cliente: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Aberta', dataLegal: '10/03/2026' },
  { id: 'T-021', nome: 'Escrituração Contábil', cliente: 'Empresa XYZ S/A', responsavel: 'João Pereira', status: 'Aberta', dataLegal: '10/03/2026' },
  { id: 'T-022', nome: 'CSLL Mensal', cliente: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Aberta', dataLegal: '10/03/2026' },
  { id: 'T-023', nome: 'Folha Mar/2026', cliente: 'GHI Serviços', responsavel: 'Carlos Rocha', status: 'Aberta', dataLegal: '10/03/2026' },
  { id: 'T-024', nome: 'DIRF 2026', cliente: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Aberta', dataLegal: '10/03/2026' },
];

const falhaEnvioData = {
  portal: [
    { id: 'T-030', nome: 'Contrato Social - Empresa ABC', cliente: 'Empresa ABC Ltda', erro: 'Usuário do cliente não possui acesso ativo', data: '09/03/2026' },
    { id: 'T-031', nome: 'Folha de Pagamento Fev/2026', cliente: 'DEF Comércio', erro: 'Portal do cliente sem configuração de acesso', data: '08/03/2026' },
    { id: 'T-032', nome: 'Declaração Anual 2025', cliente: 'GHI Serviços', erro: 'Documento excede tamanho máximo permitido', data: '07/03/2026' },
    { id: 'T-033', nome: 'Informe de Rendimentos', cliente: 'Empresa XYZ S/A', erro: 'Sessão do cliente expirada', data: '06/03/2026' },
    { id: 'T-034', nome: 'Balancete Mar/2026', cliente: 'JKL Indústria', erro: 'Falha na autenticação do usuário', data: '05/03/2026' },
  ],
  email: [
    { id: 'T-040', nome: 'DCTF Fev/2026', cliente: 'Empresa ABC Ltda', erro: 'E-mail do cliente não configurado', data: '09/03/2026' },
    { id: 'T-041', nome: 'SPED Fiscal Mar/2026', cliente: 'DEF Comércio', erro: 'Endereço de e-mail inválido', data: '08/03/2026' },
    { id: 'T-042', nome: 'Nota Fiscal Serviços', cliente: 'GHI Serviços', erro: 'Servidor SMTP indisponível', data: '07/03/2026' },
    { id: 'T-043', nome: 'Relatório Tributário', cliente: 'Empresa XYZ S/A', erro: 'Caixa de entrada do destinatário cheia', data: '06/03/2026' },
    { id: 'T-044', nome: 'Guia de ICMS', cliente: 'JKL Indústria', erro: 'Timeout na conexão com servidor', data: '05/03/2026' },
  ],
  whatsapp: [
    { id: 'T-050', nome: 'Lembrete de prazo - DCTF', cliente: 'Empresa ABC Ltda', erro: 'Número de telefone não cadastrado', data: '09/03/2026' },
    { id: 'T-051', nome: 'Documento para assinatura', cliente: 'DEF Comércio', erro: 'WhatsApp Business não configurado', data: '08/03/2026' },
  ],
};

const configPendentesData = {
  funcionariosInativos: [
    { id: 'F-01', nome: 'Pedro Alves', dept: 'Fiscal', tarefas: 8 },
    { id: 'F-02', nome: 'Sônia Meira', dept: 'Contábil', tarefas: 6 },
    { id: 'F-03', nome: 'Roberto Cunha', dept: 'DP', tarefas: 4 },
    { id: 'F-04', nome: 'Cláudia Reis', dept: 'Societário', tarefas: 3 },
    { id: 'F-05', nome: 'Marcos Viana', dept: 'Fiscal', tarefas: 2 },
    { id: 'F-06', nome: 'Letícia Fonseca', dept: 'Contábil', tarefas: 2 },
    { id: 'F-07', nome: 'André Corrêa', dept: 'Patrimônio', tarefas: 1 },
  ],
  tarefasSemResp: [
    { id: 'T-060', nome: 'DCTF Abr/2026', cliente: 'Empresa ABC Ltda', dataLegal: '15/04/2026' },
    { id: 'T-061', nome: 'SPED Abr/2026', cliente: 'Empresa XYZ S/A', dataLegal: '20/04/2026' },
    { id: 'T-062', nome: 'Folha Abr/2026', cliente: 'DEF Comércio', dataLegal: '10/04/2026' },
  ],
  docsSemPasta: [
    { id: 'D-001', nome: 'Contrato Social', tipo: 'Documento' },
    { id: 'D-002', nome: 'Balanço Patrimonial', tipo: 'Relatório' },
  ],
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials, idx }: { initials: string; idx: number }) {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ background: avatarColors[idx % avatarColors.length] }}>
      <span style={{ fontSize: '10px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>{initials}</span>
    </div>
  );
}

function BadgeCount({ value, color, bg }: { value: number; color: string; bg: string }) {
  if (!value) return <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>—</span>;
  return (
    <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5"
      style={{ fontSize: '10px', color, background: bg, fontWeight: 'var(--font-weight-semibold)', minWidth: '22px' }}>
      {value}
    </span>
  );
}

function ProgressBar({ pct, color = 'var(--primary)' }: { pct: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--muted)', minWidth: '60px' }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: '999px' }} />
      </div>
      <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', minWidth: '28px' }}>{pct}%</span>
    </div>
  );
}

// ─── Task Status Badge ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { color: string; bg: string }> = {
    'Em atraso':              { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.08)' },
    'Com multa':              { color: '#6C3FB5', bg: 'rgba(108,63,181,0.08)' },
    'No prazo':               { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.08)' },
    'Concluída':              { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.08)' },
    'Aberta':                 { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.08)' },
    'Em andamento':           { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.08)' },
    'Aguardando aprovação':   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
    'Impedida':               { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.08)' },
    'Desconsiderada':         { color: 'var(--muted-foreground)', bg: 'rgba(153,153,153,0.08)' },
  };
  const c = cfg[status] ?? { color: 'var(--muted-foreground)', bg: 'var(--muted)' };
  return (
    <span className="px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ fontSize: 'var(--text-caption)', color: c.color, background: c.bg, fontWeight: 'var(--font-weight-semibold)' }}>
      {status}
    </span>
  );
}

// ─── Task List Drawer ─────────────────────────────────────────────────────────

function TaskListDrawer({ open, onClose, title, subtitle, tasks }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  tasks: { id: string; nome: string; cliente: string; responsavel: string; status: string; dataLegal: string }[];
}) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(560px,100vw)', boxShadow: '-4px 0 32px rgba(0,0,0,0.14)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        {/* Count */}
        <div className="px-5 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} encontrada{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {tasks.map((t, idx) => (
            <div key={t.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer"
              style={{ borderBottom: idx < tasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.id}</span>
                  <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{t.nome}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.cliente}</span>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>· {t.responsavel}</span>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>· {t.dataLegal}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={t.status} />
                <ExternalLink size={12} style={{ color: 'var(--muted-foreground)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Falha de Envio Drawer ────────────────────────────────────────────────────

function FalhaEnvioDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = React.useState<'portal' | 'email' | 'whatsapp' | null>('portal');
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const sections = [
    { key: 'portal' as const, label: 'Portal do Cliente', count: falhaEnvioData.portal.length, icon: Globe, color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.08)', data: falhaEnvioData.portal },
    { key: 'email' as const, label: 'E-mail', count: falhaEnvioData.email.length, icon: Mail, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', data: falhaEnvioData.email },
    { key: 'whatsapp' as const, label: 'WhatsApp', count: falhaEnvioData.whatsapp.length, icon: MessageCircle, color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.08)', data: falhaEnvioData.whatsapp },
  ];

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(560px,100vw)', boxShadow: '-4px 0 32px rgba(0,0,0,0.14)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Tarefas com falha de envio</h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>Últimos 30 dias · 12 falhas registradas</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3" style={{ scrollbarWidth: 'thin' }}>
          {sections.map(sec => {
            const Icon = sec.icon;
            const isOpen = expanded === sec.key;
            return (
              <div key={sec.key} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : sec.key)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-muted/20 transition-colors"
                  style={{ background: 'none' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: sec.bg }}>
                    <Icon size={14} style={{ color: sec.color }} />
                  </div>
                  <div className="flex-1">
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{sec.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full shrink-0"
                    style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)', background: 'rgba(220,10,10,0.08)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {sec.count} falha{sec.count !== 1 ? 's' : ''}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--muted-foreground)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {sec.data.map((item, idx) => (
                      <div key={item.id}
                        className="px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer"
                        style={{ borderBottom: idx < sec.data.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.id}</span>
                              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{item.nome}</span>
                            </div>
                            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.cliente}</p>
                            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)', marginTop: '3px' }}>{item.erro}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.data}</span>
                            <button className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80"
                              style={{ background: sec.bg, fontSize: 'var(--text-caption)', color: sec.color, border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                              Abrir <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Configurações Pendentes Drawer ──────────────────────────────────────────

function ConfigPendentesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = React.useState<string | null>('inativos');
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const total = configPendentesData.funcionariosInativos.length + configPendentesData.tarefasSemResp.length + configPendentesData.docsSemPasta.length;

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(560px,100vw)', boxShadow: '-4px 0 32px rgba(0,0,0,0.14)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Configurações não realizadas</h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{total} pendência{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3" style={{ scrollbarWidth: 'thin' }}>

          {/* 1. Funcionários inativos */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(220,10,10,0.2)', background: 'rgba(220,10,10,0.02)' }}>
            <button
              onClick={() => setExpanded(expanded === 'inativos' ? null : 'inativos')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-muted/20 transition-colors"
              style={{ background: 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
                <UserX size={14} style={{ color: 'var(--chart-4)' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Funcionários inativos com tarefas</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '1px' }}>Reatribua as tarefas antes de inativar o funcionário</p>
              </div>
              <span className="px-2 py-0.5 rounded-full shrink-0"
                style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)', background: 'rgba(220,10,10,0.10)', fontWeight: 'var(--font-weight-semibold)' }}>
                {configPendentesData.funcionariosInativos.length}
              </span>
              <ChevronRight size={14} style={{ color: 'var(--muted-foreground)', transform: expanded === 'inativos' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {expanded === 'inativos' && (
              <div style={{ borderTop: '1px solid rgba(220,10,10,0.15)' }}>
                {configPendentesData.funcionariosInativos.map((f, idx) => (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
                    style={{ borderBottom: idx < configPendentesData.funcionariosInativos.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(220,10,10,0.10)', fontSize: '10px', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {f.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{f.nome}</span>
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginLeft: '6px' }}>{f.dept}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)', marginRight: '4px' }}>{f.tarefas} tarefa{f.tarefas !== 1 ? 's' : ''}</span>
                    <button className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80"
                      style={{ background: 'rgba(220,10,10,0.08)', fontSize: 'var(--text-caption)', color: 'var(--chart-4)', border: 'none', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
                      Ver funcionário <ExternalLink size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Tarefas sem responsáveis */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(254,166,1,0.25)', background: 'rgba(254,166,1,0.02)' }}>
            <button
              onClick={() => setExpanded(expanded === 'semResp' ? null : 'semResp')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-muted/20 transition-colors"
              style={{ background: 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(254,166,1,0.10)' }}>
                <AlertCircle size={14} style={{ color: 'var(--chart-3)' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Tarefas sem responsáveis</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '1px' }}>Atribua um responsável para cada tarefa</p>
              </div>
              <span className="px-2 py-0.5 rounded-full shrink-0"
                style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-3)', background: 'rgba(254,166,1,0.12)', fontWeight: 'var(--font-weight-semibold)' }}>
                {configPendentesData.tarefasSemResp.length}
              </span>
              <ChevronRight size={14} style={{ color: 'var(--muted-foreground)', transform: expanded === 'semResp' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {expanded === 'semResp' && (
              <div style={{ borderTop: '1px solid rgba(254,166,1,0.2)' }}>
                {configPendentesData.tarefasSemResp.map((t, idx) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
                    style={{ borderBottom: idx < configPendentesData.tarefasSemResp.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.id}</span>
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{t.nome}</span>
                      </div>
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.cliente} · {t.dataLegal}</span>
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80 whitespace-nowrap"
                      style={{ background: 'rgba(254,166,1,0.10)', fontSize: 'var(--text-caption)', color: '#9a6a00', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                      Ver tarefa <ExternalLink size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Documentos sem pasta de destino */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(21,115,211,0.2)', background: 'rgba(21,115,211,0.02)' }}>
            <button
              onClick={() => setExpanded(expanded === 'semPasta' ? null : 'semPasta')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-muted/20 transition-colors"
              style={{ background: 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(21,115,211,0.08)' }}>
                <FolderX size={14} style={{ color: 'var(--chart-2)' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Documentos sem pasta de destino</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '1px' }}>Configure uma pasta de destino para cada documento</p>
              </div>
              <span className="px-2 py-0.5 rounded-full shrink-0"
                style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', background: 'rgba(21,115,211,0.08)', fontWeight: 'var(--font-weight-semibold)' }}>
                {configPendentesData.docsSemPasta.length}
              </span>
              <ChevronRight size={14} style={{ color: 'var(--muted-foreground)', transform: expanded === 'semPasta' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {expanded === 'semPasta' && (
              <div style={{ borderTop: '1px solid rgba(21,115,211,0.15)' }}>
                {configPendentesData.docsSemPasta.map((d, idx) => (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
                    style={{ borderBottom: idx < configPendentesData.docsSemPasta.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{d.id}</span>
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{d.nome}</span>
                      </div>
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{d.tipo}</span>
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80 whitespace-nowrap"
                      style={{ background: 'rgba(21,115,211,0.08)', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
                      Ver documento <ExternalLink size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card (clickable) ─────────────────────────────────────────────────────

function KpiCard({ label, value, icon, iconBg, iconColor, sub, onClick }: {
  label: string; value: string | number; icon: React.ReactNode;
  iconBg: string; iconColor?: string; sub?: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-4 flex flex-col gap-2 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      style={{ boxShadow: 'var(--elevation-sm)', border: onClick ? '1px solid transparent' : undefined }}
      onMouseEnter={e => onClick && ((e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)')}
      onMouseLeave={e => onClick && ((e.currentTarget as HTMLElement).style.borderColor = 'transparent')}
    >
      <div className="flex items-start justify-between gap-2">
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{label}</span>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: '28px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </p>
      {sub && <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.3 }}>{sub}</span>}
      {onClick && (
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', marginTop: '2px' }} className="flex items-center gap-1">
          Ver tarefas <ChevronRight size={11} />
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function VisaoGeral({ onNavigateTarefas }: VisaoGeralProps) {
  const [alert1, setAlert1] = useState(true);
  const [alert2, setAlert2] = useState(true);
  const [listaOpen, setListaOpen] = useState(false);
  const [listaTab, setListaTab] = useState<ListaTab>('departamentos');

  // Task list drawers
  const [taskDrawer, setTaskDrawer] = useState<{ open: boolean; title: string; subtitle?: string; tasks: typeof mockTasksVencendoHoje }>({ open: false, title: '', tasks: [] });
  const [falhaDrawerOpen, setFalhaDrawerOpen] = useState(false);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

  // Expansion states for dashboard cards
  const [expandedEmpresa, setExpandedEmpresa] = useState<string | null>(null);
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [expandedTarefa, setExpandedTarefa] = useState<string | null>(null);

  function openLista(tab: ListaTab) { setListaTab(tab); setListaOpen(true); }

  function openTaskDrawer(title: string, tasks: typeof mockTasksVencendoHoje, subtitle?: string) {
    setTaskDrawer({ open: true, title, subtitle, tasks });
  }

  function navigateTarefas(viewTab?: TarefasViewTab, filter?: TarefasFilter) {
    if (onNavigateTarefas) onNavigateTarefas(viewTab, filter);
  }

  return (
    <div className="p-4 md:p-6 space-y-4 min-h-full">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Visão Geral</h2>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Acompanhe o desempenho do seu escritório em tempo real</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white cursor-pointer hover:bg-muted/40 transition-colors"
            style={{ border: '1px solid var(--border)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            <Star size={13} style={{ color: 'var(--muted-foreground)' }} /> Filtros salvos
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', border: 'none' }}>
            <SlidersHorizontal size={13} style={{ color: 'white' }} /> Filtrar
          </button>
        </div>
      </div>

      {/* ── Tarefas bar ──────────────────────────────────────── */}
      <div className="bg-white rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
        {/* Big number — vencendo hoje */}
        <button
          onClick={() => openTaskDrawer('Tarefas vencendo hoje', mockTasksVencendoHoje, '10/03/2026 · Data legal')}
          className="flex items-center gap-3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity text-left"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: 'rgba(21,115,211,0.1)' }}>
            <ListTodo size={17} style={{ color: 'var(--chart-2)' }} />
          </div>
          <div>
            <p style={{ fontSize: '26px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-2)', lineHeight: 1 }}>2.800</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Tarefas vencendo hoje</p>
          </div>
        </button>

        <div className="hidden sm:block w-px self-stretch" style={{ background: 'var(--border)' }} />
        <div className="sm:hidden h-px w-full" style={{ background: 'var(--border)' }} />

        {/* Concluídas */}
        <div className="shrink-0">
          <button
            onClick={() => openTaskDrawer('Tarefas concluídas', mockTasksConcluidas, '1.700 concluídas hoje')}
            className="cursor-pointer text-left"
            style={{ background: 'none', border: 'none', padding: 0 }}>
            <p style={{ fontSize: '20px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1 }}>1.700</p>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', textDecoration: 'underline' }}>Tarefas concluídas</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 w-full min-w-0">
          <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--muted)' }}>
            <div style={{ width: '60.7%', height: '100%', background: 'var(--chart-1)', borderRadius: '999px' }} />
          </div>
        </div>

        {/* Tarefas abertas (era "data meta hoje") */}
        <div className="shrink-0">
          <button
            onClick={() => openTaskDrawer('Tarefas abertas', mockTasksAbertas, '1.700 tarefas com data meta hoje')}
            className="cursor-pointer text-left"
            style={{ background: 'none', border: 'none', padding: 0 }}>
            <p style={{ fontSize: '20px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1 }}>1.700</p>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', textDecoration: 'underline' }}>Tarefas abertas</span>
          </button>
        </div>
      </div>

      {/* ── Alert Banners ────────────────────────────────────── */}
      {alert1 && (
        <AlertBanner
          onOpenTarefas={() => setFalhaDrawerOpen(true)}
          onClose={() => setAlert1(false)}
        />
      )}

      {alert2 && (
        <div className="flex items-start gap-3 rounded-lg px-4 py-3"
          style={{ background: 'rgba(254,166,1,0.07)', border: '1px solid rgba(254,166,1,0.25)' }}>
          <AlertTriangle size={15} style={{ color: 'var(--chart-3)', marginTop: '2px', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
              07 configurações não realizadas
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
              Funcionários inativos com tarefas (7); Tarefas sem responsáveis (3); Documentos sem pasta de destino (2)
            </p>
          </div>
          <button
            onClick={() => setConfigDrawerOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            style={{ background: 'rgba(254,166,1,0.12)', fontSize: 'var(--text-caption)', color: '#9a6a00', fontWeight: 'var(--font-weight-semibold)', border: 'none' }}>
            Abrir detalhes <ChevronRight size={11} />
          </button>
          <button onClick={() => setAlert2(false)} className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted/40 shrink-0"
            style={{ background: 'none', border: 'none' }}>
            <X size={13} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>
      )}

      {/* ── 3 Cards Principais ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: 4 pontos de atenção */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>4 pontos de atenção</p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>1</span>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Tarefas gerando multa</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>2</span>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Tarefas atrasadas</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>3</span>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Tarefas aguardando aprovação</span>
            </div>
          </div>
        </div>

        {/* Card 2: 120 tarefas abertas com documentos pendentes */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '8px' }}>120 tarefas abertas com</p>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>documentos pendentes</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-4)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>210 tarefas abertas com docs pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-4)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>148 tarefas com usuários do cliente não vinculados</span>
            </div>
          </div>
        </div>

        {/* Card 3: 150 a concluir hoje */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>150 a concluir hoje</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-2)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>A concluir sem atraso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Concluída - arquivos não baixados (hoje)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Concluída - arquivos não baixados (em 5 dias)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Resumo + Ações Rápidas + Sem Tarefas ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Resumo de tarefas (Donut) */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>Resumo de tarefas</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0">
              <PieChart width={160} height={160}>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={2} dataKey="value">
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', background: 'white' }} />
              </PieChart>
            </div>
            <div className="flex flex-col gap-1 flex-1 w-full">
              {donutData.map(d => {
                const isExpanded = expandedStatus === d.name;
                const tarefasForStatus = mockStatusTarefas[d.name] || [];
                return (
                  <div key={d.name} className="flex flex-col">
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setExpandedStatus(isExpanded ? null : d.name);
                      }}
                      className="flex items-center justify-between gap-2 w-full px-2 py-1 rounded-md transition-colors hover:bg-muted/40 cursor-pointer text-left"
                      style={{ background: 'none', border: 'none' }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight 
                          size={10} 
                          style={{ 
                            color: 'var(--muted-foreground)', 
                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s',
                            flexShrink: 0
                          }} 
                        />
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{d.pct}%</span>
                        <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', minWidth: '32px', textAlign: 'right' }}>
                          {d.value.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </button>
                    {isExpanded && tarefasForStatus.length > 0 && (
                      <div className="ml-6 mt-1 mb-2 space-y-1 p-2 rounded-md" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
                        {tarefasForStatus.map((tarefa, idx) => (
                          <div 
                            key={idx}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              navigateTarefas('lista', { status: tarefa.status, cliente: tarefa.empresa });
                            }}
                            className="flex items-start justify-between gap-2 px-2 py-1.5 hover:bg-muted/40 rounded cursor-pointer transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{tarefa.id}</span>
                                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{tarefa.nome}</span>
                              </div>
                              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', display: 'block', marginTop: '2px' }}>{tarefa.empresa}</span>
                            </div>
                            <StatusBadge status={tarefa.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex items-center justify-between gap-2 mt-1 rounded-md px-2 py-1.5"
                style={{ background: 'rgba(56,124,43,0.08)', border: '1px solid rgba(56,124,43,0.2)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--chart-1)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>Total dentro da meta</span>
                </div>
                <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-1)', minWidth: '32px', textAlign: 'right' }}>
                  {metaDentroTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>Ações rápidas</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <FileText size={18} style={{ color: 'var(--primary)' }} />,    label: 'Listas detalhadas',   bg: 'rgba(214,64,0,0.08)',    action: () => openLista('departamentos') },
              { icon: <Calendar size={18} style={{ color: 'var(--chart-5)' }} />,    label: 'Calendário', bg: 'rgba(238,80,5,0.08)',  action: () => navigateTarefas('calendario') },
              { icon: <LayoutGrid size={18} style={{ color: 'var(--chart-2)' }} />,  label: 'Kanban',              bg: 'rgba(21,115,211,0.08)',  action: () => navigateTarefas('kanban') },
              { icon: <List size={18} style={{ color: 'var(--chart-3)' }} />,        label: 'Lista',    bg: 'rgba(254,166,1,0.08)',   action: () => navigateTarefas('lista') },
              { icon: <Share2 size={18} style={{ color: 'var(--chart-4)' }} />,      label: 'Fluxo',   bg: 'rgba(220,10,10,0.08)',   action: () => navigateTarefas('fluxo') },
              { icon: <ListChecks size={18} style={{ color: 'var(--chart-1)' }} />,  label: 'Tarefas',   bg: 'rgba(56,124,43,0.08)',   action: () => navigateTarefas('lista') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/20 transition-colors rounded-lg p-3"
                style={{ border: '1px solid var(--border)', background: 'white' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sem tarefas atribuídas */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: '12px' }}>Sem tarefas atribuídas</p>
          <div className="space-y-3">
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhuma tarefa sem responsável encontrada no momento.</p>
          </div>
        </div>
      </div>

      {/* ── Performance tables ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Responsável */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Desempenho por responsável</p>
            <button onClick={() => openLista('funcionarios')}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', background: 'none', padding: 0, border: 'none' }}>
              Ver todos <ChevronRight size={11} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '300px' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Funcionário', 'Abertas', 'Atraso', 'Com multa', 'Total'].map(h => (
                  <th key={h} className="text-left pb-2 pr-2 last:pr-0"
                    style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {responsaveis.map((r, idx) => (
                  <tr key={r.initials} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigateTarefas('lista')}>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <Avatar initials={r.initials} idx={idx} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} className="truncate max-w-[90px]">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{r.abertas}</td>
                    <td className="py-2 pr-2"><BadgeCount value={r.atraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" /></td>
                    <td className="py-2 pr-2"><BadgeCount value={r.multa} color="#6C3FB5" bg="rgba(108,63,181,0.1)" /></td>
                    <td className="py-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{r.total.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Departamento */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Desempenho por departamento</p>
            <button onClick={() => openLista('departamentos')}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', background: 'none', padding: 0, border: 'none' }}>
              Ver todos <ChevronRight size={11} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '280px' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Departamentos', 'Abertas', 'Atraso', 'Com multa', 'Total'].map(h => (
                  <th key={h} className="text-left pb-2 pr-2 last:pr-0"
                    style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {departamentos.map((d) => (
                  <tr key={d.name} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigateTarefas('lista')}>
                    <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.name}</td>
                    <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{d.abertas}</td>
                    <td className="py-2 pr-2"><BadgeCount value={d.atraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" /></td>
                    <td className="py-2 pr-2"><BadgeCount value={d.multa} color="#6C3FB5" bg="rgba(108,63,181,0.1)" /></td>
                    <td className="py-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{d.total.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── KPI Row 1 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total de tarefas abertas" value={1284} icon={<ListTodo size={15} style={{ color: 'var(--chart-2)' }} />}
          iconBg="rgba(21,115,211,0.1)" onClick={() => navigateTarefas('lista', { status: 'Aberta' })} />
        <KpiCard label="Total de tarefas gerando multas" value={899} icon={<Zap size={15} style={{ color: '#6C3FB5' }} />}
          iconBg="rgba(108,63,181,0.1)" onClick={() => navigateTarefas('lista', { status: 'Em andamento' })} />
        <KpiCard label="Total de tarefas atrasadas" value={38} icon={<AlertTriangle size={15} style={{ color: 'var(--chart-4)' }} />}
          iconBg="rgba(220,10,10,0.1)" onClick={() => navigateTarefas('lista', { status: 'Impedida' })} />
        <KpiCard label="Total de tarefas aprovação" value={347} icon={<Clock size={15} style={{ color: 'var(--chart-3)' }} />}
          iconBg="rgba(254,166,1,0.12)" onClick={() => navigateTarefas('lista', { status: 'Aguardando aprovação' })} />
      </div>

      {/* ── KPI Row 2 — Tarefas sujeitas a multa ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { value: 150, sub: 'A concluir - hoje',                                      iconColor: '#6C3FB5', iconBg: 'rgba(108,63,181,0.1)', tab: 'lista' as TarefasViewTab, filter: { status: 'Aberta' } as TarefasFilter },
          { value: 347, sub: 'A concluir - em até 5 dias',                             iconColor: '#6C3FB5', iconBg: 'rgba(108,63,181,0.1)', tab: 'lista' as TarefasViewTab, filter: { status: 'Aberta' } as TarefasFilter },
          { value: 150, sub: 'Concluídas e não vistas pelo cliente - hoje',            iconColor: 'var(--chart-5)', iconBg: 'rgba(238,80,5,0.1)', tab: 'lista' as TarefasViewTab, filter: { status: 'Concluída' } as TarefasFilter },
          { value: 347, sub: 'Concluídas e não vistas pelo cliente - em até 5 dias',  iconColor: 'var(--chart-5)', iconBg: 'rgba(238,80,5,0.1)', tab: 'lista' as TarefasViewTab, filter: { status: 'Concluída' } as TarefasFilter },
        ].map((item, i) => (
          <div key={i}
            onClick={() => navigateTarefas(item.tab, item.filter)}
            className="bg-white rounded-lg p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid transparent' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
          >
            <div className="flex items-start justify-between gap-2">
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>Tarefas sujeitas a multa</span>
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: item.iconBg }}>
                <Zap size={15} style={{ color: item.iconColor }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1 }}>{item.value}</p>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.3 }}>{item.sub}</span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)' }} className="flex items-center gap-1">
              Ver tarefas <ChevronRight size={11} />
            </span>
          </div>
        ))}
      </div>

      {/* ── Tarefas por empresa e status ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tarefas por empresa */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Tarefas por empresa</p>
            <button onClick={() => openLista('empresas')}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', background: 'none', padding: 0, border: 'none' }}>
              Ver todos <ChevronRight size={11} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '340px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Empresas', 'Total', 'Abertas', 'Atraso', 'Com multa', 'Progresso'].map(h => (
                    <th key={h} className="text-left pb-2 pr-2 last:pr-0"
                      style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {empresas.map((e) => {
                  const isExpanded = expandedEmpresa === e.name;
                  const tarefas = mockEmpresaTasks[e.name] || [];
                  return (
                    <React.Fragment key={e.name}>
                      <tr 
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)' }} 
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setExpandedEmpresa(isExpanded ? null : e.name);
                        }}
                      >
                        <td className="py-2 pr-2">
                          <div className="flex items-center gap-2">
                            <ChevronRight 
                              size={12} 
                              style={{ 
                                color: 'var(--muted-foreground)', 
                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s'
                              }} 
                            />
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                              <Building2 size={11} style={{ color: 'var(--muted-foreground)' }} />
                            </div>
                            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} className="truncate max-w-[100px]">{e.name}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{e.total}</td>
                        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{e.abertas}</td>
                        <td className="py-2 pr-2"><BadgeCount value={e.atraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" /></td>
                        <td className="py-2 pr-2"><BadgeCount value={e.multa} color="#6C3FB5" bg="rgba(108,63,181,0.1)" /></td>
                        <td className="py-2" style={{ minWidth: '80px' }}>
                          <ProgressBar pct={e.progresso} color={e.progresso === 100 ? 'var(--chart-1)' : 'var(--primary)'} />
                        </td>
                      </tr>
                      {isExpanded && tarefas.length > 0 && (
                        <tr>
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
                              {tarefas.map((t, tidx) => (
                                <div 
                                  key={t.id}
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    navigateTarefas('lista', { status: t.status, cliente: e.name });
                                  }}
                                  className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 cursor-pointer transition-colors"
                                  style={{ borderBottom: tidx < tarefas.length - 1 ? '1px solid var(--border)' : 'none' }}
                                >
                                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{t.id}</span>
                                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', flex: 1, marginLeft: '8px' }}>{t.nome}</span>
                                  <StatusBadge status={t.status} />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tarefas por status */}
        <div className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Tarefas</p>
            <button onClick={() => openLista('empresas')}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', background: 'none', padding: 0, border: 'none' }}>
              Ver todos <ChevronRight size={11} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '340px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Tarefa', 'Tipo', 'Total', 'Abertas', 'Atraso', 'Com multa', 'Concluídas'].map(h => (
                    <th key={h} className="text-left pb-2 pr-2 last:pr-0"
                      style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tarefasAgrupadas.map((tarefa) => {
                  const isExpanded = expandedTarefa === tarefa.name;
                  const empresas = mockTarefaEmpresas[tarefa.name] || [];
                  return (
                    <React.Fragment key={tarefa.name}>
                      <tr 
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)' }} 
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setExpandedTarefa(isExpanded ? null : tarefa.name);
                        }}
                      >
                        <td className="py-2 pr-2">
                          <div className="flex items-center gap-2">
                            <ChevronRight 
                              size={12} 
                              style={{ 
                                color: 'var(--muted-foreground)', 
                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s'
                              }} 
                            />
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                              <FileText size={11} style={{ color: 'var(--muted-foreground)' }} />
                            </div>
                            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} className="truncate max-w-[120px]">{tarefa.name}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-2">
                          <span className="px-2 py-0.5 rounded-full" style={{ 
                            fontSize: 'var(--text-caption)', 
                            color: tarefa.tipo === 'Mensal' ? 'var(--chart-2)' : tarefa.tipo === 'Anual' ? 'var(--chart-3)' : '#8B5CF6',
                            background: tarefa.tipo === 'Mensal' ? 'rgba(21,115,211,0.08)' : tarefa.tipo === 'Anual' ? 'rgba(254,166,1,0.08)' : 'rgba(139,92,246,0.08)',
                            fontWeight: 'var(--font-weight-semibold)'
                          }}>
                            {tarefa.tipo}
                          </span>
                        </td>
                        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{tarefa.total}</td>
                        <td className="py-2 pr-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{tarefa.abertas}</td>
                        <td className="py-2 pr-2"><BadgeCount value={tarefa.atraso} color="var(--chart-4)" bg="rgba(220,10,10,0.1)" /></td>
                        <td className="py-2 pr-2"><BadgeCount value={tarefa.multa} color="#6C3FB5" bg="rgba(108,63,181,0.1)" /></td>
                        <td className="py-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>{tarefa.concluidas}</td>
                      </tr>
                      {isExpanded && empresas.length > 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0 }}>
                            <div style={{ background: 'var(--input-background)', borderBottom: '1px solid var(--border)' }}>
                              {empresas.map((emp, empIdx) => (
                                <div 
                                  key={empIdx}
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    navigateTarefas('lista', { status: emp.status, cliente: emp.empresa });
                                  }}
                                  className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 cursor-pointer transition-colors"
                                  style={{ borderBottom: empIdx < empresas.length - 1 ? '1px solid var(--border)' : 'none' }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Building2 size={11} style={{ color: 'var(--muted-foreground)' }} />
                                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{emp.empresa}</span>
                                  </div>
                                  <StatusBadge status={emp.status} />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Listas Detalhadas Panel ───────────────────────────── */}
      <ListasDetalhadas open={listaOpen} initialTab={listaTab} onClose={() => setListaOpen(false)} />

      {/* ── Task List Drawer ───────────────────────────────────── */}
      <TaskListDrawer
        open={taskDrawer.open}
        onClose={() => setTaskDrawer(p => ({ ...p, open: false }))}
        title={taskDrawer.title}
        subtitle={taskDrawer.subtitle}
        tasks={taskDrawer.tasks}
      />

      {/* ── Falha de Envio Drawer ──────────────────────────────── */}
      <FalhaEnvioDrawer open={falhaDrawerOpen} onClose={() => setFalhaDrawerOpen(false)} />

      {/* ── Config Pendentes Drawer ────────────────────────────── */}
      <ConfigPendentesDrawer open={configDrawerOpen} onClose={() => setConfigDrawerOpen(false)} />
    </div>
  );
}
