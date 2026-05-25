import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2, Copy } from "lucide-react";
import { Field } from "../../types";
import { FieldRegistry } from "../../registry/field-registry";
import { useBuilderStore } from "../../store/useBuilderStore";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

interface FieldWrapperProps {
  field: Field;
  rowId: string;
}

export const FieldWrapper = ({ field, rowId }: FieldWrapperProps) => {
  const { selectedFieldId, selectField, deleteField, addFieldToRow, form } = useBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: {
      type: "Field",
      field,
      rowId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedFieldId === field.id;
  const registryItem = FieldRegistry[field.type];

  if (!registryItem) return null;

  const CanvasComponent = registryItem.canvasComponent;

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const row = form.rows.find(r => r.id === rowId);
    if (!row) return;
    const fieldIndex = row.fields.findIndex(f => f.id === field.id);
    addFieldToRow(rowId, field.type, field.props, fieldIndex + 1);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteField(field.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex rounded-md border border-transparent hover:border-border/50 bg-background/50 w-full",
        isDragging && "opacity-50 border-primary border-dashed",
        isSelected && "border-primary hover:border-primary ring-1 ring-primary/20"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectField(field.id);
      }}
    >
      {/* Field Content */}
      <div className="flex-1 p-4 pointer-events-none">
        <CanvasComponent field={field} />
      </div>

      {/* Mini Toolbar - Only visible on hover or select */}
      <div
        className={cn(
          "absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isSelected && "opacity-100"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            selectField(field.id);
          }}
        >
          <Settings className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <div className="flex flex-col gap-[2px]">
                <span className="w-[3px] h-[3px] rounded-full bg-current"></span>
                <span className="w-[3px] h-[3px] rounded-full bg-current"></span>
                <span className="w-[3px] h-[3px] rounded-full bg-current"></span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
