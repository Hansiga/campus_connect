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

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="section-subtitle">Notices</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
              Campus notices
            </h1>
          </div>
        </header>

        <section className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-300">Loading notices…</p>
          ) : notices.length === 0 ? (
            <p className="text-sm text-slate-300">No notices available.</p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`}>
                  <Card
                    badge={notice.department || "General"}
                    title={notice.title}
                    description={notice.content}
                  >
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        {notice.department || "General"}
                      </span>
                      <span className="uppercase tracking-wide">
                        {notice.created_at
                          ? new Date(notice.created_at).toLocaleString()
                          : "Unknown date"}
                      </span>
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

