"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";
import { Card } from "../../../components/Card";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?message=Please login first");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 md:flex-row md:px-6 md:py-8">
        <div className="md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:flex-none">
          <Sidebar />
        </div>

        <section className="flex-1 space-y-6">
          <header className="flex flex-col gap-1">
            <p className="text-[0.6rem] font-bold text-violet-400 uppercase tracking-[0.2em]">Account Settings</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
              My Profile
            </h1>
          </header>

          <div className="max-w-2xl">
            <Card
              badge="Personal Information"
              title={user?.name || "User Profile"}
              description="Manage your campus account details and role permissions."
            >
              <div className="mt-6 space-y-6">
                {/* Profile Detail Rows */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/60">
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">
                      Full Name
                    </p>
                    <p className="text-sm font-bold text-slate-200">
                      {user?.name || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1.5 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/60">
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">
                      Campus Role
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${
                        user?.role === 'admin' 
                          ? 'bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                      }`}>
                        {user?.role || "student"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/60">
                  <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {user?.email || "N/A"}
                  </p>
                </div>

                {/* Additional Info / Placeholder */}
                <div className="rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/20 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-200">Account Security</span>
                  </div>
                  <p className="text-[0.7rem] text-slate-400 leading-relaxed">
                    Your account is secured with JWT authentication. Role-based access is enforced by the Kongu Connect backend to ensure data integrity and privacy.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
