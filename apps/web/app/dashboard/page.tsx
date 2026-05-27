"use client"

import { useState } from "react"
import { CreateFormDisplay } from "~/components/dashboard/CreateForm"
import { MyForms } from "~/components/dashboard/MyForms"
import { Trash } from "~/components/dashboard/Trash"
import { LogOut, User, Settings, Sparkles, CreditCard, FolderPlus, Plus, Trash2, Search, Filter, Menu } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Skeleton } from "~/components/ui/skeleton"
import { useUser } from "~/hooks/api/auth"

export type TabType = "forms" | "create" | "trash" | "submissions";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("forms");
    const { user, isLoading: isUserLoading } = useUser();

    // Global Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const renderContent = () => {
        switch (activeTab) {
            case "forms":
                return <MyForms onNavigate={setActiveTab} searchQuery={searchQuery} sortOrder={sortOrder} />;
            case "create":
                return <CreateFormDisplay onCancel={() => setActiveTab("forms")} />;
            case "trash":
                return <Trash onNavigate={setActiveTab} />;
            default:
                return <MyForms onNavigate={setActiveTab} searchQuery={searchQuery} sortOrder={sortOrder} />;
        }
    }

    return (
        <div className="container mx-auto flex flex-col h-screen w-full overflow-hidden bg-[#FEFBF6]">
            {/* Top Navigation Bar */}
            <header className="flex h-20 shrink-0 items-center justify-center w-full z-50 mt-4">
                <div className="w-full px-4 flex items-center justify-between">
                    {/* Logo Area & Hamburger Menu */}
                    <div className="flex items-center gap-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 shrink-0 bg-white border-[2.5px] border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] rounded-2xl transition-all hover:-translate-y-0.5 hover:bg-[#1E1E1E]/5 text-[#1E1E1E]"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 mt-2 rounded-[14px] border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] p-2">
                                <DropdownMenuLabel className="font-normal px-2 py-1.5 text-xs text-muted-foreground font-bold tracking-wider uppercase">Navigation</DropdownMenuLabel>
                                <DropdownMenuItem
                                    className={`cursor-pointer rounded-[10px] font-bold h-10 ${activeTab === "forms" ? "bg-[#1E1E1E] text-white focus:bg-[#1E1E1E] focus:text-white" : "text-[#1E1E1E] focus:bg-[#FEFBF6]"}`}
                                    onClick={() => setActiveTab("forms")}
                                >
                                    <FolderPlus className="mr-3 h-4 w-4" />
                                    <span>Forms</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`cursor-pointer rounded-[10px] font-bold h-10 ${activeTab === "create" ? "bg-[#1E1E1E] text-white focus:bg-[#1E1E1E] focus:text-white" : "text-[#1E1E1E] focus:bg-[#FEFBF6]"}`}
                                    onClick={() => setActiveTab("create")}
                                >
                                    <Plus className="mr-3 h-4 w-4" />
                                    <span>Create New</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#1E1E1E]/10 my-2" />
                                <DropdownMenuItem
                                    className={`cursor-pointer rounded-[10px] font-bold h-10 ${activeTab === "trash" ? "bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600" : "text-red-600 focus:bg-red-50 focus:text-red-600"}`}
                                    onClick={() => setActiveTab("trash")}
                                >
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    <span>Trash</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <span className="font-script text-3xl md:text-4xl text-[#1E1E1E] leading-none -mt-1 tracking-tight">
                            mmf.
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search and Filter only visible on forms tab */}
                        {activeTab === "forms" && (
                            <div className="hidden sm:flex items-center gap-2 mr-2">
                                <div className="relative w-48 lg:w-64">
                                    <Search className="absolute left-3 top-3 h-[18px] w-[18px] text-[#1E1E1E]" />
                                    <Input
                                        placeholder="Search forms..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 w-full bg-white border-[2.5px] border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] focus-visible:ring-0 focus-visible:border-[#5CCDB1] focus-visible:shadow-[2px_2px_0px_0px_#5CCDB1] rounded-2xl text-[14px] font-bold placeholder:text-muted-foreground placeholder:font-medium transition-all"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                                    className={`h-12 w-12 shrink-0 bg-white border-[2.5px] border-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(30,30,30,1)] rounded-2xl transition-all hover:-translate-y-0.5 ${sortOrder === "asc" ? "bg-[#1E1E1E] text-white" : "hover:bg-[#1E1E1E]/5 text-[#1E1E1E]"}`}
                                >
                                    <Filter className="h-[18px] w-[18px]" />
                                </Button>
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-12 h-12 rounded-full overflow-hidden border-[2.5px] border-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#5CCDB1] focus:ring-offset-2 focus:ring-offset-[#FEFBF6] transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(30,30,30,1)]">
                                    {isUserLoading ? (
                                        <Skeleton className="w-full h-full rounded-full" />
                                    ) : (
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'Felix'}&backgroundColor=5CCDB1`}
                                            alt={user?.fullName || "Avatar"}
                                            className="w-full h-full object-cover bg-[#5CCDB1]"
                                        />
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[14px] border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] p-2">
                                <DropdownMenuLabel className="font-normal px-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none text-[#1E1E1E]">{user?.fullName || 'Guest User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground font-medium">
                                            {user?.email || 'No email provided'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#1E1E1E]/10 my-2" />
                                <DropdownMenuItem asChild className="cursor-pointer rounded-[10px]">
                                    <Link href="/pricing" className="w-full flex items-center text-[#5CCDB1] font-bold focus:text-[#5CCDB1] focus:bg-[#5CCDB1]/10">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        <span>Upgrade to Pro</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer rounded-[10px] font-medium text-[#1E1E1E] focus:bg-[#FEFBF6]">
                                    <Link href="/pricing" className="w-full flex items-center">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        <span>Pricing & Billing</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#1E1E1E]/10 my-2" />
                                <DropdownMenuItem className="cursor-pointer rounded-[10px] font-medium text-[#1E1E1E] focus:bg-[#FEFBF6]">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer rounded-[10px] font-medium text-[#1E1E1E] focus:bg-[#FEFBF6]">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#1E1E1E]/10 my-2" />
                                <DropdownMenuItem asChild className="cursor-pointer rounded-[10px] font-bold text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Link href="/auth/sign-in" className="w-full flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-transparent">
                <div className="container mx-auto py-4 ">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
