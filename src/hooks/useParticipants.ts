import { useCallback, useEffect, useState } from "react";
import { APP_CONFIG } from "@/config";
import { mergeNames, normalizeName, normalizeNames, parseNamesFile, serializeNames } from "@/lib/names";
import { readJson, writeJson } from "@/lib/storage";
import { downloadTextFile } from "@/lib/download";

export type AddResult = "added" | "empty" | "duplicate" | "limit";

function loadList(key: string): string[] {
  const stored = readJson(key, []);
  return Array.isArray(stored) ? normalizeNames(stored) : [];
}

/**
 * Manages the participant pool and the names already drawn in the current round.
 * Both lists are persisted; `resetRound` puts everyone back into the pool.
 */
export function useParticipants() {
  const [names, setNames] = useState<string[]>(() => loadList(APP_CONFIG.storageKey));
  const [drawn, setDrawn] = useState<string[]>(() => loadList(APP_CONFIG.drawnStorageKey));

  useEffect(() => writeJson(APP_CONFIG.storageKey, names), [names]);
  useEffect(() => writeJson(APP_CONFIG.drawnStorageKey, drawn), [drawn]);

  const add = useCallback(
    (raw: string): AddResult => {
      const name = normalizeName(raw);
      if (!name) return "empty";
      if (names.includes(name) || drawn.includes(name)) return "duplicate";
      if (names.length + drawn.length >= APP_CONFIG.limits.maxNames) return "limit";
      setNames((prev) => [...prev, name]);
      return "added";
    },
    [names, drawn],
  );

  const remove = useCallback((name: string) => {
    setNames((prev) => prev.filter((n) => n !== name));
    setDrawn((prev) => prev.filter((n) => n !== name));
  }, []);

  /** Moves a winner from the pool to the drawn list (everyone is drawn once per round). */
  const markDrawn = useCallback((name: string) => {
    setNames((prev) => prev.filter((n) => n !== name));
    setDrawn((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  /** Starts a new round: all drawn names return to the pool in their original order. */
  const resetRound = useCallback(() => {
    setNames((prev) => mergeNames(prev, drawn));
    setDrawn([]);
  }, [drawn]);

  const clearAll = useCallback(() => {
    setNames([]);
    setDrawn([]);
  }, []);

  const exportToFile = useCallback(() => {
    downloadTextFile("names.json", serializeNames([...names, ...drawn]));
  }, [names, drawn]);

  /** Imports names from a JSON file and merges them into the pool. */
  const importFromFile = useCallback(
    async (file: File): Promise<number> => {
      if (file.size > APP_CONFIG.limits.maxImportBytes) throw new Error("File is too large.");
      const imported = parseNamesFile(await file.text()).filter((n) => !drawn.includes(n));
      setNames((prev) => mergeNames(prev, imported));
      return imported.length;
    },
    [drawn],
  );

  return { names, drawn, add, remove, markDrawn, resetRound, clearAll, exportToFile, importFromFile };
}
