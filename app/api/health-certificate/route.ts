// app/api/health-certificate/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie using async cookies()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized - No token provided" 
      }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const perPage = searchParams.get('per_page')

    // Build query string
    const queryParams = new URLSearchParams()
    if (status && status !== 'all') queryParams.append('status', status)
    if (search) queryParams.append('search', search)
    if (page) queryParams.append('page', page)
    if (perPage) queryParams.append('per_page', perPage)

    const queryString = queryParams.toString()
    // Use the admin route for fetching all health certificates
    const url = `${API_URL}/admin/health-certificates${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    // Get raw text first to check what we're receiving
    const responseText = await response.text()
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response (first 1000 chars):', responseText.substring(0, 1000))
      console.error('Raw response (last 500 chars):', responseText.substring(Math.max(0, responseText.length - 500)))
      
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON response from server. Please check Laravel logs for errors.',
          debug: {
            status: response.status,
            contentType: response.headers.get('content-type'),
            preview: responseText.substring(0, 500)
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get token from cookie using async cookies()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized - No token provided" 
      }, { status: 401 })
    }

    // Convert camelCase to snake_case for Laravel
    const payload = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      birthDate: body.birthDate,
      age: body.age,
      sex: body.sex,
      purpose: body.purpose,
      hasAllergies: body.hasAllergies || false,
      allergies: body.allergies || null,
      hasMedications: body.hasMedications || false,
      medications: body.medications || null,
      hasConditions: body.hasConditions || false,
      conditions: body.conditions || null,
    }

    const response = await fetch(`${API_URL}/health-certificate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to submit application", errors: data.errors },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Health Certificate POST API Error:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...formData } = body
    
    // Get token from cookie using async cookies()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized - No token provided" 
      }, { status: 401 })
    }

    const payload = {
      status: formData.status,
      remarks: formData.remarks || null,
    }

    const response = await fetch(`${API_URL}/health-certificate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update application", errors: data.errors },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Health Certificate PUT API Error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    // Get token from cookie using async cookies()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized - No token provided" 
      }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: "ID is required" 
      }, { status: 400 })
    }

    const response = await fetch(`${API_URL}/health-certificate/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete application" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Health Certificate DELETE API Error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}