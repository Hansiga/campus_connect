"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Card } from "../../components/Card";

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load notices");
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        // 4. Ensure newest first on the client, in case backend changes
        list.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });
        setNotices(list);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [router]);

  const filteredNotices = notices
    .filter((notice) => {
      const query = searchQuery.toLowerCase();
      return (
        notice.title?.toLowerCase().includes(query) ||
        notice.content?.toLowerCase().includes(query) ||
        notice.department?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (sortBy === "recent") return bTime - aTime;
      if (sortBy === "old") return aTime - bTime;
      return 0; // "all" or default - maintained by fetch order usually, but explicit here
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return <p>No notices yet</p>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-[0.6rem] font-bold text-violet-400 uppercase tracking-[0.2em]">Assuring the Best</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
              Campus notices
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-800/60 bg-slate-900/40 py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 shadow-inner shadow-black/20 backdrop-blur-sm transition-all focus:border-violet-500/50 focus:bg-slate-900/60 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 pr-10 text-xs font-bold uppercase tracking-wider text-slate-300 outline-none transition-all hover:border-slate-700/60 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="all">All</option>
                <option value="recent">Recent</option>
                <option value="old">Old</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          {filteredNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border border-dashed border-slate-800/60 bg-slate-900/20 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-slate-500 ring-1 ring-slate-800/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <p className="text-sm font-medium text-slate-400">
                {searchQuery ? "No notices found" : "No notices available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredNotices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`} className="group block transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]">
                  <Card
                    badge={notice.department || "General"}
                    title={notice.title}
                    description={notice.content}
                  >
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <span className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
                          {notice.department || "General"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className="text-[0.65rem] font-medium uppercase tracking-tight">
                          {notice.created_at
                            ? new Date(notice.created_at).toLocaleString()
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

