"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/notices", label: "Notices" },
  { href: "/events", label: "Events" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel relative flex w-full flex-row gap-3 border-slate-700/60 bg-slate-950/60 p-3 md:h-full md:w-64 md:flex-col md:gap-6 md:p-4">
      <div className="hidden md:flex md:flex-col">
        <span className="section-subtitle mb-1">Navigation</span>
        <span className="text-sm text-slate-400">
          Jump between key areas of the campus hub.
        </span>
      </div>

      <nav className="flex flex-1 flex-row items-center gap-2 overflow-x-auto md:flex-col md:items-stretch md:gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all md:text-sm",
                "border border-transparent bg-slate-900/40 hover:bg-slate-800/60",
                "hover:border-slate-600/60",
                isActive
                  ? "border-violet-500/70 bg-gradient-to-r from-violet-600/80 via-violet-500/70 to-cyan-500/70 text-slate-50 shadow-lg shadow-violet-900/70"
                  : "text-slate-300",
              ].join(" ")}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900/80 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-slate-700/70 group-hover:bg-slate-950 group-hover:text-slate-100">
                {item.label.charAt(0)}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex md:flex-col gap-2 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/80 p-3">
        <span className="text-xs font-semibold text-slate-200">
          Daily snapshot
        </span>
        <p className="text-xs text-slate-400">
          Quick access to upcoming events, unread notices, and shortcuts for
          faculty and students.
        </p>
      </div>
    </aside>
  );
}

