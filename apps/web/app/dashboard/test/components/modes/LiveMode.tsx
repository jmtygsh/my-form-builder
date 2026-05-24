import { CanvasNode } from "../../types";
import { PreviewCanvasItem } from "../canvas";

interface LiveModeProps {
    items: CanvasNode[];
}

export default function LiveMode({ items }: LiveModeProps) {
    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="mb-10 w-full mx-auto">
                <h2 className="text-lg font-semibold text-center mb-4">My Form 📝</h2>
                <h3 className="border-b-2 border-dashed border-border/60"></h3>
            </div>

            <div className="max-w-2xl mx-auto w-full flex flex-col pb-12">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-card/50 p-12 text-center">
                        <div className="text-muted-foreground">Add some fields in Edit mode to see them here!</div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <PreviewCanvasItem key={item.instanceId} node={item} />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-20 w-full mx-auto">
                <div className="flex items-center text-base mt-4 text-muted-foreground">
                    <div className="flex-1 border-t-2 border-dashed border-border/60"></div>
                    <span className="mx-4">End of Form</span>
                    <div className="flex-1 border-t-2 border-dashed border-border/60"></div>
                </div>
            </div>
        </div>
    );
}
