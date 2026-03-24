"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md shadow-sm shadow-black/20 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-center transition-transform duration-300 group-hover:rotate-3">
            <span className="text-2xl font-black tracking-tighter text-slate-50 bg-gradient-to-br from-violet-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              Kongu
            </span>
          </div>
          <div className="flex flex-col border-l border-slate-700/60 pl-3 transition-all duration-300 group-hover:border-slate-400/60">
            <span className="text-sm font-bold tracking-tight text-slate-50 transition-colors duration-300 group-hover:text-violet-300">
              Kongu Connect
            </span>
            <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-cyan-300">
              Assuring the Best
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/dashboard"
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              pathname === "/dashboard"
                ? "bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
            }`}
          >
            Dashboard
          </Link>

          {isLoggedIn && user?.role === "admin" && (
            <>
              <Link
                href="/events/create"
                className={`hidden md:block rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  pathname === "/events/create"
                    ? "bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
                }`}
              >
                Create Event
              </Link>
              <Link
                href="/dashboard"
                className={`hidden md:block rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  pathname === "/dashboard"
                    ? "bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
                }`}
              >
                Admin
              </Link>
            </>
          )}

          <div className="hidden h-4 w-px bg-slate-800/60 md:block" />

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all duration-300 hover:bg-slate-800/60 hover:text-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-2 text-xs font-bold uppercase tracking-wider text-slate-50 shadow-lg shadow-violet-900/40 transition-all duration-300 hover:scale-105 hover:from-violet-500 hover:to-violet-400 active:scale-95"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-900/40 p-1.5 pr-4 transition-all duration-300 hover:border-slate-500/60 hover:bg-slate-800/60 active:scale-95"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-bold text-slate-50 shadow-md transition-transform duration-300 group-hover:scale-110">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-bold tracking-wide text-slate-200 transition-colors duration-300">
                    {user?.name || "User"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-slate-400 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-slate-700/60 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-xl z-20 transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                      <div className="mb-2 border-b border-slate-800/60 px-3 py-2">
                        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                          Account
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-300">
                          {user?.email || "user@kongu.edu"}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:translate-x-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}

