import { useState } from "react";
import { DndContext, pointerWithin, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable";
import { arrayMove } from "@dnd-kit/sortable";
import { LeftSidebar, RightSidebar, MiddleCanvas } from "../layout";
import { CanvasNode } from "../../types";
import { FIELD_DATA } from "../../constants";
import {
    createCanvasNode,
    findCanvasNode,
    getFieldData,
} from "../../utils";

interface EditModeProps {
    activeTab: "elements" | "layouts";
    items: CanvasNode[];
    setItems: (items: CanvasNode[] | ((prev: CanvasNode[]) => CanvasNode[])) => void;
    selectedInstanceId: string | null;
    onSelectFieldFn: (id: string) => void;
    onDeleteFn: (id: string) => void;
    onDuplicateFn: (id: string) => void;
    onUpdatePropsFn: (id: string, newProps: any) => void;
}

export default function EditMode({
    activeTab,
    items,
    setItems,
    selectedInstanceId,
    onSelectFieldFn, // Select a field in the canvas
    onDeleteFn, // Delete a field in the canvas
    onDuplicateFn, // Duplicate a field in the canvas
    onUpdatePropsFn // Update props for a selected field
}: EditModeProps) {
    const [activeField, setActiveField] = useState<any>(null);

    const selectedNode = selectedInstanceId ? findCanvasNode(items, selectedInstanceId) : null;

    // Update props for a selected field
    const handleUpdatePropsForSelected = (newProps: any) => {
        if (!selectedInstanceId) return;
        onUpdatePropsFn(selectedInstanceId, newProps);
    };

    // Handle drag start
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        if (active.data.current?.type === "sidebar-item" || active.data.current?.type === "sidebar-layout") {
            setActiveField(active.data.current.field);
        } else if (active.data.current?.type === "canvas-item") {
            setActiveField(active.data.current.node);
        }
    }

    // Handle drag end
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

        if (isOverGridSlot && isSidebarItem) {
            const fieldData = active.data.current?.field;
            const containerId = over.data.current?.containerId;
            const colKey = over.data.current?.colKey;
            const fieldDef = FIELD_DATA.find((f: any) => f.id === fieldData.id);
            if (!fieldDef) return;

            const newNode = createCanvasNode(fieldDef as any);

            setItems((prev) => prev.map((node) => {
                if (node.instanceId === containerId) {
                    return {
                        ...node,
                        children: {
                            ...node.children,
                            [colKey]: newNode,
                        },
                    };
                }
                return node;
            }));
            return;
        }

        if (isOverCanvasArea || isOverCanvasItem) {
            if (isSidebarItem || isSidebarLayout) {
                const fieldData = active.data.current?.field;
                let newNode: CanvasNode;

                if (isSidebarLayout) {
                    newNode = {
                        instanceId: `${fieldData.id}-${Date.now()}`,
                        fieldId: fieldData.id,
                        type: "sidebar-layout",
                        children: {},
                    };
                } else {
                    const fieldDef = FIELD_DATA.find((f: any) => f.id === fieldData.id);
                    if (!fieldDef) return;
                    newNode = createCanvasNode(fieldDef as any);
                }

                setItems((prev) => {
                    if (isOverCanvasItem) {
                        const overIndex = prev.findIndex((item) => item.instanceId === over.id);
                        if (overIndex !== -1) {
                            const newItems = [...prev];
                            newItems.splice(overIndex, 0, newNode);
                            return newItems;
                        }
                    }
                    return [...prev, newNode];
                });
            } else if (isCanvasItem) {
                const oldIndex = items.findIndex((item) => item.instanceId === active.id);
                const newIndex = isOverCanvasItem
                    ? items.findIndex((item) => item.instanceId === over.id)
                    : items.length - 1;

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    setItems((prevItems) => arrayMove(prevItems, oldIndex, newIndex));
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
                <ResizablePanelGroup orientation="horizontal" className="rounded-lg">
                    <ResizablePanel defaultSize={20}>
                        <LeftSidebar activeTab={activeTab} />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={60}>
                        <MiddleCanvas
                            id="canvas-droppable"
                            items={items}
                            onDelete={onDeleteFn}
                            onDuplicate={onDuplicateFn}
                            selectedInstanceId={selectedInstanceId}
                            onSelectField={onSelectFieldFn}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={20}>
                        <RightSidebar
                            selectedNode={selectedNode}
                            onUpdateProps={handleUpdatePropsForSelected}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            <DragOverlay>
                {activeField ? (() => {
                    const fieldId = activeField.fieldId || activeField.id;
                    const fieldData = getFieldData(fieldId);

                    if (!fieldData) return null;

                    return (
                        <div className="border-border/60 bg-background flex w-56 items-start gap-3 rounded-lg border px-3 py-2 text-left shadow-xl cursor-grabbing opacity-90">
                            <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                                {"icon" in fieldData ? fieldData.icon : null}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium leading-none truncate">
                                    {"label" in fieldData ? fieldData.label : ""}
                                </div>
                                <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">
                                    {"description" in fieldData ? fieldData.description : ""}
                                </div>
                            </div>
                        </div>
                    );
                })() : null}
            </DragOverlay>
        </DndContext>
    );
}
