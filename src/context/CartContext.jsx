"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";

const CART_STORAGE_KEY = "gamen_store_cart_v1";
const FREE_SHIPPING_THRESHOLD = 10_000_000; // Rp 10.000.000
const STANDARD_SHIPPING_COST = 50_000; // Rp 50.000

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  // 1. Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist cart to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
      }
    }
  }, [items, isHydrated]);

  /**
   * Add a product variant to cart.
   * @param {Object} params
   * @param {Object} params.product
   * @param {Object} params.variant
   * @param {number} [params.quantity=1]
   */
  const addItem = ({ product, variant, quantity = 1 }) => {
    if (!product || !variant) return;

    const maxStock = variant.availableStock ?? variant.stock ?? 10;
    if (maxStock <= 0) {
      toast({
        title: "Stok Habis",
        description: `Varian ${variant.storage} - ${variant.color} sedang tidak tersedia.`,
        variant: "danger",
      });
      return;
    }

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.variantId === variant.id);

      if (existingIdx > -1) {
        const existing = prev[existingIdx];
        const newQty = Math.min(existing.quantity + quantity, maxStock);

        if (existing.quantity >= maxStock) {
          toast({
            title: "Batas Stok Tercapai",
            description: `Maksimal pembelian untuk varian ini adalah ${maxStock} unit.`,
            variant: "warning",
          });
          return prev;
        }

        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          price: Number(variant.price),
          availableStock: maxStock,
        };

        toast({
          title: "Keranjang Diperbarui",
          description: `Jumlah ${product.name} diperbarui menjadi ${newQty} unit.`,
          variant: "success",
        });

        return updated;
      }

      // Add new item
      const newItem = {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        storage: variant.storage,
        color: variant.color,
        sku: variant.sku,
        price: Number(variant.price),
        image:
          product.primaryImage ||
          product.images?.[0]?.url ||
          null,
        availableStock: maxStock,
        quantity: Math.min(quantity, maxStock),
        condition: product.condition || "NEW",
        warranty: product.warranty || "1 Tahun Garansi Resmi",
      };

      toast({
        title: "Berhasil Ditambahkan",
        description: `${product.name} (${variant.storage} - ${variant.color}) masuk ke keranjang.`,
        variant: "success",
      });

      return [...prev, newItem];
    });
  };

  /**
   * Update item quantity in cart.
   * @param {string} variantId
   * @param {number} newQuantity
   */
  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const maxStock = item.availableStock || 99;
          const clamped = Math.min(newQuantity, maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  /**
   * Remove item from cart.
   * @param {string} variantId
   */
  const removeItem = (variantId) => {
    setItems((prev) => {
      const removed = prev.find((item) => item.variantId === variantId);
      if (removed) {
        toast({
          title: "Item Dihapus",
          description: `${removed.name} telah dihapus dari keranjang.`,
          variant: "info",
        });
      }
      return prev.filter((item) => item.variantId !== variantId);
    });
  };

  /**
   * Clear entire cart.
   */
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Keranjang Dikosongkan",
      description: "Semua item telah dihapus dari keranjang belanja Anda.",
      variant: "info",
    });
  };

  // Computations
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;
  const estimatedShipping = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + estimatedShipping;

  const value = {
    items,
    itemCount,
    subtotal,
    estimatedShipping,
    isFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    total,
    isHydrated,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
