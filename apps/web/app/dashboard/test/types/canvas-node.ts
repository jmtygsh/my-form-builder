import type { FieldProps } from "./field-props";

export type CanvasNode = {
    instanceId: string;
    fieldId: string;
    type: "sidebar-item" | "sidebar-layout";
    props?: FieldProps;
    children?: Record<string, CanvasNode | null>;
};
