import React from "react";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { cn } from "~/lib/utils";
import { Plus } from "lucide-react";

interface RowDropZoneProps {
  index: number;
}

export const RowDropZone = ({ index }: RowDropZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `row-dropzone-${index}`,
    data: {
      type: "RowDropZone",
      index,
    },
  });

  const { active } = useDndContext();
  const activeType = active?.data?.current?.type;
  const isDraggingField = activeType === "Field" || activeType === "sidebar-item";

  if (!isDraggingField) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full rounded-md transition-all flex items-center justify-center -my-1 relative z-20",
        isOver ? "bg-primary/20 h-10 border-2 border-primary border-dashed" : "bg-transparent h-2"
      )}
    >
      {isOver && (
        <div className="flex items-center gap-1 text-primary text-xs font-semibold">
          <Plus className="w-3 h-3" /> New Row
        </div>
      )}
    </div>
  );
};
