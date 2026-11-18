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
  const [index, setIndex] = useState(0);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  useEffect(() => () => slidesRef.current.forEach((s) => URL.revokeObjectURL(s.url)), []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((prev) => (prev + 1) % slides.length), APP_CONFIG.slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, index]);

  useEffect(() => {
    if (index >= slides.length && slides.length > 0) setIndex(slides.length - 1);
  }, [index, slides.length]);

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
    setSlides((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const next = useCallback(() => setIndex((p) => (slides.length ? (p + 1) % slides.length : 0)), [slides.length]);
  const prev = useCallback(
    () => setIndex((p) => (slides.length ? (p - 1 + slides.length) % slides.length : 0)),
    [slides.length],
  );

  return { slides, index, setIndex, next, prev, addFiles, remove };
}
