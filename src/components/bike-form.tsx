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
      title: "",
      description: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      condition: "good",
      mileage: 0,
      price: 0,
      myShare: 0,
      partners: [],
      images: [],
      features: [],
      availableDocs: [],
      specifications: {
        engine: "",
        transmission: "",
        fuelType: "",
        displacement: "",
        maxPower: "",
        maxTorque: "",
        topSpeed: "",
        fuelTank: "",
        weight: ""
      },
      serviceHistory: [],
      status: "active",
      isFeatured: false
    }
  })

  const watchedValues = watch()
  const [partners, setPartners] = useState<Partner[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [newDoc, setNewDoc] = useState("")
  const [newImage, setNewImage] = useState("")

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
        title: bike.title || "",
        description: bike.description || "",
        brand: bike.brand || "",
        model: bike.model || "",
        year: bike.year || new Date().getFullYear(),
        condition: bike.condition || "good",
        mileage: bike.mileage || 0,
        price: bike.price || 0,
        myShare: bike.myShare || 0,
        partners: formattedPartners,
        images: bike.images || [],
        features: bike.features || [],
        availableDocs: bike.availableDocs || [],
        specifications: bike.specifications || {},
        serviceHistory: bike.serviceHistory || [],
        status: bike.status || "active",
        isFeatured: bike.isFeatured || false
      })
    }
  }, [bike, reset])

  useEffect(() => {
    calculateMyShare()
  }, [watchedValues.price, watchedValues.partners])

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
    if (!watchedValues.price || !watchedValues.partners) return

    const totalPartnerPercentage = watchedValues.partners.reduce((sum, partner) => sum + partner.percentage, 0)
    const myPercentage = Math.max(0, 100 - totalPartnerPercentage)
    const myShare = (watchedValues.price * myPercentage) / 100

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

  const handleSpecificationChange = (field: string, value: string) => {
    const currentSpecs = watchedValues.specifications || {}
    setValue('specifications', {
      ...currentSpecs,
      [field]: value
    })
  }

  const addPartner = (partnerId: string, percentage: number) => {
    const partner = partners.find(p => p._id === partnerId)
    if (!partner) return

    const newPartner = { partnerId: partnerId, percentage }
    const currentPartners = watchedValues.partners || []
    setValue('partners', [...currentPartners, newPartner])
  }

  const removePartner = (index: number) => {
    const currentPartners = watchedValues.partners || []
    setValue('partners', currentPartners.filter((_, i) => i !== index))
  }

  const addToArray = (field: 'features' | 'availableDocs' | 'images', value: string) => {
    if (!value.trim()) return

    const currentArray = watchedValues[field] || []
    setValue(field, [...currentArray, value.trim()])

    if (field === 'features') setNewFeature("")
    if (field === 'availableDocs') setNewDoc("")
    if (field === 'images') setNewImage("")
  }

  const removeFromArray = (field: 'features' | 'availableDocs' | 'images', index: number) => {
    const currentArray = watchedValues[field] || []
    setValue(field, currentArray.filter((_, i) => i !== index))
  }

  const addServiceRecord = () => {
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      description: "",
      cost: 0
    }
    const currentHistory = watchedValues.serviceHistory || []
    setValue('serviceHistory', [...currentHistory, newRecord])
  }

  const updateServiceRecord = (index: number, field: string, value: any) => {
    const currentHistory = watchedValues.serviceHistory || []
    const updatedHistory = currentHistory.map((record, i) => 
      i === index ? { ...record, [field]: value } : record
    )
    setValue('serviceHistory', updatedHistory)
  }

  const removeServiceRecord = (index: number) => {
    const currentHistory = watchedValues.serviceHistory || []
    setValue('serviceHistory', currentHistory.filter((_, i) => i !== index))
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
                <Label htmlFor="year" className="text-sm font-medium text-foreground">
                  Year <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="mileage" className="text-sm font-medium text-foreground">
                  Mileage (km) <span className="text-destructive">*</span>
                </Label>
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

        {/* Technical Specifications */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="engine" className="text-sm font-medium text-foreground">Engine</Label>
                <Input
                  id="engine"
                  value={watchedValues.specifications?.engine || ""}
                  onChange={(e) => handleSpecificationChange('engine', e.target.value)}
                  placeholder="e.g., Single Cylinder, 4-Stroke"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="displacement" className="text-sm font-medium text-foreground">
                  Displacement {errors.specifications?.displacement && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="displacement"
                  value={watchedValues.specifications?.displacement || ""}
                  onChange={(e) => handleSpecificationChange('displacement', e.target.value)}
                  placeholder="e.g., 149.2cc"
                  className={`${errors.specifications?.displacement ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.specifications?.displacement && <p className="text-destructive text-sm mt-1">{errors.specifications?.displacement.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="transmission" className="text-sm font-medium text-foreground">Transmission</Label>
                <Input
                  id="transmission"
                  value={watchedValues.specifications?.transmission || ""}
                  onChange={(e) => handleSpecificationChange('transmission', e.target.value)}
                  placeholder="e.g., 6-Speed Manual"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="fuelType" className="text-sm font-medium text-foreground">Fuel Type</Label>
                <Input
                  id="fuelType"
                  value={watchedValues.specifications?.fuelType || ""}
                  onChange={(e) => handleSpecificationChange('fuelType', e.target.value)}
                  placeholder="e.g., Petrol, Octane"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="maxPower" className="text-sm font-medium text-foreground">Max Power</Label>
                <Input
                  id="maxPower"
                  value={watchedValues.specifications?.maxPower || ""}
                  onChange={(e) => handleSpecificationChange('maxPower', e.target.value)}
                  placeholder="e.g., 17.1 PS @ 9000 rpm"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="maxTorque" className="text-sm font-medium text-foreground">Max Torque</Label>
                <Input
                  id="maxTorque"
                  value={watchedValues.specifications?.maxTorque || ""}
                  onChange={(e) => handleSpecificationChange('maxTorque', e.target.value)}
                  placeholder="e.g., 14.4 Nm @ 7000 rpm"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="topSpeed" className="text-sm font-medium text-foreground">
                  Top Speed {errors.specifications?.topSpeed && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="topSpeed"
                  value={watchedValues.specifications?.topSpeed || ""}
                  onChange={(e) => handleSpecificationChange('topSpeed', e.target.value)}
                  placeholder="e.g., 135 km/h"
                  className={`${errors.specifications?.topSpeed ? 'border-destructive' : 'border-input'} bg-background`}
                />
                {errors.specifications?.topSpeed && <p className="text-destructive text-sm mt-1">{errors.specifications?.topSpeed.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="fuelTank" className="text-sm font-medium text-foreground">Fuel Tank Capacity</Label>
                <Input
                  id="fuelTank"
                  value={watchedValues.specifications?.fuelTank || ""}
                  onChange={(e) => handleSpecificationChange('fuelTank', e.target.value)}
                  placeholder="e.g., 12 liters"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="weight" className="text-sm font-medium text-foreground">Weight</Label>
                <Input
                  id="weight"
                  value={watchedValues.specifications?.weight || ""}
                  onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                  placeholder="e.g., 139 kg"
                  className="border-input bg-background"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Features</Label>
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., ABS, LED Headlight)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('features', newFeature))}
                  className="border-input bg-background"
                />
                <Button type="button" onClick={() => addToArray('features', newFeature)} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedValues.features?.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeFromArray('features', index)}
                  >
                    {feature} <Minus className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
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
                    const percentage = 10 // Default percentage
                    addPartner(partnerId, percentage)
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
                        <Label htmlFor={`percentage-${index}`} className="text-sm font-medium text-foreground">
                          Share Percentage (%) {errors.partners?.[index]?.percentage && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                          id={`percentage-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          value={partner.percentage}
                          onChange={(e) => {
                            const newPartners = [...(watchedValues.partners || [])]
                            newPartners[index].percentage = parseInt(e.target.value) || 0
                            setValue('partners', newPartners)
                          }}
                          className={`${errors.partners?.[index]?.percentage ? 'border-destructive' : 'border-input'} bg-background`}
                          placeholder="0"
                        />
                        {errors.partners?.[index]?.percentage && (
                          <p className="text-destructive text-sm mt-1">{errors.partners?.[index]?.percentage.message}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`share-${index}`} className="text-sm font-medium text-foreground">Share Amount (৳)</Label>
                        <Input
                          id={`share-${index}`}
                          type="number"
                          value={((watchedValues.price || 0) * partner.percentage / 100).toFixed(2)}
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
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">My Share:</span>
                  <span className="font-semibold text-foreground">৳{watchedValues.myShare?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">Total Partner Share:</span>
                  <span className="font-semibold text-foreground">{totalPartnerPercentage}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20 sm:col-span-2 lg:col-span-1">
                  <span className="font-medium text-foreground">My Percentage:</span>
                  <span className="font-bold text-primary text-lg">{myPercentage}%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded-lg border space-y-1">
                <p className="text-xs text-muted-foreground">Bike Price: ৳{watchedValues.price?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">My Share: {myPercentage}% (৳{watchedValues.myShare?.toLocaleString()})</p>
                <p className="text-xs text-muted-foreground">Total Partner Share: {totalPartnerPercentage}%</p>
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

            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Available Documents</Label>
              <div className="flex space-x-2">
                <Input
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  placeholder="Add document (e.g., Registration, Insurance)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('availableDocs', newDoc))}
                  className="border-input bg-background"
                />
                <Button type="button" onClick={() => addToArray('availableDocs', newDoc)} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedValues.availableDocs?.map((doc, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeFromArray('availableDocs', index)}
                  >
                    {doc} <Minus className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service History */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Service History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button type="button" onClick={addServiceRecord} variant="outline" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Service Record
            </Button>

            {watchedValues.serviceHistory && watchedValues.serviceHistory.length > 0 ? (
              <div className="space-y-4">
                {watchedValues.serviceHistory.map((record, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-muted/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="font-medium text-foreground">Service Record #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeServiceRecord(index)}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor={`date-${index}`} className="text-sm font-medium text-foreground">Date</Label>
                        <Input
                          id={`date-${index}`}
                          type="date"
                          value={record.date}
                          onChange={(e) => updateServiceRecord(index, 'date', e.target.value)}
                          className="border-input bg-background"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`cost-${index}`} className="text-sm font-medium text-foreground">Cost (৳)</Label>
                        <Input
                          id={`cost-${index}`}
                          type="number"
                          value={record.cost}
                          onChange={(e) => updateServiceRecord(index, 'cost', parseInt(e.target.value) || 0)}
                          min="0"
                          className="border-input bg-background"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`description-${index}`} className="text-sm font-medium text-foreground">Description</Label>
                        <Input
                          id={`description-${index}`}
                          value={record.description}
                          onChange={(e) => updateServiceRecord(index, 'description', e.target.value)}
                          placeholder="e.g., Oil change, brake pad replacement"
                          className="border-input bg-background"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No service records added yet</p>
              </div>
            )}
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