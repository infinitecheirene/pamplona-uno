"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const CTALinks = [
  { href: "/services", Label: "Services" },
  { href: "/contact", Label: "Contact" },
]

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white shadow-2xl">
      <div className="text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            style={{
              backgroundImage: "linear-gradient(90deg, var(--brand-primary-600), var(--brand-secondary-500), var(--brand-accent-500), var(--brand-primary-600))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Access Government Services Easily
          </motion.h2>

          <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            Fast, secure, and hassle-free document processing. <br />
            <i>
              Request certificates, permits, and official records online — no long lines, no delays. <br />
              Stay updated and complete your transactions in just a few steps.
            </i>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(var(--brand-secondary-rgb), 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border-2 border-brand-secondary-600 bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white font-bold relative overflow-hidden"
              >
                <span className="relative z-10">Services</span>
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--brand-secondary-rgb), 0.12)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border-2 border-brand-secondary-600 text-brand-secondary-600 font-bold transition-colors"
              >
                Contact
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
