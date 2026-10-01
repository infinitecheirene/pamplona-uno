"use client";

import { motion } from "framer-motion";
import { Bell, Search, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useState } from "react";

const announcements = [
  {
    id: 1,
    title: "New City Hall Hours",
    excerpt: "City Hall will now open on weekends starting next month.",
    content:
      "City Hall will now open on weekends starting next month. This initiative aims to make government services more accessible to working citizens and families.",
    category: "Important",
    date: "Nov 13, 2024",
    featured: true,
  },
  {
    id: 2,
    title: "Infrastructure Update",
    excerpt: "Road maintenance on Main Street scheduled for next week.",
    content:
      "Road maintenance on Main Street is scheduled for next week. Expect temporary traffic disruptions during working hours.",
    category: "Notice",
    date: "Nov 12, 2024",
    featured: false,
  },
  {
    id: 3,
    title: "Community Event",
    excerpt: "Join us for the Annual pamplona Tres City Festival this weekend!",
    content:
      "Join us for the Annual pamplona Tres City Festival this weekend! Enjoy food, music, and community activities for the whole family.",
    category: "Event",
    date: "Nov 11, 2024",
    featured: false,
  },
  {
    id: 4,
    title: "Emergency Services Update",
    excerpt: "Enhanced 911 response system now available 24/7.",
    content:
      "Our enhanced 911 response system is now fully operational and available 24/7 for all city residents.",
    category: "Important",
    date: "Nov 10, 2024",
    featured: false,
  },
  {
    id: 5,
    title: "Community Cleanup Drive",
    excerpt: "Join us for a city-wide cleanup initiative.",
    content:
      "Join us for a city-wide cleanup initiative. Meet at Central Park at 8 AM on Saturday.",
    category: "Event",
    date: "Nov 9, 2024",
    featured: false,
  },
];

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || ann.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(announcements.map((ann) => ann.category))];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-br from-brand-secondary-600 to-brand-accent-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <Bell className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Latest Announcements
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-xl text-white/90 max-w-2xl"
          >
            Stay informed with the most recent updates and important notices
            from pamplona Tres City Government.
          </motion.p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-brand-secondary-600 to-brand-accent-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-brand-secondary-300"
              }`}
            >
              All
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-brand-secondary-600 to-brand-accent-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-brand-secondary-300"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Announcement */}
      {filteredAnnouncements.some((ann) => ann.featured) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {filteredAnnouncements
              .filter((ann) => ann.featured)
              .map((announcement) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-brand-secondary-500 to-brand-accent-500 rounded-2xl p-12 text-white hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-gray-900 text-sm font-bold">
                      {announcement.category}
                    </span>
                    <span className="text-white/80 text-sm">
                      {announcement.date}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {announcement.title}
                  </h2>
                  <p className="text-lg text-white/95 mb-6 leading-relaxed">
                    {announcement.content}
                  </p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-white font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Read Full Story <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {filteredAnnouncements.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAnnouncements
                .filter((ann) => !ann.featured)
                .map((announcement, i) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="bg-gradient-to-br from-brand-secondary-500 to-brand-accent-500 rounded-xl p-6 text-white hover:shadow-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 text-gray-900 text-xs font-bold">
                        {announcement.category}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-xs text-white/70">
                      {announcement.date}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-3 mt-3 line-clamp-2">
                      {announcement.title}
                    </h3>
                    <p className="text-white/90 text-sm mb-6 line-clamp-3">
                      {announcement.excerpt}
                    </p>
                    <motion.div
                      animate={{ x: 0 }}
                      className="text-white font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                No announcements found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-secondary-600 to-brand-accent-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need City Services?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Explore our comprehensive range of government services available
              to all residents.
            </p>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-brand-secondary-600 font-bold rounded-lg hover:shadow-lg transition-shadow inline-flex items-center gap-2"
              >
                Explore Services <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
