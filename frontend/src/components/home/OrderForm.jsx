// Ported 1:1 from the reference design (code.html). Markup, classes and text are unchanged.
export default function OrderForm() {
  function handleQuerySubmit(e) {
    e.preventDefault();
    alert("Thank you for contacting Anurag Traders Guwahati. Our technical service team will contact you shortly.");
    e.target.reset();
  }

  return (
    <>
      <section className="w-full px-gutter py-space-xl bg-surface-canvas" id="order-form">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-label-sm font-label-sm uppercase tracking-wider font-bold">
                  {"Official Support "}
                  &amp;
                  {" Distribution"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-discount-emerald/20 text-discount-emerald text-label-sm font-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  {" Guwahati Hub"}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                {"Get In Touch "}
                &amp;
                {" Experience Center"}
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mt-1">
                Whether you need retail product assistance, commercial bulk dispatch, or certified Crompton service in Guwahati and across Assam, our dedicated team is here to assist.
              </p>
            </div>
            <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-discount-emerald text-[18px]">
                  schedule
                </span>
                {" Response within 4 business hours"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">
                        verified
                      </span>
                      {" Authorized Distributor Hub"}
                    </span>
                    <span className="text-label-sm text-on-primary-container flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-discount-emerald animate-pulse"></span>
                      {" Open Today"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-surface-bright">
                      {"Anurag Traders Experience Center "}
                      &amp;
                      {" Warehouse"}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-primary-container mt-2 flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary-fixed text-[18px] flex-shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span className="">
                        House no. 2, Panchoboro Path, near Nightingale Hospital, Krishnanagar, Guwahati, Assam 781005
                      </span>
                    </p>
                  </div>
                  <div className="bg-surface-card/10 backdrop-blur-md rounded-xl p-3.5 flex items-center justify-between border border-surface-card/20">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                        schedule
                      </span>
                      <span className="font-label-md text-label-md text-surface-bright">
                        Working Hours
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary-fixed font-bold">
                      Mon – Sat: 9:30 AM – 8:00 PM
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <a className="flex items-center justify-between bg-surface-card/10 hover:bg-surface-card/20 px-4 py-3 rounded-xl transition-colors border border-surface-card/10 group" href="tel:+919957171355">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                          <span className="material-symbols-outlined text-[18px]">
                            call
                          </span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-sm text-label-sm text-on-primary-container">
                            {"Direct Sales "}
                            &amp;
                            {" Orders"}
                          </span>
                          <span className="font-title-md text-title-md text-surface-bright group-hover:text-secondary-fixed transition-colors">
                            +91 99571 71355
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-primary-container group-hover:translate-x-1 transition-transform text-[20px]">
                        arrow_forward
                      </span>
                    </a>
                    <a className="flex items-center justify-between bg-surface-card/10 hover:bg-surface-card/20 px-4 py-3 rounded-xl transition-colors border border-surface-card/10 group" href="mailto:anuragtraders2013@gmail.com">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                          <span className="material-symbols-outlined text-[18px]">
                            mail
                          </span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-sm text-label-sm text-on-primary-container">
                            Official Inquiries
                          </span>
                          <span className="font-body-md text-body-md text-surface-bright truncate max-w-[210px] sm:max-w-xs group-hover:text-secondary-fixed transition-colors">
                            anuragtraders2013@gmail.com
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-primary-container group-hover:translate-x-1 transition-transform text-[20px]">
                        arrow_forward
                      </span>
                    </a>
                    <a className="flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary py-3 px-4 rounded-xl font-label-md text-label-md font-bold transition-all shadow-md" href="https://maps.app.goo.gl/4zd5nTfNvCCorP1EA" rel="noopener noreferrer" target="_blank">
                      <span className="material-symbols-outlined text-[20px]">
                        map
                      </span>
                      {" Open in Google Maps"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-card rounded-2xl p-5 border border-border-subtle shadow-sm flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted tracking-wider">
                  Direct Support Services
                </span>
                <div className="flex flex-col gap-2">
                  <a className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-secondary transition-all group" href="tel:+919957171355">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        home_repair_service
                      </span>
                      <span className="font-label-md text-label-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {"Ask for Service "}
                        &amp;
                        {" Repairs"}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                  <a className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-secondary transition-all group" href="tel:+919957171355">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-energy-amber text-[20px]">
                        verified_user
                      </span>
                      <span className="font-label-md text-label-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                        Warranty Registration
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                  <a className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-secondary transition-all group" href="tel:+919957171355">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-discount-emerald text-[20px]">
                        construction
                      </span>
                      <span className="font-label-md text-label-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                        New Project Installation
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 bg-surface-card rounded-2xl p-6 md:p-8 border border-border-subtle shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between pb-5 border-b border-border-subtle">
                <div>
                  <span className="font-label-sm text-label-sm uppercase font-bold text-secondary tracking-wider">
                    Direct Customer Desk
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary mt-1">
                    Connect With Anurag Traders
                  </h3>
                  <p className="font-body-md text-body-md text-text-secondary mt-0.5">
                    Have a query about retail purchase, bulk project quotation, or technician support?
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">
                    headset_mic
                  </span>
                </div>
              </div>
              <form className="mt-6 flex flex-col gap-4" onSubmit={handleQuerySubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold">
                      Your Full Name *
                    </label>
                    <input className="w-full h-11 px-3.5 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface transition-all placeholder:text-text-muted" placeholder="e.g. Rahul Sharma" required type="text" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold">
                      Phone Number *
                    </label>
                    <input className="w-full h-11 px-3.5 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface transition-all placeholder:text-text-muted" placeholder="+91 99571 XXXXX" required type="tel" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold">
                      Email Address *
                    </label>
                    <input className="w-full h-11 px-3.5 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface transition-all placeholder:text-text-muted" placeholder="name@domain.com" required type="email" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold">
                      Nature of Inquiry *
                    </label>
                    <select className="w-full h-11 px-3.5 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface cursor-pointer">
                      <option>
                        Product Purchase Inquiry
                      </option>
                      <option>
                        {"Wholesale "}
                        &amp;
                        {" Bulk Project RFQ"}
                      </option>
                      <option>
                        {"Installation "}
                        &amp;
                        {" Warranty Support"}
                      </option>
                      <option>
                        Become an Authorized Dealer
                      </option>
                      <option>
                        General Assistance
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold">
                    Message / Requirement Details
                  </label>
                  <textarea className="w-full p-3.5 rounded-xl bg-surface-canvas border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none font-body-md text-body-md text-on-surface resize-none transition-all placeholder:text-text-muted" placeholder="Tell us about the Crompton appliances, model quantities, or service assistance you require..." rows="4"></textarea>
                </div>
                <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-discount-emerald">
                      lock
                    </span>
                    <span className="">
                      {"Your data is strictly confidential "}
                      &amp;
                      {" encrypted"}
                    </span>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary py-3 px-8 rounded-full font-label-lg text-label-lg font-semibold transition-all shadow-md ml-auto" type="submit">
                    <span className="">
                      Submit Inquiry
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      send
                    </span>
                  </button>
                </div>
              </form>
              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-body-sm text-text-muted flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    verified
                  </span>
                  {" Official Crompton Regional Warranty Claim Support"}
                </span>
                <span className="text-primary font-semibold">
                  Direct Guwahati Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
