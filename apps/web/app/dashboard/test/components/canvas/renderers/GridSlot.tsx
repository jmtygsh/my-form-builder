import { useDroppable, useDndContext } from "@dnd-kit/core";
import { CanvasNode } from "../../../types";
import { getFieldData } from "../../../utils";
import { FieldRenderer } from "./FieldRenderer";

interface GridSlotProps {
    node: CanvasNode;
    colKey: string;
    onDelete?: (id: string) => void;
    selectedInstanceId: string | null;
    onSelectField: (id: string) => void;
}

export function GridSlot({
    node,
    colKey,
    onDelete,
    selectedInstanceId,
    onSelectField
}: GridSlotProps) {
    const slotId = `${node.instanceId}-${colKey}`;
    const childNode = node.children?.[colKey];

    const { setNodeRef } = useDroppable({
        id: slotId,
        disabled: !!childNode,
        data: {
            type: "grid-slot",
            containerId: node.instanceId,
            colKey,
        },
    });

    const { active, over } = useDndContext();
    const isOver = over?.id === slotId;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item";

    const canDrop = isOver && isSidebarItemDragging && !childNode;

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[80px] rounded-lg border-2 border-dashed flex flex-col transition-colors overflow-hidden ${canDrop ? "border-primary bg-primary/5" : "border-border/60 bg-muted/10 hover:border-border"
                }`}
        >
            {childNode ? (
                <div
                    className={`bg-background w-full h-full flex flex-col justify-center px-4 relative group cursor-pointer rounded-lg border-2 ${selectedInstanceId === childNode.instanceId ? "border-primary" : "border-transparent"}`}
                    onClick={() => onSelectField(childNode.instanceId)}
                >
                    <FieldRenderer
                        fieldId={childNode.fieldId}
                        instanceId={childNode.instanceId}
                        inGrid={true}
                        onDelete={onDelete}
                        props={childNode.props}
                    />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-xs font-medium text-muted-foreground/60 select-none">
                    Drop element here
                </div>
            )}
        </div>
    );
}
