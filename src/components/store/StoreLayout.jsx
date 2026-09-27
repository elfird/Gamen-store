import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * StoreLayout — Primary customer-facing layout shell.
 *
 * Provides the global customer layout:
 * - Top Value Bar + Sticky Navbar
 * - Main content area with min-height to push footer to bottom
 * - Standardized Footer with guarantee badges
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.cartCount=0]
 */
export default function StoreLayout({ children, cartCount = 0 }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] selection:bg-[#111111] selection:text-white">
      <Navbar cartCount={cartCount} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
