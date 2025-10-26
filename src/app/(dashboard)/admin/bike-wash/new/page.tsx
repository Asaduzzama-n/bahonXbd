"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import BikeWashLocationForm from "@/components/bike-wash-location-form"
import { BikeWashLocationCreate } from "@/lib/validations"

export default function NewBikeWashLocation() {
  const router = useRouter()

  const handleSubmit = async (locationData: BikeWashLocationCreate) => {
    try {
      const response = await fetch('/api/admin/bike-wash-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Bike wash location created successfully')
        router.push('/admin/bike-wash')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to create bike wash location')
      }
    } catch (error) {
      console.error('Failed to create bike wash location:', error)
      toast.error('Failed to create bike wash location')
    }
  }

  const handleCancel = () => {
    router.push('/admin/bike-wash')
  }

  return (
    <div className="container mx-auto py-6">
      <BikeWashLocationForm
        onSubmit={(data) => handleSubmit(data as BikeWashLocationCreate)}
        onCancel={handleCancel}
      />
    </div>
  )
}