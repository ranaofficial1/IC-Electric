import { useState } from "react";
import Icon from "../ui/Icon.jsx";

export default function Gallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] || images[0];

  return (
    <div>
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-container-low">
        <img
          src={active}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="zoom" className="text-[16px]" />
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                index === activeIndex ? "border-brand-500" : "border-transparent hover:border-neutral-200"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
