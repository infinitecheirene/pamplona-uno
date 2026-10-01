import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("auth_token")?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const params = new URLSearchParams();

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const perPage = searchParams.get("per_page");

    if (status) params.append("status", status);
    if (search) params.append("search", search);
    if (page) params.append("page", page);
    if (perPage) params.append("per_page", perPage);

    const response = await fetch(
      `${API_URL}/admin/medical-assistance?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Medical Assistance Admin Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}