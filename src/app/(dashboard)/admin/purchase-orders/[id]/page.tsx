"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PurchaseOrder } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar, User, Bike, Building2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

export default function PurchaseOrderDetails() {
  const router = useRouter()
  const params = useParams()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPurchaseOrder()
    }
  }, [params.id])

  const fetchPurchaseOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/purchase-orders/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setPurchaseOrder(data.data.purchaseOrder)
      } else {
        toast.error('Failed to fetch purchase order')
        router.push('/admin/purchase-orders')
      }
    } catch (error) {
      console.error('Failed to fetch purchase order:', error)
      toast.error('Failed to load purchase order')
      router.push('/admin/purchase-orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/admin/purchase-orders/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Purchase order deleted successfully')
        router.push('/admin/purchase-orders')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete purchase order')
      }
    } catch (error) {
      console.error('Failed to delete purchase order:', error)
      toast.error('Failed to delete purchase order')
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading purchase order...</p>
        </div>
      </div>
    )
  }

  if (!purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Purchase order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/purchase-orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Purchase Order Details</h1>
            <p className="text-muted-foreground">Order ID: {purchaseOrder._id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/purchase-orders/${params.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the purchase order.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={getStatusBadgeVariant(purchaseOrder.status)}>
                  {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Status:</span>
                <Badge variant={getPaymentStatusBadgeVariant(purchaseOrder.paymentStatus)}>
                  {purchaseOrder.paymentStatus.charAt(0).toUpperCase() + purchaseOrder.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Created:</span>
                <span>{new Date(purchaseOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Updated:</span>
                <span>{new Date(purchaseOrder.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">NID:</span>
                  {purchaseOrder?.buyerDocs?.nid ? (
                    <div className="mt-2">
                      <Image
                        src={purchaseOrder.buyerDocs.nid}
                        alt="NID"
                        width={200}
                        height={200}
                        className="rounded-md border"
                      />
                    </div>
                  ) : null}
                </div>

                <div>
                  <span className="font-medium">Proof of Address:</span>
                  {purchaseOrder?.buyerDocs?.proofOfAddress ? (
                    <div className="mt-2">
                      <Image
                        src={purchaseOrder.buyerDocs.proofOfAddress}
                        alt="Proof of Address"
                        width={200}
                        height={200}
                        className="rounded-md border"
                      />
                    </div>
                  ) : null}
                </div>

                <div>
                  <span className="font-medium">Driving License:</span>
                  {purchaseOrder?.buyerDocs?.drivingLicense ? (
                    <div className="mt-2">
                      <Image
                        src={purchaseOrder.buyerDocs.drivingLicense}
                        alt="Driving License"
                        width={200}
                        height={200}
                        className="rounded-md border"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Bike Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bike className="h-5 w-5 mr-2" />
                Bike Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Model:</span>
                  <p>{purchaseOrder.bikeId.model}</p>
                </div>
                <div>
                  <span className="font-medium">Brand:</span>
                  <p>{purchaseOrder.bikeId.brand}</p>
                </div>
                <div>
                  <span className="font-medium">Year:</span>
                  <p>{purchaseOrder.bikeId.year}</p>
                </div>
                <div>
                  <span className="font-medium">Engine:</span>
                  <p>{purchaseOrder.bikeId.specifications.engine}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Partner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Partner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {purchaseOrder.partnersProfit?.map((partnerProfit, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{partnerProfit.partnerId.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{partnerProfit.partnerId.phone}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <p>{partnerProfit.partnerId.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Profit:</span>
                      <p>Rs. {partnerProfit.profit.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Percentage:</span>
                      <p>{partnerProfit.percentage}%</p>
                    </div>
                  </div>
                  {partnerProfit.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p>{partnerProfit.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sale Price:</span>
                  <span className="font-medium">Rs. {purchaseOrder.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Partner Profit:</span>
                  <span className="font-medium">Rs. {purchaseOrder.totalPartnerProfit.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Partner Breakdown:</h4>
                  {purchaseOrder.partnersProfit?.map((partnerProfit, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{partnerProfit.partnerId.name}:</span>
                      <span>Rs. {partnerProfit.profit.toLocaleString()} ({partnerProfit.percentage}%)</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Profit:</span>
                  <span className="text-green-600">Rs. {purchaseOrder.netProfit.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/admin/purchase-orders/${params.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Purchase Order
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                Print Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}