export function Card({ title, description, children, badge }) {
  return (
    <section className="glass-panel relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-3 p-4 md:p-5">
        {(badge || title) && (
          <header className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {badge ? <span className="pill">{badge}</span> : null}
              {title ? <h3 className="section-title">{title}</h3> : null}
            </div>
          </header>
        )}

        {description ? (
          <p className="text-sm text-slate-300/90">{description}</p>
        ) : null}

        {children ? <div className="mt-1">{children}</div> : null}
      </div>
    </section>
  );
}

