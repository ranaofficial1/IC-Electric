import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../ui/ActionFeedback.jsx";
import { useProduct } from "../../hooks/useCatalog.js";
import { useShopActions } from "../../hooks/useShopActions.js";
import { formatPrice } from "../../utils/formatPrice.js";

// The two product slides are bound to real catalog products (looked up by slug),
// so their price / MRP / savings and Buy Now buttons are live. Slides 3 and 4
// are collection banners that link to the real category pages.
const MIXER_SLUG = "crompton-ameo-neo-3-jar-mixer";
const KETTLE_SLUG = "activhot-cool-touch-electric-kettle";

function savingsOf(product) {
  if (!product || !product.salePrice) return null;
  return {
    amount: product.price - product.salePrice,
    percent: Math.round((1 - product.salePrice / product.price) * 100),
  };
}

export default function HeroShowcase() {
  const { product: mixer } = useProduct(MIXER_SLUG);
  const { product: kettle } = useProduct(KETTLE_SLUG);
  const actions = useShopActions();
  const mixerSaving = savingsOf(mixer);
  const kettleSaving = savingsOf(kettle);
  const buyButtonBase =
    "inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-70";
  const TOTAL_SLIDES = 4;
  const [slide, setSlide0] = useState(1);
  const [timerKey, setTimerKey] = useState(0); // bumping this restarts the autoplay timer (reference: resetAutoPlay)

  useEffect(() => {
    const id = setInterval(() => setSlide0((s) => (s + 1 > TOTAL_SLIDES ? 1 : s + 1)), 5500);
    return () => clearInterval(id);
  }, [timerKey]);

  const setSlide = (i) => {
    setSlide0(i);
    setTimerKey((k) => k + 1);
  };
  const nextSlide = () => {
    setSlide0((s) => (s + 1 > TOTAL_SLIDES ? 1 : s + 1));
    setTimerKey((k) => k + 1);
  };
  const prevSlide = () => {
    setSlide0((s) => (s - 1 < 1 ? TOTAL_SLIDES : s - 1));
    setTimerKey((k) => k + 1);
  };

  return (
    <>
      <section className="w-full px-gutter py-space-md">
        <div className="max-w-[1360px] mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden bg-primary shadow-xl">
            {/* Slide 1: Ameo Neo Mixer Grinder */}
            <div className={`hero-slide transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 min-h-[540px] items-center p-6 md:p-12 gap-8 ${slide === 1 ? "active" : "hidden"}`} id="hero-slide-1">
              <div className="lg:col-span-7 flex flex-col justify-center gap-space-sm z-10 text-on-primary">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-secondary px-3 py-1 rounded-full text-label-sm font-label-sm tracking-wider uppercase text-on-secondary font-bold">
                    Featured Food Prep
                  </span>
                  {" "}
                  <span className="bg-discount-emerald/20 text-discount-emerald px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">
                    {mixerSaving ? `Special Dealer -${mixerSaving.percent}% OFF` : "Special Dealer Price"}
                  </span>
                  {" "}
                  <span className="text-on-primary-container text-label-sm font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      electric_bolt
                    </span>
                    {" 500W Powertron Motor"}
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-surface-bright tracking-tight mt-1 leading-tight">
                  {"Crompton Ameo Neo "}
                  <br />
                  <span className="text-secondary-fixed">
                    3 Jar Mixer Grinder
                  </span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">
                  Engineered with heavy-duty copper-wound motors and leak-tight stainless steel jars. Precision grinding for authentic culinary textures with built-in overload protection.
                </p>
                {mixer && (
                  <div className="flex items-baseline gap-4 pt-2">
                    <span className="font-headline-lg text-headline-lg text-surface-bright">
                      {formatPrice(mixer.salePrice ?? mixer.price)}
                    </span>
                    {mixerSaving && (
                      <>
                        {" "}
                        <span className="font-title-md text-title-md text-text-muted line-through">
                          {`MRP: ${formatPrice(mixer.price)}`}
                        </span>
                        {" "}
                        <span className="bg-discount-emerald text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                          {`SAVE ${formatPrice(mixerSaving.amount)}`}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-space-md pt-4 flex-wrap">
                  {mixer ? (
                    <button type="button" className={`${buyButtonBase} shadow-secondary/30`} onClick={() => actions.buyNow(mixer)} disabled={actions.isBuying(mixer) || mixer.stock < 1}>
                      <span className="material-symbols-outlined text-[20px]">
                        shopping_cart
                      </span>
                      {mixer.stock < 1 ? " Out of Stock" : actions.isBuying(mixer) ? " Please wait..." : " Buy Now"}
                    </button>
                  ) : (
                    <Link className={buyButtonBase} to="/category/appliances">
                      <span className="material-symbols-outlined text-[20px]">
                        shopping_cart
                      </span>
                      {" Shop Kitchen Appliances"}
                    </Link>
                  )}
                  {" "}
                  <Link className="inline-flex items-center gap-2 bg-surface-container-high/20 hover:bg-surface-container-high/30 text-surface-bright px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold transition-colors" to={mixer ? `/product/${mixer.slug}` : "/category/appliances"}>
                    {"View Specifications "}
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="absolute w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative bg-surface-card/10 backdrop-blur-sm p-4 rounded-2xl shadow-2xl w-full max-w-md">
                  <img alt="Crompton Ameo Neo Kitchen Appliance Slider" className="w-full h-80 object-cover rounded-xl shadow-lg" src="https://anuragtraders.com/wp-content/uploads/Crompton-Ameo-Neo-3-Jar-Mixer-1.webp" />
                  <div className="absolute -bottom-3 -right-3 bg-surface-card text-on-surface px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-energy-amber text-[20px]">
                      star
                    </span>
                    {" "}
                    <span className="font-title-md text-title-md">
                      Guwahati Ready Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 2: ActivHot Kettle */}
            <div className={`hero-slide transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 min-h-[540px] items-center p-6 md:p-12 gap-8 ${slide === 2 ? "active" : "hidden"}`} id="hero-slide-2">
              <div className="lg:col-span-7 flex flex-col justify-center gap-space-sm z-10 text-on-primary">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-secondary px-3 py-1 rounded-full text-label-sm font-label-sm tracking-wider uppercase text-on-secondary font-bold">
                    Fast Brewing Series
                  </span>
                  {" "}
                  <span className="bg-discount-emerald/20 text-discount-emerald px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">
                    {kettleSaving ? `Dealer Rate -${kettleSaving.percent}%` : "Dealer Rate"}
                  </span>
                  {" "}
                  <span className="text-on-primary-container text-label-sm font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      mode_heat
                    </span>
                    {" 1350W Fast Rapid Boil"}
                  </span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-surface-bright tracking-tight mt-1 leading-tight">
                  {"ActivHot Cool Touch "}
                  <br />
                  <span className="text-secondary-fixed">
                    Electric Rapid Kettle
                  </span>
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">
                  Double-wall insulated cool exterior with seamless 304 food-grade stainless interior. Auto shut-off dry-boil sensor for effortless morning tea and coffee brewing.
                </p>
                {kettle && (
                  <div className="flex items-baseline gap-4 pt-2">
                    <span className="font-headline-lg text-headline-lg text-surface-bright">
                      {formatPrice(kettle.salePrice ?? kettle.price)}
                    </span>
                    {kettleSaving && (
                      <>
                        {" "}
                        <span className="font-title-md text-title-md text-text-muted line-through">
                          {`MRP: ${formatPrice(kettle.price)}`}
                        </span>
                        {" "}
                        <span className="bg-discount-emerald text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                          {`${kettleSaving.percent}% SAVINGS`}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-space-md pt-4 flex-wrap">
                  {kettle ? (
                    <button type="button" className={buyButtonBase} onClick={() => actions.buyNow(kettle)} disabled={actions.isBuying(kettle) || kettle.stock < 1}>
                      <span className="material-symbols-outlined text-[20px]">
                        flash_on
                      </span>
                      {kettle.stock < 1 ? " Out of Stock" : actions.isBuying(kettle) ? " Please wait..." : " Buy Direct Now"}
                    </button>
                  ) : (
                    <Link className={buyButtonBase} to="/category/brewing">
                      <span className="material-symbols-outlined text-[20px]">
                        flash_on
                      </span>
                      {" Shop Brewing"}
                    </Link>
                  )}
                  {" "}
                  <Link className="inline-flex items-center gap-2 bg-surface-container-high/20 hover:bg-surface-container-high/30 text-surface-bright px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold transition-colors" to="/category/brewing">
                    Explore Brewing Series
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="absolute w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative bg-surface-card p-4 rounded-2xl shadow-2xl w-full max-w-md">
                  <img alt="Crompton ActivHot Kettle" className="w-full h-80 object-contain rounded-xl" src="https://anuragtraders.com/wp-content/uploads/ActivHot-Cool-Touch-Electric-Kettle-1.webp" />
                  <div className="absolute -top-3 -left-3 bg-secondary text-on-secondary px-3 py-1 rounded-lg text-label-sm font-label-sm font-bold shadow-md">
                    Cool-Touch Safety
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 3: Designer Grandeur Fans */}
            <div className={`hero-slide transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 min-h-[540px] items-center p-6 md:p-12 gap-8 ${slide === 3 ? "active" : "hidden"}`} id="hero-slide-3">
              <div className="lg:col-span-7 flex flex-col justify-center gap-space-sm z-10 text-on-primary">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-energy-amber px-3 py-1 rounded-full text-label-sm font-label-sm tracking-wider uppercase text-on-primary font-bold">
                    BLDC Silent Technology
                  </span>
                  {" "}
                  <span className="text-on-primary-container text-label-sm font-label-sm">
                    5-Star Energy Saver
                  </span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-surface-bright tracking-tight mt-1 leading-tight">
                  {"Impart Grandeur To Your "}
                  <br />
                  <span className="text-secondary-fixed">
                    Living Room With Crompton Fans
                  </span>
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">
                  Serene quietness, aerodynamically designed sweeps, and high air delivery. Save up to 50% electricity with silent BLDC motors crafted for North-East climates.
                </p>
                <div className="flex items-center gap-space-md pt-4 flex-wrap">
                  <Link className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold transition-all" to="/category/fans">
                    {"Explore Fan Collection "}
                    <span className="material-symbols-outlined text-[18px]">
                      east
                    </span>
                  </Link>
                  {" "}
                  <a className="inline-flex items-center gap-2 bg-surface-card/20 text-surface-bright px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold" href="#order-form">
                    Download Fan Catalog
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                  <img alt="Crompton Grandeur Fan Collection Banner" className="w-full h-80 object-top object-cover rounded-2xl" src="https://anuragtraders.com/wp-content/uploads/Category-Brochure-Download.webp" />
                </div>
              </div>
            </div>
            {/* Slide 4: Water Heaters */}
            <div className={`hero-slide transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 min-h-[540px] items-center p-6 md:p-12 gap-8 ${slide === 4 ? "active" : "hidden"}`} id="hero-slide-4">
              <div className="lg:col-span-7 flex flex-col justify-center gap-space-sm z-10 text-on-primary">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                    5-Star Rated Storage
                  </span>
                  {" "}
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
                    Anti-Scale Heating Element
                  </span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-surface-bright tracking-tight mt-1 leading-tight">
                  {"Get Perfect Hot Water "}
                  <br />
                  <span className="text-secondary-fixed">
                    With Care For Your Loved Ones
                  </span>
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">
                  Superior Glassline tank protection, rust-free outer body, and high-pressure resistance suitable for high-rise apartments and Guwahati hard water.
                </p>
                <div className="flex items-center gap-space-md pt-4 flex-wrap">
                  <Link className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold transition-all" to="/category/water-heaters">
                    {"Shop Water Heaters "}
                    <span className="material-symbols-outlined text-[18px]">
                      water_drop
                    </span>
                  </Link>
                  {" "}
                  <a className="inline-flex items-center gap-2 bg-surface-card/20 text-surface-bright px-6 py-3 rounded-full font-label-lg text-label-lg font-semibold" href="#order-form">
                    Wholesale Price List
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                  <img alt="Crompton Storage Water Heater" className="w-full h-80 object-cover object-top rounded-2xl" src="https://anuragtraders.com/wp-content/uploads/Water-Heater-BG.webp" />
                </div>
              </div>
            </div>
            {/* Carousel Navigation Controls & Slides Bar */}
            <div className="absolute bottom-4 left-6 right-6 md:left-12 md:right-12 flex items-center justify-between pointer-events-auto z-20">
              <div className="flex items-center gap-2">
                <button className={`h-2 rounded-full transition-all ${slide === 1 ? "w-8 bg-secondary-fixed" : "w-3 bg-surface-container-highest/40"}`} id="slide-btn-1" onClick={() => setSlide(1)}></button>
                {" "}
                <button className={`h-2 rounded-full hover:bg-surface-container-highest transition-all ${slide === 2 ? "w-8 bg-secondary-fixed" : "w-3 bg-surface-container-highest/40"}`} id="slide-btn-2" onClick={() => setSlide(2)}></button>
                {" "}
                <button className={`h-2 rounded-full hover:bg-surface-container-highest transition-all ${slide === 3 ? "w-8 bg-secondary-fixed" : "w-3 bg-surface-container-highest/40"}`} id="slide-btn-3" onClick={() => setSlide(3)}></button>
                {" "}
                <button className={`h-2 rounded-full hover:bg-surface-container-highest transition-all ${slide === 4 ? "w-8 bg-secondary-fixed" : "w-3 bg-surface-container-highest/40"}`} id="slide-btn-4" onClick={() => setSlide(4)}></button>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-surface-card/20 hover:bg-surface-card/40 text-on-primary flex items-center justify-center backdrop-blur-md transition-colors" onClick={prevSlide}>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_left
                  </span>
                </button>
                {" "}
                <button className="w-9 h-9 rounded-full bg-surface-card/20 hover:bg-surface-card/40 text-on-primary flex items-center justify-center backdrop-blur-md transition-colors" onClick={nextSlide}>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Hero Sub-Bar: Quick Category Jump Explorer */}
        </div>
      </section>
      <ActionFeedback feedback={actions.feedback} />
    </>
  );
}
