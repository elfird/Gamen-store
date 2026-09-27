import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";

/**
 * Product 404 Not Found Page
 */
export default function ProductNotFound() {
  return (
    <StoreLayout>
      <div className="py-20 sm:py-32 text-center">
        <PageContainer size="narrow">
          <div className="space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#D2D2D7] shadow-xs flex items-center justify-center mx-auto text-[#6E6E73]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706] bg-[#D97706]/10 px-3 py-1 rounded-full">
                404 • Produk Tidak Ditemukan
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Model iPhone Tidak Tersedia
              </h1>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Maaf, model atau halaman produk yang Anda cari mungkin telah dipindahkan, dinonaktifkan, atau URL tidak sesuai.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/">
                <Button variant="primary" size="md" className="w-full sm:w-auto px-6">
                  Kembali ke Beranda
                </Button>
              </Link>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20Gamen%20Store,%20saya%20mencari%20tipe%20iPhone%20tertentu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="secondary" size="md" className="w-full sm:w-auto px-6">
                  Tanya Stok di WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
