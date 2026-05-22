import * as React from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";
import type { FieldElement } from "../types";

export interface FieldProps {
    element: FieldElement;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
}

export function TextField({ element, value, onChange, error }: FieldProps) {
    const val = (value as string | undefined) ?? element.defaultValue ?? "";
    const isEmail = element.type === "email";
    
    // For email, we might do local quick validation or rely on global
    const inputType = isEmail ? "email" : "text";

    if (element.type === "long_text") {
        return (
            <Textarea
                value={val}
                onChange={(e) => onChange(e.target.value)}
                placeholder={element.placeholder}
                className="resize-none"
                aria-invalid={!!error}
            />
        );
    }

    return (
        <Input
            type={inputType}
            value={val}
            onChange={(e) => onChange(e.target.value)}
            placeholder={element.placeholder}
            aria-invalid={!!error}
        />
    );
}

export function NumberField({ element, value, onChange, error }: FieldProps) {
    const val = (value as string | undefined) ?? element.defaultValue ?? "";
    
    if (element.type === "rating") {
        const min = element.validation.kind === "rating" ? element.validation.min ?? 1 : 1;
        const max = element.validation.kind === "rating" ? element.validation.max ?? 5 : 5;
        const numValue = typeof value === "number" ? value : Number(element.defaultValue || min);
        
        return (
            <div className="flex items-center gap-3">
                <Slider
                    value={[Number.isFinite(numValue) ? numValue : min]}
                    min={min}
                    max={max}
                    step={1}
                    onValueChange={(v) => onChange(v[0] ?? min)}
                />
                <div className="text-muted-foreground w-10 text-right text-sm tabular-nums">
                    {Number.isFinite(numValue) ? numValue : min}
                </div>
            </div>
        );
    }

    return (
        <Input
            inputMode="decimal"
            value={val}
            onChange={(e) => onChange(e.target.value)}
            placeholder={element.placeholder}
            aria-invalid={!!error}
        />
    );
}

export function ChoiceField({ element, value, onChange, error }: FieldProps) {
    if (element.type === "dropdown") {
        const val = (value as string | undefined) ?? element.defaultValue ?? "";
        return (
            <Select value={val} onValueChange={onChange}>
                <SelectTrigger className={cn("w-full", error && "border-destructive")}>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {element.options.map((opt) => (
                        <SelectItem key={`${element.id}:${opt}`} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (element.type === "radio") {
        const val = (value as string | undefined) ?? element.defaultValue ?? "";
        return (
            <RadioGroup value={val} onValueChange={onChange} className="gap-2">
                {element.options.map((opt) => (
                    <Label
                        key={`${element.id}:${opt}`}
                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm cursor-pointer"
                    >
                        <RadioGroupItem value={opt} />
                        <span>{opt}</span>
                    </Label>
                ))}
            </RadioGroup>
        );
    }

    if (element.type === "checkboxes") {
        const selectedValues = Array.isArray(value) ? (value as string[]) : [];
        return (
            <div className="flex flex-col gap-2">
                {element.options.map((opt) => {
                    const checked = selectedValues.includes(opt);
                    return (
                        <Label
                            key={`${element.id}:${opt}`}
                            className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm cursor-pointer"
                        >
                            <Checkbox
                                checked={checked}
                                onCheckedChange={(c) => {
                                    const next = new Set(selectedValues);
                                    if (c) next.add(opt);
                                    else next.delete(opt);
                                    onChange(Array.from(next));
                                }}
                            />
                            <span>{opt}</span>
                        </Label>
                    );
                })}
            </div>
        );
    }

    return null;
}

export function DateField({ element, value, onChange, error }: FieldProps) {
    const val = (value as string | undefined) ?? element.defaultValue ?? "";
    const inputType = element.type === "date" ? "date" : element.type === "time" ? "time" : "datetime-local";
    
    return (
        <Input
            type={inputType}
            value={val}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
        />
    );
}

export function FileField({ element, value, onChange, error }: FieldProps) {
    const file = value instanceof File ? value : null;
    return (
        <div className={cn("rounded-xl border border-dashed border-border/70 p-3", error && "border-destructive")}>
            <input
                type="file"
                className="text-sm"
                accept={element.validation.kind === "file" ? element.validation.accept : undefined}
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    onChange(f ?? "");
                }}
            />
            {file ? <div className="text-muted-foreground mt-2 text-xs">{file.name}</div> : null}
        </div>
    );
}
