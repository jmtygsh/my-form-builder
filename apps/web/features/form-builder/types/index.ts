export type FieldType = "text" | "email" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "fullName" | "phone" | "address" | "heading" | "paragraph" | "sectionHeader" | "agreeBox" | "button" | "submitButton";

export interface FieldBaseProps {
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: string[];
  allowedFileTypes?: string[];
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  textAlign?: "left" | "center" | "right";
  url?: string;

  // Global Style Properties
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
  placeholderColor?: string;

  // Section Header Specific Properties (for the description/paragraph part)
  descriptionFontSize?: "xs" | "sm" | "base" | "lg" | "xl";
  descriptionTextColor?: string;
  descriptionTextAlign?: "left" | "center" | "right";

  // Button Specific Properties
  buttonSize?: "sm" | "default" | "lg";
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonHoverTextColor?: string;
  buttonHoverOpacity?: number | string;
}

export interface Field {
  id: string;
  type: FieldType;
  props: FieldBaseProps & Record<string, any>;
}

export interface RowProps {
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
}

export interface Row {
  id: string;
  fields: Field[];
  props?: RowProps;
}

export interface FormProps {
  backgroundColor?: string;
  maxWidth?: string;
  padding?: string;
  showCoverImage?: boolean;
  coverImageUrl?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  rows: Row[];
  props?: FormProps;
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
