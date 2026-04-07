import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Plus, X, ChevronDown, Eye, EyeOff, Trash2,
  Edit2, Check, CheckSquare, Square, Info, AlertTriangle, ChevronUp,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type EmpresaStatus = 'ativo' | 'inativo';
type EditTab = 'cadastrais' | 'tarefas' | 'senhas' | 'certidoes';

interface Empresa {
  id: string; codigo: string; nome: string; documento: string;
  regimeFederal: string; tarefasVinculadas: number; usuariosAtivos: number;
  portalCliente: boolean; integracaoDominio: boolean; whatsapp: boolean;
  status: EmpresaStatus; razaoSocial: string; apelido: string;
  regimeEstadual: string; regimeMunicipal: string; dataAbertura: string;
  observacao: string; estado: string; cidade: string; bairro: string;
  logradouro: string; numero: string; complemento: string; cep: string;
  inscricaoEstadual: string; inscricaoMunicipal: string; ativo: boolean;
}

interface Senha { id: string; nome: string; usuario: string; senha: string; codigo: string; link: string; }
interface Certificado { id: string; nome: string; signatario: string; cpfSignatario: string; dataExpiracao: string; criadoEm: string; }
interface TarefaSistema { id: string; nome: string; departamento: string; }
interface TarefaCliente { id: string; nome: string; pessoal: string; aprovacaoNecessaria: boolean; responsavel: string; }

// ─── Mock Data ────────────────────────────────────────────────────────────────

const REGIMES = ['Lucro presumido', 'Simples nacional', 'Lucro real', 'Entidade', 'MEI', 'Lucro presumido arbitrado', 'Lucro real trimestral'];

const MOCK_EMPRESAS: Empresa[] = [
  { id: 'E1', codigo: '001', nome: 'Empresa 1', documento: '134253636', regimeFederal: 'Lucro presumido', tarefasVinculadas: 37, usuariosAtivos: 2, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 1 LTDA', apelido: 'Emp 1', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2010-03-15', observacao: '', estado: 'GO', cidade: 'Goiânia', bairro: 'Centro', logradouro: 'Rua das Flores', numero: '123', complemento: 'Sala 1', cep: '74000-000', inscricaoEstadual: '102030', inscricaoMunicipal: '11.214.11.16', ativo: true },
  { id: 'E2', codigo: '002', nome: 'Empresa 2', documento: '75723257', regimeFederal: 'Simples nacional', tarefasVinculadas: 10, usuariosAtivos: 7, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 2 S/A', apelido: 'Emp 2', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2015-06-20', observacao: '', estado: 'SP', cidade: 'São Paulo', bairro: 'Jardins', logradouro: 'Av. Paulista', numero: '1000', complemento: '', cep: '01310-100', inscricaoEstadual: '205060', inscricaoMunicipal: '22.305.22.27', ativo: true },
  { id: 'E3', codigo: '003', nome: 'Empresa 3', documento: '8462425', regimeFederal: 'Entidade', tarefasVinculadas: 5, usuariosAtivos: 1, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 3 LTDA', apelido: 'Emp 3', regimeEstadual: 'REGIME NORMAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2018-01-10', observacao: '', estado: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Copacabana', logradouro: 'Rua Barata Ribeiro', numero: '500', complemento: 'Apto 203', cep: '22040-002', inscricaoEstadual: '308090', inscricaoMunicipal: '33.406.33.38', ativo: true },
  { id: 'E4', codigo: '004', nome: 'Empresa 4', documento: '8442325364747', regimeFederal: 'Lucro presumido arbitrado', tarefasVinculadas: 63, usuariosAtivos: 14, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 4 S/A', apelido: 'Emp 4', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'MUNICIPIO NORMAL', dataAbertura: '2008-09-05', observacao: 'Cliente VIP', estado: 'MG', cidade: 'Belo Horizonte', bairro: 'Savassi', logradouro: 'Rua da Bahia', numero: '750', complemento: '', cep: '30160-010', inscricaoEstadual: '411020', inscricaoMunicipal: '44.507.44.49', ativo: true },
  { id: 'E5', codigo: '005', nome: 'Empresa 5', documento: '5242537473', regimeFederal: 'Simples nacional', tarefasVinculadas: 37, usuariosAtivos: 9, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 5 LTDA', apelido: 'Emp 5', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2019-11-22', observacao: '', estado: 'BA', cidade: 'Salvador', bairro: 'Pituba', logradouro: 'Av. Tancredo Neves', numero: '250', complemento: 'Loja 3', cep: '41820-020', inscricaoEstadual: '514030', inscricaoMunicipal: '55.608.55.50', ativo: true },
  { id: 'E6', codigo: '006', nome: 'Empresa 6', documento: '7523253636', regimeFederal: 'Simples nacional', tarefasVinculadas: 37, usuariosAtivos: 12, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 6 S/A', apelido: 'Emp 6', regimeEstadual: 'REGIME NORMAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2012-07-14', observacao: '', estado: 'PE', cidade: 'Recife', bairro: 'Boa Viagem', logradouro: 'Av. Boa Viagem', numero: '3300', complemento: '', cep: '51030-001', inscricaoEstadual: '617040', inscricaoMunicipal: '66.709.66.61', ativo: true },
  { id: 'E7', codigo: '007', nome: 'Empresa 7', documento: '9343942', regimeFederal: 'MEI', tarefasVinculadas: 31, usuariosAtivos: 1, portalCliente: true, integracaoDominio: true, whatsapp: true, status: 'ativo', razaoSocial: 'EMPRESA 7 MEI', apelido: 'Emp 7', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2021-02-03', observacao: '', estado: 'RS', cidade: 'Porto Alegre', bairro: 'Moinhos de Vento', logradouro: 'Rua Coronel Bordini', numero: '100', complemento: '', cep: '90440-001', inscricaoEstadual: '720050', inscricaoMunicipal: '77.810.77.72', ativo: true },
  { id: 'E8', codigo: '008', nome: 'Empresa 8', documento: '1234567890', regimeFederal: 'Lucro real', tarefasVinculadas: 22, usuariosAtivos: 5, portalCliente: false, integracaoDominio: true, whatsapp: false, status: 'inativo', razaoSocial: 'EMPRESA 8 LTDA', apelido: 'Emp 8', regimeEstadual: 'REGIME NORMAL', regimeMunicipal: 'MUNICIPIO NORMAL', dataAbertura: '2005-10-10', observacao: '', estado: 'PR', cidade: 'Curitiba', bairro: 'Batel', logradouro: 'Rua Comendador Araújo', numero: '500', complemento: '', cep: '80420-000', inscricaoEstadual: '823060', inscricaoMunicipal: '88.911.88.83', ativo: false },
  { id: 'E9', codigo: '009', nome: 'Empresa 9', documento: '9876543210', regimeFederal: 'Lucro real', tarefasVinculadas: 18, usuariosAtivos: 3, portalCliente: false, integracaoDominio: false, whatsapp: false, status: 'inativo', razaoSocial: 'EMPRESA 9 S/A', apelido: 'Emp 9', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2003-04-29', observacao: '', estado: 'SC', cidade: 'Florianópolis', bairro: 'Centro', logradouro: 'Rua Bocaiúva', numero: '1800', complemento: '', cep: '88015-530', inscricaoEstadual: '926070', inscricaoMunicipal: '99.012.99.94', ativo: false },
  { id: 'E10', codigo: '010', nome: 'Empresa 10', documento: '1122334455', regimeFederal: 'Simples nacional', tarefasVinculadas: 8, usuariosAtivos: 2, portalCliente: false, integracaoDominio: false, whatsapp: false, status: 'inativo', razaoSocial: 'EMPRESA 10 ME', apelido: 'Emp 10', regimeEstadual: 'SIMPLES NACIONAL', regimeMunicipal: 'ISENTA MUNICIP', dataAbertura: '2017-12-17', observacao: '', estado: 'CE', cidade: 'Fortaleza', bairro: 'Meireles', logradouro: 'Av. Beira Mar', numero: '1200', complemento: '', cep: '60165-121', inscricaoEstadual: '030080', inscricaoMunicipal: '00.113.00.05', ativo: false },
];

const MOCK_SENHAS: Record<string, Senha[]> = {
  E1: [
    { id: 'S1', nome: 'Receita federal', usuario: '324141513131', senha: 'senha123', codigo: 'cod456', link: 'www.receita.gov.br' },
    { id: 'S2', nome: 'Banco Itaú', usuario: 'aquarela.@aquarela.com', senha: 'banco321', codigo: '-', link: 'www.itau.com.br' },
    { id: 'S3', nome: 'Portal e-Social', usuario: '131415141', senha: 'social789', codigo: '-', link: 'www.esocial.gov.br' },
  ],
};

const MOCK_CERTIFICADOS: Record<string, Certificado[]> = {
  E1: [
    { id: 'C1', nome: 'teste', signatario: '00000000000000000', cpfSignatario: '', dataExpiracao: '27/08/2025', criadoEm: '25/08/2025 11:16' },
  ],
};

const TAREFAS_SISTEMA: TarefaSistema[] = [
  { id: 'TS1', nome: '3ª Quota CSLL', departamento: 'Departamento/Tase21333S' },
  { id: 'TS2', nome: '3ª Quota DARF', departamento: 'Departamento/Fiscal' },
  { id: 'TS3', nome: 'Balancete - Trimestral', departamento: 'Departamento/Contábil S1' },
  { id: 'TS4', nome: 'Cobrança de documentos', departamento: 'Departamento/Fiscal' },
  { id: 'TS5', nome: 'DCTF Mensal', departamento: 'Departamento/Fiscal' },
  { id: 'TS6', nome: 'SPED Fiscal', departamento: 'Departamento/Fiscal' },
  { id: 'TS7', nome: 'GFIP / SEFIP', departamento: 'Departamento/Trabalhista' },
  { id: 'TS8', nome: 'Folha de Pagamento', departamento: 'Departamento/RH' },
];

const TAREFAS_CLIENTE_INIT: TarefaCliente[] = [
  { id: 'TC1', nome: '13º Salário Integral', pessoal: 'Pessoal', aprovacaoNecessaria: true, responsavel: '' },
  { id: 'TC2', nome: '2ª Quota DARF', pessoal: 'Tase21333S', aprovacaoNecessaria: true, responsavel: '' },
  { id: 'TC3', nome: 'DCTF Mensal', pessoal: 'Fiscal', aprovacaoNecessaria: false, responsavel: '' },
  { id: 'TC4', nome: 'Folha de Pagamento', pessoal: 'RH', aprovacaoNecessaria: false, responsavel: '' },
];

// ─── Shared design tokens ─────────────────────────────────────────────────────

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

// ─── Shared Components ────────────────────────────────────────────────────────

function CB({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {checked
        ? <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
        : <Square size={14} style={{ color: 'var(--muted-foreground)' }} />}
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
        {label} <ChevronDown size={11} style={{ color: 'var(--muted-foreground)' }} />
      </div>
    </th>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
        {label}{required && <span style={{ color: 'var(--chart-4)' }}>*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, readOnly }: { value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean }) {
  return (
    <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly}
      style={{ width: '100%', padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: readOnly ? 'var(--input-background)' : 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
  );
}

function SelectInput({ value, onChange, options, placeholder }: { value: string; onChange?: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange?.(e.target.value)}
        style={{ width: '100%', padding: '7px 32px 7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: value ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
    </div>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: '1px solid rgba(21,115,211,0.25)', background: 'rgba(21,115,211,0.05)', borderRadius: 'var(--radius-card)' }}>
      <Info size={14} style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{title}</p>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--input-background)' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Edit Tabs ─────────────────────────────────────────────────────────────────

const EDIT_TABS: { key: EditTab; label: string }[] = [
  { key: 'cadastrais', label: 'Informações cadastrais' },
  { key: 'tarefas', label: 'Tarefas do cliente' },
  { key: 'senhas', label: 'Senhas' },
  { key: 'certidoes', label: 'Certidões e certificados' },
];

// ─── Tab: Informações Cadastrais ──────────────────────────────────────────────

function TabCadastrais({ empresa, onChange }: { empresa: Empresa; onChange: (e: Empresa) => void }) {
  const [cnaes, setCnaes] = useState(['Design · 09131837', 'Serviços · 312312', 'Tecnologia · 137813613']);
  const [novosCnae, setNovoCnae] = useState(false);
  const [novoCnaeVal, setNovoCnaeVal] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 24px' }}>
      <InfoBanner text="Alterações de informações cadastrais em clientes integrados ao sistema Domínio devem ser feitas exclusivamente na área de cadastro de cliente da Domínio. Caso não queira que o cliente seja listado nos demais módulos Domínio, por favor, desative a integração." />

      {/* Integrações */}
      <div>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10 }}>Integrações:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {([
            { label: 'Integração Domínio', key: 'integracaoDominio' },
            { label: 'Portal do Cliente', key: 'portalCliente' },
            { label: 'Ativo', key: 'ativo' },
          ] as { label: string; key: keyof Empresa }[]).map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle checked={empresa[item.key] as boolean} onChange={() => onChange({ ...empresa, [item.key]: !empresa[item.key] })} />
              <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Números de identificação */}
      <SectionCard title="Números de identificação">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'rgba(220,10,10,0.04)', border: '1px solid rgba(220,10,10,0.15)', borderRadius: 'var(--radius)' }}>
          <AlertTriangle size={13} style={{ color: 'var(--chart-4)', flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)', lineHeight: 1.5, margin: 0 }}>
            Atenção, estas informações são utilizadas na identificação dos documentos pelo sistema. Por favor, caso não haja caracteres específicos da empresa para estes campos NÃO inserir outras informações.
          </p>
        </div>
        <FormField label="Documento de identificação*">
          <TextInput value={empresa.documento} onChange={v => onChange({ ...empresa, documento: v })} />
        </FormField>
        <FormField label="Inscrição estadual">
          <TextInput value={empresa.inscricaoEstadual} onChange={v => onChange({ ...empresa, inscricaoEstadual: v })} />
        </FormField>
        <FormField label="Inscrição Municipal (CCM)">
          <TextInput value={empresa.inscricaoMunicipal} onChange={v => onChange({ ...empresa, inscricaoMunicipal: v })} />
        </FormField>
      </SectionCard>

      {/* Dados gerais */}
      <SectionCard title="Dados gerais">
        <FormField label="Código*"><TextInput value={empresa.codigo} readOnly /></FormField>
        <FormField label="Razão Social*"><TextInput value={empresa.razaoSocial} onChange={v => onChange({ ...empresa, razaoSocial: v })} /></FormField>
        <FormField label="Apelido"><TextInput value={empresa.apelido} onChange={v => onChange({ ...empresa, apelido: v })} /></FormField>
        <FormField label="Regime Federal*">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white' }}>
            <span style={{ flex: 1, fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{empresa.regimeFederal}</span>
            <X size={12} style={{ color: 'var(--muted-foreground)', cursor: 'pointer' }} />
            <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </FormField>
        <FormField label="Regime Estadual">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white' }}>
            <span style={{ flex: 1, fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{empresa.regimeEstadual}</span>
            <X size={12} style={{ color: 'var(--muted-foreground)', cursor: 'pointer' }} />
            <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </FormField>
        <FormField label="Regime Municipal">
          <TextInput value={empresa.regimeMunicipal} onChange={v => onChange({ ...empresa, regimeMunicipal: v })} />
        </FormField>
        <FormField label="Data de Abertura">
          <input type="date" value={empresa.dataAbertura} onChange={e => onChange({ ...empresa, dataAbertura: e.target.value })}
            style={{ width: '100%', padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
        </FormField>
        <FormField label="Observação">
          <textarea value={empresa.observacao} onChange={e => onChange({ ...empresa, observacao: e.target.value })} rows={3}
            style={{ width: '100%', padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', resize: 'vertical' }} />
        </FormField>
      </SectionCard>

      {/* Endereço */}
      <SectionCard title="Endereço">
        <FormField label="Estado"><TextInput value={empresa.estado} onChange={v => onChange({ ...empresa, estado: v })} placeholder="UF" /></FormField>
        <FormField label="Cidade"><TextInput value={empresa.cidade} onChange={v => onChange({ ...empresa, cidade: v })} /></FormField>
        <FormField label="Bairro"><TextInput value={empresa.bairro} onChange={v => onChange({ ...empresa, bairro: v })} /></FormField>
        <FormField label="Logradouro"><TextInput value={empresa.logradouro} onChange={v => onChange({ ...empresa, logradouro: v })} /></FormField>
        <FormField label="Número"><TextInput value={empresa.numero} onChange={v => onChange({ ...empresa, numero: v })} /></FormField>
        <FormField label="Complemento"><TextInput value={empresa.complemento} onChange={v => onChange({ ...empresa, complemento: v })} /></FormField>
        <FormField label="CEP"><TextInput value={empresa.cep} onChange={v => onChange({ ...empresa, cep: v })} /></FormField>
      </SectionCard>

      {/* CNAEs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>CNAES</p>
          <button onClick={() => setNovoCnae(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', cursor: 'pointer' }}>
            <Plus size={11} /> Novo CNAE
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {novosCnae && (
            <div style={{ display: 'flex', gap: 8 }}>
              <TextInput value={novoCnaeVal} onChange={setNovoCnaeVal} placeholder="Ex: Design · 09131837" />
              <button onClick={() => { if (novoCnaeVal.trim()) { setCnaes(p => [...p, novoCnaeVal.trim()]); setNovoCnaeVal(''); setNovoCnae(false); } }}
                style={{ padding: '6px 10px', border: 'none', borderRadius: 'var(--radius)', background: 'var(--primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Check size={12} />
              </button>
              <button onClick={() => setNovoCnae(false)}
                style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={12} />
              </button>
            </div>
          )}
          {cnaes.map((cnae, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{cnae}</div>
              <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                <Edit2 size={12} style={{ color: 'var(--chart-2)' }} />
              </button>
              <button onClick={() => setCnaes(p => p.filter((_, idx) => idx !== i))}
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagamentos */}
      <SectionCard title="Pagamentos">
        <FormField label="Pagamento Mensal"><Toggle checked={false} onChange={() => {}} /></FormField>
        <FormField label="Dia de Vencimento">
          <SelectInput value="" options={Array.from({ length: 28 }, (_, i) => String(i + 1))} placeholder="Selecione" />
        </FormField>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Tarefas do Cliente ──────────────────────────────────────────────────

function TabTarefas({ empresa }: { empresa: Empresa }) {
  const [tarefasCliente, setTarefasCliente] = useState<TarefaCliente[]>(TAREFAS_CLIENTE_INIT);
  const [searchSistema, setSearchSistema] = useState('');
  const [searchCliente, setSearchCliente] = useState('');
  const [selectedSistema, setSelectedSistema] = useState<Set<string>>(new Set());
  const [selectedCliente, setSelectedCliente] = useState<Set<string>>(new Set());
  const [copiarModelo, setCopiarModelo] = useState(false);
  const [agrupadorCliente, setAgrupadorCliente] = useState('Platinum');
  const [agrupadorTarefa, setAgrupadorTarefa] = useState('');

  const filtSistema = useMemo(() => {
    const q = searchSistema.toLowerCase();
    return TAREFAS_SISTEMA.filter(t => !q || t.nome.toLowerCase().includes(q) || t.departamento.toLowerCase().includes(q));
  }, [searchSistema]);

  const filtCliente = useMemo(() => {
    const q = searchCliente.toLowerCase();
    return tarefasCliente.filter(t => !q || t.nome.toLowerCase().includes(q));
  }, [tarefasCliente, searchCliente]);

  function adicionar() {
    const toAdd = TAREFAS_SISTEMA.filter(t => selectedSistema.has(t.id));
    setTarefasCliente(p => [...p, ...toAdd.map(t => ({ id: `TC_${t.id}_${Date.now()}`, nome: t.nome, pessoal: t.departamento.split('/')[1] ?? t.departamento, aprovacaoNecessaria: false, responsavel: '' }))]);
    setSelectedSistema(new Set());
  }

  function excluir() { setTarefasCliente(p => p.filter(t => !selectedCliente.has(t.id))); setSelectedCliente(new Set()); }
  function toggleSistema(id: string) { setSelectedSistema(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleCliente(id: string) { setSelectedCliente(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Tarefas deste cliente</p>
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input value={searchCliente} onChange={e => setSearchCliente(e.target.value)} placeholder="Pesquisar pelo nome tarefa"
            style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 220 }} />
        </div>
      </div>
      <InfoBanner text="Texto explicativo sobre agrupadores - deixar claro que tarefa um a um é em tarefas." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Agrupadores de clientes</label>
          <SelectInput value={agrupadorCliente} onChange={setAgrupadorCliente} options={['Platinum', 'Gold', 'Silver']} />
        </div>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Agrupadores de tarefas</label>
          <SelectInput value={agrupadorTarefa} onChange={setAgrupadorTarefa} options={['Obrigações Mensais', 'Obrigações Anuais', 'Encargos Trabalhistas']} placeholder="Selecione" />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={copiarModelo} onChange={() => setCopiarModelo(p => !p)} />
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>Copiar tarefas de outro cliente para este como modelo</span>
        </div>
        {copiarModelo && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160 }}>
              <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Cliente<span style={{ color: 'var(--chart-4)' }}>*</span></label>
              <SelectInput value="" options={['Empresa 1', 'Empresa 2', 'Empresa 3']} placeholder="Selecione" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160 }}>
              <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Departamento<span style={{ color: 'var(--chart-4)' }}>*</span></label>
              <SelectInput value="" options={['Fiscal', 'Trabalhista', 'Contábil', 'RH']} placeholder="Selecione" />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', cursor: 'pointer', marginTop: 16 }}>
              <Plus size={12} /> Adicionar
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, minHeight: 0, height: 360 }}>
        {/* Sistema */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--border)', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', flexShrink: 0, borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tarefas no sistema ({TAREFAS_SISTEMA.length})</span>
            <div style={{ position: 'relative' }}>
              <Search size={10} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input value={searchSistema} onChange={e => setSearchSistema(e.target.value)} placeholder="Buscar"
                style={{ paddingLeft: 22, paddingRight: 8, paddingTop: 4, paddingBottom: 4, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 100 }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 16, height: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
            <button onClick={adicionar} disabled={selectedSistema.size === 0}
              style={{ padding: '4px 12px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: selectedSistema.size > 0 ? 'pointer' : 'not-allowed', opacity: selectedSistema.size === 0 ? 0.4 : 1 }}>
              Adicionar
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtSistema.map(t => (
              <div key={t.id} onClick={() => toggleSistema(t.id)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedSistema.has(t.id) ? 'rgba(214,64,0,0.04)' : undefined, transition: 'background 0.15s' }}>
                <CB checked={selectedSistema.has(t.id)} onChange={() => toggleSistema(t.id)} />
                <div>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', margin: 0 }}>{t.nome}</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>{t.departamento}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cliente */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--border)', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', flexShrink: 0, borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Tarefas do cliente ({tarefasCliente.length})</span>
            <input placeholder="Buscar"
              style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 80 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 16, height: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
            <button onClick={excluir} disabled={selectedCliente.size === 0}
              style={{ padding: '4px 12px', background: 'var(--chart-4)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: selectedCliente.size > 0 ? 'pointer' : 'not-allowed', opacity: selectedCliente.size === 0 ? 0.4 : 1 }}>
              Excluir
            </button>
            <input placeholder="Responsável"
              style={{ flex: 1, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', outline: 'none' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtCliente.map(t => (
              <div key={t.id} onClick={() => toggleCliente(t.id)}
                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedCliente.has(t.id) ? 'rgba(220,10,10,0.03)' : undefined, transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CB checked={selectedCliente.has(t.id)} onChange={() => toggleCliente(t.id)} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', margin: 0 }}>{t.nome}</p>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>{t.pessoal}</p>
                    {t.aprovacaoNecessaria && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <div style={{ width: 12, height: 12, border: '1px solid var(--border)', borderRadius: 2 }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Aprovação necessária</span>
                      </div>
                    )}
                  </div>
                  <ChevronDown size={12} style={{ color: 'var(--muted-foreground)', marginTop: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Senhas ──────────────────────────────────────────────────────────────

function TabSenhas({ empresaId }: { empresaId: string }) {
  const [senhas, setSenhas] = useState<Senha[]>(MOCK_SENHAS[empresaId] ?? []);
  const [search, setSearch] = useState('');
  const [visibles, setVisibles] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '', codigo: '', link: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return senhas.filter(s => !q || s.nome.toLowerCase().includes(q) || s.usuario.toLowerCase().includes(q) || s.link.toLowerCase().includes(q));
  }, [senhas, search]);

  function toggleVisible(id: string) { setVisibles(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  function salvarSenha() {
    if (!form.nome.trim()) return;
    setSenhas(p => [...p, { id: `S${Date.now()}`, ...form }]);
    setForm({ nome: '', usuario: '', senha: '', codigo: '', link: '' });
    setShowForm(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
      <InfoBanner text="Adicione logins e as senhas de acesso necessárias para a realização de tarefas deste cliente." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', cursor: 'pointer' }}>
          <Plus size={12} /> Nova senha
        </button>
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome, código ou link"
            style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 240 }} />
        </div>
      </div>
      {showForm && (
        <div style={{ padding: 16, borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Nova senha</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {([['Nome*', 'nome'], ['Usuário ou login', 'usuario'], ['Senha', 'senha'], ['Código de acesso', 'codigo'], ['Link', 'link']] as [string, string][]).map(([label, key]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{label}</label>
                <input value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  type={key === 'senha' ? 'password' : 'text'}
                  style={{ padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '6px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={salvarSenha} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
              <Check size={12} /> Salvar
            </button>
          </div>
        </div>
      )}
      <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr><SortTh label="Nome" /><SortTh label="Usuário ou login" /><SortTh label="Senha" /><SortTh label="Código de acesso" /><SortTh label="Link" /><th style={{ ...thS, width: 80 }}></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhuma senha cadastrada</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', cursor: 'pointer' }}>{s.nome}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{s.usuario}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{visibles.has(s.id + '_senha') ? s.senha : '••••'}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{visibles.has(s.id + '_codigo') ? s.codigo : '••••'}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{s.link}</span></td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <button onClick={() => { toggleVisible(s.id + '_senha'); toggleVisible(s.id + '_codigo'); }}
                        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                        {visibles.has(s.id + '_senha') ? <EyeOff size={13} style={{ color: 'var(--muted-foreground)' }} /> : <Eye size={13} style={{ color: 'var(--muted-foreground)' }} />}
                      </button>
                      <button onClick={() => setSenhas(p => p.filter(x => x.id !== s.id))}
                        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}>
                        <Trash2 size={13} style={{ color: 'var(--chart-4)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Certidões e Certificados ────────────────────────────────────────────

function TabCertidoes({ empresaId }: { empresaId: string }) {
  const [certs] = useState<Certificado[]>(MOCK_CERTIFICADOS[empresaId] ?? []);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return certs.filter(c => !q || c.nome.toLowerCase().includes(q) || c.signatario.toLowerCase().includes(q));
  }, [certs, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
      <InfoBanner text="Adicione e gerencie os certificados digitais necessários para assinatura de documentos e tarefas deste cliente." />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{certs.length} Certificado{certs.length !== 1 ? 's' : ''}</span>
        <div style={{ flex: 1 }} />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filtrar"
          style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none', width: 160 }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          <Plus size={12} /> Novo
        </button>
      </div>
      <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                {['Nome', 'Signatário', 'CPF do signatário', 'Data de expiração', 'Criado em'].map(col => (
                  <th key={col} style={{ ...thS }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{col} <ChevronUp size={10} style={{ color: 'var(--muted-foreground)' }} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhum certificado encontrado</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{c.nome}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{c.signatario}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{c.cpfSignatario}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{c.dataExpiracao}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{c.criadoEm}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────

function EditEmpresa({ empresa: initial, onClose }: { empresa: Empresa; onClose: () => void }) {
  const [empresa, setEmpresa] = useState<Empresa>(initial);
  const [tab, setTab] = useState<EditTab>('cadastrais');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* Top header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: 1.3 }}>Edição de empresa</h2>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', marginTop: 2, marginBottom: 0 }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>{empresa.nome}</span>
          </p>
        </div>
        <button onClick={onClose}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', cursor: 'pointer', marginTop: 4 }}>
          <X size={13} /> Fechar
        </button>
      </div>

      {/* Action bar + tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 24px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {EDIT_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                border: 'none',
                background: tab === t.key ? 'var(--foreground)' : 'white',
                color: tab === t.key ? 'white' : 'var(--foreground)',
                fontSize: 'var(--text-caption)',
                fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                padding: '6px 14px', borderRadius: 'var(--radius-button)', cursor: 'pointer',
                boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none',
                transition: 'background 0.15s',
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '6px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>CANCELAR</button>
          <button onClick={onClose} style={{ padding: '6px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>SALVAR</button>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafc' }}>
        {tab === 'cadastrais' && <TabCadastrais empresa={empresa} onChange={setEmpresa} />}
        {tab === 'tarefas' && <TabTarefas empresa={empresa} />}
        {tab === 'senhas' && <TabSenhas empresaId={empresa.id} />}
        {tab === 'certidoes' && <TabCertidoes empresaId={empresa.id} />}
      </div>
    </div>
  );
}

// ─── Main List View ───────────────────────────────────────────────────────────

export function Empresas({ onBack }: { onBack: () => void }) {
  const [statusFilter, setStatusFilter] = useState<EmpresaStatus>('ativo');
  const [search, setSearch] = useState('');
  const [regimeFilter, setRegimeFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Empresa | null>(null);

  const ativos = MOCK_EMPRESAS.filter(e => e.status === 'ativo').length;
  const inativos = MOCK_EMPRESAS.filter(e => e.status === 'inativo').length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_EMPRESAS.filter(e => {
      if (e.status !== statusFilter) return false;
      if (regimeFilter && e.regimeFederal !== regimeFilter) return false;
      if (q && !e.nome.toLowerCase().includes(q) && !e.documento.includes(q)) return false;
      return true;
    });
  }, [search, statusFilter, regimeFilter]);

  const allSel = filtered.length > 0 && filtered.every(e => selected.has(e.id));
  function toggleSel(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(e => e.id))); }

  if (editing) return <EditEmpresa empresa={editing} onClose={() => setEditing(null)} />;

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
        <InfoBanner text="Faça as parametrizações necessárias no perfil dos seus clientes para que poder utilizar o Processos." />

        {/* Count + status tabs */}
        <div>
          <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10, marginTop: 0 }}>
            {MOCK_EMPRESAS.length} empresas
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { key: 'ativo', label: `Ativos (${ativos})` },
              { key: 'inativo', label: `Inativos (${inativos})` },
            ].map(opt => (
              <button key={opt.key} onClick={() => setStatusFilter(opt.key as EmpresaStatus)}
                style={{
                  border: 'none',
                  background: statusFilter === opt.key ? 'var(--foreground)' : 'white',
                  color: statusFilter === opt.key ? 'white' : 'var(--foreground)',
                  fontSize: 'var(--text-label)',
                  fontWeight: statusFilter === opt.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                  padding: '6px 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer',
                  boxShadow: statusFilter !== opt.key ? '0 0 0 1px var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar pelo nome ou departamento"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <select value={regimeFilter} onChange={e => setRegimeFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-caption)', color: regimeFilter ? 'var(--foreground)' : 'var(--muted-foreground)', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Selecione por regime federal</option>
              {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={13} /> NOVA EMPRESA
          </button>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: 36 }}><CB checked={allSel} onChange={toggleAll} /></th>
                  <SortTh label="Código" />
                  <SortTh label="Nome do funcionário" />
                  <SortTh label="Documento de identificação" />
                  <SortTh label="Regime federal" />
                  <th style={{ ...thS, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Tarefas<br />vinculadas <ChevronDown size={10} /></div>
                  </th>
                  <th style={{ ...thS, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Usuários<br />ativos <ChevronDown size={10} /></div>
                  </th>
                  <th style={{ ...thS, textAlign: 'center' }}>Portal<br />do Cliente</th>
                  <th style={{ ...thS, textAlign: 'center' }}>Integração<br />Domínio</th>
                  <th style={{ ...thS, textAlign: 'center' }}>WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 'var(--text-label)', color: 'var(--muted-foreground)' }}>Nenhuma empresa encontrada</td></tr>
                ) : filtered.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: selected.has(e.id) ? 'rgba(214,64,0,0.02)' : undefined, transition: 'background 0.15s' }}>
                    <td style={{ paddingLeft: 12, paddingRight: 8, paddingTop: 10, paddingBottom: 10 }}><CB checked={selected.has(e.id)} onChange={() => toggleSel(e.id)} /></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{e.codigo}</span></td>
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={() => setEditing(e)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--chart-2)', textDecoration: 'underline' }}>
                        {e.nome}
                      </button>
                    </td>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{e.documento}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{e.regimeFederal}</span></td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{e.tarefasVinculadas}</span></td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)' }}>{e.usuariosAtivos}</span></td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: e.portalCliente ? 'var(--chart-1)' : 'var(--muted-foreground)' }}>{e.portalCliente ? 'Sim' : 'Não'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: e.integracaoDominio ? 'var(--chart-1)' : 'var(--muted-foreground)' }}>{e.integracaoDominio ? 'Sim' : 'Não'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 'var(--text-label)', color: e.whatsapp ? 'var(--chart-1)' : 'var(--muted-foreground)' }}>{e.whatsapp ? 'Sim' : 'Não'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
              {filtered.length} empresa{filtered.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` · ${selected.size} selecionada${selected.size !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
