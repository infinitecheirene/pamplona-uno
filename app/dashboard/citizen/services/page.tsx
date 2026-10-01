"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import CitizenLayout from "@/components/citizenLayout";

export default function ServicesPage() {
  const router = useRouter();
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Services</h1>
        <p className="text-gray-600">Browse and apply for city services</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Service Categories */}
      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {category.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, serviceIdx) => (
                  <button
                    key={serviceIdx}
                    onClick={() => router.push(service.path)}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {service.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                      <span className="text-sm font-semibold text-orange-600 group-hover:gap-2 flex items-center">
                        Apply Now
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
