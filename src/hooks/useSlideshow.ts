import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/config";

export interface Slide {
  id: string;
  url: string;
  name: string;
}

let slideCounter = 0;

/**
 * Manages slideshow images as object URLs (memory efficient, revoked on removal/unmount)
 * and the auto-advancing current index.
 */
export function useSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [rawIndex, setIndex] = useState(0);
  // Clamp during render instead of syncing state in an effect (e.g. after the last slide was removed).
  const index = slides.length ? Math.min(rawIndex, slides.length - 1) : 0;
  const slidesRef = useRef(slides);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => () => slidesRef.current.forEach((s) => URL.revokeObjectURL(s.url)), []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((index + 1) % slides.length), APP_CONFIG.slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, index]);

  /** Adds valid image files; returns the number of files that were accepted. */
  const addFiles = useCallback((files: Iterable<File>): number => {
    const { maxImageBytes, maxImages } = APP_CONFIG.limits;
    const free = Math.max(0, maxImages - slidesRef.current.length);
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/") && f.size <= maxImageBytes)
      .slice(0, free)
      .map((file) => ({ id: `slide-${++slideCounter}`, url: URL.createObjectURL(file), name: file.name }));
    if (accepted.length) setSlides((prev) => [...prev, ...accepted]);
    return accepted.length;
  }, []);

  const remove = useCallback((id: string) => {
    const target = slidesRef.current.find((s) => s.id === id);
    if (target) URL.revokeObjectURL(target.url);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const next = useCallback(() => setIndex(slides.length ? (index + 1) % slides.length : 0), [index, slides.length]);
  const prev = useCallback(
    () => setIndex(slides.length ? (index - 1 + slides.length) % slides.length : 0),
    [index, slides.length],
  );

  return { slides, index, setIndex, next, prev, addFiles, remove };
}
