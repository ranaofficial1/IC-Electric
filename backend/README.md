# Hale API — Backend

Node.js + Express + MySQL backend for the Hale storefront (see
`../PROJECT_PROGRESS.md` for full project status and decisions).

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your local MySQL credentials

# 1. Create an empty database matching DB_NAME in .env, e.g.:
mysql -u root -p -e "CREATE DATABASE hale_ecommerce CHARACTER SET utf8mb4;"

# 2. Apply the schema
npm run db:schema

# 2b. EXISTING database created before subcategories existed? Also run:
npm run db:migrate   # idempotent — adds categories.parent_id + products.subcategory_id

# 3. Seed the real Anurag Traders catalog (src/db/catalogData.js): 6 categories,
#    18 subcategories, 20 products, plus 2 demo coupons and 1 admin + 3 customer
#    accounts. Insert-if-missing: safe to re-run, never overwrites existing rows.
npm run db:seed

# 4. Start the API
npm run dev       # http://localhost:4000 (nodemon, auto-restarts)
# or: npm start   # plain node, no auto-restart
```

`GET http://localhost:4000/health` should return `{"status":"ok"}` once
it's running.

### Demo logins (created by `npm run db:seed`)

| Role     | Email               | Password           |
|----------|---------------------|---------------------|
| Admin    | admin@hale.test     | AdminPass123!       |
| Customer | priya@example.com   | CustomerPass123!    |
| Customer | rohan@example.com   | CustomerPass123!    |
| Customer | ananya@example.com  | CustomerPass123!    |

Change these before deploying anywhere real.

## Project structure

```
backend/
├── .env.example
├── package.json
└── src/
    ├── server.js          # entry point
    ├── app.js             # Express app: middleware + route mounting
    ├── config/
    │   ├── db.js          # mysql2 connection pool
    │   └── razorpay.js    # lazily-instantiated Razorpay SDK client (Phase 8)
    ├── db/
    │   ├── schema.sql      # full table definitions
    │   ├── runSchema.js    # applies schema.sql (npm run db:schema)
    │   └── seed.js         # seeds the real catalog from catalogData.js (npm run db:seed)
    ├── middleware/
    │   ├── auth.js         # requireAuth / optionalAuth / requireAdmin
    │   ├── validate.js     # express-validator error formatting
    │   └── errorHandler.js # centralized error + 404 handling
    ├── models/             # one file per table/entity, raw parameterized SQL
    ├── controllers/        # request handling + response shaping
    ├── routes/             # one file per resource, mounted in routes/index.js
    └── utils/
```

No ORM — plain `mysql2` with parameterized queries throughout, kept
deliberately simple and auditable. See `PROJECT_PROGRESS.md` section 4 for
the reasoning behind this and other schema/API decisions.

## API overview

All routes are mounted under `/api`. Protected routes require
`Authorization: Bearer <token>` from `/api/auth/login` or `/api/auth/register`.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` 🔒, `GET /auth/me` 🔒, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password` 🔒 |
| Categories | `GET /categories` (top-level categories with nested `children`; `?flat=true` = every category as a tree-ordered list with `depth`), `GET /categories/:slug` (+ `children`, `ancestors`), `POST/PUT/DELETE /categories` 🔒👑 — send `parentId` to make a subcategory (max 3 levels; delete is refused with 409 while it has subcategories or products) |
| Products | `GET /products` (filter/sort/paginate — see query params below), `GET /products/:slug`, `POST/PUT/DELETE /products` 🔒👑, `PATCH /products/:id/stock` 🔒👑 |
| Reviews | `GET /products/:slug/reviews`, `POST /products/:slug/reviews` 🔒 |
| Cart | `GET /cart` 🔒, `POST /cart/items` 🔒, `PUT /cart/items/:itemId` 🔒, `DELETE /cart/items/:itemId` 🔒, `DELETE /cart` 🔒 |
| Wishlist | `GET /wishlist` 🔒, `POST /wishlist/items` 🔒, `DELETE /wishlist/items/:productId` 🔒 |
| Customer | `GET/PUT /customers/me` 🔒, `GET/POST/PUT/DELETE /customers/me/addresses` 🔒, `GET /customers/me/orders` 🔒 |
| Orders | `POST /orders` 🔒 (creates from current cart), `GET /orders` 🔒, `GET /orders/:id` 🔒 |
| Payments (Phase 8) | `POST /payments/razorpay/order` 🔒 (creates a Razorpay order for an existing order), `POST /payments/razorpay/verify` 🔒 (verifies the client-side payment signature), `POST /payments/razorpay/webhook` (server-to-server, Razorpay calls this directly — not authenticated, verified by signature instead) |
| Coupons | `GET /coupons/validate?code=..&subtotal=..`, `GET/POST/PUT/DELETE /coupons` 🔒👑 |
| Admin | `GET /admin/dashboard` 🔒👑, `GET/PATCH /admin/orders/*` 🔒👑, `GET/PATCH /admin/customers/*` 🔒👑, `GET/PATCH/DELETE /admin/reviews/*` 🔒👑 |

🔒 = requires login · 👑 = requires admin role

**Subcategories:** `products.category_id` is always the top-level category and
`products.subcategory_id` the specific subcategory (or `NULL`). `POST/PUT
/products` accept `categoryId` and/or `subcategoryId` and store both correctly;
product responses include `subcategory_slug` / `subcategory_name`.

**`GET /products` query params:** `category` (comma-separated slugs — each may
be a category or a subcategory; a category also matches everything under it), `q`
(text search), `minPrice`, `maxPrice`, `saleOnly`, `newOnly`,
`bestSellersOnly` (all `"true"`/omit), `sort`
(`newest`\|`price-asc`\|`price-desc`\|`popularity`), `page`, `limit` — this
mirrors `filterAndSortProducts()` in the frontend's `data/products.js` so
the frontend can be pointed at this API later with minimal changes.

## Payments (Phase 8 — Razorpay)

Cash on Delivery needs no setup. For Card/UPI/Netbanking via Razorpay:

```bash
# in backend/.env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-test-key-secret
RAZORPAY_WEBHOOK_SECRET=   # optional locally — see below
```

1. Get test-mode keys from the Razorpay Dashboard → **Settings → API Keys**
   (no live/business verification needed for test mode).
2. Restart the backend after editing `.env` — the SDK client is created
   lazily on first use, so a missing key only breaks payment routes, not
   the whole server.
3. Frontend also needs the same key **id** (never the secret) in
   `frontend/.env.local` as `VITE_RAZORPAY_KEY_ID` — see `frontend/README`/
   `.env.example`.
4. **Webhook (optional locally, recommended before production):** Razorpay
   Dashboard → **Settings → Webhooks** → add
   `{your public API URL}/api/payments/razorpay/webhook`, subscribe to
   `payment.captured` and `payment.failed`, copy the generated secret into
   `RAZORPAY_WEBHOOK_SECRET`. To test this against `localhost` you'll need
   a tunnel (e.g. `ngrok http 4000`) since Razorpay's servers can't reach
   your machine directly. Without a webhook configured, payments still work
   end-to-end via the client-side verify step (`POST /payments/razorpay/verify`,
   itself signature-checked) — the webhook is a second, server-to-server
   confirmation that catches the case where a shopper closes the tab right
   after paying, before the client-side verify call fires.
5. Test-mode card numbers/UPI IDs for trying the flow without a real
   payment: see Razorpay's own [test card docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

## Deploying

**`npm start` (`src/server.js`) works as-is on any traditional Node host**
(Render, Railway, a plain VPS, etc.) — nothing below is required there.

### Deploying to Vercel (serverless)

Vercel runs Node code as short-lived serverless functions rather than one
long-running process, so two extra files exist just for that:

- **`api/index.js`** — wraps the same `src/app.js` Express app (used
  as-is by `server.js` too) with [`serverless-http`](https://www.npmjs.com/package/serverless-http),
  so no route/controller/middleware code had to change. It also disables
  Vercel's own automatic JSON body-parsing (`module.exports.config`),
  because the Razorpay webhook route needs the exact raw request bytes for
  its signature check — see the comments in that file for the full
  reasoning.
- **`vercel.json`** — routes every incoming request to `api/index.js`
  (Vercel's classic `builds`/`routes` config, not the newer file-system
  based one, since this isn't a Next.js app).

**To deploy:** import this repo into Vercel with **Root Directory set to
`backend`**, then add every variable from `.env.example` under
**Settings → Environment Variables** (same variables, same meanings — set
`CORS_ORIGIN` to your deployed frontend's real URL). One extra tuning
knob matters here specifically: set **`DB_CONNECTION_LIMIT` low (e.g.
`2`)** — see the comment in `src/config/db.js` for why a serverless
platform running several function instances at once needs a much smaller
per-instance pool than a single always-on server does. Run
`npm run db:schema` / `npm run db:seed` once, from your own machine
pointed at the same database, before or after the first deploy — Vercel
itself never runs these for you.

**Not yet verified end-to-end** (no network access in the environment
these files were written in) — the Razorpay webhook's raw-body handling
in particular is worth testing for real once deployed (send a test event
from the Razorpay Dashboard's webhook settings and confirm it's accepted,
not rejected with a signature-mismatch error).

## Not implemented yet (by design, this phase)

- No real email sending (password reset returns the token directly in the
  API response in non-production mode — see the comment in
  `controllers/authController.js`).
- No automated tests (Phase 13).
- No admin UI for products/categories/customers/coupons/reviews yet
  (Phase 9/10) — `/admin/orders` (status, payment-status, shipment/tracking)
  is the one minimal admin screen the frontend has so far, added in Phase 8
  specifically to close the loop on setting shipment tracking info; the
  full admin dashboard/nav/other-resource CRUD is still Phase 9/10's job.
