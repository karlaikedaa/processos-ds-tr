import React, { useState } from 'react';
import { X, Filter, Star, BarChart2, List } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ListaTab = 'departamentos' | 'funcionarios' | 'empresas' | 'tarefas' | 'certificados';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const avatarColors = ['#B83C00', '#1573D3', '#387C2B', '#D49000', '#6C3FB5', '#C0392B'];

const deptData = [
  { name: 'Contábil',       pct: 85, abertas: 200, atraso: 52, multa: 90, impedidas: 12, concluidas: 212, concAtraso: 48, concMulta: 2, total: 412 },
  { name: 'Fiscal',         pct: 78, abertas: 180, atraso: 44, multa: 72, impedidas: 8,  concluidas: 195, concAtraso: 38, concMulta: 3, total: 375 },
  { name: 'Folha',          pct: 91, abertas: 150, atraso: 18, multa: 35, impedidas: 5,  concluidas: 220, concAtraso: 22, concMulta: 1, total: 370 },
  { name: 'Pessoal',        pct: 67, abertas: 95,  atraso: 28, multa: 45, impedidas: 10, concluidas: 98,  concAtraso: 30, concMulta: 4, total: 193 },
  { name: 'Patrimônio',     pct: 55, abertas: 60,  atraso: 20, multa: 30, impedidas: 3,  concluidas: 65,  concAtraso: 18, concMulta: 2, total: 125 },
  { name: 'Societário',     pct: 72, abertas: 85,  atraso: 25, multa: 40, impedidas: 6,  concluidas: 110, concAtraso: 20, concMulta: 0, total: 195 },
  { name: 'Administrativo', pct: 88, abertas: 45,  atraso: 5,  multa: 8,  impedidas: 2,  concluidas: 132, concAtraso: 10, concMulta: 1, total: 177 },
  { name: 'Tributário',     pct: 60, abertas: 120, atraso: 40, multa: 60, impedidas: 14, concluidas: 88,  concAtraso: 35, concMulta: 5, total: 208 },
  { name: 'Trabalhista',    pct: 75, abertas: 70,  atraso: 15, multa: 22, impedidas: 4,  concluidas: 95,  concAtraso: 14, concMulta: 2, total: 165 },
  { name: 'Previdenciário', pct: 82, abertas: 55,  atraso: 10, multa: 15, impedidas: 3,  concluidas: 115, concAtraso: 12, concMulta: 1, total: 170 },
];

const funcData = [
  { name: 'Áleffe Andrade',         initials: 'AA', dept: 'Contábil',   pct: 85, abertas: 200, atraso: 52, multa: 90, impedidas: 12, concluidas: 212, concAtraso: 48, concMulta: 2, total: 412 },
  { name: 'Bruno Donini Fachine',   initials: 'BD', dept: 'Fiscal',     pct: 78, abertas: 180, atraso: 44, multa: 72, impedidas: 8,  concluidas: 195, concAtraso: 38, concMulta: 3, total: 375 },
  { name: 'Caio dos Santos Amaral', initials: 'CA', dept: 'Folha',      pct: 91, abertas: 150, atraso: 18, multa: 35, impedidas: 5,  concluidas: 220, concAtraso: 22, concMulta: 1, total: 370 },
  { name: 'Danilo de Oliveira',     initials: 'DO', dept: 'Pessoal',    pct: 67, abertas: 95,  atraso: 28, multa: 45, impedidas: 10, concluidas: 98,  concAtraso: 30, concMulta: 4, total: 193 },
  { name: 'Fernando Atílio',        initials: 'FA', dept: 'Contábil',   pct: 72, abertas: 85,  atraso: 25, multa: 40, impedidas: 6,  concluidas: 110, concAtraso: 20, concMulta: 0, total: 195 },
  { name: 'Gabriel José Alfredo',   initials: 'GJ', dept: 'Fiscal',     pct: 55, abertas: 60,  atraso: 20, multa: 30, impedidas: 3,  concluidas: 65,  concAtraso: 18, concMulta: 2, total: 125 },
  { name: 'Jefferson Koga',         initials: 'JK', dept: 'Folha',      pct: 88, abertas: 45,  atraso: 5,  multa: 8,  impedidas: 2,  concluidas: 132, concAtraso: 10, concMulta: 1, total: 177 },
  { name: 'Alberto Borges',         initials: 'AB', dept: 'Fiscal',     pct: 60, abertas: 120, atraso: 40, multa: 60, impedidas: 14, concluidas: 88,  concAtraso: 35, concMulta: 5, total: 208 },
  { name: 'Lucinete Borges',        initials: 'LB', dept: 'Pessoal',    pct: 75, abertas: 70,  atraso: 15, multa: 22, impedidas: 4,  concluidas: 95,  concAtraso: 14, concMulta: 2, total: 165 },
  { name: 'Maria Silva',            initials: 'MS', dept: 'Contábil',   pct: 82, abertas: 55,  atraso: 10, multa: 15, impedidas: 3,  concluidas: 115, concAtraso: 12, concMulta: 1, total: 170 },
  { name: 'João Pereira',           initials: 'JP', dept: 'Tributário', pct: 68, abertas: 90,  atraso: 30, multa: 50, impedidas: 9,  concluidas: 80,  concAtraso: 28, concMulta: 3, total: 170 },
  { name: 'Ana Torres',             initials: 'AT', dept: 'Folha',      pct: 93, abertas: 42,  atraso: 8,  multa: 12, impedidas: 1,  concluidas: 145, concAtraso: 8,  concMulta: 0, total: 187 },
  { name: 'Carlos Rocha',           initials: 'CR', dept: 'Societário', pct: 77, abertas: 78,  atraso: 22, multa: 35, impedidas: 5,  concluidas: 105, concAtraso: 18, concMulta: 2, total: 183 },
  { name: 'Fernanda Lima',          initials: 'FL', dept: 'Fiscal',     pct: 84, abertas: 65,  atraso: 12, multa: 20, impedidas: 4,  concluidas: 118, concAtraso: 14, concMulta: 1, total: 183 },
];

const empresaData = [
  { name: 'Magazine Luiza',   pct: 85, abertas: 200, atraso: 52, multa: 90, impedidas: 12, concluidas: 212, concAtraso: 48, concMulta: 2, total: 412 },
  { name: 'Natura',           pct: 78, abertas: 180, atraso: 44, multa: 72, impedidas: 8,  concluidas: 195, concAtraso: 38, concMulta: 3, total: 375 },
  { name: 'Ambev',            pct: 91, abertas: 150, atraso: 18, multa: 35, impedidas: 5,  concluidas: 220, concAtraso: 22, concMulta: 1, total: 370 },
  { name: 'Itaú',             pct: 67, abertas: 95,  atraso: 28, multa: 45, impedidas: 10, concluidas: 98,  concAtraso: 30, concMulta: 4, total: 193 },
  { name: 'Bradesco',         pct: 72, abertas: 85,  atraso: 25, multa: 40, impedidas: 6,  concluidas: 110, concAtraso: 20, concMulta: 0, total: 195 },
  { name: 'Embraer',          pct: 55, abertas: 60,  atraso: 20, multa: 30, impedidas: 3,  concluidas: 65,  concAtraso: 18, concMulta: 2, total: 125 },
  { name: 'Vivo',             pct: 88, abertas: 45,  atraso: 5,  multa: 8,  impedidas: 2,  concluidas: 132, concAtraso: 10, concMulta: 1, total: 177 },
  { name: 'Petrobras',        pct: 60, abertas: 120, atraso: 40, multa: 60, impedidas: 14, concluidas: 88,  concAtraso: 35, concMulta: 5, total: 208 },
  { name: 'Pão de Açúcar',    pct: 75, abertas: 70,  atraso: 15, multa: 22, impedidas: 4,  concluidas: 95,  concAtraso: 14, concMulta: 2, total: 165 },
  { name: 'Odebrecht',        pct: 82, abertas: 55,  atraso: 10, multa: 15, impedidas: 3,  concluidas: 115, concAtraso: 12, concMulta: 1, total: 170 },
  { name: 'Via Varejo',       pct: 68, abertas: 90,  atraso: 30, multa: 50, impedidas: 9,  concluidas: 80,  concAtraso: 28, concMulta: 3, total: 170 },
  { name: 'Lojas Americanas', pct: 93, abertas: 42,  atraso: 8,  multa: 12, impedidas: 1,  concluidas: 145, concAtraso: 8,  concMulta: 0, total: 187 },
];

const tarefaData = [
  { name: 'DCTF',              tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'SPED Fiscal',       tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'Folha de Pagamento',tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'REINF',             tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'ECF',               tipo: 'Esporádica', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'Balancete',         tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'IRPJ Trimestral',   tipo: 'Esporádica', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'CSLL',              tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'DIRF',              tipo: 'Esporádica', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
  { name: 'SPED Contábil',     tipo: 'Recorrente', pct: 85, abertas: 3, atraso: 1, multa: 1, concluidas: 12, concAtraso: 2, concMulta: 0, total: 15 },
];

const certData = [
  { name: 'Certificado',        cliente: 'Posto Conterrâneo Deriv. de Petróleo',          expiracao: '06/12/2023', responsavel: 'Bruna Bomfim',            status: 'Expirado' },
  { name: 'Certificado',        cliente: 'Muritiba Melo Serviços Veterinários L.',         expiracao: '12/12/2023', responsavel: 'Josileide Figueiredo',     status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Produtos Veterinários Muritiba Ltda',            expiracao: '12/12/2023', responsavel: 'Josileide Figueiredo',     status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Traquete Comércio de Combustíveis Ltda',         expiracao: '14/12/2023', responsavel: 'Paulo Silva Souza Junior',  status: 'No prazo' },
  { name: 'Certificado - eCPF', cliente: 'Cassia Dias Macedo Bezerra',                    expiracao: '15/12/2023', responsavel: 'Lucinete Borges',           status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Clínica Meu Dente Ltda',                        expiracao: '15/12/2023', responsavel: 'Josileide Figueiredo',     status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Prazeres Comércio de Calçados Ltda',             expiracao: '15/12/2023', responsavel: 'Josileide Figueiredo',     status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Leanux Logística e Transporte Ltda',             expiracao: '16/12/2023', responsavel: 'Bruna Bomfim',              status: 'No prazo' },
  { name: 'Certificado',        cliente: 'Posto Jorrinho Derivados de Petróleo',           expiracao: '19/12/2023', responsavel: 'Bruna Bomfim',              status: 'No prazo' },
  { name: 'Certificado',        cliente: 'MGA Derivados de Petróleo Ltda',                expiracao: '19/12/2023', responsavel: 'Otavio Matos Figueiredo',  status: 'No prazo' },
  { name: 'Certificado',        cliente: 'MGA Derivados de Petróleo Ltda',                expiracao: '19/12/2023', responsavel: 'Otavio Matos Figueiredo',  status: 'No prazo' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials, idx }: { initials: string; idx: number }) {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ background: avatarColors[idx % avatarColors.length] }}>
      <span style={{ fontSize: '10px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>{initials}</span>
    </div>
  );
}

function Num({ v, color }: { v: number; color?: string }) {
  if (!v) return <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-caption)' }}>0</span>;
  return <span style={{ color: color ?? 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-caption)' }}>{v}</span>;
}

const commonColHeaders = ['% Conclusão', 'Tarefas abertas', 'Abertas em atraso', 'Abertas com multa', 'Tarefas Concluídas', 'Concluídas em atraso', 'Concluídas com multa', 'Total'];

function CommonCols({ row }: { row: { pct: number; abertas: number; atraso: number; multa: number; concluidas: number; concAtraso: number; concMulta: number; total: number } }) {
  return (
    <>
      <td className="py-2.5 px-3 text-center">
        <span style={{ color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-caption)' }}>{row.pct}%</span>
      </td>
      <td className="py-2.5 px-3 text-center"><Num v={row.abertas} color="var(--chart-2)" /></td>
      <td className="py-2.5 px-3 text-center"><Num v={row.atraso} color="var(--chart-4)" /></td>
      <td className="py-2.5 px-3 text-center"><Num v={row.multa} color="var(--chart-5)" /></td>
      <td className="py-2.5 px-3 text-center"><Num v={row.concluidas} color="var(--foreground)" /></td>
      <td className="py-2.5 px-3 text-center"><Num v={row.concAtraso} color="var(--chart-4)" /></td>
      <td className="py-2.5 px-3 text-center"><Num v={row.concMulta} color="var(--chart-1)" /></td>
      <td className="py-2.5 px-3 text-center" style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.total}</td>
    </>
  );
}

// ─── Gauge Chart (semi-circle) ────────────────────────────────────────────────

function GaugeArc({ cx, cy, r, startAngle, endAngle, strokeWidth, color }: {
  cx: number; cy: number; r: number; startAngle: number; endAngle: number; strokeWidth: number; color: string;
}) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
      fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
    />
  );
}

function GaugeCard({ item, idx }: {
  item: { name: string; initials?: string; abertas: number; atraso: number; multa: number; impedidas: number; concluidas: number; concAtraso: number; concMulta: number; pct: number; total: number };
  idx: number;
}) {
  const cx = 80, cy = 78, outerR = 62, innerR = 46;
  // Outer ring: abertas (full arc = 180deg from 180 to 360)
  const totalAbertas = item.abertas;
  const noPrazoAbertas = Math.max(0, totalAbertas - item.atraso - item.multa);
  const totalArc = 180; // degrees for semi-circle

  const pNoP = totalAbertas > 0 ? (noPrazoAbertas / totalAbertas) * totalArc : 0;
  const pAtr = totalAbertas > 0 ? (item.atraso / totalAbertas) * totalArc : 0;
  const pMult = totalAbertas > 0 ? (item.multa / totalAbertas) * totalArc : 0;

  // Outer arcs from 180→360 (left→right)
  const o1s = 180, o1e = 180 + pNoP;
  const o2s = o1e, o2e = o2s + pAtr;
  const o3s = o2e, o3e = o3s + pMult;

  // Inner ring: concluidas
  const totalConc = item.concluidas;
  const noPrazoCon = Math.max(0, totalConc - item.concAtraso - item.concMulta);
  const pNoPc = totalConc > 0 ? (noPrazoCon / totalConc) * totalArc : 0;
  const pAtrc = totalConc > 0 ? (item.concAtraso / totalConc) * totalArc : 0;
  const pMultc = totalConc > 0 ? (item.concMulta / totalConc) * totalArc : 0;

  const i1s = 180, i1e = 180 + pNoPc;
  const i2s = i1e, i2e = i2s + pAtrc;
  const i3s = i2e, i3e = i3s + pMultc;

  return (
    <div className="bg-white rounded-xl flex-shrink-0 flex flex-col overflow-hidden"
      style={{ width: '200px', border: '1px solid var(--border)', boxShadow: 'var(--elevation-sm)' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </span>
        {item.initials && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: avatarColors[idx % avatarColors.length], fontSize: '10px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
            {item.initials}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div style={{ width: `${item.pct}%`, height: '100%', background: 'var(--chart-1)', borderRadius: '999px' }} />
        </div>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)', flexShrink: 0 }}>
          {item.pct}%
        </span>
      </div>

      {/* Outer gauge — Abertas */}
      <div className="flex flex-col items-center px-2" style={{ marginTop: '-8px' }}>
        <svg width="160" height="90" viewBox="0 0 160 90" style={{ overflow: 'visible' }}>
          {/* Background arcs */}
          <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={180} endAngle={360} strokeWidth={14} color="rgba(21,115,211,0.10)" />
          {/* Colored arcs */}
          {pNoP > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={o1s} endAngle={o1e} strokeWidth={14} color="var(--chart-2)" />}
          {pAtr > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={o2s} endAngle={o2e} strokeWidth={14} color="var(--chart-4)" />}
          {pMult > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={o3s} endAngle={o3e} strokeWidth={14} color="#8B5CF6" />}
          {/* Dot indicator */}
          <circle cx={cx + outerR * Math.cos((Math.PI / 180) * (180 + (item.pct / 100) * 180))}
            cy={cy + outerR * Math.sin((Math.PI / 180) * (180 + (item.pct / 100) * 180))}
            r={4} fill="white" stroke="var(--chart-2)" strokeWidth={2} />
          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: '20px', fontWeight: 'bold', fill: 'var(--foreground)', fontFamily: 'Source Sans 3, sans-serif' }}>
            {item.abertas}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--muted-foreground)', fontFamily: 'Source Sans 3, sans-serif' }}>
            Tarefas abertas
          </text>
        </svg>
      </div>

      {/* Abertas sub-numbers */}
      <div className="px-3 pb-2 flex items-center justify-center gap-3">
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-1)', lineHeight: 1 }}>{noPrazoAbertas}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>No prazo</p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-4)', lineHeight: 1 }}>{item.atraso}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>Em atraso</p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#8B5CF6', lineHeight: 1 }}>{item.multa}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>Com multas</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 pb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
        <span style={{ fontSize: '9px', color: 'var(--muted-foreground)' }}>Impedidas</span>
        <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-3)' }}>{item.impedidas}</span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '0 12px' }} />

      {/* Inner gauge — Concluídas */}
      <div className="flex flex-col items-center px-2" style={{ marginTop: '-8px' }}>
        <svg width="160" height="90" viewBox="0 0 160 90" style={{ overflow: 'visible' }}>
          <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={180} endAngle={360} strokeWidth={14} color="rgba(56,124,43,0.12)" />
          {pNoPc > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={i1s} endAngle={i1e} strokeWidth={14} color="var(--chart-1)" />}
          {pAtrc > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={i2s} endAngle={i2e} strokeWidth={14} color="var(--chart-4)" />}
          {pMultc > 0.5 && <GaugeArc cx={cx} cy={cy} r={outerR} startAngle={i3s} endAngle={i3e} strokeWidth={14} color="var(--primary)" />}
          <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: '20px', fontWeight: 'bold', fill: 'var(--foreground)', fontFamily: 'Source Sans 3, sans-serif' }}>
            {item.concluidas}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--muted-foreground)', fontFamily: 'Source Sans 3, sans-serif' }}>
            Tarefas concluídas
          </text>
        </svg>
      </div>

      {/* Concluídas sub-numbers */}
      <div className="px-3 pb-3 flex items-center justify-center gap-3">
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-1)', lineHeight: 1 }}>{noPrazoCon}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>No prazo</p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--chart-4)', lineHeight: 1 }}>{item.concAtraso}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>Em atraso</p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary)', lineHeight: 1 }}>{item.concMulta}</p>
          <p style={{ fontSize: '9px', color: 'var(--muted-foreground)', marginTop: '1px' }}>Com multa</p>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(!value)}
        className="relative cursor-pointer transition-colors shrink-0"
        style={{ width: '36px', height: '20px', borderRadius: '999px', background: value ? 'var(--chart-1)' : 'var(--muted)', border: 'none', padding: 0 }}
      >
        <span className="absolute top-0.5 transition-transform block"
          style={{ left: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transform: value ? 'translateX(16px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  initialTab: ListaTab;
  onClose: () => void;
}

export function ListasDetalhadas({ open, initialTab, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ListaTab>(initialTab);
  // Chart mode state per graph-capable tab
  const [chartModes, setChartModes] = useState<Record<string, boolean>>({
    departamentos: true,
    funcionarios: true,
    empresas: true,
  });
  // "Ativar modo de exibição" toggle per graph tab
  const [modoExibicao, setModoExibicao] = useState<Record<string, boolean>>({
    departamentos: false,
    funcionarios: false,
    empresas: false,
  });

  React.useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  const graphTabs: ListaTab[] = ['departamentos', 'funcionarios', 'empresas'];
  const isGraphTab = graphTabs.includes(activeTab);
  const showGraph = isGraphTab && chartModes[activeTab];

  const tabs: { id: ListaTab; label: string; count: number }[] = [
    { id: 'departamentos', label: 'Departamentos', count: deptData.length },
    { id: 'funcionarios',  label: 'Funcionários',  count: funcData.length },
    { id: 'empresas',      label: 'Empresas',       count: empresaData.length },
    { id: 'tarefas',       label: 'Tarefas',        count: 100 },
    { id: 'certificados',  label: 'Certificados',   count: certData.length },
  ];

  const thStyle: React.CSSProperties = {
    fontSize: 'var(--text-caption)',
    color: 'var(--muted-foreground)',
    fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap',
    padding: '6px 12px',
    textAlign: 'center',
  };
  const thLeftStyle: React.CSSProperties = { ...thStyle, textAlign: 'left', paddingLeft: '0' };

  // Get data for graph tabs
  const getGraphData = () => {
    if (activeTab === 'departamentos') return deptData.map(d => ({ ...d, initials: undefined }));
    if (activeTab === 'funcionarios') return funcData;
    if (activeTab === 'empresas') return empresaData.map(d => ({ ...d, initials: undefined }));
    return [];
  };

  return (
    <div style={{ display: 'contents' }}>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.25)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white transition-transform duration-300"
        style={{
          top: '0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
          borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
          maxHeight: '100dvh',
        }}>

        {/* ── Header ── */}
        <div className="flex flex-col gap-3 px-4 md:px-6 pt-4 pb-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                Listas detalhadas por período filtrado
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'var(--chart-1)', fontSize: '10px', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                <Filter size={9} /> 40
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Meu filtro salvo 01', 'Mês atual', 'Funcionários (24)', 'Departamentos (5)', 'Agrupadores (5)', 'Tarefas (6)'].map((chip, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: '10px', color: i === 0 ? 'var(--muted-foreground)' : 'var(--foreground)', background: 'var(--muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {i === 0 && <Star size={9} />}{chip}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose}
              className="flex items-center gap-1.5 shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ background: 'none', border: 'none', fontSize: 'var(--text-caption)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
              <X size={14} /> Fechar
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-3 py-1.5 rounded-md shrink-0 cursor-pointer transition-colors"
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: activeTab === t.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                  background: activeTab === t.id ? 'var(--foreground)' : 'transparent',
                  color: activeTab === t.id ? 'white' : 'var(--foreground)',
                  border: activeTab === t.id ? 'none' : '1px solid var(--border)',
                }}>
                {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-2.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {/* Only show chart/list toggle for graph tabs */}
            {isGraphTab && (
              <button
                onClick={() => setChartModes(prev => ({ ...prev, [activeTab]: !prev[activeTab] }))}
                className="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                style={{ background: 'var(--primary)', border: 'none', fontSize: 'var(--text-caption)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                {showGraph
                  ? <><List size={13} /> EXIBIR COMO LISTA</>
                  : <><BarChart2 size={13} /> EXIBIR COMO GRÁFICO</>
                }
              </button>
            )}
          </div>

          {/* "Ativar modo de exibição" only in graph view */}
          {isGraphTab && showGraph && (
            <Toggle
              value={modoExibicao[activeTab]}
              onChange={v => setModoExibicao(prev => ({ ...prev, [activeTab]: v }))}
              label="Ativar modo de exibição"
            />
          )}
        </div>

        {/* ── Content area ── */}
        <div className="flex-1 overflow-auto px-4 md:px-6 py-2">

          {/* GRAPH VIEW (for dept/func/emp) */}
          {isGraphTab && showGraph && (
            <div className="flex gap-4 pb-4 pt-2" style={{ overflowX: 'auto', minHeight: '200px' }}>
              {getGraphData().map((item, idx) => (
                <GaugeCard key={item.name} item={item as any} idx={idx} />
              ))}
            </div>
          )}

          {/* TABLE VIEW for departamentos */}
          {activeTab === 'departamentos' && !showGraph && (
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left pb-2" style={{ ...thLeftStyle }}>Departamento</th>
                  {commonColHeaders.map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {deptData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.name}</td>
                    <CommonCols row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TABLE VIEW for funcionarios */}
          {activeTab === 'funcionarios' && !showGraph && (
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left pb-2" style={{ ...thLeftStyle, minWidth: '140px' }}>Funcionários</th>
                  <th className="text-left pb-2" style={{ ...thLeftStyle, minWidth: '100px' }}>Departamento</th>
                  {commonColHeaders.map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {funcData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={row.initials} idx={i} />
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{row.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{row.dept}</td>
                    <CommonCols row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TABLE VIEW for empresas */}
          {activeTab === 'empresas' && !showGraph && (
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left pb-2" style={{ ...thLeftStyle, minWidth: '140px' }}>Empresa</th>
                  {commonColHeaders.map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {empresaData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.name}</td>
                    <CommonCols row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAREFAS — table only, no chart */}
          {activeTab === 'tarefas' && (
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '780px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left pb-2" style={{ ...thLeftStyle, minWidth: '140px' }}>Tarefa</th>
                  <th className="text-left pb-2" style={{ ...thLeftStyle, minWidth: '90px' }}>Tipo</th>
                  {commonColHeaders.map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tarefaData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.name}</td>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>{row.tipo}</td>
                    <CommonCols row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* CERTIFICADOS — table only, no chart */}
          {activeTab === 'certificados' && (
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Certificados', 'Clientes', 'Expiração', 'Responsável', 'Status'].map((h, i) => (
                    <th key={h} className="text-left pb-2" style={{ ...thLeftStyle, paddingLeft: i === 0 ? '0' : '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{row.name}</td>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)' }}>{row.cliente}</td>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{row.expiracao}</td>
                    <td className="py-2.5 pr-3" style={{ fontSize: 'var(--text-caption)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{row.responsavel}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block shrink-0"
                          style={{ background: row.status === 'Expirado' ? 'var(--chart-3)' : 'var(--chart-1)' }} />
                        <span style={{ fontSize: 'var(--text-caption)', color: row.status === 'Expirado' ? 'var(--chart-3)' : 'var(--chart-1)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {row.status}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
