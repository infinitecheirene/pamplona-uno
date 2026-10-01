"use client"

import { useState, useEffect } from "react"
import { Filter, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"
import CitizenLayout from "@/components/citizenLayout"
interface Report {
  id: string
  title: string
  category: string
  status: "pending" | "in-progress" | "resolved" | "rejected"
  urgency: "low" | "medium" | "high"
  date: string
  location: string
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch reports from Laravel backend
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports/user")
        const data = await response.json()
        setReports(data.reports || [])
      } catch (error) {
        console.error("[v0] Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "in-progress":
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-brand-accent-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-brand-primary-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-brand-accent-100 text-brand-accent-800 border-brand-accent-200"
      case "rejected":
        return "bg-brand-primary-100 text-brand-primary-800 border-brand-primary-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-brand-primary-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-brand-accent-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredReports = filter === "all" ? reports : reports.filter((report) => report.status === filter)

  return (
    <CitizenLayout>
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">My reports</h1>
        <p className="mt-2 text-gray-600">Check the status and details of issues you reported.</p>
      </header>

      {/* Filter Tabs */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "in-progress", label: "In Progress" },
            { value: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 ${
                filter === tab.value ? "border-brand-accent-600 bg-brand-accent-600 text-white" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section>
        {loading ? (
          <div role="status" aria-label="Loading reports" className="space-y-3">
            {[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-secondary-50">
              <Filter className="h-7 w-7 text-brand-secondary-600" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">No reports found</h2>
            <p className="mx-auto mb-6 max-w-prose leading-relaxed text-gray-700">
              {filter === "all" ? "You have not sent a report yet. Tell us about an issue in your area." : `There are no ${filter.replace("-", " ")} reports right now.`}
            </p>
            <Link href="/dashboard/citizen/report-issue" className="inline-flex rounded-xl bg-brand-accent-600 px-6 py-3 font-bold text-white hover:bg-brand-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2">
              Report an issue
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredReports.map((report) => (
              <li key={report.id}>
                <Link
                  href={`/dashboard/citizen/view-reports/${report.id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.location}</p>
                  </div>
                  <div
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${getStatusColor(report.status)}`}
                  >
                    {report.status.replace("-", " ")}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                      {getStatusIcon(report.status)}
                      {report.date}
                    </span>
                    <span className={`rounded-full bg-gray-100 px-3 py-1 font-semibold ${getUrgencyColor(report.urgency)}`}>
                      {report.urgency} urgency
                    </span>
                    <span className="rounded-full bg-brand-secondary-50 px-3 py-1 text-brand-secondary-700">{report.category}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

     
    </div>
    </ CitizenLayout>
  )
}
