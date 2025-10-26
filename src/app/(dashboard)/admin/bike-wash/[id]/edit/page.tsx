"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import BikeWashLocationForm from "@/components/bike-wash-location-form"
import { BikeWashLocation } from "@/lib/models"
import { BikeWashLocationUpdate } from "@/lib/validations"

export default function EditBikeWashLocation() {
  const params = useParams()
  const router = useRouter()
  const [location, setLocation] = useState<BikeWashLocation | null>(null)
  const [loading, setLoading] = useState(true)

  const locationId = params.id as string

  useEffect(() => {
    if (locationId) {
      fetchLocation()
    }
  }, [locationId])

  const fetchLocation = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/bike-wash-locations/${locationId}`)
      if (response.ok) {
        const data = await response.json()
        setLocation(data.data)
      } else {
        toast.error('Failed to fetch bike wash location details')
        router.push('/admin/bike-wash-locations')
      }
    } catch (error) {
      console.error('Failed to fetch bike wash location:', error)
      toast.error('Failed to fetch bike wash location details')
      router.push('/admin/bike-wash-locations')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (locationData: BikeWashLocationUpdate) => {
    try {
      const response = await fetch(`/api/admin/bike-wash-locations/${locationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Bike wash location updated successfully')
        router.push('/admin/bike-wash-locations')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update bike wash location')
      }
    } catch (error) {
      console.error('Failed to update bike wash location:', error)
      toast.error('Failed to update bike wash location')
    }
  }

  const handleCancel = () => {
    router.push('/admin/bike-wash-locations')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bike wash location not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <BikeWashLocationForm
        location={location}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}