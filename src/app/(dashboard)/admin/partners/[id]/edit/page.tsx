"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import PartnerForm from "@/components/partner-form"
import { Partner } from "@/lib/models"
import { PartnerUpdate } from "@/lib/validations"

export default function EditPartner() {
  const params = useParams()
  const router = useRouter()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)

  const partnerId = params.id as string

  useEffect(() => {
    if (partnerId) {
      fetchPartner()
    }
  }, [partnerId])

  const fetchPartner = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/partners/${partnerId}`)
      if (response.ok) {
        const data = await response.json()
        setPartner(data.data)
      } else {
        toast.error('Failed to fetch partner details')
        router.push('/admin/partners')
      }
    } catch (error) {
      console.error('Failed to fetch partner:', error)
      toast.error('Failed to fetch partner details')
      router.push('/admin/partners')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (partnerData: PartnerUpdate) => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Partner updated successfully')
        router.push('/admin/partners')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update partner')
      }
    } catch (error) {
      console.error('Failed to update partner:', error)
      toast.error('Failed to update partner')
    }
  }

  const handleCancel = () => {
    router.push('/admin/partners')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Partner not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PartnerForm
        partner={partner}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}