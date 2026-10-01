"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CitizenLayout from "@/components/citizenLayout";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  publishedAt: string;
  views: number;
  author: string;
}

interface ApiNewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  status: string;
  priority: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [announcements, setAnnouncements] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<NewsArticle[]>([]);
  const [projects, setProjects] = useState<NewsArticle[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All news" },
    { value: "announcements", label: "Announcements" },
    { value: "events", label: "Events" },
    { value: "projects", label: "Projects" },
  ];

  const transformArticle = (
    article: ApiNewsArticle,
    category: string,
  ): NewsArticle => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return {
      id: `${category}-${article.id}`,
      title: article.title,
      excerpt: article.description || article.content.substring(0, 150) + "...",
      content: article.content,
      category: category,
      image: article.image_url ? `${apiUrl}${article.image_url}` : undefined,
      publishedAt: article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : new Date(article.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      views: Math.floor(Math.random() * 1000),
      author: "Admin",
    };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all categories in parallel
        const [newsRes, announcementsRes, eventsRes, projectsRes] =
          await Promise.all([
            fetch("/api/news"),
            fetch("/api/announcements"),
            fetch("/api/events"),
            fetch("/api/projects"),
          ]);

        const [newsData, announcementsData, eventsData, projectsData] =
          await Promise.all([
            newsRes.json(),
            announcementsRes.json(),
            eventsRes.json(),
            projectsRes.json(),
          ]);

        // Transform each category
        const transformedNews = (
          Array.isArray(newsData) ? newsData : newsData.data?.data || []
        ).map((article: ApiNewsArticle) => transformArticle(article, "news"));

        const transformedAnnouncements = (
          Array.isArray(announcementsData)
            ? announcementsData
            : announcementsData.announcements || []
        ).map((article: ApiNewsArticle) =>
          transformArticle(article, "announcements"),
        );

        const transformedEvents = (
          Array.isArray(eventsData) ? eventsData : eventsData.events || []
        ).map((article: ApiNewsArticle) => transformArticle(article, "events"));

        const transformedProjects = (
          Array.isArray(projectsData)
            ? projectsData
            : projectsData.projects || []
        ).map((article: ApiNewsArticle) =>
          transformArticle(article, "projects"),
        );

        setNews(transformedNews);
        setAnnouncements(transformedAnnouncements);
        setEvents(transformedEvents);
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Combine all articles based on selected category
  const getFilteredNews = () => {
    switch (selectedCategory) {
      case "all":
        return [...news, ...announcements, ...events, ...projects];
      case "announcements":
        return announcements;
      case "events":
        return events;
      case "projects":
        return projects;
      default:
        return news;
    }
  };

  const filteredNews = getFilteredNews();

  return (
    <CitizenLayout requireAuth={false}>
      <div>
        <header className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">City news</h1>
          <p className="mt-2 text-gray-600">Read the latest updates from Pamplona Uno.</p>
          <p className="mt-2 text-sm text-gray-600">{filteredNews.length} articles</p>
        </header>

        {/* Category Filter */}
        <section aria-label="Filter news" className="mb-8 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                    selectedCategory === category.value
                      ? "border-brand-accent-600 bg-brand-accent-600 text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
        </section>

        {/* Main Content */}
        <div>
            {loading ? (
              <div role="status" aria-label="Loading news" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((item) => <div key={item} className="animate-pulse rounded-2xl bg-gray-100 h-72" />)}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-secondary-50">
                  <Calendar className="h-7 w-7 text-brand-secondary-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No articles in this category
                </h2>
                <p className="mx-auto max-w-prose text-gray-700 leading-relaxed">
                  Choose another category or browse community announcements.
                </p>
                <Link href="/announcements" className="mt-5 inline-flex rounded-xl bg-brand-accent-600 px-6 py-3 font-bold text-white hover:bg-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">Browse announcements</Link>
              </div>
            ) : (
              <>
                {[filteredNews[0]].map((article) => (
                  <article key={article.id} className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white sm:grid sm:grid-cols-2">
                    <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.id}`} aria-label={`Read ${article.title}`} className="relative block min-h-56 bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-inset">
                      {article.image ? <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> : <div className="flex h-full min-h-56 items-center justify-center"><Newspaper className="h-12 w-12 text-brand-secondary-600" aria-hidden="true" /></div>}
                    </Link>
                    <div className="p-6 sm:p-8">
                      <span className="inline-flex rounded-full bg-brand-secondary-50 px-3 py-1 text-sm font-semibold text-brand-secondary-700">Featured {article.category.toLowerCase()}</span>
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"><Calendar className="h-4 w-4" aria-hidden="true" />{article.publishedAt}</p>
                      <h2 className="mt-4 text-2xl font-bold text-gray-900"><Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.id}`} className="hover:text-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600">{article.title}</Link></h2>
                      <p className="mt-3 leading-relaxed text-gray-700">{article.excerpt}</p>
                      <p className="mt-4 text-sm text-gray-600">By {article.author}</p>
                    </div>
                  </article>
                ))}
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredNews.slice(1).map((article) => (
                    <li key={article.id}>
                      <article className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        {article.image && <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.id}`} className="relative block aspect-video bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600"><Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></Link>}
                        <div className="p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-brand-secondary-50 px-3 py-1 text-sm font-semibold text-brand-secondary-700">{article.category}</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"><Calendar className="h-4 w-4" aria-hidden="true" />{article.publishedAt}</span>
                          </div>
                          <h3 className="mt-3 font-bold text-gray-900"><Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.id}`} className="hover:text-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600">{article.title}</Link></h3>
                          <p className="mt-2 text-sm leading-relaxed text-gray-700">{article.excerpt}</p>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </>
            )}
        </div>
      </div>
    </CitizenLayout>
  );
}
