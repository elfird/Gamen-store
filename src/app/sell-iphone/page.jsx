"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

export default function SellIPhonePage() {
  const [formData, setFormData] = useState({
    model: "iPhone 15 Pro",
    storage: "128GB",
    color: "",
    batteryHealth: "",
    physicalCondition: "Mulus 99% (Like New, Tanpa Baret)",
    functionalCondition: "Normal 100% (Face ID & TrueTone Aktif)",
    accessories: "Fullset Original (Box & Kabel)",
    notes: "",
  });

  const IPHONE_MODELS = [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone SE (Gen 3 / Gen 2)",
    "Model iPhone Lainnya",
  ];

  const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];

  const PHYSICAL_CONDITIONS = [
    "Mulus 99% (Like New, Tanpa Baret)",
    "Mulus 95% - 98% (Baret Halus Pemakaian Wajar)",
    "Ada Dent / Lecet Casing",
    "Layar Retak / Pecah Fisik",
  ];

  const FUNCTIONAL_CONDITIONS = [
    "Normal 100% (Face ID & TrueTone Aktif)",
    "Normal (Face ID Off / TrueTone Off)",
    "Ada Minus Fungsi Tertentu",
  ];

  const ACCESSORIES_OPTIONS = [
    "Fullset Original (Box, Kabel Charger, Buku)",
    "Fullset Box OEM",
    "Unit Batangan (Hanya iPhone saja)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate standardized WhatsApp Sell iPhone message
  const generateSellWhatsAppUrl = () => {
    const lines = ["Halo Gamen Store, saya ingin menjual iPhone saya.\n"];

    if (formData.model) lines.push(`Model: ${formData.model}`);
    if (formData.storage) lines.push(`Storage: ${formData.storage}`);
    if (formData.color.trim()) lines.push(`Warna: ${formData.color.trim()}`);
    if (formData.batteryHealth.trim()) lines.push(`Battery health: ${formData.batteryHealth.trim()}`);
    if (formData.physicalCondition) lines.push(`Kondisi fisik: ${formData.physicalCondition}`);
    if (formData.functionalCondition) lines.push(`Kondisi fungsi: ${formData.functionalCondition}`);
    if (formData.accessories) lines.push(`Kelengkapan: ${formData.accessories}`);
    if (formData.notes.trim()) lines.push(`Catatan: ${formData.notes.trim()}`);

    lines.push("\nMohon informasi penilaian dan penawaran harga. Terima kasih.");

    return getWhatsAppUrl(lines.join("\n"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = generateSellWhatsAppUrl();
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return (
    <StoreLayout>
      <div className="py-8 sm:py-14 bg-white min-h-screen">
        <PageContainer size="narrow">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-6">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Jual iPhone</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-10 max-w-xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] text-[11px] font-semibold uppercase tracking-wider">
              Layanan Tukar Tambah & Penjualan Unit
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Jual iPhone Lamamu dengan Harga Terbaik.
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Isi spesifikasi iPhone yang ingin kamu jual di bawah ini. Tim kami akan melakukan estimasi penilaian dan melanjutkan penawaran harga langsung via WhatsApp.
            </p>
          </div>

          {/* Sell Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-10 space-y-6"
          >
            {/* 1. Model iPhone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Model iPhone <span className="text-[#DC2626]">*</span>
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-all"
              >
                {IPHONE_MODELS.map((mdl) => (
                  <option key={mdl} value={mdl}>
                    {mdl}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Storage & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Kapasitas Storage <span className="text-[#DC2626]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {STORAGE_OPTIONS.map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, storage: stg }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.storage === stg
                          ? "bg-[#171717] text-white border-[#171717]"
                          : "bg-white text-[#171717] border-[#E5E5E5] hover:border-[#171717]"
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Warna Perangkat (Opsional)
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Contoh: Natural Titanium, Midnight, Blue..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#171717] transition-all"
                />
              </div>
            </div>

            {/* 3. Battery Health */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Kesehatan Baterai (Battery Health %)
              </label>
              <input
                type="text"
                name="batteryHealth"
                value={formData.batteryHealth}
                onChange={handleChange}
                placeholder="Contoh: 88% atau 95% (Cek di Pengaturan > Baterai)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#171717] transition-all"
              />
              <p className="text-[11px] text-[#737373]">
                Kosongkan jika baterai tidak diketahui atau dalam kondisi mati/perlu servis.
              </p>
            </div>

            {/* 4. Physical Condition */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Kondisi Fisik Casing & Layar <span className="text-[#DC2626]">*</span>
              </label>
              <div className="space-y-2">
                {PHYSICAL_CONDITIONS.map((cond) => (
                  <label
                    key={cond}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.physicalCondition === cond
                        ? "bg-white border-[#171717] shadow-2xs"
                        : "bg-white/60 border-[#E5E5E5] hover:border-[#737373]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="physicalCondition"
                      value={cond}
                      checked={formData.physicalCondition === cond}
                      onChange={handleChange}
                      className="accent-[#171717]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#171717]">
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Functional Condition */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Kondisi Fungsi (Face ID, Kamera, TrueTone, Sinyal) <span className="text-[#DC2626]">*</span>
              </label>
              <div className="space-y-2">
                {FUNCTIONAL_CONDITIONS.map((fcond) => (
                  <label
                    key={fcond}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.functionalCondition === fcond
                        ? "bg-white border-[#171717] shadow-2xs"
                        : "bg-white/60 border-[#E5E5E5] hover:border-[#737373]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="functionalCondition"
                      value={fcond}
                      checked={formData.functionalCondition === fcond}
                      onChange={handleChange}
                      className="accent-[#171717]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#171717]">
                      {fcond}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Accessories */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Kelengkapan Perangkat <span className="text-[#DC2626]">*</span>
              </label>
              <select
                name="accessories"
                value={formData.accessories}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-all"
              >
                {ACCESSORIES_OPTIONS.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Additional Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Contoh: Ex garansi resmi iBox, garansi masih 2 bulan, belum pernah bongkar/servis sama sekali..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#171717] transition-all resize-none"
              />
            </div>

            {/* Photo Note */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#737373] space-y-1">
              <span className="font-bold text-[#171717] block">Foto Fisik Perangkat:</span>
              <p>
                Foto fisik iPhone (tampak depan, belakang, sudut casing, dan info battery health) dapat langsung Anda lampirkan saat chat WhatsApp terbuka untuk mempercepat estimasi harga akurat.
              </p>
            </div>

            {/* Notice before submit */}
            <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs space-y-1">
              <span className="font-bold block text-[#171717]">Transparansi Penilaian:</span>
              <p className="text-[#737373]">
                Seluruh penilaian kondisi fisik dan negosiasi penawaran harga final dilakukan secara transparan bersama admin kami di WhatsApp tanpa biaya pendaftaran.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full rounded-xl py-3.5 bg-[#16A34A] text-white hover:bg-[#15803D] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Ajukan Penjualan via WhatsApp</span>
            </Button>
          </form>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
