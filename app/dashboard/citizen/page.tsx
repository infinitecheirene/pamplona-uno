"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CitizenLayout from "@/components/citizenLayout";
import {
  Grid3x3,
  FileText,
  AlertTriangle,
  GraduationCap,
  Rocket,
  Building2,
  Phone,
  MapPin,
  ChevronRight,
  Megaphone,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

const BASE = "/dashboard/citizen";

type Category = {
  icon: LucideIcon;
  label: string;
  description: string;
  tint: string;
  iconColor: string;
  path: string;
};

const categories: Category[] = [
  {
    icon: Grid3x3,
    label: "Services",
    description: "Apply for certificates and permits",
    tint: "bg-brand-secondary-50",
    iconColor: "text-brand-secondary-600",
    path: `${BASE}/services`,
  },
  {
    icon: FileText,
    label: "Citizen guide",
    description: "How city processes work, step by step",
    tint: "bg-brand-accent-50",
    iconColor: "text-brand-accent-600",
    path: `${BASE}/citizen-guide`,
  },
  {
    icon: GraduationCap,
    label: "Students",
    description: "Scholarships and student support",
    tint: "bg-brand-accent-50",
    iconColor: "text-brand-accent-600",
    path: `${BASE}/students`,
  },
  {
    icon: Rocket,
    label: "Startup",
    description: "Resources for new ventures",
    tint: "bg-brand-secondary-50",
    iconColor: "text-brand-secondary-600",
    path: `${BASE}/startup`,
  },
  {
    icon: Building2,
    label: "Business",
    description: "Business permits and licenses",
    tint: "bg-brand-accent-50",
    iconColor: "text-brand-accent-600",
    path: `${BASE}/business`,
  },
  {
    icon: MapPin,
    label: "City map",
    description: "Find offices and key places nearby",
    tint: "bg-brand-secondary-50",
    iconColor: "text-brand-secondary-600",
    path: `${BASE}/city-map`,
  },
];

function getGreeting(hour: number) {
  if (hour < 11) return "Magandang umaga";
  if (hour < 13) return "Magandang tanghali";
  if (hour < 18) return "Magandang hapon";
  return "Magandang gabi";
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2";

export default function CitizenDashboard() {
  // Set after mount so server and client markup match.
  const [greeting, setGreeting] = useState("Magandang araw");

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <CitizenLayout requireAuth={false}>
      {/* Welcome */}
      <header className="mb-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {greeting}, Pamplona citizen
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          What would you like to do today?
        </p>
      </header>

      {/* Primary actions: report an issue + emergency */}
      <section
        aria-label="Primary actions"
        className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6"
      >
        <div className="rounded-3xl bg-gradient-to-br from-brand-accent-600 to-brand-secondary-500 p-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <Megaphone size={24} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Report a problem in your area</h2>
              <p className="mt-2 max-w-xl text-brand-accent-50">
                Broken streetlight, flooded road, uncollected garbage? Tell us
                where it is and we&apos;ll send it to the right office.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`${BASE}/report-issue`}
              className={`inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-brand-accent-700 hover:shadow-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-accent-600`}
            >
              Report an issue
            </Link>
            <Link
              href={`${BASE}/account/applications`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-accent-600"
            >
              <ClipboardList size={18} aria-hidden="true" />
              View my reports
            </Link>
          </div>
        </div>

        <Link
          href={`${BASE}/emergency`}
          className="group flex flex-col justify-between rounded-3xl border-2 border-brand-primary-200 bg-brand-primary-50 p-8 hover:border-brand-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 focus-visible:ring-offset-2"
        >
          <div>
            <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-brand-primary-500 text-white">
              <Phone size={24} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Need urgent help?
            </h2>
            <p className="mt-2 text-gray-700">
              Reach police, fire, and medical hotlines in one tap.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 font-bold text-brand-primary-700">
            <AlertTriangle size={18} aria-hidden="true" />
            Open emergency contacts
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>
      </section>

      {/* Browse */}
      <section aria-labelledby="browse-heading">
        <h2
          id="browse-heading"
          className="mb-4 text-2xl font-bold text-gray-800"
        >
          Explore city services
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <li key={c.path}>
              <Link
                href={c.path}
                className={`group flex h-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-md transition-all ${focusRing}`}
              >
                <div
                  className={`flex w-14 h-14 shrink-0 items-center justify-center rounded-xl ${c.tint}`}
                >
                  <c.icon className={c.iconColor} size={28} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">{c.label}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
                <ChevronRight
                  size={20}
                  className="shrink-0 text-gray-400 transition-colors group-hover:text-gray-700"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </CitizenLayout>
  );
}