"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  FileText,
  GraduationCap,
  Rocket,
  MapPin,
  Bell,
  LogOut,
  File,
  AlertCircle,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  /** Path prefix used to decide the active state when it differs from `path` */
  match?: string;
  tone?: "danger";
};

type NavGroup = {
  /** Groups with a title render as a dropdown; the untitled group is always visible. */
  title?: string;
  items: NavItem[];
};

const BASE = "/dashboard/citizen";

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: Home, label: "Home", path: BASE },
      { icon: AlertCircle, label: "Report issue", path: `${BASE}/report-issue` },
      { icon: Grid3x3, label: "Services", path: `${BASE}/services` },
      { icon: Newspaper, label: "News", path: `${BASE}/news` },
      {
        icon: AlertTriangle,
        label: "Emergency",
        path: `${BASE}/emergency`,
        tone: "danger",
      },
      {
        icon: User,
        label: "Account",
        path: `${BASE}/account/applications`,
        match: `${BASE}/account`,
      },
    ],
  },
  {
    title: "Explore",
    items: [
      { icon: FileText, label: "Citizen guide", path: `${BASE}/citizen-guide` },
      { icon: GraduationCap, label: "Students", path: `${BASE}/students` },
      { icon: Rocket, label: "Startup", path: `${BASE}/startup` },
      { icon: MapPin, label: "City map", path: `${BASE}/city-map` },
      { icon: Bell, label: "Alerts", path: `${BASE}/alerts` },
    ],
  },
  {
    title: "Request a document",
    items: [
      {
        icon: File,
        label: "Certificate of indigency",
        path: `${BASE}/services/certificate-of-indigency`,
      },
      {
        icon: File,
        label: "Residency certificate",
        path: `${BASE}/services/residency-certificate`,
      },
      { icon: File, label: "Good moral", path: `${BASE}/services/good-moral` },
      {
        icon: File,
        label: "Barangay blotter",
        path: `${BASE}/services/barangay-blotter`,
      },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

const ringOnBrand =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-brand-accent-600";

interface CitizenSidebarProps {
  /** Controlled collapsed (icon-only) state. Falls back to internal state if omitted. */
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function CitizenSidebar({
  collapsed,
  onToggle,
}: CitizenSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const toggle = onToggle ?? (() => setInternalCollapsed((v) => !v));

  // Pick the single most specific item for the current URL, so that
  // /services doesn't light up while a /services/good-moral page is open.
  const activePath = React.useMemo(() => {
    let best: string | null = null;
    let bestLen = -1;
    for (const item of allItems) {
      const prefix = item.match ?? item.path;
      const isMatch =
        pathname === prefix ||
        (prefix !== BASE && pathname.startsWith(prefix + "/"));
      if (isMatch && prefix.length > bestLen) {
        best = item.path;
        bestLen = prefix.length;
      }
    }
    return best;
  }, [pathname]);

  const groupHasActive = (group: NavGroup) =>
    group.items.some((i) => i.path === activePath);

  // Dropdown state, keyed by group title. Sections start closed, except the
  // one containing the current page.
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      navGroups
        .filter((g) => g.title)
        .map((g) => [g.title as string, groupHasActive(g)])
    )
  );

  // When navigating, make sure the section holding the active page is open.
  React.useEffect(() => {
    const group = navGroups.find((g) => g.title && groupHasActive(g));
    if (group?.title) {
      setOpenSections((prev) =>
        prev[group.title as string]
          ? prev
          : { ...prev, [group.title as string]: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath]);

  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);

    try {
      await authClient.logout();

      toast({
        title: "✓ Logged out",
        description: "You have been securely logged out.",
        className: "bg-brand-accent-50 border-brand-accent-200",
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

  const renderItem = (item: NavItem, compact: boolean) => {
    const active = item.path === activePath;
    const danger = item.tone === "danger";

    const layout = isCollapsed
      ? "justify-center px-0 py-2.5"
      : compact
      ? "gap-3 px-3 py-2 text-sm"
      : "gap-3 px-3 py-2.5 text-[15px]";

    let state: string;
    if (active) {
      state = "bg-white text-brand-accent-700 font-semibold shadow-sm";
    } else if (danger) {
      state = "text-white bg-red-500/25 hover:bg-red-500/40";
    } else {
      state = "text-white/85 hover:bg-white/15 hover:text-white";
    }

    return (
      <li key={item.path}>
        <Link
          href={item.path}
          title={isCollapsed ? item.label : undefined}
          aria-label={isCollapsed ? item.label : undefined}
          aria-current={active ? "page" : undefined}
          className={`flex items-center rounded-xl transition-colors ${ringOnBrand} ${layout} ${state}`}
        >
          <item.icon
            size={isCollapsed ? 20 : compact ? 17 : 20}
            className="shrink-0"
            aria-hidden="true"
          />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </Link>
      </li>
    );
  };

  const toggleButton = (
    <button
      type="button"
      onClick={toggle}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!isCollapsed}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={`flex w-10 h-10 shrink-0 items-center justify-center rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-colors ${ringOnBrand}`}
    >
      {isCollapsed ? (
        <PanelLeftOpen size={20} aria-hidden="true" />
      ) : (
        <PanelLeftClose size={20} aria-hidden="true" />
      )}
    </button>
  );

  return (
    <aside
      aria-label="Citizen navigation"
      className={`hidden lg:flex fixed top-0 left-0 h-full flex-col bg-gradient-to-b from-brand-accent-600 to-brand-secondary-500 text-white shadow-2xl z-50 transition-[width] duration-200 motion-reduce:transition-none ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand + toggle */}
      <div
        className={`border-b border-white/15 ${
          isCollapsed
            ? "flex flex-col items-center gap-3 px-2 pt-5 pb-4"
            : "flex items-center gap-2 pl-6 pr-4 pt-6 pb-5"
        }`}
      >
        <Link
          href={BASE}
          title={isCollapsed ? "Pamplona Tres City — Home" : undefined}
          className={`flex items-center gap-3 min-w-0 flex-1 rounded-xl ${ringOnBrand} ${
            isCollapsed ? "flex-none" : ""
          }`}
        >
          <div className="w-12 h-12 shrink-0 rounded-full bg-white ring-2 ring-white/40 flex items-center justify-center overflow-hidden">
            <img
              src="/pamplona_tres.png"
              alt={isCollapsed ? "Pamplona Tres City" : ""}
              className="w-full h-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="leading-tight min-w-0">
              <p className="font-bold text-lg truncate">Pamplona Tres City</p>
              <p className="text-sm text-brand-accent-100">Citizen portal</p>
            </div>
          )}
        </Link>
        {toggleButton}
      </div>

      {/* Scrollable navigation */}
      <nav
        className={`flex-1 overflow-y-auto py-5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_transparent] ${
          isCollapsed ? "px-4 space-y-3" : "px-4 space-y-4"
        }`}
      >
        {navGroups.map((group, i) => {
          const title = group.title;

          // Icon rail: every item is shown as an icon, groups separated by a rule.
          if (isCollapsed) {
            return (
              <React.Fragment key={title ?? i}>
                {i > 0 && <hr className="border-white/15 mx-1" />}
                <ul className="space-y-1">
                  {group.items.map((item) => renderItem(item, false))}
                </ul>
              </React.Fragment>
            );
          }

          // Always-visible primary group.
          if (!title) {
            return (
              <ul key={i} className="space-y-1">
                {group.items.map((item) => renderItem(item, false))}
              </ul>
            );
          }

          // Dropdown group.
          const open = !!openSections[title];
          const panelId = `sidebar-section-${title.replace(/\s+/g, "-").toLowerCase()}`;
          const hasActive = groupHasActive(group);

          return (
            <section key={title}>
              <button
                type="button"
                onClick={() => toggleSection(title)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10 hover:text-white ${ringOnBrand} ${
                  hasActive && !open
                    ? "text-white"
                    : "text-brand-accent-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  {title}
                  {hasActive && !open && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-white"
                      aria-label="Contains current page"
                    />
                  )}
                </span>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform duration-200 motion-reduce:transition-none ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <ul
                  className={`min-h-0 overflow-hidden space-y-0.5 transition-[visibility] duration-200 ${
                    open ? "visible" : "invisible"
                  }`}
                >
                  {group.items.map((item) => renderItem(item, true))}
                </ul>
              </div>
            </section>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/15">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isCollapsed ? "Log out" : undefined}
          aria-label={isCollapsed ? "Log out" : undefined}
          className={`w-full flex items-center rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed ${ringOnBrand} ${
            isCollapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
          }`}
        >
          {isLoggingOut ? (
            <>
              <span
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              {!isCollapsed && <span className="font-medium">Logging out…</span>}
            </>
          ) : (
            <>
              <LogOut size={20} aria-hidden="true" />
              {!isCollapsed && <span className="font-medium">Log out</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  );
}