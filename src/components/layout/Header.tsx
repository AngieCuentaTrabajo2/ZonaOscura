"use client";

type HeaderProps = {
  usuario?: string;
  onSearch?: (value: string) => void;
};

export function Header({ usuario = "Jhan Pérez", onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 hidden h-[76px] w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-lg shadow-sm backdrop-blur lg:flex">
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-safety-blue">search</span>
        <input
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 pl-10 font-texto-general text-texto-general text-on-surface placeholder:text-slate-400 focus:border-safety-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Buscar reportes, zonas o usuarios..."
          onChange={(event) => onSearch?.(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-md">
        <button
          aria-label="Notificaciones"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-primary transition-colors hover:bg-amber-100"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>
        <div className="hidden text-right xl:block">
          <p className="font-etiqueta text-etiqueta font-semibold text-primary">{usuario}</p>
          <p className="font-etiqueta text-[11px] text-on-surface-variant">Sesión activa</p>
        </div>
      </div>
    </header>
  );
}
