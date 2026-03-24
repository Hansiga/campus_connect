"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card";
import { getNotices, getEvents } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    notices: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeDepartment, setNoticeDepartment] = useState("");
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeError, setNoticeError] = useState("");

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
        const parsed = JSON.parse(storedUser);
        setRole(parsed?.role ? String(parsed.role).toLowerCase() : "");
      } catch {
        setRole("");
      }
    } else {
      setRole("");
    }

    const fetchStats = async () => {
      try {
        setLoadingStats(true);

        const response = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load dashboard stats.");
        }

        const data = await response.json();
        setStats({
          users: Number(data?.users ?? 0),
          events: Number(data?.events ?? 0),
          notices: Number(data?.notices ?? 0),
        });
      } catch (err) {
        // 5. Log but do not break UI
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    // Stats endpoint is admin-only in the backend, so only fetch for admins.
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      const userRole = parsed?.role ? String(parsed.role).toLowerCase() : "";
      if (userRole === "admin") {
        fetchStats();
      } else {
        setLoadingStats(false);
      }
    } catch {
      setLoadingStats(false);
    }

    const fetchContent = async () => {
      try {
        setLoadingContent(true);
        const [noticesRes, eventsRes] = await Promise.all([
          getNotices(token),
          getEvents(token),
        ]);

        const allNotices = Array.isArray(noticesRes.data) ? noticesRes.data : [];
        const allEvents = Array.isArray(eventsRes.data) ? eventsRes.data : [];

        // Sort and take top 3
        setNotices(
          allNotices
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3)
        );
        setEvents(
          allEvents
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 3)
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching dashboard content:", err);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [router]);

  const handleCreateNotice = async (event) => {
    event.preventDefault();
    setNoticeError("");

    if (!noticeTitle || !noticeContent || !noticeDepartment) {
      setNoticeError("Please fill in all notice fields.");
      return;
    }

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setNoticeLoading(true);
      const response = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          department: noticeDepartment,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          data?.message || "Failed to create notice. Please try again.";
        setNoticeError(message);
        return;
      }

      setNoticeTitle("");
      setNoticeContent("");
      setNoticeDepartment("");

      router.push("/notices");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setNoticeError("Something went wrong while creating the notice.");
    } finally {
      setNoticeLoading(false);
    }
  };

  if (loadingContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return <p>No events available</p>;
  }

  if (notices.length === 0) {
    return <p>No notices yet</p>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 md:flex-row md:px-6 md:py-8">
        <div className="md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:flex-none">
          <Sidebar />
        </div>

        <section className="flex min-h-[60vh] flex-1 flex-col gap-5 overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[0.6rem] font-bold text-violet-400 uppercase tracking-[0.2em]">Assuring the Best</p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
                Campus overview
              </h1>
            </div>
          </header>

          <div className="card-grid">
            <Card
              badge="Latest"
              title="Upcoming events"
              description="A quick snapshot of what&apos;s happening across campus."
            >
              {events.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No events available</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-300">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 transition hover:border-slate-500/60"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-100">
                          {event.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          {event.venue} • {new Date(event.event_date).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              badge="Highlights"
              title="Recent notices"
              description="Key information surfaced for students and faculty."
            >
              {notices.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No notices available</p>
              ) : (
                <div className="space-y-2 text-sm text-slate-300">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3 transition hover:border-slate-500/60"
                    >
                      <p className="text-sm font-medium text-slate-100">
                        {notice.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {role === "admin" && (
              <Card
                badge="Activity"
                title="Engagement overview"
                description="High-level metrics to understand how the platform is being used. Now powered by live backend stats."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Active students",
                      value: stats.users,
                      hint: "total registered users",
                    },
                    {
                      label: "Notices sent",
                      value: stats.notices,
                      hint: "total notices in the system",
                    },
                    {
                      label: "Events published",
                      value: stats.events,
                      hint: "total published events",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2.5"
                    >
                      <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-50">
                        {loadingStats ? "Loading…" : stat.value.toLocaleString()}
                      </p>
                      <p className="text-[0.7rem] text-slate-400">{stat.hint}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {role === "admin" && (
              <Card
                badge="Admin"
                title="Create notice"
                description="Publish a new campus notice for students and faculty."
              >
                <form className="space-y-3" onSubmit={handleCreateNotice}>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="notice-title"
                      className="text-xs font-medium text-slate-200"
                    >
                      Title
                    </label>
                    <input
                      id="notice-title"
                      type="text"
                      className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                      placeholder="Exam week schedule"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="notice-department"
                      className="text-xs font-medium text-slate-200"
                    >
                      Department
                    </label>
                    <input
                      id="notice-department"
                      type="text"
                      className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                      placeholder="Computer Science"
                      value={noticeDepartment}
                      onChange={(e) => setNoticeDepartment(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="notice-content"
                      className="text-xs font-medium text-slate-200"
                    >
                      Content
                    </label>
                    <textarea
                      id="notice-content"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                      placeholder="Share summary, dates, and any important details."
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                    />
                  </div>

                  {noticeError && (
                    <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                      {noticeError}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="submit"
                      className="btn-primary flex-1 text-xs md:text-sm disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={noticeLoading}
                    >
                      {noticeLoading ? "Publishing..." : "Publish notice"}
                    </button>
                    <Link
                      href="/notices"
                      className="text-xs font-medium text-violet-300 hover:text-violet-200"
                    >
                      View all
                    </Link>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

