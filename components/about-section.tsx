"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Home,
  Leaf,
  Award,
  X,
  ZoomIn,
  CheckCircle2,
  MapPin,
  HeartHandshake,
} from "lucide-react";

export default function AboutSection() {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const teamImage =
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90";

  const stats = [
    {
      icon: Users,
      number: "18,500+",
      label: "Community Members",
    },
    {
      icon: Home,
      number: "4,200+",
      label: "Households",
    },
    {
      icon: Leaf,
      number: "3",
      label: "Community Green Spaces",
    },
    {
      icon: Award,
      number: "20+",
      label: "Community Programs",
    },
  ];

  const highlights = [
    "Providing accessible, efficient, and responsive barangay services",
    "Building a safe, inclusive, and united community for every resident",
    "Supporting health, education, environmental, and livelihood initiatives",
    "Encouraging active participation in community programs and activities",
  ];

  const communityPrograms = [
    {
      icon: HeartHandshake,
      title: "Community Service",
      description:
        "Programs and services designed to respond to the everyday needs of residents and families.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Creating opportunities for residents, organizations, and local leaders to work together.",
    },
    {
      icon: Leaf,
      title: "Sustainable Community",
      description:
        "Promoting cleanliness, environmental awareness, and responsible community practices.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50" />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-brand-primary-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-secondary-300/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="p-7 rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-brand-primary-200 text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>

                  <div className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="col-span-2 p-6 rounded-3xl bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm text-white/75 font-medium">
                    Our Community
                  </p>

                  <h4 className="text-xl font-bold">
                    Barangay Pamplona Uno
                  </h4>

                  <p className="text-sm text-white/80 mt-1">
                    Las Piñas City, Metro Manila
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-5"
            >
              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 text-sm font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                About Our Community
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Barangay Pamplona Uno
              </span>
            </h2>

            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full mb-7" />

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Barangay Pamplona Uno is a vibrant and growing community in
              Las Piñas City. It is home to families, workers, students,
              businesses, and organizations that contribute to the continued
              development of the community.
            </p>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Through responsive public service, community participation, and
              collaborative programs, the barangay continues to create a
              welcoming environment where residents can access essential
              services, participate in local initiatives, and help build a
              safer and more sustainable community.
            </p>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                  }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-7 h-7 text-brand-primary-600 group-hover:scale-110 transition-transform" />
                  </div>

                  <span className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-9"
            >
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Discover Our Community
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Community Programs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 text-sm font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-5">
              What We Stand For
            </span>

            <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Serving Our Community
              </span>
            </h3>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our programs focus on creating a connected, responsive, and
              progressive community for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityPrograms.map((program, i) => {
              const Icon = program.icon;

              return (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.5,
                  }}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {program.title}
                  </h4>

                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28"
        >
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 text-sm font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-5"
            >
              Our Community Leaders
            </motion.span>

            <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                The People Behind Our Community
              </span>
            </h3>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Local leaders, staff, volunteers, and community partners working
              together to serve the residents of Barangay Pamplona Uno.
            </p>
          </div>

          {/* Team Image */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <div className="aspect-[21/9] relative bg-gray-100">
              <img
                src={teamImage}
                alt="Community gathering and barangay activities"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />

              {/* Zoom Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-8 h-8 text-gray-800" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="max-w-3xl">
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Barangay Officials, Staff & Community Partners
                  </h4>

                  <p className="text-white/85 text-base sm:text-lg">
                    Working together to create a safer, more responsive, and
                    stronger community.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="text-center p-7 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-2">
                11+
              </div>

              <div className="text-gray-700 font-semibold">
                Barangay Officials
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Serving the community through local governance
              </p>
            </div>

            <div className="text-center p-7 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-2">
                10+
              </div>

              <div className="text-gray-700 font-semibold">
                Dedicated Staff
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Supporting daily barangay operations and services
              </p>
            </div>

            <div className="text-center p-7 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>

              <div className="text-gray-700 font-semibold">
                Community Commitment
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Dedicated to keeping residents informed and supported
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all group z-50"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={teamImage}
                alt="Community gathering and barangay activities - Full View"
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-6 text-center">
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Barangay Officials, Staff & Community Partners
                </h4>

                <p className="text-white/80 text-lg">
                  Working together for Barangay Pamplona Uno
                </p>
              </div>
            </motion.div>

            {/* Close Hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Click anywhere outside the image to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}