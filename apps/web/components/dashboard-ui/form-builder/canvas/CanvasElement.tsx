import * as React from "react";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { safeLabelForElement, typeLabel } from "../utils";
import type { BuilderElement, BuilderElementId } from "../types";

export const CanvasElement = React.memo(function CanvasElement({
    element,
    selected,
    onSelect,
    onDuplicate,
    onDelete,
}: {
    element: BuilderElement;
    selected: boolean;
    onSelect: (id: BuilderElementId) => void;
    onDuplicate: (id: BuilderElementId) => void;
    onDelete: (id: BuilderElementId) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: element.id,
        data: {
            type: "canvas-element",
            element,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 1 : 1,
    };

    const kindBadge =
        element.kind === "field"
            ? typeLabel(element.type)
            : element.kind === "section"
                ? "Section"
                : "Page Break";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "border-border/60 bg-background group relative flex w-full gap-3 rounded-xl border p-3 shadow-xs transition-all cursor-pointer",
                selected ? "ring-primary ring-2 ring-offset-2 ring-offset-background z-10" : "hover:border-border hover:shadow-sm"
            )}
            onClick={() => onSelect(element.id)}
        >
            <div
                {...attributes}
                {...listeners}
                className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted/10 transition-colors cursor-grab active:cursor-grabbing"
                aria-label="Drag to reorder"
            >
                <GripVertical className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                            {safeLabelForElement(element)}
                            {element.kind === "field" && element.required && (
                                <span className="text-destructive ml-1">*</span>
                            )}
                        </div>
                        <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                            {element.kind === "field"
                                ? element.helperText || " "
                                : element.kind === "section"
                                    ? element.description || " "
                                    : "Starts a new step"}
                        </div>
                    </div>

                    <div className="text-muted-foreground shrink-0 rounded-md border px-2 py-1 text-[11px] leading-none">
                        {kindBadge}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 focus-within:opacity-100 ">
                    <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        className="h-7 text-xs font-medium cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(element.id);
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
                            e.stopPropagation();
                            onDelete(element.id);
                        }}
                    >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
});
