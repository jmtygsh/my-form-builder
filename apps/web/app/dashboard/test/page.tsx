"use client";

import * as React from "react";
import EditMode from "./form-mode/EditMode";
import LiveMode from "./form-mode/LiveMode";
import { Header } from "./form/Header";

export default function FormBuilder({ formId }: { formId: string }) {
    // form id required later 
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
    const [activeTab, setActiveTab] = React.useState<"elements" | "layouts">("elements");

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
                        <LiveMode />
                    </div>
                ) : (
                    <EditMode activeTab={activeTab} />
                )}
            </div>
        </div>
    );
}
