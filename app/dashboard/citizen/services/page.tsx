"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import CitizenLayout from "@/components/citizenLayout";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const serviceCategories = [
    {
      title: "Government Services",
      services: [
        {
          name: "Business Permit",
          description: "Apply for business permits",
          icon: "📋",
          path: "/dashboard/citizen/services/business-permit",
        },
        {
          name: "Building Permit",
          description: "Construction permits",
          icon: "🏗️",
          path: "/dashboard/citizen/services/building-permit",
        },
        {
          name: "Cedula",
          description: "Community tax certificate",
          icon: "📄",
          path: "/dashboard/citizen/services/cedula",
        },
        {
          name: "Marriage License",
          description: "Apply for marriage license",
          icon: "💍",
          path: "/dashboard/citizen/services/marriage-license",
        },
        {
          name: "Residency Certificate",
          description: "Proof of residency certification",
          icon: "🏠",
          path: "/dashboard/citizen/services/residency-certificate",
        },
        {
          name: "Good Moral Certificate",
          description: "Certificate of good moral character",
          icon: "⭐",
          path: "/dashboard/citizen/services/good-moral-certificate",
        },
        {
          name: "Certificate of Indigency",
          description: "Financial assistance qualification certificate",
          icon: "💰",
          path: "/dashboard/citizen/services/certificate-of-indigency",
        },
      ],
    },
    {
      title: "Health Services",
      services: [
        {
          name: "Health Certificate",
          description: "Medical clearance",
          icon: "🏥",
          path: "/dashboard/citizen/services/health-certificate",
        },
        {
          name: "Medical Assistance",
          description: "Request medical aid",
          icon: "⚕️",
          path: "/dashboard/citizen/services/medical-assistance",
        },
      ],
    },
    {
      title: "Public Safety",
      services: [
        {
          name: "Report an Issue",
          description:
            "Report road damage, garbage, flooding, and other city issues",
          icon: "⚠️",
          path: "/dashboard/citizen/report-issue",
        },
        {
          name: "Police Clearance",
          description: "Request police clearance",
          icon: "👮",
          path: "/dashboard/citizen/services/police-clearance",
        },
        {
          name: "Fire Safety Inspection",
          description: "Schedule inspection",
          icon: "🚒",
          path: "/dashboard/citizen/services/fire-safety-inspection",
        },
        {
          name: "Barangay Clearance",
          description: "Get barangay clearance",
          icon: "📝",
          path: "/dashboard/citizen/services/barangay-clearance",
        },
        {
          name: "Barangay Blotter",
          description: "Report and record incidents",
          icon: "🚨",
          path: "/dashboard/citizen/services/barangay-blotter",
        },
      ],
    },
  ];

  const filteredCategories = serviceCategories
    .map((category) => ({
      ...category,
      services: category.services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.services.length > 0);

  return (
    <CitizenLayout requireAuth={false}>
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">City services</h1>
        <p className="mt-2 text-gray-600">Browse services and start an application.</p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
        <input
          aria-label="Search services"
          type="search"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
        />
      </div>

      {/* Service Categories */}
      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, idx) => (
            <section key={idx}>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {category.title}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.services.map((service, serviceIdx) => (
                  <li key={serviceIdx}>
                    <Link
                      href={service.path}
                      className="group block h-full rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50 text-3xl">
                          <span aria-hidden="true">{service.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                      <span className="mt-5 inline-flex rounded-xl bg-brand-accent-600 px-5 py-2.5 font-bold text-white transition-colors hover:bg-brand-accent-700 motion-reduce:transition-none">
                        Apply for {service.name.toLowerCase()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
              <p className="text-gray-600">Try another service name or description.</p>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
