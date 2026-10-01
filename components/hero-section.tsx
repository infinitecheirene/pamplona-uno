"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "80px",
      }}
    >
      {/* Background Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(var(--brand-secondary-rgb), 0.08) 0%, rgba(var(--brand-accent-rgb), 0.08) 100%)`,
          zIndex: 0,
        }}
      />

      {/* Animated Blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "300px",
            height: "300px",
            backgroundColor: "var(--brand-secondary-500)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(80px)",
            opacity: 0.15,
          }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "300px",
            height: "300px",
            backgroundColor: "var(--brand-accent-500)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(80px)",
            opacity: 0.15,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "24px" }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            style={{ display: "inline-block" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid var(--brand-secondary-600)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Sparkles style={{ width: "16px", height: "16px", color: "var(--brand-secondary-600)" }} />
              <span style={{ color: "var(--brand-secondary-600)", fontWeight: 600, fontSize: "14px" }}>
                Welcome to Barangay Pamplona Uno
              </span>
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            marginBottom: "24px",
            lineHeight: 1.2,
            background: "linear-gradient(to right, var(--brand-secondary-500), var(--brand-accent-500))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Community, Our Service
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: "18px",
            color: "rgba(0, 0, 0, 0.7)",
            maxWidth: "768px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "40px",
            lineHeight: 1.6,
          }}
        >
          Transparent, efficient government services at your fingertips. Connect with Barangay Pamplona Uno, access
          services easily, and be part of building a thriving community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingTop: "12px",
                paddingBottom: "12px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(to right, var(--brand-secondary-600), var(--brand-secondary-500))",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 15px rgba(var(--brand-secondary-rgb), 0.2)",
              }}
            >
              Explore Services
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingTop: "12px",
                paddingBottom: "12px",
                borderRadius: "8px",
                border: "2px solid var(--brand-accent-600)",
                background: "white",
                color: "var(--brand-accent-600)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
