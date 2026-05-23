import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FilePenLine } from "lucide-react";
import { cn } from "~/lib/utils";
import { SortableCanvas } from "../form-tools/middle/SortableCanvas";


// show the canvas 
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
                                <SortableCanvas key={item.instanceId} item={item} />
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
