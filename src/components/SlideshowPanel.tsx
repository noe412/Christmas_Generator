import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import type { Slide } from "@/hooks/useSlideshow";

interface SlideshowPanelProps {
  slides: readonly Slide[];
  onAdd: (files: Iterable<File>) => number;
  onRemove: (id: string) => void;
}

export function SlideshowPanel({ slides, onAdd, onRemove }: SlideshowPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const accepted = onAdd(files);
    const rejected = files.length - accepted;
    setStatus(rejected > 0 ? `${accepted} added, ${rejected} skipped (not an image, too large or limit reached).` : "");
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-snow/60">
        Photos play as a slideshow behind the draw. They stay on this device and are never uploaded.
      </p>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-4 py-8 text-snow/80 transition hover:border-ember-300/60 hover:bg-white/[0.07]"
      >
        <ImagePlus className="size-7 text-ember-300" aria-hidden="true" />
        <span className="font-medium">Add photos</span>
        <span className="text-xs text-snow/50">JPG, PNG, WebP · up to 15 MB each</span>
      </button>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-ember-300/90">
        {status}
      </p>

      {slides.length > 0 && (
        <ul className="grid grid-cols-3 gap-2">
          {slides.map((slide, i) => (
            <li key={slide.id} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/10">
              <img src={slide.url} alt={`Slide ${i + 1}: ${slide.name}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(slide.id)}
                aria-label={`Remove slide ${i + 1}`}
                className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-night-950/70 text-snow opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
