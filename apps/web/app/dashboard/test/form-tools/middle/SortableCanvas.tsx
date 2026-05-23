import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CanvasNode, getFieldData } from "../../data";
import { CanvasItemRenderer } from "./canvas-render-options/CanvasItemRenderer";
import { GridCanvasItem } from "./canvas-render-options/GridCanvasItem";

export function SortableCanvas({ node }: { node: CanvasNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: node.instanceId,
        data: {
            type: "canvas-item",
            node,
        },
    });

    const { active, over } = useDndContext();
    const isOver = over?.id === node.instanceId;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item" || active?.data?.current?.type === "sidebar-layout";
    const showDropIndicator = isOver && isSidebarItemDragging;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const fieldData = getFieldData(node.fieldId);

    return (
        <div ref={setNodeRef} style={style} className="relative w-full">
            {showDropIndicator && (
                <div className="absolute -top-3 left-0 right-0 h-1.5 bg-primary rounded-full z-50 shadow-sm" />
            )}

            <div className="group relative border rounded-xl bg-card shadow-sm hover:border-primary/40 transition-colors flex overflow-hidden">

                {/* Drag Handle Area */}
                <div
                    {...attributes}
                    {...listeners}
                    className="w-10 shrink-0 bg-muted/30 border-r flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
                >
                    <GripVertical className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </div>

                {/* Top Right Label Badge */}
                {node.type !== "sidebar-layout" && (
                    <div className="absolute top-3 right-3 z-10 text-muted-foreground shrink-0 rounded-full border bg-background/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {fieldData?.label}
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 p-5 min-w-0">
                    {node.type === "sidebar-layout" ? (
                        <div className="relative">
                            {/* Layout specific top right badge */}
                            <div className="absolute -top-7 right-0 text-muted-foreground shrink-0 rounded-t-lg border border-b-0 bg-muted/30 px-3 py-1 text-[10px] font-medium leading-none flex items-center gap-1.5">
                                {fieldData?.icon && <span className="size-3">{fieldData.icon}</span>}
                                {fieldData?.label}
                            </div>
                            <GridCanvasItem node={node} />
                        </div>
                    ) : (
                        <CanvasItemRenderer fieldId={node.fieldId} />
                    )}
                </div>
            </div>
        </div>
    );
}
