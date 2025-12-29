"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
}

const API = "https://proiect-facultat-backend.onrender.com";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const loadProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || name.trim().length < 3) return;

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
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadProjects();
  };

  const uploadFile = async (projectId: number, file: File) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API}/projects/${projectId}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    alert("Fișier încărcat");
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Proiectele mele</h1>
          <button onClick={logout} className="text-red-600 underline">
            Logout
          </button>
        </div>

        <form onSubmit={createProject} className="mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nume proiect"
            className="w-full border p-2 rounded mb-2 text-black"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Adaugă proiect
          </button>
        </form>

        {projects.length === 0 ? (
          <p className="text-center">Nu ai proiecte.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border p-3 rounded bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <strong>{project.name}</strong>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 text-sm"
                  >
                    Șterge
                  </button>
                </div>

                <label className="block text-sm mb-1">
                  Încarcă fișier:
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    uploadFile(project.id, e.target.files[0])
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
