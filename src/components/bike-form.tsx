"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Bike, Partner } from "@/lib/models"
import { bikeSchema, type BikeInput } from "@/lib/validations"

interface BikeFormProps {
  bike?: Bike
  onSubmit: (bikeData: Partial<Bike>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function BikeForm({ bike, onSubmit, onCancel, isLoading = false }: BikeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<BikeInput>({
    resolver: zodResolver(bikeSchema as any),
    defaultValues: {
      bikeNumber: "",
      chassisNumber: "",
      title: "",
      description: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      condition: "good",
      mileage: 0,
      price: 0,
      purchasePrice: 0,
      purchaseDate: new Date(),
      myShare: 0,
      partners: [],
      images: [],
      sellerInfo: {
        name: "",
        phone: "",
        email: "",
        address: ""
      },
      sellerAvailableDocs: {
        nid: "",
        drivingLicense: "",
        proofOfAddress: ""
      },
      bikeAvailableDocs: {
        taxToken: "",
        registration: "",
        insurance: "",
        fitnessReport: ""
      },
      status: "active",
      isFeatured: false
    }
  })

  const watchedValues = watch()
  const [partners, setPartners] = useState<Partner[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [newImage, setNewImage] = useState("")
  const [shareAmountInputs, setShareAmountInputs] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    if (bike) {
      // Convert any Partner objects to string IDs for form compatibility
      const formattedPartners = bike.partners?.map(partner => ({
        partnerId: typeof partner.partnerId === 'string' ? partner.partnerId : partner.partnerId._id || '',
        percentage: partner.percentage
      })) || []

      reset({
        bikeNumber: bike.bikeNumber || "",
        chassisNumber: bike.chassisNumber || "",
        title: bike.title || "",
        description: bike.description || "",
        brand: bike.brand || "",
        model: bike.model || "",
        year: bike.year || new Date().getFullYear(),
        condition: bike.condition || "good",
        mileage: bike.mileage || 0,
        price: bike.price || 0,
        purchasePrice: bike.purchasePrice || 0,
        purchaseDate: bike.purchaseDate || "",
        myShare: bike.myShare || 0,
        partners: formattedPartners,
        images: bike.images || [],
        sellerInfo: bike.sellerInfo || {
          name: "",
          phone: "",
          email: "",
          address: ""
        },
        sellerAvailableDocs: bike.sellerAvailableDocs || {
          nid: "",
          drivingLicense: "",
          proofOfAddress: ""
        },
        bikeAvailableDocs: bike.bikeAvailableDocs || {
          taxToken: "",
          registration: "",
          insurance: "",
          fitnessReport: ""
        },

        status: bike.status || "active",
        isFeatured: bike.isFeatured || false
      })
    }
  }, [bike, reset])

  useEffect(() => {
    calculateMyShare()
  }, [watchedValues.purchasePrice, watchedValues.partners])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched partners:', data.data?.partners || [])
        setPartners(data.data?.partners || [])
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    }
  }

  const calculateMyShare = () => {
    if (!watchedValues.purchasePrice || !watchedValues.partners) return

    const totalPartnerAmount = watchedValues.partners.reduce((sum, partner) => {
      const amount = (watchedValues.purchasePrice * partner.percentage) / 100
      return sum + amount
    }, 0)
    const myShare = Math.max(0, watchedValues.purchasePrice - totalPartnerAmount)

    setValue('myShare', Math.round(myShare))
  }

  const onFormSubmit = async (data: BikeInput) => {
    try {
      const payload = {
        ...data,
        partners: (data.partners || []).map((p) => ({
          partnerId: typeof p.partnerId === 'string' ? p.partnerId : (p.partnerId as any)?._id ?? '',
          percentage: Number(p.percentage) || 0,
        })),
      }
      await onSubmit(payload)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleSellerInfoChange = (field: string, value: string) => {
    const currentSellerInfo = watchedValues.sellerInfo || {}
    setValue('sellerInfo', {
      ...currentSellerInfo,
      [field]: value
    })
  }

  const handleSellerDocChange = (field: string, value: string) => {
    const currentSellerDocs = watchedValues.sellerAvailableDocs || {}
    setValue('sellerAvailableDocs', {
      ...currentSellerDocs,
      [field]: value
    })
  }

  const handleBikeDocChange = (field: string, value: string) => {
    const currentBikeDocs = watchedValues.bikeAvailableDocs || {}
    setValue('bikeAvailableDocs', {
      ...currentBikeDocs,
      [field]: value
    })
  }

  const addPartner = (partnerId: string, shareAmount: number = 50000) => {
    const partner = partners.find(p => p._id === partnerId)
    if (!partner) return

    // Calculate percentage from share amount
    const percentage = watchedValues.purchasePrice > 0 ? (shareAmount / watchedValues.purchasePrice) * 100 : 0
    const newPartner = { partnerId: partnerId, percentage: Math.min(100, Math.max(0, percentage)) }
    const currentPartners = watchedValues.partners || []
    setValue('partners', [...currentPartners, newPartner])
  }

  const removePartner = (index: number) => {
    const currentPartners = watchedValues.partners || []
    setValue('partners', currentPartners.filter((_, i) => i !== index))
  }

  const addToArray = (field: 'images', value: string) => {
    if (!value.trim()) return

    const currentArray = watchedValues[field] || []
    setValue(field, [...currentArray, value.trim()])

    if (field === 'images') setNewImage("")
  }

  const removeFromArray = (field: 'images', index: number) => {
    const currentArray = watchedValues[field] || []
    setValue(field, currentArray.filter((_, i) => i !== index))
  }



  const totalPartnerPercentage = watchedValues.partners?.reduce((sum, partner) => sum + partner.percentage, 0) || 0
  const myPercentage = Math.max(0, 100 - totalPartnerPercentage)

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {bike ? 'Edit Bike' : 'Create New Bike'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {bike ? 'Update bike information and details' : 'Create a new bike listing with all necessary details'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>



      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Honda CBR 150R - Excellent Condition"
                  className={`${errors.title ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="brand" className="text-sm font-medium text-foreground">
                  Brand <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="brand"
                  {...register('brand')}
                  placeholder="e.g., Honda, Yamaha, Suzuki"
                  className={`${errors.brand ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.brand && <p className="text-destructive text-sm mt-1">{errors.brand.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="model" className="text-sm font-medium text-foreground">
                  Model <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="model"
                  {...register('model')}
                  placeholder="e.g., CBR 150R, R15 V3"
                  className={`${errors.model ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.model && <p className="text-destructive text-sm mt-1">{errors.model.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="year" className="text-sm font-medium text-foreground">Year</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`${errors.year ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.year && <p className="text-destructive text-sm mt-1">{errors.year.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="bikeNumber" className="text-sm font-medium text-foreground">
                  Bike Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bikeNumber"
                  {...register('bikeNumber')}
                  placeholder="e.g., BK-001, BIKE-2024-001"
                  className={`${errors.bikeNumber ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.bikeNumber && <p className="text-destructive text-sm mt-1">{errors.bikeNumber.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="chassisNumber" className="text-sm font-medium text-foreground">Chassis Number</Label>
                <Input
                  id="chassisNumber"
                  {...register('chassisNumber')}
                  placeholder="e.g., MBLHA10AAJK123456"
                  className={`${errors.chassisNumber ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.chassisNumber && <p className="text-destructive text-sm mt-1">{errors.chassisNumber.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="condition" className="text-sm font-medium text-foreground">
                  Condition <span className="text-destructive">*</span>
                </Label>
                <Select value={watchedValues.condition} onValueChange={(value) => setValue('condition', value as "excellent" | "good" | "fair" | "poor")}>
                  <SelectTrigger className="w-full border-input bg-background">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="mileage" className="text-sm font-medium text-foreground">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  {...register('mileage', { valueAsNumber: true })}
                  min="0"
                  placeholder="e.g., 15000"
                  className={`${errors.mileage ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.mileage && <p className="text-destructive text-sm mt-1">{errors.mileage.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="price" className="text-sm font-medium text-foreground">
                  Price (৳) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  min="0"
                  placeholder="e.g., 250000"
                  className={`${errors.price ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.price && <p className="text-destructive text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="purchasePrice" className="text-sm font-medium text-foreground">
                  Purchase Price (৳) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  {...register('purchasePrice', { valueAsNumber: true })}
                  min="0"
                  placeholder="e.g., 200000"
                  className={`${errors.purchasePrice ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.purchasePrice && <p className="text-destructive text-sm mt-1">{errors.purchasePrice.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="purchaseDate" className="text-sm font-medium text-foreground">
                  Purchase Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  {...register('purchaseDate')}
                  className={`${errors.purchaseDate ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.purchaseDate && <p className="text-destructive text-sm mt-1">{errors.purchaseDate.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-foreground">Status</Label>
                <Select value={watchedValues.status} onValueChange={(value) => setValue('status', value as "active" | "sold" | "pending" | "inactive" | "available")}>
                  <SelectTrigger className="w-full border-input bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Detailed description of the bike, its condition, and any special features..."
                rows={4}
                className={`${errors.description ? 'border-destructive' : 'border-input'} bg-background resize-none`}
              />
              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex items-center space-x-3 bg-card border rounded-lg p-3">
              <Switch
                id="featured"
                checked={watchedValues.isFeatured}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
              <Label htmlFor="featured" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                <span>Featured Listing</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Seller Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Seller Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="sellerName" className="text-sm font-medium text-foreground">
                  Seller Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sellerName"
                  value={watchedValues.sellerInfo?.name || ""}
                  onChange={(e) => handleSellerInfoChange('name', e.target.value)}
                  placeholder="e.g., John Doe"
                  className={`${errors.sellerInfo?.name ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.sellerInfo?.name && <p className="text-destructive text-sm mt-1">{errors.sellerInfo?.name.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="sellerPhone" className="text-sm font-medium text-foreground">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sellerPhone"
                  value={watchedValues.sellerInfo?.phone || ""}
                  onChange={(e) => handleSellerInfoChange('phone', e.target.value)}
                  placeholder="e.g., +8801234567890"
                  className={`${errors.sellerInfo?.phone ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.sellerInfo?.phone && <p className="text-destructive text-sm mt-1">{errors.sellerInfo?.phone.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="sellerEmail" className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={watchedValues.sellerInfo?.email || ""}
                  onChange={(e) => handleSellerInfoChange('email', e.target.value)}
                  placeholder="e.g., john@example.com"
                  className={`${errors.sellerInfo?.email ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.sellerInfo?.email && <p className="text-destructive text-sm mt-1">{errors.sellerInfo?.email.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="sellerAddress" className="text-sm font-medium text-foreground">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sellerAddress"
                  value={watchedValues.sellerInfo?.address || ""}
                  onChange={(e) => handleSellerInfoChange('address', e.target.value)}
                  placeholder="e.g., Dhaka, Bangladesh"
                  className={`${errors.sellerInfo?.address ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.sellerInfo?.address && <p className="text-destructive text-sm mt-1">{errors.sellerInfo?.address.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Details */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-card-foreground">
              <span>Partnership Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Add Partner</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  onValueChange={(partnerId) => {
                    const defaultAmount = 50000 // Default share amount in BDT
                    addPartner(partnerId, defaultAmount)
                  }}
                >
                  <SelectTrigger className="w-full border-input bg-background">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners
                      .filter(p => !watchedValues.partners?.some(fp =>
                        fp.partnerId === p._id
                      ))
                      .map((partner) => (
                        <SelectItem key={partner._id} value={partner._id!}>
                          {partner.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {watchedValues.partners && watchedValues.partners.length > 0 ? (
              <div className="space-y-4">
                {watchedValues.partners.map((partner, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-muted/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="font-medium text-foreground">
                        {partners.find(p => p._id === partner.partnerId)?.name || 'Unknown Partner'}
                      </h4>
                      <Badge variant="outline" className="w-fit">
                        {partners.find(p => p._id === partner.partnerId)?.email || ''}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor={`share-${index}`} className="text-sm font-medium text-foreground">
                          Share Amount (৳) {errors.partners?.[index]?.percentage && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                          id={`share-${index}`}
                          type="number"
                          min="0"
                          max={watchedValues.purchasePrice || 0}
                          value={shareAmountInputs[index] !== undefined ? shareAmountInputs[index] : ((watchedValues.purchasePrice || 0) * partner.percentage / 100).toFixed(0)}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            // Update local state immediately for responsive UI
                            setShareAmountInputs(prev => ({
                              ...prev,
                              [index]: inputValue
                            }))
                          }}
                          onBlur={(e) => {
                            // Update form state when user finishes typing
                            const shareAmount = parseInt(e.target.value) || 0
                            const newPercentage = watchedValues.purchasePrice > 0 ? (shareAmount / watchedValues.purchasePrice) * 100 : 0
                            const newPartners = [...(watchedValues.partners || [])]
                            newPartners[index].percentage = Math.min(100, Math.max(0, newPercentage))
                            setValue('partners', newPartners)

                            // Clear local state after updating form
                            setShareAmountInputs(prev => {
                              const newState = { ...prev }
                              delete newState[index]
                              return newState
                            })
                          }}
                          onKeyDown={(e) => {
                            // Also update on Enter key
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                          }}
                          className={`${errors.partners?.[index]?.percentage ? 'border-destructive' : 'border-input'} bg-background`}
                          placeholder="0"
                        />
                        {errors.partners?.[index]?.percentage && (
                          <p className="text-destructive text-sm mt-1">{errors.partners?.[index]?.percentage.message}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`percentage-${index}`} className="text-sm font-medium text-foreground">Share Percentage (%)</Label>
                        <Input
                          id={`percentage-${index}`}
                          type="number"
                          value={partner.percentage.toFixed(2)}
                          disabled
                          className="border-input bg-background opacity-60"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePartner(index)}
                      className="w-full sm:w-auto"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove Partner
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No partners added yet</p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-lg text-foreground">Share Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-medium text-foreground">My Share:</span>
                  <span className="font-bold text-primary text-lg">৳{watchedValues.myShare?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">Total Partner Share:</span>
                  <span className="font-semibold text-foreground">৳{((watchedValues.purchasePrice || 0) - (watchedValues.myShare || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">My Percentage:</span>
                  <span className="font-semibold text-foreground">{myPercentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded-lg border space-y-1">
                <p className="text-xs text-muted-foreground">Purchase Price: ৳{watchedValues.purchasePrice?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">My Share: ৳{watchedValues.myShare?.toLocaleString()} ({myPercentage.toFixed(1)}%)</p>
                <p className="text-xs text-muted-foreground">Partner Share: ৳{((watchedValues.purchasePrice || 0) - (watchedValues.myShare || 0)).toLocaleString()} ({totalPartnerPercentage.toFixed(1)}%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Documents */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Media & Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Images (URLs)</Label>
              <div className="flex space-x-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('images', newImage))}
                  className="border-input bg-background"
                />
                <Button type="button" onClick={() => addToArray('images', newImage)} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {watchedValues.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Bike image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromArray('images', index)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    {errors.images?.[index] && (
                      <p className="text-destructive text-sm mt-1">{errors.images?.[index].message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Seller Documents */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Seller Documents (Links)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="sellerNid" className="text-sm font-medium text-foreground">
                    NID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sellerNid"
                    value={watchedValues.sellerAvailableDocs?.nid || ""}
                    onChange={(e) => handleSellerDocChange('nid', e.target.value)}
                    placeholder="Enter NID document link"
                    className={`${errors.sellerAvailableDocs?.nid ? 'border-destructive' : 'border-input'} bg-background`}
                  />
                  {errors.sellerAvailableDocs?.nid && <p className="text-destructive text-sm mt-1">{errors.sellerAvailableDocs?.nid.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sellerDrivingLicense" className="text-sm font-medium text-foreground">Driving License</Label>
                  <Input
                    id="sellerDrivingLicense"
                    value={watchedValues.sellerAvailableDocs?.drivingLicense || ""}
                    onChange={(e) => handleSellerDocChange('drivingLicense', e.target.value)}
                    placeholder="Enter driving license link"
                    className={`${errors.sellerAvailableDocs?.drivingLicense ? 'border-destructive' : 'border-input'} bg-background`}
                  />
                  {errors.sellerAvailableDocs?.drivingLicense && <p className="text-destructive text-sm mt-1">{errors.sellerAvailableDocs?.drivingLicense.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sellerProofOfAddress" className="text-sm font-medium text-foreground">Proof of Address</Label>
                  <Input
                    id="sellerProofOfAddress"
                    value={watchedValues.sellerAvailableDocs?.proofOfAddress || ""}
                    onChange={(e) => handleSellerDocChange('proofOfAddress', e.target.value)}
                    placeholder="Enter proof of address link"
                    className="border-input bg-background"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Bike Documents */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Bike Documents (Links)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="bikeTaxToken" className="text-sm font-medium text-foreground">Tax Token</Label>
                  <Input
                    id="bikeTaxToken"
                    value={watchedValues.bikeAvailableDocs?.taxToken || ""}
                    onChange={(e) => handleBikeDocChange('taxToken', e.target.value)}
                    placeholder="Enter tax token link"
                    className={`${errors.bikeAvailableDocs?.taxToken ? 'border-destructive' : 'border-input'} bg-background`}
                  />
                  {errors.bikeAvailableDocs?.taxToken && <p className="text-destructive text-sm mt-1">{errors.bikeAvailableDocs?.taxToken.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bikeRegistration" className="text-sm font-medium text-foreground">Registration</Label>
                  <Input
                    id="bikeRegistration"
                    value={watchedValues.bikeAvailableDocs?.registration || ""}
                    onChange={(e) => handleBikeDocChange('registration', e.target.value)}
                    placeholder="Enter registration link"
                    className={`${errors.bikeAvailableDocs?.registration ? 'border-destructive' : 'border-input'} bg-background`}
                  />
                  {errors.bikeAvailableDocs?.registration && <p className="text-destructive text-sm mt-1">{errors.bikeAvailableDocs?.registration.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bikeInsurance" className="text-sm font-medium text-foreground">Insurance</Label>
                  <Input
                    id="bikeInsurance"
                    value={watchedValues.bikeAvailableDocs?.insurance || ""}
                    onChange={(e) => handleBikeDocChange('insurance', e.target.value)}
                    placeholder="Enter insurance link"
                    className="border-input bg-background"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bikeFitnessReport" className="text-sm font-medium text-foreground">Fitness Report</Label>
                  <Input
                    id="bikeFitnessReport"
                    value={watchedValues.bikeAvailableDocs?.fitnessReport || ""}
                    onChange={(e) => handleBikeDocChange('fitnessReport', e.target.value)}
                    placeholder="Enter fitness report link"
                    className="border-input bg-background"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {bike ? 'Update Bike' : 'Create Bike'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}