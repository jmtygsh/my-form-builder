import * as React from "react";
import { AlertCircle, Check, Eye } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";

import { computeErrorsForElements } from "./utils";
import type { BuilderElement, FieldElement, FormConfig, PreviewState, Step } from "./types";

export function PreviewPanel({
    steps,
    config,
    preview,
    setPreview,
}: {
    steps: Step[];
    config: FormConfig;
    preview: PreviewState;
    setPreview: React.Dispatch<React.SetStateAction<PreviewState>>;
}) {
    if (steps.length === 0 || (steps.length === 1 && steps[0]?.elements.length === 0)) {
        return (
            <div className="flex h-full flex-col bg-muted/10">
                <div className="border-border/60 bg-card flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">Preview</div>
                </div>
                <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="bg-background flex size-12 items-center justify-center rounded-full border shadow-sm mb-4">
                        <Eye className="size-5 text-muted-foreground" />
                    </div>
                    <div className="text-base font-medium text-foreground">Nothing to preview</div>
                    <div className="mt-1 text-sm">Add fields to your canvas to see how they look.</div>
                </div>
            </div>
        );
    }

    const current = React.useMemo(() => {
        if (steps.length === 0) return { elements: [] as BuilderElement[] };
        if (preview.stepIndex >= 0 && preview.stepIndex < steps.length) return steps[preview.stepIndex]!;
        return steps[0]!;
    }, [steps, preview.stepIndex]);

    const currentFields = React.useMemo(() => {
        return (current?.elements ?? []).filter((el): el is FieldElement => el.kind === "field");
    }, [current]);

    const reset = React.useCallback(() => {
        setPreview({ stepIndex: 0, values: {}, errors: {}, status: "editing" });
    }, [setPreview]);

    const validateStep = React.useCallback(() => {
        const errors = computeErrorsForElements(currentFields, preview.values);
        setPreview((p) => ({ ...p, errors }));
        return errors;
    }, [currentFields, preview.values, setPreview]);

    const goNext = React.useCallback(() => {
        const errors = validateStep();
        if (Object.keys(errors).length) return;
        setPreview((p) => ({ ...p, stepIndex: Math.min(p.stepIndex + 1, steps.length - 1), errors: {} }));
    }, [steps.length, validateStep, setPreview]);

    const goBack = React.useCallback(() => {
        setPreview((p) => ({ ...p, stepIndex: Math.max(0, p.stepIndex - 1), errors: {} }));
    }, [setPreview]);

    const submit = React.useCallback(() => {
        const allElements = steps.flatMap((s) => s.elements);
        const errors = computeErrorsForElements(allElements, preview.values);
        if (Object.keys(errors).length) {
            setPreview((p) => ({ ...p, errors, status: "error" }));
            return;
        }
        setPreview((p) => ({ ...p, errors: {}, status: "success" }));
    }, [preview.values, setPreview, steps]);

    const updateValue = React.useCallback(
        (fieldId: string, value: unknown) => {
            setPreview((p) => ({
                ...p,
                status: "editing",
                values: { ...p.values, [fieldId]: value },
                errors: { ...p.errors, [fieldId]: "" },
            }));
        },
        [setPreview]
    );

    return (
        <div className="flex h-full flex-col">
            <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">Live preview</div>
                    <div className="text-muted-foreground mt-1 truncate text-xs">
                        Step {Math.min(preview.stepIndex + 1, steps.length)} of {Math.max(1, steps.length)}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {config.submission.allowReset && (
                        <Button type="button" variant="outline" size="xs" className="h-7" onClick={reset}>
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/5">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                    <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
                        <div className="text-2xl font-bold">{config.title.trim() || "Untitled Form"}</div>
                        {config.description.trim() ? (
                            <div className="text-muted-foreground mt-3 text-base leading-relaxed">{config.description}</div>
                        ) : null}
                    </div>

                    {preview.status === "success" ? (
                        <div className="rounded-2xl border border-border/60 bg-emerald-500/10 p-6 sm:p-8 text-foreground shadow-sm">
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="bg-emerald-500/20 mb-4 flex size-14 items-center justify-center rounded-full text-emerald-600">
                                    <Check className="size-7" />
                                </div>
                                <div className="text-xl font-bold">Success</div>
                                <div className="text-muted-foreground mt-2 text-base">
                                    {config.submission.successMessage.trim() || "Thanks! Your response has been recorded."}
                                </div>
                                {config.submission.allowReset && (
                                    <div className="mt-6">
                                        <Button type="button" onClick={reset}>
                                            Submit another response
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : preview.status === "error" ? (
                        <div className="rounded-2xl border border-border/60 bg-destructive/10 p-6 sm:p-8 text-foreground shadow-sm">
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="bg-destructive/20 mb-4 flex size-14 items-center justify-center rounded-full text-destructive">
                                    <AlertCircle className="size-7" />
                                </div>
                                <div className="text-xl font-bold text-destructive">Error</div>
                                <div className="text-muted-foreground mt-2 text-base">
                                    {config.submission.errorMessage.trim() || "Something went wrong."}
                                </div>
                                <div className="mt-6">
                                    <Button type="button" variant="outline" onClick={() => setPreview((p) => ({ ...p, status: "editing" }))}>
                                        Go back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
                            {(current?.elements ?? []).map((el) => {
                                if (el.kind === "section") {
                                    return (
                                        <div key={el.id} className="pt-2 pb-4 border-b border-border/40">
                                            <div className="text-lg font-semibold">{el.title.trim() || "Section"}</div>
                                            {el.description.trim() ? (
                                                <div className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                                    {el.description}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                }

                                if (el.kind !== "field") return null;

                                const error = preview.errors[el.id]?.trim();
                                const labelText = el.label.trim() || "Untitled field";
                                const requiredMark = el.required ? " *" : "";

                                if (el.type === "short_text") {
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Input
                                                value={(preview.values[el.id] as string | undefined) ?? el.defaultValue ?? ""}
                                                onChange={(e) => updateValue(el.id, e.target.value)}
                                                placeholder={el.placeholder}
                                                aria-invalid={!!error}
                                            />
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "long_text") {
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Textarea
                                                value={(preview.values[el.id] as string | undefined) ?? el.defaultValue ?? ""}
                                                onChange={(e) => updateValue(el.id, e.target.value)}
                                                placeholder={el.placeholder}
                                                className="resize-none"
                                                aria-invalid={!!error}
                                            />
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "email") {
                                    const value = ((preview.values[el.id] as string | undefined) ?? el.defaultValue ?? "").toString();
                                    const emailError =
                                        value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                                            ? "Invalid email address"
                                            : null;
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Input
                                                type="email"
                                                value={value}
                                                onChange={(e) => updateValue(el.id, e.target.value)}
                                                placeholder={el.placeholder}
                                                aria-invalid={!!(error || emailError)}
                                            />
                                            {emailError ? <div className="text-destructive text-xs">{emailError}</div> : null}
                                            {error && !emailError ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "number") {
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Input
                                                inputMode="decimal"
                                                value={(preview.values[el.id] as string | undefined) ?? el.defaultValue ?? ""}
                                                onChange={(e) => updateValue(el.id, e.target.value)}
                                                placeholder={el.placeholder}
                                                aria-invalid={!!error}
                                            />
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "date" || el.type === "time" || el.type === "datetime") {
                                    const inputType = el.type === "date" ? "date" : el.type === "time" ? "time" : "datetime-local";
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Input
                                                type={inputType}
                                                value={(preview.values[el.id] as string | undefined) ?? el.defaultValue ?? ""}
                                                onChange={(e) => updateValue(el.id, e.target.value)}
                                                aria-invalid={!!error}
                                            />
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "dropdown") {
                                    const value = (preview.values[el.id] as string | undefined) ?? el.defaultValue ?? "";
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <Select value={value} onValueChange={(v) => updateValue(el.id, v)}>
                                                <SelectTrigger className={cn("w-full", error && "border-destructive")}>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {el.options.map((opt) => (
                                                        <SelectItem key={`${el.id}:${opt}`} value={opt}>
                                                            {opt}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "radio") {
                                    const value = (preview.values[el.id] as string | undefined) ?? el.defaultValue ?? "";
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <RadioGroup value={value} onValueChange={(v) => updateValue(el.id, v)} className="gap-2">
                                                {el.options.map((opt) => (
                                                    <Label
                                                        key={`${el.id}:${opt}`}
                                                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm"
                                                    >
                                                        <RadioGroupItem value={opt} />
                                                        <span>{opt}</span>
                                                    </Label>
                                                ))}
                                            </RadioGroup>
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "checkboxes") {
                                    const selectedValues = Array.isArray(preview.values[el.id])
                                        ? (preview.values[el.id] as string[])
                                        : [];
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <div className="flex flex-col gap-2">
                                                {el.options.map((opt) => {
                                                    const checked = selectedValues.includes(opt);
                                                    return (
                                                        <Label
                                                            key={`${el.id}:${opt}`}
                                                            className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm"
                                                        >
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={(c) => {
                                                                    const next = new Set(selectedValues);
                                                                    if (c) next.add(opt);
                                                                    else next.delete(opt);
                                                                    updateValue(el.id, Array.from(next));
                                                                }}
                                                            />
                                                            <span>{opt}</span>
                                                        </Label>
                                                    );
                                                })}
                                            </div>
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "file") {
                                    const file = preview.values[el.id] instanceof File ? (preview.values[el.id] as File) : null;
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <div className={cn("rounded-xl border border-dashed border-border/70 p-3", error && "border-destructive")}>
                                                <input
                                                    type="file"
                                                    className="text-sm"
                                                    accept={el.validation.kind === "file" ? el.validation.accept : undefined}
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0] ?? null;
                                                        updateValue(el.id, f ?? "");
                                                    }}
                                                />
                                                {file ? <div className="text-muted-foreground mt-2 text-xs">{file.name}</div> : null}
                                            </div>
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                if (el.type === "rating") {
                                    const min = el.validation.kind === "rating" ? el.validation.min ?? 1 : 1;
                                    const max = el.validation.kind === "rating" ? el.validation.max ?? 5 : 5;
                                    const raw = preview.values[el.id];
                                    const value = typeof raw === "number" ? raw : Number(el.defaultValue || min);
                                    return (
                                        <div key={el.id} className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium">
                                                {labelText}
                                                {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                                            </Label>
                                            {el.helperText.trim() ? <div className="text-muted-foreground text-xs">{el.helperText}</div> : null}
                                            <div className="flex items-center gap-3">
                                                <Slider
                                                    value={[Number.isFinite(value) ? value : min]}
                                                    min={min}
                                                    max={max}
                                                    step={1}
                                                    onValueChange={(v) => updateValue(el.id, v[0] ?? min)}
                                                />
                                                <div className="text-muted-foreground w-10 text-right text-sm tabular-nums">
                                                    {Number.isFinite(value) ? value : min}
                                                </div>
                                            </div>
                                            {error ? <div className="text-destructive text-xs">{error}</div> : null}
                                        </div>
                                    );
                                }

                                return null;
                            })}

                            {Object.keys(preview.errors).length > 0 ? (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm mt-2">
                                    <div className="font-semibold text-destructive">Fix required fields</div>
                                    <div className="text-muted-foreground mt-1">
                                        Please review the highlighted fields above and try again.
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex items-center justify-between gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" onClick={goBack} disabled={preview.stepIndex === 0}>
                                        Back
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {preview.stepIndex < steps.length - 1 ? (
                                        <Button type="button" onClick={goNext}>
                                            Next
                                        </Button>
                                    ) : (
                                        <Button type="button" onClick={submit}>
                                            {config.submission.submitButtonLabel.trim() || "Submit"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}