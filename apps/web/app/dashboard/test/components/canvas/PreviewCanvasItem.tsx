import { CanvasNode } from "../../types";
import { PreviewFieldRenderer } from "./renderers/PreviewFieldRenderer";
import { PreviewGridRenderer } from "./renderers/PreviewGridRenderer";

interface PreviewCanvasItemProps {
    node: CanvasNode;
}

export function PreviewCanvasItem({ node }: PreviewCanvasItemProps) {
    return (
        <div className="relative w-full">
            <div className="group relative transition-colors flex overflow-visible rounded-lg">
                <div className="flex-1 py-4 px-6 min-w-0">
                    {node.type === "sidebar-layout" ? (
                        <PreviewGridRenderer node={node} />
                    ) : (
                        <PreviewFieldRenderer
                            fieldId={node.fieldId}
                            props={node.props}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
