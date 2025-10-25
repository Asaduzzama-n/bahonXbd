"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, ShoppingCart, DollarSign, FileText, Calculator, Eye } from "lucide-react"
import { PurchaseOrder, Bike, Partner } from "@/lib/models"
import { PurchaseOrderCreate, PurchaseOrderUpdate, purchaseOrderCreateSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder
  onSubmit: (purchaseOrderData: PurchaseOrderCreate | PurchaseOrderUpdate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  bikes?: Bike[]
  partners?: Partner[]
}

interface FormData {
  bikeId: string
  partnersProfit: Array<{
    partnerId: string
    profit: number
    percentage?: number
    notes?: string
  }>
  buyerDocs?: {
    name: string
    phone: string
    email?: string
    address: string
    nid?: string
    drivingLicense?: string
  }
  amount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded'
  status: 'pending' | 'processing' | 'confirmed' | 'cancelled'
  notes?: string
}

interface FormErrors {
  [key: string]: string
}

export default function PurchaseOrderForm({ 
  purchaseOrder, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  bikes = [],
  partners = []
}: PurchaseOrderFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<FormData>>({
    bikeId: "",
    partnersProfit: [{
      partnerId: "",
      profit: 0,
      percentage: 0,
      notes: ""
    }],
    buyerDocs: {
      name: "",
      phone: "",
      email: "",
      address: "",
      nid: "",
      drivingLicense: ""
    },
    amount: 0,
    paymentStatus: "pending",
    status: "pending",
    notes: ""
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [calculatedProfit, setCalculatedProfit] = useState({
    grossProfit: 0,
    profitMargin: 0
  })

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        bikeId: purchaseOrder.bikeId?._id || purchaseOrder.bikeId || "",
        partnersProfit: purchaseOrder.partnersProfit || [{
          partnerId: "",
          profit: 0,
          percentage: 0,
          notes: ""
        }],
        buyerDocs: {
          name: purchaseOrder.buyerDocs?.name || "",
          phone: purchaseOrder.buyerDocs?.phone || "",
          email: purchaseOrder.buyerDocs?.email || "",
          address: purchaseOrder.buyerDocs?.address || "",
          nid: purchaseOrder.buyerDocs?.nid || "",
          drivingLicense: purchaseOrder.buyerDocs?.drivingLicense || ""
        },
        amount: purchaseOrder.amount || 0,
        paymentStatus: purchaseOrder.paymentStatus || "pending",
        status: purchaseOrder.status || "pending",
        notes: purchaseOrder.notes || ""
      })
    }
  }, [purchaseOrder])

  // Calculate profit whenever amount or partner profits change
  useEffect(() => {
    const amount = formData.amount || 0
    const totalPartnerProfit = formData.partnersProfit?.reduce((sum, partner) => sum + (partner.profit || 0), 0) || 0
    const grossProfit = amount - totalPartnerProfit
    const profitMargin = amount > 0 ? (grossProfit / amount) * 100 : 0

    setCalculatedProfit({
      grossProfit,
      profitMargin: Math.round(profitMargin * 100) / 100
    })
  }, [formData.amount, formData.partnersProfit])

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

  const handleBuyerDocsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      buyerDocs: {
        ...prev.buyerDocs!,
        [field]: value
      }
    }))
    
    // Clear error for this field
    const errorKey = `buyerDocs.${field}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handlePartnerProfitChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newPartnersProfit = [...(prev.partnersProfit || [])]
      newPartnersProfit[index] = {
        ...newPartnersProfit[index],
        [field]: value
      }
      return {
        ...prev,
        partnersProfit: newPartnersProfit
      }
    })
    
    // Clear error for this field
    const errorKey = `partnersProfit.${index}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addPartnerProfit = () => {
    setFormData(prev => ({
      ...prev,
      partnersProfit: [
        ...(prev.partnersProfit || []),
        { partnerId: "", profit: 0, percentage: 0, notes: "" }
      ]
    }))
  }

  const removePartnerProfit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partnersProfit: prev.partnersProfit?.filter((_, i) => i !== index) || []
    }))
  }

  const validateForm = () => {
    try {
      purchaseOrderCreateSchema.parse(formData)
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
      const submitData = formData as PurchaseOrderCreate | PurchaseOrderUpdate
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleViewDetails = () => {
    if (purchaseOrder?._id) {
      router.push(`/admin/purchase-orders/${purchaseOrder._id}`)
    }
  }

  const selectedBike = bikes.find(bike => bike._id === formData.bikeId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {purchaseOrder ? 'Edit Purchase Order' : 'Create New Purchase Order'}
          </h1>
          <p className="text-muted-foreground">
            {purchaseOrder ? 'Update purchase order information and details' : 'Create a new purchase order after a bike sale'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {purchaseOrder && (
            <Button variant="outline" onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Purchase Order Information
            </CardTitle>
            <CardDescription>
              Select the bike and partner for this purchase order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bikeId">Bike *</Label>
                <Select
                  value={formData.bikeId}
                  onValueChange={(value) => handleInputChange('bikeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bike" />
                  </SelectTrigger>
                  <SelectContent>
                    {bikes.map((bike) => (
                      <SelectItem key={bike._id} value={bike._id}>
                        {bike.make} {bike.model} ({bike.year}) - ${bike.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bikeId && <p className="text-sm text-red-500">{errors.bikeId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter total amount"
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => handleInputChange('paymentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Buyer Information
            </CardTitle>
            <CardDescription>
              Enter the buyer's details and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <Input
                  id="buyerName"
                  value={formData.buyerDocs?.name || ""}
                  onChange={(e) => handleBuyerDocsChange('name', e.target.value)}
                  placeholder="Enter buyer's full name"
                />
                {errors['buyerDocs.name'] && <p className="text-sm text-red-500">{errors['buyerDocs.name']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Phone *</Label>
                <Input
                  id="buyerPhone"
                  value={formData.buyerDocs?.phone || ""}
                  onChange={(e) => handleBuyerDocsChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors['buyerDocs.phone'] && <p className="text-sm text-red-500">{errors['buyerDocs.phone']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Email</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyerDocs?.email || ""}
                  onChange={(e) => handleBuyerDocsChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
                {errors['buyerDocs.email'] && <p className="text-sm text-red-500">{errors['buyerDocs.email']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerNid">NID Number</Label>
                <Input
                  id="buyerNid"
                  value={formData.buyerDocs?.nid || ""}
                  onChange={(e) => handleBuyerDocsChange('nid', e.target.value)}
                  placeholder="Enter NID number"
                />
                {errors['buyerDocs.nid'] && <p className="text-sm text-red-500">{errors['buyerDocs.nid']}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerAddress">Address *</Label>
              <Textarea
                id="buyerAddress"
                value={formData.buyerDocs?.address || ""}
                onChange={(e) => handleBuyerDocsChange('address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
              {errors['buyerDocs.address'] && <p className="text-sm text-red-500">{errors['buyerDocs.address']}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerDrivingLicense">Driving License</Label>
              <Input
                id="buyerDrivingLicense"
                value={formData.buyerDocs?.drivingLicense || ""}
                onChange={(e) => handleBuyerDocsChange('drivingLicense', e.target.value)}
                placeholder="Enter driving license number"
              />
              {errors['buyerDocs.drivingLicense'] && <p className="text-sm text-red-500">{errors['buyerDocs.drivingLicense']}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Partners Profit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Partners Profit Information
            </CardTitle>
            <CardDescription>
              Set profit distribution among partners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.partnersProfit?.map((partnerProfit, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Partner {index + 1}</h4>
                  {formData.partnersProfit!.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePartnerProfit(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partner *</Label>
                    <Select
                      value={partnerProfit.partnerId}
                      onValueChange={(value) => handlePartnerProfitChange(index, 'partnerId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner._id} value={partner._id}>
                            {partner.name} - {partner.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`partnersProfit.${index}.partnerId`] && (
                      <p className="text-sm text-red-500">{errors[`partnersProfit.${index}.partnerId`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Profit Amount *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={partnerProfit.profit || ""}
                      onChange={(e) => handlePartnerProfitChange(index, 'profit', parseFloat(e.target.value) || 0)}
                      placeholder="Enter profit amount"
                    />
                    {errors[`partnersProfit.${index}.profit`] && (
                      <p className="text-sm text-red-500">{errors[`partnersProfit.${index}.profit`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Profit Percentage</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={partnerProfit.percentage || ""}
                      onChange={(e) => handlePartnerProfitChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                      placeholder="Enter profit percentage"
                    />
                    {errors[`partnersProfit.${index}.percentage`] && (
                      <p className="text-sm text-red-500">{errors[`partnersProfit.${index}.percentage`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={partnerProfit.notes || ""}
                      onChange={(e) => handlePartnerProfitChange(index, 'notes', e.target.value)}
                      placeholder="Enter notes"
                    />
                    {errors[`partnersProfit.${index}.notes`] && (
                      <p className="text-sm text-red-500">{errors[`partnersProfit.${index}.notes`]}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPartnerProfit}
              className="w-full"
            >
              Add Another Partner
            </Button>

            {/* Profit Calculation Display */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="mr-2 h-4 w-4" />
                  Profit Calculation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className={`text-2xl font-bold ${calculatedProfit.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${calculatedProfit.grossProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className={`text-2xl font-bold ${calculatedProfit.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculatedProfit.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${(formData.amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Any additional information about this purchase order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
              {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (purchaseOrder ? 'Update Purchase Order' : 'Create Purchase Order')}
          </Button>
        </div>
      </form>
    </div>
  )
}