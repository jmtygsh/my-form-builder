export type FieldType = "text" | "email" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "fullName" | "phone" | "address" | "heading" | "paragraph" | "agreeBox";

export interface FieldBaseProps {
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  allowedFileTypes?: string[];
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  textAlign?: "left" | "center" | "right";
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl";
  textColor?: string;
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

export type FieldCategory = "native" | "pre-built";

export interface FieldRegistryItem {
  type: FieldType;
  category: FieldCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultProps: FieldBaseProps & Record<string, any>;
  canvasComponent: React.FC<{ field: Field; isLive?: boolean }>;
  settingsComponent: React.FC<{ field: Field; updateField: (props: Partial<Field["props"]>) => void }>;
}
