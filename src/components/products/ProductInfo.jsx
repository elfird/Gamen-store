"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Badge, Button } from "@/components/ui";

/**
 * ProductInfo — Interactive product details & variant selector.
 *
 * Implements real-time variant matching, price updates, stock updates, SKU updates,
 * and pre-filled WhatsApp checkout redirection.
 *
 * SENSITIVE DATA SECURITY:
 * Internal database IMEI values are never exposed or passed to the client.
 *
 * @param {Object} props
 * @param {Object} props.product - Formatted product object from product.service
 */
export default function ProductInfo({ product }) {
  const { toast } = useToast();

  const {
    name,
    model,
    description,
    warranty,
    condition = "NEW",
    category,
    variants = [],
    batteryHealthDisplay,
    specifications = [],
  } = product;

  // Extract unique storage and color options from active variants
  const storageOptions = useMemo(() => {
    return [...new Set(variants.map((v) => v.storage))];
  }, [variants]);

  const colorOptions = useMemo(() => {
    return [...new Set(variants.map((v) => v.color))];
  }, [variants]);

  // Initial state selection
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0] || "");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0] || "");
  const [quantity, setQuantity] = useState(1);

  // Find the exact matching variant based on selected storage and color
  const currentVariant = useMemo(() => {
    const match = variants.find(
      (v) => v.storage === selectedStorage && v.color === selectedColor
    );
    // If not found in this combination, fallback to first variant with selected storage or first variant overall
    return (
      match ||
      variants.find((v) => v.storage === selectedStorage) ||
      variants[0] ||
      null
    );
  }, [variants, selectedStorage, selectedColor]);

  // When storage changes, pick a valid color for that storage if possible
  const handleStorageChange = (storage) => {
    setSelectedStorage(storage);
    const availableForStorage = variants
      .filter((v) => v.storage === storage)
      .map((v) => v.color);

    if (!availableForStorage.includes(selectedColor) && availableForStorage.length > 0) {
      setSelectedColor(availableForStorage[0]);
    }
  };

  const isAvailable = (currentVariant?.availableStock || 0) > 0;
  const currentPrice = currentVariant ? currentVariant.price : 0;
  const currentSku = currentVariant ? currentVariant.sku : "-";
  const stockCount = currentVariant?.availableStock || 0;

  // Helper for color swatches
  const getColorHex = (colorName = "") => {
    const lower = colorName.toLowerCase();
    if (lower.includes("desert")) return "#C5A880";
    if (lower.includes("natural")) return "#9F9A8F";
    if (lower.includes("black") || lower.includes("dark")) return "#2D2D2D";
    if (lower.includes("white") || lower.includes("silver")) return "#E8E8ED";
    if (lower.includes("blue") || lower.includes("ultramarine")) return "#3B82F6";
    if (lower.includes("pink")) return "#F472B6";
    if (lower.includes("yellow")) return "#FACC15";
    if (lower.includes("green")) return "#4ADE80";
    return "#8E8E93";
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!currentVariant || !isAvailable) {
      toast({
        title: "Stok Tidak Tersedia",
        description: "Maaf, varian yang Anda pilih sedang habis.",
        variant: "danger",
      });
      return;
    }

    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${name} (${currentVariant.storage} - ${currentVariant.color}) berhasil dimasukkan ke keranjang.`,
      variant: "success",
    });
  };

  // WhatsApp Pre-filled URL Generator
  const generateWhatsAppUrl = () => {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    const text = `Halo Admin Gamen Store, saya ingin memesan:\n\n` +
      `📱 *Produk:* ${name}\n` +
      `💾 *Kapasitas:* ${currentVariant?.storage || selectedStorage}\n` +
      `🎨 *Warna:* ${currentVariant?.color || selectedColor}\n` +
      `🔖 *SKU:* ${currentSku}\n` +
      `💰 *Harga:* ${formatCurrency(currentPrice)}\n` +
      `📦 *Jumlah:* ${quantity} unit\n` +
      `🛡️ *Kondisi:* ${condition === "NEW" ? "Baru (Segel Resmi)" : "Like New (Original)"}\n\n` +
      `Mohon info ketersediaan unit dan rekening pembayaran. Terima kasih!`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ─── Header & Title ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-[#86868B]">
          <span className="uppercase font-semibold tracking-wider">
            {category?.name || "Apple iPhone"}
          </span>
          <span>•</span>
          <span>Model {model}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
          {name}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed pt-1">
            {description}
          </p>
        )}
      </div>

      {/* ─── Price & SKU Display ────────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-wider text-[#86868B] block">
            Harga Spesial
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            {formatCurrency(currentPrice)}
          </p>
          <span className="text-[11px] text-[#6E6E73]">
            Harga resmi termasuk garansi & PPN
          </span>
        </div>

        <div className="sm:text-right space-y-1">
          <div className="flex items-center sm:justify-end space-x-1.5">
            <span className="text-xs text-[#6E6E73]">Status:</span>
            {isAvailable ? (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A]">
                Tersedia ({stockCount} unit)
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626]">
                Stok Habis
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-[#86868B]">
            SKU: {currentSku}
          </p>
        </div>
      </div>

      {/* ─── Used Device Guarantee Block (If Condition !== "NEW") ───────────── */}
      {condition !== "NEW" && (
        <div className="p-4 rounded-2xl bg-[#D97706]/5 border border-[#D97706]/20 space-y-3">
          <div className="flex items-center space-x-2 text-[#D97706]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">
              Spesifikasi Unit Fisik (QC Passed)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-[#D2D2D7]/40">
              <span className="text-[#86868B] block text-[10px]">Battery Health</span>
              <span className="font-bold text-[#1D1D1F]">{batteryHealthDisplay}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#D2D2D7]/40">
              <span className="text-[#86868B] block text-[10px]">Kondisi Fisik</span>
              <span className="font-bold text-[#1D1D1F]">Mulus 98-99%</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#D2D2D7]/40">
              <span className="text-[#86868B] block text-[10px]">Garansi Sinyal</span>
              <span className="font-bold text-[#16A34A]">Permanen Bebas Blokir</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#D2D2D7]/40">
              <span className="text-[#86868B] block text-[10px]">Kelengkapan</span>
              <span className="font-bold text-[#1D1D1F]">Fullset Box & Kabel</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Storage Selection ──────────────────────────────────────────────── */}
      {storageOptions.length > 0 && storageOptions[0] !== "Standard" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Pilih Kapasitas Penyimpanan
            </span>
            <span className="text-[#6E6E73] font-medium">{selectedStorage}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {storageOptions.map((st) => {
              const isSelected = selectedStorage === st;
              const variantForStorage = variants.find((v) => v.storage === st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStorageChange(st)}
                  className={clsx(
                    "p-3 rounded-2xl border text-center transition-all focus:outline-none",
                    isSelected
                      ? "border-[#111111] bg-white ring-2 ring-[#111111]/10 shadow-xs"
                      : "border-[#D2D2D7] bg-white hover:border-[#86868B]"
                  )}
                >
                  <span className="block text-sm font-bold text-[#1D1D1F]">{st}</span>
                  {variantForStorage && (
                    <span className="block text-[11px] text-[#6E6E73] mt-0.5">
                      {formatCurrency(variantForStorage.price, { compact: true })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Color Selection ────────────────────────────────────────────────── */}
      {colorOptions.length > 0 && colorOptions[0] !== "Standard" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Pilih Warna
            </span>
            <span className="text-[#6E6E73] font-medium">{selectedColor}</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colorOptions.map((clr) => {
              const isSelected = selectedColor === clr;
              return (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setSelectedColor(clr)}
                  className={clsx(
                    "inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all focus:outline-none bg-white",
                    isSelected
                      ? "border-[#111111] ring-2 ring-[#111111]/10 shadow-xs font-bold text-[#111111]"
                      : "border-[#D2D2D7] text-[#424245] hover:border-[#86868B]"
                  )}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#D2D2D7] inline-block shrink-0"
                    style={{ backgroundColor: getColorHex(clr) }}
                  />
                  <span>{clr}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Quantity & Order Actions ────────────────────────────────────────── */}
      <div className="pt-4 space-y-3.5">
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-[#D2D2D7] rounded-xl bg-white p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 transition-colors"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-bold text-[#1D1D1F]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(stockCount || 1, quantity + 1))}
              disabled={quantity >= stockCount}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 transition-colors"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>

          <div className="flex-1">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "w-full inline-flex items-center justify-center space-x-2 h-11 px-5 rounded-xl font-bold text-sm text-white shadow-md transition-all",
                isAvailable
                  ? "bg-[#16A34A] hover:bg-[#15803D] hover:scale-[1.01]"
                  : "bg-[#6E6E73] pointer-events-none opacity-50"
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="rounded-xl border border-[#D2D2D7] font-semibold text-sm bg-white hover:bg-[#F5F5F7]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Tambah ke Keranjang
        </Button>
      </div>

      {/* ─── Trust Pillars Checklist ────────────────────────────────────────── */}
      <div className="pt-4 border-t border-[#D2D2D7]/50 space-y-2.5 text-xs text-[#424245]">
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span><strong>{warranty || "1 Tahun Garansi Resmi"}</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>IMEI Resmi Terdaftar Permanen (Bebas Blokir Sinyal Seumur Hidup)</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Pengiriman Cepat Berasuransi Penuh & Safety Packing</span>
        </div>
      </div>
    </div>
  );
}
