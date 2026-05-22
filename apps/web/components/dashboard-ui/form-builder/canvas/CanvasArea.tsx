import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FilePenLine } from "lucide-react";
import { cn } from "~/lib/utils";

import { CanvasElement } from "./CanvasElement";
import type { BuilderElement, BuilderElementId } from "../types";

/**
 * ============================================================================
 * CANVAS AREA (MIDDLE PANEL)
 * ============================================================================
 * 
 * This is the main workspace where users actually see and build their form.
 * 
 * Key Responsibilities:
 * - Acts as a "Drop Zone": It listens for items dragged from the left menu.
 * - Displays Fields: It loops through all the fields the user has added and
 *   draws them on the screen in order.
 * - Handles Re-ordering: It wraps the list of fields in a special "SortableContext"
 *   which allows users to drag fields up and down to change their order.
 * ============================================================================
 */
export function CanvasArea({
    elements,
    selectedId,
    onSelect,
    onDuplicate,
    onDelete
}: {
    elements: BuilderElement[];
    selectedId: BuilderElementId | null;
    onSelect: (id: BuilderElementId) => void;
    onDuplicate: (id: BuilderElementId) => void;
    onDelete: (id: BuilderElementId) => void;
    onOpenPicker: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas-droppable",
        data: { type: "canvas-area" },
    });

    const isEmpty = elements.length === 0;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 overflow-y-auto p-4 md:p-8 flex flex-col transition-colors",
                isEmpty && "justify-center",
                isOver && "bg-primary/5"
            )}
        >
            <div className="mx-auto max-w-xl w-full">
                {isEmpty ? (
                    <div
                        className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-card/50 p-12 text-center transition-colors hover:bg-card/80"
                    >
                        <div className="flex size-10 items-center justify-center rounded-full border shadow-sm">
                            <FilePenLine className="text-muted-foreground size-4" />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-foreground">Start building your form</div>
                            <div className="mt-1 text-sm text-muted-foreground">Drag & drop fields to add them to your form.</div>
                        </div>
                    </div>
                ) : (
                    <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-4 pb-32">
                            {elements.map((el) => (
                                <CanvasElement
                                    key={el.id}
                                    element={el}
                                    selected={selectedId === el.id}
                                    onSelect={onSelect}
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
}
