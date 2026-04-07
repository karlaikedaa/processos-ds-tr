import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Plus, ChevronDown, Info, X, Check, Trash2,
  CheckSquare, Square, Upload, Calendar,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidacaoStatus = 'Validado' | 'Não validado' | 'Não enviado';
type FilterTab = 'todos' | 'validados' | 'nao-validados' | 'nao-enviado';
type EditSubTab = 'modelo' | 'tarefas';

interface ModeloDoc {
  id: string;
  nome: string;
  atividadeDominio: string;
  pastaDestino: string;
  qtdModelos: number;
  validacao: ValidacaoStatus;
  ultimaAtualizacao: string;
  validacaoManual: boolean;
}

interface DocItem {
  id: string;
  nome: string;
  criadoEm: string;
  validado: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ATIVIDADES = ['Aquarela do Brasil', 'Thomson Reuters', 'Dominio Sistemas', 'Diariamente', 'Mensalmente'];
const PASTAS = ['Aquarela do Brasil', 'Thomson Reuters', 'Dominio Sistemas', 'Diariamente', 'Dominio Sistemas, Thomso...'];

const MOCK_MODELOS: ModeloDoc[] = [
  { id: 'M1', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Aquarela do Brasil', qtdModelos: 3, validacao: 'Não validado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: true },
  { id: 'M2', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Thomson Reuters', qtdModelos: 1, validacao: 'Não validado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: true },
  { id: 'M3', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Dominio Sistemas', qtdModelos: 12, validacao: 'Validado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: true },
  { id: 'M4', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Dominio Sistemas', qtdModelos: 5, validacao: 'Validado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: false },
  { id: 'M5', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Aquarela do Brasil', qtdModelos: 0, validacao: 'Não enviado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: true },
  { id: 'M6', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Thomson Reuters', qtdModelos: 0, validacao: 'Não enviado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: true },
  { id: 'M7', nome: 'Nome template', atividadeDominio: 'Aquarela do Brasil', pastaDestino: 'Dominio Sistemas, Thomso...', qtdModelos: 1, validacao: 'Validado', ultimaAtualizacao: '24/09/2024 10:29', validacaoManual: false },
];

const ALL_TASKS_SEM = [
  '13º Salário Integral', '2ª Quota DARF', '3ª Quota CSLL', '3ª Quota DARF',
  'Balancete - Mental', 'Balancete - Trimestral', 'cobrança de documentos',
  'cobrança de documentos', 'cobrança de documentos - 2023-09',
  'CONCLUSÃO DE TAREFA', 'CONCLUSÃO DE TAREFA NO ONVIO MESSENGER LETICIA',
  'CONCLUSÃO DE TAREFA NO ONVIO MESSENGER LUIZ',
];
const ALL_TASKS_COM = [
  '12º Salário Adiantamento', 'Aprovação', 'Balancete - Anual',
  'Folha de Pagamento (5º Dia Útil)', 'Folha de Pagamento (Dia 30)',
];
const MOCK_DOCS: DocItem[] = [
  { id: 'D1', nome: 'Balancete Anual', criadoEm: '19/04/2022 16:28', validado: true },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

const thS: React.CSSProperties = {
  padding: '9px 12px', textAlign: 'left', background: 'white',
  fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)',
  fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border)', userSelect: 'none',
};

function CB({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} /> : <Square size={14} style={{ color: 'var(--muted-foreground)' }} />}
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

function SortTh({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <th style={{ ...thS, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <ChevronDown size={10} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

function InfoBanner({ text, variant = 'info' }: { text: string; variant?: 'info' | 'warn' }) {
  const isWarn = variant === 'warn';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: `1px solid ${isWarn ? 'rgba(220,10,10,0.2)' : 'rgba(21,115,211,0.25)'}`, background: isWarn ? 'rgba(220,10,10,0.04)' : 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: isWarn ? 'var(--chart-4)' : 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function SelectCell({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: 'relative', minWidth: 140 }}>
      <select value={value} onChange={e => onChange(e.target.value)} onClick={e => e.stopPropagation()}
        style={{ width: '100%', padding: '4px 26px 4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={10} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
    </div>
  );
}

function ValidacaoBadge({ status }: { status: ValidacaoStatus }) {
  const colors: Record<ValidacaoStatus, { color: string }> = {
    'Validado': { color: 'var(--chart-1)' },
    'Não validado': { color: 'var(--muted-foreground)' },
    'Não enviado': { color: 'var(--muted-foreground)' },
  };
  return <span style={{ fontSize: 'var(--text-caption)', color: colors[status].color }}>{status}</span>;
}

// ─── Add Modelo Drawer (mobile) ───────────────────────────────────────────────

function AddModeloDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (d: DocItem) => void }) {
  const [nome, setNome] = useState('');
  const [formato, setFormato] = useState('');
  const [validarComp, setValidarComp] = useState(false);
  const [dragging, setDragging] = useState(false);

  function handleAdd() {
    if (!nome.trim()) return;
    onAdd({ id: `D${Date.now()}`, nome, criadoEm: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), validado: false });
    setNome(''); setFormato(''); setValidarComp(false);
    onClose();
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', zIndex: 50, width: 'min(400px, 100vw)', background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <ArrowLeft size={18} style={{ color: 'var(--foreground)' }} />
          </button>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Modelo de documento</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Nome <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>(campo obrigatório)</span></label>
            <input value={nome} onChange={e => setNome(e.target.value)}
              style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Formato de data <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>(campo obrigatório)</span></label>
            <div style={{ position: 'relative' }}>
              <input type="date" value={formato} onChange={e => setFormato(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }} />
              <Calendar size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Toggle checked={validarComp} onChange={() => setValidarComp(p => !p)} />
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Validar pela competência</span>
          </div>
          {/* Drop area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); }}
            style={{ border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--muted-foreground)'}`, borderRadius: 'var(--radius-card)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: dragging ? 'rgba(214,64,0,0.04)' : 'var(--input-background)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <Upload size={24} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'center' }}>Adicione ou arraste o arquivo modelo</span>
          </div>
        </div>
        <button onClick={handleAdd}
          style={{ margin: 20, padding: '14px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', color: 'white', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          Adicionar modelo
        </button>
      </div>
    </>
  );
}

// ─── Edit Sub-tab: Modelo de Documento ────────────────────────────────────────

function TabModeloDoc({ docs, setDocs }: { docs: DocItem[]; setDocs: React.Dispatch<React.SetStateAction<DocItem[]>> }) {
  const [nomeModelo, setNomeModelo] = useState('');
  const [atividade, setAtividade] = useState('Diariamente');
  const [pasta, setPasta] = useState('Diariamente');
  const [validacaoManual, setValidacaoManual] = useState(true);
  const [searchDocs, setSearchDocs] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredDocs = useMemo(() => {
    const q = searchDocs.toLowerCase();
    return docs.filter(d => !q || d.nome.toLowerCase().includes(q));
  }, [docs, searchDocs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nome do modelo <span style={{ color: 'var(--chart-4)' }}>*</span></label>
        <input value={nomeModelo} onChange={e => setNomeModelo(e.target.value)}
          style={{ maxWidth: 320, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 40px', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
          <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Atividade no Domínio Contábil</label>
          <div style={{ position: 'relative' }}>
            <select value={atividade} onChange={e => setAtividade(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              {ATIVIDADES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
          <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Pasta de destino no Portal do Cliente</label>
          <div style={{ position: 'relative' }}>
            <select value={pasta} onChange={e => setPasta(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              {PASTAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Toggle checked={validacaoManual} onChange={() => setValidacaoManual(p => !p)} />
        <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Validação manual de tarefas no Express</span>
      </div>
      <InfoBanner text="Ao desativar esse item, os documentos reconhecidos pelo Express como serão automaticamente anexados às tarefas e enviadas para os clientes, o que torna o processo mais rápido" />

      {/* Modelos de documentos sub-table */}
      <div>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10 }}>Modelos de documentos</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setDrawerOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', cursor: 'pointer' }}>
            <Plus size={13} /> Adicionar
          </button>
          <div style={{ position: 'relative' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input value={searchDocs} onChange={e => setSearchDocs(e.target.value)} placeholder="Pesquisar pelo nome do modelo"
              style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 240 }} />
          </div>
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 70 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Validação <ChevronDown size={10} /></div>
                </th>
                <SortTh label="Nome" />
                <SortTh label="Criado em" />
                <th style={{ ...thS, width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum modelo adicionado</td></tr>
              ) : filteredDocs.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    {d.validado && <Check size={14} style={{ color: 'var(--chart-1)' }} />}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>{d.nome}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{d.criadoEm}</span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <button onClick={() => setDocs(p => p.filter(x => x.id !== d.id))}
                      style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--chart-4)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                      <X size={12} style={{ color: 'white' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddModeloDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={d => setDocs(p => [...p, d])} />
    </div>
  );
}

// ─── Edit Sub-tab: Tarefas com o Modelo ───────────────────────────────────────

function TabTarefasModelo() {
  const [tasksSem, setTasksSem] = useState<string[]>(ALL_TASKS_SEM);
  const [tasksCom, setTasksCom] = useState<string[]>(ALL_TASKS_COM);
  const [selSem, setSelSem] = useState<Set<string>>(new Set());
  const [selCom, setSelCom] = useState<Set<string>>(new Set());
  const [searchSem, setSearchSem] = useState('');
  const [searchCom, setSearchCom] = useState('');

  const filtSem = useMemo(() => { const q = searchSem.toLowerCase(); return tasksSem.filter(t => !q || t.toLowerCase().includes(q)); }, [tasksSem, searchSem]);
  const filtCom = useMemo(() => { const q = searchCom.toLowerCase(); return tasksCom.filter(t => !q || t.toLowerCase().includes(q)); }, [tasksCom, searchCom]);

  function adicionar() {
    const toAdd = [...selSem];
    setTasksCom(p => [...p, ...toAdd]);
    setTasksSem(p => p.filter(t => !selSem.has(t)));
    setSelSem(new Set());
  }
  function remover() {
    const toRem = [...selCom];
    setTasksSem(p => [...p, ...toRem]);
    setTasksCom(p => p.filter(t => !selCom.has(t)));
    setSelCom(new Set());
  }
  function toggleSem(t: string) { setSelSem(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; }); }
  function toggleCom(t: string) { setSelCom(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; }); }

  const HIGHLIGHTED = new Set(['Balancete - Anual', 'Folha de Pagamento (5º Dia Útil)', 'Folha de Pagamento (Dia 30)']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
      <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>
        {tasksCom.length} Tarefas com esse modelo de documento
      </p>
      <div style={{ display: 'flex', gap: 12, height: 420 }}>
        {/* Sem modelo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)', flexShrink: 0 }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tarefas sem esse modelo ({tasksSem.length})</span>
            <input value={searchSem} onChange={e => setSearchSem(e.target.value)} placeholder="Buscar"
              style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 80 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, border: '1px solid var(--border)', borderRadius: 2 }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>·</span>
            <button onClick={adicionar} disabled={selSem.size === 0}
              style={{ padding: '3px 16px', border: 'none', borderRadius: 'var(--radius)', background: 'var(--primary)', color: 'white', fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', cursor: selSem.size > 0 ? 'pointer' : 'not-allowed', opacity: selSem.size === 0 ? 0.5 : 1 }}>
              Adicionar
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtSem.map(t => (
              <div key={t} onClick={() => toggleSem(t)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selSem.has(t) ? 'rgba(214,64,0,0.04)' : undefined }}>
                <CB checked={selSem.has(t)} onChange={() => toggleSem(t)} />
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Com modelo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)', flexShrink: 0 }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tarefas com esse modelo ({tasksCom.length})</span>
            <input value={searchCom} onChange={e => setSearchCom(e.target.value)} placeholder="Buscar"
              style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 80 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, border: '1px solid var(--border)', borderRadius: 2 }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>·</span>
            <button onClick={remover} disabled={selCom.size === 0}
              style={{ padding: '3px 16px', border: 'none', borderRadius: 'var(--radius)', background: 'var(--chart-4)', color: 'white', fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', cursor: selCom.size > 0 ? 'pointer' : 'not-allowed', opacity: selCom.size === 0 ? 0.5 : 1 }}>
              Remover
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtCom.map(t => {
              const isFirst = t === filtCom[0];
              return (
                <div key={t} onClick={() => toggleCom(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selCom.has(t) ? 'rgba(220,10,10,0.03)' : undefined }}>
                  <CB checked={selCom.has(t)} onChange={() => toggleCom(t)} />
                  <span style={{ fontSize: 'var(--text-caption)', color: isFirst ? 'var(--muted-foreground)' : HIGHLIGHTED.has(t) ? 'var(--primary)' : 'var(--foreground)', textDecoration: isFirst ? 'line-through' : 'none' }}>
                    {t}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────

function EditModelo({ modelo, onClose }: { modelo: ModeloDoc; onClose: () => void }) {
  const [subTab, setSubTab] = useState<EditSubTab>('modelo');
  const [docs, setDocs] = useState<DocItem[]>(MOCK_DOCS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 0', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 4 }}>Edição de modelo de documento</h2>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', margin: 0 }}>{modelo.nome}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginTop: 4 }}>
          <X size={13} /> Fechar
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', flexShrink: 0, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {([{ key: 'modelo', label: 'Modelo de documento' }, { key: 'tarefas', label: 'Tarefas com o modelo' }] as { key: EditSubTab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              style={{ border: 'none', background: subTab === t.key ? 'var(--foreground)' : 'white', color: subTab === t.key ? 'white' : 'var(--foreground)', fontSize: 'var(--text-label)', fontWeight: subTab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', padding: '7px 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer', boxShadow: subTab !== t.key ? '0 0 0 1px var(--border)' : 'none', transition: 'background 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '7px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>CANCELAR</button>
          <button style={{ padding: '7px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>SALVAR</button>
        </div>
      </div>
      <div style={{ height: '1px', background: 'var(--border)', flexShrink: 0 }} />
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafc' }}>
        {subTab === 'modelo' ? <TabModeloDoc docs={docs} setDocs={setDocs} /> : <TabTarefasModelo />}
      </div>
    </div>
  );
}

// ─── Main List View ───────────────────────────────────────────────────────────

export function ModelosDocumento({ onBack }: { onBack: () => void }) {
  const [filterTab, setFilterTab] = useState<FilterTab>('todos');
  const [search, setSearch] = useState('');
  const [pastaLote, setPastaLote] = useState('');
  const [integrado, setIntegrado] = useState(true);
  const [modelos, setModelos] = useState<ModeloDoc[]>(MOCK_MODELOS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<ModeloDoc | null>(null);

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'validados', label: 'Validados' },
    { key: 'nao-validados', label: 'Não validados' },
    { key: 'nao-enviado', label: 'Modelo não enviado' },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return modelos.filter(m => {
      if (filterTab === 'validados' && m.validacao !== 'Validado') return false;
      if (filterTab === 'nao-validados' && m.validacao !== 'Não validado') return false;
      if (filterTab === 'nao-enviado' && m.validacao !== 'Não enviado') return false;
      if (q && !m.nome.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [modelos, filterTab, search]);

  const allSel = filtered.length > 0 && filtered.every(m => selected.has(m.id));
  function toggleSel(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(m => m.id))); }
  function toggleValidacaoManual(id: string) { setModelos(p => p.map(m => m.id === id ? { ...m, validacaoManual: !m.validacaoManual } : m)); }

  if (editing) return <EditModelo modelo={editing} onClose={() => setEditing(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: 'white', padding: '16px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InfoBanner text="xxxxxxxxxxx" />
        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>100 Modelos de documentos</p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setFilterTab(t.key)}
              style={{ border: 'none', background: filterTab === t.key ? 'var(--foreground)' : 'white', color: filterTab === t.key ? 'white' : 'var(--foreground)', fontSize: 'var(--text-label)', fontWeight: filterTab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', padding: '7px 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer', boxShadow: filterTab !== t.key ? '0 0 0 1px var(--border)' : 'none', transition: 'background 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 'min(280px, 100%)' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar pelo nome do modelo"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative', minWidth: 180 }}>
            <select value={pastaLote} onChange={e => setPastaLote(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: pastaLote ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Pasta de destino em lote</option>
              {PASTAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Toggle checked={integrado} onChange={() => setIntegrado(p => !p)} />
            <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Integrado com Portal do Cliente</span>
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={13} /> NOVO MODELO DE DOCUMENTO
          </button>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                  <SortTh label="Nome" />
                  <SortTh label="Atividade no Domínio Contábil" />
                  <SortTh label="Pasta de destino no Portal do cliente" />
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Quantidade<br />de modelos <ChevronDown size={10} /></div>
                  </th>
                  <SortTh label="Validação" />
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Última<br />atualização <ChevronDown size={10} /></div>
                  </th>
                  <th style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Validação manual<br />de tarefa no Express <ChevronDown size={10} /></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border)', background: selected.has(m.id) ? 'rgba(214,64,0,0.02)' : undefined, transition: 'background 0.15s' }}>
                    <td style={{ paddingLeft: 12, paddingRight: 8, paddingTop: 10, paddingBottom: 10 }}><CB checked={selected.has(m.id)} onChange={() => toggleSel(m.id)} /></td>
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={() => setEditing(m)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline' }}>{m.nome}</button>
                    </td>
                    <td style={{ padding: '10px 12px' }}><SelectCell value={m.atividadeDominio} onChange={v => setModelos(p => p.map(x => x.id === m.id ? { ...x, atividadeDominio: v } : x))} options={ATIVIDADES} /></td>
                    <td style={{ padding: '10px 12px' }}><SelectCell value={m.pastaDestino} onChange={v => setModelos(p => p.map(x => x.id === m.id ? { ...x, pastaDestino: v } : x))} options={PASTAS} /></td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{m.qtdModelos}</span></td>
                    <td style={{ padding: '10px 12px' }}><ValidacaoBadge status={m.validacao} /></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{m.ultimaAtualizacao}</span></td>
                    <td style={{ padding: '10px 12px' }}><Toggle checked={m.validacaoManual} onChange={() => toggleValidacaoManual(m.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{filtered.length} modelo{filtered.length !== 1 ? 's' : ''}{selected.size > 0 && ` · ${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
