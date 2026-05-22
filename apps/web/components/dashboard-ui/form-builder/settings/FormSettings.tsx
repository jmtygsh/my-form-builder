import * as React from "react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { DebouncedInput } from "../ui/DebouncedInput";
import { DebouncedTextarea } from "../ui/DebouncedTextarea";
import type { FormConfig } from "../types";

export function FormSettings({
    config,
    onUpdateTitle,
    onUpdateDescription,
    onUpdateSubmission,
}: {
    config: FormConfig;
    onUpdateTitle: (title: string) => void;
    onUpdateDescription: (description: string) => void;
    onUpdateSubmission: (patch: Partial<FormConfig["submission"]>) => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                <DebouncedInput
                    value={config.title}
                    onChange={onUpdateTitle}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                <DebouncedTextarea
                    value={config.description}
                    onChange={onUpdateDescription}
                    className="resize-none min-h-[100px]"
                />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                <div className="text-sm font-semibold">Submission Settings</div>

                <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Submit button label</Label>
                    <DebouncedInput
                        value={config.submission.submitButtonLabel}
                        onChange={(v) => onUpdateSubmission({ submitButtonLabel: v })}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                    <div className="min-w-0">
                        <div className="text-sm font-medium">Allow reset</div>
                        <div className="text-muted-foreground mt-0.5 text-xs">Show a reset action in preview</div>
                    </div>
                    <Switch
                        checked={config.submission.allowReset}
                        onCheckedChange={(checked) => onUpdateSubmission({ allowReset: checked })}
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Success message</Label>
                    <DebouncedTextarea
                        value={config.submission.successMessage}
                        onChange={(v) => onUpdateSubmission({ successMessage: v })}
                        className="resize-none min-h-[80px]"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Error message</Label>
                    <DebouncedTextarea
                        value={config.submission.errorMessage}
                        onChange={(v) => onUpdateSubmission({ errorMessage: v })}
                        className="resize-none min-h-[80px]"
                    />
                </div>
            </div>
        </div>
    );
}
