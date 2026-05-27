"use client"

import { useState } from "react"
import { AppSidebar, TabType } from "~/components/dashboard/app-sidebar"
import { CreateFormDisplay } from "~/components/dashboard/CreateForm"
import { MyForms } from "~/components/dashboard/MyForms"
import { Trash } from "~/components/dashboard/Trash"
import { MySubmissions } from "~/components/dashboard/Submissions"
import { Button } from "~/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"
import {
    SidebarInset,
    SidebarProvider,
} from "~/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useUser } from "~/hooks/api/auth"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("forms");
    const { user, isLoading: isUserLoading } = useUser();

    const renderContent = () => {
        switch (activeTab) {
            case "forms":
                return <MyForms onNavigate={setActiveTab} />;
            case "create":
                return <CreateFormDisplay onCancel={() => setActiveTab("forms")} />;
            case "trash":
                return <Trash onNavigate={setActiveTab} />;
            case "submissions":
                return <MySubmissions onNavigate={setActiveTab} />;
            default:
                return <MyForms onNavigate={setActiveTab} />;
        }
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border z-50">
                {/* Logo Area */}
                <div className="flex items-center gap-2.5">
                    <span className="font-script text-3xl md:text-4xl text-foreground leading-none -mt-1 tracking-tight">
                        mmf.
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="textured" className="rounded-full h-9 px-5 text-xs font-semibold">
                        Upgrade
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-full overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all">
                                {isUserLoading ? (
                                    <div className="w-full h-full animate-pulse" />
                                ) : (
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'Felix'}`}
                                        alt={user?.fullName || "Avatar"}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.fullName || 'Guest User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email || 'No email provided'}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
