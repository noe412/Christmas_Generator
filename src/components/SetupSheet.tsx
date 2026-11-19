import { useId } from "react";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AddResult } from "@/hooks/useParticipants";
import type { Slide } from "@/hooks/useSlideshow";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { SlideshowPanel } from "./SlideshowPanel";

export type SetupTab = "names" | "photos";

interface SetupSheetProps {
  open: boolean;
  tab: SetupTab;
  onTabChange: (tab: SetupTab) => void;
  onOpenChange: (open: boolean) => void;
  names: readonly string[];
  drawn: readonly string[];
  onAdd: (name: string) => AddResult;
  onRemove: (name: string) => void;
  onResetRound: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<number>;
  slides: readonly Slide[];
  onAddSlides: (files: Iterable<File>) => number;
  onRemoveSlide: (id: string) => void;
}

const TABS: { id: SetupTab; label: string }[] = [
  { id: "names", label: "Names" },
  { id: "photos", label: "Photos" },
];

/** Side drawer with the participant list and the slideshow photos. */
export function SetupSheet(props: SetupSheetProps) {
  const baseId = useId();
  return (
    <Sheet
      open={props.open}
      onOpenChange={props.onOpenChange}
      title="Set up the draw"
      description="Everything stays in this browser – nothing is uploaded."
    >
      <div
        role="tablist"
        aria-label="Setup sections"
        className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] p-1"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${baseId}-${t.id}-tab`}
            aria-selected={props.tab === t.id}
            aria-controls={`${baseId}-${t.id}-panel`}
            onClick={() => props.onTabChange(t.id)}
            className={cn(
              "h-9 rounded-full text-sm font-medium transition",
              props.tab === t.id ? "bg-snow text-night-950 shadow" : "text-snow/70 hover:text-snow",
            )}
          >
            {t.label}
            {t.id === "names" && ` · ${props.names.length + props.drawn.length}`}
            {t.id === "photos" && props.slides.length > 0 && ` · ${props.slides.length}`}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-${props.tab}-panel`} aria-labelledby={`${baseId}-${props.tab}-tab`}>
        {props.tab === "names" ? (
          <ParticipantsPanel
            names={props.names}
            drawn={props.drawn}
            onAdd={props.onAdd}
            onRemove={props.onRemove}
            onResetRound={props.onResetRound}
            onExport={props.onExport}
            onImport={props.onImport}
          />
        ) : (
          <SlideshowPanel slides={props.slides} onAdd={props.onAddSlides} onRemove={props.onRemoveSlide} />
        )}
      </div>
    </Sheet>
  );
}
