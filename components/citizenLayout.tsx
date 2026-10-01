"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CitizenSidebar from "./CitizenSidebar";
import CitizenBottomNav from "@/components/citizenBottomNav";
import CitizenHeader from "@/components/citizenHeader";
import { authClient } from "@/lib/auth";

interface CitizenLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function CitizenLayout({
  children,
  requireAuth = true,
}: CitizenLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(requireAuth);
  const [user, setUser] = useState<any>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setSidebarCollapsed(
        localStorage.getItem("citizen-sidebar-collapsed") === "true"
      );
    } catch {
      // Storage unavailable (private mode, etc.) — keep the default.
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("citizen-sidebar-collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await authClient.getCurrentUser();

        if (!currentUser || currentUser.role !== "citizen") {
          if (requireAuth) {
            router.push("/login");
            return;
          }
          setUser(null);
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("CitizenLayout: Auth check error:", error);
        if (requireAuth) {
          router.push("/login");
        }
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, []); // Run only once on mount

  if (isChecking && requireAuth) {
    return (
      <div
        role="status"
        className="min-h-screen bg-gradient-to-br from-brand-accent-50 via-white to-brand-secondary-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your session…</p>
        </div>
      </div>
    );
  }

  // Don't render content if no user AND this page requires auth
  // (will redirect anyway). Pages with requireAuth=false render regardless.
  if (!user && requireAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-accent-50 via-white to-brand-secondary-50">
      {/* Sidebar - Desktop only (w-72 open, w-20 collapsed) */}
      <CitizenSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content — offset must match the sidebar width */}
      <div
        className={`pb-24 lg:pb-0 transition-[margin] duration-200 motion-reduce:transition-none ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Header */}
        <CitizenHeader />

        {/* Page Content */}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <CitizenBottomNav />
    </div>
  );
}