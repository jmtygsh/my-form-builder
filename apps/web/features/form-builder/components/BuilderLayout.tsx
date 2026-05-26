import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { LeftSidebar } from "./sidebar/LeftSidebar";
import { RightSidebar } from "./sidebar/RightSidebar";
import { FormRenderer } from "./canvas/FormRenderer";
import { useBuilderStore } from "../store/useBuilderStore";

export const BuilderLayout = () => {
  const { form, selectField, moveRow, moveFieldWithinRow, moveFieldAcrossRows, addFieldToRow, addRow } = useBuilderStore();
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handle dragging from sidebar
    if (activeType === "sidebar-item") {
      const fieldData = active.data.current?.field;
      if (!fieldData) return;

      if (overType === "RowDropZone") {
        const index = over.data.current?.index;
        if (typeof index === "number") {
          useBuilderStore.getState().addFieldToNewRow(index, fieldData.type, fieldData.defaultProps);
        }
      } else if (overType === "Row") {
        // Dropped onto an empty row
        useBuilderStore.getState().addFieldToRow(overId, fieldData.type, fieldData.defaultProps);
      } else if (overType === "Field") {
        // Dropped onto another field
        const overRowId = over.data.current?.rowId;
        if (overRowId) {
          const overRow = form.rows.find(r => r.id === overRowId);
          if (overRow) {
            const overIndex = overRow.fields.findIndex(f => f.id === overId);
            useBuilderStore.getState().addFieldToRow(overRowId, fieldData.type, fieldData.defaultProps, overIndex);
          }
        }
      } else if (over.id === "canvas-droppable") {
        // Dropped on empty canvas area, create a new row with this field
        useBuilderStore.getState().addFieldToNewRow(form.rows.length, fieldData.type, fieldData.defaultProps);
      }
      return;
    }

    // Handle reordering rows
    if (activeType === "Row" && overType === "Row") {
      const oldIndex = form.rows.findIndex((r) => r.id === activeId);
      const newIndex = form.rows.findIndex((r) => r.id === overId);
      useBuilderStore.getState().moveRow(oldIndex, newIndex);
      return;
    }

    // Handle reordering fields
    if (activeType === "Field") {
      if (overType === "RowDropZone") {
        const index = over.data.current?.index;
        if (typeof index === "number") {
          useBuilderStore.getState().moveFieldToNewRow(activeId, index);
        }
        return;
      }

      const activeRowId = active.data.current?.rowId;
      const overRowId = over.data.current?.rowId || (overType === "Row" ? overId : null);

      if (!activeRowId || !overRowId) return;

      const activeRow = form.rows.find(r => r.id === activeRowId);
      const overRow = form.rows.find(r => r.id === overRowId);

      if (!activeRow || !overRow) return;

      const activeIndex = activeRow.fields.findIndex(f => f.id === activeId);
      let overIndex = overRow.fields.findIndex(f => f.id === overId);

      if (overIndex === -1) {
        overIndex = overRow.fields.length;
      }

      if (activeRowId === overRowId) {
        moveFieldWithinRow(activeRowId, activeIndex, overIndex);
      } else {
        moveFieldAcrossRows(activeRowId, overRowId, activeId, overIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full bg-background overflow-hidden" onClick={() => { selectField(null); useBuilderStore.getState().selectRow(null); }}>
        <ResizablePanelGroup orientation="horizontal" className="rounded-lg">
          {/* Left Palette */}
          <ResizablePanel defaultSize={20} >
            <LeftSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Canvas */}
          <ResizablePanel defaultSize={60} className="bg-muted/30">
            <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full" onClick={(e) => e.stopPropagation()}>
              <FormRenderer />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="z-20 bg-border hover:bg-primary/50 transition-colors" />

          {/* Right Settings */}
          <ResizablePanel defaultSize={20}>
            <div className="h-full" onClick={(e) => e.stopPropagation()}>
              <RightSidebar />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <DragOverlay>
        {activeItem?.type === "sidebar-item" && activeItem?.field && (
          <div className="border-border/60 bg-background flex w-56 items-start gap-3 rounded-lg border px-3 py-2 text-left shadow-xl cursor-grabbing opacity-90">
            <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
              {activeItem.field.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-none truncate">{activeItem.field.label}</div>
              <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{activeItem.field.description}</div>
            </div>
          </div>
        )}
        {activeItem?.type === "Field" && (
          <div className="w-full h-24 bg-primary/10 border-2 border-primary border-dashed rounded-lg opacity-80" />
        )}
        {activeItem?.type === "Row" && (
          <div className="w-full h-32 bg-primary/10 border-2 border-primary border-dashed rounded-xl opacity-80" />
        )}
      </DragOverlay>
    </DndContext>
  );
};

