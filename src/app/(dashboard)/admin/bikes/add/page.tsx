"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BikeForm from "@/components/bike-form"
import { Bike } from "@/lib/models"
import { toast } from "sonner"

export default function AddBikePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (bikeData: Partial<Bike>) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/bikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bikeData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Bike added successfully!')
        router.push('/admin/bikes')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to add bike')
      }
    } catch (error) {
      console.error('Error adding bike:', error)
      toast.error('An error occurred while adding the bike')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/bikes')
  }

  return (
    <BikeForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )
}