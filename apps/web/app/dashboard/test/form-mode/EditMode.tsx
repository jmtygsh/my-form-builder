import { useState } from "react";
import { DndContext, pointerWithin, useDraggable, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable"

import { arrayMove } from "@dnd-kit/sortable";
import { FIELD_DATA } from "../form/data";
import Canvas from "../form/canvas";
import { cn } from "~/lib/utils";
import { SidebarItem } from "../form-sidebar/element-sidebar/SidebarItem";


export default function EditMode() {
    // State to hold the items that have been dropped into the canvas
    const [canvasItems, setCanvasItems] = useState<any[]>([]);

    // State to hold the currently dragged item for the visual overlay
    const [activeField, setActiveField] = useState<typeof FIELD_DATA[number] | null>(null);

    // Track what is being dragged so we can show it in the overlay
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        if (active.data.current?.type === "sidebar-item") {
            setActiveField(active.data.current.field);
        } else if (active.data.current?.type === "canvas-item") {
            setActiveField(active.data.current.item);
        }
    }

    // Handle what happens when we drop an item
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // Reset the visual overlay
        setActiveField(null);

        // If dropped outside a valid droppable area, do nothing
        if (!over) return;

        const isOverCanvasArea = over.id === "canvas-droppable";
        const isOverCanvasItem = over.data.current?.type === "canvas-item";

        if (!isOverCanvasArea && !isOverCanvasItem) return;

        const isSidebarItem = active.data.current?.type === "sidebar-item";
        const isCanvasItem = active.data.current?.type === "canvas-item";

        if (isSidebarItem) {
            const fieldData = active.data.current?.field;

            // Add the new field to the canvas state
            setCanvasItems((prev) => {
                const newItem = {
                    ...fieldData,
                    instanceId: `${fieldData.id}-${Date.now()}`,
                };

                if (isOverCanvasItem) {
                    const overIndex = prev.findIndex(item => item.instanceId === over.id);
                    if (overIndex !== -1) {
                        const newItems = [...prev];
                        newItems.splice(overIndex, 0, newItem);
                        return newItems;
                    }
                }

                return [...prev, newItem];
            });
        } else if (isCanvasItem) {
            // Handle re-ordering within the canvas
            const oldIndex = canvasItems.findIndex(item => item.instanceId === active.id);
            const newIndex = isOverCanvasItem
                ? canvasItems.findIndex(item => item.instanceId === over.id)
                : canvasItems.length - 1;

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setCanvasItems((items) => arrayMove(items, oldIndex, newIndex));
            }
        }
    }

    return (
        <DndContext
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveField(null)}
        >
            <div className="flex h-full w-full">

                <ResizablePanelGroup
                    orientation="horizontal"
                    className="rounded-lg"
                >
                    <ResizablePanel defaultSize="20%">
                        {/* Left Sidebar: Source of Draggable Items */}
                        <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                            <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                                Form Elements
                            </h2>
                            {FIELD_DATA.map((field) => (
                                <SidebarItem key={field.id} field={field} />
                            ))}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />


                    <ResizablePanel defaultSize="60%">
                        <Canvas id="canvas-droppable" items={canvasItems} />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize="20%">

                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            {/* Visual overlay for dragging outside containers */}
            <DragOverlay>
                {activeField ? (
                    <div className="flex items-center gap-3 rounded-md border-2 border-primary bg-card p-3 text-sm shadow-xl cursor-grabbing opacity-90 w-56">
                        <div className="text-primary">{activeField.icon}</div>
                        <span className="font-medium">{activeField.label}</span>
                    </div>
                ) : null}
            </DragOverlay>

        </DndContext>
    );
}