import type { ReactNode } from "react";

export interface BaseFieldProps {
    label: string;
    isRequired: boolean;
    placeholder?: string;
    description?: string;
}

export interface TextFieldProps extends BaseFieldProps {
    inputType?: "text" | "email" | "tel" | "password" | "url" | "number" | "date";
}

export interface TextareaProps extends BaseFieldProps {
}

export interface CheckboxProps extends BaseFieldProps {
}

export interface RadioGroupProps extends BaseFieldProps {
    options: Array<{ label: string; value: string }>;
}

export interface FileUploadProps extends BaseFieldProps {
}

export type FieldProps = TextFieldProps | TextareaProps | CheckboxProps | RadioGroupProps | FileUploadProps;

export interface FieldDefinition<T extends FieldProps = FieldProps> {
    id: string;
    label: string;
    category: "smart" | "basic" | "choice";
    description: string;
    icon: ReactNode;
    defaultProps: T;
}

export interface LayoutDefinition {
    id: string;
    label: string;
    type: "layout-grid";
    columns: number;
    category: "layout";
    description: string;
    icon: ReactNode;
}
