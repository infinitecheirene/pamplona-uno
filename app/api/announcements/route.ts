import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams()


    if (searchParams.get("page")) params.append("page", searchParams.get("page")!)
    if (searchParams.get("per_page")) params.append("per_page", searchParams.get("per_page")!)
    if (searchParams.get("category")) params.append("category", searchParams.get("category")!)
    if (searchParams.get("search")) params.append("search", searchParams.get("search")!)
    if (searchParams.get("is_active")) params.append("is_active", searchParams.get("is_active")!)


    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value


    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const url = `${LARAVEL_API_URL}/announcements?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
      credentials: "include",
    })


    const data = await response.json()


    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch announcements",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie (consistent with medical-assistance route)
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated. Please log in again.",
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${LARAVEL_API_URL}/announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error creating announcement:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create announcement",
      },
      { status: 500 }
    )
  }
}