"use client"

import { Button } from "~/components/ui/button"
import { Search, ArrowUpDown, Filter, List, Grid, Loader2, FilePlus2, LayoutTemplate, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useGetFormDisplayList } from "~/hooks/api/form"
import { TabType } from "~/components/dashboard/app-sidebar"

function FormCard({ form }: { form: any }) {
    const count = 0;

    return (
        <div className="group rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col">
            <div className="h-36 bg-background flex items-center justify-center border-b border-border transition-colors group-hover:bg-primary/5 relative">
                <div className="absolute inset-4 bg-card rounded-lg shadow-sm border border-border/50 p-4 overflow-hidden flex flex-col gap-2">
                    <div className="w-1/2 h-2.5 bg-foreground-muted/20 rounded"></div>
                    <div className="w-full h-6 bg-background-secondary rounded border border-border/50"></div>
                    <div className="w-1/3 h-2.5 bg-foreground-muted/20 rounded mt-1"></div>
                    <div className="w-full h-6 bg-background-secondary rounded border border-border/50"></div>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{form.title}</h3>
                <p className="text-[13px] text-foreground-muted mt-1.5 line-clamp-2 flex-1 leading-relaxed">
                    {form.description || "No description provided."}
                </p>
            </div>
            <div className="p-4 pt-0 flex justify-between items-center">
                <Button variant="outline" size="sm" className="h-8 text-xs px-3 text-foreground-muted hover:text-foreground relative" asChild>
                    <Link href={`/dashboard/form/responses/${form.id}`}>
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Responses
                        {count > 0 && (
                            <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                                {count > 99 ? '99+' : count}
                            </span>
                        )}
                    </Link>
                </Button>
                <Button variant="textured" size="sm" className="h-8 text-xs px-4" asChild>
                    <Link href={`/dashboard/form/build/${form.id}`}>Edit</Link>
                </Button>
            </div>
        </div>
    );
}

export function MyForms({ onNavigate }: { onNavigate: (tab: TabType) => void }) {
    const { formDisplayList: forms, isLoading } = useGetFormDisplayList();

    return (
        <div className="flex flex-1 flex-col  rounded-tl-xl overflow-hidden shadow-inner border-l border-t border-border/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <h1 className="text-2xl font-heading text-heading">My Forms</h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border text-foreground-muted hover:text-foreground">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border text-foreground-muted hover:text-foreground">
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border text-foreground-muted hover:text-foreground">
                        <Filter className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center bg-card border border-border rounded-lg p-1 ml-2 shadow-sm">
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium  text-foreground rounded-md">
                            <List className="h-4 w-4 mr-1.5" />
                            List
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium text-foreground-muted hover:text-foreground rounded-md">
                            Grid
                            <Grid className="h-4 w-4 ml-1.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : forms && forms.length > 0 ? (
                <div className="flex-1 p-8  overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {forms.map((form) => (
                            <FormCard key={form.id} form={form} />
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center ">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full shadow-sm"></div>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-primary">
                                <path d="M17 8H21C21.5523 8 22 8.44772 22 9V11C22 13.2091 20.2091 15 18 15H17M17 8V18C17 19.1046 16.1046 20 15 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6H15C16.1046 6 17 6.89543 17 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-heading text-heading mb-3">Something great is brewing!</h2>
                    <p className="text-[15px] text-foreground-muted mb-8 max-w-md leading-relaxed">
                        Create your form when you're ready. Connect it with integrations, share it with the world, and collect responses instantly.
                    </p>
                </div>
            )}
        </div>
    )
}
