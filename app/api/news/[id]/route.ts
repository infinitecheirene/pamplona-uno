import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    const response = await fetch(`${API_URL}/api/admin/news/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    const responseText = await response.text()

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          {
            success: false,
            error: errorData.message || "Failed to fetch news",
            details: errorData.errors || errorData,
          },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to fetch news from server" },
          { status: response.status }
        )
      }
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[News Detail] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Handle both PATCH and POST for updates
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, params)
}

// Shared update handler
async function handleUpdate(
  request: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      console.error("[News Update] No auth token found")
      return NextResponse.json(
        { success: false, error: "Unauthorized - No token" },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    // ❌ REMOVE THIS LINE - Don't add _method
    // formData.append("_method", "PATCH")

    const apiUrl = `${API_URL}/api/admin/news/${id}`

    const response = await fetch(apiUrl, {
      method: "POST", // Laravel route accepts POST
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })


    const responseText = await response.text()

    if (!responseText) {
      console.error("[News Update] Empty response from server")
      return NextResponse.json(
        {
          success: false,
          error: "Empty response from Laravel server",
        },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[News Update] Failed to parse JSON:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response from Laravel",
          responseText: responseText.substring(0, 1000),
        },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to update news",
          details: data.errors || data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[News Update] Catch block error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/api/admin/news/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const responseText = await response.text()

    if (!responseText) {
      if (response.ok) {
        return NextResponse.json({ success: true, message: "Deleted successfully" })
      }
      return NextResponse.json(
        { success: false, error: "Empty response from server" },
        { status: response.status }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid response from server" },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to delete news",
          details: data.errors || data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[News Delete] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}