"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, MapPin, Settings, Eye } from "lucide-react"
import { BikeWashLocation } from "@/lib/models"
import { BikeWashLocationCreate, bikeWashLocationCreateSchema, BikeWashLocationUpdate } from "@/lib/validations"
import { z } from "zod"
import { useRouter } from "next/navigation"

interface BikeWashLocationFormProps {
  location?: BikeWashLocation
  onSubmit: (locationData: BikeWashLocationCreate | BikeWashLocationUpdate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function BikeWashLocationForm({ location, onSubmit, onCancel, isLoading = false }: BikeWashLocationFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BikeWashLocationCreate>({
    location: "",
    map: "",
    price: 0,
    features: [],
    status: "active"
  })
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [featuresInput, setFeaturesInput] = useState("")

  // Initialize form data when location prop changes
  useEffect(() => {
    if (location) {
      setFormData({
        location: location.location,
        map: location.map,
        price: location.price,
        features: location.features,
        status: location.status
      })
      setIsActive(location.status === "active")
      setFeaturesInput(location.features.join(", "))
    }
  }, [location])

  const handleInputChange = (field: keyof BikeWashLocationCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFeaturesChange = (value: string) => {
    setFeaturesInput(value)
    const featuresArray = value.split(",").map(feature => feature.trim()).filter(feature => feature.length > 0)
    setFormData(prev => ({
      ...prev,
      features: featuresArray
    }))
  }

  const validateForm = (): boolean => {
    try {
      bikeWashLocationCreateSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.issues.forEach((err) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (location) {
        // For updates, include the status from the switch
        const updateData: BikeWashLocationUpdate = {
          ...formData,
          status: isActive ? "active" : "inactive"
        }
        await onSubmit(updateData)
      } else {
        await onSubmit(formData)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleViewDetails = () => {
    if (location?._id) {
      router.push(`/admin/bike-wash-locations/${location._id}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {location ? 'Edit Bike Wash Location' : 'Add New Bike Wash Location'}
          </h1>
          <p className="text-muted-foreground">
            {location ? 'Update bike wash location information and details' : 'Create a new bike wash location with all necessary details'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {location && (
            <Button key="viewDetails" variant="outline" onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
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
            Please fix the following errors: {Object.values(errors).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>
              Enter the bike wash location details and address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location name (e.g., Dhanmondi Branch)"
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  placeholder="Enter price in Taka (৳)"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="map">Map URL/Address *</Label>
              <Textarea
                id="map"
                value={formData.map}
                onChange={(e) => handleInputChange('map', e.target.value)}
                placeholder="Enter Google Maps URL or detailed address"
                className={errors.map ? "border-red-500" : ""}
                rows={3}
              />
              {errors.map && (
                <p  className="text-sm text-red-500">{errors.map}</p>
              )}
            </div>

            {/* Status Toggle - Only for edit mode */}
            {location && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="status" className="text-base font-medium">
                      Location Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle to activate or deactivate this location
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
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

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Features & Services
            </CardTitle>
            <CardDescription>
              List the features and services available at this location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="features">Features *</Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                placeholder="Enter features separated by commas (e.g., High Pressure Wash, Foam Cleaning, Tire Cleaning, Interior Cleaning)"
                className={errors.features ? "border-red-500" : ""}
                rows={4}
              />
              {errors.features && (
                <p className="text-sm text-red-500">{errors.features}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Separate multiple features with commas. Current features: {formData.features.length}
              </p>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button key="cancel" type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button key="submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
          </Button>
        </div>
      </form>
    </div>
  )
}