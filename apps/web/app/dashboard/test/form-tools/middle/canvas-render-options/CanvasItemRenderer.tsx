import { Copy, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getFieldData } from "../../../data";

export function CanvasItemRenderer({ fieldId, inGrid = false }: { fieldId: string, inGrid?: boolean }) {
    const itemData = getFieldData(fieldId);

    if (!itemData) return <div className="p-4 text-red-500">Field not found</div>;

    return (
        <div className="flex-1 min-w-0 flex flex-col justify-center w-full">
            {/* Header: Icon, Label and Required Asterisk */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-primary">{itemData.icon}</span>
                <span className="font-medium text-sm text-foreground">{itemData.label}</span>
                {"isRequired" in itemData && itemData.isRequired && (
                    <span className="text-destructive text-sm leading-none">*</span>
                )}
            </div>

            {/* Action Buttons */}
            {!inGrid && (
                <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="secondary" size="icon" className="h-8 w-8 cursor-pointer bg-muted hover:bg-muted/80 text-foreground rounded-md">
                        <Copy className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 bg-destructive/5 text-destructive rounded-md cursor-pointer">
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
