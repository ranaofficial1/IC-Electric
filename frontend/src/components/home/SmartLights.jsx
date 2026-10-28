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
      <section className="w-full px-gutter-mobile sm:px-gutter py-16 sm:py-20 lg:py-24 bg-surface-canvas" id="smart-lights-section">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-12 lg:gap-16">
          {/* Section Header & Filter Badges */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
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
              <h2 className="font-headline-lg text-[28px] font-bold leading-[1.3] tracking-tight text-primary sm:text-[28px] sm:leading-[1.25] lg:text-headline-lg">
                Home Lighting Reimagined With Crompton Lights
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mt-3 leading-relaxed">
                Architectural downlights, glare-free linear battens, weatherproof street fixtures, and everyday home illumination built with flicker-free LED drivers and eye-comfort optics.
              </p>
            </div>
            {/* <div className="flex items-center gap-2 flex-wrap">
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
            </div> */}
          </div>
          {/* Prominent Spotlight Feature Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-primary border border-border-subtle group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 min-w-0 p-6 sm:p-10 lg:p-14 z-10 flex flex-col justify-center text-on-primary gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                    Signature Luminaire Range
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-surface-bright leading-tight tracking-tight mt-1">
                  Intelligent Lightscapes For Every Contemporary Space
                </h3>
                <p className="font-body-md text-body-md text-on-primary-container max-w-xl leading-relaxed">
                  From subtle recessed accents and smooth battens to high-efficiency emergency illumination. Discover Crompton's authorized collection engineered for longevity and optical harmony.
                </p>
                <div className="flex items-center gap-4 pt-3 sm:pt-4 flex-wrap">
                  <a className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-8 py-3 rounded-full font-label-md text-label-md font-bold transition-all shadow-md" href="#order-form">
                    Explore Collection 
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                  
                </div>
              </div>
              <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-full lg:min-h-[22rem] overflow-hidden">
                <img alt="Home lighting" className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform duration-700" src="https://anuragtraders.com/wp-content/uploads/Lights-Main-Banner.webp" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
          {/* Lighting collection tiles — real subcategories */}
          {tiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {tiles.map((tile) => {
                const content = collectionContent(tile.slug);
                const image = content.image || tile.image;
                return (
                  <Link
                    key={tile.id}
                    to={`/category/${tile.slug}`}
                    className="bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border-subtle transition-all duration-300 group cursor-pointer block"
                  >
                    <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-surface-container-low">
                      <div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
                        <MediaTile src={image} alt={tile.name} icon={tile.icon || "bolt"} accent={tile.accent || undefined} fit="cover" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-5 pt-12">
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


          {/* <div className="bg-surface-card rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1 rounded-full bg-discount-emerald/20 text-discount-emerald text-label-sm font-label-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-discount-emerald" />
                  Ready for Immediate Dispatch
                </span>
              
              </div>

              <h3 className="font-headline-md text-headline-sm sm:text-headline-md font-bold tracking-tight text-primary max-w-3xl">
                {"Guwahati Warehouse Ready Stock for Contractors "}
                &amp;
                {" Architects"}
              </h3>
              <p className="font-body-lg text-body-md sm:text-body-lg text-text-muted mt-4 leading-relaxed">
                Immediate billing with GST invoicing and direct bulk dispatch across all North-East states.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md font-medium">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    receipt_long
                  </span>
                  Instant GST Invoicing
                </span>
               
              </div>
            </div>

            <a className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-7 py-3 rounded-full font-label-lg text-label-lg font-bold shadow-brand transition-colors whitespace-nowrap flex-shrink-0 self-start lg:self-center" href="#order-form">
              {"Inquire Bulk Quantities "}
              <span className="material-symbols-outlined text-[20px]">
                east
              </span>
            </a>
          </div> */}
        </div>
      </section>
    </>
  );
}
