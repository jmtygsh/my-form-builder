import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { getFieldRegistryList } from "../../registry/field-registry";
import { useBuilderStore } from "../../store/useBuilderStore";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

// Separate component for draggable items
const DraggableSidebarItem = ({ field, onClick }: { field: any, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${field.type}`,
    data: {
      type: "sidebar-item",
      field,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "border-border/60 hover:bg-accent/40 hover:text-accent-foreground bg-background group flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted/80">
        {field.icon}
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <div className="text-sm font-medium leading-none truncate">{field.label}</div>
        <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{field.description}</div>
      </div>
    </div>
  );
};

export const LeftSidebar = () => {
  const fields = getFieldRegistryList();
  const nativeFields = fields.filter(f => f.category === "native");
  const preBuiltFields = fields.filter(f => f.category === "pre-built");

  const { form, addFieldToRow, addRow } = useBuilderStore();

  const handleAddField = (fieldType: string, defaultProps: any) => {
    // If no rows, create one first
    if (form.rows.length === 0) {
      addRow();
      // Need to wait for state to update, simple hack for now is to just show a toast
      toast.info("Created first row. Click field again to add.");
      return;
    }

    // Add to the last row by default
    const lastRow = form.rows[form.rows.length - 1];
    if (lastRow) {
      addFieldToRow(lastRow.id, fieldType as any, defaultProps);
      toast.success("Field added");
    }
  };

  return (
    <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full border-r">
      <div className="flex flex-col gap-6 pb-6">

        {/* Pre-built Components Group */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
            Pre-Built Components
          </h2>
          {preBuiltFields.map((field) => (
            <DraggableSidebarItem
              key={field.type}
              field={field}
              onClick={() => handleAddField(field.type, field.defaultProps)}
            />
          ))}
        </div>


        {/* Native Fields Group */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
            Native HTML Elements
          </h2>
          {nativeFields.map((field) => (
            <DraggableSidebarItem
              key={field.type}
              field={field}
              onClick={() => handleAddField(field.type, field.defaultProps)}
            />
          ))}
        </div>


      </div>
    </div>
  );
};
