import { ElementsTabContent } from "../form-tools/left-side/ElementsTabContent";
import { LayoutsTabContent } from "../form-tools/left-side/LayoutsTabContent";

interface SidebarWrapperProps {
    activeTab: "elements" | "layouts";
}

export function LeftSidebar({ activeTab }: SidebarWrapperProps) {
    return (
        <div className="bg-muted/10 p-4 flex flex-col gap-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            {activeTab === "elements" ? <ElementsTabContent /> : <LayoutsTabContent />}
        </div>
    );
}
