export type BuilderElementId = string;

export type BuilderFieldType =
    | "short_text"
    | "long_text"
    | "email"
    | "number"
    | "dropdown"
    | "radio"
    | "checkboxes"
    | "date"
    | "time"
    | "datetime"
    | "file"
    | "rating";

export type BuilderElementKind = "field" | "section" | "page_break";

export type TextValidation = {
    kind: "text";
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};

export type NumberValidation = {
    kind: "number";
    min?: number;
    max?: number;
};

export type FileValidation = {
    kind: "file";
    maxSizeMb?: number;
    accept?: string;
};

export type RatingValidation = {
    kind: "rating";
    min?: number;
    max?: number;
};

export type FieldValidation = TextValidation | NumberValidation | FileValidation | RatingValidation | { kind: "none" };

export type FieldElement = {
    id: BuilderElementId;
    kind: "field";
    type: BuilderFieldType;
    label: string;
    helperText: string;
    placeholder: string;
    required: boolean;
    defaultValue: string;
    options: string[];
    validation: FieldValidation;
};

export type SectionElement = {
    id: BuilderElementId;
    kind: "section";
    title: string;
    description: string;
};

export type PageBreakElement = {
    id: BuilderElementId;
    kind: "page_break";
};

export type BuilderElement = FieldElement | SectionElement | PageBreakElement;

export type SubmissionSettings = {
    submitButtonLabel: string;
    allowReset: boolean;
    successMessage: string;
    errorMessage: string;
};

export type FormConfig = {
    title: string;
    description: string;
    submission: SubmissionSettings;
};

export type BuilderState = {
    formId: string;
    config: FormConfig;
    elements: BuilderElement[];
    selectedId: BuilderElementId | null;
    inspectorTab: "field" | "form";
};

export type BuilderAction =
    | { type: "config.setTitle"; title: string }
    | { type: "config.setDescription"; description: string }
    | { type: "config.setSubmission"; submission: Partial<SubmissionSettings> }
    | { type: "inspector.setTab"; tab: BuilderState["inspectorTab"] }
    | { type: "element.select"; id: BuilderElementId | null }
    | { type: "element.add"; element: BuilderElement; atIndex?: number }
    | { type: "element.update"; id: BuilderElementId; patch: Partial<FieldElement> | Partial<SectionElement> | Partial<PageBreakElement> }
    | { type: "element.delete"; id: BuilderElementId }
    | { type: "element.duplicate"; id: BuilderElementId; newId: BuilderElementId }
    | { type: "element.move"; activeId: BuilderElementId; overId: BuilderElementId };

export type Step = {
    id: string;
    elements: BuilderElement[];
};

export type PreviewState = {
    stepIndex: number;
    values: Record<string, unknown>;
    errors: Record<string, string>;
    status: "editing" | "success" | "error";
};

export type ElementTemplate =
    | { kind: "field"; type: BuilderFieldType }
    | { kind: "section" }
    | { kind: "page_break" };
