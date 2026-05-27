"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetFormBySlug, useSubmitFormResponse, useVerifyFormPassword } from "~/hooks/api/form";
import { PublicFormRenderer } from "~/features/form-builder/components/canvas/PublicFormRenderer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2, Lock } from "lucide-react";

export default function PublicFormPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { form, isLoading, error } = useGetFormBySlug(slug);
    const { verifyFormPasswordAsync, isPending: isVerifying } = useVerifyFormPassword();
    const { submitFormResponseAsync, isPending: isSubmitting } = useSubmitFormResponse();

    const [password, setPassword] = useState("");
    const [unlockedFormPayload, setUnlockedFormPayload] = useState<any>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (form?.published && !form.isProtected) {
            setUnlockedFormPayload(form.published);
        }
    }, [form]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await verifyFormPasswordAsync({ slug, password });
            setUnlockedFormPayload(res.published);
            toast.success("Form unlocked!");
        } catch (err: any) {
            toast.error(err.message || "Incorrect password");
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form?.id) return;

        const formData = new FormData(e.currentTarget);


        const answers: Record<string, any> = {};
        for (const key of Array.from(formData.keys())) {
            const values = formData.getAll(key);
            answers[key] = values.length > 1 ? values : values[0];
        }

        try {
            await submitFormResponseAsync({
                formId: form.id,
                answers,
            });
            setIsSubmitted(true);
            toast.success("Response submitted successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to submit response");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
                <div className="max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
                    <h1 className="mb-2 text-2xl font-bold text-foreground">Form Unavailable</h1>
                    <p className="text-muted-foreground">{error.message || "This form is not available at the moment."}</p>
                    <Button onClick={() => router.push("/")} className="mt-6">
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
                <div className="max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-foreground">Thank You!</h1>
                    <p className="text-muted-foreground">Your response has been recorded successfully.</p>
                </div>
            </div>
        );
    }

    if (form?.isProtected && !unlockedFormPayload) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
                <form onSubmit={handlePasswordSubmit} className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-foreground">Protected Form</h1>
                        <p className="text-sm text-muted-foreground">This form requires a password to view and submit.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isVerifying}>
                            {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Unlock Form
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    if (!unlockedFormPayload) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <form onSubmit={handleFormSubmit} className="mx-auto max-w-5xl px-4">
                <PublicFormRenderer form={unlockedFormPayload} />
            </form>
        </div>
    );
}