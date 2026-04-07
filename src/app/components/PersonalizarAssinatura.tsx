import React, { useState } from 'react';
import { ArrowLeft, Info, AlertTriangle, Plus, RefreshCw, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubTab = 'assinatura' | 'endereco' | 'smtp';

interface AssinaturaForm {
  nomeEscritorio: string;
  email: string;
  endereco: string;
  telefones: string[];
  websites: string[];
}

interface EnderecoForm {
  email: string;
}

interface SMTPForm {
  usuario: string;
  senha: string;
  remetente: string;
  enderecoServidor: string;
  porta: string;
  sslTls: boolean;
  ativo: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', minWidth: 150, flexShrink: 0 }}>
        {label}{required && <span style={{ color: 'var(--chart-4)' }}>*</span>}
      </label>
      <div style={{ flex: 1, minWidth: 200 }}>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }: { value: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: disabled ? 'var(--input-background)' : 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }} />
  );
}

function SaveButton({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '8px 24px', border: 'none', borderRadius: 'var(--radius-button)', background: disabled ? 'var(--muted)' : 'var(--primary)', color: disabled ? 'var(--muted-foreground)' : 'white', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      SALVAR
    </button>
  );
}

// ─── Tab: Personalizar Assinatura ─────────────────────────────────────────────

function TabAssinatura() {
  const [form, setForm] = useState<AssinaturaForm>({
    nomeEscritorio: 'Aquarela do Brasil',
    email: '',
    endereco: '',
    telefones: [''],
    websites: [''],
  });
  const [dirty, setDirty] = useState(false);

  function upd<K extends keyof AssinaturaForm>(key: K, val: AssinaturaForm[K]) {
    setForm(p => ({ ...p, [key]: val }));
    setDirty(true);
  }

  function addTelefone() { upd('telefones', [...form.telefones, '']); }
  function addWebsite() { upd('websites', [...form.websites, '']); }

  function setTelefone(i: number, v: string) {
    const arr = [...form.telefones]; arr[i] = v; upd('telefones', arr);
  }
  function setWebsite(i: number, v: string) {
    const arr = [...form.websites]; arr[i] = v; upd('websites', arr);
  }
  function removeTelefone(i: number) { upd('telefones', form.telefones.filter((_, idx) => idx !== i)); }
  function removeWebsite(i: number) { upd('websites', form.websites.filter((_, idx) => idx !== i)); }

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '24px 0' }}>
      {/* Left form */}
      <div style={{ flex: '1 1 340px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>(*) Campos obrigatórios</p>

        {/* Logo upload */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ width: 160, height: 90, border: '1.5px dashed var(--muted-foreground)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Logotipo</span>
            </div>
            <button style={{ padding: '7px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-caption)', color: 'var(--foreground)', cursor: 'pointer' }}>
              Editar imagem
            </button>
          </div>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: 8 }}>
            Selecione o logotipo do escritório em formato png ou jpg e com o tamanho máximo de 250x150
          </p>
        </div>

        <FieldRow label="Nome do escritório" required>
          <TextInput value={form.nomeEscritorio} onChange={v => upd('nomeEscritorio', v)} />
        </FieldRow>

        <FieldRow label="E-mail">
          <TextInput value={form.email} onChange={v => upd('email', v)} placeholder="Digite e-mail geral do escritório" />
        </FieldRow>

        <FieldRow label="Endereço">
          <TextInput value={form.endereco} onChange={v => upd('endereco', v)} placeholder="Digite o endereço do escritório" />
        </FieldRow>

        {/* Telefones */}
        <div>
          {form.telefones.map((tel, i) => (
            <FieldRow key={i} label={i === 0 ? 'Telefones' : ''}>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextInput value={tel} onChange={v => setTelefone(i, v)} placeholder="Digite os telefone do escritório" />
                {i === form.telefones.length - 1
                  ? <button onClick={addTelefone} style={{ width: 32, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', flexShrink: 0 }}><Plus size={14} style={{ color: 'var(--foreground)' }} /></button>
                  : <button onClick={() => removeTelefone(i)} style={{ width: 32, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', flexShrink: 0 }}><X size={12} style={{ color: 'var(--chart-4)' }} /></button>
                }
              </div>
            </FieldRow>
          ))}
        </div>

        {/* Websites */}
        <div>
          {form.websites.map((web, i) => (
            <FieldRow key={i} label={i === 0 ? 'Website ou redes sociais' : ''}>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextInput value={web} onChange={v => setWebsite(i, v)} placeholder="Digite site e redes sociais" />
                {i === form.websites.length - 1
                  ? <button onClick={addWebsite} style={{ width: 32, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', flexShrink: 0 }}><Plus size={14} style={{ color: 'var(--foreground)' }} /></button>
                  : <button onClick={() => removeWebsite(i)} style={{ width: 32, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', cursor: 'pointer', flexShrink: 0 }}><X size={12} style={{ color: 'var(--chart-4)' }} /></button>
                }
              </div>
            </FieldRow>
          ))}
        </div>

        <div><SaveButton disabled={!dirty} onClick={() => setDirty(false)} /></div>
      </div>

      {/* Right preview */}
      <div style={{ flex: '1 1 300px', minWidth: 260 }}>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 12 }}>Preview</p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>
              <b>Assunto:</b> Assunto do e-mail
            </span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ border: '1.5px dashed var(--muted-foreground)', borderRadius: 'var(--radius)', padding: '24px 0', textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', letterSpacing: '0.06em', fontWeight: 'var(--font-weight-semibold)' }}>LOGOTIPO</span>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 12, minHeight: 80 }}>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>Conteúdo da mensagem</p>
            </div>
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
              <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: '0 0 12px' }}>{form.nomeEscritorio || 'Nome do escritório'}</p>
              <div style={{ padding: '10px 14px', background: 'var(--input-background)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: 0 }}>Precisa de ajuda?</p>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>Entre em contato com nosso suporte!</p>
                </div>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>Thomson Reuters™</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Personalizar Endereço de E-mail ─────────────────────────────────────

function TabEnderecoEmail() {
  const [email, setEmail] = useState('leticiamspedro@gmail.com');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 24, maxWidth: 760 }}>
      <FieldRow label="E-mail" required>
        <TextInput value={email} onChange={setEmail} />
      </FieldRow>

      {/* Status badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid rgba(214,64,0,0.4)', borderRadius: 'var(--radius)', background: 'rgba(214,64,0,0.04)' }}>
          <RefreshCw size={11} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)' }}>Verificação de <b>domínio</b> pendente</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white' }}>
          <RefreshCw size={11} style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>Verificação de <b>email</b> falhou</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid rgba(214,64,0,0.4)', borderRadius: 'var(--radius)', background: 'rgba(214,64,0,0.04)' }}>
          <RefreshCw size={11} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--primary)' }}>Verificação de <b>DKIM</b> pendente</span>
        </div>
      </div>

      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: 0 }}>
        Utilize as informações abaixo para realizar as configurações de domínio e email:
      </p>

      {/* Domain TXT box */}
      <div style={{ padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', background: 'white' }}>
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: '0 0 2px' }}>Domain TXT name</p>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', margin: 0, fontFamily: 'monospace' }}>_amazonses.gmail.com</p>
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', margin: '0 0 2px' }}>Domain TXT value</p>
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>hOA3Oh+rB1/09xMC2Hi4bnl+jRNDodYjZ0IWTl39Gc=</p>
        </div>
      </div>

      {/* DKIM */}
      <div>
        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 8 }}>DKIM</p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--input-background)' }}>
                {['Nome', 'Tipo', 'Valor'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { nome: 'ophag7bcvgbtzshyxey7xl5wjbjjwu3aw._domainkey.gmail.com', tipo: 'CNAME', valor: 'ophag7bcvgbtzshyxey7xl5wjbjjwu3aw.dkim.amazonses.com' },
                { nome: 'yul5dq3genmql4bjypvplavroqken4uy._domainkey.gmail.com', tipo: 'CNAME', valor: 'yul5dq3genmql4bjypvplavroqken4uy.dkim.amazonses.com' },
                { nome: 'pb5gyleh6nmeskgxdeo3zhs2zlgezs5o._domainkey.gmail.com', tipo: 'CNAME', valor: 'pb5gyleh6nmeskgxdeo3zhs2zlgezs5o.dkim.amazonses.com' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 12px', fontSize: 'var(--text-caption)', color: 'var(--chart-2)', wordBreak: 'break-all', maxWidth: 220 }}>{row.nome}</td>
                  <td style={{ padding: '8px 12px', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.tipo}</td>
                  <td style={{ padding: '8px 12px', fontSize: 'var(--text-caption)', color: 'var(--foreground)', wordBreak: 'break-all' }}>{row.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginTop: 10 }}>
          <b>Obs:</b> Pode levar até 72h para que a configuração entre em vigor.
        </p>
      </div>

      <div><SaveButton onClick={() => {}} /></div>
    </div>
  );
}

// ─── Tab: SMTP ────────────────────────────────────────────────────────────────

function TabSMTP() {
  const [form, setForm] = useState<SMTPForm>({ usuario: '', senha: '', remetente: '', enderecoServidor: '', porta: '', sslTls: false, ativo: false });

  function upd<K extends keyof SMTPForm>(key: K, val: SMTPForm[K]) { setForm(p => ({ ...p, [key]: val })); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, maxWidth: 600 }}>
      {/* Warning */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', border: '1px solid rgba(220,10,10,0.2)', borderRadius: 'var(--radius)', background: 'rgba(220,10,10,0.04)' }}>
        <AlertTriangle size={14} style={{ color: 'var(--chart-4)', flexShrink: 0, marginTop: 2 }} />
        <span style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', lineHeight: 1.5 }}>
          <b>Importante:</b> Quando você escolhe utilizar o serviço de envio e recebimento de e-mails do próprio escritório, não podemos rastrear e apresentar as informações de entrega e leitura dos e-mails configurados
        </span>
      </div>

      {/* Autenticação */}
      <div>
        <p style={{ fontSize: 'var(--text-h3)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 16 }}>Autenticação</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FieldRow label="Usuário" required>
            <TextInput value={form.usuario} onChange={v => upd('usuario', v)} />
          </FieldRow>
          <FieldRow label="Senha" required>
            <input type="password" value={form.senha} onChange={e => upd('senha', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }} />
          </FieldRow>
        </div>
      </div>

      {/* Dados gerais */}
      <div>
        <p style={{ fontSize: 'var(--text-h3)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 16 }}>Dados gerais</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FieldRow label="Remetente" required>
            <TextInput value={form.remetente} onChange={v => upd('remetente', v)} />
          </FieldRow>
          <FieldRow label="Endereço do servidor" required>
            <TextInput value={form.enderecoServidor} onChange={v => upd('enderecoServidor', v)} />
          </FieldRow>
          <FieldRow label="Porta" required>
            <TextInput value={form.porta} onChange={v => upd('porta', v)} />
          </FieldRow>
          <FieldRow label="SSL / TLS">
            <Toggle checked={form.sslTls} onChange={() => upd('sslTls', !form.sslTls)} />
          </FieldRow>
          <FieldRow label="Ativo">
            <Toggle checked={form.ativo} onChange={() => upd('ativo', !form.ativo)} />
          </FieldRow>
        </div>
      </div>

      <div><SaveButton onClick={() => {}} /></div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'assinatura', label: 'Personalizar assinatura' },
  { key: 'endereco', label: 'Personalizar endereço de e-mail' },
  { key: 'smtp', label: 'SMTP' },
];

export function PersonalizarAssinatura({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<SubTab>('assinatura');

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
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#f9fafc' }}>
        <InfoBanner text="Adicione o logotipo do escritório e dados para serem incluídos nas assinaturas de e-mail que serão enviados pelo sistema para seus clientes. Você também pode personalizar o endereço de e-mail que será utilizado como remetente das mensagens do sistema e utilizar seu próprio servidor para enviar e receber os e-mails de clientes." />

        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: '16px 0 12px' }}>Personalizar assinatura e e-mail</p>

        {/* Sub tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {SUB_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                border: 'none',
                background: tab === t.key ? 'var(--foreground)' : 'white',
                color: tab === t.key ? 'white' : 'var(--foreground)',
                fontSize: 'var(--text-label)',
                fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                padding: '7px 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer',
                boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none',
                transition: 'background 0.15s',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'assinatura' && <TabAssinatura />}
        {tab === 'endereco' && <TabEnderecoEmail />}
        {tab === 'smtp' && <TabSMTP />}
      </div>
    </div>
  );
}
