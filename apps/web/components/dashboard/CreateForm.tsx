"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { FolderPlus } from "lucide-react";
import { useCreateFormDisplay } from "~/hooks/api/form";

type CreateFormValues = {
    title: string;
    description: string;
};

type CreateFormProps = React.ComponentPropsWithoutRef<"div"> & {
    onCancel?: () => void;
};

export function CreateFormDisplay({
    className,
    onCancel,
    ...props
}: CreateFormProps) {
    const router = useRouter();
    const { createNewFormDisplayAsync, isPending } = useCreateFormDisplay();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<CreateFormValues | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateFormValues>({
        defaultValues: {
            title: "",
            description: ""
        },
        mode: "onSubmit"
    });


    const submitForm = (data: CreateFormValues) => {
        setPendingFormData(data);
        setShowDialog(true);
    };

    const handleCreateFromScratch = async () => {
        if (!pendingFormData) return;

        setShowDialog(false);
        setSubmitError(null);
        try {
            const { id } = await createNewFormDisplayAsync({
                title: pendingFormData.title,
                description: pendingFormData.description
            });

            toast.success("Form created successfully!");
            // Redirect to the form builder page using the new form's id
            router.push(`/dashboard/form/build/${id}`);
        } catch (error: any) {
            const message = error.message || "Failed to create your form";
            setSubmitError(message);
            toast.error(message);
        }
    };

    const isLoading = isSubmitting || isPending;

    return (
        <div className={cn("w-full  text-foreground flex flex-col items-center", className)} {...props}>
            <div className="w-full border border-border rounded-2xl p-8 shadow-sm">


                <h1 className="text-3xl font-heading text-heading mb-2">Create a new form</h1>
                <p className="text-[15px] text-foreground-muted mb-8">Start building your custom form in seconds.</p>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                    <FieldGroup className="space-y-5">

                        <Field>
                            <FieldLabel htmlFor="title" className="text-sm text-foreground font-medium mb-1">Form Title <span className="text-red-500">*</span></FieldLabel>
                            <Input
                                id="title"
                                type="text"
                                placeholder="E.g., Customer Feedback Survey"
                                className="bg-transparent border-border text-[14px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-11 rounded-xl"
                                {...register("title", { required: "Title is required", minLength: { value: 3, message: "Title must be at least 3 characters" } })}
                                disabled={isLoading}
                            />
                            <FieldError errors={[errors.title]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description" className="text-sm text-foreground font-medium mb-1">Description (Optional)</FieldLabel>
                            <Textarea
                                id="description"
                                placeholder="What is this form about?"
                                className="bg-transparent border-border text-[14px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary min-h-[120px] rounded-xl resize-none p-3"
                                {...register("description")}
                                disabled={isLoading}
                            />
                        </Field>

                        <FieldError>{submitError}</FieldError>

                        <div className="pt-6 flex justify-end gap-3 border-t border-border mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (onCancel) {
                                        onCancel();
                                    } else {
                                        router.push("/dashboard");
                                    }
                                }}
                                className="h-11 px-6 text-sm font-medium rounded-xl border-border bg-transparent hover:bg-background-secondary"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="textured"
                                className="h-11 px-8 text-sm font-medium rounded-xl transition-colors border-0"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating..." : "Create Form"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[600px] p-10">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-heading text-center text-heading font-normal">How would you like to start?</DialogTitle>
                        <DialogDescription className="text-center text-[15px] text-foreground-muted mt-3">
                            Choose to build from scratch or use one of our pre-built templates.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={handleCreateFromScratch}
                            className="flex flex-col items-center justify-center gap-6 p-10 border border-border rounded-2xl bg-background hover:bg-background-secondary hover:border-primary/50 transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <div className="text-primary">
                                <FolderPlus className="w-10 h-10 stroke-[1.5]" />
                            </div>
                            <span className="font-medium text-[15px] text-foreground">Start from scratch</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/templates")}
                            className="flex flex-col items-center justify-center gap-6 p-10 border border-border rounded-2xl bg-background hover:bg-background-secondary hover:border-primary/50 transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <div className="text-primary">
                                <FolderPlus className="w-10 h-10 stroke-[1.5]" />
                            </div>
                            <span className="font-medium text-[15px] text-foreground">Use a template</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
