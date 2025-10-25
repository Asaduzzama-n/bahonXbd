"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import PurchaseOrderForm from "@/components/purchase-order-form"
import { PurchaseOrderUpdate } from "@/lib/validations"
import { PurchaseOrder, Bike, Partner } from "@/lib/models"
import { toast } from "sonner"

export default function EditPurchaseOrder() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch purchase order, bikes, and partners in parallel
      const [purchaseOrderResponse, bikesResponse, partnersResponse] = await Promise.all([
        fetch(`/api/admin/purchase-orders/${params.id}`),
        fetch('/api/admin/bikes'),
        fetch('/api/admin/partners')
      ])

      if (purchaseOrderResponse.ok) {
        const purchaseOrderData = await purchaseOrderResponse.json()
        setPurchaseOrder(purchaseOrderData.data.purchaseOrder)
      } else {
        toast.error('Failed to fetch purchase order')
        router.push('/admin/purchase-orders')
        return
      }

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
      toast.error('Failed to load purchase order data')
      router.push('/admin/purchase-orders')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (purchaseOrderData: PurchaseOrderUpdate) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/admin/purchase-orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseOrderData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Purchase order updated successfully')
        router.push(`/admin/purchase-orders/${params.id}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update purchase order')
      }
    } catch (error) {
      console.error('Failed to update purchase order:', error)
      toast.error('Failed to update purchase order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/purchase-orders/${params.id}`)
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading purchase order data...</p>
        </div>
      </div>
    )
  }

  if (!purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Purchase order not found</p>
        </div>
      </div>
    )
  }

  return (
    <PurchaseOrderForm
      purchaseOrder={purchaseOrder}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      bikes={bikes}
      partners={partners}
    />
  )
}