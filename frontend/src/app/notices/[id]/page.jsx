"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Card } from "../../../components/Card";

export default function NoticeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError("");

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
        const found = list.find(
          (item) => String(item.id) === String(id)
        );

        if (!found) {
          setError("Notice not found.");
        } else {
          setNotice(found);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError("Something went wrong while loading this notice.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, router]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="section-subtitle">Notices</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
              Notice details
            </h1>
          </div>
          <Link
            href="/notices"
            className="text-xs font-medium text-violet-300 hover:text-violet-200"
          >
            Back to Notices
          </Link>
        </header>

        <section>
          {loading ? (
            <p className="text-sm text-slate-300">Loading notice…</p>
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : !notice ? (
            <p className="text-sm text-slate-300">Notice not found.</p>
          ) : (
            <Card
              badge={notice.department || "General"}
              title={notice.title}
              description={notice.content}
            >
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.75rem] text-slate-400">
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
          )}
        </section>
      </main>
    </div>
  );
}

