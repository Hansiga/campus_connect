"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Card } from "../../components/Card";
import { loginUser } from "../../lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 md:px-6">
      <div className="grid w-full gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-4">
          <span className="pill">Campus access</span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Log in to your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Kongu Connect
            </span>{" "}
            workspace.
          </h1>
          <p className="max-w-xl text-sm font-medium text-slate-400 uppercase tracking-widest">
            Assuring the Best
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

        <div className="space-y-4">
          {message && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 shadow-lg shadow-amber-900/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400 ring-1 ring-amber-500/40">
                  !
                </span>
                {message}
              </div>
            </div>
          )}

          <Card
            badge="Sign in"
            title="Welcome back"
            description="Enter your campus credentials to access your CampusConnect dashboard."
          >
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
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
                  autoComplete="new-email"
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
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-2.5 text-sm font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign in"}
              </button>

              <p className="text-center text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4"
                >
                  Register now
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </div>
  );
}

