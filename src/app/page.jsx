import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Selamat Datang",
  description: "iPhone terpercaya dengan garansi resmi.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
      <div className="text-center space-y-4 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#111111] rounded-2xl mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            fontSize: "2.25rem",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#1d1d1f",
          }}
        >
          {APP_NAME}
        </h1>

        <p
          style={{
            color: "#6e6e73",
            fontSize: "1.125rem",
            maxWidth: "420px",
          }}
        >
          Platform sedang dibangun. Kembali lagi segera.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            background: "#fff",
            border: "1px solid #d2d2d7",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            color: "#6e6e73",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#16a34a",
              display: "inline-block",
            }}
          />
          Sistem aktif
        </div>
      </div>
    </main>
  );
}
