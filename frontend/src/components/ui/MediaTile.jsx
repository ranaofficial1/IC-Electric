import { useState } from "react";
import Icon from "./Icon.jsx";

/**
 * Renders product/category photography. `src` is currently a Lorem Picsum
 * URL (seeded when the catalog was seeded into the database — see
 * backend/src/db/seed.js) — swap for real media-API URLs later and this
 * component needs no changes.
 *
 * Falls back to a small gradient + icon tile if the image fails to load
 * (e.g. offline), so the UI never shows a broken-image icon.
 */
export default function MediaTile({ src, alt = "", icon = "star", accent = "#005cba", className = "" }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
        style={{ background: `linear-gradient(155deg, ${accent} 0%, #0a2540 130%)` }}
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/50 text-white">
          <Icon name={icon} className="text-[22px]" />
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
