"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import MobileNav from "./MobileNav";

/**
 * Navbar — Primary customer-facing navigation header.
 *
 * Implements Apple-inspired clean aesthetics:
 * - Glassmorphic backdrop blur
 * - Micro-interactions on links
 * - Integrated interactive search drawer
 * - Real-time cart badge
 * - Mobile responsive drawer
 *
 * @param {Object} props
 * @param {number} [props.cartCount=0]
 */
export default function Navbar({ cartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Scroll detection for enhanced glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "iPhone", href: "/iphone" },
    { label: "Accessories", href: "/accessories" },
    { label: "Deals", href: "/deals", badge: "Promo" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Value Proposition Bar */}
      <div className="bg-[#111111] text-[#A1A1A6] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-tight border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span>
            100% Original & Garansi Resmi • IMEI Terdaftar Kemenperin • Pengiriman Aman se-Indonesia
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={clsx(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-[#D2D2D7]/70"
            : "bg-white/80 backdrop-blur-sm border-b border-[#D2D2D7]/40"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 group focus:outline-none"
              aria-label="Gamen Store Beranda"
            >
              <div className="w-8 h-8 rounded-xl bg-[#111111] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
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
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base sm:text-lg tracking-tight text-[#1D1D1F] leading-none">
                  Gamen Store
                </span>
                <span className="text-[10px] text-[#86868B] tracking-wider uppercase font-medium">
                  iPhone Specialist
                </span>
              </div>
            </Link>

            {/* Desktop Horizontal Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Navigasi Utama">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center space-x-1.5",
                      isActive
                        ? "text-[#111111] bg-[#F5F5F7]"
                        : "text-[#1D1D1F]/80 hover:text-[#111111] hover:bg-[#F5F5F7]/70"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#D97706]/10 text-[#D97706]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search & Cart & Mobile Hamburger */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={clsx(
                  "p-2 rounded-full transition-colors focus:outline-none",
                  isSearchOpen
                    ? "bg-[#F5F5F7] text-[#111111]"
                    : "text-[#1D1D1F]/80 hover:text-[#111111] hover:bg-[#F5F5F7]"
                )}
                aria-label="Pencarian produk"
                aria-expanded={isSearchOpen}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full text-[#1D1D1F]/80 hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors focus:outline-none"
                aria-label={`Keranjang belanja, ${cartCount} item`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 ? (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#111111] text-white text-[10px] font-bold rounded-full flex items-center justify-center transform scale-100 transition-transform">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6E6E73] rounded-full opacity-60" />
                )}
              </Link>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-full text-[#1D1D1F]/80 hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors focus:outline-none"
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

        {/* Expandable Search Drawer / Bar */}
        {isSearchOpen && (
          <div className="border-t border-[#D2D2D7]/60 bg-[#F5F5F7]/95 backdrop-blur-md px-4 py-3 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <svg
                  className="absolute left-3.5 text-[#86868B]"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari iPhone 16 Pro Max, 256GB, warna, aksesoris..."
                  autoFocus
                  className="w-full pl-10 pr-20 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 bg-[#111111] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
