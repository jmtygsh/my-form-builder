import { ReactNode } from "react";
import { Button } from "~/components/ui/button";

export interface TabOption<T extends string> {
    id: T;
    label: string;
    icon: ReactNode;
}

interface HeaderTabProps<T extends string> {
    tabs: TabOption<T>[];
    activeTab: T;
    onTabChange: (tabId: T) => void;
}

export function HeaderTab<T extends string>({ tabs, activeTab, onTabChange }: HeaderTabProps<T>) {

    return (
        <div className="hidden lg:flex items-center rounded-md border border-border/60 bg-muted/20 p-0.5">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    type="button"
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-3 text-xs shadow-none"
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon}
                    <span className="ml-1.5">{tab.label}</span>
                </Button>
            ))}
        </div>
    );
}
