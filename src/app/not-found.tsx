"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Bike, ArrowLeft, SearchX } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <Card className="max-w-2xl w-full border-2 shadow-2xl">
                <CardContent className="pt-12 pb-10 px-6 sm:px-12">
                    <div className="text-center space-y-8">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                                <div className="relative bg-primary/10 p-6 rounded-full border-4 border-primary/30">
                                    <SearchX className="h-20 w-20 sm:h-24 sm:w-24 text-primary" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* 404 Text */}
                        <div className="space-y-3">
                            <h1 className="text-8xl sm:text-9xl font-black text-primary tracking-tight">
                                404
                            </h1>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Page Not Found
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
                                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto min-w-[160px]"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Go Back
                            </Button>
                            <Link href="/admin" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full min-w-[160px]">
                                    <Home className="mr-2 h-5 w-5" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/admin/bikes" className="w-full sm:w-auto">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full min-w-[160px]"
                                >
                                    <Bike className="mr-2 h-5 w-5" />
                                    View Bikes
                                </Button>
                            </Link>
                        </div>

                        {/* Helpful Links */}
                        <div className="pt-8 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-4">
                                Need help? Try these popular pages:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Link href="/admin/purchase-orders">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Purchase Orders
                                    </Button>
                                </Link>
                                <Link href="/admin/partners">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Partners
                                    </Button>
                                </Link>
                                <Link href="/admin/expenses">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Expenses
                                    </Button>
                                </Link>
                                <Link href="/admin/analytics">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Analytics
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
