import { useRef, useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className="border-4 border-accent/50 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
      <h2 className="mb-4 font-elegant text-2xl font-bold text-primary">Images for slideshow</h2>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      <Button
        type="button"
        size="lg"
        onClick={() => fileRef.current?.click()}
        className="mb-2 w-full bg-linear-to-r from-secondary to-secondary/80"
      >
        <Upload aria-hidden="true" className="mr-2 h-5 w-5" />
        Upload pictures
      </Button>
      <p role="status" aria-live="polite" className="mb-2 min-h-[1.25rem] text-sm text-muted-foreground">
        {status}
      </p>

      {slides.length > 0 && (
        <ul className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto pt-2 md:grid-cols-6">
          {slides.map((slide, i) => (
            <li key={slide.id} className="group relative">
              <img
                src={slide.url}
                alt={`Slide ${i + 1}: ${slide.name}`}
                className="h-20 w-full rounded border-2 border-primary/30 object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(slide.id)}
                aria-label={`Remove slide ${i + 1}`}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
