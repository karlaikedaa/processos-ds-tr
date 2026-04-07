import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, FileText, CheckCircle2, X, Eye, Upload, RefreshCw,
  Trash2, ChevronDown, ChevronRight, Search, ArrowUpDown, CheckSquare,
  Square, MoreHorizontal, ArrowLeftRight, UserRound, FileUp, Send,
  Building2, Calendar, Clock, Info, Link2, Edit3, AlertCircle,
  FilePlus2, ExternalLink, RotateCcw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'dominio' | 'portal';

interface DocProblema {
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
  status: 'Pendente' | 'Confirmado' | 'Rejeitado';
}

interface ArquivoPortal {
  id: string;
  nomeArquivo: string;
  nomeCliente: string;
  nomeTarefa: string;
  tipoErro: string;
  dataConclusao: string;
  tentativas: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockDocsProblema: DocProblema[] = [
  { id: 'D001', nomeDoc: 'SPED_Fiscal_MAR2026.txt',       dataUpload: '10/03/2026 09:14', tipoErro: 'Formato inválido',       detalheErro: 'O arquivo enviado não corresponde ao layout esperado para SPED Fiscal. Versão identificada: 015. Versão esperada: 017.',                origem: 'Domínio Escrita', tamanho: '2,4 MB' },
  { id: 'D002', nomeDoc: 'ECF_2025_Empresa_ABC.txt',       dataUpload: '09/03/2026 17:32', tipoErro: 'Registro duplicado',     detalheErro: 'Foram encontrados 3 registros duplicados no bloco J100. Linha 142, 398 e 512 contêm o CNPJ 12.345.678/0001-99 com o mesmo período de apuração.',    origem: 'Domínio Lalur',  tamanho: '5,1 MB' },
  { id: 'D003', nomeDoc: 'Folha_FEV2026_DEF.xml',          dataUpload: '08/03/2026 11:05', tipoErro: 'Assinatura digital',     detalheErro: 'O certificado digital utilizado para assinar o documento expirou em 28/02/2026. Renove o certificado e reenvie o arquivo.',                          origem: 'Domínio Folha',  tamanho: '890 KB' },
  { id: 'D004', nomeDoc: 'REINF_R2010_MAR2026.xml',        dataUpload: '07/03/2026 14:22', tipoErro: 'CNPJ não encontrado',    detalheErro: 'O CNPJ 98.765.432/0001-10 informado no evento R-2010 não consta na base de clientes cadastrados no Processos.',                                  origem: 'Domínio Escrita', tamanho: '340 KB' },
  { id: 'D005', nomeDoc: 'Balancete_FEV2026_GHI.pdf',      dataUpload: '06/03/2026 08:47', tipoErro: 'Período inconsistente',  detalheErro: 'O período de apuração do arquivo (01/01/2026 a 28/02/2026) não coincide com o período da tarefa vinculada (01/02/2026 a 28/02/2026).',          origem: 'Domínio Contab.', tamanho: '1,2 MB' },
  { id: 'D006', nomeDoc: 'DCTF_JAN2026_XYZ.txt',           dataUpload: '05/03/2026 16:10', tipoErro: 'Arquivo corrompido',     detalheErro: 'O arquivo não pôde ser lido. Possível causa: transferência interrompida ou compactação com senha. Faça novo upload do arquivo original.',     origem: 'Domínio Contab.', tamanho: '—' },
  { id: 'D007', nomeDoc: 'SPED_Contribuicoes_MAR.txt',     dataUpload: '04/03/2026 10:33', tipoErro: 'Empresa não vinculada',  detalheErro: 'A empresa "Indústria JKL Ltda" presente no arquivo não está vinculada a nenhum cliente ativo no Processos. Verifique o cadastro.',               origem: 'Domínio Escrita', tamanho: '3,8 MB' },
];

const mockTarefasIdent: TarefaIdentificada[] = [
  { id: 'T001', nomeDoc: 'NF_Servicos_0842.pdf',     nomeTarefa: 'Escrituração Fiscal Mar/2026',   nomeCliente: 'Empresa ABC Ltda',           dataUpload: '10/03/2026 09:22', status: 'Pendente' },
  { id: 'T002', nomeDoc: 'Contrato_Prest_2026.pdf',  nomeTarefa: 'Análise Contratual - ABC',       nomeCliente: 'Empresa ABC Ltda',           dataUpload: '09/03/2026 14:05', status: 'Pendente' },
  { id: 'T003', nomeDoc: 'Extrato_Bancario_Mar.pdf', nomeTarefa: 'Conciliação Bancária Mar/2026',  nomeCliente: 'Natura Cosméticos S/A',      dataUpload: '08/03/2026 11:30', status: 'Pendente' },
  { id: 'T004', nomeDoc: 'GNRE_MAR2026.pdf',         nomeTarefa: 'Apuração ICMS ST Mar/2026',     nomeCliente: 'Ambev S/A',                  dataUpload: '07/03/2026 16:45', status: 'Pendente' },
  { id: 'T005', nomeDoc: 'DAS_MAR2026.pdf',          nomeTarefa: 'Apuração Simples Nacional',     nomeCliente: 'DEF Comércio Ltda',          dataUpload: '06/03/2026 09:12', status: 'Pendente' },
  { id: 'T006', nomeDoc: 'IRRF_Retencao_Mar.pdf',    nomeTarefa: 'DCTF Mensal Mar/2026',          nomeCliente: 'GHI Serviços Ltda',          dataUpload: '05/03/2026 15:20', status: 'Pendente' },
  { id: 'T007', nomeDoc: 'GPS_MAR2026.pdf',          nomeTarefa: 'GFIP/SEFIP Mar/2026',           nomeCliente: 'JKL Indústria Ltda',         dataUpload: '04/03/2026 10:08', status: 'Pendente' },
  { id: 'T008', nomeDoc: 'FGTS_Digital_MAR.pdf',     nomeTarefa: 'eSocial - Folha Mar/2026',      nomeCliente: 'Magazine Luiza S/A',         dataUpload: '03/03/2026 14:55', status: 'Pendente' },
];

const mockArquivosPortal: ArquivoPortal[] = [
  { id: 'P001', nomeArquivo: 'Balancete_FEV2026.pdf',     nomeCliente: 'Empresa ABC Ltda',      nomeTarefa: 'Balancete Fev/2026',          tipoErro: 'Usuário do cliente sem acesso ativo',             dataConclusao: '08/03/2026', tentativas: 3 },
  { id: 'P002', nomeArquivo: 'Informe_Rendimentos.pdf',   nomeCliente: 'Natura Cosméticos S/A', nomeTarefa: 'Informe de Rendimentos 2025', tipoErro: 'Portal do cliente não configurado',               dataConclusao: '07/03/2026', tentativas: 1 },
  { id: 'P003', nomeArquivo: 'SPED_Contabil_2025.txt',    nomeCliente: 'Ambev S/A',             nomeTarefa: 'SPED Contábil 2025',          tipoErro: 'Tamanho do arquivo excede o limite (50 MB)',      dataConclusao: '06/03/2026', tentativas: 2 },
  { id: 'P004', nomeArquivo: 'NF_Terceiros_MAR.zip',      nomeCliente: 'Itaú Unibanco S/A',     nomeTarefa: 'Escrituração Fiscal Mar/2026', tipoErro: 'Formato de arquivo não permitido (.zip)',         dataConclusao: '05/03/2026', tentativas: 1 },
  { id: 'P005', nomeArquivo: 'Contrato_Servicos.pdf',     nomeCliente: 'Bradesco S/A',          nomeTarefa: 'Gestão Contratual Mar/2026',  tipoErro: 'Sessão do cliente expirada durante o envio',     dataConclusao: '04/03/2026', tentativas: 4 },
  { id: 'P006', nomeArquivo: 'DCTF_FEV2026.txt',          nomeCliente: 'Embraer S/A',           nomeTarefa: 'DCTF Fev/2026',              tipoErro: 'Permissão de upload revogada pelo administrador', dataConclusao: '03/03/2026', tentativas: 2 },
  { id: 'P007', nomeArquivo: 'ECF_2025_FINAL.txt',        nomeCliente: 'Petrobras S/A',         nomeTarefa: 'ECF 2025',                   tipoErro: 'Usuário do cliente sem acesso ativo',             dataConclusao: '02/03/2026', tentativas: 1 },
  { id: 'P008', nomeArquivo: 'Folha_MAR2026.pdf',         nomeCliente: 'Via Varejo S/A',        nomeTarefa: 'Folha de Pagamento Mar/2026', tipoErro: 'Portal do cliente não configurado',               dataConclusao: '01/03/2026', tentativas: 3 },
  { id: 'P009', nomeArquivo: 'REINF_R2010.xml',           nomeCliente: 'Pão de Açúcar S/A',     nomeTarefa: 'REINF Mar/2026',             tipoErro: 'Erro de conexão com o servidor do portal',       dataConclusao: '28/02/2026', tentativas: 5 },
  { id: 'P010', nomeArquivo: 'GPS_FEV2026.pdf',           nomeCliente: 'Lojas Americanas S/A',  nomeTarefa: 'GFIP/SEFIP Fev/2026',        tipoErro: 'Certificado digital do escritório expirado',      dataConclusao: '27/02/2026', tentativas: 2 },
];

// ─── Sub-components ───────────────��──────────────────────────────────────────

function BigNumber({ value, label, color, bg, icon }: {
  value: number; label: string; color: string; bg: string; icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg shrink-0"
      style={{ background: bg, border: `1px solid ${color}22` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '26px', fontWeight: 'var(--font-weight-semibold)', color, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{label}</p>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center justify-center cursor-pointer"
      style={{ background: 'none', border: 'none', padding: 0, flexShrink: 0 }}>
      {checked
        ? <CheckSquare size={15} style={{ color: 'var(--primary)' }} />
        : <Square size={15} style={{ color: 'var(--muted-foreground)' }} />
      }
    </button>
  );
}

function ErrorBadge({ tipo }: { tipo: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ fontSize: 'var(--text-caption)', background: 'rgba(220,10,10,0.08)', color: 'var(--chart-4)', fontWeight: 'var(--font-weight-semibold)', border: '1px solid rgba(220,10,10,0.15)' }}>
      <AlertCircle size={9} />
      {tipo}
    </span>
  );
}

function ActionBtn({ icon, label, color, bg, onClick, small }: {
  icon: React.ReactNode; label?: string; color: string; bg: string;
  onClick?: () => void; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex items-center gap-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
      style={{ background: bg, border: `1px solid ${color}22`, padding: small ? '4px 8px' : '5px 10px', fontSize: 'var(--text-caption)', color, fontWeight: 'var(--font-weight-semibold)' }}
    >
      {icon}
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}

// ─── Error Detail Drawer ──────────────────────────────────────────────────────

function ErrorDetailDrawer({ doc, onClose }: { doc: DocProblema | null; onClose: () => void }) {
  if (!doc) return null;
  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(480px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)', transition: 'transform 0.25s' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Detalhes do erro</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{doc.nomeDoc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
          {/* Error summary */}
          <div className="rounded-lg p-4" style={{ background: 'rgba(220,10,10,0.04)', border: '1px solid rgba(220,10,10,0.18)' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} style={{ color: 'var(--chart-4)', marginTop: '1px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-4)' }}>{doc.tipoErro}</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginTop: '6px', lineHeight: 1.6 }}>{doc.detalheErro}</p>
              </div>
            </div>
          </div>
          {/* Metadata */}
          <div className="flex flex-col gap-3">
            {[
              { label: 'Arquivo', value: doc.nomeDoc },
              { label: 'Origem', value: doc.origem },
              { label: 'Tamanho', value: doc.tamanho },
              { label: 'Data de upload', value: doc.dataUpload },
              { label: 'ID do registro', value: doc.id },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-3 py-2"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{row.label}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>AÇÕES DISPONÍVEIS</p>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'var(--primary)', border: 'none' }}>
              <Upload size={14} style={{ color: 'white' }} />
              <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Fazer novo upload</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
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

function TarefaActionDrawer({ item, onClose }: { item: TarefaIdentificada | null; onClose: () => void }) {
  const [mode, setMode] = useState<'confirm' | 'trocarTarefa' | 'trocarCliente' | 'upload'>('confirm');
  if (!item) return null;

  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(480px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Documento identificado</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{item.nomeDoc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          {/* Info card */}
          <div className="rounded-lg p-4 mb-5" style={{ background: 'rgba(21,115,211,0.05)', border: '1px solid rgba(21,115,211,0.18)' }}>
            <div className="flex flex-col gap-2">
              {[
                { icon: <FileText size={12} />, label: 'Documento', value: item.nomeDoc },
                { icon: <Building2 size={12} />, label: 'Cliente', value: item.nomeCliente },
                { icon: <CheckCircle2 size={12} />, label: 'Tarefa sugerida', value: item.nomeTarefa },
                { icon: <Calendar size={12} />, label: 'Data de upload', value: item.dataUpload },
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
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { id: 'confirm', label: 'Confirmar', icon: <CheckCircle2 size={12} /> },
              { id: 'trocarTarefa', label: 'Trocar tarefa', icon: <ArrowLeftRight size={12} /> },
              { id: 'trocarCliente', label: 'Trocar cliente', icon: <UserRound size={12} /> },
              { id: 'upload', label: 'Novo upload', icon: <FileUp size={12} /> },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id as typeof mode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer transition-colors shrink-0"
                style={{
                  fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)',
                  background: mode === m.id ? 'var(--primary)' : 'var(--muted)',
                  color: mode === m.id ? 'white' : 'var(--foreground)',
                  border: 'none',
                }}>
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
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
                style={{ background: 'var(--chart-1)', border: 'none' }} onClick={onClose}>
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
                <option>DCTF Mar/2026</option>
                <option>SPED Fiscal Mar/2026</option>
                <option>Balancete Mar/2026</option>
                <option>ECF 2025</option>
                <option>Folha Mar/2026</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
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
                <option>Empresa ABC Ltda</option>
                <option>Empresa XYZ S/A</option>
                <option>DEF Comércio Ltda</option>
                <option>GHI Serviços Ltda</option>
                <option>JKL Indústria Ltda</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
                style={{ background: 'var(--primary)', border: 'none' }} onClick={onClose}>
                <UserRound size={14} style={{ color: 'white' }} />
                <span style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Confirmar troca de cliente</span>
              </button>
            </div>
          )}
          {mode === 'upload' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center justify-center rounded-lg p-8 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ border: '2px dashed var(--border)', background: 'var(--input-background)' }}>
                <Upload size={28} style={{ color: 'var(--muted-foreground)', marginBottom: '8px' }} />
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Arraste o arquivo ou clique</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '4px' }}>PDF, TXT, XML até 50 MB</p>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
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

// ─── Upload/Reenvio Drawer (Portal) ──────────────────────────────────────────

function PortalReenvioDrawer({ item, onClose }: { item: ArquivoPortal | null; onClose: () => void }) {
  if (!item) return null;
  return (
    <div style={{ display: 'contents' }}>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 'min(480px,100vw)', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>Reenvio de arquivo</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>{item.nomeArquivo}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted">
            <X size={15} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
          {/* Error info */}
          <div className="rounded-lg p-4" style={{ background: 'rgba(220,10,10,0.04)', border: '1px solid rgba(220,10,10,0.18)' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={14} style={{ color: 'var(--chart-4)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-4)' }}>Motivo da falha</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', marginTop: '4px', lineHeight: 1.6 }}>{item.tipoErro}</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '6px' }}>
                  {item.tentativas} tentativa{item.tentativas !== 1 ? 's' : ''} de envio · Conclusão: {item.dataConclusao}
                </p>
              </div>
            </div>
          </div>
          {/* Details */}
          <div className="flex flex-col gap-2">
            {[
              { label: 'Arquivo', value: item.nomeArquivo },
              { label: 'Cliente', value: item.nomeCliente },
              { label: 'Tarefa', value: item.nomeTarefa },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{r.label}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{r.value}</span>
              </div>
            ))}
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>OPÇÕES DE REENVIO</p>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90"
              style={{ background: 'var(--chart-2)', border: 'none' }} onClick={onClose}>
              <Send size={14} style={{ color: 'white' }} />
              <div className="text-left">
                <p style={{ fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>Reenvio automático</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.8)' }}>Utiliza o arquivo original já salvo no sistema</p>
              </div>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <Upload size={14} style={{ color: 'var(--primary)' }} />
              <div className="text-left">
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>Novo upload</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Selecione um arquivo atualizado para enviar</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ width: 'min(400px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.1)' }}>
            <Trash2 size={18} style={{ color: 'var(--chart-4)' }} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Excluir {count} {count === 1 ? 'item' : 'itens'}?
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
              Esta ação não pode ser desfeita.
            </p>
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

// ─── Batch Action Bar ─────────────────────────────────────────────────────────

function BatchBar({ count, onDelete, onReenvio, showReenvio, onConfirm, showConfirm }: {
  count: number; onDelete: () => void;
  onReenvio?: () => void; showReenvio?: boolean;
  onConfirm?: () => void; showConfirm?: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg flex-wrap"
      style={{ background: 'var(--foreground)', border: 'none' }}>
      <span style={{ fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
        {count} {count === 1 ? 'item selecionado' : 'itens selecionados'}
      </span>
      <div className="h-3 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.3)' }} />
      {showConfirm && onConfirm && (
        <button onClick={onConfirm}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          style={{ background: 'rgba(56,124,43,0.85)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <CheckCircle2 size={11} /> Confirmar selecionados
        </button>
      )}
      {showReenvio && onReenvio && (
        <button onClick={onReenvio}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          style={{ background: 'rgba(21,115,211,0.8)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          <Send size={11} /> Reenviar selecionados
        </button>
      )}
      <button onClick={onDelete}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        style={{ background: 'rgba(220,10,10,0.7)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
        <Trash2 size={11} /> Excluir selecionados
      </button>
    </div>
  );
}

// ─── Confirm Tarefa Modal ─────────────────────────────────────────────────────

function ConfirmTarefaModal({ ids, tarefas, onConfirm, onCancel }: {
  ids: string[];
  tarefas: TarefaIdentificada[];
  onConfirm: (ids: string[]) => void;
  onCancel: () => void;
}) {
  const items = tarefas.filter(t => ids.includes(t.id));
  const isBatch = ids.length > 1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl flex flex-col gap-4" style={{ width: 'min(480px,100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxHeight: '80vh', overflow: 'hidden' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(56,124,43,0.1)' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--chart-1)' }} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              {isBatch ? `Confirmar ${ids.length} anexos?` : 'Confirmar anexo na tarefa?'}
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
              {isBatch
                ? 'Os documentos selecionados serão anexados às respectivas tarefas.'
                : 'O documento será anexado à tarefa vinculada.'}
            </p>
          </div>
        </div>

        {/* Items list */}
        <div className="overflow-y-auto px-5" style={{ maxHeight: '280px', scrollbarWidth: 'thin' }}>
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <div key={item.id} className="flex flex-col gap-1 rounded-lg px-3 py-2.5"
                style={{ background: 'rgba(56,124,43,0.04)', border: '1px solid rgba(56,124,43,0.15)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(254,166,1,0.12)' }}>
                    <FilePlus2 size={10} style={{ color: 'var(--chart-3)' }} />
                  </div>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeDoc}</span>
                </div>
                <div className="flex items-center gap-3 pl-7 flex-wrap">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={9} style={{ color: 'var(--chart-1)' }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeTarefa}</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>·</span>
                  <div className="flex items-center gap-1">
                    <Building2 size={9} style={{ color: 'var(--muted-foreground)' }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeCliente}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 justify-end px-5 pb-5">
          <button onClick={onCancel}
            className="px-4 py-2 rounded cursor-pointer hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-label)', color: 'var(--foreground)', background: 'var(--muted)', border: 'none' }}>
            Cancelar
          </button>
          <button onClick={() => onConfirm(ids)}
            className="px-4 py-2 rounded cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5"
            style={{ fontSize: 'var(--text-label)', color: 'white', background: 'var(--chart-1)', border: 'none', fontWeight: 'var(--font-weight-semibold)' }}>
            <CheckCircle2 size={13} />
            {isBatch ? `Confirmar ${ids.length} anexos` : 'Confirmar anexo'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Integrações Domínio ─────────────────────────────────────────────────

function TabDominio() {
  // Block 1 state
  const [docsSearch, setDocsSearch] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [docsData, setDocsData] = useState(mockDocsProblema);
  const [detailDoc, setDetailDoc] = useState<DocProblema | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ ids: string[] } | null>(null);

  // Block 2 state
  const [tarefaSearch, setTarefaSearch] = useState('');
  const [selectedTarefas, setSelectedTarefas] = useState<Set<string>>(new Set());
  const [tarefasData, setTarefasData] = useState(mockTarefasIdent);
  const [actionItem, setActionItem] = useState<TarefaIdentificada | null>(null);
  const [deleteModalT, setDeleteModalT] = useState<{ ids: string[] } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ ids: string[] } | null>(null);

  const filteredDocs = useMemo(() =>
    docsSearch ? docsData.filter(d => d.nomeDoc.toLowerCase().includes(docsSearch.toLowerCase()) || d.tipoErro.toLowerCase().includes(docsSearch.toLowerCase()) || d.origem.toLowerCase().includes(docsSearch.toLowerCase())) : docsData,
    [docsData, docsSearch]);

  const filteredTarefas = useMemo(() =>
    tarefaSearch ? tarefasData.filter(t => t.nomeDoc.toLowerCase().includes(tarefaSearch.toLowerCase()) || t.nomeTarefa.toLowerCase().includes(tarefaSearch.toLowerCase()) || t.nomeCliente.toLowerCase().includes(tarefaSearch.toLowerCase())) : tarefasData,
    [tarefasData, tarefaSearch]);

  const allDocsSelected = filteredDocs.length > 0 && filteredDocs.every(d => selectedDocs.has(d.id));
  const allTarefasSelected = filteredTarefas.length > 0 && filteredTarefas.every(t => selectedTarefas.has(t.id));

  function toggleDoc(id: string) {
    setSelectedDocs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAllDocs() {
    if (allDocsSelected) setSelectedDocs(new Set());
    else setSelectedDocs(new Set(filteredDocs.map(d => d.id)));
  }
  function deleteDoc(ids: string[]) {
    setDocsData(p => p.filter(d => !ids.includes(d.id)));
    setSelectedDocs(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteModal(null);
  }

  function toggleTarefa(id: string) {
    setSelectedTarefas(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAllTarefas() {
    if (allTarefasSelected) setSelectedTarefas(new Set());
    else setSelectedTarefas(new Set(filteredTarefas.map(t => t.id)));
  }
  function deleteTarefa(ids: string[]) {
    setTarefasData(p => p.filter(t => !ids.includes(t.id)));
    setSelectedTarefas(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteModalT(null);
  }

  function confirmTarefa(ids: string[]) {
    setTarefasData(p => p.filter(t => !ids.includes(t.id)));
    setSelectedTarefas(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setConfirmModal(null);
  }

  return (
    <div className="flex flex-col xl:flex-row gap-5 items-start">

      {/* ── BLOCO 1: Documentos com problema ─────────────── */}
      <div className="bg-white rounded-xl flex flex-col min-w-0 w-full xl:flex-1"
        style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>

        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Documentos com problema
            </h3>
            <BigNumber value={docsData.length} label="docs" color="var(--chart-4)" bg="rgba(220,10,10,0.05)"
              icon={<FileText size={14} style={{ color: 'var(--chart-4)' }} />} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input value={docsSearch} onChange={e => setDocsSearch(e.target.value)}
                placeholder="Buscar documento ou erro..."
                className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
            </div>
            {filteredDocs.length > 0 && (
              <div onClick={toggleAllDocs}
                className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/40 transition-colors shrink-0"
                style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                <Checkbox checked={allDocsSelected} onChange={toggleAllDocs} />
                <span style={{ fontSize: 'var(--text-caption)' }}>Todos</span>
              </div>
            )}
          </div>
        </div>

        {selectedDocs.size > 0 && (
          <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <BatchBar count={selectedDocs.size} onDelete={() => setDeleteModal({ ids: Array.from(selectedDocs) })} />
          </div>
        )}

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '520px', scrollbarWidth: 'thin' }}>
          {filteredDocs.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-2">
              <FileText size={28} style={{ color: 'var(--muted-foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum documento encontrado</p>
            </div>
          )}
          {filteredDocs.map(doc => (
            <div key={doc.id}
              className="px-4 py-3 hover:bg-muted/20 transition-colors"
              style={{ background: selectedDocs.has(doc.id) ? 'rgba(220,10,10,0.03)' : undefined, borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  <Checkbox checked={selectedDocs.has(doc.id)} onChange={() => toggleDoc(doc.id)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(220,10,10,0.08)' }}>
                      <FileText size={11} style={{ color: 'var(--chart-4)' }} />
                    </div>
                    <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }} title={doc.nomeDoc}>
                      {doc.nomeDoc}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.origem}</span>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.dataUpload}</span>
                    </div>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{doc.tamanho}</span>
                  </div>
                  <div className="mb-2.5">
                    <ErrorBadge tipo={doc.tipoErro} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ActionBtn icon={<Eye size={10} />} label="Ver erro" color="var(--chart-2)" bg="rgba(21,115,211,0.08)" onClick={() => setDetailDoc(doc)} small />
                    <ActionBtn icon={<Upload size={10} />} label="Upload" color="var(--primary)" bg="rgba(214,64,0,0.08)" small />
                    <ActionBtn icon={<RefreshCw size={10} />} label="Reenviar" color="var(--chart-1)" bg="rgba(56,124,43,0.08)" small />
                    <button onClick={() => setDeleteModal({ ids: [doc.id] })}
                      className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors ml-auto shrink-0"
                      title="Excluir">
                      <Trash2 size={11} style={{ color: 'var(--chart-4)' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BLOCO 2: Tarefas identificadas ───────────────── */}
      <div className="bg-white rounded-xl flex flex-col min-w-0 w-full xl:flex-1"
        style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>

        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              Tarefas identificadas
            </h3>
            <BigNumber value={tarefasData.length} label="tarefas" color="var(--chart-3)" bg="rgba(254,166,1,0.05)"
              icon={<CheckCircle2 size={14} style={{ color: 'var(--chart-3)' }} />} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input value={tarefaSearch} onChange={e => setTarefaSearch(e.target.value)}
                placeholder="Buscar doc., tarefa ou cliente..."
                className="w-full pl-7 pr-3 py-1.5 rounded-md outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }} />
            </div>
            {filteredTarefas.length > 0 && (
              <div onClick={toggleAllTarefas}
                className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/40 transition-colors shrink-0"
                style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
                <Checkbox checked={allTarefasSelected} onChange={toggleAllTarefas} />
                <span style={{ fontSize: 'var(--text-caption)' }}>Todos</span>
              </div>
            )}
          </div>
        </div>

        {selectedTarefas.size > 0 && (
          <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
            <BatchBar
              count={selectedTarefas.size}
              showConfirm
              onConfirm={() => setConfirmModal({ ids: Array.from(selectedTarefas) })}
              onDelete={() => setDeleteModalT({ ids: Array.from(selectedTarefas) })}
            />
          </div>
        )}

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '520px', scrollbarWidth: 'thin' }}>
          {filteredTarefas.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-2">
              <FilePlus2 size={28} style={{ color: 'var(--muted-foreground)' }} />
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum item encontrado</p>
            </div>
          )}
          {filteredTarefas.map(item => (
            <div key={item.id}
              className="px-4 py-3 hover:bg-muted/20 transition-colors"
              style={{ background: selectedTarefas.has(item.id) ? 'rgba(254,166,1,0.03)' : undefined, borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  <Checkbox checked={selectedTarefas.has(item.id)} onChange={() => toggleTarefa(item.id)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(254,166,1,0.12)' }}>
                      <FilePlus2 size={11} style={{ color: 'var(--chart-3)' }} />
                    </div>
                    <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }} title={item.nomeDoc}>
                      {item.nomeDoc}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={10} style={{ color: 'var(--chart-1)', flexShrink: 0 }} />
                    <span className="truncate" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{item.nomeTarefa}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2.5">
                    <div className="flex items-center gap-1">
                      <Building2 size={10} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeCliente}</span>
                    </div>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>·</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.dataUpload}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <ActionBtn icon={<Eye size={10} />} label="Ver doc." color="var(--chart-2)" bg="rgba(21,115,211,0.08)" small />
                    <button
                      onClick={() => setConfirmModal({ ids: [item.id] })}
                      className="flex items-center gap-1 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      style={{ background: 'rgba(56,124,43,0.10)', border: '1px solid rgba(56,124,43,0.2)', padding: '4px 8px', fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>
                      <CheckCircle2 size={10} />
                      <span>Confirmar</span>
                    </button>
                    <ActionBtn icon={<Link2 size={10} />} label="Gerenciar" color="var(--primary)" bg="rgba(214,64,0,0.08)" onClick={() => setActionItem(item)} small />
                    <button onClick={() => setDeleteModalT({ ids: [item.id] })}
                      className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors ml-auto shrink-0"
                      title="Excluir">
                      <Trash2 size={11} style={{ color: 'var(--chart-4)' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawers & modals */}
      <ErrorDetailDrawer doc={detailDoc} onClose={() => setDetailDoc(null)} />
      <TarefaActionDrawer item={actionItem} onClose={() => setActionItem(null)} />
      {deleteModal && (
        <ConfirmDeleteModal count={deleteModal.ids.length} onConfirm={() => deleteDoc(deleteModal.ids)} onCancel={() => setDeleteModal(null)} />
      )}
      {deleteModalT && (
        <ConfirmDeleteModal count={deleteModalT.ids.length} onConfirm={() => deleteTarefa(deleteModalT.ids)} onCancel={() => setDeleteModalT(null)} />
      )}
      {confirmModal && (
        <ConfirmTarefaModal ids={confirmModal.ids} tarefas={tarefasData} onConfirm={confirmTarefa} onCancel={() => setConfirmModal(null)} />
      )}
    </div>
  );
}

// ─── Tab: Integrações Portal do Cliente ──────────────────────────────────────

function TabPortal() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [data, setData] = useState(mockArquivosPortal);
  const [reenvioItem, setReenvioItem] = useState<ArquivoPortal | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ ids: string[] } | null>(null);

  const filtered = useMemo(() =>
    search ? data.filter(i =>
      i.nomeArquivo.toLowerCase().includes(search.toLowerCase()) ||
      i.nomeCliente.toLowerCase().includes(search.toLowerCase()) ||
      i.nomeTarefa.toLowerCase().includes(search.toLowerCase()) ||
      i.tipoErro.toLowerCase().includes(search.toLowerCase())
    ) : data,
    [data, search]);

  const allSelected = filtered.length > 0 && filtered.every(i => selected.has(i.id));

  function toggle(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(i => i.id)));
  }
  function deleteItems(ids: string[]) {
    setData(p => p.filter(i => !ids.includes(i.id)));
    setSelected(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; });
    setDeleteModal(null);
  }

  const thS: React.CSSProperties = { fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', padding: '8px 10px', textAlign: 'left', background: 'var(--input-background)' };

  return (
    <div className="bg-white rounded-xl" style={{ boxShadow: 'var(--elevation-sm)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <h3 style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
            Arquivos não enviados
          </h3>
          <BigNumber value={data.length} label="arquivos" color="var(--chart-5)" bg="rgba(238,80,5,0.05)"
            icon={<AlertTriangle size={16} style={{ color: 'var(--chart-5)' }} />} />
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar arquivo, cliente ou erro..."
            className="pl-8 pr-3 py-2 rounded-md outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--input-background)', fontSize: 'var(--text-caption)', color: 'var(--foreground)', width: '260px' }} />
        </div>
      </div>

      {/* Batch bar */}
      {selected.size > 0 && (
        <div className="px-5 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-background)' }}>
          <BatchBar count={selected.size} showReenvio onReenvio={() => { /* bulk reenvio */ }}
            onDelete={() => setDeleteModal({ ids: Array.from(selected) })} />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ ...thS, width: '32px' }}><Checkbox checked={allSelected} onChange={toggleAll} /></th>
              <th style={thS}>Arquivo</th>
              <th style={thS}>Cliente</th>
              <th style={thS}>Tarefa</th>
              <th style={thS}>Motivo do erro</th>
              <th style={thS}>Data de conclusão</th>
              <th style={thS}>Tentativas</th>
              <th style={{ ...thS, textAlign: 'right', minWidth: '168px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="py-10 text-center" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>Nenhum arquivo encontrado</td></tr>
            )}
            {filtered.map((item, idx) => (
              <tr key={item.id}
                className="hover:bg-muted/20 transition-colors"
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: selected.has(item.id) ? 'rgba(238,80,5,0.03)' : undefined }}>
                <td className="px-3 py-3"><Checkbox checked={selected.has(item.id)} onChange={() => toggle(item.id)} /></td>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(238,80,5,0.10)' }}>
                      <FileText size={13} style={{ color: 'var(--chart-5)' }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{item.nomeArquivo}</span>
                  </div>
                </td>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={11} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{item.nomeCliente}</span>
                  </div>
                </td>
                <td className="px-2.5 py-3">
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{item.nomeTarefa}</span>
                </td>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={11} style={{ color: 'var(--chart-4)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-4)' }}>{item.tipoErro}</span>
                  </div>
                </td>
                <td className="px-2.5 py-3">
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{item.dataConclusao}</span>
                </td>
                <td className="px-2.5 py-3">
                  <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5"
                    style={{ fontSize: 'var(--text-caption)', background: item.tentativas >= 3 ? 'rgba(220,10,10,0.10)' : 'rgba(254,166,1,0.12)', color: item.tentativas >= 3 ? 'var(--chart-4)' : 'var(--chart-3)', fontWeight: 'var(--font-weight-semibold)', minWidth: '22px' }}>
                    {item.tentativas}
                  </span>
                </td>
                <td className="px-2.5 py-3">
                  <div className="flex items-center justify-end gap-1.5" style={{ flexWrap: 'nowrap' }}>
                    <ActionBtn icon={<RotateCcw size={11} />} label="Reenviar" color="var(--chart-2)" bg="rgba(21,115,211,0.08)" onClick={() => setReenvioItem(item)} small />
                    <ActionBtn icon={<Upload size={11} />} label="Upload" color="var(--primary)" bg="rgba(214,64,0,0.08)" onClick={() => setReenvioItem(item)} small />
                    <button onClick={() => setDeleteModal({ ids: [item.id] })}
                      className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors shrink-0" title="Excluir">
                      <Trash2 size={12} style={{ color: 'var(--chart-4)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawers & modals */}
      <PortalReenvioDrawer item={reenvioItem} onClose={() => setReenvioItem(null)} />
      {deleteModal && (
        <ConfirmDeleteModal count={deleteModal.ids.length} onConfirm={() => deleteItems(deleteModal.ids)} onCancel={() => setDeleteModal(null)} />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StatusIntegracao() {
  const [activeTab, setActiveTab] = useState<TabId>('dominio');

  const errosDominio = mockDocsProblema.length + mockTarefasIdent.length;
  const errosPortal = mockArquivosPortal.length;

  const tabs: { id: TabId; label: string; errors: number }[] = [
    { id: 'dominio', label: 'Integrações Domínio', errors: errosDominio },
    { id: 'portal', label: 'Integrações Portal do Cliente', errors: errosPortal },
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-full">

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
          Status de Integrações
        </h2>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', marginTop: '2px' }}>
          Acompanhe erros e pendências nas integrações do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg shrink-0" style={{ background: 'var(--muted)', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all"
            style={{
              fontSize: 'var(--text-label)',
              fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              background: activeTab === tab.id ? 'white' : 'transparent',
              border: 'none',
              boxShadow: activeTab === tab.id ? 'var(--elevation-sm)' : 'none',
            }}
          >
            {tab.label}
            {tab.errors > 0 && (
              <span className="inline-flex items-center justify-center rounded-full px-1.5"
                style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', background: activeTab === tab.id ? 'var(--chart-4)' : 'rgba(220,10,10,0.15)', color: activeTab === tab.id ? 'white' : 'var(--chart-4)', minWidth: '20px', height: '18px' }}>
                {tab.errors}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dominio' && <TabDominio />}
      {activeTab === 'portal' && <TabPortal />}
    </div>
  );
}
