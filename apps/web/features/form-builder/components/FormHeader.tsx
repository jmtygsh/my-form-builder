import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Rows3, LayoutTemplate, Loader2 } from "lucide-react";
import { useBuilderStore } from "../store/useBuilderStore";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
    SUBMIT_BUTTON,
    VIEW_MODE_BUTTON,
    type TabOption
} from "~/features/form-builder/constants/data";

interface HeaderProps {
    viewMode: "edit" | "preview";
    setViewMode: React.Dispatch<React.SetStateAction<"edit" | "preview">>;
    onSaveFn: () => void,
    onPublishFn: () => void;
}

export function FormHeader({
    viewMode,
    setViewMode,
    onSaveFn,
    onPublishFn
}: HeaderProps) {
    const router = useRouter();
    const { selectRow, selectCanvas, form, selectedRowId, selectedCanvas } = useBuilderStore();




    return (
        <header className="bg-card border-border/60 flex h-14 items-center justify-between border-b px-4">
            <div className="flex w-1/3 min-w-0 items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="hover:bg-accent"
                >
                    <ChevronLeft className="size-3" />
                </Button>

                <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-2">
                    <Button
                        variant={selectedRowId ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 text-xs px-2 shadow-none"
                        onClick={() => {
                            // If a row is already selected, keep it, otherwise select the first row or fallback
                            if (!selectedRowId && form.rows.length > 0) {
                                const firstRow = form.rows[0];
                                if (firstRow) {
                                    selectRow(firstRow.id);
                                }
                            } else if (!selectedRowId) {
                                // If no rows exist, just trigger row selection (it will show empty state)
                                selectRow("empty");
                            }
                        }}
                    >
                        <Rows3 className="w-3.5 h-3.5 mr-1.5" />
                        Row Setting
                    </Button>

                    <Button
                        variant={selectedCanvas ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 text-xs px-2 shadow-none"
                        onClick={() => selectCanvas()}
                    >
                        <LayoutTemplate className="w-3.5 h-3.5 mr-1.5" />
                        Canvas Setting
                    </Button>
                </div>
            </div>

            <div className="flex w-1/3 items-center justify-center gap-2">
                <HeaderTabs
                    tabs={VIEW_MODE_BUTTON}
                    activeTab={viewMode}
                    onTabChange={setViewMode}
                />
            </div>

            <div className="flex w-1/3 items-center justify-end gap-2">
                <HeaderTabs
                    tabs={SUBMIT_BUTTON}
                    onClick={(tab) => {
                        if (tab.id === "save") {
                            onSaveFn();
                        } else {
                            onPublishFn();
                        }
                    }}
                />
            </div>
        </header>
    );
}

type HeaderTabsProps<T extends string> = {
    tabs: TabOption<T>[];
    activeTab?: T;
    onTabChange?: (tab: T) => void;
    onClick?: (tab: TabOption<T>) => void;
};

function HeaderTabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    onClick
}: HeaderTabsProps<T>) {
    return (
        <div className="hidden items-center rounded-md border border-border/60 bg-muted/20 p-0.5 lg:flex">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    type="button"
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 cursor-pointer px-3 text-xs shadow-none"
                    onClick={() => {
                        if (onTabChange) {
                            onTabChange(tab.id);
                        }

                        if (onClick) {
                            onClick(tab);
                        }
                    }}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </Button>
            ))}
        </div>
    );
}
