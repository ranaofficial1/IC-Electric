import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../ui/ActionFeedback.jsx";
import { useProduct } from "../../hooks/useCatalog.js";
import { useShopActions } from "../../hooks/useShopActions.js";
import { formatPrice } from "../../utils/formatPrice.js";

const MIXER_SLUG = "crompton-ameo-neo-3-jar-mixer";
const KETTLE_SLUG = "activhot-cool-touch-electric-kettle";
const TOTAL_SLIDES = 4;

function savingsOf(product) {
  if (!product || !product.salePrice) return null;
  return {
    amount: product.price - product.salePrice,
    percent: Math.round((1 - product.salePrice / product.price) * 100),
  };
}

/* ---------- Shared responsive classes ---------- */
// Slide wrapper: mobile pe chhota padding + neeche nav bar ke liye jagah (pb-16)
const slideBase =
  "hero-slide transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 items-center gap-5 md:gap-8 px-4 pt-6 pb-16 sm:px-8 sm:pt-8 md:px-12 md:pt-12 lg:min-h-[540px]";
const textCol =
  "lg:col-span-7 flex flex-col justify-center gap-2.5 sm:gap-space-sm z-10 text-on-primary min-w-0";
const chipRow = "flex items-center gap-1.5 sm:gap-2 flex-wrap";
const chipBase =
  "rounded-full px-2.5 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-label-sm font-label-sm font-bold";
const headline =
  "font-headline-xl text-[26px] sm:text-4xl lg:text-headline-xl text-surface-bright tracking-tight mt-1 leading-tight";
const paragraph =
  "font-body-lg text-[13px] leading-relaxed sm:text-base lg:text-body-lg text-on-primary-container max-w-xl";
const priceMain = "font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg text-surface-bright";
const priceMrp = "font-title-md text-sm sm:text-base lg:text-title-md text-text-muted line-through";
const savePill =
  "bg-discount-emerald text-on-primary font-label-sm text-[10px] sm:text-label-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold";
const btnRow = "flex flex-wrap items-center gap-2 sm:gap-space-md pt-2 sm:pt-4";
const btnSize =
  "inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-center text-[13px] sm:text-label-lg font-label-lg font-semibold";

const btnPrimary = `${btnSize} bg-secondary hover:bg-on-secondary-container text-on-secondary transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-70`;

// Mobile pe hidden, sm+ pe dikhega
const btnGhost = `${btnSize} hidden sm:inline-flex bg-surface-container-high/20 hover:bg-surface-container-high/30 text-surface-bright transition-colors`;

// Slides 3 aur 4 ke second button ke liye (naya constant)
const btnGhostAlt = `${btnSize} hidden sm:inline-flex bg-surface-card/20 text-surface-bright`;

// Slides 3 aur 4 ke primary button ke liye (naya constant)
const btnPrimaryLink = `${btnSize} bg-secondary hover:bg-on-secondary-container text-on-secondary transition-all`;  
const imgCol = "lg:col-span-5 flex items-center justify-center relative";
const imgHeight = "w-full h-48 sm:h-64 lg:h-80";
const glow = "absolute w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none";

export default function HeroShowcase() {
  const { product: mixer } = useProduct(MIXER_SLUG);
  const { product: kettle } = useProduct(KETTLE_SLUG);
  const actions = useShopActions();
  const mixerSaving = savingsOf(mixer);
  const kettleSaving = savingsOf(kettle);

  const [slide, setSlide0] = useState(1);
  const [timerKey, setTimerKey] = useState(0);

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

  const show = (n) => (slide === n ? "active" : "hidden");

  return (
    <>
      {/* Mobile pe edge-to-edge (no side padding, no rounded), sm+ pe gutter wapas */}
      <section className="w-full px-0 py-0 sm:px-gutter sm:py-space-xl">
        <div className="mx-auto max-w-[1360px]">
          <div className="relative w-full overflow-hidden bg-primary shadow-xl sm:rounded-2xl">
            {/* ---------- Slide 1: Mixer ---------- */}
            <div className={`${slideBase} ${show(1)}`} id="hero-slide-1">
              <div className={textCol}>
                <div className={chipRow}>
                  <span className={`${chipBase} bg-secondary tracking-wider uppercase text-on-secondary`}>
                    Featured Food Prep
                  </span>
                  {/* <span className={`${chipBase} bg-discount-emerald/20 text-discount-emerald`}>
                    {mixerSaving ? `Special Dealer -${mixerSaving.percent}% OFF` : "Special Dealer Price"}
                  </span> */}
                  {/* <span className="text-on-primary-container text-[10px] sm:text-label-sm font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] sm:text-[15px]">electric_bolt</span>
                    500W Powertron Motor
                  </span> */}
                </div>
                <h1 className={headline}>
                  Crompton Ameo Neo <br className="hidden sm:block" />
                  <span className="text-secondary-fixed">3 Jar Mixer Grinder</span>
                </h1>
                <p className={`${paragraph} line-clamp-3 sm:line-clamp-none`}>
                  Engineered with heavy-duty copper-wound motors and leak-tight stainless steel jars. Precision grinding for authentic culinary textures with built-in overload protection.
                </p>
                {/* {mixer && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1 sm:gap-x-4 sm:pt-2">
                    <span className={priceMain}>{formatPrice(mixer.salePrice ?? mixer.price)}</span>
                    {mixerSaving && (
                      <>
                        <span className={priceMrp}>{`MRP: ${formatPrice(mixer.price)}`}</span>
                        <span className={savePill}>{`SAVE ${formatPrice(mixerSaving.amount)}`}</span>
                      </>
                    )}
                  </div>
                )} */}
                <div className={btnRow}>
                  {mixer ? (
                    <button
                      type="button"
                      className={`${btnPrimary} shadow-secondary/30`}
                      onClick={() => actions.buyNow(mixer)}
                      disabled={actions.isBuying(mixer) || mixer.stock < 1}
                    >
                      {/* <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_cart</span> */}
                      {mixer.stock < 1 ? "Out of Stock" : actions.isBuying(mixer) ? "Please wait..." : "Buy Now"}
                    </button>
                  ) : (
                    <Link className={btnPrimary} to="/category/appliances">
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_cart</span>
                      Shop Kitchen Appliances
                    </Link>
                  )}
                  {/* <Link className={btnGhost} to={mixer ? `/product/${mixer.slug}` : "/category/appliances"}>
                    View Specifications
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
                  </Link> */}
                </div>
              </div>
              <div className={imgCol}>
                <div className={`${glow} bg-secondary/20`}></div>
                <div className="relative w-full max-w-md rounded-2xl bg-surface-card/10 p-2.5 shadow-2xl backdrop-blur-sm sm:p-4">
                  <img
                    alt="Crompton Ameo Neo Kitchen Appliance Slider"
                    className={`${imgHeight} rounded-xl object-cover shadow-lg`}
                    src="https://anuragtraders.com/wp-content/uploads/Crompton-Ameo-Neo-3-Jar-Mixer-1.webp"/>
                  {/* <div className="absolute bottom-1 right-1 flex items-center gap-1.5 rounded-xl bg-surface-card px-2.5 py-1.5 text-on-surface shadow-lg sm:-bottom-3 sm:-right-3 sm:gap-2 sm:px-4 sm:py-2">
                    <span className="material-symbols-outlined text-[16px] text-energy-amber sm:text-[20px]">star</span>
                    <span className="font-title-md text-[11px] sm:text-title-md">Guwahati Ready Stock</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* ---------- Slide 2: Kettle ---------- */}
            <div className={`${slideBase} ${show(2)}`} id="hero-slide-2">
              <div className={textCol}>
                <div className={chipRow}>
                  <span className={`${chipBase} bg-secondary tracking-wider uppercase text-on-secondary`}>
                    Fast Brewing Series
                  </span>
                  {/* <span className={`${chipBase} bg-discount-emerald/20 text-discount-emerald`}>
                    {kettleSaving ? `Dealer Rate -${kettleSaving.percent}%` : "Dealer Rate"}
                  </span>
                  <span className="text-on-primary-container text-[10px] sm:text-label-sm font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] sm:text-[15px]">mode_heat</span>
                    1350W Fast Rapid Boil
                  </span> */}
                </div>
                <h2 className={headline}>
                  ActivHot Cool Touch <br className="hidden sm:block" />
                  <span className="text-secondary-fixed">Electric Rapid Kettle</span>
                </h2>
                <p className={`${paragraph} line-clamp-3 sm:line-clamp-none`}>
                  Double-wall insulated cool exterior with seamless 304 food-grade stainless interior. Auto shut-off dry-boil sensor for effortless morning tea and coffee brewing.
                </p>
                {/* {kettle && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1 sm:gap-x-4 sm:pt-2">
                    <span className={priceMain}>{formatPrice(kettle.salePrice ?? kettle.price)}</span>
                    {kettleSaving && (
                      <>
                        <span className={priceMrp}>{`MRP: ${formatPrice(kettle.price)}`}</span>
                        <span className={savePill}>{`${kettleSaving.percent}% SAVINGS`}</span>
                      </>
                    )}
                  </div>
                )} */}
                <div className={btnRow}>
                  {kettle ? (
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => actions.buyNow(kettle)}
                      disabled={actions.isBuying(kettle) || kettle.stock < 1}
                    >
                      {/* <span className="material-symbols-outlined text-[18px] sm:text-[20px]">flash_on</span> */}
                      {kettle.stock < 1 ? "Out of Stock" : actions.isBuying(kettle) ? "Please wait..." : "Buy Now"}
                    </button>
                  ) : (
                    <Link className={btnPrimary} to="/category/brewing">
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">flash_on</span>
                      Shop Brewing
                    </Link>
                  )}
                  {/* <Link className={btnGhost} to="/category/brewing">
                    Explore Brewing Series
                  </Link> */}
                </div>
              </div>
              <div className={imgCol}>
                <div className={`${glow} bg-secondary-container/20`}></div>
                <div className="relative w-full max-w-md rounded-2xl bg-surface-card p-2.5 shadow-2xl sm:p-4">
                  <img
                    alt="Crompton ActivHot Kettle"
                    className={`${imgHeight} rounded-xl object-contain`}
                    src="https://anuragtraders.com/wp-content/uploads/ActivHot-Cool-Touch-Electric-Kettle-1.webp"
                  />
                  {/* <div className="absolute left-1 top-1 rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-bold text-on-secondary shadow-md sm:-left-3 sm:-top-3 sm:px-3 sm:py-1 sm:text-label-sm font-label-sm">
                    Cool-Touch Safety
                  </div> */}
                </div>
              </div>
            </div>

            {/* ---------- Slide 3: Fans ---------- */}
            <div className={`${slideBase} ${show(3)}`} id="hero-slide-3">
              <div className={textCol}>
                <div className={chipRow}>
                  <span className={`${chipBase} bg-secondary tracking-wider uppercase text-on-secondary`}>
                    BLDC Silent Technology
                  </span>
                  {/* <span className="text-on-primary-container text-[10px] sm:text-label-sm font-label-sm">
                    5-Star Energy Saver
                  </span> */}
                </div>
                <h2 className={headline}>
                  Impart Grandeur To Your <br className="hidden sm:block" />
                  <span className="text-secondary-fixed">Living Room With Crompton Fans</span>
                </h2>
                <p className={`${paragraph} line-clamp-3 sm:line-clamp-none`}>
                  Serene quietness, aerodynamically designed sweeps, and high air delivery. Save up to 50% electricity with silent BLDC motors crafted for North-East climates.
                </p>
                <div className={btnRow}>
                  <Link className={btnPrimaryLink} to="/category/fans">
                    Explore Fan Collection
                    {/* <span className="material-symbols-outlined text-[16px] sm:text-[18px]">east</span> */}
                  </Link>
                  {/* <a className={btnGhostAlt} href="#order-form">
                    Download Fan Catalog
                  </a> */}
                </div>
              </div>
              <div className={imgCol}>
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl lg:max-w-none">
                  <img
                    alt="Crompton Grandeur Fan Collection Banner"
                    className={`${imgHeight} rounded-2xl object-top object-cover`}
                    src="https://anuragtraders.com/wp-content/uploads/Category-Brochure-Download.webp" />
                </div>
              </div>
            </div>

            {/* ---------- Slide 4: Water Heaters ---------- */}
            <div className={`${slideBase} ${show(4)}`} id="hero-slide-4">
              <div className={textCol}>
                <div className={chipRow}>
                  <span className={`${chipBase} bg-secondary tracking-wider uppercase text-on-secondary`}>
                    5-Star Rated Storage
                  </span>
                  {/* <span className={`${chipBase} bg-primary-container text-on-primary-container font-normal`}>
                    Anti-Scale Heating Element
                  </span> */}
                </div>
                <h2 className={headline}>
                  Get Perfect Hot Water <br className="hidden sm:block" />
                  <span className="text-secondary-fixed">With Care For Your Loved Ones</span>
                </h2>
                <p className={`${paragraph} line-clamp-3 sm:line-clamp-none`}>
                  Superior Glassline tank protection, rust-free outer body, and high-pressure resistance suitable for high-rise apartments and Guwahati hard water.
                </p>
                <div className={btnRow}>
                  <Link className={btnPrimaryLink} to="/category/water-heaters">
                    Shop Water Heaters
                    {/* <span className="material-symbols-outlined text-[16px] sm:text-[18px]">water_drop</span> */}
                  </Link>
                  {/* <a className={btnGhostAlt} href="#order-form">
                    Wholesale Price List
                  </a> */}
                </div>
              </div>
              <div className={imgCol}>
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl lg:max-w-none">
                  <img
                    alt="Crompton Storage Water Heater"
                    className={`${imgHeight} rounded-2xl object-top object-cover`}
                    src="https://anuragtraders.com/wp-content/uploads/Water-Heater-BG.webp" />
                </div>
              </div>
            </div>

            {/* ---------- Nav controls ---------- */}
            <div className="pointer-events-auto absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between sm:bottom-4 sm:left-8 sm:right-8 md:left-12 md:right-12">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    id={`slide-btn-${n}`}
                    aria-label={`Go to slide ${n}`}
                    onClick={() => setSlide(n)}
                    className={`h-2 rounded-full transition-all ${
                      slide === n
                        ? "w-6 bg-secondary-fixed sm:w-8"
                        : "w-2.5 bg-surface-container-highest/40 hover:bg-surface-container-highest sm:w-3"
                    }`}
                  ></button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-card/20 text-on-primary backdrop-blur-md transition-colors hover:bg-surface-card/40 sm:h-9 sm:w-9"
                  onClick={prevSlide}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-card/20 text-on-primary backdrop-blur-md transition-colors hover:bg-surface-card/40 sm:h-9 sm:w-9"
                  onClick={nextSlide}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ActionFeedback feedback={actions.feedback} />
    </>
  );
}
