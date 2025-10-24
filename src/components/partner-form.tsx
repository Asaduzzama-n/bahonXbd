"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, AlertCircle, User, MapPin, FileText, BarChart3, Eye } from "lucide-react"
import { Partner } from "@/lib/models"
import { PartnerCreate, PartnerUpdate, partnerCreateSchema } from "@/lib/validations"
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
  const [formData, setFormData] = useState<Partial<PartnerCreate>>({
    name: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Bangladesh"
    },
    documents: {
      nid: "",
      drivingLicense: "",
      proofOfAddress: ""
    },
    profile: {
      bio: "",
      experience: "",
      specialization: ""
    }
  })

  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || "",
        phone: partner.phone || "",
        email: partner.email || "",
        address: {
          street: (partner.address as any)?.street || "",
          city: (partner.address as any)?.city || "",
          state: (partner.address as any)?.state || "",
          zipCode: (partner.address as any)?.zipCode || "",
          country: (partner.address as any)?.country || "Bangladesh"
        },
        documents: {
          nid: partner.documents?.nid || "",
          drivingLicense: partner.documents?.drivingLicense || "",
          proofOfAddress: partner.documents?.proofOfAddress || ""
        },
        profile: {
          bio: (partner.profile as any)?.bio || "",
          experience: (partner.profile as any)?.experience || "",
          specialization: (partner.profile as any)?.specialization || ""
        }
      })
      setIsActive(partner.isActive)
    }
  }, [partner])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }))

    // Clear error for this field
    const errorKey = `${parent}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    try {
      partnerCreateSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: FormErrors = {}
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
      }
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const submitData = partner 
        ? { ...formData, isActive } as PartnerUpdate
        : formData as PartnerCreate
      
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
              <Button variant="outline" onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button variant="outline" onClick={handleViewAnalytics}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onCancel}>
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
            Please fix the following errors: {Object.values(errors).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the partner's basic contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
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
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Enter the partner's complete address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.address?.street}
                    onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                    placeholder="Enter street address"
                    className={errors['address.street'] ? "border-red-500" : ""}
                  />
                  {errors['address.street'] && (
                    <p className="text-sm text-red-500">{errors['address.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address?.city}
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                      placeholder="Enter city"
                      className={errors['address.city'] ? "border-red-500" : ""}
                    />
                    {errors['address.city'] && (
                      <p className="text-sm text-red-500">{errors['address.city']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Division *</Label>
                    <Input
                      id="state"
                      value={formData.address?.state}
                      onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                      placeholder="Enter state or division"
                      className={errors['address.state'] ? "border-red-500" : ""}
                    />
                    {errors['address.state'] && (
                      <p className="text-sm text-red-500">{errors['address.state']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.address?.zipCode}
                      onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                      placeholder="Enter ZIP or postal code"
                      className={errors['address.zipCode'] ? "border-red-500" : ""}
                    />
                    {errors['address.zipCode'] && (
                      <p className="text-sm text-red-500">{errors['address.zipCode']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.address?.country}
                      onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                      placeholder="Enter country"
                      className={errors['address.country'] ? "border-red-500" : ""}
                    />
                    {errors['address.country'] && (
                      <p className="text-sm text-red-500">{errors['address.country']}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Document Information
                </CardTitle>
                <CardDescription>
                  Enter document numbers and references (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nid">National ID Number</Label>
                  <Input
                    id="nid"
                    value={formData.documents?.nid}
                    onChange={(e) => handleNestedInputChange('documents', 'nid', e.target.value)}
                    placeholder="Enter National ID number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivingLicense">Driving License Number</Label>
                  <Input
                    id="drivingLicense"
                    value={formData.documents?.drivingLicense}
                    onChange={(e) => handleNestedInputChange('documents', 'drivingLicense', e.target.value)}
                    placeholder="Enter driving license number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofOfAddress">Proof of Address</Label>
                  <Input
                    id="proofOfAddress"
                    value={formData.documents?.proofOfAddress}
                    onChange={(e) => handleNestedInputChange('documents', 'proofOfAddress', e.target.value)}
                    placeholder="Enter proof of address reference"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Additional profile details (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={formData.profile?.bio}
                    onChange={(e) => handleNestedInputChange('profile', 'bio', e.target.value)}
                    placeholder="Enter partner's biography"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.profile?.experience}
                    onChange={(e) => handleNestedInputChange('profile', 'experience', e.target.value)}
                    placeholder="Enter partner's experience"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.profile?.specialization}
                    onChange={(e) => handleNestedInputChange('profile', 'specialization', e.target.value)}
                    placeholder="Enter partner's specialization"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : partner ? 'Update Partner' : 'Create Partner'}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}