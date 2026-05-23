import { FIELD_DATA } from "../../data";
import { DraggableTool } from "../DraggableTool";

export function ElementsTabContent() {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                Form Elements
            </h2>
            {FIELD_DATA.map((field) => (
                <DraggableTool
                    key={field.id}
                    id={`sidebar-${field.id}`}
                    type="sidebar-item"
                    field={field}
                />
            ))}
        </div>
    );
}
