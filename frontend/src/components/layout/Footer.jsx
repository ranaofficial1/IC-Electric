import { Link } from "react-router-dom";
import { ROUTES } from "../../config/navRoutes.js";
import logo from "../../assets/images/logo-white.webp";
// Footer ported 1:1 from the reference design (code.html).
export default function Footer() {
  return (
      <footer className="w-full bg-primary-container text-on-primary mt-space-xl pt-space-xl pb-space-lg">
        <div className="max-w-[1360px] mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl">
            <div className="lg:col-span-2 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-md">
                <img alt="Image" className="h-16 w-auto object-contain p-1" src={logo} />
               
              </div>
              <p className="font-body-md text-body-md text-on-primary-container max-w-md">
                Premier authorized channel partner for Crompton consumer electricals, heavy-duty ventilation, smart lighting, and water heating solutions serving commercial and residential requirements across Guwahati and North-East India.
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-secondary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">
                    public
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-secondary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-secondary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">
                    mail
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-title-md text-title-md text-surface-bright pb-space-xs">
                Quick Links
              </h4>
              <nav className="flex flex-col gap-space-xs" data-active-classes="text-secondary-fixed font-bold">
                <Link to={ROUTES["about-us"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  About Anurag Traders
                </Link>
                <Link to={ROUTES["bulk-orders"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Wholesale "}
                  &amp;
                  {" Bulk Orders"}
                </Link>
                <Link to={ROUTES["warranty-claims"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  Crompton Warranty Support
                </Link>
                <Link to={ROUTES["dealership-network"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  Dealer Network
                </Link>
                <Link to={ROUTES["contact-us"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Store Location "}
                  &amp;
                  {" Contact"}
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-title-md text-title-md text-surface-bright pb-space-xs">
                Collections
              </h4>
              <nav className="flex flex-col gap-space-xs" data-active-classes="text-secondary-fixed font-bold">
                <Link to={ROUTES["premium-fans"]} aria-current="page" className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Ceiling "}
                  &amp;
                  {" Exhaust Fans"}
                </Link>
                <Link to={ROUTES["water-heaters"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Storage "}
                  &amp;
                  {" Instant Geysers"}
                </Link>
                <Link to={ROUTES["air-coolers"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Desert "}
                  &amp;
                  {" Tower Coolers"}
                </Link>
                <Link to={ROUTES["smart-lights"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"LED Panels "}
                  &amp;
                  {" Smart Bulbs"}
                </Link>
                <Link to={ROUTES["kitchen-appliances"]} className="font-body-md text-body-md text-on-primary-container hover:text-on-primary transition-colors">
                  {"Mixers, Hobs "}
                  &amp;
                  {" Irons"}
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-title-md text-title-md text-surface-bright pb-space-xs">
                Store Address
              </h4>
              <div className="flex flex-col gap-space-sm text-body-md font-body-md text-on-primary-container">
                <p className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container flex-shrink-0 mt-0.5">
                    location_on
                  </span>
                  <span className="">
                    House no. 2, Panchoboro Path, near nightangle hospital, Krishnanagar, Guwahati, Assam 781005
                  </span>
                </p>
                <p className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container flex-shrink-0">
                    call
                  </span>
                  <span className="">
                    +91 99571 71355
                  </span>
                </p>
                <p className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container flex-shrink-0">
                    mail
                  </span>
                  <span className="break-all">
                    anuragtraders2013@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-body-sm font-body-sm text-on-primary-container">
            <p className="">
              © 2026 IC Electricals. All rights reserved. Authorized Distributor of Crompton Greaves Consumer Electricals Ltd.
            </p>
            <div className="flex items-center gap-space-md">
              <Link to={ROUTES["privacy-policy"]} className="hover:text-on-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to={ROUTES["terms-conditions"]} className="hover:text-on-primary transition-colors">
                Terms of Service
              </Link>
              <Link to={ROUTES["shipping-returns"]} className="hover:text-on-primary transition-colors">
                {"Delivery "}
                &amp;
                {" Returns"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
}
