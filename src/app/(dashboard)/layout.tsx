'use client'
import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-0">
        {/* Top Navigation Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-4">
            {/* Keep only one mobile menu icon by not rendering a second AdminSidebar here */}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu - only if logged in */}
            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div className="mx-auto  space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
