"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { FilePlus2, LayoutTemplate, MessageCircle, MoreVertical, Edit2, ExternalLink, Inbox, Settings, ChevronLeft, ChevronRight, FolderPlus, Plus, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { useGetFormDisplayList, useSoftDeleteForm } from "~/hooks/api/form"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Skeleton } from "~/components/ui/skeleton"

import { TabType } from "~/app/dashboard/page"

interface FormCardType {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    createdAt: Date | string;
    responsesCount: number | null;
}

function FormCard({ form }: { form: FormCardType }) {
    const count = form.responsesCount || 0;
    const { softDeleteFormAsync } = useSoftDeleteForm();

    const handleSoftDelete = async () => {
        try {
            await softDeleteFormAsync({ formId: form.id });
            toast.success("Form moved to trash");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to move form to trash");
        }
    };

    return (
        <div className="group bg-white rounded-2xl border-2 border-[#1E1E1E] overflow-hidden hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] transition-all duration-200 flex flex-col">
            <div className="h-40 bg-[#FEFBF6] flex items-center justify-center p-6 relative border-b-2 border-[#1E1E1E]">
                <div className="w-full h-full rounded-xl border-2 border-[#1E1E1E] p-4 flex flex-col gap-3 bg-white shadow-[2px_2px_0px_0px_rgba(30,30,30,1)]">
                    <div className="w-1/3 h-2 bg-[#1E1E1E]/20 rounded-full"></div>
                    <div className="w-full h-8 bg-[#1E1E1E]/5 rounded-md border border-[#1E1E1E]/10"></div>
                    <div className="w-1/4 h-2 bg-[#1E1E1E]/20 rounded-full mt-2"></div>
                    <div className="w-full h-8 bg-[#1E1E1E]/5 rounded-md border border-[#1E1E1E]/10"></div>
                </div>
            </div>
            <div className="px-6 py-4 flex-1 flex flex-col">
                <h3 className="font-bold text-[16px] text-[#1E1E1E] truncate group-hover:text-[#5CCDB1] transition-colors">{form.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1 font-medium truncate">
                    {form.description || form.title}
                </p>
            </div>
            <div className="px-6 py-3 flex justify-between items-center border-t-2 border-[#1E1E1E] bg-white">
                <div className="flex items-center text-[13px] font-medium text-muted-foreground">
                    <Inbox className="w-4 h-4 mr-2 opacity-70" />
                    {count} Responses
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 hover:bg-muted/50 rounded-full">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                                <Link href={`/dashboard/form/build/${form.id}`} className="w-full flex items-center">
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    <span>Edit Form</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                                <Link href={`/form/${form.slug}`} target="_blank" className="w-full flex items-center">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    <span>View Live Form</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                                <Link href={`/dashboard/form/responses/${form.id}`} className="w-full flex items-center">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span>View Responses</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleSoftDelete} className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Move to Trash</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

interface MyFormsProps {
    onNavigate: (tab: TabType) => void;
    searchQuery: string;
    sortOrder: "desc" | "asc";
}

export function MyForms({ onNavigate, searchQuery, sortOrder }: MyFormsProps) {
    const { formDisplayList: forms, isLoading } = useGetFormDisplayList();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Apply filters and sort
    const processedForms = (forms || [])
        .filter((form) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                form.title.toLowerCase().includes(query) ||
                (form.description && form.description.toLowerCase().includes(query))
            );
        })
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

    const totalItems = processedForms.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentForms = processedForms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 w-full mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-heading text-[#1E1E1E] tracking-tight">My Forms</h1>
                    <p className="text-muted-foreground mt-2 text-[15px] font-medium">Manage and monitor all your forms</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 py-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden flex flex-col h-[280px]">
                                <Skeleton className="h-36 w-full rounded-none" />
                                <div className="p-5 flex-1 flex flex-col gap-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full mt-1.5" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                                <div className="p-4 pt-0 flex justify-between items-center border-t border-border/60 bg-muted/10">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : processedForms.length > 0 ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 py-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentForms.map((form) => (
                                <FormCard key={form.id} form={{ ...form, createdAt: form.createdAt ?? new Date().toISOString() }} />
                            ))}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between py-4 border-t border-border shrink-0 mt-4">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-foreground">{totalItems}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-background shadow-sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-background shadow-sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] rounded-2xl">
                    <div className="relative mb-6 group">
                        <div className="w-32 h-32 flex items-center justify-center bg-[#FEFBF6] rounded-full border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] transition-colors">
                            <FilePlus2 className="w-12 h-12 text-[#1E1E1E]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E1E1E] mb-3">No forms found</h2>
                    <p className="text-[15px] text-muted-foreground mb-8 max-w-sm leading-relaxed font-medium">
                        {searchQuery ? "No forms match your search." : "You haven't created any forms yet. Start building your first form to collect responses."}
                    </p>
                    <Button onClick={() => onNavigate("create")} className="h-11 px-6 bg-[#5CCDB1] hover:bg-[#5CCDB1]/90 text-[#1E1E1E] font-bold border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] hover:-translate-y-0.5 transition-all">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Form
                    </Button>
                </div>
            )}
        </div>
    )
}
