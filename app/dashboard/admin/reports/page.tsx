"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/adminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Report {
  id: number;
  report_id: string;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved" | "rejected";
  timestamp?: string;
  created_at: string;
  updated_at: string;
  files?: Array<{
    id: number;
    path: string;
    type: string;
  }>;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default function AdminReportsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { toast } = useToast();

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000";

  const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder-image.jpg";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    if (path.startsWith("storage/")) {
      return `${IMAGE_BASE_URL}/${path}`;
    }

    if (!path.startsWith("/")) {
      return `${IMAGE_BASE_URL}/storage/${path}`;
    }

    return `${IMAGE_BASE_URL}${path}`;
  };

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const categories = [
    { value: "road", label: "Road", color: "bg-blue-100 text-blue-700" },
    {
      value: "streetlight",
      label: "Street Light",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "garbage",
      label: "Garbage",
      color: "bg-green-100 text-green-700",
    },
    { value: "water", label: "Water", color: "bg-cyan-100 text-cyan-700" },
    {
      value: "drainage",
      label: "Drainage",
      color: "bg-purple-100 text-purple-700",
    },
    { value: "other", label: "Other", color: "bg-gray-100 text-gray-700" },
  ];

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    {
      value: "in_progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700",
      icon: AlertCircle,
    },
    {
      value: "resolved",
      label: "Resolved",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },
    {
      value: "rejected",
      label: "Rejected",
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  ];

  const urgencies = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-red-600" },
  ];

  useEffect(() => {
    if (!authLoading && user) {
      fetchReports();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReports();
    }
  }, [pagination.current_page, categoryFilter, statusFilter, urgencyFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (urgencyFilter !== "all") {
        params.append("urgency", urgencyFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/admin/reports?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.data) {
          setReports(data.data.data || data.data || []);
          if (data.data.current_page) {
            setPagination({
              current_page: data.data.current_page || 1,
              last_page: data.data.last_page || 1,
              per_page: data.data.per_page || 15,
              total: data.data.total || 0,
              from: data.data.from || 0,
              to: data.data.to || 0,
            });
          }
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Failed to fetch reports.",
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reports.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (
    reportId: number,
    newStatus: Report["status"],
  ) => {
    try {
      setIsUpdating(true);

      const response = await fetch(`/api/admin/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Report status updated successfully.",
        });

        setReports(
          reports.map((r) =>
            r.id === reportId ? { ...r, status: newStatus } : r,
          ),
        );

        if (selectedReport?.id === reportId) {
          setSelectedReport({ ...selectedReport, status: newStatus });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update status.",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchReports();
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${cat?.color || "bg-gray-100 text-gray-700"}`}
      >
        {cat?.label || category}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const stat = statuses.find((s) => s.value === status);
    const Icon = stat?.icon || Clock;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${stat?.color || "bg-gray-100 text-gray-700"}`}
      >
        <Icon className="w-3 h-3" />
        {stat?.label || status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urg = urgencies.find((u) => u.value === urgency);
    return (
      <span
        className={`text-xs font-semibold ${urg?.color || "text-gray-600"}`}
      >
        {urg?.label || urgency}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Reports Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage citizen reports and issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  {statuses.map((stat) => (
                    <option key={stat.value} value={stat.value}>
                      {stat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={urgencyFilter}
                  onChange={(e) => {
                    setUrgencyFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Urgency</option>
                  {urgencies.map((urg) => (
                    <option key={urg.value} value={urg.value}>
                      {urg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {reports.filter((r) => r.status === "in_progress").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter((r) => r.status === "resolved").length}
              </p>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-gray-500">No citizen reports available</p>
              </div>
            ) : (
              <>
                {/* Desktop / Tablet Table - hidden on mobile, no swipe needed */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Report ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Citizen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Urgency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.map((report) => (
                        <tr
                          key={report.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">
                              {report.report_id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {report.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {report.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {report.user?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.user?.email || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getCategoryBadge(report.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getUrgencyBadge(report.urgency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={report.status}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  report.id,
                                  e.target.value as Report["status"],
                                )
                              }
                              disabled={isUpdating}
                              className="text-xs font-medium rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor:
                                  statuses
                                    .find((s) => s.value === report.status)
                                    ?.color.split(" ")[0]
                                    .replace("bg-", "") || "#f3f4f6",
                              }}
                            >
                              {statuses.map((stat) => (
                                <option key={stat.value} value={stat.value}>
                                  {stat.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(report.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewReport(report)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards - no horizontal scroll, no swiping */}
                <div className="sm:hidden divide-y divide-gray-200">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {report.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">
                            {report.report_id}
                          </p>
                        </div>
                        {getCategoryBadge(report.category)}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {report.location}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {report.user?.name || "N/A"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(report.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                        <div className="flex items-center gap-2">
                          {getUrgencyBadge(report.urgency)}
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                report.id,
                                e.target.value as Report["status"],
                              )
                            }
                            disabled={isUpdating}
                            className="text-xs font-medium rounded-full px-2 py-1 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                          >
                            {statuses.map((stat) => (
                              <option key={stat.value} value={stat.value}>
                                {stat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleViewReport(report)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!loading && reports.length > 0 && (
                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing {pagination.from} to {pagination.to} of{" "}
                      {pagination.total} results
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.last_page) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.last_page <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.current_page <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.current_page >=
                              pagination.last_page - 2
                            ) {
                              pageNum = pagination.last_page - 4 + i;
                            } else {
                              pageNum = pagination.current_page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                  pagination.current_page === pageNum
                                    ? "bg-orange-600 text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* View Modal */}
        {isModalOpen && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Report Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReport.report_id}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-4 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {/* Citizen Info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedReport.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedReport.user?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Report Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Title
                      </label>
                      <p className="text-base text-gray-900">
                        {selectedReport.title}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Category
                      </label>
                      <div>{getCategoryBadge(selectedReport.category)}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Urgency
                      </label>
                      <div>{getUrgencyBadge(selectedReport.urgency)}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedReport.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              selectedReport.id,
                              e.target.value as Report["status"],
                            )
                          }
                          disabled={isUpdating}
                          className="text-sm font-medium rounded-lg px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                        >
                          {statuses.map((stat) => (
                            <option key={stat.value} value={stat.value}>
                              {stat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Location
                      </label>
                      <p className="text-base text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {selectedReport.location}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Description
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-base text-gray-900 whitespace-pre-wrap">
                          {selectedReport.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Created At
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(selectedReport.created_at)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Last Updated
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(selectedReport.updated_at)}
                      </p>
                    </div>
                  </div>

                  {/* Files */}
                  {selectedReport.files && selectedReport.files.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Attachments
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedReport.files.map((file) => (
                          <div
                            key={file.id}
                            className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                          >
                            {file.type === "image" ? (
                              <Image
                                src={getImageUrl(file.path)}
                                alt="Report attachment"
                                fill
                                className="object-cover"
                                unoptimized
                                onError={(e) => {
                                  console.error(
                                    "Image load error for:",
                                    file.path,
                                  );
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-image.jpg";
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">
                                    Video File
                                  </p>
                                  <a
                                    href={getImageUrl(file.path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    View Video
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-3 bg-white flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
