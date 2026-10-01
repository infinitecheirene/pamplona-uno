"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, MapPin, User, Phone, AlertCircle, Siren } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import CitizenLayout from "@/components/citizenLayout"
import { authClient } from "@/lib/auth"

export default function AmbulanceRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [detectedAddress, setDetectedAddress] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    emergency: "",
    notes: "",
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authClient.getCurrentUser()
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            phone: user.phone_number || "",
            address: user.address || "",
          }))
        } else {
          toast({
            title: "Authentication Required",
            description: "Please log in to continue.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile information.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingUserData(false)
      }
    }
    loadUserData()
  }, [toast, router])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(coords)

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'AmbulanceRequestApp/1.0'
                }
              }
            )
            const data = await response.json()
            
            if (data.display_name) {
              setDetectedAddress(data.display_name)
              if (!formData.address) {
                setFormData(prev => ({
                  ...prev,
                  address: data.display_name
                }))
              }
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error)
          }
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter your address manually.",
            variant: "destructive",
          })
        },
      )
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/emergency/ambulance", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
        return
      }

      if (response.ok && data.success) {
        toast({
          title: "Ambulance Request Submitted",
          description: `Request ID: ${data.data.requestId}. Estimated arrival: ${data.data.estimatedArrival}`,
        })
        
        setFormData(prev => ({
          ...prev,
          emergency: "",
          notes: "",
        }))
        
        setTimeout(() => {
          router.push("/dashboard/citizen/emergency/ambulance-requests")
        }, 2000)
      } else {
        toast({
          title: "Request Failed",
          description: data.message || "Failed to submit request. Please call emergency hotline.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting ambulance request:", error)
      toast({
        title: "Request Failed",
        description: "Failed to submit request. Please call emergency hotline.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const emergencyTypes = [
    { value: "cardiac", label: "Cardiac Arrest", icon: "❤️" },
    { value: "breathing", label: "Breathing Difficulty", icon: "🫁" },
    { value: "accident", label: "Accident", icon: "🚗" },
    { value: "medical", label: "Medical Emergency", icon: "🏥" },
    { value: "injury", label: "Severe Injury", icon: "🩹" },
    { value: "other", label: "Other", icon: "⚕️" },
  ]

  return (
    <CitizenLayout>
      {isLoadingUserData && (
        <div role="status" aria-label="Loading your information" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <p className="font-semibold text-gray-900">Loading your details</p>
            <div className="mt-4 space-y-3 animate-pulse">
              <div className="h-4 rounded bg-gray-100" />
              <div className="h-10 rounded-xl bg-gray-100" />
              <div className="h-10 rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <header className="flex items-start gap-3">
          <Link href="/emergency" aria-label="Back to emergency contacts" className="mt-1 rounded-xl p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Request an ambulance</h1>
            <p className="mt-2 text-gray-600">Share your location and the patient&apos;s details so responders can assist.</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.6fr)]">
            <aside className="space-y-4" aria-label="Emergency request information">
              {/* Location Card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-accent-50">
                    <MapPin className="h-6 w-6 text-brand-accent-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">Detected location</h2>
                  </div>
                </div>
                {location ? (
                  <div className="space-y-2">
                    <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-mono text-gray-800">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                    {detectedAddress && (
                      <p className="text-sm leading-relaxed text-gray-700">{detectedAddress}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 animate-pulse" role="status" aria-label="Detecting location">
                    <div className="h-4 rounded bg-gray-100" />
                    <div className="h-10 rounded-lg bg-gray-100" />
                  </div>
                )}
              </section>

              {/* Profile Card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50">
                    <User className="h-6 w-6 text-brand-secondary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Your contact details</h2>
                    <p className="text-sm text-gray-600">Review them before sending the request.</p>
                  </div>
                </div>
              </section>

              {/* Emergency Hotline */}
              <section className="rounded-2xl border-2 border-brand-primary-200 bg-brand-primary-50 p-5">
                <h2 className="mb-3 text-lg font-bold text-gray-900">Need urgent help?</h2>
                <a
                  href="tel:(043)288-8888"
                  className="flex min-h-14 items-center justify-center gap-3 rounded-xl bg-brand-primary-600 px-5 py-3 font-bold text-white hover:bg-brand-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  (043) 288-8888
                </a>
              </section>

              {/* Warning */}
              <section className="rounded-2xl border-2 border-brand-primary-200 bg-brand-primary-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary-600" aria-hidden="true" />
                  <div>
                    <h2 className="mb-1 text-sm font-bold text-brand-primary-900">For emergencies only</h2>
                    <p className="text-sm text-brand-primary-700">Use this form for urgent medical needs. False requests can delay help for others.</p>
                  </div>
                </div>
              </section>
            </aside>

            {/* Right Column - Form */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 text-2xl font-bold text-gray-800">Request details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Phone - 2 columns */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="ambulance-name" className="block text-sm font-semibold text-gray-900 mb-2">Full name (required)</label>
                      <input
                        id="ambulance-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="ambulance-phone" className="block text-sm font-semibold text-gray-900 mb-2">Contact number (required)</label>
                      <input
                        id="ambulance-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="09XX XXX XXXX"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="ambulance-address" className="block text-sm font-semibold text-gray-900 mb-2">Exact address (required)</label>
                    <textarea
                      id="ambulance-address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, barangay, or nearby landmark"
                      rows={3}
                      className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
                    />
                  </div>

                  {/* Emergency Type */}
                  <fieldset>
                    <legend className="block text-sm font-semibold text-gray-900 mb-3">Type of emergency (required)</legend>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {emergencyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          aria-pressed={formData.emergency === type.value}
                          onClick={() => setFormData({ ...formData, emergency: type.value })}
                          className={`rounded-xl border p-4 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                            formData.emergency === type.value
                              ? "border-brand-primary-600 bg-brand-primary-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="text-3xl mb-2" aria-hidden="true">{type.icon}</div>
                          <div className={`text-sm font-semibold ${
                            formData.emergency === type.value ? "text-brand-primary-700" : "text-gray-700"
                          }`}>
                            {type.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Notes */}
                  <div>
                    <label htmlFor="ambulance-notes" className="block text-sm font-semibold text-gray-900 mb-2">Additional notes (optional)</label>
                    <textarea
                      id="ambulance-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Patient condition, floor number, special instructions..."
                      rows={3}
                      className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !location || isLoadingUserData}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary-600 px-6 py-3 font-bold text-white hover:bg-brand-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending request...
                      </>
                    ) : (
                      <>
                        <Siren className="w-5 h-5" aria-hidden="true" />
                        Request ambulance
                      </>
                    )}
                  </button>
                </form>
            </section>
          </div>
      </div>
    </CitizenLayout>
  )
}