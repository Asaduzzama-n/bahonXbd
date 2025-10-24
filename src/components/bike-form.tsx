"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Bike, Partner } from "@/lib/models"

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
  const [formData, setFormData] = useState<Partial<Bike>>({
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
    isFeatured: false,
    ...bike
  })

  const [partners, setPartners] = useState<Partner[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [newFeature, setNewFeature] = useState("")
  const [newDoc, setNewDoc] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    calculateMyShare()
  }, [formData.price, formData.partners])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(data.partners || [])
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    }
  }

  const calculateMyShare = () => {
    if (!formData.price || !formData.partners) return

    const totalPartnerPercentage = formData.partners.reduce((sum, partner) => sum + partner.percentage, 0)
    const myPercentage = Math.max(0, 100 - totalPartnerPercentage)
    const myShare = (formData.price * myPercentage) / 100

    setFormData(prev => ({
      ...prev,
      myShare: Math.round(myShare)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Basic Information Validation
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description must be less than 2000 characters"
    }

    if (!formData.brand?.trim()) {
      newErrors.brand = "Brand is required"
    } else if (formData.brand.trim().length < 2) {
      newErrors.brand = "Brand must be at least 2 characters long"
    }

    if (!formData.model?.trim()) {
      newErrors.model = "Model is required"
    } else if (formData.model.trim().length < 1) {
      newErrors.model = "Model must be at least 1 character long"
    }

    const currentYear = new Date().getFullYear()
    if (!formData.year || formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Please enter a valid year between 1900 and ${currentYear + 1}`
    }

    if (formData.mileage === undefined || formData.mileage === null || formData.mileage < 0) {
      newErrors.mileage = "Mileage must be a positive number or zero"
    } else if (formData.mileage > 1000000) {
      newErrors.mileage = "Mileage seems unrealistic (over 1,000,000 km)"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    } else if (formData.price < 1000) {
      newErrors.price = "Price seems too low (minimum ৳1,000)"
    } else if (formData.price > 100000000) {
      newErrors.price = "Price seems too high (maximum ৳100,000,000)"
    }

    // Validate partners percentage
    const totalPercentage = formData.partners?.reduce((sum, partner) => sum + partner.percentage, 0) || 0
    if (totalPercentage > 100) {
      newErrors.partners = "Total partner percentage cannot exceed 100%"
    }

    // Validate partner percentages individually
    formData.partners?.forEach((partner, index) => {
      if (partner.percentage <= 0) {
        newErrors[`partner_${index}`] = "Partner percentage must be greater than 0"
      } else if (partner.percentage > 100) {
        newErrors[`partner_${index}`] = "Partner percentage cannot exceed 100%"
      }
    })

    // Validate images (if any)
    formData.images?.forEach((image, index) => {
      if (image && !isValidUrl(image)) {
        newErrors[`image_${index}`] = "Please enter a valid image URL"
      }
    })

    // Validate specifications (optional but if provided should be reasonable)
    if (formData.specifications?.displacement && !/^\d+(\.\d+)?\s*(cc|CC|ml|ML)?$/.test(formData.specifications.displacement)) {
      newErrors.displacement = "Displacement should be in format like '150cc' or '1200'"
    }

    if (formData.specifications?.topSpeed && (isNaN(Number(formData.specifications.topSpeed.replace(/[^\d.]/g, ''))) || Number(formData.specifications.topSpeed.replace(/[^\d.]/g, '')) > 500)) {
      newErrors.topSpeed = "Top speed should be a reasonable number (max 500 km/h)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }))
  }

  const addPartner = (partnerId: string, percentage: number) => {
    const partner = partners.find(p => p._id === partnerId)
    if (!partner) return

    const newPartner = { partnerId: partner, percentage }
    setFormData(prev => ({
      ...prev,
      partners: [...(prev.partners || []), newPartner]
    }))
  }

  const removePartner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners?.filter((_, i) => i !== index) || []
    }))
  }

  const addToArray = (field: 'features' | 'availableDocs' | 'images', value: string) => {
    if (!value.trim()) return

    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }))

    // Clear the input
    if (field === 'features') setNewFeature("")
    if (field === 'availableDocs') setNewDoc("")
    if (field === 'images') setNewImage("")
  }

  const removeFromArray = (field: 'features' | 'availableDocs' | 'images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }))
  }

  const addServiceRecord = () => {
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      description: "",
      cost: 0
    }
    setFormData(prev => ({
      ...prev,
      serviceHistory: [...(prev.serviceHistory || []), newRecord]
    }))
  }

  const updateServiceRecord = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      serviceHistory: prev.serviceHistory?.map((record, i) => 
        i === index ? { ...record, [field]: value } : record
      ) || []
    }))
  }

  const removeServiceRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceHistory: prev.serviceHistory?.filter((_, i) => i !== index) || []
    }))
  }

  const totalPartnerPercentage = formData.partners?.reduce((sum, partner) => sum + partner.percentage, 0) || 0
  const myPercentage = Math.max(0, 100 - totalPartnerPercentage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {bike ? 'Edit Bike' : 'Add New Bike'}
          </h1>
          <p className="text-muted-foreground">
            {bike ? 'Update bike information and details' : 'Create a new bike listing with all necessary details'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="media">Media & Docs</TabsTrigger>
            <TabsTrigger value="service">Service History</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about the bike
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Honda CBR 150R - Excellent Condition"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="e.g., Honda, Yamaha, Suzuki"
                      className={errors.brand ? "border-red-500" : ""}
                    />
                    {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g., CBR 150R, R15 V3"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km) *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                      min="0"
                      placeholder="e.g., 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (৳) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                      min="0"
                      placeholder="e.g., 250000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the bike, its condition, and any special features..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label htmlFor="featured">Featured Listing</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specifications */}
          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Enter detailed technical specifications of the bike
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="engine">Engine</Label>
                    <Input
                      id="engine"
                      value={formData.specifications?.engine || ""}
                      onChange={(e) => handleSpecificationChange('engine', e.target.value)}
                      placeholder="e.g., Single Cylinder, 4-Stroke"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displacement">Displacement</Label>
                    <Input
                      id="displacement"
                      value={formData.specifications?.displacement || ""}
                      onChange={(e) => handleSpecificationChange('displacement', e.target.value)}
                      placeholder="e.g., 149.2cc"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Input
                      id="transmission"
                      value={formData.specifications?.transmission || ""}
                      onChange={(e) => handleSpecificationChange('transmission', e.target.value)}
                      placeholder="e.g., 6-Speed Manual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Input
                      id="fuelType"
                      value={formData.specifications?.fuelType || ""}
                      onChange={(e) => handleSpecificationChange('fuelType', e.target.value)}
                      placeholder="e.g., Petrol, Octane"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPower">Max Power</Label>
                    <Input
                      id="maxPower"
                      value={formData.specifications?.maxPower || ""}
                      onChange={(e) => handleSpecificationChange('maxPower', e.target.value)}
                      placeholder="e.g., 17.1 PS @ 9000 rpm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTorque">Max Torque</Label>
                    <Input
                      id="maxTorque"
                      value={formData.specifications?.maxTorque || ""}
                      onChange={(e) => handleSpecificationChange('maxTorque', e.target.value)}
                      placeholder="e.g., 14.4 Nm @ 7000 rpm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topSpeed">Top Speed</Label>
                    <Input
                      id="topSpeed"
                      value={formData.specifications?.topSpeed || ""}
                      onChange={(e) => handleSpecificationChange('topSpeed', e.target.value)}
                      placeholder="e.g., 135 km/h"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelTank">Fuel Tank Capacity</Label>
                    <Input
                      id="fuelTank"
                      value={formData.specifications?.fuelTank || ""}
                      onChange={(e) => handleSpecificationChange('fuelTank', e.target.value)}
                      placeholder="e.g., 12 liters"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.specifications?.weight || ""}
                      onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                      placeholder="e.g., 139 kg"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., ABS, LED Headlight)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('features', newFeature))}
                    />
                    <Button type="button" onClick={() => addToArray('features', newFeature)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('features', index)}>
                        {feature} <Minus className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners */}
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Details</CardTitle>
                <CardDescription>
                  Configure partner shares and calculate your profit margin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* My Share Display */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">My Share</h3>
                      <p className="text-sm text-muted-foreground">Your percentage: {myPercentage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">৳{formData.myShare?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">from ৳{formData.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {errors.partners && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.partners}</AlertDescription>
                  </Alert>
                )}

                {/* Add Partner */}
                <div className="space-y-4">
                  <Label>Add Partner</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select onValueChange={(partnerId) => {
                      const percentage = 10 // Default percentage
                      addPartner(partnerId, percentage)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.filter(p => !formData.partners?.some(fp => 
                          typeof fp.partnerId === 'string' ? fp.partnerId === p._id : fp.partnerId._id === p._id
                        )).map((partner) => (
                          <SelectItem key={partner._id} value={partner._id!}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current Partners */}
                <div className="space-y-4">
                  <Label>Current Partners</Label>
                  {formData.partners?.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {typeof partner.partnerId === 'string' 
                            ? partners.find(p => p._id === partner.partnerId)?.name || 'Unknown Partner'
                            : partner.partnerId.name
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {typeof partner.partnerId === 'string'
                            ? partners.find(p => p._id === partner.partnerId)?.email || ''
                            : partner.partnerId.email
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={partner.percentage}
                            onChange={(e) => {
                              const newPartners = [...(formData.partners || [])]
                              newPartners[index].percentage = parseInt(e.target.value) || 0
                              handleInputChange('partners', newPartners)
                            }}
                            min="0"
                            max="100"
                            className="w-20"
                          />
                          <span className="text-sm">%</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">৳{((formData.price || 0) * partner.percentage / 100).toLocaleString()}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePartner(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!formData.partners || formData.partners.length === 0) && (
                    <p className="text-muted-foreground text-center py-8">No partners added yet</p>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Partner Share:</span>
                    <span>{totalPartnerPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>My Share:</span>
                    <span>{myPercentage}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media & Documents */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media & Documents</CardTitle>
                <CardDescription>
                  Add images and specify available documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Images */}
                <div className="space-y-4">
                  <Label>Images (URLs)</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Enter image URL"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('images', newImage))}
                    />
                    <Button type="button" onClick={() => addToArray('images', newImage)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images?.map((image, index) => (
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
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromArray('images', index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Documents */}
                <div className="space-y-4">
                  <Label>Available Documents</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newDoc}
                      onChange={(e) => setNewDoc(e.target.value)}
                      placeholder="Add document (e.g., Registration, Insurance)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('availableDocs', newDoc))}
                    />
                    <Button type="button" onClick={() => addToArray('availableDocs', newDoc)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.availableDocs?.map((doc, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeFromArray('availableDocs', index)}>
                        {doc} <Minus className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service History */}
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>
                  Track maintenance and repair records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button type="button" onClick={addServiceRecord} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service Record
                </Button>

                <div className="space-y-4">
                  {formData.serviceHistory?.map((record, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Service Record #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeServiceRecord(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={record.date}
                            onChange={(e) => updateServiceRecord(index, 'date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cost (৳)</Label>
                          <Input
                            type="number"
                            value={record.cost}
                            onChange={(e) => updateServiceRecord(index, 'cost', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-1">
                          <Label>Description</Label>
                          <Input
                            value={record.description}
                            onChange={(e) => updateServiceRecord(index, 'description', e.target.value)}
                            placeholder="e.g., Oil change, brake pad replacement"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!formData.serviceHistory || formData.serviceHistory.length === 0) && (
                    <p className="text-muted-foreground text-center py-8">No service records added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
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