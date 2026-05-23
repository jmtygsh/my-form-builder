import { useDroppable, useDndContext } from "@dnd-kit/core";
import { CanvasNode, getFieldData } from "../../../data";
import { CanvasItemRenderer } from "./CanvasItemRenderer";

function GridSlot({ node, colKey }: { node: CanvasNode; colKey: string }) {
    const slotId = `${node.instanceId}-${colKey}`;
    const childNode = node.children?.[colKey];

    const { setNodeRef } = useDroppable({
        id: slotId,
        disabled: !!childNode, // Disable dropping if slot is occupied
        data: {
            type: "grid-slot",
            containerId: node.instanceId,
            colKey,
        },
    });

    const { active, over } = useDndContext();
    const isOver = over?.id === slotId;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item";

    // Only normal elements can be dropped in a grid slot
    const canDrop = isOver && isSidebarItemDragging && !childNode;

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[80px] rounded-lg border-2 border-dashed flex flex-col transition-colors overflow-hidden ${canDrop ? "border-primary bg-primary/5" : "border-border/60 bg-muted/10 hover:border-border"
                }`}
        >
            {childNode ? (
                <div className="bg-background w-full h-full flex flex-col justify-center px-4 relative group">
                    <CanvasItemRenderer fieldId={childNode.fieldId} inGrid={true} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-xs font-medium text-muted-foreground/60 select-none">
                    Drop element here
                </div>
            )}
        </div>
    );
}

export function GridCanvasItem({ node }: { node: CanvasNode }) {
    const layoutData = getFieldData(node.fieldId);
    const columns = layoutData && "columns" in layoutData ? layoutData.columns : 1;

    return (
        <div className="flex-1 min-w-0 mt-4">
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: columns }).map((_, i) => (
                    <GridSlot key={i} node={node} colKey={`col-${i}`} />
                ))}
            </div>
        </div>
    );
}
