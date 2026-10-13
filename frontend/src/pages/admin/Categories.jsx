import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

const EMPTY_FORM = {
  parentId: "",
  slug: "",
  name: "",
  description: "",
  icon: "",
  accentColor: "",
  imageUrl: "",
  bannerUrl: "",
  isActive: true,
  sortOrder: 0,
};

// Parents a category may be moved under: not itself, not anything in its own
// subtree, and not a node that is already at the maximum depth. `flat` is the
// tree-ordered list from GET /categories?flat=true, so a node's descendants are
// the rows that follow it with a greater depth. (The API re-validates all of
// this, including the combined depth of the moved subtree.)
const MAX_DEPTH = 3;
function parentChoices(flat, editingId) {
  const blocked = new Set();
  if (editingId) {
    const start = flat.findIndex((c) => c.id === editingId);
    if (start !== -1) {
      blocked.add(flat[start].id);
      for (let i = start + 1; i < flat.length && flat[i].depth > flat[start].depth; i += 1) {
        blocked.add(flat[i].id);
      }
    }
  }
  return flat.filter((c) => !blocked.has(c.id) && c.depth < MAX_DEPTH);
}

function toForm(category) {
  return {
    parentId: category.parent_id ? String(category.parent_id) : "",
    slug: category.slug,
    name: category.name,
    description: category.description || "",
    icon: category.icon || "",
    accentColor: category.accent_color || "",
    imageUrl: category.image_url || "",
    bannerUrl: category.banner_url || "",
    isActive: Boolean(category.is_active),
    sortOrder: category.sort_order ?? 0,
  };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadCategories() {
    setLoading(true);
    setListError("");
    try {
      const res = await api.get("/categories?flat=true");
      setCategories(res.data);
    } catch (err) {
      setListError(err.message || "Couldn't load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAddForm(parent) {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, parentId: parent ? String(parent.id) : "" });
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(category) {
    setEditingId(category.id);
    setForm(toForm(category));
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
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
      parentId: form.parentId ? Number(form.parentId) : null,
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      accentColor: form.accentColor.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      bannerUrl: form.bannerUrl.trim() || null,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
      } else {
        await api.post("/categories", payload);
      }
      closeForm();
      await loadCategories();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setFormError(err.message || "Couldn't save this category.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete "${category.name}"? This can't be undone.`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      await loadCategories();
    } catch (err) {
      setListError(err.message || "Couldn't delete this category.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Categories
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create, edit, and reorder storefront categories and their subcategories.
          </p>
        </div>
        {!formOpen && (
          <Button variant="primary" size="sm" onClick={() => openAddForm()}>
            <Icon name="plus" className="text-[14px]" />
            New Category
          </Button>
        )}
      </div>

      {listError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      {formOpen && (
        <div className="mt-6 rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
          <h2 className="mb-4 font-display text-base font-bold text-neutral-900">
            {editingId ? "Edit category" : "New category"}
          </h2>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="cat-name"
                label="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={fieldErrors.name}
                required
              />
              <TextField
                id="cat-slug"
                label="Slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                error={fieldErrors.slug}
                placeholder="e.g. electronics"
                required
              />
            </div>

            <div>
              <label htmlFor="cat-parent" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Parent category
              </label>
              <select
                id="cat-parent"
                value={form.parentId}
                onChange={(e) => updateField("parentId", e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                  fieldErrors.parentId
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-neutral-200 focus:border-brand-500"
                }`}
              >
                <option value="">None (top-level category)</option>
                {parentChoices(categories, editingId).map((c) => (
                  <option key={c.id} value={c.id}>
                    {`${"— ".repeat(c.depth - 1)}${c.name}`}
                  </option>
                ))}
              </select>
              {fieldErrors.parentId && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.parentId}</p>
              )}
            </div>

            <div>
              <label htmlFor="cat-description" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                id="cat-description"
                rows={2}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="cat-icon"
                label="Icon (FontAwesome-mapped name)"
                value={form.icon}
                onChange={(e) => updateField("icon", e.target.value)}
                placeholder="e.g. hanger"
              />
              <TextField
                id="cat-accent"
                label="Accent color"
                value={form.accentColor}
                onChange={(e) => updateField("accentColor", e.target.value)}
                placeholder="e.g. #005cba"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="cat-image"
                label="Image URL"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
              <TextField
                id="cat-banner"
                label="Banner URL"
                value={form.bannerUrl}
                onChange={(e) => updateField("bannerUrl", e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <TextField
                id="cat-sort"
                type="number"
                label="Sort order"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
                containerClassName="w-32"
              />
              <label className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                />
                Active (visible on the storefront)
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting && <Icon name="spinner" className="animate-spin" />}
                {submitting ? "Saving..." : "Save Category"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading categories...</p>}

      {!loading && categories.length === 0 && !formOpen && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="tags" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">No categories yet.</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Sort</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-semibold text-neutral-900">
                    <span style={{ paddingLeft: `${(category.depth - 1) * 20}px` }}>
                      {category.depth > 1 && <span className="mr-1.5 text-neutral-300">└</span>}
                      {category.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{category.slug}</td>
                  <td className="px-5 py-3 text-neutral-500">{category.sort_order}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        category.is_active
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3 text-xs font-semibold">
                      {category.depth < MAX_DEPTH && (
                        <button
                          type="button"
                          onClick={() => openAddForm(category)}
                          className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
                        >
                          <Icon name="plus" className="text-[14px]" />
                          Subcategory
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditForm(category)}
                        className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
                      >
                        <Icon name="pencil" className="text-[14px]" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
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
        </div>
      )}
    </div>
  );
}
