"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetFormResponses } from "~/hooks/api/form";
import { Loader2, ArrowLeft, Download, Search, Inbox, ChevronLeft, ChevronRight, Activity, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { downloadCSV } from "~/lib/csv";
import { toast } from "sonner";

export default function FormResponsesPage() {
    const params = useParams();
    const router = useRouter();
    const formId = params.id as string;

    const { published, responses, isLoading, error } = useGetFormResponses(formId);

    // Map field IDs to their labels from the published schema
    const fieldMap = useMemo(() => {
        const map = new Map<string, string>();
        if (!published?.rows) return map;

        published.rows.forEach((row: any) => {
            row.fields?.forEach((field: any) => {
                // Ignore layout/static elements
                if (!["button", "sectionHeader", "paragraph", "heading"].includes(field.type)) {
                    map.set(field.id, field.props?.label || field.type);
                }
            });
        });
        return map;
    }, [published]);

    // Get ordered column headers
    const columns = useMemo(() => {
        return Array.from(fieldMap.entries()).map(([id, label]) => ({ id, label }));
    }, [fieldMap]);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredResponses = useMemo(() => {
        if (!responses) return [];
        if (!searchQuery) return responses;
        const lowerQuery = searchQuery.toLowerCase();
        return responses.filter((r: any) => {
            return Object.values(r.answers).some((val: any) => {
                if (Array.isArray(val)) return val.join(", ").toLowerCase().includes(lowerQuery);
                if (typeof val === "string") return val.toLowerCase().includes(lowerQuery);
                return false;
            });
        });
    }, [responses, searchQuery]);

    const totalItems = filteredResponses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentResponses = useMemo(() => {
        return filteredResponses.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredResponses, currentPage, itemsPerPage]);

    // Reset page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Dashboard Metrics
    const responsesToday = useMemo(() => {
        if (!responses) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return responses.filter((r: any) => new Date(r.createdAt) >= today).length;
    }, [responses]);

    const latestTimeAgo = useMemo(() => {
        if (!responses || responses.length === 0) return "--";
        const latest = responses.reduce((a: any, b: any) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);

        const seconds = Math.floor((new Date().getTime() - new Date(latest.createdAt).getTime()) / 1000);
        const days = Math.floor(seconds / 86400);
        if (days > 0) return days === 1 ? "Yesterday" : `${days}d ago`;
        const hours = Math.floor(seconds / 3600);
        if (hours > 0) return `${hours}h ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    }, [responses]);

    const handleExportCSV = () => {
        if (!responses || responses.length === 0) {
            toast.error("No responses to export");
            return;
        }

        const dataToExport = responses.map((response: any) => {
            const rowData: Record<string, any> = {
                "Submission Date": new Date(response.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                })
            };

            columns.forEach(col => {
                let val = response.answers[col.id];
                if (Array.isArray(val)) {
                    val = val.join(", ");
                }
                rowData[col.label] = val !== undefined && val !== null ? val : "";
            });

            return rowData;
        });

        const formName = published?.name || "Untitled_Form";
        const safeFilename = formName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        downloadCSV(`${safeFilename}_responses`, dataToExport);
        toast.success("Responses exported successfully");
    };


    if (isLoading) {
        return (
            <div className="flex flex-col h-full w-full bg-muted/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-border bg-background">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <div>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                            ))}
                        </div>
                        <Skeleton className="h-[500px] w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-4 bg-muted/5">
                <div className="max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
                    <h1 className="mb-2 text-2xl font-bold text-foreground">Error Loading Responses</h1>
                    <p className="text-muted-foreground">{error.message || "Failed to load form responses."}</p>
                    <Button onClick={() => router.back()} variant="outline" className="mt-6">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-muted/5 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-border bg-background shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-heading text-heading">
                            {published?.name || "Untitled Form"}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <p className="text-sm text-muted-foreground">Accepting responses</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 hover:border-primary/50 hover:text-primary transition-colors"
                        onClick={handleExportCSV}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1400px] mx-auto space-y-8">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors group">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Total Responses</h3>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Inbox className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="text-4xl font-semibold text-foreground tracking-tight">{responses?.length || 0}</div>
                        </div>

                        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors group">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Today's Responses</h3>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Activity className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="text-4xl font-semibold text-foreground tracking-tight">{responsesToday}</div>
                        </div>

                        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors group">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Latest Submission</h3>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="text-4xl font-semibold text-foreground tracking-tight">{latestTimeAgo}</div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
                            <h3 className="text-lg font-medium text-foreground">Recent Submissions</h3>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search responses..."
                                    className="pl-9 w-full sm:w-[250px] lg:w-[300px] h-9 text-sm bg-background focus-visible:ring-primary transition-colors border-border/60"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {currentResponses && currentResponses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[11px] text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 font-medium whitespace-nowrap">Submission Date</th>
                                            {columns.map((col) => (
                                                <th key={col.id} className="px-6 py-4 font-medium whitespace-nowrap">
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {currentResponses.map((response: any) => (
                                            <tr key={response.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                                                    {new Date(response.createdAt).toLocaleString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                {columns.map((col) => {
                                                    let val = response.answers[col.id];
                                                    if (Array.isArray(val)) {
                                                        val = val.join(", ");
                                                    }
                                                    return (
                                                        <td key={col.id} className="px-6 py-4 text-muted-foreground max-w-[250px] truncate group-hover:text-foreground transition-colors" title={String(val || "")}>
                                                            {val !== undefined && val !== null && val !== "" ? String(val) : (
                                                                <span className="text-muted-foreground/40">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Inbox className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-1">No responses found</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    {searchQuery ? "No submissions match your search query." : "Share your form link to start collecting responses."}
                                </p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="border-t border-border bg-muted/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-foreground">{totalItems}</span> results
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-background"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-background"
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
                </div>
            </div>
        </div>
    );
}
