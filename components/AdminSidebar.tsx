"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Ambulance,
  LayoutDashboard,
  Newspaper,
  Mail,
  User,
  LogOut,
  Shield,
  FileText,
  Building,
  ScrollText,
  Heart,
  UserCheck,
  ShieldCheck,
  Home,
  HandHelping,
  MapPin,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSidebar() {
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

      setTimeout(() => router.push("/login"), 500);
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

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
    { icon: Newspaper, label: "News", path: "/dashboard/admin/news" },
    {
      icon: Newspaper,
      label: "Announcements",
      path: "/dashboard/admin/announcements",
    },
    { icon: Mail, label: "Contact Messages", path: "/dashboard/admin/contact" },
    { icon: Mail, label: "Reports", path: "/dashboard/admin/reports" },
  ];

  // ------------------------
  // FIXED CATEGORIZATION
  // ------------------------

  const governmentServices = [
    {
      icon: FileText,
      label: "Business Permit",
      path: "/dashboard/admin/business-permit",
    },
    {
      icon: Building,
      label: "Building Permit",
      path: "/dashboard/admin/building-permit",
    },
    {
      icon: Heart,
      label: "Marriage License",
      path: "/dashboard/admin/marriage-license",
    },
  ];

  const civilRegistry = [
    { icon: ScrollText, label: "Cedula", path: "/dashboard/admin/cedula" },
    {
      icon: MapPin,
      label: "Residency Certificate",
      path: "/dashboard/admin/residency-certificate",
    },
    {
      icon: Home,
      label: "Indigency Certificate",
      path: "/dashboard/admin/indigency-certificate",
    },
    {
      icon: HandHelping,
      label: "Good Moral Certificate",
      path: "/dashboard/admin/good-moral-certificate",
    },
  ];

  const healthServices = [
    {
      icon: UserCheck,
      label: "Health Certificate",
      path: "/dashboard/admin/health-certificate",
    },
    {
      icon: Heart,
      label: "Medical Assistance",
      path: "/dashboard/admin/medical-assistance",
    },
    {
      icon: Ambulance,
      label: "Ambulance Request",
      path: "/dashboard/admin/ambulance-request",
    },
  ];

  const publicSafety = [
    {
      icon: FileText,
      label: "Barangay Clearance",
      path: "/dashboard/admin/barangay-clearance",
    },
    {
      icon: ShieldCheck,
      label: "Barangay Blotter",
      path: "/dashboard/admin/barangay-blotter",
    },
  ];

  return (
    <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-600 to-orange-500 text-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-6 flex flex-col min-h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Shield className="text-slate-800" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-base">Pamplona Uno City</h1>
            <p className="text-xs text-slate-200">Admin Panel</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 flex-1">
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);

            return (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                  ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
                `}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Government Services Section */}
          <div className="pt-3 mt-2 border-t border-white/20">
            <h3 className="text-xs font-semibold text-white/70 px-3 mb-1">
              GOVERNMENT SERVICES
            </h3>
            {governmentServices.map((item, index) => {
              const active = isActive(item.path);

              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                    ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
                  `}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Civil Registry Services Section */}
          <div className="pt-3 mt-2 border-t border-white/20">
            <h3 className="text-xs font-semibold text-white/70 px-3 mb-1">
              CIVIL REGISTRY SERVICES
            </h3>
            {civilRegistry.map((item, index) => {
              const active = isActive(item.path);

              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                    ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
                  `}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Health Services Section */}
          <div className="pt-3 mt-2 border-t border-white/20">
            <h3 className="text-xs font-semibold text-white/70 px-3 mb-1">
              HEALTH SERVICES
            </h3>
            {healthServices.map((item, index) => {
              const active = isActive(item.path);

              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                    ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
                  `}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Public Safety Section */}
          <div className="pt-3 mt-2 border-t border-white/20">
            <h3 className="text-xs font-semibold text-white/70 px-3 mb-1">
              PUBLIC SAFETY
            </h3>
            {publicSafety.map((item, index) => {
              const active = isActive(item.path);

              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                    ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
                  `}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Account Section */}
          <div className="pt-3 mt-2 border-t border-white/20">
            <button
              onClick={() => router.push("/dashboard/admin/users")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                ${isActive("/dashboard/admin/users") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}
              `}
            >
              <User size={18} />
              <span className="font-medium">Users</span>
            </button>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={18} className="group-hover:text-red-200" />
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
