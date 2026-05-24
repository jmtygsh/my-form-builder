import { CanvasNode } from "../../../types";
import { getFieldData } from "../../../utils";
import { PreviewFieldRenderer } from "./PreviewFieldRenderer";

interface PreviewGridSlotProps {
    node: CanvasNode;
    colKey: string;
}

function PreviewGridSlot({ node, colKey }: PreviewGridSlotProps) {
    const childNode = node.children?.[colKey];
    if (!childNode) {
        return <div className="min-h-[80px] rounded-lg border border-border/30 bg-muted/5" />;
    }
    return (
        <div className="bg-background w-full h-full flex flex-col justify-center px-4 py-2 rounded-lg">
            <PreviewFieldRenderer
                fieldId={childNode.fieldId}
                inGrid={true}
                props={childNode.props}
            />
        </div>
    );
}

interface PreviewGridRendererProps {
    node: CanvasNode;
}

export function PreviewGridRenderer({ node }: PreviewGridRendererProps) {
    const layoutData = getFieldData(node.fieldId);
    const columns = layoutData && "columns" in layoutData ? layoutData.columns : 1;
    return (
        <div className="flex-1 min-w-0">
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: columns }).map((_, i) => (
                    <PreviewGridSlot key={i} node={node} colKey={`col-${i}`} />
                ))}
            </div>
        </div>
    );
}
