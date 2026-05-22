import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import { FIELD_TEMPLATES } from "../utils";
import type { ElementTemplate } from "../types";
import { PaletteItem } from "./PaletteSidebar";

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
