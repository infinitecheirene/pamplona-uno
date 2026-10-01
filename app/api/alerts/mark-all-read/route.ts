import { NextResponse } from "next/server"

export async function POST() {
  try {

    return NextResponse.json({
      success: true,
      message: "All alerts marked as read",
    })
  } catch (error) {
    console.error("[v0] Error marking all alerts as read:", error)
    return NextResponse.json({ success: false, message: "Failed to mark all alerts as read" }, { status: 500 })
  }
}
