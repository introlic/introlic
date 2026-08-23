import { NextResponse } from "next/server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { getClientIp, checkMultipleRateLimits, getRateLimitHeaders, CONTACT_LIMIT_CONFIG } from "@/lib/rateLimit";
import { 
  sanitizeInput, 
  validateEmail, 
  validateDateOfBirth 
} from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      dobDay,
      dobMonth,
      dobYear,
      gender,
      state,
      subject,
      message,
      socialHandles,
    } = body;

    // Rate Limiting
    const ip = getClientIp(req);
    const checks = [
      { key: `CONTACT_IP:${ip}`, config: CONTACT_LIMIT_CONFIG }
    ];

    const rateLimitRes = checkMultipleRateLimits(checks);
    const headers = getRateLimitHeaders(rateLimitRes) as Record<string, string>;

    if (!rateLimitRes.allowed) {
      return NextResponse.json(
        { error: "Too many contact submissions. Please try again later." },
        { status: 429, headers }
      );
    }

    // 1. Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers });
    }

    // 2. Enforce strict character length limits before processing to prevent DB overflow or ReDoS
    if (name.length > 100) {
      return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400, headers });
    }
    if (email.length > 255) {
      return NextResponse.json({ error: "Email must be 255 characters or less" }, { status: 400, headers });
    }
    if (phone && phone.length > 20) {
      return NextResponse.json({ error: "Phone number must be 20 characters or less" }, { status: 400, headers });
    }
    if (state && state.length > 100) {
      return NextResponse.json({ error: "State must be 100 characters or less" }, { status: 400, headers });
    }
    if (subject.length > 100) {
      return NextResponse.json({ error: "Subject must be 100 characters or less" }, { status: 400, headers });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message must be 5000 characters or less" }, { status: 400, headers });
    }

    // 3. Format/Pattern validation using security helpers
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400, headers });
    }

    // Validate DOB if fully provided, otherwise ignore (make it null) to ensure it is completely optional and fault-tolerant
    const hasAllDob = dobDay && dobMonth && dobYear;
    const dateOfBirth = hasAllDob && validateDateOfBirth(dobDay, dobMonth, dobYear)
      ? `${dobYear}-${dobMonth}-${dobDay.padStart(2, '0')}`
      : null;

    // Validate and standardize gender
    let validatedGender = "PREFER_NOT_TO_SAY";
    if (gender) {
      const g = gender.trim().toUpperCase().replace(/-/g, '_');
      if (["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"].includes(g)) {
        validatedGender = g;
      } else if (g === "OTHER" || g === "PREFER_NOT") {
        validatedGender = "PREFER_NOT_TO_SAY";
      } else if (gender.length <= 50) {
        validatedGender = gender;
      } else {
        return NextResponse.json({ error: "Invalid gender selection" }, { status: 400, headers });
      }
    }

    // 4. Sanitize inputs to prevent SQL / XSS vulnerabilities
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedState = state ? sanitizeInput(state) : null;
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);
    
    // Sanitize socialHandles if provided
    let sanitizedSocialHandles: Record<string, string> | null = null;
    if (socialHandles && typeof socialHandles === "object") {
      sanitizedSocialHandles = {};
      for (const [key, val] of Object.entries(socialHandles)) {
        if (typeof val === "string" && key.length < 50 && val.length < 255) {
          sanitizedSocialHandles[sanitizeInput(key)] = sanitizeInput(val);
        }
      }
    }

    // 5. Insert contact message
    const [newContact] = await db.insert(contacts).values({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      dateOfBirth,
      gender: validatedGender,
      state: sanitizedState,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      socialHandles: sanitizedSocialHandles,
    }).returning({ id: contacts.id });

    return NextResponse.json({ message: "Contact request submitted successfully", contactId: newContact.id }, { status: 201, headers });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing contact ID" }, { status: 400 });
    }

    await db.delete(contacts).where(eq(contacts.id, id));

    return NextResponse.json({ message: "Contact communication deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

