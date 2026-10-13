import Icon from "../ui/Icon.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

// One category checkbox; when checked, its subcategories appear indented
// beneath it (recursively), so a shopper can narrow e.g. Air Coolers → Desert Cooler.
function CategoryOption({ node, selectedCategories, toggleCategory }) {
  const checked = selectedCategories.includes(node.slug);
  const children = node.children || [];
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleCategory(node.slug)}
          className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
        />
        {node.name}
      </label>
      {checked && children.length > 0 && (
        <ul className="ml-2 mt-2.5 space-y-2.5 border-l border-neutral-100 pl-4">
          {children.map((child) => (
            <CategoryOption
              key={child.id}
              node={child}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FilterSidebar({
  lockedCategory,
  selectedCategories,
  toggleCategory,
  bounds,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  saleOnly,
  setSaleOnly,
  newOnly,
  setNewOnly,
  bestSellersOnly,
  setBestSellersOnly,
  clearFilters,
  activeFilterCount,
  mobileOpen,
  onClose,
}) {
  const { categories, findCategory } = useCategories();
  // Category pages offer the locked category's own subcategories; the
  // shop/search pages offer the top-level categories.
  const selectableCategories = lockedCategory
    ? findCategory(lockedCategory)?.children || []
    : categories;

  return (
    <aside
      className={`${mobileOpen ? "fixed inset-0 z-50 flex" : "hidden"} lg:sticky lg:top-36 lg:z-auto lg:flex lg:h-fit lg:w-64 lg:shrink-0`}
    >
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close filters"
          className="absolute inset-0 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className="relative ml-auto flex h-full w-80 max-w-[85%] flex-col gap-6 overflow-y-auto bg-white p-6 lg:ml-0 lg:h-auto lg:w-full lg:max-w-none lg:rounded-2xl lg:border lg:border-neutral-200/70">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-neutral-900">Filters</h2>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Clear all
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close filters" className="lg:hidden">
              <Icon name="close" className="text-neutral-500" />
            </button>
          </div>
        </div>

        {selectableCategories.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
              {lockedCategory ? "Subcategory" : "Category"}
            </h3>
            <ul className="space-y-2.5">
              {selectableCategories.map((category) => (
                <CategoryOption
                  key={category.id}
                  node={category}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                />
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
            Price Range
          </h3>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="filter-min-price">
              Minimum price
            </label>
            <input
              id="filter-min-price"
              type="number"
              min={bounds.min}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value) || bounds.min, maxPrice))}
              className="w-full min-w-0 rounded-lg border border-neutral-200 px-2.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            <span className="text-neutral-400">–</span>
            <label className="sr-only" htmlFor="filter-max-price">
              Maximum price
            </label>
            <input
              id="filter-max-price"
              type="number"
              min={minPrice}
              max={bounds.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value) || bounds.max, minPrice))}
              className="w-full min-w-0 rounded-lg border border-neutral-200 px-2.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
            className="mt-3 w-full accent-brand-500"
            aria-label="Maximum price"
          />
          <p className="mt-1 text-xs text-neutral-500">
            {formatPrice(minPrice)} – {formatPrice(maxPrice)}
            {maxPrice >= bounds.max ? "+" : ""}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
            Availability
          </h3>
          <ul className="space-y-2.5">
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                />
                On Sale
              </label>
            </li>
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={newOnly}
                  onChange={(e) => setNewOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                />
                New Arrivals
              </label>
            </li>
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={bestSellersOnly}
                  onChange={(e) => setBestSellersOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                />
                Best Sellers
              </label>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white lg:hidden"
        >
          Show Results
        </button>
      </div>
    </aside>
  );
}
