# PROJECT_PROGRESS.md

Single source of truth for this project across Claude sessions. Read this file
and inspect the existing code **before** starting any phase.

---

## 1. Completed phases

- **Phase 1 — Project Foundation + Frontend Shell** — completed 2026-09-10
  (UI rebuilt from plain CSS to Tailwind the same day — see section 4)
- **Phase 2 — Shop + Categories** — completed 2026-09-10
- **Phase 3 — Product Details** — completed 2026-09-11
- **Phase 4 — Cart + Wishlist** — completed 2026-09-11
- **Phase 5 — Backend + Database** — completed 2026-09-12
- **Phase 6 — Authentication + Customer Account** — completed 2026-09-14
- **Catalog + Cart/Wishlist Backend Integration** — completed 2026-09-15
  (not one of the original 13 numbered phases — an inserted step; see
  section 4 for why it was needed before Phase 7 could make sense)
- **Phase 7 — Orders + Checkout** — completed 2026-09-17
- **Cart/Wishlist Merge Race Fix + Per-Variant "Go to Cart" State** —
  completed 2026-09-20 (bug-fix session, not a numbered phase — see
  section 4 for the root-cause writeup)
- **Phase 8 — Payment + Shipping** — completed 2026-09-24
- **Phase 9 — Admin Dashboard** — completed 2026-09-24
- **Phase 10 — Admin CRUD + Inventory** — completed 2026-09-25
- **Frontend Redesign (new reference `code.html`)** — completed 2026-10-11
  (visual-only, not a numbered phase — see section 4; **waiting for testing**)

## 2. Current phase

**FRONTEND REDESIGN IS COMPLETE — WAITING FOR TESTING** (2026-10-11). Frontend-only,
zero backend files touched. Phase 11 has still not been started.

(Previous status, unchanged:)

**PHASE 10 IS COMPLETE — WAITING FOR TESTING.** The project is stopped,
awaiting instruction to start Phase 11 (per the phase-control rule — never
auto-continue).

## 3. Remaining phases

11. Security + Validation + Error Handling (audit pass)
12. SEO + Performance + Accessibility
13. Testing + Production Readiness

## 4. Important technical decisions

- **Frontend:** React 18 + Vite + **JavaScript** (not TypeScript — explicit user choice).
- **Routing:** `react-router-dom` v6, all routes wrapped in one `<Layout>`
  (Header + `<Outlet />` + Footer) inside `src/App.jsx`.
- **Styling (updated 2026-09-10): Tailwind CSS v3**, replacing the Phase 1
  plain-CSS token system. `tailwind.config.js` is the single file to edit
  for brand colors (`theme.extend.colors.brand` / `.dark`) and fonts
  (`theme.extend.fontFamily`) — change it there and the whole site updates.
  `src/index.css` holds only the three `@tailwind` directives plus a couple
  of custom utilities (`.no-scrollbar`, `.hero-shape`) that aren't expressible
  as plain Tailwind classes. No other CSS files remain — all component
  styling is Tailwind utility classes in JSX.
- **Design reference:** The user supplied a reference `code.html` (a
  Tailwind-CDN "NovaTrend" demo) and asked to follow its UI patterns going
  forward. Adopted: brand orange (`#ff5520`) + dark neutral (`#0f1115`)
  palette, **Outfit** (display/headings) + **Plus Jakarta Sans** (body/UI)
  fonts, FontAwesome icon set, card/section patterns (announcement bar,
  sticky blurred header, category dropdown, rounded product cards with
  hover quick-add, dual promo banners, dark multi-column footer).
  Project branding kept as **"Hale"** (not renamed to "NovaTrend") — only
  the visual system was adopted, per the user's ask to use it "as well for
  other pages."
- **Icons:** Switched from the hand-authored inline-SVG set to
  **FontAwesome 6** via CDN (`index.html`), matching the reference. Kept a
  thin `Icon.jsx` wrapper (`<Icon name="cart" />`) mapping short names to
  FontAwesome classes so call sites don't need to know FA class names
  directly.
- **Product/category imagery (updated 2026-09-10):** Switched from flat
  gradient/icon tiles to **real photography via Lorem Picsum**
  (`https://picsum.photos/seed/<slug>/W/H`) at the user's explicit request
  (placeholder tiles "won't look nice"). Unsplash's own keyless placeholder
  endpoint (`source.unsplash.com`) was checked and confirmed fully dead
  (returns a Heroku error page as of 2024, deprecated since 2021), so Picsum
  — a stable, keyless, Unsplash-adjacent placeholder-photo service — was
  used instead, seeded by product/category slug so images stay consistent
  across reloads. Every product/category record now has an `image` field
  (categories also have `banner`); components render `product.image` /
  `category.image` directly, with `MediaTile.jsx` falling back to the old
  gradient+icon tile if an image fails to load (e.g. offline). **Swap the
  `image`/`banner` fields in `data/products.js` / `data/categories.js` for
  real product-photo URLs once the backend/media API exists — no component
  changes needed.**
- **Product catalog:** expanded from 12 to **24 products** (4 per category)
  in `data/products.js` so filtering/sorting/pagination has enough data to
  be meaningfully demonstrated. Added `createdAt` (for "newest" sort) and
  `image` fields to every product.
- **Filtering/sorting/search logic:** centralized in
  `filterAndSortProducts()` in `data/products.js` (category, price range,
  on-sale/new/best-seller flags, text search, 4 sort modes — `popularity`
  is approximated with `reviewCount` until a real sales-count metric exists
  on the backend) and driven by the `useProductFilters` hook
  (`src/hooks/useProductFilters.js`), shared by Shop, Category and Search
  pages so behavior stays consistent. The hook also reads `?filter=sale`,
  `?filter=new`, `?filter=best-sellers` and `?q=` on first load so the
  existing header/home "Shop the sale" / "New Arrivals" / "Best Sellers"
  links land pre-filtered.
- **Pagination:** implemented as **Load More** (client-side, 8 products per
  page) rather than numbered pages — simplest fit for a single scrolling
  grid; can be swapped for numbered/server-side pagination once the backend
  is paging real query results in Phase 5.
- **Product data model (Phase 3):** every product gained `images` (4-photo
  gallery array, Picsum-seeded like `image`), `description`, `specs`
  (key/value object rendered in the Specifications tab), `stock` (number —
  drives in-stock/low-stock/out-of-stock states, 0 for 2 products and ≤10
  for 4 more so all three states are actually visible in the demo data),
  and, where relevant, `options` (variant groups like Size/Color — present
  on 15 of 24 products, omitted on the rest; components treat a missing
  `options` field as "no variants"). All additions are purely additive —
  no existing product field (id, slug, name, price, rating, etc.) changed.
- **Reviews (Phase 3):** `data/reviews.js` deterministically derives 3
  reviews per product from a small shared template pool (seeded by product
  id, so results are stable) plus a `getRatingBreakdown()` heuristic that
  estimates a 5★–1★ percentage spread from the product's average rating.
  This is presentation-only placeholder data — replace with real
  aggregated review data once the Reviews API exists (Phase 5+/10).
- **Add to Cart / Buy Now / Wishlist (Phase 3):** intentionally **UI-only**.
  "Add to Cart" shows a brief local "Added to Cart" confirmation (no cart
  state, nothing persisted); "Buy Now" links to `/checkout` (still a
  placeholder page); the wishlist heart toggles local component state only.
  Real cart/wishlist state and persistence are built in Phase 4 — at that
  point these handlers need to be wired to actual state instead of the
  local `useState` stubs currently in `pages/ProductDetail.jsx`.
- **Currency (updated 2026-09-11): Indian Rupees (₹), not USD.** At the
  user's explicit request, `formatPrice()` now uses `Intl.NumberFormat`
  with `locale: "en-IN"`, `currency: "INR"`, no decimal places (matches
  typical Indian ecommerce price display). This wasn't just a symbol swap —
  every product's `price`/`salePrice` in `data/products.js` was rescaled to
  realistic INR figures (e.g. Aria Wireless Headphones ₹10,999 instead of
  the old $129), so amounts look like real prices rather than $129 shown
  with a ₹ sign. The hardcoded "Free Shipping Over $X" copy in the header
  announcement bar, homepage trust strip, and product-page shipping info
  was updated to "₹999" to match, and the cart page's free-shipping
  threshold/shipping fee constants are in rupees too. No other product
  fields changed.
- **Cart + Wishlist state (Phase 4):** `context/CartContext.jsx` and
  `context/WishlistContext.jsx` (React Context + `useState`), both
  persisted to `localStorage` (`hale_cart_v1` / `hale_wishlist_v1`) and
  provided around `<App />` in `main.jsx`. There's no account system yet
  (Phase 6), so persistence is per-browser/guest for now — spec calls for
  "persistent cart for logged-in users," which this satisfies partially;
  once auth exists, sync/merge this local cart with a server-side cart tied
  to the account. Cart line items are keyed by `productId + sorted selected
  options` (`useCart().addItem(product, quantity, selectedOptions)`), so the
  same product in two different variants (e.g. two sizes) becomes two
  separate lines, while re-adding the same variant increments quantity.
  Wishlist stores product ids only; pages look products up live via
  `getProductById()` so wishlisted items always reflect current price/stock.
- **Add to Cart / Buy Now / Wishlist — now real (Phase 4):** `ProductCard`
  and `pages/ProductDetail.jsx` were updated to call the contexts above
  instead of the local `useState` UI-only stubs from Phase 3. On
  `ProductCard`, if a product has variant `options`, the cart button links
  to the product page instead of adding directly (no way to pick a variant
  from a grid card) — this is the one behavior change to an existing
  component this phase, and it's additive (previously the button did
  nothing at all). "Buy Now" on the product page adds the item then
  navigates to `/checkout` (still a Phase-5+ placeholder page). Header cart
  and wishlist icons now show live counts instead of a hardcoded `0`.
- **Cart page coupons:** `HALE10` (10% off) and `WELCOME50` (5% off) are
  hardcoded demo codes validated client-side only, purely to demonstrate the
  UI — replace with real server-side coupon validation once the Coupons API
  exists (Phase 5+/10).
- **Header search (updated 2026-09-11):** Replaced the header's search
  *icon-link* (which required navigating to an empty `/search` page before
  typing) with an always-visible search box (`components/layout/
  HeaderSearch.jsx`) directly in the header, present on every page. It
  shows up to 5 live matching products in a dropdown as you type (via the
  same `filterAndSortProducts()` used elsewhere), each linking straight to
  its product page; pressing Enter or clicking "View all results" goes to
  `/search?q=...`, which `useProductFilters` already pre-fills from the `q`
  query param. The standalone `/search` page (Phase 2) is unchanged and
  still works on its own — the header box is an additional, faster entry
  point, not a replacement for it.
- **Backend (Phase 5): Node.js + Express, CommonJS (not ESM).** Lives in
  `/backend`, fully separate from `/frontend`. Used `require`/`module.exports`
  throughout rather than matching the frontend's `"type": "module"` — plain
  CommonJS is the more common convention for small Express APIs and avoids
  top-level-await complications in the seed script; the two apps don't share
  a module system anyway since they're separate npm projects.
- **No ORM.** Plain `mysql2/promise` with parameterized queries in
  `backend/src/models/*.js`, one file per table/entity. Chosen for
  transparency/auditability over Sequelize/Prisma — the schema is stable
  and not large enough to need migration tooling beyond a single
  `schema.sql` applied via `npm run db:schema`.
- **Auth:** JWT (`jsonwebtoken`), stateless — `Authorization: Bearer <token>`,
  7-day expiry by default (`JWT_EXPIRES_IN` in `.env`). Passwords hashed
  with `bcryptjs`. `users.role` (`customer`/`admin`) is the only
  authorization dimension — spec section 4 flags a full multi-role
  admin-permissions system as optional ("if multiple admin roles are
  needed"); deferred until that's actually needed. Logout is a no-op
  endpoint (stateless JWTs can't be server-revoked without a blocklist,
  which felt like overkill for this phase) — the frontend will just discard
  the token when it's wired up in Phase 6.
- **Password reset:** generates a hashed, 1-hour-expiry token
  (`password_resets` table). **There's no email service wired up yet** — in
  non-production mode, `POST /api/auth/forgot-password` returns the raw
  token directly in the JSON response (`devResetToken`) so the flow is
  testable locally. This must be replaced with a real email send (and the
  token removed from the response) before this ever runs in production —
  flagged again in section 9.
- **Database schema (Phase 5):** see `backend/src/db/schema.sql` — 19 tables
  covering every entity in spec section 5. A few deliberate simplifications
  from a "fully by-the-book" schema, all documented as SQL comments at the
  top of that file too:
  - `users.role` enum instead of a separate `admin_users`/`roles` table
    (see Auth note above).
  - Cart/order line-item variant selections (`{ "Size": "M" }`) stored as a
    JSON column (`selected_options`) rather than a fully normalized
    combination table — matches the shape the frontend already produces.
  - `products.stock` is the single source of truth for inventory levels;
    `inventory_logs` is an append-only audit trail for admin stock
    adjustments (used by `PATCH /products/:id/stock`), not a second
    "current stock" source.
  - No separate `wishlists`/`carts` parent tables — `wishlist_items` and
    `cart_items` reference `user_id` directly, since every user has exactly
    one of each.
- **Seed data (Phase 5) reuses the frontend catalog.** `backend/src/db/seed.js`
  dynamically `import()`s `frontend/src/data/{categories,products,reviews}.js`
  at seed time (confirmed working — Node's CommonJS `require()` can
  dynamically `import()` a `"type": "module"` file) instead of hand-copying
  the same 24 products into a second file. This means **the frontend
  placeholder data is the single source of truth**; editing
  `frontend/src/data/products.js` and re-running `npm run db:seed` updates
  the database to match. Every seed insert is an upsert (`ON DUPLICATE KEY
  UPDATE`, keyed by slug/email/code), so the script is safe to re-run. Also
  seeds 1 admin + 3 demo customer accounts (credentials in
  `backend/README.md`) and the same `HALE10`/`WELCOME50` coupon codes the
  frontend's `Cart.jsx` already hardcodes, so they'll validate for real once
  the frontend is wired to `GET /coupons/validate`.
- **Product list API mirrors the frontend's filter vocabulary exactly:**
  `GET /api/products` accepts `category`, `q`, `minPrice`, `maxPrice`,
  `saleOnly`, `newOnly`, `bestSellersOnly`, `sort`
  (`newest`/`price-asc`/`price-desc`/`popularity`), `page`, `limit` — the
  same parameters `filterAndSortProducts()` in the frontend already uses
  internally, so wiring the frontend to this API later should mostly mean
  swapping the data source, not rewriting the filter UI.
- **Order creation is transactional** (`orderModel.createFromCart`): locks
  the user's cart rows (`FOR UPDATE`), validates stock, computes
  subtotal/discount/shipping/total using the **same thresholds as the
  frontend's `Cart.jsx`** (free shipping ≥ ₹999, else ₹79 flat), snapshots
  line items (name/price at time of purchase, not a live join), decrements
  stock, records coupon usage, creates a `pending` payment row, and clears
  the cart — all in one DB transaction so a failure partway through can't
  leave stock decremented without an order, or vice versa.
- **This is a backend-only phase — nothing in `/frontend` was touched.**
  The React app still runs entirely on its own placeholder data and
  `localStorage` cart/wishlist; connecting it to this API is explicitly
  deferred (see section 9/10).
- **Verification without a live MySQL server or network access:** this
  sandbox has neither, so none of this could be run end-to-end here. What
  *was* done: `node --check` on all 39 backend `.js` files (plain CommonJS,
  so this is real syntax validation, unlike the frontend's JSX files),
  every `require()` path cross-checked against real files, every
  route→controller and controller→model method call cross-checked against
  actual exports (all via small Python scripts, not by eye), `schema.sql`
  manually reviewed for balanced parens/statement count, and the seed
  script's dynamic-`import()`-from-CommonJS approach was actually test-run
  in the sandbox against the real frontend data files to confirm it
  resolves 24 products correctly. **You still need to run this against a
  real MySQL instance as the first real test** — see `backend/README.md`.
- **Phase 6 wires the frontend to the backend for the first time** — auth
  is now real, not a placeholder. `frontend/.env.example` documents
  `VITE_API_URL` (defaults to `http://localhost:4000/api` if unset).
  `frontend/src/services/api.js` is a small `fetch` wrapper (token
  attach/parse/error-shape handling); `frontend/src/context/AuthContext.jsx`
  wraps it with register/login/logout/updateProfile/changePassword/
  forgotPassword/resetPassword, persists the JWT to `localStorage`
  (`hale_auth_token`), and revalidates it against `GET /auth/me` on every
  page load (clearing it silently if expired/invalid). Added to the
  provider tree in `main.jsx` as the outermost provider.
- **`ProtectedRoute` (`components/auth/ProtectedRoute.jsx`)** wraps
  `/account/*` in `App.jsx`: shows a spinner while the initial `/auth/me`
  check is in flight, then redirects to `/login` (preserving the original
  destination via router state) if not authenticated.
- **Backend addition: `POST /api/auth/change-password`.** Phase 5 only had
  the "forgot password" email-link flow (`forgot/reset-password`), which
  doesn't fit "change my password while already logged in" (Account
  Settings needs to verify the *current* password first, no token
  involved). Added a small `changePassword` controller + a
  `userModel.findByIdWithHash` helper (the existing `findById` deliberately
  excludes `password_hash` from every other response — this new function
  is for internal verification only and is never returned from an API
  response). Minimal, additive change to already-shipped Phase 5 code.
- **Scope boundary: cart/wishlist were deliberately NOT connected to the
  backend this phase**, even though earlier notes (Phase 4 section 4,
  Phase 5 section 10) flagged "merge local cart into the server cart on
  login" as an expected Phase 6 task. Revised reasoning: the backend's
  cart/wishlist endpoints return full product data joined from the real
  `products` table (integer `id`s assigned at seed time), while the
  frontend's Shop/Category/Product-detail pages still read from
  `frontend/src/data/products.js` (string ids like `"p-01"`) — **two
  different id spaces for the same catalog.** Wiring cart/wishlist to the
  server now, before the product catalog itself moves to the API, would
  mean either double-guessing a product-id mapping or shipping a
  half-integration that breaks the moment someone's cart mixes local and
  server items. `CartContext.jsx`/`WishlistContext.jsx` are **completely
  unchanged this phase** (verified — grepped for any reference to auth and
  found none) and still work exactly as they did in Phase 4: guest-only,
  `localStorage`-backed, no regression. The clean sequencing is now: connect
  the product/category catalog to the API first (whichever future phase
  does that), *then* switch cart/wishlist to the authenticated endpoints —
  updated in section 9/10 below.
- **My Account scope:** built Profile (edit name/phone, change password)
  and Addresses (list/add/edit/delete/set-default, full CRUD against
  `/customers/me/addresses`). **Order history intentionally shows an empty
  state for now** — `pages/account/Orders.jsx` calls the real
  `GET /customers/me/orders` endpoint (so it'll populate automatically once
  orders exist), but there's no order-detail page yet since "order details
  and status workflow" is explicitly Phase 7's job per the spec's phase
  breakdown, and no orders can exist yet anyway without checkout. Order
  list rows are deliberately non-clickable this phase (no dead link to an
  unbuilt detail page).
- **Header:** account icon now goes to `/account` when logged in (shows the
  user's first name next to it on `lg+` screens) or `/login` when not;
  wishlist/cart badges unchanged from Phase 4.
- **Demo accounts (seeded in Phase 5, now actually usable via the UI):**
  `admin@hale.test` / `AdminPass123!` and 3 customer accounts — see
  `backend/README.md`. Try logging in with one of the customer accounts to
  exercise the whole Phase 6 flow.
- **Dev environment note (frontend):** The sandbox used to build this has no
  network access, so `npm install` / `npm run build` could not be executed
  or verified here for either app. The code was manually reviewed (imports
  cross-checked, brace/paren balance checked, plain JS/config files
  syntax-checked with `node --check`, Icon usages cross-checked against the
  defined icon map), but **run `npm install && npm run dev` yourself as the
  first real smoke test** and report back any errors.

### Catalog + Cart/Wishlist Backend Integration (2026-09-15, unplanned step)

**Why this happened outside the numbered phase list:** raised directly by
the user — if the product catalog stays on local placeholder data while
Phase 9/10 builds an admin panel that writes products to the database,
anything an admin adds would never appear on the storefront. That needed
fixing before Phase 7 (can't create a real order against a product that
only exists in a JS file) and definitely before Phase 9/10. Agreed with the
user to insert this now rather than hit the same wall later.

- **Adapter pattern, not a component rewrite.** The backend returns
  snake_case DB rows (`sale_price`, `is_new`, `category_slug`, ...); the
  entire UI was written against the frontend's old camelCase local-data
  shape (`salePrice`, `isNew`, `category` as a plain slug string, ...).
  Rather than touch every component's field names, `services/catalogApi.js`
  exports `mapProduct()`/`mapCategory()` that normalize API responses into
  **exactly** that same old shape. Most components (`ProductCard`, `Hero`,
  `Cart`, `Wishlist`) needed either no field-name changes or very small
  ones — they just now receive data fetched from the network instead of
  imported from a file.
- **`frontend/src/data/{categories,products,reviews}.js` are kept exactly
  as they were — nothing deleted.** They're no longer imported by any UI
  component (verified — grepped for it, see below), but
  `backend/src/db/seed.js` still dynamically imports them as its seed
  source (this was already true since Phase 5). They're now clearly
  "seed-source-only" files. `getReviewsForProduct()` (the fake per-product
  review generator) is now genuinely dead code from the running app's
  perspective — real reviews come from the API. `getRatingBreakdown()` is
  **not** dead code — it's a presentational heuristic (estimates a 5★–1★
  bar-chart spread from a single average-rating number, since the backend
  has no dedicated histogram query) and is still used by `RatingSummary`,
  now fed the real average rating instead of the old fake one.
- **Category info is embedded directly on every product/cart-item/
  wishlist-item row** (`category_slug`, `category_name`, `category_icon`,
  `category_accent`, mapped to `category`/`categoryName`/`categoryIcon`/
  `categoryAccent`) rather than requiring a separate category lookup per
  card. Small additive `JOIN categories c ON c.id = p.category_id` added to
  `productModel`'s `BASE_SELECT`, and to `cartModel`/`wishlistModel`'s
  SELECTs (which needed a fresh `JOIN` since they only joined `products`
  before). This is *why* `CategoriesContext` (see below) ended up small —
  it's only actually needed for genuinely category-*listing* UI (header
  dropdown/mobile nav, homepage category rail, shop filter checklist), not
  for rendering a product card's category info.
- **`has_options` computed flag.** The product **list** endpoint
  (`GET /api/products`) doesn't return each product's full `options` array
  (only the **detail** endpoint does, via `attachRelations`) — but
  `ProductCard`'s quick-add button needs to know *whether* a product has
  variants (to decide "add directly" vs "go to product page to choose"),
  without paying for the full options+values join on every list request.
  Added `EXISTS(SELECT 1 FROM product_options po WHERE po.product_id = p.id)
  AS has_options` to `productModel.BASE_SELECT` and to
  `wishlistModel.SELECT_WISHLIST` (the wishlist page has the same "move to
  cart vs choose options" decision to make). `ProductCard`/`Wishlist` now
  check `product.hasOptions` instead of the old (and, it turns out, already
  broken for this reason) `product.options && product.options.length > 0`.
- **`CategoriesContext`** (`context/CategoriesContext.jsx`) fetches
  `GET /api/categories` once on mount and caches it — consumed by `Header`,
  `Home`, `FilterSidebar`, `Search`. `Category.jsx` (the category *page*)
  intentionally does its own direct `GET /api/categories/:slug` fetch
  instead of pulling from this shared list, so a bad slug in the URL gets a
  clean 404 state without depending on the full list having loaded first.
- **`useProductFilters` hook rewritten to fetch from `GET /api/products`**,
  but **returns the exact same shape it did in Phase 2** (plus new
  `loading`/`error` fields) — `Shop.jsx`/`Category.jsx`/`Search.jsx` needed
  zero structural changes, just one new `loading` prop passed through to
  `ProductGrid` (which now shows a skeleton grid on first load instead of
  briefly flashing "no products found" before data arrives — that flash was
  a real risk once fetching became async, not present in the old synchronous
  version). "Load More" is now real server-side pagination (accumulates
  pages in state) rather than client-side array slicing.
- **Price-range slider bounds are a static `{min: 0, max: 15000}`**, not a
  live query against the catalog. The old version computed this from the
  local product array; the backend has no dedicated "price bounds"
  endpoint, and adding one just for a slider's outer limits seemed like
  more than this warranted. Actual min/maxPrice **filtering** still goes to
  the server and is fully correct either way — this only affects how far
  the slider's track extends.
- **`HeaderSearch` live suggestions are now a real debounced API call**
  (250ms debounce, request-id guard against out-of-order responses so a
  slow earlier keystroke's response can't overwrite a faster later one)
  instead of synchronous local filtering. Same UX, network-backed now.
- **Cart/Wishlist are now dual-mode** (`context/CartContext.jsx`,
  `context/WishlistContext.jsx`, both fully rewritten):
  - **Guest (not logged in):** unchanged behavior from Phase 4 —
    `localStorage`-backed, same function signatures. One shape change:
    guest wishlist now stores **full product snapshots**, not just IDs
    (`toggleWishlist(product)` instead of `toggleWishlist(productId)`) —
    there's no local product array to look a bare ID back up against
    anymore now that products live in the database. `ProductCard`'s and
    `ProductDetail`'s wishlist-toggle call sites were updated to pass the
    full product.
  - **Logged in:** backed by the real `/api/cart` and `/api/wishlist`
    endpoints. **On the guest→logged-in transition, the local cart/wishlist
    is merged into the server's** (one API call per local line; the
    backend naturally dedupes/merges matching product+variant lines), then
    local storage is cleared and the server becomes the source of truth for
    the rest of the session. On logout, in-memory server state is dropped
    and the merge-guard resets so a future login merges again. This was the
    literal blocker flagged in Phase 6 — safe to do now because product IDs
    are finally real (one ID space, the database's), not a mix of real
    server IDs and fake `"p-01"`-style frontend strings.
  - Every function returns the **same item shape** regardless of mode (see
    `services/cartApi.js`/`services/wishlistApi.js` mappers), so
    `Cart.jsx`/`Wishlist.jsx`/`ProductCard`/`Header` needed no branching
    logic of their own for guest vs logged-in.
- **Verified no component still imports the old local-data catalog
  functions** (`getCategoryBySlug`, `getProductById`, `filterAndSortProducts`,
  `getFeaturedProducts`, `getNewArrivals`, `getProductBySlug`,
  `getRelatedProducts`, `getPriceBounds`) — grepped for each, confirmed zero
  UI usages remain (only the data files' own definitions, which the seed
  script may still use directly on the raw arrays).
- **Known gap, not addressed this step:** cart/wishlist mutation calls
  (`addItem`, `updateQuantity`, `removeItem`, `toggleWishlist`, etc.) in
  logged-in mode don't currently surface network/API failures to the user
  — a failed request just silently doesn't update the UI, rather than
  showing an error toast. Guest mode can't fail this way (it's synchronous
  local state), so this is new with server-backed mode. Worth adding proper
  error surfacing before this goes to production; flagged again in
  section 9.

### Phase 7 — Orders + Checkout (2026-09-17)

**Pure frontend work — zero backend changes needed.** Everything Checkout
required already existed from Phase 5 (`POST /orders` transactional
creation, `GET /orders`, `GET /orders/:id`, `GET /coupons/validate`,
address CRUD) — this phase was entirely about building UI against
already-working, already-verified endpoints.

- **`pages/Checkout.jsx`:** address selection (reuses a newly-extracted
  `components/account/AddressForm.jsx` — see below — for the inline
  "add new address" flow), billing address (checkbox "same as shipping",
  defaulting on; a second address picker only appears if unchecked),
  delivery method (a single **informational** "Standard Delivery" block,
  not a real selector — the backend only supports one flat shipping-fee
  calculation, so a fake multi-option selector would imply capability that
  doesn't exist), payment method (Cash on Delivery — the only functional
  option — plus a visibly disabled "Card / UPI — Coming Soon" option,
  rather than a selectable-but-fake online option; Phase 8 makes this
  real), order notes, real coupon validation, and order summary. Guarded
  against loading with a cart that hasn't finished loading yet — see
  `cartLoading` below.
- **`context/CartContext.jsx` gained a `cartLoading` flag** (small additive
  change, same shape otherwise). Needed because `Checkout.jsx` redirects to
  `/cart` if the cart is empty — but for a just-logged-in user, the server
  cart fetch is async, so `items` is briefly `[]` before it resolves even
  when the real cart has contents. Without this flag, that timing gap
  caused a false "cart is empty" redirect on a fresh page load.
- **`components/account/AddressForm.jsx` extracted from `Addresses.jsx`**
  (which previously had the address input fields inlined). Now shared
  between the Account → Addresses page and Checkout's inline "add address"
  flow — same fields, same validation error display, one place to change
  either. `Addresses.jsx`'s behavior is otherwise unchanged (verified by
  diffing the extraction against the original inline JSX).
- **Coupon validation upgraded to the real API everywhere.** `Cart.jsx` used
  to check coupon codes against a hardcoded `{HALE10, WELCOME50}` object
  client-side (a Phase 4 placeholder, predating the backend). It now calls
  `GET /api/coupons/validate` — same endpoint Checkout uses — so there's no
  more split between a "fake-but-cart" and "real-but-checkout" coupon
  check. The two pages validate independently (entering a code in Cart
  doesn't carry over to Checkout) rather than sharing state across the
  navigation — simpler, and coupons are cheap to re-enter.
- **`components/orders/` — three small shared components** used by Cart,
  Checkout, OrderSuccess, and the account Orders list/detail pages, so the
  totals math and status-pill styling live in exactly one place each:
  - `OrderTotals.jsx` — subtotal/discount/shipping/total breakdown (this
    replaced near-identical inline JSX previously duplicated in `Cart.jsx`
    and the design used for Checkout).
  - `OrderStatusBadge.jsx` — the status→color mapping, extracted from
    `Orders.jsx` (which had it inlined) so `OrderDetail.jsx`/`OrderSuccess.jsx`
    render identical badges.
  - `OrderItemsList.jsx` — renders `order_items` rows. **No product image
    or link** — `order_items` only stores a name/price/quantity/options
    snapshot at time of purchase (see schema note in section 5), not an
    image URL or slug, so these are deliberately text-only rows rather
    than fabricating a product image that isn't actually there. Noted as
    a nice-to-have enhancement in section 9, not fixed this phase.
- **`pages/OrderSuccess.jsx`** — route is `/order-success/:orderId` (not
  the old parameterless placeholder path) — refetches the order via
  `GET /orders/:id` rather than relying on router state, so it survives a
  page refresh and is a real shareable/bookmarkable link, not just a
  transient post-submit view.
- **`pages/account/OrderDetail.jsx`** — new, at `/account/orders/:id`. This
  is what the Phase 6 note "order list rows are non-clickable — order
  detail is Phase 7 scope" was pointing at; `Orders.jsx` rows now link
  here and use the shared `OrderStatusBadge`.
- **Checkout requires login**, matching the backend (`POST /orders` sits
  behind `requireAuth`) — both `/checkout` and `/order-success/:orderId`
  are wrapped in the same `ProtectedRoute` as `/account/*`. A guest who
  clicks "Proceed to Checkout" is sent to `/login` (via `ProtectedRoute`'s
  existing redirect-and-return behavior) and lands back on `/checkout`
  after logging in — at which point their guest cart has already merged
  into their account, since that merge happens automatically on login
  (built in the Catalog/Cart integration step above).
- **On successful order placement, `clearCart()` is called** to sync the
  frontend's cached cart state to empty (the backend's order transaction
  already deleted the `cart_items` rows server-side as part of creating the
  order — this is just telling the frontend to stop showing stale cached
  items, not a second deletion of anything).

### Cart/Wishlist Merge Race Fix + Per-Variant "Go to Cart" State (2026-09-20)

User-reported bugs, both in the merge-on-login flow built in the Catalog/
Cart integration step: (1) guest cart items were lost after logging in,
and adding a new item right after login silently didn't work either;
(2) the product page's Add to Cart button needed to persistently read
"Go to Cart" once that *specific selected variant* was in the cart (not
just a temporary flash, and not shared across different Size/Color
selections of the same product).

**Root cause of (1):** `main.jsx` wraps the app in `<React.StrictMode>`,
which intentionally double-invokes effects in development (mount →
cleanup → mount again, synchronously) specifically to catch effects that
aren't safe to run more than once. The merge-on-login effect wasn't safe:
it guarded the merge loop with a plain ref (`hasMergedRef.current`, set to
`true` synchronously before the first `await`) and separately guarded its
own state updates with a `cancelled` flag from the effect's cleanup.
Under StrictMode's double-invocation:
1. Invocation #1 starts the merge loop (sequential `await`ed
   `POST /cart/items` calls) and sets the ref synchronously.
2. React immediately runs invocation #1's cleanup (`cancelled = true`) and
   fires invocation #2.
3. Invocation #2 sees the ref already `true`, skips merging entirely, and
   immediately fires its own `GET /cart` — which can resolve **before**
   invocation #1's sequential merge calls have finished, so it returns an
   empty or partial cart. Invocation #2 sets this into `serverItems`
   (its own `cancelled` is still `false`).
4. Invocation #1's merge calls keep running in the background and *do*
   reach the database, but its `cancelled` flag (now `true`) blocks it
   from ever calling `setGuestItems([])` or `setServerItems(...)` — so the
   UI is left showing invocation #2's premature (empty/partial) fetch, and
   the guest cart in `localStorage` never gets cleared. On a later reload,
   the same un-cleared guest items get merged **again**, incrementing
   quantities a second time server-side.

This is a real correctness bug regardless of StrictMode specifically —
StrictMode just makes an already-fragile "assume this effect runs exactly
once" assumption fail reliably and immediately, which is the whole point
of what it's for.

**Fix:** `CartContext.jsx` and `WishlistContext.jsx` (identical bug, same
fix applied to both — wishlist wasn't reported broken but had the exact
same pattern) now hold the merge-then-fetch work as a **single shared
in-flight promise** (`syncPromiseRef`), created only if one doesn't already
exist. A second (StrictMode-doubled, or any other reason) invocation of
the effect finds the promise already set and just attaches its own
`.then()` to the *same* promise instead of starting a competing fetch —
so both invocations converge on one real result instead of racing. Also
hardened the merge loop itself: each guest line's `POST /cart/items` call
is now individually try/caught, so one line failing (e.g. a product that's
since gone out of stock) doesn't abort merging the rest of the cart.

Extracted the option-serialization helper that guest cart line-ids were
already built from into `utils/cartOptions.js` (`serializeOptions`/
`optionsMatch`) so it's shared rather than duplicated — this is also what
powers fix (2) below.

**Fix for (2):** `pages/ProductDetail.jsx` no longer tracks a temporary
`justAdded` flash-state. Instead it derives `alreadyInCart` on every render
by checking the cart's `items` for a line matching **both** `productId`
*and* the currently-selected `selectedOptions` (via `optionsMatch`, which
compares option sets independent of key order). Changing a variant
selector immediately recomputes this — selecting Size S after adding Size
M correctly shows "Add to Cart" again, and switching back to M shows "Go
to Cart" again, with no extra state to keep in sync. The button now reads:
`Add to Cart` (default) → `Adding...` (brief loading state while the
`addItem` call is in flight — matters more now that it's `await`ed rather
than fire-and-forget) → `Go to Cart` (persistent, links to `/cart`) once
that exact variant is confirmed in the cart. As a small related fix, "Buy
Now" now also checks `alreadyInCart` before adding, so clicking it when
the selected variant is already in the cart no longer silently adds a
second, duplicate line — this was a latent bug in the original Buy Now
logic, not something newly introduced by this fix, but reused the same
`alreadyInCart` check to correct while already in this code. `ProductCard`'s
own quick-add button (grid/list views, no variant selector) was
deliberately left unchanged — it's a different UI context, wasn't reported
broken, and the user asked to keep existing functionality intact outside
the two reported issues.

### Phase 8 — Payment + Shipping (2026-09-24)

**Payment provider: Razorpay**, not Stripe — chosen to match the store's
existing India/INR-first decisions (currency, shipping thresholds, seeded
customer data). Cash on Delivery (built in Phase 7) is unchanged and stays
the default-selected option; Card/UPI/Netbanking via Razorpay is now real
instead of the "Coming Soon" placeholder.

- **No schema changes.** `payments.raw_response` (already a JSON column)
  holds the Razorpay order id/amount/currency before payment, then the full
  verify/webhook payload after — avoided adding a dedicated
  `provider_order_id` column and the migration-tooling question that would
  raise (the project deliberately has none — see Phase 5 notes). A payment
  row for an order is looked up by Razorpay order id via
  `JSON_EXTRACT(raw_response, '$.providerOrderId')` in the new
  `models/paymentModel.js` (`findByProviderOrderId`), used by the webhook.
- **Order creation is unchanged** (`orderModel.createFromCart`, Phase 5) —
  it already accepted an arbitrary `paymentProvider` string and always
  inserted one `pending` payment row regardless of value. Phase 8 only
  adds what happens *after* that row exists.
- **Three payment endpoints** (`controllers/paymentController.js`,
  `routes/paymentRoutes.js`, mounted at `/api/payments`):
  - `POST /payments/razorpay/order` 🔒 — given an existing order id (must
    belong to the caller, must not already be paid), creates a Razorpay
    order for its total (in paise) and records it on the payment row.
    Safe to call again on retry (a new Razorpay order is created each
    time; the payment row is just overwritten, not duplicated).
  - `POST /payments/razorpay/verify` 🔒 — the frontend calls this from
    Razorpay Checkout's own success handler. Recomputes the HMAC-SHA256
    signature from `razorpayOrderId|razorpayPaymentId` using the key
    *secret* and compares it to what Razorpay returned — this alone is
    enough to trust the payment (the signature can't be forged without
    the secret), independent of the webhook below. On match: marks the
    payment `succeeded`, the order `payment_status: 'paid'`, and bumps
    `status` from `pending` to `confirmed` if it hadn't moved already.
  - `POST /payments/razorpay/webhook` — **not behind `requireAuth`**;
    Razorpay calls this server-to-server, authenticated instead by an
    HMAC signature (`x-razorpay-signature` header) checked against
    `RAZORPAY_WEBHOOK_SECRET`. Second, independent confirmation channel —
    covers the case where a shopper closes the tab right after paying,
    before the client-side verify call above ever fires. Handles
    `payment.captured`/`payment.authorized` (→ paid) and `payment.failed`
    (→ failed); idempotent (checks the payment isn't already `succeeded`
    before writing). If `RAZORPAY_WEBHOOK_SECRET` isn't set, the route
    still runs but skips verification and logs a warning — deliberately
    permissive for local dev (client-side verify alone is already safe;
    the webhook is defense-in-depth), but must be set before production.
- **Webhook needs the raw request body** (Razorpay signs the exact bytes),
  which conflicts with the app's global `express.json()`. Solved by
  mounting the webhook route directly in `app.js`, with its own
  `express.raw({ type: "application/json" })`, **before**
  `app.use(express.json())` and outside the `/api` router — Express fully
  handles a matching request in that `app.use()` block and never falls
  through to the JSON parser, so no double-parsing conflict. (This is the
  one route not defined in `routes/`, for that reason.)
- **`orderModel.findById` gained two additive fields**: `payment` (the
  latest payment row: provider/status/provider_payment_id/amount — mirrors
  the existing `shipment` field from Phase 7) and, for the admin-only call
  path (no `userId` filter), `customer_name`/`customer_email` via a new
  `JOIN users` (previously only `listAll` had this join). Both are purely
  additive — nothing that already read this function's output broke.
- **Frontend payment flow** (`utils/razorpay.js`, `services/paymentApi.js`):
  `Checkout.jsx`'s "Place Order" button now, for the Razorpay option,
  creates the local order first (exactly as Cash on Delivery does — same
  `POST /orders` call, cart already cleared server-side either way), then
  opens the Razorpay Checkout widget **inline on the same page** rather
  than navigating away first. Whatever happens next — successful payment,
  the shopper closing the widget, or a failed attempt — they land on
  `/order-success/:orderId`, which already exists from Phase 7. This
  means an order can legitimately exist with `payment_status: 'pending'`
  after Razorpay was selected; that's expected, not a bug.
- **`components/orders/RazorpayPayButton.jsx`** — new, shared, self-hiding
  ("Complete Payment") button: renders nothing unless
  `order.payment.provider === 'razorpay'` and it hasn't succeeded yet.
  Dropped into both `OrderSuccess.jsx` and `account/OrderDetail.jsx` so a
  shopper who dismissed/failed the widget can retry from either page —
  each retry calls `POST /payments/razorpay/order` again (safe, per above)
  and re-opens the widget.
- **Minimal admin order-fulfillment screen**, added because it was
  explicitly called out as Phase 8 scope (shipping/tracking logic) in the
  prior session's "next phase" note, and the backend endpoints for it
  (`PATCH /admin/orders/:id/status|payment-status|shipment`) already
  existed unused since Phase 5 — `OrderDetail.jsx` has rendered tracking
  info since Phase 7 with no way to set it. Kept deliberately narrow:
  - `components/auth/AdminRoute.jsx` — new route guard, same shape as
    `ProtectedRoute.jsx` but also requires `isAdmin` (already exposed by
    `AuthContext`), redirecting non-admins to `/` and guests to `/login`.
  - `pages/admin/Orders.jsx` (list, from `GET /admin/orders`) and
    `pages/admin/OrderDetail.jsx` (three small forms: order status,
    payment status, carrier/tracking-number/shipment-status — each PATCHes
    its own existing endpoint and refreshes local state from the
    response) — both bare pages, no shared admin layout/sidebar/nav.
  - **Deliberately not** a dashboard, not styled to match a future admin
    shell, and doesn't touch products/categories/customers/coupons/reviews
    — all of that is explicitly Phase 9 (nav/dashboard) and Phase 10
    (the rest of admin CRUD). This screen exists only so shipment tracking
    entered here shows up in the customer-facing `OrderDetail.jsx` that
    already renders it. A small "Admin" link was added to `Header.jsx`,
    visible only when `isAdmin` — the minimum needed to reach the page
    without typing the URL by hand; not a real admin nav.
- **Env vars added**: `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/
  `RAZORPAY_WEBHOOK_SECRET` (backend `.env.example`), `VITE_RAZORPAY_KEY_ID`
  (frontend `.env.example`/`.env.local` — the public key id only, safe
  client-side; never the secret). `razorpay` added to
  `backend/package.json` dependencies — **not installed in this sandbox**
  (no network access here, same limitation as every prior phase); run
  `npm install` in `backend/` before starting it.
- **Verification without network/a live server**, same constraints as
  every prior phase: `node --check` on every new/modified backend `.js`
  file (all pass), every new `require()`/model-method call cross-checked
  against actual exports. The frontend's `.jsx` files can't be syntax-
  checked with `node --check` (JSX isn't valid plain JS, and this sandbox
  has no bundler/babel installed to do a real parse) — reviewed manually
  plus a bracket-balance sanity check across every new/edited file, same
  limitation flagged in every earlier phase's frontend work. **The
  Razorpay flow specifically has not been exercised against a real
  Razorpay test account or a live database in this environment** — this
  is the first real thing to test once you run both apps locally (see
  section 9 for the exact steps, including how to test the webhook via a
  tunnel like ngrok).

### Phase 9 — Admin Dashboard (2026-09-24)

**Pure frontend phase — zero backend files touched.** Everything Phase 9
needed already existed server-side and was unused: `GET /admin/dashboard`
(built Phase 5), `requireAuth`/`requireAdmin` middleware (Phase 5), and the
`AdminRoute.jsx` guard (built Phase 8, reused as-is — "admin auth" was
already effectively done, just not reused yet). Login also already
supported the redirect-back-to-origin pattern (`location.state.from`) that
`AdminRoute` relies on, from `ProtectedRoute`'s Phase 6 implementation — no
changes needed there either.

- **`pages/admin/AdminLayout.jsx`** — new nav shell for every `/admin/*`
  screen, deliberately mirroring `pages/account/AccountLayout.jsx`'s
  existing sidebar pattern (same structural idea: sidebar nav + `<Outlet/>`
  content pane) rather than inventing a new layout convention. Sidebar
  links: Dashboard, Orders, Products, Categories, Customers, Coupons,
  Reviews, plus a Log Out button (calls `useAuth().logout()`, then
  navigates home) and a "Back to Store" link. Active link highlighting
  uses `NavLink`'s default (non-`end`) matching, so `/admin/orders/:id`
  still highlights the "Orders" link, same behavior as `AccountLayout`.
- **`pages/admin/Dashboard.jsx`** — new, the actual "dashboard summary"
  screen, wired straight to the existing `GET /admin/dashboard` response
  shape (`totalRevenue`, `totalOrders`, `totalCustomers`, `totalProducts`,
  `recentOrders`, `lowStockProducts`, `ordersByStatus` — see
  `adminController.js`, unchanged): four stat cards, a recent-orders table
  linking into the existing `AdminOrderDetail.jsx` (Phase 8, untouched), a
  low-stock list, and an orders-by-status breakdown reusing the existing
  `OrderStatusBadge.jsx`.
- **`pages/admin/AdminComingSoon.jsx`** — new, small placeholder shown for
  Products/Categories/Customers/Coupons/Reviews nav links. Deliberately
  **not** the public `ComingSoon.jsx` (Phase 1) reused as-is — that one's
  "Back to home" button would drop an admin out of the admin shell
  entirely, so this is a tiny admin-scoped variant that links back to
  `/admin/dashboard` instead and stays inside `AdminLayout`. Exists so the
  nav has somewhere honest to send a click instead of a 404 or a dead
  link — the backend for some of these (customers, reviews) already has
  endpoints from Phase 5 with no UI yet either way; all of them are
  explicitly Phase 10 scope (see section 3), not attempted here.
- **`App.jsx` admin routes restructured** — was two flat routes
  (`/admin/orders`, `/admin/orders/:id`) directly under `<AdminRoute>`;
  now `<AdminRoute>` → `<AdminLayout>` (with an `index` redirect to
  `/admin/dashboard`) → nested `dashboard` / `orders` / `orders/:id` /
  `products` / `categories` / `customers` / `coupons` / `reviews`
  children. **`pages/admin/Orders.jsx` and `pages/admin/OrderDetail.jsx`
  (Phase 8) were not modified at all** — they already render fine nested
  inside `AdminLayout`'s content pane (their own `mx-auto max-w-5xl`/
  `max-w-4xl` wrappers just center within the available pane width, the
  same harmless pattern `AccountLayout`'s children avoid by not having
  their own wrapper — cosmetically slightly different, functionally a
  non-issue, and not worth touching working Phase 8 code to normalize).
- **Two small pre-existing files got a one-line touch, not a rebuild:**
  `App.jsx` (routing, described above — every phase touches this file)
  and `components/layout/Header.jsx`'s "Admin" link, which pointed at
  `/admin/orders` (the only admin page that existed in Phase 8) and now
  points at `/admin/dashboard` (the new, more natural entry point).
  Nothing else in either file changed.
- **`components/ui/Icon.jsx` gained six new icon keys** (`gauge`, `tags`,
  `users`, `ticket`, `comment`, `chartLine`) for the new nav items and
  stat cards — purely additive entries in the existing icon-name lookup
  object, same pattern as every prior phase's icon additions.
- **Verification, same constraints as every prior phase** (no
  network/bundler in this sandbox to do a real JSX parse): every new file
  reviewed manually, a bracket-balance sweep across all 78 frontend
  `.js`/`.jsx` files (all balanced), every icon name used in the new files
  (including the ones passed as JSX-expression props, not just string
  literals) cross-checked against `Icon.jsx`'s actual keys, every new
  import cross-checked against the file it points to and that file's
  `export default`, and confirmed zero backend files were modified. As
  with Phase 8, **not exercised against a running browser/dev server in
  this environment** — first real test is logging in as the seeded admin
  account and clicking through the new sidebar.

### Phase 10 — Admin CRUD + Inventory (2026-09-25)

**Almost entirely frontend — one small, additive backend change.** Every
CRUD/moderation endpoint this phase needed already existed from Phase 5
(`/products` admin create/update/delete/stock, `/categories` admin create/
update/delete, `/coupons` admin CRUD, `/admin/customers/*`,
`/admin/reviews/*`) and had zero frontend UI until now. Replaced all five
of Phase 9's `<AdminComingSoon />` placeholder routes in `App.jsx` with
real screens; no other routing/nav rework needed (`AdminLayout.jsx`'s
sidebar already pointed at the right paths since Phase 9).

- **One backend gap found and fixed:** `GET /api/products` (the only
  products-list endpoint that exists) defaulted to `publishedOnly: true`
  unconditionally — fine for the public storefront, but it meant an admin
  had no way to see unpublished/draft products in the new admin Products
  screen. Fixed with the same pattern `categoryController.list` already
  used for its own `includeInactive` flag: `productRoutes.js`'s `GET "/"`
  now runs through `optionalAuth` (was previously unauthenticated with no
  `req.user`), and `productController.parseListQuery` accepts a
  `publishedOnly=false` query param **only when `req.user?.role ===
  "admin"`** — a non-admin/guest request always forces `publishedOnly:
  true` regardless of what's passed, so the storefront's behavior is
  byte-for-byte unchanged. Also raised the list endpoint's `limit` cap from
  50 to 100 (harmless for the public site, useful for an admin table).
  This is the only backend file touched this phase
  (`productController.js`, `productRoutes.js`) — `productModel.list`
  already accepted a `publishedOnly` param from Phase 5, so no model or
  schema change was needed.
- **`pages/admin/Products.jsx`** — searchable, paginated product table
  (image thumbnail, name/SKU, category, price with sale-price strike-
  through, stock, published/draft badge) backed by the now-admin-aware
  `GET /api/products?publishedOnly=false`. Create/edit is one inline form
  (same expand-in-place pattern as `account/Addresses.jsx`) covering every
  field the backend accepts: slug, name, description, category (a
  `<select>` sourced from the existing `CategoriesContext`), SKU, price,
  sale price, stock, the three boolean flags (new/best-seller/featured)
  plus published, and three multi-value fields — images, specs, and
  variant options. **Multi-value fields are edited as plain text (one item
  per line — `Key: Value` for specs, `Name: value1, value2` for options)
  rather than dynamic add/remove-row UI.** This was a deliberate scope cut
  to keep the form maintainable in one file: it still round-trips every
  field losslessly (parse/stringify helpers convert cleanly both ways,
  verified by eye against `productModel.replaceImages`/`replaceSpecs`/
  `replaceOptions`'s expected shapes), just with a plainer editing
  experience than a polished dynamic list would have. Editing a product
  fetches the full record via `GET /products/:slug` first (the list
  endpoint's row doesn't include images/specs/options, same as the public
  Shop grid vs. Product Detail split from Phase 2/3) so the form starts
  populated instead of blank. **Stock adjustment is a quick `window.prompt`
  for a +/- quantity**, calling the existing `PATCH /products/:id/stock`
  — consistent with the project's existing lightweight pattern of using
  native `window.confirm` for destructive actions (`Addresses.jsx`,
  `Categories.jsx`, this phase's own delete buttons) rather than building
  a custom modal component.
- **`pages/admin/Categories.jsx`** — full CRUD, same inline-form pattern:
  name, slug, description, icon (the short name `Icon.jsx` maps to a
  FontAwesome class — matches existing category data, e.g. `"hanger"`),
  accent color, image/banner URLs, active toggle, sort order. List table
  shows active/inactive status; delete is `window.confirm`-guarded.
- **`pages/admin/Coupons.jsx`** — full CRUD: code (auto-uppercased to match
  `couponModel.findByCode`'s `.toUpperCase()` lookup), type (percent/
  fixed) with the value label switching between "%" and "₹" accordingly,
  optional minimum order amount, optional usage limit, optional start/
  expiry dates (`<input type="date">`, converted to/from the backend's
  full timestamp strings), active toggle. List table shows current usage
  (`used_count` / `usage_limit`) and status.
- **`pages/admin/Reviews.jsx`** — moderation queue: status-filter tabs
  (All/Pending/Approved/Rejected, defaulting to **Pending** since that's
  the actionable queue), each review showing the product (linked, opens in
  a new tab), reviewer name, star rating, comment, and Approve/Reject/
  Delete actions calling the existing `PATCH /admin/reviews/:id/status`
  and `DELETE /admin/reviews/:id` — both of which already trigger
  `productModel.updateRatingAggregate` server-side (Phase 5), so a
  product's displayed rating/review count updates automatically the
  moment a review is approved or removed, no extra frontend work needed.
  Acting on a review removes it from the current filtered list immediately
  (optimistic-ish: removed on success, not before) rather than refetching
  the whole list.
- **`pages/admin/Customers.jsx`** + **`pages/admin/CustomerDetail.jsx`**
  (new nested route `/admin/customers/:id`, added to `App.jsx` — the one
  new route this phase adds beyond swapping placeholders, since Phase 9
  only had a flat `/admin/customers` placeholder with nowhere to drill
  into) — list shows name/email/phone/joined date/status with a quick
  Activate/Disable toggle per row; detail page shows the same plus the
  customer's full order history (reusing `OrderStatusBadge`), each row
  linking into the existing `admin/OrderDetail.jsx` from Phase 8. Both
  call `PATCH /admin/customers/:id/status` — disabling is
  `window.confirm`-guarded (locks the customer out of login), activating
  is not.
- **Reused throughout, unmodified:** `services/api.js` (the fetch
  wrapper), `utils/formErrors.js` (`detailsToFieldErrors` for 422s),
  `utils/formatPrice.js`, `components/ui/{TextField,Button,Icon}.jsx`,
  `components/orders/OrderStatusBadge.jsx`, `context/CategoriesContext.jsx`
  — no changes needed to any of them; every admin screen this phase
  follows the same conventions Phases 6–9 already established (inline
  expand-in-place forms, `window.confirm` for destructive actions, 422 →
  field-level errors, the shared status-badge color system).
- **`pages/admin/AdminComingSoon.jsx` is now unused** (verified — grepped,
  no remaining imports) but left in place rather than deleted, since
  deleting working files outside this phase's actual scope wasn't asked
  for.
- **Verification, same constraints as every prior phase** (no network/
  MySQL/bundler in this sandbox): `node --check` on both modified backend
  files (pass) plus a full `node --check` sweep of every backend `.js`
  file (all pass, confirming the small `productController`/`productRoutes`
  change didn't break anything). Frontend `.jsx` can't be syntax-checked
  with `node --check` (same JSX limitation as every earlier phase) — did a
  bracket-balance sweep across every frontend `.js`/`.jsx` file (all
  balanced, including the 6 new admin pages), cross-checked every `Icon`
  name used in the new files against `Icon.jsx`'s actual key list (all
  present), and cross-checked every new import against the file it points
  to and that file's actual export. **Not exercised against a running
  browser/dev server or a real database in this environment** — first
  real test is logging in as the seeded admin account and working through
  each new sidebar screen: create/edit/delete a category, create/edit/
  delete a product (including adjusting its stock and toggling published,
  then confirming it does/doesn't show up on the storefront `/shop`),
  create/edit/delete a coupon (then confirming it validates at Cart/
  Checkout), approve/reject a pending review (submit one as a logged-in
  customer first, since there's still no review-submission UI — see
  section 9), and disable/re-enable a test customer account — confirmed by
  reading (not running) `authController.login`, unchanged this phase, that
  it already rejects a `status: 'disabled'` login attempt with a 403, so
  the Disable button's effect should be real, just worth confirming live.


### Frontend Redesign — exact port of reference `code.html` (2026-10-11)

Visual-only. **Backend: zero files changed** (verified by diffing `backend/`
against the original zip). The dummy API/product data is untouched; no product
imports were started. No routes, contexts, services, auth, cart/wishlist/
checkout/payment logic changed.

**Approach: 1:1 port, not a re-interpretation.** The reference HTML was
converted to JSX mechanically (every class, text, attribute, image URL kept
verbatim), then only the interactive parts were wired by hand. Verified with a
script that renders the components and diffs them against the reference DOM:
Home = 1307/1307 identical events (tags, classes, attributes, text, images),
Footer = 80/80. Header differs only by the functional additions listed below.
All 96 Tailwind tokens (colors, font sizes/families, spacing, radii) match the
reference config exactly.

- **Home page (`pages/Home.jsx`)** = the reference's 11 blocks as components in
  `components/home/`: `TopRibbon`, `HeroShowcase`, `CategoryOverview`,
  `FeaturedBestsellers`, `FansShowcase`, `WaterHeaters`, `KitchenGrid`,
  `HomeAppliances`, `SmartLights`, `ValuePillars`, `OrderForm`.
  **Content is static, exactly as in the reference** (Anurag Traders / Crompton
  products, prices, copy, images). It does NOT read from the dummy API — that
  was the instruction (don't invent/alter content). The shop, category, search,
  product, cart, checkout, account and admin pages still use the API.
- **Reference scripts ported to React state:** hero slides + dots + prev/next
  with the same 5.5 s autoplay (resets on manual change); bestseller filter
  pills + scroll buttons; kitchen "add to quote" buttons (same alert text, then
  scroll to the form); order form submit (same alert text, resets the form).
- **`Header.jsx` / `Footer.jsx`** = reference markup. Wired: cart/wishlist
  badges + cart total show live values (`₹0.00` format as in the reference),
  all links, active nav pill follows the route (reference hard-codes "Premium
  Fans"; that stays the default on `/`). Additions that are NOT in the
  reference, kept minimal: (1) the search box submits and shows live API
  suggestions (existing feature); its category dropdown is the reference's and
  is cosmetic; (2) a search icon button visible only below `lg` (the reference
  has no search on tablet/mobile) that opens the same field under the header;
  (3) the person icon links to login / account / admin dashboard (existing
  routes, so admin and account stay reachable).
- **Link mapping:** the reference is one page, so its `data-path` links are
  mapped to existing routes/sections in `src/config/navRoutes.js` (edit there):
  fans/water heaters/kitchen/home appliances/smart lights -> `/#section` on
  Home; About/Dealership -> `/about`; Contact/Bulk Orders/Warranty ->
  `/contact`; Air Coolers -> `/shop` (the way into the API catalog);
  Cart & Quote -> `/cart`; Wishlist; policy links -> existing policy pages.
- **Tokens/CSS:** `tailwind.config.js` holds the reference tokens verbatim (+
  legacy `brand`/`dark`/`neutral` aliases pointed at the new palette so the
  untouched pages re-theme); `index.html` uses the reference fonts/body
  classes; `index.css` includes the reference's global rules (hidden
  scrollbars, `main` margin resets). `Layout` `<main>` = reference
  (`pt-[148px]`, fixed header).
- **Pages not in the reference** (shop, product, cart, checkout, account, admin,
  auth) were NOT redesigned further; they inherit the palette/fonts/container
  width via the token aliases. `ProductCard`, `Button`, `Badge`, `TextField`,
  `Icon` (now Material Symbols), etc. were restyled in the same pass for those pages.
- **Verification (no network/bundler/browser here):** JSX syntax via the
  TypeScript parser (0 errors on 91 files), import resolution, Icon names,
  custom-token checks, undefined-identifier pass, and the DOM-diff above.
  **Not built with Vite or opened in a browser.**

**Frontend files changed (this redesign):**
- Config/entry: `index.html`, `tailwind.config.js`, `src/index.css`, new `src/config/navRoutes.js`
- Layout: `components/layout/{Header,HeaderSearch,Footer,Layout}.jsx`
- Home: `pages/Home.jsx`; new `components/home/{TopRibbon,HeroShowcase,CategoryOverview,FeaturedBestsellers,FansShowcase,WaterHeaters,KitchenGrid,HomeAppliances,SmartLights,ValuePillars,OrderForm}.jsx`
- UI primitives (for the non-reference pages): `components/ui/{Icon,Button,Badge,TextField,SectionHeading,MediaTile,ProductCard}.jsx`
- Targeted edits: `components/shop/{ProductGrid,FilterSidebar}.jsx`, `pages/{Wishlist,ProductDetail,Checkout}.jsx`, `pages/auth/{Login,Register}.jsx`, `components/product/Gallery.jsx`, `pages/admin/Categories.jsx`
- Mechanical class sweep only (container width, font weight, icon sizes): remaining files under `pages/account`, `pages/admin`, `pages/auth`, `components/auth`, `components/product`, `components/shop`, `pages/{Cart,Category,ComingSoon,OrderSuccess,Search,Shop}.jsx`
- Removed (my earlier, now-unused attempt): `components/home/{Hero,TrustRibbon,TrustStrip,PromoBand,NewsletterCTA,BestsellerCarousel,CategoryShowcase}.jsx`, `components/ui/CategoryCard.jsx`, `src/config/site.js`

### Real catalog + data-driven home page (2026-10-13)

- Catalog source of truth is now `backend/src/db/catalogData.js` (recreated from
  admin screenshots: 6 categories, 18 subcategories, 20 of 29 products). The old
  placeholder seed (`seedSubcategories.js`) and the frontend's
  `data/categories.js` / `data/products.js` were removed — **this reverses the
  earlier "frontend data files are the source of truth" decision**. `db:seed` is
  now insert-if-missing and never overwrites existing rows.
- Not in screenshots, so left empty: product images, descriptions, ratings,
  best-seller/new flags, and the 9 products on admin page 2.
- Home sections (CategoryOverview, FeaturedBestsellers, Fans, WaterHeaters,
  Kitchen, HomeAppliances, SmartLights, Hero) read from the API. Marketing copy
  and imagery for collection tiles lives in `frontend/src/config/collectionContent.js`.
- Buy Now / Add to Cart: `hooks/useShopActions.js` (awaits the add, surfaces
  errors); ProductDetail Buy Now no longer races navigation; `CartContext.cartLoading`
  covers the post-login merge window; backend cart refuses quantity > stock.
- Nav/footer links point at `/category/<slug>` (`config/navRoutes.js`).
- NOT run end-to-end here (no MySQL/network in the authoring sandbox): files were
  syntax-checked only. Test locally per the commands in the hand-off message.

## 5. Database / schema decisions

MySQL, 19 tables, full definitions in `backend/src/db/schema.sql` (applied via
`npm run db:schema`, re-runnable — uses `CREATE TABLE IF NOT EXISTS`):

`users`, `password_resets`, `addresses`, `categories`, `products`,
`product_images`, `product_specs`, `product_options`,
`product_option_values`, `inventory_logs`, `wishlist_items`, `cart_items`,
`coupons`, `orders`, `order_items`, `payments`, `shipments`, `reviews`,
`site_settings`.

Covers every entity in spec section 5. See section 4 above ("Database
schema (Phase 5)") for the handful of deliberate simplifications
(role column instead of separate admin table, JSON column for cart/order
variant selections, stock-as-single-source-of-truth + audit log instead of
a separate live inventory table) and the reasoning behind each. No new
tables since Phase 5 — the catalog/cart/wishlist integration step only
added computed/joined columns to existing model queries (category info,
`has_options`), not schema changes; see section 4's "Catalog + Cart/
Wishlist Backend Integration" entry for detail. **Still no new tables as of
Phase 8** — Razorpay integration reuses the existing `payments.raw_response`
JSON column (Phase 5) instead of adding a dedicated provider-order-id
column; see section 4's Phase 8 entry. **No schema changes in Phase 9
either** — it was a pure frontend phase (see section 4).

## 6. API endpoints already created

Implemented across Phase 5 + Phase 6, mounted under `/api`
(`backend/src/routes/`). Full method/path list with query params and auth
requirements is in `backend/README.md` — summary by resource:

- **Auth** — register, login, logout, me, forgot/reset password,
  **change-password** (added Phase 6, requires login) (JWT)
- **Categories** — list, detail, admin create/update/delete
- **Products** — list with filter/sort/search/pagination, detail (+ images/
  specs/options/related/reviews), admin create/update/delete, admin stock
  adjustment
- **Reviews** — list for a product, submit (authenticated), admin
  list/approve/reject/delete
- **Cart** — get, add item, update quantity, remove item, clear (all
  authenticated)
- **Wishlist** — get, add, remove (all authenticated)
- **Customer** — profile get/update, addresses CRUD, order history (all
  authenticated)
- **Orders** — create from cart (transactional), list mine, detail mine
  (authenticated); admin list/detail/status/payment-status/shipment update
- **Payments** (Phase 8) — Razorpay order creation, client-side signature
  verify (both authenticated), webhook (server-to-server, signature-
  authenticated instead of JWT)
- **Coupons** — validate (public), admin CRUD
- **Admin** — dashboard summary (revenue/orders/customers/products,
  recent orders, low-stock list, orders-by-status), customer
  list/detail/status management

**Now called by the frontend:** `/auth/*`, `/customers/me` +
`/customers/me/addresses` + `/customers/me/orders` (Phase 6); `/categories`,
`/categories/:slug`, `/products` (list + detail, live header search),
`/cart/*`, `/wishlist/*` (catalog/cart/wishlist integration step); **as of
Phase 7** — `POST /orders` (real order creation from Checkout),
`GET /orders/:id` (OrderSuccess + account OrderDetail), and
`GET /coupons/validate` is now called from **both** `Cart.jsx` and
`Checkout.jsx` (the old hardcoded `HALE10`/`WELCOME50` client-side check in
Cart.jsx is gone). **As of Phase 8** — `POST /payments/razorpay/order` and
`POST /payments/razorpay/verify` are called from `Checkout.jsx` (initial
payment) and `RazorpayPayButton.jsx` (retry, used on `OrderSuccess.jsx` and
account `OrderDetail.jsx`); `GET/PATCH /admin/orders/*` are now called from
the new minimal `pages/admin/Orders.jsx`/`OrderDetail.jsx`. **As of Phase
9** — `GET /admin/dashboard` is now called, from the new
`pages/admin/Dashboard.jsx`.
**As of Phase 10** — `/admin/customers` + `/admin/customers/:id` +
`PATCH /admin/customers/:id/status` (new `admin/Customers.jsx` +
`admin/CustomerDetail.jsx`); `/admin/reviews` (with `?status=`) +
`PATCH /admin/reviews/:id/status` + `DELETE /admin/reviews/:id` (new
`admin/Reviews.jsx`); admin product mutations — `POST /products`,
`PUT /products/:id`, `DELETE /products/:id`, `PATCH /products/:id/stock`
— plus `GET /products` now called with `publishedOnly=false` (admin-only,
see section 4) from the new `admin/Products.jsx`; admin category
mutations — `POST /categories`, `PUT /categories/:id`,
`DELETE /categories/:id` (new `admin/Categories.jsx`); admin coupon CRUD —
`GET/POST/PUT/DELETE /coupons` (admin-only list, distinct from the public
`GET /coupons/validate` already used since Phase 4/7) (new
`admin/Coupons.jsx`).
**Still not called:** review submission (`POST /products/:slug/reviews` —
reviews are read-only on the frontend so far; the new Reviews admin screen
only *moderates* existing reviews, it doesn't add the missing "write a
review" form — see section 9).
Everything newly-wired was cross-checked (by eye, against each
controller's actual body/query field names) for path/method/field-name
consistency between frontend calls and backend route definitions — but
none of it has run against a live database/browser in this environment
(no MySQL/network available — see section 4).

## 7. Files / folders created (updated through Phase 10 — Admin CRUD + Inventory)

```
ecommerce-project/
├── PROJECT_PROGRESS.md
├── README.md
├── frontend/                         # see updated file tree below
│   └── ...
└── backend/                          # only productController.js + productRoutes.js touched this phase (see section 4)
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── README.md                     # setup, demo logins, API reference
    └── src/
        ├── server.js                 # entry point
        ├── app.js                    # middleware + route mounting
        ├── config/
        │   ├── db.js                 # mysql2 connection pool
        │   └── razorpay.js            # lazily-instantiated Razorpay SDK client (Phase 8)
        ├── db/
        │   ├── schema.sql            # all 19 tables — unchanged this phase (see section 5)
        │   ├── runSchema.js          # npm run db:schema
        │   └── seed.js               # npm run db:seed — imports frontend/src/data/*.js
        ├── middleware/
        │   ├── auth.js               # requireAuth / optionalAuth / requireAdmin
        │   ├── validate.js           # express-validator → ApiError(422)
        │   └── errorHandler.js       # central error handler + 404
        ├── models/                   # one file per table, raw mysql2 queries — none touched this phase
        │   ├── userModel.js
        │   ├── addressModel.js
        │   ├── categoryModel.js
        │   ├── productModel.js       # list()'s publishedOnly param (Phase 5) is what this phase's controller change now exposes to admins
        │   ├── cartModel.js
        │   ├── wishlistModel.js
        │   ├── orderModel.js
        │   ├── paymentModel.js
        │   ├── couponModel.js
        │   └── reviewModel.js
        ├── controllers/              # one per resource, thin — validation/shaping only
        │   ├── authController.js
        │   ├── categoryController.js
        │   ├── productController.js  # ← this phase: parseListQuery()/list() — admin-only publishedOnly=false support (see section 4)
        │   ├── cartController.js
        │   ├── wishlistController.js
        │   ├── customerController.js # profile/addresses + admin customer mgmt — now has a UI (this phase)
        │   ├── orderController.js
        │   ├── paymentController.js
        │   ├── couponController.js   # admin CRUD (list/create/update/remove) — now has a UI (this phase)
        │   ├── reviewController.js   # admin moderation (listAll/setStatus/remove) — now has a UI (this phase)
        │   └── adminController.js    # dashboard summary
        ├── routes/
        │   ├── index.js
        │   ├── authRoutes.js
        │   ├── categoryRoutes.js
        │   ├── productRoutes.js      # ← this phase: GET "/" now runs through optionalAuth (see section 4)
        │   ├── cartRoutes.js
        │   ├── wishlistRoutes.js
        │   ├── customerRoutes.js
        │   ├── orderRoutes.js
        │   ├── paymentRoutes.js
        │   ├── couponRoutes.js
        │   └── adminRoutes.js
        └── utils/
            ├── asyncHandler.js
            ├── ApiError.js
            ├── token.js               # JWT sign/verify
            └── generateOrderNumber.js
```

`app.js` itself also changed this phase — mounts `POST /api/payments/razorpay/webhook`
directly (with `express.raw()`) ahead of the global `express.json()`, since
that one route needs the unparsed request body for signature verification.
See section 4's Phase 8 entry for why.

### Frontend file tree (Phase 10 changes marked ←)

```
frontend/
    ├── .env.example                     # unchanged this phase
    ├── index.html                       # fonts, FontAwesome CDN, body theming
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js                # ← edit brand colors/fonts here
    ├── postcss.config.js
    ├── .gitignore
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.jsx                     # AuthProvider > CategoriesProvider > CartProvider > WishlistProvider — unchanged this phase
        ├── App.jsx                     # ← this phase: 5 AdminComingSoon placeholders replaced with real screens + new customers/:id route
        ├── index.css                    # @tailwind directives + custom utilities
        ├── services/
        │   ├── api.js                    # fetch wrapper: token attach, JSON parse, ApiRequestError (Phase 6)
        │   ├── catalogApi.js             # fetchCategories/fetchCategoryBySlug/fetchProducts/fetchProductBySlug + normalizers
        │   ├── cartApi.js                # getCart/addCartItem/updateCartItem/removeCartItem/clearServerCart
        │   ├── wishlistApi.js            # getWishlist/addWishlistItem/removeWishlistItem
        │   └── paymentApi.js             # ← new (Phase 8): createRazorpayOrder/verifyRazorpayPayment
        ├── context/
        │   ├── AuthContext.jsx           # user/token state, /auth/me revalidation (Phase 6) — unchanged this phase (isAdmin already existed)
        │   ├── CategoriesContext.jsx     # fetches category list once, cached
        │   ├── CartContext.jsx          # merge-on-login race-proof (shared in-flight promise); cartLoading flag — unchanged this phase
        │   └── WishlistContext.jsx      # same race-proof merge — unchanged this phase
        ├── data/
        │   ├── categories.js            # SEED-SOURCE ONLY — no longer imported by any UI component
        │   ├── products.js              # SEED-SOURCE ONLY — filterAndSortProducts()/etc. are dead code from the app's perspective
        │   └── reviews.js               # getReviewsForProduct() is dead code; getRatingBreakdown() still used (presentational heuristic)
        ├── hooks/
        │   └── useProductFilters.js     # fetches GET /api/products with server-side pagination
        ├── utils/
        │   ├── formatPrice.js           # Intl.NumberFormat en-IN/INR
        │   ├── formErrors.js            # backend validation details → {field: message} (Phase 6)
        │   ├── cartOptions.js            # serializeOptions/optionsMatch — shared by CartContext and ProductDetail's per-variant cart check
        │   └── razorpay.js               # ← new (Phase 8): loadRazorpayScript() + payWithRazorpay() orchestration
        ├── components/
        │   ├── auth/
        │   │   ├── ProtectedRoute.jsx    # guards /account/*, /checkout, /order-success/:orderId — unchanged this phase
        │   │   └── AdminRoute.jsx        # new Phase 8, unchanged this phase: guards /admin/* — requires login AND isAdmin
        │   ├── account/
        │   │   └── AddressForm.jsx        # extracted from Addresses.jsx; shared with Checkout's inline "add address" flow
        │   ├── orders/
        │   │   ├── OrderStatusBadge.jsx    # extracted from Orders.jsx
        │   │   ├── OrderItemsList.jsx      # renders order_items — text-only, no image (see section 4)
        │   │   ├── OrderTotals.jsx         # subtotal/discount/shipping/total, used by Cart/Checkout/OrderSuccess/OrderDetail
        │   │   └── RazorpayPayButton.jsx    # ← new (Phase 8): self-hiding "Complete Payment" retry, used on OrderSuccess + account OrderDetail
        │   ├── layout/
        │   │   ├── Layout.jsx           # Header + <Outlet/> + Footer
        │   │   ├── Header.jsx           # ← this phase: "Admin" link now points to /admin/dashboard (was /admin/orders)
        │   │   ├── HeaderSearch.jsx     # debounced live API search
        │   │   └── Footer.jsx           # dark multi-column footer + newsletter form
        │   ├── ui/                      # reusable primitives (Tailwind classes) — Icon.jsx got new keys this phase, rest unchanged
        │   │   ├── Icon.jsx               # ← this phase: + gauge/tags/users/ticket/comment/chartLine keys
        │   │   ├── Button.jsx
        │   │   ├── Badge.jsx
        │   │   ├── TextField.jsx
        │   │   ├── SectionHeading.jsx
        │   │   ├── MediaTile.jsx
        │   │   ├── CategoryCard.jsx
        │   │   └── ProductCard.jsx
        │   ├── home/                    # unchanged this phase
        │   │   ├── Hero.jsx
        │   │   ├── TrustStrip.jsx
        │   │   ├── PromoBand.jsx
        │   │   └── NewsletterCTA.jsx
        │   ├── shop/                    # unchanged this phase
        │   │   ├── FilterSidebar.jsx
        │   │   ├── SortBar.jsx
        │   │   ├── ProductGrid.jsx
        │   │   └── Breadcrumbs.jsx
        │   └── product/                 # unchanged this phase
        │       ├── Gallery.jsx
        │       ├── VariantSelector.jsx
        │       ├── QuantityStepper.jsx
        │       ├── StockStatus.jsx
        │       ├── ShippingInfo.jsx
        │       ├── ProductTabs.jsx
        │       ├── RatingSummary.jsx
        │       └── ReviewCard.jsx
        └── pages/
            ├── Home.jsx                 # unchanged this phase
            ├── Shop.jsx                 # unchanged this phase
            ├── Category.jsx             # unchanged this phase
            ├── Search.jsx               # unchanged this phase
            ├── ProductDetail.jsx        # unchanged this phase
            ├── Cart.jsx                 # unchanged this phase
            ├── Wishlist.jsx             # unchanged this phase
            ├── Checkout.jsx             # ← this phase: Card/UPI enabled (was "Coming Soon"), opens Razorpay widget inline on place-order
            ├── OrderSuccess.jsx         # ← this phase: renders RazorpayPayButton for a still-pending Razorpay order
            ├── auth/                     # Login/Register/ForgotPassword/ResetPassword — unchanged this phase
            ├── admin/                    # Orders/OrderDetail (Phase 8), AdminLayout/Dashboard (Phase 9) untouched this phase; 6 new screens below
            │   ├── AdminLayout.jsx        # sidebar nav shell + <Outlet/> — unchanged this phase (nav already pointed at the right paths)
            │   ├── Dashboard.jsx          # /admin/dashboard — unchanged this phase
            │   ├── AdminComingSoon.jsx    # no longer referenced anywhere (all 5 placeholders replaced this phase) — left in place, not deleted
            │   ├── Orders.jsx             # /admin/orders — unchanged this phase
            │   ├── OrderDetail.jsx        # /admin/orders/:id — unchanged this phase
            │   ├── Products.jsx           # ← new (Phase 10): /admin/products — searchable/paginated CRUD + stock adjust (see section 4)
            │   ├── Categories.jsx         # ← new (Phase 10): /admin/categories — full CRUD
            │   ├── Coupons.jsx            # ← new (Phase 10): /admin/coupons — full CRUD
            │   ├── Reviews.jsx            # ← new (Phase 10): /admin/reviews — moderation queue (approve/reject/delete)
            │   ├── Customers.jsx          # ← new (Phase 10): /admin/customers — list + activate/disable
            │   └── CustomerDetail.jsx     # ← new (Phase 10): /admin/customers/:id — profile + order history
            ├── account/
            │   ├── AccountLayout.jsx     # unchanged this phase
            │   ├── Profile.jsx           # unchanged this phase
            │   ├── Addresses.jsx         # unchanged this phase
            │   ├── Orders.jsx            # unchanged this phase
            │   └── OrderDetail.jsx       # ← this phase: renders RazorpayPayButton for a still-pending Razorpay order
            └── ComingSoon.jsx           # placeholder + 404 for unbuilt routes
```

## 8. Features completed

**Phase 1 (+ Tailwind migration):**
- Vite + React + JS project scaffolded with `react-router-dom`, migrated to Tailwind CSS.
- Responsive sticky header (announcement bar, category dropdown, mobile menu, cart badge).
- Responsive dark footer (link columns, newsletter form, payment icons).
- Homepage: hero, trust strip, category rail, product grids, promo banners, newsletter CTA, footer trust strip.
- Reusable `ProductCard`, `CategoryCard`, `Button`, `Badge`, `Icon` (FontAwesome), `MediaTile`.
- Placeholder routes + 404 for every page in the spec so links never break.
- Accessibility basics: skip link, focus ring, `prefers-reduced-motion`, semantic landmarks, aria-labels.

**Phase 2 — Shop + Categories:**
- `/shop` — all-products page: full filter sidebar (category, price range with
  slider + min/max inputs, on-sale/new/best-seller toggles), sort dropdown
  (newest, price asc/desc, popularity), result count, Load More pagination,
  empty state with "clear filters" action.
- `/category/:slug` — category page: photographic banner with name/description
  over a gradient scrim, breadcrumbs, same filter/sort/grid as Shop but
  locked to the category (category checklist hidden), "category not found"
  fallback for bad slugs.
- `/search` — live client-side text search (matches product name or
  category), popular-search chips and category shortcuts when empty, full
  filter/sort/grid once a query is entered, empty-results state.
- Filtering, sorting and search share one hook (`useProductFilters`) and one
  data function (`filterAndSortProducts`) so behavior is consistent across
  all three pages and there's a single place to extend later.
- Fully responsive: filter sidebar becomes a slide-over drawer (with overlay
  + close button) below `lg`, opened via a "Filters" button in the sort bar.
- Real photography (Lorem Picsum, seeded) replaces the old gradient/icon
  placeholder tiles everywhere a product/category image renders (product
  cards, category cards, hero floating cards, category banners) — see
  section 4 for details. `MediaTile` still falls back to the gradient+icon
  tile if an image URL fails to load.

**Phase 3 — Product Details:**
- `/product/:slug` — full product detail page: breadcrumbs, image gallery
  (main image + thumbnail strip, hover-zoom cue), category label, name,
  star rating + review count, price with sale strike-through/badge, short
  description, variant selectors (only rendered when the product has
  `options`), quantity stepper (capped at stock, max 10), stock/availability
  status (in-stock / low-stock / out-of-stock), Add to Cart + Buy Now +
  wishlist-toggle actions, shipping/returns/secure-checkout info block.
- Tabbed **Description / Specifications / Reviews** section — specs render
  from each product's `specs` object; Reviews tab shows a rating summary
  (average + 5★–1★ bars) and 3 per-product reviews.
- **Related products** row (same category, current product excluded),
  reusing the existing `ProductCard`.
- "Product not found" fallback for bad slugs, matching the pattern already
  used on the Category page.
- Add to Cart / Buy Now / Wishlist are UI-only at this stage (see section 4)
  — real cart/wishlist state lands in Phase 4.

**Phase 4 — Cart + Wishlist:**
- Cart and wishlist state via React Context, persisted to `localStorage` so
  they survive refreshes/navigation (see section 4 for the guest/no-auth
  caveat).
- `/cart` — line items with image, name, selected variant (if any), quantity
  stepper, remove button; coupon code field (`HALE10`, `WELCOME50` demo
  codes); order summary with subtotal, discount, shipping (free over ₹999,
  else ₹79 flat), and total; Continue Shopping + Proceed to Checkout
  buttons; empty-cart state.
- `/wishlist` — grid of saved products with remove button, "Move to Cart"
  for simple products or "Choose Options" link for products with variants,
  out-of-stock handling, empty-wishlist state, and a note that this is
  saved per-device as a guest until accounts exist.
- `ProductCard`'s wishlist heart and cart button, and the product detail
  page's Add to Cart / Buy Now / wishlist toggle, now all read and write
  real cart/wishlist state instead of the Phase 3 local-only stubs.
- Header cart and wishlist icons show live item counts (badge hidden at 0
  for wishlist, always shown for cart).

**Cross-cutting (this session, alongside Phase 4):**
- Switched the whole site from USD to **Indian Rupees (₹)** — currency
  formatting utility, all 24 product prices rescaled to realistic INR
  figures, and every hardcoded "$" shipping-threshold mention updated (see
  section 4 for full detail).
- Replaced the header search icon (which opened an empty `/search` page)
  with an always-visible search box in the header, with live product
  suggestions as you type — see section 4.

**Phase 5 — Backend + Database:**
- Node.js + Express API in `/backend`, fully separate npm project from
  `/frontend`. See `backend/README.md` for setup and a full endpoint table.
- MySQL schema (19 tables, `backend/src/db/schema.sql`) covering every
  entity in spec section 5, applied via `npm run db:schema`.
- Seed script (`npm run db:seed`) loads the **same** placeholder catalog the
  frontend already uses (dynamically imports `frontend/src/data/*.js`) —
  one source of truth for the 6 categories / 24 products / reviews, plus
  seeds 1 admin + 3 demo customers and the `HALE10`/`WELCOME50` coupons.
- Full REST API: auth (JWT, register/login/logout/me/forgot-reset password),
  categories, products (list with the same filter/sort/search vocabulary as
  the frontend, detail with images/specs/options/related/reviews), reviews,
  cart, wishlist, customer profile/addresses/order-history, orders
  (transactional creation from cart with stock validation and coupon
  application), coupon validation, and an admin surface (dashboard summary,
  order management incl. status/payment/shipment updates, customer
  management, review moderation) — all protected routes enforce
  authentication, admin-only routes additionally require `role = 'admin'`.
- **Backend-only phase — the frontend was not touched.** The React app
  still runs entirely on its own placeholder data and `localStorage`
  cart/wishlist; wiring it to this API is explicit future work (see
  section 9/10).

**Phase 6 — Authentication + Customer Account:**
- **First real frontend↔backend wiring.** `frontend/src/services/api.js`
  (fetch wrapper) + `AuthContext.jsx` (register/login/logout/change-password/
  forgot-reset-password/profile update, JWT persisted to `localStorage`,
  revalidated against `GET /auth/me` on load).
- `/login`, `/register`, `/forgot-password`, `/reset-password` — real pages
  calling the real backend, with inline field-level validation errors
  (backend's 422 `details` array mapped to per-field messages).
- `/account/*` protected by a new `ProtectedRoute` (redirects to `/login`,
  returns to the original destination after login) — `Profile` (edit name/
  phone, change password), `Addresses` (full CRUD), `Orders` (calls the
  real order-history endpoint; empty state until Phase 7 checkout exists).
- Backend gained one small additive endpoint this phase:
  `POST /api/auth/change-password` (Phase 5 only had the forgot/reset-via-
  email-token flow, not an in-session password change).
- Header's account icon/name is now auth-aware.
- **Cart/Wishlist were deliberately left unconnected to the backend in
  Phase 6 itself** — `CartContext.jsx`/`WishlistContext.jsx` were byte-for-
  byte unchanged from Phase 4 at the time. See section 4 ("Scope boundary")
  for the original reasoning. **Superseded the next day** — see below;
  once the catalog moved to the API this was no longer blocked and got
  done as part of the same follow-up step.

**Catalog + Cart/Wishlist Backend Integration (2026-09-15, unplanned step
— see section 4 for the full "why"):**
- Shop, Category, Search, Product Detail and Home all now fetch from the
  real `GET /api/products` / `GET /api/categories` endpoints — no more
  reads from `frontend/src/data/*.js` anywhere in the running app.
- Header's live search suggestions are now a real debounced API call.
- Cart and Wishlist are now genuinely dual-mode: guest behavior unchanged
  from Phase 4 (`localStorage`), but a logged-in user's cart/wishlist is
  now backed by the real `/api/cart`/`/api/wishlist` endpoints, with the
  guest cart/wishlist automatically merged into the server's on login.
- Three backend model files got small additive SQL changes (category info
  and a `has_options` flag joined onto product/cart/wishlist queries) to
  support this without needing extra round-trips per card — see section 4.
- Admin CRUD (Phase 9/10) can now proceed on the assumption that whatever
  an admin creates will actually be visible to shoppers, which wasn't true
  before this step.

**Phase 7 — Orders + Checkout:**
- `/checkout` — real, end-to-end: pick or add a shipping address, optional
  separate billing address, delivery-method info, payment method (Cash on
  Delivery functional; Card/UPI visibly marked "Coming Soon" rather than
  faked), order notes, real coupon validation, order summary, and a Place
  Order button that calls the backend's transactional order-creation
  endpoint (stock validated, totals computed server-side, cart cleared).
- `/order-success/:orderId` — real confirmation page, refetches the order
  so it survives a refresh instead of relying on fragile router state.
- `/account/orders/:id` — full order detail (status, payment status,
  shipping address, line items, totals, tracking info if a shipment
  exists); `Orders.jsx` rows now link here instead of being inert.
- `Cart.jsx`'s coupon field now calls the real `GET /api/coupons/validate`
  endpoint instead of checking against a hardcoded client-side object —
  same endpoint Checkout uses, so the two pages agree.
- Extracted three shared components (`OrderTotals`, `OrderStatusBadge`,
  `OrderItemsList`) so totals math and status styling aren't duplicated
  across Cart/Checkout/OrderSuccess/OrderDetail, and one shared
  `AddressForm` (extracted from `Addresses.jsx`) so Checkout's inline
  "add address" flow and the Account → Addresses page stay in sync.
- Checkout and order-confirmation routes require login (matching the
  backend), reusing the same `ProtectedRoute` as `/account/*` — a guest
  who tries to check out is sent to log in first and lands back on
  `/checkout` afterward, cart already merged.
- **Zero backend changes this phase** — Phase 5 had already built
  everything Checkout needed.

**Cart/Wishlist Merge Race Fix + Per-Variant "Go to Cart" State:**
- Fixed a real race condition in the guest→logged-in cart/wishlist merge
  (both contexts) that could drop guest items and/or leave newly-added
  items from failing to appear — root cause and fix are written up in
  detail in section 4. Guest cart/wishlist now reliably survive login,
  including under React StrictMode's double effect invocation in dev.
- Product detail page's Add to Cart button is now a persistent, per-variant
  "Go to Cart" once that exact Size/Color/etc. combination is confirmed in
  the cart — not a temporary flash, and correctly independent per variant
  (adding Size S doesn't affect the button state for Size XL of the same
  product). Shows a brief "Adding..." loading state in between.
- Small related fix: "Buy Now" no longer double-adds a line if the
  selected variant is already in the cart.

**Phase 8 — Payment + Shipping:**
- `/checkout` — Card/UPI/Netbanking is now a real, working option (no
  longer "Coming Soon"): selecting it places the order exactly as Cash on
  Delivery does, then opens Razorpay's Checkout widget inline on the same
  page. Success, dismissal, and failed attempts all land on the order
  confirmation page — the order always exists, payment may still be
  pending.
- Real Razorpay integration end-to-end: order creation
  (`POST /payments/razorpay/order`), client-side signature verification
  (`POST /payments/razorpay/verify`), and a server-to-server webhook
  (`POST /payments/razorpay/webhook`, `payment.captured`/`payment.failed`)
  as a second, independent confirmation channel.
- **"Complete Payment" retry** (`RazorpayPayButton.jsx`) — a self-hiding
  component shown on both `/order-success/:orderId` and
  `/account/orders/:id` whenever an order's Razorpay payment hasn't
  succeeded yet, so a dismissed or failed payment attempt is always
  recoverable without contacting support.
- **Minimal admin order-fulfillment screen** (`/admin/orders`,
  `/admin/orders/:id`, guarded by new `AdminRoute.jsx`) — the first actual
  frontend UI for the admin-only backend routes built in Phase 5: set
  order status, payment status, and carrier/tracking number/shipment
  status. Closes the loop on `OrderDetail.jsx`'s tracking display (built
  Phase 7, previously always empty since nothing could set those fields
  outside direct API calls). Deliberately scoped to orders only — no
  dashboard, nav, or other-resource CRUD; that was Phase 9/10 at the time.
- No database schema changes — reused the existing `payments.raw_response`
  JSON column. See section 4 for the full technical writeup.

**Phase 9 — Admin Dashboard:**
- **`AdminLayout.jsx`** — persistent sidebar nav shell for every `/admin/*`
  screen (Dashboard, Orders, Products, Categories, Customers, Coupons,
  Reviews + Log Out), mirroring the existing `AccountLayout.jsx` pattern.
  Phase 8's `/admin/orders` and `/admin/orders/:id` now live inside it
  instead of standing alone.
- **`/admin/dashboard`** — real dashboard summary screen: revenue (paid
  orders), total orders/customers/published-products stat cards, a recent-
  orders table linking into order detail, an orders-by-status breakdown,
  and a low-stock product list. Wired to `GET /admin/dashboard`, which has
  existed unused since Phase 5.
- **Admin auth** — no new work needed; Phase 8's `AdminRoute.jsx` guard
  (login + `isAdmin` check, redirect-back-to-origin via the existing Login
  page) covers the whole `/admin/*` tree as-is.
- Products/Categories/Customers/Coupons/Reviews have nav entries and a
  small "coming soon" placeholder screen each — real CRUD for these is
  Phase 10, not attempted here.
- No backend or database changes — pure frontend phase. See section 4 for
  the full technical writeup.

**Phase 10 — Admin CRUD + Inventory:**
- **`/admin/products`** — searchable, paginated product table (thumbnail,
  name/SKU, category, price with sale-price strike-through, stock,
  published/draft badge) with full create/edit (slug, name, description,
  category, SKU, price, sale price, stock, new/best-seller/featured/
  published flags, images, specs, and variant options), delete, and a
  quick stock-adjustment control per row. The admin list can now see
  unpublished/draft products too — see the backend note below.
- **`/admin/categories`** — full CRUD: name, slug, description, icon,
  accent color, image/banner URLs, active toggle, sort order.
- **`/admin/coupons`** — full CRUD: code, percent/fixed discount type and
  value, optional minimum order amount and usage limit, optional start/
  expiry dates, active toggle. List shows current usage against the limit.
- **`/admin/reviews`** — moderation queue with All/Pending/Approved/
  Rejected filter tabs (defaulting to Pending), each review showing the
  linked product, reviewer, star rating, and comment, with Approve/Reject/
  Delete actions. Approving/rejecting/deleting a review automatically
  recomputes that product's displayed rating and review count (existing
  Phase 5 backend behavior, no new frontend work needed for it).
- **`/admin/customers`** + **`/admin/customers/:id`** (new nested route) —
  customer list with a quick Activate/Disable toggle, and a detail page
  showing profile info plus full order history linking into the existing
  admin order-detail screen.
- **One small backend change**: `GET /api/products` can now return
  unpublished products, but only for an authenticated admin request
  (`publishedOnly=false` is ignored for everyone else) — see section 4 for
  the full reasoning. No other backend or schema changes.

## 9. Known issues / TODOs

- **Redesign is untested in a browser.** First test: `npm install && npm run
  dev`, check the console, then home (hero autoplay/arrows, category grid,
  best-seller pills + scroll buttons, showcases), header search (+ category
  select), cart/wishlist badges, shop filters/sticky sidebar, product page,
  cart -> checkout, account, admin screens, and widths ~375 / 768 / 1280.
  Watch icon sizes/alignment (Material glyphs vs old FontAwesome) and the
  Login/Register show-password toggle position.
- Home/header/footer content (phone, address, products, prices) is the reference's static demo content (Anurag Traders / Crompton); replace when real content is decided.

- **Phase 8 has been tested and confirmed working locally by the user.**
  Phase 9 and Phase 10 have not been — same sandbox limitations as always
  (no network, no MySQL, no browser here). **Highest-value smoke test
  now:** log in as the seeded admin account (see `backend/README.md`'s
  demo logins table) and work through every `/admin/*` screen:
  - `/admin/products` — create a product, edit it (confirm the multi-line
    images/specs/options fields round-trip correctly), toggle it
    unpublished and confirm it disappears from `/shop` but still shows in
    the admin list, adjust its stock via the quick prompt, then delete a
    test product.
  - `/admin/categories` — create/edit/delete a category, confirm an
    inactive category drops off the storefront header/shop filters.
  - `/admin/coupons` — create a coupon, confirm it validates at Cart and
    Checkout, then edit and delete it.
  - `/admin/reviews` — submit a review as a logged-in customer first
    (there's still no review-submission UI, so this needs a direct API
    call or Postman — see below), then approve/reject/delete it from
    `/admin/reviews` and confirm the product's rating/review count on its
    detail page updates.
  - `/admin/customers` — open a customer's detail page, confirm order
    history renders and links to the right admin order, then disable the
    account and confirm that account can no longer log in (re-enable
    afterward).
  - Also confirm a non-admin account still gets redirected away from
    `/admin/*` entirely (unchanged from Phase 8/9, but worth re-checking
    now that there are more admin routes).
- **Individual cart/wishlist mutations still don't surface errors to the
  user** — if a single `addItem`/`removeItem`/etc. API call fails while
  logged in (as opposed to the merge-on-login flow, which is now fixed and
  hardened against partial failures), the UI just silently doesn't update
  rather than showing an error message. Guest mode is unaffected
  (synchronous local state, can't fail this way). Worth fixing in the
  Phase 11 validation/error-handling audit.
- **`order_items` has no product image or slug** — only a name/price/
  quantity/options snapshot — so the order confirmation, order-detail and
  account order-history pages all show text-only line items, no thumbnails
  and no click-through back to the product. Would need `orderModel` to
  either join through `product_id` (when the product still exists) or
  snapshot an image URL at order-creation time; flagged as a nice-to-have,
  not done this phase.
- **Reference site could not be fetched** from this environment
  (`https://darkslateblue-turkey-580746.hostingersite.com/` returned a fetch
  error each attempt). Category/product names, counts and copy are original
  placeholders, not derived from the reference site's actual catalog. If you
  can share the real category/product list (screenshots, exported CSV, or a
  working URL), a future phase can align the data model and content (and
  therefore the seed data) to the real catalog.
- Product/category images are Lorem Picsum placeholder photography (random,
  not semantically matched to the product) — swap `image`/`images`/`banner`
  fields in `frontend/src/data/products.js` / `categories.js` for real
  photography once available; re-running `npm run db:seed` will carry the
  new URLs into the database automatically. Editing those files no longer
  has any direct effect on the running app, only on what gets seeded next.
  The new admin Products screen is a second, more direct way to set a
  product's images now too (see Phase 10 above) — either path works, and
  they write to the same `product_images` table.
- Newsletter forms (footer + homepage) are front-end only, no submission
  endpoint exists (not part of the spec's API list — would need a
  `site_settings`/subscribers table added if this is wanted for real).
- Promo banners are static (no live countdown timer).
- "Popularity" sort uses `review_count` as a stand-in for a real sales-count
  metric on both frontend and backend — revisit if a real sales/analytics
  metric is wanted later.
- **Payment gateway is real (Razorpay) and confirmed working by the user's
  own local testing of Phase 8.**
- **Razorpay webhook is still untested against a real endpoint** — needs a
  publicly reachable URL (e.g. `ngrok http 4000` locally) registered in
  the Razorpay Dashboard before it can receive real events; without that,
  the app still works correctly via the client-side verify path alone
  (see section 4), so this isn't blocking, just not yet proven end-to-end.
- **Admin order-fulfillment page (`/admin/orders`) is minimal by design**
  (Phase 8 scope only, nested inside `AdminLayout` since Phase 9) — no
  pagination/filtering/search on the order list, no bulk actions, shipment
  status is a free-text field (matches the schema, which has no enum for
  it) rather than a curated dropdown. Not revisited in Phase 10 either;
  still open for a future polish pass.
- **Admin Products screen's multi-value fields (images/specs/options) are
  plain-text, line-based inputs, not a dynamic add/remove-row UI** — a
  deliberate scope cut this phase to keep the form in one file (see
  section 4). Functional and round-trips correctly, but less polished
  than a proper repeating-field component would be; worth a UI pass in a
  future phase if it proves awkward in practice.
- **Admin product list pagination is basic** (`Prev`/`Next`, no page-number
  jump, no adjustable page size beyond the hardcoded 20/page) — matches
  the level of polish the Phase 8 admin orders screen already had; fine
  for now, revisit alongside that screen's own "still open" pagination
  note above if either becomes a real pain point.
- **Dashboard's low-stock threshold and "published products" definition
  are whatever `adminController.js` already hardcoded back in Phase 5** —
  not reviewed or changed in Phase 9 or 10; worth a look if the numbers on
  `/admin/dashboard` look off once tested against real seeded data.
- **No "write a review" form yet** — `POST /products/:slug/reviews` exists
  and is protected correctly, and the new `/admin/reviews` screen can
  moderate whatever comes in, but no frontend page actually submits a
  review yet; reviews are still read-only on the product page for
  shoppers. Testing the new moderation queue therefore requires seeding or
  submitting a review some other way first (see the smoke-test note
  above). Worth picking up in a future phase — not part of Phase 10's
  admin-CRUD scope as defined in section 3.
- **No real email sending** — password reset returns the token directly in
  the API response outside production mode; needs a real email provider
  before production. The frontend's `ForgotPassword` page surfaces this
  dev-only token as a clickable link for local testing.
- No automated tests yet (planned Phase 13).

## 10. Exact next phase to execute

**Phase 11 — Security + Validation + Error Handling (audit pass):** a
review pass across both apps rather than new features — go through the
backend's existing `express-validator` rules for gaps, audit error
responses for consistency (the central `errorHandler.js` and each
controller's `ApiError` usage), surface individual cart/wishlist mutation
failures to the user instead of silently no-op'ing (flagged in section 9),
decide on rate limiting / brute-force protection for `/auth/login`, and
review the admin surface added in Phase 9/10 for anything that needs
tighter validation (e.g. the Products admin form's free-text images/specs/
options fields accept arbitrary text with no server-side shape validation
beyond what `productModel.replace*` already enforces via SQL). Everything
in section 9's "Known issues / TODOs" that mentions Phase 11 by name is
in scope for this phase.

**PHASE 10 IS COMPLETE; FRONTEND REDESIGN COMPLETE — WAITING FOR TESTING.**

## 11. Setup commands / environment variables

**Backend first** — required for login/register/account pages to work at
all, since Phase 6 added real API calls:

```bash
cd backend
npm install
cp .env.example .env
# edit .env: DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME, JWT_SECRET, CORS_ORIGIN
# also (Phase 8): RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET — get test-mode keys
# from the Razorpay Dashboard; RAZORPAY_WEBHOOK_SECRET is optional locally.
# See backend/README.md's "Payments (Phase 8 — Razorpay)" section for detail.

mysql -u root -p -e "CREATE DATABASE hale_ecommerce CHARACTER SET utf8mb4;"
npm run db:schema   # create all 19 tables
npm run db:seed     # seed from frontend/src/data/*.js — demo logins printed at the end

npm run dev          # http://localhost:4000, nodemon auto-restart
# or: npm start      # plain node
```

`GET http://localhost:4000/health` → `{"status":"ok"}` confirms the API is
running. See `backend/README.md` for the full endpoint reference and demo
login table.

**Frontend:**

```bash
cd frontend
cp .env.example .env.local
# defaults to http://localhost:4000/api — only edit if your backend runs elsewhere
# also (Phase 8): VITE_RAZORPAY_KEY_ID must match backend's RAZORPAY_KEY_ID
# (public key id only — never the secret)

npm install
npm run dev       # http://localhost:5173
npm run build      # production build to frontend/dist
npm run preview    # preview the production build
```

**The backend must be running for essentially the whole site now**, not
just auth — as of the catalog/cart/wishlist integration step, Shop/
Category/Search/Product Detail/Home/Cart/Wishlist/Checkout all fetch from
the API too, not just `/account/*`. There's no more "frontend works
standalone" mode; a backend + database is required to see anything beyond
the empty shell.

Node 18+ recommended for both apps (built with Node 22 tooling
assumptions, but Vite 5 and this Express setup both support Node 18+).


