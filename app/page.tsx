"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ServicesSection from "@/components/services-section";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Zap,
  Clock,
  X,
  Calendar,
  User,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MapPin,
} from "lucide-react";
import GallerySection from "@/components/gallery-section";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  image?: string;
  status: string;
  published_at?: string;
  created_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

const UNSPLASH_FALLBACK =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85";

const heroVideos = [
  "/videos/hero-1.mp4",
  "/videos/hero-2.mp4",
  "/videos/hero-3.mp4",
];

const getCategoryImage = (category: string) => {
  const images: Record<string, string> = {
    Development:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",

    Business:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",

    Health:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85",

    Event:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85",

    Alert:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1600&q=85",

    Notice:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85",

    Update:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=85",

    Community:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85",
  };

  return (
    images[category] ||
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85"
  );
};

const heroText = "Welcome to Pamplona Uno";
const TYPE_SPEED_MS = 65; // per character
const HOLD_MS = 1400; // how long the finished text stays before fading

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [introVisible, setIntroVisible] = useState(true);

  // Fullscreen video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sound state — video must start muted for autoplay to work in browsers,
  // person can tap to unmute.
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoEnd = () => {
    // Don't auto-advance the carousel while the person is watching in
    // fullscreen — let their clip finish/loop instead of yanking them
    // to the next video mid-viewing.
    if (isFullscreen) return;
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        // iOS Safari doesn't support requestFullscreen() on arbitrary
        // elements — only native fullscreen on the <video> itself.
        if ((video as any).webkitEnterFullscreen) {
          (video as any).webkitEnterFullscreen();
        } else if (video.requestFullscreen) {
          await video.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Typewriter intro: types the greeting once, holds briefly, then fades
  // out for good so it stops covering the video.
  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      charIndex += 1;
      setTypedText(heroText.slice(0, charIndex));

      if (charIndex >= heroText.length) {
        clearInterval(typingInterval);
        const holdTimeout = setTimeout(() => {
          setIntroVisible(false);
        }, HOLD_MS);
        return () => clearTimeout(holdTimeout);
      }
    }, TYPE_SPEED_MS);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news/published?per_page=20");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          let newsData: NewsArticle[] = [];

          if (result.data && typeof result.data === "object") {
            if (Array.isArray(result.data.data)) {
              newsData = result.data.data;
            } else if (Array.isArray(result.data)) {
              newsData = result.data;
            }
          }

          setNews(newsData);
        } else {
          throw new Error(result.message || "Failed to fetch news");
        }
      } catch (error) {
        console.error("[Home] Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedArticle]);

  const stats = [
    { label: "Community Members", value: "18,500+", icon: Users },
    { label: "Services Offered", value: "14+", icon: Zap },
    { label: "Requests Processed", value: "500+", icon: Clock },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      announcement: "Announcement",
      event: "Event",
      alert: "Alert",
      update: "Update",
      news: "News",
    };
    return categoryMap[category?.toLowerCase()] || "Update";
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="relative w-full aspect-video max-h-[92svh] sm:max-h-[85svh] lg:h-screen lg:max-h-none lg:aspect-auto overflow-hidden bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <video
            key={`bg-${currentVideoIndex}`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
          >
            <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
          </video>
        </div>

        {/* Foreground video — kept in its native landscape ratio */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.video
              key={currentVideoIndex}
              ref={videoRef}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnd}
              className="relative w-full h-full lg:w-full lg:h-full object-contain lg:object-cover"
            >
              <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {introVisible && (
            <motion.div
              key="hero-intro"
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 z-10"
            >
              {/* Contrast wash — fades away together with the text */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/50" />

              <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
                <h1
                  className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight max-w-[90vw] break-words bg-gradient-to-r from-brand-primary-400 via-brand-secondary-300 to-brand-accent-400 bg-clip-text text-transparent"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    filter:
                      "drop-shadow(0 2px 6px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(0,0,0,0.35))",
                  }}
                >
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="inline-block w-[3px] h-[0.85em] bg-gradient-to-b from-brand-primary-400 via-brand-secondary-300 to-brand-accent-400 ml-1 translate-y-[0.08em] rounded-full"
                  />
                </h1>

                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={
                    typedText.length === heroText.length
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 h-1 w-24 sm:w-32 origin-center rounded-full bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 shadow-[0_0_16px_rgba(var(--brand-secondary-rgb),0.6)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound + Fullscreen toggle buttons */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="flex items-center justify-center bg-black/40 backdrop-blur-sm text-white p-2.5 sm:p-3 rounded-full border border-white/20 hover:bg-black/60 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Watch fullscreen"}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-white/20 hover:bg-black/60 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </motion.button>
        </div>

        {/* Carousel dot indicators */}
        {heroVideos.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-10 flex items-center justify-center gap-3">
            {heroVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentVideoIndex(i)}
                aria-label={`Show background clip ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentVideoIndex
                  ? "w-8 bg-white"
                  : "w-3 bg-white/35 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Subtle scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 right-8 z-10 hidden md:flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-white/40"
          />
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        {/* Soft decorative glow, consistent with CTA section styling */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-secondary-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85"
                  alt="Community gathering and barangay activities"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Accent badge */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-white rounded-2xl shadow-xl px-5 py-4 border-2 border-gray-100">
                <div className="p-2.5 bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Las Piñas City
                  </p>
                  <p className="text-xs text-gray-500">4th District, NCR</p>
                </div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block text-brand-secondary-600 font-semibold uppercase tracking-wide text-sm mb-3">
                Barangay Pamplona Uno
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                  Serving Our Community, Building a Better Tomorrow
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
                Nestled in the vibrant City of Las Piñas, Barangay Pamplona Uno
                is a thriving community where tradition, service, and progress
                come together. Home to thousands of residents, our barangay is
                committed to creating a safe, inclusive, and welcoming
                environment where families, businesses, and future generations
                can thrive. Guided by transparency, unity, and public service,
                we continue to strengthen our community through responsive
                governance, meaningful programs, and initiatives that improve
                the quality of life for every resident.
              </p>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white font-bold inline-flex items-center gap-3 shadow-xl hover:shadow-brand-secondary-500/40 transition-all"
                >
                  Learn More About Us <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section (shared component, replaces the old static list) */}
      <ServicesSection />

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-brand-secondary-300 text-center hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* News Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Latest Updates
              </span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full mx-auto mb-4" />
            <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              Stay informed with recent news and announcements from our barangay
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-gradient-to-br from-brand-primary-200 via-brand-secondary-200 to-brand-accent-200 animate-pulse h-96"
                />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {news.slice(0, 20).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => setSelectedArticle(item)}
                  className="group rounded-3xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-gray-100 hover:border-brand-secondary-300"
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100">
                    {item.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = UNSPLASH_FALLBACK;
                        }}
                      />
                    ) : (
                      <img
                        src={UNSPLASH_FALLBACK}
                        alt="Community activities"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 rounded-full text-xs font-bold uppercase bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 text-white shadow-lg">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      {item.published_at
                        ? formatDate(item.published_at)
                        : formatDate(item.created_at)}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-brand-primary-600 group-hover:via-brand-secondary-600 group-hover:to-brand-accent-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {item.content.substring(0, 120)}...
                    </p>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 text-brand-secondary-500" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No news available at the moment.</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/news">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white font-bold inline-flex items-center gap-3 shadow-2xl hover:shadow-brand-secondary-500/50 transition-all text-lg"
              >
                View All News <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="relative h-72 md:h-96 overflow-hidden">
                {selectedArticle.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${selectedArticle.image}`}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center text-white text-8xl">
                    📰
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>

                <div className="absolute bottom-6 left-6">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold uppercase bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 text-white shadow-xl">
                    {getCategoryLabel(selectedArticle.category)}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent leading-tight">
                    {selectedArticle.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-6 pb-6 border-b-2 border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-brand-secondary-600" />
                      </div>
                      <span className="font-medium">
                        {selectedArticle.published_at
                          ? formatDate(selectedArticle.published_at)
                          : formatDate(selectedArticle.created_at)}
                      </span>
                    </div>

                    {selectedArticle.author && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-brand-secondary-600" />
                        </div>
                        <span className="font-medium">
                          By {selectedArticle.author.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                      {selectedArticle.content}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 px-8 md:px-10 py-6 bg-gradient-to-r from-brand-primary-50 via-brand-secondary-50 to-brand-accent-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedArticle(null)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white rounded-full hover:shadow-2xl transition-all font-bold text-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/95 max-w-2xl mx-auto font-medium drop-shadow-md">
              Join thousands of residents using our platform to access services
              and stay connected with our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-brand-secondary-600 font-bold rounded-full shadow-2xl hover:shadow-white/20 transition-all text-lg"
                >
                  Sign Up Today
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all text-lg"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
