'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Settings, 
  Bike, 
  ShoppingCart,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
}

interface UserStats {
  totalListings: number
  activeBikes: number
  soldBikes: number
  totalOrders: number
  totalEarnings: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
    fetchUserStats()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name,
          phone: userData.phone || '',
        })
      } else if (response.status === 401) {
        router.push('/login')
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setSuccess('Profile updated successfully!')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setIsUpdating(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      setIsUpdating(false)
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setSuccess('Password updated successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setShowPasswordForm(false)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update password')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Access Denied</p>
            <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                        {user.isEmailVerified ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Account Type</Label>
                      <Input
                        id="role"
                        value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Bike className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalListings || 0}</div>
                  <p className="text-xs text-muted-foreground">Bikes you've listed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bikes</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeBikes || 0}</div>
                  <p className="text-xs text-muted-foreground">Currently for sale</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold Bikes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.soldBikes || 0}</div>
                  <p className="text-xs text-muted-foreground">Successfully sold</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">Bikes purchased</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳{stats?.totalEarnings?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">From bike sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Account created</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                      <Button onClick={() => setShowPasswordForm(true)}>
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Verification</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.isEmailVerified ? 'Your email is verified' : 'Please verify your email'}
                        </p>
                      </div>
                      {!user.isEmailVerified && (
                        <Button variant="outline">
                          Resend Verification
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          disabled={isUpdating}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          disabled={isUpdating}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          disabled={isUpdating}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}