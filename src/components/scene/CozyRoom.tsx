import { memo } from "react";
import { cn } from "@/lib/utils";
import { ChristmasTree } from "./ChristmasTree";
import { Fireplace } from "./Fireplace";
import { StringLights } from "./StringLights";
import { WinterWindow } from "./WinterWindow";

/**
 * Decorative, fixed background scene: a cosy living room on a winter night.
 * Purely visual – hidden from assistive technology. Animations stop with prefers-reduced-motion.
 */
export const CozyRoom = memo(function CozyRoom({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-950">
      {/* Wall with subtle wallpaper stripes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, oklch(1 0 0 / 0.018) 0 2px, transparent 2px 56px), linear-gradient(180deg, oklch(0.2 0.04 280), oklch(0.16 0.035 260) 70%)",
        }}
      />

      {/* Warm firelight spilling into the room */}
      <div
        className="absolute -bottom-[20vh] -left-[10vw] h-[90vh] w-[80vw] animate-flicker rounded-full mix-blend-screen"
        style={{ background: "radial-gradient(closest-side, oklch(0.74 0.17 55 / 0.32), transparent)" }}
      />
      {/* Soft glow behind the tree */}
      <div
        className="absolute -right-[10vw] bottom-0 h-[80vh] w-[50vw] animate-glow-pulse rounded-full"
        style={{ background: "radial-gradient(closest-side, oklch(0.82 0.15 70 / 0.12), transparent)" }}
      />

      <StringLights className="absolute inset-x-0 top-0 h-12 w-full sm:h-16" />

      <WinterWindow className="absolute top-[8vh] left-[6vw] hidden h-[30vh] w-auto opacity-90 xl:block" />

      {/* Wooden floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[14vh]"
        style={{
          background:
            "repeating-linear-gradient(90deg, oklch(0 0 0 / 0.18) 0 2px, transparent 2px 140px), linear-gradient(180deg, oklch(0.36 0.06 50), oklch(0.24 0.05 45))",
          boxShadow: "inset 0 12px 30px -10px oklch(0 0 0 / 0.6)",
        }}
      />
      {/* Rug in front of the fireplace */}
      <div
        className="absolute bottom-[2vh] left-[2vw] h-[6vh] w-[40vw] rounded-[50%] opacity-70"
        style={{
          background: "radial-gradient(closest-side, oklch(0.5 0.15 22), oklch(0.38 0.12 22) 70%, transparent)",
        }}
      />

      <Fireplace
        className={cn(
          "absolute bottom-[7vh] left-[-6vw] h-[38vh] w-auto transition-opacity duration-700 sm:left-[1vw] sm:h-[44vh] lg:left-[3vw] lg:h-[52vh]",
          dimmed ? "opacity-35" : "opacity-30 sm:opacity-60 lg:opacity-100",
        )}
      />
      <ChristmasTree
        className={cn(
          "absolute right-[-10vw] bottom-[6vh] h-[52vh] w-auto transition-opacity duration-700 sm:right-[1vw] sm:h-[62vh] lg:right-[3vw] lg:h-[78vh]",
          dimmed ? "opacity-35" : "opacity-30 sm:opacity-60 lg:opacity-100",
        )}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, oklch(0 0 0 / 0.55))" }}
      />
    </div>
  );
});
