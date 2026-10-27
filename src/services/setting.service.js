import prisma from "@/lib/prisma";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";

/**
 * Store settings service backed by PostgreSQL database (Prisma StoreSetting model).
 * Automatically initializes and caches the singleton setting record.
 */

const DEFAULT_SETTINGS = {
  storeName: "Gamen Store",
  storeDescription: "Toko iPhone terpercaya dengan garansi resmi dan pilihan terlengkap.",
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  email: "support@gamenstore.com",
  address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
  defaultShippingCost: 0,
  currency: "IDR",
  orderPrefix: "ORD",
  messageTemplate:
    "Halo Gamen Store, saya ingin melakukan pemesanan.\n\nOrder ID: {orderNumber}\nTotal: {total}\n\nMohon informasi proses selanjutnya.",
};

export async function getSettings() {
  try {
    let setting = await prisma.storeSetting.findUnique({
      where: { key: "default" },
    });

    if (!setting) {
      setting = await prisma.storeSetting.create({
        data: {
          key: "default",
          ...DEFAULT_SETTINGS,
          defaultShippingCost: Number(DEFAULT_SETTINGS.defaultShippingCost),
        },
      });
    }

    return {
      id: setting.id,
      storeName: setting.storeName,
      storeDescription: setting.storeDescription || "",
      whatsappNumber: setting.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
      email: setting.email || "",
      address: setting.address || "",
      defaultShippingCost: Number(setting.defaultShippingCost),
      currency: setting.currency || "IDR",
      orderPrefix: setting.orderPrefix || "ORD",
      messageTemplate: setting.messageTemplate || DEFAULT_SETTINGS.messageTemplate,
      updatedAt: setting.updatedAt,
    };
  } catch (error) {
    console.error("Error getting store settings from database:", error);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSettings(newSettings = {}) {
  try {
    const dataToUpdate = {
      ...(newSettings.storeName ? { storeName: newSettings.storeName.trim() } : {}),
      ...(newSettings.storeDescription !== undefined
        ? { storeDescription: newSettings.storeDescription?.trim() }
        : {}),
      ...(newSettings.whatsappNumber ? { whatsappNumber: newSettings.whatsappNumber.trim() } : {}),
      ...(newSettings.email !== undefined ? { email: newSettings.email?.trim() } : {}),
      ...(newSettings.address !== undefined ? { address: newSettings.address?.trim() } : {}),
      ...(newSettings.defaultShippingCost !== undefined
        ? { defaultShippingCost: Number(newSettings.defaultShippingCost) }
        : {}),
      ...(newSettings.currency ? { currency: newSettings.currency.trim() } : {}),
      ...(newSettings.orderPrefix ? { orderPrefix: newSettings.orderPrefix.trim() } : {}),
      ...(newSettings.messageTemplate !== undefined
        ? { messageTemplate: newSettings.messageTemplate }
        : {}),
    };

    const setting = await prisma.storeSetting.upsert({
      where: { key: "default" },
      create: {
        key: "default",
        ...DEFAULT_SETTINGS,
        ...dataToUpdate,
      },
      update: dataToUpdate,
    });

    return {
      id: setting.id,
      storeName: setting.storeName,
      storeDescription: setting.storeDescription || "",
      whatsappNumber: setting.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
      email: setting.email || "",
      address: setting.address || "",
      defaultShippingCost: Number(setting.defaultShippingCost),
      currency: setting.currency || "IDR",
      orderPrefix: setting.orderPrefix || "ORD",
      messageTemplate: setting.messageTemplate || DEFAULT_SETTINGS.messageTemplate,
      updatedAt: setting.updatedAt,
    };
  } catch (error) {
    console.error("Error updating store settings in database:", error);
    throw error;
  }
}
