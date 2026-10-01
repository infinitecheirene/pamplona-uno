"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Upload,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import CitizenLayout from "@/components/citizenLayout";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    report_id: string;
    id: number;
    status: string;
    files: Array<{
      id: number;
      name: string;
      url: string;
    }>;
  };
  errors?: Record<string, string[]>;
}

// sessionStorage key used to hold a draft of the text fields while the
// user is sent to /login and back. Files/photos are NOT saved here
// (File objects aren't JSON-serializable) — only text fields survive.
const DRAFT_KEY = "report-issue-draft";

type FormDataShape = {
  category: string;
  title: string;
  description: string;
  location: string;
  urgency: string;
};

export default function ReportIssuePage() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState<FormDataShape>({
    category: "",
    title: "",
    description: "",
    location: "",
    urgency: "medium",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // On mount: if there's a saved draft (e.g. the user just came back
  // from /login), restore it into the form and let them know.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed: FormDataShape = JSON.parse(saved);
        setFormData(parsed);
        sessionStorage.removeItem(DRAFT_KEY);

        toast({
          title: "Draft restored",
          description:
            "We saved what you typed before you logged in. Please re-attach any photos/videos, then submit again.",
        });
      }
    } catch (err) {
      console.error("Failed to restore report draft:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { value: "road", label: "Road Damage", icon: "🛣️" },
    { value: "streetlight", label: "Street Light", icon: "💡" },
    { value: "garbage", label: "Garbage/Waste", icon: "🗑️" },
    { value: "drainage", label: "Drainage/Flood", icon: "💧" },
    { value: "traffic", label: "Traffic Issue", icon: "🚦" },
    { value: "vandalism", label: "Vandalism", icon: "🎨" },
    { value: "noise", label: "Noise Complaint", icon: "🔊" },
    { value: "other", label: "Other", icon: "📋" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "warning",
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
        });
        return false;
      }
      return true;
    });

    const newFiles = [...files, ...validFiles].slice(0, 5);
    setFiles(newFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index]);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔒 Auth check happens HERE — only when the user clicks "Submit Report".
    const currentUser = await authClient.getCurrentUser();
    if (!currentUser) {
      // Save the text fields so they survive the trip to /login and back.
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error("Failed to save report draft:", err);
      }

      toast({
        title: "Please log in to submit",
        description:
          "Your answers are saved — just log in and we'll bring you right back.",
      });

      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setLoading(true);

    try {
      if (!formData.category) {
        setError("Please select a category");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.category);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("urgency", formData.urgency);
      formDataToSend.append("timestamp", new Date().toISOString());

      files.forEach((file, index) => {
        formDataToSend.append(`file_${index}`, file);
      });

      const response = await fetch("/api/reports/submit", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        toast({
          variant: "success",
          title: "Report Submitted!",
          description: `Report ID: ${result.data?.report_id || "N/A"}. Track it in your reports section.`,
        });

        previews.forEach((preview) => URL.revokeObjectURL(preview));

        setFormData({
          category: "",
          title: "",
          description: "",
          location: "",
          urgency: "medium",
        });
        setFiles([]);
        setPreviews([]);
        sessionStorage.removeItem(DRAFT_KEY);
      } else {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0][0];
          setError(firstError);
        } else {
          setError(
            result.message || "Failed to submit report. Please try again.",
          );
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CitizenLayout requireAuth={false}>
      <div>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Report an issue</h1>
            <p className="mt-2 text-gray-600">Tell us where there is a problem so the right team can review it.</p>
          </div>
          <Link
            href="/dashboard/citizen/account/applications"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            View my reports
          </Link>
        </header>

        {/* Main Content */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Share the details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div role="alert" className="bg-brand-primary-50 border-2 border-brand-primary-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-brand-primary-900">
                  <p className="font-semibold mb-1">Error</p>
                  <p className="text-brand-primary-700">{error}. Check the details and try again.</p>
                </div>
              </div>
            )}

            <fieldset className="space-y-5">
              <legend className="sr-only">Issue details</legend>
              <div>
                <label htmlFor="issue-location" className="mb-2 block text-sm font-semibold text-gray-900">
                  Location (required)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                  <input
                    id="issue-location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Street, barangay, or nearby landmark"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
                  />
                </div>
              </div>

            {/* Category Selection */}
            <div>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-gray-900">Issue category (required)</legend>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    aria-pressed={formData.category === cat.value}
                    onClick={() =>
                      setFormData({ ...formData, category: cat.value })
                    }
                    className={`p-4 rounded-xl border transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                      formData.category === cat.value
                        ? "border-brand-accent-600 bg-brand-accent-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2" aria-hidden="true">{cat.icon}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
              </fieldset>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="issue-title" className="mb-2 block text-sm font-semibold text-gray-900">
                Short title (required)
              </label>
              <input
                id="issue-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="For example, broken streetlight"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="issue-description" className="mb-2 block text-sm font-semibold text-gray-900">
                Description (required)
              </label>
              <textarea
                id="issue-description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what happened and any details that can help us find it."
                rows={4}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-600/30"
              />
            </div>

            {/* Urgency Level */}
            <fieldset>
              <legend className="mb-3 block text-sm font-semibold text-gray-900">Urgency (required)</legend>
              <div className="flex gap-3">
                {[
                  {
                    value: "low",
                    label: "Low",
                    color: "bg-brand-accent-100 text-brand-accent-700 border-brand-accent-300",
                  },
                  {
                    value: "medium",
                    label: "Medium",
                    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
                  },
                  {
                    value: "high",
                    label: "High",
                    color: "bg-brand-primary-100 text-brand-primary-700 border-brand-primary-300",
                  },
                ].map((urgency) => (
                  <button
                    key={urgency.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, urgency: urgency.value })
                    }
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                      formData.urgency === urgency.value
                        ? urgency.color
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {urgency.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Photo/Video Upload */}
            <div>
              <label htmlFor="issue-photos" className="mb-3 block text-sm font-semibold text-gray-900">
                Add photos or videos (optional, up to 5)
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove photo or video ${index + 1}`}
                        className="absolute top-1 right-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-600 text-sm font-bold text-white hover:bg-brand-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length < 5 && (
                <label htmlFor="issue-photos" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-accent-600 hover:bg-brand-accent-50 focus-within:ring-2 focus-within:ring-brand-accent-600 focus-within:ring-offset-2 motion-reduce:transition-none">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Upload photos or videos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, MP4 (max 10MB each)
                    </p>
                  </div>
                  <input
                    id="issue-photos"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Info Box */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1 text-gray-900">What happens next</p>
                <p>
                  Barangay staff will review your report. You can check for status updates in My reports.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.category}
              className="w-full rounded-xl bg-brand-accent-600 px-6 py-3 font-bold text-white hover:bg-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending report..." : "Send report"}
            </button>
            </fieldset>
          </form>
        </section>
      </div>
    </CitizenLayout>
  );
}
