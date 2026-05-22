import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cloneStringArray } from "../utils";

export function OptionsManager({
    options,
    onChange,
}: {
    options: string[];
    onChange: (options: string[]) => void;
}) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Options</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7"
                    onClick={() => onChange([...cloneStringArray(options), `Option ${options.length + 1}`])}
                >
                    <Plus className="mr-1.5 size-3.5" />
                    Add
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {options.map((opt, idx) => (
                    <div key={`opt:${idx}`} className="flex items-center gap-2">
                        <Input
                            value={opt}
                            onChange={(e) => {
                                const next = cloneStringArray(options);
                                next[idx] = e.target.value;
                                onChange(next);
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            onClick={() => {
                                const next = options.filter((_, i) => i !== idx);
                                onChange(next.length ? next : ["Option 1"]);
                            }}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
