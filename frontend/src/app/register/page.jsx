"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Card } from "../../components/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message || "Registration failed. Please try again.";
        setError(message);
        return;
      }

      // Successful registration
      // eslint-disable-next-line no-alert
      alert("Account created successfully");
      router.push("/login");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950/90 text-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="grid w-full gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] md:items-start">
          <Card
            badge="Get started"
            title="Create your campus account"
            description="Faculty, staff, and students can request access. Roles and permissions are enforced by the backend."
          >
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex gap-3">
                <div className="w-1/2 space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-slate-200"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Hansiga"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="new-name"
                    required
                  />
                </div>
                <div className="w-1/2 space-y-1.5">
                  <label
                    htmlFor="role"
                    className="text-xs font-medium text-slate-200"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Faculty / Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="text-xs font-medium text-slate-200"
                >
                  Campus email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@campus.edu"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-email"
                  required
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-password"
                    className="text-xs font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-confirm"
                    className="text-xs font-medium text-slate-200"
                  >
                    Confirm password
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/60"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900/80 text-violet-500 accent-violet-500"
                />
                <label htmlFor="terms">
                  I agree to the campus communication guidelines and privacy
                  policy.
                </label>
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
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="pt-2 text-center text-xs text-slate-400">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-medium text-violet-300 hover:text-violet-200"
                >
                  Sign in instead
                </Link>
              </p>
            </form>
          </Card>

          <div className="space-y-4">
            <span className="pill">Why Kongu Connect?</span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              A single pane of glass for{" "}
              <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                campus life
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm font-medium text-slate-400 uppercase tracking-widest">
              Assuring the Best
            </p>

            <div className="card-grid">
              <Card
                title="Real-time notices"
                description="Students see the latest official announcements immediately, with role-based targeting for faculties and cohorts."
              />
              <Card
                title="Event visibility"
                description="Highlight academic, cultural, and club activities in a single, discoverable schedule for the whole campus."
              />
              <Card
                title="Secure access"
                description="Authentication and authorization logic is handled by the backend, keeping sensitive operations locked down."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

