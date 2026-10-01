import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    // Get the authentication token/session from cookies
    const cookieStore = await cookies()
    
    // Try to get the token from various possible cookie names
    const token = cookieStore.get('token') || 
                  cookieStore.get('auth_token') || 
                  cookieStore.get('access_token')
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized - No authentication token found" 
        }, 
        { status: 401 }
      )
    }
    
    // Construct headers for Laravel API request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token.value}`,
    }
    
    // Get Laravel API URL from environment variable
    const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LARAVEL_API_URL
    
    if (!laravelApiUrl) {
      throw new Error('LARAVEL_API_URL is not configured in environment variables')
    }
    
    // Fetch from Laravel backend
    const response = await fetch(`${laravelApiUrl}/reports/user`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Laravel API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Laravel API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      reports: data.reports || data.data || [],
    })
  } catch (error) {
    console.error("Error fetching user reports:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch reports",
        error: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
