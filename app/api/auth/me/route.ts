import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Use token to fetch user data from Laravel
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      )
    }

    const data = await response.json()

    // Laravel returns: { success: true, data: { user: {...} } }
    // So we need to extract data.data.user
    const user = data?.data?.user || null

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User data not found in response" },
        { status: 500 }
      )
    }

    // Return in the format the frontend expects: { success: true, user: {...} }
    return NextResponse.json({ 
      success: true, 
      user: user 
    })
    
  } catch (error) {
    console.error('API Route - Error:', error)
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    )
  }
}