import * as React from "react";
import { Copy, Plus, Settings2, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Slider } from "~/components/ui/slider";

import {
    cloneStringArray,
    isFileField,
    isNumberField,
    isOptionField,
    isRatingField,
    isTextField,
    parseOptionalNumber,
    safeLabelForElement,
    typeLabel,
} from "./utils";

import type {
    BuilderAction,
    BuilderElement,
    BuilderState,
    FileValidation,
    NumberValidation,
    RatingValidation,
    TextValidation,
} from "./types";

export function InspectorPanel({
    selected,
    state,
    dispatch,
    onDuplicate,
    onDelete,
}: {
    selected: BuilderElement | undefined;
    state: BuilderState;
    dispatch: React.Dispatch<BuilderAction>;
    onDuplicate: () => void;
    onDelete: () => void;
}) {
    const form = state.config;

    if (!selected) {
        return (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8 text-center bg-muted/10">
                <div className="bg-background flex size-12 items-center justify-center rounded-full border shadow-sm mb-4">
                    <Settings2 className="size-5 text-muted-foreground" />
                </div>
                <div className="text-base font-medium text-foreground">No element selected</div>
                <div className="mt-1 text-sm">Select an element in the canvas to edit its settings.</div>
            </div>
        );
    }

    const headerTitle =
        selected.kind === "field"
            ? typeLabel(selected.type)
            : selected.kind === "section"
                ? "Section"
                : "Page Break";

    const canShowFieldTab = selected.kind === "field";

    return (
        <div className="flex h-full flex-col">
            <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{headerTitle}</div>
                    <div className="text-muted-foreground mt-1 truncate text-xs">{safeLabelForElement(selected)}</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon-sm" onClick={onDuplicate}>
                        <Copy className="size-4" />
                    </Button>
                    <Button type="button" variant="destructive" size="icon-sm" onClick={onDelete}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <Tabs
                    value={state.inspectorTab}
                    onValueChange={(v) => dispatch({ type: "inspector.setTab", tab: v as BuilderState["inspectorTab"] })}
                    className="h-full"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="field" disabled={!canShowFieldTab} className="flex-1">
                            Field
                        </TabsTrigger>
                        <TabsTrigger value="form" className="flex-1">
                            Form
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="field" className="mt-4">
                        {selected.kind === "field" ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Label</Label>
                                    <Input
                                        value={selected.label}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "element.update",
                                                id: selected.id,
                                                patch: { label: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Helper text</Label>
                                    <Textarea
                                        value={selected.helperText}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "element.update",
                                                id: selected.id,
                                                patch: { helperText: e.target.value },
                                            })
                                        }
                                        className="resize-none"
                                        placeholder="Optional hint shown under the label"
                                    />
                                </div>

                                {(selected.type === "short_text" || selected.type === "long_text" || selected.type === "email" || selected.type === "number") && (
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Placeholder</Label>
                                        <Input
                                            value={selected.placeholder}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "element.update",
                                                    id: selected.id,
                                                    patch: { placeholder: e.target.value },
                                                })
                                            }
                                            placeholder="Optional placeholder"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3 py-2">
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium">Required</div>
                                        <div className="text-muted-foreground text-xs">Must be filled out</div>
                                    </div>
                                    <Switch
                                        checked={selected.required}
                                        onCheckedChange={(checked) =>
                                            dispatch({
                                                type: "element.update",
                                                id: selected.id,
                                                patch: { required: checked },
                                            })
                                        }
                                    />
                                </div>

                                {selected.type !== "file" && selected.type !== "checkboxes" && (
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Default value</Label>
                                        <Input
                                            value={selected.defaultValue}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "element.update",
                                                    id: selected.id,
                                                    patch: { defaultValue: e.target.value },
                                                })
                                            }
                                            placeholder="Optional default"
                                        />
                                    </div>
                                )}

                                {isOptionField(selected.type) && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Options</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="xs"
                                                className="h-7"
                                                onClick={() =>
                                                    dispatch({
                                                        type: "element.update",
                                                        id: selected.id,
                                                        patch: { options: [...cloneStringArray(selected.options), `Option ${selected.options.length + 1}`] },
                                                    })
                                                }
                                            >
                                                <Plus className="mr-1.5 size-3.5" />
                                                Add
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {selected.options.map((opt, idx) => (
                                                <div key={`${selected.id}:opt:${idx}`} className="flex items-center gap-2">
                                                    <Input
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const next = cloneStringArray(selected.options);
                                                            next[idx] = e.target.value;
                                                            dispatch({ type: "element.update", id: selected.id, patch: { options: next } });
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon-sm"
                                                        onClick={() => {
                                                            const next = selected.options.filter((_, i) => i !== idx);
                                                            dispatch({ type: "element.update", id: selected.id, patch: { options: next.length ? next : ["Option 1"] } });
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                                    <div className="text-sm font-semibold">Validation</div>

                                    {isTextField(selected.type) && selected.validation.kind === "text" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min length</Label>
                                                <Input
                                                    inputMode="numeric"
                                                    value={selected.validation.minLength?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const minLength = parseOptionalNumber(e.target.value);
                                                        dispatch({
                                                            type: "element.update",
                                                            id: selected.id,
                                                            patch: {
                                                                validation: { ...(selected.validation as TextValidation), minLength },
                                                            },
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max length</Label>
                                                <Input
                                                    inputMode="numeric"
                                                    value={selected.validation.maxLength?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const maxLength = parseOptionalNumber(e.target.value);
                                                        dispatch({
                                                            type: "element.update",
                                                            id: selected.id,
                                                            patch: {
                                                                validation: { ...(selected.validation as TextValidation), maxLength },
                                                            },
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2 flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Pattern (regex)</Label>
                                                <Input
                                                    value={selected.validation.pattern ?? ""}
                                                    onChange={(e) =>
                                                        dispatch({
                                                            type: "element.update",
                                                            id: selected.id,
                                                            patch: {
                                                                validation: { ...(selected.validation as TextValidation), pattern: e.target.value },
                                                            },
                                                        })
                                                    }
                                                    placeholder="e.g. ^[A-Z0-9]+$"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {isNumberField(selected.type) && selected.validation.kind === "number" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min</Label>
                                                <Input
                                                    inputMode="decimal"
                                                    value={selected.validation.min?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const min = parseOptionalNumber(e.target.value);
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as NumberValidation), min } } });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max</Label>
                                                <Input
                                                    inputMode="decimal"
                                                    value={selected.validation.max?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const max = parseOptionalNumber(e.target.value);
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as NumberValidation), max } } });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {isFileField(selected.type) && selected.validation.kind === "file" && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Accepted types</Label>
                                                <Input
                                                    value={selected.validation.accept ?? ""}
                                                    onChange={(e) => {
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as FileValidation), accept: e.target.value } } });
                                                    }}
                                                    placeholder="e.g. image/*,.pdf"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max size (MB)</Label>
                                                <Input
                                                    inputMode="decimal"
                                                    value={selected.validation.maxSizeMb?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const maxSizeMb = parseOptionalNumber(e.target.value);
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as FileValidation), maxSizeMb } } });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {isRatingField(selected.type) && selected.validation.kind === "rating" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Min</Label>
                                                <Input
                                                    inputMode="numeric"
                                                    value={selected.validation.min?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const min = parseOptionalNumber(e.target.value);
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as RatingValidation), min } } });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Max</Label>
                                                <Input
                                                    inputMode="numeric"
                                                    value={selected.validation.max?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const max = parseOptionalNumber(e.target.value);
                                                        dispatch({ type: "element.update", id: selected.id, patch: { validation: { ...(selected.validation as RatingValidation), max } } });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selected.kind === "field" && selected.type === "rating" && (
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Preview range</Label>
                                        <Slider
                                            value={[
                                                Math.min(
                                                    selected.validation.kind === "rating" ? selected.validation.max ?? 5 : 5,
                                                    Math.max(
                                                        selected.validation.kind === "rating" ? selected.validation.min ?? 1 : 1,
                                                        selected.defaultValue ? Number(selected.defaultValue) : 3
                                                    )
                                                ),
                                            ]}
                                            min={selected.validation.kind === "rating" ? selected.validation.min ?? 1 : 1}
                                            max={selected.validation.kind === "rating" ? selected.validation.max ?? 5 : 5}
                                            disabled
                                        />
                                    </div>
                                )}

                                {selected.kind === "field" && selected.type === "email" && selected.validation.kind === "text" && (
                                    <div className="text-muted-foreground text-xs">
                                        Email fields validate format automatically during preview.
                                    </div>
                                )}
                            </div>
                        ) : selected.kind === "section" ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                                    <Input
                                        value={selected.title}
                                        onChange={(e) => dispatch({ type: "element.update", id: selected.id, patch: { title: e.target.value } })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                                    <Textarea
                                        value={selected.description}
                                        onChange={(e) => dispatch({ type: "element.update", id: selected.id, patch: { description: e.target.value } })}
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm">
                                Page breaks create multi-step forms. Drag to position the break between sections.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="form" className="mt-4">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => dispatch({ type: "config.setTitle", title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => dispatch({ type: "config.setDescription", description: e.target.value })}
                                    className="resize-none min-h-[100px]"
                                />
                            </div>

                            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                                <div className="text-sm font-semibold">Submission Settings</div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Submit button label</Label>
                                    <Input
                                        value={form.submission.submitButtonLabel}
                                        onChange={(e) => dispatch({ type: "config.setSubmission", submission: { submitButtonLabel: e.target.value } })}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium">Allow reset</div>
                                        <div className="text-muted-foreground mt-0.5 text-xs">Show a reset action in preview</div>
                                    </div>
                                    <Switch
                                        checked={form.submission.allowReset}
                                        onCheckedChange={(checked) => dispatch({ type: "config.setSubmission", submission: { allowReset: checked } })}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Success message</Label>
                                    <Textarea
                                        value={form.submission.successMessage}
                                        onChange={(e) => dispatch({ type: "config.setSubmission", submission: { successMessage: e.target.value } })}
                                        className="resize-none min-h-[80px]"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-2">
                                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Error message</Label>
                                    <Textarea
                                        value={form.submission.errorMessage}
                                        onChange={(e) => dispatch({ type: "config.setSubmission", submission: { errorMessage: e.target.value } })}
                                        className="resize-none min-h-[80px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}