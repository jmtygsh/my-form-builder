import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FilePenLine, GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";

function SortableCanvasItem({ item }: { item: any }) {
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
            <div className="group p-5 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors flex gap-3">
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

                    {/* Placeholder for the actual input */}
                    <div className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-sm">
                        {item.placeholder || `Enter ${item.label?.toLowerCase()}...`}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Canvas({ id, items }: { id: string; items: any[] }) {
    const { setNodeRef } = useDroppable({ id });
    const { active, over } = useDndContext();

    const isEmpty = items.length === 0;
    const isOverCanvas = over?.id === id;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item";

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "h-full overflow-y-auto p-4 md:p-8 flex flex-col transition-colors [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
                isEmpty && "justify-center",
            )}
        >
            <div className="mx-auto max-w-xl w-full flex flex-col pb-12">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-card/50 p-12 text-center transition-colors hover:bg-card/80">
                        <div className="flex size-10 items-center justify-center rounded-full border shadow-sm">
                            <FilePenLine className="text-muted-foreground size-4" />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-foreground">Start building your form</div>
                            <div className="mt-1 text-sm text-muted-foreground">Drag & drop fields to add them to your form.</div>
                        </div>
                    </div>
                ) : (
                    <SortableContext items={items.map(i => i.instanceId)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <SortableCanvasItem key={item.instanceId} item={item} />
                            ))}
                            {isOverCanvas && isSidebarItemDragging && (
                                <div className="h-1.5 w-full bg-primary rounded-full mt-2 opacity-80" />
                            )}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
}
