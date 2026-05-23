// canvas items
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";


export function SortableCanvas({ item }: { item: any }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.instanceId,
        data: {
            type: "canvas-item",
            item,
        },
    });

    const { active, over } = useDndContext();
    const isOver = over?.id === item.instanceId;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item";
    const showDropIndicator = isOver && isSidebarItemDragging;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative"
        >
            {showDropIndicator && (
                <div className="absolute -top-3 left-0 right-0 h-1.5 bg-primary rounded-full z-50 shadow-sm" />
            )}
            <div className="group relative p-5 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors flex gap-3">
                <div className="absolute top-3 right-3 text-muted-foreground shrink-0 rounded-md border bg-muted/30 px-2 py-1 text-[11px] leading-none">
                    {item.label}
                </div>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-2"
                >
                    <GripVertical className="size-5" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                        {item.isRequired && <span className="text-destructive text-sm">*</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 focus-within:opacity-100 ">
                        <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            className="h-7 text-xs font-medium cursor-pointer"
                            onClick={(e) => {
                                // e.stopPropagation();
                                // onDuplicate(element.id);
                            }}
                        >
                            <Copy className="mr-1.5 size-3.5" />
                            Duplicate
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="xs"
                            className="h-7 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent hover:border-destructive/30 border cursor-pointer"
                            onClick={(e) => {
                                // e.stopPropagation();
                                // onDelete(element.id);
                            }}
                        >
                            <Trash2 className="mr-1.5 size-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
