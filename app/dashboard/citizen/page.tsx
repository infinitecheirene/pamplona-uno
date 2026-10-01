"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CitizenLayout from "@/components/citizenLayout";
import {
  Menu,
  FileText,
  AlertTriangle,
  GraduationCap,
  Rocket,
  Building2,
  Grid3x3,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function CitizenDashboard() {
  const router = useRouter();

  const serviceCategories = [
    {
      icon: Menu,
      label: "Services",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      path: "/dashboard/citizen/services",
    },
    {
      icon: FileText,
      label: "Citizen Guide",
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      path: "/dashboard/citizen/citizen-guide",
    },
    {
      icon: AlertTriangle,
      label: "Emergency",
      color: "bg-red-50",
      iconColor: "text-red-600",
      path: "/dashboard/citizen/emergency",
    },
    {
      icon: GraduationCap,
      label: "Students",
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      path: "/dashboard/citizen/students",
    },
    {
      icon: Rocket,
      label: "Startup",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/dashboard/citizen/startup",
    },
    {
      icon: Building2,
      label: "Business",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/dashboard/citizen/business",
    },
    // { icon: Grid3x3, label: 'View All', color: 'bg-teal-50', iconColor: 'text-teal-600', path: '/dashboard/citizen/all-services' },
  ];

  const quickActions = [
    {
      icon: Phone,
      label: "Emergency Call",
      description: "One-tap emergency hotline",
      color: "bg-red-50",
      iconBg: "bg-red-500",
      path: "/dashboard/citizen/emergency",
    },
    {
      icon: MapPin,
      label: "City Map",
      description: "Find key locations nearby",
      color: "bg-orange-50",
      iconBg: "bg-orange-500",
      path: "/dashboard/citizen/city-map",
    },
  ];

  return (
    <CitizenLayout requireAuth={false}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
            Magandang umaga, Pamplona Citizen!
          </span>
        </h1>
        <p className="text-gray-600 text-lg">What would you like to do?</p>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {serviceCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => router.push(category.path)}
            className={`${category.color} p-6 rounded-2xl hover:shadow-lg transition-all flex flex-col items-center gap-3 group`}
          >
            <div
              className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <category.icon className={category.iconColor} size={28} />
            </div>
            <span className="text-sm font-semibold text-gray-700 text-center">
              {category.label}
            </span>
          </button>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-orange-500 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Help us improve our city</h2>
        <p className="mb-6 text-emerald-50">
          Spotted an issue in your area? Contact us so we can fix it together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() =>
              router.push("/dashboard/citizen/account/applications")
            }
            className="flex-1 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            View Reports
          </button>
          <button
            onClick={() => router.push("/dashboard/citizen/report-issue")}
            className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Report an Issue
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.path)}
              className={`${action.color} p-6 rounded-2xl hover:shadow-lg transition-all flex items-center gap-4 group`}
            >
              <div
                className={`${action.iconBg} w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <action.icon className="text-white" size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 text-lg">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <ChevronRight
                className="text-gray-400 group-hover:text-gray-600 transition-colors"
                size={24}
              />
            </button>
          ))}
        </div>
      </div>
    </CitizenLayout>
  );
}
