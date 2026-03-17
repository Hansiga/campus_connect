"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Card } from "../../components/Card";
import { loginUser } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token) {
        throw new Error("No token returned from server.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      router.push("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="grid w-full gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-4">
            <span className="pill">Campus access</span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Log in to your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                CampusConnect
              </span>{" "}
              workspace.
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              One place for announcements, events, and day-to-day campus life.
              Use your campus email to sign in. Single sign-on options can be
              wired in later.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure by design
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1">
                Role-based access
              </span>
            </div>
          </div>

          <Card
            badge="Sign in"
            title="Welcome back"
            description="Enter your campus credentials to access your CampusConnect dashboard."
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-200"
                >
                  Campus email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@campus.edu"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900/80 text-violet-500 accent-violet-500"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-slate-300 hover:text-slate-50"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Signing you in..." : "Continue to dashboard"}
              </button>

              <p className="pt-2 text-center text-xs text-slate-400">
                New here?{" "}
                <Link
                  href="/register"
                  className="font-medium text-violet-300 hover:text-violet-200"
                >
                  Create a campus account
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}

