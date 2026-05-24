import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FilePenLine } from "lucide-react";
import { cn } from "~/lib/utils";
import { SortableCanvasItem } from "../canvas";
import { CanvasNode } from "../../types";

interface MiddleCanvasProps {
    id: string;
    items: CanvasNode[];
    onDelete?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    selectedInstanceId: string | null;
    onSelectField: (id: string) => void;
}

export default function MiddleCanvas({
    id,
    items,
    onDelete,
    onDuplicate,
    selectedInstanceId,
    onSelectField
}: MiddleCanvasProps) {
    const { setNodeRef } = useDroppable({ id });
    const { active, over } = useDndContext();

    const isEmpty = items.length === 0;
    const isOverCanvas = over?.id === id;
    const isSidebarItemDragging = active?.data?.current?.type === "sidebar-item" || active?.data?.current?.type === "sidebar-layout";

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "h-full overflow-y-auto p-4 md:p-8  flex flex-col transition-colors [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
            )}
        >

            <div className="mb-10 w-full  mx-auto">

                <h2 className="text-lg font-semibold text-center mb-4 ">My Blank Canvas ✍️</h2>
                <h3 className="border-b-2 border-dashed border-border/60"></h3>
            </div>


            <div className="max-w-2xl mx-auto  w-full flex flex-col pb-12">
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
                                <SortableCanvasItem
                                    key={item.instanceId}
                                    node={item}
                                    onDelete={onDelete}
                                    onDuplicate={onDuplicate}
                                    selectedInstanceId={selectedInstanceId}
                                    onSelectField={onSelectField}
                                />
                            ))}
                            {isOverCanvas && isSidebarItemDragging && (
                                <div className="h-1.5 w-full bg-primary rounded-full mt-2 opacity-80" />
                            )}
                        </div>
                    </SortableContext>
                )}
            </div>


            <div className="mt-20 w-full mx-auto">
                <div className="flex items-center text-base mt-4 text-muted-foreground">
                    <div className="flex-1 border-t-2 border-dashed border-border/60"></div>
                    <span className="mx-4">End of Form</span>
                    <div className="flex-1 border-t-2 border-dashed border-border/60"></div>
                </div>
            </div>
        </div>
    );
}
