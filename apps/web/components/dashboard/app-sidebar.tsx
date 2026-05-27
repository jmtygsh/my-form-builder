"use client"

import * as React from "react"
import { FolderPlus, Archive, Trash2, Send } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"



export type TabType = "forms" | "create" | "trash" | "team" | "submissions";

// Menu items.
const items: { title: string; id: TabType; icon: any; badge?: string }[] = [
  {
    title: "My Forms",
    id: "forms",
    icon: FolderPlus,
  },
  {
    title: "Create a new form",
    id: "create",
    icon: FolderPlus,
  }

]

const middleItems: { title: string; id: TabType; icon: any; badge?: string }[] = [

  {
    title: "My Submissions",
    id: "submissions",
    icon: Send,
  },

]

const bottomItems: { title: string; id: TabType; icon: any; badge?: string }[] = [

  {
    title: "Trash",
    id: "trash",
    icon: Trash2,
    badge: "(1)"
  },
]

interface AppSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0 pt-4 bg-transparent top-16 h-[calc(100vh-64px)]" collapsible="none">
      <SidebarContent className="px-4 gap-6">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) =>
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className="cursor-pointer h-11 px-4 rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium text-foreground-muted hover:bg-background-secondary transition-colors"
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="h-px bg-border/50 w-full" />

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {middleItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className="cursor-pointer h-11 px-4 rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium text-foreground-muted hover:bg-background-secondary transition-colors flex justify-between"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-3" />
                      <span>{item.title}</span>
                    </div>

                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Bottom fixed section */}
      <div className="mt-auto px-4 pb-6 gap-2 flex flex-col">
        <div className="h-px bg-border/50 w-full mb-4" />
        <SidebarMenu className="gap-2">
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeTab === item.id}
                onClick={() => onTabChange(item.id)}
                className="cursor-pointer h-11 px-4 rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium text-foreground-muted hover:bg-background-secondary transition-colors"
              >
                <item.icon className="w-4 h-4 mr-3" />
                <span>{item.title}</span>
                {item.badge && <span className="text-xs font-semibold">{item.badge}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </Sidebar>
  )
}
