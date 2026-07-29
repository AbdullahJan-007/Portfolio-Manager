"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/client-api";
import { BrandLogo, Icon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await apiFetch<{
      user: { id: string; email: string; role: "USER" | "ADMIN" };
    }>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(result.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <main className="film-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-cinematic px-4 py-12">
      {/* Decorative background — matches landing page brand language */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob top-[-8rem] left-[-6rem] h-96 w-96 animate-blob bg-blue-300/30" />
        <div className="blob bottom-[-10rem] right-[-6rem] h-96 w-96 animate-blob bg-cyan-300/30 [animation-delay:3s]" />
      </div>

      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <BrandLogo className="text-lg" />
        </Link>

        <div className="glass-cinema viewfinder animate-scale-in rounded-3xl p-8 shadow-glow-lg sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Log in to manage your portfolio.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <Icon name="warning" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? "Logging in…" : "Log in"}
              {!loading && <Icon name="arrow-right" className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
