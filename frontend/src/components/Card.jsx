export function Card({ title, description, children, badge }) {
  return (
    <section className="group relative overflow-hidden rounded-[2.5rem] border border-slate-800/60 bg-slate-900/30 p-1 shadow-2xl transition-all duration-500 hover:border-slate-700/60 hover:bg-slate-900/40">
      {/* Decorative Glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl transition-all duration-500 group-hover:bg-violet-500/20" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/5 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/10" />

      <div className="relative flex flex-col gap-4 rounded-[2.3rem] bg-slate-950/40 p-6 backdrop-blur-sm md:p-8">
        {(badge || title) && (
          <header className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5">
              {badge ? (
                <span className="inline-flex w-fit items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-widest text-violet-400 ring-1 ring-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                  {badge}
                </span>
              ) : null}
              {title ? (
                <h3 className="text-lg font-bold tracking-tight text-slate-50 md:text-xl">
                  {title}
                </h3>
              ) : null}
            </div>
          </header>
        )}

        {description ? (
          <p className="text-xs font-medium leading-relaxed text-slate-400 md:text-sm">
            {description}
          </p>
        ) : null}

        {children ? (
          <div className="relative mt-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

