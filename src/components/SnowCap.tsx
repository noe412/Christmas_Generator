import { cn } from "@/lib/utils";

/** A soft, wavy layer of snow resting on the top edge of a card. Purely decorative. */
export function SnowCap({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
      className={cn(
        "animate-settle pointer-events-none absolute inset-x-3 -top-[7px] z-10 h-[14px] w-[calc(100%-1.5rem)]",
        className,
      )}
    >
      <path d="M0 10C20 4 36 9 56 6s38-4 60 1 40-3 62-2 34 6 58 3 44-6 66-2 40 5 58 1 30-3 40-1v10H0z" fill="#f4f7ff" />
      <path d="M0 13c40-3 80 1 130-1s90-2 140 0 90 2 130-1v5H0z" fill="#c9d6f0" opacity=".7" />
    </svg>
  );
}
