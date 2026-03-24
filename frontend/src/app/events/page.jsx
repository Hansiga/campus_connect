"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Card } from "../../components/Card";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchEvents = async () => {
    console.log("Fetching events...");
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      const response = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Full API Response:", response);

      if (response.status === 401) {
        setError("Unauthorized - please login again");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError("Failed to fetch events");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Full JSON Data:", data);

      // Handle both array directly or { events: [...] }
      const eventsList = Array.isArray(data) ? data : data.events || [];
      setEvents(eventsList);
      console.log("Events state set to:", eventsList);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role === "admin");
    fetchEvents();
  }, []);

  const handleDelete = async (e, eventId) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }

      // Refresh the list
      fetchEvents();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

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

  if (events.length === 0) {
    return <p>No events available</p>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[0.6rem] font-bold text-violet-400 uppercase tracking-[0.2em]">Assuring the Best</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
              Campus events
            </h1>
          </div>

          {isAdmin && (
            <Link
              href="/events/create"
              className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-2 text-xs font-bold uppercase tracking-wider text-slate-50 shadow-lg shadow-violet-900/40 transition-all hover:scale-105 hover:from-violet-500 hover:to-violet-400 active:scale-95"
            >
              Create Event
            </Link>
          )}
        </header>

        <section className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center">
              <p className="text-sm font-semibold text-red-400">Error: {error}</p>
            </div>
          )}

          {!error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border border-dashed border-slate-800/60 bg-slate-900/20 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-slate-500 ring-1 ring-slate-800/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <p className="text-sm font-medium text-slate-400">No events available</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {!error && events.map((event) => (
              <div 
                key={event.id} 
                onClick={() => {
                  console.log("Navigating to event:", event);
                  if (event.id) {
                    router.push(`/events/${event.id}`);
                  } else {
                    console.error("Event ID is missing!", event);
                  }
                }}
                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <Card
                  badge={event.venue || "Campus"}
                  title={event.title}
                  description={event.description}
                >
                  <div className="flex flex-col gap-3">
                    {event.form_link ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.form_link, "_blank");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600/10 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-emerald-400 border border-emerald-500/20 transition-all hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-900/20 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Register Now
                      </button>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900/40 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-slate-500 border border-slate-800/60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        Registration Closed
                      </div>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(e, event.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-red-400 border border-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-900/20 focus:ring-4 focus:ring-red-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Delete Event
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-4 text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
