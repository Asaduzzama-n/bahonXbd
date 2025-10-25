"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PurchaseOrderForm from "@/components/purchase-order-form"
import { PurchaseOrderCreate } from "@/lib/validations"
import { Bike, Partner } from "@/lib/models"
import { toast } from "sonner"

export default function CreatePurchaseOrder() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    fetchBikesAndPartners()
  }, [])

  const fetchBikesAndPartners = async () => {
    try {
      setLoadingData(true)
      
      // Fetch bikes and partners in parallel
      const [bikesResponse, partnersResponse] = await Promise.all([
        fetch('/api/admin/bikes'),
        fetch('/api/admin/partners')
      ])

      if (bikesResponse.ok) {
        const bikesData = await bikesResponse.json()
        setBikes(bikesData.data.bikes || [])
      } else {
        toast.error('Failed to fetch bikes')
      }

      if (partnersResponse.ok) {
        const partnersData = await partnersResponse.json()
        setPartners(partnersData.data.partners || [])
      } else {
        toast.error('Failed to fetch partners')
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load required data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (purchaseOrderData: PurchaseOrderCreate) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseOrderData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Purchase order created successfully')
        router.push(`/admin/purchase-orders/${data.data.purchaseOrder._id}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to create purchase order')
      }
    } catch (error) {
      console.error('Failed to create purchase order:', error)
      toast.error('Failed to create purchase order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/purchase-orders')
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bikes and partners...</p>
        </div>
      </div>
    )
  }

  return (
    <PurchaseOrderForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      bikes={bikes}
      partners={partners}
    />
  )
}