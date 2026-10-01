"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CitizenLayout from "@/components/citizenLayout";

export default function StartupPage() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const startupServices = [
    {
      category: "Business Registration",
      items: [
        {
          name: "Startup Registration",
          description: "Register your startup business",
          icon: "🚀",
          requirements: [
            "Valid government-issued ID",
            "Birth certificate (PSA copy)",
            "Business plan or concept paper",
            "Proof of address",
            "TIN (Tax Identification Number)",
            "Community Tax Certificate (Cedula)",
          ],
        },
        {
          name: "Business Name Search",
          description: "Check business name availability",
          icon: "🔍",
          requirements: [
            "Valid government-issued ID",
            "3 proposed business names",
            "Business nature/description",
            "Online application form",
          ],
        },
        {
          name: "DTI Registration",
          description: "Department of Trade registration",
          icon: "📋",
          requirements: [
            "Accomplished DTI application form",
            "Valid government-issued ID",
            "Proof of payment (registration fee)",
            "Business name verification slip",
            "Barangay clearance",
          ],
        },
      ],
    },
    {
      category: "Support Programs",
      items: [
        {
          name: "Startup Grants",
          description: "Apply for startup funding",
          icon: "💰",
          requirements: [
            "Completed grant application form",
            "Detailed business plan (5-year projection)",
            "Financial statements/projections",
            "DTI/SEC registration certificate",
            "Mayor's permit (if applicable)",
            "Tax clearance",
            "Project proposal with budget",
          ],
        },
        {
          name: "Mentorship Program",
          description: "Connect with business mentors",
          icon: "👥",
          requirements: [
            "Mentorship application form",
            "Business profile/summary",
            "Valid ID",
            "Business registration documents",
            "Statement of business challenges",
          ],
        },
        {
          name: "Co-working Spaces",
          description: "Access shared workspaces",
          icon: "🏢",
          requirements: [
            "Co-working space application",
            "Valid government-issued ID",
            "Business registration proof",
            "Membership fee payment",
            "Signed facility usage agreement",
          ],
        },
      ],
    },
    {
      category: "Resources",
      items: [
        {
          name: "Business Training",
          description: "Free entrepreneurship training",
          icon: "📚",
          requirements: [
            "Training registration form",
            "Valid government-issued ID",
            "Resume or business profile",
            "Commitment letter (for full attendance)",
            "Pre-assessment form",
          ],
        },
        {
          name: "Market Research",
          description: "Access market data and insights",
          icon: "📊",
          requirements: [
            "Research request form",
            "Valid ID",
            "Business registration documents",
            "Research purpose statement",
            "Data confidentiality agreement",
          ],
        },
        {
          name: "Networking Events",
          description: "Connect with other entrepreneurs",
          icon: "🤝",
          requirements: [
            "Event registration form",
            "Valid government-issued ID",
            "Business card or profile",
            "Payment (if applicable)",
            "Professional attire",
          ],
        },
      ],
    },
  ];

  return (
    <CitizenLayout>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Startup support</h1>
          <p className="mt-2 text-gray-600">Explore resources for starting and growing a business in Pamplona Uno.</p>
        </header>

        <div className="space-y-8">
          {startupServices.map((section, sectionIdx) => (
            <section key={sectionIdx}>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">{section.category}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item, itemIdx) => {
                  const key = `${section.category}-${itemIdx}`;
                  const isExpanded = expandedItems[key];

                  return (
                    <li key={itemIdx}>
                      <Card className="h-full rounded-2xl border border-gray-200 bg-white p-5">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50 text-2xl" aria-hidden="true">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.description}
                            </p>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto rounded-xl p-2 font-semibold text-brand-secondary-700 hover:bg-brand-secondary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
                              onClick={() =>
                                toggleItem(section.category, itemIdx)
                              }
                            >
                              {isExpanded ? (
                                <>
                                  Hide requirements{" "}
                                  <ChevronUp className="w-4 h-4 ml-1" />
                                </>
                              ) : (
                                <>
                                  View requirements{" "}
                                  <ChevronDown className="w-4 h-4 ml-1" />
                                </>
                              )}
                            </Button>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                  Requirements
                                </h4>
                                <ul className="space-y-1.5">
                                  {item.requirements.map((req, reqIdx) => (
                                    <li
                                      key={reqIdx}
                                      className="text-sm text-gray-700 flex items-start gap-2"
                                    >
                                      <span className="text-brand-secondary-600 mt-0.5">
                                        •
                                      </span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        <Link href="/dashboard/citizen/services" className="mt-8 inline-flex rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
          Browse available services
        </Link>
      </div>
    </CitizenLayout>
  );
}
