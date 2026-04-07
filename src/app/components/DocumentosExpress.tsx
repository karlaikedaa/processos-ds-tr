import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Upload, Search, Download, FileText, CheckCircle2, AlertCircle,
  X, Eye, RefreshCw, CheckSquare, Square, Trash2, Link2,
  ArrowLeftRight, UserRound, FileUp, Building2, Calendar,
  Send, FilePlus2, Clock, Filter, AlertTriangle, Info,
  RotateCcw, MessageSquare, Mail, Bell, History,
  User, ExternalLink, Check, ChevronDown, Package,
  ZapOff, Globe, FolderOpen, FileDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'upload-express' | 'historico' | 'lista-documentos';

interface DocNaoIdentificado {
  id: string;
  nomeDoc: string;
  dataUpload: string;
  tipoErro: string;
  detalheErro: string;
  tamanho: string;
  origem: string;
}

interface TarefaIdentificada {
  id: string;
  nomeDoc: string;
  nomeTarefa: string;
  nomeCliente: string;
  dataUpload: string;
  status: 'Pendente' | 'Confirmado';
}

interface HistoricoItem {
  id: string;
  nomeArquivo: string;
  competencia: string;
  nomeCliente: string;
  nomeTarefa: string;
  dataVencimento: string;
  dataUpload: string;
  tipo: string;
}

interface ListaDoc {
  id: string;
  nome: string;
  dataVencimento: string;
  comentarios: number;
  visualizadoEm: string | null;
  tamanho: string;
  empresa: string;
}

type EventoTipo =
  | 'restaurado' | 'lixeira' | 'vencimento-editada' | 'vencimento-inserida'
  | 'desbloqueado' | 'comentario-excluido' | 'comentario-editado'
  | 'comentario-adicionado' | 'visualizacao' | 'enviado-email'
  | 'falha-notificacao' | 'notificado-email' | 'novo-documento' | 'bloqueado';

interface EventoHistorico {
  id: number;
  tipo: EventoTipo;
  titulo: string;
  data: string;
  usuario: string;
  email: string;
  ip: string;
  temDetalhes?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockNaoIdentificados: DocNaoIdentificado[] = [
  { id: 'NI001', nomeDoc: 'SPED_Fiscal_MAR2026.txt',      dataUpload: '10/03/2026 09:14', tipoErro: 'Formato inválido',      detalheErro: 'O arquivo enviado não corresponde ao layout esperado para SPED Fiscal. Versão identificada: 015. Versão esperada: 017.', origem: 'Domínio Escrita', tamanho: '2,4 MB' },
  { id: 'NI002', nomeDoc: 'ECF_2025_Empresa_ABC.txt',      dataUpload: '09/03/2026 17:32', tipoErro: 'Registro duplicado',    detalheErro: 'Foram encontrados 3 registros duplicados no bloco J100. Linhas 142, 398 e 512 contêm o mesmo período de apuração.', origem: 'Domínio Lalur', tamanho: '5,1 MB' },
  { id: 'NI003', nomeDoc: 'Folha_FEV2026_DEF.xml',         dataUpload: '08/03/2026 11:05', tipoErro: 'Assinatura digital',    detalheErro: 'O certificado digital utilizado para assinar o documento expirou em 28/02/2026. Renove o certificado e reenvie o arquivo.', origem: 'Domínio Folha', tamanho: '890 KB' },
  { id: 'NI004', nomeDoc: 'REINF_R2010_MAR2026.xml',       dataUpload: '07/03/2026 14:22', tipoErro: 'CNPJ não encontrado',   detalheErro: 'O CNPJ 98.765.432/0001-10 informado no evento R-2010 não consta na base de clientes cadastrados.', origem: 'Domínio Escrita', tamanho: '340 KB' },
  { id: 'NI005', nomeDoc: 'Balancete_FEV2026_GHI.pdf',     dataUpload: '06/03/2026 08:47', tipoErro: 'Período inconsistente', detalheErro: 'O período do arquivo (01/01/2026 a 28/02/2026) não coincide com o período da tarefa vinculada (01/02/2026 a 28/02/2026).', origem: 'Domínio Contab.', tamanho: '1,2 MB' },
  { id: 'NI006', nomeDoc: 'DCTF_JAN2026_XYZ.txt',          dataUpload: '05/03/2026 16:10', tipoErro: 'Arquivo corrompido',    detalheErro: 'O arquivo não pôde ser lido. Possível causa: transferência interrompida ou compactação com senha.', origem: 'Domínio Contab.', tamanho: '—' },
  { id: 'NI007', nomeDoc: 'SPED_Contribuicoes_MAR.txt',    dataUpload: '04/03/2026 10:33', tipoErro: 'Empresa não vinculada', detalheErro: 'A empresa "Indústria JKL Ltda" presente no arquivo não está vinculada a nenhum cliente ativo.', origem: 'Domínio Escrita', tamanho: '3,8 MB' },
];

const mockIdentificados: TarefaIdentificada[] = [
  { id: 'TI001', nomeDoc: 'NF_Servicos_0842.pdf',     nomeTarefa: 'Escrituração Fiscal Mar/2026',  nomeCliente: 'Empresa ABC Ltda',      dataUpload: '10/03/2026 09:22', status: 'Pendente' },
  { id: 'TI002', nomeDoc: 'Contrato_Prest_2026.pdf',  nomeTarefa: 'Análise Contratual - ABC',      nomeCliente: 'Empresa ABC Ltda',      dataUpload: '09/03/2026 14:05', status: 'Pendente' },
  { id: 'TI003', nomeDoc: 'Extrato_Bancario_Mar.pdf', nomeTarefa: 'Conciliação Bancária Mar/2026', nomeCliente: 'Natura Cosméticos S/A', dataUpload: '08/03/2026 11:30', status: 'Pendente' },
  { id: 'TI004', nomeDoc: 'GNRE_MAR2026.pdf',         nomeTarefa: 'Apuração ICMS ST Mar/2026',    nomeCliente: 'Ambev S/A',             dataUpload: '07/03/2026 16:45', status: 'Pendente' },
  { id: 'TI005', nomeDoc: 'DAS_MAR2026.pdf',          nomeTarefa: 'Apuração Simples Nacional',    nomeCliente: 'DEF Comércio Ltda',     dataUpload: '06/03/2026 09:12', status: 'Pendente' },
  { id: 'TI006', nomeDoc: 'IRRF_Retencao_Mar.pdf',    nomeTarefa: 'DCTF Mensal Mar/2026',         nomeCliente: 'GHI Serviços Ltda',     dataUpload: '05/03/2026 15:20', status: 'Pendente' },
  { id: 'TI007', nomeDoc: 'GPS_MAR2026.pdf',          nomeTarefa: 'GFIP/SEFIP Mar/2026',          nomeCliente: 'JKL Indústria Ltda',    dataUpload: '04/03/2026 10:08', status: 'Pendente' },
  { id: 'TI008', nomeDoc: 'FGTS_Digital_MAR.pdf',     nomeTarefa: 'eSocial - Folha Mar/2026',     nomeCliente: 'Magazine Luiza S/A',    dataUpload: '03/03/2026 14:55', status: 'Pendente' },
];

const mockHistorico: HistoricoItem[] = [
  { id: 'H001', nomeArquivo: 'Balancete_FEV2026.pdf',    competencia: 'Fev/2026', nomeCliente: 'Empresa ABC Ltda',      nomeTarefa: 'Balancete Fev/2026',          dataVencimento: '15/03/2026', dataUpload: '08/03/2026 09:15', tipo: 'Balancete' },
  { id: 'H002', nomeArquivo: 'Folha_FEV2026.pdf',        competencia: 'Fev/2026', nomeCliente: 'Empresa ABC Ltda',      nomeTarefa: 'Folha de Pagamento Fev/2026', dataVencimento: '07/03/2026', dataUpload: '08/03/2026 09:15', tipo: 'Folha' },
  { id: 'H003', nomeArquivo: 'DCTF_FEV2026.pdf',         competencia: 'Fev/2026', nomeCliente: 'Natura Cosméticos S/A', nomeTarefa: 'DCTF Fev/2026',              dataVencimento: '10/03/2026', dataUpload: '07/03/2026 14:30', tipo: 'DCTF' },
  { id: 'H004', nomeArquivo: 'SPED_Contabil_2025.txt',   competencia: 'Anual/25', nomeCliente: 'Natura Cosméticos S/A', nomeTarefa: 'SPED Contábil 2025',         dataVencimento: '31/03/2026', dataUpload: '06/03/2026 11:00', tipo: 'SPED' },
  { id: 'H005', nomeArquivo: 'GPS_FEV2026.pdf',          competencia: 'Fev/2026', nomeCliente: 'Ambev S/A',             nomeTarefa: 'GFIP/SEFIP Fev/2026',        dataVencimento: '07/03/2026', dataUpload: '06/03/2026 08:00', tipo: 'GPS' },
  { id: 'H006', nomeArquivo: 'GNRE_FEV2026.pdf',         competencia: 'Fev/2026', nomeCliente: 'Ambev S/A',             nomeTarefa: 'ICMS ST Fev/2026',           dataVencimento: '05/03/2026', dataUpload: '05/03/2026 14:22', tipo: 'GNRE' },
  { id: 'H007', nomeArquivo: 'Informe_Rend_2025.pdf',    competencia: 'Anual/25', nomeCliente: 'DEF Comércio Ltda',     nomeTarefa: 'Informe de Rendimentos 2025', dataVencimento: '28/02/2026', dataUpload: '05/03/2026 10:45', tipo: 'Informe' },
  { id: 'H008', nomeArquivo: 'ECF_2025.txt',             competencia: 'Anual/25', nomeCliente: 'GHI Serviços Ltda',     nomeTarefa: 'ECF 2025',                   dataVencimento: '31/07/2026', dataUpload: '04/03/2026 15:20', tipo: 'ECF' },
  { id: 'H009', nomeArquivo: 'REINF_FEV2026.xml',        competencia: 'Fev/2026', nomeCliente: 'JKL Indústria Ltda',   nomeTarefa: 'REINF Fev/2026',             dataVencimento: '15/03/2026', dataUpload: '03/03/2026 11:00', tipo: 'REINF' },
  { id: 'H010', nomeArquivo: 'Balancete_JAN2026.pdf',    competencia: 'Jan/2026', nomeCliente: 'Magazine Luiza S/A',   nomeTarefa: 'Balancete Jan/2026',          dataVencimento: '15/02/2026', dataUpload: '02/03/2026 09:00', tipo: 'Balancete' },
  { id: 'H011', nomeArquivo: 'DAS_FEV2026.pdf',          competencia: 'Fev/2026', nomeCliente: 'Embraer S/A',          nomeTarefa: 'Simples Nacional Fev/2026',   dataVencimento: '20/03/2026', dataUpload: '01/03/2026 10:30', tipo: 'DAS' },
  { id: 'H012', nomeArquivo: 'GPS_JAN2026.pdf',          competencia: 'Jan/2026', nomeCliente: 'Natura Cosméticos S/A', nomeTarefa: 'GFIP/SEFIP Jan/2026',       dataVencimento: '07/02/2026', dataUpload: '28/02/2026 09:30', tipo: 'GPS' },
];

const mockListaDocs: ListaDoc[] = [
  { id: 'LD001', nome: 'relatorio_2023.pdf',       dataVencimento: '15/04/2026', comentarios: 3,  visualizadoEm: '10/03/2026 às 10:22', tamanho: '1,2 MB', empresa: 'Empresa ABC Ltda' },
  { id: 'LD002', nome: 'balancete_mar2026.pdf',    dataVencimento: '31/03/2026', comentarios: 0,  visualizadoEm: '09/03/2026 às 14:05', tamanho: '890 KB', empresa: 'Empresa ABC Ltda' },
  { id: 'LD003', nome: 'SPED_Fiscal_MAR2026.txt',  dataVencimento: '20/03/2026', comentarios: 1,  visualizadoEm: null,                  tamanho: '2,4 MB', empresa: 'Natura Cosméticos S/A' },
  { id: 'LD004', nome: 'folha_pagamento_mar.pdf',  dataVencimento: '10/03/2026', comentarios: 2,  visualizadoEm: '08/03/2026 às 09:30', tamanho: '560 KB', empresa: 'Natura Cosméticos S/A' },
  { id: 'LD005', nome: 'ECF_2025_final.txt',       dataVencimento: '31/07/2026', comentarios: 0,  visualizadoEm: '07/03/2026 às 16:45', tamanho: '5,2 MB', empresa: 'Ambev S/A' },
  { id: 'LD006', nome: 'REINF_R2010_mar.xml',      dataVencimento: '15/04/2026', comentarios: 4,  visualizadoEm: null,                  tamanho: '340 KB', empresa: 'Ambev S/A' },
  { id: 'LD007', nome: 'DAS_MAR2026.pdf',          dataVencimento: '20/03/2026', comentarios: 0,  visualizadoEm: '06/03/2026 às 11:00', tamanho: '145 KB', empresa: 'DEF Comércio Ltda' },
  { id: 'LD008', nome: 'GPS_MAR2026.pdf',          dataVencimento: '07/04/2026', comentarios: 1,  visualizadoEm: null,                  tamanho: '210 KB', empresa: 'GHI Serviços Ltda' },
  { id: 'LD009', nome: 'contrato_prestacao.pdf',   dataVencimento: '30/06/2026', comentarios: 6,  visualizadoEm: '05/03/2026 às 15:20', tamanho: '1,8 MB', empresa: 'JKL Indústria Ltda' },
  { id: 'LD010', nome: 'informe_rendimentos.pdf',  dataVencimento: '28/02/2026', comentarios: 0,  visualizadoEm: '04/03/2026 às 10:08', tamanho: '560 KB', empresa: 'Magazine Luiza S/A' },
];

const mockEventos: Record<string, EventoHistorico[]> = {
  'LD001': [
    { id: 1,  tipo: 'restaurado',         titulo: 'Documento restaurado',          data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 2,  tipo: 'lixeira',            titulo: 'Documento movido para lixeira', data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 3,  tipo: 'vencimento-editada', titulo: 'Data de vencimento editada',    data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 4,  tipo: 'vencimento-inserida',titulo: 'Data de vencimento inserida',   data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 5,  tipo: 'desbloqueado',       titulo: 'Documento desbloqueado',        data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 6,  tipo: 'comentario-excluido',titulo: 'Comentário excluído',           data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 7,  tipo: 'comentario-editado', titulo: 'Comentário editado',            data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 8,  tipo: 'comentario-adicionado',titulo: 'Comentário adicionado',       data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 9,  tipo: 'visualizacao',       titulo: 'Visualização de documento',     data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 10, tipo: 'enviado-email',      titulo: 'Documento enviado por e-mail',  data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0', temDetalhes: true },
    { id: 11, tipo: 'falha-notificacao',  titulo: 'Falha na notificação',          data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0', temDetalhes: true },
    { id: 12, tipo: 'notificado-email',   titulo: 'Notificado por e-mail',         data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0', temDetalhes: true },
    { id: 13, tipo: 'novo-documento',     titulo: 'Novo documento',                data: '16/04/2024 às 12:59', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
  ],
};

// generate generic events for other docs
function getEventos(docId: string): EventoHistorico[] {
  if (mockEventos[docId]) return mockEventos[docId];
  return [
    { id: 1, tipo: 'novo-documento',   titulo: 'Novo documento',               data: '10/03/2026 às 09:00', usuario: 'Jorge Lopes (usuário ativo)', email: 'jorge.lopes@contabilopes.com.br', ip: '123.45.6.789.0' },
    { id: 2, tipo: 'visualizacao',     titulo: 'Visualização de documento',    data: '10/03/2026 às 11:30', usuario: 'Ana Torres (usuário ativo)',   email: 'ana.torres@contabilopes.com.br',  ip: '123.45.6.789.1' },
    { id: 3, tipo: 'enviado-email',    titulo: 'Documento enviado por e-mail', data: '10/03/2026 às 12:00', usuario: 'Sistema',                     email: 'sistema@contabilopes.com.br',     ip: '123.45.6.789.2', temDetalhes: true },
    { id: 4, tipo: 'notificado-email', titulo: 'Notificado por e-mail',        data: '10/03/2026 às 12:01', usuario: 'Sistema',                     email: 'sistema@contabilopes.com.br',     ip: '123.45.6.789.2', temDetalhes: true },
  ];
}

const empresas = ['Empresa ABC Ltda', 'Natura Cosméticos S/A', 'Ambev S/A', 'DEF Comércio Ltda', 'GHI Serviços Ltda', 'JKL Indústria Ltda', 'Magazine Luiza S/A', 'Embraer S/A'];

// ─── Event config ─────────────────────────────────────────────────────────────

const eventoConfig: Record<EventoTipo, { color: string; bg: string; borderColor: string; icon: React.ReactNode }> = {
  'restaurado':          { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.12)',    borderColor: 'rgba(56,124,43,0.3)',    icon: <Check size={10} strokeWidth={3} /> },
  'lixeira':             { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.12)',    borderColor: 'rgba(220,10,10,0.3)',    icon: <X size={10} strokeWidth={3} /> },
  'vencimento-editada':  { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.12)',   borderColor: 'rgba(21,115,211,0.3)',   icon: <Info size={10} strokeWidth={2.5} /> },
  'vencimento-inserida': { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.12)',   borderColor: 'rgba(21,115,211,0.3)',   icon: <Info size={10} strokeWidth={2.5} /> },
  'desbloqueado':        { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.12)',   borderColor: 'rgba(21,115,211,0.3)',   icon: <Info size={10} strokeWidth={2.5} /> },
  'comentario-excluido': { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.12)',    borderColor: 'rgba(220,10,10,0.3)',    icon: <Info size={10} strokeWidth={2.5} /> },
  'comentario-editado':  { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.12)',    borderColor: 'rgba(254,166,1,0.35)',   icon: <AlertTriangle size={9} strokeWidth={2.5} /> },
  'comentario-adicionado':{ color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.12)', borderColor: 'rgba(21,115,211,0.3)',   icon: <Info size={10} strokeWidth={2.5} /> },
  'visualizacao':        { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.12)',    borderColor: 'rgba(56,124,43,0.3)',    icon: <Check size={10} strokeWidth={3} /> },
  'enviado-email':       { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.12)',   borderColor: 'rgba(21,115,211,0.3)',   icon: <Info size={10} strokeWidth={2.5} /> },
  'falha-notificacao':   { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.12)',    borderColor: 'rgba(220,10,10,0.3)',    icon: <X size={10} strokeWidth={3} /> },
  'notificado-email':    { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.12)',    borderColor: 'rgba(56,124,43,0.3)',    icon: <Check size={10} strokeWidth={3} /> },
  'novo-documento':      { color: 'var(--foreground)', bg: 'rgba(31,31,31,0.10)', borderColor: 'rgba(31,31,31,0.25)',    icon: <span style={{ fontSize: '10px', lineHeight: 1 }}>●</span> },
  'bloqueado':           { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.12)',    borderColor: 'rgba(254,166,1,0.35)',   icon: <AlertTriangle size={9} strokeWidth={2.5} /> },
};

// ─── Shared Mini-Components ───────────────────────────────────────────────────

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(); }}
      className="flex items-center justify-center cursor-pointer shrink-0"
      style={{ background: 'none', border: 'none', padding: 0 }}>
      {checked
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--muted-foreground)' }} />}
    </button>
  );
}

function ErrorBadge({ tipo }: { tipo: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
      style={{ fontSize: 'var(--text-caption)', background: 'rgba(220,10,10,0.08)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)', border: '1px solid rgba(220,10,10,0.15)', whiteSpace: 'nowrap' }}>
      <AlertCircle size={9} />{tipo}
    </span>
  );
}

function BigNum({ value, label, color, bg, icon }: { value: number; label: string; color: string; bg: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg shrink-0"
      style={{ background: bg, border: `1px solid ${color}22` }}>
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '20px', fontWeight: 'var(--font-weight-semibold)', color, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{label}</p>
      </div>
    </div>
  );
}

function BatchBar({ count, onDelete, onConfirm, showConfirm }: {
  count: number; onDelete: () => void; onConfirm?: () => void; showConfirm?: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-wrap"
      style={{ background: 'var(--foreground)' }}>
      <span style={{ fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
        {count} {count === 1 ? 'item selecionado' : 'itens selecionados'}
      </span>
      <div className="h-3 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.3)' }} />
      {showConfirm && onConfirm && (
        <button onClick={onConfirm}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          style={{ background: 'rgba(56,124,43,0.85)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <CheckCircle2 size={11} /> Confirmar selecionados
        </button>
      )}
      <button onClick={onDelete}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        style={{ background: 'rgba(220,10,10,0.7)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
        <Trash2 size={11} /> Excluir selecionados
      </button>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ width: 'min(380px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,10,10,0.10)' }}>
            <Trash2 size={18} style={{ color: 'var(--chart-4)' }} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Excluir {count} {count === 1 ? 'item' : 'itens'}?
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded cursor-pointer hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'var(--muted)', border: 'none' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded cursor-pointer hover:opacity-90 transition-opacity"
            style={{ fontSize: 'var(--text-label)', color: 'white', background: 'var(--chart-4)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Tarefa Modal ─────────────────────────────────────────────────────

function ConfirmTarefaModal({ ids, tarefas, onConfirm, onCancel }: {
  ids: string[]; tarefas: TarefaIdentificada[]; onConfirm: (ids: string[]) => void; onCancel: () => void;
}) {
  const items = tarefas.filter(t => ids.includes(t.id));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl flex flex-col gap-0 overflow-hidden"
        style={{ width: 'min(480px,100%)', maxHeight: '80vh', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(56,124,43,0.10)' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--chart-1)' }} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              {ids.length > 1 ? `Confirmar ${ids.length} anexos?` : 'Confirmar anexo na tarefa?'}
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
              {ids.length > 1 ? 'Os documentos serão anexados às respectivas tarefas.' : 'O documento será anexado à tarefa vinculada.'}
            </p>
          </div>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-2" style={{ maxHeight: '280px', scrollbarWidth: 'thin' }}>
          {items.map(item => (
            <div key={item.id} className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(56,124,43,0.04)', border: '1px solid rgba(56,124,43,0.15)' }}>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeDoc}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={9} style={{ color: 'var(--chart-1)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeTarefa}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 size={9} style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeCliente}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-end px-5 pb-5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onCancel}
            className="px-4 py-2 rounded cursor-pointer hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'var(--muted)', border: 'none' }}>
            Cancelar
          </button>
          <button onClick={() => onConfirm(ids)}
            className="flex items-center gap-1.5 px-4 py-2 rounded cursor-pointer hover:opacity-90"
            style={{ fontSize: 'var(--text-label)', color: 'white', background: 'var(--chart-1)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
            <CheckCircle2 size={13} />
            {ids.length > 1 ? `Confirmar ${ids.length} anexos` : 'Confirmar anexo'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Error Detail Drawer ──────────────────────────────────────────────────────

function ErrorDetailDrawer({ doc, onClose }: { doc: DocNaoIdentificado | null; onClose: () => void }) {
  if (!doc) return null;
  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(460px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Detalhes do erro</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{doc.nomeDoc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={14} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="rounded-lg p-4" style={{ background: 'rgba(220,10,10,0.04)', border: '1px solid rgba(220,10,10,0.18)' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={15} style={{ color: 'var(--chart-4)', marginTop: '1px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-4)' }}>{doc.tipoErro}</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginTop: '6px', lineHeight: 1.6 }}>{doc.detalheErro}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[
              { label: 'Arquivo', value: doc.nomeDoc },
              { label: 'Origem', value: doc.origem },
              { label: 'Tamanho', value: doc.tamanho },
              { label: 'Data de upload', value: doc.dataUpload },
              { label: 'ID do registro', value: doc.id },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{row.label}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: '2px' }}>AÇÕES</p>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 w-full"
              style={{ background: 'var(--primary)', border: 'none' }}>
              <Upload size={14} style={{ color: 'white' }} />
              <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Fazer novo upload</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-muted/30 w-full"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <RefreshCw size={14} style={{ color: 'var(--chart-2)' }} />
              <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>Reenviar documento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tarefa Action Drawer ─────────────────────────────────────────────────────

function TarefaActionDrawer({ item, onClose, onConfirm }: { item: TarefaIdentificada | null; onClose: () => void; onConfirm: (id: string) => void }) {
  const [mode, setMode] = useState<'confirm' | 'trocarTarefa' | 'trocarCliente' | 'upload'>('confirm');
  if (!item) return null;
  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(460px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Documento identificado</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{item.nomeDoc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={14} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          {/* Info card */}
          <div className="rounded-lg p-4 mb-5" style={{ background: 'rgba(21,115,211,0.05)', border: '1px solid rgba(21,115,211,0.18)' }}>
            <div className="flex flex-col gap-2">
              {[
                { icon: <FileText size={11} />, label: 'Documento', value: item.nomeDoc },
                { icon: <Building2 size={11} />, label: 'Cliente', value: item.nomeCliente },
                { icon: <CheckCircle2 size={11} />, label: 'Tarefa sugerida', value: item.nomeTarefa },
                { icon: <Calendar size={11} />, label: 'Data de upload', value: item.dataUpload },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <span style={{ color: 'var(--chart-2)', flexShrink: 0 }}>{row.icon}</span>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', minWidth: '110px' }}>{row.label}:</span>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Mode tabs */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {[
              { id: 'confirm', label: 'Confirmar', icon: <CheckCircle2 size={11} /> },
              { id: 'trocarTarefa', label: 'Trocar tarefa', icon: <ArrowLeftRight size={11} /> },
              { id: 'trocarCliente', label: 'Trocar cliente', icon: <UserRound size={11} /> },
              { id: 'upload', label: 'Novo upload', icon: <FileUp size={11} /> },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id as typeof mode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer transition-colors shrink-0"
                style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', background: mode === m.id ? 'var(--primary)' : 'var(--muted)', color: mode === m.id ? 'white' : 'var(--foreground)', border: 'none' }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          {/* Mode content */}
          {mode === 'confirm' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg p-4" style={{ background: 'rgba(56,124,43,0.05)', border: '1px solid rgba(56,124,43,0.2)' }}>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', lineHeight: 1.6 }}>
                  Ao confirmar, o documento <strong>{item.nomeDoc}</strong> será anexado à tarefa <strong>{item.nomeTarefa}</strong> do cliente <strong>{item.nomeCliente}</strong>.
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 w-full"
                style={{ background: 'var(--chart-1)', border: 'none' }} onClick={() => { onConfirm(item.id); onClose(); }}>
                <CheckCircle2 size={14} style={{ color: 'white' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Confirmar anexo na tarefa</span>
              </button>
            </div>
          )}
          {mode === 'trocarTarefa' && (
            <div className="flex flex-col gap-3">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>SELECIONE A NOVA TAREFA</label>
              <select className="rounded-md px-3 py-2.5 appearance-none outline-none w-full"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                <option value="">Escolha uma tarefa...</option>
                {['DCTF Mar/2026','SPED Fiscal Mar/2026','Balancete Mar/2026','ECF 2025','Folha Mar/2026'].map(t => <option key={t}>{t}</option>)}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 w-full"
                style={{ background: 'var(--primary)', border: 'none' }} onClick={onClose}>
                <ArrowLeftRight size={14} style={{ color: 'white' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Confirmar troca de tarefa</span>
              </button>
            </div>
          )}
          {mode === 'trocarCliente' && (
            <div className="flex flex-col gap-3">
              <label style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)' }}>SELECIONE O NOVO CLIENTE</label>
              <select className="rounded-md px-3 py-2.5 appearance-none outline-none w-full"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                <option value="">Escolha um cliente...</option>
                {empresas.map(e => <option key={e}>{e}</option>)}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 w-full"
                style={{ background: 'var(--primary)', border: 'none' }} onClick={onClose}>
                <UserRound size={14} style={{ color: 'white' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Confirmar troca de cliente</span>
              </button>
            </div>
          )}
          {mode === 'upload' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center justify-center rounded-lg p-8 cursor-pointer hover:opacity-80"
                style={{ border: '2px dashed var(--border)', background: 'var(--input-background)' }}>
                <Upload size={28} style={{ color: 'var(--muted-foreground)', marginBottom: '8px' }} />
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Arraste o arquivo ou clique</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '4px' }}>PDF, TXT, XML até 50 MB</p>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 w-full"
                style={{ background: 'var(--primary)', border: 'none' }} onClick={onClose}>
                <FileUp size={14} style={{ color: 'white' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Enviar novo arquivo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── History Drawer ───────────────────────────────────────────────────────────

function HistoryDrawer({ doc, onClose }: { doc: ListaDoc | null; onClose: () => void }) {
  const [search, setSearch] = useState('');

  const eventos = doc ? getEventos(doc.id) : [];
  const filtered = useMemo(() =>
    search ? eventos.filter(e =>
      e.titulo.toLowerCase().includes(search.toLowerCase()) ||
      e.usuario.toLowerCase().includes(search.toLowerCase()) ||
      e.data.toLowerCase().includes(search.toLowerCase())
    ) : eventos,
    [eventos, search]
  );

  if (!doc) return null;

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(400px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted shrink-0">
            <X size={14} style={{ color: 'var(--foreground)' }} />
          </button>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Histórico</p>
        </div>
        {/* Doc name */}
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Documento: <span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{doc.nome}</span></p>
        </div>
        {/* Search */}
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Busque por ação, usuário ou data do evento"
              className="w-full pl-8 pr-3 py-2 rounded-lg outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
        {/* Events list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {filtered.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-2">
              <History size={28} style={{ color: 'var(--muted-foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum evento encontrado</p>
            </div>
          )}
          {filtered.map((evento, idx) => {
            const cfg = eventoConfig[evento.tipo];
            return (
              <div key={evento.id}
                className="flex items-start gap-3 px-5 py-4"
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {/* Icon */}
                <div className="flex flex-col items-center shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg, border: `1.5px solid ${cfg.borderColor}`, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.4 }}>
                      {evento.titulo}
                    </p>
                    {evento.temDetalhes && (
                      <button className="shrink-0 flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: 'none', border: 'none', padding: 0, whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>Mais detalhes</span>
                        <ExternalLink size={9} style={{ color: 'var(--primary)' }} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '3px' }}>
                    Data do evento: {evento.data}
                  </p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginTop: '2px' }}>{evento.usuario}</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '1px' }}>{evento.email}</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '1px' }}>
                    Endereço de IP: {evento.ip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Upload Express ──────────────────────────────────────────────────────

function TabUploadExpress() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Não identificados state
  const [naoIdent, setNaoIdent] = useState(mockNaoIdentificados);
  const [naoIdentSearch, setNaoIdentSearch] = useState('');
  const [selectedNaoId, setSelectedNaoId] = useState<Set<string>>(new Set());
  const [detailDoc, setDetailDoc] = useState<DocNaoIdentificado | null>(null);
  const [deleteModalNI, setDeleteModalNI] = useState<{ ids: string[] } | null>(null);

  // Identificados state
  const [ident, setIdent] = useState(mockIdentificados);
  const [identSearch, setIdentSearch] = useState('');
  const [selectedId, setSelectedId] = useState<Set<string>>(new Set());
  const [actionItem, setActionItem] = useState<TarefaIdentificada | null>(null);
  const [deleteModalI, setDeleteModalI] = useState<{ ids: string[] } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ ids: string[] } | null>(null);

  const filteredNI = useMemo(() =>
    naoIdentSearch ? naoIdent.filter(d =>
      d.nomeDoc.toLowerCase().includes(naoIdentSearch.toLowerCase()) ||
      d.tipoErro.toLowerCase().includes(naoIdentSearch.toLowerCase())
    ) : naoIdent,
    [naoIdent, naoIdentSearch]);

  const filteredI = useMemo(() =>
    identSearch ? ident.filter(t =>
      t.nomeDoc.toLowerCase().includes(identSearch.toLowerCase()) ||
      t.nomeTarefa.toLowerCase().includes(identSearch.toLowerCase()) ||
      t.nomeCliente.toLowerCase().includes(identSearch.toLowerCase())
    ) : ident,
    [ident, identSearch]);

  const allNISelected = filteredNI.length > 0 && filteredNI.every(d => selectedNaoId.has(d.id));
  const allISelected = filteredI.length > 0 && filteredI.every(t => selectedId.has(t.id));

  function toggleNI(id: string) { setSelectedNaoId(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAllNI() { if (allNISelected) setSelectedNaoId(new Set()); else setSelectedNaoId(new Set(filteredNI.map(d => d.id))); }
  function deleteNI(ids: string[]) { setNaoIdent(p => p.filter(d => !ids.includes(d.id))); setSelectedNaoId(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; }); setDeleteModalNI(null); }

  function toggleI(id: string) { setSelectedId(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAllI() { if (allISelected) setSelectedId(new Set()); else setSelectedId(new Set(filteredI.map(t => t.id))); }
  function deleteI(ids: string[]) { setIdent(p => p.filter(t => !ids.includes(t.id))); setSelectedId(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; }); setDeleteModalI(null); }
  function confirmTarefas(ids: string[]) { setIdent(p => p.filter(t => !ids.includes(t.id))); setSelectedId(new Set()); setConfirmModal(null); }
  function confirmSingle(id: string) { setIdent(p => p.filter(t => t.id !== id)); }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Upload area */}
      <div
        className="rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          background: isDragging ? 'rgba(214,64,0,0.04)' : 'white',
          padding: '32px 24px',
          minHeight: '140px',
        }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(214,64,0,0.08)' }}>
          <Upload size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <div className="text-center">
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
            Arraste arquivos aqui ou <span style={{ color: 'var(--primary)' }}>clique para selecionar</span>
          </p>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
            Suporta PDF, TXT, XML, ZIP — até 50 MB por arquivo
          </p>
        </div>
        <input ref={fileInputRef} type="file" multiple className="hidden" />
      </div>

      {/* Two blocks side by side */}
      <div className="flex flex-col xl:flex-row gap-4 items-start">

        {/* ── BLOCO 1: Não identificados ──────────────── */}
        <div className="bg-white rounded-xl flex flex-col min-w-0 w-full xl:flex-1"
          style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Tarefas não identificadas
              </h3>
              <BigNum value={naoIdent.length} label="docs" color="var(--chart-4)" bg="rgba(220,10,10,0.05)"
                icon={<AlertCircle size={13} style={{ color: 'var(--chart-4)' }} />} />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input value={naoIdentSearch} onChange={e => setNaoIdentSearch(e.target.value)}
                  placeholder="Buscar documento ou erro..."
                  className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
              </div>
              {filteredNI.length > 0 && (
                <div onClick={toggleAllNI}
                  className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/40 shrink-0"
                  style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  <Checkbox checked={allNISelected} onChange={toggleAllNI} />
                  <span>Todos</span>
                </div>
              )}
            </div>
          </div>

          {selectedNaoId.size > 0 && (
            <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
              <BatchBar count={selectedNaoId.size} onDelete={() => setDeleteModalNI({ ids: Array.from(selectedNaoId) })} />
            </div>
          )}

          <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '480px', scrollbarWidth: 'thin' }}>
            {filteredNI.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2">
                <Package size={26} style={{ color: 'var(--muted-foreground)' }} />
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum documento encontrado</p>
              </div>
            )}
            {filteredNI.map(doc => (
              <div key={doc.id}
                className="px-4 py-3 hover:bg-muted/20 transition-colors"
                style={{ background: selectedNaoId.has(doc.id) ? 'rgba(220,10,10,0.03)' : undefined, borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0"><Checkbox checked={selectedNaoId.has(doc.id)} onChange={() => toggleNI(doc.id)} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
                        <FileText size={10} style={{ color: 'var(--chart-4)' }} />
                      </div>
                      <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }} title={doc.nomeDoc}>
                        {doc.nomeDoc}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.origem}</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={9} style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.dataUpload}</span>
                      </div>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.tamanho}</span>
                    </div>
                    <div className="mb-2.5"><ErrorBadge tipo={doc.tipoErro} /></div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button onClick={() => setDetailDoc(doc)}
                        className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(21,115,211,0.08)', border: '1px solid rgba(21,115,211,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <Eye size={10} /> Ver erro
                      </button>
                      <button
                        className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(214,64,0,0.08)', border: '1px solid rgba(214,64,0,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <Upload size={10} /> Reenviar
                      </button>
                      <button onClick={() => setDeleteModalNI({ ids: [doc.id] })}
                        className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors ml-auto shrink-0">
                        <Trash2 size={10} style={{ color: 'var(--chart-4)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BLOCO 2: Identificados ──────────────── */}
        <div className="bg-white rounded-xl flex flex-col min-w-0 w-full xl:flex-1"
          style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Tarefas identificadas
              </h3>
              <BigNum value={ident.length} label="tarefas" color="var(--chart-3)" bg="rgba(254,166,1,0.05)"
                icon={<CheckCircle2 size={13} style={{ color: 'var(--chart-3)' }} />} />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input value={identSearch} onChange={e => setIdentSearch(e.target.value)}
                  placeholder="Buscar doc., tarefa ou cliente..."
                  className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
              </div>
              {filteredI.length > 0 && (
                <div onClick={toggleAllI}
                  className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/40 shrink-0"
                  style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  <Checkbox checked={allISelected} onChange={toggleAllI} />
                  <span>Todos</span>
                </div>
              )}
            </div>
          </div>

          {selectedId.size > 0 && (
            <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
              <BatchBar
                count={selectedId.size}
                showConfirm
                onConfirm={() => setConfirmModal({ ids: Array.from(selectedId) })}
                onDelete={() => setDeleteModalI({ ids: Array.from(selectedId) })}
              />
            </div>
          )}

          <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '480px', scrollbarWidth: 'thin' }}>
            {filteredI.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2">
                <FilePlus2 size={26} style={{ color: 'var(--muted-foreground)' }} />
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum item encontrado</p>
              </div>
            )}
            {filteredI.map(item => (
              <div key={item.id}
                className="px-4 py-3 hover:bg-muted/20 transition-colors"
                style={{ background: selectedId.has(item.id) ? 'rgba(254,166,1,0.03)' : undefined, borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0"><Checkbox checked={selectedId.has(item.id)} onChange={() => toggleI(item.id)} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(254,166,1,0.12)' }}>
                        <FilePlus2 size={10} style={{ color: 'var(--chart-3)' }} />
                      </div>
                      <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }} title={item.nomeDoc}>
                        {item.nomeDoc}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 size={9} style={{ color: 'var(--chart-1)', flexShrink: 0 }} />
                      <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{item.nomeTarefa}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2.5">
                      <div className="flex items-center gap-1">
                        <Building2 size={9} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeCliente}</span>
                      </div>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={9} style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.dataUpload}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(21,115,211,0.08)', border: '1px solid rgba(21,115,211,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <Eye size={10} /> Ver doc.
                      </button>
                      <button onClick={() => setConfirmModal({ ids: [item.id] })}
                        className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(56,124,43,0.10)', border: '1px solid rgba(56,124,43,0.2)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <CheckCircle2 size={10} /> Confirmar
                      </button>
                      <button onClick={() => setActionItem(item)}
                        className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(214,64,0,0.08)', border: '1px solid rgba(214,64,0,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                        <Link2 size={10} /> Gerenciar
                      </button>
                      <button onClick={() => setDeleteModalI({ ids: [item.id] })}
                        className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors ml-auto shrink-0">
                        <Trash2 size={10} style={{ color: 'var(--chart-4)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawers / modals */}
      <ErrorDetailDrawer doc={detailDoc} onClose={() => setDetailDoc(null)} />
      <TarefaActionDrawer item={actionItem} onClose={() => setActionItem(null)} onConfirm={confirmSingle} />
      {deleteModalNI && <ConfirmDeleteModal count={deleteModalNI.ids.length} onConfirm={() => deleteNI(deleteModalNI.ids)} onCancel={() => setDeleteModalNI(null)} />}
      {deleteModalI && <ConfirmDeleteModal count={deleteModalI.ids.length} onConfirm={() => deleteI(deleteModalI.ids)} onCancel={() => setDeleteModalI(null)} />}
      {confirmModal && <ConfirmTarefaModal ids={confirmModal.ids} tarefas={ident} onConfirm={confirmTarefas} onCancel={() => setConfirmModal(null)} />}
    </div>
  );
}

// ─── Tab: Histórico ───────────────────────────────────────────────────────────

function TabHistorico() {
  const [searchDoc, setSearchDoc] = useState('');
  const [searchComp, setSearchComp] = useState('');
  const [searchCliente, setSearchCliente] = useState('');
  const [searchTarefa, setSearchTarefa] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => mockHistorico.filter(h => {
    const matchDoc = !searchDoc || h.nomeArquivo.toLowerCase().includes(searchDoc.toLowerCase());
    const matchComp = !searchComp || h.competencia.toLowerCase().includes(searchComp.toLowerCase());
    const matchCliente = !searchCliente || h.nomeCliente.toLowerCase().includes(searchCliente.toLowerCase());
    const matchTarefa = !searchTarefa || h.nomeTarefa.toLowerCase().includes(searchTarefa.toLowerCase());
    const matchData = !searchData || h.dataUpload.includes(searchData);
    return matchDoc && matchComp && matchCliente && matchTarefa && matchData;
  }), [searchDoc, searchComp, searchCliente, searchTarefa, searchData]);

  const hasFilters = !!(searchDoc || searchComp || searchCliente || searchTarefa || searchData);

  function clearFilters() { setSearchDoc(''); setSearchComp(''); setSearchCliente(''); setSearchTarefa(''); setSearchData(''); }

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="bg-white rounded-xl flex flex-col gap-0" style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
        {/* Primary row */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3" style={{ borderBottom: showFilters ? '1px solid var(--border)' : 'none' }}>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input value={searchDoc} onChange={e => setSearchDoc(e.target.value)}
              placeholder="Buscar por documento..."
              className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
          </div>
          <button onClick={() => setShowFilters(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors shrink-0"
            style={{ border: `1px solid ${showFilters ? 'var(--primary)' : 'var(--border)'}`, background: showFilters ? 'rgba(214,64,0,0.06)' : 'white', fontSize: 'var(--text-caption)', color: showFilters ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Filter size={11} /> Filtros {hasFilters && <span className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--primary)', fontSize: '9px' }}>!</span>}
          </button>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50 shrink-0"
              style={{ border: 'none', background: 'none', fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>
              <X size={11} /> Limpar
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ml-auto shrink-0"
            style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            <FolderOpen size={11} /> Download da pasta Express
          </button>
        </div>

        {/* Extra filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {[
              { label: 'Competência', value: searchComp, onChange: setSearchComp, placeholder: 'Ex: Mar/2026' },
              { label: 'Cliente', value: searchCliente, onChange: setSearchCliente, placeholder: 'Nome do cliente' },
              { label: 'Tarefa', value: searchTarefa, onChange: setSearchTarefa, placeholder: 'Nome da tarefa' },
              { label: 'Data de upload', value: searchData, onChange: setSearchData, placeholder: 'DD/MM/AAAA' },
            ].map(f => (
              <div key={f.label} className="flex-1 min-w-[160px]">
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '4px' }}>{f.label.toUpperCase()}</p>
                <input value={f.value} onChange={e => f.onChange(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-1.5 rounded-md outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl flex flex-col" style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
        {/* Desktop header */}
        <div className="hidden md:grid px-4 py-2"
          style={{ gridTemplateColumns: '1.5fr 90px 1fr 1.2fr 100px 100px 70px', gap: '12px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
          {['Nome do arquivo', 'Comp.', 'Cliente', 'Tarefa', 'Vencimento', 'Upload', 'Tipo'].map(h => (
            <span key={h} style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{h}</span>
          ))}
        </div>

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '520px', scrollbarWidth: 'thin' }}>
          {filtered.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-2">
              <FolderOpen size={28} style={{ color: 'var(--muted-foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum documento encontrado</p>
            </div>
          )}
          {filtered.map(item => (
            <div key={item.id}
              className="px-4 py-3 hover:bg-muted/20 transition-colors"
              style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Desktop */}
              <div className="hidden md:grid items-center gap-3"
                style={{ gridTemplateColumns: '1.5fr 90px 1fr 1.2fr 100px 100px 70px' }}>
                <button className="flex items-center gap-2 text-left cursor-pointer hover:underline min-w-0"
                  style={{ background: 'none', border: 'none', padding: 0 }}>
                  <FileText size={11} style={{ color: 'var(--chart-2)', flexShrink: 0 }} />
                  <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeArquivo}</span>
                </button>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.competencia}</span>
                <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{item.nomeCliente}</span>
                <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{item.nomeTarefa}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.dataVencimento}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.dataUpload.split(' ')[0]}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded"
                  style={{ fontSize: 'var(--text-caption)', background: 'var(--muted)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                  {item.tipo}
                </span>
              </div>
              {/* Mobile */}
              <div className="flex md:hidden flex-col gap-1">
                <button className="flex items-center gap-2 text-left cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
                  <FileText size={11} style={{ color: 'var(--chart-2)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeArquivo}</span>
                </button>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  {item.nomeCliente} · {item.competencia} · Venc: {item.dataVencimento}
                </p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeTarefa} · Upload: {item.dataUpload.split(' ')[0]}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Footer count */}
        <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} {filtered.length === 1 ? 'documento' : 'documentos'} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Lista de documentos ─────────────────────────────────────────────────

function TabListaDocumentos() {
  const [empresaFilter, setEmpresaFilter] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [historyDoc, setHistoryDoc] = useState<ListaDoc | null>(null);

  const filtered = useMemo(() => mockListaDocs.filter(d => {
    const matchEmpresa = !empresaFilter || d.empresa === empresaFilter;
    const matchNome = !searchDoc || d.nome.toLowerCase().includes(searchDoc.toLowerCase());
    return matchEmpresa && matchNome;
  }), [empresaFilter, searchDoc]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="bg-white rounded-xl px-4 py-3 flex flex-wrap items-center gap-3"
        style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Building2 size={13} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
          <select value={empresaFilter} onChange={e => setEmpresaFilter(e.target.value)}
            className="flex-1 rounded-md px-2 py-1.5 outline-none cursor-pointer appearance-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: empresaFilter ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            <option value="">Todas as empresas</option>
            {empresas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={searchDoc} onChange={e => setSearchDoc(e.target.value)}
            placeholder="Buscar por nome do documento..."
            className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
        </div>
        {(empresaFilter || searchDoc) && (
          <button onClick={() => { setEmpresaFilter(''); setSearchDoc(''); }}
            className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer shrink-0"
            style={{ border: 'none', background: 'none', fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>
            <X size={11} /> Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl flex flex-col" style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
        {/* Desktop header */}
        <div className="hidden md:grid px-4 py-2"
          style={{ gridTemplateColumns: '2fr 110px 80px 160px 80px 70px', gap: '12px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
          {['Nome', 'Vencimento', 'Coment.', 'Visualizado', 'Tamanho', 'Histórico'].map(h => (
            <span key={h} style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{h}</span>
          ))}
        </div>

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '520px', scrollbarWidth: 'thin' }}>
          {filtered.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-2">
              <FileText size={28} style={{ color: 'var(--muted-foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum documento encontrado</p>
            </div>
          )}
          {filtered.map(doc => (
            <div key={doc.id}
              className="px-4 py-3 hover:bg-muted/20 transition-colors"
              style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Desktop */}
              <div className="hidden md:grid items-center gap-3"
                style={{ gridTemplateColumns: '2fr 110px 80px 160px 80px 70px' }}>
                {/* Nome clicável */}
                <button className="flex items-center gap-2 text-left cursor-pointer hover:underline min-w-0"
                  style={{ background: 'none', border: 'none', padding: 0 }}>
                  <FileText size={11} style={{ color: 'var(--chart-2)', flexShrink: 0 }} />
                  <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>{doc.nome}</span>
                </button>
                {/* Vencimento */}
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.dataVencimento}</span>
                {/* Comentários */}
                <div className="flex items-center gap-1">
                  <MessageSquare size={10} style={{ color: doc.comentarios > 0 ? 'var(--chart-2)' : 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: doc.comentarios > 0 ? 'var(--chart-2)' : 'var(--muted-foreground)', fontWeight: doc.comentarios > 0 ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)' }}>
                    {doc.comentarios}
                  </span>
                </div>
                {/* Visualizado */}
                {doc.visualizadoEm ? (
                  <div className="flex items-center gap-1">
                    <Eye size={10} style={{ color: 'var(--chart-1)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)' }}>{doc.visualizadoEm}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Eye size={10} style={{ color: 'var(--muted-foreground)' }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Não visualizado</span>
                  </div>
                )}
                {/* Tamanho */}
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.tamanho}</span>
                {/* Histórico */}
                <button onClick={() => setHistoryDoc(doc)}
                  className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: 'rgba(21,115,211,0.08)', border: '1px solid rgba(21,115,211,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
                  <History size={10} /> Histórico
                </button>
              </div>

              {/* Mobile */}
              <div className="flex md:hidden flex-col gap-1.5">
                <button className="flex items-center gap-2 text-left cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
                  <FileText size={11} style={{ color: 'var(--chart-2)' }} />
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>{doc.nome}</span>
                </button>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                  Venc: {doc.dataVencimento} · {doc.tamanho} · {doc.comentarios} comentário{doc.comentarios !== 1 ? 's' : ''}
                </p>
                {doc.visualizadoEm
                  ? <p style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)' }}>Visualizado em {doc.visualizadoEm}</p>
                  : <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Não visualizado</p>
                }
                <button onClick={() => setHistoryDoc(doc)}
                  className="flex items-center gap-1 rounded cursor-pointer self-start mt-1"
                  style={{ background: 'rgba(21,115,211,0.08)', border: '1px solid rgba(21,115,211,0.15)', padding: '3px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', fontWeight: 'var(--font-weight-semibold)' }}>
                  <History size={10} /> Histórico
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            {filtered.length} {filtered.length === 1 ? 'documento' : 'documentos'}
          </p>
        </div>
      </div>

      <HistoryDrawer doc={historyDoc} onClose={() => setHistoryDoc(null)} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DocumentosExpress() {
  const [activeTab, setActiveTab] = useState<TabId>('upload-express');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'upload-express',    label: 'Upload Express' },
    { id: 'historico',         label: 'Histórico' },
    { id: 'lista-documentos',  label: 'Lista de documentos' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="bg-white px-4 md:px-6 pt-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.2 }}>
              Documentos Express
            </h2>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
              Gerencie uploads, histórico e lista de documentos enviados aos clientes
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center h-9 px-4 cursor-pointer shrink-0 transition-colors"
                style={{
                  background: 'none', border: 'none',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}>
                <span style={{
                  fontSize: 'var(--text-label)',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6" style={{ background: '#f9fafc' }}>
        {activeTab === 'upload-express' && <TabUploadExpress />}
        {activeTab === 'historico' && <TabHistorico />}
        {activeTab === 'lista-documentos' && <TabListaDocumentos />}
      </div>
    </div>
  );
}
