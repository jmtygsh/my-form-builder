export type FieldType = "text" | "email" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file";

export interface FieldBaseProps {
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
}

export interface Field {
  id: string;
  type: FieldType;
  props: FieldBaseProps & Record<string, any>;
}

export interface Row {
  id: string;
  fields: Field[];
}

export interface FormSchema {
  id: string;
  name: string;
  rows: Row[];
}

export interface FieldRegistryItem {
  type: FieldType;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultProps: FieldBaseProps & Record<string, any>;
  canvasComponent: React.FC<{ field: Field; isLive?: boolean }>;
  settingsComponent: React.FC<{ field: Field; updateField: (props: Partial<Field["props"]>) => void }>;
}
