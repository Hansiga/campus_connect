"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Card } from "../../../components/Card";

export default function CreateNoticePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title || !content || !department) {
      setError("Please fill in all fields.");
      return;
    }

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          department,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message || "Failed to create notice. Please try again.";
        setError(message);
        return;
      }

      setTitle("");
      setDepartment("");
      setContent("");

      router.push("/notices");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Something went wrong while creating the notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10 md:px-6">
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="section-subtitle">Dashboard / Notices</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
              Create a new notice
            </h1>
          </div>
          <Link
            href="/notices"
            className="text-xs font-medium text-violet-300 hover:text-violet-200"
          >
            View all notices
          </Link>
        </header>

        <Card
          badge="Admin"
          title="Publish notice"
          description="Share important information with students and staff."
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-xs font-medium text-slate-200"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                placeholder="Exam week schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="department"
                className="text-xs font-medium text-slate-200"
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                placeholder="Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="content"
                className="text-xs font-medium text-slate-200"
              >
                Content
              </label>
              <textarea
                id="content"
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                placeholder="Add details, dates, and any important instructions."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="btn-primary px-4 text-xs md:text-sm disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish notice"}
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

