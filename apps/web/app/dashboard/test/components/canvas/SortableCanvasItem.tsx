import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CanvasNode } from "../../types";
import { getFieldData } from "../../utils";
import { FieldRenderer } from "./renderers/FieldRenderer";
import { GridRenderer } from "./renderers/GridRenderer";

export function SortableCanvasItem({
    node,
    onDelete,
    onDuplicate,
    selectedInstanceId,
    onSelectField
}: {
    node: CanvasNode;
    onDelete?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    selectedInstanceId: string | null;
    onSelectField: (id: string) => void;
}) {
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

            <div
                className={`group relative transition-colors flex overflow-visible cursor-pointer rounded-lg border-2 ${selectedInstanceId === node.instanceId ? "border-primary" : "border-transparent"}`}
                onClick={() => onSelectField(node.instanceId)}
            >

                {/* Drag Handle Area */}
                <div
                    {...attributes}
                    {...listeners}
                    className="w-8 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="size-4 text-muted-foreground/50 hover:text-foreground transition-colors" />
                </div>

                {/* Top Right Label Badge */}
                {node.type !== "sidebar-layout" && (
                    <div className="absolute -top-3 right-4 z-10 text-muted-foreground shrink-0 rounded-full border bg-background px-3 py-1 text-[10px] font-medium leading-none opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        {fieldData?.label}
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 py-4 pr-6 pl-2 min-w-0">
                    {node.type === "sidebar-layout" ? (
                        <div className="relative">
                            {/* Layout specific top right badge */}
                            <div className="absolute -top-7 right-0 text-muted-foreground shrink-0 rounded-t-lg border border-b-0 bg-muted/30 px-3 py-1 text-[10px] font-medium leading-none flex items-center gap-1.5">
                                {fieldData?.icon && <span className="size-3">{fieldData.icon}</span>}
                                {fieldData?.label}

                                <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onDuplicate?.(node.instanceId); }}
                                        className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onDelete?.(node.instanceId); }}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer p-0.5 rounded-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                            <GridRenderer
                                node={node}
                                onDelete={onDelete}
                                selectedInstanceId={selectedInstanceId}
                                onSelectField={onSelectField}
                            />
                        </div>
                    ) : (
                        <FieldRenderer
                            fieldId={node.fieldId}
                            instanceId={node.instanceId}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                            props={node.props}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
