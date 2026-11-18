import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_CONFIG } from "@/config";
import type { AddResult } from "@/hooks/useParticipants";

interface ParticipantsPanelProps {
  names: readonly string[];
  onAdd: (name: string) => AddResult;
  onRemove: (name: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<number>;
}

const ADD_MESSAGES: Record<Exclude<AddResult, "added">, string> = {
  empty: "Please enter a name.",
  duplicate: "This name is already on the list.",
  limit: `The list is limited to ${APP_CONFIG.limits.maxNames} names.`,
};

const secondaryBtn = "border-2 border-primary/30 bg-white/80 text-primary hover:bg-white";

export function ParticipantsPanel({ names, onAdd, onRemove, onExport, onImport }: ParticipantsPanelProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = onAdd(value);
    if (result === "added") {
      setValue("");
      setStatus("");
    } else {
      setStatus(ADD_MESSAGES[result]);
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file
    if (!file) return;
    try {
      const count = await onImport(file);
      setStatus(`${count} name(s) imported.`);
    } catch (err) {
      setStatus(`Import failed: ${err instanceof Error ? err.message : "invalid file"}`);
    }
  };

  return (
    <Card className="border-4 border-accent/50 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
      <h2 className="mb-4 font-elegant text-2xl font-bold text-primary">Add names</h2>
      <form className="flex gap-3" onSubmit={submit}>
        <label htmlFor="participant-name" className="sr-only">
          Participant name
        </label>
        <Input
          id="participant-name"
          type="text"
          autoComplete="off"
          maxLength={APP_CONFIG.limits.maxNameLength}
          placeholder="Enter name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-2 border-primary/50 bg-white font-body text-lg text-card-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <Button
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 font-semibold text-white transition-all hover:shadow-festive"
        >
          <Plus aria-hidden="true" className="mr-2 h-5 w-5" />
          Add
        </Button>
      </form>

      <div className="mt-3 flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onExport}
          disabled={!names.length}
          className={secondaryBtn}
        >
          <Download aria-hidden="true" className="mr-2 h-4 w-4" />
          Export
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className={secondaryBtn}
        >
          <Upload aria-hidden="true" className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>

      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-muted-foreground">
        {status}
      </p>

      {names.length > 0 && (
        <section className="mt-4" aria-labelledby="participants-heading">
          <h3 id="participants-heading" className="mb-3 font-elegant text-lg font-semibold text-primary">
            Santas and Mrs. Claus ({names.length})
          </h3>
          <ul className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2">
            {names.map((name) => (
              <li
                key={name}
                className="flex animate-scale-in items-center justify-between rounded-lg border-2 border-primary/30 bg-white/80 p-3 shadow-sm transition-all hover:bg-white"
              >
                <span className="font-body text-base font-medium text-card-foreground">{name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ${name}`}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Card>
  );
}
