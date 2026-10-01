import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get token from HTTP-only cookie
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

    const response = await fetch(`${LARAVEL_API_URL}/announcements/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching announcement:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch announcement",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get token from HTTP-only cookie
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

    const response = await fetch(`${LARAVEL_API_URL}/announcements/${id}`, {
      method: "PATCH",
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
    console.error("Error updating announcement:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update announcement",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get token from HTTP-only cookie
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

    const response = await fetch(`${LARAVEL_API_URL}/announcements/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete announcement",
      },
      { status: 500 }
    )
  }
}