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

import type { BuilderElementId, BuilderState, ElementTemplate, FieldElement, PreviewState } from "./form-builder/types";
import {
    builderReducer,
    createId,
    createElementFromTemplate,
    splitIntoSteps,
    getClipboardTextForBuilder,
    FIELD_TEMPLATES,
    safeLabelForElement,
    typeLabel,
} from "./form-builder/utils";

import { PaletteItem, ElementCard, FieldPickerDialog } from "./form-builder/UIComponents";
import { InspectorPanel } from "./form-builder/InspectorPanel";
import { PreviewPanel } from "./form-builder/PreviewPanel";

export function FormBuilder({ formId }: { formId: string }) {
    const router = useRouter();

    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [mobileInspectorOpen, setMobileInspectorOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
    const [activeDrag, setActiveDrag] = React.useState<
        | { source: "palette"; template: ElementTemplate }
        | { source: "canvas"; elementId: BuilderElementId }
        | null
    >(null);

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

    const [preview, setPreview] = React.useState<PreviewState>({
        stepIndex: 0,
        values: {},
        errors: {},
        status: "editing",
    });

    // -------------------------------------------------------------------------
    // PERFORMANCE FIX: Optimized Preview Synchronization
    // -------------------------------------------------------------------------
    // We only want to clean up preview values when fields are ADDED or REMOVED,
    // not when a field's properties (like its label) change.
    const elementsStructureKey = React.useMemo(
        () => state.elements.map((e) => e.id).join(","),
        [state.elements]
    );

    const elementsRef = React.useRef(state.elements);
    elementsRef.current = state.elements;

    React.useEffect(() => {
        setPreview((p) => {
            const aliveFieldIds = new Set(
                elementsRef.current.filter((el): el is FieldElement => el.kind === "field").map((el) => el.id)
            );
            const nextValues: PreviewState["values"] = {};
            for (const [k, v] of Object.entries(p.values)) {
                if (aliveFieldIds.has(k)) nextValues[k] = v;
            }
            const nextErrors: PreviewState["errors"] = {};
            for (const [k, v] of Object.entries(p.errors)) {
                if (aliveFieldIds.has(k) && v) nextErrors[k] = v;
            }
            const maxStep = Math.max(0, splitIntoSteps(elementsRef.current).length - 1);
            const nextStepIndex = Math.min(p.stepIndex, maxStep);
            return { ...p, values: nextValues, errors: nextErrors, stepIndex: nextStepIndex };
        });
    }, [elementsStructureKey]);

    const steps = React.useMemo(() => splitIntoSteps(state.elements), [state.elements]);
    const selected = React.useMemo(
        () => state.elements.find((e) => e.id === state.selectedId),
        [state.elements, state.selectedId]
    );

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
    const handleSelect = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.select", id });
    }, []);

    const handleDuplicate = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.duplicate", id, newId: createId() });
    }, []);

    const handleDelete = React.useCallback((id: BuilderElementId) => {
        dispatch({ type: "element.delete", id });
    }, []);

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

    const copyJson = React.useCallback(async () => {
        const payload = getClipboardTextForBuilder(state);
        try {
            await navigator.clipboard.writeText(payload);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Unable to copy to clipboard");
        }
    }, [state]);

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
                        className="border-transparent bg-transparent px-2 text-base font-semibold hover:border-border focus-visible:ring-1"
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
                    {viewMode === "edit" && (
                        <Button type="button" variant="outline" size="sm" className="gap-2 hidden lg:flex" onClick={() => setPickerOpen(true)}>
                            <Plus className="size-4" />
                            Add Field
                        </Button>
                    )}
                    <Button type="button" variant="outline" size="sm" className="gap-2 hidden lg:flex" onClick={copyJson}>
                        <ClipboardCopy className="size-4" />
                        Copy JSON
                    </Button>
                    <Button type="button" size="sm" className="gap-2" onClick={handleSave}>
                        <Save className="size-4" />
                        Save
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
                            onClick={() => setMobileInspectorOpen(true)}
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



            <div className="flex-1 overflow-hidden w-full">
                {viewMode === "preview" ? (
                    <div className="h-full w-full border-t border-border/60 bg-muted/5">
                        <PreviewPanel steps={steps} config={state.config} preview={preview} setPreview={setPreview} />
                    </div>
                ) : (
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="rounded-lg border"
                    >

                        {/* field types  */}
                        <ResizablePanel defaultSize="30%">
                            <div className="hidden lg:block">
                                <div className="bg-card border-border/60 flex h-full flex-col border-r">
                                    <div className="border-border/60 flex items-center justify-between border-b px-4 py-3">
                                        <div className="text-sm font-semibold">Add</div>
                                        <Button type="button" variant="outline" size="xs" className="h-7" onClick={() => setPickerOpen(true)}>
                                            <Plus className="mr-1.5 size-3.5" />
                                            Picker
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <div className="flex flex-col gap-2">
                                            {FIELD_TEMPLATES.map((t) => (
                                                <PaletteItem
                                                    key={`${t.title}:${t.template.kind}:${t.template.kind === "field" ? t.template.type : "x"}`}
                                                    template={t.template}
                                                    title={t.title}
                                                    description={t.description}
                                                    icon={t.icon}
                                                    onPick={(template) => addFromTemplate(template)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* canvas  */}
                        <ResizablePanel defaultSize="50%">
                            <div className="relative">
                                <div className="bg-muted/20 flex h-full flex-col">
                                    <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-4 py-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold">Canvas</div>
                                            <div className="text-muted-foreground mt-1 truncate text-xs">
                                                Select an item to edit. Use the sidebar to add fields.
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 lg:hidden">
                                            <Button type="button" variant="outline" size="xs" className="h-7" onClick={() => setPickerOpen(true)}>
                                                <Plus className="mr-1.5 size-3.5" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/5">
                                        <div
                                            className={cn(
                                                "mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border/60 bg-background p-4 sm:p-6 shadow-sm transition-all"
                                            )}
                                        >
                                            {state.elements.length === 0 ? (
                                                <div className="text-muted-foreground flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/70 bg-muted/10 p-8 text-center transition-colors hover:bg-muted/20">
                                                    <div className="bg-background flex size-12 items-center justify-center rounded-full border shadow-sm">
                                                        <Plus className="text-muted-foreground size-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-semibold text-foreground">Start building your form</div>
                                                        <div className="mt-1 text-sm">Use “Add Field” or pick from the sidebar.</div>
                                                    </div>
                                                    <Button type="button" onClick={() => setPickerOpen(true)} className="mt-2">
                                                        <Plus className="mr-2 size-4" />
                                                        Add your first field
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {state.elements.map((el) => (
                                                        <ElementCard
                                                            key={el.id}
                                                            element={el}
                                                            selected={state.selectedId === el.id}
                                                            onSelect={handleSelect}
                                                            onDuplicate={handleDuplicate}
                                                            onDelete={handleDelete}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ResizablePanel>


                        <ResizableHandle withHandle />


                        {/* setting */}
                        <ResizablePanel defaultSize="20%">
                            <div className="hidden lg:block">
                                <div className="bg-card border-border/60 h-full border-l">
                                    <InspectorPanel
                                        selected={selected}
                                        state={state}
                                        dispatch={dispatch}
                                        onDuplicate={() => (selected ? handleDuplicate(selected.id) : null)}
                                        onDelete={() => (selected ? handleDelete(selected.id) : null)}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}
            </div>




        </div>
    );
}