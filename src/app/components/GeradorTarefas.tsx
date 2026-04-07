import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, AlertTriangle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'gerar' | 'remover';

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIAS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const DEPARTAMENTOS = ['Selecione', 'Fiscal', 'Trabalhista', 'Contabilidade', 'RH', 'Administrativo'];
const TIPOS_TAREFA = ['Selecione', 'Tarefas recorrentes', 'Tarefas esporádicas', 'Tarefas de fluxo'];

function getMeses(): string[] {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const now = new Date();
  const result: string[] = [];
  for (let i = -3; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push(`${meses[d.getMonth()]}/${d.getFullYear()}`);
  }
  return result;
}

const MESES = getMeses();
const MES_ATUAL = MESES[3]; // current month approx

// ─── Helpers ─────────────────────────────────────────────────────────────────

function InfoBanner({ text, variant = 'info' }: { text: React.ReactNode; variant?: 'info' | 'warn' }) {
  const isWarn = variant === 'warn';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: `1px solid ${isWarn ? 'rgba(214,64,0,0.3)' : 'rgba(21,115,211,0.25)'}`, background: isWarn ? 'rgba(214,64,0,0.04)' : 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      {isWarn
        ? <AlertTriangle size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
        : <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 2 }} />}
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', minWidth: 240, flexShrink: 0 }}>
        {label}{required && <span style={{ color: 'var(--chart-4)' }}> *</span>}
      </label>
      <div style={{ position: 'relative', width: 240 }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '10px 36px 10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
      </div>
    </div>
  );
}

// ─── Tab: Gerar Tarefas ───────────────────────────────────────────────────────

function TabGerarTarefas() {
  const [diaGeracao, setDiaGeracao] = useState('20');
  const [mesInicio, setMesInicio] = useState(MES_ATUAL);
  const [departamento, setDepartamento] = useState('Selecione');
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
      <InfoBanner
        text={
          <span>
            Defina neste campo a data em que o sistema efetuará a geração automática de tarefas, ou seja, no dia definido de cada mês serão geradas de forma automática as tarefas do sistema para o mês posterior. Para saber mais,{' '}
            <span style={{ color: 'var(--chart-2)', textDecoration: 'underline', cursor: 'pointer' }}>clique aqui.</span>
          </span>
        }
      />

      <SelectField
        label="Dia de geração automática de tarefas"
        value={diaGeracao}
        onChange={setDiaGeracao}
        options={DIAS}
      />

      <div style={{ height: 1, background: 'var(--border)' }} />

      <InfoBanner text="As tarefas recorrentes são geradas com base em sua Data Legal." />

      <SelectField
        label="Mês de início da geração automática"
        value={mesInicio}
        onChange={setMesInicio}
        options={MESES}
      />

      <SelectField
        label="Departamentos"
        value={departamento}
        onChange={setDepartamento}
        options={DEPARTAMENTOS}
      />

      {confirmed && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', border: '1px solid rgba(56,124,43,0.3)', background: 'rgba(56,124,43,0.05)', borderRadius: 'var(--radius-card)' }}>
          <Info size={14} style={{ color: 'var(--chart-1)', flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-1)' }}>Tarefas geradas com sucesso para o período selecionado.</span>
        </div>
      )}

      <div>
        <button
          onClick={() => setConfirmed(true)}
          style={{ padding: '10px 28px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', letterSpacing: '0.04em' }}>
          GERAR TAREFAS
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Remover Tarefas ─────────────────────────────────────────────────────

function TabRemoverTarefas() {
  const [mesInicial, setMesInicial] = useState(MES_ATUAL);
  const [mesFinal, setMesFinal] = useState(MES_ATUAL);
  const [departamento, setDepartamento] = useState('Selecione');
  const [tipoTarefa, setTipoTarefa] = useState('Selecione');
  const [confirmMsg, setConfirmMsg] = useState('');

  const canSubmit = departamento !== 'Selecione' && tipoTarefa !== 'Selecione';

  function handleRemoveComInteracoes() {
    if (!canSubmit) return;
    setConfirmMsg('Tarefas abertas e suas interações foram removidas.');
  }
  function handleRemoveSemInteracoes() {
    if (!canSubmit) return;
    setConfirmMsg('Tarefas abertas sem interações foram removidas.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
      <InfoBanner
        variant="warn"
        text="Importante: Após remover uma tarefa, não será possível recuperar os dados e documentos atrelados a ela. Recomendamos que você se certifique de ter salvo todas as informações e arquivos que julgue relevantes antes de realizar a exclusão de uma tarefa."
      />

      <SelectField label="Mês inicial" value={mesInicial} onChange={setMesInicial} options={MESES} />
      <SelectField label="Mês final" value={mesFinal} onChange={setMesFinal} options={MESES} required />
      <SelectField label="Departamentos" value={departamento} onChange={setDepartamento} options={DEPARTAMENTOS} required />
      <SelectField label="Tipo da tarefa" value={tipoTarefa} onChange={setTipoTarefa} options={TIPOS_TAREFA} required />

      {confirmMsg && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', border: '1px solid rgba(56,124,43,0.3)', background: 'rgba(56,124,43,0.05)', borderRadius: 'var(--radius-card)' }}>
          <Info size={14} style={{ color: 'var(--chart-1)', flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--chart-1)' }}>{confirmMsg}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={handleRemoveComInteracoes}
          disabled={!canSubmit}
          style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: canSubmit ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: canSubmit ? 'pointer' : 'not-allowed', letterSpacing: '0.03em', opacity: canSubmit ? 1 : 0.6 }}>
          REMOVER TAREFAS ABERTAS E SUAS INTERAÇÕES
        </button>
        <button
          onClick={handleRemoveSemInteracoes}
          disabled={!canSubmit}
          style={{ padding: '10px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: canSubmit ? 'var(--primary)' : 'var(--muted)', fontSize: 'var(--text-label)', color: canSubmit ? 'white' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: canSubmit ? 'pointer' : 'not-allowed', letterSpacing: '0.03em', opacity: canSubmit ? 1 : 0.7 }}>
          REMOVER TAREFAS ABERTAS SEM INTERAÇÕES
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GeradorTarefas({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<MainTab>('gerar');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: 'white', padding: '16px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={13} /> Voltar para Configurações
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <InfoBanner text="xxxxxxxxxxx" />

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {([
            { key: 'gerar', label: 'Gerar tarefas' },
            { key: 'remover', label: 'Remover tarefas' },
          ] as { key: MainTab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ border: 'none', background: tab === t.key ? 'var(--foreground)' : 'white', color: tab === t.key ? 'white' : 'var(--foreground)', fontSize: 'var(--text-label)', fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', padding: '7px 20px', borderRadius: 'var(--radius-button)', cursor: 'pointer', boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none', transition: 'background 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'gerar' ? <TabGerarTarefas /> : <TabRemoverTarefas />}
      </div>
    </div>
  );
}
