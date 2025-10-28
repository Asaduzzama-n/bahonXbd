"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Bike,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FileText,
  UserCheck,
  TrendingUp,
  Package,
  Calendar,
  Handshake,
  User,
  Receipt
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  {
    title: "Bikes",
    href: "/admin/bikes",
    icon: Bike,
    description: "Manage bike listings"
  },
  {
    title: "Purchase Orders",
    href: "/admin/purchase-orders",
    icon: ShoppingCart,
    description: "View and manage purchase orders"
  },
  {
    title: "Partners",
    href: "/admin/partners",
    icon: Handshake,
    description: "Partner management"
  },
  {
    title: "Expenses",
    href: "/admin/expenses",
    icon: Receipt,
    description: "Track expenses and service history"
  },
  {
    title: "Bike Wash",
    href: "/admin/bike-wash",
    icon: Droplets,
    description: "Wash service bookings"
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Detailed analytics"
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
    description: "Generate reports"
  },
  {
    title: "Verification",
    href: "/admin/verification",
    icon: UserCheck,
    description: "Verify listings"
  },
  {
    title: "Public Info",
    href: "/admin/profile",
    icon: User,
    description: "Manage public information"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System settings"
  }
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex h-full flex-col",
      mobile ? "w-full" : isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-border px-4 py-4",
        isCollapsed && !mobile ? "justify-center px-2" : "justify-between"
      )}>
        {(!isCollapsed || mobile) && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bike className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        )}
        {!mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 p-0",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2" role="navigation" aria-label="Admin dashboard navigation">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground",
                isCollapsed && !mobile ? "justify-center px-2" : "justify-start"
              )}
              title={isCollapsed && !mobile ? item.title : undefined}
              aria-label={`${item.title} - ${item.description}`}
              aria-current={isActive ? "page" : undefined}
              tabIndex={0}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                (!isCollapsed || mobile) && "mr-3"
              )} aria-hidden="true" />
              {(!isCollapsed || mobile) && (
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {!mobile && (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-border p-4",
        isCollapsed && !mobile ? "px-2" : ""
      )}>
        <div className={cn(
          "flex items-center text-sm text-muted-foreground",
          isCollapsed && !mobile ? "justify-center" : ""
        )}>
          {(!isCollapsed || mobile) && (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>BahonXBD CRM</span>
            </>
          )}
          {isCollapsed && !mobile && (
            <TrendingUp className="h-4 w-4" />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden border-r border-border bg-background md:flex md:flex-col",
        isCollapsed ? "md:w-16" : "md:w-64",
        className
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}