"use client";

import { useState } from "react";
import {
  Phone,
  Ambulance,
  FireExtinguisher,
  Shield,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import CitizenLayout from "@/components/citizenLayout";

export default function EmergencyPage() {
  const [calling, setCalling] = useState(false);

  const emergencyContacts = [
    {
      icon: Phone,
      label: "Emergency Hotline",
      number: "911",
      color: "bg-gradient-to-br from-brand-primary-500 to-brand-primary-600",
    },
    {
      icon: Ambulance,
      label: "Ambulance",
      number: "(043) 288-8888",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: FireExtinguisher,
      label: "Fire Department",
      number: "(043) 288-7777",
      color: "bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600",
    },
    {
      icon: Shield,
      label: "Police Station",
      number: "(043) 288-6666",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
  ];

  const contactGroups = [
    {
      title: "Police",
      contacts: emergencyContacts.filter((contact) =>
        contact.label.includes("Police")
      ),
    },
    {
      title: "Fire",
      contacts: emergencyContacts.filter((contact) =>
        contact.label.includes("Fire")
      ),
    },
    {
      title: "Medical",
      contacts: emergencyContacts.filter((contact) =>
        contact.label.includes("Ambulance")
      ),
    },
    {
      title: "Disaster and Emergency",
      contacts: emergencyContacts.filter(
        (contact) => contact.number === "911"
      ),
    },
  ];

  const handleEmergencyCall = async (number: string) => {
    setCalling(true);
    setTimeout(() => {
      window.location.href = `tel:${number}`;
      setCalling(false);
    }, 500);
  };

  return (
    <CitizenLayout requireAuth={false}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Emergency contacts</h1>
          <p className="mt-2 text-gray-600">Call the right service for urgent help in Pamplona Uno.</p>
        </header>

        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Emergency Alert */}
            <div className="flex flex-col rounded-3xl border-2 border-brand-primary-200 bg-brand-primary-50 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="mt-0.5 h-6 w-6 shrink-0 text-brand-primary-600"
                  aria-hidden="true"
                />

                <div className="flex flex-1 flex-col">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Life-threatening emergency
                  </h2>

                  <p className="mt-2 text-brand-primary-700">
                    Call the national hotline now.
                  </p>

                  <a
                    href="tel:911"
                    onClick={(event) => {
                      event.preventDefault();
                      handleEmergencyCall("911");
                    }}
                    className="mt-5 inline-flex min-h-16 w-fit items-center rounded-xl bg-brand-primary-600 px-8 py-4 text-2xl font-bold text-white transition-colors hover:bg-brand-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-2"
                  >
                    Call 911
                  </a>
                </div>
              </div>
            </div>

            {/* Request Assistance */}
            <div className="flex flex-col">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
                <Ambulance
                  className="h-5 w-5 text-brand-secondary-600"
                  aria-hidden="true"
                />
                Request Assistance
              </h2>

              <Link
                href="/dashboard/citizen/emergency/ambulance"
                className="group flex flex-1 items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50 transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
                  <Ambulance
                    className="h-7 w-7 text-brand-secondary-700 sm:h-8 sm:w-8"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Request Ambulance
                  </h3>

                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    Share your location for quick response
                  </p>
                </div>

                {/* Location Icon */}
                <MapPin
                  className="h-5 w-5 shrink-0 text-brand-secondary-700"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>

          {/* Emergency Contacts Grid */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Emergency Contacts
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {contactGroups
                .filter((group) => group.contacts.length > 0)
                .map((group) => {
                  const contact = group.contacts[0];

                  return (
                    <div
                      key={group.title}
                      className="flex h-full"
                    >
                      <a
                        href={`tel:${contact.number}`}
                        onClick={(event) => {
                          event.preventDefault();
                          handleEmergencyCall(contact.number);
                        }}
                        className="group flex min-h-[170px] w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
                      >
                        {/* Icon */}
                        <div className="flex items-start justify-between">
                          <span
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${contact.color}`}
                          >
                            <contact.icon
                              className="h-7 w-7"
                              aria-hidden="true"
                            />
                          </span>

                          <Phone
                            className="h-5 w-5 text-gray-300 transition-colors group-hover:text-brand-primary-600"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Content */}
                        <div className="mt-5">
                          <p className="text-sm font-medium text-gray-500">
                            {group.title}
                          </p>

                          <h3 className="mt-1 font-bold text-gray-900">
                            {contact.label}
                          </h3>

                          <p className="mt-2 text-lg font-bold text-brand-primary-700">
                            {contact.number}
                          </p>
                        </div>
                      </a>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Safety Tips */}
          <section>
            <h2 className="font-bold text-gray-900 text-2xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Safety Tips
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">
                  1
                </span>
                <span className="text-sm sm:text-base text-gray-700">
                  Stay calm and speak clearly when calling emergency services
                </span>
              </div>
              <div className="flex gap-3 p-3 bg-brand-accent-50 rounded-lg border border-brand-accent-100">
                <span className="text-brand-accent-600 font-bold text-lg flex-shrink-0">
                  2
                </span>
                <span className="text-sm sm:text-base text-gray-700">
                  Provide your exact location and describe the emergency
                </span>
              </div>
              <div className="flex gap-3 p-3 bg-brand-secondary-50 rounded-lg border border-brand-secondary-100">
                <span className="text-brand-secondary-600 font-bold text-lg flex-shrink-0">
                  3
                </span>
                <span className="text-sm sm:text-base text-gray-700">
                  Follow the dispatcher's instructions carefully
                </span>
              </div>
              <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-purple-600 font-bold text-lg flex-shrink-0">
                  4
                </span>
                <span className="text-sm sm:text-base text-gray-700">
                  Don't hang up until told to do so by the operator
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </CitizenLayout>
  );
}
