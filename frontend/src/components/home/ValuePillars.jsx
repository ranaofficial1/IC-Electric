// Ported 1:1 from the reference design (code.html). Markup, classes and text are unchanged.
export default function ValuePillars() {
  return (
    <>
      <section className="w-full px-gutter py-space-xl bg-surface">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* 3 Highlights from Original Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[30px]">
                  palette
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Premium Designs
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mt-2">
                Premium Designer Fans and fixtures that add a touch of sophistication, architectural balance, and class to any room.
              </p>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[30px]">
                  bolt
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Energy-efficient
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mt-2">
                Energy-efficient BLDC Fans and 5-star water heaters that offer superior airflow and rapid heat while saving significantly on electricity.
              </p>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[30px]">
                  volume_off
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Noiseless Fans
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mt-2">
                Engineered for ultimate tranquility, eliminating vibration and humming sounds for quiet sleep and productive study spaces.
              </p>
            </div>
          </div>
          {/* One Stop Solution Banner Strip */}
          <div className="bg-primary text-on-primary rounded-2xl p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-secondary-fixed font-label-sm text-label-sm uppercase font-bold tracking-wider">
                The Anurag Traders Assurance
              </span>
              <h2 className="font-headline-lg text-headline-lg text-surface-bright">
                One Stop Solution
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container">
                Your one-stop destination for top-rated products, easy purchases, expert service, installation, and reliable manufacturer warranties—all designed to make your experience seamless and stress-free.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto flex-shrink-0">
              <div className="bg-surface-card/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-discount-emerald text-[28px]">
                  payments
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-surface-bright">
                    Easy Purchase
                  </span>
                  {" "}
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Transparent Billing
                  </span>
                </div>
              </div>
              <div className="bg-surface-card/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-[28px]">
                  build
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-surface-bright">
                    {"Service "}
                    &amp;
                    {" Installation"}
                  </span>
                  {" "}
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Certified Technicians
                  </span>
                </div>
              </div>
              <div className="bg-surface-card/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-energy-amber text-[28px]">
                  verified_user
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-surface-bright">
                    Product Warranty
                  </span>
                  {" "}
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    100% Genuine Crompton
                  </span>
                </div>
              </div>
              <div className="bg-surface-card/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-[28px]">
                  thumb_up
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-surface-bright">
                    Top Rated
                  </span>
                  {" "}
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Guwahati's #1 Choice
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
