import { useState } from "react";
import { DndContext, pointerWithin, useDraggable, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable"

import { arrayMove } from "@dnd-kit/sortable";
import { LeftSidebar } from "../form/LeftSidebar";
import { RightSidebar } from "../form/RightSidebar";
import Canvas from "../form/Middlebar";
import { cn } from "~/lib/utils";


export default function EditMode({ activeTab }: { activeTab: "elements" | "layouts" }) {
    // State to hold the items that have been dropped into the canvas
    const [canvasItems, setCanvasItems] = useState<any[]>([]);

    // State to hold the currently dragged item for the visual overlay
    const [activeField, setActiveField] = useState(null);

    // Track what is being dragged so we can show it in the overlay
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        if (active.data.current?.type === "sidebar-item" || active.data.current?.type === "sidebar-layout") {
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
        const isSidebarLayout = active.data.current?.type === "sidebar-layout";
        const isCanvasItem = active.data.current?.type === "canvas-item";

        if (isSidebarItem || isSidebarLayout) {
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
                        <LeftSidebar activeTab={activeTab} />
                    </ResizablePanel>

                    <ResizableHandle withHandle />


                    <ResizablePanel defaultSize="60%">
                        <Canvas id="canvas-droppable" items={canvasItems} />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize="20%">
                        <RightSidebar />
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            {/* Visual overlay for dragging outside containers */}
            <DragOverlay>
                {activeField ? (
                    <div className="border-border/60 bg-background flex w-56 items-start gap-3 rounded-lg border px-3 py-2 text-left shadow-xl cursor-grabbing opacity-90">
                        <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                            {activeField.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium leading-none truncate">{activeField.label}</div>
                            <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{activeField.description}</div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>

        </DndContext>
    );
}