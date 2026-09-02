"use client"

import { useState } from "react"
import {
  Users,
  Settings,
  Shuffle,
  Sparkles,
  Zap,
  HelpCircle,
  Download,
  Trash2,
  Sun,
  Moon,
  ChevronsUpDown,
  Package,
  MapPinHouse,
  Truck,
  PackageCheck,
} from "lucide-react"
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [isDark, setIsDark] = useState(false)

  return (
    <Sidebar collapsible="offcanvas" side="left">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <button className="flex min-w-0 items-center gap-2 rounded-lg py-1 pl-0.5 pr-1.5 hover:bg-muted">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
              A
            </div>
            <span className="truncate text-sm font-medium text-foreground">
              App name
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
          </button>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link to="/orders">
                    <Package />
                    <span>Orders</span>
                    <SidebarMenuBadge>16</SidebarMenuBadge>
                  </Link>
                }
              />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/shipments"><Truck /><span>Shipments</span></Link>} />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/pickup"><PackageCheck /><span>Ready to Pick</span><SidebarMenuBadge>16</SidebarMenuBadge></Link>} />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/members"><Users /><span>Members</span></Link>} />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/addresses"><MapPinHouse /><span>Addresses</span></Link>} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Teamspaces</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/settings"><Shuffle /><span>Settings</span></Link>} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/shipping-rules"><Zap /><span>Shipping Rules</span></Link>} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#"><Sparkles /><span>A.I</span></a>} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#"><Download /><span>Import</span></a>} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#"><Trash2 /><span>Trash</span></a>} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            ?
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
            Need help?
          </span>
          <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}