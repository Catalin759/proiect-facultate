"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const API = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    []
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState<number | null>(null);

  const tokenOrRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    return token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const loadProjects = async () => {
    const token = tokenOrRedirect();
    if (!token) return;

    const res = await fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenOrRedirect();
    if (!token) return;

    if (name.trim().length < 3) {
      alert("Numele proiectului trebuie să aibă minim 3 caractere.");
      return;
    }

    await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    loadProjects();
  };

  const deleteProject = async (id: number) => {
    const token = tokenOrRedirect();
    if (!token) return;

    if (!confirm("Sigur vrei să ștergi proiectul?")) return;

    setBusyId(id);
    await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBusyId(null);

    loadProjects();
  };

  const uploadFile = async (projectId: number, file: File) => {
    const token = tokenOrRedirect();
    if (!token) return;

    setBusyId(projectId);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API}/projects/${projectId}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    setBusyId(null);

    if (!res.ok) {
      alert(data?.message || "Eroare la încărcare fișier.");
      return;
    }

    const link = data?.url ? `${API}${data.url}` : null;
    if (link) {
      alert(`Fișier încărcat ✅\nLink: ${link}`);
      // window.open(link, "_blank");
    } else {
      alert("Fișier încărcat ✅");
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-black">
        <div className="rounded-xl bg-white shadow border border-slate-200 px-6 py-4">
          Se încarcă proiectele...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 text-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard proiecte
            </h1>
            <p className="text-slate-700 mt-1">
              Creează, caută, șterge proiecte și încarcă fișiere.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100 transition"
          >
            Delogare
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create card */}
          <div className="rounded-2xl bg-white shadow border border-slate-200 p-5">
            <h2 className="text-lg font-semibold mb-3">Adaugă proiect</h2>
            <form onSubmit={createProject} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Nume proiect
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Proiect Facultate"
                />
              </div>

              <button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition">
                Adaugă
              </button>
            </form>
          </div>

          {/* Search card */}
          <div className="rounded-2xl bg-white shadow border border-slate-200 p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold">Proiectele mele</h2>
              <span className="text-sm text-slate-600">
                {filtered.length} / {projects.length}
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black">
                Caută după nume
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scrie aici..."
              />
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
                Nu există proiecte care să se potrivească.
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          ID proiect: {p.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100 transition">
                          Încarcă fișier
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadFile(p.id, f);
                            }}
                          />
                        </label>

                        <button
                          onClick={() => deleteProject(p.id)}
                          disabled={busyId === p.id}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                        >
                          {busyId === p.id ? "..." : "Șterge"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="text-center text-xs text-slate-600 mt-8">
          Backend: Fastify + Prisma + PostgreSQL • Frontend: Next.js + Tailwind
        </div>
      </div>
    </div>
  );
}
