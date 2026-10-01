"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import CitizenLayout from "@/components/citizenLayout";

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState("services");

  const businessServices = [
    {
      category: "Business Support",
      items: [
        {
          name: "Tax Assistance",
          description: "Business tax consultation",
          icon: "💰",
          link: "/dashboard/citizen/services/tax-assistance",
        },
        {
          name: "Business Development",
          description: "Growth and expansion support",
          icon: "📈",
        },
        {
          name: "Trade Fairs",
          description: "Participate in city trade events",
          icon: "🏪",
        },
      ],
    },
    {
      category: "Compliance",
      items: [
        {
          name: "Zoning Clearance",
          description: "Check zoning requirements",
          icon: "🗺️",
        },
        {
          name: "Environmental Compliance",
          description: "Environmental clearance",
          icon: "🌱",
        },
        {
          name: "Labor Compliance",
          description: "Employment regulations",
          icon: "👥",
        },
      ],
    },
  ];

  return (
    <CitizenLayout requireAuth={false}>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Business services</h1>
          <p className="mt-2 text-gray-600">Find permits, licenses, and support for your business in Pamplona Uno.</p>
        </header>

        <div className="space-y-8">
          {businessServices.map((section, idx) => (
            <section key={idx}>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">{section.category}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Card className="h-full rounded-2xl border border-gray-200 bg-white p-5">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50 text-2xl" aria-hidden="true">
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                            {item.link ? (
                              <Link href={item.link} className="mt-4 inline-flex rounded-xl bg-brand-accent-600 px-5 py-2.5 font-bold text-white hover:bg-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none">
                                View {item.name.toLowerCase()}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Link href="/dashboard/citizen/services" className="mt-8 inline-flex rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
          Browse all city services
        </Link>
      </div>
    </CitizenLayout>
  );
}
