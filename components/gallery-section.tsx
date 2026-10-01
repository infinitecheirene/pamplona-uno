"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryAlbum {
  folder: string;
  caption: string;
  images: string[]; // resolved image paths, in order
}

const ALBUM_CAPTIONS: Record<string, string> = {
  bmi: "Body Mass Index (BMI) Assessment & Nutrition Counseling",
  "emergency-preparedness": "Emergency Preparedness",
  meeting: "School-Barangay Coordination Meeting",
  "school-inspection": "Barangay Tanod School Inspection",
  "senior-citizen-opening": "Opening of Senior Citizens Office",
  "sayaw-kabataan-2026": "Sayaw Kabataan 2026",
};

const toTitleCase = (folder: string) =>
  folder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
}

export default function GallerySection({
  title = "Life in Our Barangay",
  subtitle = "A look at the people, programs, and moments that make our community",
}: GallerySectionProps) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeAlbumIndex, setActiveAlbumIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();

        if (data.success && Array.isArray(data.albums)) {
          const withCaptions: GalleryAlbum[] = data.albums.map(
            (a: { folder: string; images: string[] }) => ({
              folder: a.folder,
              images: a.images,
              caption: ALBUM_CAPTIONS[a.folder] || toTitleCase(a.folder),
            }),
          );
          setAlbums(withCaptions);
        }
      } catch (error) {
        console.error("[GallerySection] Failed to load albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const openAlbum = (albumIndex: number) => {
    setActiveAlbumIndex(albumIndex);
    setActivePhotoIndex(0);
  };

  const closeAlbum = () => setActiveAlbumIndex(null);

  const activeAlbum = activeAlbumIndex !== null ? albums[activeAlbumIndex] : null;

  const showPrevPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((i) => (i - 1 + activeAlbum.images.length) % activeAlbum.images.length);
  };

  const showNextPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((i) => (i + 1) % activeAlbum.images.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!activeAlbum) return;
      if (e.key === "Escape") closeAlbum();
      if (e.key === "ArrowLeft") showPrevPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeAlbum, activeAlbumIndex]);

  useEffect(() => {
    document.body.style.overflow = activeAlbum ? "hidden" : "unset";
  }, [activeAlbum]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-green-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-full mx-auto mb-4" />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            {subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gradient-to-br from-red-100 via-orange-100 to-green-100 animate-pulse"
              />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {albums.map((album, i) => (
              <motion.button
                key={album.folder}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 6) * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => openAlbum(i)}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all border-2 border-white aspect-square"
              >
                <img
                  src={album.images[0]}
                  alt={album.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 flex items-end p-4">
                  <div className="text-left">
                    <span className="text-white text-sm sm:text-base font-semibold block">
                      {album.caption}
                    </span>
                    <span className="text-white/70 text-xs">
                      {album.images.length} photo{album.images.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No photos available yet.</p>
          </div>
        )}
      </div>

      {/* Album dialog */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeAlbum}
              aria-label="Close"
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </motion.button>

            {activeAlbum.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrevPhoto();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-4 sm:left-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNextPhoto();
                  }}
                  aria-label="Next photo"
                  className="absolute right-4 sm:right-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={`${activeAlbumIndex}-${activePhotoIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={activeAlbum.images[activePhotoIndex]}
                alt={`${activeAlbum.caption} photo ${activePhotoIndex + 1}`}
                className="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain"
              />
              <div className="mt-4 flex items-center gap-3">
                <p className="text-white text-lg font-semibold text-center">
                  {activeAlbum.caption}
                </p>
                <span className="text-white/60 text-sm">
                  {activePhotoIndex + 1} / {activeAlbum.images.length}
                </span>
              </div>

              {activeAlbum.images.length > 1 && (
                <div className="flex gap-2 mt-4 flex-wrap justify-center max-w-full">
                  {activeAlbum.images.map((src, idx) => (
                    <button
                      key={src}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(idx);
                      }}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        idx === activePhotoIndex
                          ? "border-orange-500 scale-105"
                          : "border-white/30 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}