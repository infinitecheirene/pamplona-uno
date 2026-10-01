"use client"

import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import PageHeroBanner from "./page-hero-banner"

interface PageLayoutProps {
  title: string
  subtitle: string
  image: string
  children: ReactNode
}

export default function PageLayout({ title, subtitle, image, children }: PageLayoutProps) {
  return (
    <>
      <Header />
      <PageHeroBanner title={title} subtitle={subtitle} image={image} />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">{children}</main>
      <Footer />
    </>
  )
}
