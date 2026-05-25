import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { FieldRegistry } from "../../registry/field-registry";
import { Settings } from "lucide-react";

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
      </div>
    </div>
  );
};
