"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Card } from "../../../components/Card";

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [form_link, setForm_link] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      router.replace("/events");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const date = eventDate;
    console.log({ 
      title, 
      description, 
      event_date: date, 
      venue, 
      form_link 
    });

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          event_date: date,
          venue,
          form_link,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/events");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <header className="space-y-1">
          <p className="text-[0.6rem] font-bold text-violet-400 uppercase tracking-[0.2em]">Administration</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
            Create Event
          </h1>
        </header>

        <Card
          badge="New Event"
          title="Event Details"
          description="Fill in the information below to publish a new campus event."
        >
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-medium text-slate-200">Event Title</label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Research Symposium 2026"
                className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-medium text-slate-200">Description</label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the event..."
                className="w-full resize-none rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="date" className="text-xs font-medium text-slate-200">Event Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="venue" className="text-xs font-medium text-slate-200">Venue</label>
                <input
                  id="venue"
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Main Auditorium"
                  className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="form_link" className="text-xs font-medium text-slate-200">Google Form Link</label>
              <input
                id="form_link"
                type="url"
                value={form_link}
                onChange={(e) => setForm_link(e.target.value)}
                placeholder="https://forms.gle/..."
                className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                Event created successfully! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3 text-sm font-bold uppercase tracking-wider text-slate-50 shadow-lg shadow-violet-900/40 transition-all hover:scale-[1.02] hover:from-violet-500 hover:to-violet-400 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Publishing..." : "Publish Event"}
            </button>
          </form>
        </Card>
      </main>
    </div>
  );
}
