import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required - no auth token found',
        },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort_by')
    const sortOrder = searchParams.get('sort_order')
    const perPage = searchParams.get('per_page')

    // Build query string
    const queryParams = new URLSearchParams()
    if (status) queryParams.append('status', status)
    if (category) queryParams.append('category', category)
    if (search) queryParams.append('search', search)
    if (sortBy) queryParams.append('sort_by', sortBy)
    if (sortOrder) queryParams.append('sort_order', sortOrder)
    if (perPage) queryParams.append('per_page', perPage)

    const queryString = queryParams.toString()
    const url = `${API_URL}/admin/news${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken.value}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to fetch news',
          error: errorData.error,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required - no auth token found',
        },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const response = await fetch(`${API_URL}/admin/news`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken.value}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: formData,
    })

    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error('Non-JSON response from Laravel:', text)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response from server',
        },
        { status: 500 }
      )
    }

    if (!response.ok) {
      console.error('Laravel error details:', data)
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to create news',
          errors: data.errors,
          error: data.error,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}