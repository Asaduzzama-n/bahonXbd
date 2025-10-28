import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, CheckCircle, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="BahonXBD" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xl font-bold text-primary">BahonXBD</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted platform for buying and selling premium motorcycles. Quality bikes, transparent deals, and professional service you can trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/bike-wash" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Bike Wash Services
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Sell Your Bike
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Financing Options
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Our Services</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Bike Inspection & Verification</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Professional Photography</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Documentation Support</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Premium Bike Wash</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                <span>Market Price Evaluation</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@bahonxbd.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="text-xs">Mon-Sat: 9AM-8PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 BahonXBD. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}