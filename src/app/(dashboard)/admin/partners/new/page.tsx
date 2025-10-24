"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PartnerForm from "@/components/partner-form"
import { PartnerCreate } from "@/lib/validations"

export default function NewPartner() {
  const router = useRouter()

  const handleSubmit = async (partnerData: PartnerCreate) => {
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Partner created successfully')
        router.push('/admin/partners')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to create partner')
      }
    } catch (error) {
      console.error('Failed to create partner:', error)
      toast.error('Failed to create partner')
    }
  }

  const handleCancel = () => {
    router.push('/admin/partners')
  }

  return (
    <div className="container mx-auto py-6">
      <PartnerForm
        onSubmit={(data) => handleSubmit(data as PartnerCreate)}
        onCancel={handleCancel}
      />
    </div>
  )
}