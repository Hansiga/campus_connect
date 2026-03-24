"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Card } from "../../../components/Card";

export default function EventDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);
  console.log("PARAM ID:", resolvedParams.id);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role || "student");
  }, []);

  useEffect(() => {
    console.log("EVENT STATE:", event);
    if (event) {
      console.log("EVENT FORM LINK:", event.form_link);
    }
  }, [event]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();
        console.log("API RESPONSE:", data);
        console.log("EVENT DATA:", data);

        // Handle both direct object or { event: {...} }
        if (data.event) {
          setEvent(data.event);
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleDelete = async () => {
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

      router.push("/events");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6">
        <Link 
          href="/events" 
          className="flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-violet-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Events
        </Link>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-slate-400">Loading event details...</p>
          </div>
        )}

        {error && (
          <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <button 
              onClick={() => router.push('/events')}
              className="mt-4 text-sm font-medium text-slate-400 underline underline-offset-4 hover:text-slate-300"
            >
              Return to events listing
            </button>
          </div>
        )}

        {!loading && !error && !event && (
          <div className="rounded-[2.5rem] border border-slate-800/60 bg-slate-900/20 p-12 text-center">
            <p className="text-lg font-semibold text-slate-400">Event not found</p>
            <button 
              onClick={() => router.push('/events')}
              className="mt-4 text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-400"
            >
              Return to events listing
            </button>
          </div>
        )}

        {!loading && !error && event && (
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-violet-500/10 px-4 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-violet-400 ring-1 ring-violet-500/20">
                  {event.venue || "Campus Event"}
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Event ID: {eventId}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-50 md:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] text-slate-500">Date & Time</span>
                    <span className="text-slate-200">{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] text-slate-500">Location</span>
                    <span className="text-slate-200">{event.venue}</span>
                  </div>
                </div>
              </div>
            </header>

            <Card
              title="About the Event"
              className="!p-8"
            >
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-300">
                  {event.description}
                </p>
              </div>

              <div className="mt-12 border-t border-slate-800/60 pt-8">
                {userRole === "admin" ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 ring-1 ring-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-200">Admin Controls</p>
                      <p className="text-xs text-slate-500 italic">Registration button is hidden for administrators.</p>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/20 transition-all hover:bg-red-500 hover:text-white focus:ring-4 focus:ring-red-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      Delete Event Permanently
                    </button>
                  </div>
                ) : event.form_link ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm font-medium text-slate-400">
                      Registration is open for this event. Click below to secure your spot.
                    </p>
                    <button
                      onClick={() => window.open(event.form_link, "_blank")}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-5 text-lg font-black uppercase tracking-widest text-white shadow-2xl shadow-emerald-900/40 transition-all hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Register Now
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center opacity-60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 ring-1 ring-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500 italic">
                      Registration Closed or Not Available
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </article>
        )}
      </main>
    </div>
  );
}
