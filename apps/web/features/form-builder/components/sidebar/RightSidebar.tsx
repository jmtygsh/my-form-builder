import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { FieldRegistry } from "../../registry/field-registry";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Field } from "../../types";

const StyleSettings = ({ field, updateField }: { field: Field; updateField: (updates: Partial<Field["props"]>) => void }) => {
  return (
    <div className="flex flex-col gap-6 pt-6 mt-6 border-t border-border/50">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h4>

        {/* Font Size & Color */}
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
  const { form, selectedFieldId, updateField } = useBuilderStore();

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
