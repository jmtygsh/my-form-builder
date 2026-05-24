import { FIELD_DATA } from "../../constants";
import { DraggableField } from "./DraggableField";

export function ElementsPanel() {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-sm text-muted-foreground mb-1 uppercase tracking-wider shrink-0">
                Form Elements
            </h2>
            {FIELD_DATA.map((field) => (
                <DraggableField
                    key={field.id}
                    id={`sidebar-${field.id}`}
                    type="sidebar-item"
                    field={field}
                />
            ))}
        </div>
    );
}
