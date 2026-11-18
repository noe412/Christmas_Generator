import { Gift } from "lucide-react";

const glowIcon =
  "h-12 w-12 md:h-16 md:w-16 text-accent animate-bounce-subtle drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]";

export function AppHeader() {
  return (
    <header className="mb-8 animate-fade-in text-center">
      <div className="mb-4 flex items-center justify-center gap-4">
        <Gift aria-hidden="true" className={glowIcon} />
        <h1 className="font-christmas text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.9)] md:text-7xl">
          Who Is Santa’s Helper?
        </h1>
        <Gift aria-hidden="true" className={glowIcon} />
      </div>
      <p className="font-elegant text-xl text-white/90 drop-shadow-lg md:text-2xl">Who’s giving, who’s getting?</p>
    </header>
  );
}
