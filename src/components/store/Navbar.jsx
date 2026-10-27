"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import MobileNav from "./MobileNav";

/**
 * Navbar — Primary customer-facing navigation header.
 *
 * Implements "Clean Editorial Commerce" design matching reference:
 * - Pure white #FFFFFF background with crisp #E5E5E5 border
 * - Minimal typography logo "Gamen Store"
 * - Balanced navigation links: Home, iPhone, Accessories, Deals, About
 * - Integrated desktop search pill with search icon
 * - Profile/Account link & Cart counter with consistent touch targets
 * - Mobile responsive drawer
 *
 * @param {Object} props
 * @param {number} [props.cartCount]
 */
export default function Navbar({ cartCount: explicitCartCount }) {
  const { itemCount: contextCartCount } = useCart();
  const cartCount = explicitCartCount !== undefined ? explicitCartCount : contextCartCount;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Beli iPhone", href: "/products?category=iphone" },
    { label: "Jual iPhone", href: "/sell-iphone" },
    { label: "Accessories", href: "/products?category=accessories" },
    { label: "Deals", href: "/products?category=deals" },
    { label: "About", href: "/about" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 1. Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link
                href="/"
                className="font-bold text-lg sm:text-xl tracking-tight text-[#171717] hover:opacity-90 transition-opacity focus:outline-none"
                aria-label="Gamen Store Beranda"
              >
                Gamen Store
              </Link>
            </div>

            {/* 2. Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-8" aria-label="Navigasi Utama">
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.split("?")[0]) &&
                      (item.href.includes("?")
                        ? typeof window !== "undefined" && window.location.search.includes(item.href.split("?")[1])
                        : true);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={clsx(
                      "text-xs lg:text-sm font-medium transition-colors hover:text-[#171717]",
                      isActive ? "text-[#171717] font-semibold" : "text-[#737373]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right Area: Search Pill, Profile Icon, Cart Icon */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop Search Input Pill */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex items-center relative w-60 xl:w-68"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari iPhone, aksesori..."
                  className="w-full pl-3.5 pr-8 py-1.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-full text-xs text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#171717] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 text-[#737373] hover:text-[#171717] transition-colors p-0.5"
                  aria-label="Cari"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </form>

              {/* Mobile Search Icon */}
              <Link
                href="/products"
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F7F7F8] transition-colors focus:outline-none"
                aria-label="Pencarian produk"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </Link>

              {/* User Account / Admin Link */}
              <Link
                href="/admin"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F7F7F8] transition-colors focus:outline-none"
                aria-label="Akun / Admin Store"
                title="Admin Management"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#171717] hover:bg-[#F7F7F8] transition-colors focus:outline-none"
                aria-label={`Keranjang belanja, ${cartCount} item`}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#171717] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F7F7F8] transition-colors focus:outline-none"
                aria-label="Buka menu navigasi"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
        onOpenSearch={() => router.push("/products")}
      />
    </>
  );
}
