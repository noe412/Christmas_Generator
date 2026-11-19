import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Download, Plus, RotateCcw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_CONFIG } from "@/config";
import type { AddResult } from "@/hooks/useParticipants";

interface ParticipantsPanelProps {
  names: readonly string[];
  drawn: readonly string[];
  onAdd: (name: string) => AddResult;
  onRemove: (name: string) => void;
  onResetRound: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<number>;
}

const ADD_MESSAGES: Record<Exclude<AddResult, "added">, string> = {
  empty: "Please enter a name.",
  duplicate: "This name is already on the list.",
  limit: `The list is limited to ${APP_CONFIG.limits.maxNames} names.`,
};

const chip =
  "group inline-flex animate-pop items-center gap-1.5 rounded-full border py-1.5 pr-1.5 pl-3.5 text-sm [animation-duration:0.3s]";

export function ParticipantsPanel(props: ParticipantsPanelProps) {
  const { names, drawn, onAdd, onRemove } = props;
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = onAdd(value);
    setStatus(result === "added" ? "" : ADD_MESSAGES[result]);
    if (result === "added") setValue("");
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file
    if (!file) return;
    try {
      const count = await props.onImport(file);
      setStatus(`${count} name(s) imported.`);
    } catch (err) {
      setStatus(`Import failed: ${err instanceof Error ? err.message : "invalid file"}`);
    }
  };

  return (
    <div className="space-y-7">
      <form className="flex gap-2" onSubmit={submit}>
        <label htmlFor="participant-name" className="sr-only">
          Participant name
        </label>
        <Input
          id="participant-name"
          autoComplete="off"
          maxLength={APP_CONFIG.limits.maxNameLength}
          placeholder="Add a name…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" variant="primary" size="icon" className="size-11 shrink-0" aria-label="Add">
          <Plus />
        </Button>
      </form>
      <p role="status" aria-live="polite" className="-mt-5 min-h-5 px-2 text-sm text-ember-300/90">
        {status}
      </p>

      <section aria-labelledby="pool-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 id="pool-heading" className="text-sm font-semibold tracking-wide text-snow/70 uppercase">
            In the hat · {names.length}
          </h3>
        </div>
        {names.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-snow/50">
            No names yet – add the first one above.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {names.map((name) => (
              <li key={name} className={`${chip} border-white/12 bg-white/[0.07]`}>
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ${name}`}
                  className="grid size-6 place-items-center rounded-full text-snow/50 transition hover:bg-cranberry-500/25 hover:text-cranberry-400"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {drawn.length > 0 && (
        <section aria-labelledby="drawn-heading">
          <div className="mb-3 flex items-center justify-between">
            <h3 id="drawn-heading" className="text-sm font-semibold tracking-wide text-snow/70 uppercase">
              Already drawn · {drawn.length}
            </h3>
            <Button variant="ghost" size="sm" onClick={props.onResetRound}>
              <RotateCcw aria-hidden="true" />
              New round
            </Button>
          </div>
          <ol className="flex flex-wrap gap-2">
            {drawn.map((name, i) => (
              <li key={name} className={`${chip} border-ember-300/25 bg-ember-300/10 pr-3.5 text-ember-300`}>
                <span className="text-xs text-ember-300/60 tabular-nums">{i + 1}.</span>
                {name}
                <Check className="size-3.5" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="flex gap-2 border-t border-white/10 pt-5">
        <Button variant="ghost" size="sm" onClick={props.onExport} disabled={!names.length && !drawn.length}>
          <Download aria-hidden="true" />
          Export
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload aria-hidden="true" />
          Import
        </Button>
      </div>
    </div>
  );
}
