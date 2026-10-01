"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  X,
  Calendar,
  Tag,
  FileText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Announcement {
  id: number;
  title: string;
  date: string;
  category: "Update" | "Event" | "Alert" | "Development" | "Health" | "Notice";
  description: string;
  content: string;
  is_active: boolean;
  priority: number;
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

export default function AdminAnnouncementsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">(
    "view",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Update" as Announcement["category"],
    description: "",
    content: "",
    is_active: true,
    priority: 0,
  });

  // Separate useEffect to avoid infinite loops
  useEffect(() => {
    if (!authLoading && user) {
      fetchAnnouncements();
    }
  }, [authLoading, user]);

  // Fetch when pagination or filters change
  useEffect(() => {
    if (!authLoading && user) {
      fetchAnnouncements();
    }
  }, [pagination.current_page, categoryFilter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/announcements?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.data) {
          setAnnouncements(data.data.data || []);
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
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Failed to fetch announcements.",
        });
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load announcements.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "Update",
      description: "",
      content: "",
      is_active: true,
      priority: 0,
    });
    setSelectedAnnouncement(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      date: announcement.date,
      category: announcement.category,
      description: announcement.description,
      content: announcement.content,
      is_active: announcement.is_active,
      priority: announcement.priority,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "Update",
      description: "",
      content: "",
      is_active: true,
      priority: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.description || !formData.content) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      setIsSubmitting(true);

      const url =
        modalMode === "create"
          ? "/api/announcements"
          : `/api/announcements/${selectedAnnouncement?.id}`;

      const method = modalMode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Announcement ${modalMode === "create" ? "created" : "updated"} successfully.`,
        });
        closeModal();
        fetchAnnouncements();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to save announcement.",
        });
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save announcement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Announcement deleted successfully.",
        });
        fetchAnnouncements();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to delete announcement.",
        });
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete announcement.",
      });
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    // fetchAnnouncements will be called by the useEffect when current_page changes
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    // fetchAnnouncements will be called by the useEffect
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    // fetchAnnouncements will be called by the useEffect
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      Alert: "bg-brand-primary-100 text-brand-primary-700",
      Event: "bg-purple-100 text-purple-700",
      Update: "bg-blue-100 text-blue-700",
      Development: "bg-indigo-100 text-indigo-700",
      Health: "bg-brand-accent-100 text-brand-accent-700",
      Notice: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${styles[category] || styles.Update}`}
      >
        {category}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-secondary-100 rounded-lg">
                  <Bell className="w-6 h-6 text-brand-secondary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Announcements
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage public announcements and notices
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreateNew}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent-600 to-brand-secondary-500 text-white rounded-lg hover:from-brand-accent-700 hover:to-brand-secondary-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Announcement
              </button>
              <button
                onClick={handleCreateNew}
                className="sm:hidden p-2 bg-gradient-to-r from-brand-accent-600 to-brand-secondary-500 text-white rounded-lg hover:from-brand-accent-700 hover:to-brand-secondary-600 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Update">Update</option>
                  <option value="Event">Event</option>
                  <option value="Alert">Alert</option>
                  <option value="Development">Development</option>
                  <option value="Health">Health</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-brand-secondary-600 text-white rounded-lg hover:bg-brand-secondary-700 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* Stats Cards - Mobile */}
          <div className="grid grid-cols-3 gap-4 sm:hidden">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Active</p>
              <p className="text-2xl font-bold text-brand-accent-600">
                {announcements.filter((a) => a.is_active).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Inactive</p>
              <p className="text-2xl font-bold text-gray-400">
                {announcements.filter((a) => !a.is_active).length}
              </p>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading announcements...</p>
                </div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first announcement
                </p>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-brand-secondary-600 text-white rounded-lg hover:bg-brand-secondary-700 transition-colors"
                >
                  New Announcement
                </button>
              </div>
            ) : (
              <>
                {/* Desktop / Tablet Table - hidden on mobile, no swipe needed */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {announcements.map((announcement) => (
                        <tr
                          key={announcement.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {announcement.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getCategoryBadge(announcement.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(announcement.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {announcement.is_active ? (
                                <ToggleRight className="w-5 h-5 text-brand-accent-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-gray-400" />
                              )}
                              <span
                                className={`text-sm ${
                                  announcement.is_active
                                    ? "text-brand-accent-600 font-medium"
                                    : "text-gray-400"
                                }`}
                              >
                                {announcement.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {announcement.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleViewAnnouncement(announcement)
                                }
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(announcement)}
                                className="p-1.5 text-brand-secondary-600 hover:bg-brand-secondary-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(announcement.id)}
                                className="p-1.5 text-brand-primary-600 hover:bg-brand-primary-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards - no horizontal scroll, no swiping */}
                <div className="sm:hidden divide-y divide-gray-200">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                          {announcement.title}
                        </h3>
                        {getCategoryBadge(announcement.category)}
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {announcement.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(announcement.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {announcement.is_active ? (
                            <ToggleRight className="w-4 h-4 text-brand-accent-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={
                              announcement.is_active
                                ? "text-brand-accent-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {announcement.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Priority:{" "}
                          <span className="font-medium text-gray-700">
                            {announcement.priority}
                          </span>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewAnnouncement(announcement)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="p-2 text-brand-secondary-600 hover:bg-brand-secondary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            className="p-2 text-brand-primary-600 hover:bg-brand-primary-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!loading && announcements.length > 0 && (
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
                                    ? "bg-brand-secondary-600 text-white"
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {modalMode === "create"
                      ? "Create Announcement"
                      : modalMode === "edit"
                        ? "Edit Announcement"
                        : "Announcement Details"}
                  </h2>
                  {selectedAnnouncement && (
                    <p className="text-sm text-gray-500 mt-1">
                      ID #{selectedAnnouncement.id}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
                {modalMode === "view" && selectedAnnouncement ? (
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedAnnouncement.is_active ? (
                          <ToggleRight className="w-5 h-5 text-brand-accent-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            selectedAnnouncement.is_active
                              ? "text-brand-accent-600"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedAnnouncement.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Title
                        </label>
                        <p className="text-base text-gray-900">
                          {selectedAnnouncement.title}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Category
                          </label>
                          <div>
                            {getCategoryBadge(selectedAnnouncement.category)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Date
                          </label>
                          <p className="text-base text-gray-900">
                            {formatDate(selectedAnnouncement.date)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Description
                        </label>
                        <p className="text-base text-gray-900">
                          {selectedAnnouncement.description}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Content
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-base text-gray-900 whitespace-pre-wrap">
                            {selectedAnnouncement.content}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Priority
                        </label>
                        <p className="text-base text-gray-900">
                          {selectedAnnouncement.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Form */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-brand-primary-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        placeholder="Enter announcement title"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-brand-primary-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target
                                .value as Announcement["category"],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        >
                          <option value="Update">Update</option>
                          <option value="Event">Event</option>
                          <option value="Alert">Alert</option>
                          <option value="Notice">Notice</option>
                          <option value="Development">Development</option>
                          <option value="Health">Health</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-brand-primary-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-brand-primary-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        placeholder="Brief description (max 500 characters)"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.description.length}/500 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-brand-primary-500">*</span>
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        placeholder="Full announcement content"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority (0-100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              priority: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Higher priority appears first
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="flex items-center gap-2 h-[42px]">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                is_active: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-brand-secondary-600 border-gray-300 rounded focus:ring-brand-secondary-500"
                          />
                          <label
                            htmlFor="is_active"
                            className="text-sm text-gray-700"
                          >
                            Active (visible to public)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 bg-white shadow-lg flex-shrink-0">
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 w-full">
                  {modalMode === "view" ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleEdit(selectedAnnouncement!)}
                        className="w-full sm:w-auto px-4 py-3 bg-brand-secondary-600 text-white rounded-lg hover:bg-brand-secondary-700 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-brand-accent-600 to-brand-secondary-500 text-white rounded-lg hover:from-brand-accent-700 hover:to-brand-secondary-600 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {modalMode === "create"
                              ? "Creating..."
                              : "Saving..."}
                          </>
                        ) : modalMode === "create" ? (
                          "Create Announcement"
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </>
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
