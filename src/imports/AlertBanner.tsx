import svgPaths from "./svg-tbhd1radlr";

function Icon() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p18897900} id="Vector" stroke="var(--stroke-0, #DC0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M7.5 5.625V8.125" id="Vector_2" stroke="var(--stroke-0, #DC0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M7.5 10.625H7.50625" id="Vector_3" stroke="var(--stroke-0, #DC0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

export default function AlertBanner({ onOpenTarefas, onClose }: { onOpenTarefas?: () => void; onClose?: () => void }) {
  return (
    <div className="bg-destructive/5 flex flex-col sm:flex-row items-start gap-3 rounded-lg px-4 py-3 w-full relative" data-name="AlertBanner">
      <div aria-hidden="true" className="absolute border border-destructive/20 border-solid inset-0 pointer-events-none rounded-lg" />

      {/* Icon and Content wrapper for mobile */}
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
        {/* Icon */}
        <Icon />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-label text-foreground">
            12 Tarefas com falha de envio - últimos 30 dias
          </p>
          <p className="text-caption text-muted-foreground mt-0.5">
            Portal do cliente (5), E-mail (5), WhatsApp (2)
          </p>
        </div>
      </div>

      {/* Buttons wrapper */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
        {/* Button */}
        <button
          onClick={onOpenTarefas}
          className="bg-white h-6 flex items-center gap-1 px-2 rounded border border-primary cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-caption text-primary whitespace-nowrap">
            Abrir tarefas
          </span>
          <svg className="shrink-0" width="5" height="10" fill="none" viewBox="0 0 5.25 9.75">
            <path d={svgPaths.p367ff600} fill="currentColor" className="text-primary" />
          </svg>
        </button>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-black/5 bg-transparent border-none"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
              <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}