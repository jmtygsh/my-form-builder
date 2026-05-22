import * as React from "react";
import { AlertCircle, Check, Eye } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "~/components/ui/button";

import type { BuilderElement, FieldElement, FormConfig, Step } from "../types";
import { FieldRenderer } from "./FieldRenderer";

export function LivePreview({
    steps,
    config,
}: {
    steps: Step[];
    config: FormConfig;
}) {
    const [stepIndex, setStepIndex] = React.useState(0);
    const [status, setStatus] = React.useState<"editing" | "success" | "error">("editing");

    const methods = useForm({
        mode: "onTouched",
    });

    const current = React.useMemo(() => {
        if (steps.length === 0) return { elements: [] as BuilderElement[] };
        if (stepIndex >= 0 && stepIndex < steps.length) return steps[stepIndex]!;
        return steps[0]!;
    }, [steps, stepIndex]);

    const currentFields = React.useMemo(() => {
        return (current?.elements ?? []).filter((el): el is FieldElement => el.kind === "field");
    }, [current]);

    const reset = React.useCallback(() => {
        methods.reset();
        setStepIndex(0);
        setStatus("editing");
    }, [methods]);

    const goNext = React.useCallback(async () => {
        const currentFieldIds = currentFields.map((f) => f.id);
        const isStepValid = await methods.trigger(currentFieldIds);
        if (isStepValid) {
            setStepIndex((p) => Math.min(p + 1, steps.length - 1));
        }
    }, [currentFields, methods, steps.length]);

    const goBack = React.useCallback(() => {
        setStepIndex((p) => Math.max(0, p - 1));
    }, []);

    const onSubmit = React.useCallback((data: any) => {
        console.log("Form submitted with data:", data);
        setStatus("success");
    }, []);

    if (steps.length === 0 || (steps.length === 1 && steps[0]?.elements.length === 0)) {
        return (
            <div className="flex h-full flex-col bg-muted/10">
                <div className="border-border/60 bg-card flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">Preview</div>
                </div>
                <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="bg-background flex size-12 items-center justify-center rounded-full border shadow-sm mb-4">
                        <Eye className="size-5 text-muted-foreground" />
                    </div>
                    <div className="text-base font-medium text-foreground">Nothing to preview</div>
                    <div className="mt-1 text-sm">Add fields to your canvas to see how they look.</div>
                </div>
            </div>
        );
    }

    const hasErrors = Object.keys(methods.formState.errors).length > 0;

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex h-full flex-col">
                <div className="border-border/60 bg-card flex items-center justify-between gap-3 border-b px-4 py-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">Live preview</div>
                        <div className="text-muted-foreground mt-1 truncate text-xs">
                            Step {Math.min(stepIndex + 1, steps.length)} of {Math.max(1, steps.length)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {config.submission.allowReset && (
                            <Button type="button" variant="outline" size="xs" className="h-7" onClick={reset}>
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/5">
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
                            <div className="text-2xl font-bold">{config.title.trim() || "Untitled Form"}</div>
                            {config.description.trim() ? (
                                <div className="text-muted-foreground mt-3 text-base leading-relaxed">{config.description}</div>
                            ) : null}
                        </div>

                        {status === "success" ? (
                            <div className="rounded-2xl border border-border/60 bg-emerald-500/10 p-6 sm:p-8 text-foreground shadow-sm">
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="bg-emerald-500/20 mb-4 flex size-14 items-center justify-center rounded-full text-emerald-600">
                                        <Check className="size-7" />
                                    </div>
                                    <div className="text-xl font-bold">Success</div>
                                    <div className="text-muted-foreground mt-2 text-base">
                                        {config.submission.successMessage.trim() || "Thanks! Your response has been recorded."}
                                    </div>
                                    {config.submission.allowReset && (
                                        <div className="mt-6">
                                            <Button type="button" onClick={reset}>
                                                Submit another response
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : status === "error" ? (
                            <div className="rounded-2xl border border-border/60 bg-destructive/10 p-6 sm:p-8 text-foreground shadow-sm">
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="bg-destructive/20 mb-4 flex size-14 items-center justify-center rounded-full text-destructive">
                                        <AlertCircle className="size-7" />
                                    </div>
                                    <div className="text-xl font-bold text-destructive">Error</div>
                                    <div className="text-muted-foreground mt-2 text-base">
                                        {config.submission.errorMessage.trim() || "Something went wrong."}
                                    </div>
                                    <div className="mt-6">
                                        <Button type="button" variant="outline" onClick={() => setStatus("editing")}>
                                            Go back
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8 rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
                                {(current?.elements ?? []).map((el) => {
                                    if (el.kind === "section") {
                                        return (
                                            <div key={el.id} className="pt-2 pb-4 border-b border-border/40">
                                                <div className="text-lg font-semibold">{el.title.trim() || "Section"}</div>
                                                {el.description.trim() ? (
                                                    <div className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                                        {el.description}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }

                                    if (el.kind === "field") {
                                        return (
                                            <FieldRenderer
                                                key={el.id}
                                                element={el}
                                            />
                                        );
                                    }

                                    return null;
                                })}

                                {hasErrors ? (
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm mt-2">
                                        <div className="font-semibold text-destructive">Fix required fields</div>
                                        <div className="text-muted-foreground mt-1">
                                            Please review the highlighted fields above and try again.
                                        </div>
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
                                            Back
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {stepIndex < steps.length - 1 ? (
                                            <Button type="button" onClick={goNext}>
                                                Next
                                            </Button>
                                        ) : (
                                            <Button type="submit">
                                                {config.submission.submitButtonLabel.trim() || "Submit"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}