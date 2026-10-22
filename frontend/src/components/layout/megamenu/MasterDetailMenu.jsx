import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuProductGrid, MenuSkeleton, ViewAll, productCountLabel } from "./shared.jsx";
import Icon from "../../ui/Icon.jsx";
import { formatPrice } from "../../../utils/formatPrice.js";

/**
 * The Kitchen mega-menu layout, shared by every panel so they all look the same:
 * a left rail of entries (hover/focus one) and a right panel with that entry's
 * heading, count and a compact product grid (max 2 rows).
 *
 * item: { key, name, to, icon (Material Symbols name) | iconKey (app Icon key),
 *         products, count?, from?, badge?, subtitle?, chips?: [{ key, name, to }],
 *         panel? (custom node shown instead of the product grid) }
 */
export default function MasterDetailMenu({
  railLabel,
  items,
  ready = true,
  loading = false,
  note,
  viewAll,
  fallbackIcon = "kitchen",
  tileIcon = "kitchen",
  accent,
}) {
  const [picked, setPicked] = useState(null);
  const active = items.find((i) => i.key === picked) || items[0];
  const activeCount = active ? active.count ?? active.products?.length ?? 0 : 0;

  return (
    <div className="grid grid-cols-[260px_1fr] overflow-hidden rounded-2xl border border-border-subtle">
      <div className="bg-surface-container-low p-3">
        <div className="px-3 pb-2 pt-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">
          {railLabel}
        </div>
        {!ready && [0, 1, 2, 3].map((i) => <MenuSkeleton key={i} className="mb-2 h-11" />)}
        {items.map((item) => {
          const on = item.key === active?.key;
          return (
            <Link
              key={item.key}
              to={item.to}
              onMouseEnter={() => setPicked(item.key)}
              onFocus={() => setPicked(item.key)}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                on ? "bg-white text-secondary shadow-sm" : "text-text-secondary hover:bg-white/60"
              }`}
            >
              {item.iconKey ? (
                <Icon name={item.iconKey} className="text-[20px]" />
              ) : (
                <span className="material-symbols-outlined text-[20px]">{item.icon || fallbackIcon}</span>
              )}
              <span className="flex-1 font-label-lg text-label-lg">{item.name}</span>
              <span className="font-label-sm text-label-sm text-text-muted">
                {(item.count ?? item.products?.length) || ""}
              </span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${on ? "translate-x-0.5" : "opacity-0"}`}>chevron_right</span>
            </Link>
          );
        })}
        {note && <p className="mt-2 px-3 font-body-sm text-body-sm text-text-muted">{note}</p>}
        {viewAll && (
          <div className="mt-2 px-3">
            <ViewAll to={viewAll.to} className="text-secondary">{viewAll.label}</ViewAll>
          </div>
        )}
      </div>

      <div className="bg-white p-5">
        {active && (
          <div key={active.key} className="menu-fade">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="font-title-lg text-title-lg text-primary">{active.name}</div>
                {active.badge && (
                  <span className="rounded-full bg-discount-emerald px-2.5 py-0.5 font-label-sm text-label-sm font-bold text-on-primary">
                    {active.badge}
                  </span>
                )}
              </div>
              {!active.panel && (
                <span className="font-body-sm text-body-sm text-text-muted">
                  {productCountLabel(activeCount)}
                  {active.from != null && ` · from ${formatPrice(active.from)}`}
                </span>
              )}
            </div>
            {active.subtitle && <p className="-mt-2 mb-3 font-body-sm text-body-sm text-text-secondary">{active.subtitle}</p>}
            {active.chips?.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {active.chips.map((c) => (
                  <Link
                    key={c.key}
                    to={c.to}
                    className="rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-text-secondary transition-colors hover:bg-secondary hover:text-on-secondary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
            {active.panel || (
              <MenuProductGrid
                products={active.products || []}
                loading={loading}
                icon={tileIcon}
                accent={accent}
                emptyText={`Products coming soon to ${active.name}.`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
