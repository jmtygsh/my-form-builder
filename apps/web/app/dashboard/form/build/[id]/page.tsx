"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useBuilderStore } from "~/features/form-builder/store/useBuilderStore";
import { toast } from "sonner";
import { Copy, Check, Globe, Lock, Clock, Users, Hash } from "lucide-react";

// local files
import { EditMode } from "~/features/form-builder/components/mode/EditMode";
import { PreviewMode } from "~/features/form-builder/components/mode/PreviewMode";
import { FormHeader } from "~/features/form-builder/components/FormHeader";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { usePublishForm, useSaveDraftForm, useLoadDraftedForm } from "~/hooks/api/form";
import { Spinner } from "~/components/ui/spinner";
import { Skeleton } from "~/components/ui/skeleton";

interface PublishSettings {
    visibility: "public" | "unlisted" | "unpublished";
    protected: boolean;
    password: string;
    expiryEnabled: boolean;
    expiryDate: string;
    allowAnonymous: boolean;
    maxResponses: string;
}

export default function Formbuilder() {

    const router = useRouter();
    const params = useParams();

    const formId = params.id as string;

    const { form, setForm, clearPersistedState } = useBuilderStore();
    const { saveDraftFormAsync, isPending: isSavingDraft } = useSaveDraftForm();
    const { draftedForm, isLoading: isLoadingDraft } = useLoadDraftedForm(formId);


    // 1. STATE & HOOKS
    // ==========================================
    const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
    const [publishDialogOpen, setPublishDialogOpen] = React.useState(false);
    const [publishedSlug, setPublishedSlug] = React.useState<string | null>(null);
    const [copied, setCopied] = React.useState(false);

    // Publish form state as a single object
    const [publishSettings, setPublishSettings] = React.useState<PublishSettings>({
        visibility: "public",
        protected: false,
        password: "",
        expiryEnabled: false,
        expiryDate: "",
        allowAnonymous: true,
        maxResponses: "",
    });

    const { publishFormAsync, isPending } = usePublishForm();



    // Load drafted form data from DB into store when it arrives
    React.useEffect(() => {
        if (draftedForm && Object.keys(draftedForm).length > 0) {
            // The backend now intelligently returns the payload (draft or published) that has more rows.
            if (draftedForm.name && Array.isArray(draftedForm.rows)) {
                setForm({
                    name: draftedForm.name,
                    props: draftedForm.props || {},
                    rows: draftedForm.rows as any
                });
            }
        }
    }, [draftedForm, setForm]);


    const handleSaveFn = async () => {
        try {
            await saveDraftFormAsync({
                formId: formId,
                draft: form
            });
            toast.success("Draft saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save draft");
        }
    };

    const handlePublishFn = () => {
        setPublishedSlug(null);
        setPublishDialogOpen(true);
    };

    const handleConfirmPublish = async () => {
        try {
            // Validation: Expiry Date must be at least 5 minutes in the future
            if (publishSettings.expiryEnabled && publishSettings.expiryDate) {
                const selectedDate = new Date(publishSettings.expiryDate);
                const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

                if (selectedDate <= fiveMinutesFromNow) {
                    toast.error("Expiration date must be greater.");
                    return;
                }
            }

            const result = await publishFormAsync({
                formId,
                data: form,
                settings: publishSettings
            });

            setPublishedSlug(result.slug);
            toast.success("Form published successfully!");

            if (formId) {
                clearPersistedState(formId);
            }
        } catch (error: any) {
            const message = error.message || "Failed to publish form";
            toast.error(message);
        }
    };

    const handleCopySlug = async () => {
        if (publishedSlug) {
            const shareUrl = `${window.location.origin}/form/${publishedSlug}`;
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };



    if (isLoadingDraft) {
        return (
            <div className="bg-background text-foreground flex h-screen flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border bg-card">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-sm text-foreground-muted animate-pulse">Loading builder...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground flex h-screen flex-col">
            <FormHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                onSaveFn={handleSaveFn}
                onPublishFn={handlePublishFn}
            />

            <div className="flex-1 w-full overflow-hidden">
                {viewMode === "preview" ? (
                    <div className="h-full w-full border-t border-border/60 bg-muted/5">
                        <PreviewMode />
                    </div>
                ) : (
                    <EditMode />
                )}
            </div>

            {/* Publish Dialog */}
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <DialogContent className={"max-w-5xl p-6 gap-0"}>
                    <DialogHeader className={publishedSlug ? "" : "mb-6"}>
                        <DialogTitle className="text-xl font-semibold">
                            {publishedSlug ? "Share link" : "Publish Settings"}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            {publishedSlug
                                ? "Anyone who has this link will be able to view this."
                                : "Configure how people can access and interact with your form."}
                        </DialogDescription>
                    </DialogHeader>

                    {!publishedSlug ? (
                        <div className="grid gap-4 py-2">
                            {/* Visibility */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="visibility" className="text-sm font-medium">Visibility</Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">Control who can discover this form</p>
                                    </div>
                                    <Select
                                        value={publishSettings.visibility}
                                        onValueChange={(v: any) =>
                                            setPublishSettings((prev) => ({ ...prev, visibility: v }))
                                        }
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="w-[120px] h-9">
                                            <SelectValue placeholder="Select visibility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="unlisted">Unlisted</SelectItem>
                                            <SelectItem value="unpublished">Unpublished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Password Protection */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="protected" className="text-sm font-medium cursor-pointer">Password Protection</Label>
                                            <p className="text-xs text-muted-foreground mt-0.5">Require a password to access</p>
                                        </div>
                                    </div>
                                    <RadioGroup
                                        value={publishSettings.protected ? "true" : "false"}
                                        onValueChange={(v) =>
                                            setPublishSettings((prev) => ({ ...prev, protected: v === "true" }))
                                        }
                                        disabled={isPending}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="protected-true" />
                                            <Label htmlFor="protected-true" className="font-normal cursor-pointer">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="protected-false" />
                                            <Label htmlFor="protected-false" className="font-normal cursor-pointer">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {publishSettings.protected && (
                                    <div className="pl-12 pr-2 pt-1 pb-1 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            id="password"
                                            type="password"
                                            className="h-9"
                                            value={publishSettings.password}
                                            onChange={(e) =>
                                                setPublishSettings((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter a secure password..."
                                            disabled={isPending}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Expiry Date */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="expiry" className="text-sm font-medium cursor-pointer">Expiration Date</Label>
                                            <p className="text-xs text-muted-foreground mt-0.5">Automatically close the form</p>
                                        </div>
                                    </div>
                                    <RadioGroup
                                        value={publishSettings.expiryEnabled ? "true" : "false"}
                                        onValueChange={(v) =>
                                            setPublishSettings((prev) => ({
                                                ...prev,
                                                expiryEnabled: v === "true",
                                            }))
                                        }
                                        disabled={isPending}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="expiry-true" />
                                            <Label htmlFor="expiry-true" className="font-normal cursor-pointer">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="expiry-false" />
                                            <Label htmlFor="expiry-false" className="font-normal cursor-pointer">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {publishSettings.expiryEnabled && (
                                    <div className="pl-12 pr-2 pt-1 pb-1 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            id="expiry-date"
                                            type="datetime-local"
                                            className="h-9"
                                            value={publishSettings.expiryDate}
                                            min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
                                            onChange={(e) =>
                                                setPublishSettings((prev) => ({
                                                    ...prev,
                                                    expiryDate: e.target.value,
                                                }))
                                            }
                                            disabled={isPending}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Allow Anonymous */}
                                <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-4 h-4 text-primary" />
                                            <Label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">Anonymous</Label>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Allow guests</p>
                                    </div>
                                    <RadioGroup
                                        value={publishSettings.allowAnonymous ? "true" : "false"}
                                        onValueChange={(v) =>
                                            setPublishSettings((prev) => ({
                                                ...prev,
                                                allowAnonymous: v === "true",
                                            }))
                                        }
                                        disabled={isPending}
                                        className="flex items-center gap-4 mt-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="anonymous-true" />
                                            <Label htmlFor="anonymous-true" className="font-normal cursor-pointer">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="anonymous-false" />
                                            <Label htmlFor="anonymous-false" className="font-normal cursor-pointer">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Max Responses */}
                                <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hash className="w-4 h-4 text-primary" />
                                            <Label htmlFor="max-responses" className="text-sm font-medium">Response Limit</Label>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3">Leave empty for infinite</p>
                                        <Input
                                            id="max-responses"
                                            type="number"
                                            className="h-9"
                                            value={publishSettings.maxResponses}
                                            onChange={(e) =>
                                                setPublishSettings((prev) => ({
                                                    ...prev,
                                                    maxResponses: e.target.value,
                                                }))
                                            }
                                            placeholder="Unlimited"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 py-4">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={`${window.location.origin}/form/${publishedSlug}`}
                                    readOnly
                                />
                            </div>
                            <Button type="button" size="sm" className="px-3 h-9" onClick={handleCopySlug}>
                                <span className="sr-only">Copy</span>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    )}

                    <DialogFooter className={publishedSlug ? "sm:justify-start" : "mt-6 pt-4 border-t"}>
                        {!publishedSlug ? (
                            <>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="button"
                                    onClick={handleConfirmPublish}
                                    disabled={isPending}
                                    className="min-w-[100px] bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {isPending && <Spinner className="mr-2" />}
                                    {isPending ? "Publishing..." : "Publish Form"}
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="button"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}