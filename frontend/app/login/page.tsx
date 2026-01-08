"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(
      "https://proiect-facultat-backend.onrender.com/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Autentificare eșuată");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/projects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Autentificare
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <label className="block mb-2 text-black">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded mb-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-black">Parolă</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-6 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Intră în cont
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Nu ai cont?{" "}
          <a href="/register" className="text-blue-600 underline">
            Creează unul
          </a>
        </p>
      </form>
    </div>
  );
}
