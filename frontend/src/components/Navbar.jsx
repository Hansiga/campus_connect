import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-400 to-cyan-400 shadow-lg shadow-violet-900/70 ring-2 ring-violet-400/60">
            <span className="text-lg font-semibold text-slate-950">CC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              CampusConnect
            </span>
            <span className="text-xs font-medium text-slate-400">
              Modern campus communication
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden text-xs font-medium text-slate-300 transition hover:text-slate-50 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden text-xs font-medium text-slate-300 transition hover:text-slate-50 sm:inline-flex"
          >
            Register
          </Link>
          <Link href="/dashboard" className="btn-primary text-xs md:text-sm">
            Open dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

