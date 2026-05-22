import * as React from "react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Slider } from "~/components/ui/slider";
import { DebouncedInput } from "../ui/DebouncedInput";
import { DebouncedTextarea } from "../ui/DebouncedTextarea";
import { ValidationRules } from "./ValidationRules";
import { OptionsManager } from "./OptionsManager";
import { isOptionField } from "../utils";
import type { BuilderElement, FieldElement, SectionElement } from "../types";

export function FieldSettings({
    element,
    onUpdate,
}: {
    element: BuilderElement;
    onUpdate: (patch: Partial<FieldElement> | Partial<SectionElement>) => void;
}) {
    if (element.kind === "section") {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                    <DebouncedInput
                        value={element.title}
                        onChange={(v) => onUpdate({ title: v })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                    <DebouncedTextarea
                        value={element.description}
                        onChange={(v) => onUpdate({ description: v })}
                        className="resize-none"
                    />
                </div>
            </div>
        );
    }

    if (element.kind === "page_break") {
        return (
            <div className="text-muted-foreground text-sm">
                Page breaks create multi-step forms. Drag to position the break between sections.
            </div>
        );
    }

    // It's a field
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Label</Label>
                <DebouncedInput
                    value={element.label}
                    onChange={(v) => onUpdate({ label: v })}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Helper text</Label>
                <DebouncedTextarea
                    value={element.helperText}
                    onChange={(v) => onUpdate({ helperText: v })}
                    className="resize-none"
                    placeholder="Optional hint shown under the label"
                />
            </div>

            {(element.type === "short_text" || element.type === "long_text" || element.type === "email" || element.type === "number") && (
                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Placeholder</Label>
                    <DebouncedInput
                        value={element.placeholder}
                        onChange={(v) => onUpdate({ placeholder: v })}
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
                    checked={element.required}
                    onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
            </div>

            {element.type !== "file" && element.type !== "checkboxes" && (
                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Default value</Label>
                    <DebouncedInput
                        value={element.defaultValue}
                        onChange={(v) => onUpdate({ defaultValue: v })}
                        placeholder="Optional default"
                    />
                </div>
            )}

            {isOptionField(element.type) && (
                <OptionsManager
                    options={element.options}
                    onChange={(options) => onUpdate({ options })}
                />
            )}

            <ValidationRules
                type={element.type}
                validation={element.validation}
                onChange={(validation) => onUpdate({ validation })}
            />

            {element.type === "rating" && (
                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Preview range</Label>
                    <Slider
                        value={[
                            Math.min(
                                element.validation.kind === "rating" ? element.validation.max ?? 5 : 5,
                                Math.max(
                                    element.validation.kind === "rating" ? element.validation.min ?? 1 : 1,
                                    element.defaultValue ? Number(element.defaultValue) : 3
                                )
                            ),
                        ]}
                        min={element.validation.kind === "rating" ? element.validation.min ?? 1 : 1}
                        max={element.validation.kind === "rating" ? element.validation.max ?? 5 : 5}
                        disabled
                    />
                </div>
            )}
        </div>
    );
}
