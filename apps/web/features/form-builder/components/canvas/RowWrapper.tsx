import React from "react";
import { useSortable, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Settings, Trash2 } from "lucide-react";
import { Row } from "../../types";
import { FieldWrapper } from "./FieldWrapper";
import { useBuilderStore } from "../../store/useBuilderStore";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface RowWrapperProps {
  row: Row;
}

export const RowWrapper = ({ row }: RowWrapperProps) => {
  const { deleteRow, addRow, selectRow, selectedRowId } = useBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
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
  const isHovered = isOver && !isDragging;
  const isSelected = selectedRowId === row.id;

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border-2 transition-all",
        isSelected ? "border-primary/50 bg-primary/5" : "border-transparent hover:border-border/60",
        isDragging && "opacity-50 border-primary border-dashed",
        isEmpty && "border-dashed border-border",
        isHovered && "border-primary border-dashed bg-primary/5 ring-4 ring-primary/20 scale-[1.01] z-10"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectRow(row.id);
      }}
    >
      {/* Row Handle (Left side) */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing",
          "text-muted-foreground/50 hover:text-foreground transition-opacity",
          isSelected ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <GripHorizontal className="w-5 h-5 rotate-90" />
      </div>

      {/* Row Actions (Top right) */}
      <div className={cn(
        "absolute -top-3 right-4 flex items-center gap-1 transition-opacity z-10",
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            selectRow(row.id);
          }}
        >
          <Settings className="w-3 h-3 text-muted-foreground" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            deleteRow(row.id);
          }}
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>

      <div className="flex flex-row justify-center p-1">
        <SortableContext
          items={row.fields.map(f => f.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className={cn(
            "flex gap-4 w-full min-h-[40px]",
            alignClasses[(row.props?.alignItems || "start") as keyof typeof alignClasses],
            justifyClasses[(row.props?.justifyContent || "start") as keyof typeof justifyClasses]
          )}>
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
