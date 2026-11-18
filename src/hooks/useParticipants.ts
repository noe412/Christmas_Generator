import { useCallback, useEffect, useState } from "react";
import { APP_CONFIG } from "@/config";
import { mergeNames, normalizeName, normalizeNames, parseNamesFile, serializeNames } from "@/lib/names";
import { readJson, writeJson } from "@/lib/storage";
import { downloadTextFile } from "@/lib/download";

export type AddResult = "added" | "empty" | "duplicate" | "limit";

function loadInitialNames(): string[] {
  const stored = readJson(APP_CONFIG.storageKey, []);
  return Array.isArray(stored) ? normalizeNames(stored) : [];
}

/** Manages the participant list including persistence, import and export. */
export function useParticipants() {
  const [names, setNames] = useState<string[]>(loadInitialNames);

  useEffect(() => {
    writeJson(APP_CONFIG.storageKey, names);
  }, [names]);

  const add = useCallback(
    (raw: string): AddResult => {
      const name = normalizeName(raw);
      if (!name) return "empty";
      if (names.includes(name)) return "duplicate";
      if (names.length >= APP_CONFIG.limits.maxNames) return "limit";
      setNames((prev) => [...prev, name]);
      return "added";
    },
    [names],
  );

  const remove = useCallback((name: string) => {
    setNames((prev) => prev.filter((n) => n !== name));
  }, []);

  const exportToFile = useCallback(() => {
    downloadTextFile("names.json", serializeNames(names));
  }, [names]);

  /** Imports names from a JSON file and merges them into the current list. */
  const importFromFile = useCallback(async (file: File): Promise<number> => {
    if (file.size > APP_CONFIG.limits.maxImportBytes) throw new Error("File is too large.");
    const imported = parseNamesFile(await file.text());
    setNames((prev) => mergeNames(prev, imported));
    return imported.length;
  }, []);

  return { names, add, remove, exportToFile, importFromFile };
}
