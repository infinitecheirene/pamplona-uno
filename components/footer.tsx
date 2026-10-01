"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 mb-8 md:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
              <span className="bg-gradient-to-r from-brand-primary-400 via-brand-secondary-400 to-brand-accent-400 bg-clip-text text-transparent">
                Barangay Pamplona Uno
              </span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Delivering quality government services to Las Piñas City residents
            </p>
            
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/ilovepamplonatres"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary-500 hover:via-brand-secondary-500 hover:to-brand-accent-500 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.instagram.com/explore/locations/1034521926/barangay-pamplona-tres/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary-500 hover:via-brand-secondary-500 hover:to-brand-accent-500 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "News", href: "/news" },
                { label: "Announcements", href: "/announcements" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-secondary-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-secondary-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 md:gap-3 group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-r group-hover:from-brand-primary-500 group-hover:via-brand-secondary-500 group-hover:to-brand-accent-500 transition-all">
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <a
                  href="tel:(02) 8872-9664"
                  className="text-gray-300 text-sm hover:text-brand-secondary-400 transition-colors"
                >
                 (02) 8872-9664
                </a>
              </li>

              <li className="flex items-start gap-2 md:gap-3 group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-r group-hover:from-brand-primary-500 group-hover:via-brand-secondary-500 group-hover:to-brand-accent-500 transition-all">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <a
                  href="mailto:barangay.pamplonatres.lpc@gmail.com"
                  className="text-gray-300 text-sm hover:text-brand-secondary-400 transition-colors break-all"
                >
                  barangay.pamplonatres.lpc@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2 md:gap-3 group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-r group-hover:from-brand-primary-500 group-hover:via-brand-secondary-500 group-hover:to-brand-accent-500 transition-all">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1+Metals+Rd,+Las+Pi%C3%B1as,+Metro+Manila,+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-brand-secondary-400 transition-colors"
                >
                  1 Metals Rd., Camella 4A, Las Piñas, Philippines
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Barangay Pamplona Uno, Las Piñas City. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">Powered by</span>
              <a
                href="https://infinitechphil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-semibold bg-gradient-to-r from-brand-primary-400 via-brand-secondary-400 to-brand-accent-400 bg-clip-text text-transparent"
              >
                INFINITECH ADVERTISING
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}