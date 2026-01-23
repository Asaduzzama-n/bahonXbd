"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"

interface Review {
    id: number
    name: string
    company: string
    review: string
    rating: number
    image?: string
}

const featuredReview: Review = {
    id: 1,
    name: "Kamal Hossain",
    company: "Dhaka Motors",
    review: "BahonXBD changed the way I buy bikes. Their transparent pricing, quality bikes, and professional service made the entire process smooth and trustworthy.",
    rating: 5,
    image: "/kamal-hossain.png"
}

const reviews: Review[] = [
    {
        id: 2,
        name: "Rahman Ahmed",
        company: "Tech Solutions",
        review: "BahonXBD helps me stay updated with the best pre-owned bikes. The quality is exceptional.",
        rating: 5,
    },
    {
        id: 3,
        name: "Mina Hassan",
        company: "Digital Agency",
        review: "As a first-time buyer, BahonXBD made the process incredibly smooth and transparent.",
        rating: 5,
    },
    {
        id: 4,
        name: "Arif Khan",
        company: "StartupBD",
        review: "Real-time bike availability and transparent pricing keep me coming back to BahonXBD.",
        rating: 5,
    },
    {
        id: 5,
        name: "Sadia Akter",
        company: "Marketing Pro",
        review: "The best platform for buying quality second-hand bikes. Professional and reliable service.",
        rating: 5,
    },
    {
        id: 6,
        name: "Tariq Hasan",
        company: "Bike Enthusiast",
        review: "Excellent selection of bikes and honest dealers. Highly recommend BahonXBD to everyone.",
        rating: 5,
    },
]

export function CustomerTestimonials() {
    const [activeIndex, setActiveIndex] = useState(0)
    const visibleReviews = 3

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % reviews.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [])

    const getVisibleReviews = () => {
        const result = []
        for (let i = 0; i < visibleReviews; i++) {
            const index = (activeIndex + i) % reviews.length
            result.push(reviews[index])
        }
        return result
    }

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Trusted by Thousands
                        <span className="block mt-1">of Happy Users</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Real people, real results — see how BahonXBD is helping customers
                        find their perfect bike every day
                    </p>
                </div>

                {/* Main Featured Review */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
                    {/* Left - Featured Quote */}
                    <Card className="bg-card border-border p-8 lg:p-10 flex flex-col justify-center">
                        <Quote className="h-10 w-10 text-primary mb-6" />
                        <p className="text-2xl lg:text-3xl font-semibold text-foreground leading-relaxed mb-6">
                            {featuredReview.review}
                        </p>
                        <div className="mt-auto">
                            <p className="font-bold text-foreground text-lg">{featuredReview.name}</p>
                            <p className="text-muted-foreground">{featuredReview.company}</p>
                        </div>
                    </Card>

                    {/* Right - Image */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center min-h-[400px]">
                        <div className="absolute inset-0">
                            {featuredReview.image ? (
                                <img
                                    src={featuredReview.image}
                                    alt={featuredReview.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                                            <Star className="h-16 w-16 text-primary fill-primary" />
                                        </div>
                                        <p className="text-primary font-semibold text-xl">5-Star Service</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Rotating Reviews */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {getVisibleReviews().map((review, index) => (
                        <Card
                            key={review.id}
                            className="bg-card border-border p-6 transition-all duration-500 hover:shadow-lg"
                        >
                            <CardContent className="p-0">
                                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                                    {review.review}
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-primary font-semibold">
                                            {review.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{review.name}</p>
                                        <p className="text-xs text-muted-foreground">{review.company}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                ? "w-8 bg-primary"
                                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                            aria-label={`Go to review ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Stats */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">Over 1,000+ happy customers and counting</p>
                    <div className="flex justify-center items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <span className="font-semibold text-foreground">4.8/5 Average Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
