import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";

export const metadata = {
  title: "Kebijakan Privasi | Gamen Store",
  description: "Kebijakan privasi dan perlindungan data pelanggan di Gamen Store.",
};

export default function PrivacyPage() {
  return (
    <StoreLayout>
      <div className="py-10 sm:py-16 bg-white min-h-screen">
        <PageContainer size="narrow">
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-8">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Kebijakan Privasi</span>
          </nav>

          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-[#737373] leading-relaxed">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Kebijakan Privasi Gamen Store
            </h1>
            <p>
              Privasi Anda adalah prioritas utama kami. Kebijakan ini menjelaskan bagaimana Gamen Store mengumpulkan, menggunakan, dan melindungi informasi pribadi yang Anda berikan saat berbelanja di website kami.
            </p>

            <h3 className="text-base font-bold text-[#171717]">1. Informasi yang Kami Kumpulkan</h3>
            <p>
              Informasi yang Anda isi saat proses pemesanan (nama, nomor WhatsApp, email, dan alamat tujuan pengiriman) hanya digunakan semata-mata untuk verifikasi pesanan, pengiriman paket, dan pembuatan invoice resmi.
            </p>

            <h3 className="text-base font-bold text-[#171717]">2. Kerahasiaan Data</h3>
            <p>
              Gamen Store tidak pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga mana pun di luar kebutuhan logistik pengiriman pesanan Anda.
            </p>

            <h3 className="text-base font-bold text-[#171717]">3. Keamanan Informasi</h3>
            <p>
              Seluruh data transaksi dan komunikasi diproses melalui protokol enkripsi standar industri untuk mencegah akses tidak sah.
            </p>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
