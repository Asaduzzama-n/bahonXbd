"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BikeForm from "@/components/bike-form"
import { Bike } from "@/lib/models"
import { toast } from "sonner"

export default function EditBikePage() {
  const [bike, setBike] = useState<Bike | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBike, setIsLoadingBike] = useState(true)
  const router = useRouter()
  const params = useParams()
  const bikeId = params.id as string

  useEffect(() => {
    fetchBike()
  }, [bikeId])

  const fetchBike = async () => {
    try {
      const response = await fetch(`/api/bikes/${bikeId}`)
      if (response.ok) {
        const data = await response.json()
        setBike(data.data || null)
      } else {
        toast.error('Failed to load bike details')
        router.push('/admin/bikes')
      }
    } catch (error) {
      console.error('Error fetching bike:', error)
      toast.error('An error occurred while loading the bike')
      router.push('/admin/bikes')
    } finally {
      setIsLoadingBike(false)
    }
  }

  const handleSubmit = async (bikeData: Partial<Bike>) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/bikes/${bikeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bikeData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Bike updated successfully!')
        router.push('/admin/bikes')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update bike')
      }
    } catch (error) {
      console.error('Error updating bike:', error)
      toast.error('An error occurred while updating the bike')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/bikes')
  }

  if (isLoadingBike) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!bike) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bike not found</p>
      </div>
    )
  }

  return (
    <BikeForm
      bike={bike}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )
}