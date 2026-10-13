import { useState } from "react";
import { Link } from "react-router-dom";
import { ABOUT_LINKS, MENU_ITEMS } from "./menuItems.js";
import MediaTile from "../../ui/MediaTile.jsx";
import { ROUTES } from "../../../config/navRoutes.js";
import { useCategories } from "../../../context/CategoriesContext.jsx";
import { imageFor } from "../../../hooks/useMenuData.js";

function Thumb({ node }) {
  return (
    <span className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
      <MediaTile src={imageFor(node)} alt="" icon={node.icon} accent={node.accent || undefined} />
    </span>
  );
}

function SubLink({ node }) {
  return (
    <Link to={`/category/${node.slug}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 active:bg-surface-container-low">
      <Thumb node={node} />
      <span className="font-label-lg text-label-lg text-text-secondary">{node.name}</span>
    </Link>
  );
}

/** Mobile/tablet accordion: same headings as the navbar, same API data, tap to expand. */
export default function MobileMenu({ open }) {
  const [expanded, setExpanded] = useState(null);
  const { categories, findCategory } = useCategories();
  if (!open) return null;

  function body(item) {
    if (item.mobile === "roots") {
      return categories.map((c) => (
        <div key={c.id} className="mb-2">
          <SubLink node={c} />
          {c.children.length > 0 && (
            <div className="ml-14 flex flex-wrap gap-1.5 pb-1">
              {c.children.map((s) => (
                <Link key={s.id} to={`/category/${s.slug}`} className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-md text-label-md text-text-secondary">
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ));
    }
    if (item.mobile === "links") {
      return ABOUT_LINKS.map((l) => (
        <Link key={l.label} to={l.to} className="block rounded-lg px-2 py-2 font-label-lg text-label-lg text-text-secondary active:bg-surface-container-low">
          {l.label}
        </Link>
      ));
    }
    const node = item.mobile ? findCategory(item.mobile) : findCategory("fabric-care");
    const subs = item.mobile ? node?.children || [] : node ? [node] : [];
    return subs.map((s) => <SubLink key={s.id} node={s} />);
  }

  return (
    <div
      id="mobile-mega-menu"
      className="menu-drop lg:hidden absolute left-0 top-full z-30 max-h-[calc(100vh-150px)] w-full overflow-y-auto border-t border-border-subtle bg-white px-gutter-mobile pb-4 shadow-xl"
    >
      {MENU_ITEMS.map((item) => {
        const isOpen = expanded === item.key;
        return (
          <div key={item.key} className="border-b border-border-subtle">
            <div className="flex items-center">
              <Link to={ROUTES[item.routeKey]} className="flex-1 py-3 font-title-md text-title-md text-primary">
                {item.label}
              </Link>
              <button
                type="button"
                aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : item.key)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary"
              >
                <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
              </button>
            </div>
            {isOpen && <div className="menu-fade pb-3">{body(item)}</div>}
          </div>
        );
      })}
    </div>
  );
}
