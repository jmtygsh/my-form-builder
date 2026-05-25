import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { FieldRegistry } from "../../registry/field-registry";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ColorPickerInput } from "~/components/ui/color-picker";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Switch } from "~/components/ui/switch";
import { Checkbox } from "~/components/ui/checkbox";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ArrowDownToLine, ArrowUpToLine, ArrowRightLeft, AlignVerticalSpaceAround, AlignVerticalSpaceBetween, Image as ImageIcon } from "lucide-react";
import { Field, Row, FormSchema } from "../../types";
import { UnsplashPicker } from "~/components/ui/unsplash-picker";
import { Button } from "~/components/ui/button";

const CanvasSettings = ({ form, updateFormProps }: { form: FormSchema; updateFormProps: (updates: Partial<FormSchema["props"]>) => void }) => {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Canvas Layout</h4>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Background Color</Label>
          <ColorPickerInput
            value={form.props?.backgroundColor}
            placeholder="Default (Transparent)"
            onChange={(val) => updateFormProps({ backgroundColor: val })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Max Width</Label>
          <Select
            value={form.props?.maxWidth || "4xl"}
            onValueChange={(val) => updateFormProps({ maxWidth: val })}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2xl">Small (2xl)</SelectItem>
              <SelectItem value="3xl">Medium (3xl)</SelectItem>
              <SelectItem value="4xl">Default (4xl)</SelectItem>
              <SelectItem value="5xl">Large (5xl)</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground pt-1">Limits the maximum width of the form.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Canvas Padding</Label>
          <Select
            value={form.props?.padding || "8"}
            onValueChange={(val) => updateFormProps({ padding: val })}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None (0)</SelectItem>
              <SelectItem value="4">Small (1rem)</SelectItem>
              <SelectItem value="8">Default (2rem)</SelectItem>
              <SelectItem value="12">Large (3rem)</SelectItem>
              <SelectItem value="16">Extra Large (4rem)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-border w-full my-2" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cover Image</h4>

        <div className="flex items-center gap-4 overflow-hidden bg-accent py-1.5 px-2 rounded-md">
          <div className="space-y-0.5">
            <Label className="text-sm">Enable Cover Image</Label>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => updateFormProps({ showCoverImage: !form.props?.showCoverImage })}
              className="cursor-pointer flex items-center justify-center h-full pt-1"
            >
              <Checkbox
                checked={!!form.props?.showCoverImage}
                className="pointer-events-none mr-1"
              />
            </div>
          </div>
        </div>

        {form.props?.showCoverImage && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
            {form.props.coverImageUrl && (
              <div className="relative aspect-[3/1] w-full rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.props.coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <UnsplashPicker onSelect={(url) => updateFormProps({ coverImageUrl: url })}>
              <Button variant="outline" className="w-full text-xs h-8">
                <ImageIcon className="w-3.5 h-3.5 mr-2" />
                {form.props.coverImageUrl ? "Replace Image" : "Choose Image"}
              </Button>
            </UnsplashPicker>
          </div>
        )}
      </div>
    </div>
  );
};

const RowSettings = ({ row, updateRow }: { row: Row; updateRow: (updates: Partial<Row["props"]>) => void }) => {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row Layout</h4>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Vertical Alignment</Label>
          <ToggleGroup
            type="single"
            value={row.props?.alignItems || "start"}
            onValueChange={(val) => {
              if (val) updateRow({ alignItems: val as any });
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="start" aria-label="Top">
              <ArrowUpToLine className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center">
              <AlignCenter className="w-4 h-4 rotate-90" />
            </ToggleGroupItem>
            <ToggleGroupItem value="end" aria-label="Bottom">
              <ArrowDownToLine className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="stretch" aria-label="Stretch">
              <AlignJustify className="w-4 h-4 rotate-90" />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-[10px] text-muted-foreground pt-1">Aligns fields vertically within the row.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Horizontal Distribution</Label>
          <ToggleGroup
            type="single"
            value={row.props?.justifyContent || "start"}
            onValueChange={(val) => {
              if (val) updateRow({ justifyContent: val as any });
            }}
            className="justify-start flex-wrap"
          >
            <ToggleGroupItem value="start" aria-label="Left">
              <AlignLeft className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center">
              <AlignCenter className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="end" aria-label="Right">
              <AlignRight className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="between" aria-label="Space Between">
              <AlignVerticalSpaceBetween className="w-4 h-4 rotate-90" />
            </ToggleGroupItem>
            <ToggleGroupItem value="around" aria-label="Space Around">
              <AlignVerticalSpaceAround className="w-4 h-4 rotate-90" />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-[10px] text-muted-foreground pt-1">Distributes fields horizontally.</p>
        </div>
      </div>
    </div>
  );
};

const StyleSettings = ({ field, updateField }: { field: Field; updateField: (updates: Partial<Field["props"]>) => void }) => {
  const hasPlaceholder = ["text", "email", "textarea", "fullName", "phone", "address", "date"].includes(field.type);
  const isHeadingField = ["heading", "sectionHeader"].includes(field.type);

  return (
    <div className="flex flex-col gap-6 pt-6 mt-6 border-t border-border/50">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h4>

        {/* Font Size & Color */}
        <div className="space-y-4">
          {!isHeadingField && (
            <div className="space-y-1.5 ">
              <Label className="text-xs text-muted-foreground">Font Size</Label>
              <Select
                value={field.props.fontSize || "sm"}
                onValueChange={(val: any) => updateField({ fontSize: val })}
              >
                <SelectTrigger className="w-full h-8 text-sm">
                  <SelectValue placeholder="Default (sm)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Extra Small (xs)</SelectItem>
                  <SelectItem value="sm">Small (sm)</SelectItem>
                  <SelectItem value="base">Base (base)</SelectItem>
                  <SelectItem value="lg">Large (lg)</SelectItem>
                  <SelectItem value="xl">Extra Large (xl)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{isHeadingField ? "Heading Color" : "Text Color"}</Label>
            <ColorPickerInput
              value={field.props.textColor}
              placeholder="Inherit"
              onChange={(val) => updateField({ textColor: val })}
            />
          </div>

          {hasPlaceholder && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <Label className="text-xs text-muted-foreground">Placeholder Color</Label>
              <ColorPickerInput
                value={field.props.placeholderColor}
                placeholder="Inherit"
                onChange={(val) => updateField({ placeholderColor: val })}
              />
            </div>
          )}
        </div>

        {/* Spacing */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground block">Margin (px)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Top</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.marginTop || ""} placeholder="0" onChange={(e) => updateField({ marginTop: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Bottom</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.marginBottom || ""} placeholder="0" onChange={(e) => updateField({ marginBottom: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Left</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.marginLeft || ""} placeholder="0" onChange={(e) => updateField({ marginLeft: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Right</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.marginRight || ""} placeholder="0" onChange={(e) => updateField({ marginRight: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground block">Padding (px)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Top</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.paddingTop || ""} placeholder="0" onChange={(e) => updateField({ paddingTop: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Bottom</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.paddingBottom || ""} placeholder="0" onChange={(e) => updateField({ paddingBottom: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Left</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.paddingLeft || ""} placeholder="0" onChange={(e) => updateField({ paddingLeft: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Right</Label>
                <Input type="number" className="h-8 text-sm" value={field.props.paddingRight || ""} placeholder="0" onChange={(e) => updateField({ paddingRight: e.target.value })} />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export const RightSidebar = () => {
  const { form, selectedFieldId, selectedRowId, selectedCanvas, updateField, updateRow, updateFormProps } = useBuilderStore();

  if (selectedCanvas) {
    return (
      <div className="bg-muted/10 p-4 flex flex-col gap-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full border-l">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0">
            Configuration
          </h2>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            (Canvas Settings)
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <CanvasSettings
            form={form}
            updateFormProps={updateFormProps}
          />
        </div>
      </div>
    );
  }

  if (selectedRowId) {
    const selectedRow = form.rows.find(r => r.id === selectedRowId);
    if (selectedRow) {
      return (
        <div className="bg-muted/10 p-4 flex flex-col gap-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full border-l">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0">
              Configuration
            </h2>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              (Row Settings)
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            <RowSettings
              row={selectedRow}
              updateRow={(updates) => updateRow(selectedRow.id, updates)}
            />
          </div>
        </div>
      );
    }
  }

  let selectedField = null;
  for (const row of form.rows) {
    const field = row.fields.find(f => f.id === selectedFieldId);
    if (field) {
      selectedField = field;
      break;
    }
  }

  if (!selectedField) {
    return (
      <div className="bg-muted/10 p-4 flex flex-col gap-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full border-l">
        <div className="shrink-0">
          <h2 className="font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
            Configuration
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground text-sm p-4">
          Select an element on the canvas to configure its settings.
        </div>
      </div>
    );
  }

  const registryItem = FieldRegistry[selectedField.type];
  if (!registryItem) return null;

  const SettingsComponent = registryItem.settingsComponent;

  return (
    <div className="bg-muted/10 p-4 flex flex-col gap-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full border-l">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0">
          Configuration
        </h2>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          ({registryItem.label})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">

        <SettingsComponent
          field={selectedField}
          updateField={(updates) => updateField(selectedField.id, updates)}
        />

        <StyleSettings
          field={selectedField}
          updateField={(updates) => updateField(selectedField.id, updates)}
        />
      </div>
    </div>
  );
};
