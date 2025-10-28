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

import { Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Expense, Bike, Partner } from "@/lib/models"
import { expenseSchema } from "@/lib/validations"

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (expenseData: Partial<Expense>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  preselectedBikeId?: string
}

interface FormErrors {
  [key: string]: string
}

// Form type with date as string (before transformation)
type ExpenseFormInput = {
  bikeId: string
  title: string
  description: string
  type: "repair" | "maintenance" | "transportation" | "fuel" | "insurance" | "registration" | "other"
  amount: number
  date: string
  adjustBikePrice: boolean
  adjustPartnerShares: boolean
  partnerId?: string
  receiptImage?: string
  notes?: string
}

const expenseTypes = [
  { value: 'repair', label: 'Repair' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'registration', label: 'Registration' },
  { value: 'parts', label: 'Parts' },
  { value: 'labor', label: 'Labor' },
  { value: 'other', label: 'Other' }
]

export default function ExpenseForm({ 
  expense, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  preselectedBikeId 
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      bikeId: preselectedBikeId || "",
      title: "",
      description: "",
      type: "other",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      adjustBikePrice: false,
      adjustPartnerShares: false,
      partnerId: "",
      receiptImage: "",
      notes: ""
    }
  })

  const [bikes, setBikes] = useState<Bike[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [bikePartners, setBikePartners] = useState<Partner[]>([])
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isLoadingData, setIsLoadingData] = useState(true)

  const watchedValues = watch()

  // Initialize form with expense data if editing
  useEffect(() => {
    if (expense) {
      reset({
        bikeId: typeof expense.bikeId === 'string' ? expense.bikeId : expense.bikeId._id || '',
        title: expense.title,
        description: expense.description,
        type: expense.type,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
        adjustBikePrice: expense.adjustBikePrice || false,
        adjustPartnerShares: expense.adjustPartnerShares || false,
        partnerId: typeof expense.partnerId === 'string' ? expense.partnerId : expense.partnerId?._id || "",
        receiptImage: expense.receiptImage || "",
        notes: expense.notes || ""
      } as ExpenseFormInput)
    }
  }, [expense, reset])

  // Fetch bikes
  const fetchBikes = async () => {
    try {
      const response = await fetch('/api/admin/bikes')
      if (response.ok) {
        const data = await response.json()
        setBikes(Array.isArray(data.data) ? data.data : [])
      } else {
        console.error('Failed to fetch bikes:', response.statusText)
        setFormErrors(prev => ({ ...prev, bikes: 'Failed to load bikes' }))
      }
    } catch (error) {
      console.error('Error fetching bikes:', error)
      setFormErrors(prev => ({ ...prev, bikes: 'Failed to load bikes' }))
    }
  }

  // Fetch all partners
  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(Array.isArray(data.data?.partners) ? data.data.partners : [])
      } else {
        console.error('Failed to fetch partners:', response.statusText)
        setFormErrors(prev => ({ ...prev, partners: 'Failed to load partners' }))
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      setFormErrors(prev => ({ ...prev, partners: 'Failed to load partners' }))
    }
  }

  // Update bike partners when bike selection changes
  useEffect(() => {
    if (watchedValues.bikeId && bikes.length > 0) {
      const selectedBike = bikes.find(bike => bike._id === watchedValues.bikeId)
      console.log('Selected bike:', selectedBike)
      console.log('Available partners:', partners)
      
      if (selectedBike && selectedBike.partners && selectedBike.partners.length > 0) {
        const bikePartnerIds = selectedBike.partners.map(p => 
          typeof p.partnerId === 'string' ? p.partnerId : p.partnerId._id
        )
        console.log('Bike partner IDs:', bikePartnerIds)
        
        const filteredPartners = partners.filter(partner => 
          partner._id && bikePartnerIds.includes(partner._id)
        )
        console.log('Filtered partners:', filteredPartners)
        setBikePartners(filteredPartners)
      } else {
        console.log('No partners found for bike or bike has no partners')
        setBikePartners([])
      }
    } else {
      setBikePartners([])
    }
  }, [watchedValues.bikeId, bikes, partners])

  // Reset partner selection when bike changes
  useEffect(() => {
    if (watchedValues.bikeId && !expense) {
      setValue('partnerId', '')
    }
  }, [watchedValues.bikeId, setValue, expense])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true)
      await Promise.all([fetchBikes(), fetchPartners()])
      setIsLoadingData(false)
    }
    loadData()
  }, [])

  const onFormSubmit = async (data: ExpenseFormInput) => {
    try {
      setFormErrors({})
      
      // Convert date string to Date object
      const formattedData = {
        ...data,
        date: new Date(data.date),
        amount: Number(data.amount),
        partnerId: data.partnerId || undefined
      }

      await onSubmit(formattedData)
    } catch (error: any) {
      console.error('Form submission error:', error)
      setFormErrors({ submit: error.message || 'Failed to save expense' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h1>
          <p className="text-muted-foreground">
            {expense ? 'Update expense details' : 'Create a new expense record'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {formErrors.submit && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{formErrors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="bikeId" className="text-sm font-medium text-foreground">
                  Bike <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={watchedValues.bikeId} 
                  onValueChange={(value) => setValue('bikeId', value)}
                  disabled={isLoadingData}
                >
                  <SelectTrigger className="border-input bg-background">
                    <SelectValue placeholder={isLoadingData ? "Loading bikes..." : "Select a bike"} />
                  </SelectTrigger>
                  <SelectContent>
                    {bikes.length > 0 ? (
                      bikes.map((bike) => (
                        bike._id && (
                          <SelectItem key={bike._id} value={bike._id}>
                            <div className="flex flex-col">
                              <span className="font-medium truncate">{bike.title}</span>
                              <span className="text-xs text-muted-foreground truncate">
                                {bike.brand} {bike.model} ({bike.year})
                              </span>
                            </div>
                          </SelectItem>
                        )
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {isLoadingData ? "Loading..." : "No bikes available"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.bikeId && (
                  <p className="text-sm text-destructive">{errors.bikeId.message}</p>
                )}
                {formErrors.bikes && (
                  <p className="text-sm text-destructive">{formErrors.bikes}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-sm font-medium text-foreground">
                  Expense Type <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={watchedValues.type} 
                  onValueChange={(value) => setValue('type', value as any)}
                >
                  <SelectTrigger className="border-input bg-background">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Engine oil change, Brake pad replacement"
                className="border-input bg-background"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Detailed description of the expense"
                rows={3}
                className="border-input bg-background resize-none"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                  Amount (৳) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="border-input bg-background"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm font-medium text-foreground">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="border-input bg-background"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adjustment Options */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Adjustment Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">
                    Adjust Bike Purchase Price
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add this expense amount to the bike's purchase price
                  </p>
                </div>
                <Switch
                  checked={watchedValues.adjustBikePrice}
                  onCheckedChange={(checked) => setValue('adjustBikePrice', checked)}
                />
              </div>

              {/* Partner Share Adjustment - Always visible when bike is selected */}
              {watchedValues.bikeId && (
                <>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">
                        Adjust Partner Shares
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {bikePartners.length > 0 
                          ? "Adjust partner share amounts based on this expense"
                          : "No partners found for this bike"
                        }
                      </p>
                    </div>
                    <Switch
                      checked={watchedValues.adjustPartnerShares}
                      onCheckedChange={(checked) => setValue('adjustPartnerShares', checked)}
                      disabled={bikePartners.length === 0}
                    />
                  </div>

                  {watchedValues.adjustPartnerShares && bikePartners.length > 0 && (
                    <div className="space-y-3">
                      <Label htmlFor="partnerId" className="text-sm font-medium text-foreground">
                        Select Partner
                      </Label>
                      <Select 
                        value={watchedValues.partnerId} 
                        onValueChange={(value) => setValue('partnerId', value)}
                      >
                        <SelectTrigger className="border-input bg-background">
                          <SelectValue placeholder="Select a partner" />
                        </SelectTrigger>
                        <SelectContent>
                          {bikePartners.map((partner) => (
                            partner._id && (
                              <SelectItem key={partner._id} value={partner._id}>
                                {partner.name}
                              </SelectItem>
                            )
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.partnerId && (
                        <p className="text-sm text-destructive">{errors.partnerId.message}</p>
                      )}
                    </div>
                  )}

                  {watchedValues.adjustPartnerShares && bikePartners.length === 0 && (
                    <div className="p-4 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          This bike has no partners associated with it. Partner share adjustment is not available.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="receiptImage" className="text-sm font-medium text-foreground">
                Receipt Image URL
              </Label>
              <Input
                id="receiptImage"
                {...register('receiptImage')}
                placeholder="https://example.com/receipt.jpg"
                className="border-input bg-background"
              />
              {errors.receiptImage && (
                <p className="text-sm text-destructive">{errors.receiptImage.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes or comments"
                rows={3}
                className="border-input bg-background resize-none"
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
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
                {expense ? 'Update Expense' : 'Create Expense'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}