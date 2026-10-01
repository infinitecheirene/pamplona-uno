"use client";
import PageLayout from "@/components/page-layout";
import AnnouncementsSection from "@/components/announcements-section";

export default function AnnouncementsPage() {
  return (
    <PageLayout
      title="Announcements"
      subtitle="Stay updated with the latest news from Pamplona Uno"
      image="/using-announcements.jpg"
    >
      <AnnouncementsSection />
    </PageLayout>
  );
}
