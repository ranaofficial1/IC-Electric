import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../config/navRoutes.js";
import { MENU_ITEMS } from "./menuItems.js";
import { prefetchMenuProducts } from "../../../hooks/useMenuData.js";
import MobileMenu from "./MobileMenu.jsx";

const ACTIVE = "py-1.5 px-3 transition-colors bg-primary-container text-on-primary-container font-bold rounded-lg";
const IDLE =
  "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high py-1.5 px-3 rounded-lg text-label-md font-label-md transition-colors";

const OPEN_DELAY = 90; // ms of intent before a panel opens (avoids flicker when the cursor just passes)
const CLOSE_DELAY = 160; // ms of grace so diagonal moves into the panel don't close it

const canHover = () => typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

/**
 * The navbar row (same links/active styling as before) + the hover mega menus.
 * Desktop: hover or keyboard-focus a heading to open its panel; Esc closes.
 * Below `lg`: the pill row stays as a scrollable strip and a Menu button opens
 * an accordion (MobileMenu) — touch devices have no hover.
 */
export default function MegaNav({ isActive }) {
  const [openKey, setOpenKey] = useState(null);
  const [shownKey, setShownKey] = useState(null); // kept after close so the panel can fade out with its content
  const [mobileOpen, setMobileOpen] = useState(false);
  const timer = useRef(null);
  const { pathname, hash } = useLocation();

  const clear = () => clearTimeout(timer.current);
  const show = useCallback((item, delay = OPEN_DELAY) => {
    clearTimeout(timer.current);
    if (item.prefetch !== undefined) prefetchMenuProducts(item.prefetch);
    timer.current = setTimeout(() => {
      setShownKey(item.key);
      setOpenKey(item.key);
    }, delay);
  }, []);
  const hide = useCallback((delay = CLOSE_DELAY) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenKey(null), delay);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    clearTimeout(timer.current);
    setOpenKey(null);
    setMobileOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenKey(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, []);

  const current = MENU_ITEMS.find((i) => i.key === shownKey);
  const open = openKey !== null;

  return (
    <div
      className="relative bg-surface-card px-gutter shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
      onMouseLeave={() => canHover() && hide()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hide(0);
      }}
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between overflow-x-auto lg:overflow-visible no-scrollbar">
        <nav className="flex items-center gap-space-md py-2 whitespace-nowrap" aria-label="Primary">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-mega-menu"
            className="lg:hidden flex items-center gap-1 rounded-lg bg-primary-container py-1.5 pl-2 pr-3 font-label-md text-label-md font-bold text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">{mobileOpen ? "close" : "menu"}</span>
            Menu
          </button>
          {MENU_ITEMS.map((item) => {
            const active = isActive(item.routeKey);
            const isOpen = openKey === item.key;
            return (
              // <Link
              //   key={item.key}
              //   to={ROUTES[item.routeKey]}
              //   aria-current={active ? "page" : undefined}
              //   aria-haspopup="true"
              //   aria-expanded={isOpen}
              //   aria-controls="mega-panel"
              //   onMouseEnter={() => canHover() && show(item, open ? 40 : OPEN_DELAY)}
              //   onFocus={() => show(item, 0)}
              //   className={`${active ? ACTIVE : IDLE} ${isOpen && !active ? "!bg-surface-container-high !text-on-surface" : ""}`}
              // >
              //   {item.label}
              // </Link>

            <div
              key={item.key}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls="mega-panel"
              onMouseEnter={() => canHover() && show(item, open ? 40 : OPEN_DELAY)}
              onFocus={() => show(item, 0)}
              className={`${IDLE} cursor-pointer ${
                isOpen ? "!bg-surface-container-high !text-on-surface" : ""
              }`}
              tabIndex={0}
            >
              {item.label}
            </div>

            );
          })}
        </nav>
      </div>

      {/* Desktop mega panel: one shared container, content swaps per heading. */}
      <div className="hidden lg:block" aria-hidden={!open}>
        <div
          className={`pointer-events-none absolute left-0 top-full z-10 h-screen w-full bg-primary/25 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          id="mega-panel"
          onMouseEnter={clear}
          className={`absolute left-0 top-full z-20 w-full border-t border-border-subtle bg-white shadow-[0_24px_40px_-12px_rgba(10,37,64,0.25)] transition-[opacity,transform,visibility] duration-200 ease-out ${
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-[1360px] mx-auto px-gutter py-6 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
            {current && (
              <div key={current.key} className="menu-fade">
                <current.Panel />
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileMenu open={mobileOpen} />
    </div>
  );
}
