import { getSettingsComponent } from "../../registries";
import { CanvasNode } from "../../types";
import { getFieldData } from "../../utils";

interface RightSidebarProps {
    selectedNode: CanvasNode | null;
    onUpdateProps: (newProps: any) => void;
}

export function RightSidebar({ selectedNode, onUpdateProps }: RightSidebarProps) {
    if (!selectedNode) {
        return (
            <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                    Configuration
                </h2>
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-sm p-4">
                    Select an element on the canvas to configure its settings.
                </div>
            </div>
        );
    }

    const fieldData = getFieldData(selectedNode.fieldId);
    const SettingsComponent = getSettingsComponent(selectedNode.fieldId);

    if (!fieldData || !SettingsComponent) {
        return (
            <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                    Configuration
                </h2>
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-sm p-4">
                    Unsupported field type.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted/10 p-4 flex flex-col gap-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="shrink-0">
                <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider">
                    Configuration
                </h2>
                <h3 className="text-base font-medium">
                    {"label" in fieldData ? fieldData.label : ""}
                </h3>
            </div>

            <div className="flex-1">
                <SettingsComponent
                    props={selectedNode.props || ("defaultProps" in fieldData ? fieldData.defaultProps : {})}
                    onChange={onUpdateProps}
                />
            </div>
        </div>
    );
}
