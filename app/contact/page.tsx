"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import { useState } from "react";

function Map() {
  return (
    <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden rounded-2xl">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.5080063712476!2d120.97978174729064!3d14.455493844679417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cde32848c3d7%3A0xeeaef0ae39538a8b!2s1%20Metals%20Rd%2C%20Las%20Pi%C3%B1as%2C%201750%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1763974724562!5m2!1sen!2sph"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Pamplona Uno Barangay Office Location"
      />

      {/* Map overlay label */}
      <div className="absolute left-4 right-4 bottom-4 md:left-6 md:right-auto md:max-w-sm">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="font-bold text-gray-900 text-sm">
                Barangay Pamplona Uno
              </p>
              <p className="text-gray-600 text-xs leading-relaxed mt-1">
                P1 Metals Rd., Camella 4A, Las Piñas City, Metro Manila
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    setErrors({});

    const newErrors: {
      name?: string;
      email?: string;
    } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name cannot contain numbers.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "Your message has been sent successfully. Thank you for contacting Barangay Pamplona Uno.",
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            data.message ||
            "We were unable to send your message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message:
          "Something went wrong while sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus({
          type: null,
          message: "",
        });
      }, 5000);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      title: "Office Location",
      details: "P1 Metals Rd., Camella 4A, Las Piñas City, Metro Manila",
      description: "Visit the barangay office during office hours.",
      link: "https://maps.app.goo.gl/8kzbXckLdXSNE96z5",
      isExternal: true,
    },
    {
      icon: Phone,
      title: "Phone",
      details: "(02) 8872-9664",
      description: "Call us for general barangay inquiries.",
      link: "tel:+63288729664",
      isExternal: false,
    },
    {
      icon: Mail,
      title: "Email",
      details: "barangay.pamplonatres.lpc@gmail.com",
      description: "Send us your questions or concerns.",
      link: "mailto:barangay.pamplonatres.lpc@gmail.com",
      isExternal: false,
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Monday – Friday • 8:00 AM – 5:00 PM",
      description: "Please check official announcements for holiday schedules.",
      link: null,
      isExternal: false,
    },
  ];

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with pamplona Uno Community"
      image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=90"
    >
      {/* Contact Introduction */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-brand-secondary-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-accent-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-brand-secondary-100">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Send className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Send us a Message
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Fill out the form and our team will review your inquiry.
                    </p>
                  </div>
                </div>

                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-brand-accent-50 border border-brand-accent-200 text-brand-accent-800"
                        : "bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-800"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}

                    <p className="text-sm font-medium leading-relaxed">
                      {submitStatus.message}
                    </p>
                  </motion.div>
                )}

                <form
                  className="space-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (!/\d/.test(value)) {
                          setFormData({
                            ...formData,
                            name: value,
                          });

                          if (errors.name) {
                            setErrors({
                              ...errors,
                              name: undefined,
                            });
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!formData.name.trim()) {
                          setErrors({
                            ...errors,
                            name: "Please enter your full name.",
                          });
                        }
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl border bg-gray-50/50 outline-none transition ${
                        errors.name
                          ? "border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-100"
                          : "border-brand-secondary-200 focus:border-brand-secondary-500 focus:ring-2 focus:ring-brand-secondary-100"
                      }`}
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-sm text-brand-primary-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        });

                        if (errors.email) {
                          setErrors({
                            ...errors,
                            email: undefined,
                          });
                        }
                      }}
                      onBlur={() => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (
                          formData.email &&
                          !emailRegex.test(formData.email)
                        ) {
                          setErrors({
                            ...errors,
                            email: "Please enter a valid email address.",
                          });
                        }
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl border bg-gray-50/50 outline-none transition ${
                        errors.email
                          ? "border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-100"
                          : "border-brand-secondary-200 focus:border-brand-secondary-500 focus:ring-2 focus:ring-brand-secondary-100"
                      }`}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-sm text-brand-primary-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subject: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-secondary-200 bg-gray-50/50 outline-none focus:border-brand-secondary-500 focus:ring-2 focus:ring-brand-secondary-100 transition"
                      placeholder="What can we help you with?"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Message
                      </label>

                      <span className="text-xs text-gray-400">
                        {formData.message.length}/1000
                      </span>
                    </div>

                    <textarea
                      id="message"
                      rows={6}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-secondary-200 bg-gray-50/50 outline-none resize-none focus:border-brand-secondary-500 focus:ring-2 focus:ring-brand-secondary-100 transition"
                      placeholder="Tell us how we can assist you..."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>

                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Please avoid including passwords, financial information,
                    or other sensitive personal information in your message.
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {contactItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="group bg-white rounded-2xl p-5 shadow-lg border border-brand-secondary-100 transition-shadow hover:shadow-xl"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className="text-white" size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {item.title}
                        </h3>

                        {item.link ? (
                          <a
                            href={item.link}
                            target={
                              item.isExternal ? "_blank" : undefined
                            }
                            rel={
                              item.isExternal
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="inline-flex items-center gap-1 text-brand-secondary-600 hover:text-brand-secondary-700 text-sm font-medium mt-1 break-words transition-colors"
                          >
                            {item.details}

                            {item.isExternal && (
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            )}
                          </a>
                        ) : (
                          <p className="text-gray-700 text-sm font-medium mt-1">
                            {item.details}
                          </p>
                        )}

                        <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Quick Help Card */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-brand-secondary-600 via-brand-secondary-500 to-brand-accent-500 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Need quick assistance?
                    </h3>

                    <p className="text-white/80 text-sm leading-relaxed mt-2">
                      You can also use the Pamplona Uno Citizen Assistant for
                      information about services, requirements, office hours,
                      and community programs.
                    </p>

                    <p className="text-white/70 text-xs mt-3">
                      For emergencies, please call 911.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <a
                href="https://maps.app.goo.gl/8kzbXckLdXSNE96z5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-brand-secondary-600 text-brand-secondary-600 font-bold hover:bg-brand-secondary-600 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-2 md:p-3 shadow-xl border border-brand-secondary-100"
          >
            <Map />
          </motion.div>
        </div>
      </section>

      {/* Citizen Services CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-secondary-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-accent-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Access Barangay Services Online
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mt-5 max-w-3xl mx-auto">
              Save time by using our online citizen services. Create an
              account to submit requests, monitor applications, and access
              available barangay services from anywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/login">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 40px rgba(var(--brand-secondary-rgb), 0.25)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white font-bold shadow-md"
                >
                  Log In
                </motion.button>
              </Link>

              <Link href="/register">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-brand-secondary-600 text-brand-secondary-600 font-bold hover:bg-brand-secondary-50 transition-colors"
                >
                  Create an Account
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}