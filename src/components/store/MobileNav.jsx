"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/**
 * MobileNav — Compact slide-over navigation drawer for mobile devices.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {number} [props.cartCount=0]
 * @param {() => void} [props.onOpenSearch]
 */
export default function MobileNav({
  isOpen,
  onClose,
  cartCount = 0,
  onOpenSearch,
}) {
  const pathname = usePathname();

  // Close when pathname changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = [
    { label: "iPhone", href: "/iphone", description: "iPhone 16, 15 Pro, & lineup lengkap" },
    { label: "Accessories", href: "/accessories", description: "Original 20W adapter & MagSafe" },
    { label: "Deals & Promo", href: "/deals", description: "Harga spesial & promo cashback", badge: "Hemat" },
    { label: "Lacak Pesanan", href: "/track-order", description: "Cek status pengiriman via No. Order" },
    { label: "Tentang Kami", href: "/about", description: "Garansi resmi & komitmen kualitas" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#F5F5F7] shadow-2xl flex flex-col z-10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#D2D2D7]/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-[#1D1D1F]">
              Gamen Store
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
            aria-label="Tutup menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quick Search Action */}
        <div className="p-4 bg-white border-b border-[#D2D2D7]/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] text-[#6E6E73] text-sm hover:bg-[#EAEAEA] transition-colors text-left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="flex-1 text-[#6E6E73]">Cari model iPhone, varian...</span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "block px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-white text-[#111111] shadow-xs font-semibold"
                    : "text-[#1D1D1F] hover:bg-white/80"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A]">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-[#6E6E73] mt-0.5">{item.description}</p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#D2D2D7]/60 space-y-2.5">
          <Link
            href="/cart"
            onClick={onClose}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#111111] text-white font-medium text-sm hover:bg-black transition-colors"
          >
            <span className="flex items-center space-x-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Keranjang Belanja</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
              {cartCount} item
            </span>
          </Link>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Gamen%20Store,%20saya%20ingin%20tanya%20stok%20iPhone"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#16A34A]/10 text-[#16A34A] font-medium text-sm hover:bg-[#16A34A]/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Hubungi WhatsApp Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
