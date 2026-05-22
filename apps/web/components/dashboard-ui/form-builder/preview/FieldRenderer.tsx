import * as React from "react";
import { Label } from "~/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { FIELD_REGISTRY } from "../fields/registry";
import type { FieldElement } from "../types";

export function FieldRenderer({
    element,
}: {
    element: FieldElement;
}) {
    const Component = FIELD_REGISTRY[element.type];
    if (!Component) return null;

    const { control } = useFormContext();

    const labelText = element.label.trim() || "Untitled field";
    const requiredMark = element.required ? " *" : "";

    // Map custom validation to react-hook-form rules
    const rules: Record<string, any> = {
        required: element.required ? "This field is required" : false,
    };

    if (element.validation.kind === "text") {
        if (element.validation.minLength !== undefined) {
            rules.minLength = {
                value: element.validation.minLength,
                message: `Minimum ${element.validation.minLength} characters`,
            };
        }
        if (element.validation.maxLength !== undefined) {
            rules.maxLength = {
                value: element.validation.maxLength,
                message: `Maximum ${element.validation.maxLength} characters`,
            };
        }
        if (element.validation.pattern) {
            try {
                rules.pattern = {
                    value: new RegExp(element.validation.pattern),
                    message: "Invalid format",
                };
            } catch (e) {
                // Ignore invalid regex
            }
        }
    } else if (element.validation.kind === "number") {
        if (element.validation.min !== undefined) {
            rules.min = {
                value: element.validation.min,
                message: `Minimum value is ${element.validation.min}`,
            };
        }
        if (element.validation.max !== undefined) {
            rules.max = {
                value: element.validation.max,
                message: `Maximum value is ${element.validation.max}`,
            };
        }
    }

    return (
        <Controller
            control={control}
            name={element.id}
            rules={rules}
            defaultValue={element.defaultValue || ""}
            render={({ field, fieldState }) => {
                const error = fieldState.error?.message;

                return (
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">
                            {labelText}
                            {requiredMark ? <span className="text-destructive">{requiredMark}</span> : null}
                        </Label>
                        {element.helperText.trim() ? (
                            <div className="text-muted-foreground text-xs">{element.helperText}</div>
                        ) : null}

                        <Component
                            element={element}
                            value={field.value}
                            error={error}
                            onChange={field.onChange}
                        />

                        {error ? <div className="text-destructive text-xs">{error}</div> : null}
                    </div>
                );
            }}
        />
    );
}
