import { useCallback, useState } from "react";
import { Images, Maximize, Minimize, Users, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDraw } from "@/hooks/useDraw";
import { useJinglePlayer } from "@/hooks/useJinglePlayer";
import { useParticipants } from "@/hooks/useParticipants";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { useSlideshow } from "@/hooks/useSlideshow";
import { useSoundPreference } from "@/hooks/useSoundPreference";
import { useStartShortcut } from "@/hooks/useStartShortcut";
import { cn } from "@/lib/utils";
import { DrawStage } from "./DrawStage";
import { CozyRoom } from "./scene/CozyRoom";
import { Snowfall } from "./scene/Snowfall";
import { SnowCap } from "./SnowCap";
import { SetupSheet, type SetupTab } from "./SetupSheet";

/** Root feature component: cosy scene, draw stage, dock and setup drawer. */
export function ChristmasGiftGenerator() {
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupTab, setSetupTab] = useState<SetupTab>("names");

  const participants = useParticipants();
  const slideshow = useSlideshow();
  const sound = useSoundPreference();
  const { playRandom, stop } = useJinglePlayer();
  const presentation = usePresentationMode();

  const { markDrawn } = participants;
  const onStart = useCallback(() => {
    if (sound.enabled) playRandom();
  }, [sound.enabled, playRandom]);
  const onWinner = useCallback(
    (winner: string) => {
      stop();
      markDrawn(winner);
    },
    [stop, markDrawn],
  );
  const draw = useDraw(participants.names, { onStart, onWinner });

  useStartShortcut(() => {
    if (!setupOpen) draw.start();
  });

  const openSetup = (tab: SetupTab) => {
    setSetupTab(tab);
    setSetupOpen(true);
  };

  const toggleSound = () => {
    if (sound.enabled) stop();
    sound.toggle();
  };

  const poolSize = participants.names.length;
  const totalNames = poolSize + participants.drawn.length;
  const isPresenting = presentation.active;

  return (
    <div className="relative flex min-h-dvh flex-col">
      <CozyRoom dimmed={setupOpen} />
      <Snowfall />

      <main
        className={cn(
          "relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 pt-16 pb-32 sm:gap-8 sm:px-6 sm:pt-20 sm:pb-44",
          isPresenting ? "max-w-5xl pb-16" : "max-w-2xl",
        )}
      >
        {!isPresenting && (
          <header className="animate-fade-up text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-snow/75 uppercase backdrop-blur">
              <span className="size-1.5 rounded-full bg-apricot-300" aria-hidden="true" />
              Christmas Gift Draw
            </p>
            <h1 className="font-display text-5xl leading-[0.98] font-normal tracking-[-0.03em] sm:text-7xl">
              Who will be
              <span className="block pr-2 text-apricot-300 italic">Santa’s helper?</span>
            </h1>
          </header>
        )}

        <DrawStage
          phase={draw.phase}
          displayName={draw.displayName}
          winner={draw.winner}
          poolSize={poolSize}
          drawnCount={participants.drawn.length}
          slides={slideshow.slides}
          slideIndex={slideshow.index}
          onSelectSlide={slideshow.setIndex}
          onPrevSlide={slideshow.prev}
          onNextSlide={slideshow.next}
          onResetRound={participants.resetRound}
          onOpenSetup={() => openSetup("names")}
          presentation={isPresenting}
        />

        <div className="flex flex-col items-center gap-3">
          <Button
            variant="primary"
            size={isPresenting ? "xl" : "lg"}
            onClick={draw.start}
            disabled={draw.isSpinning || poolSize === 0}
            aria-keyshortcuts="Enter Space"
            className="min-w-56 font-semibold"
          >
            {draw.phase === "done" && poolSize > 0 ? "Draw the next helper" : "Start the draw"}
          </Button>
          <p className="hidden text-xs text-snow/45 sm:block">
            Press <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-sans">Enter</kbd> or{" "}
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-sans">Space</kbd>
          </p>
        </div>
      </main>

      <nav
        aria-label="Controls"
        className={cn(
          "glass fixed z-30 flex items-center gap-1 rounded-full p-1.5",
          isPresenting ? "top-4 right-4" : "bottom-6 left-1/2 -translate-x-1/2",
        )}
      >
        {!isPresenting && <SnowCap className="inset-x-6 w-[calc(100%-3rem)]" />}
        {!isPresenting && (
          <>
            <Button variant="ghost" onClick={() => openSetup("names")} aria-haspopup="dialog">
              <Users aria-hidden="true" />
              Names
              <span className="rounded-full bg-ember-300/20 px-2 text-xs text-ember-300 tabular-nums">
                {totalNames}
              </span>
            </Button>
            <Button variant="ghost" onClick={() => openSetup("photos")} aria-haspopup="dialog">
              <Images aria-hidden="true" />
              <span className="hidden sm:inline">Photos</span>
            </Button>
            <span className="mx-1 h-6 w-px bg-white/15" aria-hidden="true" />
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          aria-pressed={sound.enabled}
          aria-label={sound.enabled ? "Mute jingles" : "Unmute jingles"}
          title={sound.enabled ? "Sound on" : "Sound off"}
        >
          {sound.enabled ? <Volume2 /> : <VolumeX />}
        </Button>
        <Button
          variant="ghost"
          onClick={(e) => {
            // Release focus so Enter/Space start the draw instead of toggling presentation again.
            e.currentTarget.blur();
            presentation.toggle();
          }}
          aria-pressed={isPresenting}
        >
          {isPresenting ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
          <span className="hidden sm:inline">{isPresenting ? "Exit" : "Present"}</span>
        </Button>
      </nav>

      <SetupSheet
        open={setupOpen}
        onOpenChange={setSetupOpen}
        tab={setupTab}
        onTabChange={setSetupTab}
        names={participants.names}
        drawn={participants.drawn}
        onAdd={participants.add}
        onRemove={participants.remove}
        onResetRound={participants.resetRound}
        onExport={participants.exportToFile}
        onImport={participants.importFromFile}
        slides={slideshow.slides}
        onAddSlides={slideshow.addFiles}
        onRemoveSlide={slideshow.remove}
      />
    </div>
  );
}
