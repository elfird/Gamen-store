import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan",
  description: "Halaman yang Anda tuju tidak ditemukan di Gamen Store.",
};

export default function NotFound() {
  return (
    <StoreLayout>
      <PageContainer className="py-24 sm:py-32">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-secondary leading-relaxed mb-8">
            Maaf, halaman atau produk yang Anda cari mungkin telah dipindahkan, diganti, atau tidak lagi tersedia di katalog kami.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">
                Lihat Katalog iPhone
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </StoreLayout>
  );
}
