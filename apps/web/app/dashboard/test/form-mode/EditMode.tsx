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
import { CanvasNode, getFieldData } from "../data";
import { deleteCanvasItem, duplicateCanvasItem } from "../utils";

export default function EditMode({ activeTab }: { activeTab: "elements" | "layouts" }) {
    // State to hold the items that have been dropped into the canvas
    const [canvasItems, setCanvasItems] = useState<CanvasNode[]>([]);

    // State to hold the currently dragged item for the visual overlay
    const [activeField, setActiveField] = useState<any>(null);

    const handleDelete = (instanceId: string) => {
        setCanvasItems((prev) => deleteCanvasItem(prev, instanceId));
    };

    const handleDuplicate = (instanceId: string) => {
        setCanvasItems((prev) => duplicateCanvasItem(prev, instanceId));
    };

    // Track what is being dragged so we can show it in the overlay
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        if (active.data.current?.type === "sidebar-item" || active.data.current?.type === "sidebar-layout") {
            setActiveField(active.data.current.field);
        } else if (active.data.current?.type === "canvas-item") {
            setActiveField(active.data.current.node);
        }
    }

    // Handle what happens when we drop an item
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveField(null);

        if (!over) return;

        const isOverCanvasArea = over.id === "canvas-droppable";
        const isOverCanvasItem = over.data.current?.type === "canvas-item";
        const isOverGridSlot = over.data.current?.type === "grid-slot";

        const isSidebarItem = active.data.current?.type === "sidebar-item";
        const isSidebarLayout = active.data.current?.type === "sidebar-layout";
        const isCanvasItem = active.data.current?.type === "canvas-item";

        // Handle dropping a normal element into a Grid Slot
        if (isOverGridSlot && isSidebarItem) {
            const fieldData = active.data.current?.field;
            const containerId = over.data.current?.containerId;
            const colKey = over.data.current?.colKey;

            setCanvasItems((prev) => prev.map((node) => {
                if (node.instanceId === containerId) {
                    return {
                        ...node,
                        children: {
                            ...node.children,
                            [colKey]: {
                                instanceId: `${fieldData.id}-${Date.now()}`,
                                fieldId: fieldData.id,
                                type: "sidebar-item",
                            }
                        }
                    };
                }
                return node;
            }));
            return;
        }

        // Handle dropping onto the Main Canvas (or between items)
        if (isOverCanvasArea || isOverCanvasItem) {
            if (isSidebarItem || isSidebarLayout) {
                const fieldData = active.data.current?.field;
                const newNode: CanvasNode = {
                    instanceId: `${fieldData.id}-${Date.now()}`,
                    fieldId: fieldData.id,
                    type: active.data.current?.type,
                    ...(active.data.current?.type === "sidebar-layout" ? { children: {} } : {})
                };

                setCanvasItems((prev) => {
                    if (isOverCanvasItem) {
                        const overIndex = prev.findIndex(item => item.instanceId === over.id);
                        if (overIndex !== -1) {
                            const newItems = [...prev];
                            newItems.splice(overIndex, 0, newNode);
                            return newItems;
                        }
                    }
                    return [...prev, newNode];
                });
            } else if (isCanvasItem) {
                // Re-ordering items on the main canvas
                const oldIndex = canvasItems.findIndex(item => item.instanceId === active.id);
                const newIndex = isOverCanvasItem
                    ? canvasItems.findIndex(item => item.instanceId === over.id)
                    : canvasItems.length - 1;

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    setCanvasItems((items) => arrayMove(items, oldIndex, newIndex));
                }
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
                    <ResizablePanel defaultSize={20}>
                        <LeftSidebar activeTab={activeTab} />
                    </ResizablePanel>

                    <ResizableHandle withHandle />


                    <ResizablePanel defaultSize={60}>
                        <Canvas
                            id="canvas-droppable"
                            items={canvasItems}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={20}>
                        <RightSidebar />
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            {/* Visual overlay for dragging outside containers */}
            <DragOverlay>
                {activeField ? (() => {
                    // activeField might be a fieldData object (from sidebar) or a CanvasNode (from canvas)
                    const fieldId = activeField.fieldId || activeField.id;
                    const fieldData = getFieldData(fieldId);

                    if (!fieldData) return null;

                    return (
                        <div className="border-border/60 bg-background flex w-56 items-start gap-3 rounded-lg border px-3 py-2 text-left shadow-xl cursor-grabbing opacity-90">
                            <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                                {fieldData.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium leading-none truncate">{fieldData.label}</div>
                                <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{fieldData.description}</div>
                            </div>
                        </div>
                    );
                })() : null}
            </DragOverlay>

        </DndContext>
    );
}
