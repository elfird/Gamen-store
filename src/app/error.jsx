"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function RootError({ error, reset }) {
  useEffect(() => {
    // Log error to console for diagnostics
    console.error("RootError boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-text mb-2">
          Terjadi Kendala Teknis
        </h1>
        <p className="text-sm text-secondary leading-relaxed mb-6">
          Halaman tidak dapat dimuat sementara waktu. Silakan coba muat ulang atau kembali ke beranda.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={() => reset()} className="w-full sm:w-auto">
            Coba Lagi
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
