import { memo } from "react";
import { snowSheetStyle, type SnowSheetLayer } from "@/lib/snowSheet";

/** Stacked snow layers (far → near) that sway gently. Fills its positioned parent. */
export const SnowSheets = memo(function SnowSheets({ layers }: { layers: readonly SnowSheetLayer[] }) {
  return (
    <div aria-hidden="true" className="snow-sway pointer-events-none absolute inset-0">
      {layers.map((layer, i) => (
        <div key={i} className="snow-sheet" style={snowSheetStyle(layer)} />
      ))}
    </div>
  );
});
