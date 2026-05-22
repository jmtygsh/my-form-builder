import * as React from "react";
import { Copy, GripVertical, Trash2 } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { FIELD_TEMPLATES, safeLabelForElement, typeLabel } from "./utils";
import type { BuilderElement, BuilderElementId, ElementTemplate } from "./types";

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
    return (
        <div
            className={cn(
                "border-border/60 hover:bg-accent/40 hover:text-accent-foreground bg-background group flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer"
            )}
            onClick={() => onPick(template)}
        >
            <div
                className="bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted/80"
            >
                <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none truncate">{title}</div>
                <div className="text-muted-foreground mt-1.5 text-xs leading-snug line-clamp-2">{description}</div>
            </div>
        </div>
    );
}

export const ElementCard = React.memo(function ElementCard({
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
    const kindBadge =
        element.kind === "field"
            ? typeLabel(element.type)
            : element.kind === "section"
                ? "Section"
                : "Page Break";

    return (
        <div
            className={cn(
                "border-border/60 bg-background group relative flex w-full gap-3 rounded-xl border p-3 shadow-xs transition-all cursor-pointer",
                selected ? "ring-primary ring-2 ring-offset-2 ring-offset-background z-10" : "hover:border-border hover:shadow-sm"
            )}
            onClick={() => onSelect(element.id)}
        >
            <div
                className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted/10 transition-colors"
                aria-label="Drag to reorder (disabled)"
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

                <div className="mt-4 flex flex-wrap items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        className="h-7 text-xs font-medium"
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
                        className="h-7 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent hover:border-destructive/30 border"
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

export function FieldPickerDialog({
    open,
    onOpenChange,
    onPick,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPick: (template: ElementTemplate) => void;
}) {
    const [query, setQuery] = React.useState("");

    const items = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return FIELD_TEMPLATES;
        return FIELD_TEMPLATES.filter((i) => {
            if (i.title.toLowerCase().includes(q)) return true;
            if (i.description.toLowerCase().includes(q)) return true;
            return i.keywords.some((k) => k.includes(q));
        });
    }, [query]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add a field</DialogTitle>
                    <DialogDescription>Select a field type to add to your form.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search field types..."
                    />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {items.map((item) => (
                            <PaletteItem
                                key={`${item.title}:${item.template.kind}:${item.template.kind === "field" ? item.template.type : "x"}`}
                                template={item.template}
                                title={item.title}
                                description={item.description}
                                icon={item.icon}
                                onPick={(t) => {
                                    onPick(t);
                                    onOpenChange(false);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}