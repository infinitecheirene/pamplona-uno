"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CitizenSidebar from "./CitizenSidebar";
import CitizenBottomNav from "@/components/citizenBottomNav";
import CitizenHeader from "@/components/citizenHeader";
import { authClient } from "@/lib/auth";

interface CitizenLayoutProps {
  children: React.ReactNode;
  /**
   * Set to false for pages that should be viewable/fillable without being
   * logged in (e.g. Report an Issue, service application forms). Those
   * pages handle their own auth check at submit time instead.
   * Defaults to true (existing behavior — protected pages).
   */
  requireAuth?: boolean;
}

export default function CitizenLayout({
  children,
  requireAuth = true,
}: CitizenLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(requireAuth);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get user from cookie-based auth. We still fetch this even when
        // requireAuth is false, so the header/sidebar can show the user's
        // name if they happen to already be logged in — we just don't
        // redirect/block when there isn't one.
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

  // Show loading state while checking auth — only blocks rendering when
  // this page actually requires auth. Public-ish pages (requireAuth=false)
  // render immediately without waiting.
  if (isChecking && requireAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Sidebar - Desktop only */}
      <CitizenSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        {/* Header */}
        <CitizenHeader />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <CitizenBottomNav />
    </div>
  );
}
