import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    // Get the authentication token from cookies
    const cookieStore = await cookies()
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    
    // Construct headers for Laravel API request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token.value}`,
    }
    
    // Get Laravel API URL
    const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LARAVEL_API_URL
    
    if (!laravelApiUrl) {
      throw new Error('LARAVEL_API_URL is not configured in environment variables')
    }
    
    // Build URL with query params
    const url = new URL(`${laravelApiUrl}/admin/reports`)
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value)
    })
    
    // Fetch from Laravel backend
    const response = await fetch(url.toString(), {
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
      data: data.reports || data.data || data,
    })

  } catch (error) {
    console.error("Error fetching admin reports:", error)
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
