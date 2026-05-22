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

import type { BuilderElementId, BuilderState, ElementTemplate } from "./form-builder/types";
import {
    builderReducer,
    createId,
    createElementFromTemplate,
    splitIntoSteps,
    getClipboardTextForBuilder,
    FIELD_TEMPLATES,
} from "./form-builder/utils";

import { PaletteSidebar, PaletteItem } from "./form-builder/canvas/PaletteSidebar";
import { CanvasArea } from "./form-builder/canvas/CanvasArea";
import { CanvasElement } from "./form-builder/canvas/CanvasElement";
import { InspectorPanel } from "./form-builder/settings/InspectorPanel";
import { LivePreview } from "./form-builder/preview/LivePreview";
import { FieldPickerDialog } from "./form-builder/canvas/FieldPickerDialog";

/**
 * ============================================================================
 * FORM BUILDER (MAIN COMPONENT)
 * ============================================================================
 * 
 * Think of this file as the "Boss" or "Command Center" of the form builder.
 * It manages the entire screen and connects three main panels together:
 * 
 * 1. LEFT PANEL (PaletteSidebar): 
 *    The menu of available fields (Text, Email, Dropdown, etc.). 
 *    Users can drag these onto the middle board to add them to the form.
 * 
 * 2. MIDDLE PANEL (CanvasArea): 
 *    The main workspace where the form is actually built. 
 *    Users can drag to re-order fields, or click on a field to edit it.
 * 
 * 3. RIGHT PANEL (InspectorPanel): 
 *    The settings menu. When a user clicks a field in the middle, this 
 *    panel lets them change its label, make it required, or add choices.
 * 
 * HOW IT WORKS BEHIND THE SCENES:
 * - State Management: It uses a "reducer" to keep track of the form's data: 
 *   the title, the list of added fields, and which field is currently selected.
 * - Drag & Drop: Powered by a library called "dnd-kit", which detects when you 
 *   pick something up from the left menu and drop it in the middle.
 * - Preview Mode: Clicking "Preview" hides the 3 panels and shows the 
 *   "LivePreview" component, so you can test the form exactly like a real user.
 * ============================================================================
 */
export function FormBuilder({ formId }: { formId: string }) {
    const router = useRouter();

    // Remembers if the "Add Field" popup menu is visible (mostly used on smaller screens).
    const [pickerOpen, setPickerOpen] = React.useState(false);

    // Remembers if the Settings panel (Inspector) is popping up on mobile screens.
    const [mobileInspectorOpen, setMobileInspectorOpen] = React.useState(false);

    // Tracks what the user is currently doing: building the form ("edit") or testing it out ("preview").
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");

    // Remembers exactly what item the user is currently picking up and moving with their mouse/finger.
    // It tracks whether they picked up a new field from the left menu or an existing one from the middle.
    const [activeDrag, setActiveDrag] = React.useState<
        | { source: "palette"; template: ElementTemplate }
        | { source: "canvas"; elementId: BuilderElementId }
        | null
    >(null);

    // Configures the drag-and-drop sensitivity. 
    // This prevents accidental drags when the user just meant to do a normal click.
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    // THE MASTER MEMORY: This holds all the actual form data (title, list of fields, selected field).
    // 'state' is the current data, and 'dispatch' is how we send commands to change that data.
    const [state, dispatch] = React.useReducer(builderReducer, {
        formId,
        config: {
            title: "Untitled Form",
            description: "",
            submission: {
                submitButtonLabel: "Submit",
                allowReset: true,
                successMessage: "Thanks! Your response has been recorded.",
                errorMessage: "Please review the highlighted fields and try again.",
            },
        },
        elements: [],
        selectedId: null,
        inspectorTab: "field",
    } satisfies BuilderState);

    const steps = React.useMemo(() => splitIntoSteps(state.elements), [state.elements]);
    const selected = React.useMemo(
        () => state.elements.find((e) => e.id === state.selectedId),
        [state.elements, state.selectedId]
    );

    // ACTION: Creates a brand new field (like a Text Box or Dropdown) and adds it to the workspace.
    // It also automatically opens the settings for that new field.
    const addFromTemplate = React.useCallback(
        (template: ElementTemplate, atIndex?: number) => {
            const element = createElementFromTemplate(template);
            dispatch({ type: "element.add", element, atIndex });
            if (template.kind === "field") dispatch({ type: "inspector.setTab", tab: "field" });
        },
        []
    );

    // -------------------------------------------------------------------------
    // PERFORMANCE FIX: Memoized Card Callbacks
    // -------------------------------------------------------------------------

    // ACTION: Highlights a field when you click on it in the workspace.
    // This wakes up the right-hand panel so you can edit the field's settings.
    const handleSelect = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.select", id });
    }, []);

    // ACTION: Makes an exact clone of a field when you click the "Copy" button.
    const handleDuplicate = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.duplicate", id, newId: createId() });
    }, []);

    // ACTION: Removes a field from the form when you click the "Trash" button.
    const handleDelete = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.delete", id });
    }, []);

    // ACTION: Saves the form's current progress. 
    // (Currently set up to copy the form's background data to the clipboard for testing).
    const handleSave = React.useCallback(async () => {
        const payload = getClipboardTextForBuilder(state);
        try {
            await navigator.clipboard.writeText(payload);
            toast.success("Builder JSON copied to clipboard");
        } catch {
            toast.success("Form saved");
        }
        console.log("Form builder payload:", payload);
    }, [state]);



    // ACTION: Runs the exact moment you click and hold an item to drag it.
    // It tells the screen to show a "ghost" image of the item following your mouse.
    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === "palette-item") {
            setActiveDrag({ source: "palette", template: active.data.current.template });
        } else if (active.data.current?.type === "canvas-element") {
            setActiveDrag({ source: "canvas", elementId: active.id as string });
        }
    }, []);

    // ACTION: Runs the exact moment you let go of the dragged item.
    // It calculates where you dropped it (e.g., placing a new field, or re-ordering existing ones).
    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDrag(null);

        if (!over) return;

        if (active.data.current?.type === "palette-item") {
            // Dropped from palette to canvas
            const template = active.data.current.template as ElementTemplate;
            let atIndex = state.elements.length;
            if (over.id !== "canvas-droppable") {
                const overIndex = state.elements.findIndex((e) => e.id === over.id);
                if (overIndex >= 0) atIndex = overIndex;
            }
            addFromTemplate(template, atIndex);
        } else if (active.data.current?.type === "canvas-element") {
            // Reordered on canvas
            if (active.id !== over.id && over.id !== "canvas-droppable") {
                dispatch({
                    type: "element.move",
                    activeId: active.id as string,
                    overId: over.id as string,
                });
            }
        }
    }, [state.elements, addFromTemplate]);




    console.log("state.elements:", state.elements);
    console.log("state.selectedId:", state.selectedId);

    return (
        <div className="bg-background text-foreground flex h-screen flex-col">
            <header className="bg-card border-border/60 flex h-14 items-center justify-between border-b px-4">
                <div className="flex min-w-0 items-center gap-3 w-1/3">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-accent">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <Input
                        value={state.config.title}
                        onChange={(e) => dispatch({ type: "config.setTitle", title: e.target.value })}
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


                    <Button type="button" size="sm" className="gap-2 cursor-pointer" onClick={handleSave}>
                        <Save className="size-4" />
                        Save
                    </Button>

                    <Button type="button" size="sm" className="gap-2 cursor-pointer" variant="outline" onClick={handleSave}>
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
                            disabled={!selected}
                        >
                            <Settings2 className="size-4" />
                        </Button>
                    )}
                </div>
            </header>

            <Dialog open={mobileInspectorOpen} onOpenChange={setMobileInspectorOpen}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden h-[85vh] sm:h-[80vh]">
                    <div className="h-full flex flex-col bg-card">
                        <InspectorPanel
                            selected={selected}
                            state={state}
                            dispatch={dispatch}
                            onDuplicate={() => (selected ? handleDuplicate(selected.id) : null)}
                            onDelete={() => (selected ? handleDelete(selected.id) : null)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <FieldPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                onPick={(template) => addFromTemplate(template)}
            />

            <div className="flex-1 overflow-hidden w-full">
                {viewMode === "preview" ? (
                    <div className="h-full w-full border-t border-border/60 bg-muted/5">
                        <LivePreview steps={steps} config={state.config} />
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <ResizablePanelGroup
                            orientation="horizontal"
                            className="rounded-lg border"
                        >

                            {/* field types  */}
                            <ResizablePanel defaultSize="20%" >
                                <div className="bg-card border-border/60 flex h-full flex-col border-r">
                                    <div className="border-border/60 flex items-center justify-between border-b px-4 py-3">
                                        <div className="text-sm font-semibold">Add</div>
                                        <Button type="button" variant="outline" size="xs" className="h-7" onClick={() => setPickerOpen(true)}>
                                            <Plus className="mr-1.5 size-3.5" />
                                            Picker
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <PaletteSidebar onPick={(template) => addFromTemplate(template)} />
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            {/* canvas  */}
                            <ResizablePanel defaultSize="60%">
                                <div className="relative h-full">
                                    <div className="bg-muted/30 flex flex-col h-full">
                                        <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-6 py-[6px]">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold">Canvas</div>
                                                <div className="text-muted-foreground mt-1 truncate text-xs">
                                                    Select an item to edit. Use the sidebar to add fields.
                                                </div>
                                            </div>

                                        </div>



                                        <CanvasArea
                                            elements={state.elements}
                                            selectedId={state.selectedId}
                                            onSelect={handleSelect}
                                            onDuplicate={handleDuplicate}
                                            onDelete={handleDelete}
                                            onOpenPicker={() => setPickerOpen(true)}
                                        />
                                    </div>
                                </div>
                            </ResizablePanel>


                            <ResizableHandle withHandle />


                            {/* setting */}
                            <ResizablePanel defaultSize="20%">
                                <div className="bg-card border-border/60 h-full border-l">
                                    <InspectorPanel
                                        selected={selected}
                                        state={state}
                                        dispatch={dispatch}
                                        onDuplicate={() => (selected ? handleDuplicate(selected.id) : null)}
                                        onDelete={() => (selected ? handleDelete(selected.id) : null)}
                                    />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>

                        <DragOverlay>
                            {activeDrag?.source === "palette" ? (
                                <div className="opacity-80">
                                    <PaletteItem
                                        template={activeDrag.template}
                                        title={FIELD_TEMPLATES.find(t => t.template.kind === activeDrag.template.kind && (t.template.kind === "field" && activeDrag.template.kind === "field" ? t.template.type === activeDrag.template.type : true))?.title ?? "Item"}
                                        description=""
                                        icon={FIELD_TEMPLATES.find(t => t.template.kind === activeDrag.template.kind && (t.template.kind === "field" && activeDrag.template.kind === "field" ? t.template.type === activeDrag.template.type : true))?.icon ?? GripVertical}
                                        onPick={() => { }}
                                    />
                                </div>
                            ) : activeDrag?.source === "canvas" && state.elements.find((e) => e.id === activeDrag.elementId) ? (
                                <div className="opacity-80">
                                    <CanvasElement
                                        element={state.elements.find((e) => e.id === activeDrag.elementId)!}
                                        selected={false}
                                        onSelect={() => { }}
                                        onDuplicate={() => { }}
                                        onDelete={() => { }}
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    );
}