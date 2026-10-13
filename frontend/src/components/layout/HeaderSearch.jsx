import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MediaTile from "../ui/MediaTile.jsx";
import { fetchProducts } from "../../services/catalogApi.js";
import { formatPrice } from "../../utils/formatPrice.js";

const SUGGESTION_LIMIT = 5;
const DEBOUNCE_MS = 250;

// Search field markup/classes are copied from the reference header.
// Behaviour is the existing one: debounced live suggestions from the API,
// Enter / "View all results" -> /search?q=...  The category <select> is part of the
// reference design (its options are the reference's); it does not filter results.
function SearchField({ onDone }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search, guarded against out-of-order responses.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      fetchProducts({ query: trimmed, sort: "popularity", limit: SUGGESTION_LIMIT })
        .then(({ products }) => {
          if (requestIdRef.current === requestId) setSuggestions(products);
        })
        .catch(() => {
          if (requestIdRef.current === requestId) setSuggestions([]);
        })
        .finally(() => {
          if (requestIdRef.current === requestId) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  function go(path) {
    setOpen(false);
    onDone?.();
    navigate(path);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    go(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex w-full items-center bg-surface-canvas rounded-lg px-space-sm py-1.5 focus-within:ring-2 focus-within:ring-secondary"
      >
        {/* <select
          aria-label="Search category"
          className="bg-transparent text-label-md font-label-md text-text-secondary pr-2 mr-2 outline-none cursor-pointer"
        >
          <option>All Categories</option>
          <option>Ceiling Fans</option>
          <option>Water Heaters</option>
          <option>Air Coolers</option>
          <option>Lighting Solutions</option>
          <option>Kitchen Appliances</option>
        </select> */}
        <div className="w-px h-5 bg-border-subtle mr-3"></div>
        <input
          aria-label="Search products"
          className="w-full bg-transparent text-body-md font-body-md text-on-surface placeholder:text-text-muted outline-none"
          placeholder="Search fans, water heaters, lights, appliances..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              onDone?.();
            }
          }}
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-9 h-9 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary flex items-center justify-center transition-colors ml-2 flex-shrink-0"
        >
          <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
            {loading ? "progress_activity" : "search"}
          </span>
        </button>
      </form>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xl">
          {suggestions.length > 0 ? (
            <>
              <ul>
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => go(`/product/${product.slug}`)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-container-low"
                    >
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <MediaTile src={product.image} alt="" icon={product.categoryIcon} accent={product.categoryAccent} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-md font-medium text-on-surface">{product.name}</span>
                        <span className="block text-body-sm text-text-muted">{product.categoryName}</span>
                      </span>
                      <span className="shrink-0 text-label-lg text-primary">
                        {formatPrice(product.salePrice ?? product.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => {
                  setOpen(false);
                  onDone?.();
                }}
                className="block border-t border-border-subtle px-3 py-2.5 text-center text-label-md text-secondary hover:bg-surface-container-low"
              >
                View all results for &quot;{query.trim()}&quot;
              </Link>
            </>
          ) : (
            <p className="px-3 py-4 text-center text-body-md text-text-muted">
              {loading ? "Searching..." : `No products found for "${query.trim()}"`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Desktop: the exact wrapper from the reference header (hidden below lg, as in the reference).
export default function HeaderSearch() {
  return (
    <div className="hidden lg:flex flex-1 max-w-2xl mx-space-md">
      <SearchField />
    </div>
  );
}

// Below lg the reference header has no search at all. To keep search usable on phones/tablets
// (existing functionality) this adds ONE icon button to the right-hand icon cluster that opens
// the same field in a panel under the header. It renders nothing at lg and above.
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-secondary transition-colors"
      >
        <span className="material-symbols-outlined text-[22px]">{open ? "close" : "search"}</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full bg-surface-card px-gutter py-space-sm shadow-lg">
          <div className="max-w-[1360px] mx-auto">
            <SearchField onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
