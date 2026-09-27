"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "admin@gamenstore.com",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login gagal.");
      }

      // Check URL parameters for return path
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("from") || "/admin/dashboard";

      router.push(returnUrl);
      router.refresh();
    } catch (err) {
      setError(err.message || "Email atau password salah.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-2xl mb-4 shadow-lg shadow-black/10">
          G
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-text">
          Gamen Store Admin
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Sistem Manajemen E-Commerce & Toko iPhone
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-6 shadow-md rounded-2xl border border-border sm:px-10">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                Email Administrator
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@gamenstore.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-text uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl text-[11px] text-text-secondary border border-border/50">
              <span className="font-semibold text-text block mb-0.5">Kredensial Default Demo:</span>
              Email: <code>admin@gamenstore.com</code> <br />
              Password: <code>admin123456</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-black text-primary-foreground font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
