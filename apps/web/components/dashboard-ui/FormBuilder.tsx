"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Type, AlignLeft, Mail, Hash,
    CircleDot, CheckSquare, Calendar, Upload,
    ChevronLeft, Trash2, Save, Play, Plus
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

type FieldType = "short_text" | "long_text" | "email" | "number" | "single_select" | "multi_select" | "dropdown" | "checkbox" | "rating" | "date" | "file_upload";

interface FormField {
    id: string;
    type: FieldType;
    label: string;
    description?: string;
    required: boolean;
    options?: string[];
}

const FIELD_TYPES: { type: FieldType; label: string; icon: any }[] = [
    { type: "short_text", label: "Short Text", icon: Type },
    { type: "long_text", label: "Long Text", icon: AlignLeft },
    { type: "email", label: "Email", icon: Mail },
    { type: "number", label: "Number", icon: Hash },
    { type: "single_select", label: "Multiple Choice", icon: CircleDot },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "date", label: "Date", icon: Calendar },
    { type: "file_upload", label: "File Upload", icon: Upload },
];

export function FormBuilder({ formId }: { formId: string }) {
    const router = useRouter();
    const [formTitle, setFormTitle] = useState("Untitled Form");
    const [fields, setFields] = useState<FormField[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    const addField = (type: FieldType) => {
        const newField: FormField = {
            id: Math.random().toString(36).substring(7),
            type,
            label: `New ${FIELD_TYPES.find(f => f.type === type)?.label}`,
            required: false,
            options: type === "single_select" || type === "dropdown" ? ["Option 1"] : undefined,
        };
        setFields([...fields, newField]);
        setSelectedFieldId(newField.id);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const handleSave = () => {
        // Here we will eventually connect to the backend tRPC route to save the schema
        toast.success("Form saved successfully!");
        console.log("Saving form data:", { formId, formTitle, fields });
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="hover:bg-accent">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Input
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="font-medium text-lg border-transparent hover:border-border focus-visible:ring-1 px-2 h-9 w-64 bg-transparent"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2 h-8">
                        <Play className="w-4 h-4" /> Preview
                    </Button>
                    <Button size="sm" className="gap-2 h-8 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
                        <Save className="w-4 h-4" /> Save Form
                    </Button>
                </div>
            </header>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Toolbox */}
                <aside className="w-64 border-r border-border bg-card flex flex-col z-10">
                    <div className="p-4 border-b border-border font-medium text-sm text-foreground">Add Fields</div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                        {FIELD_TYPES.map(ft => (
                            <Button
                                key={ft.type}
                                variant="outline"
                                className="justify-start gap-3 h-10 bg-background hover:bg-accent/50 hover:text-accent-foreground border-border"
                                onClick={() => addField(ft.type)}
                            >
                                <ft.icon className="w-4 h-4 text-foreground-muted" />
                                {ft.label}
                            </Button>
                        ))}
                    </div>
                </aside>

                {/* Center Canvas */}
                <main className="flex-1 bg-background-secondary overflow-y-auto p-8 flex justify-center">
                    <div className="w-full max-w-2xl bg-card rounded-xl border border-border shadow-sm h-fit min-h-[600px] p-8 flex flex-col gap-6">
                        <div className="mb-6 border-b border-border pb-6">
                            <h1 className="text-3xl font-semibold text-foreground">{formTitle}</h1>
                            <p className="text-foreground-muted mt-2">Form description goes here...</p>
                        </div>

                        {fields.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-foreground-muted border-2 border-dashed border-border rounded-lg p-12 text-center min-h-[300px]">
                                <Plus className="w-10 h-10 mb-4 text-border" />
                                <p className="font-medium text-foreground">No fields added yet</p>
                                <p className="text-sm mt-1">Click a field on the left to add it to your form</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {fields.map(field => (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedFieldId(field.id)}
                                        className={cn(
                                            "group relative p-6 rounded-lg border-2 transition-all cursor-pointer",
                                            selectedFieldId === field.id
                                                ? "border-primary bg-primary/5"
                                                : "border-transparent hover:border-border bg-background"
                                        )}
                                    >
                                        <div className="flex flex-col gap-2 pointer-events-none">
                                            <Label className="text-base font-medium text-foreground">
                                                {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            {field.description && <p className="text-sm text-foreground-muted">{field.description}</p>}

                                            <div className="mt-2">
                                                {field.type === "short_text" && <Input placeholder="Short text answer" readOnly className="bg-background-secondary" />}
                                                {field.type === "long_text" && <Textarea placeholder="Long text answer" readOnly className="bg-background-secondary" />}
                                                {field.type === "email" && <Input type="email" placeholder="Email address" readOnly className="bg-background-secondary" />}
                                                {field.type === "number" && <Input type="number" placeholder="Number answer" readOnly className="bg-background-secondary" />}
                                                {field.type === "date" && <Input type="date" readOnly className="bg-background-secondary" />}
                                                {field.type === "checkbox" && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border border-border rounded-sm bg-background-secondary" />
                                                        <span className="text-sm text-foreground-muted">Checkbox option</span>
                                                    </div>
                                                )}
                                                {(field.type === "single_select" || field.type === "dropdown") && (
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border border-border rounded-full bg-background-secondary" />
                                                            <span className="text-sm text-foreground-muted">Option 1</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border border-border rounded-full bg-background-secondary" />
                                                            <span className="text-sm text-foreground-muted">Option 2</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {field.type === "file_upload" && (
                                                    <div className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-foreground-muted bg-background-secondary">
                                                        <Upload className="w-5 h-5 mr-2" /> Upload File
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Properties */}
                <aside className="w-80 border-l border-border bg-card flex flex-col z-10">
                    <div className="p-4 border-b border-border font-medium text-sm text-foreground">Field Properties</div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedField ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">Field Label</Label>
                                    <Input
                                        value={selectedField.label}
                                        onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">Helper Text</Label>
                                    <Textarea
                                        value={selectedField.description || ""}
                                        onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                                        placeholder="Optional description..."
                                        className="bg-background border-border resize-none"
                                    />
                                </div>
                                <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-sm font-medium">Required Field</Label>
                                        <span className="text-xs text-foreground-muted">Must be filled out</span>
                                    </div>
                                    <Switch
                                        checked={selectedField.required}
                                        onCheckedChange={(c) => updateField(selectedField.id, { required: c })}
                                    />
                                </div>

                                <div className="pt-6 border-t border-border mt-2">
                                    <Button variant="destructive" className="w-full gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" onClick={() => removeField(selectedField.id)}>
                                        <Trash2 className="w-4 h-4" /> Delete Field
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-foreground-muted text-sm text-center px-4">
                                Select a field in the canvas to edit its properties
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}