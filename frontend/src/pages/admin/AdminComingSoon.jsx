import { Link } from "react-router-dom";
import Icon from "../../components/ui/Icon.jsx";

/**
 * The backend endpoints for some of these (customers, reviews) already
 * exist (Phase 5) but have no admin UI yet — that UI, plus full CRUD for
 * products/categories/coupons, is Phase 10's job. This just keeps the
 * Phase 9 nav honest about what's actually built versus what's next,
 * instead of a 404 or a dead link.
 */
export default function AdminComingSoon({ title }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">In progress</p>
      <h2 className="font-display text-2xl font-bold text-neutral-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500">
        This admin screen is scheduled for an upcoming phase and isn&apos;t built yet.
      </p>
      <Link
        to="/admin/dashboard"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
      >
        <Icon name="chevronLeft" className="text-[16px]" />
        Back to Dashboard
      </Link>
    </div>
  );
}
