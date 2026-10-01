"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryAlbum {
  folder: string;
  caption: string;
  images: string[];
}

const ALBUMS: GalleryAlbum[] = [
  {
    folder: "community-cleanup",
    caption: "Community Cleanup Drive",
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "bmi",
    caption: "Body Mass Index (BMI) Assessment & Nutrition Counseling",
    images: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "health-mission",
    caption: "Community Medical & Dental Mission",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "emergency-preparedness",
    caption: "Emergency Preparedness & Disaster Response",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "school-coordination",
    caption: "School-Barangay Coordination Meeting",
    images: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "school-inspection",
    caption: "Barangay Tanod School Inspection",
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "senior-citizens",
    caption: "Senior Citizens Office Opening",
    images: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "youth-development",
    caption: "Youth Development Program",
    images: [
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "sayaw-kabataan",
    caption: "Sayaw Kabataan 2026",
    images: [
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "sports-program",
    caption: "Barangay Sports Development Program",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "community-meeting",
    caption: "Barangay Community Assembly",
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    folder: "environment",
    caption: "Environmental Awareness Campaign",
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
}

export default function GallerySection({
  title = "Life in Our Barangay",
  subtitle = "A look at the people, programs, and moments that make our community",
}: GallerySectionProps) {
  const [albums] = useState<GalleryAlbum[]>(ALBUMS);
  const [loading, setLoading] = useState(true);

  const [activeAlbumIndex, setActiveAlbumIndex] = useState<number | null>(
    null,
  );
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activeAlbum =
    activeAlbumIndex !== null ? albums[activeAlbumIndex] : null;

  useEffect(() => {
    // Small loading delay for the gallery entrance animation.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const openAlbum = (albumIndex: number) => {
    setActiveAlbumIndex(albumIndex);
    setActivePhotoIndex(0);
  };

  const closeAlbum = () => {
    setActiveAlbumIndex(null);
    setActivePhotoIndex(0);
  };

  const showPrevPhoto = () => {
    if (!activeAlbum) return;

    setActivePhotoIndex(
      (i) =>
        (i - 1 + activeAlbum.images.length) %
        activeAlbum.images.length,
    );
  };

  const showNextPhoto = () => {
    if (!activeAlbum) return;

    setActivePhotoIndex(
      (i) => (i + 1) % activeAlbum.images.length,
    );
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!activeAlbum) return;

      if (e.key === "Escape") {
        closeAlbum();
      }

      if (e.key === "ArrowLeft") {
        showPrevPhoto();
      }

      if (e.key === "ArrowRight") {
        showNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeAlbum, activeAlbumIndex]);

  useEffect(() => {
    document.body.style.overflow = activeAlbum ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeAlbum]);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <div className="mx-auto mb-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500" />

          <p className="mx-auto max-w-2xl text-lg font-medium text-gray-700">
            {subtitle}
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-gradient-to-br from-brand-primary-100 via-brand-secondary-100 to-brand-accent-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {albums.map((album, i) => (
              <motion.button
                key={album.folder}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (i % 6) * 0.08,
                  duration: 0.5,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => openAlbum(i)}
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-white shadow-md transition-all hover:shadow-2xl"
              >
                <img
                  src={album.images[0]}
                  alt={album.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
                  <div className="text-left">
                    <span className="block text-sm font-semibold text-white sm:text-base">
                      {album.caption}
                    </span>

                    <span className="text-xs text-white/70">
                      {album.images.length}{" "}
                      {album.images.length !== 1
                        ? "photos"
                        : "photo"}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Album Dialog */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            {/* Close */}
            <motion.button
              type="button"
              whileHover={{
                scale: 1.1,
                rotate: 90,
              }}
              whileTap={{
                scale: 0.9,
              }}
              onClick={closeAlbum}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-3 shadow-xl transition-colors hover:bg-white"
            >
              <X className="h-6 w-6 text-gray-700" />
            </motion.button>

            {/* Previous */}
            {activeAlbum.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevPhoto();
                }}
                aria-label="Previous photo"
                className="absolute left-4 z-10 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/40 sm:left-8"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Next */}
            {activeAlbum.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextPhoto();
                }}
                aria-label="Next photo"
                className="absolute right-4 z-10 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/40 sm:right-8"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Main Content */}
            <motion.div
              key={`${activeAlbumIndex}-${activePhotoIndex}`}
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-4xl flex-col items-center"
            >
              {/* Image */}
              <img
                src={activeAlbum.images[activePhotoIndex]}
                alt={`${activeAlbum.caption} photo ${activePhotoIndex + 1
                  }`}
                className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-4 flex items-center gap-3">
                <p className="text-center text-lg font-semibold text-white">
                  {activeAlbum.caption}
                </p>

                <span className="text-sm text-white/60">
                  {activePhotoIndex + 1} /{" "}
                  {activeAlbum.images.length}
                </span>
              </div>

              {/* Thumbnails */}
              {activeAlbum.images.length > 1 && (
                <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2">
                  {activeAlbum.images.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(idx);
                      }}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === activePhotoIndex
                          ? "scale-105 border-brand-secondary-500"
                          : "border-white/30 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
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