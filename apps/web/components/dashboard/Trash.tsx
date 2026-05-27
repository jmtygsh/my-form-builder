"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Search, FolderPlus, Plus, MessageCircle, Trash2, ArrowLeft, RefreshCw, Trash as TrashIcon } from "lucide-react"
import { useGetTrashedForms, useRestoreForm, useHardDeleteForm } from "~/hooks/api/form"
import { toast } from "sonner"
import { Skeleton } from "~/components/ui/skeleton"

import { TabType } from "~/app/dashboard/page"

interface TrashedFormCardType {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    createdAt: Date | string;
}

function TrashedFormCard({ form }: { form: TrashedFormCardType }) {
    const { restoreFormAsync, isPending: isRestoring } = useRestoreForm();
    const { hardDeleteFormAsync, isPending: isDeleting } = useHardDeleteForm();

    const handleRestore = async () => {
        try {
            await restoreFormAsync({ formId: form.id });
            toast.success("Form restored successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to restore form");
        }
    };

    const handleHardDelete = async () => {
        if (!confirm("Are you sure you want to permanently delete this form? This action cannot be undone.")) return;

        try {
            await hardDeleteFormAsync({ formId: form.id });
            toast.success("Form deleted permanently");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete form permanently");
        }
    };

    return (
        <div className="group bg-white rounded-[20px] border border-red-100 overflow-hidden hover:shadow-xl hover:shadow-red-500/5 hover:border-red-200 transition-all duration-300 flex flex-col opacity-80 hover:opacity-100">
            <div className="px-6 py-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-[15px] text-foreground truncate">{form.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1 truncate">
                    {form.description || form.title}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                    Deleted recently
                </div>
            </div>
            <div className="px-6 py-3 flex justify-end items-center border-t border-red-50 bg-red-50/30 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={handleRestore}
                    disabled={isRestoring || isDeleting}
                >
                    {isRestoring ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                    Restore
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={handleHardDelete}
                    disabled={isRestoring || isDeleting}
                >
                    {isDeleting ? <Trash2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                    Delete Forever
                </Button>
            </div>
        </div>
    );
}

interface TrashProps {
    onNavigate: (tab: TabType) => void;
}

export function Trash({ onNavigate }: TrashProps) {
    const { trashedForms: forms, isLoading } = useGetTrashedForms();

    return (
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-5xl mx-auto mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => onNavigate("forms")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-[28px] font-bold text-foreground tracking-tight">Trash</h1>
                    </div>
                    <p className="text-muted-foreground mt-1 text-[15px] ml-8">Forms in trash will be permanently deleted after 30 days.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <nav className="flex items-center bg-white p-1 rounded-xl border border-border/40 shadow-sm mr-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg"
                            onClick={() => onNavigate("forms")}
                        >
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Forms
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg"
                            onClick={() => onNavigate("create")}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 text-[13px] font-semibold bg-red-50 text-red-600 rounded-lg"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Trash
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex-1 py-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden flex flex-col h-[180px]">
                                <div className="p-5 flex-1 flex flex-col gap-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full mt-1.5" />
                                </div>
                                <div className="p-4 pt-0 flex justify-end gap-2 border-t border-border/60 bg-muted/10">
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                    <Skeleton className="h-8 w-28 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : forms && forms.length > 0 ? (
                <div className="flex-1 py-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <TrashedFormCard key={form.id} form={{ ...form, createdAt: new Date(form.createdAt) }} />
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center ">
                    <div className="relative mb-6 group">
                        <div className="w-32 h-32 flex items-center justify-center bg-muted/30 rounded-full border border-border/50 group-hover:bg-muted/50 transition-colors">
                            <TrashIcon className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-heading text-heading mb-3">Trash is empty</h2>
                    <p className="text-[15px] text-foreground-muted mb-8 max-w-sm leading-relaxed">
                        You don't have any deleted forms. Forms you delete will appear here and can be restored.
                    </p>
                </div>
            )}
        </div>
    )
}
