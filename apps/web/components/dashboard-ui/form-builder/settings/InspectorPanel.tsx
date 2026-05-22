import * as React from "react";
import { Copy, Settings2, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { safeLabelForElement, typeLabel } from "../utils";

import type { BuilderAction, BuilderElement, BuilderState } from "../types";
import { FormSettings } from "./FormSettings";
import { FieldSettings } from "./FieldSettings";

/**
 * ============================================================================
 * INSPECTOR PANEL (RIGHT PANEL)
 * ============================================================================
 * 
 * This is the settings menu that appears when a user clicks on a field in 
 * the middle workspace. 
 * 
 * Key Responsibilities:
 * - Edit Field Settings: Lets users change the label, description, and rules
 *   (like "is required") for the specific field they selected.
 * - Edit Form Settings: Has a separate tab to change global settings for the 
 *   entire form (like its overall title or what happens after someone submits it).
 * - Actions: Provides the "Duplicate" and "Delete" buttons for the selected field.
 * ============================================================================
 */
export function InspectorPanel({
    selected,
    state,
    dispatch,
    onDuplicate,
    onDelete,
}: {
    selected: BuilderElement | undefined;
    state: BuilderState;
    dispatch: React.Dispatch<BuilderAction>;
    onDuplicate: () => void;
    onDelete: () => void;
}) {
    if (!selected) {
        return (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8 text-center bg-muted/10">
                <div className="bg-background flex size-12 items-center justify-center rounded-full border shadow-sm mb-4">
                    <Settings2 className="size-5 text-muted-foreground" />
                </div>
                <div className="text-base font-medium text-foreground">No element selected</div>
                <div className="mt-1 text-sm">Select an element to edit its settings.</div>
            </div>
        );
    }

    const headerTitle =
        selected.kind === "field"
            ? typeLabel(selected.type)
            : selected.kind === "section"
                ? "Section"
                : "Page Break";

    const canShowFieldTab = selected.kind === "field";

    return (
        <div className="flex h-full flex-col">
            <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{headerTitle}</div>
                    <div className="text-muted-foreground mt-1 truncate text-xs">{safeLabelForElement(selected)}</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon-sm" onClick={onDuplicate}>
                        <Copy className="size-4" />
                    </Button>
                    <Button type="button" variant="destructive" size="icon-sm" onClick={onDelete}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <Tabs
                    value={state.inspectorTab}
                    onValueChange={(v) => dispatch({ type: "inspector.setTab", tab: v as BuilderState["inspectorTab"] })}
                    className="h-full"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="field" disabled={!canShowFieldTab} className="flex-1">
                            Field
                        </TabsTrigger>
                        <TabsTrigger value="form" className="flex-1">
                            Form
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="field" className="mt-4">
                        <FieldSettings
                            element={selected}
                            onUpdate={(patch) => dispatch({ type: "element.update", id: selected.id, patch })}
                        />
                    </TabsContent>

                    <TabsContent value="form" className="mt-4">
                        <FormSettings
                            config={state.config}
                            onUpdateTitle={(title) => dispatch({ type: "config.setTitle", title })}
                            onUpdateDescription={(description) => dispatch({ type: "config.setDescription", description })}
                            onUpdateSubmission={(submission) => dispatch({ type: "config.setSubmission", submission })}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
