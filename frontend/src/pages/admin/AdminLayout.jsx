import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/ui/Icon.jsx";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "gauge" },
  { to: "/admin/orders", label: "Orders", icon: "box" },
  { to: "/admin/products", label: "Products", icon: "hanger" },
  { to: "/admin/categories", label: "Categories", icon: "tags" },
  { to: "/admin/customers", label: "Customers", icon: "users" },
  { to: "/admin/coupons", label: "Coupons", icon: "ticket" },
  { to: "/admin/reviews", label: "Reviews", icon: "comment" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
            Admin
          </h1>
          {user && <p className="mt-1 text-sm text-neutral-500">Signed in as {user.email}</p>}
        </div>
        <NavLink
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <Icon name="chevronLeft" className="text-[16px]" />
          Back to Store
        </NavLink>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`
                }
              >
                <Icon name={item.icon} className="text-[16px]" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Icon name="signOut" className="text-[16px]" />
              Log Out
            </button>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
