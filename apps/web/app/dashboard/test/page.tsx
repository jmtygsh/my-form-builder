"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ClipboardCopy,
    Eye,
    Pencil,
    Plus,
    Save,
    Settings2,
    GripVertical,
} from "lucide-react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable"
import { FieldPickerDialog } from "~/components/dashboard-ui/form-builder/canvas/FieldPickerDialog";
import EditMode from "./EditMode";
import LiveMode from "./LiveMode";


export default function FormBuilder({ formId }: { formId: string }) {
    const router = useRouter();


    // form id required later 
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");


    return (
        <div className="bg-background text-foreground flex h-screen flex-col">
            <header className="bg-card border-border/60 flex h-14 items-center justify-between border-b px-4">
                <div className="flex min-w-0 items-center gap-3 w-1/3">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-accent">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <Input
                        value=""

                        className="bg-transparent px-2 text-base border border-border/60 rounded-md font-semibold hover:border-border focus-visible:ring-1"
                    />
                </div>

                <div className="flex justify-center w-1/3">
                    <div className="hidden lg:flex items-center rounded-md border border-border/60 bg-muted/20 p-0.5">
                        <Button
                            type="button"
                            variant={viewMode === "edit" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 px-3 text-xs shadow-none"
                            onClick={() => setViewMode("edit")}
                        >
                            <Pencil className="mr-1.5 size-3.5" />
                            Edit
                        </Button>
                        <Button
                            type="button"
                            variant={viewMode === "preview" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 px-3 text-xs shadow-none"
                            onClick={() => setViewMode("preview")}
                        >
                            <Eye className="mr-1.5 size-3.5" />
                            Preview
                        </Button>
                    </div>
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
                        // disabled={}
                        >
                            <Settings2 className="size-4" />
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-hidden w-full">
                {viewMode === "preview" ? (
                    <div className="h-full w-full border-t border-border/60 bg-muted/5">
                        <LiveMode />
                    </div>
                ) : (
                    <EditMode />
                )}
            </div>
        </div>
    );
}