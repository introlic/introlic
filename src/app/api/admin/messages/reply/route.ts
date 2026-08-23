import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getResendClient, generateIntrolicEmailHtml } from "@/lib/email";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { contactId, toEmail, recipientName, replyText, customSubject } = body;

    if (!toEmail || !toEmail.includes("@")) {
      return NextResponse.json({ error: "Valid recipient email is required" }, { status: 400 });
    }

    if (!replyText || !replyText.trim()) {
      return NextResponse.json({ error: "Reply text cannot be empty" }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json({ 
        error: "RESEND_API_KEY is not configured in your environment variables. Please add your Resend API key to .env.local to send live emails." 
      }, { status: 500 });
    }

    // Lookup original contact if contactId is provided
    let originalSubject = "";
    let originalMessage = "";
    if (contactId) {
      const [contact] = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, contactId))
        .limit(1);

      if (contact) {
        originalSubject = contact.subject;
        originalMessage = contact.message;
      }
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Introlic <team@introlic.in>";
    const emailSubject = customSubject || (originalSubject ? `Re: ${originalSubject} - Introlic` : "Response from Introlic");

    const htmlContent = generateIntrolicEmailHtml({
      recipientName: recipientName || "there",
      replyText: replyText.trim(),
      originalSubject,
      originalMessage,
    });

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toEmail.trim()],
      subject: emailSubject,
      html: htmlContent,
      text: `Hello ${recipientName || "there"},\n\n${replyText.trim()}\n\nBest regards,\nThe Introlic Team\nhttps://introlic.in`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error: error.message || "Failed to send email via Resend" }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      from: fromAddress,
      to: toEmail
    });
  } catch (error: any) {
    console.error("Error processing email reply:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
