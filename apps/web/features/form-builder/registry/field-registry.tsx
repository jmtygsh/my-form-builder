import React, { useRef } from "react";
import { Type, Mail, AlignLeft, ChevronDown, CheckSquare, CircleDot, Upload, Plus, Trash2, CloudUpload, User, Phone, MapPin, Heading, Pilcrow, AlignCenter, AlignRight, Calendar, ListChecks, Link as LinkIcon, Send } from "lucide-react";
import { FieldRegistryItem, Field } from "../types";
import { Input } from "~/components/ui/input";
import { ColorPickerInput } from "~/components/ui/color-picker";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { toast } from "sonner";

// --- CANAVAS COMPONENTS ---
const SectionHeaderCanvasComponent = ({ field }: { field: Field; isLive?: boolean }) => {
  const level = field.props.headingLevel || "h2";
  const Tag = level as keyof React.JSX.IntrinsicElements;
  const headingAlign = field.props.textAlign || "left";
  const descAlign = field.props.descriptionTextAlign || "left";

  const sizeClasses = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-medium",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const descSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {React.createElement(
        Tag,
        { className: `${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses.h2} ${alignClasses[headingAlign as keyof typeof alignClasses]}` },
        field.props.label
      )}
      {field.props.description && (
        <p
          className={`text-muted-foreground whitespace-pre-wrap leading-relaxed ${alignClasses[descAlign as keyof typeof alignClasses]} ${descSizeClasses[(field.props.descriptionFontSize || "sm") as keyof typeof descSizeClasses]}`}
          style={field.props.descriptionTextColor ? { color: field.props.descriptionTextColor } : undefined}
        >
          {field.props.description}
        </p>
      )}
    </div>
  );
};

const HeadingCanvasComponent = ({ field }: { field: Field; isLive?: boolean }) => {
  const level = field.props.headingLevel || "h2";
  const Tag = level as keyof React.JSX.IntrinsicElements;
  const align = field.props.textAlign || "left";

  const sizeClasses = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-medium",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full">
      {React.createElement(
        Tag,
        { className: `${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses.h2} ${alignClasses[align as keyof typeof alignClasses]}` },
        field.props.label
      )}
    </div>
  );
};

const ParagraphCanvasComponent = ({ field }: { field: Field; isLive?: boolean }) => {
  const align = field.props.textAlign || "left";
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full">
      <p className={`text-sm text-foreground whitespace-pre-wrap leading-relaxed ${alignClasses[align as keyof typeof alignClasses]}`}>
        {field.props.description}
      </p>
    </div>
  );
};

const SelectCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <Select disabled={!isLive}>
      <SelectTrigger className={!isLive ? "pointer-events-none" : ""}>
        <SelectValue placeholder={field.props.placeholder || "Select an option..."} />
      </SelectTrigger>
      <SelectContent>
        {field.props.options?.map((opt, i) => (
          <SelectItem key={i} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);

const DateCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <Input
      type="date"
      placeholder={field.props.placeholder}
      readOnly={!isLive}
      className={!isLive ? "pointer-events-none w-full" : "w-full"}
    />
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);

const CheckboxGroupCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-3 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <div className={`flex flex-col gap-2 ${!isLive ? "pointer-events-none" : ""}`}>
      {field.props.options?.map((opt, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox id={`cbg-${field.id}-${i}`} disabled={!isLive} />
          <Label htmlFor={`cbg-${field.id}-${i}`}>{opt}</Label>
        </div>
      ))}
    </div>
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);

const CheckboxCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-2 w-full pt-1">
    <div className="flex items-center space-x-2">
      <Checkbox id={`cb-${field.id}`} disabled={!isLive} className={!isLive ? "pointer-events-none" : ""} />
      <Label htmlFor={`cb-${field.id}`} className="text-sm font-medium leading-none">
        {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
      </Label>
    </div>
    {field.props.description && (
      <p className="text-xs text-muted-foreground ml-6">{field.props.description}</p>
    )}
  </div>
);

const RadioCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => (
  <div className="flex flex-col gap-3 w-full">
    <Label className="text-sm font-medium">
      {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
    </Label>
    <RadioGroup disabled={!isLive} className={!isLive ? "pointer-events-none" : ""}>
      {field.props.options?.map((opt, i) => (
        <div key={i} className="flex items-center space-x-2">
          <RadioGroupItem value={opt} id={`radio-${field.id}-${i}`} />
          <Label htmlFor={`radio-${field.id}-${i}`}>{opt}</Label>
        </div>
      ))}
    </RadioGroup>
    {field.props.description && (
      <p className="text-xs text-muted-foreground">{field.props.description}</p>
    )}
  </div>
);

const FileCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLive) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (field.props.allowedFileTypes && field.props.allowedFileTypes.length > 0) {
      const isAllowed = field.props.allowedFileTypes.some(type => {
        if (type === "image/*") return file.type.startsWith("image/");
        if (type === "application/pdf") return file.type === "application/pdf";
        return file.type === type;
      });

      if (!isAllowed) {
        toast.error("Invalid file type", {
          description: `Please upload a valid file. Allowed types: ${field.props.allowedFileTypes.map(t => t.split('/')[1] || t).join(', ')}`
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    toast.success("File selected", {
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label className="text-sm font-medium">
        {field.props.label} {field.props.required && <span className="text-destructive">*</span>}
      </Label>

      <div
        className={`
          relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg
          transition-colors bg-background
          ${!isLive ? "pointer-events-none opacity-80" : "hover:bg-muted/50 cursor-pointer"}
        `}
        onClick={() => isLive && fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted">
          <CloudUpload className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">Upload a File</p>
          <p className="text-xs text-muted-foreground">Drag and drop files here</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={field.props.allowedFileTypes?.join(",")}
          onChange={handleFileChange}
          disabled={!isLive}
        />
      </div>

      {field.props.description && (
        <p className="text-xs text-muted-foreground">{field.props.description}</p>
      )}
    </div>
  );
};

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

const ButtonCanvasComponent = ({ field, isLive }: { field: Field; isLive?: boolean }) => {
  const align = field.props.textAlign || "left";
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: field.props.buttonColor || undefined,
    color: field.props.textColor || undefined,
    opacity: field.props.buttonHoverOpacity ? undefined : undefined, // handled via inline hover if needed, or we use a style tag
  };

  const hasCustomColor = !!field.props.buttonColor || !!field.props.buttonHoverColor || !!field.props.buttonHoverOpacity || !!field.props.textColor || !!field.props.buttonHoverTextColor;
  const hoverColor = field.props.buttonHoverColor || field.props.buttonColor;
  const hoverTextColor = field.props.buttonHoverTextColor || field.props.textColor;
  const hoverOpacity = field.props.buttonHoverOpacity || "0.9";

  const id = `btn-${field.id}`;

  const Content = () => (
    <>
      {hasCustomColor && (
        <style dangerouslySetInnerHTML={{
          __html: `
          #${id} {
            background-color: ${field.props.buttonColor || "var(--primary)"};
            color: ${field.props.textColor || "var(--primary-foreground)"};
            transition: all 0.2s ease;
          }
          #${id}:hover:not(:disabled) {
            background-color: ${hoverColor || "var(--primary)"};
            color: ${hoverTextColor || "var(--primary-foreground)"};
            opacity: ${hoverOpacity};
          }
        `}} />
      )}
      <Button
        id={id}
        type={field.type === "submitButton" ? "submit" : "button"}
        disabled={!isLive}
        size={field.props.buttonSize || "default"}
        style={hasCustomColor ? undefined : buttonStyle}
        className={hasCustomColor ? (!isLive ? "pointer-events-none" : "") : (!isLive ? "pointer-events-none hover:opacity-90" : "hover:opacity-90")}
      >
        <span style={{ fontSize: field.props.fontSize === "xs" ? "0.75rem" : field.props.fontSize === "sm" ? "0.875rem" : field.props.fontSize === "lg" ? "1.125rem" : field.props.fontSize === "xl" ? "1.25rem" : "1rem" }}>
          {field.props.label}
        </span>
      </Button>
    </>
  );

  return (
    <div className={`flex w-full ${alignClasses[align as keyof typeof alignClasses]}`}>
      {field.type === "button" && field.props.url && isLive ? (
        <a href={field.props.url} target="_blank" rel="noopener noreferrer">
          <Content />
        </a>
      ) : (
        <Content />
      )}
    </div>
  );
};


// --- SETTINGS COMPONENTS ---
const TypographySettings = ({ field, updateField }: { field: Field, updateField: (p: any) => void }) => (
  <div className="space-y-6 pb-4">
    <div className="space-y-4">
      {(field.type === "heading" || field.type === "sectionHeader") && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Heading Text</Label>
            <Input
              className="h-8 text-sm"
              value={field.props.label}
              onChange={(e) => updateField({ label: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Heading Level</Label>
            <Select
              value={field.props.headingLevel || "h2"}
              onValueChange={(val) => updateField({ headingLevel: val })}
            >
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Heading 1 (H1)</SelectItem>
                <SelectItem value="h2">Heading 2 (H2)</SelectItem>
                <SelectItem value="h3">Heading 3 (H3)</SelectItem>
                <SelectItem value="h4">Heading 4 (H4)</SelectItem>
                <SelectItem value="h5">Heading 5 (H5)</SelectItem>
                <SelectItem value="h6">Heading 6 (H6)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Heading Alignment</Label>
            <ToggleGroup
              type="single"
              value={field.props.textAlign || "left"}
              onValueChange={(val) => {
                if (val) updateField({ textAlign: val });
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left align">
                <AlignLeft className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center align">
                <AlignCenter className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right align">
                <AlignRight className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </>
      )}

      {field.type === "sectionHeader" && (
        <div className="pt-4 border-t border-border/50 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Paragraph Text</Label>
            <Textarea
              className="text-sm min-h-[80px] resize-y"
              value={field.props.description || ""}
              onChange={(e) => updateField({ description: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Paragraph Font Size</Label>
            <Select
              value={field.props.descriptionFontSize || "sm"}
              onValueChange={(val) => updateField({ descriptionFontSize: val })}
            >
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small (xs)</SelectItem>
                <SelectItem value="sm">Small (sm)</SelectItem>
                <SelectItem value="base">Base (base)</SelectItem>
                <SelectItem value="lg">Large (lg)</SelectItem>
                <SelectItem value="xl">Extra Large (xl)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Paragraph Text Color</Label>
            <ColorPickerInput
              value={field.props.descriptionTextColor}
              placeholder="Inherit"
              onChange={(val) => updateField({ descriptionTextColor: val })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Paragraph Alignment</Label>
            <ToggleGroup
              type="single"
              value={field.props.descriptionTextAlign || "left"}
              onValueChange={(val) => {
                if (val) updateField({ descriptionTextAlign: val });
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left align">
                <AlignLeft className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center align">
                <AlignCenter className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right align">
                <AlignRight className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )}

      {field.type === "paragraph" && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Paragraph Text</Label>
            <Textarea
              className="text-sm min-h-[150px] resize-y"
              value={field.props.description || ""}
              onChange={(e) => updateField({ description: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Alignment</Label>
            <ToggleGroup
              type="single"
              value={field.props.textAlign || "left"}
              onValueChange={(val) => {
                if (val) updateField({ textAlign: val });
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left align">
                <AlignLeft className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center align">
                <AlignCenter className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right align">
                <AlignRight className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </>
      )}
    </div>
  </div>
);

const ButtonSettings = ({ field, updateField }: { field: Field, updateField: (p: any) => void }) => (
  <div className="flex flex-col gap-6">
    <div className="space-y-2 mt-3">
      <Label>{field.type === "button" || field.type === "submitButton" ? "Button Text" : "Label"}</Label>
      <Input
        value={field.props.label}
        onChange={(e) => updateField({ label: e.target.value })}
      />
    </div>

    {field.type === "button" && (
      <div className="space-y-2">
        <Label>URL (Link)</Label>
        <Input
          placeholder="https://example.com"
          value={field.props.url || ""}
          onChange={(e) => updateField({ url: e.target.value })}
        />
      </div>
    )}

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Alignment</Label>
      <ToggleGroup
        type="single"
        value={field.props.textAlign || "left"}
        onValueChange={(val) => {
          if (val) updateField({ textAlign: val });
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="left" aria-label="Left align">
          <AlignLeft className="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center align">
          <AlignCenter className="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Right align">
          <AlignRight className="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Button Size</Label>
      <Select
        value={field.props.buttonSize || "default"}
        onValueChange={(val) => updateField({ buttonSize: val })}
      >
        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="sm">Small</SelectItem>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="lg">Large</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Background Color</Label>
      <ColorPickerInput
        value={field.props.buttonColor}
        placeholder="Default (Theme Primary)"
        onChange={(val) => updateField({ buttonColor: val })}
      />
    </div>

    <div className="h-px bg-border w-full" />
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hover States</h4>

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Hover Background Color</Label>
      <ColorPickerInput
        value={field.props.buttonHoverColor}
        placeholder="Inherit"
        onChange={(val) => updateField({ buttonHoverColor: val })}
      />
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Hover Text Color</Label>
      <ColorPickerInput
        value={field.props.buttonHoverTextColor}
        placeholder="Inherit"
        onChange={(val) => updateField({ buttonHoverTextColor: val })}
      />
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Hover Opacity</Label>
      <Input
        type="number"
        min="0"
        max="1"
        step="0.1"
        className="h-8 text-sm"
        value={field.props.buttonHoverOpacity || ""}
        placeholder="0.9"
        onChange={(e) => updateField({ buttonHoverOpacity: e.target.value })}
      />
    </div>

  </div>
);

const BaseSettings = ({ field, updateField }: { field: Field, updateField: (p: any) => void }) => (
  <div className="flex flex-col gap-6">
    <div className="space-y-2 mt-3">
      <Label>{field.type === "button" || field.type === "submitButton" ? "Button Text" : "Label"}</Label>
      <Input
        value={field.props.label}
        onChange={(e) => updateField({ label: e.target.value })}
      />
    </div>

    {field.type === "button" && (
      <div className="space-y-2">
        <Label>URL (Link)</Label>
        <Input
          placeholder="https://example.com"
          value={field.props.url || ""}
          onChange={(e) => updateField({ url: e.target.value })}
        />
      </div>
    )}

    {field.type !== "checkbox" && field.type !== "radio" && field.type !== "file" && field.type !== "button" && field.type !== "submitButton" && (
      <div className="space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={field.props.placeholder || ""}
          onChange={(e) => updateField({ placeholder: e.target.value })}
        />
      </div>
    )}

    {field.type !== "button" && field.type !== "submitButton" && (
      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={field.props.description || ""}
          onChange={(e) => updateField({ description: e.target.value })}
        />
      </div>
    )}

    {field.props.options !== undefined && (
      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {field.props.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const newOpts = [...field.props.options!];
                  newOpts[i] = e.target.value;
                  updateField({ options: newOpts });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive shrink-0"
                onClick={() => {
                  const newOpts = field.props.options!.filter((_, idx) => idx !== i);
                  updateField({ options: newOpts });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => updateField({ options: [...field.props.options!, `Option ${field.props.options!.length + 1}`] })}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Option
          </Button>
        </div>
      </div>
    )}

    {field.props.allowedFileTypes !== undefined && (
      <>
        <div className="h-px bg-border w-full" />
        <div className="space-y-4">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allowed Files</Label>
          <div className="space-y-3">
            {[
              { label: "Images (JPG, PNG)", value: "image/*" },
              { label: "PDF Documents", value: "application/pdf" },
              { label: "Word Documents", value: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
            ].map((type) => {
              const isChecked = field.props.allowedFileTypes?.includes(type.value);
              return (
                <div
                  key={type.value}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    let newTypes = field.props.allowedFileTypes ? [...field.props.allowedFileTypes] : [];
                    if (isChecked) {
                      newTypes = newTypes.filter(t => t !== type.value);
                    } else {
                      newTypes.push(type.value);
                    }
                    updateField({ allowedFileTypes: newTypes });
                  }}
                >
                  <Label className="text-xs font-medium text-muted-foreground cursor-pointer pointer-events-none">
                    {type.label}
                  </Label>
                  <Checkbox
                    checked={isChecked}
                    className="pointer-events-none mr-1"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}

    {field.type !== "button" && field.type !== "submitButton" && (
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
    )}
  </div>
);


// --- REGISTRY ---
export const FieldRegistry: Record<string, FieldRegistryItem> = {
  text: {
    type: "text",
    category: "native",
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
  textarea: {
    type: "textarea",
    category: "native",
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
  },
  select: {
    type: "select",
    category: "native",
    label: "Select",
    description: "Select from dropdown menu",
    icon: <ChevronDown className="w-4 h-4" />,
    defaultProps: {
      label: "Select Option",
      placeholder: "Select an option...",
      description: "",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
    },
    canvasComponent: SelectCanvasComponent,
    settingsComponent: BaseSettings,
  },
  checkbox: {
    type: "checkbox",
    category: "native",
    label: "Checkbox Group",
    description: "Choose multiple options",
    icon: <ListChecks className="w-4 h-4" />,
    defaultProps: {
      label: "Choose options",
      description: "",
      required: false,
      options: ["Yes", "No"],
    },
    canvasComponent: CheckboxGroupCanvasComponent,
    settingsComponent: BaseSettings,
  },
  date: {
    type: "date",
    category: "native",
    label: "Date",
    description: "Select a date",
    icon: <Calendar className="w-4 h-4" />,
    defaultProps: {
      label: "Date",
      placeholder: "mm/dd/yyyy",
      description: "",
      required: false,
    },
    canvasComponent: DateCanvasComponent,
    settingsComponent: BaseSettings,
  },
  radio: {
    type: "radio",
    category: "native",
    label: "Radio Group",
    description: "Choose one option from radio buttons",
    icon: <CircleDot className="w-4 h-4" />,
    defaultProps: {
      label: "Choose one",
      description: "",
      required: false,
      options: ["Option 1", "Option 2"],
    },
    canvasComponent: RadioCanvasComponent,
    settingsComponent: BaseSettings,
  },
  file: {
    type: "file",
    category: "native",
    label: "File Input",
    description: "Upload files",
    icon: <Upload className="w-4 h-4" />,
    defaultProps: {
      label: "Upload Document",
      description: "",
      required: false,
      allowedFileTypes: ["image/*", "application/pdf"],
    },
    canvasComponent: FileCanvasComponent,
    settingsComponent: BaseSettings,
  },
  button: {
    type: "button",
    category: "native",
    label: "Link Button",
    description: "Button that links to a URL",
    icon: <LinkIcon className="w-4 h-4" />,
    defaultProps: {
      label: "Click Here",
      url: "https://google.com",
      textAlign: "center",
      buttonSize: "default",
    },
    canvasComponent: ButtonCanvasComponent,
    settingsComponent: ButtonSettings,
  },
  // --- PRE-BUILT COMPONENTS ---
  agreeBox: {
    type: "agreeBox",
    category: "pre-built",
    label: "Agree Box",
    description: "Single checkbox for agreements",
    icon: <CheckSquare className="w-4 h-4" />,
    defaultProps: {
      label: "I agree to the terms and conditions",
      description: "",
      required: true,
    },
    canvasComponent: CheckboxCanvasComponent,
    settingsComponent: BaseSettings,
  },
  heading: {
    type: "heading",
    category: "pre-built",
    label: "Heading",
    description: "Add a page or section heading",
    icon: <Heading className="w-4 h-4" />,
    defaultProps: {
      label: "Section Heading",
      headingLevel: "h2",
    },
    canvasComponent: HeadingCanvasComponent,
    settingsComponent: TypographySettings,
  },
  paragraph: {
    type: "paragraph",
    category: "pre-built",
    label: "Paragraph",
    description: "Add a block of text",
    icon: <Pilcrow className="w-4 h-4" />,
    defaultProps: {
      label: "Paragraph",
      description: "Type your paragraph text here. Use this to provide extra context, instructions, or information to the users filling out this form.",
    },
    canvasComponent: ParagraphCanvasComponent,
    settingsComponent: TypographySettings,
  },

  sectionHeader: {
    type: "sectionHeader",
    category: "pre-built",
    label: "Section Header",
    description: "Heading with description text",
    icon: <Heading className="w-4 h-4" />,
    defaultProps: {
      label: "Section Title",
      description: "Provide some details about this section here.",
      headingLevel: "h2",
      textAlign: "left",
      descriptionTextAlign: "left",
      descriptionFontSize: "sm",
    },
    canvasComponent: SectionHeaderCanvasComponent,
    settingsComponent: TypographySettings,
  },
  fullName: {
    type: "fullName",
    category: "pre-built",
    label: "Full Name",
    description: "Pre-configured name field",
    icon: <User className="w-4 h-4" />,
    defaultProps: {
      label: "Full Name",
      placeholder: "e.g. John Doe",
      description: "",
      required: true,
    },
    canvasComponent: TextCanvasComponent,
    settingsComponent: BaseSettings,
  },
  email: {
    type: "email",
    category: "pre-built",
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
  phone: {
    type: "phone",
    category: "pre-built",
    label: "Phone Number",
    description: "Pre-configured phone field",
    icon: <Phone className="w-4 h-4" />,
    defaultProps: {
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      description: "",
      required: true,
    },
    canvasComponent: TextCanvasComponent,
    settingsComponent: BaseSettings,
  },
  address: {
    type: "address",
    category: "pre-built",
    label: "Address",
    description: "Pre-configured address field",
    icon: <MapPin className="w-4 h-4" />,
    defaultProps: {
      label: "Street Address",
      placeholder: "123 Main St, City, Country",
      description: "",
      required: true,
    },
    canvasComponent: TextareaCanvasComponent,
    settingsComponent: BaseSettings,
  },
  submitButton: {
    type: "submitButton",
    category: "pre-built",
    label: "Submit Button",
    description: "Form submission button",
    icon: <Send className="w-4 h-4" />,
    defaultProps: {
      label: "Submit Form",
      textAlign: "center",
      buttonSize: "default",
    },
    canvasComponent: ButtonCanvasComponent,
    settingsComponent: ButtonSettings,
  }
};

export const getFieldRegistryList = () => Object.values(FieldRegistry);
