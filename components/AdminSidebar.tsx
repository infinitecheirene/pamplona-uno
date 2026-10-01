"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Mail,
  ClipboardList,
  User,
  LogOut,
  Shield,
  Store,
  Building,
  HeartHandshake,
  ScrollText,
  MapPin,
  Home,
  HandHelping,
  UserCheck,
  Stethoscope,
  Ambulance,
  BadgeCheck,
  ShieldCheck,
  Landmark,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

type NavGroup = {
  title?: string;
  icon?: LucideIcon;
  items: NavItem[];
};

const BASE = "/dashboard/admin";

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: BASE },
      { icon: Newspaper, label: "News", path: `${BASE}/news` },
      {
        icon: Megaphone,
        label: "Announcements",
        path: `${BASE}/announcements`,
      },
      {
        icon: Mail,
        label: "Contact messages",
        path: `${BASE}/contact`,
      },
      {
        icon: ClipboardList,
        label: "Reports",
        path: `${BASE}/reports`,
      },
    ],
  },

  {
    title: "Government services",
    icon: Landmark,
    items: [
      {
        icon: Store,
        label: "Business permit",
        path: `${BASE}/business-permit`,
      },
      {
        icon: Building,
        label: "Building permit",
        path: `${BASE}/building-permit`,
      },
      {
        icon: HeartHandshake,
        label: "Marriage license",
        path: `${BASE}/marriage-license`,
      },
    ],
  },

  {
    title: "Civil registry",
    icon: ScrollText,
    items: [
      {
        icon: ScrollText,
        label: "Cedula",
        path: `${BASE}/cedula`,
      },
      {
        icon: MapPin,
        label: "Residency certificate",
        path: `${BASE}/residency-certificate`,
      },
      {
        icon: Home,
        label: "Indigency certificate",
        path: `${BASE}/indigency-certificate`,
      },
      {
        icon: HandHelping,
        label: "Good moral certificate",
        path: `${BASE}/good-moral-certificate`,
      },
    ],
  },

  {
    title: "Health services",
    icon: HeartPulse,
    items: [
      {
        icon: UserCheck,
        label: "Health certificate",
        path: `${BASE}/health-certificate`,
      },
      {
        icon: Stethoscope,
        label: "Medical assistance",
        path: `${BASE}/medical-assistance`,
      },
      {
        icon: Ambulance,
        label: "Ambulance requests",
        path: `${BASE}/ambulance-request`,
      },
    ],
  },

  {
    title: "Public safety",
    icon: ShieldCheck,
    items: [
      {
        icon: BadgeCheck,
        label: "Barangay clearance",
        path: `${BASE}/barangay-clearance`,
      },
      {
        icon: ShieldCheck,
        label: "Barangay blotter",
        path: `${BASE}/barangay-blotter`,
      },
    ],
  },

  {
    items: [
      {
        icon: User,
        label: "Users",
        path: `${BASE}/users`,
      },
    ],
  },
];

const allItems = navGroups.flatMap((group) => group.items);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-white/80 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-brand-accent-600";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Find the most specific active route.
  const activePath = React.useMemo(() => {
    let best: string | null = null;
    let bestLen = -1;

    for (const item of allItems) {
      const isMatch =
        pathname === item.path ||
        (item.path !== BASE &&
          pathname.startsWith(item.path + "/"));

      if (isMatch && item.path.length > bestLen) {
        best = item.path;
        bestLen = item.path.length;
      }
    }

    return best;
  }, [pathname]);

  const renderItem = (item: NavItem) => {
    const active = item.path === activePath;

    return (
      <li key={item.path}>
        <Link
          href={item.path}
          aria-current={active ? "page" : undefined}
          className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${focusRing} ${
            active
              ? "bg-white font-semibold text-brand-accent-700 shadow-sm"
              : "text-white/85 hover:bg-white/15 hover:text-white"
          }`}
        >
          {active && (
            <span
              aria-hidden="true"
              className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-white"
            />
          )}

          <item.icon
            size={18}
            strokeWidth={active ? 2.25 : 1.75}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="truncate">
            {item.label}
          </span>
        </Link>
      </li>
    );
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);

    try {
      await authClient.logout();

      toast({
        title: "✓ Logged out",
        description: "You have been securely logged out.",
        className:
          "bg-brand-accent-50 border-brand-accent-200",
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);

      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
      });

      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Admin navigation"
      className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col bg-gradient-to-b from-brand-accent-600 to-brand-secondary-500 text-white shadow-2xl lg:flex"
    >
      {/* Brand */}
      <div className="border-b border-white/15 px-5 pb-4 pt-5">
        <Link
          href={BASE}
          className={`flex min-w-0 items-center gap-3 rounded-xl ${focusRing}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-800">
            <Shield
              size={20}
              aria-hidden="true"
            />
          </span>

          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-semibold">
              Pamplona Uno City
            </span>

            <span className="block text-sm text-slate-200">
              Admin panel
            </span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-color:rgba(255,255,255,0.3)_transparent] [scrollbar-width:thin]"
      >
        <div className="space-y-4">
          {navGroups.map((group, index) => {
            const GroupIcon = group.icon;

            return (
              <section
                key={group.title ?? `group-${index}`}
                className={
                  index > 0
                    ? "border-t border-white/15 pt-4"
                    : ""
                }
              >
                {/* Section title */}
                {group.title && (
                  <div className="mb-2 flex items-center gap-2 px-3">
                    {GroupIcon && (
                      <GroupIcon
                        size={16}
                        strokeWidth={1.75}
                        className="text-brand-accent-100"
                        aria-hidden="true"
                      />
                    )}

                    <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-accent-100">
                      {group.title}
                    </h2>
                  </div>
                )}

                <ul className="space-y-0.5">
                  {group.items.map(renderItem)}
                </ul>
              </section>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/15 px-4 py-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/90 transition-colors hover:bg-brand-primary-500/20 hover:text-brand-primary-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          {isLoggingOut ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none"
                aria-hidden="true"
              />

              <span className="font-medium">
                Logging out…
              </span>
            </>
          ) : (
            <>
              <LogOut
                size={18}
                strokeWidth={1.75}
                aria-hidden="true"
              />

              <span className="font-medium">
                Log out
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}