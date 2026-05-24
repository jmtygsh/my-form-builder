"use client";

import * as React from "react";
import { EditMode, LiveMode } from "./components/modes";
import { Header } from "./components/layout";
import { CanvasNode } from "./types";
import { deleteCanvasItem, duplicateCanvasItem, updateCanvasItemProps } from "./utils";

export default function FormBuilder({ formId }: { formId: string }) {
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
    const [activeTab, setActiveTab] = React.useState<"elements" | "layouts">("elements");
    const [canvasItems, setCanvasItems] = React.useState<CanvasNode[]>([]);
    const [selectedInstanceId, setSelectedInstanceId] = React.useState<string | null>(null);

    // Delete a field in the canvas
    const handleDeleteFn = React.useCallback((instanceId: string) => {
        setCanvasItems((prev) => deleteCanvasItem(prev, instanceId));
        if (selectedInstanceId === instanceId) {
            setSelectedInstanceId(null);
        }
    }, [selectedInstanceId]);

    // Duplicate a field in the canvas
    const handleDuplicateFn = React.useCallback((instanceId: string) => {
        setCanvasItems((prev) => duplicateCanvasItem(prev, instanceId));
    }, []);

    // Update props for a selected field
    const handleUpdatePropsFn = React.useCallback((instanceId: string, newProps: any) => {
        setCanvasItems((prev) => updateCanvasItemProps(prev, instanceId, newProps));
    }, []);


    // Select a field in the canvas
    const handleSelectFieldFn = React.useCallback((instanceId: string) => {
        setSelectedInstanceId(instanceId);
    }, []);

    return (
        <div className="bg-background text-foreground flex h-screen flex-col">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewMode={viewMode}
                setViewMode={setViewMode}
                setPickerOpen={setPickerOpen}
            />

            <div className="flex-1 overflow-hidden w-full">
                {viewMode === "preview" ? (
                    <div className="h-full w-full border-t border-border/60 bg-muted/5">
                        <LiveMode items={canvasItems} />
                    </div>
                ) : (
                    <EditMode
                        activeTab={activeTab}
                        items={canvasItems}
                        setItems={setCanvasItems}
                        selectedInstanceId={selectedInstanceId}
                        onSelectFieldFn={handleSelectFieldFn}
                        onDeleteFn={handleDeleteFn}
                        onDuplicateFn={handleDuplicateFn}
                        onUpdatePropsFn={handleUpdatePropsFn}
                    />
                )}
            </div>
        </div>
    );
}
