import React from "react";
import { useSortable, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Plus, Trash2 } from "lucide-react";
import { Row } from "../../types";
import { FieldWrapper } from "./FieldWrapper";
import { useBuilderStore } from "../../store/useBuilderStore";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface RowWrapperProps {
  row: Row;
}

export const RowWrapper = ({ row }: RowWrapperProps) => {
  const { deleteRow, addRow } = useBuilderStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    data: {
      type: "Row",
      row,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEmpty = row.fields.length === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border-2 border-transparent transition-colors",
        "hover:border-border/60",
        isDragging && "opacity-50 border-primary border-dashed",
        isEmpty && "border-dashed border-border"
      )}
    >
      {/* Row Handle (Left side) */}
      <div 
        {...attributes} 
        {...listeners}
        className={cn(
          "absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing",
          "text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        )}
      >
        <GripHorizontal className="w-5 h-5 rotate-90" />
      </div>

      {/* Row Actions (Top right) */}
      <div className="absolute -top-3 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-sm"
          onClick={() => deleteRow(row.id)}
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>

      <div className="p-2 min-h-[100px]">
        <SortableContext 
          items={row.fields.map(f => f.id)} 
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 w-full">
            {row.fields.map((field) => (
              <div 
                key={field.id} 
                className="flex-1 min-w-0" // This handles the automatic division (flex-1)
              >
                <FieldWrapper field={field} rowId={row.id} />
              </div>
            ))}
            
            {isEmpty && (
              <div className="flex-1 flex items-center justify-center h-[80px] text-muted-foreground text-sm">
                Drag fields here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
