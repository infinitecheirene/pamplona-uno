"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CitizenLayout from "@/components/citizenLayout";

export default function StudentsPage() {
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

  const studentServices = [
    {
      category: "Scholarships",
      items: [
        {
          name: "City Scholarship Program",
          description: "Apply for city-funded scholarships",
          icon: "🎓",
          requirements: [
            "Valid Student ID",
            "Certificate of Enrollment",
            "Proof of Residency (Barangay Certificate)",
            "Income Tax Return or Certificate of Indigency",
            "Grade Report (for renewal)",
            "Birth Certificate (PSA)",
            "2x2 ID Photo (2 copies)",
          ],
        },
        {
          name: "Merit Scholarship",
          description: "For outstanding students",
          icon: "🏆",
          requirements: [
            "Academic Excellence Certificate",
            "Certificate of Enrollment",
            "Transcript of Records",
            "Proof of Residency",
            "Recommendation Letter from School",
            "Birth Certificate (PSA)",
            "2x2 ID Photo (2 copies)",
          ],
        },
        {
          name: "Financial Assistance",
          description: "Educational financial aid",
          icon: "💰",
          requirements: [
            "Certificate of Indigency",
            "Certificate of Enrollment",
            "Proof of Residency",
            "Income Documents of Parents/Guardians",
            "Birth Certificate (PSA)",
            "Valid ID of Parent/Guardian",
            "2x2 ID Photo (2 copies)",
          ],
        },
      ],
    },
    {
      category: "Student Services",
      items: [
        {
          name: "Student ID Application",
          description: "Get your student ID",
          icon: "🪪",
          requirements: [
            "Certificate of Enrollment",
            "Proof of Residency",
            "Birth Certificate (PSA)",
            "2x2 ID Photo (2 copies)",
            "Valid School ID",
          ],
        },
        {
          name: "Library Card",
          description: "Access city library resources",
          icon: "📚",
          requirements: [
            "Valid Student ID or School ID",
            "Proof of Residency",
            "1x1 ID Photo (1 copy)",
            "Parent/Guardian Consent (for minors)",
          ],
        },
        {
          name: "Internship Programs",
          description: "City government internships",
          icon: "💼",
          requirements: [
            "Endorsement Letter from School",
            "Certificate of Enrollment",
            "Resume/CV",
            "Transcript of Records",
            "Medical Certificate",
            "Police Clearance",
            "2x2 ID Photo (2 copies)",
            "Valid ID",
          ],
        },
      ],
    },
    {
      category: "Youth Programs",
      items: [
        {
          name: "Skills Training",
          description: "Free skills development programs",
          icon: "🛠️",
          requirements: [
            "Certificate of Enrollment or Student ID",
            "Proof of Residency",
            "Birth Certificate",
            "Parent/Guardian Consent (for minors)",
            "1x1 ID Photo (2 copies)",
            "Medical Certificate (if required)",
          ],
        },
        {
          name: "Sports Programs",
          description: "Youth sports and athletics",
          icon: "⚽",
          requirements: [
            "Medical Certificate",
            "Proof of Residency",
            "Birth Certificate",
            "Parent/Guardian Consent (for minors)",
            "1x1 ID Photo (2 copies)",
            "School ID or Student ID",
          ],
        },
        {
          name: "Arts & Culture",
          description: "Cultural programs for youth",
          icon: "🎨",
          requirements: [
            "Proof of Residency",
            "Birth Certificate",
            "Parent/Guardian Consent (for minors)",
            "1x1 ID Photo (2 copies)",
            "Portfolio (if applicable)",
            "School ID or Student ID",
          ],
        },
      ],
    },
  ];

  return (
    <CitizenLayout>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Student support</h1>
          <p className="mt-2 text-gray-600">Find scholarships, learning programs, and youth activities in Pamplona Uno.</p>
        </header>

        <div className="space-y-8">
          {studentServices.map((section, sectionIdx) => (
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
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-accent-50 text-2xl" aria-hidden="true">
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
