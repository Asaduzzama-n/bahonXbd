'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ExternalLink, Calculator, DollarSign } from 'lucide-react'
import { PurchaseOrder, Bike, Partner } from '@/lib/models'
import { purchaseOrderCreateSchema, type PurchaseOrderCreate } from '@/lib/validations'
import { z } from 'zod'

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}



export default function PurchaseOrderForm({ purchaseOrder, onSubmit, onCancel, isLoading }: PurchaseOrderFormProps) {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)
  const [autoCalculateProfit, setAutoCalculateProfit] = useState(true)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset
  } = useForm<PurchaseOrderCreate>({
    resolver: zodResolver(purchaseOrderCreateSchema as any),
    defaultValues: {
      bikeId: '',
      buyerName: '',
      buyerPhone: '',
      buyerEmail: '',
      buyerAddress: '',
      buyerDocs: {
        nid: '',
        drivingLicense: '',
        proofOfAddress: ''
      },
      amount: 0,
      profit: 0,
      partnersProfit: [],
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Cash',
      dueAmount: 0,
      dueDate: undefined,
      duePaymentReceivingDate: undefined,
      notes: ''
    }
  })

  // Watch form values for real-time updates
  const watchedValues = watch()

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load bikes
        const bikesResponse = await fetch('/api/admin/bikes')
        if (bikesResponse.ok) {
          const bikesData = await bikesResponse.json()
          setBikes(bikesData.data || [])
        }

        // Load partners
        const partnersResponse = await fetch('/api/admin/partners')
        if (partnersResponse.ok) {
          const partnersData = await partnersResponse.json()
          setPartners(partnersData.data || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  // Initialize form data from existing purchase order
  useEffect(() => {
    if (purchaseOrder) {
      reset({
        bikeId: typeof purchaseOrder.bikeId === 'string' ? purchaseOrder.bikeId : purchaseOrder.bikeId._id || '',
        buyerName: purchaseOrder.buyerName,
        buyerPhone: purchaseOrder.buyerPhone,
        buyerEmail: purchaseOrder.buyerEmail || '',
        buyerAddress: purchaseOrder.buyerAddress || '',
        buyerDocs: {
          nid: purchaseOrder.buyerDocs.nid,
          drivingLicense: purchaseOrder.buyerDocs.drivingLicense,
          proofOfAddress: purchaseOrder.buyerDocs.proofOfAddress || undefined
        },
        amount: purchaseOrder.amount,
        profit: purchaseOrder.profit,
        partnersProfit: purchaseOrder.partnersProfit.map(pp => ({
          partnerId: typeof pp.partnerId === 'string' ? pp.partnerId : pp.partnerId._id || '',
          profit: pp.profit,
          sharePercentage: pp.sharePercentage || 0
        })),
        status: purchaseOrder.status,
        paymentStatus: purchaseOrder.paymentStatus,
        paymentMethod: purchaseOrder.paymentMethod,
        dueAmount: purchaseOrder.dueAmount || 0,
        dueDate: purchaseOrder.dueDate ? new Date(purchaseOrder.dueDate) : undefined,
        duePaymentReceivingDate: purchaseOrder.duePaymentReceivingDate ? new Date(purchaseOrder.duePaymentReceivingDate) : undefined,
        notes: purchaseOrder.notes || undefined
      })
       
      setAutoCalculateProfit(false)
    }
  }, [purchaseOrder, reset])

  // Initialize partners profit when partners are loaded
  useEffect(() => {
    if (partners.length > 0 && watchedValues.partnersProfit.length === 0 && !purchaseOrder) {
      const initialPartnersProfit = partners.map(partner => ({
        partnerId: partner._id || '',
        profit: 0,
        sharePercentage: 0
      }))
      setValue('partnersProfit', initialPartnersProfit)
    }
  }, [partners, watchedValues.partnersProfit.length, purchaseOrder, setValue])

  // Load selected bike details
  useEffect(() => {
    if (watchedValues.bikeId && bikes.length > 0) {
      const bike = bikes.find(b => b._id === watchedValues.bikeId)
      setSelectedBike(bike || null)
    }
  }, [watchedValues.bikeId, bikes])

  // Auto-calculate profits when amount changes or auto-calculate is enabled
  useEffect(() => {
    if (autoCalculateProfit && selectedBike && watchedValues.amount > 0) {
      const totalProfit = watchedValues.amount - selectedBike.price
      
      // Calculate admin share (myShare)
      const adminShare = selectedBike.myShare || 0
      const adminProfit = (totalProfit * adminShare) / 100
      
      // Calculate partner profits based on their percentages from the bike
      const updatedPartnersProfit = watchedValues.partnersProfit.map(pp => {
        const bikePartner = selectedBike.partners?.find(p => 
          (typeof p.partnerId === 'string' ? p.partnerId : p.partnerId._id) === pp.partnerId
        )
        const partnerPercentage = bikePartner?.percentage || 0
        const partnerProfit = (totalProfit * partnerPercentage) / 100
        
        return {
          ...pp,
          profit: partnerProfit,
          sharePercentage: partnerPercentage
        }
      })

      setValue('profit', adminProfit)
      setValue('partnersProfit', updatedPartnersProfit)
    }
  }, [autoCalculateProfit, selectedBike, watchedValues.amount])

  // Helper function for partner profit calculations
  const handlePartnerProfitChange = (partnerId: string, field: 'profit' | 'sharePercentage', value: number) => {
    const totalProfit = selectedBike ? watchedValues.amount - selectedBike.price : 0
    
    const currentPartnersProfit = getValues('partnersProfit')
    const updatedPartnersProfit = currentPartnersProfit.map(pp => {
      if (pp.partnerId === partnerId) {
        if (field === 'profit') {
          // When profit changes, calculate new share percentage
          const newSharePercentage = totalProfit > 0 ? (value / totalProfit) * 100 : 0
          return {
            ...pp,
            profit: value,
            sharePercentage: Math.min(100, Math.max(0, newSharePercentage))
          }
        } else {
          // When share percentage changes, calculate new profit
          const newProfit = (totalProfit * value) / 100
          return {
            ...pp,
            profit: newProfit,
            sharePercentage: value
          }
        }
      }
      return pp
    })

    setValue('partnersProfit', updatedPartnersProfit)
  }

  const onFormSubmit = (data: PurchaseOrderCreate) => {
    const submitData = {
      ...data,
      buyerEmail: data.buyerEmail || undefined,
      buyerAddress: data.buyerAddress || undefined,
      buyerDocs: {
        ...data.buyerDocs,
        proofOfAddress: data.buyerDocs.proofOfAddress || undefined
      },
      dueDate: data.dueDate || undefined,
      duePaymentReceivingDate: data.duePaymentReceivingDate || undefined,
      notes: data.notes || undefined
    }

    onSubmit(submitData)
  }

  const getPartnerName = (partnerId: string) => {
    const partner = partners.find(p => p._id === partnerId)
    return partner?.name || 'Unknown Partner'
  }

  const getTotalPartnerProfit = () => {
    return (watchedValues.partnersProfit || []).reduce((sum, pp) => sum + pp.profit, 0)
  }

  const getNetProfit = () => {
    return (watchedValues.profit || 0) + getTotalPartnerProfit()
  }

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {purchaseOrder ? 'Edit Purchase Order' : 'Create New Purchase Order'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {purchaseOrder ? 'Update purchase order details' : 'Create a new purchase order for bike sale'}
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-card border rounded-lg p-3">
          <Switch
            checked={autoCalculateProfit}
            onCheckedChange={setAutoCalculateProfit}
            id="auto-calculate"
          />
          <Label htmlFor="auto-calculate" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <Calculator className="h-4 w-4" />
            <span>Auto Calculate</span>
          </Label>
        </div>
      </div>

   

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Purchase Order Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Purchase Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bike Selection - Full Width */}
            <div className="space-y-3">
              <Label htmlFor="bikeId" className="text-sm font-medium text-foreground">
                Select Bike <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="bikeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`w-full ${errors.bikeId ? 'border-destructive' : 'border-input'} bg-background`}>
                      <SelectValue placeholder="Choose a bike" />
                    </SelectTrigger>
                    <SelectContent>
                      {bikes.filter(bike => bike.status === 'available' || bike._id === field.value).map((bike) => (
                        <SelectItem key={bike._id} value={bike._id || ''}>
                          {bike.title} - ৳{bike.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bikeId && <p className="text-destructive text-sm mt-1">{errors.bikeId.message}</p>}
            </div>

            {/* Status Fields - Full Width on Mobile, Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-foreground">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-input bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="paymentStatus" className="text-sm font-medium text-foreground">Payment Status</Label>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-input bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Amount and Payment Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                  Selling Amount (৳) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  className={`${errors.amount ? 'border-destructive' : 'border-input'} bg-background`}
                  placeholder="0"
                />
                {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="paymentMethod" className="text-sm font-medium text-foreground">
                  Payment Method <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-input bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bkash">Bkash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="profit" className="text-sm font-medium text-foreground">Admin Profit (৳)</Label>
                <Input
                  id="profit"
                  type="number"
                  {...register('profit', { valueAsNumber: true })}
                  disabled={autoCalculateProfit}
                  className={`${errors.profit ? 'border-destructive' : 'border-input'} bg-background ${autoCalculateProfit ? 'opacity-60' : ''}`}
                  placeholder="0"
                />
                {errors.profit && <p className="text-destructive text-sm mt-1">{errors.profit.message}</p>}
              </div>
            </div>

            {/* Due Payment Fields - Only show for partial payments */}
            {watchedValues.paymentStatus === 'partial' && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-medium text-foreground">Due Payment Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="dueAmount" className="text-sm font-medium text-foreground">Due Amount (৳)</Label>
                    <Input
                      id="dueAmount"
                      type="number"
                      {...register('dueAmount', { valueAsNumber: true })}
                      className="border-input bg-background"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      {...register('dueDate')}
                      className="border-input bg-background"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="duePaymentReceivingDate" className="text-sm font-medium text-foreground">Due Payment Receiving Date</Label>
                    <Input
                      id="duePaymentReceivingDate"
                      type="date"
                      {...register('duePaymentReceivingDate')}
                      className="border-input bg-background"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buyer Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Buyer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="buyerName" className="text-sm font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buyerName"
                  {...register('buyerName')}
                  className={`${errors.buyerName ? 'border-destructive' : 'border-input'} bg-background`}
                  placeholder="Enter full name"
                />
                {errors.buyerName && <p className="text-destructive text-sm mt-1">{errors.buyerName.message}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="buyerPhone" className="text-sm font-medium text-foreground">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buyerPhone"
                  {...register('buyerPhone')}
                  className={`${errors.buyerPhone ? 'border-destructive' : 'border-input'} bg-background`}
                  placeholder="Enter phone number"
                />
                {errors.buyerPhone && <p className="text-destructive text-sm mt-1">{errors.buyerPhone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="buyerEmail" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  {...register('buyerEmail')}
                  className={`${errors.buyerEmail ? 'border-destructive' : 'border-input'} bg-background`}
                  placeholder="Enter email address"
                />
                {errors.buyerEmail && <p className="text-destructive text-sm mt-1">{errors.buyerEmail.message}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="buyerAddress" className="text-sm font-medium text-foreground">Address</Label>
                <Input
                  id="buyerAddress"
                  {...register('buyerAddress')}
                  className={`${errors.buyerAddress ? 'border-destructive' : 'border-input'} bg-background`}
                  placeholder="Enter address"
                />
                {errors.buyerAddress && <p className="text-destructive text-sm mt-1">{errors.buyerAddress.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="nid" className="text-sm font-medium text-foreground">
                  National ID <span className="text-destructive">*</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="nid"
                    {...register('buyerDocs.nid')}
                    className={`flex-1 ${errors.buyerDocs?.nid ? 'border-destructive' : 'border-input'} bg-background`}
                    placeholder="Enter NID number"
                  />
                  {watchedValues.buyerDocs?.nid && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(watchedValues.buyerDocs.nid, '_blank')}
                      className="shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.buyerDocs?.nid && <p className="text-destructive text-sm mt-1">{errors.buyerDocs.nid.message}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="drivingLicense" className="text-sm font-medium text-foreground">
                  Driving License <span className="text-destructive">*</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="drivingLicense"
                    {...register('buyerDocs.drivingLicense')}
                    className={`flex-1 ${errors.buyerDocs?.drivingLicense ? 'border-destructive' : 'border-input'} bg-background`}
                    placeholder="Enter license number"
                  />
                  {watchedValues.buyerDocs?.drivingLicense && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(watchedValues.buyerDocs.drivingLicense, '_blank')}
                      className="shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.buyerDocs?.drivingLicense && <p className="text-destructive text-sm mt-1">{errors.buyerDocs.drivingLicense.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners Profit Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-card-foreground">
              <DollarSign className="h-5 w-5" />
              <span>Partners Profit Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {partners.length > 0 ? (
              <div className="space-y-4">
                {partners.map((partner, index) => {
                  const partnerProfit = watchedValues.partnersProfit?.find(pp => pp.partnerId === partner._id)
                  if (!partnerProfit) return null

                  return (
                    <div key={partner._id} className="border border-border rounded-lg p-4 bg-muted/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="font-medium text-foreground">{partner.name}</h4>
                        <Badge variant="outline" className="w-fit">{partner.email}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor={`share-${partner._id}`} className="text-sm font-medium text-foreground">Share Percentage (%)</Label>
                          <Controller
                            name={`partnersProfit.${index}.sharePercentage` as const}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`share-${partner._id}`}
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={field.value}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0
                                  field.onChange(value)
                                  if (!autoCalculateProfit) {
                                    handlePartnerProfitChange(partner._id || '', 'sharePercentage', value)
                                  }
                                }}
                                disabled={autoCalculateProfit}
                                className={`${errors.partnersProfit ? 'border-destructive' : 'border-input'} bg-background ${autoCalculateProfit ? 'opacity-60' : ''}`}
                                placeholder="0"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`profit-${partner._id}`} className="text-sm font-medium text-foreground">Profit Amount (৳)</Label>
                          <Controller
                            name={`partnersProfit.${index}.profit` as const}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`profit-${partner._id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={field.value}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0
                                  field.onChange(value)
                                  if (!autoCalculateProfit) {
                                    handlePartnerProfitChange(partner._id || '', 'profit', value)
                                  }
                                }}
                                disabled={autoCalculateProfit}
                                className={`${errors.partnersProfit ? 'border-destructive' : 'border-input'} bg-background ${autoCalculateProfit ? 'opacity-60' : ''}`}
                                placeholder="0"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {errors.partnersProfit && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-destructive text-sm">{errors.partnersProfit.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No partners available</p>
              </div>
            )}

            <Separator className="my-6" />

            {/* Profit Summary */}
            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-lg text-foreground">Profit Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">Admin Profit:</span>
                  <span className="font-semibold text-foreground">৳{(watchedValues.profit || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">Total Partner Profit:</span>
                  <span className="font-semibold text-foreground">৳{getTotalPartnerProfit().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20 sm:col-span-2 lg:col-span-1">
                  <span className="font-medium text-foreground">Net Profit:</span>
                  <span className="font-bold text-primary text-lg">৳{getNetProfit().toLocaleString()}</span>
                </div>
              </div>
              {selectedBike && (
                <div className="mt-4 p-3 bg-background rounded-lg border space-y-1">
                  <p className="text-xs text-muted-foreground">Bike Price: ৳{selectedBike.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Selling Amount: ৳{(watchedValues.amount || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Profit: ৳{((watchedValues.amount || 0) - selectedBike.price).toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={4}
                className={`${errors.notes ? 'border-destructive' : 'border-input'} bg-background resize-none`}
                placeholder="Any additional notes or comments..."
              />
              {errors.notes && <p className="text-destructive text-sm mt-1">{errors.notes.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Saving...' : (purchaseOrder ? 'Update Order' : 'Create Order')}
          </Button>
        </div>
      </form>
    </div>
  )
}