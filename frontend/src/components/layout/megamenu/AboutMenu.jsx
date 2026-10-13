import { Link } from "react-router-dom";
import { ROUTES } from "../../../config/navRoutes.js";

const LINKS = [
  { icon: "storefront", title: "Our Story", text: "Who we are and how Anurag Traders began.", to: ROUTES["about-us"] },
  { icon: "map", title: "Dealership Network", text: "Find authorized Crompton service near you.", to: ROUTES["dealership-network"] },
  { icon: "verified", title: "Warranty Claims", text: "Raise or track a product warranty claim.", to: ROUTES["warranty-claims"] },
  { icon: "inventory_2", title: "Bulk Orders", text: "Quotes for builders, offices and retailers.", to: ROUTES["bulk-orders"] },
];

// About Us: no catalog data applies, so this is a compact company panel —
// four link cards plus a contact card (same details as the top bar).
export default function AboutMenu() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div className="grid grid-cols-2 gap-4">
        {LINKS.map((l, i) => (
          <Link
            key={l.title}
            to={l.to}
            style={{ animationDelay: `${i * 45}ms` }}
            className="menu-stagger group flex items-start gap-4 rounded-2xl border border-border-subtle p-4 transition-all hover:border-secondary-container hover:bg-surface-container-low"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-on-secondary">
              <span className="material-symbols-outlined text-[22px]">{l.icon}</span>
            </span>
            <span>
              <span className="block font-title-md text-title-md text-primary">{l.title}</span>
              <span className="block font-body-sm text-body-sm text-text-secondary">{l.text}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl bg-primary-container p-5 text-on-primary">
        <div className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-container">Authorized Crompton Dealer</div>
        <div className="mt-2 font-title-lg text-title-lg">Talk to us</div>
        <ul className="mt-3 space-y-2 font-body-md text-body-md text-primary-fixed-dim">
          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-secondary-container">call</span>+91 99571 71355</li>
          <li className="flex items-center gap-2 break-all"><span className="material-symbols-outlined text-[18px] text-secondary-container">mail</span>anuragtraders2013@gmail.com</li>
          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-secondary-container">location_on</span>Guwahati, Assam</li>
        </ul>
        <Link to={ROUTES["contact-us"]} className="mt-4 inline-flex rounded-full bg-secondary-container px-4 py-1.5 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-white">
          Contact us
        </Link>
      </div>
    </div>
  );
}
