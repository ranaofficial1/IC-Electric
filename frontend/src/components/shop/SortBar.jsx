import Icon from "../ui/Icon.jsx";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

export default function SortBar({ totalCount, sort, setSort, onOpenFilters, activeFilterCount }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 lg:hidden"
      >
        <Icon name="menu" className="text-[16px]" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      <p className="hidden text-sm text-neutral-500 lg:block">
        <span className="font-semibold text-neutral-900">{totalCount}</span>{" "}
        {totalCount === 1 ? "product" : "products"}
      </p>

      <div className="ml-auto flex items-center gap-2">
        <label htmlFor="sort-select" className="hidden text-sm text-neutral-500 sm:block">
          Sort by
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 focus:border-brand-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
