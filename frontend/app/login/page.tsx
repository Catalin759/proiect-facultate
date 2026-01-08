"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const API = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    []
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Autentificare eșuată.");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/projects");
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex items-center justify-center px-4 text-black">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h1 className="text-2xl font-bold tracking-tight">Bine ai revenit 👋</h1>
            <p className="text-white/90 mt-1 text-sm">
              Autentifică-te ca să vezi proiectele tale.
            </p>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="ex: test@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parolă</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition disabled:opacity-70"
            >
              {loading ? "Se autentifică..." : "Login"}
            </button>

            <p className="text-sm text-slate-700 text-center">
              Nu ai cont?{" "}
              <a href="/register" className="text-blue-700 font-semibold underline">
                Înregistrează-te
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Proiect Facultate • Next.js + Fastify + Prisma
        </p>
      </div>
    </div>
  );
}
