"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Map, 
  Save, 
  Plus, 
  X,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { PublicInfo } from "@/lib/models"

interface AdminProfile extends PublicInfo {
  _id?: string
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    phone: [''],
    email: '',
    availableTimes: [''],
    location: '',
    map: '',
  })

  const [newPhone, setNewPhone] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data)
        setFormData({
          phone: data.data?.phone || [''],
          email: data.data?.email || '',
          availableTimes: data.data?.availableTimes || [''],
          location: data.data?.location || '',
          map: data.data?.map || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear messages
    if (error) setError('')
    if (success) setSuccess('')
  }

  const addPhone = () => {
    if (newPhone.trim()) {
      setFormData(prev => ({
        ...prev,
        phone: [...prev.phone.filter(p => p.trim()), newPhone.trim()]
      }))
      setNewPhone('')
    }
  }

  const removePhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index)
    }))
  }

  const updatePhone = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: prev.phone.map((phone, i) => i === index ? value : phone)
    }))
  }

  const addTime = () => {
    if (newTime.trim()) {
      setFormData(prev => ({
        ...prev,
        availableTimes: [...prev.availableTimes.filter(t => t.trim()), newTime.trim()]
      }))
      setNewTime('')
    }
  }

  const removeTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availableTimes: prev.availableTimes.filter((_, i) => i !== index)
    }))
  }

  const updateTime = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      availableTimes: prev.availableTimes.map((time, i) => i === index ? value : time)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const cleanPhones = formData.phone.filter(p => p.trim())
    const cleanTimes = formData.availableTimes.filter(t => t.trim())
    
    if (cleanPhones.length === 0) {
      setError('At least one phone number is required')
      return
    }
    
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    
    if (cleanTimes.length === 0) {
      setError('At least one available time is required')
      return
    }
    
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      setSuccess('')

      const updateData = {
        phone: cleanPhones,
        email: formData.email.trim(),
        availableTimes: cleanTimes,
        location: formData.location.trim(),
        map: formData.map.trim(),
      }

      const response = await fetch('/api/admin/profile', {
        method: profile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      if (data.success) {
        setProfile(data.data)
        setSuccess('Profile updated successfully!')
        
        // Refresh the form data
        setFormData({
          phone: data.data.phone || [''],
          email: data.data.email || '',
          availableTimes: data.data.availableTimes || [''],
          location: data.data.location || '',
          map: data.data.map || '',
        })
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground">
            Manage your public contact information and availability
          </p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Public Contact Information
          </CardTitle>
          <CardDescription>
            This information will be displayed to users for contacting your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Numbers Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <Label className="text-base font-medium">Phone Numbers *</Label>
              </div>
              
              <div className="space-y-2">
                {formData.phone.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => updatePhone(index, e.target.value)}
                      placeholder="Enter phone number"
                      className="flex-1"
                    />
                    {formData.phone.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhone(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Add another phone number"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhone())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhone}
                    disabled={!newPhone.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Email Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <Separator />

            {/* Available Times Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label className="text-base font-medium">Available Times *</Label>
              </div>
              
              <div className="space-y-2">
                {formData.availableTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={time}
                      onChange={(e) => updateTime(index, e.target.value)}
                      placeholder="e.g., Monday-Friday 9AM-6PM"
                      className="flex-1"
                    />
                    {formData.availableTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTime(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Add another time slot"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTime())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTime}
                    disabled={!newTime.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label htmlFor="location" className="text-base font-medium">Location *</Label>
              </div>
              <Textarea
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your business location/address"
                rows={3}
                required
              />
            </div>

            {/* Map Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <Label htmlFor="map" className="text-base font-medium">Map Link</Label>
              </div>
              <Input
                id="map"
                value={formData.map}
                onChange={(e) => handleInputChange('map', e.target.value)}
                placeholder="Enter Google Maps link or embed code (optional)"
              />
              <p className="text-sm text-muted-foreground">
                You can paste a Google Maps share link or embed code here
              </p>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="min-w-[120px]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Profile Preview */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Current Public Information</CardTitle>
            <CardDescription>
              This is how your contact information appears to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Phone Numbers
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.phone.map((phone, index) => (
                  <Badge key={index} variant="secondary">
                    {phone}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </h4>
              <Badge variant="secondary">{profile.email}</Badge>
            </div>

            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                Available Times
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.availableTimes.map((time, index) => (
                  <Badge key={index} variant="secondary">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Location
              </h4>
              <p className="text-sm text-muted-foreground">{profile.location}</p>
            </div>

            {profile.map && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Map className="h-4 w-4" />
                  Map
                </h4>
                <p className="text-sm text-muted-foreground break-all">{profile.map}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}