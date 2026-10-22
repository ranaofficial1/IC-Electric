import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import { formatPrice } from "../../utils/formatPrice.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

const EMPTY_FORM = {
  slug: "",
  name: "",
  description: "",
  categoryId: "",
  subcategoryId: "",
  sku: "",
  price: "",
  salePrice: "",
  stock: "0",
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  isPublished: true,
  imagesText: "",
  specsText: "",
  optionsText: "",
};

// Multi-value fields are edited as plain text (one item per line) rather
// than dynamic add/remove rows — keeps the form simple while still hitting
// every field the backend's create/update endpoints accept.
// An image line is either a plain URL (shared by every variant) or
// "Color value | URL" (shown only when that color is selected on the product page).
function imagesToText(images = [], optionValues = []) {
  return images
    .map((url, i) => (optionValues[i] ? `${optionValues[i]} | ${url}` : url))
    .join("\n");
}
function textToImages(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^|/:]+?)\s*\|\s*(\S.*)$/);
      return match ? { url: match[2].trim(), optionValue: match[1].trim() } : line;
    });
}

function specsToText(specs = {}) {
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}
function textToSpecs(text) {
  const specs = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) specs[key] = value;
  }
  return specs;
}

function optionsToText(options = []) {
  return options.map((opt) => `${opt.name}: ${(opt.values || []).join(", ")}`).join("\n");
}
function textToOptions(text) {
  const options = [];
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const name = line.slice(0, idx).trim();
    const values = line
      .slice(idx + 1)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (name) options.push({ name, values });
  }
  return options;
}

// `flat` is the tree-ordered category list from GET /categories?flat=true
// (depth-first, each row has `depth`), so a category's descendants are the
// rows that follow it until the depth drops back to its own level.
function descendantsOf(flat, categoryId) {
  const start = flat.findIndex((c) => String(c.id) === String(categoryId));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < flat.length && flat[i].depth > flat[start].depth; i += 1) {
    out.push(flat[i]);
  }
  return out;
}

function toForm(product) {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description || "",
    categoryId: String(product.category_id),
    subcategoryId: product.subcategory_id ? String(product.subcategory_id) : "",
    sku: product.sku || "",
    price: product.price,
    salePrice: product.sale_price ?? "",
    stock: product.stock,
    isNew: Boolean(product.is_new),
    isBestSeller: Boolean(product.is_best_seller),
    isFeatured: Boolean(product.is_featured),
    isPublished: Boolean(product.is_published),
    imagesText: imagesToText(product.images, product.imageOptionValues),
    specsText: specsToText(product.specs),
    optionsText: optionsToText(product.options),
  };
}

export default function AdminProducts() {
  // All categories incl. inactive ones, flat and tree-ordered (admin-only view).
  const [allCategories, setAllCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const categories = allCategories.filter((c) => c.depth === 1);
  const subcategoryOptions = descendantsOf(allCategories, form.categoryId);

  useEffect(() => {
    api
      .get("/categories?flat=true")
      .then((res) => setAllCategories(res.data))
      .catch(() => setAllCategories([]));
  }, []);

  async function loadProducts() {
    setLoading(true);
    setListError("");
    try {
      const params = new URLSearchParams({
        publishedOnly: "false",
        limit: "20",
        page: String(page),
        sort: "newest",
      });
      if (search.trim()) params.set("q", search.trim());
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setListError(err.message || "Couldn't load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    loadProducts();
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  async function openEditForm(product) {
    setEditingId(product.id);
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
    setFormLoading(true);
    try {
      // The list row doesn't include images/specs/options — fetch the full
      // record (same shape the storefront product-detail page gets).
      const res = await api.get(`/products/${product.slug}`);
      setForm(toForm(res.data));
    } catch (err) {
      setFormError(err.message || "Couldn't load this product's full details.");
    } finally {
      setFormLoading(false);
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      categoryId: Number(form.categoryId),
      subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      sku: form.sku.trim() || null,
      price: Number(form.price) || 0,
      salePrice: form.salePrice !== "" ? Number(form.salePrice) : null,
      stock: Number(form.stock) || 0,
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      images: textToImages(form.imagesText),
      specs: textToSpecs(form.specsText),
      options: textToOptions(form.optionsText),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      closeForm();
      await loadProducts();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setFormError(err.message || "Couldn't save this product.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      await loadProducts();
    } catch (err) {
      setListError(err.message || "Couldn't delete this product.");
    }
  }

  async function handleAdjustStock(product) {
    const input = window.prompt(
      `Adjust stock for "${product.name}" (current: ${product.stock}).\nEnter a positive number to add stock, negative to remove:`,
      "0"
    );
    if (input === null) return;
    const changeQty = Number(input);
    if (!Number.isInteger(changeQty) || changeQty === 0) return;

    try {
      await api.patch(`/products/${product.id}/stock`, {
        changeQty,
        reason: "Manual admin adjustment",
      });
      await loadProducts();
    } catch (err) {
      setListError(err.message || "Couldn't adjust stock.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create and manage the catalog, including stock and publish status.
          </p>
        </div>
        {!formOpen && (
          <Button variant="primary" size="sm" onClick={openAddForm}>
            <Icon name="plus" className="text-[14px]" />
            New Product
          </Button>
        )}
      </div>

      {!formOpen && (
        <form onSubmit={handleSearchSubmit} className="mt-5 flex max-w-sm gap-2">
          <TextField
            id="product-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            containerClassName="flex-1"
          />
          <Button type="submit" variant="secondary" size="md">
            <Icon name="search" className="text-[16px]" />
          </Button>
        </form>
      )}

      {listError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      {formOpen && (
        <div className="mt-6 rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
          <h2 className="mb-4 font-display text-base font-bold text-neutral-900">
            {editingId ? "Edit product" : "New product"}
          </h2>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formLoading ? (
            <p className="text-sm text-neutral-400">Loading product...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  id="p-name"
                  label="Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  error={fieldErrors.name}
                  required
                />
                <TextField
                  id="p-slug"
                  label="Slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  error={fieldErrors.slug}
                  required
                />
              </div>

              <div>
                <label htmlFor="p-description" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <textarea
                  id="p-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-category" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Category
                  </label>
                  <select
                    id="p-category"
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                      fieldErrors.categoryId
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-neutral-200 focus:border-brand-500"
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.categoryId && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.categoryId}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="p-subcategory" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Subcategory
                  </label>
                  <select
                    id="p-subcategory"
                    value={form.subcategoryId}
                    onChange={(e) => updateField("subcategoryId", e.target.value)}
                    disabled={subcategoryOptions.length === 0}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400 ${
                      fieldErrors.subcategoryId
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-neutral-200 focus:border-brand-500"
                    }`}
                  >
                    <option value="">
                      {subcategoryOptions.length === 0 ? "No subcategories" : "None (directly under category)"}
                    </option>
                    {subcategoryOptions.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {`${"— ".repeat(sub.depth - 2)}${sub.name}`}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.subcategoryId && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.subcategoryId}</p>
                  )}
                </div>
                <TextField
                  id="p-sku"
                  label="SKU (optional)"
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextField
                  id="p-price"
                  type="number"
                  label="Price (₹)"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  error={fieldErrors.price}
                  min="0"
                  required
                />
                <TextField
                  id="p-sale-price"
                  type="number"
                  label="Sale price (optional)"
                  value={form.salePrice}
                  onChange={(e) => updateField("salePrice", e.target.value)}
                  error={fieldErrors.salePrice}
                  min="0"
                />
                <TextField
                  id="p-stock"
                  type="number"
                  label="Stock"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  error={fieldErrors.stock}
                  min="0"
                />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  ["isNew", "New arrival"],
                  ["isBestSeller", "Best seller"],
                  ["isFeatured", "Featured"],
                  ["isPublished", "Published (visible on storefront)"],
                ].map(([field, label]) => (
                  <label key={field} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form[field]}
                      onChange={(e) => updateField(field, e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div>
                <label htmlFor="p-images" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Image URLs (one per line; prefix with "Color | " to show only for that color)
                </label>
                <textarea
                  id="p-images"
                  rows={3}
                  value={form.imagesText}
                  onChange={(e) => updateField("imagesText", e.target.value)}
                  placeholder={"Black | https://.../black-1.jpg\nWhite | https://.../white-1.jpg"}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-mono text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="p-specs" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Specifications (one per line, "Key: Value")
                </label>
                <textarea
                  id="p-specs"
                  rows={3}
                  value={form.specsText}
                  onChange={(e) => updateField("specsText", e.target.value)}
                  placeholder={"Material: Cotton\nWeight: 250g"}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-mono text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="p-options" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Variant options (one per line, "Name: value1, value2, ...")
                </label>
                <textarea
                  id="p-options"
                  rows={2}
                  value={form.optionsText}
                  onChange={(e) => updateField("optionsText", e.target.value)}
                  placeholder={"Size: S, M, L, XL\nColor: Black, White"}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-mono text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting && <Icon name="spinner" className="animate-spin" />}
                  {submitting ? "Saving..." : "Save Product"}
                </Button>
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading products...</p>}

      {!loading && products.length === 0 && !formOpen && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="hanger" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">No products found.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-contain"
                        />
                      )}
                      <div>
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-neutral-900 hover:text-brand-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                        {product.sku && <p className="text-xs text-neutral-400">{product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {product.category_name}
                    {product.subcategory_name && (
                      <span className="text-neutral-400"> › {product.subcategory_name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {product.sale_price ? (
                      <>
                        <span className="font-semibold text-neutral-900">
                          {formatPrice(Number(product.sale_price))}
                        </span>{" "}
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(Number(product.price))}
                        </span>
                      </>
                    ) : (
                      formatPrice(Number(product.price))
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(product)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold hover:opacity-80 ${
                        product.stock === 0
                          ? "bg-rose-50 text-rose-600"
                          : product.stock <= 10
                          ? "bg-amber-50 text-amber-600"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                      title="Click to adjust stock"
                    >
                      {product.stock}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.is_published
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {product.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
                      >
                        <Icon name="pencil" className="text-[14px]" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700"
                      >
                        <Icon name="trash" className="text-[14px]" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3 text-xs text-neutral-500">
              <span>
                Page {meta.page} of {meta.totalPages} · {meta.total} products
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
