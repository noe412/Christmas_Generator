import { useCallback, useRef, useState } from "react";
import { Maximize, Minimize, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import christmasBackground from "@/assets/christmas-background.jpg";
import { AppHeader } from "./AppHeader";
import { DrawStage } from "./DrawStage";
import { FitToViewport } from "./FitToViewport";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { SlideshowPanel } from "./SlideshowPanel";
import { Snowfall } from "./Snowfall";
import { useDraw } from "@/hooks/useDraw";
import { useJinglePlayer } from "@/hooks/useJinglePlayer";
import { useParticipants } from "@/hooks/useParticipants";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { useSlideshow } from "@/hooks/useSlideshow";
import { useStartShortcut } from "@/hooks/useStartShortcut";
import { cn } from "@/lib/utils";

const glassBtn = "border-2 border-white/30 bg-white/20 text-white shadow-xl backdrop-blur-md hover:bg-white/30";

/** Root feature component: composes participants, slideshow, draw and presentation mode. */
export function ChristmasGiftGenerator() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [showSetup, setShowSetup] = useState(true);

  const participants = useParticipants();
  const slideshow = useSlideshow();
  const { playRandom, stop } = useJinglePlayer();
  const presentation = usePresentationMode(stageRef);

  const { remove: removeParticipant } = participants;
  const onWinner = useCallback(
    (winner: string) => {
      stop();
      // Each person is drawn only once: the winner leaves the pool.
      removeParticipant(winner);
    },
    [stop, removeParticipant],
  );
  const draw = useDraw(participants.names, { onStart: playRandom, onWinner });

  useStartShortcut(draw.start);

  const enterPresentation = () => {
    setShowSetup(false);
    presentation.enter();
  };

  return (
    <>
      {presentation.active && (
        <Button
          onClick={presentation.exit}
          variant="secondary"
          size="lg"
          className={cn("fixed right-4 top-4 z-[10000]", glassBtn)}
        >
          <Minimize aria-hidden="true" className="mr-2 h-5 w-5" />
          Exit
        </Button>
      )}

      <FitToViewport enabled={presentation.active} stageRef={stageRef}>
        <div
          className={cn("relative min-h-screen overflow-hidden", presentation.active && "presentation")}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${christmasBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <Snowfall />

          <main className="inner-frame relative z-10 mx-auto max-w-6xl px-4 py-8">
            {!presentation.active && (
              <>
                <AppHeader />
                <nav className="mb-6 flex flex-wrap justify-center gap-4" aria-label="Controls">
                  <Button
                    onClick={() => setShowSetup((v) => !v)}
                    aria-expanded={showSetup}
                    aria-controls="setup-section"
                    variant="secondary"
                    size="lg"
                    className={glassBtn}
                  >
                    {showSetup ? (
                      <X aria-hidden="true" className="mr-2 h-5 w-5" />
                    ) : (
                      <Settings aria-hidden="true" className="mr-2 h-5 w-5" />
                    )}
                    {showSetup ? "Hide Setup" : "Show Setup"}
                  </Button>
                  <Button
                    onClick={enterPresentation}
                    variant="secondary"
                    size="lg"
                    className="border-2 border-accent bg-accent/80 font-semibold text-foreground shadow-xl backdrop-blur-md hover:bg-accent"
                  >
                    <Maximize aria-hidden="true" className="mr-2 h-5 w-5" />
                    Presentation mode
                  </Button>
                </nav>
              </>
            )}

            {showSetup && !presentation.active && (
              <div id="setup-section" className="mb-8 animate-scale-in space-y-6">
                <ParticipantsPanel
                  names={participants.names}
                  onAdd={participants.add}
                  onRemove={participants.remove}
                  onExport={participants.exportToFile}
                  onImport={participants.importFromFile}
                />
                <SlideshowPanel slides={slideshow.slides} onAdd={slideshow.addFiles} onRemove={slideshow.remove} />
              </div>
            )}

            <div className={cn("mb-8 text-center", presentation.active && "mt-8")}>
              <button
                type="button"
                className="btn-primary"
                onClick={draw.start}
                disabled={draw.isSpinning || participants.names.length === 0}
                aria-keyshortcuts="Enter Space"
                title={
                  participants.names.length === 0 ? "Add at least one name first" : "Start selection (Enter / Space)"
                }
              >
                Start selection
              </button>
            </div>

            <DrawStage
              phase={draw.phase}
              displayName={draw.displayName}
              winner={draw.winner}
              slides={slideshow.slides}
              slideIndex={slideshow.index}
              onSelectSlide={slideshow.setIndex}
              onPrevSlide={slideshow.prev}
              onNextSlide={slideshow.next}
              presentation={presentation.active}
            />

            {!presentation.active && (
              <footer className="mt-8 animate-fade-in text-center font-elegant text-xl text-white/90 drop-shadow-lg">
                <p>✨ Merry Christmas! 🎄✨</p>
              </footer>
            )}
          </main>
        </div>
      </FitToViewport>
    </>
  );
}
