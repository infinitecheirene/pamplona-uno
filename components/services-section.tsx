"use client";

import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Building,
  Users,
  TrendingUp,
  Layers,
  Heart,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const guides = [
  // --- Public Safety ---
  {
    id: 14,
    icon: AlertTriangle,
    name: "Report an Issue",
    description: "Report road damage, garbage, flooding, and other city issues",
    category: "Public Safety",
    route: "/dashboard/citizen/report-issue",
  },
  {
    id: 1,
    icon: FileText,
    name: "Barangay Clearance",
    description: "Get barangay clearance",
    category: "Public Safety",
    route: "/dashboard/citizen/services/barangay-clearance",
  },
  {
    id: 8,
    icon: Users,
    name: "Police Clearance",
    description: "Request police clearance",
    category: "Public Safety",
    route: "/dashboard/citizen/services/police-clearance",
  },
  {
    id: 9,
    icon: MapPin,
    name: "Fire Safety Inspection",
    description: "Schedule inspection",
    category: "Public Safety",
    route: "/dashboard/citizen/services/fire-safety-inspection",
  },
  {
    id: 13,
    icon: MapPin,
    name: "Barangay Blotter",
    description: "Report and record incidents",
    category: "Public Safety",
    route: "/dashboard/citizen/services/barangay-blotter",
  },

  // --- Government Services ---
  {
    id: 2,
    icon: Building,
    name: "Business Permit Application",
    description: "Step-by-step guide to apply for a business permit.",
    category: "Government Services",
    route: "/dashboard/citizen/services/business-permit",
  },
  {
    id: 3,
    icon: Building,
    name: "Building Permit Process",
    description: "Requirements and procedures for obtaining a building permit.",
    category: "Government Services",
    route: "/dashboard/citizen/services/building-permit",
  },
  {
    id: 4,
    icon: FileText,
    name: "Community Tax Certificate",
    description: "How to get your Cedula (Community Tax Certificate).",
    category: "Government Services",
    route: "/dashboard/citizen/services/cedula",
  },
  {
    id: 5,
    icon: Heart,
    name: "Marriage License",
    description: "Apply for marriage license",
    category: "Government Services",
    route: "/dashboard/citizen/services/marriage-license",
  },
  {
    id: 11,
    icon: Users,
    name: "Residency Certificate",
    description: "Proof of residency certification",
    category: "Government Services",
    route: "/dashboard/citizen/services/residency-certificate",
  },
  {
    id: 12,
    icon: TrendingUp,
    name: "Good Moral Certificate",
    description: "Certificate of good moral character",
    category: "Government Services",
    route: "/dashboard/citizen/services/good-moral-certificate",
  },

  {
    id: 10,
    icon: FileText,
    name: "Certificate of Indigency",
    description: "Financial assistance qualification certificate",
    category: "Government Services",
    route: "/dashboard/citizen/services/certificate-of-indigency",
  },

  // --- Health Services ---
  {
    id: 6,
    icon: Heart,
    name: "Health Certificate",
    description: "Medical clearance",
    category: "Health Services",
    route: "/dashboard/citizen/services/health-certificate",
  },
  {
    id: 7,
    icon: Heart,
    name: "Medical Assistance",
    description: "Request medical aid",
    category: "Health Services",
    route: "/dashboard/citizen/services/medical-assistance",
  },
];

// Fixed, deliberate category order (instead of "order first appears in the
// array", which is what made the grid look scattered before).
const categoryOrder = [
  "Public Safety",
  "Government Services",
  "Health Services",
];

const categories = ["All", ...categoryOrder];

// const stats = [
//   {
//     label: "Guide Categories",
//     value: `${categoryOrder.length}`,
//     icon: Layers,
//   },
//   { label: "Residents Served", value: "18,500+", icon: Users },
//   { label: "Guides Published", value: `${guides.length}+`, icon: TrendingUp },
// ];

export default function ServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || guide.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group the (already filtered) guides by category, in categoryOrder, so
  // the "All" view reads as clean sections instead of one scrambled grid.
  // Empty categories (no matches) are simply skipped.
  const groupedGuides = categoryOrder
    .map((category) => ({
      category,
      items: filteredGuides.filter((g) => g.category === category),
    }))
    .filter((group) => group.items.length > 0);

  // Walang auth check dito. "Apply Now" ay direktang mag-nanavigate sa
  // service page. Ang pag-check ng login ay mangyayari na lang sa
  // Submit button ng bawat form (see auth-on-submit pattern).
  const handleServiceAccess = (route: string) => {
    router.push(route);
  };

  const renderCard = (guide: (typeof guides)[number], i: number) => {
    const Icon = guide.icon;
    return (
      <motion.div
        key={guide.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: (i % 6) * 0.05, duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.01 }}
        className="p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-orange-300 hover:shadow-2xl transition-all group flex flex-col h-full"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-red-500 via-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
              {guide.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
              {guide.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">{guide.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleServiceAccess(guide.route)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-green-500 text-white font-semibold hover:opacity-90 transition"
          >
            Apply Now
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Guide Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-green-600 bg-clip-text text-transparent">
                OUR SERVICES
              </span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-full mx-auto mb-4" />
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-red-500 via-orange-500 to-green-500 text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grouped by category (in a fixed order) instead of one long
              mixed grid. When a single category is selected there's only
              ever one group, so this renders the same as before in that
              case — the section header is what changes for "All". */}
          {groupedGuides.map((group) => (
            <div key={group.category} className="mb-14 last:mb-0">
              {activeCategory === "All" && (
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {group.category}
                  </h3>
                  <span className="text-sm font-semibold text-gray-400">
                    {group.items.length}
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {group.items.map((guide, i) => renderCard(guide, i))}
              </div>
            </div>
          ))}

          {filteredGuides.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 via-orange-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-green-600 bg-clip-text text-transparent mb-3">
                No Guides Found
              </h3>
              <p className="text-gray-600 text-lg">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-green-50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-orange-300 text-center hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-gradient-to-br from-red-500 via-orange-500 to-green-500 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-green-600 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 via-orange-600 to-green-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              Need Assistance?
            </h2>
            <p className="text-xl text-white/95 max-w-2xl mx-auto font-medium drop-shadow-md">
              Our team is ready to help you with any questions about our
              services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:shadow-white/20 transition-all text-lg"
                >
                  Contact Us
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all text-lg"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}
    </>
  );
}
