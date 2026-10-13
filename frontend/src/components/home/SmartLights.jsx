import { Link } from "react-router-dom";
import MediaTile from "../ui/MediaTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { collectionContent } from "../../config/collectionContent.js";

const LIGHTS_SLUG = "smart-lights";

// Lighting section: the bento tiles are the real subcategories of "smart-lights",
// each linking to its listing page. Banner/CTA copy is unchanged.
export default function SmartLights() {
  const { findCategory } = useCategories();
  const tiles = findCategory(LIGHTS_SLUG)?.children || [];

  return (
    <>
      <section className="w-full px-gutter py-space-xl bg-surface-canvas" id="smart-lights-section">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Section Header & Filter Badges */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-label-sm font-label-sm uppercase tracking-wider font-bold">
                  {"Luminaires "}
                  &amp;
                  {" Smart Living"}
                </span>
                {" "}
                <span className="px-2.5 py-0.5 rounded-full bg-discount-emerald/20 text-discount-emerald text-label-sm font-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    bolt
                  </span>
                  {" Up to 85% Power Saving"}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Home Lighting Reimagined With Crompton Lights
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mt-1">
                Architectural downlights, glare-free linear battens, weatherproof street fixtures, and everyday home illumination built with flicker-free LED drivers and eye-comfort optics.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm">
                Residential
              </span>
              {" "}
              <span className="px-3 py-1 rounded-full bg-surface-card border border-border-subtle text-text-secondary font-label-sm text-label-sm font-semibold">
                Commercial
              </span>
              {" "}
              <span className="px-3 py-1 rounded-full bg-surface-card border border-border-subtle text-text-secondary font-label-sm text-label-sm font-semibold">
                {"Outdoor "}
                &amp;
                {" Street"}
              </span>
            </div>
          </div>
          {/* Prominent Spotlight Feature Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-primary border border-border-subtle group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 md:p-10 z-10 flex flex-col justify-center text-on-primary gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                    Signature Luminaire Range
                  </span>
                  {" "}
                  <span className="bg-surface-card/20 text-surface-bright backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm">
                    {"High CRI "}
                    &gt;
                    {" 80"}
                  </span>
                  {" "}
                  <span className="bg-surface-card/20 text-surface-bright backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm">
                    Surge Protected 4kV
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-surface-bright leading-tight tracking-tight mt-1">
                  Intelligent Lightscapes For Every Contemporary Space
                </h3>
                <p className="font-body-md text-body-md text-on-primary-container max-w-xl">
                  From subtle recessed accents and smooth battens to high-efficiency emergency illumination. Discover Crompton's authorized collection engineered for longevity and optical harmony.
                </p>
                <div className="flex items-center gap-4 pt-2 flex-wrap">
                  <a className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold transition-all shadow-md" href="#order-form">
                    {"Wholesale Price List "}
                    <span className="material-symbols-outlined text-[18px]">
                      download
                    </span>
                  </a>
                  {" "}
                  <a className="inline-flex items-center gap-2 bg-surface-card/10 hover:bg-surface-card/20 text-surface-bright px-5 py-2.5 rounded-full font-label-md text-label-md font-semibold backdrop-blur-md transition-colors" href="#order-form">
                    {"Schedule Lighting Audit "}
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[220px] overflow-hidden">
                <img alt="Home lighting reimagined with Crompton lights banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1XJFTwOeFS7bKjPcO9FEGZMZasfICprvFoAt8gBajohMVvZWF90_ijxTxdrTmE_z1CK1kZ2bh99G79HF0Vsel0it8KFUIaz26dt8ESnwHkGwfFNBmwfFPR9bdUamqNwJjfGqg9quZKfcWn0-DXwuINgeU5NqeeUSA29nqC6E_GPycf_BhZq9JEV_rz6LReZ29bUlPmO5OZIkp7o0zAB20NFM4gI76qlJyva8NU0XxwWToRuqkCn9LfJmAc" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
          {/* Lighting collection tiles — real subcategories */}
          {tiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiles.map((tile) => {
                const content = collectionContent(tile.slug);
                const image = content.image || tile.image;
                return (
                  <Link
                    key={tile.id}
                    to={`/category/${tile.slug}`}
                    className="bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border-subtle transition-all duration-300 group cursor-pointer block"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">
                      <div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
                        <MediaTile src={image} alt={tile.name} icon={tile.icon || "bolt"} accent={tile.accent || undefined} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-4 pt-10">
                        <span className="font-title-md text-title-md text-surface-bright flex items-center justify-between">
                          {tile.name}
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {/* Quick Wholesale Dealer Reassurance Banner */}
          <div className="bg-surface-card rounded-2xl p-5 border border-border-subtle shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  verified
                </span>
              </div>
              <div>
                <p className="font-title-md text-title-md text-primary">
                  {"Guwahati Warehouse Ready Stock for Contractors "}
                  &amp;
                  {" Architects"}
                </p>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Immediate billing with GST invoicing and direct bulk dispatch across all North-East states.
                </p>
              </div>
            </div>
            <a className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-5 py-2.5 rounded-full font-label-md text-label-md font-bold transition-colors whitespace-nowrap flex-shrink-0" href="#order-form">
              {"Inquire Bulk Quantities "}
              <span className="material-symbols-outlined text-[16px]">
                east
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
