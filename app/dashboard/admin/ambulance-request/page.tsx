"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Ambulance,
  X,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertCircle,
  Activity,
  Navigation,
  Siren,
} from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface AmbulanceRequest {
  id: number;
  request_id: string;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  emergency: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  status:
    | "pending"
    | "dispatched"
    | "en_route"
    | "arrived"
    | "completed"
    | "cancelled";
  requested_at: string;
  dispatched_at?: string;
  arrived_at?: string;
  completed_at?: string;
  estimated_arrival?: string;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default function AdminAmbulanceRequestsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { toast } = useToast();

  const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] =
    useState<AmbulanceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchRequests();
    }
  }, [authLoading, user, pagination.current_page, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/emergency/ambulance?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setRequests(data.data.data || []);
          setPagination({
            current_page: data.data.current_page || 1,
            last_page: data.data.last_page || 1,
            per_page: data.data.per_page || 15,
            total: data.data.total || 0,
            from: data.data.from || 0,
            to: data.data.to || 0,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch ambulance requests.",
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ambulance requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: AmbulanceRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/emergency/ambulance/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Ambulance request status updated to ${newStatus}.`,
        });

        closeModal();
        fetchRequests();
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
        description: "Failed to update request status.",
      });
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchRequests();
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-brand-secondary-100 text-brand-secondary-700",
      dispatched: "bg-blue-100 text-blue-700",
      en_route: "bg-purple-100 text-purple-700",
      arrived: "bg-cyan-100 text-cyan-700",
      completed: "bg-brand-accent-100 text-brand-accent-700",
      cancelled: "bg-brand-primary-100 text-brand-primary-700",
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      dispatched: <Activity className="w-3 h-3" />,
      en_route: <Navigation className="w-3 h-3" />,
      arrived: <MapPin className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status as keyof typeof styles]}`}
      >
        {icons[status as keyof typeof icons]}
        {status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    );
  };

  const getEmergencyBadge = (emergency: string) => {
    const styles = {
      cardiac: "bg-brand-primary-100 text-brand-primary-700",
      breathing: "bg-blue-100 text-blue-700",
      accident: "bg-yellow-100 text-yellow-700",
      medical: "bg-brand-accent-100 text-brand-accent-700",
      injury: "bg-brand-secondary-100 text-brand-secondary-700",
      other: "bg-purple-100 text-purple-700",
    };

    const labels = {
      cardiac: "❤️ Cardiac",
      breathing: "🫁 Breathing",
      accident: "🚗 Accident",
      medical: "🏥 Medical",
      injury: "🩹 Injury",
      other: "⚕️ Other",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[emergency as keyof typeof styles]}`}
      >
        {labels[emergency as keyof typeof labels]}
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
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-full overflow-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Ambulance className="w-6 h-6 text-brand-primary-600" />
                Ambulance Requests
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Emergency ambulance request management
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Siren className="w-5 h-5 text-brand-primary-600" />
              <span className="font-medium">{pagination.total} Total</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by request ID, name, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none sm:w-40">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPagination((prev) => ({ ...prev, current_page: 1 }));
                      }}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="en_route">En Route</option>
                      <option value="arrived">Arrived</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-brand-accent-600 text-white rounded-lg text-sm font-medium hover:bg-brand-accent-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards - Mobile */}
            <div className="grid grid-cols-3 gap-2 sm:hidden mb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg font-bold text-brand-secondary-600">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-600">Active</p>
                <p className="text-lg font-bold text-blue-600">
                  {
                    requests.filter((r) =>
                      ["dispatched", "en_route", "arrived"].includes(r.status),
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-lg font-bold text-brand-accent-600">
                  {requests.filter((r) => r.status === "completed").length}
                </p>
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-accent-500 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading requests...</p>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Ambulance className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">No requests found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop / Tablet Table - hidden on mobile, no swipe needed */}
                  <div className="hidden sm:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-brand-accent-600 to-brand-secondary-500 text-white">
                          <tr>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Request ID
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Patient Name
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Contact
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Emergency Type
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Location
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Status
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                              Requested
                            </th>
                            <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap sticky right-0 bg-gradient-to-r from-brand-accent-600 to-brand-secondary-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {requests.map((request) => (
                            <tr
                              key={request.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                                <div className="font-mono">
                                  {request.request_id}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                <div
                                  className="max-w-[150px] truncate"
                                  title={request.name}
                                >
                                  {request.name}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {request.phone}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                {getEmergencyBadge(request.emergency)}
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                <div
                                  className="max-w-[200px] truncate"
                                  title={request.address}
                                >
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span>{request.address}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                {getStatusBadge(request.status)}
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                {formatDate(request.requested_at)}
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap sticky right-0 bg-white">
                                <button
                                  onClick={() => handleViewRequest(request)}
                                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-brand-accent-100 text-brand-accent-700 rounded-lg text-xs font-medium hover:bg-brand-accent-200 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="hidden sm:inline">View</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards - no horizontal scroll, no swiping */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {requests.map((request) => (
                      <button
                        key={request.id}
                        onClick={() => handleViewRequest(request)}
                        className="w-full text-left p-4 space-y-3 active:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-gray-500">
                              {request.request_id}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {request.name}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {getEmergencyBadge(request.emergency)}
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            {request.phone}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {request.address}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {formatDate(request.requested_at)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-accent-100 text-brand-accent-700 rounded-lg text-xs font-medium">
                            <Eye className="w-3 h-3" />
                            View
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            {!loading && requests.length > 0 && (
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    Showing {pagination.from} to {pagination.to} of{" "}
                    {pagination.total} results
                  </p>

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
                                  ? "bg-brand-accent-600 text-white"
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
              </div>
            )}
          </div>
        </main>

        {/* View Modal */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white sm:rounded-xl shadow-2xl w-full sm:max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div
                style={{
                  background:
                    "linear-gradient(to right, var(--brand-primary-600), var(--brand-secondary-600), var(--brand-accent-600))",
                }}
                className="text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Ambulance className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 animate-pulse" />
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold truncate">
                      Ambulance Request
                    </h2>
                    <p className="text-xs sm:text-sm text-white/90 font-mono">
                      {selectedRequest.request_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
                <div className="space-y-4 sm:space-y-6 pb-4">
                  {/* Status & Emergency Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        Status
                      </span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        Emergency Type
                      </span>
                      {getEmergencyBadge(selectedRequest.emergency)}
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent-600" />
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          Name
                        </label>
                        <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                          {selectedRequest.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                          Contact Number
                        </label>
                        <a
                          href={`tel:${selectedRequest.phone}`}
                          className="text-sm sm:text-base text-brand-accent-600 hover:text-brand-accent-700 font-medium"
                        >
                          {selectedRequest.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent-600" />
                      Location
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-500">
                          Address
                        </label>
                        <p className="text-sm sm:text-base text-gray-900 break-words">
                          {selectedRequest.address}
                        </p>
                      </div>
                      {selectedRequest.latitude != null &&
                        selectedRequest.longitude != null && (
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-500">
                              GPS Coordinates
                            </label>
                            <p className="text-sm sm:text-base text-gray-900 font-mono">
                              {Number(selectedRequest.latitude).toFixed(6)},{" "}
                              {Number(selectedRequest.longitude).toFixed(6)}
                            </p>
                            <a
                              href={`https://www.google.com/maps?q=${selectedRequest.latitude},${selectedRequest.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-brand-accent-600 hover:text-brand-accent-700 underline flex items-center gap-1 mt-1"
                            >
                              <Navigation className="w-4 h-4" />
                              Open in Google Maps
                            </a>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {selectedRequest.notes && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent-600" />
                        Additional Notes
                      </h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                        <p className="text-sm sm:text-base text-gray-900 break-words">
                          {selectedRequest.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent-600" />
                      Timeline
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-brand-secondary-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Request Submitted
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatDate(selectedRequest.requested_at)}
                          </p>
                          {selectedRequest.estimated_arrival && (
                            <p className="text-xs text-brand-secondary-600 mt-1">
                              ETA: {selectedRequest.estimated_arrival}
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedRequest.dispatched_at && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Ambulance Dispatched
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(selectedRequest.dispatched_at)}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedRequest.arrived_at && (
                        <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                          <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Ambulance Arrived
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(selectedRequest.arrived_at)}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedRequest.completed_at && (
                        <div className="flex items-start gap-3 p-3 bg-brand-accent-50 rounded-lg border border-brand-accent-200">
                          <CheckCircle className="w-5 h-5 text-brand-accent-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Request Completed
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(selectedRequest.completed_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 bg-white shadow-lg flex-shrink-0">
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 w-full">
                  {selectedRequest.status === "pending" ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRequest.id, "cancelled")
                        }
                        className="w-full sm:w-auto px-4 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors text-sm font-medium"
                      >
                        Cancel Request
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRequest.id, "dispatched")
                        }
                        className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Dispatch Ambulance
                      </button>
                    </>
                  ) : selectedRequest.status === "dispatched" ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRequest.id, "en_route")
                        }
                        className="w-full sm:w-auto px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Mark En Route
                      </button>
                    </>
                  ) : selectedRequest.status === "en_route" ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRequest.id, "arrived")
                        }
                        className="w-full sm:w-auto px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                      >
                        Mark Arrived
                      </button>
                    </>
                  ) : selectedRequest.status === "arrived" ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRequest.id, "completed")
                        }
                        className="w-full sm:w-auto px-4 py-3 bg-brand-accent-600 text-white rounded-lg hover:bg-brand-accent-700 transition-colors text-sm font-medium"
                      >
                        Mark Completed
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={closeModal}
                      className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
