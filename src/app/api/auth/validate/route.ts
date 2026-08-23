import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateEmail, validateUsername, validatePasswordStrength } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { field, value } = body;

    if (!field || typeof value !== "string") {
      return NextResponse.json({ error: "Invalid validation request" }, { status: 400 });
    }

    const trimmedValue = value.trim();

    if (field === "username") {
      const sanitizedUsername = trimmedValue.toLowerCase();
      if (sanitizedUsername.length > 50) {
        return NextResponse.json({ valid: false, error: "Username must be 50 characters or less" });
      }
      if (!validateUsername(sanitizedUsername)) {
        return NextResponse.json({ valid: false, error: "Username must be between 3 and 50 characters and contain only alphanumeric characters, periods, or underscores" });
      }
      const existing = await db.query.users.findFirst({
        where: eq(users.username, sanitizedUsername),
      });
      if (existing) {
        return NextResponse.json({ valid: false, error: "Username is already taken" });
      }
      return NextResponse.json({ valid: true });
    }

    if (field === "email") {
      const sanitizedEmail = trimmedValue.toLowerCase();
      if (sanitizedEmail.length > 255) {
        return NextResponse.json({ valid: false, error: "Email must be 255 characters or less" });
      }
      if (!validateEmail(sanitizedEmail)) {
        return NextResponse.json({ valid: false, error: "Invalid email address format" });
      }

      // Disposable email domains block list
      const DISPOSABLE_EMAIL_DOMAINS = new Set([
        "mailinator.com", "yopmail.com", "tempmail.com", "guerrillamail.com",
        "sharklasers.com", "10minutemail.com", "trashmail.com", "getairmail.com",
        "dispostable.com", "generator.email", "temp-mail.org", "maildrop.cc",
        "tempmailaddress.com", "burnermail.io", "guerrillamailblock.com",
        "guerrillamail.net", "guerrillamail.org", "guerrillamail.biz",
        "guerrillamail.de", "pokemail.net", "grr.la"
      ]);
      const emailDomain = sanitizedEmail.split("@")[1];
      if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
        return NextResponse.json({ valid: false, error: "Disposable email addresses are not allowed" });
      }

      const existing = await db.query.users.findFirst({
        where: eq(users.email, sanitizedEmail),
      });
      if (existing) {
        return NextResponse.json({ valid: false, error: "Email is already registered" });
      }
      return NextResponse.json({ valid: true });
    }

    if (field === "phone") {
      if (!trimmedValue) {
        return NextResponse.json({ valid: true });
      }
      const cleanedPhone = trimmedValue.replace(/[\s\-\(\)]/g, "");
      const indianPhoneRegex = /^(?:\+?91)?[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(cleanedPhone)) {
        return NextResponse.json({ valid: false, error: "Invalid Indian mobile number. Must be a valid 10-digit number optionally prefixed with +91." });
      }
      const existing = await db.query.users.findFirst({
        where: eq(users.phone, cleanedPhone),
      });
      if (existing) {
        return NextResponse.json({ valid: false, error: "Mobile number is already registered" });
      }
      return NextResponse.json({ valid: true });
    }

    if (field === "socialHandle") {
      if (!trimmedValue) {
        return NextResponse.json({ valid: true });
      }
      if (trimmedValue.length > 255) {
        return NextResponse.json({ valid: false, error: "Social link must be 255 characters or less" });
      }
      const existing = await db.query.users.findFirst({
        where: eq(users.socialHandle, trimmedValue),
      });
      if (existing) {
        return NextResponse.json({ valid: false, error: "Social platform link/username is already registered" });
      }
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ error: "Unsupported validation field" }, { status: 400 });
  } catch (error) {
    console.error("Validation route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
