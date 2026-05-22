import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/lib/utils";
import { FIELD_TEMPLATES } from "../utils";
import type { ElementTemplate } from "../types";

export function PaletteItem({
    template,
    title,
    description,
    icon: Icon,
    onPick,
}: {
    template: ElementTemplate;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onPick: (template: ElementTemplate) => void;
}) {
    const dragId = `palette-${template.kind}-${template.kind === "field" ? template.type : "x"}`;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: dragId,
        data: {
            type: "palette-item",
            template,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "border-border/60 hover:bg-accent/40 hover:text-accent-foreground bg-background group flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-grab active:cursor-grabbing"
            )}
            onClick={() => {
                if (isDragging) return;
                onPick(template);
            }}
        >
            <div className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted/80">
                <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none truncate">{title}</div>
                <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{description}</div>
            </div>
        </div>
    );
}

export function PaletteSidebar({ onPick }: { onPick: (template: ElementTemplate) => void }) {
    return (
        <div className="flex flex-col gap-2">
            {FIELD_TEMPLATES.map((t) => (
                <PaletteItem
                    key={`${t.title}:${t.template.kind}:${t.template.kind === "field" ? t.template.type : "x"}`}
                    template={t.template}
                    title={t.title}
                    description={t.description}
                    icon={t.icon}
                    onPick={onPick}
                />
            ))}
        </div>
    );
}
