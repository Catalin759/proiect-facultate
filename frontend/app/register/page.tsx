"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere");
      return;
    }

    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      setError("Eroare la creare cont");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 text-gray-800">
      <form className="bg-white p-6 rounded-xl shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Crează cont</h1>

        {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

        <label className="block mb-1 font-semibold">Nume</label>
        <input
          className="w-full p-2 mb-3 border rounded text-gray-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-1 font-semibold">Email</label>
        <input
          className="w-full p-2 mb-3 border rounded text-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-1 font-semibold">Parolă</label>
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Creează cont
        </button>
      </form>
    </div>
  );
}
