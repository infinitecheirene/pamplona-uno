"use client"

import PageLayout from "@/components/page-layout"
import AboutSection from "@/components/about-section"

export default function AboutPage() {
  return (
    <PageLayout
      title="About Pamplona Uno"
      subtitle="Explore our city's story and the mission behind what we do"
      image="/our-team2.jpg"
    >
      <AboutSection />
    </PageLayout>
  )
}
