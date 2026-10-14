import { useState } from "react";
import Icon from "./Icon.jsx";

const FIT_CLASSES = {
  contain: "object-contain",
  cover: "object-cover",
};

export default function MediaTile({ src, alt = "", icon = "star", accent = "#005cba", className = "", fit = "contain" }) {
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
      className={`h-full w-full ${FIT_CLASSES[fit] ?? FIT_CLASSES.contain} ${className}`}

    />
  );
}
