"use client"

import { useState } from "react"
import { AppSidebar, TabType } from "~/components/dashboard-ui/app-sidebar"
import { CreateFormDisplay } from "~/components/dashboard-ui/CreateFormDisplay"
import { Button } from "~/components/ui/button"
import { Search, ArrowUpDown, Filter, List, Grid, Loader2, FileText } from "lucide-react"
import {
    SidebarInset,
    SidebarProvider,
} from "~/components/ui/sidebar"
import { useGetFormDisplayList } from "~/hooks/api/form"

function MyForms({ onNavigate }: { onNavigate: (tab: TabType) => void }) {

    const { formDisplayList: forms, isLoading } = useGetFormDisplayList();

    console.log('MyForms', forms)

    return (
        <div className="flex flex-1 flex-col bg-muted/30 rounded-tl-xl overflow-hidden shadow-inner border-l border-t border-border/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-6 bg-background border-b border-border/50">
                <h1 className="text-xl font-bold text-foreground">My Forms</h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent border-border/50 text-muted-foreground hover:text-foreground">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent border-border/50 text-muted-foreground hover:text-foreground">
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent border-border/50 text-muted-foreground hover:text-foreground">
                        <Filter className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center bg-transparent border border-border/50 rounded-md p-1 ml-2">
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium bg-muted/50 text-foreground">
                            <List className="h-4 w-4 mr-1.5" />
                            List
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
                            Grid
                            <Grid className="h-4 w-4 ml-1.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center bg-muted/30">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : forms && forms.length > 0 ? (
                <div className="flex-1 p-8 bg-muted/30 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {forms.map((form) => (
                            <div key={form.id} className="group bg-background rounded-xl border border-border/50 overflow-hidden hover:shadow-md transition-all hover:border-border cursor-pointer flex flex-col">
                                <div className="h-32 bg-muted/50 flex items-center justify-center border-b border-border/50 group-hover:bg-muted/80 transition-colors">
                                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-foreground truncate">{form.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
                                        {form.description || "No description provided."}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">{form.id}</p>
                                </div>
                                <div className="p-5 flex justify-end">
                                    <a href={`/dashboard/form/${form.id}`} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Edit
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 flex items-center justify-center">
                            <div className="absolute inset-0 bg-background rounded-full shadow-sm"></div>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-primary">
                                <path d="M17 8H21C21.5523 8 22 8.44772 22 9V11C22 13.2091 20.2091 15 18 15H17M17 8V18C17 19.1046 16.1046 20 15 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6H15C16.1046 6 17 6.89543 17 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-2">Something great is brewing!</h2>
                    <p className="text-sm text-muted-foreground mb-6">Create your form when you're ready.</p>
                    <Button onClick={() => onNavigate("create")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Create a new form
                    </Button>
                </div>
            )}
        </div>
    )
}


export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("forms");

    const renderContent = () => {
        switch (activeTab) {
            case "forms":
                return <MyForms onNavigate={setActiveTab} />;
            case "create":
                return <CreateFormDisplay onCancel={() => setActiveTab("forms")} />;
            default:
                return <MyForms onNavigate={setActiveTab} />;
        }
    }

    return (
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border bg-background z-50">
                {/* Logo Area */}
                <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-foreground rotate-45 flex items-center justify-center rounded-[3px]">
                        <div className="w-1.5 h-1.5 bg-background rounded-[1px] -rotate-45" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground dark:text-white">MakeMyForm</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button className="bg-button hover:bg-button-hover text-button-foreground rounded-full h-8 px-4 text-xs font-semibold">
                        Upgrade
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden border border-border">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            {/* Main Content Area with Sidebar */}
            <SidebarProvider className="flex-1 overflow-hidden min-h-0">
                <div className="flex w-full h-full">
                    <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                    <SidebarInset className="flex-1 bg-transparent overflow-y-auto">
                        <div className="flex flex-1 flex-col min-h-full p-4 pl-0">
                            {renderContent()}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
