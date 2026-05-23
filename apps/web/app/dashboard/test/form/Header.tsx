import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, Pencil, Save, Settings2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { HeaderTab } from "../form-tools/HeaderTab";
import { LAYOUT_BUTTON_TABS, VIEW_MODE_BUTTON_TABS } from "../data";

interface HeaderProps {
    activeTab: "elements" | "layouts";
    setActiveTab: (tab: "elements" | "layouts") => void;
    viewMode: "edit" | "preview";
    setViewMode: (mode: "edit" | "preview") => void;
    setPickerOpen: (open: boolean) => void;
}


export function Header({ activeTab, setActiveTab, viewMode, setViewMode, setPickerOpen }: HeaderProps) {
    const router = useRouter();

    return (
        <header className="bg-card border-border/60 flex h-14 items-center justify-between border-b px-4">
            <div className="flex min-w-0 items-center gap-3 w-1/3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-accent">
                    <ChevronLeft className="size-5" />
                </Button>
                <HeaderTab
                    tabs={LAYOUT_BUTTON_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            <div className="flex justify-center w-1/3">
                <HeaderTab
                    tabs={VIEW_MODE_BUTTON_TABS}
                    activeTab={viewMode}
                    onTabChange={setViewMode}
                />
            </div>

            <div className="flex items-center justify-end gap-2 w-1/3">
                <Button type="button" size="sm" className="gap-2 cursor-pointer">
                    <Save className="size-4" />
                    Save
                </Button>

                <Button type="button" size="sm" className="gap-2 cursor-pointer" variant="outline">
                    <Save className="size-4" />
                    Publish
                </Button>

                <Button
                    type="button"
                    variant={viewMode === "preview" ? "secondary" : "outline"}
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
                >
                    {viewMode === "edit" ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                </Button>

                {viewMode === "edit" && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setPickerOpen(true)}
                    >
                        <Settings2 className="size-4" />
                    </Button>
                )}
            </div>
        </header>
    );
}
