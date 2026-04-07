import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Filter, Download, MoreHorizontal,
  ChevronDown, ChevronUp, Calendar, User, Building2,
  FileText, Mail, Users, Hash, Clock, AlertTriangle,
  CheckCircle2, Loader2, Upload, Paperclip, Check,
  Activity, MessageSquare, Bell, RefreshCw,
  CheckSquare, PauseCircle, Ban, Send, Trash2, Eye,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type KanbanStatus = 'Aberta' | 'Em andamento' | 'Aguardando aprovação' | 'Impedida' | 'Desconsiderada' | 'Concluída';

interface DocumentoArquivo {
  nome: string;
  dataEnvio: string;
}

interface Documento {
  id: number;
  nome: string;
  enviado: boolean;
  arquivos?: DocumentoArquivo[];
}

interface Atividade {
  id: number;
  nome: string;
  anexo: boolean;
  enviado: boolean;
  arquivo?: string;
}

interface ChecklistItem {
  id: number;
  descricao: string;
  feito: boolean;
}

interface TarefaAssociada {
  id: number;
  nome: string;
  cliente: string;
  dataMeta: string;
}

interface UsuarioCliente {
  nome: string;
  email: string;
  telefone?: string;
}

interface HistoricoItem {
  id: number;
  tipo: string;
  texto: string;
  usuario: string;
  tempo: string;
  cor: string;
  bg: string;
}

interface Tarefa {
  id: number;
  numero: string;
  nome: string;
  empresa: string;
  responsavel: string;
  status: KanbanStatus;
  dataMeta: string;
  dataLegal: string;
  competencia: string;
  criadoPor: string;
  valor: string;
  emailTarefa: string;
  observacao: string;
  usuariosCliente: UsuarioCliente[];
  emailsAdicionais: string[];
  documentos: Documento[];
  atividades: Atividade[];
  checklist: ChecklistItem[];
  tarefasAssociadas: TarefaAssociada[];
  historico: HistoricoItem[];
  itens?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockChecklist: ChecklistItem[] = [
  { id: 1, descricao: 'Lançar notas fiscais de entrada', feito: true },
  { id: 2, descricao: 'Lançar notas fiscais de saída', feito: false },
  { id: 3, descricao: 'Conferir apuração de ICMS', feito: false },
  { id: 4, descricao: 'Conferir apuração de IPI', feito: false },
  { id: 5, descricao: 'Gerar SPED Fiscal', feito: false },
];

const mockDocumentos: Documento[] = [
  {
    id: 1,
    nome: 'Contrato Social',
    enviado: true,
    arquivos: [{ nome: 'contrato_social.pdf', dataEnvio: '05/10/2025 14:35' }],
  },
  {
    id: 2,
    nome: 'Contrato Social',
    enviado: true,
    arquivos: [{ nome: 'contrato_social.pdf', dataEnvio: '05/10/2025 14:35' }],
  },
];

const mockAtividades: Atividade[] = [
  { id: 1, nome: 'Relatório de conferência', anexo: true, enviado: true, arquivo: 'relatorio.pdf' },
  { id: 2, nome: 'Protocolo de entrega', anexo: true, enviado: false },
];

const mockTarefasAssociadas: TarefaAssociada[] = [
  { id: 101, nome: 'DCTF Ago/25', cliente: 'Empresa ABC Ltda', dataMeta: '10/09/2025' },
  { id: 102, nome: 'REINF Ago/25', cliente: 'Empresa ABC Ltda', dataMeta: '12/09/2025' },
];

const mockHistorico: HistoricoItem[] = [
  {
    id: 1,
    tipo: 'status',
    texto: 'Status alterado de "Aberta" para "Em andamento"',
    usuario: 'Maria Silva',
    tempo: '10/10/2025 09:15',
    cor: 'var(--chart-3)',
    bg: 'rgba(254,166,1,0.10)',
  },
  {
    id: 2,
    tipo: 'documento',
    texto: 'Documento "Contrato Social" recebido e validado',
    usuario: 'Carlos Diretor',
    tempo: '07/10/2025 16:45',
    cor: 'var(--chart-2)',
    bg: 'rgba(21,115,211,0.10)',
  },
];

const mockUsuariosCliente: UsuarioCliente[] = [
  { nome: 'Maria Silva', email: 'maria@empresa.com', telefone: '(11) 98765-4321' },
  { nome: 'João Santos', email: 'joao@empresa.com' },
];

function buildTarefa(
  id: number,
  nome: string,
  empresa: string,
  responsavel: string,
  status: KanbanStatus,
  itens?: number
): Tarefa {
  return {
    id,
    numero: `T-${String(id).padStart(5, '0')}`,
    nome,
    empresa,
    responsavel,
    status,
    dataMeta: '11/11/2025',
    dataLegal: '15/11/2025',
    competencia: 'Out/2025',
    criadoPor: 'Sistema Automático',
    valor: 'R$ 1932,39',
    emailTarefa: `tarefa-${id}@dominio.com.br`,
    observacao: 'Atenção: prazo reduzido neste mês.',
    usuariosCliente: mockUsuariosCliente,
    emailsAdicionais: ['contato@empresa.com', 'financeiro@empresa.com'],
    documentos: mockDocumentos,
    atividades: mockAtividades,
    checklist: mockChecklist,
    tarefasAssociadas: mockTarefasAssociadas,
    historico: mockHistorico,
    itens,
  };
}

const mockTarefas: Tarefa[] = [
  buildTarefa(1, 'DCTF Ago/25', 'Empresa ABC Ltda', 'Fernanda', 'Aberta', 7),
  buildTarefa(2, 'DCTF Ago/25', 'VKW Holdings', 'Fernanda', 'Aberta'),
  buildTarefa(3, 'DCTF Ago/25', 'Empresa XYZ', 'Fernanda', 'Aberta'),
  buildTarefa(4, 'REINF Out/25', 'Empresa ABC Ltda', 'Maria Silva', 'Aberta', 3),
  buildTarefa(5, 'REINF Out/25', 'DEF Comércio', 'Maria Silva', 'Em andamento'),
  buildTarefa(6, 'REINF Out/25', 'GHI Serviços', 'Maria Silva', 'Em andamento'),
  buildTarefa(7, 'Alteração Contratual', 'JKL Indústria', 'João Pedro', 'Esporádica', 7),
  buildTarefa(8, 'Alteração Contratual', 'MNO Holding', 'João Pedro', 'Esporádica'),
  buildTarefa(9, 'Revisão de Contratos', 'PQR Startup', 'Ana Torres', 'Concluída', 2),
  buildTarefa(10, 'ECF 2025', 'STU Logística', 'Carlos Rocha', 'Impedida', 20),
];

const kanbanStatusConfig: Record<
  KanbanStatus,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Aberta: { color: 'var(--chart-2)', bg: 'rgba(21,115,211,0.10)', icon: Clock },
  'Em andamento': { color: 'var(--chart-3)', bg: 'rgba(254,166,1,0.12)', icon: Loader2 },
  'Aguardando aprovação': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', icon: PauseCircle },
  Impedida: { color: 'var(--chart-4)', bg: 'rgba(220,10,10,0.10)', icon: AlertTriangle },
  Desconsiderada: { color: 'var(--muted-foreground)', bg: 'rgba(153,153,153,0.12)', icon: Ban },
  Concluída: { color: 'var(--chart-1)', bg: 'rgba(56,124,43,0.10)', icon: CheckCircle2 },
};

const historicoIconMap: Record<string, React.ElementType> = {
  status: RefreshCw,
  documento: FileText,
  responsavel: User,
  comentario: MessageSquare,
  notificacao: Bell,
  checklist: CheckSquare,
  criacao: Plus,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: KanbanStatus }) {
  const { color, bg, icon: Icon } = kanbanStatusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        fontSize: 'var(--text-caption)',
        color,
        background: bg,
        fontWeight: 'var(--font-weight-semibold)',
      }}
    >
      <Icon size={10} /> {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Tarefas() {
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(mockTarefas[0]);
  const [activeTab, setActiveTab] = useState<string>('informacoes');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'DCTF Ago/25': true,
  });

  // Group tasks by name
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Tarefa[]> = {};
    mockTarefas.forEach((task) => {
      if (!groups[task.nome]) {
        groups[task.nome] = [];
      }
      groups[task.nome].push(task);
    });
    return Object.entries(groups).map(([nome, tasks]) => ({
      nome,
      tasks,
      count: tasks[0].itens || tasks.length,
    }));
  }, []);

  const toggleGroup = (nome: string) => {
    setExpandedGroups((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              style={{
                fontSize: 'var(--text-heading-3)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
              }}
            >
              Tarefas
            </h1>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
              23 tarefas encontradas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                fontSize: 'var(--text-label)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                background: 'white',
              }}
            >
              <Clock size={14} /> Apontar
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                fontSize: 'var(--text-label)',
                color: 'white',
                background: 'var(--primary)',
                border: 'none',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              <Plus size={14} /> Nova tarefa
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 relative" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar por complemento/protocolo"
              className="w-full rounded-md px-10 py-2 outline-none"
              style={{
                border: '1px solid var(--border)',
                background: 'white',
                fontSize: 'var(--text-label)',
                color: 'var(--foreground)',
              }}
            />
          </div>
          <select
            className="rounded-md px-3 py-2 appearance-none outline-none"
            style={{
              border: '1px solid var(--border)',
              background: 'white',
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
            }}
          >
            <option>Cliente: Maria Silva</option>
          </select>
          <select
            className="rounded-md px-3 py-2 appearance-none outline-none"
            style={{
              border: '1px solid var(--border)',
              background: 'white',
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
            }}
          >
            <option>Responsável: Maria Silva</option>
          </select>
          <select
            className="rounded-md px-3 py-2 appearance-none outline-none"
            style={{
              border: '1px solid var(--border)',
              background: 'white',
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
            }}
          >
            <option>Tarefa: Maria Silva</option>
          </select>
        </div>
      </div>

      {/* Actions Bar */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)', background: 'white' }}
      >
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer"
            style={{
              fontSize: 'var(--text-label)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              background: 'rgba(214,64,0,0.05)',
            }}
          >
            <MoreHorizontal size={14} /> Lista de tarefas
          </button>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              23 tarefas
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              • 11 Data
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              • 12 Cliente
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              • 13 Status
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              background: 'white',
            }}
          >
            <Download size={13} /> Exportar Excel
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              background: 'white',
            }}
          >
            <Filter size={13} /> Filtros avançados
          </button>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Task List */}
        <div
          className="w-80 flex flex-col overflow-y-auto"
          style={{ borderRight: '1px solid var(--border)', background: 'white' }}
        >
          {groupedTasks.map((group) => {
            const isExpanded = expandedGroups[group.nome];
            return (
              <div key={group.nome}>
                {/* Group Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onClick={() => toggleGroup(group.nome)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Hash size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <span
                      className="truncate"
                      style={{
                        fontSize: 'var(--text-label)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {group.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: 'var(--text-caption)',
                        background: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      {group.count} itens
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={14} style={{ color: 'var(--muted-foreground)' }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </div>
                </div>

                {/* Group Tasks */}
                {isExpanded &&
                  group.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: selectedTask?.id === task.id ? 'rgba(214,64,0,0.04)' : 'white',
                      }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          style={{
                            fontSize: 'var(--text-caption)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          #{task.numero}
                        </span>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={12} style={{ color: 'var(--muted-foreground)' }} />
                        <span
                          style={{
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                            fontWeight: 'var(--font-weight-semibold)',
                          }}
                        >
                          {task.empresa}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={12} style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                          {task.responsavel}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        {/* Column 2: Task Details with Tabs */}
        {selectedTask && (
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'white' }}>
            {/* Task Header */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2
                      style={{
                        fontSize: 'var(--text-heading-4)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {selectedTask.nome}
                    </h2>
                    <StatusBadge status={selectedTask.status} />
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Building2 size={12} style={{ color: 'var(--muted-foreground)' }} />
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                      Empresa ABC Ltda
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} style={{ color: 'var(--muted-foreground)' }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                      Abrir detalhes do cliente
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { id: 'informacoes', label: 'Informações' },
                { id: 'usuarios', label: 'Usuários de clientes' },
                { id: 'emails', label: 'Emails adicionais' },
                { id: 'associadas', label: 'Tarefas associadas' },
                { id: 'historico', label: 'Histórico' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-3 cursor-pointer transition-colors"
                  style={{
                    fontSize: 'var(--text-label)',
                    fontWeight:
                      activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                    borderBottom:
                      activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'informacoes' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Responsável
                      </label>
                      <div className="mt-1">
                        <select
                          className="w-full rounded-md px-3 py-2 appearance-none outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                        >
                          <option>{selectedTask.responsavel}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          className="w-full rounded-md px-3 py-2 appearance-none outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                        >
                          <option>{selectedTask.status}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Meta
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={selectedTask.dataMeta}
                          className="w-full rounded-md px-3 py-2 outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Criado por
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={selectedTask.criadoPor}
                          className="w-full rounded-md px-3 py-2 outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Competência
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={selectedTask.competencia}
                          className="w-full rounded-md px-3 py-2 outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Data Limite
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={selectedTask.dataLegal}
                          className="w-full rounded-md px-3 py-2 outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: 'var(--text-label)',
                            color: 'var(--foreground)',
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Tipo de complemento
                    </label>
                    <div className="mt-1">
                      <select
                        className="w-full rounded-md px-3 py-2 appearance-none outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                        }}
                      >
                        <option>Out/2025</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      E-mail da tarefa
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={selectedTask.emailTarefa}
                        className="w-full rounded-md px-3 py-2 outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                        }}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Notificações de cliente
                    </label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                          E-mail - 5m
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" />
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                          Portal do Cliente - 5m
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" />
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                          Whatsapp - Não
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Valor
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedTask.valor}
                        className="flex-1 rounded-md px-3 py-2 outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                        }}
                        readOnly
                      />
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        Parcelamento: Sim
                      </span>
                      <input
                        type="text"
                        value="3x [ver detalhes]"
                        className="w-32 rounded-md px-3 py-2 outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                        }}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Data Limite
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value="15/11/2025"
                        className="w-full rounded-md px-3 py-2 outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                        }}
                        readOnly
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Calendar size={12} style={{ color: 'var(--muted-foreground)' }} />
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        Data Limite
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--foreground)',
                        }}
                      >
                        01/11/2025
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'usuarios' && (
                <div className="space-y-3">
                  {selectedTask.usuariosCliente.map((usuario, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg"
                      style={{ border: '1px solid var(--border)', background: 'var(--input-background)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User size={14} style={{ color: 'var(--primary)' }} />
                          <span
                            style={{
                              fontSize: 'var(--text-label)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--foreground)',
                            }}
                          >
                            {usuario.nome}
                          </span>
                        </div>
                        <button
                          style={{
                            fontSize: 'var(--text-caption)',
                            color: 'var(--chart-4)',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={12} style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                          {usuario.email}
                        </span>
                      </div>
                      {usuario.telefone && (
                        <div className="flex items-center gap-2">
                          <Users size={12} style={{ color: 'var(--muted-foreground)' }} />
                          <span
                            style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}
                          >
                            {usuario.telefone}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'emails' && (
                <div className="space-y-3">
                  {selectedTask.emailsAdicionais.map((email, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg flex items-center justify-between"
                      style={{ border: '1px solid var(--border)', background: 'var(--input-background)' }}
                    >
                      <div className="flex items-center gap-2">
                        <Mail size={14} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>
                          {email}
                        </span>
                      </div>
                      <button
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--chart-4)',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'associadas' && (
                <div className="space-y-3">
                  {selectedTask.tarefasAssociadas.length > 0 ? (
                    selectedTask.tarefasAssociadas.map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className="p-4 rounded-lg"
                        style={{ border: '1px solid var(--border)', background: 'var(--input-background)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontSize: 'var(--text-label)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--foreground)',
                            }}
                          >
                            {tarefa.nome}
                          </span>
                          <button
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--primary)',
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 size={12} style={{ color: 'var(--muted-foreground)' }} />
                          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                            {tarefa.cliente}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} style={{ color: 'var(--muted-foreground)' }} />
                          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                            Meta: {tarefa.dataMeta}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>
                      Nenhuma tarefa associada
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'historico' && (
                <div className="space-y-3">
                  {selectedTask.historico.map((item) => {
                    const Icon = historicoIconMap[item.tipo] || Activity;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg"
                        style={{ border: '1px solid var(--border)', background: item.bg }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex items-center justify-center rounded-full p-1.5"
                            style={{ background: item.cor + '20' }}
                          >
                            <Icon size={12} style={{ color: item.cor }} />
                          </div>
                          <div className="flex-1">
                            <p
                              style={{
                                fontSize: 'var(--text-label)',
                                color: 'var(--foreground)',
                                marginBottom: '4px',
                              }}
                            >
                              {item.texto}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                style={{
                                  fontSize: 'var(--text-caption)',
                                  color: 'var(--muted-foreground)',
                                }}
                              >
                                {item.usuario}
                              </span>
                              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                                •
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--text-caption)',
                                  color: 'var(--muted-foreground)',
                                }}
                              >
                                {item.tempo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Column 3: Complementos */}
        {selectedTask && (
          <div
            className="w-96 flex flex-col overflow-y-auto"
            style={{ borderLeft: '1px solid var(--border)', background: 'white' }}
          >
            <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontSize: 'var(--text-label)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Complemento de tarefa
              </h3>
            </div>

            {/* Documentos solicitados */}
            <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Documentos solicitados ({selectedTask.documentos.filter((d) => !d.enviado).length}/
                  {selectedTask.documentos.length})
                </p>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'white',
                    background: 'var(--primary)',
                    border: 'none',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <Send size={11} /> Resumir cobrança
                </button>
              </div>
              {selectedTask.documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{
                      background: doc.enviado ? 'rgba(56,124,43,0.04)' : 'var(--input-background)',
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <FileText
                        size={14}
                        style={{ color: doc.enviado ? 'var(--chart-1)' : 'var(--muted-foreground)' }}
                      />
                      <span
                        style={{
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        {doc.nome}
                      </span>
                    </div>
                    {doc.enviado ? (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--chart-1)',
                          background: 'rgba(56,124,43,0.10)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Enviado
                      </span>
                    ) : (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--chart-3)',
                          background: 'rgba(254,166,1,0.10)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Pendente
                      </span>
                    )}
                  </div>
                  {doc.arquivos &&
                    doc.arquivos.map((arquivo, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 flex items-center justify-between"
                        style={{ background: 'white', borderTop: '1px solid var(--border)' }}
                      >
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>
                          {arquivo.nome}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}
                          >
                            {arquivo.dataEnvio}
                          </span>
                          <button
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--primary)',
                            }}
                          >
                            <Eye size={12} /> Visualizar
                          </button>
                          <button
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--primary)',
                            }}
                          >
                            <Download size={12} /> Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  {!doc.enviado && (
                    <div className="px-4 py-3 flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--primary)',
                          border: '1px solid var(--primary)',
                          background: 'none',
                        }}
                      >
                        <Upload size={10} /> Novo upload
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Atividades com anexo */}
            <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Atividades com anexo ({selectedTask.atividades.length}/1)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      background: 'none',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    <Send size={11} /> Reenviar
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'white',
                      background: 'var(--primary)',
                      border: 'none',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    <Download size={11} /> Baixar tudo
                  </button>
                </div>
              </div>
              {selectedTask.atividades.map((atividade) => (
                <div
                  key={atividade.id}
                  className="p-3 rounded-lg"
                  style={{
                    border: '1px solid var(--border)',
                    background: atividade.enviado ? 'rgba(56,124,43,0.04)' : 'var(--input-background)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Paperclip
                        size={14}
                        style={{
                          color: atividade.enviado ? 'var(--chart-1)' : 'var(--muted-foreground)',
                        }}
                      />
                      <span
                        style={{
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        {atividade.nome}
                      </span>
                    </div>
                    {atividade.enviado ? (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--chart-1)',
                          background: 'rgba(56,124,43,0.10)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Enviado
                      </span>
                    ) : (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--chart-3)',
                          background: 'rgba(254,166,1,0.10)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Pendente
                      </span>
                    )}
                  </div>
                  {atividade.enviado && atividade.arquivo && (
                    <div className="flex items-center gap-2">
                      <button
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--primary)',
                        }}
                      >
                        <Eye size={12} /> Visualizar
                      </button>
                      <button
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--primary)',
                        }}
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Checklist ({selectedTask.checklist.filter((c) => c.feito).length}/
                  {selectedTask.checklist.length})
                </p>
              </div>
              {selectedTask.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.feito} readOnly />
                  <span
                    style={{
                      fontSize: 'var(--text-label)',
                      color: item.feito ? 'var(--muted-foreground)' : 'var(--foreground)',
                      textDecoration: item.feito ? 'line-through' : 'none',
                    }}
                  >
                    {item.descricao}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)', background: 'white' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
            1 / 2
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer hover:bg-muted/40 transition-colors"
            style={{
              border: '1px solid var(--border)',
              fontSize: 'var(--text-label)',
              color: 'var(--foreground)',
              background: 'white',
            }}
          >
            <Upload size={13} /> Editar tarefa
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              border: '1px solid var(--primary)',
              fontSize: 'var(--text-label)',
              color: 'var(--primary)',
              background: 'white',
            }}
          >
            <Clock size={13} /> Apontar nesta tarefa
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              background: 'var(--primary)',
              fontSize: 'var(--text-label)',
              color: 'white',
              fontWeight: 'var(--font-weight-semibold)',
              border: 'none',
              letterSpacing: '0.05em',
            }}
          >
            00:00:00
          </button>
        </div>
      </div>
    </div>
  );
}
