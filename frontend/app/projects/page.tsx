"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
  fileUrl?: string;
  fileName?: string;
}

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD PROJECTS
  // =========================
  const loadProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch("http://localhost:3001/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // =========================
  // CREATE PROJECT
  // =========================
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || name.trim().length < 3) return;

    await fetch("http://localhost:3001/projects", {
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

  // =========================
  // DELETE PROJECT
  // =========================
  const deleteProject = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:3001/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadProjects();
  };

  // =========================
  // UPLOAD FILE
  // =========================
  const uploadFile = async (projectId: number, file: File) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:3001/projects/${projectId}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              fileUrl: data.url,
              fileName: data.filename,
            }
          : p
      )
    );
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Se încarcă proiectele...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 text-black">
      <div className="max-w-6xl mx-auto">

        {/* HEADER TOP */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-3xl font-bold">
            Listă – Proiectele mele
          </h1>

          <input
            type="text"
            placeholder="Caută proiect..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* CREATE PROJECT */}
        <form
          onSubmit={createProject}
          className="bg-white p-6 rounded-2xl shadow mb-12 flex flex-col sm:flex-row gap-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nume proiect nou"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Adaugă
          </button>
        </form>

        {/* PROJECTS */}
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-600">
            Nu există proiecte.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {project.name}
                  </h3>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Șterge
                  </button>
                </div>

                {/* UPLOAD */}
                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg text-center transition">
                  Încarcă fișier
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        uploadFile(project.id, e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {/* FILE INFO */}
                {project.fileUrl && (
                  <div className="text-sm text-gray-700 break-all">
                    📎 <strong>{project.fileName}</strong>
                    <br />
                    <a
                      href={`http://localhost:3001${project.fileUrl}`}
                      target="_blank"
                      className="text-indigo-600 underline"
                    >
                      Descarcă fișier
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
