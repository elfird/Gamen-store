import Link from "next/link";
import PageContainer from "./PageContainer";
import { getWhatsAppUrl, STORE_WHATSAPP_NUMBER } from "@/lib/constants";

/**
 * Footer — Clean Editorial Commerce customer-facing footer.
 *
 * Implements reference design:
 * - Crisp white #FFFFFF background with #E5E5E5 top border
 * - Column 1: Brand name, tagline, social icons
 * - Column 2: Navigasi (Home, iPhone, Accessories, Deals, About)
 * - Column 3: Bantuan (Track Order, Warranty Check, How to Order, FAQ, Terms)
 * - Column 4: Kontak (WhatsApp number, Email, Address)
 * - Bottom Bar: Copyright notice & Privacy / Terms links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Format WhatsApp number for display: 6282297046402 -> 0822 9704 6402
  const formattedPhone = STORE_WHATSAPP_NUMBER.startsWith("62")
    ? `0${STORE_WHATSAPP_NUMBER.slice(2, 5)} ${STORE_WHATSAPP_NUMBER.slice(5, 9)} ${STORE_WHATSAPP_NUMBER.slice(9)}`
    : STORE_WHATSAPP_NUMBER;

  return (
    <footer className="w-full bg-white border-t border-[#E5E5E5] text-[#171717]">
      {/* 4-Column Footer Content */}
      <div className="py-12 sm:py-16">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand & Socials */}
            <div className="space-y-4">
              <Link href="/" className="font-bold text-xl tracking-tight text-[#171717] block">
                Gamen Store
              </Link>
              <p className="text-xs text-[#737373] max-w-xs leading-relaxed">
                Your trusted iPhone store. Original products, better experience.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-3 pt-2 text-[#737373]">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:text-[#171717] hover:border-[#171717] transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:text-[#171717] hover:border-[#171717] transition-colors"
                  aria-label="YouTube"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:text-[#171717] hover:border-[#171717] transition-colors"
                  aria-label="TikTok"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:text-[#171717] hover:border-[#171717] transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Navigasi */}
            <div>
              <h3 className="text-xs font-bold text-[#171717] mb-4">
                Navigasi
              </h3>
              <ul className="space-y-2.5 text-xs text-[#737373]">
                <li>
                  <Link href="/" className="hover:text-[#171717] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=iphone" className="hover:text-[#171717] transition-colors">
                    Beli iPhone
                  </Link>
                </li>
                <li>
                  <Link href="/sell-iphone" className="hover:text-[#171717] transition-colors">
                    Jual iPhone
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=accessories" className="hover:text-[#171717] transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=deals" className="hover:text-[#171717] transition-colors">
                    Deals
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#171717] transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Bantuan */}
            <div>
              <h3 className="text-xs font-bold text-[#171717] mb-4">
                Bantuan
              </h3>
              <ul className="space-y-2.5 text-xs text-[#737373]">
                <li>
                  <Link href="/track-order" className="hover:text-[#171717] transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/warranty-check" className="hover:text-[#171717] transition-colors">
                    Warranty Check
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-order" className="hover:text-[#171717] transition-colors">
                    How to Order
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#171717] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#171717] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Kontak */}
            <div>
              <h3 className="text-xs font-bold text-[#171717] mb-4">
                Kontak
              </h3>
              <ul className="space-y-3 text-xs text-[#737373]">
                <li className="flex items-center space-x-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#171717]">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a
                    href={getWhatsAppUrl("Halo Admin Gamen Store, saya ingin tanya info produk")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#171717] transition-colors font-medium text-[#171717]"
                  >
                    {formattedPhone}
                  </a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#171717]">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href="mailto:cs@gamenstore.id" className="hover:text-[#171717] transition-colors">
                    cs@gamenstore.id
                  </a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#171717]">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Tangerang, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#E5E5E5] py-6 text-xs text-[#737373]">
        <PageContainer>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-[#737373]">
              © {currentYear} Gamen Store. All rights reserved.
            </p>

            <div className="flex items-center space-x-4 text-xs text-[#737373]">
              <Link href="/privacy" className="hover:text-[#171717] transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#171717] transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
