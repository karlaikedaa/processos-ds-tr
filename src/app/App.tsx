import React, { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-jtevsr4a18';
import imgVideoBanner from 'figma:asset/c72fd606b8866183803c680b0559f794996a5a0f.png';
import { ChevronDown, ChevronUp, ChevronLeft, Menu, X } from 'lucide-react';
import { VisaoGeral, TarefasViewTab, TarefasFilter } from './components/VisaoGeral';
import { Tarefas } from './components/Tarefas';
import { Auditoria } from './components/Auditoria';
import { Circular } from './components/Circular';
import { Relatorios } from './components/Relatorios';
import { StatusIntegracao } from './components/StatusIntegracao';
import { DocumentosExpress } from './components/DocumentosExpress';
import { FuncionariosEscritorio } from './components/FuncionariosEscritorio';
import { FeriadosHorarios } from './components/FeriadosHorarios';
import { Responsabilidades } from './components/Responsabilidades';
import { AgrupadorTarefasClientes } from './components/AgrupadorTarefasClientes';
import { Empresas } from './components/Empresas';
import { UsuariosCliente } from './components/UsuariosCliente';
import { AdequacaoAgrupadores } from './components/AdequacaoAgrupadores';
import { InboxConfig } from './components/InboxConfig';
import { PersonalizarAssinatura } from './components/PersonalizarAssinatura';
import { TemplatesEmailWhatsapp } from './components/TemplatesEmailWhatsapp';
import { ModelosDocumento } from './components/ModelosDocumento';
import { GerenciarTarefas } from './components/GerenciarTarefas';
import { GeradorTarefas } from './components/GeradorTarefas';

// ─── Types ───────────────────────────────────────────────────────────────────

type ActiveTab =
  | 'visao-geral'
  | 'tarefas'
  | 'documentos-express'
  | 'circular'
  | 'status-integracao'
  | 'relatorios'
  | 'auditoria'
  | 'configuracoes';

// ─── Data ────────────────────────────────────────────────────────────────────

const tabs: { id: ActiveTab; label: string }[] = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'tarefas', label: 'Tarefas' },
  { id: 'documentos-express', label: 'Documentos Express' },
  { id: 'circular', label: 'Circular' },
  { id: 'status-integracao', label: 'Status de integração' },
  { id: 'relatorios', label: 'Relatórios' },
  { id: 'auditoria', label: 'Auditoria' },
  { id: 'configuracoes', label: 'Configurações' },
];

const leftSections = [
  {
    id: 0,
    label: 'Pré - configurações - Domínio Contábil',
    description:
      'Funcionários, empresas e usuários do cliente devem ser cadastrados no Domínio Contábil. Aqui serão feitas apenas as configurações de regras específicas do produto.',
  },
  {
    id: 1,
    label: 'Escritório',
    description:
      'Configurações de regras gerais do módulo que devem ser aplicadas para todas as tarefas e usuários do Processos.',
  },
  {
    id: 2,
    label: 'Clientes',
    description:
      'Configure as regras de relacionamento com os clientes, defina permissões de acesso e ajuste os agrupadores de acordo com a estrutura do seu escritório.',
  },
  {
    id: 3,
    label: 'Tarefas',
    description:
      'Gerencie as regras das tarefas a serem executadas no dia a dia do escritório, crie fluxos para tarefas entre diferentes departamentos e valide os modelos de documento a serem enviados automaticamente para os clientes.',
  },
  {
    id: 4,
    label: 'Comunicações',
    description:
      'Personalize as mensagens de sistema que serão enviadas automaticamente para os seus clientes.',
  },
];

const faqItems = [
  {
    id: 1,
    question: 'O que são tarefas recorrentes, esporádicas e tarefas de fluxo?',
    answer: (
      <ul className="space-y-3 pl-1">
        <li className="flex gap-2">
          <span className="mt-[2px] shrink-0 text-foreground" style={{ fontSize: 'var(--text-label)' }}>•</span>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Tarefas recorrentes são aquelas que se repetem periodicamente, sempre num período de tempo específico
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[2px] shrink-0" style={{ fontSize: 'var(--text-label)' }}>•</span>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Tarefas esporádicas são solicitações de serviço ou tarefas que fazem parte do dia a dia do escritório, mas que não tem momento exato para acontecer novamente
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[2px] shrink-0" style={{ fontSize: 'var(--text-label)' }}>•</span>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Tarefas de fluxo são tarefas que irão compor um fluxo de tarefa, isso é, diferentes tarefas que, juntas, irão completar uma atividade maior
          </span>
        </li>
      </ul>
    ),
  },
  {
    id: 2,
    question: 'Qual a diferença entre data legal e data meta?',
    answer: (
      <ul className="space-y-3 pl-1">
        <li className="flex gap-2">
          <span className="mt-[2px] shrink-0" style={{ fontSize: 'var(--text-label)' }}>•</span>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Data legal: é a data limite para a entrega de uma tarefa conforme a legislação atual
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[2px] shrink-0" style={{ fontSize: 'var(--text-label)' }}>•</span>
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
            Data meta: é a data que o escritório estabelece como meta para a entrega da tarefa para o cliente, idealmente anterior à data legal
          </span>
        </li>
      </ul>
    ),
  },
  {
    id: 3,
    question: 'Por que configurar modelos de documentos?',
    answer: (
      <div className="space-y-3">
        <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
          A configuração de modelos de documentos é essencial para que as tarefas sejam automaticamente fechadas após as atividades sejam finalizadas no Domínio Contábil.
        </p>
        <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
          Por exemplo: quando configurado o modelo de documento para a tarefa Folha de pagamento, ao finalizar um fechamento de folha no módulo correspondente, o documento é automaticamente enviado para o cliente e a tarefa é fechada aqui no Processos.
        </p>
      </div>
    ),
  },
];

interface RightSectionCard {
  icon: React.ReactNode;
  label: string;
}

interface RightSection {
  id: number;
  label: string;
  cards: RightSectionCard[];
}

// ─── Icon helper ─────────────────────────────────────────────────────────────

function Icon16({ d, viewBox = '0 0 16 16' }: { d: string; viewBox?: string }) {
  return (
    <svg className="block shrink-0" width="16" height="16" fill="none" viewBox={viewBox}>
      <path d={d} fill="var(--primary)" />
    </svg>
  );
}

const rightSections: RightSection[] = [
  {
    id: 1,
    label: 'Escritório',
    cards: [
      { icon: <Icon16 d={svgPaths.p21b5ad00} viewBox="0 0 16.0034 16.0034" />, label: 'Funcionários\ndo escritório' },
      { icon: <Icon16 d={svgPaths.pedd5340} viewBox="0 0 16.0034 16.0034" />, label: 'Feriados e\nhorários de acesso' },
      { icon: <Icon16 d={svgPaths.p2743e380} viewBox="0 0 16.0034 12.8127" />, label: '\nResponsabilidades' },
      { icon: <Icon16 d={svgPaths.p1584a200} viewBox="0 0 14.003 14.003" />, label: 'Agrupadores\nde tarefas e clientes' },
    ],
  },
  {
    id: 2,
    label: 'Clientes',
    cards: [
      { icon: <Icon16 d={svgPaths.p1326ea80} viewBox="0 0 16.0034 16.0034" />, label: '\nEmpresas' },
      { icon: <Icon16 d={svgPaths.p160cedf0} viewBox="0 0 16.0034 12.8027" />, label: '\nUsuários do cliente' },
      { icon: <Icon16 d={svgPaths.p28ea8080} viewBox="0 0 16.0034 5.00107" />, label: 'Adequação de agrupadores' },
    ],
  },
  {
    id: 3,
    label: 'Tarefas',
    cards: [
      { icon: <Icon16 d={svgPaths.p2d9d1200} viewBox="0 0 12.0026 16.0034" />, label: 'Modelos de documentos' },
      { icon: <Icon16 d={svgPaths.p3dee5800} viewBox="0 0 12.0026 16.0034" />, label: '\nGerenciar tarefas' },
      { icon: <Icon16 d={svgPaths.p7f63400} viewBox="0 0 16.0034 12.0026" />, label: '\nFluxo de tarefas' },
      { icon: <Icon16 d={svgPaths.p117b8b00} viewBox="0 0 12.0026 14.003" />, label: '\nGerador de tarefas' },
    ],
  },
  {
    id: 4,
    label: 'Comunicações',
    cards: [
      { icon: <Icon16 d={svgPaths.pd5c8640} viewBox="0 0 12.0026 16.0034" />, label: 'Personalizar assinatura e e-mail' },
      { icon: <Icon16 d={svgPaths.p2fcdde00} viewBox="0 0 16.0034 16.0034" />, label: '\nInbox' },
      { icon: <Icon16 d={svgPaths.p3f678c00} viewBox="0 0 16.0034 16.0034" />, label: 'Modelos de e-mail e WhatsApp' },
    ],
  },
];

// ─── FAQ Drawer ───────────────────────────────────────────────────────────────

function FAQDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div style={{ display: 'contents' }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col overflow-hidden"
        style={{
          width: 'min(380px, 100vw)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-muted transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft size={18} style={{ color: 'var(--foreground)' }} />
          </button>
          <h2
            style={{
              fontSize: 'var(--text-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
            }}
          >
            Perguntas frequentes
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="flex-1 overflow-y-auto">
          <div style={{ borderBottom: '1px solid var(--border)' }}>
            {faqItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <div className="flex gap-2 flex-1 min-w-0">
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', flexShrink: 0, marginTop: '1px' }}>
                      {item.id}.
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-label)',
                        color: 'var(--foreground)',
                        fontWeight: expandedId === item.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <div className="shrink-0 mt-[1px]">
                    {expandedId === item.id ? (
                      <ChevronUp size={16} style={{ color: 'var(--primary)' }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: 'var(--primary)' }} />
                    )}
                  </div>
                </button>

                {expandedId === item.id && (
                  <div className="px-5 pb-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <div
      className="bg-white flex items-center justify-between h-full px-4 md:px-6"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="flex md:hidden items-center justify-center w-8 h-8 rounded hover:bg-muted transition-colors cursor-pointer"
        >
          <Menu size={18} style={{ color: 'var(--foreground)' }} />
        </button>

        {/* TR Logo icon */}
        <div className="relative shrink-0 w-4 h-4">
          <svg className="block w-full h-full" fill="none" viewBox="0 0 16 16">
            <g clipPath="url(#trclip)">
              <path d={svgPaths.p311bc200} fill="var(--primary)" />
              <path d={svgPaths.p1df1ac80} fill="var(--primary)" />
              <path d={svgPaths.p3e7c300} fill="var(--primary)" />
              <path d={svgPaths.p9c85980} fill="var(--primary)" />
            </g>
            <defs>
              <clipPath id="trclip">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
          <strong>Domínio </strong>Contábil
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg width="14" height="16" fill="none" viewBox="0 0 14 16">
            <path d={svgPaths.p2dfd2700} fill="var(--foreground)" />
          </svg>
          <div
            className="absolute top-[3px] left-[15px] flex items-center justify-center rounded-full px-[3px]"
            style={{ minWidth: '12px', height: '12px', background: 'var(--destructive)' }}
          >
            <span className="text-white" style={{ fontSize: '10px', lineHeight: 'normal' }}>23</span>
          </div>
        </div>
        <div className="w-px h-5" style={{ background: 'var(--border)' }} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#294437', border: '1px solid var(--border)' }}
        >
          <span className="text-[#d9d9d9]" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)' }}>
            TR
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarItem({
  label, active = false, indent = false, icon, badge,
}: {
  label: string; active?: boolean; indent?: boolean; icon: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded h-10 cursor-pointer transition-colors"
      style={{
        padding: indent ? '10px 12px 10px 24px' : '10px 12px',
        background: active ? 'var(--primary)' : 'transparent',
      }}
    >
      <div className="shrink-0 w-4 h-4 relative flex items-center justify-center">{icon}</div>
      <span style={{ fontSize: 'var(--text-label)', color: active ? 'white' : 'var(--foreground)', fontWeight: 'var(--font-weight-regular)' }} className="flex-1 min-w-0 truncate">
        {label}
      </span>
      {badge}
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [meuEscritorioOpen, setMeuEscritorioOpen] = useState(true);

  return (
    <div style={{ display: 'contents' }}>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          'bg-white flex flex-col shrink-0 h-full overflow-y-auto z-30',
          'fixed md:relative top-0 left-0',
          'transition-transform duration-300 md:transition-none',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        style={{
          width: '224px',
          borderRight: '1px solid var(--border)',
          // On desktop, always visible
        }}
      >
        {/* Mobile close button */}
        <div className="flex md:hidden items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Menu</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted cursor-pointer">
            <X size={16} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-3 py-2 flex-1">
          <SidebarItem label="Visão Geral" icon={<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d={svgPaths.p2e19c700} fill="var(--foreground)" /></svg>} />
          <div className="h-px my-1" style={{ background: 'var(--border)' }} />
          <SidebarItem label="Folha" icon={<svg width="16" height="12" fill="none" viewBox="0 0 16 12"><path d={svgPaths.pa207380} fill="var(--foreground)" /></svg>} />
          <SidebarItem label="Escrita Fiscal" icon={<svg width="12" height="16" fill="none" viewBox="0 0 12 16"><path d={svgPaths.p236acd80} fill="var(--foreground)" /></svg>} badge={<svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d={svgPaths.p30d0cf00} fill="var(--foreground)" /></svg>} />
          <SidebarItem label="Contabilidade" icon={<svg width="16" height="13" fill="none" viewBox="0 0 16 13"><path d={svgPaths.p1b52dd00} fill="var(--foreground)" /></svg>} />
          <SidebarItem label="Lalur" icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d={svgPaths.p2c228d00} fill="var(--foreground)" /></svg>} />
          <SidebarItem label="Patrimônio" icon={<svg width="16" height="13" fill="none" viewBox="0 0 16 13"><path d={svgPaths.p5fc6d00} fill="var(--foreground)" /></svg>} />
          <div className="h-px my-1" style={{ background: 'var(--border)' }} />

          {/* Meu Escritório */}
          <button
            className="flex items-center gap-3 rounded h-10 cursor-pointer transition-colors w-full text-left px-3"
            onClick={() => setMeuEscritorioOpen(!meuEscritorioOpen)}
          >
            <div className="shrink-0 w-4 h-4 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d={svgPaths.p22e12b00} fill="var(--primary)" /></svg>
            </div>
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', fontWeight: 'var(--font-weight-regular)' }} className="flex-1">Meu Escritório</span>
            <svg width="10" height="6" fill="none" viewBox="0 0 9.75 5.25" style={{ transform: meuEscritorioOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
              <path d={svgPaths.p3f2e780} fill="var(--primary)" />
            </svg>
          </button>

          {meuEscritorioOpen && (
            <>
              <SidebarItem label="Usuários" indent icon={<svg width="14" height="16" fill="none" viewBox="0 0 14 16"><path d={svgPaths.pe09c600} fill="var(--foreground)" /></svg>} />
              <SidebarItem label="Portal do Cliente" indent icon={<svg width="16" height="12" fill="none" viewBox="0 0 16 12"><path d={svgPaths.p88a7780} fill="var(--foreground)" /></svg>} />
              <SidebarItem label="Messenger" indent icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d={svgPaths.p1b344980} fill="var(--foreground)" /></svg>} />
              <SidebarItem label="Processos" active indent icon={<svg width="16" height="12" fill="none" viewBox="0 0 16 12"><path d={svgPaths.p1256e700} fill="white" /></svg>} />
              <SidebarItem label="Documentos" indent icon={<svg width="12" height="16" fill="none" viewBox="0 0 12 16"><path d={svgPaths.p29d07c00} fill="var(--foreground)" /></svg>} />
              <SidebarItem label="Conta PJ" indent icon={<svg width="16" height="14" fill="none" viewBox="0 0 16 14"><path d={svgPaths.p320c6780} fill="var(--foreground)" /></svg>} />
              <SidebarItem label="Benefícios" indent icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><g><path clipRule="evenodd" d={svgPaths.p3c02ea80} fill="var(--foreground)" fillRule="evenodd" /><path clipRule="evenodd" d={svgPaths.p18a92b00} fill="var(--foreground)" fillRule="evenodd" /></g></svg>} />
            </>
          )}

          <div className="h-px my-1" style={{ background: 'var(--border)' }} />
          <div className="flex items-center gap-3 h-10 px-3">
            <svg width="16" height="14" fill="none" viewBox="0 0 16 14"><g><path d={svgPaths.p61cff80} fill="var(--foreground)" /><path d={svgPaths.p3efe6280} fill="var(--foreground)" /><path d={svgPaths.p12814200} fill="var(--foreground)" /></g></svg>
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }} className="flex-1">Mais</span>
            <button className="shrink-0 flex items-center justify-center">
              <svg width="9" height="9" fill="none" viewBox="0 0 8.25 8.25"><path d={svgPaths.p4546600} fill="var(--primary)" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Left Accordion Card ──────────────────────────────────────────────────────

function LeftAccordionCard({ onFAQ }: { onFAQ: () => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(0);

  const toggle = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div
      className="bg-white rounded flex flex-col w-full md:w-[352px] md:shrink-0"
      style={{ boxShadow: 'var(--elevation-sm)' }}
    >
      {/* Title */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--muted)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
          Configurações
        </h3>
      </div>

      {/* Accordion sections */}
      <div className="flex flex-col px-4 py-4 gap-4 flex-1">
        {leftSections.map((section, idx) => (
          <div key={section.id}>
            <button
              className="w-full flex items-center justify-between gap-2 cursor-pointer"
              onClick={() => toggle(section.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="shrink-0 w-6 h-6 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--primary)' }}
                >
                  <span className="text-white" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {section.id}
                  </span>
                </div>
                <span style={{ fontSize: '16px', color: 'var(--foreground)', fontWeight: 'var(--font-weight-regular)' }} className="text-left">
                  {section.label}
                </span>
              </div>
              <div className="shrink-0">
                {expandedId === section.id ? (
                  <svg width="13" height="7" fill="none" viewBox="0 0 13.0028 7.0015">
                    <path d={svgPaths.p4e03900} fill="var(--primary)" />
                  </svg>
                ) : (
                  <svg width="13" height="7" fill="none" viewBox="0 0 13.0028 7.0015">
                    <path d={svgPaths.p10e7e600} fill="var(--primary)" />
                  </svg>
                )}
              </div>
            </button>

            {expandedId === section.id && (
              <p className="mt-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', lineHeight: '1.6' }}>
                {section.description}
              </p>
            )}

            {idx < leftSections.length - 1 && (
              <div className="h-px mt-4" style={{ background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* FAQ Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onFAQ}
          className="flex items-center justify-center rounded cursor-pointer transition-colors hover:bg-red-50"
          style={{ border: '1px solid var(--primary)', padding: '6px 20px', minHeight: '32px' }}
        >
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
            Perguntas frequentes
          </span>
        </button>
      </div>

      {/* Video Banner — image only, no text overlay */}
      <div className="overflow-hidden rounded-b" style={{ aspectRatio: '2.88 / 1', minHeight: '80px' }}>
        <img
          src={imgVideoBanner}
          alt="Saiba como configurar o Processos"
          className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
        />
      </div>
    </div>
  );
}

// ─── Right Cards Panel ────────────────────────────────────────────────────────

function FeatureCard({ card, onClick }: { card: RightSectionCard; onClick?: () => void }) {
  const lines = card.label.split('\n');
  return (
    <div
      onClick={onClick}
      className="bg-white rounded p-2 flex items-start gap-2 cursor-pointer hover:shadow-md transition-shadow"
      style={{
        boxShadow: 'var(--elevation-sm)',
        flex: '1 1 100px',
        minWidth: '90px',
        maxWidth: '140px',
        outline: onClick ? undefined : undefined,
      }}
    >
      <div className="flex flex-col gap-1 items-start w-full">
        <div className="shrink-0">{card.icon}</div>
        <div>
          {lines.map((line, i) =>
            line.trim() ? (
              <p key={i} style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', lineHeight: 1.5 }}>
                {line}
              </p>
            ) : (
              <div key={i} style={{ height: '0.75em' }} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function RightPanel({ onCardClick }: { onCardClick?: (label: string) => void }) {
  return (
    <div
      className="bg-white rounded flex-1 min-w-0 overflow-y-auto w-full"
      style={{ boxShadow: 'var(--elevation-sm)' }}
    >
      {rightSections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <div
              className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              <span className="text-white" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }}>
                {section.id}
              </span>
            </div>
            <span style={{ fontSize: '16px', color: 'var(--foreground)', fontWeight: 'var(--font-weight-regular)' }}>
              {section.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {section.cards.map((card, i) => (
              <FeatureCard key={i} card={card} onClick={onCardClick ? () => onCardClick(card.label) : undefined} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab Menu ─────────────────────────────────────────────────────────────────

function TabMenu({ active, onChange }: { active: ActiveTab; onChange: (t: ActiveTab) => void }) {
  return (
    <div
      className="bg-white flex items-center px-4 md:px-6 gap-4 md:gap-6 shrink-0 overflow-x-auto"
      style={{ height: '48px', borderBottom: '1px solid var(--border)', scrollbarWidth: 'none' }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative h-full flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0"
            style={{ padding: '8px 0' }}
          >
            <span style={{
              fontSize: 'var(--text-label)',
              color: isActive ? 'var(--primary)' : 'var(--foreground)',
              fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
            }}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: 'var(--primary)' }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── ShortcutBar ──────────────────────────────────────────────────────────────

function ShortcutBar() {
  return (
    <div
      className="bg-white hidden md:flex flex-col items-center w-14 shrink-0 h-full"
      style={{ borderLeft: '1px solid var(--border)' }}
    >
      <div className="flex flex-col gap-3 px-3 py-2">
        {[
          { d: svgPaths.p1b344980, w: 16, h: 16, vb: '0 0 16 16' },
          { d: svgPaths.p2e31a200, w: 14, h: 16, vb: '0 0 14 16' },
          { d: svgPaths.p29adab00, w: 15, h: 16, vb: '0 0 15 16' },
          { d: svgPaths.p296e3b00, w: 12, h: 16, vb: '0 0 12 16' },
        ].map((icon, i) => (
          <div key={i} className="relative w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
            <svg width={icon.w} height={icon.h} fill="none" viewBox={icon.vb}>
              <path d={icon.d} fill="var(--foreground)" />
            </svg>
            <div className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full" style={{ background: 'var(--destructive)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('configuracoes');
  const [showFAQ, setShowFAQ] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tarefasInitialView, setTarefasInitialView] = useState<TarefasViewTab | undefined>(undefined);
  const [tarefasInitialFilter, setTarefasInitialFilter] = useState<TarefasFilter | undefined>(undefined);
  const [innerView, setInnerView] = useState<string | null>(null);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function handleNavigateTarefas(viewTab?: TarefasViewTab, filter?: TarefasFilter) {
    setTarefasInitialView(viewTab);
    setTarefasInitialFilter(filter);
    setActiveTab('tarefas');
  }

  return (
    <div className="flex flex-col" style={{ width: '100vw', height: '100vh', background: 'var(--background)', overflow: 'hidden' }}>

      {/* Product Header */}
      <div
        className="shrink-0 relative"
        style={{ height: '60px', borderTop: '4px solid var(--primary)', zIndex: 20 }}
      >
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content + ShortcutBar */}
        <div className="flex flex-1 min-w-0 overflow-hidden">
          {/* Main content */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Tab Menu */}
            <TabMenu
              active={activeTab}
              onChange={(t) => setActiveTab(t)}
            />

            {/* Content area */}
            <div className="flex-1 overflow-auto" style={{ background: '#f9fafc' }}>
              {activeTab === 'configuracoes' ? (
                innerView === 'funcionarios' ? (
                  <FuncionariosEscritorio onBack={() => setInnerView(null)} />
                ) : innerView === 'feriados' ? (
                  <FeriadosHorarios onBack={() => setInnerView(null)} />
                ) : innerView === 'responsabilidades' ? (
                  <Responsabilidades onBack={() => setInnerView(null)} />
                ) : innerView === 'agrupadores' ? (
                  <AgrupadorTarefasClientes onBack={() => setInnerView(null)} />
                ) : innerView === 'empresas' ? (
                  <Empresas onBack={() => setInnerView(null)} />
                ) : innerView === 'usuarios-cliente' ? (
                  <UsuariosCliente onBack={() => setInnerView(null)} />
                ) : innerView === 'adequacao-agrupadores' ? (
                  <AdequacaoAgrupadores onBack={() => setInnerView(null)} />
                ) : innerView === 'inbox' ? (
                  <InboxConfig onBack={() => setInnerView(null)} />
                ) : innerView === 'personalizar-assinatura' ? (
                  <PersonalizarAssinatura onBack={() => setInnerView(null)} />
                ) : innerView === 'templates-email' ? (
                  <TemplatesEmailWhatsapp onBack={() => setInnerView(null)} />
                ) : innerView === 'modelos-documento' ? (
                  <ModelosDocumento onBack={() => setInnerView(null)} />
                ) : innerView === 'gerenciar-tarefas' ? (
                  <GerenciarTarefas onBack={() => setInnerView(null)} />
                ) : innerView === 'gerador-tarefas' ? (
                  <GeradorTarefas onBack={() => setInnerView(null)} />
                ) : (
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 items-start">
                    <LeftAccordionCard onFAQ={() => setShowFAQ(true)} />
                    <RightPanel onCardClick={(label) => {
                      if (label.includes('Funcionários')) setInnerView('funcionarios');
                      else if (label.includes('Feriados') || label.includes('horários')) setInnerView('feriados');
                      else if (label.includes('Responsabilidades')) setInnerView('responsabilidades');
                      else if (label.includes('Agrupadores') || label.includes('agrupadores')) setInnerView('agrupadores');
                      else if (label.includes('Empresas') || label.includes('empresas')) setInnerView('empresas');
                      else if (label.includes('Usuários') || label.includes('usuários')) setInnerView('usuarios-cliente');
                      else if (label.includes('Adequação') || label.includes('adequação')) setInnerView('adequacao-agrupadores');
                      else if (label.includes('Inbox') || label.includes('inbox')) setInnerView('inbox');
                      else if (label.includes('assinatura') || label.includes('Personalizar')) setInnerView('personalizar-assinatura');
                      else if (label.includes('Modelos') || label.includes('WhatsApp')) setInnerView('templates-email');
                      else if (label.includes('Modelos de documentos') || label.includes('documentos')) setInnerView('modelos-documento');
                      else if (label.includes('Gerenciar') || label.includes('gerenciar')) setInnerView('gerenciar-tarefas');
                      else if (label.includes('Gerador') || label.includes('gerador')) setInnerView('gerador-tarefas');
                    }} />
                  </div>
                )
              ) : activeTab === 'visao-geral' ? (
                <VisaoGeral onNavigateTarefas={handleNavigateTarefas} />
              ) : activeTab === 'tarefas' ? (
                <Tarefas initialView={tarefasInitialView} initialFilter={tarefasInitialFilter} />
              ) : activeTab === 'auditoria' ? (
                <Auditoria />
              ) : activeTab === 'circular' ? (
                <Circular />
              ) : activeTab === 'relatorios' ? (
                <Relatorios />
              ) : activeTab === 'status-integracao' ? (
                <StatusIntegracao />
              ) : activeTab === 'documentos-express' ? (
                <DocumentosExpress />
              ) : (
                <div className="flex items-center justify-center h-full p-6">
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-base)', textAlign: 'center' }}>
                    Conteúdo de{' '}
                    <strong>{tabs.find((t) => t.id === activeTab)?.label}</strong> em breve.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shortcut Bar */}
          <ShortcutBar />
        </div>
      </div>

      {/* FAQ Side Drawer */}
      <FAQDrawer open={showFAQ} onClose={() => setShowFAQ(false)} />
    </div>
  );
}