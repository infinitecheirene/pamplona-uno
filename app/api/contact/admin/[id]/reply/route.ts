import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { emailBrandPalette } from "@/lib/email-brand-palette";

const LARAVEL_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { message, recipientEmail, recipientName, originalSubject } = body;
    const { id } = await params;

    // Save reply to Laravel backend first
    const response = await fetch(
      `${LARAVEL_API_URL}/admin/contacts/${id}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ message }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(data, { status: response.status });
    }

    // Send email using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"pamplona Tres Government" <${process.env.SMTP_FROM}>`,
        to: recipientEmail,
        subject: `Re: ${originalSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(to right, ${emailBrandPalette.primary600}, ${emailBrandPalette.secondary600}, ${emailBrandPalette.accent600}); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${emailBrandPalette.accent600}; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">pamplona Tres Government</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Response to Your Inquiry</p>
              </div>
              <div class="content">
                <p>Dear ${recipientName},</p>
                <p>Thank you for contacting pamplona Tres Government. We have reviewed your message regarding: <strong>${originalSubject}</strong></p>
                
                <div class="message">
                  <h3 style="margin-top: 0; color: ${emailBrandPalette.accent600};">Our Response:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>

                <p>If you have any further questions or concerns, please don't hesitate to reach out to us.</p>
                
                <p>Best regards,<br>
                <strong>pamplona Tres Government</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated response from pamplona Tres Government.<br>
                Please do not reply directly to this email.</p>
                <p>© ${new Date().getFullYear()} pamplona Tres Government. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Dear ${recipientName},\n\nThank you for contacting pamplona Tres Government. We have reviewed your message regarding: ${originalSubject}\n\nOur Response:\n${message}\n\nIf you have any further questions or concerns, please don't hesitate to reach out to us.\n\nBest regards,\npamplona Tres City Government`,
      });

      return NextResponse.json({
        success: true,
        message: "Reply sent successfully",
        data: data.data,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Reply was saved but email failed
      return NextResponse.json({
        success: true,
        message: "Reply saved but email sending failed",
        data: data.data,
        emailError: true,
      });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 },
    );
  }
}
