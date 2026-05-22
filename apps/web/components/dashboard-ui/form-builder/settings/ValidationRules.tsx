import * as React from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { DebouncedInput } from "../ui/DebouncedInput";
import { isFileField, isNumberField, isRatingField, isTextField, parseOptionalNumber } from "../utils";
import type { BuilderFieldType, FieldValidation, FileValidation, NumberValidation, RatingValidation, TextValidation } from "../types";

export function ValidationRules({
    type,
    validation,
    onChange,
}: {
    type: BuilderFieldType;
    validation: FieldValidation;
    onChange: (validation: FieldValidation) => void;
}) {
    if (isTextField(type) && validation.kind === "text") {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                <div className="text-sm font-semibold">Validation</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min length</Label>
                        <Input
                            inputMode="numeric"
                            value={validation.minLength?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, minLength: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max length</Label>
                        <Input
                            inputMode="numeric"
                            value={validation.maxLength?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, maxLength: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                    <div className="col-span-2 flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Pattern (regex)</Label>
                        <DebouncedInput
                            value={validation.pattern ?? ""}
                            onChange={(v) => onChange({ ...validation, pattern: v })}
                            placeholder="e.g. ^[A-Z0-9]+$"
                        />
                    </div>
                </div>
                {type === "email" && (
                    <div className="text-muted-foreground text-xs mt-2">
                        Email fields validate format automatically during preview.
                    </div>
                )}
            </div>
        );
    }

    if (isNumberField(type) && validation.kind === "number") {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                <div className="text-sm font-semibold">Validation</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min</Label>
                        <Input
                            inputMode="decimal"
                            value={validation.min?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, min: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max</Label>
                        <Input
                            inputMode="decimal"
                            value={validation.max?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, max: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (isFileField(type) && validation.kind === "file") {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                <div className="text-sm font-semibold">Validation</div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Accepted types</Label>
                        <DebouncedInput
                            value={validation.accept ?? ""}
                            onChange={(v) => onChange({ ...validation, accept: v })}
                            placeholder="e.g. image/*,.pdf"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max size (MB)</Label>
                        <Input
                            inputMode="decimal"
                            value={validation.maxSizeMb?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, maxSizeMb: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (isRatingField(type) && validation.kind === "rating") {
        return (
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                <div className="text-sm font-semibold">Validation</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min</Label>
                        <Input
                            inputMode="numeric"
                            value={validation.min?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, min: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max</Label>
                        <Input
                            inputMode="numeric"
                            value={validation.max?.toString() ?? ""}
                            onChange={(e) => onChange({ ...validation, max: parseOptionalNumber(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
