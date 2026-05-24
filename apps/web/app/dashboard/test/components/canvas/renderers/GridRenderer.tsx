import { CanvasNode } from "../../../types";
import { getFieldData } from "../../../utils";
import { GridSlot } from "./GridSlot";

interface GridRendererProps {
    node: CanvasNode;
    onDelete?: (id: string) => void;
    selectedInstanceId: string | null;
    onSelectField: (id: string) => void;
}

export function GridRenderer({
    node,
    onDelete,
    selectedInstanceId,
    onSelectField
}: GridRendererProps) {
    const layoutData = getFieldData(node.fieldId);
    const columns = layoutData && "columns" in layoutData ? layoutData.columns : 1;

    return (
        <div className="flex-1 min-w-0 mt-4">
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: columns }).map((_, i) => (
                    <GridSlot
                        key={i}
                        node={node}
                        colKey={`col-${i}`}
                        onDelete={onDelete}
                        selectedInstanceId={selectedInstanceId}
                        onSelectField={onSelectField}
                    />
                ))}
            </div>
        </div>
    );
}
