import {
    TextFieldSettings,
    TextareaSettings,
    CheckboxSettings,
    RadioGroupSettings,
    FileUploadSettings,
} from "../components/field-settings";
import type { ReactNode } from "react";
import type { FieldProps, FieldDefinition } from "../types";

interface SettingsComponentProps<T extends FieldProps> {
    props: T;
    onChange: (newProps: Partial<T>) => void;
}

interface FieldRegistryEntry {
    settingsComponent: (props: SettingsComponentProps<any>) => ReactNode;
    getDefaultProps: (fieldDef: FieldDefinition) => FieldProps;
}

const FIELD_REGISTRY: Record<string, FieldRegistryEntry> = {
    name: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    email: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    phone: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    password: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    website: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    company: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    text: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    number: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    date: {
        settingsComponent: TextFieldSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    textarea: {
        settingsComponent: TextareaSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    checkbox: {
        settingsComponent: CheckboxSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    radio: {
        settingsComponent: RadioGroupSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
    file: {
        settingsComponent: FileUploadSettings,
        getDefaultProps: (fieldDef) => fieldDef.defaultProps,
    },
};

export function getSettingsComponent(fieldId: string) {
    return FIELD_REGISTRY[fieldId]?.settingsComponent || null;
}

export function getDefaultFieldProps(fieldDef: FieldDefinition): FieldProps {
    return FIELD_REGISTRY[fieldDef.id]?.getDefaultProps(fieldDef) || fieldDef.defaultProps;
}
