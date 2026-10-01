"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ArrowRight,
  Calendar,
  Loader2,
  X,
  Tag,
  Sparkles,
} from "lucide-react";
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

export default function AnnouncementsSection() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setAnnouncements(data.data.data || []);
      } else {
        setError("Failed to load announcements");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load announcements.",
        });
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load announcements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setSubscribing(true);

    try {
      const subscribeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscribers/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const subscribeData = await subscribeResponse.json();

      if (!subscribeData.success) {
        toast({
          variant: "destructive",
          title: "Subscription Failed",
          description:
            subscribeData.message || "Failed to subscribe. Please try again.",
        });
        setSubscribing(false);
        return;
      }

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          type: "verification",
          data: {
            email: email,
            verifyUrl: `${window.location.origin}/verify-subscription?token=${subscribeData.data.token}`,
          },
        }),
      });

      const emailData = await emailResponse.json();

      if (emailData.success) {
        setEmail("");
        toast({
          title: "Successfully Subscribed!",
          description: "Please check your email to verify your subscription.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Email Verification Issue",
          description:
            "Subscribed, but failed to send verification email. Please contact support.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Subscription Error",
        description: "Failed to subscribe. Please try again later.",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Alert: "bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white",
      Event: "bg-gradient-to-r from-brand-secondary-500 to-brand-primary-400 text-white",
      Update: "bg-gradient-to-r from-brand-accent-500 to-brand-secondary-400 text-white",
      Development: "bg-gradient-to-r from-brand-primary-400 to-brand-accent-500 text-white",
      Health: "bg-gradient-to-r from-brand-accent-600 to-brand-accent-400 text-white",
      Notice: "bg-gradient-to-r from-brand-secondary-600 to-brand-primary-500 text-white",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-600 to-gray-400 text-white"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-primary-200/30 via-brand-secondary-200/30 to-brand-accent-200/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-accent-200/30 via-brand-secondary-200/30 to-brand-primary-200/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-brand-primary-500 border-r-brand-secondary-500 border-b-brand-accent-500 rounded-full"
                />
              </div>
              <p className="text-gray-700 font-medium">
                Loading announcements...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-white" />
            </div>
            <p className="text-brand-primary-700 mb-6 font-semibold text-lg">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="px-8 py-4 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 text-white rounded-full hover:shadow-2xl transition-all font-semibold text-lg hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Announcements Grid */}
        {!loading && !error && announcements.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {announcements.map((announcement, i) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="group relative p-6 rounded-3xl bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-gradient-to-r hover:from-brand-primary-400 hover:via-brand-secondary-400 hover:to-brand-accent-400 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                >
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-500/5 via-brand-secondary-500/5 to-brand-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase shadow-md ${getCategoryColor(announcement.category)}`}
                      >
                        <Tag className="w-3 h-3" />
                        {announcement.category}
                      </motion.span>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500"
                      />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-brand-primary-600 group-hover:via-brand-secondary-600 group-hover:to-brand-accent-600 group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
                      {announcement.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {announcement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-white border-4 border-transparent bg-clip-padding p-10 md:p-16 text-center shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(white, white) padding-box, linear-gradient(to right, var(--brand-primary-600), var(--brand-secondary-600), var(--brand-accent-600)) border-box",
              }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600" />
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                  Never Miss an Update
                </h2>
                <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg font-medium">
                  Subscribe to receive the latest announcements and community
                  news directly to your inbox
                </p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-secondary-500/20 focus:border-brand-secondary-500 shadow-md text-lg font-medium"
                  />
                  <motion.button
                    onClick={handleSubscribe}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={subscribing}
                    className="px-8 py-4 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white font-bold rounded-full hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-xl text-lg"
                  >
                    {subscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && announcements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Bell className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-3">
              No Announcements Yet
            </h3>
            <p className="text-gray-600 text-lg">
              Check back later for community updates and news.
            </p>
          </motion.div>
        )}
      </div>

      {/* Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnnouncement(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold">Announcement Details</h2>
                    <p className="text-sm text-white/80">
                      Reference ID: #{selectedAnnouncement.id}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-8">
                  {/* Category and Date */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold uppercase shadow-lg ${getCategoryColor(selectedAnnouncement.category)}`}
                    >
                      <Tag className="w-4 h-4" />
                      {selectedAnnouncement.category}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-2 font-medium bg-gray-100 px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedAnnouncement.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-3">
                      {selectedAnnouncement.title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedAnnouncement.description}
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full" />
                      Full Details
                    </h4>
                    <div className="p-6 bg-gradient-to-br from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50 rounded-2xl border-2 border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-base">
                        {selectedAnnouncement.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t-2 border-gray-200 px-8 py-6 bg-gradient-to-r from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAnnouncement(null)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white rounded-full hover:shadow-2xl transition-all font-bold text-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
