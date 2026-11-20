import { useCallback, useState } from "react";
import {
  Download,
  Images,
  Maximize,
  Minimize,
  Snowflake,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDraw } from "@/hooks/useDraw";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useJinglePlayer } from "@/hooks/useJinglePlayer";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { useParticipants } from "@/hooks/useParticipants";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { useSlideshow } from "@/hooks/useSlideshow";
import { useSnowShake } from "@/hooks/useSnowShake";
import { useSoundPreference } from "@/hooks/useSoundPreference";
import { useStartShortcut } from "@/hooks/useStartShortcut";
import { cn } from "@/lib/utils";
import { DrawStage } from "./DrawStage";
import { CozyRoom } from "./scene/CozyRoom";
import { Snowfall } from "./scene/Snowfall";
import { SnowPlow } from "./scene/SnowPlow";
import { SnowCap } from "./SnowCap";
import { SetupSheet, type SetupTab } from "./SetupSheet";

/** Root feature component: cosy scene, draw stage, dock and setup drawer. */
export function ChristmasGiftGenerator() {
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupTab, setSetupTab] = useState<SetupTab>("names");

  const participants = useParticipants();
  const slideshow = useSlideshow();
  const sound = useSoundPreference();
  const motion = useMotionPreference();
  const dockSnow = useSnowShake();
  const { playRandom, stop } = useJinglePlayer();
  const presentation = usePresentationMode();
  const installPrompt = useInstallPrompt();
  const online = useOnlineStatus();

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
      <SnowPlow />

      <main
        className={cn(
          "relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 pt-16 pb-32 sm:gap-8 sm:px-6 sm:pt-20 sm:pb-48",
          isPresenting ? "max-w-5xl pb-16" : "max-w-2xl",
        )}
      >
        {!isPresenting && (
          <header className="animate-fade-up text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-snow/75 uppercase backdrop-blur">
              <Snowflake className="size-3.5 text-ember-300" aria-hidden="true" />
              Christmas Gift Draw
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance drop-shadow-[0_2px_20px_oklch(0.14_0.03_265_/_0.9)] sm:text-6xl">
              Who is <span className="text-gold animate-shimmer">Santa’s helper</span> this year?
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
          "glass fixed z-30 flex items-center gap-1 rounded-full bg-night-950/60 p-1.5",
          dockSnow.phase === "falling" && "animate-wiggle",
          isPresenting ? "top-4 right-4" : "bottom-6 left-1/2 -translate-x-1/2",
        )}
      >
        {!isPresenting && (
          <SnowCap className="inset-x-6" phase={dockSnow.phase} shakes={dockSnow.shakes} onShake={dockSnow.shake} />
        )}
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
        {!online && (
          <span
            role="status"
            className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-ember-300"
            title="No connection – the app keeps working offline"
          >
            <WifiOff className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Offline</span>
          </span>
        )}
        {installPrompt.canInstall && !isPresenting && (
          <Button variant="ghost" onClick={installPrompt.install} title="Install as an app – works offline">
            <Download aria-hidden="true" />
            <span className="hidden sm:inline">Install</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={motion.toggle}
          aria-pressed={!motion.reduced}
          aria-label={motion.reduced ? "Turn animations on" : "Turn animations off"}
          title={motion.reduced ? "Animations off" : "Animations on"}
          className={motion.reduced ? "text-snow/45" : undefined}
        >
          <Sparkles />
        </Button>
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
