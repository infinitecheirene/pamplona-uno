"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  Menu,
  FileText,
  GraduationCap,
  Rocket,
  Building2,
  MapPin,
  Bell,
  LogOut,
  File,
  AlertCircle, // Added icon for "Certificate of Indigency"
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function CitizenSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);

    try {
      await authClient.logout();

      toast({
        title: "✓ Logged Out Successfully",
        description: "You have been securely logged out.",
        className: "bg-green-50 border-green-200",
        duration: 2000,
      });

      // Small delay for better UX
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);

      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
      });

      setIsLoggingOut(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/dashboard/citizen" },
    {
      icon: AlertCircle,
      label: "Report Issue",
      path: "/dashboard/citizen/report-issue",
    },
    { icon: Grid3x3, label: "Services", path: "/dashboard/citizen/services" },
    { icon: Newspaper, label: "News", path: "/dashboard/citizen/news" },
    {
      icon: AlertTriangle,
      label: "Emergency",
      path: "/dashboard/citizen/emergency",
    },
    {
      icon: User,
      label: "Account",
      path: "/dashboard/citizen/account/applications",
    },
  ];

  const quickAccessItems = [
    {
      icon: FileText,
      label: "Citizen Guide",
      path: "/dashboard/citizen/citizen-guide",
    },
    {
      icon: GraduationCap,
      label: "Students",
      path: "/dashboard/citizen/students",
    },
    { icon: Rocket, label: "Startup", path: "/dashboard/citizen/startup" },
    // { icon: Building2, label: 'Business', path: '/dashboard/citizen/business' },
    { icon: MapPin, label: "City Map", path: "/dashboard/citizen/city-map" },
    { icon: Bell, label: "Alerts", path: "/dashboard/citizen/alerts" },
    {
      icon: File,
      label: "Certificate of Indigency",
      path: "/dashboard/citizen/services/certificate-of-indigency",
    },
    {
      icon: File,
      label: "Residency Certificate",
      path: "/dashboard/citizen/services/residency-certificate",
    }, // NEW ITEM
    {
      icon: File,
      label: "Good Moral",
      path: "/dashboard/citizen/services/good-moral",
    }, // NEW ITEM
    {
      icon: File,
      label: "Barangay Blotter",
      path: "/dashboard/citizen/services/barangay-blotter",
    }, // NEW ITEM
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-600 to-orange-500 text-white shadow-2xl z-50">
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src="/pamplona_tres.png"
              alt="Pamplona Tres City"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="font-bold text-lg">Pamplona Tres City</h1>
            <p className="text-xs text-emerald-100">Connect</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                isActive(item.path)
                  ? "bg-white/30 font-semibold"
                  : "hover:bg-white/20"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Access */}
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-emerald-100 uppercase tracking-wider mb-3 px-4">
            Quick Access
          </h3>
          <nav className="space-y-1">
            {quickAccessItems.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left text-sm ${
                  isActive(item.path)
                    ? "bg-white/20 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={20} className="group-hover:text-red-200" />
                <span className="font-medium group-hover:text-red-200">
                  Logout
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
