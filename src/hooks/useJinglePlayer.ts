import { useCallback, useEffect, useRef } from "react";
import { pickRandom } from "@/lib/random";

// All MP3 files in the sounds folder are bundled automatically.
const soundModules = import.meta.glob("@/assets/sounds/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const JINGLES: readonly string[] = Object.values(soundModules);

/** Plays a random jingle; a single shared audio element is reused and released on unmount. */
export function useJinglePlayer(tracks: readonly string[] = JINGLES) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const playRandom = useCallback(() => {
    if (tracks.length === 0) return;
    audioRef.current ??= new Audio();
    const audio = audioRef.current;
    audio.src = pickRandom(tracks);
    // Autoplay can be blocked by the browser; the draw still works without sound.
    audio.play().catch(() => undefined);
  }, [tracks]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  return { playRandom, stop };
}
