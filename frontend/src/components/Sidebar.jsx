"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Overview", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )
  },
  { 
    href: "/notices", 
    label: "Notices", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
    )
  },
  { 
    href: "/events", 
    label: "Events", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    )
  },
  { 
    href: "/dashboard/profile", 
    label: "Profile", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex w-full flex-row gap-3 border-slate-800/60 bg-slate-950/40 p-3 backdrop-blur-xl md:h-[calc(100vh-8rem)] md:w-64 md:flex-col md:gap-8 md:p-6 md:border-r md:bg-transparent">
      <div className="hidden md:flex md:flex-col px-2">
        <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-slate-500">
          Platform Menu
        </span>
      </div>

      <nav className="flex flex-1 flex-row items-center gap-2 overflow-x-auto md:flex-col md:items-stretch md:gap-2">
        {navItems.map((item, index) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-violet-600/10 text-violet-400 shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-violet-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.5)] md:block hidden" />
              )}

              <span className={`transition-all duration-300 group-hover:scale-110 ${isActive ? "text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" : "text-slate-500 group-hover:text-slate-300"}`}>
                {item.icon}
              </span>
              <span className="truncate tracking-tight">{item.label}</span>
              
              {isActive && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] md:block" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex md:flex-col gap-4 rounded-[2rem] border border-slate-800/60 bg-slate-900/40 p-6 shadow-2xl shadow-black/20 relative overflow-hidden group/card">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl transition-all duration-500 group-hover/card:bg-violet-600/20" />
        
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 ring-1 ring-violet-500/30 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        
        <div className="space-y-1.5 relative z-10">
          <span className="text-[0.7rem] font-black text-slate-200 uppercase tracking-wider">
            Kongu Connect
          </span>
          <p className="text-[0.65rem] leading-relaxed text-slate-500 font-medium">
            Assuring the Best campus experience through smart communication.
          </p>
        </div>
      </div>
    </aside>
  );
}

