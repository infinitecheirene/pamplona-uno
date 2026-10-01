"use client";

import PageLayout from "@/components/page-layout";
import NewsSection from "@/components/news-section";

export default function NewsPage() {
  return (
    <PageLayout
      title="News"
      subtitle="Read the latest stories from Pamplona Uno"
      image="/news_banner.png"
    >
      <NewsSection />
    </PageLayout>
  );
}
