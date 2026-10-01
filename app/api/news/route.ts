import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()

    const response = await fetch(`${API_URL}/news/published${queryString ? `?${queryString}` : ''}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const responseText = await response.text()

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          {
            error: errorData.message || "Failed to fetch news",
            details: errorData.errors || errorData,
          },
          { status: response.status },
        )
      } catch {
        return NextResponse.json({ error: "Failed to fetch news from server" }, { status: response.status })
      }
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] News API GET - Error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${API_URL}/news`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    const responseText = await response.text()

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          {
            error: errorData.message || "Failed to create news",
            details: errorData.errors || errorData,
            status: response.status,
          },
          { status: response.status },
        )
      } catch {

        return NextResponse.json(
          {
            error: "Laravel returned an error (see server logs for details)",
            status: response.status,
            isHtmlError: responseText.includes("<html") || responseText.includes("<!DOCTYPE"),
          },
          { status: response.status },
        )
      }
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] News API - Catch block error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : ""
    console.error("[v0] News API - Error stack:", errorStack)

    return NextResponse.json(
      {
        error: errorMessage,
        type: error instanceof Error ? error.constructor.name : "Unknown",
      },
      { status: 500 },
    )
  }
}