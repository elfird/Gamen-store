/**
 * Store settings service.
 * Manages default store configuration with runtime cache and environment fallbacks.
 */

let settingsCache = {
  storeName: "Gamen Store",
  storeDescription: "Toko iPhone terpercaya dengan garansi resmi dan pilihan terlengkap.",
  whatsappNumber: process.env.WHATSAPP_NUMBER || "081234567890",
  email: "support@gamenstore.com",
  address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
  defaultShippingCost: 0,
  currency: "IDR",
  orderPrefix: "ORD",
  messageTemplate: "Halo Gamen Store, saya ingin melakukan pemesanan.\n\nOrder ID: {orderNumber}\nTotal: {total}\n\nMohon informasi proses selanjutnya.",
};

export async function getSettings() {
  return { ...settingsCache };
}

export async function updateSettings(newSettings) {
  settingsCache = {
    ...settingsCache,
    ...newSettings,
  };
  return { ...settingsCache };
}
