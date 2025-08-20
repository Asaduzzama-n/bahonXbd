import Link from "next/link"
import { Bike, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="BahonXBD" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xl font-bold text-orange-400">BahonXBD</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted platform for buying and selling premium motorcycles. Quality bikes, transparent deals, and professional service you can trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/bike-wash" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Bike Wash Services
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Sell Your Bike
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Financing Options
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-slate-300 text-sm">✓ Bike Inspection & Verification</li>
              <li className="text-slate-300 text-sm">✓ Professional Photography</li>
              <li className="text-slate-300 text-sm">✓ Documentation Support</li>
              <li className="text-slate-300 text-sm">✓ Premium Bike Wash</li>
              <li className="text-slate-300 text-sm">✓ Market Price Evaluation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">
                  House 15, Road 7, Dhanmondi, Dhaka 1205
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">+880 1712-345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">info@bahonxbd.com</span>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="pt-2">
              <h4 className="font-medium text-orange-400 mb-2">Business Hours</h4>
              <div className="text-slate-300 text-sm space-y-1">
                <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                <div>Sunday: 10:00 AM - 6:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 BahonXBD. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}