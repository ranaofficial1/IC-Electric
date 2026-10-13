// Ported 1:1 from the reference design (code.html). Markup, classes and text are unchanged.
export default function TopRibbon() {
  return (
    <>
      <div className="w-full bg-surface-container text-on-surface py-2.5 px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-body-sm font-body-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-[14px]">
                verified
              </span>
              {" Official Channel Partner"}
            </span>
            {" "}
            <span className="text-text-secondary font-medium">
              {"Guwahati "}
              &amp;
              {" North-East Assam Direct Dealer Stock "}
              &amp;
              {" B2B Wholesale Despatch"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-discount-emerald">
                local_shipping
              </span>
              {" 24-48h Regional Dispatch"}
            </span>
            {" "}
            <span className="">
              •
            </span>
            {" "}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                verified_user
              </span>
              {" 100% Genuine Crompton Warranty"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
