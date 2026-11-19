import { ChevronLeft, ChevronRight, Gift, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config";
import type { DrawPhase } from "@/hooks/useDraw";
import type { Slide } from "@/hooks/useSlideshow";
import { cn } from "@/lib/utils";
import { Confetti } from "./Confetti";
import { SnowCap } from "./SnowCap";

interface DrawStageProps {
  phase: DrawPhase;
  displayName: string;
  winner: string;
  poolSize: number;
  drawnCount: number;
  slides: readonly Slide[];
  slideIndex: number;
  onSelectSlide: (index: number) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onResetRound: () => void;
  onOpenSetup: () => void;
  presentation: boolean;
}

const navBtn =
  "absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-night-950/40 p-2.5 text-snow/90 backdrop-blur transition hover:bg-night-950/70";

/** Frosted-glass stage showing the slideshow and the draw (idle → spinning → winner). */
export function DrawStage(props: DrawStageProps) {
  const { phase, displayName, winner, poolSize, drawnCount, slides, slideIndex, presentation } = props;
  const hasSlides = slides.length > 0;

  return (
    <div className="relative w-full">
      <SnowCap />
      <section
        aria-label="Draw"
        className={cn(
          "glass relative isolate flex w-full max-sm:bg-night-950/55 items-center justify-center overflow-hidden rounded-[var(--radius-card)] text-center",
          presentation ? "min-h-[68vh]" : "min-h-[19rem] sm:min-h-[26rem]",
        )}
      >
        {hasSlides && (
          <div className="absolute inset-0 -z-10" aria-roledescription="carousel" aria-label="Slideshow">
            {slides.map((slide, i) => (
              <img
                key={slide.id}
                src={slide.url}
                alt=""
                aria-hidden={i !== slideIndex}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
                  i === slideIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-night-950/90 via-night-950/45 to-night-950/30" />
          </div>
        )}

        {hasSlides && slides.length > 1 && phase !== "spinning" && (
          <>
            <button
              type="button"
              onClick={props.onPrevSlide}
              aria-label="Previous slide"
              className={cn(navBtn, "left-3")}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={props.onNextSlide} aria-label="Next slide" className={cn(navBtn, "right-3")}>
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => props.onSelectSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === slideIndex}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === slideIndex ? "w-6 bg-snow" : "w-1.5 bg-snow/45 hover:bg-snow/75",
                  )}
                />
              ))}
            </div>
          </>
        )}

        <div className="relative px-6 py-12 sm:px-12" aria-live="polite" aria-atomic="true">
          {phase === "spinning" ? (
            <div>
              <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-ember-300/90 uppercase">
                Shuffling the hat…
              </p>
              <p
                key={displayName}
                className={cn(
                  "animate-pop font-display font-semibold text-snow [animation-duration:0.18s]",
                  presentation ? "text-7xl sm:text-8xl" : "text-5xl sm:text-7xl",
                )}
              >
                {displayName}
              </p>
              <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full origin-left rounded-full bg-linear-to-r from-ember-300 to-cranberry-400"
                  style={{ animation: `progress ${APP_CONFIG.spinTotalMs}ms linear forwards` }}
                />
              </div>
            </div>
          ) : phase === "done" && winner ? (
            <div className="relative">
              <Confetti burstKey={winner} />
              <p className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-ember-300/30 bg-ember-300/10 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-ember-300 uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Santa’s helper
              </p>
              <p
                className={cn(
                  "animate-pop font-display font-bold drop-shadow-[0_4px_30px_oklch(0.74_0.17_55_/_0.45)]",
                  presentation ? "text-7xl sm:text-9xl" : "text-6xl sm:text-8xl",
                )}
              >
                <span className="text-gold animate-shimmer">{winner}</span>
              </p>
              <p className="mt-5 animate-fade-up text-lg text-snow/80 [animation-delay:0.25s] sm:text-xl">
                is handing out the presents <span aria-hidden="true">🎅</span>
              </p>
            </div>
          ) : poolSize === 0 && drawnCount > 0 ? (
            <div className="animate-fade-up">
              <p className="font-display text-3xl font-semibold sm:text-4xl">Everyone has had a turn</p>
              <p className="mt-3 text-snow/65">All {drawnCount} names have been drawn this round.</p>
              <Button variant="primary" size="lg" className="mt-8" onClick={props.onResetRound}>
                <RotateCcw aria-hidden="true" />
                Start a new round
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-linear-to-b from-ember-300/25 to-cranberry-500/20 ring-1 ring-ember-300/30">
                <Gift className="size-9 text-ember-300" aria-hidden="true" />
              </div>
              <p className="font-display text-3xl font-semibold sm:text-4xl">
                {poolSize > 0 ? "Ready when you are" : "Who’s joining the fun?"}
              </p>
              <p className="mt-3 text-snow/65">
                {poolSize > 0
                  ? `${poolSize} ${poolSize === 1 ? "name is" : "names are"} in the hat.`
                  : "Add a few names to fill Santa’s hat."}
              </p>
              {poolSize === 0 && (
                <Button variant="glass" className="mt-7" onClick={props.onOpenSetup}>
                  Add names
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
