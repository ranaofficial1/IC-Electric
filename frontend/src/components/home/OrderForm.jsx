// Contact / "Get In Touch" section — light card layout (matches the new design screenshot).
// Behaviour is unchanged: same phone/email/map links and the same submit handler.
const PHONE_HREF = "tel:+919957171355";

const SERVICES = [
  {
    icon: "home_repair_service",
    iconBg: "bg-secondary",
    title: "Service & Repair Booking",
    text: "Certified Crompton technicians dispatch",
  },
  {
    icon: "verified_user",
    iconBg: "bg-energy-amber",
    title: "Official Warranty Claim",
    text: "Direct regional dealer registration & claim",
  },
  {
    icon: "construction",
    iconBg: "bg-discount-emerald",
    title: "Commercial Installation",
    text: "On-site setup for apartments & enterprises",
  },
];

const FIELD =
  "w-full h-12 px-4 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface transition-all placeholder:text-text-muted";
const LABEL = "block font-label-lg text-label-lg text-on-surface mb-2 font-semibold";

export default function OrderForm() {
  function handleQuerySubmit(e) {
    e.preventDefault();
    alert("Thank you for contacting Anurag Traders Guwahati. Our technical service team will contact you shortly.");
    e.target.reset();
  }

  return (
    <section className="w-full px-gutter-mobile sm:px-gutter py-16 sm:py-20 lg:py-24 bg-surface-canvas" id="order-form">
      <div className="max-w-[1360px] mx-auto flex flex-col gap-12 lg:gap-16">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-on-secondary text-label-sm font-label-sm uppercase tracking-wider font-bold">
              Official Support
            </span>
            <h2 className="mt-3 font-headline-lg text-[28px] font-bold leading-[1.25] tracking-tight text-primary lg:text-headline-lg">
              Get In Touch &amp; Experience Center
            </h2>
          </div>
          {/* <span className="flex items-center gap-1.5 text-text-muted font-body-md text-body-md">
            <span className="material-symbols-outlined text-discount-emerald text-[20px]">schedule</span>
            Response within 4 business hours
          </span> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: store details */}
          <div className="lg:col-span-5 lg:pr-6 flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Authorized Distributor Hub
              </span>
              {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-discount-emerald/15 text-discount-emerald font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-discount-emerald"></span>
                Open Today
              </span> */}
            </div>

            {/* <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Anurag Traders Experience Center &amp; Warehouse
              </h3>
              <p className="mt-2 font-body-md text-body-md text-text-secondary">
                Authorized Crompton consumer electricals wholesale inventory and retail demo destination.
              </p>
            </div> */}

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined flex-shrink-0 text-[24px] text-secondary">location_on</span>
                <div className="min-w-0">
                  <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">Address</span>
                  <span className="mt-1 block font-title-md text-title-md font-medium text-primary">
                    House no. 2, Panchoboro Path, near Nightingale Hospital, Krishnanagar, Guwahati, Assam 781005
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined flex-shrink-0 text-[24px] text-secondary">schedule</span>
                <div className="min-w-0">
                  <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">Working Hours</span>
                  <span className="mt-1 block font-title-md text-title-md font-medium text-primary">
                    Mon – Sat: 9:30 AM – 8:00 PM
                  </span>
                </div>
              </div>

              <a href={PHONE_HREF} className="group flex items-start gap-4">
                <span className="material-symbols-outlined flex-shrink-0 text-[24px] text-secondary">call</span>
                <span className="min-w-0">
                  <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">Direct Sales</span>
                  <span className="mt-1 block font-title-md text-title-md font-medium text-primary transition-colors group-hover:text-secondary">+91 99571 71355</span>
                </span>
              </a>

              <a href="mailto:anuragtraders2013@gmail.com" className="group flex items-start gap-4">
                <span className="material-symbols-outlined flex-shrink-0 text-[24px] text-secondary">mail</span>
                <span className="min-w-0">
                  <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">Official Email</span>
                  <span className="mt-1 block break-words font-title-md text-title-md font-medium text-primary transition-colors group-hover:text-secondary">
                    anuragtraders2013@gmail.com
                  </span>
                </span>
              </a>
            </div>

            <a
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-label-lg text-label-lg font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container"
              href="https://maps.app.goo.gl/4zd5nTfNvCCorP1EA"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px]">map</span>
              Open in Google Maps
            </a>
          </div>

          {/* Right: inquiry form */}
          <div className="lg:col-span-7 bg-surface-card rounded-2xl p-6 md:p-8 border border-border-subtle">
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-border-subtle">
              <div>
                {/* <span className="font-label-sm text-label-sm uppercase font-bold text-secondary tracking-wider">
                  Direct Customer Desk
                </span> */}
                <h3 className="mt-1 font-headline-md text-headline-md text-primary">Connect With IC Electricals</h3>
                <p className="mt-1 font-body-lg text-body-lg text-text-secondary">
                  Have a query about retail purchase, bulk project quotation, or technician support?
                </p>
              </div>
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[28px]">headset_mic</span>
              </div>
            </div>

            <form className="mt-6 flex flex-col gap-5" onSubmit={handleQuerySubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={LABEL}>Your Full Name *</label>
                  <input id="contact-name" className={FIELD} placeholder="e.g. Rahul Sharma" required type="text" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={LABEL}>Phone Number *</label>
                  <input id="contact-phone" className={FIELD} placeholder="+91 99571 XXXXX" required type="tel" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-email" className={LABEL}>Email Address *</label>
                  <input id="contact-email" className={FIELD} placeholder="name@domain.com" required type="email" />
                </div>
                <div>
                  <label htmlFor="contact-type" className={LABEL}>Nature of Inquiry *</label>
                  <select id="contact-type" className={`${FIELD} cursor-pointer`}>
                    <option>Product Purchase Inquiry</option>
                    <option>Wholesale &amp; Bulk Project RFQ</option>
                    <option>Installation &amp; Warranty Support</option>
                    <option>Become an Authorized Dealer</option>
                    <option>General Assistance</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className={LABEL}>Message / Requirement Details</label>
                <textarea
                  id="contact-message"
                  className="w-full p-4 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface resize-none transition-all placeholder:text-text-muted"
                  placeholder="Tell us about the Crompton appliances, model quantities, or service assistance you require..."
                  rows="5"
                ></textarea>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-2 text-text-muted font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-discount-emerald">lock</span>
                  Your data is strictly confidential &amp; encrypted
                </div>
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-label-lg text-label-lg font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container sm:ml-auto sm:w-auto"
                  type="submit"
                >
                  <span>Submit Inquiry</span>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom: support & services */}
        <div className="bg-surface-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-border-subtle">
            <div>
              <h3 className="flex items-center gap-2.5 font-headline-sm text-headline-sm text-primary">
                {/* <span className="h-2.5 w-2.5 rounded-full bg-secondary"></span> */}
                Direct Support &amp; Services
              </h3>
              <p className="mt-1 font-body-md text-body-md text-text-muted">
                Prompt assistance, warranty registrations, and certified technical deployments across Guwahati and Assam.
              </p>
            </div>
            {/* <span className="rounded-full bg-surface-container px-4 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
              Guwahati Desk Assistance
            </span> */}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <a
                key={s.title}
                href={PHONE_HREF}
                className="group flex items-center gap-4 rounded-xl bg-surface-canvas p-4 transition-colors hover:border-secondary-container"
              >
                <span className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-on-primary ${s.iconBg}`}>
                  <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-title-lg text-title-lg text-primary">{s.title}</span>
                  <span className="block font-body-md text-body-md text-text-muted">{s.text}</span>
                </span>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-text-secondary transition-colors group-hover:text-secondary">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}