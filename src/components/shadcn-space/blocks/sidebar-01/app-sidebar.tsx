"use client"

import { useTheme } from "@/hooks/use-theme"
import { ChevronsUpDown, CircleHelp, MapPin, Moon, Package, PackageCheck, Settings, Sun, Truck, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"

const primaryNav = [
  { label: "Orders", href: "/orders", icon: Package, badge: "16" },
  { label: "Shipments", href: "/shipments", icon: Truck },
  { label: "Ready to pick", href: "/pickup", icon: PackageCheck, badge: "16" },
  { label: "Addresses", href: "/addresses", icon: MapPin },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">S</span>
            <span className="flex min-w-0 flex-col"><span className="truncate text-sm font-semibold text-foreground">Shipflow</span><span className="truncate text-xs text-muted-foreground">Fulfillment workspace</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="shrink-0" aria-label="Workspace menu"><ChevronsUpDown /></Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarMenu>{primaryNav.map(({ label, href, icon: Icon, badge }) => <SidebarMenuItem key={href}><SidebarMenuButton render={<Link to={href}><Icon /><span>{label}</span></Link>} />{badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}</SidebarMenuItem>)}</SidebarMenu></SidebarGroup>
        <SidebarGroup><SidebarGroupLabel>Configuration</SidebarGroupLabel><SidebarMenu><SidebarMenuItem><SidebarMenuButton render={<Link to="/shipping-rules"><Zap /><span>Shipping rules</span></Link>} /></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton render={<Link to="/settings"><Settings /><span>Settings</span></Link>} /></SidebarMenuItem></SidebarMenu></SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t"><div className="flex items-center justify-between gap-2 px-2 py-1"><div className="flex min-w-0 items-center gap-2"><Badge variant="outline" className="size-7 justify-center rounded-full p-0">S</Badge><span className="truncate text-xs text-muted-foreground">Connected store</span></div><Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme">{isDark ? <Moon /> : <Sun />}</Button></div><Button variant="ghost" className="justify-start gap-2 text-muted-foreground"><CircleHelp /> Help center</Button></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
