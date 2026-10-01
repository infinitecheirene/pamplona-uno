"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  Calendar,
  User,
  Hash,
  RefreshCw,
  Heart,
  Shield,
  Building,
  Users,
  Home,
  FileHeart,
  AlertTriangle,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface Application {
  id: number;
  reference_number: string;
  status: string;
  created_at: string;
  type: string;
  document_path?: string;
  photo_path?: string;
  image_url?: string;
  [key: string]: unknown;
}

// Shape returned by GET /api/reports (mirrors the report_id/data payload
// your POST /api/reports/submit endpoint already uses).
interface ReportItem {
  id: number;
  report_id: string;
  status: string;
  category: string;
  title?: string;
  description?: string;
  location?: string;
  urgency?: string;
  created_at: string;
  files?: Array<{
    id: number;
    name: string;
    url: string;
    type?: string;
  }>;
}

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000";

const extractList = <T,>(payload: unknown, depth = 0): T[] => {
  if (depth > 6 || payload === null || payload === undefined) return [];
  if (Array.isArray(payload)) return payload as T[];
  if (typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  const wrapperKeys = ["data", "reports", "applications", "items", "results"];

  for (const key of wrapperKeys) {
    if (key in obj) {
      const found = extractList<T>(obj[key], depth + 1);
      if (found.length > 0) return found;
    }
  }

  return [];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const reportCategoryLabels: Record<string, string> = {
  road: "Road Damage",
  streetlight: "Street Light",
  garbage: "Garbage/Waste",
  drainage: "Drainage/Flood",
  traffic: "Traffic Issue",
  vandalism: "Vandalism",
  noise: "Noise Complaint",
  other: "Other Issue",
};

const mapReportToApplication = (report: ReportItem): Application => ({
  id: report.id,
  reference_number: report.report_id,
  status: report.status,
  created_at: report.created_at,
  type: reportCategoryLabels[report.category] || "Other Issue",
  title: report.title,
  description: report.description,
  location: report.location,
  urgency: report.urgency,
  files: report.files,
});

const categories = [
  {
    id: "report-issue",
    name: "Report an issue",
    icon: AlertTriangle,
    color: "from-brand-primary-500 to-brand-secondary-600",
    bgColor: "bg-brand-primary-50",
    borderColor: "border-brand-primary-500",
    textColor: "text-brand-primary-700",
    types: [
      "Road Damage",
      "Street Light",
      "Garbage/Waste",
      "Drainage/Flood",
      "Traffic Issue",
      "Vandalism",
      "Noise Complaint",
      "Other Issue",
    ],
  },
  {
    id: "health-certificate",
    name: "Health certificate",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-500",
    textColor: "text-rose-700",
    types: ["Health Certificate"],
  },
  {
    id: "barangay-clearance",
    name: "Barangay clearance",
    icon: Shield,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700",
    types: ["Barangay Clearance"],
  },
  {
    id: "business-permit",
    name: "Business permit",
    icon: Building,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-700",
    types: ["Business Permit", "Business Permit Renewal"],
  },
  {
    id: "cedula",
    name: "Cedula",
    icon: Users,
    color: "from-teal-500 to-brand-accent-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-500",
    textColor: "text-teal-700",
    types: ["Cedula", "Community Tax Certificate"],
  },
  {
    id: "medical-assistance",
    name: "Medical assistance",
    icon: FileHeart,
    color: "from-brand-secondary-500 to-amber-600",
    bgColor: "bg-brand-secondary-50",
    borderColor: "border-brand-secondary-500",
    textColor: "text-brand-secondary-700",
    types: ["Medical Assistance"],
  },
  {
    id: "building-permit",
    name: "Building permit",
    icon: Home,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    textColor: "text-indigo-700",
    types: ["Building Permit"],
  },
  {
    id: "other",
    name: "Other services",
    icon: FileText,
    color: "from-gray-500 to-slate-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-500",
    textColor: "text-gray-700",
    types: [],
  },
];

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const verifyAuth = async () => {
      let user: unknown = null;

      try {
        user = await authClient.getCurrentUser();
      } catch (err) {
        // A network or server hiccup is not proof the session is gone,
        // so show a retryable error instead of sending the person to /login.
        console.error("Error verifying authentication:", err);
        if (cancelled) return;
        setError(
          "We couldn't verify your session. Check your connection and try again.",
        );
        setIsAuthenticated(true); // let the page render the error banner + Retry
        setLoading(false);
        return;
      }

      if (cancelled) return;

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your applications.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);

      const success = searchParams.get("success");
      if (success) {
        toast({
          title: "Success!",
          description: `Your ${success} application has been submitted.`,
        });
      }

      await fetchApplications();
    };

    verifyAuth();

    return () => {
      cancelled = true;
    };
    // Run the session check once per visit. `toast` and `router` are not stable
    // in every setup, and re-running this effect would refetch (and re-check
    // auth) on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const [applicationsRes, reportsRes] = await Promise.all([
        fetch("/api/applications", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/reports", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (applicationsRes.status === 401) {
        // A 401 from this endpoint doesn't prove the person is logged out
        // (the request may just be missing the credentials authClient sends).
        // Only leave the page if the auth client agrees the session is gone.
        const user = await authClient.getCurrentUser().catch(() => null);

        if (!user) {
          toast({
            title: "Session Expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        throw new Error(
          "The server rejected the request for your applications (401), but you are still signed in. Try again, and contact support if it keeps happening.",
        );
      }

      if (!applicationsRes.ok) {
        throw new Error(
          `Failed to fetch applications: ${applicationsRes.statusText}`,
        );
      }

      const data = await applicationsRes.json();
      const apps: Application[] = extractList<Application>(data);

      let reportApps: Application[] = [];
      if (reportsRes.ok) {
        try {
          const reportsData = await reportsRes.json();
          const reports = extractList<ReportItem>(reportsData);
          reportApps = reports.map(mapReportToApplication);
        } catch (err) {
          console.error("Error parsing reports response:", err);
        }
      } else {
        console.warn(
          `Reports endpoint returned ${reportsRes.status}; skipping reported issues.`,
        );
      }

      const combinedApps = [...apps, ...reportApps].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setApplications(combinedApps);

      if (combinedApps.length > 0) {
        toast({
          title: "Applications Loaded",
          description: `Found ${combinedApps.length} application${combinedApps.length !== 1 ? "s" : ""}.`,
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load applications";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-brand-accent-600 text-white hover:bg-brand-accent-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-700 text-white hover:bg-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-brand-primary-600 text-white hover:bg-brand-primary-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge className="bg-slate-500 text-white">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "border-l-brand-accent-500 bg-brand-accent-50/50";
      case "pending":
        return "border-l-amber-500 bg-amber-50/50";
      case "rejected":
        return "border-l-rose-500 bg-rose-50/50";
      default:
        return "border-l-slate-500 bg-slate-50/50";
    }
  };

  const getCategoryForType = (type: string): (typeof categories)[0] | null => {
    const category = categories.find((cat) =>
      cat.types.some((t) => type.toLowerCase().includes(t.toLowerCase())),
    );
    return category || categories.find((cat) => cat.id === "other") || null;
  };

  const getCategoryApps = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];

    if (category.id === "other") {
      return applications.filter((app) => {
        const appCategory = getCategoryForType(app.type);
        return appCategory?.id === "other";
      });
    }

    return applications.filter((app) =>
      category.types.some((t) =>
        app.type.toLowerCase().includes(t.toLowerCase()),
      ),
    );
  };

  const filterAndSortApplications = (apps: Application[]) => {
    let filtered = apps.filter((app) => {
      if (statusFilter !== "all" && app.status.toLowerCase() !== statusFilter)
        return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.reference_number.toLowerCase().includes(query) ||
          app.type.toLowerCase().includes(query) ||
          String(
            app.full_name || app.fullName || app.owner_name || app.title || "",
          )
            .toLowerCase()
            .includes(query)
        );
      }

      return true;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "type":
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }

    return filtered;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status.toLowerCase() === "pending")
      .length,
    approved: applications.filter((a) => a.status.toLowerCase() === "approved")
      .length,
    rejected: applications.filter((a) => a.status.toLowerCase() === "rejected")
      .length,
  };

  if (!isAuthenticated || loading) {
    return (
      <div role="status" aria-label={!isAuthenticated ? "Checking your session" : "Loading applications"} className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      </div>
    );
  }

  const currentCategoryApps = selectedCategory
    ? filterAndSortApplications(getCategoryApps(selectedCategory))
    : [];

  return (
    <div className="space-y-6">
      <header>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">My applications</h1>
              <p className="mt-1 text-gray-600">Check your request status or choose a category to see details.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchApplications}
              aria-label="Refresh applications"
              className="hidden sm:flex gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">All requests</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
      </header>

      <div>
        {error && (
          <div role="alert" className="mb-6 rounded-2xl border-2 border-brand-primary-200 bg-brand-primary-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-brand-primary-900">
                  Error loading applications
                </p>
                <p className="text-sm text-brand-primary-700 mt-1">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchApplications}
                className="rounded-xl text-brand-primary-700 hover:bg-brand-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {!selectedCategory ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Choose a request category
              </h2>
              <p className="text-gray-600">
                Choose a category to view your applications
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const categoryApps = getCategoryApps(category.id);
                const Icon = category.icon;

                return (
                  <li key={category.id}>
                  <Card
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCategory(category.id); } }}
                    className="h-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none group"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.bgColor}`}
                        >
                          <Icon className={`h-7 w-7 ${category.textColor}`} aria-hidden="true" />
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${category.bgColor} ${category.textColor}`}
                        >
                          {categoryApps.length}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {categoryApps.length} application
                        {categoryApps.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex gap-2 flex-wrap">
                        {["pending", "approved", "rejected"].map((status) => {
                          const count = categoryApps.filter(
                            (a) => a.status.toLowerCase() === status,
                          ).length;
                          if (count === 0) return null;
                          return (
                            <Badge
                              key={status}
                              variant="secondary"
                              className={
                                status === "approved"
                                  ? "bg-brand-accent-100 text-brand-accent-700"
                                  : status === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-rose-100 text-rose-700"
                              }
                            >
                              {count} {status}
                            </Badge>
                          );
                        })}
                      </div>
                      <span className="mt-4 inline-flex font-semibold text-brand-secondary-700">Open category <ArrowLeft className="h-4 w-4 ml-2 rotate-180" aria-hidden="true" /></span>
                    </CardContent>
                  </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="mb-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>

              {(() => {
                const category = categories.find(
                  (c) => c.id === selectedCategory,
                );
                const Icon = category?.icon || FileText;
                return (
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${category?.bgColor}`}
                    >
                      <Icon className={`h-7 w-7 ${category?.textColor}`} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {category?.name}
                      </h2>
                      <p className="text-gray-600">
                        {currentCategoryApps.length} application
                        {currentCategoryApps.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-gray-300 pl-10 focus:border-brand-accent-600 focus:ring-brand-accent-600/30"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full rounded-xl border-gray-300 sm:w-40 focus-visible:ring-2 focus-visible:ring-brand-accent-600">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full rounded-xl border-gray-300 sm:w-40 focus-visible:ring-2 focus-visible:ring-brand-accent-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="type">By request type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentCategoryApps.length === 0 ? (
              <Card className="rounded-2xl border border-gray-200 bg-white">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-secondary-50">
                    <FileText className="h-7 w-7 text-brand-secondary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {searchQuery
                      ? "No matching applications"
                      : "No applications found"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "Try adjusting your search criteria or filters."
                      : statusFilter !== "all"
                        ? `You don't have any ${statusFilter} applications in this category.`
                        : "You haven't submitted any applications in this category yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentCategoryApps.map((app) => (
                  <Card
                    key={`${app.type}-${app.id}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedApp(app); } }}
                    className={`rounded-2xl border border-gray-200 border-l-4 ${getStatusColor(app.status)} cursor-pointer transition-all hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none group`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-50">
                          <FileText className="h-6 w-6 text-brand-secondary-600" aria-hidden="true" />
                        </div>

                        <div className="flex-1 min-w-0">
                              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-brand-secondary-600 transition-colors mb-1">
                                {String(app.title || app.type)}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Hash className="h-3.5 w-3.5" />
                                  {app.reference_number}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(app.created_at)}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <User className="h-3.5 w-3.5" />
                                  {String(
                                    app.full_name ||
                                      app.fullName ||
                                      app.owner_name ||
                                      app.groom_name ||
                                      "N/A",
                                  )}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(app.status)}
                          </div>

                              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary-700">
                                <Eye className="h-4 w-4" aria-hidden="true" />
                                Open request details
                              </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                  {String(selectedApp?.title || selectedApp?.type)}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4" />
                  {selectedApp?.reference_number}
                </DialogDescription>
              </div>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </div>
          </DialogHeader>

          {selectedApp && (
            <div className="overflow-y-auto flex-1 px-1">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="rounded-2xl border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Status
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(selectedApp.status)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Submitted Date
                      </p>
                      <p className="font-semibold text-gray-900 mt-2">
                        {formatDate(selectedApp.created_at)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Application ID
                      </p>
                      <p className="font-semibold text-gray-900 mt-2">
                        #{selectedApp.id}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary-500 to-brand-secondary-600 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Application Details
                    </h3>
                  </div>

                  <Card className="border-0 shadow-md">
                    <CardContent className="p-0 divide-y">
                      {Object.entries(selectedApp).map(([key, value]) => {
                        if (
                          [
                            "id",
                            "type",
                            "created_at",
                            "status",
                            "reference_number",
                            "user_id",
                            "user",
                            "updated_at",
                            "deleted_at",
                          ].includes(key)
                        ) {
                          return null;
                        }

                        if (
                          key.toLowerCase().includes("_url") &&
                          (key.toLowerCase().includes("building") ||
                            key.toLowerCase().includes("land") ||
                            key.toLowerCase().includes("title") ||
                            key.toLowerCase().includes("plan"))
                        ) {
                          return null;
                        }

                        // Reports carry their photos/videos as an array of
                        // { id, name, url } objects rather than a single
                        // string path, so they need their own row renderer.
                        const isFileArray =
                          key === "files" && Array.isArray(value);

                        if (isFileArray) {
                          const fileList = value as Array<{
                            id: number;
                            name: string;
                            url: string;
                            type?: string;
                          }>;
                          if (fileList.length === 0) return null;

                          return (
                            <div
                              key={key}
                              className="flex flex-col py-3 px-4 hover:bg-gray-50 transition-colors"
                            >
                              <dt className="text-sm font-semibold text-gray-700 capitalize mb-2">
                                Attachments
                              </dt>
                              <dd className="flex flex-wrap gap-3">
                                {fileList.map((file) => {
                                  const isImage = file.type
                                    ? file.type === "image"
                                    : !!file.name.match(
                                        /\.(jpg|jpeg|png|gif|webp)$/i,
                                      );
                                  const fileUrl = file.url.startsWith("http")
                                    ? file.url
                                    : `${IMAGE_BASE_URL}/${file.url}`;

                                  if (isImage) {
                                    return (
                                      <div
                                        key={file.id}
                                        className="relative w-32 h-32 rounded-lg overflow-hidden border shadow-sm bg-gray-50"
                                      >
                                        <img
                                          src={fileUrl}
                                          alt={file.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.src = "/placeholder.png";
                                          }}
                                        />
                                      </div>
                                    );
                                  }

                                  return (
                                    <a
                                      key={file.id}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 hover:bg-blue-100 transition-colors"
                                    >
                                      <Paperclip className="h-4 w-4 text-blue-600" />
                                      {file.name}
                                    </a>
                                  );
                                })}
                              </dd>
                            </div>
                          );
                        }

                        const isImagePath =
                          value &&
                          typeof value === "string" &&
                          (value.includes("uploads/") ||
                            value.includes("medical-assistance-documents/") ||
                            value.includes(".jpg") ||
                            value.includes(".jpeg") ||
                            value.includes(".png") ||
                            value.includes(".gif") ||
                            value.includes(".webp") ||
                            value.includes(".pdf") ||
                            key.includes("photo") ||
                            key.includes("image") ||
                            key.includes("picture") ||
                            key.includes("supporting") ||
                            (key.includes("document") &&
                              value.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i)));

                        const isPdfFile =
                          value &&
                          typeof value === "string" &&
                          value.match(/\.pdf$/i);

                        if (isImagePath) {
                          return (
                            <div
                              key={key}
                              className="flex flex-col py-3 px-4 hover:bg-gray-50 transition-colors"
                            >
                              <dt className="text-sm font-semibold text-gray-700 capitalize mb-2">
                                {key.replace(/_/g, " ")}
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {isPdfFile ? (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <FileText className="h-5 w-5 text-blue-600" />
                                      <span className="text-sm font-medium text-blue-900">
                                        PDF Document
                                      </span>
                                    </div>
                                    <a
                                      href={`${IMAGE_BASE_URL}/${value}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-fit"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View PDF Document
                                    </a>
                                  </div>
                                ) : (
                                  <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border shadow-sm bg-gray-50">
                                    <img
                                      src={`${IMAGE_BASE_URL}/${value}`}
                                      alt={key}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        console.error(
                                          "Failed to load image:",
                                          value,
                                        );
                                        target.src = "/placeholder.png";
                                      }}
                                    />
                                  </div>
                                )}
                              </dd>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={key}
                            className="flex py-3 px-4 hover:bg-gray-50 transition-colors"
                          >
                            <dt className="text-sm font-semibold text-gray-700 capitalize w-1/3 flex-shrink-0">
                              {key.replace(/_/g, " ")}
                            </dt>
                            <dd className="text-sm text-gray-900 flex-1 break-words">
                              {(() => {
                                if (value && typeof value === "string") {
                                  const datePattern =
                                    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.*)?$/;
                                  if (datePattern.test(value)) {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                      return formatDate(value);
                                    }
                                  }
                                }
                                return String(value ?? "N/A");
                              })()}
                            </dd>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <CitizenLayout>
      <Suspense
        fallback={
          <div role="status" aria-label="Loading applications" className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-gray-100" />)}
            </div>
          </div>
        }
      >
        <ApplicationsContent />
      </Suspense>
    </CitizenLayout>
  );
}