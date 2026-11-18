import { ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DrawPhase } from "@/hooks/useDraw";
import type { Slide } from "@/hooks/useSlideshow";

interface DrawStageProps {
  phase: DrawPhase;
  displayName: string;
  winner: string;
  slides: readonly Slide[];
  slideIndex: number;
  onSelectSlide: (index: number) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  presentation: boolean;
}

const redGlow = "drop-shadow-[0_0_30px_rgba(220,38,38,0.9)]";
const navBtn =
  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/70";

/** Ornate picture frame containing the slideshow and the draw result. */
export function DrawStage(props: DrawStageProps) {
  const { phase, displayName, winner, slides, slideIndex, presentation } = props;
  const hasSlides = slides.length > 0;
  // White text on photos, festive red on the plain card – keeps contrast in both cases.
  const textTone = hasSlides ? "text-white" : "text-primary";

  return (
    <div className="relative mx-auto max-w-4xl animate-scale-in">
      <div className="absolute inset-0 -rotate-1 rounded-lg bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 shadow-2xl" />
      <div className="absolute inset-0 rotate-1 rounded-lg bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-700 shadow-2xl" />

      <div className="relative rounded-lg bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="pointer-events-none absolute inset-6 rounded border-4 border-amber-900/50" />
        <div className="pointer-events-none absolute inset-8 rounded border-2 border-amber-400/30" />
        <div className="absolute left-4 top-4 h-12 w-12 rounded-tl-lg border-l-4 border-t-4 border-accent" />
        <div className="absolute right-4 top-4 h-12 w-12 rounded-tr-lg border-r-4 border-t-4 border-accent" />
        <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-lg border-b-4 border-l-4 border-accent" />
        <div className="absolute bottom-4 right-4 h-12 w-12 rounded-br-lg border-b-4 border-r-4 border-accent" />

        <Card
          className={cn(
            "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-amber-50 to-white shadow-inner",
            presentation ? "min-h-[62vh]" : "min-h-[500px]",
          )}
        >
          {hasSlides && (
            <div className="absolute inset-0" aria-roledescription="carousel" aria-label="Slideshow">
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
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={props.onPrevSlide}
                    aria-label="Previous slide"
                    className={cn(navBtn, "left-4")}
                  >
                    <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={props.onNextSlide}
                    aria-label="Next slide"
                    className={cn(navBtn, "right-4")}
                  >
                    <ChevronRight aria-hidden="true" className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {slides.map((slide, i) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => props.onSelectSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === slideIndex}
                        className={cn(
                          "h-3 w-3 rounded-full transition-all",
                          i === slideIndex ? "scale-125 bg-white" : "bg-white/50 hover:bg-white/75",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <div className="relative z-10 p-12 text-center" aria-live="polite" aria-atomic="true">
            {phase === "spinning" ? (
              <div className="animate-pulse">
                <div
                  className={cn(
                    "mb-6 animate-bounce-subtle font-christmas text-6xl font-bold md:text-8xl",
                    textTone,
                    hasSlides && redGlow,
                  )}
                >
                  {displayName}
                </div>
                <div
                  className={cn(
                    "font-elegant text-3xl font-semibold",
                    hasSlides ? "text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" : "text-card-foreground",
                  )}
                >
                  Selecting...
                </div>
              </div>
            ) : phase === "done" && winner ? (
              <div className="animate-scale-in">
                <div aria-hidden="true" className="mb-8 animate-spin-slow text-9xl drop-shadow-2xl">
                  🎁
                </div>
                <div
                  className={cn("mb-6 font-christmas text-6xl font-bold md:text-7xl", textTone, hasSlides && redGlow)}
                >
                  {winner}
                </div>
                <div
                  className={cn(
                    "font-elegant text-3xl font-semibold md:text-4xl",
                    hasSlides ? "text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" : "text-card-foreground",
                  )}
                >
                  is handing out the presents! <span aria-hidden="true">🎅</span>
                </div>
              </div>
            ) : (
              <div
                className={hasSlides ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" : "text-muted-foreground"}
              >
                <Gift aria-hidden="true" className="mx-auto mb-8 h-32 w-32 opacity-80" />
                <p className="font-elegant text-3xl">
                  {hasSlides
                    ? "Click on ‘Start selection’ to begin"
                    : "Add names and pictures, then start the selection"}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
