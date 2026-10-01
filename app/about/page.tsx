"use client";

import PageLayout from "@/components/page-layout";
import AboutSection from "@/components/about-section";

const aboutHeroImage =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90";

export default function AboutPage() {
  return (
    <PageLayout
      title="About Barangay Pamplona Uno"
      subtitle="Explore our city's story and the mission behind what we do"
      image={aboutHeroImage}
    >
      <AboutSection />
    </PageLayout>
  );
}