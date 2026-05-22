import * as React from "react";
import {
    AlignLeft,
    Calendar,
    CheckSquare,
    CircleDot,
    FolderPlus,
    Hash,
    Mail,
    SplitSquareVertical,
    Type,
    Upload,
} from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import type {
    BuilderAction,
    BuilderElement,
    BuilderFieldType,
    BuilderState,
    ElementTemplate,
    FieldElement,
    FieldValidation,
    Step,
} from "./types";

/**
 * ============================================================================
 * FORM BUILDER UTILITIES (THE TOOLBOX)
 * ============================================================================
 * 
 * This file contains all the behind-the-scenes helpers and definitions that
 * make the form builder run smoothly without cluttering up the visual components.
 * 
 * Key Responsibilities:
 * - Defines the Master List of Field Types (FIELD_TEMPLATES).
 * - Generates unique IDs for new fields.
 * - Provides the default settings when a user creates a new field.
 * - Handles the complex logic of splitting fields into separate "pages" (steps).
 * ============================================================================
 */

export const FIELD_TEMPLATES: Array<{
    template: ElementTemplate;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    keywords: string[];
}> = [
        { template: { kind: "field", type: "short_text" }, title: "Short Text", description: "Single-line response", icon: Type, keywords: ["text", "short", "input"] },
        { template: { kind: "field", type: "long_text" }, title: "Long Text", description: "Multi-line response", icon: AlignLeft, keywords: ["textarea", "paragraph", "long"] },
        { template: { kind: "field", type: "email" }, title: "Email", description: "Email address", icon: Mail, keywords: ["email", "mail"] },
        { template: { kind: "field", type: "number" }, title: "Number", description: "Numeric input", icon: Hash, keywords: ["number", "numeric"] },
        { template: { kind: "field", type: "dropdown" }, title: "Dropdown", description: "Select one option", icon: FolderPlus, keywords: ["select", "dropdown"] },
        { template: { kind: "field", type: "radio" }, title: "Multiple Choice", description: "Pick one option", icon: CircleDot, keywords: ["radio", "single", "choice"] },
        { template: { kind: "field", type: "checkboxes" }, title: "Checkboxes", description: "Pick many options", icon: CheckSquare, keywords: ["checkbox", "multi", "choice"] },
        { template: { kind: "field", type: "date" }, title: "Date", description: "Pick a date", icon: Calendar, keywords: ["date", "calendar"] },
        { template: { kind: "field", type: "time" }, title: "Time", description: "Pick a time", icon: Calendar, keywords: ["time", "clock"] },
        { template: { kind: "field", type: "datetime" }, title: "Date & Time", description: "Pick date and time", icon: Calendar, keywords: ["datetime", "date", "time"] },
        { template: { kind: "field", type: "file" }, title: "File Upload", description: "Upload a file", icon: Upload, keywords: ["file", "upload"] },
        { template: { kind: "field", type: "rating" }, title: "Rating", description: "Numeric rating", icon: SplitSquareVertical, keywords: ["rating", "score"] },
        { template: { kind: "section" }, title: "Section", description: "Group fields with a heading", icon: AlignLeft, keywords: ["section", "group", "heading"] },
        { template: { kind: "page_break" }, title: "Page Break", description: "Start a new step", icon: SplitSquareVertical, keywords: ["page", "step", "break"] },
    ];

export function createId(): string {
    const id = globalThis.crypto?.randomUUID?.();
    if (id) return id;
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function defaultValidationForType(type: BuilderFieldType): FieldValidation {
    if (type === "number") return { kind: "number" };
    if (type === "file") return { kind: "file" };
    if (type === "rating") return { kind: "rating", min: 1, max: 5 };
    if (type === "short_text" || type === "long_text" || type === "email") return { kind: "text" };
    return { kind: "none" };
}

export function defaultOptionsForType(type: BuilderFieldType): string[] {
    if (type === "dropdown" || type === "radio" || type === "checkboxes") {
        return ["Option 1", "Option 2"];
    }
    return [];
}

export function createElementFromTemplate(template: ElementTemplate): BuilderElement {
    const id = createId();

    if (template.kind === "section") {
        return { id, kind: "section", title: "Section", description: "" };
    }

    if (template.kind === "page_break") {
        return { id, kind: "page_break" };
    }

    const type = template.type;
    const baseLabel = FIELD_TEMPLATES.find((t) => t.template.kind === "field" && t.template.type === type)?.title ?? "Field";

    return {
        id,
        kind: "field",
        type,
        label: `New ${baseLabel}`,
        helperText: "",
        placeholder: type === "short_text" || type === "long_text" ? "Type your answer..." : "",
        required: false,
        defaultValue: "",
        options: defaultOptionsForType(type),
        validation: defaultValidationForType(type),
    };
}

export function splitIntoSteps(elements: BuilderElement[]): Step[] {
    const buckets: BuilderElement[][] = [[]];
    for (const el of elements) {
        if (el.kind === "page_break") {
            buckets.push([]);
            continue;
        }
        buckets[buckets.length - 1]?.push(el);
    }

    const normalized = buckets.length ? buckets : [[]];
    return normalized.map((els, index) => ({
        id: `step:${index}`,
        elements: els,
    }));
}

export function isOptionField(type: BuilderFieldType) {
    return type === "dropdown" || type === "radio" || type === "checkboxes";
}

export function isTextField(type: BuilderFieldType) {
    return type === "short_text" || type === "long_text" || type === "email";
}

export function isNumberField(type: BuilderFieldType) {
    return type === "number";
}

export function isFileField(type: BuilderFieldType) {
    return type === "file";
}

export function isRatingField(type: BuilderFieldType) {
    return type === "rating";
}

export function parseOptionalNumber(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return undefined;
    return n;
}

export function validateFieldValue(field: FieldElement, value: unknown): string | null {
    const str = typeof value === "string" ? value : value == null ? "" : String(value);

    if (field.required) {
        if (field.type === "checkboxes") {
            const arr = Array.isArray(value) ? value : [];
            if (arr.length === 0) return "This field is required";
        } else if (field.type === "file") {
            if (!(value instanceof File)) return "This field is required";
        } else if (!str.trim()) {
            return "This field is required";
        }
    }

    if (field.validation.kind === "text") {
        const len = str.length;
        if (field.validation.minLength != null && len < field.validation.minLength) {
            return `Must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation.maxLength != null && len > field.validation.maxLength) {
            return `Must be at most ${field.validation.maxLength} characters`;
        }
        if (field.validation.pattern?.trim()) {
            try {
                const re = new RegExp(field.validation.pattern);
                if (str && !re.test(str)) return "Invalid format";
            } catch {
                return "Invalid validation pattern";
            }
        }
    }

    if (field.validation.kind === "number") {
        if (str.trim()) {
            const n = Number(str);
            if (!Number.isFinite(n)) return "Must be a number";
            if (field.validation.min != null && n < field.validation.min) return `Must be ≥ ${field.validation.min}`;
            if (field.validation.max != null && n > field.validation.max) return `Must be ≤ ${field.validation.max}`;
        }
    }

    if (field.validation.kind === "file") {
        if (value instanceof File) {
            const maxMb = field.validation.maxSizeMb;
            if (maxMb != null) {
                const maxBytes = maxMb * 1024 * 1024;
                if (value.size > maxBytes) return `File must be ≤ ${maxMb} MB`;
            }
        }
    }

    if (field.validation.kind === "rating") {
        const n = typeof value === "number" ? value : Number(str);
        if (Number.isFinite(n)) {
            const min = field.validation.min ?? 1;
            const max = field.validation.max ?? 5;
            if (n < min || n > max) return `Must be between ${min} and ${max}`;
        }
    }

    return null;
}

export function safeLabelForElement(el: BuilderElement): string {
    if (el.kind === "field") return el.label.trim() || "Untitled field";
    if (el.kind === "section") return el.title.trim() || "Section";
    return "Page Break";
}

export function typeLabel(type: BuilderFieldType): string {
    return FIELD_TEMPLATES.find((t) => t.template.kind === "field" && t.template.type === type)?.title ?? type;
}

export function cloneStringArray(arr: string[]) {
    return arr.map((v) => v);
}

export function getClipboardTextForBuilder(state: BuilderState): string {
    return JSON.stringify(
        {
            formId: state.formId,
            config: state.config,
            elements: state.elements,
        },
        null,
        2
    );
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
    if (action.type === "config.setTitle") {
        return { ...state, config: { ...state.config, title: action.title } };
    }
    if (action.type === "config.setDescription") {
        return { ...state, config: { ...state.config, description: action.description } };
    }
    if (action.type === "config.setSubmission") {
        return { ...state, config: { ...state.config, submission: { ...state.config.submission, ...action.submission } } };
    }
    if (action.type === "inspector.setTab") {
        return { ...state, inspectorTab: action.tab };
    }
    if (action.type === "element.select") {
        return { ...state, selectedId: action.id };
    }
    if (action.type === "element.add") {
        const atIndex = action.atIndex ?? state.elements.length;
        const nextElements = [...state.elements.slice(0, atIndex), action.element, ...state.elements.slice(atIndex)];
        return {
            ...state,
            elements: nextElements,
            selectedId: action.element.id,
            inspectorTab: action.element.kind === "field" ? "field" : state.inspectorTab,
        };
    }
    if (action.type === "element.update") {
        return {
            ...state,
            elements: state.elements.map((el) => (el.id === action.id ? ({ ...el, ...action.patch } as BuilderElement) : el)),
        };
    }
    if (action.type === "element.delete") {
        const index = state.elements.findIndex((e) => e.id === action.id);
        const nextElements = state.elements.filter((e) => e.id !== action.id);
        let nextSelectedId = state.selectedId;
        if (state.selectedId === action.id) {
            const candidate = nextElements[index] ?? nextElements[index - 1] ?? null;
            nextSelectedId = candidate?.id ?? null;
        }
        return { ...state, elements: nextElements, selectedId: nextSelectedId };
    }
    if (action.type === "element.duplicate") {
        const index = state.elements.findIndex((e) => e.id === action.id);
        const original = state.elements[index];
        if (!original) return state;

        const cloned = (typeof globalThis.structuredClone === "function"
            ? globalThis.structuredClone(original)
            : JSON.parse(JSON.stringify(original))) as BuilderElement;
        cloned.id = action.newId;

        const nextElements = [...state.elements.slice(0, index + 1), cloned, ...state.elements.slice(index + 1)];
        return { ...state, elements: nextElements, selectedId: cloned.id };
    }
    if (action.type === "element.move") {
        const activeIndex = state.elements.findIndex((e) => e.id === action.activeId);
        const overIndex = state.elements.findIndex((e) => e.id === action.overId);
        if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) return state;
        return { ...state, elements: arrayMove(state.elements, activeIndex, overIndex) };
    }
    return state;
}