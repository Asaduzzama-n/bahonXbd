"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, User, FileText, BarChart3, Eye } from "lucide-react"
import { Partner } from "@/lib/models"
import { PartnerCreate, partnerCreateSchema, PartnerUpdate } from "@/lib/validations"

import { useRouter } from "next/navigation"

interface PartnerFormProps {
  partner?: Partner
  onSubmit: (partnerData: PartnerCreate | PartnerUpdate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function PartnerForm({ partner, onSubmit, onCancel, isLoading = false }: PartnerFormProps) {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartnerCreate>({
    resolver: zodResolver(partnerCreateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      documents: {
        nid: "",
        drivingLicense: "",
        proofOfAddress: ""
      },
      profile: ""
    }
  })

  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (partner) {
      reset({
        name: partner.name || "",
        phone: partner.phone || "",
        email: partner.email || "",
        address: partner.address || "",
        documents: {
          nid: partner.documents?.nid || "",
          drivingLicense: partner.documents?.drivingLicense || "",
          proofOfAddress: partner.documents?.proofOfAddress || ""
        },
        profile: partner.profile || ""
      })
      setIsActive(partner.isActive)
    }
  }, [partner, reset])



  const onFormSubmit = async (data: PartnerCreate) => {
    try {
      const submitData = partner 
        ? { ...data, isActive } as PartnerUpdate
        : data as PartnerCreate
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleViewAnalytics = () => {
    if (partner?._id) {
      router.push(`/admin/partners/${partner._id}/analytics`)
    }
  }

  const handleViewDetails = () => {
    if (partner?._id) {
      router.push(`/admin/partners/${partner._id}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {partner ? 'Edit Partner' : 'Add New Partner'}
          </h1>
          <p className="text-muted-foreground">
            {partner ? 'Update partner information and details' : 'Create a new partner with all necessary details'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {partner && (
            <>
              <Button key="viewDetails" variant="outline" onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button key="viewAnalytics" variant="outline" onClick={handleViewAnalytics}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </>
          )}
          <Button key="back" variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors: {Object.values(errors).map((e) => (e as { message?: string })?.message).filter(Boolean).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Partner Information
            </CardTitle>
            <CardDescription>
              Enter the partner's details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter partner's full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Enter phone number"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter complete address"
                  className={errors.address ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message as string}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">Profile/Bio</Label>
              <Textarea
                id="profile"
                {...register('profile')}
                placeholder="Enter partner's profile or biography (optional)"
                rows={4}
              />
            </div>

            {/* Active/Inactive Toggle - Only for edit mode */}
            {partner && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-base font-medium">
                      Partner Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle to activate or deactivate this partner
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-orange-600'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Document Information
            </CardTitle>
            <CardDescription>
              Enter the partner's document details for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nid">National ID (NID) <span className="text-red-500">*</span></Label>
                <Input
                  id="nid"
                  {...register('documents.nid')}
                  placeholder="Enter NID number"
                  className={errors.documents?.nid ? "border-red-500" : ""}
                />
                {errors.documents?.nid && (
                  <p className="text-sm text-red-500">{errors.documents.nid.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="drivingLicense">Driving License <span className="text-red-500">*</span></Label>
                <Input
                  id="drivingLicense"
                  {...register('documents.drivingLicense')}
                  placeholder="Enter driving license number"
                  className={errors.documents?.drivingLicense ? "border-red-500" : ""}
                />
                {errors.documents?.drivingLicense && (
                  <p className="text-sm text-red-500">{errors.documents.drivingLicense.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofOfAddress">Proof of Address</Label>
                <Input
                  id="proofOfAddress"
                  {...register('documents.proofOfAddress')}
                  placeholder="Enter proof of address (optional)"
                  className={errors.documents?.proofOfAddress ? "border-red-500" : ""}
                />
                {errors.documents?.proofOfAddress && (
                  <p className="text-sm text-red-500">{errors.documents.proofOfAddress.message as string}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button key="cancel" type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button key="submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : partner ? 'Update Partner' : 'Create Partner'}
          </Button>
        </div>
      </form>
    </div>
  )
}