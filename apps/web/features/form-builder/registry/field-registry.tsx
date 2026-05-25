import React from "react";
import { Type, Mail, AlignLeft } from "lucide-react";
import { FieldRegistryItem, Field } from "../types";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Switch } from "~/components/ui/switch";

// --- CANAVAS COMPONENTS ---
const TextCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <Input
      placeholder={field.props.placeholder}
      readOnly={!isLive}
      className={!isLive ? "pointer-events-none" : ""}
    />
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);

const TextareaCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <Textarea
      placeholder={field.props.placeholder}
      readOnly={!isLive}
      className={!isLive ? "pointer-events-none resize-none" : "resize-y"}
    />
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);


// --- SETTINGS COMPONENTS ---
const BaseSettings = ({ field, updateField }: { field: Field, updateField: (p: any) => void }) => (
  <div className="flex flex-col gap-6">
    <div className="space-y-2 mt-3">
      <Label>Label</Label>
      <Input
        value={field.props.label}
        onChange={(e) => updateField({ label: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label>Placeholder</Label>
      <Input
        value={field.props.placeholder || ""}
        onChange={(e) => updateField({ placeholder: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label>Description</Label>
      <Input
        value={field.props.description || ""}
        onChange={(e) => updateField({ description: e.target.value })}
      />
    </div>

    <div className="flex items-center gap-4 overflow-hidden bg-accent py-1.5 px-2 rounded-md">
      <div className="space-y-0.5">
        <Label className="text-sm">Required</Label>

      </div>

      <div className="space-y-3">
        <div
          onClick={() =>
            updateField({ required: !field.props.required })
          }
        >

          <Checkbox
            id="required-checkbox"
            checked={!!field.props.required}
            onCheckedChange={(checked) =>
              updateField({ required: !!checked })
            }
            className="pointer-events-none mr-1"
          />
        </div>
      </div>
    </div>
  </div>
);


// --- REGISTRY ---
export const FieldRegistry: Record<string, FieldRegistryItem> = {
  text: {
    type: "text",
    label: "Input",
    description: "Native HTML input element",
    icon: <Type className="w-4 h-4" />,
    defaultProps: {
      label: "Short Text",
      placeholder: "Enter text...",
      description: "",
      required: false,
    },
    canvasComponent: TextCanvasComponent,
    settingsComponent: BaseSettings,
  },
  email: {
    type: "email",
    label: "Email",
    description: "Input field for email addresses",
    icon: <Mail className="w-4 h-4" />,
    defaultProps: {
      label: "Email Address",
      placeholder: "name@example.com",
      description: "",
      required: true,
    },
    canvasComponent: TextCanvasComponent,
    settingsComponent: BaseSettings,
  },
  textarea: {
    type: "textarea",
    label: "Textarea",
    description: "Multi-line text input",
    icon: <AlignLeft className="w-4 h-4" />,
    defaultProps: {
      label: "Long Text",
      placeholder: "Enter long text here...",
      description: "",
      required: false,
    },
    canvasComponent: TextareaCanvasComponent,
    settingsComponent: BaseSettings,
  }
};

export const getFieldRegistryList = () => Object.values(FieldRegistry);
