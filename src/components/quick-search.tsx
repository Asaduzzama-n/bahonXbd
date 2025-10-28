"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function QuickSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/listings')
    }
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Your Perfect Bike</h2>
            <p className="text-muted-foreground text-lg">
              Search through our verified collection of premium motorcycles
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by brand, model, or keyword..." 
                  className="h-12 text-lg border-border focus:border-primary focus:ring-primary"
                />
              </div>
              <Button 
                type="submit"
                size="lg" 
                className="md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}