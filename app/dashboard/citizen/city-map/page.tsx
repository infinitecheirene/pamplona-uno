"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Search,
  Phone,
  Building2,
  Hospital,
  Shield,
  FireExtinguisher,
  School,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import CitizenLayout from "@/components/citizenLayout";

interface Location {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  icon: string;
}

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const categories = [
    { value: "all", label: "All", icon: MapPin, color: "bg-brand-secondary-500" },
    {
      value: "hospital",
      label: "Hospitals",
      icon: Hospital,
      color: "bg-brand-primary-500",
    },
    { value: "police", label: "Police", icon: Shield, color: "bg-blue-600" },
    {
      value: "fire",
      label: "Fire Dept",
      icon: FireExtinguisher,
      color: "bg-brand-secondary-600",
    },
    {
      value: "government",
      label: "Gov't",
      icon: Building2,
      color: "bg-purple-600",
    },
    { value: "school", label: "Schools", icon: School, color: "bg-brand-accent-600" },
    {
      value: "landmark",
      label: "Landmarks",
      icon: Landmark,
      color: "bg-teal-600",
    },
  ];

  const locations: Location[] = [
    {
      id: "1",
      name: "Pamplona Uno City Hospital",
      category: "hospital",
      address: "J.P. Rizal St, Pamplona Uno City",
      phone: "(043) 288-8888",
      lat: 13.4119,
      lng: 121.1803,
      icon: "hospital",
    },
    {
      id: "2",
      name: "Pamplona Uno City Police Station",
      category: "police",
      address: "Guinobatan, Pamplona Uno City",
      phone: "(043) 288-6666",
      lat: 13.4125,
      lng: 121.1795,
      icon: "police",
    },
    {
      id: "3",
      name: "Pamplona Uno City Fire Station",
      category: "fire",
      address: "Guinobatan, Pamplona Uno City",
      phone: "(043) 288-7777",
      lat: 13.413,
      lng: 121.181,
      icon: "fire",
    },
    {
      id: "4",
      name: "Pamplona Uno City Hall",
      category: "government",
      address: "Guinobatan, Pamplona Uno City",
      phone: "(043) 288-5555",
      lat: 13.4115,
      lng: 121.18,
      icon: "government",
    },
    {
      id: "5",
      name: "Oriental Mindoro National Highschool",
      category: "school",
      address: "Camilmil, Pamplona Uno City",
      phone: "(043) 288-4444",
      lat: 13.41,
      lng: 121.182,
      icon: "school",
    },
    {
      id: "6",
      name: "Pamplona Uno City Public Market",
      category: "landmark",
      address: "San Vicente Central, Pamplona Uno City",
      lat: 13.412,
      lng: 121.179,
      icon: "landmark",
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  const filteredLocations = locations.filter((location) => {
    const matchesCategory =
      selectedCategory === "all" || location.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLocationIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.icon : MapPin;
  };

  const getLocationColor = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.color : "bg-gray-500";
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  return (
    <CitizenLayout requireAuth={false}>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">City map</h1>
          <p className="mt-2 text-gray-600">Search for public services and key places in Pamplona Uno.</p>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search locations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
          />
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-sm whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                    selectedCategory === category.value
                      ? "border-brand-accent-600 bg-brand-accent-600 text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Default Map Embed */}
        <section aria-label="Map" className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <iframe
            title="Map of public places in Pamplona Uno"
            src="https://www.google.com/maps?q=Pamplona+Uno+City+Hall,+Pamplona+Uno+City,+Oriental+Mindoro&z=15&output=embed"
            width="100%"
            height="420"
            style={{ border: 0 }}
            className="h-[360px] w-full sm:h-[440px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {userLocation && (
            <div className="absolute right-4 top-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm" aria-label="Your location is available">
              <Navigation className="w-5 h-5 text-brand-accent-600" aria-hidden="true" />
            </div>
          )}
        </section>

        {/* Locations List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Key places <span className="text-base font-normal text-gray-600">({filteredLocations.length})</span>
            </h2>
            {userLocation && (
              <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-brand-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
                <Navigation className="w-4 h-4" />
                Sort by distance
              </button>
            )}
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLocations.map((location) => {
              const Icon = getLocationIcon(location.category);
              const distance =
                userLocation &&
                calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  location.lat,
                  location.lng,
                );

              const mapsUrl = userLocation
                ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${location.lat},${location.lng}`
                : `https://www.google.com/maps?q=${location.lat},${location.lng}`;

              return (
                <li key={location.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`${getLocationColor(location.category)} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{location.address}</span>
                      </p>

                      <div className="flex items-center gap-4">
                        {location.phone && (
                          <a href={`tel:${location.phone}`} className="flex items-center gap-1 text-sm font-semibold text-brand-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
                            <Phone className="w-4 h-4" aria-hidden="true" />
                            {location.phone}
                          </a>
                        )}
                        {distance && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Navigation className="w-4 h-4" aria-hidden="true" />
                            {distance} km away
                          </span>
                        )}
                      </div>
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-brand-accent-600 px-5 py-2.5 font-bold text-white hover:bg-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </CitizenLayout>
  );
}
