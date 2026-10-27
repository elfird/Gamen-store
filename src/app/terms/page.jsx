import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

export const metadata = {
  title: "Syarat & Ketentuan dan Kebijakan Garansi | Gamen Store",
  description:
    "Syarat ketentuan transaksi, kebijakan retur unit, dan klaim garansi resmi IMEI permanen di Gamen Store.",
};

export default function TermsPage() {
  return (
    <StoreLayout>
      <div className="py-10 sm:py-16 bg-white min-h-screen">
        <PageContainer size="narrow">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-8">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Syarat & Ketentuan</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] text-[11px] font-semibold uppercase tracking-wider">
              Legal & Ketentuan
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Syarat, Ketentuan & Kebijakan Garansi
            </h1>
            <p className="text-sm text-[#737373] leading-relaxed">
              Selamat datang di Gamen Store. Harap membaca ketentuan ini secara saksama untuk memastikan kenyamanan, transparansi, dan keamanan hak garansi Anda dalam setiap transaksi.
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[#171717] leading-relaxed">
            {/* Section 1 */}
            <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                1. Ketentuan Pemesanan & Pembayaran
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-[#737373]">
                <li>
                  Setiap pesanan yang dibuat melalui website Gamen Store akan menghasilkan nomor ID pemesanan resmi (format <code className="text-[#171717] font-semibold">ORD-YYYYMMDD-XXXX</code>).
                </li>
                <li>
                  Harga yang tertera pada invoice web bersifat transparan dan mengikat setelah pesanan dikonfirmasi oleh admin resmi kami.
                </li>
                <li>
                  Pembayaran hanya dilakukan ke rekening bank resmi yang diinformasikan oleh nomor WhatsApp Customer Service resmi Gamen Store. Kami tidak bertanggung jawab atas pembayaran ke rekening di luar instruksi resmi kami.
                </li>
                <li>
                  Pesanan akan otomatis dibatalkan jika pelanggan tidak melakukan konfirmasi pembayaran dalam waktu 24 jam setelah order dibuat.
                </li>
              </ul>
            </div>

            {/* Section 2: Warranty & Return (#warranty anchor) */}
            <div id="warranty" className="scroll-mt-24 bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
                <span>Kebijakan Garansi & Retur</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                2. Kebijakan Garansi Toko & Garansi Sinyal IMEI
              </h2>
              <p className="text-[#737373]">
                Gamen Store berkomitmen memberikan perlindungan maksimal bagi setiap pelanggan dengan standar garansi sebagai berikut:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-1">
                  <h4 className="font-bold text-[#171717] text-sm">A. Unit Baru Segel Resmi (NEW)</h4>
                  <p className="text-xs text-[#737373]">
                    Dilindungi garansi resmi Apple selama 1 (satu) tahun penuh yang dapat diklaim di seluruh Apple Authorized Service Provider (iBox, Digimap, Mitra Care, QCD) di seluruh Indonesia.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-1">
                  <h4 className="font-bold text-[#171717] text-sm">B. Unit Like New Second</h4>
                  <p className="text-xs text-[#737373]">
                    Mendapatkan Garansi Toko Gamen Store mencakup garansi tukar unit (jika ditemukan kendala fungsional hardware non-human error) dan garansi servis fungsional.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-1">
                  <h4 className="font-bold text-[#171717] text-sm">C. Garansi Sinyal IMEI Permanen Seumur Hidup</h4>
                  <p className="text-xs text-[#737373]">
                    Kami memberikan jaminan sinyal IMEI permanen tanpa batas waktu. Jika terjadi kendala pemblokiran sinyal resmi dari operator akibat status IMEI, Gamen Store memberikan garansi penuh untuk pemulihan atau penggantian unit sesuai prosedur.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <h3 className="font-bold text-[#171717] text-sm">
                  Syarat & Prosedur Klaim Retur / Garansi:
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-[#737373]">
                  <li>
                    Wajib menyertakan <strong className="text-[#171717]">video unboxing</strong> paket tanpa jeda (no pause/cut) mulai dari paket masih terbungkus rapat hingga unit dihidupkan pertama kali.
                  </li>
                  <li>
                    Segel garansi toko yang menempel pada unit harus dalam kondisi utuh dan tidak rusak/dilepas.
                  </li>
                  <li>
                    iCloud / Apple ID dan Passcode layar telah dikeluarkan / di-logout secara tuntas sebelum unit dikirimkan kembali untuk inspeksi.
                  </li>
                  <li>
                    Menyertakan nomor pesanan resmi (<code className="text-[#171717]">ORD-...</code>) atau nomor IMEI unit.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20 text-[#DC2626] text-xs space-y-1">
                <span className="font-bold block">Hal-Hal yang Menggugurkan Garansi:</span>
                <p className="text-[#737373]">
                  Kerusakan akibat kelalaian pemakaian (human error) seperti: jatuh, layar pecah/retak, terkena cairan (water damage), terbakar, modifikasi software tidak resmi (jailbreak/bypass), atau perbaikan pihak ketiga tanpa persetujuan resmi Gamen Store.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                3. Ketentuan Pengiriman & Asuransi
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-[#737373]">
                <li>
                  Seluruh pengiriman wajib menggunakan proteksi asuransi pengiriman penuh dari pihak ekspedisi logistik terkait.
                </li>
                <li>
                  Paket dikemas standar pengiriman gadget bernilai tinggi menggunakan bubble wrap berlapis tebal dan packing kayu khusus.
                </li>
                <li>
                  Nomor resi pengiriman akan diberikan langsung melalui WhatsApp segera setelah paket diserahkan ke pihak ekspedisi.
                </li>
              </ul>
            </div>
          </div>

          {/* Need assistance */}
          <div className="mt-12 text-center p-8 bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] space-y-3">
            <h3 className="text-base font-bold text-[#171717]">Ada Pertanyaan Seputar Kebijakan Garansi?</h3>
            <p className="text-xs sm:text-sm text-[#737373] max-w-md mx-auto">
              Tim after-sales kami siap membantu menjawab pertanyaan Anda seputar tata cara klaim dan perlindungan garansi.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Halo Tim Garansi Gamen Store, saya ingin konsultasi mengenai klaim garansi.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" className="rounded-xl px-7 text-xs bg-[#171717] text-white hover:bg-black">
                  Hubungi Layanan Garansi via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
