import type { CSSProperties } from "react";
import { seeded } from "./seeded";

export interface SnowSheetLayer {
  /** Tile size in px – the pattern repeats every tile, the layer loops by one tile. */
  tile: number;
  /** Flakes per tile. */
  flakes: number;
  /** Flake radius range in px. */
  minR: number;
  maxR: number;
  /** Seconds to fall one tile (lower = faster). */
  duration: number;
  opacity: number;
  blur?: number;
  seed: number;
}

/**
 * A whole layer of snowflakes painted once as tiled radial gradients and moved by the
 * compositor (transform only). Hundreds of flakes cost about as much as a single element.
 */
export function snowSheetStyle(layer: SnowSheetLayer): CSSProperties {
  const rand = seeded(layer.seed);
  const dots = Array.from({ length: layer.flakes }, () => {
    const x = (rand() * 100).toFixed(1);
    const y = (rand() * 100).toFixed(1);
    const r = (layer.minR + rand() * (layer.maxR - layer.minR)).toFixed(2);
    return `radial-gradient(circle at ${x}% ${y}%, #fff 0 ${r}px, transparent calc(${r}px + 0.8px))`;
  });
  return {
    backgroundImage: dots.join(", "),
    backgroundSize: `${layer.tile}px ${layer.tile}px`,
    top: -layer.tile,
    height: `calc(100% + ${layer.tile}px)`,
    opacity: layer.opacity,
    filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
    animationDuration: `${layer.duration}s`,
    ["--tile" as string]: `${layer.tile}px`,
  };
}
