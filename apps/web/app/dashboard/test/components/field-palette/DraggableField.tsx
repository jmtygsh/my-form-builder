import { useDraggable } from "@dnd-kit/core";
import { cn } from "~/lib/utils";

interface DraggableFieldProps {
    id: string;
    type: "sidebar-item" | "sidebar-layout";
    field: any;
}

export function DraggableField({ id, type, field }: DraggableFieldProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: {
            type,
            field,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={cn(
                `border-border/60 hover:bg-accent/40 hover:text-accent-foreground bg-background group flex w-full 
                items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-grab active:cursor-grabbing`,
                isDragging ? "opacity-50" : ""
            )}
        >
            <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted/80">
                {field.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none truncate">{field.label}</div>
                <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{field.description}</div>
            </div>
        </div>
    );
}
