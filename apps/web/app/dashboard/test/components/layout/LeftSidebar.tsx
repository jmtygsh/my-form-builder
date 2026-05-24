import { ElementsPanel } from "../field-palette";
import { LayoutsPanel } from "../field-palette";

interface LeftSidebarProps {
    activeTab: "elements" | "layouts";
}

export function LeftSidebar({ activeTab }: LeftSidebarProps) {
    return (
        <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            {activeTab === "elements" ? <ElementsPanel /> : <LayoutsPanel />}
        </div>
    );
}
