import { LAYOUT_DATA } from "../../constants";
import { DraggableField } from "./DraggableField";

export function LayoutsPanel() {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                Layout Grids
            </h2>
            {LAYOUT_DATA.map((layout) => (
                <DraggableField
                    key={layout.id}
                    id={`sidebar-layout-${layout.id}`}
                    type="sidebar-layout"
                    field={layout}
                />
            ))}
        </div>
    );
}
