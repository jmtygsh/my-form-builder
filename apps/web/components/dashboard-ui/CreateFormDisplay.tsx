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


    const submitForm = async (data: CreateFormValues) => {
        console.log(data);
        setSubmitError(null);
        try {
            const { id } = await createNewFormDisplayAsync({
                title: data.title,
                description: data.description
            });

            toast.success("Form created successfully!");
            // Redirect to the form builder page using the new form's id
            router.push(`/forms/${id}`);
        } catch (error: any) {
            const message = error.message || "Failed to create your form";
            setSubmitError(message);
            toast.error(message);
        }
    }

    const isLoading = isSubmitting || isPending;

    return (
        <div className={cn("w-full bg-background text-foreground flex flex-col items-center", className)} {...props}>
            <div className="w-full bg-card border border-border rounded-xl p-8 shadow-sm">


                <h1 className="text-xl font-medium text-foreground mb-2">Create a new form</h1>
                <p className="text-sm text-foreground-muted mb-8">Start building your custom form in seconds</p>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                    <FieldGroup className="space-y-4">

                        <Field>
                            <FieldLabel htmlFor="title" className="text-[13px] text-foreground font-normal">Form Title <span className="text-red-500">*</span></FieldLabel>
                            <Input
                                id="title"
                                type="text"
                                placeholder="E.g., Customer Feedback Survey"
                                className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                {...register("title", { required: "Title is required", minLength: { value: 3, message: "Title must be at least 3 characters" } })}
                                disabled={isLoading}
                            />
                            <FieldError errors={[errors.title]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description" className="text-[13px] text-foreground font-normal">Description (Optional)</FieldLabel>
                            <Textarea
                                id="description"
                                placeholder="What is this form about?"
                                className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary min-h-[100px] rounded-lg resize-none"
                                {...register("description")}
                                disabled={isLoading}
                            />
                        </Field>

                        <FieldError>{submitError}</FieldError>

                        <div className="pt-4 flex justify-end gap-3 mt-6">
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
                                className="h-10 text-sm font-medium rounded-lg"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-button hover:bg-button-hover text-button-foreground h-10 text-sm font-medium rounded-lg transition-colors border-0"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating..." : "Create Form"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}
