import { Link, useLocation } from "react-router-dom";
import MegaNav from "./megamenu/MegaNav.jsx";
import HeaderSearch, { MobileSearch } from "./HeaderSearch.jsx";
import { ROUTES } from "../../config/navRoutes.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";

// Header ported 1:1 from the reference design (code.html). Wired to the app:
// live cart/wishlist counts + total, route links, account link, search.
export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { pathname, hash } = useLocation();

  const cartTotal =
    "₹" + Number(subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const accountTo = isAdmin ? "/admin/dashboard" : isAuthenticated ? "/account" : "/login";

  // Reference shows "Premium Fans" active on the home page; other items follow the current route/section.
  function isActive(key) {
    const [path, anchor] = ROUTES[key].split("#");
    if (anchor) return pathname === "/" && (hash === "#" + anchor || (!hash && key === "premium-fans"));
    return pathname === path || pathname.startsWith(path + "/");
  }

  return (
      <header className="fixed top-0 left-0 w-full z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div className="bg-primary-container text-on-primary px-3 py-1.5 sm:px-gutter sm:py-space-xs">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-2 text-[11px] sm:gap-3 sm:text-body-sm sm:font-body-sm">
            {/* Left: contact info */}
            <div className="flex min-w-0 items-center gap-x-3 sm:gap-x-space-lg">
              <a href="tel:+919957171355" className="flex shrink-0 items-center gap-1 whitespace-nowrap sm:gap-space-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary-container sm:text-[16px]">
                  call
                </span>
                +91 99571 71355
              </a>

              <a
                href="mailto:anuragtraders2013@gmail.com"
                className="hidden min-w-0 items-center gap-space-xs sm:flex"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  mail
                </span>
                <span className="truncate">anuragtraders2013@gmail.com</span>
              </a>

              <span className="hidden items-center gap-space-xs md:flex">
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  location_on
                </span>
                Guwahati, Assam
              </span>
            </div>

            {/* Right: bulk order + badge */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-space-md">
              <Link
                to={ROUTES["bulk-orders"]}
                className="whitespace-nowrap text-on-primary transition-colors hover:text-secondary-fixed"
              >
                Bulk Order
              </Link>
              <span className="text-outline-variant">|</span>
              <span className="whitespace-nowrap rounded bg-secondary/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-on-primary sm:px-2 sm:text-label-sm sm:font-label-sm">
                <span className="sm:hidden">Crompton Dealer</span>
                <span className="hidden sm:inline">Authorized Crompton Dealer</span>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest py-space-sm px-gutter">
          <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md flex-shrink-0">
              <Link to="/">
              <img alt="Image" className="h-8 w-auto object-contain" src="https://anuragtraders.com/wp-content/uploads/AGT-Blue-Logo-2.webp" />
          </Link>
            </div>
            <HeaderSearch />
            <div className="flex items-center gap-space-md">
              <MobileSearch />
              <Link to={ROUTES["contact-us"]} className="hidden sm:flex items-center gap-1.5 text-text-secondary hover:text-secondary transition-colors font-label-md text-label-md">
                <span className="material-symbols-outlined text-[20px]">
                  support_agent
                </span>
                <span className="">
                  Support
                </span>
              </Link>
              <Link to={ROUTES["wishlist"]} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-secondary transition-colors relative">
                <span className="material-symbols-outlined text-[22px]">
                  favorite
                </span>
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-energy-amber text-on-primary font-label-sm text-label-sm flex items-center justify-center">
                  {wishlistCount}
                </span>
              </Link>
              <Link to={ROUTES["cart"]} className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-full text-on-surface transition-colors">
                <div className="relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    shopping_bag
                  </span>
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-discount-emerald text-on-primary font-label-sm text-label-sm flex items-center justify-center">
                    {itemCount}
                  </span>
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                 
                  <span className="font-label-md text-label-md text-primary font-bold">
                    {cartTotal}
                  </span>
                </div>
              </Link>
              <Link to={accountTo} aria-label={isAdmin ? "Admin dashboard" : isAuthenticated ? "My account" : "Log in"} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </Link>
            </div>
          </div>
        </div>
        <MegaNav isActive={isActive} />
      </header>
  );
}
