# Tokens Ausentes no Design System

Este arquivo registra tokens que são necessários no projeto mas não estão disponíveis no Figma DS.

## Status

**Data de última verificação:** 2026-04-07  
**Fonte verificada:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web

---

## Tokens Pendentes

### Cores

#### Chart Colors
**Contexto:** Usadas nos gráficos e visualizações de dados  
**Uso atual:** Hardcoded em vários componentes (VisaoGeral, Relatorios)  
**Valores atuais:**
- `--chart-1`: rgba(56, 124, 43, 1) - Verde (success)
- `--chart-2`: rgba(21, 115, 211, 1) - Azul (info)
- `--chart-3`: rgba(254, 166, 1, 1) - Laranja (warning)
- `--chart-4`: rgba(220, 10, 10, 1) - Vermelho (error)
- `--chart-5`: rgba(238, 80, 5, 1) - Laranja escuro

**Ação recomendada:** Verificar se devem ser adicionados ao DS ou mantidos como customização local

#### Purple/Violet
**Contexto:** Usado em badges de "aguardando aprovação"  
**Uso atual:** Hardcoded como `#8B5CF6` e `#6C3FB5`  
**Ação recomendada:** Adicionar ao DS como cor de status adicional ou usar cor existente

---

## Tokens Implementados com Workaround

Nenhum no momento. Todos os tokens do DS foram mapeados corretamente.

---

## Observações

- As cores de chart (chart-1 a chart-5) mapeiam para cores de feedback existentes, mas seria útil ter uma paleta dedicada para data visualization
- O projeto usa CSS variables (--chart-*) que precisam ser mantidos para compatibilidade com componentes legados durante a migração
