"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Card } from "../../../components/Card";
import { getComments, postComment } from "../../../lib/api";

export default function NoticeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [notice, setNotice] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState("");

  const fetchCommentsList = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const commentsResponse = await getComments(id);
      setComments(commentsResponse.data.comments || []);
    } catch (cErr) {
      console.error("Error fetching comments:", cErr);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?message=Please login first");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch Notice
        const noticeResponse = await fetch("http://localhost:5000/api/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!noticeResponse.ok) {
          throw new Error("Failed to load notices");
        }

        const noticeData = await noticeResponse.json();
        const list = Array.isArray(noticeData) ? noticeData : [];
        const found = list.find(
          (item) => String(item.id) === String(id)
        );

        if (!found) {
          setError("Notice not found.");
        } else {
          setNotice(found);
          // Fetch Comments
          await fetchCommentsList();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError("Something went wrong while loading this notice.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      setPostError("");
      await postComment(
        { notice_id: id, comment_text: commentText },
        token
      );
      setCommentText("");
      await fetchCommentsList(); // Refresh list
    } catch (err) {
      console.error("Error posting comment:", err);
      setPostError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

        <section className="mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <h2 className="text-lg font-semibold text-slate-100">Comments</h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
              {comments.length}
            </span>
          </div>

          {loadingComments ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 w-1/4 rounded bg-slate-800"></div>
                  <div className="h-10 w-full rounded bg-slate-800"></div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-4 transition hover:border-slate-600/60"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-violet-300">
                      {comment.username}
                    </span>
                    <span className="text-[0.7rem] text-slate-500 uppercase tracking-tight">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {comment.comment_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 border-t border-slate-700/60 pt-8">
          <Card
            badge="Join the conversation"
            title="Post a comment"
            description="Share your thoughts or ask a question about this notice."
          >
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="comment"
                  className="text-xs font-medium text-slate-200"
                >
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                  placeholder="Type your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {postError && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {postError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={submitting || !commentText.trim()}
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </Card>
        </section>
      </main>
    </div>
  );
}

