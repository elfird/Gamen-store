import Link from "next/link";
import PageContainer from "./PageContainer";

/**
 * Footer — Premium Apple-inspired customer-facing footer.
 *
 * Includes:
 * - 4-Column navigation & support links
 * - Brand trust badges (Garansi, IMEI, Safe Shipping)
 * - WhatsApp direct assistance CTA
 * - Legal, copyright, and payment method placeholders
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { label: "iPhone 16 Pro Max", href: "/iphone?model=16-pro-max" },
      { label: "iPhone 16 Pro", href: "/iphone?model=16-pro" },
      { label: "iPhone 16", href: "/iphone?model=16" },
      { label: "iPhone 15 Pro Max", href: "/iphone?model=15-pro-max" },
      { label: "iPhone 15 Pro", href: "/iphone?model=15-pro" },
      { label: "iPhone 15", href: "/iphone?model=15" },
    ],
    accessories: [
      { label: "Apple 20W USB-C Adapter", href: "/accessories?item=adapter-20w" },
      { label: "MagSafe Charger & Case", href: "/accessories?item=magsafe" },
      { label: "Semua Aksesoris", href: "/accessories" },
      { label: "Promo & Bundle Hemat", href: "/deals" },
    ],
    support: [
      { label: "Lacak Status Pesanan", href: "/track-order" },
      { label: "Cek IMEI & Status Garansi", href: "/warranty-check" },
      { label: "Panduan Pemesanan via WA", href: "/how-to-order" },
      { label: "Kebijakan Retur & Garansi", href: "/terms#warranty" },
      { label: "FAQ & Tanya Jawab", href: "/faq" },
    ],
    company: [
      { label: "Tentang Gamen Store", href: "/about" },
      { label: "Komitmen Kualitas 100%", href: "/about#commitment" },
      { label: "Lokasi & Jam Operasional", href: "/contact" },
      { label: "Kontak WhatsApp CS", href: "https://wa.me/6281234567890", external: true },
    ],
  };

  const trustBadges = [
    {
      title: "100% Produk Original",
      desc: "Unit Apple original bersegel dengan part asli.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "IMEI Terdaftar Kemenperin",
      desc: "Sinyal aman permanen, bebas blokir seumur hidup.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      ),
    },
    {
      title: "Pengiriman Berasuransi",
      desc: "Packing kayu & proteksi pengiriman kilat ke seluruh Indonesia.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "Order Cepat via WhatsApp",
      desc: "Checkout instan dan konsultasi langsung dengan tim profesional.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#F5F5F7] border-t border-[#D2D2D7]/60 text-[#1D1D1F]">
      {/* Trust Badges Strip */}
      <div className="bg-white border-b border-[#D2D2D7]/50 py-10 sm:py-12">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="p-3 rounded-2xl bg-[#F5F5F7] text-[#111111] shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                    {badge.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#6E6E73] leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 sm:py-16">
        <PageContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: iPhone Lineup */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B] mb-4">
                Lineup iPhone
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.products.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-[#424245] hover:text-[#111111] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Accessories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B] mb-4">
                Aksesoris & Promo
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.accessories.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-[#424245] hover:text-[#111111] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B] mb-4">
                Bantuan & Layanan
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.support.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-[#424245] hover:text-[#111111] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: About & Store Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868B] mb-4">
                Gamen Store
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((item, idx) => (
                  <li key={idx}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-[#424245] hover:text-[#111111] transition-colors inline-flex items-center space-x-1"
                      >
                        <span>{item.label}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-xs sm:text-sm text-[#424245] hover:text-[#111111] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-[#D2D2D7]/60">
                <div className="text-xs text-[#86868B] space-y-1">
                  <p className="font-semibold text-[#1D1D1F]">Jam Layanan:</p>
                  <p>Senin – Minggu: 09.00 – 21.00 WIB</p>
                  <p className="text-[11px] text-[#86868B]">Respon WhatsApp: &lt; 5 Menit</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#D2D2D7]/60 py-6 text-xs text-[#86868B]">
        <PageContainer>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p>
                © {currentYear} Gamen Store. Hak cipta dilindungi undang-undang.
              </p>
              <p className="text-[11px] text-[#A1A1A6]">
                Apple, iPhone, MagSafe, and Dynamic Island are trademarks of Apple Inc., registered in the U.S. and other countries.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6E6E73]">
              <Link href="/privacy" className="hover:text-[#111111] transition-colors">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#111111] transition-colors">
                Syarat & Ketentuan
              </Link>
              <span>•</span>
              <Link href="/legal" className="hover:text-[#111111] transition-colors">
                Legal
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
