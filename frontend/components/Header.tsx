"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* FULL WIDTH BAR */}
      <div className="flex items-center justify-between px-6 py-3">
        
        {/* STÂNGA */}
        <Link
          href="/"
          className="text-lg font-bold text-black"
        >
          Proiect Facultate
        </Link>

        {/* DREAPTA */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {!loggedIn ? (
            <>
              <Link
                href="/login"
                className="text-black hover:text-indigo-600 transition"
              >
                Logare
              </Link>

              <Link
                href="/register"
                className="text-black hover:text-indigo-600 transition"
              >
                Înregistrare
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-red-600 hover:underline transition"
            >
              Delogare
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
