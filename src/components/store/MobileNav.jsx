"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { getWhatsAppUrl } from "@/lib/constants";

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
    { label: "Home", href: "/" },
    { label: "Beli iPhone", href: "/products?category=iphone" },
    { label: "Jual iPhone", href: "/sell-iphone" },
    { label: "Accessories", href: "/products?category=accessories" },
    { label: "Deals", href: "/products?category=deals" },
    { label: "About", href: "/about" },
    { label: "Lacak Pesanan", href: "/track-order" },
    { label: "Admin Store", href: "/admin" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col z-10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
          <span className="font-bold text-lg tracking-tight text-[#171717]">
            Gamen Store
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1 rounded-full text-[#737373] hover:text-[#171717] transition-colors"
            aria-label="Tutup menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quick Search Action */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#737373] text-xs hover:border-[#171717] transition-colors text-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="flex-1 text-[#737373]">Cari iPhone atau aksesori...</span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "block px-3.5 py-3 rounded-xl transition-all text-sm font-medium",
                  isActive
                    ? "bg-[#F7F7F8] text-[#171717] font-semibold"
                    : "text-[#737373] hover:text-[#171717] hover:bg-[#F7F7F8]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E5E5] space-y-2.5">
          <Link
            href="/cart"
            onClick={onClose}
            className="w-full flex items-center justify-between px-4 py-3 rounded-full bg-[#171717] text-white font-medium text-xs hover:bg-black transition-colors"
          >
            <span className="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Keranjang Belanja</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              {cartCount} item
            </span>
          </Link>

          <a
            href={getWhatsAppUrl("Halo Admin Gamen Store, saya ingin tanya stok iPhone")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full border border-[#E5E5E5] text-[#171717] font-medium text-xs hover:bg-[#F7F7F8] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#16A34A]">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp CS</span>
          </a>
        </div>
      </div>
    </div>
  );
}
